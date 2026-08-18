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
        - Automated Testing

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

Wenn bei einem Online Shop der Endbetrag falsch berechnet wird, zahlt der Kunde entweder zu iel oder zu wenig. Bei zu wenig führt das zu Geldverlust der Firma. Bei zu viel ist der Kunde nicht zufrieden, wird sich beschweren, Gekd zurückfordern und den Shop nicht mehr besuchen.


### Aufgabe 3

[Code](../Projekte-Code/untitled/src/Grundlagen/A3/PreisberechnungTest.java)

Fehler im Code:
- Else if(...) wird nie erreicht