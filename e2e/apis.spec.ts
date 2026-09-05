import { test, expect } from '@playwright/test';


// post endpoint testing for creating a new homework
test('should create a new homework entry', async ({ request }) => {
  const response = await request.post('http://127.0.0.1:5000/api/hws', {
    data: {
      date: '2026-09-10',
      subject: 'Math',
      task_type: 'Test',
      notes: 'Complete exercises 1-10'
    }
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('Hw uploaded successfully');
  expect(body.hw.subject).toBe('Math');
  expect(body.hw.task_type).toBe('Test');
  expect(body.hw.notes).toBe('Complete exercises 1-10');
});


// GET endpooint testing
  test('GET / - returns all HW entries', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:5000/api/hws');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });


  // GET endpoint testing by id 
  test('GET /:id - returns one HW entry', async ({ request }) => {
    const allResponse = await request.get('http://127.0.0.1:5000/api/hws');
    expect(allResponse.status()).toBe(200);
    const allHw = await allResponse.json();
    expect(allHw.length).toBeGreaterThan(0);
    const id = allHw[0]._id;
    const response = await request.get(`http://127.0.0.1:5000/api/hws/${id}`);
    expect(response.status()).toBe(200);
    const hw = await response.json();
    expect(hw._id).toBe(id);
  });

  // Get hw by id to error
    test('GET /:id - returns 404 when HW does not exist', async ({request,}) => {
    const nonExistingId = '000000000000000000000000';
    const response = await request.get(
      `http://127.0.0.1:5000/api/hws/${nonExistingId}`
    );
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({message: 'Hw not found', });
  });



  
 // Delete endpoint testing
test('DELETE /:id - deletes one HW entry', async ({ request }) => {
  const createResponse = await request.post(
    'http://127.0.0.1:5000/api/hws',
    {
      data: {
        date: '2026-09-10',
        subject: 'Math',
        task_type: 'Test to Delete',
        notes: 'Complete exercises 1-10'
      }
    }
  );

  expect(createResponse.status()).toBe(201);
  const body1 = await createResponse.json();
  expect(body1.message).toBe('Hw uploaded successfully');
  expect(body1.hw.subject).toBe('Math');
  expect(body1.hw.task_type).toBe('Test to Delete');
  expect(body1.hw.notes).toBe('Complete exercises 1-10');
  const id = body1.hw._id;
  expect(id).toBeTruthy();
  const deleteResponse = await request.delete(
    `http://127.0.0.1:5000/api/hws/${id}`
  );

  expect(deleteResponse.status()).toBe(200);
  const body = await deleteResponse.json();
  expect(body.message).toBe('HW deleted successfully');
});