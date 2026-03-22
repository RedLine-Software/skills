# How Claude remembers your project

Claude Code uses two primary mechanisms to remember information about your project: **CLAUDE.md** files and **auto memory**.

## CLAUDE.md
`CLAUDE.md` is a special Markdown file that you can place in your project's root directory. It acts as a "project playbook" for Claude, providing it with essential context about your project.

### Key Sections
- **Build & Test Commands**: How to build, test, and run your project.
- **Project Style & Conventions**: Coding style, naming conventions, and architectural patterns.
- **Architecture Overview**: The overall structure of your project.
- **Important Constraints**: Things Claude should avoid doing.

## Auto Memory
Claude also maintains "auto memory" of its interactions. This includes:
- **Learnings**: Key facts about the project that Claude has discovered.
- **Session History**: A summary of the conversation and actions taken in the current session.

You can view and edit Claude's memory at any time using the `/memory` command.
