# Tools and Integrations

## CLI Reference
Run `claude --help` for the full command list.
- **`claude login`**: Authenticate your CLI session.
- **`claude config`**: View and edit global settings.
- **`claude info`**: Check your version and installation status.

## Tool Behaviors
Claude uses specialized tools to interact with your environment.
- **Bash**: Runs non-interactive shell commands.
- **Write**: Creates or overwrites files.
- **Edit**: Surgically modifies parts of a file.
- **Read**: Retrieves file content or directory listings.
- **WebFetch**: Fetches and parses content from URLs.
- **WebSearch**: Searches the web for information.
- **Agent**: Spawns sub-agents for specialized tasks.

## Model Context Protocol (MCP)
Extend Claude's toolset with external services.
- **Installation**: Use `/mcp` to add, list, or remove servers.
- **Scope**: Local, project, or user-level MCP servers.
- **Capabilities**: Connect to databases, search engines, or other APIs.
- **Example**: `claude mcp add postgres` to query a local database.

## IDE Integrations
- **VS Code Extension**: Access Claude Code features from the sidebar.
- **JetBrains Plugin**: Use Claude Code features in IntelliJ, WebStorm, or PyCharm.
- **Terminal Mode**: Switch between interactive mode and CLI flags within your IDE.

## CI/CD and Automation
- **GitHub Actions**: Automate code reviews, bug fixes, or documentation.
- **GitLab CI/CD**: Run Claude Code as part of your GitLab workflows.
- **Headless Mode**: Use `--headless` to run Claude as a unix-style utility in scripts.
