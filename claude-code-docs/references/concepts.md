# Claude Code Core Concepts

## The Agentic Loop
Claude Code operates in a continuous loop:
1.  **Analyze**: Claude assesses the current state of the workspace.
2.  **Plan**: It proposes a sequence of actions.
3.  **Act**: It executes tools (Bash, Write, Read, Grep, etc.).
4.  **Verify**: It checks the outcome of the actions.
5.  **Refine**: If the outcome isn't correct, it repeats the process.

## Access and Environment
- **Filesystem**: Claude can read and edit files within the project root and its subdirectories.
- **Tools**: It can run bash commands, fetch web content, and search the codebase.
- **Sandboxing**: Claude can run in a sandboxed environment to isolate filesystem and network access for safety.
- **Checkpoints**: Claude automatically creates checkpoints before making significant changes, allowing you to use `/undo` if needed.

## Session Management
- **Persistence**: Sessions can be resumed, forked, or named for easy reference.
- **Branches**: Claude can work across different git branches within the same session.
- **Compaction**: When the context window fills up, Claude automatically "compacts" its history to summarize past events and free up space.

## Project Memory (CLAUDE.md)
Claude uses `CLAUDE.md` to store project-specific information:
- **Project Overview**: What the project does.
- **Conventions**: Coding style, naming, and architecture.
- **Common Commands**: How to build, test, and run the project.
- **Organization**: Rules can be split into `.claude/rules/` for path-specific guidance.

Use `CLAUDE.md` to ensure Claude remains consistent with your project's standards.
