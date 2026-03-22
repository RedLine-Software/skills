# Extend Claude with skills

Skills are packages of specialized knowledge that you can teach Claude. They can be invoked automatically by Claude when relevant, or manually by you using slash commands.

## Creating a Skill
A skill is a Markdown file (`.md`) with a YAML frontmatter. You can store skills at the project level (`.claude/skills/<skill-name>/SKILL.md`) or the global level (`~/.claude/skills/<skill-name>/SKILL.md`).

### Example SKILL.md
```markdown
---
description: "Review code for security and database performance."
argument-hint: "[file or folder name]"
disable-model-invocation: true
---

# Instructions

You are a senior security auditor. Your job is to perform a code review.

1. Read the file specified in $ARGUMENTS.
2. Check for SQL injection and XSS vulnerabilities.
3. If the file has been recently updated, use the output of `!git diff HEAD` in your analysis.
```

## Marketplace
You can discover and install pre-built skills from the community through the plugin marketplace.
- **Search**: `/plugin search <query>`
- **Install**: `/plugin install <plugin-name>`
- **List new commands**: `/skills`
