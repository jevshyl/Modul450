## Aufgabe1:


**Allgemeine Beobachtung:**
Die Klasse `Test` erbt von `PHPUnit\Framework\TestCase`. Die Methode `setUp()` wird vor jedem einzelnen Testfall automatisch ausgeführt. Sie stellt sicher, dass mit `unset()` ein alter Zustand gelöscht und ein frisches, unverändertes Objekt von `MyFancyClass` erstellt wird. Das ist wichtig, damit sich die Tests nicht gegenseitig beeinflussen.

---

#### 1. `testShortString()`
**Ziel des Tests:** Überprüfung einer Methode, die einen Text auf eine maximale Länge kürzt und dabei optional eine Endung (wie "...") anhängt.

**Methode `shortString($text, $maxLength, $ending = '...')`:**
* **Keine Kürzung bei kurzer Länge:** Wenn der Text kürzer oder genau so lang wie `$maxLength` ist (z. B. `$text35Char` mit Länge 35 und `$maxLength` 35 oder 100), wird der Originaltext unverändert zurückgegeben.
* **Kürzung bei langer Länge:** Ist der Text länger als `$maxLength` (z. B. `$text130Char` bei 100 Zeichen), wird er abgeschnitten. Der Test `assertEquals('Lorem...u...', ...)` zeigt, dass die Standard-Endung `...` ist und diese *in* die maximale Länge eingerechnet wird oder direkt angehängt wird.
* **Vergleichbarkeit:** Zwei unterschiedlich lange, aber sehr lange Texte (`$text130Char` und `$text591Char`) ergeben bei gleichem `$maxLength` (100) exakt das gleiche Ergebnis. Bei einem höheren Limit (200) sind sie jedoch unterschiedlich, weil der 130-Zeichen-Text dann gar nicht mehr gekürzt wird, der 591-Zeichen-Text aber schon.
* **Benutzerdefinierte Endungen:** Der Test mit `assertStringEndsWith` prüft, dass man die Endung ändern kann (z. B. auf `'$'` oder `''`).
* **Edge-Case (Fehlerbehandlung):** Die Tests mit `assertFalse` bei `$textEmpty` und `$text35Char` in Kombination mit `$endingLong` und einem kleinen `$maxLength` (20) deuten darauf hin, dass die Methode `false` zurückgibt, wenn der `$maxLength` so klein ist, dass nicht einmal die `$ending` hineinpasst, oder wenn der Text leer ist und eine sinnvolle Kürzung nicht möglich ist.

---

#### 2. `testCalcAverage()`
**Ziel des Tests:** Überprüfung einer Methode, die den Durchschnittswert (Mittelwert) einer Liste von Zahlen berechnet.

**Methode `calcAverage($values)`:**
* **Leeres Array:** Ein leeres Array `[]` führt nicht zu einem Fehler (wie "Division by Zero"), sondern gibt sicherheitshalber `0` zurück.
* **Korrekte Berechnung:** Der Durchschnitt von `[4.5, 5.0, 5.5]` ist korrekt `5` (da 15 / 3 = 5).
* **Typen-Toleranz (Type Juggling):** Der Test zeigt, dass die Methode nicht nur mit echten Zahlen (Floats), sondern auch mit Zahlen als Strings (`['4.5', '5.0', '5.5']`) umgehen kann. Das Ergebnis ist identisch. PHP wandelt diese intern korrekt um.
* **Fehlerhafte Daten:** Enthält das Array nicht-numerische Strings wie `'bestanden'` oder `'nicht bewertbar'`, bricht die Methode die Berechnung nicht mit einem fatalen Fehler ab, sondern gibt sauber `false` zurück. Das ist eine gute defensive Programmierung.

---

#### 3. `testGetOpposite()`
**Ziel des Tests:**  Er prüft eine Methode, die je nach Eingabetyp unterschiedlich reagiert.

**Methode `getOpposite($input, $delimiter = ',')`:**
* **Bidirektionale Funktion :** 
  * Wenn `$input` ein **Array** ist, verbindet die Methode die Elemente zu einem **String** (ähnlich wie PHPs `implode()`). Das sieht man an: `getOpposite([4.5, 5.0, 5.5])` ergibt `'4.5,5,5.5'`.
  * Wenn `$input` ein **String** ist, zerlegt die Methode den String an den Delimitern in ein **Array** (ähnlich wie PHPs `explode()`). Das sieht man an den `count()`-Assertions: `count(getOpposite($string, ' '))` zählt die Wörter.
* **Umkehrbarkeit:** Die Zeile `$this->assertEquals($this->_myFancyClass->getOpposite($this->_myFancyClass->getOpposite($stringList)), $stringList);` beweist dies: Wandelt man einen String in ein Array um und dieses Array sofort wieder zurück in einen String, erhält man den ursprünglichen String.
* **Delimiter-Steuerung:** Man kann das Trennzeichen frei wählen (z. B. `', '`, `'?Hallo?'`, `' '`). Der Standard-Delimiter ist offensichtlich `,` (Komma ohne Leerzeichen).
* **Typen-Überprüfung:** Der letzte Test `assertFalse($this->_myFancyClass->getOpposite($this->_myFancyClass))` zeigt, dass die Methode prüft, ob der Eingabetyp überhaupt erlaubt ist. Wird ihr ein Objekt (die Klasse selbst) übergeben, weigert sie sich zu arbeiten und gibt `false` zurück, anstatt einen PHP-Fehler zu werfen.

---

### Zusammenfassung:
1. `shortString()`: Ein sicherer Text-Trunkierer mit konfigurierbarer Endung und Schutz vor unsinnigen Parametern.
2. `calcAverage()`: Ein fehlertoleranter Durchschnittsrechner, der auch mit String-Repräsentationen von Zahlen umgehen kann und bei ungültigen Daten `false` meldet.
3. `getOpposite()`: Eine clevere "2-in-1"-Methode, die je nach Datentyp (Array oder String) entweder `implode` oder `explode` ausführt und bei falschen Datentypen sicher `false` zurückgibt.
---
### 3:
![./tpassed.png]
## Aufgabe2:
```php

```


