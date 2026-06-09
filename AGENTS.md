=== AGENTS.md ===
 
# Tempus MCP
 
MCP server for Toggl Track time tracking.
 
## Directory Structure
  package.json
  .gitignore
  README.md
  AGENTS.md
  package-lock.json
  vitest.config.ts
  tsconfig.json
  LICENSE
  tests/
    cli.test.ts
    toggl-client.test.ts
    config.test.ts
  .github/
    workflows/
      test.yml
      publish.yml
  src/
    toggl-client.ts
    config.ts
    index.ts
    types.ts
    cli.ts
    tools/
      workspaces.ts
      time-entries.ts
      projects.ts
    transports/
 
## Commands
- Build: `npm run build`
- Test: `TOGGL_API_TOKEN=test npx vitest run`
- Run: `TOGGL_API_TOKEN=<token> npm start`
- Lint: `npm run lint`
 
## Env
- TOGGL_API_TOKEN / --token: Required (token or CLI arg)
- TOGGL_BASE_URL / --base-url: Optional (default: https://api.track.toggl.com/api/v9)
- TOGGL_DEFAULT_WORKSPACE_ID / --workspace-id: Optional

## CLI Args (alternative to env vars)
- --token <value>: Sets TOGGL_API_TOKEN (does not override existing env var)
- --workspace-id <value>: Sets TOGGL_DEFAULT_WORKSPACE_ID
- --base-url <value>: Sets TOGGL_BASE_URL
