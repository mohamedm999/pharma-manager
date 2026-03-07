from rest_framework import serializers
from django.db import transaction
from apps.medicaments.models import Medicament
from .models import Vente, LigneVente

class LigneVenteSerializer(serializers.ModelSerializer):
    """Serializer pour une ligne de vente. Les champs prix_unitaire et sous_total sont calculés par le backend."""

    # prix_unitaire and sous_total are read-only because they are computed by the backend
    prix_unitaire = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    sous_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'quantite', 'prix_unitaire', 'sous_total']


class VenteSerializer(serializers.ModelSerializer):
    """
    Serializer pour la création d'une vente avec ses lignes (nested writable).
    Gère la vérification de stock, la déduction automatique des quantités
    et le calcul du total TTC.
    """
    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'est_actif', 'lignes']
        read_only_fields = ['reference', 'date_vente', 'total_ttc']

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes')
        
        with transaction.atomic():
            # 1. Créer la Vente
            vente = Vente.objects.create(**validated_data)
            
            # 2. Boucler sur les lignes pour vérifier les stocks et créer les LigneVente
            for ligne_data in lignes_data:
                medicament = ligne_data['medicament']
                quantite = ligne_data['quantite']
                
                # Vérifier le stock
                if medicament.stock_actuel < quantite:
                    raise serializers.ValidationError(
                        f"Stock insuffisant pour le médicament {medicament.nom}. "
                        f"Demandé: {quantite}, Disponible: {medicament.stock_actuel}."
                    )
                
                # Le prix_unitaire sera pris depuis medicament dans la méthode save() 
                # de LigneVente, de même pour le sous_total et la MAJ du total_ttc.
                # Mais il faut aussi DEDUIRE le stock.
                
                medicament.stock_actuel -= quantite
                medicament.save(update_fields=['stock_actuel'])
                
                LigneVente.objects.create(vente=vente, **ligne_data)
                
            # Pas besoin de faire sum pour total_ttc car le save() de LigneVente 
            # (dans models.py) le met déjà à jour. Cependant, pour retourner la
            # vente avec le bon total_ttc dans la réponse, on rafraîchit l'instance :
            # Passer le statut à COMPLETEE après création réussie
            vente.statut = 'COMPLETEE'
            vente.save(update_fields=['statut'])
            
            vente.refresh_from_db()
            
            return vente


class VenteDetailSerializer(serializers.ModelSerializer):
    """Serializer en lecture seule pour le détail d'une vente, avec les noms de médicaments enrichis."""

    # Version lecture seule avec les noms enrichis
    lignes = serializers.SerializerMethodField()

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'est_actif', 'lignes']
        read_only_fields = fields

    def get_lignes(self, obj):
        # On retourne une structure personnalisée, ou on pourrait faire un Serializer dédié à la lecture.
        return [
            {
                "id": ligne.id,
                "medicament_id": ligne.medicament.id,
                "medicament_nom": ligne.medicament.nom,
                "quantite": ligne.quantite,
                "prix_unitaire": ligne.prix_unitaire,
                "sous_total": ligne.sous_total
            }
            for ligne in obj.lignes.all()
        ]
