/**
 * MCP tools for Toggl Track workspaces and user info.
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TogglClient } from '../toggl-client.js';

const WithWorkspaceId = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
});

export function registerWorkspaceTools(server: McpServer, client: TogglClient): void {
  server.tool(
    'toggl_list_workspaces',
    'List all workspaces accessible to the user.',
    {},
    async () => {
      try {
        const workspaces = await client.getWorkspaces();
        return {
          content: [{ type: 'text', text: JSON.stringify(workspaces, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'toggl_get_workspace',
    'Get a single workspace by ID.',
    WithWorkspaceId.shape,
    async (params) => {
      try {
        const workspace = await client.getWorkspace(params.workspace_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(workspace, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'toggl_get_me',
    'Get the authenticated user profile, including default workspace ID.',
    {},
    async () => {
      try {
        const me = await client.getMe();
        return {
          content: [{ type: 'text', text: JSON.stringify(me, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'toggl_list_clients',
    'List all clients in a workspace.',
    WithWorkspaceId.shape,
    async (params) => {
      try {
        const clients = await client.getClients(params.workspace_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(clients, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );
}
