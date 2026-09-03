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

```bash
cd backend
npm test

---
### Preview
---
Homepage

<img width="1640" height="912" alt="Screenshot (27)" src="https://github.com/user-attachments/assets/24f5c117-737e-4911-b126-b1f1c799893b" />

---
List & Add Tasks

<img width="1305" height="896" alt="Screenshot (28)" src="https://github.com/user-attachments/assets/5858732e-e1b6-4db7-8fcc-b1056b83da63" />


---

###  KI & Tools

- Codex = Projektplanung, Code Optimierung (Frontend & Backend), README, Bootstrap-Hilfe, list css, create css

---

###  Autorin

Luise Tabatt



