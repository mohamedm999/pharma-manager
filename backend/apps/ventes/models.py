from django.db import models
from django.utils import timezone
from apps.medicaments.models import Medicament
from decimal import Decimal

class Vente(models.Model):
    STATUT_CHOICES = [
        ('EN_COURS', 'En cours'),
        ('COMPLETEE', 'Complétée'),
        ('ANNULEE', 'Annulée'),
    ]

    reference = models.CharField(max_length=20, unique=True, blank=True)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_COURS')
    notes = models.TextField(blank=True, null=True)
    est_actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"
        ordering = ['-date_vente']

    def __str__(self):
        return self.reference

    def save(self, *args, **kwargs):
        if not self.reference:
            # Format: VNT-YYYY-XXXX
            year = timezone.now().year
            # Chercher la dernière vente de cette année
            last_vente = Vente.objects.filter(reference__startswith=f'VNT-{year}-').order_by('id').last()
            if last_vente:
                # Extraire la partie XXXX
                last_number = int(last_vente.reference.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.reference = f'VNT-{year}-{new_number:04d}'
            
        super().save(*args, **kwargs)


class LigneVente(models.Model):
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    medicament = models.ForeignKey(Medicament, on_delete=models.PROTECT, related_name='lignes_vente')
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    sous_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True)

    class Meta:
        verbose_name = "Ligne de vente"
        verbose_name_plural = "Lignes de vente"

    def __str__(self):
        return f"{self.quantite}x {self.medicament.nom} (Vente: {self.vente.reference})"

    def save(self, *args, **kwargs):
        # Snapshot du prix au moment de la vente
        if not self.prix_unitaire:
            self.prix_unitaire = self.medicament.prix_vente
        
        # Calcul du sous-total
        self.sous_total = Decimal(str(self.quantite)) * Decimal(str(self.prix_unitaire))
        
        super().save(*args, **kwargs)
        
        # Optionnel: Mettre à jour le total_ttc de la vente (calcul simple)
        # Recalculate le total de toutes les lignes (y compris celle-ci qui vient d'être sauvegardée)
        total = sum((ligne.sous_total for ligne in self.vente.lignes.all()), Decimal('0.00'))
        if self.vente.total_ttc != total:
            self.vente.total_ttc = total
            self.vente.save(update_fields=['total_ttc'])
