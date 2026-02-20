# openclaw-md-table-formatter

[![skills.sh](https://skills-badge.vercel.app/badge/JungHoonGhae/openclaw-md-table-formatter?style=flat-square&label=installs)](https://skills.sh/JungHoonGhae/openclaw-md-table-formatter)
[![npm version](https://img.shields.io/npm/v/openclaw-md-table-formatter.svg)](https://www.npmjs.com/package/openclaw-md-table-formatter)
[![npm downloads](https://img.shields.io/npm/dw/openclaw-md-table-formatter.svg)](https://www.npmjs.com/package/openclaw-md-table-formatter)
[![GitHub stars](https://img.shields.io/github/stars/JungHoonGhae/openclaw-md-table-formatter)](https://github.com/JungHoonGhae/openclaw-md-table-formatter/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/JungHoonGhae/openclaw-md-table-formatter/blob/main/LICENSE)

| [<img alt="GitHub Follow" src="https://img.shields.io/github/followers/JungHoonGhae?style=flat-square&logo=github&labelColor=black&color=24292f" width="156px" />](https://github.com/JungHoonGhae) | Follow [@JungHoonGhae](https://github.com/JungHoonGhae) on GitHub for more projects. |
| :-----| :----- |
| [<img alt="X link" src="https://img.shields.io/badge/Follow-%40lucas_ghae-000000?style=flat-square&logo=x&labelColor=black" width="156px" />](https://x.com/lucas_ghae) | Follow [@lucas_ghae](https://x.com/lucas_ghae) on X for updates. |

**Markdown table formatter hook for OpenClaw — format tables in agent tool results automatically.**

> **Disclaimer**: This is an independent community hook. It is not affiliated with, endorsed by, or sponsored by OpenClaw. OpenClaw™ is a trademark of its respective owners.

## About

AI agents often produce misaligned markdown tables that look messy in Discord, Telegram, and other platforms. This hook automatically formats tables with proper column alignment before they're saved to the session transcript.

**What it does:**
- Automatically formats tables when tool results are persisted
- Handles emojis, unicode, and markdown syntax correctly
- Preserves alignment indicators (`:---`, `:---:`, `---:`)
- Works with bold, italic, strikethrough, and inline code

## Support

If this hook helps you, consider supporting its maintenance:

<a href="https://www.buymeacoffee.com/lucas.ghae">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## Features

- 📊 **Proper alignment** — Left, center, and right column alignment
- 🎯 **Emoji & unicode** — Correct width calculation for CJK and emojis
- 🔒 **Code preservation** — Markdown inside inline code stays intact
- ⚡ **Automatic** — No configuration needed after installation

## Installation

```bash
openclaw hooks install openclaw-md-table-formatter
```

## Requirements

| Requirement | Version |
|-------------|---------|
| OpenClaw | >= 2026.2.0 |

## Usage

```bash
openclaw hooks enable md-table-formatter
openclaw gateway --force
```

Tables in tool results will be formatted automatically.

## Documentation

| Resource | Link |
|----------|------|
| npm Package | [npmjs.com/package/openclaw-md-table-formatter](https://www.npmjs.com/package/openclaw-md-table-formatter) |
| GitHub | [github.com/JungHoonGhae/openclaw-md-table-formatter](https://github.com/JungHoonGhae/openclaw-md-table-formatter) |
| OpenClaw | [openclaw.ai](https://openclaw.ai) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
git clone https://github.com/JungHoonGhae/openclaw-md-table-formatter.git
cd openclaw-md-table-formatter
bun install
```

## License

MIT - See [LICENSE](https://github.com/JungHoonGhae/openclaw-md-table-formatter/blob/main/LICENSE) for details.
