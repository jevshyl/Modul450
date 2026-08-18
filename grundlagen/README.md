# Grundlagen

## Allgemeine Begriffe:

### Fehler vs Mangel:

- Fehler:
    - Anforderung wird nicht erfüllt
    - Abweichung von IST-Verhalten und dem SOLL-Verhalten
- Mangel:
    - Gestellte Anforderung oder berechtigte Erwartung wird nicht angemessen erfüllt
    - zum Beispiel wird etwas korrekt berechnet aber nicht korrekt angezeigt


### Testarten aus dem V-Modell

- Komponententest
    - Ob elementare Softwarebaustein seine Vorgabe erfüllt
- Integrationstest
    - Spielen Grupen von Komponenten korrekt zusammen?
- Systemtest
    - erfüllt System als Ganzes die Anforderungen?
- Abnahmentest
    - Wird System von Kunden korrekt akzeptiert?

## Aufgabe 1
### Welche Formen von Tests kennen Sie aus der Informatik?

- End-2-End
    - Frontend - Backend - Datenbank wird hin und zurück getestet
        - Zum Beispiel mit Cypress oder Playwright
        - Mockdaten benutzen statt echte Daten mit Mockito
        - Automated Testing - CI/CD Bitbucket

- Unit Tests
    - Mit JUnit
    - Kleinste Kompponenten/Methoden/Funktionen werden isoliert getestet
        - Oftmals im Backend benutzt
    - Zum Beispiel in einer Pipeline automatisiert
 
- Manuelle Tests / Smoke Tests
    - Mehr ein durchklicken der Software
    - Manuell nach Bugs/Design-Fehler etc testen

## Aufgabe 2

### Nennen Sie ein Beispiel eines SW-Fehlers und eines SW-Mangels.

SW-Fehler:
- Ein Betrag wird falsch gerundet
- Login akzeptiert falsches Passwort

SW-Mangel:
- Username wird zwar richtig gespeichert, aber falsch angezeigt
- Technische Mängel -> Etwas wird versprochen aber nicht erfüllt


### Nennen Sie ein Beispiel für einen hohen Schaden bei einem SW-Fehler.

Wenn bei einem Online Shop der Endbetrag falsch berechnet wird, zahlt der Kunde entweder zu viel oder zu wenig. Bei zu wenig führt das zu Geldverlust der Firma. Bei zu viel ist der Kunde nicht zufrieden, wird sich beschweren, Geld zurückfordern und den Shop nicht mehr besuchen.


### Aufgabe 3

[Code](../Projekte-Code/untitled/src/Grundlagen/A3/PreisberechnungTest.java)


```java
package Grundlagen.A3;

public class PreisberechnungTest {

    double calculatePrice(double baseprice, double specialprice, double extraprice, int extras, double discount) {
        double addon_discount;
        double result;

        if (extras >= 5)
            addon_discount = 15;
        else if (extras >= 3)
            addon_discount = 10;
        else
            addon_discount = 0;

        if (discount > addon_discount)
            addon_discount = discount;

        result = baseprice/100.0 * (100-discount) + specialprice
                 + extraprice/100.0 * (100-addon_discount);

        return result;
    }

    boolean test_calculate_price() {
        double price;
        boolean test_ok = true;

        price = calculatePrice(1000, 0, 0, 0, 0);
        if (price != 1000) {
            System.out.println("Test 1 fehlgeschlagen: erwartet 1000, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 200, 2, 0);
        if (price != 1200) {
            System.out.println("Test 2 fehlgeschlagen: erwartet 1200, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 200, 3, 0);
        if (price != 1180) {
            System.out.println("Test 3 fehlgeschlagen: erwartet 1180, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 200, 5, 0);
        if (price != 1170) {
            System.out.println("Test 4 fehlgeschlagen: erwartet 1170, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 0, 0, 10);
        if (price != 900) {
            System.out.println("Test 5 fehlgeschlagen: erwartet 900, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 300, 0, 0, 0);
        if (price != 1300) {
            System.out.println("Test 6 fehlgeschlagen: erwartet 1300, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 300, 200, 5, 10);
        if (price != 1470) {
            System.out.println("Test 7 fehlgeschlagen: erwartet 1470, erhalten " + price);
            test_ok = false;
        }

        return test_ok;
    }

    public static void main(String[] args) {
        PreisberechnungTest t = new PreisberechnungTest();
        boolean result = t.test_calculate_price();
        System.out.println(result ? "Alle Tests bestanden" : "Es gibt fehlgeschlagene Tests");
    }
}
```


Fehler im Code:
- Else if(...) wird nie erreicht