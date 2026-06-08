/**
 * MCP tools for Toggl Track time entries.
 * Supports: create, read, update, delete, start, stop, list, search.
 * Special support for creating time slots for past dates.
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TogglClient } from '../toggl-client.js';

// Schema for time entry creation (handles past dates, project assignment)
const CreateTimeEntrySchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
  description: z.string().optional().describe('Time entry description'),
  project_id: z.number().nullable().optional().describe('Project ID to assign'),
  billable: z.boolean().optional().describe('Whether the entry is billable'),
  tags: z.array(z.string()).optional().describe('Tags for the entry'),
  start: z.string().describe('Start time in ISO 8601 format (e.g. 2026-06-08T07:00:00.000Z). Supports past dates.'),
  stop: z.string().optional().describe('Stop time in ISO 8601 format. Omit for a running entry.'),
  duration: z.number().optional().describe('Duration in seconds. If stop is provided, duration is calculated automatically.'),
});

const UpdateTimeEntrySchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
  time_entry_id: z.number().describe('Numeric time entry ID'),
  description: z.string().optional().describe('New description'),
  project_id: z.number().nullable().optional().describe('New project ID (null to unassign)'),
  billable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  start: z.string().optional().describe('New start time in ISO 8601 format'),
  stop: z.string().optional().describe('New stop time in ISO 8601 format'),
  duration: z.number().optional(),
});

const ListTimeEntriesSchema = z.object({
  since: z.string().optional().describe('UNIX timestamp - get entries modified since this date'),
  before: z.string().optional().describe('ISO date - get entries with start time before this'),
  start_date: z.string().optional().describe('ISO date - entries starting from this date'),
  end_date: z.string().optional().describe('ISO date - entries up to this date'),
});

const DeleteTimeEntrySchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
  time_entry_id: z.number().describe('Numeric time entry ID'),
});

const StopTimeEntrySchema = z.object({
  workspace_id: z.number().describe('Numeric workspace ID'),
  time_entry_id: z.number().describe('Numeric time entry ID'),
});

export function registerTimeEntryTools(server: McpServer, client: TogglClient): void {
  // List time entries
  server.tool(
    'toggl_list_time_entries',
    'List time entries with optional date filtering. Supports querying entries by date range.',
    ListTimeEntriesSchema.shape,
    async (params) => {
      try {
        const entries = await client.getTimeEntries(params);
        return {
          content: [{ type: 'text', text: JSON.stringify(entries, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  // Get current time entry
  server.tool(
    'toggl_get_current_time_entry',
    'Get the currently running time entry, if any.',
    async () => {
      try {
        const entry = await client.getCurrentTimeEntry();
        return {
          content: [{ type: 'text', text: entry ? JSON.stringify(entry, null, 2) : 'No running time entry.' }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  // Create time entry (supports past dates)
  server.tool(
    'toggl_create_time_entry',
    'Create a new time entry. Supports past dates - you can create time slots for any date in the past with an assigned project.',
    CreateTimeEntrySchema.shape,
    async (params) => {
      try {
        const { workspace_id, ...entryData } = params;
        const entry = await client.createTimeEntry(workspace_id, entryData);
        return {
          content: [{ type: 'text', text: JSON.stringify(entry, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  // Update time entry
  server.tool(
    'toggl_update_time_entry',
    'Update an existing time entry. You can modify the description, project assignment, start/stop times, etc.',
    UpdateTimeEntrySchema.shape,
    async (params) => {
      try {
        const { workspace_id, time_entry_id, ...entryData } = params;
        const entry = await client.updateTimeEntry(workspace_id, time_entry_id, entryData);
        return {
          content: [{ type: 'text', text: JSON.stringify(entry, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  // Delete time entry
  server.tool(
    'toggl_delete_time_entry',
    'Delete a time entry permanently.',
    DeleteTimeEntrySchema.shape,
    async (params) => {
      try {
        await client.deleteTimeEntry(params.workspace_id, params.time_entry_id);
        return {
          content: [{ type: 'text', text: `Time entry ${params.time_entry_id} deleted.` }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    },
  );

  // Stop time entry
  server.tool(
    'toggl_stop_time_entry',
    'Stop a running time entry.',
    StopTimeEntrySchema.shape,
    async (params) => {
      try {
        const entry = await client.stopTimeEntry(params.workspace_id, params.time_entry_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(entry, null, 2) }],
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
