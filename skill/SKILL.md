---
name: mac-disk-cleaner
description: >
  Mac disk space auditor and cleaner. Use this skill whenever the user wants to
  free up disk space on their Mac, says their Mac is running out of storage, wants
  to clear cache or junk files, mentions cleaning up Claude/Docker/app data, or asks
  what's taking up space. Also use it when the user wants to audit unknown or suspicious
  apps in System Settings - Privacy & Security - Full Disk Access. Even if they just
  say "my Mac feels slow" or "I'm low on storage" — trigger this skill.
---

# Mac Disk Cleaner Skill

You are helping the user free up disk space and audit their Mac. Work through the steps below in order, confirming with the user before any destructive operation.

---

## Step 1: Disk Diagnosis

Start by showing the user what's actually taking up space so they can make informed decisions.

Run via `mcp__Control_your_Mac__osascript` (do shell script):

```bash
du -sh ~/Library/Application\ Support/Claude/* 2>/dev/null | sort -rh | head -15
echo "---"
du -sh ~/Library/Caches/* 2>/dev/null | sort -rh | head -10
echo "---"
df -h / | tail -1
```

Present the results clearly: how much total disk is used vs. available, and the top space consumers. Highlight anything over 1 GB.

---

## Step 2: Clean Claude App Data

Claude's desktop app accumulates large caches over time. The biggest offenders, in order:

| Directory | What it is | Safe to delete? |
|---|---|---|
| `~/Library/Application Support/Claude/vm_bundles` | VM images for Claude Code sandboxes | Yes — rebuilds on next use |
| `~/Library/Application Support/Claude/Cache` | HTTP/render cache | Yes |
| `~/Library/Application Support/Claude/Code Cache` | V8 JS code cache | Yes |
| `~/Library/Application Support/Claude/local-agent-mode-sessions` | Past Cowork session data | Ask user — they lose session history |
| `~/Library/Application Support/Claude/claude-code-sessions` | Claude Code session logs | Ask user |
| `~/Library/Application Support/Claude/claude-code-vm` | Claude Code VM data | Yes if Claude Code not actively in use |

**Before deleting**, show the user the size of each directory:
```bash
du -sh ~/Library/Application\ Support/Claude/vm_bundles \
       ~/Library/Application\ Support/Claude/Cache \
       ~/Library/Application\ Support/Claude/Code\ Cache \
       ~/Library/Application\ Support/Claude/local-agent-mode-sessions \
       ~/Library/Application\ Support/Claude/claude-code-sessions \
       ~/Library/Application\ Support/Claude/claude-code-vm 2>/dev/null
```

Tell the user which ones are safe to delete outright and which require confirmation, then ask: "Want me to go ahead and delete the safe ones?"

After approval, delete them with `rm -rf`. Note: some Cache subdirectories may say "Directory not empty" if Claude is running — that's normal and harmless.

---

## Step 3: Clean Docker

If Docker is installed, offer to prune unused data. This removes stopped containers, unused networks, dangling images, and build cache.

First check if Docker is running:
```bash
docker info > /dev/null 2>&1 && echo "running" || echo "stopped"
```

- If **running**: run `docker system prune -a` (ask confirmation first — show the warning)
- If **stopped**: let the user know Docker needs to be running for this step, or that they can skip it if they deleted `~/Library/Containers/com.docker.docker` manually

Note: `~/Library/Containers/com.docker.docker` can only be deleted while Docker is fully quit. macOS blocks deletion if the app is running.

---

## Step 4: Audit Full Disk Access (optional)

If the user wants to check for unknown or suspicious entries in Full Disk Access, query the TCC database:

```bash
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
  'SELECT client, client_type, auth_value, last_modified FROM access WHERE service="kTCCServiceSystemPolicyAllFiles";' 2>/dev/null
```

For each entry:
- `client_type = 0` = bundle ID (e.g., `com.apple.Terminal`) — normal
- `client_type = 1` = file path (e.g., `/Users/foo/.local/share/claude/versions/2.1.150`) — these are CLI tools or versioned executables, not traditional apps, which is why they show with a generic icon

Help the user understand each entry. A path-based entry with a version number in the name (like `2.1.150`) is often a versioned CLI tool — check the path to identify the parent app. An entry is suspicious if:
- The path doesn't correspond to any known installed software
- It's in a temp or hidden directory with no clear origin
- Full Disk Access is enabled (auth_value = 2) for an unrecognized entry

If something looks suspicious, recommend the user remove it from System Settings - Privacy & Security - Full Disk Access manually.

---

## Step 5: Summary

After cleaning, run the disk diagnosis again and show the user how much space was recovered:

```bash
df -h / | tail -1
```

Report: "You freed up X GB. Here's what was cleaned: ..."

---

## Tips

- Always use `mcp__Control_your_Mac__osascript` with `do shell script "..."` to run shell commands on the user's Mac.
- Never delete anything without showing the user the size first and getting their OK.
- If a deletion fails with "Operation not permitted," the app is likely still running — let the user know.
- The `sqlite3` TCC query may return no results if Full Disk Access hasn't been granted to any apps — that's normal.
