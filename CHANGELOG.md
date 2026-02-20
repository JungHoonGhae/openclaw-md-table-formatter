# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-20

### Added

- Initial release of openclaw-md-table-formatter
- Markdown table formatting in agent tool results via `tool_result_persist` hook
- Left, center, and right alignment support (`:---`, `:---:`, `---:`)
- Emoji and unicode character width calculation
- Markdown symbol stripping for width calculation (bold, italic, strikethrough)
- Inline code preservation (markdown inside `` `code` `` stays intact)
- Error handling with helpful comments for invalid tables
- npm package `@junghoonkye/openclaw-md-table-formatter`

### Features

- Automatic table formatting on tool result persistence
- Multi-pass regex for nested markdown handling
- Width cache for performance optimization
- Support for emojis, CJK characters, and wide unicode characters

[0.1.0]: https://github.com/JungHoonGhae/openclaw-md-table-formatter/releases/tag/v0.1.0
