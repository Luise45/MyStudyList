import { test, expect } from '@playwright/test';

test('frontend smoke test - home page and login are available', async ({ page }) => {
  await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/');

  await expect(
    page.getByRole('heading', { name: 'Welcome to MyStudyList' })
  ).toBeVisible();

  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Login', exact: true })
  ).toBeVisible();
});

test('planner page is available', async ({ page }) => {
  await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws');

  await expect(page.getByText('DUE DATE')).toBeVisible();
  await expect(page.getByText('SUBJECT')).toBeVisible();
});

test('create task page is available', async ({ page }) => {
  await page.goto('https://project-c5432009-c36e-4cb8-b23.web.app/hws/create');

  await expect(
    page.getByRole('heading', { level: 2, name: 'Add a new task' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Add task' })
  ).toBeVisible();
});