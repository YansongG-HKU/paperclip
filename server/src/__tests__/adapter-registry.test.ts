import { describe, expect, it } from "vitest";
import { getServerAdapter } from "../adapters/registry.ts";

describe("getServerAdapter", () => {
  it("returns a registered adapter", () => {
    expect(getServerAdapter("process").type).toBe("process");
  });

  it("throws a clear error for unknown adapter types", () => {
    expect(() => getServerAdapter("not_real_adapter")).toThrowError(
      "Unknown adapter type: not_real_adapter",
    );
  });
});
