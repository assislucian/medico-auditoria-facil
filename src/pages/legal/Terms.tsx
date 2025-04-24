
import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Uso | MedCheck</title>
      </Helmet>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
        <div className="prose max-w-none">
          <p>Última atualização: Abril de 2025</p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o MedCheck, você concorda com estes Termos de Uso. Se você não 
            concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
          </p>
          
          <h2>2. Descrição do Serviço</h2>
          <p>
            O MedCheck é uma plataforma de auditoria médica que permite a comparação 
            automatizada de guias médicas e demonstrativos de pagamento para identificar 
            discrepâncias e possíveis valores glosados indevidamente.
          </p>
          
          <h2>3. Conta de Usuário</h2>
          <p>
            Para usar certos recursos do MedCheck, você precisará criar uma conta. Você é 
            responsável por manter a confidencialidade de sua senha e por todas as atividades 
            que ocorrerem em sua conta.
          </p>
          
          <h2>4. Uso Adequado</h2>
          <p>
            Você concorda em usar o MedCheck apenas para fins legais e de acordo com estes 
            Termos. Você não usará o serviço para atividades fraudulentas ou que violem 
            leis aplicáveis.
          </p>
          
          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo, design, gráficos, interfaces e código do MedCheck são de 
            propriedade exclusiva da empresa e protegidos por leis de propriedade intelectual.
          </p>
          
          <h2>6. Limitação de Responsabilidade</h2>
          <p>
            O MedCheck é fornecido "como está", sem garantias de qualquer tipo. Não nos 
            responsabilizamos por decisões tomadas com base nas análises fornecidas pela plataforma.
          </p>
          
          <h2>7. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações 
            entrarão em vigor imediatamente após serem publicadas na plataforma.
          </p>
          
          <h2>8. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo 
            email: legal@medcheck.com.br
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
