from rest_framework import serializers
from django.utils import timezone
from .models import Medicament

class MedicamentSerializer(serializers.ModelSerializer):
    est_en_alerte = serializers.ReadOnlyField()
    categorie_nom = serializers.ReadOnlyField(source='categorie.nom')

    class Meta:
        model = Medicament
        fields = '__all__'

    def validate_prix_vente(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix de vente doit être supérieur à 0.")
        return value

    def validate_prix_achat(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix d'achat doit être supérieur à 0.")
        return value

    def validate_date_expiration(self, value):
        if value <= timezone.now().date():
            raise serializers.ValidationError("La date d'expiration doit être dans le futur.")
        return value

    def validate(self, data):
        # En modification (patch/put), certaines valeurs peuvent ne pas être dans `data`.
        # On fallback sur self.instance si l'instance existe.
        prix_achat = data.get('prix_achat', getattr(self.instance, 'prix_achat', None))
        prix_vente = data.get('prix_vente', getattr(self.instance, 'prix_vente', None))
        
        if prix_achat is not None and prix_vente is not None:
            if prix_vente < prix_achat:
                raise serializers.ValidationError({"prix_vente": "Le prix de vente ne peut pas être inférieur au prix d'achat."})
                
        return data
