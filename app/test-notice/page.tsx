import LegalNotice from '@/components/legal/LegalNotice';

export default function TestNoticePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Test Notice Légale JustiJob
      </h1>
      <LegalNotice dossierRef="TEST-2024-001" />
    </div>
  );
}