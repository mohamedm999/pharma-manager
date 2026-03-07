from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, F
from django.utils.timezone import now
from apps.medicaments.models import Medicament
import csv
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .models import Vente
from .serializers import VenteSerializer, VenteDetailSerializer
from .filters import VenteFilter

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
    ),
    export_csv=extend_schema(
        summary="Exporter les ventes en CSV",
        description="Génère un fichier CSV contenant l'historique des ventes filtrées.",
        tags=["Ventes"],
        responses={
            200: OpenApiResponse(description="Fichier CSV généré.")
        }
    )
)
class VenteViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour gérer les ventes.
    """
    queryset = Vente.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VenteFilter

    def get_serializer_class(self):
        # Utiliser le serializer détaillé (avec les noms des médicaments) pour la lecture
        if self.action in ['list', 'retrieve', 'export_csv']:
            return VenteDetailSerializer
        return VenteSerializer

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

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="ventes_export.csv"'
        response.write('\ufeff'.encode('utf8'))  # BOM pour Excel
        
        writer = csv.writer(response, delimiter=';')
        writer.writerow(['ID', 'Reference', 'Date Vente', 'Statut', 'Total TTC', 'Notes'])
        
        for vente in queryset:
            writer.writerow([
                vente.id,
                vente.reference,
                vente.date_vente.strftime("%Y-%m-%d %H:%M:%S"),
                vente.statut,
                vente.total_ttc,
                vente.notes or ""
            ])
            
        return response
class DashboardView(APIView):
    """
    API endpoint pour le tableau de bord (Vue globale)
    """
    
    @extend_schema(
        summary="Indicateurs clés du Dashboard",
        description="Retourne le nombre total de médicaments, les alertes de stock, le nombre de ventes du jour et le chiffre d'affaires du jour.",
        tags=["Dashboard"],
        responses={
            200: OpenApiResponse(
                description="Statistiques du Dashboard",
                examples=[
                    OpenApiExample(
                        'Exemple de stats',
                        value={
                            "total_medicaments": 120,
                            "medicaments_alerte": 5,
                            "ventes_jour": 12,
                            "chiffre_affaires_jour": 245.50
                        }
                    )
                ]
            )
        }
    )
    def get(self, request):
        today = now().date()
        
        # Médicaments
        total_medicaments = Medicament.objects.filter(est_actif=True).count()
        medicaments_alerte = Medicament.objects.filter(
            est_actif=True, 
            stock_actuel__lte=F('stock_minimum')
        ).count()
        
        # Ventes du jour complétées
        ventes_jour_qs = Vente.objects.filter(
            date_vente__date=today,
            statut='COMPLETEE'
        )
        
        nb_ventes_jour = ventes_jour_qs.count()
        ca_jour = ventes_jour_qs.aggregate(total=Sum('total_ttc'))['total'] or 0
        
        return Response({
            "total_medicaments": total_medicaments,
            "medicaments_alerte": medicaments_alerte,
            "ventes_jour": nb_ventes_jour,
            "chiffre_affaires_jour": float(ca_jour)
        })

