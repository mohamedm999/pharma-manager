from django.db import models

class Categorie(models.Model):
    """
    Modèle représentant une catégorie de médicaments.
    Permet de classifier les produits pour faciliter la recherche et la gestion.
    """
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['nom']

    def __str__(self):
        return self.nom
