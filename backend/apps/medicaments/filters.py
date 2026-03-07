import django_filters
from .models import Medicament

class MedicamentFilter(django_filters.FilterSet):
    prix_min = django_filters.NumberFilter(field_name="prix_vente", lookup_expr='gte', label="Prix de vente minimum")
    prix_max = django_filters.NumberFilter(field_name="prix_vente", lookup_expr='lte', label="Prix de vente maximum")
    stock_min = django_filters.NumberFilter(field_name="stock_actuel", lookup_expr='gte', label="Stock minimum")
    stock_max = django_filters.NumberFilter(field_name="stock_actuel", lookup_expr='lte', label="Stock maximum")
    
    class Meta:
        model = Medicament
        fields = ['categorie', 'ordonnance_requise']
