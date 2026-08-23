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

# Funktionale Black-Box Testfälle – Hertz Mietwagen Schweiz

**Plattform:** [https://www.hertz.de/p/mietwagen/schweiz](https://www.hertz.de/p/mietwagen/schweiz)  
**Erstellt am:** 23.08.2026  
**Modul:** M450 – Testing

---

## Übersicht

Die folgenden 5 funktionalen Black-Box Testfälle decken die wichtigsten Benutzerfunktionen der Hertz Mietwagen-Plattform für die Schweiz ab. Bei Black-Box Tests wird die interne Implementierung nicht betrachtet – getestet wird ausschliesslich das beobachtbare Verhalten aus Sicht des Benutzers (Eingabe → erwartete Ausgabe).

---

## Testfälle

| ID | Beschreibung | Erwartetes Resultat | Effektives Resultat | Status | Mögliche Ursache |
|----|-------------|-------------------|-------------------|--------|-----------------|
| 1 | **Seite korrekt laden:** Die URL `https://www.hertz.de/p/mietwagen/schweiz` wird im Browser aufgerufen. | Die Seite lädt vollständig: Das Hertz-Logo, die Navigation (Buchen, Manage, Angebote, Standorte, Support, Geschäftlich, Hertz Gold+), das Hero-Banner „Mietwagen Schweiz", das Buchungswidget mit Eingabefeldern und die Städte-/Flughafen-Karten werden korrekt angezeigt. Ladezeit unter 5 Sekunden. | *Offen – noch nicht getestet* | ⬜ Offen | CDN-Server nicht erreichbar; CSS/JS-Dateien blockiert; DNS-Auflösung fehlgeschlagen |
| 2 | **Fahrzeugreservierung mit gültigen Daten durchführen:** Im Buchungswidget wird „Zürich Flughafen" als Abholort eingegeben, ein Abholdatum 7 Tage in der Zukunft mit Uhrzeit 10:00, ein Rückgabedatum 10 Tage in der Zukunft mit Uhrzeit 14:00 und Alter „27+" ausgewählt. Anschliessend wird der Button „Reservieren" geklickt. | Das System leitet den Benutzer zur Fahrzeugauswahl-Seite weiter (`hertz.de/rentacar/reservation/...`). Es werden verfügbare Fahrzeugkategorien mit Preisen für den gewählten Zeitraum in der Schweiz angezeigt. Keine Fehlermeldung erscheint. | *Offen – noch nicht getestet* | ⬜ Offen | API-Backend (Reservierungssystem) nicht erreichbar; Autocomplete-Service für Standorte defekt; Session-/Cookie-Probleme |
| 3 | **Validierung bei fehlenden Pflichtfeldern:** Im Buchungswidget wird der Button „Reservieren" geklickt, ohne einen Abholort einzugeben (alle anderen Felder bleiben auf Standardwerten). | Eine Fehlermeldung wird angezeigt, z. B. „Bitte wählen Sie eine Anmietstation". Die Seite bleibt auf dem Buchungsformular, es erfolgt keine Weiterleitung. Das fehlende Feld wird visuell hervorgehoben (z. B. roter Rahmen). | *Offen – noch nicht getestet* | ⬜ Offen | Client-seitige Validierung deaktiviert; JavaScript-Fehler verhindert Validierungslogik; Fehlermeldungs-Label nicht korrekt lokalisiert |
| 4 | **Standort-Navigation – Stadt in der Schweiz auswählen:** In der Sektion „Grossstädte in Schweiz" wird auf die Karte „Basel" geklickt. | Die Seite navigiert korrekt zur URL `/p/mietwagen/schweiz/basel`. Die Basel-Seite wird geladen mit stadttspezifischen Informationen, einem Hero-Banner für Basel und einem Buchungswidget. Der Breadcrumb zeigt: Hauptseite > Mietwagen > Schweiz > Basel. | *Offen – noch nicht getestet* | ⬜ Offen | Broken Link (404-Fehler); Routing-Fehler im CMS; Bild-Assets für Basel nicht verfügbar |
| 5 | **Abweichenden Rückgabeort aktivieren und korrekt nutzen:** Im Buchungswidget wird die Checkbox „Anderer Abgabeort" aktiviert. | Es erscheint ein zusätzliches Eingabefeld „Ort der Rückgabestation". In dieses Feld kann ein anderer Standort (z. B. „Genf Flughafen") eingegeben werden, und der Autocomplete schlägt passende Schweizer Hertz-Standorte vor. Bei der Reservierung werden Abhol- und Rückgabeort getrennt an das Backend übermittelt. | *Offen – noch nicht getestet* | ⬜ Offen | Checkbox-Event-Listener nicht gebunden; CSS-Klasse `d-none` wird nicht korrekt entfernt; Einwegmiete in der Schweiz nicht unterstützt |

---

## Legende

| Status | Bedeutung |
|--------|-----------|
| ⬜ Offen | Test noch nicht durchgeführt |
| ✅ Bestanden | Effektives Resultat entspricht dem erwarteten Resultat |
| ❌ Fehler | Abweichung zwischen erwartetem und effektivem Resultat |
| ⚠️ Teilweise | Teilweise bestanden, mit Einschränkungen |



---
## Übung 3:

### 1. Black-Box Testfälle (System- & Benutzertests)

| **ID** | **Testbereich & Input** | **Erwartetes Resultat** | **Effektives Resultat** | **Status** | **Mögliche Ursache (bei Fehler / Warnung)** |
|---|---|---|---|---|---|
| **BB-01** | **Kontoauswahl (Gültig)**<br>Eingabe: `1` im Hauptmenü | Details von Konto 1 werden angezeigt, Wechsel in das Konto-Aktionsmenü. | Konto 1 Details (z. B. Rockefeller, 1500.00 USD) werden ausgegeben; Aktionsmenü öffnet sich. | **PASSED** | – |
| **BB-02** | **Kontoauswahl (Nicht vorhanden)**<br>Eingabe: `999` | Fehlermeldung `"Ein Konto mit dieser Nummer ist nicht vorhanden!"`, Hauptmenü bleibt aktiv. | Fehlermeldung wird ausgegeben, Hauptmenü bleibt aktiv. | **PASSED** | – |
| **BB-03** | **Kontoauswahl (Ungültiges Format)**<br>Eingabe: `xyz` | Meldung `"! Ungültige Eingabe..."`, erneute Hauptmenü-Aufforderung. | Ausgabe: `"! Ungültige Eingabe: Bitte eine Zahl, "a", "e", "u" oder "q" eingeben!"` | **PASSED** | – |
| **BB-04** | **Kontoliste anzeigen**<br>Eingabe: `a` | Übersicht aller existierenden Konten mit Nummer, Name und Währung wird ausgegeben. | Liste aller 5 Standard-Konten wird korrekt angezeigt. | **PASSED** | – |
| **BB-05** | **Konto erstellen (Gültig)**<br>Eingabe: `e` → Name: `"Müller"` → Währung: `"CHF"` | Neues Konto (Startguthaben `0.00 CHF`) wird erstellt mit neuer Kontonummer (z. B. `6`). | Konto 6 für Müller (0.00 CHF) wird angelegt und Details ausgegeben. | **PASSED** | – |
| **BB-06** | **Konto erstellen (Unbekannte Währung)**<br>Eingabe: `e` → Name: `"Müller"` → Währung: `"JPY"` | Währungseingabe wird abgelehnt oder mit expliziter Validierungsfehlermeldung quittiert. | Konto wird automatisch mit Währung `"USD"` erstellt; Ausgabe: `"! Die eingegebene Währung ist nicht bekannt, es wird USD verwendet."` | **WARN** | Regex `^[A-Z]{3}$` akzeptiert beliebige 3-stellige Codes. `switch`-Anweisung in **Counter.createAccount** nutzt stummen Fallback auf USD statt Validierungsfehler. |
| **BB-07** | **Einzahlung (Positiv)**<br>Eingabe im Kontomenü: `e` → Betrag: `150.50` | Kontostand erhöht sich um `150.50`, neuer Stand wird angezeigt. | Guthaben erhöht sich korrekt, neuer Kontostand wird angezeigt. | **PASSED** | – |
| **BB-08** | **Einzahlung (Negativer Betrag)**<br>Eingabe im Kontomenü: `e` → Betrag: `-50.00` | Fehlermeldung, dass negative Einzahlungen unzulässig sind. | Betrag `-50.00` wird akzeptiert und verringert das Guthaben! | **FAILED** | In **Account.deposit(double amount)** fehlt die Prüfung `if (amount <= 0)`. `balance += amount` zieht bei negativen Werten Beträge ab. |
| **BB-09** | **Abhebung (Guthaben ausreichend)**<br>Eingabe im Kontomenü: `a` → Betrag: `50.00` | Guthaben verringert sich um `50.00`, neuer Stand wird angezeigt. | Guthaben sinkt um 50.00, neuer Stand wird angezeigt. | **PASSED** | – |
| **BB-10** | **Abhebung (Konto überziehen)**<br>Eingabe im Kontomenü: `a` → Betrag: `99999.00` | Fehlermeldung `"! Kontostand zu niedrig..."`, Guthaben bleibt unverändert. | Exception wird gefangen, Fehlermeldung ausgegeben, Guthaben bleibt unverändert. | **PASSED** | – |
| **BB-11** | **Überweisung (Gleiche Währung)**<br>Eingabe im Kontomenü: `ü` → Zielkonto: `4` → Betrag: `50.00` | 50.00 EUR wird vom Quellkonto abgezogen und auf Zielkonto gutgeschrieben. | Betrag wird korrekt abgezogen und beim Zielkonto gutgeschrieben. | **PASSED** | – |
| **BB-12** | **Überweisung (Währungsumrechnung USD → CHF)**<br>Eingabe im Kontomenü: `ü` → Zielkonto: `3` (CHF) → Betrag: `100.00` (USD) | Betrag wird umgerechnet (Faktor 1.11 → 111.00 CHF) und Zielkonto gutgeschrieben. | 100 USD abgezogen, 111 CHF auf Zielkonto verbucht. | **PASSED** | – |
| **BB-13** | **Überweisung (Fehlende Währungsumrechnung EUR → CHF)**<br>Eingabe im Kontomenü: `ü` von EUR-Konto auf CHF-Konto → Betrag: `100.00` | Korrekte Umrechnung oder Fehlermeldung. | Meldung `"! Es wurde keine Umrechnung vorgenommen."`, 100 EUR wird 1:1 als 100 CHF verbucht! | **FAILED** | In **Counter.convertCurrency** fehlen Bedingungen für `EUR → CHF` und andere Kombinationen. Es greift der Fallback `return amount;`. |
| **BB-14** | **Überweisung (Auf eigenes Konto)**<br>Eingabe im Kontomenü: `ü` → Zielkonto: eigene Kontonummer | Fehlermeldung, dass Überweisung auf sich selbst nicht erlaubt ist. | Meldung `"! Bitte ein anderes Konto als das momentane Konto auswählen!"`. | **PASSED** | – |
| **BB-15** | **Konto löschen (Bestätigt)**<br>Eingabe im Kontomenü: `l` → Bestätigung: `j` | Konto wird aus der Bank gelöscht. | Meldung `"Konto mit Nummer X wurde gelöscht."`, Konto erscheint nicht mehr in der Liste `a`. | **PASSED** | – |
| **BB-16** | **Konto löschen (Abgebrochen)**<br>Eingabe im Kontomenü: `l` → Bestätigung: `n` | Löschung wird abgebrochen, Konto bleibt erhalten. | Meldung `"! Aktion abgebrochen."`, Konto bleibt voll funktionsfähig. | **PASSED** | – |
| **BB-17** | **Wechselkurs-Abfrage (API)**<br>Eingabe: `w` → `"CHF USD"` | Live-Wechselkurs wird via Web-API abgefragt und ausgegeben. | Bei Netzwerkverbindung Kurs z. B. `1 CHF = 1.15 USD`; bei API-Fehler `"! Error bei der Abfrage..."`. | **PASSED / WARN** | API-Aufruf hängt von externem Dienst und hartcodiertem API-Key ab (`ExchangeRateOkhttp.java:L28`). |
| **BB-18** | **Beenden**<br>Eingabe: `q` | Programm beendet sich sauber mit Abschiedsgruss. | Ausgabe `"Auf Wiedersehen!"`, Anwendung wird beendet. | **PASSED** | – |


### 2. White-Box Testfälle (Code- & Unit-Tests):

White-Box-Tests testen gezielt einzelnen Code-Pfade, Methoden, Grenzwerte und Ausnahmebedingungen auf Klassenebene (z. B. mit **JUnit**).

#### A. [Account.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Account.java)
- **[deposit(double amount)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Account.java#L40-L42)**:
  - Positiver Betrag erhöht `balance` korrekt.
  - Test mit `0.0` und negativen Zahlen (sollte Exception werfen / abgelehnt werden).
- **[withdraw(double amount)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Account.java#L49-L56)**:
  - *Pfad 1 (`amount <= balance`)*: Gibt `true` zurück, `balance` wird reduziert.
  - *Pfad 2 (`amount > balance`)*: Gibt `false` zurück, `balance` bleibt unverändert.
  - *Äquivalenzklassen / Grenzen*: `amount == balance` (Exakter Kontostand), `amount = balance + 0.01` (1 Cent zu viel).

#### B. [Bank.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Bank.java)
- **[createAccount(String name, Currency currency, double startBalance)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Bank.java#L13-L17)**:
  - Fügt der internen Liste `accounts` ein neues Konto hinzu und erhöht `getNumberOfAccounts()`.
- **[getAccount(int nr)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Bank.java#L31-L42)**:
  - Gültige ID liefert das passende `Account`-Objekt zurück.
  - Nicht existierende ID liefert `null` zurück.
- **[deleteAccount(Account a)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Bank.java#L23-L29)**:
  - Entfernt das Objekt erfolgreich aus der Liste `accounts`.

#### C. [Counter.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Counter.java)
- **[convertCurrency(...)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Counter.java#L241-L261)**:
  - Umrechnung `USD -> CHF`: prüft Multiplikation mit `1.11`.
  - Umrechnung `USD -> EUR`: prüft Multiplikation mit `0.91`.
  - Umrechnung `CHF -> USD`: prüft Multiplikation mit `0.90`.
  - Unbekannte/nicht unterstützte Kombination (z.B. `EUR -> CHF`): gibt den Betrag unverändert zurück und druckt eine Warnung.

#### D. [ExchangeRateOkhttp.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/ExchangeRateOkhttp.java)
- **[getExchangeRate(String currencyFrom, String currencyTo)](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/ExchangeRateOkhttp.java#L23-L42)**:
  - Mocking der HTTP-Antwort (z. B. mit Mockito oder MockWebServer) zur Überprüfung des JSON-Parsings via `Gson`.

| **Methode / Code-Stelle** | **Testfall (White-Box)** | **Erwartetes Code-Verhalten** | **Reales Code-Verhalten** | **White-Box Ergebnis** |
|---|---|---|---|---|
| **Account.deposit(amount)** | `amount = 100.0` | `balance` erhöht sich um 100. | `balance` wird um 100 erhöht. | **PASSED** |
| **Account.deposit(amount)** | `amount = -50.0` | `IllegalArgumentException` werfen. | `balance` sinkt um 50 (negativer Wert wird addiert). | **FAILED** (Bug in Validierung) |
| **Account.withdraw(amount)** | `amount <= balance` | Methode gibt `true` zurück, `balance` sinkt. | Gibt `true` zurück, `balance` sinkt korrekt. | **PASSED** |
| **Account.withdraw(amount)** | `amount > balance` | Methode gibt `false` zurück, `balance` bleibt. | Gibt `false` zurück, `balance` bleibt unverändert. | **PASSED** |
| **Bank.getAccount(nr)** | Existierende ID (z. B. `1`) | Gibt passendes `Account`-Objekt zurück. | Objekt mit ID 1 wird zurückgegeben. | **PASSED** |
| **Bank.getAccount(nr)** | Nicht-existierende ID (`99`) | Gibt `null` zurück. | Schleife läuft durch und gibt `null` zurück. | **PASSED** |
| **Counter.convertCurrency(...)** | `USD → CHF` | Betrag × 1.11 zurückgeben. | Berechnet `amount * 1.11`. | **PASSED** |

  

### 3. Verbesserungsvorschläge :

