#!/usr/bin/env node
/**
 * Tempus MCP CLI — Entry point for running the MCP server via stdio.
 * 
 * Usage:
 *   TOGGL_API_TOKEN=<token> tempus-mcp
 *   TOGGL_API_TOKEN=<token> npx tempus-mcp
 * 
 * Environment variables:
 *   TOGGL_API_TOKEN   - Required. Your Toggl Track API token.
 *   TOGGL_DEFAULT_WORKSPACE_ID - Optional. Default workspace ID.
 *   TOGGL_BASE_URL    - Optional. API base URL (default: https://api.track.toggl.com/api/v9).
 */
import { runServer } from './index.js';

runServer().catch((error) => {
  console.error('[tempus-mcp] Fatal error:', error);
  process.exit(1);
});
