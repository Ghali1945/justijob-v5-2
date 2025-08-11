
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Star, ArrowRight, CheckCircle, Users, FileText, Clock, Shield, Zap, Award, ChevronRight, ChevronLeft, AlertCircle, Brain, Send, Euro } from 'lucide-react';

// Composant Navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#fonctionnement', label: 'Comment ça marche' },
    { href: '#experts', label: 'Nos Experts' },
    { href: '#diagnostic', label: 'Diagnostic' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">JustiJob</span>
            <span className="text-sm text-orange-600 font-medium ml-2">Défense Active</span>
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
            <a href="#diagnostic" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105">
              Commencer Gratuitement
            </a>
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
              <a href="#diagnostic" className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 mt-4 text-center">
                Commencer Gratuitement
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Composant Hero Section
const HeroSection = () => {
  return (
    <section id="accueil" className="min-h-screen flex items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Votre <span className="text-yellow-300">Avocat Virtuel</span><br/>
            <span className="text-3xl md:text-5xl font-medium">24h/24 • 7j/7</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            <strong>Défendez vos droits de salarié</strong> avec l'intelligence artificielle et l'expertise de nos juristes. 
            Diagnostic gratuit, documents automatisés, accompagnement prud'hommes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#diagnostic" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-2xl flex items-center">
              <Zap className="mr-2" size={20} />
              Commencer Mon Diagnostic Gratuit
            </a>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200">
              📱 Voir une Démo
            </button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-white/90">
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm">Taux de Succès</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24h</div>
              <div className="text-sm">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">-90%</div>
              <div className="text-sm">Coût vs Avocat</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Comment ça marche
const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Diagnostic Gratuit',
      description: 'Décrivez votre situation en quelques clics. Notre IA analyse votre cas et vous donne un premier avis juridique gratuit en moins de 2 minutes.',
      highlight: '100% Gratuit • Résultat Immédiat',
      color: 'blue'
    },
    {
      number: '2',
      title: 'Documents Automatisés',
      description: 'Générez automatiquement tous vos documents juridiques : lettres de mise en demeure, requêtes prud\'hommes, calculs d\'indemnités personnalisés.',
      highlight: '+50 Modèles • Validés Juridiquement',
      color: 'green'
    },
    {
      number: '3',
      title: 'Accompagnement Expert',
      description: 'Nos avocats et juristes valident votre stratégie. Support prioritaire, conseils personnalisés et mise en relation avec des experts si nécessaire.',
      highlight: 'Experts Dédiés • Support 24h/24',
      color: 'orange'
    }
  ];

  return (
    <section id="fonctionnement" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            3 Étapes pour Défendre Vos Droits
          </h2>
          <p className="text-xl text-gray-600">
            Simple, rapide, efficace - JustiJob révolutionne l'accès au droit
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-24 h-24 ${
                step.color === 'blue' ? 'bg-blue-600' : 
                step.color === 'green' ? 'bg-green-600' : 
                'bg-orange-600'
              } rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6`}>
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
              <p className="text-gray-600 mb-6">{step.description}</p>
              <div className={`${
                step.color === 'blue' ? 'bg-blue-50' : 
                step.color === 'green' ? 'bg-green-50' : 
                'bg-orange-50'
              } rounded-lg p-4`}>
                <span className={`${
                  step.color === 'blue' ? 'text-blue-600' : 
                  step.color === 'green' ? 'text-green-600' : 
                  'text-orange-600'
                } font-semibold`}>
                  {step.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant Experts
const ExpertsSection = () => {
  return (
    <section id="experts" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Notre Collège d'Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une équipe d'avocats et juristes spécialisés en droit social supervise notre IA pour vous garantir une expertise juridique irréprochable
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">L'Excellence Juridique au Service de Tous</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Shield size={20} />
                  </div>
                  <span className="text-lg">Avocats spécialisés en droit du travail</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Award size={20} />
                  </div>
                  <span className="text-lg">Juristes experts en procédures prud'homales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Users size={20} />
                  </div>
                  <span className="text-lg">Magistrats en conseil scientifique</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <FileText size={20} />
                  </div>
                  <span className="text-lg">+20 ans d'expérience cumulée</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-6xl font-bold mb-4">95%</div>
                <div className="text-xl mb-4">Taux de Succès</div>
                <div className="text-white/80">
                  Nos clients gagnent leurs procédures grâce à l'expertise de notre collège et la puissance de notre IA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Formulaire de Diagnostic (version simplifiée pour la démo)
const DiagnosticForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <section id="diagnostic" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Prêt à analyser votre situation ?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Notre IA juridique va évaluer vos droits en moins de 2 minutes
          </p>
          <button
            onClick={() => setShowDemo(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-6 rounded-full text-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-2xl"
          >
            <Zap className="inline mr-3" size={24} />
            Lancer le Diagnostic Gratuit
          </button>
          <div className="mt-8 flex justify-center items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Shield className="mr-2 text-green-600" size={20} />
              <span className="text-sm">100% Confidentiel</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-blue-600" size={20} />
              <span className="text-sm">2 min</span>
            </div>
            <div className="flex items-center">
              <Euro className="mr-2 text-orange-600" size={20} />
              <span className="text-sm">Gratuit</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnostic" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Diagnostic Juridique Gratuit
            </h2>
            <p className="text-gray-600">
              Étape {currentStep} sur 6
            </p>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8 min-h-[300px]">
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Quelle est votre situation ?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Licenciement', 'Harcèlement', 'Heures supplémentaires', 'Discrimination'].map((situation) => (
                    <button
                      key={situation}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <h4 className="font-bold text-gray-800">{situation}</h4>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Décrivez votre situation
                </h3>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Expliquez les faits en détail..."
                />
              </div>
            )}

            {currentStep > 2 && currentStep < 6 && (
              <div className="text-center py-12">
                <Brain className="mx-auto text-blue-600 mb-4" size={60} />
                <p className="text-gray-600">
                  Continuez à remplir les informations pour obtenir votre diagnostic personnalisé...
                </p>
              </div>
            )}

            {currentStep === 6 && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-green-600 mb-4" size={60} />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Analyse terminée !
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre diagnostic est prêt. Entrez votre email pour le recevoir.
                </p>
                <input
                  type="email"
                  className="w-full max-w-md mx-auto p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="mr-2" size={20} />
              Précédent
            </button>

            <button
              onClick={() => {
                if (currentStep < 6) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              {currentStep === 6 ? 'Obtenir mon diagnostic' : 'Suivant'}
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-white">JustiJob</span>
              <span className="text-orange-500 font-medium ml-3">Défense Active</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              La première plateforme d'intelligence artificielle dédiée à la défense des droits des salariés. 
              Accessible, efficace, révolutionnaire.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Diagnostic Gratuit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documents Automatisés</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accompagnement Expert</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} JustiJob - Défense Active. Tous droits réservés. | Made with ❤️ for Justice</p>
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
      <HowItWorks />
      <ExpertsSection />
      <DiagnosticForm />
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