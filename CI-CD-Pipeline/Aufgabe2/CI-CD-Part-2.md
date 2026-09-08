# Aufgabe 1


| Umgebung    | Tool                     | Begründung                                                                                                                                                                                                                                                                                                                        |
|-------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Development | Docker Compose / Vagrant | Für schnelle und lokale Umgebungen. Kann schnell und einfach neu gestartet werden.<br/> Docker Compose für Service-Architekturen oder DB's, Cache usw. <br/> Vagrant wird oft für vollständige VMs (mit Betriebssystem) genutzt                                                                                                   |
| Testing     | Docker Compose           | Docker Compose reicht für automatisierte Tests. Dafür braucht man isolierte Container Umgebungen, die ebenfalls schnell neugestartet werden können.                                                                                                                                                                               |
| Staging     | Kubernetes / Terraform   | Staging ist wie einee Nachbildung einer Produktionsumgebung. Man soll deployment und skalierungenn gut testen können. Mit Terraform kann man die Cloud-Infrastruktur nachbilden und mit Kubernetes die Orchestrierung der Container erstellen.                                                                                    |
| Production  | Kubernetes / Terraform   | Fr die Produktion braucht man Skalierung, Updates usw. Dafür braucht, wie auch im Staging, Terraform für die Instrastuktur und Kubernetes für die Orchestrierung. Dabei ist der Unterschied, dass man in der Produktion aber alles inkludiert. Alles muss wirklich funktionieren. Im Staging braucht man nicht alle KOmponenten.  |



# Aufgabe 2

Entscheiden Sie sich für eine der vorgestellten Softwarelösungen und überlegen Sie, welche Umgebung Sie damit automatisiert aufsetzen möchten, sowie welche Software Sie darauf deployen möchten. Wenn Sie keine eigene Software vorliegen haben, können Sie gerne eine beliebige im Modul kennengelernte Software verwenden, um diese in einer Umgebung zu deployen.
Nehmen Sie sich dafür ca. 1 Lektion Zeit. Ziel ist es, dass Sie schauen, wie weit Sie mit dem Setup in der einen Lektion kommen werden und an welche Probleme Sie anstossen werden. Setzen Sie sich danach hin und überlegen Sie sich wann und in welchen Situationen ein Einsatz der getesteten Softwarelösung für Sie sinnvoll sein könnte. Schreiben Sie Ihre Gedanken in einer kurzen Reflexion bzw. einem Fazit nieder.


- Softwarelösung: Docker Compose
- Umgebung: Testing Umgebung
- Software: [Bank Projekt](../../test-levels-unit-testing/02_bank-vorgabe/02_bank-vorgabe)

## Reflexion

Die Umsetzung der Umgebung ging eigentlich ganz gut. Das schwierige war es, sich zu entscheiden, wa sman alles in der Umgebung brauchen wird. 
Zuerst mussten wir uns entscheiden, welche Software und Abhängigkeiten unser Projekt benötigt. Da wir uns für das Bank Projekt entschieden haben, brauchen wir Maven und Java-21.
Danach war es eigentlich ganz simpel. Beim Dockerfile haben wir das Arbeitsverzeichnis definiert, wichtige Files dort hin kopiert und zum Schluss den Befehl defineirt, welcher die Tests laufen lässt. 
Beim docker-compose File mussten wir nur Container-Infos definieren. 

Wann sinnvol: 
- Alle arbeiten an derselben Umgebung
- Läuft auf verschiedenen Geräten
- Einfach neuzustarten 
- Für Tests: 
  - Kann immer neu erstellt werden
  - Automatisierte Tests
