# Benutzerverwaltung – notwendige Schritte

## 1. Firestore-Regeln zuerst aktualisieren
In Firebase > Cloud Firestore > Regeln den gesamten Inhalt durch `firestore.rules` ersetzen und **Veröffentlichen** klicken.

## 2. GitHub-Dateien ersetzen
- `app.js`
- `index.html`
- `sw.js`

`config.js`, `styles.css`, Manifest, Icons und Workflow bleiben unverändert.

## 3. Ablauf
- Master: Verwalten > Benutzer > Einladen.
- Name und E-Mail eingeben.
- Der sechsstellige Einladungscode wird angezeigt und nach Möglichkeit in die Zwischenablage kopiert.
- Benutzer öffnet die App und wählt „Erstzugang mit Einladungscode“.
- Benutzer gibt Code, dieselbe E-Mail und ein eigenes Passwort ein.
- Master kann den Zugang in der App sperren und wieder aktivieren.

## Sicherheitsmodell
- Nicht angemeldete Personen dürfen nur ein konkretes Einladungsdokument anhand des geheimen Codes abrufen, nicht alle Einladungen auflisten.
- Nur die eingeladene E-Mail darf mit dem Code ein aktives Benutzerprofil erzeugen.
- Nur der Master darf Daten ändern und Benutzer sperren/aktivieren.
- Aktive Benutzer dürfen Trainingsdaten ausschließlich lesen.

## Testgrenze
Syntax und ZIP-Struktur wurden lokal geprüft. Login, Erstzugang und Firestore-Regeln müssen nach Veröffentlichung online mit Masterkonto und einer Test-E-Mail geprüft werden.
