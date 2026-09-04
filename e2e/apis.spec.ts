import { test, expect } from '@playwright/test';

// post endpoint testing for creating a new homework
test('should create a new homework entry', async ({ request }) => {
  const response = await request.post('http://localhost:5000/hws', {
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
  expect(body.hw.subject).toBe('Math');
  expect(body.hw.task_type).toBe('Homework');
  expect(body.hw.notes).toBe('Complete exercises 1-10');

  // cleanup
  await request.delete(
    `http://localhost:5000/hws/${body.hw._id}`
  );
});


// GET endpooint testing
  test('GET / - returns all HW entries', async ({ request }) => {
    const response = await request.get('http://localhost:5000/hws');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });


  // GET endpoint testing by id 
  test('GET /:id - returns one HW entry', async ({ request }) => {
    const allResponse = await request.get('http://localhost:5000/hws');
    expect(allResponse.status()).toBe(200);
    const allHw = await allResponse.json();
    expect(allHw.length).toBeGreaterThan(0);
    const id = allHw[0]._id;
    const response = await request.get(`http://localhost:5000/hws/${id}`);

    expect(response.status()).toBe(200);

    const hw = await response.json();

    expect(hw._id).toBe(id);
  });

  // Get hw by id to error
    test('GET /:id - returns 404 when HW does not exist', async ({
    request,
  }) => {
    const nonExistingId = '000000000000000000000000';
    const response = await request.get(
      `http://localhost:5000/hws/${nonExistingId}`
    );
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({
      message: 'Hw not found',
    });
  });

