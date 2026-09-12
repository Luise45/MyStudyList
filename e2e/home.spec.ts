import {test, expect} from '@playwright/test';

// Testing if the UI shows the title 
test("Open home page and see the Title", async ({page}) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');
await expect(
    page.getByRole('heading', { name: 'Welcome to MyStudyList' })).toBeVisible();
});

// Testing if the UI shows the text on the home page
test("Home page displays introductory content", async ({ page }) => {
await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');
await expect(
    page.getByText('Plan homework, projects and exams in one calm place.')).toBeVisible();
await expect(
    page.getByText('MyStudyList helps you keep every task visible and organized.')).toBeVisible();
});

test.describe('Authentication UI', () => {
  test('login page shows the required controls', async ({ page }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: /login/i })
    ).toBeVisible();

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();

    await expect(
      page.getByRole('button', { name: /login/i })
    ).toBeVisible();
  });
});

