
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Home | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <section className="bg-gradient-to-b from-blue-50 to-white py-20">
            <div className="container mx-auto text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                MedCheck - Auditoria Médica Inteligente
              </h1>
              <p className="text-xl mb-8 text-gray-700 max-w-3xl mx-auto">
                Otimize seu processo de auditoria médica e recupere valores glosados 
                indevidamente com nossa plataforma inteligente.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => navigate('/nova-auditoria')} size="lg">
                  Nova Auditoria
                </Button>
                <Button variant="outline" onClick={() => navigate('/historico')} size="lg">
                  Ver Histórico
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default HomePage;
