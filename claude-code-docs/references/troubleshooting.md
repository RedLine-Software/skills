# Troubleshooting

This guide provides solutions for common issues with Claude Code.

## Installation Issues
- **Permission Denied**: If you get a permission error during installation, ensure you are not using `sudo` if installing via a package manager that doesn't require it. If you are using the native installer, ensure you have write permissions to the installation directory.
- **Command not found**: If your shell can't find the `claude` command after installation, you may need to add the installation directory to your `PATH` environment variable.

## Connection Issues
- **Authentication Failed**: If you are having trouble logging in, try running `claude login` again. If you are using an API key, ensure the `ANTHROPIC_API_KEY` environment variable is set correctly.
- **Proxy Issues**: If you are behind a corporate proxy, you may need to configure the `HTTP_PROXY` and `HTTPS_PROXY` environment variables.

## General Issues
- **High Token Usage**: If you are experiencing high token usage, try using `/compact` to summarize the conversation history, or `/clear` to start a new, clean session.
- **Incorrect Behavior**: If Claude is not behaving as expected, use `/memory` to check what it has learned about your project. You may need to update your `CLAUDE.md` file to provide more specific instructions.
- **Run `/doctor`**: The `/doctor` command can help diagnose common configuration and environment issues.
