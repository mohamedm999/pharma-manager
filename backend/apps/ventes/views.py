from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Vente
from .serializers import VenteSerializer, VenteDetailSerializer

@extend_schema_view(
    list=extend_schema(
        summary="Lister les ventes",
        description="Récupère la liste de toutes les ventes. Peut être filtrée par date.",
        tags=["Ventes"],
        parameters=[
            OpenApiParameter('date_debut', OpenApiTypes.DATE, description='Filtrer à partir de cette date (YYYY-MM-DD)', required=False),
            OpenApiParameter('date_fin', OpenApiTypes.DATE, description='Filtrer jusqu\'à cette date (YYYY-MM-DD)', required=False),
        ]
    ),
    retrieve=extend_schema(summary="Détails d'une vente", tags=["Ventes"]),
    create=extend_schema(summary="Créer une vente", tags=["Ventes"]),
    update=extend_schema(summary="Mettre à jour une vente", tags=["Ventes"]),
    partial_update=extend_schema(summary="Mise à jour partielle", tags=["Ventes"]),
    destroy=extend_schema(summary="Supprimer une vente", tags=["Ventes"]),
    annuler=extend_schema(
        summary="Annuler une vente",
        description="Annule une vente, réintègre les stocks des médicaments vendus, et marque la vente comme inactive.",
        tags=["Ventes"]
    )
)
class VenteViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les ventes.
    """
    queryset = Vente.objects.all()

    def get_serializer_class(self):
        # Utiliser le serializer détaillé (avec les noms des médicaments) pour la lecture
        if self.action in ['list', 'retrieve']:
            return VenteDetailSerializer
        return VenteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres par date
        date_debut = self.request.query_params.get('date_debut')
        date_fin = self.request.query_params.get('date_fin')
        
        if date_debut:
            queryset = queryset.filter(date_vente__date__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(date_vente__date__lte=date_fin)
            
        return queryset

    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        vente = self.get_object()
        
        if vente.statut == 'ANNULEE':
            return Response(
                {"detail": "Cette vente est déjà annulée."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        with transaction.atomic():
            # Réintégrer le stock pour chaque ligne de vente
            for ligne in vente.lignes.all():
                medicament = ligne.medicament
                medicament.stock_actuel += ligne.quantite
                medicament.save(update_fields=['stock_actuel'])
                
            # Mettre à jour la vente
            vente.statut = 'ANNULEE'
            vente.est_actif = False
            vente.save(update_fields=['statut', 'est_actif'])
            
        # Retourner la vente mise à jour avec le serializer détaillé
        serializer = self.get_serializer(vente)
        return Response(serializer.data)
