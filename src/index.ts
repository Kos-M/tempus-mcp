/**
 * Tempus MCP Server — Toggl Track integration.
 *
 * An MCP server that provides tools for managing Toggl Track time entries,
 * projects, workspaces, and clients.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TogglClient } from './toggl-client.js';
import { loadConfig } from './config.js';
import { registerTimeEntryTools } from './tools/time-entries.js';
import { registerProjectTools } from './tools/projects.js';
import { registerWorkspaceTools } from './tools/workspaces.js';

export { TogglClient } from './toggl-client.js';
export { loadConfig } from './config.js';

export function createServer(togglClient?: TogglClient): McpServer {
  const server = new McpServer({
    name: 'tempus-mcp',
    version: '0.1.0',
    description: 'Toggl Track MCP server - time entries, projects, workspaces',
  });

  const client = togglClient ?? new TogglClient();

  // Register all tool groups
  registerTimeEntryTools(server, client);
  registerProjectTools(server, client);
  registerWorkspaceTools(server, client);

  return server;
}

export async function runServer(): Promise<void> {
  // Validate config on startup
  loadConfig();

  const server = createServer();
  const transport = new StdioServerTransport();

  console.error('[tempus-mcp] Starting Tempus MCP server...');
  await server.connect(transport);
  console.error('[tempus-mcp] Server connected via stdio');
}

// Allow running directly
if (process.argv[1] && (process.argv[1].endsWith('index.js') || process.argv[1].endsWith('index.ts'))) {
  runServer().catch((err) => {
    console.error('[tempus-mcp] Fatal error:', err);
    process.exit(1);
  });
}
