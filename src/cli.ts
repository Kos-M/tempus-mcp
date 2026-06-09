#!/usr/bin/env node
/**
 * Tempus MCP CLI — Entry point for running the MCP server via stdio.
 * 
 * Usage:
 *   tempus-mcp                                          # requires TOGGL_API_TOKEN env var
 *   tempus-mcp --token <token>                          # pass token via CLI arg
 *   tempus-mcp --token <token> --workspace-id <id>      # with optional workspace
 *   TOGGL_API_TOKEN=<token> npx tempus-mcp
 * 
 * Environment variables:
 *   TOGGL_API_TOKEN              - Required (unless --token is provided). Your Toggl Track API token.
 *   TOGGL_DEFAULT_WORKSPACE_ID   - Optional. Default workspace ID.
 *   TOGGL_BASE_URL               - Optional. API base URL (default: https://api.track.toggl.com/api/v9).
 * 
 * CLI arguments (alternative to env vars, useful when MCP clients don't pass env reliably):
 *   --token <token>              - Equivalent to TOGGL_API_TOKEN
 *   --workspace-id <id>          - Equivalent to TOGGL_DEFAULT_WORKSPACE_ID
 *   --base-url <url>             - Equivalent to TOGGL_BASE_URL
 */
import { runServer } from './index.js';

// Parse CLI arguments as fallback for env vars.
// This helps when MCP clients (like Opencode) may not pass env reliably through npx.
// Exported for testing.
export function parseArgs(argv: string[] = process.argv.slice(2)): void {
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--token':
        if (i + 1 < argv.length && !process.env.TOGGL_API_TOKEN) {
          process.env.TOGGL_API_TOKEN = argv[++i];
        }
        break;
      case '--workspace-id':
        if (i + 1 < argv.length && !process.env.TOGGL_DEFAULT_WORKSPACE_ID) {
          process.env.TOGGL_DEFAULT_WORKSPACE_ID = argv[++i];
        }
        break;
      case '--base-url':
        if (i + 1 < argv.length && !process.env.TOGGL_BASE_URL) {
          process.env.TOGGL_BASE_URL = argv[++i];
        }
        break;
    }
  }
}

parseArgs();

parseArgs();

runServer().catch((error) => {
  console.error('[tempus-mcp] Fatal error:', error);
  process.exit(1);
});
