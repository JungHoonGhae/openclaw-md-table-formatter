import type { HookHandler } from "../../src/hooks/hooks.js";

// Width cache for performance optimization
const widthCache = new Map<string, number>();
let cacheOperationCount = 0;

/**
 * Hook handler for tool_result_persist event
 * Formats markdown tables in tool results before they are persisted
 */
const handler: HookHandler = async (event) => {
  // Only handle tool_result_persist events
  if (event.type !== "tool_result_persist") {
    return;
  }

  // Get the tool result content
  const context = event.context as {
    toolResult?: { content?: Array<{ type: string; text?: string }> };
  };

  const toolResult = context?.toolResult;
  if (!toolResult?.content) {
    return;
  }

  // Process each text content block
  let modified = false;
  for (const block of toolResult.content) {
    if (block.type === "text" && block.text) {
      try {
        const formatted = formatMarkdownTables(block.text);
        if (formatted !== block.text) {
          block.text = formatted;
          modified = true;
        }
      } catch (error) {
        // If formatting fails, keep original text
        block.text =
          block.text +
          "\n\n<!-- table formatting failed: " +
          (error as Error).message +
          " -->";
      }
    }
  }

  // Push message to notify user if modified
  if (modified) {
    event.messages.push("📊 Formatted markdown tables");
  }
};

export default handler;

/**
 * Format all markdown tables in the given text
 */
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isTableRow(line)) {
      const tableLines: string[] = [line];
      i++;

      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }

      if (isValidTable(tableLines)) {
        result.push(...formatTable(tableLines));
      } else {
        result.push(...tableLines);
        result.push("<!-- table not formatted: invalid structure -->");
      }
    } else {
      result.push(line);
      i++;
    }
  }

  incrementOperationCount();
  return result.join("\n");
}

/**
 * Check if a line is a table row
 */
function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("|") &&
    trimmed.endsWith("|") &&
    trimmed.split("|").length > 2
  );
}

/**
 * Check if a line is a separator row (e.g., |---|---|)
 */
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false;
  const cells = trimmed.split("|").slice(1, -1);
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell));
}

/**
 * Validate that a table has proper structure
 */
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false;

  const rows = lines.map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  );

  if (rows.length === 0 || rows[0].length === 0) return false;

  const firstRowCellCount = rows[0].length;
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount);
  if (!allSameColumnCount) return false;

  const hasSeparator = lines.some((line) => isSeparatorRow(line));
  return hasSeparator;
}

/**
 * Format a table with proper column widths and alignment
 */
function formatTable(lines: string[]): string[] {
  const separatorIndices = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    if (isSeparatorRow(lines[i])) separatorIndices.add(i);
  }

  const rows = lines.map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  );

  if (rows.length === 0) return lines;

  const colCount = Math.max(...rows.map((row) => row.length));

  // Determine column alignments
  const colAlignments: Array<"left" | "center" | "right"> =
    Array(colCount).fill("left");
  for (const rowIndex of separatorIndices) {
    const row = rows[rowIndex];
    for (let col = 0; col < row.length; col++) {
      colAlignments[col] = getAlignment(row[col]);
    }
  }

  // Calculate column widths
  const colWidths: number[] = Array(colCount).fill(3);
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    if (separatorIndices.has(rowIndex)) continue;
    const row = rows[rowIndex];
    for (let col = 0; col < row.length; col++) {
      const displayWidth = calculateDisplayWidth(row[col]);
      colWidths[col] = Math.max(colWidths[col], displayWidth);
    }
  }

  // Format each row
  return rows.map((row, rowIndex) => {
    const cells: string[] = [];
    for (let col = 0; col < colCount; col++) {
      const cell = row[col] ?? "";
      const align = colAlignments[col];

      if (separatorIndices.has(rowIndex)) {
        cells.push(formatSeparatorCell(colWidths[col], align));
      } else {
        cells.push(padCell(cell, colWidths[col], align));
      }
    }
    return "| " + cells.join(" | ") + " |";
  });
}

/**
 * Get alignment from separator cell content
 */
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim();
  const hasLeftColon = trimmed.startsWith(":");
  const hasRightColon = trimmed.endsWith(":");

  if (hasLeftColon && hasRightColon) return "center";
  if (hasRightColon) return "right";
  return "left";
}

/**
 * Calculate display width of text (considering markdown symbols)
 */
function calculateDisplayWidth(text: string): number {
  if (widthCache.has(text)) {
    return widthCache.get(text)!;
  }

  const width = getStringWidth(text);
  widthCache.set(text, width);
  return width;
}

