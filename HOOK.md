---
name: md-table-formatter
description: "Formats markdown tables in agent tool results for better readability"
homepage: https://github.com/junghoonkye/openclaw-md-table-formatter
metadata:
  openclaw:
    emoji: "📊"
    events: ["tool_result_persist"]
---

# Markdown Table Formatter

Automatically formats markdown tables in agent tool results before they are persisted to the session transcript.

## What It Does

- Formats markdown tables with proper column alignment
- Supports left, center, and right text alignment (`:---`, `:---:`, `---:`)
- Handles nested markdown (bold, italic, strikethrough, inline code)
- Preserves markdown symbols inside inline code blocks
- Properly calculates column widths considering markdown formatting
- Works with emojis and unicode characters

## How It Works

This hook intercepts `tool_result_persist` events, which fire when tool results are about to be saved to the session transcript. It:

1. Checks if the tool result contains text content
2. Parses markdown tables in the text
3. Calculates proper column widths
4. Formats tables with consistent spacing and alignment
5. Returns the formatted text for persistence

## Example

**Before:**

```
| Name | Age | Role |
|---|---|---|
| Alice | 30 | Engineer |
| Bob | 25 | Designer |
```

**After:**

```
| Name  | Age | Role     |
|:------|:---:|:---------|
| Alice | 30  | Engineer |
| Bob   | 25  | Designer |
```

## Requirements

- OpenClaw >= 2026.2.0

## Configuration

No configuration required. The hook is enabled/disabled via OpenClaw's hook management:

```bash
openclaw hooks enable md-table-formatter
openclaw hooks disable md-table-formatter
```

## Notes

- Only affects tool results, not user messages
- Invalid tables are left unchanged with a comment
- Inline code content is preserved as-is
- Errors during formatting are handled gracefully
