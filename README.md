# MyStudyList 

![Databse Diagram ](https://img.shields.io/badge/Node/Express-blue)
![Databse Diagram ](https://img.shields.io/badge/Angular-yellow)
![Databse Diagram ](https://img.shields.io/badge/MongoDB-green)




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

Für das Backend werden automatisierte Tests mit **Jest** und **Supertest** durchgeführt.

### Backend Unit Tests

Die Unit Tests überprüfen das `Hw`-Datenmodell und dessen Validierung, unter anderem:

- gültige Hausaufgaben
- fehlendes Fach (`subject`)
- fehlendes Datum (`date`)
- fehlender Aufgabentyp (`task_type`)
- optionale Notizen

### Backend Integration Tests

Die Integration Tests überprüfen das Zusammenspiel von Express, den API-Routen,
Mongoose und einer temporären MongoDB-Testdatenbank.

Getestete Endpunkte:

- `POST /api/hws`
- `GET /api/hws`
- `GET /api/hws/:id`
- `DELETE /api/hws/:id`
- Fehlerfälle wie nicht vorhandene oder ungültige IDs

Für die Integration Tests wird **mongodb-memory-server** verwendet. Dadurch werden
keine Testdaten in die produktive MongoDB-Datenbank geschrieben.

### Health Check

Über den Endpoint

`GET /health`

wird überprüft, ob das Backend und die Datenbankverbindung verfügbar sind.

### Test Coverage

Die Backend-Tests erreichen aktuell:

- Statements: **92,68 %**
- Branches: **100 %**
- Functions: **100 %**
- Lines: **92,5 %**

Tests ausführen:
cd backend
npm test

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

