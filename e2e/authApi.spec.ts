import { test, expect } from '@playwright/test';
// test suite
test.describe('Authentication API', () => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = 'test-password-123';
const API_URL = 'http://127.0.0.1:5000';

// test for the registration endpoint
test('POST /auth/register registers a new user', async ({ request }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const response = await request.post(
    `${API_URL}/api/auth/register`,
    {
      data: {
        email,
        password: 'test-password',
      },
    }
  );
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('User registered successfully');
  expect(body.user.email).toBe(email);
});

// test for the login endpoint
  test('POST /auth/login logs in a registered user', async ({ request }) => {
  const email = `login-${Date.now()}@example.com`;
  const password = 'test-password';
  const registerResponse = await request.post(
    `${API_URL}/api/auth/register`,
    {
      data: {
        email,
        password,
      },
    }
  );
  expect(registerResponse.status()).toBe(201);
  const loginResponse = await request.post(
    `${API_URL}/api/auth/login`,
    {
      data: {
        email,
        password,
      },
    }
  );
  expect(loginResponse.status()).toBe(200);
  const body = await loginResponse.json();
  expect(body.message).toBe('Login successful');
  expect(body.token).toBeTruthy();
});
});