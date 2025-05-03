
import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function WhatAreGlosasSection() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="md:col-span-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -z-10 blur-3xl opacity-20 w-96 h-96 bg-primary rounded-full -left-10 -top-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1450&q=80" 
                alt="Médico analisando documentos" 
                className="rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 relative z-10"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Heading as="h2" size="2" className="mb-6">
              O que são glosas médicas?
            </Heading>
            
            <div className="space-y-6 text-neutral-600 dark:text-neutral-300">
              <p className="leading-relaxed">
                Glosas médicas são recusas parciais ou totais de pagamentos por procedimentos realizados, feitas pelos planos de saúde. Elas acontecem quando a operadora discorda de cobranças específicas em um demonstrativo médico, seja por questões administrativas, ausência de documentação ou divergências em valores.
              </p>
              
              <p className="leading-relaxed">
                Estudos indicam que até <span className="font-semibold text-primary">12% do faturamento médico</span> pode ser perdido devido a glosas não contestadas, representando uma perda significativa de receita para médicos e instituições de saúde.
              </p>
              
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-700">
                <CardContent className="p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 dark:text-amber-300 font-medium">Problemas comuns incluem:</p>
                    <ul className="mt-2 space-y-1 list-disc pl-5 text-amber-700 dark:text-amber-400">
                      <li>Divergência entre o valor cobrado e o previsto em contratos</li>
                      <li>Ausência de documentação comprobatória</li>
                      <li>Incompatibilidade entre procedimento e diagnóstico</li>
                      <li>Falhas administrativas no faturamento</li>
                      <li>Cobrança de procedimentos não realizados ou autorizados</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <p className="leading-relaxed">
                O MedCheck foi desenvolvido para identificar automaticamente essas inconsistências, comparando os valores pagos com a tabela CBHPM e fornecendo relatórios detalhados para embasar o processo de recurso.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
