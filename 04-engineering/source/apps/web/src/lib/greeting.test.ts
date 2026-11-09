import { expect, test } from "vitest";

import { greeting } from "./greeting";

test("greets by name", () => {
  expect(greeting("Pokapu")).toBe("Kia ora, Pokapu");
});
