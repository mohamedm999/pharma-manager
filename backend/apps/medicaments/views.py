from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse, OpenApiExample, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Medicament
from .serializers import MedicamentSerializer

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import MedicamentFilter

@extend_schema_view(
    list=extend_schema(
        summary="Lister les médicaments",
        description="Récupère la liste paginée (10/page) de tous les médicaments ACTIFS. Permet le filtrage par 'categorie' et la recherche par 'nom'/'dci'.",
        tags=["Médicaments"],
        responses={
            200: OpenApiResponse(
                response=MedicamentSerializer(many=True),
                description="Liste des médicaments récupérée.",
                examples=[
                    OpenApiExample(
                        'Exemple de réponse GET list',
                        value=[{
                            "id": 1, "nom": "Doliprane", "dci": "Paracétamol", "forme": "Comprimé", 
                            "dosage": "1000mg", "prix_achat": "1.50", "prix_vente": "2.50", 
                            "stock_actuel": 50, "stock_minimum": 10, "est_en_alerte": False
                        }]
                    )
                ]
            )
        }
    ),
    retrieve=extend_schema(
        summary="Détails d'un médicament",
        description="Récupère les détails d'un médicament spécifique via son ID.",
        tags=["Médicaments"],
        responses={
            200: OpenApiResponse(response=MedicamentSerializer, description="Médicament trouvé."),
            404: OpenApiResponse(description="Médicament introuvable ou inactif.")
        }
    ),
    create=extend_schema(
        summary="Créer un médicament",
        description="Crée un nouveau médicament. Prix de vente doit être >= prix d'achat. Quantités doivent être positives.",
        tags=["Médicaments"],
        responses={
            201: OpenApiResponse(response=MedicamentSerializer, description="Médicament créé avec succès."),
            400: OpenApiResponse(description="Erreur de validation des champs fournis.")
        }
    ),
    update=extend_schema(
        summary="Mettre à jour un médicament",
        description="Met à jour entièrement les informations d'un médicament existant.",
        tags=["Médicaments"],
        responses={
            200: OpenApiResponse(response=MedicamentSerializer, description="Médicament mis à jour."),
            400: OpenApiResponse(description="Erreurs de validation."),
            404: OpenApiResponse(description="Médicament introuvable.")
        }
    ),
    partial_update=extend_schema(
        summary="Mise à jour partielle",
        description="Met à jour partiellement les informations d'un médicament.",
        tags=["Médicaments"],
        responses={
            200: OpenApiResponse(response=MedicamentSerializer, description="Médicament mis à jour."),
            400: OpenApiResponse(description="Erreurs de validation."),
            404: OpenApiResponse(description="Médicament introuvable.")
        }
    ),
    destroy=extend_schema(
        summary="Supprimer un médicament (Soft Delete)",
        description="Ne supprime pas réellement l'entrée, mais la marque comme inactive (est_actif=False).",
        tags=["Médicaments"],
        responses={
            204: OpenApiResponse(description="Médicament marqué comme inactif avec succès."),
            404: OpenApiResponse(description="Médicament introuvable.")
        }
    ),
    alertes=extend_schema(
        summary="Médicaments en alerte de stock",
        description="Retourne la liste des médicaments dont le stock actuel est inférieur ou égal au stock minimum. Pagination incluse.",
        tags=["Médicaments"],
        responses={
            200: OpenApiResponse(
                response=MedicamentSerializer(many=True),
                description="Liste des médicaments en alerte.",
                 examples=[
                    OpenApiExample(
                        'Alerte de stock',
                        value=[{
                            "id": 2, "nom": "Aspirine", "stock_actuel": 5, "stock_minimum": 20, "est_en_alerte": True
                        }]
                    )
                ]
            )
        }
    )
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les médicaments (CRUD complet).
    """
    serializer_class = MedicamentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MedicamentFilter
    search_fields = ['nom', 'dci']

    def get_queryset(self):
        # Ne retourner que les médicaments actifs
        return Medicament.objects.filter(est_actif=True).order_by('nom')

    def destroy(self, request, *args, **kwargs):
        # Soft delete : on passe est_actif à False
        instance = self.get_object()
        instance.est_actif = False
        instance.save()
        return Response(status=204)

    @action(detail=False, methods=['get'])
    def alertes(self, request):
        # Stock actuel <= stock minimum
        # On utilise F() pour comparer deux champs d'un même modèle
        queryset = self.get_queryset().filter(stock_actuel__lte=F('stock_minimum'))
        
        # On applique la pagination sur l'action custom
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
