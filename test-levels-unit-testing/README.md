# Testlevels

## Allgemeine Begriffe

- Level:
  - verschiedene Stufen im Software Entwicklungsprozess
- Testarten:
  - Unit Testing / Component Testing
  - Integration Testing
  - System Testing
  - Acceptance Testing

- White-Box-Test
  - Die Tests werden mit Kenntnissen über die innere Funktionsweise des zu testenden Systems entwickelt werden
- Black-Box-Test
  - Tests werden ohne Kenntnisse über die innere Funktionsweise des zu testenden Systems entwickelt


## Testarten

### Unit Tests

Merkmale:
- Gehört zu ersten Level von Testing
- White-Box-Test
- Komponente werden einzeln und isoliert getestet
- Vom Entwickler geschrieben


### Component Testing

Mermale:
- White-Box-Test
- Gehört manchmal zum Unit Testing dazu
- Vom Entwickler geschrieben
- Zusammenspiel zwischen mehreren Komponenten getestet
  - Schnittstelle zu DB wird gemockt


### Integration Testing

Merkmale:
- Black-Box und White-Box-Test
- Integration (zB zu DB) aktiv benutzt
  - zB: Zugriff auf DB testen


### System Testing

Merkmale:
- Vom selben Team wie Integration Tests getestet
- Black-Box-Test
- Software als ganzes wird getestet
- Funktional und Nichtfunktional wird getestet

### Acceptance Testing:

Merkmale:
- Vom Business/Kunde getestet
- Black-Box-Testing
- Erfüllt das System die Akzeptanz Kriterien


## Aufgaben Teil 1

### Aufgabe 1

Test Levels:
- Unit Test
- System Test

Wann:
- Unit Testing:
  - So oft wie möglich
    - z. B. jedes Mal wenn ein Code gepusht wird (CI/CD)
- System Testing:
  - Erst wenn ganzes System zusammenspielt
  - z.B am Ende eines Sprints

Wer:
- Keine dedizierte Testing oder QA Teams
- Jede Person schaut, ob Unit Tests oder End-2-End Tests fehlerfrei laufen, bevor sie Pull Request erstellen

### Aufgabe 2

Testing approach
- Wie viel und wo testet man?
- Wie organisiert man das Testen?

Testing levels
- Verschiedene Stufen der Entwicklung
- Wann und wo im Entwicklungsprozess (V-Model) wird getestet

Testing types, techniques and tactics
- Types:
  - Was wird geprüft
    - Funktional, nicht funktional
- Techniques:
  - Black oder White-Box-Testing?
- Tactics:
  - Welche Reihenfolge, was wird priorisiert? 
  - Testing-Entscheidungen



## Aufgaben Teil 2


