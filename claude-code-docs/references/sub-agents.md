# Create custom subagents

Subagents are specialized instances of Claude Code that run in the background. They have their own context, persona, and tool permissions, making them ideal for offloading specialized tasks.

## Creating a Subagent
You can create a subagent by adding a Markdown file to `.claude/agents/<agent-name>.md`.

### Example: Security Reviewer
```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities before commit.
tools: [Read, Glob, Grep] # Read-only access
model: claude-sonnet-4-6
---

You are a senior security auditor.
Analyze the provided code for vulnerabilities like SQL injection and XSS.
Report your findings back to the main agent.
```

## Invoking a Subagent
You can invoke a subagent from your main session:
```
> Use the security-reviewer agent to check for vulnerabilities in the latest changes.
```
Claude will delegate the task to the subagent. The subagent will perform its analysis in an isolated context and return only a summary of its findings, keeping your main context clean.
