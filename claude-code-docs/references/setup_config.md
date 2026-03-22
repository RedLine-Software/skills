# Setup and Configuration

## Installation

Claude Code can be installed using one of the following methods based on your operating system:

### Native Install (Recommended)
- **macOS, Linux, WSL:**
  ```bash
  curl -fsSL https://claude.ai/install.sh | bash
  ```
- **Windows PowerShell:**
  ```powershell
  irm https://claude.ai/install.ps1 | iex
  ```
- **Windows CMD:**
  ```cmd
  curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
  ```
  *(Note: Windows requires Git for Windows installed first.)*

### Package Managers
- **Homebrew (macOS/Linux):**
  ```bash
  brew install --cask claude-code
  ```
- **WinGet (Windows):**
  ```powershell
  winget install Anthropic.ClaudeCode
  ```

- **Login**: Run `claude` (which will prompt to log in on first use) or `/login` to authenticate with your Anthropic account.
- **Update**: Claude automatically updates by default. You can manage this with `claude config`.

## Configuration Scopes
- **Global**: `~/.claude.json` for user-level settings.
- **Project**: `.claude.json` in the project root for project-specific overrides.
- **Environment**: Use environment variables for sensitive settings.

## Permissions and Security
Claude Code asks for permission before running tools:
- **Default**: Ask for all tools.
- **Allowlist**: Specify tools that can run without prompting (e.g., `bash`, `read`).
- **Denylist**: Explicitly block certain tools or path access.

### Permission Modes
- **Restricted**: Maximum oversight for every action.
- **Productive**: Optimized for speed with balanced prompts.
- **Autonomous**: Highest freedom (use with caution).

## Models
Claude Code supports different models:
- **Claude 3.5 Sonnet**: The default, recommended for most tasks.
- **Claude 3.5 Opus**: Best for complex reasoning and planning.
- **Claude 3.5 Haiku**: Fastest, best for simple tasks and quick checks.

Use `claude --model <model-id>` or configure it in your settings.

## Sandboxing
Enable sandboxing to isolate Claude's filesystem and network access:
- **Mode**: Choose between `isolated` (default) or `relaxed` if you need broader access.
- **Path Prefixes**: Grant subprocess write access to specific paths.
