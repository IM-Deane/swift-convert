import { test, expect } from "@playwright/test";

test.describe("Settings Modal", () => {
	test("should save updated settings", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "Open settings modal" }).click();

		await page.getByLabel("Set image quality").click();
		await page.getByRole("button", { name: "Output .JPEG" }).click();
		await page.getByText(".PNG", { exact: true }).click();
		await page.getByRole("button", { name: "Save" }).click();

		await page.getByRole("button", { name: "Open settings modal" }).click();
		await expect(page.getByText(".PNG", { exact: true })).toBeInViewport();
	});

	test("should close when cancel button is pressed", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "Open settings modal" }).click();
		await expect(page.getByText("Photo Settings")).toBeInViewport();

		await page.getByRole("button", { name: "Cancel" }).click();
		await expect(page.getByText("Photo Settings")).not.toBeInViewport();
	});
});
