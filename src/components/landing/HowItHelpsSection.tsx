
import React from 'react';
import { Check, FileText, ArrowUpRight, File, BarChart, AlertCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/typography';

export function HowItHelpsSection() {
  const features = [
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Análise automática de demonstrativos",
      description: "Upload dos seus demonstrativos e guias médicas e análise automática dos valores"
    },
    {
      icon: <Check className="h-5 w-5 text-primary" />,
      title: "Comparação com tabela CBHPM",
      description: "Comparação automática com os valores da tabela CBHPM atualizada"
    },
    {
      icon: <BarChart className="h-5 w-5 text-primary" />,
      title: "Relatórios detalhados",
      description: "Visualização clara dos valores pagos e diferenças encontradas"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      title: "Recuperação de valores",
      description: "Orientação para recurso administrativo e recuperação dos valores glosados"
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      title: "Alertas de inconsistências",
      description: "Notificações sobre divergências significativas nos pagamentos"
    },
    {
      icon: <File className="h-5 w-5 text-primary" />,
      title: "Histórico completo",
      description: "Armazenamento seguro de todos os documentos e análises realizadas"
    }
  ];

  return (
    <section className="py-20 px-6 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Heading as="h2" size="2" className="mb-4">
            Como o MedCheck ajuda você a recuperar o que é seu
          </Heading>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Nossa plataforma foi desenvolvida por profissionais de saúde, para profissionais de saúde,
            visando simplificar o processo de auditoria de contas médicas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
