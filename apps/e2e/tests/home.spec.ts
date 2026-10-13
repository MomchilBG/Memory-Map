import { expect, test } from "@playwright/test";

test("home page shows the greeting the api read from the database", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("API says: Hello from the database!")).toBeVisible();
});
