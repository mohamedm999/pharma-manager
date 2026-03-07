from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .models import Vente
from .serializers import VenteSerializer, VenteDetailSerializer

@extend_schema_view(
    list=extend_schema(
        summary="Lister les ventes",
        description="Récupère la liste paginée (10/page) de toutes les ventes. Permet de filtrer par une plage de dates.",
        tags=["Ventes"],
        parameters=[
            OpenApiParameter('date_debut', OpenApiTypes.DATE, description='Filtrer à partir de cette date (YYYY-MM-DD)', required=False),
            OpenApiParameter('date_fin', OpenApiTypes.DATE, description='Filtrer jusqu\'à cette date (YYYY-MM-DD)', required=False),
        ],
        responses={
            200: OpenApiResponse(
                response=VenteDetailSerializer(many=True),
                description="Liste des ventes récupérée avec succès.",
                examples=[
                    OpenApiExample(
                        'Exemple Vente',
                        value=[{
                            "id": 1, "reference": "VNT-2024-0001", "date_vente": "2024-03-07T14:30:00Z", 
                            "total_ttc": "15.50", "statut": "COMPLETEE", "notes": "Client habituel", 
                            "est_actif": True, "lignes": [{"id": 1, "medicament_nom": "Doliprane", "quantite": 2, "sous_total": "5.00"}]
                        }]
                    )
                ]
            )
        }
    ),
    retrieve=extend_schema(
        summary="Détails d'une vente",
        description="Récupère les détails enrichis d'une vente spécifique.",
        tags=["Ventes"],
        responses={
            200: OpenApiResponse(response=VenteDetailSerializer, description="Détails de la vente."),
            404: OpenApiResponse(description="Vente introuvable.")
        }
    ),
    create=extend_schema(
        summary="Créer une vente",
        description="Enregistre une nouvelle vente. Calcule dynamiquement les sous-totaux, déduit les quantités du stock et créé les lignes. Renvoie une erreur 400 si le stock est insuffisant.",
        tags=["Ventes"],
        responses={
            201: OpenApiResponse(response=VenteSerializer, description="Vente créée et stock déduit avec succès."),
            400: OpenApiResponse(description="Stock insuffisant pour un ou plusieurs médicaments, ou données de requête invalides.")
        }
    ),
    update=extend_schema(
        summary="Mettre à jour une vente",
        description="Mise à jour d'une vente (utiliser avec précaution pour ne pas désynchroniser les stocks).",
        tags=["Ventes"]
    ),
    partial_update=extend_schema(
        summary="Mise à jour partielle",
        description="Patch d'une vente (ex: modifier les notes).",
        tags=["Ventes"]
    ),
    destroy=extend_schema(
        summary="Supprimer une vente",
        description="Suppression d'une vente (déconseillé). Utiliser l'action d'annulation à la place.",
        tags=["Ventes"]
    ),
    annuler=extend_schema(
        summary="Annuler une vente",
        description="Action spécifique qui passe le statut de la vente à ANNULEE, réintègre proprement le stock des médicaments correspondants, et marque la vente comme inactive.",
        tags=["Ventes"],
        responses={
            200: OpenApiResponse(
                response=VenteDetailSerializer, 
                description="Vente annulée et stock réintégré avec succès."
            ),
            400: OpenApiResponse(description="La vente est déjà annulée."),
            404: OpenApiResponse(description="Vente introuvable.")
        }
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
