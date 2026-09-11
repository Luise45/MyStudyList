import { test, expect } from '@playwright/test';
// user journey 1 test for loging in, creating and deleting a homework task


// User journey: login, create, verify, and delete a homework task
test('authenticated user can create and delete a homework task', async ({ page }) => {
  // Login
  await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');

  await page.getByLabel('Email').fill('e2e-test@example.com');
  await page.getByLabel('Password').fill('test-password');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/hws/);

  // Navigate to create page
  await page.getByRole('link', { name: '+ Add task' }).click();

  await expect(page).toHaveURL(/\/hws\/create/);

  // Fill in homework form
  await page.getByLabel('Date').fill('2026-09-15');
  await page.getByLabel('Subject').fill('Chemistry');
  await page.getByLabel('Task type').fill('Test');
  await page
    .getByLabel('Notes')
    .fill('Created by Playwright user journey test');

  // Submit homework
  await page.getByRole('button', { name: 'Add task' }).click();

  // Verify the task appears
  await expect(page.getByText('Chemistry')).toBeVisible();
  await expect(page.getByText('Test', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Created by Playwright user journey test')
  ).toBeVisible();

  // Find the homework entry and delete it
  const task = page.getByText('Chemistry');

  const row = task.locator('..');

  await row.getByRole('button', { name: /delete/i }).click();

  // Verify removal
  await expect(page.getByText('Chemistry')).not.toBeVisible();
});