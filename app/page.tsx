
export default function Home() {
  return (
    <div style={{ minHeight: '100vh', padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2563eb', fontSize: '48px', marginBottom: '20px' }}>
        JustiJob v5.0.0
      </h1>
      <p style={{ fontSize: '24px', color: '#666', marginBottom: '40px' }}>
        Protection Juridique Intégrée
      </p>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <a 
          href="https://chic-clafoutis-6e43c7.netlify.app"
          style={{
            display: 'block',
            background: '#2563eb',
            color: 'white',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            marginBottom: '20px'
          }}
        >
          Interface Complète JustiJob
        </a>
        
        <a 
          href="/test-notice"
          style={{
            display: 'block',
            background: '#dc2626',
            color: 'white',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px'
          }}
        >
          Notice Légale v5
        </a>
      </div>
    </div>
  );
}