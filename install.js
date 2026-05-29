#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_NAME = 'mac-disk-cleaner';
const SKILL_DIR = path.join(os.homedir(), '.claude', 'skills', SKILL_NAME);
const SKILL_SRC = path.join(__dirname, 'skill', 'SKILL.md');

function install() {
  console.log(`\n🧹 Installing ${SKILL_NAME} skill for Claude Code...\n`);

  // Create skill directory
  fs.mkdirSync(SKILL_DIR, { recursive: true });

  // Copy SKILL.md
  fs.copyFileSync(SKILL_SRC, path.join(SKILL_DIR, 'SKILL.md'));

  console.log(`✅ Skill installed to: ${SKILL_DIR}`);
  console.log('\nHow to use it:');
  console.log('  Open Claude Code and say: "my Mac is running out of space"');
  console.log('  Claude will automatically use the mac-disk-cleaner skill.\n');
}

function uninstall() {
  console.log(`\n🗑️  Removing ${SKILL_NAME} skill...\n`);
  if (fs.existsSync(SKILL_DIR)) {
    fs.rmSync(SKILL_DIR, { recursive: true });
    console.log(`✅ Skill removed from: ${SKILL_DIR}\n`);
  } else {
    console.log(`Skill not found at ${SKILL_DIR} — nothing to remove.\n`);
  }
}

const command = process.argv[2];

if (command === 'uninstall') {
  uninstall();
} else {
  install();
}
