from django.contrib import admin
from .models import Vente, LigneVente

class LigneVenteInline(admin.TabularInline):
    model = LigneVente
    extra = 1

@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    list_display = ('reference', 'date_vente', 'total_ttc', 'statut')
    list_filter = ('statut', 'date_vente')
    search_fields = ('reference',)
    inlines = [LigneVenteInline]
    readonly_fields = ('date_vente',)
