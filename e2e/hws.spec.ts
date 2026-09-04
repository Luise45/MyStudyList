import { test, expect } from '@playwright/test';

// Does the button home work correctly?
test("Open hws page and click the button to home", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await page.getByRole('button', { name: 'Home' }).click();
}); 

// Does the button add task work correctly?
test("Open hws page and click the button to add task", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');
await page.getByRole('button', { name: '+ Add Task' }).click();
}); 


