# Eidgenössische Fischereistatistik

## Setup

Die Dateien ``app/config/*.ini`` sind jeweils für die Developer- und die Live-Instanz anzupassen.
Diese Dateien sind von ``git push`` ausgeschlossen, da sie abhängig von der Systemumgebung sind.

Als Vorlage können die Dateien ``app/config/example/*.ini`` verwendet werden.

Mit ``composer install`` werden weitere Pakete installiert, die für die Webapp erforderlich sind.

Die Datenbank selber ist nicht in diesem Projekt enthalten und muss separat geladen werden.
