
// src/app/page.js
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Star, ArrowRight, CheckCircle, Users, FileText, Clock, Shield, Zap, Award, ChevronRight, ChevronLeft, AlertCircle, Brain, Send, Euro, Calculator, Scale, Gift, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Composant Navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#services-gratuits', label: 'Services Gratuits' },
    { href: '#fonctionnement', label: 'Comment ça marche' },
    { href: '#tarifs', label: 'Options' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">JUSTIJOB</span>
            <span className="text-sm text-orange-600 font-medium ml-2">La Défense Active</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => router.push('/diagnostic')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              ✨ Diagnostic GRATUIT
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  router.push('/diagnostic');
                  setIsOpen(false);
                }}
                className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 mt-4 text-center"
              >
                ✨ Diagnostic GRATUIT
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Composant Hero Section
const HeroSection = () => {
  const router = useRouter();
  
  return (
    <section id="accueil" className="min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-2 rounded-full inline-block mb-6 font-bold">
            ✨ DIAGNOSTIC 100% GRATUIT
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Défendez vos <span className="text-yellow-300">Droits de Salarié</span><br/>
            <span className="text-3xl md:text-5xl font-medium">avec nos Juristes et notre Agent IA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            <strong>Diagnostic gratuit avec scoring de victoire</strong> par notre IA juridique (Claude).
            Calculateurs gratuits, modèles de lettres, guide prud'hommes complet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => router.push('/diagnostic')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-2xl flex items-center"
            >
              <Gift className="mr-2" size={20} />
              Obtenir Mon Diagnostic Gratuit
            </button>
            <button 
              onClick={() => router.push('/calculateurs/heures-sup')}
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
            >
              <Calculator className="inline mr-2" size={20} />
              Calculer Mes Heures Sup
            </button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-white/90">
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm">Gratuit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">IA</div>
              <div className="text-sm">Claude (Anthropic)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2 min</div>
              <div className="text-sm">Résultat immédiat</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Section Services Gratuits
const FreeServices = () => {
  const router = useRouter();
  
  const services = [
    {
      icon: <Brain size={40} />,
      title: 'Diagnostic IA avec Scoring',
      description: 'Analyse complète de votre situation avec probabilité de victoire aux prud\'hommes',
      action: () => router.push('/diagnostic'),
      buttonText: 'Lancer le diagnostic',
      color: 'blue'
    },
    {
      icon: <Calculator size={40} />,
      title: 'Calculateurs Gratuits',
      description: 'Heures sup, indemnités de licenciement, congés payés... Calculs précis et téléchargeables',
      action: () => router.push('/calculateurs'),
      buttonText: 'Accéder aux calculateurs',
      color: 'green'
    },
    {
      icon: <FileText size={40} />,
      title: 'Guide Prud\'hommes',
      description: 'Guide complet pour saisir les prud\'hommes sans avocat, modèles de lettres inclus',
      action: () => router.push('/urgence'),
      buttonText: 'Consulter le guide',
      color: 'purple'
    },
    {
      icon: <Scale size={40} />,
      title: 'Analyse Juridique IA',
      description: 'Notre agent IA (Claude) analyse votre cas et vous oriente vers les bonnes solutions',
      action: () => router.push('/diagnostic'),
      buttonText: 'Poser ma question',
      color: 'orange'
    }
  ];

  return (
    <section id="services-gratuits" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="bg-green-600 text-white px-6 py-2 rounded-full inline-block mb-4 font-bold">
            🎁 100% GRATUIT - SANS ENGAGEMENT
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Tous nos Services Gratuits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accédez gratuitement à une analyse complète de vos droits avec scoring de victoire, 
            calculateurs et guides pratiques. Aucune carte bancaire requise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <div className={`w-16 h-16 ${
                service.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                service.color === 'green' ? 'bg-green-100 text-green-600' :
                service.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              } rounded-full flex items-center justify-center mb-6`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <button
                onClick={service.action}
                className={`w-full ${
                  service.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  service.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  service.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                  'bg-orange-600 hover:bg-orange-700'
                } text-white py-3 rounded-lg font-semibold transition-all duration-200`}
              >
                {service.buttonText} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant Comment ça marche
const HowItWorks = () => {
  const router = useRouter();
  
  const steps = [
    {
      number: '1',
      title: 'Diagnostic Gratuit',
      description: 'Répondez à quelques questions simples. Notre IA analyse votre situation et calcule vos chances de succès.',
      highlight: '✅ 100% Gratuit • Scoring immédiat',
      color: 'green',
      free: true
    },
    {
      number: '2',
      title: 'Évaluation & Calculs',
      description: 'Recevez votre scoring de victoire, calculez vos indemnités, téléchargez votre analyse complète.',
      highlight: '✅ Téléchargement PDF gratuit',
      color: 'blue',
      free: true
    },
    {
      number: '3',
      title: 'Dossier Prud\'homal (Optionnel)',
      description: 'Si vous souhaitez aller plus loin, obtenez votre dossier complet prêt à déposer.',
      highlight: '💼 120€ (ou 60€ via syndicat)',
      color: 'orange',
      free: false
    }
  ];

  return (
    <section id="fonctionnement" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600">
            Simple, transparent, majoritairement gratuit
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {step.free && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  GRATUIT
                </div>
              )}
              <div className={`w-24 h-24 ${
                step.color === 'green' ? 'bg-green-600' : 
                step.color === 'blue' ? 'bg-blue-600' : 
                'bg-orange-600'
              } rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6`}>
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
              <p className="text-gray-600 mb-6">{step.description}</p>
              <div className={`${
                step.color === 'green' ? 'bg-green-50' : 
                step.color === 'blue' ? 'bg-blue-50' : 
                'bg-orange-50'
              } rounded-lg p-4`}>
                <span className={`${
                  step.color === 'green' ? 'text-green-600' : 
                  step.color === 'blue' ? 'text-blue-600' : 
                  'text-orange-600'
                } font-semibold`}>
                  {step.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/diagnostic')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl"
          >
            Commencer mon diagnostic gratuit →
          </button>
        </div>
      </div>
    </section>
  );
};

// Section Tarifs (discrète)
const PricingSection = () => {
  const router = useRouter();
  
  return (
    <section id="tarifs" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Options pour aller plus loin
          </h2>
          <p className="text-lg text-gray-600">
            Après votre diagnostic gratuit, si vous souhaitez un dossier complet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Option Gratuite */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              POPULAIRE
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Diagnostic Gratuit</h3>
            <div className="text-4xl font-bold text-green-600 mb-4">0€</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={20} />
                <span>Analyse complète par IA</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={20} />
                <span>Scoring de victoire</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={20} />
                <span>Tous les calculateurs</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={20} />
                <span>Téléchargement PDF</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={20} />
                <span>Guide prud'hommes</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/diagnostic')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Commencer gratuitement
            </button>
          </div>

          {/* Option Individuelle */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Dossier Complet</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">120€</div>
            <p className="text-sm text-gray-600 mb-4">ou 2 × 60€</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="text-blue-500 mr-2 mt-1" size={20} />
                <span>Tout le gratuit inclus</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-blue-500 mr-2 mt-1" size={20} />
                <span>Dossier personnalisé</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-blue-500 mr-2 mt-1" size={20} />
                <span>Formulaire Cerfa rempli</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-blue-500 mr-2 mt-1" size={20} />
                <span>Stratégie sur mesure</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-blue-500 mr-2 mt-1" size={20} />
                <span>Prêt à déposer</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/urgence#dossier-complet')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              En savoir plus
            </button>
          </div>

          {/* Option Syndicale */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Via Syndicat</h3>
            <div className="text-4xl font-bold text-purple-600 mb-4">60€</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="text-purple-500 mr-2 mt-1" size={20} />
                <span>Tarif syndiqué réduit</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-500 mr-2 mt-1" size={20} />
                <span>Même dossier complet</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-500 mr-2 mt-1" size={20} />
                <span>Transmis au syndicat</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-500 mr-2 mt-1" size={20} />
                <span>Accompagnement syndical</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-500 mr-2 mt-1" size={20} />
                <span>Support prioritaire</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/syndicats')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Accès syndical
            </button>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <p className="text-gray-700">
            <strong>💡 Bon à savoir :</strong> Le diagnostic et tous les calculateurs restent 100% gratuits. 
            Vous ne payez que si vous avez besoin d'un dossier prud'homal complet personnalisé.
          </p>
        </div>
      </div>
    </section>
  );
};

// Section Statistiques
const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Notre Impact
          </h2>
          <p className="text-xl text-blue-100">
            Des milliers de salariés défendus avec succès
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">10K+</div>
            <div className="text-blue-100">Diagnostics gratuits</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">85%</div>
            <div className="text-blue-100">Taux de succès</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">2M€</div>
            <div className="text-blue-100">Récupérés pour nos utilisateurs</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">24/7</div>
            <div className="text-blue-100">IA disponible</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-white">JUSTIJOB</span>
              <span className="text-orange-500 font-medium ml-3">La Défense Active</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Plateforme éthique et solidaire d'aide aux salariés. 
              Diagnostic gratuit avec IA, scoring de victoire, calculateurs et guides pratiques.
            </p>
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block">
              ✨ Diagnostic 100% GRATUIT
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Services Gratuits</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => router.push('/diagnostic')} className="hover:text-white transition-colors">Diagnostic avec scoring</button></li>
              <li><button onClick={() => router.push('/calculateurs/heures-sup')} className="hover:text-white transition-colors">Calculateur heures sup</button></li>
              <li><button onClick={() => router.push('/urgence')} className="hover:text-white transition-colors">Guide prud'hommes</button></li>
              <li><button onClick={() => router.push('/calculateurs')} className="hover:text-white transition-colors">Tous les calculateurs</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => router.push('/contact')} className="hover:text-white transition-colors">Contact</button></li>
              <li><button onClick={() => router.push('/cgv')} className="hover:text-white transition-colors">CGV</button></li>
              <li><button onClick={() => router.push('/mentions-legales')} className="hover:text-white transition-colors">Mentions Légales</button></li>
              <li><button onClick={() => router.push('/politique-confidentialite')} className="hover:text-white transition-colors">Confidentialité</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} JUSTIJOB - La Défense Active. Tous droits réservés.</p>
          <p className="mt-2">Créé avec ❤️ pour la justice sociale | Propulsé par l'IA Claude (Anthropic)</p>
        </div>
      </div>
    </footer>
  );
};

// Page principale
export default function Home() {
  useEffect(() => {
    // Smooth scroll pour les ancres
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FreeServices />
      <HowItWorks />
      <PricingSection />
      <StatsSection />
      <Footer />
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}