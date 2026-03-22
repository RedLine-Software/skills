# Connect Claude Code to tools via MCP

The Model Context Protocol (MCP) is an open standard that allows Claude Code to securely connect to external data sources and tools.

## Managing MCP Servers
You can manage MCP connections using the `claude mcp` command.
- **`claude mcp list`**: List currently connected servers.
- **`claude mcp add <name> -- <command>`**: Add a new local server.
- **`claude mcp remove <name>`**: Remove a server.

## Scopes
You can specify a scope when adding a server to control its availability:
- **`local`** (default): Available only in the current session.
- **`--scope project`**: Available in this project for all users. Saved to `.mcp.json`.
- **`--scope user`**: Available in all your projects. Saved to `~/.claude.json`.

## Example: Connecting to a Database
```bash
claude mcp add mydb --scope project --env PGPASSWORD=... -- npx -y @modelcontextprotocol/server-pg
```
This command adds a PostgreSQL server named `mydb` to the current project, passing the password as an environment variable. Claude can then use this connection to query the database schema and data.
