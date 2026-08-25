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
| 1  | Buchungsformular mit gültigen Daten ausfüllen: Mietstation „Zürich Flughafen“, Rückgabestation identisch, Abholdatum morgen , Rückgabedatum übermorgen +, Alter „25+“, dann „Reservieren“ klicken | Weiterleitung zur Fahrzeugübersicht mit verfügbaren Fahrzeugen und Preisen für den gewählten Zeitraum                                   | Weiterleitung erfolgt, Fahrzeugliste wird korrekt mit Preisen angezeigt.|Bestanden        |                  |
| 2  | Rückgabedatum vor dem Abholdatum wählen (z. B. Abholdatum übermorgen, Rückgabedatum morgen ) und „Reservieren“ klicken                                                                          | Aboldatum input wird geleert,, Fehler Meldung wird angezeigt Formular wird nicht abgeschickt ,                                            |Rückgabedatum Engabefeld wird geleert                     |  Bestanden        |                  |
| 3  | Checkbox „Anderer Abgabeort“ aktivieren, als Abholort „Zürich-Hauptbahnhof“ und als Rückgabeort „Basel Flughafen“ wählen                                                                         | Buchung wird als Einwegmiete akzeptiert; auf der Ergebnisseite/Preisübersicht wird ein Hinweis auf die Einweggebühr angezeigt           |Weiterleitung erfolgreich, One-Way-Gebühr wird im Preisdetail korrekt aufgeführt.                     |Bestanden          |                  |
| 4  | Altersgruppe „21–24“ statt „27+“ auswählen, restliche Angaben gültig lassen und „Reservieren“ klicken                                                                                             | Fahrzeugliste bzw. Preisübersicht zeigt einen Jungfahrer-Zuschlag an bzw. schränkt bestimmte Fahrzeugklassen für diese Altersgruppe ein |  zusatzgebühr wird in preisübersicht angezeigt                |  Bestanden        |                  |
| 5 | Ungültiger Ort (Autocomplete): Eingabe eines nicht existierenden Ortes (z. B. "XYZ123") im Abholort-Feld. | Das Autocomplete-Menü zeigt eine Error an. Der Ort kann nicht ausgewählt werden, das Suchfeld markiert den Fehler. | Keine Reservierung möglich, suchfeld zeigt "This Field is required". |  Bestanden | - |

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
| **BB-08** | **Einzahlung/Abhebung (Negativer Betrag)**<br>Eingabe im Kontomenü: `e` → Betrag: `-50.00` | Fehlermeldung, dass negative Einzahlungen unzulässig sind. | Betrag `-50.00` wird akzeptiert und verringert das Guthaben! | **FAILED** | In **Account.deposit(double amount)** fehlt die Prüfung `if (amount <= 0)`. `balance += amount` zieht bei negativen Werten Beträge ab. |
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
| **BB-19** | Ungültig 2 Buchstaben: `aw` eingeben | Fehler "Ungültige Eingabe" + keine Aktion, erneute Eingabeaufforderung | Kein Fehler, `a` wird ausgeführt (`printAccountsList`), 2. Zeichen `w` wird ignoriert | **FAILED** | `Counter.java:40`: Regex `\d\|a\|e\|w\|q` ohne Anker + `matcher.find()` prüft nur, ob es irgendwo enthalten ist.<br>`Counter.java:49`: `substring(0,1)` wertet nur das 1. Zeichen aus. |
| **BB-20** | Buchstabe+Zahl: `a1` / `e5` eingeben | Fehler "Ungültige Eingabe" | Als `a`/`e` akzeptiert, Zahl wird ignoriert | **FAILED** | Gleicher Fehler: `find()` findet `a` in `a1` -> switch in `Counter.java:49` |
| **BB-21** | Edit-Menu Mehrzeichen: `editAccount()` (`Counter.java:89`). Eingabe `ab` / `wq` bei `a/e/k/ü/l/w/q` | Fehler "Ungültige Eingabe" | Kein Fehler, nur 1. Zeichen geprüft | **FAILED**| `Counter.java:105`: `substring(0,1)` wird *vor* der Validierung ausgeführt.<br>`Counter.java:108`: `Pattern.compile("[aekülwq]")` + `find()` |



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

Used tool: manage_task
Used tool: manage_task
Listed directory Java
Ran command: `$env:JAVA_HOME="C:\Program Files\Java\jdk-25"; mvn compile`

