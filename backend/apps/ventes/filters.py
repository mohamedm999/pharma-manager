import django_filters
from .models import Vente

class VenteFilter(django_filters.FilterSet):
    date_debut = django_filters.DateFilter(field_name="date_vente__date", lookup_expr='gte', label="Depuis le (YYYY-MM-DD)")
    date_fin = django_filters.DateFilter(field_name="date_vente__date", lookup_expr='lte', label="Jusqu'au (YYYY-MM-DD)")
    total_min = django_filters.NumberFilter(field_name="total_ttc", lookup_expr='gte', label="Total minimum")
    total_max = django_filters.NumberFilter(field_name="total_ttc", lookup_expr='lte', label="Total maximum")

    class Meta:
        model = Vente
        fields = ['statut']
