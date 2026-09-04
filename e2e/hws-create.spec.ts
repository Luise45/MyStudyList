import { test, expect } from '@playwright/test';

// Does the button home work correctly?
test("Open hws page and click the button to home", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');
await page.getByRole('button', { name: 'Home' }).click();
}); 

//Tests the add task button 
test('add entry page loads', async ({ page }) => {
  await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');
  await expect(
    page.getByRole('button', { name: 'Add task' })).toBeVisible();
});

