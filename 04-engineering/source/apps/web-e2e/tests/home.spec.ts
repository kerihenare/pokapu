import { expect, test } from "@playwright/test";

import { expectNoAccessibilityViolations } from "./accessibility";

test("home page greets visitors", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Pokapu");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kia ora, Pokapu");
  await expectNoAccessibilityViolations(page);
});
