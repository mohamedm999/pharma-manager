from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Categorie
from .serializers import CategorieSerializer

@extend_schema_view(
    list=extend_schema(
        summary="Lister les catégories",
        description="Récupère la liste de toutes les catégories de médicaments disponibles.",
        tags=["Catégories"]
    ),
    retrieve=extend_schema(
        summary="Détails d'une catégorie",
        description="Récupère les détails d'une catégorie spécifique via son ID.",
        tags=["Catégories"]
    ),
    create=extend_schema(
        summary="Créer une catégorie",
        description="Crée une nouvelle catégorie de médicaments. Le nom doit être unique.",
        tags=["Catégories"]
    ),
    update=extend_schema(
        summary="Mettre à jour une catégorie",
        description="Met à jour entièrement les informations d'une catégorie existante.",
        tags=["Catégories"]
    ),
    partial_update=extend_schema(
        summary="Mise à jour partielle d'une catégorie",
        description="Met à jour partiellement les informations d'une catégorie existante.",
        tags=["Catégories"]
    ),
    destroy=extend_schema(
        summary="Supprimer une catégorie",
        description="Supprime une catégorie. Impossible si des médicaments y sont associés (protection on_delete=PROTECT).",
        tags=["Catégories"]
    )
)
class CategorieViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les catégories de médicaments (CRUD).
    """
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
