from rest_framework import serializers
from .models import Categorie

class CategorieSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Categorie. Gère le CRUD complet des catégories."""

    class Meta:
        model = Categorie
        fields = '__all__'
