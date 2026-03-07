from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Categorie


class CategorieAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.cat1 = Categorie.objects.create(nom="Antalgique", description="Contre la douleur")
        self.cat2 = Categorie.objects.create(nom="Antibiotique", description="Contre les infections")

    def test_list_categories(self):
        url = reverse('categorie-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # No pagination — flat array
        self.assertEqual(len(response.data), 2)

    def test_create_categorie(self):
        url = reverse('categorie-list')
        data = {"nom": "Antihistaminique", "description": "Contre les allergies"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nom'], "Antihistaminique")
        self.assertEqual(Categorie.objects.count(), 3)

    def test_create_categorie_duplicate_nom(self):
        url = reverse('categorie-list')
        data = {"nom": "Antalgique"}  # Already exists
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_update_categorie(self):
        url = reverse('categorie-detail', args=[self.cat1.id])
        data = {"nom": "Antalgique modifié", "description": "Description modifiée"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.cat1.refresh_from_db()
        self.assertEqual(self.cat1.nom, "Antalgique modifié")

    def test_delete_categorie(self):
        url = reverse('categorie-detail', args=[self.cat2.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Categorie.objects.count(), 1)

    def test_delete_categorie_with_medicaments_fails(self):
        """PROTECT constraint: can't delete category with linked medicaments."""
        from apps.medicaments.models import Medicament
        from django.db.models import ProtectedError
        Medicament.objects.create(
            nom="Med test", categorie=self.cat1,
            stock_actuel=10, stock_minimum=5,
            prix_achat=5, prix_vente=10,
            forme="Comprimé", dosage="10mg",
            date_expiration="2030-01-01"
        )
        # PROTECT raises ProtectedError which Django propagates as 500
        # We verify the object cannot be deleted at DB level
        with self.assertRaises(ProtectedError):
            self.cat1.delete()
        # Category still exists
        self.assertTrue(Categorie.objects.filter(id=self.cat1.id).exists())
