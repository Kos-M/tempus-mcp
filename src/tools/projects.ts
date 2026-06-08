/**
 * MCP tools for Toggl Track projects.
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TogglClient } from '../toggl-client.js';

const ListProjectsSchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
});

const GetProjectSchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
  project_id: z.number().describe('Numeric project ID'),
});

const CreateProjectSchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
  name: z.string().describe('Project name'),
  client_id: z.number().optional().describe('Client ID to associate'),
  is_private: z.boolean().optional().describe('Whether the project is private'),
  billable: z.boolean().optional().describe('Whether entries are billable by default'),
  color: z.string().optional().describe('Project color hex code'),
});

export function registerProjectTools(server: McpServer, client: TogglClient): void {
  server.tool(
    'toggl_list_projects',
    'List all projects in a workspace.',
    ListProjectsSchema.shape,
    async (params) => {
      try {
        const projects = await client.getProjects(params.workspace_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }],
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
    'toggl_get_project',
    'Get a single project by ID.',
    GetProjectSchema.shape,
    async (params) => {
      try {
        const project = await client.getProject(params.workspace_id, params.project_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(project, null, 2) }],
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
    'toggl_create_project',
    'Create a new project in a workspace.',
    CreateProjectSchema.shape,
    async (params) => {
      try {
        const { workspace_id, ...projectData } = params;
        const project = await client.createProject(workspace_id, projectData);
        return {
          content: [{ type: 'text', text: JSON.stringify(project, null, 2) }],
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
