import { AxeBuilder } from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_22_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

/** Fails the test if axe finds any WCAG 2.2 level A or AA violation on the current page. */
export async function expectNoAccessibilityViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS).analyze();

  expect(results.violations).toEqual([]);
}
