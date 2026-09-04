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

// post endpoint testing for creating a new homework
test('should create a new homework entry', async ({ request }) => {
  const response = await request.post('http://localhost:3000/api/hws', {
    data: {
      date: '2026-09-10',
      subject: 'Math',
      task_type: 'Homework',
      notes: 'Complete exercises 1-10'
    }
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('Hw uploaded successfully');

  expect(body.hw).toMatchObject({
    date: '2026-09-10',
    subject: 'Math',
    task_type: 'Homework',
    notes: 'Complete exercises 1-10'
  });

  expect(body.hw._id).toBeDefined();
});