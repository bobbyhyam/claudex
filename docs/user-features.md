# Claudex User Features

Claudex is a self-hosted, open-source Claude Code UI that runs AI agents in isolated sandbox environments. This document covers every user-facing feature the platform provides.

---

## Table of Contents

1. [Authentication & Accounts](#authentication--accounts)
2. [Chat Interface](#chat-interface)
3. [AI Models & Providers](#ai-models--providers)
4. [Thinking Mode](#thinking-mode)
5. [Permission & Plan Modes](#permission--plan-modes)
6. [Chat Management](#chat-management)
7. [Sandbox Environments](#sandbox-environments)
8. [Development Views](#development-views)
9. [File Attachments](#file-attachments)
10. [Secrets & Environment Variables](#secrets--environment-variables)
11. [Skills](#skills)
12. [Agents](#agents)
13. [Slash Commands](#slash-commands)
14. [MCP Servers](#mcp-servers)
15. [Custom Prompts & Instructions](#custom-prompts--instructions)
16. [Marketplace](#marketplace)
17. [Scheduled Tasks](#scheduled-tasks)
18. [Gmail Integration](#gmail-integration)
19. [Prompt Enhancement](#prompt-enhancement)
20. [Desktop App](#desktop-app)
21. [Admin Panel & API Docs](#admin-panel--api-docs)

---

## Authentication & Accounts

- **Registration** with email and password.
- **Email verification** flow (configurable; can be required or optional).
- **Login** with email/password using JWT-based authentication.
- **Forgot password / Reset password** via email token.
- **Session management** with refresh token rotation.
- **User profile** accessible via the top bar.

---

## Chat Interface

The chat page is the core of Claudex. It provides a conversational interface for interacting with AI agents that can execute code, browse the web, manage files, and more.

### Message Input

- Free-form text input that auto-resizes as you type.
- **Enter** sends the message; **Shift+Enter** inserts a newline.
- **Drag-and-drop** files directly into the input area.
- **Attachment button** (paperclip icon) to attach images, PDFs, and XLSX files.
- **Image annotation** — draw or mark up attached images before sending.
- **Prompt enhancement** — a sparkles button that rewrites your prompt to be more detailed and effective using AI.
- **Context usage indicator** in the top-right corner showing tokens used vs. the model's context window.

### @-Mentions

Type `@` in the input to get suggestions for:

- **Files** — reference project files from the sandbox (shown with a file icon).
- **Agents** — invoke a custom agent (shown with a robot icon).
- **Prompts** — apply a custom system prompt.

Arrow-key navigation and Enter to select from the suggestion panel.

### Model Selector

A dropdown grouped by provider (Anthropic, OpenAI, OpenRouter, Custom) that lets you switch models at any point in the conversation. Models from different providers share the same conversation history, so you can start with one model and switch to another without losing context.

### Message Display

- **Markdown rendering** with syntax-highlighted code blocks, tables, and lists.
- **Copy button** on each message for quick clipboard access.
- **Thinking blocks** — collapsible sections showing the AI's reasoning process (brain icon), with a preview of the first line and expandable full content.
- **Tool result cards** — 15+ tool types rendered with dedicated UI components:
  - Bash command output
  - File read/write/edit results
  - Glob and Grep search results
  - Web search results
  - Web fetch results
  - MCP tool invocations
  - Notebook edits
  - Task/TodoWrite results
  - Permission requests
- **Prompt suggestions** — after the AI responds, follow-up prompt suggestions are displayed as clickable chips.
- **Timestamps** — relative time (e.g., "2 minutes ago") with full timestamp on hover.
- **Model attribution** — shows which model generated each response (can be toggled off in settings).

### Message Actions

Each assistant message has a context menu with:

- **Copy** — copy the message content.
- **Fork** — create a new chat branching from this message's checkpoint.
- **Restore checkpoint** — roll the conversation and sandbox state back to this point (with confirmation dialog).

---

## AI Models & Providers

Claudex supports multiple AI providers. All providers use Claude Code under the hood; non-Anthropic providers go through [Anthropic Bridge](https://github.com/Mng-dev-ai/anthropic-bridge), which translates API calls.

### Supported Providers

| Provider | Auth Method | Example Models |
|----------|-------------|----------------|
| **Anthropic** | OAuth token from `claude setup-token` | Sonnet 4.5, Opus 4.5, Haiku 4.5 |
| **OpenAI** | Auth file from `codex login` | GPT-5.2 Codex, GPT-5.2 |
| **OpenRouter** | API key | Multiple providers |
| **Custom** | API key + base URL | Any Anthropic-compatible endpoint (GLM, Kimi, MiniMax, Deepseek, etc.) |

### Provider Configuration (Settings → Providers)

- Add, edit, and delete provider configurations.
- Each provider has: name, type, base URL (for custom), auth token, and a list of models.
- Individual models can be enabled or disabled.
- Providers can be toggled on/off with a single switch.

Because all providers share the same session context, you can develop a feature with Claude, then switch to GPT-5.2 Codex for review — it already has the full context without re-reading files.

---

## Thinking Mode

Controls how much internal reasoning the AI performs before responding. Accessible via a brain icon in the input bar.

| Level | Budget |
|-------|--------|
| Off | No thinking |
| Low | 4,000 tokens |
| Medium | 10,000 tokens |
| High | 15,000 tokens |
| Ultra | 32,000 tokens |

Thinking blocks stream to the UI in real time and are displayed as collapsible sections on the message.

---

## Permission & Plan Modes

Controls how much autonomy the AI agent has when executing tools. Accessible via a shield icon in the input bar.

| Mode | Behavior |
|------|----------|
| **Auto** | The agent runs tools automatically without asking. |
| **Ask** | The agent requests explicit approval before every tool execution. A permission dialog appears in the chat. |
| **Plan** | The agent enters planning mode: it proposes a sequence of steps for review before executing them. Once you approve, it switches to auto execution. |

When in **Ask** mode, each tool use triggers a permission request card in the chat with Approve/Deny buttons.

---

## Chat Management

### Sidebar

- **Chat list** with infinite scroll pagination.
- **Pinned chats** appear in a separate section at the top.
- **Search** — filter chats by title using **Cmd/Ctrl+K**.
- **Per-chat dropdown menu**:
  - **Pin / Unpin** — toggle pin status for quick access.
  - **Rename** — edit the chat title inline.
  - **Delete** — remove the chat (with confirmation).
- **Delete all chats** — available in Settings → General.

### Forking

Fork a chat from any assistant message to create a new conversation that branches from that point. The sandbox state is cloned (Docker provider creates a new image via commit), so the forked chat has an identical file system.

### Checkpoint Restoration

Each assistant message creates an automatic checkpoint of the sandbox state. You can restore to any previous checkpoint, rolling back both the conversation and the sandbox file system. Checkpoints use incremental hard-linked backups for space efficiency (max 10 per sandbox; oldest are pruned).

### Message Queueing

If the AI is currently streaming a response, you can queue additional messages. They are sent automatically once the current response completes.

---

## Sandbox Environments

Every chat session runs inside an isolated sandbox. Three providers are available:

### Docker (Local)

- Runs containers on your local machine.
- Port forwarding for dev servers (preview URLs at `localhost:mapped_port` or via Traefik HTTPS subdomains).
- Full PTY terminal with tmux session persistence.
- VS Code IDE on port 8765, VNC on port 6080.
- Sandbox cloning for chat forking (via Docker image commit).
- No external dependencies beyond Docker itself.

### E2B (Cloud)

- Cloud sandboxes via [e2b.dev](https://e2b.dev).
- Auto-pause after inactivity timeout; auto-resume on reconnect.
- Built-in IDE and VNC via E2B subdomains.
- Preview URLs at `https://{port}-{sandbox_id}.e2b.dev`.
- Requires an E2B API key (configured in Settings → General).

### Modal (Cloud)

- Serverless cloud compute via [modal.com](https://modal.com).
- 2 CPU, 4 GB RAM allocation.
- Dynamic port tunneling for preview URLs.
- Auto-resume on reconnect.
- Requires a Modal API key (configured in Settings → General).

### Common Capabilities (All Providers)

- Command execution with configurable timeout.
- File read/write/list operations.
- Checkpoint creation and restoration.
- Secret/environment variable injection.
- Listening-port discovery for preview links.
- PTY sessions with tmux persistence.

---

## Development Views

The left activity bar provides access to multiple views. **Shift+click** any view icon to open it as a secondary split panel alongside the chat.

### Agent (Chat)

The default conversational view described above.

### IDE

Full VS Code (OpenVSCode Server) embedded in the browser with:
- File explorer, editor tabs, extensions.
- Download entire project as a ZIP file.
- Open in a new browser tab.
- Theme synced with Claudex (light/dark).

### Editor

A lighter file browser and code viewer:
- Hierarchical file tree with expand/collapse.
- File search/filter.
- Syntax-highlighted code preview with line numbers.

### Terminal

Bash terminal with full PTY support:
- Multiple terminal tabs.
- Real-time output streaming.
- Copy/paste support.
- tmux-backed session persistence across reconnects.

### Web Preview

Live preview of web applications running inside the sandbox:
- Port selector dropdown to choose which dev server to preview.
- Refresh button.
- Shows a "no open ports" message when no server is running.

### Mobile Preview

Same as web preview but rendered inside a mobile device frame for responsive design testing.

### Browser (VNC)

A full desktop browser running inside the sandbox, accessible via VNC:
- URL bar to navigate.
- Start/stop browser controls.
- Defaults to google.com.
- Pairs with Playwright MCP + Chrome DevTools Protocol for AI-driven browser automation.

### Secrets

Environment variable manager for the sandbox (also accessible in its own view):
- Add, edit, and delete key-value pairs.
- Show/hide values (eye toggle).
- Color coding: green for new, amber for modified.
- Save and refresh buttons.

---

## File Attachments

- Attach **images** (JPG, PNG, GIF, etc.), **PDFs**, and **XLSX** files to chat messages.
- Drag-and-drop or use the paperclip button.
- Attached images can be annotated/drawn on before sending.
- Attachments are stored per-sandbox and linked to messages.
- Preview and download links available for each attachment.
- Per-file upload progress bars displayed during upload.

---

## Secrets & Environment Variables

Two levels of environment variable management:

### Sandbox Secrets (per chat/sandbox)

Managed from the Secrets view in the activity bar. Variables are injected into the sandbox's `.bashrc` and are available to all commands and dev servers.

### Global Environment Variables (Settings → Environment Variables)

Custom environment variables that apply across all sandboxes. Each can be individually enabled or disabled.

---

## Skills

**Settings → Skills** (max 10 per user)

Skills are reusable capability packages uploaded as ZIP files. Each ZIP must contain a `SKILL.md` file with YAML frontmatter defining `name` and `description`, plus any supporting files.

- Upload ZIP packages (max 100 MB).
- Enable/disable individual skills.
- View skill name, description, file count, and size.
- Delete skills.

When enabled, skills are made available to the AI agent as part of its tool set.

---

## Agents

**Settings → Agents** (max 10 per user)

Custom AI agents are Markdown files with YAML frontmatter defining behavior and constraints.

**Frontmatter fields:**
- `name` — agent identifier.
- `description` — what the agent does.
- `model` — optional model override: `"sonnet"`, `"opus"`, `"haiku"`, or `"inherit"`.
- `allowed_tools` — optional list restricting which tools the agent can use.

The Markdown body serves as the agent's system prompt. Invoke agents by typing `@agent-name` in the chat input.

- Upload `.md` files.
- Enable/disable individual agents.
- Edit agent content inline.
- Delete agents.

---

## Slash Commands

**Settings → Commands** (max 10 per user)

Custom slash commands are Markdown files with YAML frontmatter. They act as reusable prompt templates triggered with a `/` prefix.

**Frontmatter fields:**
- `name` — command name (used as `/name`).
- `description` — shown in the suggestion dropdown.
- `argument_hint` — placeholder text like `<pr-number> [priority]`.
- `allowed_tools` — optional tool restrictions.
- `model` — optional model override.

**Built-in commands:**
- `/context` — show current session token usage.
- `/compact` — compact the session to reclaim context.
- `/review` — review code.
- `/pr-comments` — fetch PR comments.
- `/init` — initialize/setup.

Type `/` in the input to see available commands with descriptions. Arrow-key navigation and Enter to select.

---

## MCP Servers

**Settings → MCP** (max 20 per user)

Model Context Protocol servers extend the AI agent's capabilities with external tools and data sources.

**Supported transport types:**
| Type | Execution |
|------|-----------|
| NPX | `npx -y {package}` |
| BunX | `bunx {package}` |
| UVX | `uvx {package}` |
| HTTP | Remote HTTP endpoint |

Each MCP configuration includes:
- Name and description.
- Command type and package name (or URL for HTTP).
- Optional additional arguments.
- Optional environment variables.
- Enable/disable toggle.

MCP servers run inside the sandbox and provide tools that appear alongside built-in tools in the AI's tool palette.

---

## Custom Prompts & Instructions

### Custom Prompts (Settings → Prompts)

Create named system prompts that can be applied to conversations. Reference them by typing `@prompt:name` in the chat input. When applied, the custom prompt replaces the default system prompt while retaining runtime context sections (workspace info, available ports, GitHub CLI, etc.).

No limit on the number of custom prompts.

### Custom Instructions (Settings → Instructions)

A single block of text (up to 1,500 characters) injected into every message as `<user_instructions>`. Use this for global context like coding standards, project conventions, or preferred response style.

---

## Marketplace

**Settings → Marketplace**

A plugin catalog hosted on GitHub containing community-contributed agents, skills, slash commands, and MCP configurations.

### Browsing

- **Search** — filter by name or description.
- **Category filter** — All, Development, Productivity, Testing, Database, Deployment, Security, Design, Other.
- **Plugin cards** showing name, description, and install status.
- **Plugin details modal** with full README and component list.

### Installation

- One-click install of individual components from a plugin.
- Components are added to your personal configuration (agents, commands, skills, MCPs).
- Installed plugins tracked with version and timestamp.
- Catalog cached for 1 hour; manual refresh available.

### Rate Limits

The marketplace fetches from GitHub's API. If you hit rate limits, configure a GitHub Personal Access Token in Settings → General for higher limits.

---

## Scheduled Tasks

**Settings → Tasks**

Automate recurring AI agent tasks that run on a schedule without manual interaction.

### Creating a Task

Each task has:
- **Name** — descriptive identifier.
- **Prompt** — the message sent to the AI agent.
- **Model** — which AI model to use.
- **Recurrence** — how often to run:

| Type | Schedule |
|------|----------|
| Once | Single execution at a specified date/time |
| Daily | Every day at a specified time |
| Weekly | A specified day of the week (Mon–Sun) at a specified time |
| Monthly | A specified day of the month (1–31) at a specified time |

### Task Lifecycle

- Tasks have statuses: **Active**, **Paused**, **Completed** (one-time only), **Failed**.
- Toggle between active and paused with a single button.
- View execution history with status (running, success, failed) and timestamps.
- Scheduled tasks run with **Ultra** thinking mode (32k tokens) for maximum reasoning capability.
- Each execution creates a temporary sandbox, runs the agent, records results, and cleans up.

### Timezone

Set your timezone in Settings → General. All schedule times are displayed and configured in your local timezone but stored in UTC internally.

---

## Gmail Integration

**Settings → Integrations**

Connect your Gmail account to let the AI read, send, compose, and modify emails.

### Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/) and enable the Gmail API.
2. Create OAuth credentials (Desktop app for localhost, Web app for hosted deployments).
3. Download the credentials JSON file.
4. Upload it in Settings → Integrations.
5. Click **Connect Gmail** and complete the Google authorization flow.

### Capabilities

Once connected, the AI agent gains Gmail tools via the [Gmail MCP Server](https://github.com/GongRzhe/Gmail-MCP-Server):
- Read emails.
- Send emails.
- Compose drafts.
- Modify labels and flags.

### Management

- View connection status.
- Disconnect Gmail.
- Delete OAuth credentials.

---

## Prompt Enhancement

The sparkles button in the input bar rewrites your prompt to be more effective. It:

- Analyzes the prompt type (code, research, creative, general).
- Adds explicit instructions, context, and action-oriented language.
- Returns an optimized version without explanation.

The enhanced prompt replaces your input text; you can review and edit before sending.

---

## Desktop App

Claudex can run as a native macOS desktop application via [Tauri](https://tauri.app/). See [Desktop Setup](desktop-local.md) for instructions.

The desktop app wraps the same web UI with native window management while running Docker Compose services in the background.

---

## Admin Panel & API Docs

- **API Documentation**: Available at `/api/v1/docs` (interactive OpenAPI/Swagger UI).
- **Admin Panel**: Available at `/admin` for user management and database inspection (SQLAdmin).
- **Default admin credentials**: `admin@example.com` / `admin123`.

---

## Settings Summary

All user-configurable options are accessible from the Settings page:

| Tab | What It Controls |
|-----|-----------------|
| General | API keys (GitHub, E2B, Modal), sandbox provider, timezone, notifications, display options, delete all chats |
| Providers | AI provider configurations (Anthropic, OpenAI, OpenRouter, Custom) |
| Integrations | Gmail OAuth connection |
| Marketplace | Browse and install community plugins |
| MCP | Model Context Protocol server configurations |
| Agents | Custom AI agents |
| Skills | Custom skill packages |
| Commands | Custom slash commands |
| Prompts | Named system prompts |
| Environment Variables | Global environment variables |
| Instructions | Custom instructions injected into all messages |
| Tasks | Scheduled task automation |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Send message |
| Shift+Enter | Insert newline |
| Cmd/Ctrl+K | Focus chat search in sidebar |
| Shift+Click (view icon) | Open secondary split view |
| Arrow Keys | Navigate suggestion dropdowns |
