
// src/app/paiement/succes/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Mail, FileText, ArrowRight, Printer } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  
  useEffect(() => {
    // Récupérer les données de paiement
    const sessionId = searchParams.get('session_id');
    const testMode = searchParams.get('test') === 'true';
    
    if (testMode) {
      // Mode test
      const testData = {
        email: searchParams.get('email'),
        amount: searchParams.get('amount'),
        service: 'Dossier Prud\'homal Complet',
        paymentId: 'TEST_' + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };
      setPaymentData(testData);
      setLoading(false);
    } else if (sessionId) {
      // Production : vérifier le paiement avec Stripe
      verifyPayment(sessionId);
    } else {
      // Récupérer depuis sessionStorage (fallback)
      const savedPayment = sessionStorage.getItem('paymentConfirmed');
      if (savedPayment) {
        setPaymentData(JSON.parse(savedPayment));
      }
      setLoading(false);
    }
  }, [searchParams]);
  
  const verifyPayment = async (sessionId) => {
    try {
      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setPaymentData(data.paymentData);
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadDossier = () => {
    // Générer et télécharger le dossier
    generateDossier();
  };
  
  const generateDossier = () => {
    const dossierHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Dossier Prud'homal - JUSTIJOB</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #000;
            }
            h1 {
              font-size: 24px;
              margin: 0 0 10px 0;
            }
            .subtitle {
              font-size: 18px;
              color: #333;
            }
            .section {
              margin: 30px 0;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              padding: 10px;
              background: #f0f0f0;
            }
            .info-box {
              border: 1px solid #ddd;
              padding: 15px;
              margin: 15px 0;
              background: #f9f9f9;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DOSSIER PRUD'HOMAL PERSONNALISÉ</h1>
            <div class="subtitle">Document préparé par JUSTIJOB - La Défense Active</div>
            <div>Date: ${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
          
          <div class="section">
            <div class="section-title">1. IDENTIFICATION DES PARTIES</div>
            <div class="info-box">
              <p><strong>DEMANDEUR (Salarié) :</strong></p>
              <p>Nom : _______________________</p>
              <p>Prénom : ____________________</p>
              <p>Adresse : ___________________</p>
              <p>_____________________________</p>
              <p>Email : ${paymentData?.email || '_____________________'}</p>
            </div>
            <div class="info-box">
              <p><strong>DÉFENDEUR (Employeur) :</strong></p>
              <p>Raison sociale : ____________</p>
              <p>SIRET : _____________________</p>
              <p>Adresse siège : _____________</p>
              <p>_____________________________</p>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">2. OBJET DE LA DEMANDE</div>
            <p>Le demandeur sollicite du Conseil de Prud'hommes :</p>
            <ul>
              <li>☐ La requalification du licenciement en licenciement sans cause réelle et sérieuse</li>
              <li>☐ Le paiement des heures supplémentaires impayées</li>
              <li>☐ Le paiement des congés payés non pris</li>
              <li>☐ Des dommages et intérêts pour harcèlement moral/sexuel</li>
              <li>☐ Des dommages et intérêts pour discrimination</li>
              <li>☐ Le paiement des salaires impayés</li>
              <li>☐ Autres : _____________________</li>
            </ul>
          </div>
          
          <div class="section">
            <div class="section-title">3. EXPOSÉ DES FAITS</div>
            <p><em>Décrivez chronologiquement les faits qui motivent votre saisine :</em></p>
            <div style="min-height: 200px; border: 1px solid #ddd; padding: 10px; background: white;">
              <p>Date d'embauche : ___________</p>
              <p>Type de contrat : ___________</p>
              <p>Poste occupé : ______________</p>
              <p>Salaire mensuel brut : ______</p>
              <br/>
              <p>Chronologie des faits :</p>
              <p>_____________________________</p>
              <p>_____________________________</p>
              <p>_____________________________</p>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">4. CALCUL DES INDEMNITÉS</div>
            <div class="info-box">
              <p><strong>Détail des sommes réclamées :</strong></p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Nature</th>
                  <th style="text-align: right; padding: 5px; border-bottom: 1px solid #ddd;">Montant</th>
                </tr>
                <tr>
                  <td style="padding: 5px;">Heures supplémentaires</td>
                  <td style="text-align: right; padding: 5px;">_______ €</td>
                </tr>
                <tr>
                  <td style="padding: 5px;">Congés payés</td>
                  <td style="text-align: right; padding: 5px;">_______ €</td>
                </tr>
                <tr>
                  <td style="padding: 5px;">Indemnité de licenciement</td>
                  <td style="text-align: right; padding: 5px;">_______ €</td>
                </tr>
                <tr>
                  <td style="padding: 5px;">Dommages et intérêts</td>
                  <td style="text-align: right; padding: 5px;">_______ €</td>
                </tr>
                <tr style="font-weight: bold;">
                  <td style="padding: 5px; border-top: 2px solid #000;">TOTAL</td>
                  <td style="text-align: right; padding: 5px; border-top: 2px solid #000;">_______ €</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">5. PIÈCES JUSTIFICATIVES</div>
            <p><em>Liste des documents à joindre à votre dossier :</em></p>
            <ul>
              <li>☐ Contrat de travail</li>
              <li>☐ Bulletins de salaire (tous)</li>
              <li>☐ Lettre de licenciement</li>
              <li>☐ Certificat de travail</li>
              <li>☐ Attestation Pôle Emploi</li>
              <li>☐ Emails et correspondances</li>
              <li>☐ Témoignages (avec copie CNI du témoin)</li>
              <li>☐ Certificats médicaux</li>
              <li>☐ Planning/Pointages (pour heures sup)</li>
              <li>☐ Autres : _________________</li>
            </ul>
          </div>
          
          <div class="section">
            <div class="section-title">6. PROCÉDURE À SUIVRE</div>
            <ol>
              <li><strong>Compléter ce dossier</strong> avec toutes vos informations</li>
              <li><strong>Rassembler les pièces</strong> justificatives listées</li>
              <li><strong>Remplir le formulaire Cerfa</strong> n°15586*05</li>
              <li><strong>Déposer au greffe</strong> du Conseil de Prud'hommes compétent</li>
              <li><strong>Conserver une copie</strong> de l'ensemble du dossier</li>
            </ol>
          </div>
          
          <div class="section">
            <div class="section-title">7. NOTES STRATÉGIQUES</div>
            <div class="info-box" style="background: #fffacd;">
              <p><strong>Conseils personnalisés basés sur votre diagnostic :</strong></p>
              <ul>
                <li>Vos chances de succès ont été évaluées à : ____%</li>
                <li>Points forts de votre dossier : _____________</li>
                <li>Points à renforcer : _______________________</li>
                <li>Délai de prescription à respecter : _________</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>JUSTIJOB - La Défense Active | Service d'aide aux salariés</p>
            <p>Ce document est un modèle personnalisé. Il ne se substitue pas à un conseil juridique professionnel.</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([dossierHTML], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dossier-prudhommes-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du paiement...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Confirmation de succès */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement confirmé !
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Merci pour votre confiance. Votre dossier prud'homal est prêt.
          </p>
          
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Détails de la commande :</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service :</span>
                  <span className="font-medium">{paymentData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant payé :</span>
                  <span className="font-medium">{paymentData.amount}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">N° de commande :</span>
                  <span className="font-mono text-xs">{paymentData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email :</span>
                  <span className="font-medium">{paymentData.email}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions principales */}
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={downloadDossier}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              <Download className="mr-2" size={20} />
              Télécharger mon dossier complet
            </button>
            
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
            >
              <Printer className="mr-2" size={20} />
              Imprimer le reçu
            </button>
          </div>
        </div>
        
        {/* Prochaines étapes */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Prochaines étapes
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Téléchargez votre dossier</h3>
                <p className="text-gray-600">
                  Cliquez sur le bouton ci-dessus pour télécharger votre dossier personnalisé.
                  Il contient tous les éléments nécessaires pour saisir les prud'hommes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Complétez les informations</h3>
                <p className="text-gray-600">
                  Remplissez les champs laissés vides dans le dossier avec vos informations personnelles
                  et les détails spécifiques de votre situation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Rassemblez vos preuves</h3>
                <p className="text-gray-600">
                  Collectez tous les documents mentionnés dans la liste des pièces justificatives
                  (contrat, bulletins de salaire, emails, etc.).
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Déposez au greffe</h3>
                <p className="text-gray-600">
                  Rendez-vous au greffe du Conseil de Prud'hommes compétent avec votre dossier complet
                  et le formulaire Cerfa rempli.
                </p>
              </div>
            </div>
          </div>
          
          {/* Email de confirmation */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Mail className="text-blue-600 mr-3 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Email envoyé !
                </h3>
                <p className="text-blue-700 text-sm">
                  Nous vous avons envoyé une copie de votre dossier et votre facture à l'adresse :
                  <strong> {paymentData?.email}</strong>
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  Vérifiez vos spams si vous ne recevez rien dans les 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Besoin d'aide pour compléter votre dossier ?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/contact')}
              className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Contacter le support
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}