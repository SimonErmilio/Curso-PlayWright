const { test, expect } = require("@playwright/test");

test.beforeAll("Setup", async () => {
  console.log("Starting execution");
});

test.beforeEach("Test setup", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
});

test.afterAll("Complete", async () => {
  console.log("Test done");
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `${testInfo.title}.png`, fullPage: true });
});

test.describe("Login", async () => {
  test("Login demo", async ({ page }) => {
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await page.screenshot({ path: "saucedemoportal.png", fullPage: true });
    await page
      .getByText("Swag Labs")
      .screenshot({ path: "titlescreenshot.png" });

    await expect(page.getByText("Products")).toBeVisible();
  });

  test("Login demo by css class, id and data-test", async ({ page }) => {
    // by id
    await page.locator("#user-name").fill("standard_user");

    //by attribute id
    await page.locator("id=password").fill("secret_sauce");

    //by data-test
    await page.locator("data-test=login-button").click();

    await page.waitForURL(/.*inventory.html/);

    //by css class
    const productsTitle = await page.locator(".title");
    await expect(productsTitle).toHaveText("Products");
    await expect(productsTitle).toBeVisible();
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});

test.describe("Login y prices", async () => {
  test("Login demo y first price", async ({ page }) => {
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Products")).toBeVisible();

    await expect(
      await page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")
    ).toHaveText("$29.99");
  });

  test("Login demo order low to high price and first price", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Products")).toBeVisible();

    //select by value
    //await page.locator(".product_sort_container").selectOption("lohi");

    //select by label
    //await page.locator(".product_sort_container").selectOption({label: "Price (low to high)"});

    // by press
    await page.locator(".product_sort_container").press("ArrowDown");
    await page.locator(".product_sort_container").press("ArrowDown");

    await expect(
      await page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")
    ).toHaveText("$7.99");

    await expect(
      await page.locator(
        "(//div[contains(@class, 'inventory_item_price')])[last()]"
      )
    ).toHaveText("$49.99");
  });
});
