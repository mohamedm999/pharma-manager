from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse, OpenApiExample
from .models import Categorie
from .serializers import CategorieSerializer

@extend_schema_view(
    list=extend_schema(
        summary="Lister les catégories",
        description="Récupère la liste de toutes les catégories de médicaments disponibles (sans pagination).",
        tags=["Catégories"],
        responses={
            200: OpenApiResponse(
                response=CategorieSerializer(many=True),
                description="Liste des catégories récupérée avec succès.",
                examples=[
                    OpenApiExample(
                        'Exemple de réponse',
                        value=[{"id": 1, "nom": "Antalgique", "description": "Contre la douleur", "date_creation": "2024-03-07T12:00:00Z"}]
                    )
                ]
            )
        }
    ),
    retrieve=extend_schema(
        summary="Détails d'une catégorie",
        description="Récupère les détails d'une catégorie spécifique via son ID.",
        tags=["Catégories"],
        responses={
            200: OpenApiResponse(response=CategorieSerializer, description="Catégorie trouvée."),
            404: OpenApiResponse(description="Catégorie introuvable.")
        }
    ),
    create=extend_schema(
        summary="Créer une catégorie",
        description="Crée une nouvelle catégorie de médicaments. Le nom doit être unique.",
        tags=["Catégories"],
        responses={
            201: OpenApiResponse(response=CategorieSerializer, description="Catégorie créée avec succès."),
            400: OpenApiResponse(description="Erreur de validation (ex: nom déjà utilisé).")
        }
    ),
    update=extend_schema(
        summary="Mettre à jour une catégorie",
        description="Met à jour entièrement les informations d'une catégorie existante.",
        tags=["Catégories"],
        responses={
            200: OpenApiResponse(response=CategorieSerializer, description="Catégorie mise à jour."),
            400: OpenApiResponse(description="Données invalides."),
            404: OpenApiResponse(description="Catégorie introuvable.")
        }
    ),
    partial_update=extend_schema(
        summary="Mise à jour partielle d'une catégorie",
        description="Met à jour partiellement les informations d'une catégorie existante.",
        tags=["Catégories"],
        responses={
            200: OpenApiResponse(response=CategorieSerializer, description="Catégorie mise à jour."),
            400: OpenApiResponse(description="Données invalides."),
            404: OpenApiResponse(description="Catégorie introuvable.")
        }
    ),
    destroy=extend_schema(
        summary="Supprimer une catégorie",
        description="Supprime une catégorie. Impossible si des médicaments y sont associés (protection on_delete=PROTECT).",
        tags=["Catégories"],
        responses={
            204: OpenApiResponse(description="Catégorie supprimée avec succès."),
            400: OpenApiResponse(description="Impossible de supprimer car des médicaments y sont liés."),
            404: OpenApiResponse(description="Catégorie introuvable.")
        }
    )
)
class CategorieViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les catégories de médicaments (CRUD).
    """
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    pagination_class = None  # Les catégories sont un petit jeu de données, pas besoin de pagination