/**
 * Get the visual width of a string
 * Strips markdown symbols for accurate width calculation
 */
function getStringWidth(text: string): number {
  // CRITICAL: Content inside backticks should PRESERVE inner markdown symbols
  // because they are literal text, not markdown

  // Step 1: Extract and protect inline code content
  const codeBlocks: string[] = [];
  let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
    codeBlocks.push(content);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  // Step 2: Strip markdown from non-code parts
  let visualText = textWithPlaceholders;
  let previousText = "";

  while (visualText !== previousText) {
    previousText = visualText;
    visualText = visualText
      .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***bold+italic*** -> text
      .replace(/\*\*(.+?)\*\*/g, "$1") // **bold** -> bold
      .replace(/\*(.+?)\*/g, "$1") // *italic* -> italic
      .replace(/~~(.+?)~~/g, "$1") // ~~strike~~ -> strike
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1") // ![alt](url) -> alt
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)"); // [text](url) -> text (url)
  }

  // Step 3: Restore code content (with its original markdown preserved)
  visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
    return codeBlocks[parseInt(index)];
  });

  // Calculate visual width (handle emojis and wide characters)
  return stringWidth(visualText);
}

/**
 * Calculate the visual width of a string
 * Handles emojis, CJK characters, and other wide characters
 */
function stringWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0) ?? 0;

    // Control characters
    if (code < 32) continue;

    // Emoji ranges (simplified - covers most common emojis)
    if (
      code >= 0x1f600 && code <= 0x1f64f || // Emoticons
      code >= 0x1f300 && code <= 0x1f5ff || // Misc Symbols and Pictographs
      code >= 0x1f680 && code <= 0x1f6ff || // Transport and Map
      code >= 0x1f1e0 && code <= 0x1f1ff || // Flags
      code >= 0x2600 && code <= 0x26ff ||   // Misc symbols
      code >= 0x2700 && code <= 0x27bf ||   // Dingbats
      code >= 0x1f900 && code <= 0x1f9ff || // Supplemental Symbols and Pictographs
      code >= 0x1fa00 && code <= 0x1fa6f || // Chess Symbols
      code >= 0x1fa70 && code <= 0x1faff    // Symbols and Pictographs Extended-A
    ) {
      width += 2;
      continue;
    }

    // CJK characters and other wide characters
    if (
      code >= 0x1100 && code <= 0x115f ||   // Hangul Jamo
      code >= 0x2329 && code <= 0x232a ||   // Angle brackets
      code >= 0x2e80 && code <= 0x303e ||   // CJK Radicals, Symbols and Punctuation
      code >= 0x3040 && code <= 0xa4cf ||   // Hiragana, Katakana, Bopomofo, Hangul Compatibility Jamo, Kanbun, Bopomofo Extended, CJK Unified Ideographs Extension A, CJK Unified Ideographs, Yi Syllables, Yi Radicals
      code >= 0xac00 && code <= 0xd7a3 ||   // Hangul Syllables
      code >= 0xf900 && code <= 0xfaff ||   // CJK Compatibility Ideographs
      code >= 0xfe10 && code <= 0xfe1f ||   // Vertical Forms
      code >= 0xfe30 && code <= 0xfe6f ||   // CJK Compatibility Forms
      code >= 0xff00 && code <= 0xff60 ||   // Halfwidth and Fullwidth Forms
      code >= 0xffe0 && code <= 0xffe6      // Halfwidth and Fullwidth Forms
    ) {
      width += 2;
      continue;
    }

    width += 1;
  }
  return width;
}

/**
 * Pad a cell with appropriate spacing for alignment
 */
function padCell(
  text: string,
  width: number,
  align: "left" | "center" | "right",
): string {
  const displayWidth = calculateDisplayWidth(text);
  const totalPadding = Math.max(0, width - displayWidth);

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2);
    const rightPad = totalPadding - leftPad;
    return " ".repeat(leftPad) + text + " ".repeat(rightPad);
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text;
  } else {
    return text + " ".repeat(totalPadding);
  }
}

/**
 * Format a separator cell with alignment indicators
 */
function formatSeparatorCell(
  width: number,
  align: "left" | "center" | "right",
): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":";
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":";
  return "-".repeat(width);
}

/**
 * Increment operation count and cleanup cache if needed
 */
function incrementOperationCount() {
  cacheOperationCount++;

  if (cacheOperationCount > 100 || widthCache.size > 1000) {
    cleanupCache();
  }
}

/**
 * Clear the width cache
 */
function cleanupCache() {
  widthCache.clear();
  cacheOperationCount = 0;
}
