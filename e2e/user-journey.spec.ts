import { test, expect } from '@playwright/test';
// user journey 1 test for loging in, creating a homework task
test('authenticated user can create and delete a homework task', async ({ page }) => {
  // Login
  await page.goto('/');

  await page.getByLabel('Email').fill('e2e-test@example.com');
  await page.getByLabel('Password').fill('test-password');

  await page.getByRole('button', { name: 'Login' }).click();

await page.goto('/hws');

// Navigate to create page
await page.getByRole('link', { name: '+ Add task' }).click();

await expect(page).toHaveURL(/\/hws\/create/);

  // Fill in homework form
await page.getByLabel('Date').fill('2026-09-15');
await page.getByLabel('Subject').fill('Chemistry e2e');
await page.getByLabel('Task type').selectOption('Exam');

await page
  .getByLabel('Notes')
  .fill('Created by Playwright user journey test');
const subject = `Chemistry e2e ${Date.now()}`;
 await page.getByLabel('Subject').fill(subject);

await page.getByRole('button', { name: 'Add task' }).click();

await expect(page).toHaveURL(/\/hws/);

const row = page.getByRole('row').filter({
  hasText: subject
});

await expect(row).toBeVisible();
await expect(row).toContainText('Exam');
await expect(row).toContainText(
  'Created by Playwright user journey test'
);

});