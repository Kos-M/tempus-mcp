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
- TOGGL_API_TOKEN: Required (or pass via --token CLI arg)
- TOGGL_BASE_URL: Optional (default: https://api.track.toggl.com/api/v9) (or pass via --base-url CLI arg)
- TOGGL_DEFAULT_WORKSPACE_ID: Optional (or pass via --workspace-id CLI arg)

## CLI Args (alternative to env vars)
- --token <token>: Equivalent to TOGGL_API_TOKEN (does not override existing env var)
- --workspace-id <id>: Equivalent to TOGGL_DEFAULT_WORKSPACE_ID
- --base-url <url>: Equivalent to TOGGL_BASE_URL
