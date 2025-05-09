# Praxistag-Projekt: Shop-Backend mit Frontend

Dieses Projekt implementiert einen einfachen Online-Shop mit einer Django-REST-API und einem Angular-Frontend.

## Technologien

### Backend
- Python 3
- Django 
- Django REST Framework
- SQLite (Entwicklung)

### Frontend
- Angular 17+
- TypeScript
- HTML/CSS

## Projektstruktur

```
praxistag_aufgabe/
├── praxistag_backend/    # Django-Backend
│   ├── products/         # App für Produktverwaltung
│   └── ...
└── Frontend/             # Angular-Frontend
    └── shop-frontend/    # Frontend-Anwendung
```

## Installation

### Backend

1. Virtuelle Umgebung erstellen und aktivieren:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Django-Abhängigkeiten installieren:
```bash
pip install django djangorestframework django-cors-headers
```

3. Datenbank initialisieren:
```bash
cd praxistag_backend
python manage.py migrate
```

4. Server starten:
```bash
python manage.py runserver
```

### Frontend

1. Node.js und npm installieren (falls noch nicht vorhanden)

2. Angular-CLI installieren:
```bash
npm install -g @angular/cli
```

3. Frontend-Abhängigkeiten installieren:
```bash
cd Frontend/shop-frontend
npm install
```

4. Angular-Entwicklungsserver starten:
```bash
ng serve
```

5. Frontend im Browser öffnen: http://localhost:4200

## API-Endpunkte

- `GET /api/products/`: Listet die ersten 5 Produkte auf
- `GET /api/products/{id}/`: Zeigt Details eines bestimmten Produkts
- `POST /api/products/create/`: Erstellt ein neues Produkt
- `PUT /api/products/{id}/`: Aktualisiert ein bestehendes Produkt
- `DELETE /api/products/{id}/`: Löscht ein Produkt

## Frontend-Funktionen

- Übersicht aller Produkte
- Produktdetailansicht
- Erstellung neuer Produkte
- Bearbeitung bestehender Produkte
- Löschung von Produkten

## Autor
Nils Wolters  
Erstellt für den Praxistag Anwendungsentwicklung.
