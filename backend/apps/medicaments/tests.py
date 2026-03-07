from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Medicament
from apps.categories.models import Categorie
from decimal import Decimal


class MedicamentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.categorie = Categorie.objects.create(nom="Test Category")
        self.med1 = Medicament.objects.create(
            nom="Med 1", dci="DCI 1", categorie=self.categorie,
            stock_actuel=5, stock_minimum=10, prix_achat=Decimal("10.00"), prix_vente=Decimal("15.00"),
            forme="Comprimé", dosage="10mg", date_expiration="2030-01-01"
        )
        self.med2 = Medicament.objects.create(
            nom="Med 2", dci="DCI 2", categorie=self.categorie,
            stock_actuel=20, stock_minimum=10, prix_achat=Decimal("10.00"), prix_vente=Decimal("15.00"),
            forme="Comprimé", dosage="10mg", date_expiration="2030-01-01"
        )
        
    def test_list_medicaments(self):
        url = reverse('medicament-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Should return both active medicaments
        self.assertEqual(len(response.data['results']), 2)
        
    def test_alertes_stock(self):
        url = reverse('medicament-alertes')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Only Med 1 should be in alert (stock 5 <= min 10)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['nom'], "Med 1")

    def test_soft_delete(self):
        url = reverse('medicament-detail', args=[self.med1.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        
        self.med1.refresh_from_db()
        self.assertFalse(self.med1.est_actif)
        
        # Should not appear in list anymore
        list_url = reverse('medicament-list')
        list_res = self.client.get(list_url)
        self.assertEqual(len(list_res.data['results']), 1)
