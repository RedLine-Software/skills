# Common Claude Code Workflows

## Plan Mode (`--plan`)
Use Plan Mode to analyze complex changes without executing them.
- **Why**: Safely explore large refactors or architectural changes.
- **How**: Start with `claude --plan` or toggle it within a session.
- **Verify**: Claude creates a plan you can review before starting work.

## Understanding New Codebases
1.  **Overview**: Ask "What does this project do?"
2.  **Architecture**: "Show me the project's folder structure and explain the key components."
3.  **Discovery**: "Find all files related to user authentication."

## Fixing Bugs Efficiently
1.  **Reproduce**: Give Claude a script or command to reproduce the bug.
2.  **Investigate**: Ask Claude to search for related logs or error messages.
3.  **Fix**: Once the cause is found, Claude will propose and apply the fix.
4.  **Verify**: Ask Claude to run the reproduction script to confirm the fix.

## Refactoring Code
- **Identify**: Ask "Identify opportunities to simplify this file."
- **Scope**: Define the scope of changes clearly.
- **Incremental**: Refactor in small, verifiable steps.
- **Tests**: Always ensure tests are run after each refactoring step.

## Parallel Sessions with Git Worktrees
Claude can run multiple sessions in parallel using git worktrees.
- **How**: Claude automatically manages worktrees if you start multiple sessions on different tasks.
- **Benefit**: Work on a bug fix while another session handles a new feature without file conflicts.
