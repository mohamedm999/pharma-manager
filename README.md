# Pharma Manager 💊

**Pharma Manager** est une application full-stack moderne de gestion de pharmacie. Elle permet de gérer un catalogue de catégories et de médicaments, de suivre les stocks en temps réel avec un système d'alertes visuelles, et d'enregistrer des ventes avec déduction automatique des stocks.

## 🚀 Fonctionnalités Principales

- **Tableau de Bord** : Indicateurs clés (ventes du jour, chiffre d'affaires, produits en rupture).
- **Gestion des Médicaments** : Ajout, modification, filtre par catégorie, alertes de stock minimum, soft-delete.
- **Gestion des Ventes** : Formulaire de vente multi-lignes, calculs instantanés, contrôle de stock strict, annulation et réintégration de stock.
- **Catégories** : Organisation du catalogue de produits.

---

## 🛠️ Stack Technique

### Backend

- **Framework** : Django & Django REST Framework (DRF)
- **Base de données** : SQLite (par défaut)
- **Documentation API** : drf-spectacular (Swagger UI / Redoc)
- **Autres** : django-cors-headers, django-filter

### Frontend

- **Framework** : React 18 (via Vite)
- **Routage** : react-router-dom
- **Requêtes HTTP** : Axios (avec hooks personnalisés)
- **Styling** : CSS natif (Design System moderne)

---

## ⚙️ Prérequis

- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- Git

---

## 📦 Installation & Déploiement Local

### 1. Cloner le dépôt

```bash
git clone https://github.com/mohamedm999/pharma-manager.git
cd pharma-manager
```

### 2. Configuration du Backend (Django)

```bash
# Se placer dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur macOS/Linux :
source ./venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier d'environnement (optionnel mais recommandé)
cp .env.example .env

# Appliquer les migrations de base de données
python manage.py migrate

# (Optionnel) Peupler la base avec des données de test et créer l'admin
python manage.py seed

# Lancer le serveur de développement
python manage.py runserver
```

Le backend tourne désormais sur `http://localhost:8000`.

### 3. Configuration du Frontend (React / Vite)

Ouvrez un **nouveau terminal** à la racine du projet :

```bash
# Se placer dans le dossier frontend
cd frontend

# Installer les dépendances NPM
npm install

# Créer le fichier d'environnement
cp .env.example .env
# Vérifiez que VITE_API_BASE_URL pointe bien vers le serveur Django (ex: http://localhost:8000/api/v1)

# Démarrer le serveur de développement Vite
npm run dev
```

Le frontend est maintenant accessible sur `http://localhost:5173`.

---

## 📚 Documentation de l'API (Swagger)

L'API est documentée de manière exhaustive et interactive grâce au standard OpenAPI.
Une fois le backend lancé, accédez à :

- **Swagger UI** : [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)
- **Schéma Brut (YAML)** : [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

---

## 🔐 Variables d'Environnement

Un résumé des variables requises pour le développement :

**Backend (`backend/.env`)** :

```env
DEBUG=True
SECRET_KEY=votre_cle_secrete_django
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend (`frontend/.env`)** :

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

*Développé avec ☕ pour une gestion moderne d'officine.*
