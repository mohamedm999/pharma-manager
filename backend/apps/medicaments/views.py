from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Medicament
from .serializers import MedicamentSerializer

@extend_schema_view(
    list=extend_schema(summary="Lister les médicaments", tags=["Médicaments"]),
    retrieve=extend_schema(summary="Détails d'un médicament", tags=["Médicaments"]),
    create=extend_schema(summary="Créer un médicament", tags=["Médicaments"]),
    update=extend_schema(summary="Mettre à jour un médicament", tags=["Médicaments"]),
    partial_update=extend_schema(summary="Mise à jour partielle", tags=["Médicaments"]),
    destroy=extend_schema(
        summary="Supprimer un médicament (Soft Delete)",
        description="Ne supprime pas réellement l'entrée, mais le marque comme inactif (est_actif=False).",
        tags=["Médicaments"]
    ),
    alertes=extend_schema(
        summary="Médicaments en alerte de stock",
        description="Retourne la liste des médicaments dont le stock actuel est inférieur ou égal au stock minimum.",
        tags=["Médicaments"]
    )
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les médicaments (CRUD complet).
    """
    serializer_class = MedicamentSerializer
    filterset_fields = ['categorie']
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
