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
| 2  | Rückgabedatum vor dem Abholdatum wählen (z. B. Abholdatum übermorgen, Rückgabedatum morgen ) und „Reservieren“ klicken                                                                          | Aboldatum input wird geleert,, Fehler Meldung wird angezeigt Formular wird nicht abgeschickt ,                                            |                     |        |                  |
| 3  | Checkbox „Anderer Abgabeort“ aktivieren, als Abholort „Zürich-Hauptbahnhof“ und als Rückgabeort „Zürich Flughafen“ wählen                                                                         | Buchung wird als Einwegmiete akzeptiert; auf der Ergebnisseite/Preisübersicht wird ein Hinweis auf die Einweggebühr angezeigt           |                     |        |                  |
| 4  | Altersgruppe „21–24“ statt „27+“ auswählen, restliche Angaben gültig lassen und „Reservieren“ klicken                                                                                             | Fahrzeugliste bzw. Preisübersicht zeigt einen Jungfahrer-Zuschlag an bzw. schränkt bestimmte Fahrzeugklassen für diese Altersgruppe ein |                     |        |                  |
| 5  | Im Feld „CDP-Nummer eingeben“ bzw. „Promotions-Code eingeben“ einen offensichtlich ungültigen Code eintragen und „Anwenden“ klicken                                                               | Fehlermeldung „Code ungültig“ (o. Ä.) erscheint; es wird kein Rabatt auf den angezeigten Preis angewendet                               |                     |        |                  |

---
## Übung 3:

### 1. Black-Box Testfälle (System- & Benutzertests)

| **ID**    | **Testbereich**        | **Testfall / Input**                                                        | **Erwartetes Verhalten**                                                                                              |
| --------- | ---------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **BB-01** | Kontoauswahl           | Eingabe einer gültigen Kontonummer (z. B. `1`)                              | Details von Konto 1 werden angezeigt, Wechsel in das Konto-Aktionsmenü.                                               |
| **BB-02** | Kontoauswahl           | Eingabe einer ungültigen/nicht existierenden Nummer (z. B. `999` oder `-5`) | Fehlermeldung `"Ein Konto mit dieser Nummer ist nicht vorhanden!"`, erneute Menüaufforderung.                         |
| **BB-03** | Kontoauswahl           | Ungültige Zeicheneingabe (z. B. `xyz` oder Sonderzeichen)                   | Meldung `"! Ungültige Eingabe..."` und erneute Eingabeaufforderung.                                                   |
| **BB-04** | Kontoliste             | Eingabe `a` im Hauptmenü                                                    | Übersicht aller existierenden Konten mit Nummer, Name und Währung wird ausgegeben.                                    |
| **BB-05** | Konto erstellen        | Eingabe `e`, Name: `"Müller"`, Währung: `"CHF"`                             | Neues Konto wird erstellt (Startguthaben `0.00 CHF`), neue ID zugewiesen, Details werden ausgegeben.                  |
| **BB-06** | Konto erstellen        | Ungültiges Währungskürzel (z. B. `"JPY"` oder `"123"`)                      | Fallback-Verhalten: Warnung `"Währung nicht bekannt, es wird USD verwendet"` oder Fehlermeldung bei Formatabweichung. |
| **BB-07** | Einzahlung             | Betrag einzahlen: `150.50`                                                  | Kontostand erhöht sich um `150.50`, neuer Kontostand wird angezeigt.                                                  |
| **BB-08** | Einzahlung (Grenzfall) | Betrag einzahlen: `-50.00` oder `0.00`                                      | **Sicherheitslücke/Bug:** Applikation sollte negative Einzahlungen abweisen.                                          |
| **BB-09** | Abhebung               | Betrag abheben: `50.00` (bei ausreichendem Guthaben)                        | Guthaben verringert sich um `50.00`, neuer Stand wird angezeigt.                                                      |
| **BB-10** | Abhebung (Überziehung) | Betrag abheben, der das Guthaben übersteigt (z. B. `99999.00`)              | Fehlermeldung `"! Kontostand zu niedrig..."`, Kontostand bleibt unverändert.                                          |
| **BB-11** | Überweisung            | Überweisung auf anderes Konto (gleiche Währung)                             | Guthaben auf Quellkonto sinkt, Zielkonto-Guthaben steigt um den gleichen Betrag.                                      |
| **BB-12** | Überweisung            | Überweisung auf ein Konto mit anderer Währung (z. B. USD → CHF)             | Betrag wird mit Umrechnungskurs umgerechnet und dem Zielkonto gutgeschrieben.                                         |
| **BB-13** | Überweisung (Selbst)   | Überweisung auf die eigene Kontonummer                                      | Fehlermeldung `"! Bitte ein anderes Konto als das momentane Konto auswählen!"`.                                       |
| **BB-14** | Konto löschen          | Eingabe `l`, Bestätigung mit `j`                                            | Konto wird gelöscht. In der Kontoliste (`a`) ist es nicht mehr enthalten.                                             |
| **BB-15** | Wechselkurs-Abfrage    | Eingabe `w`, Währungspaar `"CHF EUR"`                                       | Live-Wechselkurs wird abgerufen und ausgegeben (z. B. `1 CHF = 1.04 EUR`).                                            |
| **BB-16** | Beenden                | Eingabe `q`                                                                 | Meldung `"Auf Wiedersehen!"` wird gedruckt und die Anwendung beendet sich.                                            |


