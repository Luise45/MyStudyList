import { test, expect } from '@playwright/test';

test('authenticated user can create and delete a homework task', async ({ page }) => {
  // Login
  await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/login');

  await page.getByLabel('Email').fill('e2e-test@example.com');
  await page.getByLabel('Password').fill('test-password');

  await page.getByRole('button', { name: 'Login' }).click();

 
});