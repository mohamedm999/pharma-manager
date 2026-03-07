# PharmaManager

Application de gestion de pharmacie — Développé dans le cadre du test technique SMARTHOLOL

## Stack Technique

- Backend : Django 4.x + Django REST Framework + PostgreSQL
- Frontend : React.js (Vite)
- Documentation API : Swagger (drf-spectacular)

## Installation Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Configurer les variables
python manage.py migrate
python manage.py seed  # Données de test générées
python manage.py runserver
```

## Variables d'Environnement (.env)

```env
DEBUG=True
SECRET_KEY=votre-secret-key
DB_NAME=pharma_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

## Installation Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Documentation API

Swagger UI disponible sur : <http://localhost:8000/api/schema/swagger-ui/>

---
*(Note : Ce dépôt contient également un système complet `docker-compose.yml` (Point Bonus) qui virtualise la base PostgreSQL, le Backend (Gunicorn) et le Frontend simultanément via la commande `docker-compose up --build`).*
