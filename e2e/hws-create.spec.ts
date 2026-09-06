import { test, expect } from '@playwright/test';

// Tests if the UI shows the title h2
test("Create page displays the title", async ({ page }) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');
await expect(page.getByRole('heading', { level: 2, name: 'Add a new task' })).toBeVisible();
});

// Tests if the home button shows and works
test("Open hws page and click the button to home", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');
await page.getByRole('button', { name: 'Home' }).click();
}); 

//Testing if the add task button shows and works 
test('add entry page loads', async ({ page }) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');
await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible();
});

// Tests that the planner table display the correct labels
test("Form displays the correct labels", async ({ page }) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');
await expect(page.getByText('Date', { exact: true })).toBeVisible();
await expect(page.getByText('Subject', { exact: true })).toBeVisible();
await expect(page.getByText('Task type', { exact: true })).toBeVisible();
await expect(page.getByText('Notes', { exact: true })).toBeVisible();
});