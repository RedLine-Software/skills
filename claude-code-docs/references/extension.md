# Extending Claude Code

## Sub-Agents (`/agents`)
Sub-agents are specialized Claude instances designed for specific tasks.
- **Why**: Isolate high-volume operations or run parallel research.
- **How**: Start with `/agents` to list, create, or manage.
- **Scope**: Define sub-agents at project or user level.
- **Model**: Choose different models for sub-agents (e.g., Haiku for research).

## Agent Teams (`/teams`)
Run a team of Claude agents together on a single task.
- **Why**: Use competing hypotheses or run multiple code reviews simultaneously.
- **Approval**: Teammates may require your approval for their plans.
- **Display**: Toggle between summary or detailed view of team progress.

## Skills (`/skills`)
Skills extend Claude's capabilities with specialized knowledge or tools.
- **Why**: Add project-specific workflows or tool integrations.
- **Bundle**: Skills can include scripts, reference docs, and assets.
- **Trigger**: Claude automatically discovers and uses relevant skills based on their description.

## Hooks (`/hooks`)
Automate workflows at specific points in Claude's lifecycle.
- **Events**: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`.
- **Why**: Auto-format code, get notifications, or audit configuration changes.
- **Location**: Define hooks in `.claude/hooks/` or project settings.

## Plugins (`/plugin`)
Plugins bundle skills, hooks, and MCP servers into a single package.
- **Marketplace**: Install from official or community marketplaces.
- **Why**: Share complex configurations across teams and projects easily.
- **Debug**: Use `/plugin --debug` to troubleshoot plugin issues.
