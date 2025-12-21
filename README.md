# Introduktion

Denna lösning är byggd i **C# .NET** (Backend), **Vite, React** och **TypeScript** (Frontend) och kan användas internt inom [FMCK](https://fmck.se/) (frivilliga motorcykelkåren) för att öva på att hitta platser med SWEREF-koordinater. Appen stödjer två typer av övningar:

- Man får koordinater och ska ange namnet på platsen (t.ex. kyrka, sjukhus etc.).

- Man får namnet på platsen och ska ange rätt koordinater.

# Komma igång

Följ stegen nedan för att få igång projektet på din lokala maskin.

## Installation

```
cd app
npm install
npm run dev

```

# Git

Vi har endast en `main`-branch. Utveckling sker i PR-brancher mot `main`.

# Inlämningsuppgift

Första version av denna lösning (dec 2025) är en inlämningsuppgift inom kursen "[DevSecOps med säkerhetsinriktning](https://www.nbi-handelsakademin.se/utbildningar/it-tech/devsecops-med-sakerhetsinriktning/)" på NBI-Handelsakademin.

## Översikt
Man ska bygga en fullstack-webbapplikation med ett REST API och sätta upp en komplett CI/CD-pipeline i GitHub Actions. Applikationens tema och omfattning väljer du själv, men den måste uppfylla de tekniska kraven nedan.

Applikationen ska lösa ett verkligt eller påhittat problem. En todo-app är godkänd, men en app med bara en resurs som heter “Item” med fältet “name” är inte tillräckligt. Din huvudresurs ska ha minst 3 fält/attribut utöver ID.

Har du en färdig app sedan tidigare - helt ok att återanvända, men skriv test- och devop-flöden för den nu!

## Tekniska krav

### Backend

Valfritt språk: Node.js, Python, C#, Java, Go, etc.

- REST API med minst 4 endpoints som implementerar:
   - GET – hämta en eller flera resurser
   - POST – skapa ny resurs
   - PUT eller PATCH – uppdatera resurs
   - DELETE – ta bort resurs

- Någon form av datalagring (databas, JSON-fil, eller in-memory med seed-data)
- Korrekt användning av HTTP-statuskoder (200, 201, 400, 404, etc.)

### Frontend

Vanilla JS/TS eller valfritt ramverk: React, Vue, Svelte, Angular

- Ska konsumera API:et och visa data för användaren
- Användaren ska kunna utföra minst 3 av 4 CRUD-operationer via gränssnittet
- Grundläggande felhantering (visa meddelande om något går fel)

### Tester
- Vitest/Jest – enhetstester för backend-logik
- Playwright/Cypress – end-to-end-tester för frontend
- Postman/Newman – API-tester
- Minimikrav: 5 meningsfulla tester som faktiskt testar applikationen inom varje testtyp.

### GitHub Actions Pipeline
- Workflow som triggas på push och/eller pull_request
- Ska köra alla tester
- Ska passera (grön bock) vid inlämning


Läs mer om uppgiften på [här](https://dsoht25d-hak.lms.nodehill.se/article/betygsgrundande-inlamningsuppgift-devops-pipeline-med-testning-av-fullstack-applikation).