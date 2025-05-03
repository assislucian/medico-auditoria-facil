
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart4, DollarSign } from 'lucide-react';
import { Heading } from '@/components/ui/typography';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Envie seus arquivos em PDF",
      description: "Guias médicas e demonstrativos de pagamento."
    },
    {
      icon: <BarChart4 className="h-8 w-8 text-primary" />,
      title: "A plataforma cruza os dados",
      description: "Com base na CBHPM, função médica e valores pagos."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Você descobre o que perdeu",
      description: "Veja os erros, recupere os valores e gere relatórios."
    }
  ];

  return (
    <section className="py-20 px-6 bg-white dark:bg-neutral-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Heading as="h2" size="2" className="mb-4">
            Como funciona o MedCheck
          </Heading>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
