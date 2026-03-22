# Configure permissions

Claude Code includes a robust permission system to ensure you have full control over its actions.

## Permission Modes
- **Restricted**: Maximum oversight for every action.
- **Productive**: Optimized for speed with balanced prompts.
- **Autonomous**: Highest freedom (use with caution).

## Auto-Approve
You can allowlist certain tools to run without prompting. This is configured in `.claude/settings.json`.
```json
{
  "allowedTools": ["Read", "Grep", "Glob", "Bash(npm test)"]
}
```
**Recommendation**: Only auto-approve read-only commands or safe commands like running tests.

## YOLO Mode
The `--dangerously-skip-permissions` flag disables all permission prompts.
**Use cases**:
- CI/CD pipelines
- Isolated environments like Docker containers

**Critical Risks**:
- **Do not use in your machine's root directory.**
- **Beware of prompt injection** from untrusted sources.

## Sandboxing
Enable sandboxing to isolate Claude's filesystem and network access. When enabled, shell commands run by Claude cannot access files outside the project directory or connect to the internet.
