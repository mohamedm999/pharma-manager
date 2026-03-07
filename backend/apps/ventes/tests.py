from decimal import Decimal
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Vente
from apps.medicaments.models import Medicament
from apps.categories.models import Categorie


class VenteAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)
        cat = Categorie.objects.create(nom="Cat")
        self.med = Medicament.objects.create(
            nom="Med", categorie=cat, stock_actuel=10, stock_minimum=5,
            prix_achat=Decimal("5.00"), prix_vente=Decimal("10.00"),
            forme="Sirop", dosage="250ml", date_expiration="2030-01-01"
        )
        
    def test_create_vente_success(self):
        url = reverse('vente-list')
        data = {
            "lignes": [{"medicament": self.med.id, "quantite": 2}],
            "statut": "COMPLETEE"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        
        # Verify stock deduction
        self.med.refresh_from_db()
        self.assertEqual(self.med.stock_actuel, 8)
        
    def test_create_vente_insufficient_stock(self):
        url = reverse('vente-list')
        data = {
            "lignes": [{"medicament": self.med.id, "quantite": 15}] # stock is 10
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        
        # Verify stock NOT deducted
        self.med.refresh_from_db()
        self.assertEqual(self.med.stock_actuel, 10)
        
    def test_annuler_vente(self):
        # Create
        url = reverse('vente-list')
        data = {"lignes": [{"medicament": self.med.id, "quantite": 2}]}
        res = self.client.post(url, data, format='json')
        vente_id = res.data['id']
        
        # Stock should be 8
        self.med.refresh_from_db()
        self.assertEqual(self.med.stock_actuel, 8)
        
        # Annuler
        cancel_url = reverse('vente-annuler', args=[vente_id])
        cancel_res = self.client.post(cancel_url)
        self.assertEqual(cancel_res.status_code, 200)
        
        # Verify stock reintegration
        self.med.refresh_from_db()
        self.assertEqual(self.med.stock_actuel, 10)
        
        vente = Vente.objects.get(id=vente_id)
        self.assertEqual(vente.statut, 'ANNULEE')

    def test_export_csv(self):
        url = reverse('vente-export-csv')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
