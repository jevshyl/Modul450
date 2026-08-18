## Übung 1


| Kaufpreis                                | Rabatt |
| ---------------------------------------- | -----: |
| < 15'000 CHF                             |    0 % |
| 15'000 CHF – 20'000 CHF (inkl. „bis zu“) |    5 % |
| > 20'000 CHF und < 25'000 CHF            |    7 % |
| ≥ 25'000 CHF                             |  8.5 % |


### Abstrakte Testfälle:

| ID | Bedingung (abstrakt)        | Erwarteter Rabatt |
| -- | --------------------------- | ----------------: |
| A1 | Kaufpreis < 15'000          |               0 % |
| A2 | Kaufpreis = 15'000          |               5 % |
| A3 | 15'000 < Kaufpreis < 20'000 |               5 % |
| A4 | Kaufpreis = 20'000          |               5 % |
| A5 | 20'000 < Kaufpreis < 25'000 |               7 % |
| A6 | Kaufpreis = 25'000          |             8.5 % |
| A7 | Kaufpreis > 25'000          |             8.5 % |

### Konkrete Testfälle:

| ID  | Kaufpreis (CHF) | Erwarteter Rabatt |
| --- | --------------: | ----------------: |
| K1  |          10'000 |               0 % |
| K2  |          14'999 |               0 % |
| K3  |          15'000 |               5 % |
| K4  |          17'500 |               5 % |
| K5  |          20'000 |               5 % |
| K6  |          20'001 |               7 % |
| K7  |          22'000 |               7 % |
| K8  |          24'999 |               7 % |
| K9  |          25'000 |             8.5 % |
| K10 |          40'000 |             8.5 % |

---
## Übung 2

 **webseit : https://www.hertz.de/p/mietwagen/schweiz/zuerich** 

| ID | Beschreibung                                                                                                                                                                                      | Erwartetes Resultat                                                                                                                     | Effektives Resultat | Status | Mögliche Ursache |
| -- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------ | ---------------- |
| 1  | Buchungsformular mit gültigen Daten ausfüllen: Mietstation „Zürich Flughafen“, Rückgabestation identisch, Abholdatum morgen , Rückgabedatum übermorgen +, Alter „25+“, dann „Reservieren“ klicken | Weiterleitung zur Fahrzeugübersicht mit verfügbaren Fahrzeugen und Preisen für den gewählten Zeitraum                                   |                     |Erfolg        |                  |
| 2  | Rückgabedatum vor dem Abholdatum wählen (z. B. Abholdatum heute + 10, Rückgabedatum heute + 7) und „Reservieren“ klicken                                                                          | Fehlermeldung wird angezeigt, Formular wird nicht abgeschickt, keine Fahrzeugliste erscheint                                            |                     |        |                  |
| 3  | Checkbox „Anderer Abgabeort“ aktivieren, als Abholort „Zürich-Hauptbahnhof“ und als Rückgabeort „Zürich Flughafen“ wählen                                                                         | Buchung wird als Einwegmiete akzeptiert; auf der Ergebnisseite/Preisübersicht wird ein Hinweis auf die Einweggebühr angezeigt           |                     |        |                  |
| 4  | Altersgruppe „21–24“ statt „27+“ auswählen, restliche Angaben gültig lassen und „Reservieren“ klicken                                                                                             | Fahrzeugliste bzw. Preisübersicht zeigt einen Jungfahrer-Zuschlag an bzw. schränkt bestimmte Fahrzeugklassen für diese Altersgruppe ein |                     |        |                  |
| 5  | Im Feld „CDP-Nummer eingeben“ bzw. „Promotions-Code eingeben“ einen offensichtlich ungültigen Code eintragen und „Anwenden“ klicken                                                               | Fehlermeldung „Code ungültig“ (o. Ä.) erscheint; es wird kein Rabatt auf den angezeigten Preis angewendet                               |                     |        |                  |


