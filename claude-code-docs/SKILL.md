---
name: claude-code-docs
description: Comprehensive documentation and guide for Claude Code. Use when the user asks about Claude Code features, commands, configuration, memory (CLAUDE.md), sub-agents, skills, hooks, or troubleshooting.
---

# Claude Code Documentation

Claude Code is an agentic CLI tool that helps you understand, write, and maintain codebases. It operates in an agentic loop, using tools to interact with your environment.

## Quick Reference

- **Install (macOS/Linux/WSL)**: `curl -fsSL https://claude.ai/install.sh | bash`
- **Install (Windows PowerShell)**: `irm https://claude.ai/install.ps1 | iex`
- **Login**: `claude` or `/login`
- **Start Session**: `claude` (in your project directory)
- **Help**: `/help` within a session

## Essential Commands

| Command | What it does |
| :--- | :--- |
| `claude` | Start interactive mode |
| `claude "task"` | Run a one-time task |
| `claude -p "query"` | Run one-off query, then exit |
| `claude -c` | Continue most recent conversation |
| `claude commit` | Create a Git commit |
| `/clear` | Clear conversation history |
| `/help` | Show available commands |
| `exit` | Exit Claude Code |
| `/memory`| View and edit what Claude has learned about the project. |
| `/undo`| Rewind to a previous checkpoint. |

## Core Topics

- **[Overview](references/overview.md)**: What is Claude Code?
- **[Setup & Configuration](references/setup_config.md)**: Installation, accounts, and settings.
- **[How Claude Code Works](references/how-claude-code-works.md)**: The agentic loop, tools, and session management.
- **[Built-in Commands](references/commands.md)**: Reference for all interactive commands.
- **[Common Workflows](references/common-workflows.md)**: Guides for bug fixing, refactoring, and testing.
- **[Memory and CLAUDE.md](references/memory.md)**: How Claude remembers your project.
- **[Permissions](references/permissions.md)**: Configuring permissions and security.
- **[Extending Claude Code](references/features-overview.md)**:
    - **[Skills](references/skills.md)**: Creating custom skills.
    - **[Hooks](references/hooks-guide.md)**: Automating workflows.
    - **[MCP](references/mcp.md)**: Connecting to external tools.
    - **[Sub-agents](references/sub-agents.md)**: Delegating to specialized agents.
    - **[Agent Teams](references/agent-teams.md)**: Working in parallel.
- **[Troubleshooting](references/troubleshooting.md)**: Solutions for common issues.
