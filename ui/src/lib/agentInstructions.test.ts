import { describe, expect, it } from "vitest";
import { supportsInstructionsBundle } from "./agentInstructions";

describe("supportsInstructionsBundle", () => {
  it("supports bundle-backed adapters", () => {
    expect(supportsInstructionsBundle("claude_local")).toBe(true);
    expect(supportsInstructionsBundle("codex_local")).toBe(true);
    expect(supportsInstructionsBundle("gemini_local")).toBe(true);
    expect(supportsInstructionsBundle("ollama_local")).toBe(true);
    expect(supportsInstructionsBundle("opencode_local")).toBe(true);
    expect(supportsInstructionsBundle("pi_local")).toBe(true);
    expect(supportsInstructionsBundle("hermes_local")).toBe(true);
    expect(supportsInstructionsBundle("cursor")).toBe(true);
  });

  it("rejects non-bundle adapters", () => {
    expect(supportsInstructionsBundle("http")).toBe(false);
    expect(supportsInstructionsBundle("process")).toBe(false);
    expect(supportsInstructionsBundle("openclaw_gateway")).toBe(false);
  });
});
