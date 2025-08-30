'use client';

export default function Home() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Bannière avec lien notice */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold' }}>JustiJob v5.0.0 - Protection Juridique Intégrée</span>
        <a href="/test-notice" style={{
          backgroundColor: 'white',
          color: '#1e40af',
          padding: '5px 15px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          📋 Notice Légale Obligatoire
        </a>
      </div>
      
      {/* Interface v4 via iframe */}
      <iframe 
        src="https://chic-clafoutis-6e43c7.netlify.app/"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          paddingTop: '50px'
        }}
        title="JustiJob Interface"
      />
    </div>
  );
}