import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction

from apps.categories.models import Categorie
from apps.medicaments.models import Medicament
from apps.ventes.models import Vente, LigneVente

class Command(BaseCommand):
    help = 'Génère des données de test pour Pharma Manager (Catégories, Médicaments, Ventes)'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("--- Début du nettoyage et peuplement de la DB ---"))

        with transaction.atomic():
            # Création du SuperUser si invalide
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser('admin', 'admin@pharma.local', 'admin')
                self.stdout.write(self.style.SUCCESS("✅ Superuser 'admin' créé (mdp: admin)"))
            
            # Catégories (5-10)
            categories_data = [
                {"nom": "Antalgiques", "desc": "Pour le soulagement de la douleur"},
                {"nom": "Antibiotiques", "desc": "Traitement des infections bactériennes"},
                {"nom": "Anti-inflammatoires", "desc": "Réduction des inflammations"},
                {"nom": "Vitamines", "desc": "Compléments alimentaires"},
                {"nom": "Cardiologie", "desc": "Maladies cardiaques"},
                {"nom": "Gastro-entérologie", "desc": "Troubles digestifs"},
                {"nom": "Dermatologie", "desc": "Maladies de la peau"},
            ]
            
            categories = []
            for cat_data in categories_data:
                cat, _ = Categorie.objects.get_or_create(nom=cat_data["nom"], defaults={'description': cat_data["desc"]})
                categories.append(cat)
            self.stdout.write(self.style.SUCCESS(f"✅ {len(categories)} catégories en base."))

            # Médicaments (20-30)
            medicaments_data = [
                ("Doliprane", "Paracétamol", "Comprimé", "1g", "1.50", "2.10", 150, 20, False, "Antalgiques"),
                ("Efferalgan", "Paracétamol", "Effervescent", "500mg", "1.20", "1.90", 100, 15, False, "Antalgiques"),
                ("Dafalgan", "Paracétamol", "Gélule", "500mg", "1.30", "2.00", 200, 30, False, "Antalgiques"),
                ("Amoxicilline Sandoz", "Amoxicilline", "Gélule", "500mg", "2.50", "4.00", 50, 10, True, "Antibiotiques"),
                ("Augmentin", "Amox / Acide clavulanique", "Sachet", "1g", "4.50", "8.00", 30, 5, True, "Antibiotiques"),
                ("Pyostacine", "Pristinamycine", "Comprimé", "500mg", "6.00", "11.50", 20, 5, True, "Antibiotiques"),
                ("Ibuprofène", "Ibuprofène", "Comprimé", "400mg", "1.80", "3.00", 120, 20, False, "Anti-inflammatoires"),
                ("Nurofen", "Ibuprofène", "Capsule", "400mg", "2.00", "3.50", 90, 15, False, "Anti-inflammatoires"),
                ("Voltaren", "Diclofénac", "Gel", "1%", "3.50", "6.00", 60, 10, False, "Anti-inflammatoires"),
                ("Vitamine C Upsa", "Acide ascorbique", "Effervescent", "1g", "2.00", "4.50", 110, 20, False, "Vitamines"),
                ("Magné B6", "Magnésium", "Comprimé", "N/A", "3.50", "6.50", 85, 15, False, "Vitamines"),
                ("Supradyn", "Multivitamines", "Gondole", "N/A", "5.00", "9.00", 40, 10, False, "Vitamines"),
                ("Tahor", "Atorvastatine", "Comprimé", "20mg", "7.00", "14.50", 70, 15, True, "Cardiologie"),
                ("Kardegic", "Aspirine", "Sachet", "75mg", "1.90", "3.80", 130, 20, False, "Cardiologie"),
                ("Bisoprolol", "Bisoprolol", "Comprimé", "2.5mg", "3.00", "6.20", 80, 15, True, "Cardiologie"),
                ("Spasfon", "Phloroglucinol", "Comprimé", "80mg", "1.80", "3.20", 95, 20, False, "Gastro-entérologie"),
                ("Smecta", "Diosmectite", "Sachet", "3g", "3.00", "5.50", 50, 10, False, "Gastro-entérologie"),
                ("Gaviscon", "Alginate", "Suspension", "250ml", "4.00", "7.50", 65, 10, False, "Gastro-entérologie"),
                ("Dexeryl", "Glycérol / Vaseline", "Crème", "250g", "4.20", "7.80", 100, 15, False, "Dermatologie"),
                ("Biafine", "Trolamine", "Emulsion", "93g", "3.50", "6.00", 80, 10, False, "Dermatologie")
            ]

            meds_created = []
            for m in medicaments_data:
                cat = next(c for c in categories if c.nom == m[9])
                med, _ = Medicament.objects.get_or_create(
                    nom=m[0],
                    defaults={
                        'dci': m[1], 'forme': m[2], 'dosage': m[3],
                        'prix_achat': Decimal(m[4]), 'prix_vente': Decimal(m[5]),
                        'stock_actuel': m[6], 'stock_minimum': m[7],
                        'ordonnance_requise': m[8], 'categorie': cat,
                        'date_expiration': '2028-12-31'
                    }
                )
                meds_created.append(med)
            self.stdout.write(self.style.SUCCESS(f"✅ {len(meds_created)} médicaments ajoutés."))

            # Ventes (5-10)
            nb_ventes_creees = 0
            for i in range(8):
                statut = random.choice(['COMPLETEE', 'COMPLETEE', 'EN_COURS', 'ANNULEE'])
                vente = Vente.objects.create(statut=statut, notes=f"Vente auto #{i}")
                
                # 1 à 3 produits par vente
                nb_lignes = random.randint(1, 3)
                meds_for_vente = random.sample(meds_created, nb_lignes)
                total_ttc = Decimal('0.00')

                for med in meds_for_vente:
                    qty = random.randint(1, 4)
                    
                    if med.stock_actuel >= qty:
                        ligne = LigneVente(
                            vente=vente,
                            medicament=med,
                            quantite=qty,
                            prix_unitaire=med.prix_vente
                        )
                        if statut in ['COMPLETEE', 'EN_COURS']:
                            med.stock_actuel -= qty
                            med.save()
                        
                        ligne.save()
                        total_ttc += (ligne.prix_unitaire * ligne.quantite)

                vente.total_ttc = total_ttc
                vente.save()
                nb_ventes_creees += 1

            self.stdout.write(self.style.SUCCESS(f"✅ {nb_ventes_creees} ventes générées."))

        self.stdout.write(self.style.SUCCESS("--- Fin de la génération (OK) ---"))
