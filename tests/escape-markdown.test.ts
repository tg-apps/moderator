import { describe, it, expect } from "bun:test";

import { escapeMarkdownV2 } from "#lib/escape-markdown";

describe("escapeMarkdownV2", () => {
  it("escapes underscore", () => {
    expect(escapeMarkdownV2("hello_world")).toBe("hello\\_world");
  });

  it("escapes asterisk", () => {
    expect(escapeMarkdownV2("hello*world")).toBe("hello\\*world");
  });

  it("escapes brackets", () => {
    expect(escapeMarkdownV2("hello[world]")).toBe("hello\\[world\\]");
  });

  it("escapes parentheses", () => {
    expect(escapeMarkdownV2("hello(world)")).toBe("hello\\(world\\)");
  });

  it("escapes tilde", () => {
    expect(escapeMarkdownV2("hello~world")).toBe("hello\\~world");
  });

  it("escapes backtick", () => {
    expect(escapeMarkdownV2("hello`world")).toBe("hello\\`world");
  });

  it("escapes greater than", () => {
    expect(escapeMarkdownV2("hello>world")).toBe("hello\\>world");
  });

  it("escapes hash", () => {
    expect(escapeMarkdownV2("hello#world")).toBe("hello\\#world");
  });

  it("escapes plus", () => {
    expect(escapeMarkdownV2("hello+world")).toBe("hello\\+world");
  });

  it("escapes minus", () => {
    expect(escapeMarkdownV2("hello-world")).toBe("hello\\-world");
  });

  it("escapes equals", () => {
    expect(escapeMarkdownV2("hello=world")).toBe("hello\\=world");
  });

  it("escapes pipe", () => {
    expect(escapeMarkdownV2("hello|world")).toBe("hello\\|world");
  });

  it("escapes curly braces", () => {
    expect(escapeMarkdownV2("hello{world}")).toBe("hello\\{world\\}");
  });

  it("escapes dot", () => {
    expect(escapeMarkdownV2("hello.world")).toBe("hello\\.world");
  });

  it("escapes exclamation", () => {
    expect(escapeMarkdownV2("hello!world")).toBe("hello\\!world");
  });

  it("escapes multiple special characters", () => {
    expect(escapeMarkdownV2("*bold* and _italic_")).toBe(
      "\\*bold\\* and \\_italic\\_",
    );
  });

  it("escapes all special characters in one string", () => {
    expect(escapeMarkdownV2("_ * [ ] ( ) ~ ` > # + - = | { } . !")).toBe(
      "\\_ \\* \\[ \\] \\( \\) \\~ \\` \\> \\# \\+ \\- \\= \\| \\{ \\} \\. \\!",
    );
  });

  it("does not modify text without special characters", () => {
    expect(escapeMarkdownV2("hello world 123")).toBe("hello world 123");
  });

  it("handles empty string", () => {
    expect(escapeMarkdownV2("")).toBe("");
  });

  it("handles string with only special characters", () => {
    expect(escapeMarkdownV2("***")).toBe("\\*\\*\\*");
  });

  it("handles Russian text with special characters", () => {
    expect(escapeMarkdownV2("Привет *мир*!")).toBe("Привет \\*мир\\*\\!");
  });
});
