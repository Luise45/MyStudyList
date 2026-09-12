# MyStudyList 

![Databse Diagram ](https://img.shields.io/badge/Node/Express-blue)
![Databse Diagram ](https://img.shields.io/badge/Angular-yellow)
![Databse Diagram ](https://img.shields.io/badge/MongoDB-green)
![CI Pipeline](https://github.com/Luise45/MyStudyList/actions/workflows/ci.yml/badge.svg)




**MyStudyList** ist ein digitaler Hausaufgabenplaner, mit dem man alle Aufgaben effizient verwalten kann. Die App richtet sich an Schüler\*innen und Studierende und unterstützt dabei, das Lernen einfach und strukturiert zu planen.

---

##  Features

- **CRUD-Funktionalität** – Aufgaben erstellen, anzeigen und löschen  
- **MongoDB-Datenbank** – Speicherung aller Einträge über MongoDB Compass  
- **Visuelles Feedback** – Aktionen wie das Löschen werden durch Bootstrap-Toasts bestätigt  
- **Motivations-Emojis** – Aufgaben können mit Emojis versehen werden  
- **Suchfunktion** – Aufgaben nach Datum oder Fach/Modul filtern  

---

##  Verwendete Technologien

| Bereich    | Technologie                            |
|------------|----------------------------------------|
| Frontend   | Angular CLI v20.0.5                    |
| Backend    | Node.js v22.15.1, Express.js           |
| Datenbank  | MongoDB Compass v6.0.24                |
| Styling    | Bootstrap 5                            |

--- 

## Deployment

The frontend is hosted with Firebase Hosting, while the backend API runs as a containerized service on Google Cloud Run. The MongoDB database remains hosted on MongoDB Atlas.

### Manual Deployment Workflow
At the moment, deployment is performed manually in Google Cloud terminal: 
```bash
cd MyStudyList
git pull
```

Backend:
```bash
cd backend
gcloud run deploy mystudylist-backend \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated
```

Frontend:
```bash
cd frontend
npm ci
npm run build
firebase deploy --only hosting
```

Everything is available on: 
- Frontend: https://project-c5432009-c36e-4cb8-b23.web.app
- Backend: https://mystudylist-backend-612429176168.europe-west1.run.app
- Backend API: https://mystudylist-backend-612429176168.europe-west1.run.app/api/hws

--- 

## Testing

Automated backend tests are implemented using **Jest** and **Supertest**.

### Backend Unit Tests

The unit tests verify the `Hw` data model and its validation rules. The following cases are tested:

- valid homework entries
- missing subject (`subject`)
- missing date (`date`)
- missing task type (`task_type`)
- optional notes
- correct assignment of provided values

### Backend Integration Tests

The integration tests verify the interaction between Express, the API routes, Mongoose, and an isolated MongoDB test database.

The following endpoints and scenarios are tested:

- `POST /api/hws`
- `GET /api/hws`
- `GET /api/hws/:id`
- `DELETE /api/hws/:id`
- error cases such as non-existing or invalid IDs

The integration tests use **MongoDB Memory Server** as an isolated temporary test database. This prevents test data from being written to or deleted from the production database.

### Health Check

The endpoint

`GET /health`

checks whether the backend is connected to the database.

It returns status `200` when the database is connected and status `503` when the database is unavailable.

### Test Coverage

Backend test coverage is measured using **Jest Coverage**.

The current backend test coverage is:

- Statements: **91.02%**
- Branches: **100%**
- Functions: **100%**
- Lines: **90.9%**

A global minimum coverage threshold of **80%** is configured for statements, branches, functions, and lines. If the coverage falls below this threshold, the coverage check fails.

Run the backend tests:

```bash
npm test --prefix backend -- --runInBand
```

Run the backend tests with coverage:

```bash
npm run test:coverage --prefix backend -- --runInBand
```

### Authentication Tests

Authentication is covered by unit and integration tests.

The tests verify:

- user model validation
- successful user registration
- password hashing
- handling of duplicate email addresses
- successful login and JWT creation
- incorrect passwords
- unknown users
- missing login or registration credentials

The authentication integration tests use **MongoDB Memory Server** to provide an isolated test database.

### Continuous Integration

The backend tests and coverage check are integrated into the **GitHub Actions CI pipeline**.

When the CI workflow is triggered, GitHub Actions automatically installs the required dependencies and runs the backend tests including the coverage check. If a test fails or the coverage falls below the configured threshold, the backend CI job fails.


### Frontend Unit Tests
Our frontend is tested using **Jasmine** and **Karma**. We focus on isolated unit tests for components and services:
- **Services:** HTTP requests are intercepted and mocked using `HttpTestingController`
- **Components:** Services are mocked using spies, and a minimal router is provided for testing

**Frontend Test Coverage:**
We currently maintain a **98% code coverage** across the frontend:
- **Statements:** 98.36%
- **Branches:** 78.57%
- **Lines:** 98.27%
- **Functions:** 96.29%

### Running Tests Locally
There are two ways to run the frontend tests, depending on your goal:

**1. Development Mode (Watch Mode)**
```bash
cd frontend
npm run test
```

**2. CI Mode (Single Run & Coverage)**

This is the exact command used in our GitHub Actions pipeline. It is much faster, does not open a visible browser, and generates the coverage report:
```bash
cd frontend
npx ng test --watch=false --browsers=ChromeHeadless --no-progress --code-coverage
```

### e2e Tests

For the end-to-end testing of the homework planner, **Playwright** was used. The purpose of these tests was to verify that important parts of the homework planner work correctly.

#### API Testing
Playwright tests exist for the get, post and delete endpoints of the homework planning function. These tests send HTTP requests directly to the backend and check whether the server returns the expected status codes and data. For those test a mongoDB test database is used. 
The tests include: 
- creating homework, 
- retrieving homework entries or a specific one by id, 
- handling non existing homework entry
- deleting a homework entry. 

#### Frontend Testing
Playwright was also used to test important elements and navigation on the homepage, the planner page and the create new entry page. These tests open the deployed application in a browser and interact with it in a similar way to a real user. The tests mainly check that buttons are available and clickable, the table headings are displayed, the headings of pages show and that search fields are visible. The frontend tests are executed against the deployed version of the application.

#### Test Environment
For the API tests, Playwright is configured to automatically start the backend using: npm run start:test
The test server runs locally on port 5000. 

Start tests: 
```bash
npx playwright test
```

---
## Continuous Integration (CI) Pipeline

To ensure code quality, prevent regressions, and automate our workflow, we have implemented a **GitHub Actions** CI pipeline. It triggers automatically on every push to `main` or `dev`, and on every Pull Request targeting `main`.

### Pipeline Jobs
1. **Frontend Tests:** Sets up Node.js, installs dependencies, runs Angular unit tests with coverage reporting, and automatically uploads the coverage report as a downloadable artifact for review.
2. **Backend Tests:** Sets up Node.js, installs dependencies, and runs Jest tests sequentially (`--runInBand`) to ensure stability and prevent Out-Of-Memory errors in the CI environment.


### Smoke Tests

Smoke tests are used to quickly verify whether the most important parts of the application are available and working.

#### Backend Smoke Tests

The backend smoke tests use Jest, Supertest and MongoDB Memory Server to verify critical backend functionality:

- `GET /health` verifies that the backend and database are available.
- `GET /api/hws` verifies that the homework API is reachable.
- `POST /api/hws` verifies that a homework entry can be created.
- `POST /api/auth/login` verifies that the login API is reachable.
- `POST /api/auth/register` verifies that the registration API is reachable.

Run the backend smoke tests with:

```bash
cd backend
npm test -- --runInBand smoke.test.js
```

#### Frontend Smoke Tests

The frontend smoke tests use Playwright and run against the deployed application. They verify that:

- the home page and login form are available
- the planner page (`/hws`) is available
- the create task page (`/hws/create`) is available

Run the frontend smoke tests with:

```bash
npx playwright test --config=playwright.smoke.config.js
```

Currently, all smoke tests are passing:

- **5 backend smoke tests**
- **3 frontend smoke tests**

Smoke tests only cover the most important functionality and do not replace the existing unit, integration or end-to-end tests.

### Flaky Test Strategy

A flaky test is a test that sometimes passes and sometimes fails without a relevant change in the application code.

To keep our automated tests stable and reliable, we use the following strategy:

- **Test isolation:** Tests should be independent from each other. Each test should create the data it needs and clean it up afterwards.

- **Isolated test database:** Backend integration tests use `mongodb-memory-server` as a temporary MongoDB test database. Test data is removed after each test so that tests do not influence each other.

- **Sequential backend execution:** Jest backend tests are executed with `--runInBand`. This runs the tests sequentially and reduces possible conflicts when using the temporary MongoDB environment.

- **Mocked frontend dependencies:** Angular unit tests use mocked dependencies and Angular testing utilities such as `provideHttpClientTesting()` to reduce dependencies on the real backend and external services.

- **Reduced parallel execution in CI:** Playwright uses one worker in CI to reduce conflicts caused by parallel test execution.

- **Retries in CI:** Playwright allows up to two retries in the CI environment. Retries are used only as a safety mechanism and are not considered a permanent solution for unstable tests.

- **Avoid fixed waiting times:** Playwright tests should wait for actual conditions, such as an element becoming visible or a URL changing, instead of using fixed waiting times.

- **Independent test data:** API tests should create the data they require themselves and clean it up afterwards instead of depending on an existing database state.

- **External dependencies:** Some E2E tests run against the deployed application. Network, hosting or loading issues should therefore also be considered when investigating inconsistent failures.

#### Handling a Flaky Test

If a test behaves inconsistently, we follow these steps:

1. Reproduce the failure.
2. Check logs and test reports.
3. Investigate timing issues, shared test data, database state, external dependencies and parallel execution.
4. Fix the underlying cause.
5. Run the test again to verify that it behaves consistently.

Retries are not considered a permanent solution. The goal is to fix the cause of flaky behavior so that failed CI tests remain reliable and meaningful.

