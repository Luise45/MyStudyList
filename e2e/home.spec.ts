import {test, expect} from '@playwright/test';

// does the app load and display the title correctly?
test("Open home page and see the Title", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');
await expect(
    page.getByRole('heading', { name: 'Welcome to MyStudyList' })
  ).toBeVisible();
});

// Is the text displayed correctly?
test("Open home page and see the text", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');
await expect(
    page.getByText('Plan homework, projects and exams in one calm place. MyStudyList helps you keep every task visible and organized.Your personal study list')
).toBeVisible();
}); 

// Does the button work correctly?
test("Open home page and click the button", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');
await page.getByRole('button', { name: 'Go to List' }).click();
}); 

