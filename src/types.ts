/**
 * Toggl Track API types used by Tempus MCP.
 */

export interface TogglTimeEntry {
  id: number;
  workspace_id: number;
  project_id: number | null;
  task_id: number | null;
  billable: boolean;
  start: string;
  stop: string | null;
  duration: number;
  description: string;
  tags: string[];
  tag_ids: number[];
  duronly: boolean;
  at: string;
  server_deleted_at: string | null;
  user_id: number;
  uid: number;
  wid: number;
  permissions: Record<string, boolean>;
}

export interface TogglProject {
  id: number;
  workspace_id: number;
  client_id: number | null;
  name: string;
  color: string;
  is_private: boolean;
  active: boolean;
  at: string;
  created_at: string;
  server_deleted_at: string | null;
  billable: boolean | null;
  rate: number | null;
  currency: string | null;
}

export interface TogglWorkspace {
  id: number;
  organization_id: number;
  name: string;
  premium: boolean;
  admin: boolean;
  logo_url: string;
  business_ws: boolean;
  role: string;
}

export interface TogglClient {
  id: number;
  workspace_id: number;
  name: string;
  at: string;
  notes: string | null;
  server_deleted_at: string | null;
  archived_at: string | null;
}

export interface TimeEntryInput {
  description?: string;
  project_id?: number | null;
  task_id?: number | null;
  billable?: boolean;
  tags?: string[];
  start: string;
  stop?: string;
  duration?: number;
  created_with?: string;
  /** Workspace ID — required by the Toggl API v9 for time entry creation */
  wid?: number;
}
