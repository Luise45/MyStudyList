import { test, expect } from '@playwright/test';

// Tests if the home button shows and works
test("Open hws page and click the button to home", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await page.getByRole('button', { name: 'Home' }).click();
}); 

// Tests if the add task button shows and works
test("Open hws page and click the button to add task", async ({ page }) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await page.getByRole('link', { name: '+ Add task' }).click();
await expect(page).toHaveURL(/\/hws\/create/);
});

// Tests that the planner table display the correct column headings
test("Planner table displays the correct column headings", async ({ page }) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await expect(page.getByText('DUE DATE')).toBeVisible();
await expect(page.getByText('SUBJECT')).toBeVisible();
await expect(page.getByText('TASK TYPE')).toBeVisible();
await expect(page.getByText('NOTES')).toBeVisible();
});

// Tests if the search field is visible
test("Is Search field visible", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await expect(page.getByPlaceholder('Search by date or subject')).toBeVisible();
}); 

// Tests if the sort button is visible
test("Is the Sort button visible", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await expect(page.getByRole('button', { name: 'Sort' })).toBeVisible();
}); 

