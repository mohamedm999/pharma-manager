from django.contrib import admin
from .models import Medicament

@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    list_display = ('id', 'reference_nom', 'categorie', 'stock_actuel', 'prix_vente', 'est_actif')
    list_filter = ('est_actif', 'categorie', 'ordonnance_requise')
    search_fields = ('nom', 'dci')
    
    def reference_nom(self, obj):
        return f"{obj.nom} ({obj.dosage})"
    reference_nom.short_description = 'Nom (Dosage)'
