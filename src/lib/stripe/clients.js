
// src/lib/stripe/client.js
import { loadStripe } from '@stripe/stripe-js';

// Charger Stripe une seule fois
let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise) {
    // Utiliser la clé publique Stripe (commence par pk_)
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('⚠️ Clé Stripe publique manquante. Mode test activé.');
      return null;
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

// Configuration des options Stripe
export const STRIPE_CONFIG = {
  // Options pour le checkout
  checkoutOptions: {
    locale: 'fr',
    billingAddressCollection: 'required',
    phoneNumberCollection: {
      enabled: true
    },
    allowPromotionCodes: true,
    submitType: 'pay'
  },
  
  // Options pour les éléments de paiement
  elementsOptions: {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      }
    ],
    locale: 'fr',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb', // Bleu primaire
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      }
    }
  },
  
  // Messages d'erreur personnalisés
  errorMessages: {
    'card_declined': 'Votre carte a été refusée. Veuillez essayer une autre carte.',
    'insufficient_funds': 'Fonds insuffisants sur votre carte.',
    'incorrect_cvc': 'Le code CVC est incorrect.',
    'expired_card': 'Votre carte a expiré.',
    'processing_error': 'Une erreur est survenue. Veuillez réessayer.',
    'incorrect_number': 'Le numéro de carte est incorrect.',
    'generic_decline': 'Le paiement a été refusé. Veuillez contacter votre banque.',
    'default': 'Une erreur est survenue lors du paiement.'
  }
};

// Fonction pour créer une session de checkout
export async function createCheckoutSession(data) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session');
    }
    
    const session = await response.json();
    
    if (session.url) {
      // Redirection vers Stripe Checkout hébergé
      window.location.href = session.url;
    } else if (session.sessionId) {
      // Utiliser Stripe Elements (paiement intégré)
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId
        });
        
        if (error) {
          throw error;
        }
      }
    }
    
    return session;
  } catch (error) {
    console.error('Erreur création session:', error);
    throw error;
  }
}

// Fonction pour vérifier un paiement
export async function verifyPayment(sessionId) {
  try {
    const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return { success: false, error: error.message };
  }
}

// Fonction pour formater le prix
export function formatPrice(amount, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Fonction pour valider un numéro de carte (Luhn algorithm)
export function validateCardNumber(number) {
  const digits = number.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Fonction pour détecter le type de carte
export function detectCardType(number) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^35/
  };
  
  const digits = number.replace(/\D/g, '');
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(digits)) {
      return type;
    }
  }
  
  return 'unknown';
}

// Hook personnalisé pour gérer Stripe (à utiliser dans les composants React)
export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const processPayment = async (paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createCheckoutSession(paymentData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    processPayment,
    loading,
    error,
    formatPrice,
    validateCardNumber,
    detectCardType
  };
}