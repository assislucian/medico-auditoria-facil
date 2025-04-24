
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | MedCheck</title>
      </Helmet>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        <div className="prose max-w-none">
          <p>Última atualização: Abril de 2025</p>
          
          <h2>1. Introdução</h2>
          <p>
            A MedCheck ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. 
            Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas 
            informações pessoais quando você utiliza nosso serviço de auditoria médica.
          </p>
          
          <h2>2. Informações que coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como dados cadastrais, 
            documentos médicos e demonstrativos financeiros que você carrega em nossa plataforma 
            para análise e auditoria.
          </p>
          
          <h2>3. Como usamos suas informações</h2>
          <p>
            Utilizamos suas informações para fornecer, manter e melhorar nossos serviços de 
            auditoria médica, processar seus documentos e identificar discrepâncias entre 
            guias médicas e demonstrativos de pagamento.
          </p>
          
          <h2>4. Compartilhamento de informações</h2>
          <p>
            Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário 
            para fornecer nossos serviços ou quando exigido por lei.
          </p>
          
          <h2>5. Segurança</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
            informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
          
          <h2>6. Seus direitos</h2>
          <p>
            Você tem o direito de acessar, corrigir, excluir ou exportar suas informações pessoais. 
            Para exercer esses direitos, entre em contato conosco através dos canais informados abaixo.
          </p>
          
          <h2>7. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo 
            email: privacy@medcheck.com.br
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
