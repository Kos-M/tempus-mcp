/**
 * Toggl Track API v9 client.
 * Covers: time entries, projects, workspaces, clients, tags.
 */
import { loadConfig, type TempusConfig } from './config.js';
import type {
  TogglTimeEntry,
  TogglProject,
  TogglWorkspace,
  TimeEntryInput,
} from './types.js';

export class TogglClient {
  private config: TempusConfig;
  private authHeader: string;

  constructor(config?: Partial<TempusConfig>) {
    this.config = { ...loadConfig(), ...config };
    this.authHeader = 'Basic ' + Buffer.from(`${this.config.togglApiToken}:api_token`).toString('base64');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: this.authHeader,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Toggl API error ${response.status}: ${errorText}`);
    }

    // Some endpoints return 200 with empty body
    const text = await response.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }

  // ============ Workspaces ============

  async getWorkspaces(): Promise<TogglWorkspace[]> {
    return this.request<TogglWorkspace[]>('GET', '/workspaces');
  }

  async getWorkspace(workspaceId: number): Promise<TogglWorkspace> {
    return this.request<TogglWorkspace>('GET', `/workspaces/${workspaceId}`);
  }

  // ============ Projects ============

  async getProjects(workspaceId: number): Promise<TogglProject[]> {
    return this.request<TogglProject[]>('GET', `/workspaces/${workspaceId}/projects`);
  }

  async getProject(workspaceId: number, projectId: number): Promise<TogglProject> {
    return this.request<TogglProject>('GET', `/workspaces/${workspaceId}/projects/${projectId}`);
  }

  async createProject(
    workspaceId: number,
    data: { name: string; client_id?: number; is_private?: boolean; billable?: boolean; color?: string },
  ): Promise<TogglProject> {
    return this.request<TogglProject>('POST', `/workspaces/${workspaceId}/projects`, data);
  }

  // ============ Time Entries ============

  async getTimeEntries(options?: {
    since?: string;
    before?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<TogglTimeEntry[]> {
    const params = new URLSearchParams();
    if (options?.since) params.set('since', options.since);
    if (options?.before) params.set('before', options.before);
    if (options?.start_date) params.set('start_date', options.start_date);
    if (options?.end_date) params.set('end_date', options.end_date);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<TogglTimeEntry[]>('GET', `/me/time_entries${query}`);
  }

  async getCurrentTimeEntry(): Promise<TogglTimeEntry | null> {
    return this.request<TogglTimeEntry | null>('GET', '/me/time_entries/current');
  }

  async createTimeEntry(
    workspaceId: number,
    data: TimeEntryInput,
  ): Promise<TogglTimeEntry> {
    return this.request<TogglTimeEntry>(
      'POST',
      `/workspaces/${workspaceId}/time_entries`,
      {
        ...data,
        wid: workspaceId,
        created_with: data.created_with || 'tempus-mcp',
      },
    );
  }

  async updateTimeEntry(
    workspaceId: number,
    timeEntryId: number,
    data: Partial<TimeEntryInput>,
  ): Promise<TogglTimeEntry> {
    return this.request<TogglTimeEntry>(
      'PUT',
      `/workspaces/${workspaceId}/time_entries/${timeEntryId}`,
      data,
    );
  }

  async deleteTimeEntry(
    workspaceId: number,
    timeEntryId: number,
  ): Promise<void> {
    await this.request<void>(
      'DELETE',
      `/workspaces/${workspaceId}/time_entries/${timeEntryId}`,
    );
  }

  async stopTimeEntry(
    workspaceId: number,
    timeEntryId: number,
  ): Promise<TogglTimeEntry> {
    return this.request<TogglTimeEntry>(
      'PATCH',
      `/workspaces/${workspaceId}/time_entries/${timeEntryId}/stop`,
    );
  }

  // ============ Clients ============

  async getClients(workspaceId: number): Promise<TogglClient[]> {
    return this.request<TogglClient[]>('GET', `/workspaces/${workspaceId}/clients`);
  }

  // ============ Me ============

  async getMe(): Promise<{
    id: number;
    email: string;
    fullname: string;
    default_workspace_id: number;
  }> {
    return this.request('GET', '/me');
  }
}
