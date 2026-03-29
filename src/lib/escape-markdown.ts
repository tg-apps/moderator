const MARKDOWN_V2_SPECIAL_CHARS = [
  "_",
  "*",
  "[",
  "]",
  "(",
  ")",
  "~",
  "`",
  ">",
  "#",
  "+",
  "-",
  "=",
  "|",
  "{",
  "}",
  ".",
  "!",
];

export function escapeMarkdownV2(text: string): string {
  let result = "";
  for (const char of text) {
    if (MARKDOWN_V2_SPECIAL_CHARS.includes(char)) {
      result += "\\" + char;
    } else {
      result += char;
    }
  }
  return result;
}
