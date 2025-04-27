
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuidesList } from '@/components/help/GuidesList';
import { VideosList } from '@/components/help/VideosList';
import { FAQSection } from '@/components/help/FAQSection';
import { guides, videos } from '@/data/helpGuides';
import { faqItems } from '@/data/helpFAQs';
import { SearchBar } from '@/components/help/SearchBar';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('guides');

  return (
    <MainLayout title="Central de Ajuda">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Central de Ajuda
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Encontre respostas para suas dúvidas sobre o MedCheck
          </p>
          <SearchBar onSearch={(term) => console.log('Searching:', term)} />
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="guides">Guias</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-8">
            <GuidesList guides={guides} />
          </TabsContent>

          <TabsContent value="videos" className="space-y-8">
            <VideosList videos={videos} />
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <FAQSection items={faqItems} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
