# Trainingsplan Fußball – PWA

Mobile PWA mit drei festen Trainingsplänen, Master-/Benutzerrolle und Firebase/Firestore.

## Enthalten
- Drei feste Pläne, unabhängig von Datum und Kalenderwoche
- Wochenansicht Montag bis Sonntag und Tagesansicht „Heute“
- Pflichtdaten: Team, Zeit, Platz, Seite, Kabine
- Master kann Trainings und Stammdaten bearbeiten sowie den aktiven Plan wechseln
- Benutzer lesen den freigegebenen Plan
- WhatsApp-Text je Mannschaft
- PWA-Icon ohne weißen Außenrand
- GitHub-Pages-Workflow
- Firestore-Regeln
- sichere Cloud Function zur Rollenvergabe

## Sofort testen
`config.js` steht zunächst auf `demoMode: true`. Die Demo läuft ohne Firebase und zeigt alle Funktionen lokal. Demo-Änderungen werden nicht dauerhaft gespeichert.

## Firebase verbinden
1. Firebase-Projekt erstellen.
2. Authentication > Anmeldemethode > E-Mail/Passwort aktivieren.
3. Firestore Database erstellen.
4. Web-App registrieren und die SDK-Konfiguration nach `config.js` kopieren.
5. In `config.js` `demoMode: false` setzen.
6. Regeln bereitstellen: `firebase deploy --only firestore:rules`.
7. Functions-Abhängigkeiten installieren und bereitstellen: `cd functions && npm install && cd .. && firebase deploy --only functions`.

## Ersten Master setzen
Der erste Master muss einmalig in einer vertrauenswürdigen Admin-Umgebung gesetzt werden. Niemals einen Service-Account-Schlüssel in GitHub hochladen.

Beispiel mit Firebase Admin SDK:
```js
const admin = require('firebase-admin');
admin.initializeApp({credential: admin.credential.cert(require('./service-account.json'))});
admin.auth().setCustomUserClaims('FIREBASE_UID', {role: 'master'});
```
Danach abmelden und erneut anmelden, damit das Token aktualisiert wird.

## Startdaten in Firestore
Mindestens anlegen:
- `settings/global` mit `{ activePlan: "plan1", appName: "Trainingsplan" }`
- `plans/plan1`, `plans/plan2`, `plans/plan3` jeweils mit `name`, `active: true`, `sortOrder`
- Teams, Plätze, Seiten und Kabinen können anschließend in der Master-Oberfläche angelegt werden.

## GitHub Pages
Repository-Inhalt hochladen, Branch `main` verwenden und unter Settings > Pages als Quelle „GitHub Actions“ wählen. Der Workflow `.github/workflows/pages.yml` übernimmt die Veröffentlichung.

## Sicherheitsgrenze
Die Rollenänderung ist serverseitig vorbereitet (`functions/setUserRole`). Die Benutzerverwaltungs-Oberfläche zum Aufruf dieser Function ist noch nicht in der PWA eingebaut. Die eigentliche Trainingsplan-App, Firestore-Regeln und Masterbearbeitung sind enthalten.

## Version 1.1.2
- Korrigierter Planabgleich: Ein neu angelegtes Training kann in jedem ausgewählten Zielplan zusätzlich angelegt werden, wenn kein identischer Eintrag vorhanden ist.
- Vorhandene andere Trainings derselben oder anderer Mannschaften werden nicht überschrieben oder gelöscht.
- Doppelbelegungen von Platz, Seite oder Kabine sind erlaubt und werden nur als Warnung angezeigt.
- Bei der Bearbeitung vorhandener Trainings erfolgt die Zuordnung weiterhin über Mannschaft, bisherigen Wochentag und bisherigen Zeitraum von/bis.


## Version 1.1.3
- Korrektur Planabgleich: Ist das Quelltraining bereits gespeichert/bearbeitet und fehlt im Zielplan vollständig, kann es dort jetzt per Checkbox neu angelegt werden.
- Damit funktioniert die Übernahme auch dann, wenn das Training bereits in einem früheren Versuch nur im Quellplan gespeichert wurde.
- Andere Trainings werden nicht überschrieben oder gelöscht; Doppelbelegungen bleiben Warnungen.


### Version 1.2.0
- Neuer Reiter „Spiele“ für alle anstehenden VfR-Spiele.
- Liest `spiele-live.json` und `manuelle-spiele.json` aus dem Heimspielplaner-Repository ausschließlich lesend.
- Sortierung pro Datum: zuerst Heimspiele nach Uhrzeit, anschließend Auswärtsspiele nach Uhrzeit.
- Keine Mannschaftsfilter oder Mannschaftsblöcke.
- Die bestehende Trainingsplan-, Benutzer-, Planabgleich- und Firebase-Logik bleibt unverändert.
