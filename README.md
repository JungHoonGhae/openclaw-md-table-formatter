# openclaw-md-table-formatter

[![npm version](https://img.shields.io/npm/v/@junghoonkye/openclaw-md-table-formatter.svg)](https://www.npmjs.com/package/@junghoonkye/openclaw-md-table-formatter)
[![npm downloads](https://img.shields.io/npm/dw/@junghoonkye/openclaw-md-table-formatter.svg)](https://www.npmjs.com/package/@junghoonkye/openclaw-md-table-formatter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/JungHoonGhae/openclaw-md-table-formatter/blob/main/LICENSE)

| [<img alt="GitHub Follow" src="https://img.shields.io/github/followers/JungHoonGhae?style=flat-square&logo=github&labelColor=black&color=24292f" width="156px" />](https://github.com/JungHoonGhae) | Follow [@JungHoonGhae](https://github.com/JungHoonGhae) on GitHub for more projects. |
| :-----| :----- |
| [<img alt="X link" src="https://img.shields.io/badge/Follow-%40lucas_ghae-000000?style=flat-square&logo=x&labelColor=black" width="156px" />](https://x.com/lucas_ghae) | Follow [@lucas_ghae](https://x.com/lucas_ghae) on X for updates. |

**Markdown table formatter hook for OpenClaw — format tables in agent tool results automatically.**

> **Disclaimer**: This is an independent community hook. It is not affiliated with, endorsed by, or sponsored by OpenClaw. OpenClaw™ is a trademark of its respective owners.

## Support

If this hook helps you, consider supporting its maintenance:

<a href="https://www.buymeacoffee.com/lucas.ghae">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## The Problem

Markdown tables from AI agents are often messy:

```
| Name | Age | Role |
|---|---|---|
| Alice | 30 | Engineer |
| Bob | 25 | Designer |
```

Columns don't align. Hard to read. Looks unprofessional in Discord/Telegram.

## The Solution

This hook automatically formats markdown tables in agent tool results:

- ✅ Proper column alignment (left, center, right)
- ✅ Handles emojis and unicode characters
- ✅ Preserves markdown inside inline code
- ✅ Works with bold, italic, strikethrough
- ✅ Invalid tables left unchanged with comment

### Before

```markdown
| Name | Age | Role |
|---|---|---|
| Alice | 30 | Engineer |
| Bob | 25 | Designer |
```

### After

```markdown
| Name  | Age | Role     |
|:------|:---:|:---------|
| Alice | 30  | Engineer |
| Bob   | 25  | Designer |
```

## Installation

### From npm

```bash
openclaw hooks install @junghoonkye/openclaw-md-table-formatter
```

### From local directory

```bash
openclaw hooks install ./path/to/openclaw-md-table-formatter
```

### Link for development

```bash
openclaw hooks install -l ./path/to/openclaw-md-table-formatter
```

## Usage

After installation, enable the hook:

```bash
openclaw hooks enable md-table-formatter
```

Restart your gateway:

```bash
openclaw gateway --force
```

That's it! Tables in tool results will be formatted automatically.

## How It Works

This hook intercepts `tool_result_persist` events, which fire when tool results are about to be saved to the session transcript:

| Step | Action |
|------|--------|
| 1. Check | Verify tool result contains text content |
| 2. Parse | Extract markdown tables from text |
| 3. Calculate | Determine column widths (considering markdown, emojis, unicode) |
| 4. Format | Apply consistent spacing and alignment |
| 5. Return | Save formatted text to transcript |

## Features

| Feature | Description |
|---------|-------------|
| **Alignment** | Left (`:---`), center (`:---:`), right (`---:`) |
| **Markdown handling** | Strips bold/italic/strike for width calculation |
| **Code preservation** | Markdown inside `` `code` `` stays intact |
| **Unicode support** | Emojis and CJK characters calculated correctly |
| **Error handling** | Invalid tables left unchanged with comment |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Hook not found | Run `openclaw hooks install @junghoonkye/openclaw-md-table-formatter` |
| Tables not formatting | Run `openclaw hooks enable md-table-formatter` then restart gateway |
| Invalid table comment | Ensure table has separator row (`\|---\|`) and same column count |

## Requirements

- OpenClaw >= 2026.2.0

## Limitations

- Only affects **tool results**, not user messages or direct agent responses
- Tables must have a valid separator row (`|---|---|`)
- All rows must have the same number of columns

## Development

```bash
git clone https://github.com/JungHoonGhae/openclaw-md-table-formatter.git
cd openclaw-md-table-formatter
bun install
bun run build
```

## Links

- **OpenClaw**: [openclaw.ai](https://openclaw.ai) - The AI agent gateway
- **GitHub**: [github.com/JungHoonGhae/openclaw-md-table-formatter](https://github.com/JungHoonGhae/openclaw-md-table-formatter)
- **npm Package**: [npmjs.com/package/@junghoonkye/openclaw-md-table-formatter](https://www.npmjs.com/package/@junghoonkye/openclaw-md-table-formatter)

## License

MIT - See [LICENSE](https://github.com/JungHoonGhae/openclaw-md-table-formatter/blob/main/LICENSE) for details.

## Contributing

Contributions are welcome! Feel free to submit a Pull Request at [github.com/JungHoonGhae/openclaw-md-table-formatter](https://github.com/JungHoonGhae/openclaw-md-table-formatter).

## Legal Notice

This project is provided "as is" without warranty of any kind. The use of OpenClaw hook API is subject to OpenClaw's terms of service. Users are responsible for complying with all applicable terms and conditions when using this hook.

## Related

- [opencode-md-table-formatter](https://github.com/franlol/opencode-md-table-formatter) - Original inspiration for OpenCode
