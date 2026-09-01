# Automated Testing

## Begriffe:


| Abkürzung | Abkürzung            |
|-----------|----------------------|
| ROI       | Return of investment |


- Test Case Suiten
  - Reihen von Tests

Wieso testen:
- Effizienz
- Test Coverage
- Ausführungszeit


Testing Typen:
- Functional Testing
- Non-functional testing
- Smoke testing
- Regression testing
  - Auffinden von Fehlern, nachdem eine grössere Codeänderung stattgefunden hat
- Keyword-driven testing und Data-driven testing


# Aufgaben


## Aufgabe 1 - Postman

![Postman](Screenshot%202026-09-01%20163056.png)

![Postman](Screenshot%202026-09-01%20163103.png)


## Aufgabe 2

![Navigation](Screenshot%202026-09-01%20154231.png)


![Student List](Screenshot%202026-09-01%20154243.png)



![Student Form](Screenshot%202026-09-01%20154252.png)


## Aufgabe 3


### Spiked Performance
![Performance auf Postman](Screenshot%202026-09-01%20155253.png)


#### Interpretation

#### Test-Konfiguration
- Tool: Postman
- Dauer: 1 Minute
- Virtuelle Benutzer: 20
- Endpoint: GET /students

#### Ergebnisse
- Total Requests: 2,991
- Requests/Sekunde: ~50
- Durchschnittliche Antwortzeit: 7ms
- Fehlerrate: 0%
- 99% der Anfragen < 35ms

#### Interpretation
- Schnelle Antwortzeiten (< 10ms)
- Keine technischen Fehler
- Gute Performance unter Last


### Fixed Performance
![Performance Fixed](Screenshot%202026-09-01%20155626.png)


## Bonus Aufgabe

### Validierung im Backend


#### Student.java

```typescript
   @NotBlank(message = "Name darf nicht leer sein")
   @Size(min = 2, max = 100)
   private String name;

   @NotBlank(message = "E-Mail darf nicht leer sein")
   @Email(message = "E-Mail-Format ist ungültig")
   private String email;
```

#### StudentController.java

````typescript
   @PostMapping("/students")
   ResponseEntity<Student> addStudent(@Valid @RequestBody Student user) {
       studentRepository.save(user);
       return ResponseEntity.status(HttpStatus.CREATED).build();
   }
````

### Beschreibung


#### Was fehlt?

| Benötigt                                  | Zustand jetzt                  |
|-------------------------------------------|--------------------------------|
| Name und Email müssen mitgegeben werden   | Leere Felder werden zugelassen |
| Name soll min 2 und max 100 Zeichen haben | Alle mögliche Anzahlen möglich |
| Mail sollte validiert werden              | Keine Validierung              |


### Was wurde implementiert:

| Benötigt               | Zustand jetzt                            |
|------------------------|------------------------------------------|
| @NotBlank + @NotNull   | Leere Felder werden nicht zugelassen     |
| @Size                  | Min 2 und max 100 Zeichen                |
| @Email                 | Email Validierung                        |
| Änderung im Controller | Ob es sich um ein Student Objekt handelt |


### Zeitaufwand

| Aufgabe                    | Zeit in min |
|----------------------------|-------------|
| App studieren              | 10          |  
| Student.java anpassen      | 10          |
| StudentController anpassen | 5           |
| Fehler studieren           | 10          |
| Exception verfassen        | 10          |
| Testing                    | 15          |
