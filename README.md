# Tempus MCP ⏱️

> **Tempus** (Latin for "time") — An MCP server for Toggl Track.

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides AI assistants with full access to your Toggl Track time tracking data. Create time entries for past dates, manage projects, query workspaces, and more — all through natural language.

## Tools

### Time Entries
| Tool | Description |
|------|-------------|
| `toggl_list_time_entries` | List time entries with optional date filtering |
| `toggl_get_current_time_entry` | Get the currently running time entry |
| `toggl_create_time_entry` | **Create time entries for any date (past or future)** with project assignment, tags, and billable status |
| `toggl_update_time_entry` | Update existing time entries (description, project, start/stop, duration) |
| `toggl_delete_time_entry` | Permanently delete a time entry |
| `toggl_stop_time_entry` | Stop a running time entry |

### Projects
| Tool | Description |
|------|-------------|
| `toggl_list_projects` | List all projects in a workspace |
| `toggl_get_project` | Get a single project by ID |
| `toggl_create_project` | Create a new project |

### Workspaces & User
| Tool | Description |
|------|-------------|
| `toggl_list_workspaces` | List all accessible workspaces |
| `toggl_get_workspace` | Get workspace details |
| `toggl_get_me` | Get authenticated user profile |
| `toggl_list_clients` | List clients in a workspace |

## Installation

```bash
npm install -g tempus-mcp
# or
npx tempus-mcp
```

## Usage

### 1. Get your Toggl API Token
Go to [https://track.toggl.com/profile](https://track.toggl.com/profile) and copy your API token.

### 2. Run the MCP server

```bash
export TOGGL_API_TOKEN="your_token_here"
tempus-mcp
```

### 3. Configure your MCP client

**Claude Desktop:**
```json
{
  "mcpServers": {
    "tempus": {
      "command": "tempus-mcp",
      "env": {
        "TOGGL_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

**Opencode (recommended — CLI args):**
If your MCP client does not reliably pass environment variables through `npx`, pass the token directly via CLI arguments. This is the **recommended approach** for Opencode:

```json
{
  "mcp": {
    "tempus": {
      "type": "local",
      "enabled": true,
      "command": ["npx", "-y", "tempus-mcp", "--token", "your_token_here", "--workspace-id", "12345678"]
    }
  }
}
```

**Opencode (alternative — env vars):**
If your Opencode setup does pass environment variables reliably, you can use the env block:

```json
{
  "mcp": {
    "tempus": {
      "type": "local",
      "enabled": true,
      "command": ["npx", "-y", "tempus-mcp"],
      "env": {
        "TOGGL_API_TOKEN": "your_token_here",
        "TOGGL_DEFAULT_WORKSPACE_ID": "12345678"
      }
    }
  }
}
```

> **Troubleshooting:** If tempus-mcp fails to start with the env approach, switch to the CLI args approach (`--token`). This is a known issue with some MCP clients — the `env` block may not be reliably forwarded through `npx` to the child process. The `--token` argument bypasses this entirely.

**Other MCP clients:**
The server uses stdio transport, compatible with any MCP client. For standard configs use:
- **Global install:** `"command": "tempus-mcp"` with `"env"` block
- **npx (env):** `"command": ["npx", "-y", "tempus-mcp"]` with `"env"` block  
- **npx (CLI args):** `"command": ["npx", "-y", "tempus-mcp", "--token", "..."]`

## Troubleshooting

### "TOGGL_API_TOKEN environment variable is required" error
The server cannot find your Toggl API token. This happens when:
1. **Env vars not passed through npx** — Some MCP clients don't forward the `env` block to `npx`-spawned processes. **Fix:** Use the `--token` CLI argument instead (see Opencode config above).
2. **Token not set at all** — Ensure you've added your token. Get it from [https://track.toggl.com/profile](https://track.toggl.com/profile).

### Server starts but tools return auth errors
Your Toggl API token is invalid or expired. Verify your token at [https://track.toggl.com/profile](https://track.toggl.com/profile) and generate a new one if needed.

### "Workspace not found" when using tools
You may need to specify the correct workspace ID. Use `toggl_list_workspaces` to find your workspace IDs, then pass the correct one to tools or set `TOGGL_DEFAULT_WORKSPACE_ID`.

## Environment Variables

| Variable / CLI Arg | Required | Description |
|-------------------|----------|-------------|
| `TOGGL_API_TOKEN` / `--token` | ✅ | Your Toggl Track API token |
| `TOGGL_DEFAULT_WORKSPACE_ID` / `--workspace-id` | ❌ | Default workspace ID for convenience |
| `TOGGL_BASE_URL` / `--base-url` | ❌ | API base URL (default: `https://api.track.toggl.com/api/v9`) |

## Features

- ✅ **Past date time slots** — Create time entries for any date in the past
- ✅ **Project assignment** — Assign entries to any project
- ✅ **Full CRUD** — Create, read, update, delete time entries
- ✅ **Billable tracking** — Mark entries as billable
- ✅ **Tag support** — Add tags to time entries
- ✅ **Running entries** — Start, stop, and query current timer

## Development

```bash
git clone https://github.com/Kos-M/tempus-mcp.git
cd tempus-mcp
npm install
npm run build
TOGGL_API_TOKEN=your_token npm start
```

## License

MIT
