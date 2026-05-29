# mac-disk-cleaner — Claude Skill

A skill for [Claude Code](https://claude.ai/code) and [Cowork](https://claude.ai) that audits and cleans Mac disk space. Just tell Claude your Mac is slow or full, and it takes care of the rest.

## What it does

- **Disk diagnosis** — shows what's taking up the most space
- **Claude app cleanup** — clears vm_bundles, Cache, Code Cache, and session data
- **Docker cleanup** — runs `docker system prune` if Docker is installed
- **Full Disk Access audit** — identifies unknown or suspicious entries in Privacy & Security settings

## Install

### Option 1 — Claude Code (terminal users)

```bash
npx mac-disk-cleaner-skill
```

This copies the skill to `~/.claude/skills/mac-disk-cleaner/` where Claude Code picks it up automatically.

To uninstall:
```bash
npx mac-disk-cleaner-skill uninstall
```

### Option 2 — Cowork (desktop app users)

1. Download `mac-disk-cleaner.skill` from the [latest release](../../releases/latest)
2. Open it — Cowork will show a **Save skill** button
3. Click it and you're done

## Usage

Once installed, just talk to Claude naturally:

> "My Mac is running out of space, can you help?"

> "Clean up my Claude caches"

> "There's a weird app in my Full Disk Access, can you check it?"

Claude will automatically use this skill.

## Requirements

- macOS
- Claude Code or Cowork desktop app
- Node.js 14+ (for the npx installer)

## License

MIT
