/**
 * Configuration for Tempus MCP server.
 * Reads from environment variables with sensible defaults.
 */

export interface TempusConfig {
  /** Toggl Track API token (https://track.toggl.com/profile) */
  togglApiToken: string;
  /** Base URL for Toggl Track API v9 */
  baseUrl: string;
  /** Default workspace ID (optional, for convenience) */
  defaultWorkspaceId?: number;
}

export function loadConfig(): TempusConfig {
  const togglApiToken = process.env.TOGGL_API_TOKEN || process.env.TOGGL_TOKEN || '';
  if (!togglApiToken) {
    throw new Error(
      'TOGGL_API_TOKEN environment variable is required. ' +
      'Get your token from https://track.toggl.com/profile'
    );
  }

  const defaultWorkspaceId = process.env.TOGGL_DEFAULT_WORKSPACE_ID
    ? parseInt(process.env.TOGGL_DEFAULT_WORKSPACE_ID, 10)
    : undefined;

  return {
    togglApiToken,
    baseUrl: process.env.TOGGL_BASE_URL || 'https://api.track.toggl.com/api/v9',
    defaultWorkspaceId,
  };
}
