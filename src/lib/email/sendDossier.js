
// src/lib/email/sendDossier.js

// Template HTML pour l'email
const emailTemplate = (data) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre dossier prud'homal - JUSTIJOB</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">JUSTIJOB</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">La Défense Active</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 20px;">
            <h2 style="color: #333333; margin-bottom: 20px;">Bonjour ${data.name},</h2>
            
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                Merci pour votre confiance ! Votre dossier prud'homal personnalisé est prêt.
            </p>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">📋 Votre commande</h3>
                <p style="margin: 5px 0;"><strong>Service :</strong> ${data.service}</p>
                <p style="margin: 5px 0;"><strong>Montant payé :</strong> ${data.amount}€</p>
                <p style="margin: 5px 0;"><strong>N° de commande :</strong> ${data.orderId}</p>
                <p style="margin: 5px 0;"><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            
            <h3 style="color: #333333; margin-top: 30px;">📎 Documents joints</h3>
            <ul style="color: #666666; line-height: 1.8;">
                <li>Dossier prud'homal personnalisé (PDF)</li>
                <li>Formulaire Cerfa pré-rempli</li>
                <li>Guide de procédure étape par étape</li>
                <li>Facture acquittée</li>
            </ul>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
                <h4 style="color: #92400e; margin-top: 0;">⚠️ Important</h4>
                <p style="color: #92400e; margin: 0; line-height: 1.6;">
                    N'oubliez pas de compléter les informations manquantes dans le dossier 
                    et de rassembler toutes vos pièces justificatives avant de déposer au greffe.
                </p>
            </div>
            
            <h3 style="color: #333333;">Prochaines étapes</h3>
            <ol style="color: #666666; line-height: 1.8;">
                <li>Complétez les champs laissés vides dans le dossier</li>
                <li>Rassemblez tous vos justificatifs</li>
                <li>Déposez au greffe du Conseil de Prud'hommes</li>
                <li>Conservez une copie de l'ensemble</li>
            </ol>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/compte/documents" 
                   style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Accéder à mes documents
                </a>
            </div>
            
            <p style="color: #666666; line-height: 1.6;">
                Si vous avez des questions, n'hésitez pas à nous contacter à 
                <a href="mailto:support@justijob.fr" style="color: #3b82f6;">support@justijob.fr</a>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                © 2024 JUSTIJOB - La Défense Active
            </p>
            <p style="color: #999999; margin: 0; font-size: 12px;">
                Cet email contient des informations confidentielles
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

// Fonction principale d'envoi d'email
export async function sendDossierEmail(userData) {
  try {
    // Option 1 : Utiliser Resend (recommandé)
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: 'JUSTIJOB <noreply@justijob.fr>',
      to: [userData.email],
      subject: 'Votre dossier prud\'homal est prêt - JUSTIJOB',
      html: emailTemplate(userData),
      attachments: [
        {
          filename: 'dossier-prudhommes.pdf',
          content: userData.dossierPDF // Buffer ou base64
        },
        {
          filename: 'facture.pdf',
          content: userData.facturePDF
        }
      ]
    });
    
    return { success: true, messageId: data.id };
    */
    
    // Option 2 : Utiliser SendGrid
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: userData.email,
      from: 'support@justijob.fr',
      subject: 'Votre dossier prud\'homal est prêt - JUSTIJOB',
      html: emailTemplate(userData),
      attachments: [
        {
          content: userData.dossierPDF,
          filename: 'dossier-prudhommes.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    await sgMail.send(msg);
    return { success: true };
    */
    
    // Mode test : log console
    console.log('📧 Email envoyé à:', userData.email);
    console.log('Sujet: Votre dossier prud\'homal est prêt');
    return { 
      success: true, 
      testMode: true,
      message: 'Email simulé en mode test'
    };
    
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Fonction pour envoyer un email de confirmation de paiement
export async function sendPaymentConfirmation(paymentData) {
  const emailData = {
    email: paymentData.email,
    name: paymentData.name || 'Client',
    service: paymentData.service,
    amount: paymentData.amount,
    orderId: paymentData.paymentId,
    dossierPDF: paymentData.dossierPDF,
    facturePDF: paymentData.facturePDF
  };
  
  return await sendDossierEmail(emailData);
}

// Fonction pour envoyer un rappel de paiement (2ème échéance)
export async function sendPaymentReminder(userData) {
  const reminderTemplate = `
    <h2>Rappel : 2ème échéance de votre paiement</h2>
    <p>Bonjour ${userData.name},</p>
    <p>Ceci est un rappel pour le second versement de 45€ prévu aujourd'hui.</p>
    <p>Montant restant : 45€</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/paiement/suite?token=${userData.token}">
      Procéder au paiement
    </a>
  `;
  
  // Implémenter l'envoi selon votre service email
  console.log('Rappel envoyé à:', userData.email);
  return { success: true };
}

// Fonction pour générer la facture PDF
export async function generateInvoicePDF(paymentData) {
  // Ici, vous pouvez utiliser une librairie comme jsPDF ou puppeteer
  // Pour l'instant, on retourne un placeholder
  
  const invoiceHTML = `
    <h1>FACTURE</h1>
    <p>N° ${paymentData.paymentId}</p>
    <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
    <p>Client: ${paymentData.name}</p>
    <p>Service: ${paymentData.service}</p>
    <p>Montant TTC: ${paymentData.amount}€</p>
  `;
  
  // Convertir en PDF (nécessite une librairie PDF)
  return Buffer.from(invoiceHTML);
}

// Export des templates pour utilisation dans d'autres modules
export const EMAIL_TEMPLATES = {
  dossier: emailTemplate,
  reminder: (data) => `Rappel de paiement pour ${data.name}`,
  welcome: (data) => `Bienvenue ${data.name} sur JUSTIJOB`
};