Basierend auf der Analyse des Quellcodes der Bank-Software ([Main.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Main.java), [Bank.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Bank.java), [Account.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Account.java), [Counter.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/Counter.java) und [ExchangeRateOkhttp.java](file:///c:/Users/Amiri/Documents/M450/bank-software-mvn/src/main/java/ch/tbz/bank/software/ExchangeRateOkhttp.java)) ist hier die detaillierte Zusammenstellung von Testfällen und Verbesserungsvorschlägen.

---

### 1. Black-Box Testfälle (System- & Benutzertests)

Black-Box-Tests überprüfen die Funktionalität aus der Sicht des Endbenutzers über die Konsolen-Schnittstelle, ohne Kenntnis des inneren Codes.

| ID | Testbereich | Testfall / Input | Erwartetes Verhalten |
|---|---|---|---|
| **BB-01** | Kontoauswahl | Eingabe einer gültigen Kontonummer (z. B. `1`) | Details von Konto 1 werden angezeigt, Wechsel in das Konto-Aktionsmenü. |
| **BB-02** | Kontoauswahl | Eingabe einer ungültigen/nicht existierenden Nummer (z. B. `999` oder `-5`) | Fehlermeldung `"Ein Konto mit dieser Nummer ist nicht vorhanden!"`, erneute Menüaufforderung. |
| **BB-03** | Kontoauswahl | Ungültige Zeicheneingabe (z. B. `xyz` oder Sonderzeichen) | Meldung `"! Ungültige Eingabe..."` und erneute Eingabeaufforderung. |
| **BB-04** | Kontoliste | Eingabe `a` im Hauptmenü | Übersicht aller existierenden Konten mit Nummer, Name und Währung wird ausgegeben. |
| **BB-05** | Konto erstellen | Eingabe `e`, Name: `"Müller"`, Währung: `"CHF"` | Neues Konto wird erstellt (Startguthaben `0.00 CHF`), neue ID zugewiesen, Details werden ausgegeben. |
| **BB-06** | Konto erstellen | Ungültiges Währungskürzel (z. B. `"JPY"` oder `"123"`) | Fallback-Verhalten: Warnung `"Währung nicht bekannt, es wird USD verwendet"` oder Fehlermeldung bei Formatabweichung. |
| **BB-07** | Einzahlung | Betrag einzahlen: `150.50` | Kontostand erhöht sich um `150.50`, neuer Kontostand wird angezeigt. |
| **BB-08** | Einzahlung (Grenzfall) | Betrag einzahlen: `-50.00` oder `0.00` | *Sicherheitslücke/Bug:* Applikation sollte negative Einzahlungen abweisen. |
| **BB-09** | Abhebung | Betrag abheben: `50.00` (bei ausreichendem Guthaben) | Guthaben verringert sich um `50.00`, neuer Stand wird angezeigt. |
| **BB-10** | Abhebung (Überziehung) | Betrag abheben, der das Guthaben übersteigt (z. B. `99999.00`) | Fehlermeldung `"! Kontostand zu niedrig..."`, Kontostand bleibt unverändert. |
| **BB-11** | Überweisung | Überweisung auf anderes Konto (gleiche Währung) | Guthaben auf Quellkonto sinkt, Zielkonto-Guthaben steigt um den gleichen Betrag. |
| **BB-12** | Überweisung | Überweisung auf ein Konto mit anderer Währung (z. B. USD -> CHF) | Betrag wird mit Umrechnungskurs umgerechnet und dem Zielkonto gutgeschrieben. |
| **BB-13** | Überweisung (Selbst) | Überweisung auf die eigene Kontonummer | Fehlermeldung `"! Bitte ein anderes Konto als das momentane Konto auswählen!"`. |
| **BB-14** | Konto löschen | Eingabe `l`, Bestätigung mit `j` | Konto wird gelöscht. In der Kontoliste (`a`) ist es nicht mehr enthalten. |
| **BB-15** | Wechselkurs-Abfrage | Eingabe `w`, Währungspaar `"CHF EUR"` | Live-Wechselkurs wird abgerufen und ausgegeben (z.B. `1 CHF = 1.04 EUR`). |
| **BB-16** | Beenden | Eingabe `q` | Meldung `"Auf Wiedersehen!"` wird gedruckt und die Anwendung beendet sich. |

---

### 2. White-Box Testfälle (Code- & Unit-Tests)

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

---

### 3. Verbesserungsvorschläge & Best Practices für den Code

1. **Keine Unit-Tests vorhanden**:
   - `src/test/java` ist derzeit komplett leer. 
   - **Empfehlung**: JUnit 5 (`junit-jupiter`) in `pom.xml` einbinden und automatische Unit-Tests für `Bank`, `Account` und `Counter` schreiben.

2. **Hardcoded API-Key & Sicherheitsrisiko**:
   - In `xchangeRateOkhttp.java:L28` ist ein klarlesbarer API-Key im Code hinterlegt (`"apikey", "aZA8SRPPWKe8RCu4fLT9dGtgAUfkwVfS"`).
   - **Empfehlung**: API-Keys niemals im Quellcode/Git speichern. Über Umgebungs-Variablen (`System.getenv("API_KEY")`) oder Konfigurationsdateien einlesen.

3. **Verwendung von `double` für Geldbeträge**:
   - `double` führt bei kaufmännischen Berechnungen zu Rundungsfehlern (z.B. `0.1 + 0.2 != 0.3`).
   - **Empfehlung**: Für Finanzanwendungen sollte stets `BigDecimal` oder `Long` verwendet werden.

4. **Kopplung von Geschäftslogik und UI / Trennung von Belangen (Separation of Concerns)**:
   - Methoden in `Account` und `Bank` rufen direkt `System.out.println()` auf.
   - `Counter` übernimmt Konsoleneingabe (`Scanner`), Regex-Validierung, Business-Logik und Konsolenausgabe gleichzeitig.
   - **Empfehlung**: Trennung nach MVC/Clean Architecture. Domain-Klassen (`Bank`, `Account`) liefern Werte/Objekte zurück, UI-Klassen kümmern sich ausschliesslich um Formatierung und Ein-/Ausgabe.

5. **Fehlende Eingabevalidierung**:
   - `Account.deposit(-100)` zieht Geld ab, anstatt eine `IllegalArgumentException` zu werfen.
   - **Empfehlung**: Preconditions prüfen (`if (amount <= 0) throw new IllegalArgumentException("Betrag muss positiv sein");`).

6. **Globale/Statische Zustände (`static` Counter)**:
   - `Account` nutzt `static int counter = 0;` für die ID-Generierung ([Account.java:L25]()).
   - **Empfehlung**: IDs zentral durch die Klasse `Bank` verwalten lassen oder  `UUID` nutzen.

7. **Hartcodierte & unvollständige Wechselkurse**:
   - In [Counter.convertCurrency]() sind fixe Raten hinterlegt, die unvollständig sind (z. B. fehlt `EUR -> CHF`).
   - **Empfehlung**: Währungsumrechnung an `ExchangeRateOkhttp` oder einen dedizierten `CurrencyConverterService` auslagern.


