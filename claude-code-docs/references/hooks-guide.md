# Automate workflows with hooks

Hooks are a powerful feature that let you automate quality gates and other repetitive tasks. They allow you to run shell commands automatically in response to certain events.

## Configuration
Hooks are configured in `.claude/settings.json` (project-level) or `~/.claude/settings.json` (global-level).

```json
{
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "Stop": [...]
  }
}
```

## Hook Types
- **`PreToolUse`**: Runs *before* a tool is used. Ideal for safety guardrails.
- **`PostToolUse`**: Runs *after* a tool is used. Ideal for auto-formatting or linting.
- **`Stop`**: Runs at the end of a turn. Ideal for running a full test suite.

## Example
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write {file}",
            "description": "Auto-format every modified file"
          }
        ]
      }
    ],
    "Stop": [
      {
        "type": "command",
        "command": "npm run lint && npx tsc --noEmit",
        "description": "Check lint and types before finishing"
      }
    ]
  }
}
```

## Blocking Hooks
If a hook command exits with code `2`, it will block the current action. This is useful for enforcing rules, like preventing a commit if tests fail.
