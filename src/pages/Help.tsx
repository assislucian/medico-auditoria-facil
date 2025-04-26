
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { fetchHelpArticles } from '@/utils/supabase';
import { HelpArticle } from '@/types';

const HelpPage = () => {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Fetch help articles
  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        // Pass correct parameter type - an object with published property
        const data = await fetchHelpArticles({ published: true });
        setArticles(data as HelpArticle[]);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getArticles();
  }, []);
  
  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group articles by category
  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const category = article.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {} as Record<string, HelpArticle[]>);
  
  // Get unique categories
  const categories = Object.keys(groupedArticles);

  return (
    <MainLayout title="Ajuda">
      <Helmet>
        <title>Central de Ajuda | MedCheck</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Central de Ajuda</CardTitle>
            <CardDescription>
              Encontre respostas para perguntas frequentes e tutoriais sobre como usar o MedCheck.
            </CardDescription>
            
            <div className="relative mt-4">
              <SearchIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Pesquisar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="loader"></div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum artigo encontrado. Tente outra palavra-chave.
              </div>
            ) : (
              <Tabs defaultValue={categories[0] || 'Geral'} className="mt-4">
                <TabsList className="mb-4">
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map(category => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    {groupedArticles[category].map((article, index) => (
                      <div key={article.id}>
                        <div className="py-2">
                          <h3 className="text-lg font-medium">{article.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {article.excerpt || article.content.substring(0, 150)}...
                          </p>
                        </div>
                        {index < groupedArticles[category].length - 1 && <Separator />}
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
