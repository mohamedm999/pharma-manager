"""
Production / Docker settings.
Reads all config from environment variables (12-factor).
"""

import os
import dj_database_url
from .base import *  # noqa

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# Database — reads DATABASE_URL or falls back to individual vars
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get(
            'DATABASE_URL',
            'postgres://pharma_user:pharma_password@db:5432/pharma_manager'
        ),
        conn_max_age=600,
    )
}

# CORS
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost,http://localhost:5173,http://localhost:3000'
    ).split(',')
]
CORS_ALLOW_CREDENTIALS = True

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Security headers (enable in real production behind HTTPS)
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
