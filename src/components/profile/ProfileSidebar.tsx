
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSidebarProps {
  name: string;
  specialty: string;
  crm: string;
}

export const ProfileSidebar = ({ name, specialty, crm }: ProfileSidebarProps) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mb-6">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200" />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-muted-foreground">{specialty}</p>
        <p className="text-sm mt-1">CRM: {crm}</p>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Ortopedia</Badge>
          <Badge variant="secondary">Traumatologia</Badge>
          <Badge variant="outline">Cirurgia</Badge>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">Análises</p>
            </div>
            <div>
              <p className="text-2xl font-bold">R$ 12.450</p>
              <p className="text-sm text-muted-foreground">Recuperados</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="outline" className="w-full">
            Editar Foto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
