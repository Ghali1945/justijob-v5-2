'use client'

import Link from 'next/link'

export default function PaiementAnnule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement annulé
        </h1>
        <p className="text-gray-600 mb-6">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        
        <div className="space-y-3">
          <Link href="/paiement">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
              Réessayer le paiement
            </button>
          </Link>
          
          <Link href="/">
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200">
              Retour à l'accueil
            </button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Besoin d'aide ? Contactez-nous
        </p>
      </div>
    </div>
  )
}
```

---

## 🎯 RÉSUMÉ : POINT D'ENTRÉE

### **Le nouveau système commence APRÈS le diagnostic gratuit**
```
Homepage → Diagnostic GRATUIT → 🔥 PAIEMENT (nouveau) → Stripe → Succès → Questionnaire
```

**Les utilisateurs arrivent sur `/paiement` depuis :**
1. ✅ Le bouton après le diagnostic gratuit
2. ✅ Le bouton "Premium" sur la page d'accueil
3. ✅ N'importe quel lien "Obtenir l'analyse complète"

---

## 📋 CHECKLIST D'INTÉGRATION

Pour que tout fonctionne, tu dois :

- ✅ **Fichier 1** : Page `/paiement` (en cours d'installation)
- ✅ **Fichier 2** : APIs Stripe (en cours d'installation)
- ✅ **Fichier 3** : Page `/paiement/succes` (à créer - code ci-dessus)
- ✅ **Fichier 4** : Page `/paiement/annule` (à créer - code ci-dessus)
- ✅ **Fichier 5** : Questionnaire fusionné (à installer après)
- ✅ **Liens** : Modifier les boutons dans diagnostic et homepage

---

## 💡 EXEMPLE DE PARCOURS UTILISATEUR

### **Jean, salarié membre CGT, visite JustiJob**
```
1. Va sur JustiJob.fr
2. Clique "Diagnostic gratuit"
3. Remplit le diagnostic rapide
4. Voit son score : "Votre situation : 75/100"
5. Clique "🔒 Obtenir mon dossier complet"
   
   🔥 DÉBUT DU NOUVEAU SYSTÈME 🔥
   
6. Arrive sur /paiement
7. Remplit : Nom, Prénom, Email
8. Sélectionne "CGT" dans le menu
9. Entre le code "CGT2025"
10. Prix change : ~~120€~~ → 60€ ✅
11. Clique "Payer 60€ de manière sécurisée"
12. Redirigé vers Stripe
13. Entre sa carte : 4242 4242 4242 4242
14. Stripe confirme ✅
15. Redirigé vers /paiement/succes?session_id=cs_test_xxx
16. Voit : "🎉 Paiement réussi !"
17. Clique "📝 Accéder au questionnaire expert"
18. Redirigé vers /questionnaire?session_id=cs_test_xxx
19. Voit : "🔄 Vérification de votre paiement..."
20. Paiement validé ✅
21. Voit le questionnaire avec :
    - Badge "⭐ PREMIUM"
    - Badge "🏢 CGT"
    - "Client : Jean Dupont • 60€ payé"
22. Remplit le questionnaire (10 min)
23. Clique "Générer mon dossier"
24. Claude AI analyse (2-3 min)
25. Télécharge son PDF de 30 pages 🎉
