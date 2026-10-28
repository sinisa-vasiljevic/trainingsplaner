# Trainingsplaner – Firebase-Endversion

## Enthalten
- `app.js` – Firebase Authentication + Cloud Firestore
- `config.js` – echte Konfiguration des Projekts `trainingsplaner-a3f4f` und Master-UID
- `firestore.rules` – Sicherungsstand der bereits veröffentlichten Regeln

## Auf GitHub ersetzen
1. `app.js` vollständig ersetzen.
2. `config.js` vollständig ersetzen.
3. Vorhandene `index.html`, `styles.css`, `manifest.json`, Icons und GitHub-Workflow unverändert lassen.
4. In `sw.js` den Cache-Namen um eine Version erhöhen oder die mitgelieferte `sw.js` verwenden.

## Erster Start
1. GitHub Pages / Workflow nach dem Upload vollständig ausführen lassen.
2. Auf dem Handy die PWA einmal schließen und neu öffnen.
3. Falls noch die alte Version erscheint: Website-Daten/Cache löschen oder PWA entfernen und neu hinzufügen.
4. Mit dem in Firebase Authentication angelegten Masterkonto anmelden.
5. Beim ersten Master-Login werden drei feste Pläne sowie Teams, Plätze, Seiten und Kabinen angelegt.

## Rechte
- Angemeldete Benutzer: lesen.
- Master-UID `6qH3sJiqGQaCtO943YHaTZQe7ov2`: lesen und schreiben.
- Nicht angemeldete Personen: kein Datenzugriff.

## Testgrenze
Die Dateien wurden syntaktisch geprüft. Ein realer End-to-End-Test gegen dein Firebase-Projekt ist erst nach dem Upload über deine GitHub-Pages-Adresse möglich.
