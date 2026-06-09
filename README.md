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

**Opencode / other MCP clients (recommended):**
If your MCP client does not reliably pass environment variables through `npx`, pass the token directly via CLI arguments:
```json
{
  "mcpServers": {
    "tempus": {
      "command": ["npx", "-y", "tempus-mcp", "--token", "your_token_here", "--workspace-id", "12345678"]
    }
  }
}
```

**Other MCP clients:**
The server uses stdio transport, compatible with any MCP client.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOGGL_API_TOKEN` | ✅ | Your Toggl Track API token |
| `TOGGL_DEFAULT_WORKSPACE_ID` | ❌ | Default workspace ID for convenience |
| `TOGGL_BASE_URL` | ❌ | API base URL (default: `https://api.track.toggl.com/api/v9`) |

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
