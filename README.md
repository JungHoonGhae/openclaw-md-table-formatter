# @junghoonkye/openclaw-md-table-formatter

Markdown table formatter hook for [OpenClaw](https://openclaw.ai).

Automatically formats markdown tables in agent tool results before they are persisted to the session transcript.

## Features

- **Automatic table formatting** - Formats markdown tables with proper column alignment
- **Alignment support** - Left (`:---`), center (`:---:`), and right (`---:`) text alignment
- **Nested markdown handling** - Strips bold, italic, strikethrough for width calculation
- **Code block preservation** - Preserves markdown symbols inside inline code (`` `**bold**` ``)
- **Emoji & Unicode support** - Properly calculates widths for emojis and CJK characters
- **Edge case handling** - Invalid tables are left unchanged with a helpful comment

## Installation

### From npm (when published)

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

## Example

**Before:**

```markdown
| Name | Age | Role |
|---|---|---|
| Alice | 30 | Engineer |
| Bob | 25 | Designer |
```

**After:**

```markdown
| Name  | Age | Role     |
|:------|:---:|:---------|
| Alice | 30  | Engineer |
| Bob   | 25  | Designer |
```

## How It Works

This hook intercepts `tool_result_persist` events, which fire when tool results are about to be saved to the session transcript. It:

1. Checks if the tool result contains text content
2. Parses markdown tables in the text
3. Calculates proper column widths (considering markdown symbols, emojis, and unicode)
4. Formats tables with consistent spacing and alignment
5. Returns the formatted text for persistence

## Configuration

No configuration required. The hook works automatically when enabled.

To disable:

```bash
openclaw hooks disable md-table-formatter
```

## Limitations

- Only affects **tool results**, not user messages or direct agent responses
- Tables must have a valid separator row (`|---|---|`)
- All rows must have the same number of columns

## Requirements

- OpenClaw >= 2026.2.0

## License

MIT © junghoonkye

## Related

- [opencode-md-table-formatter](https://github.com/franlol/opencode-md-table-formatter) - Original inspiration for OpenCode
