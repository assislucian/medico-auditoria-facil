
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { useState } from "react";
import { toast } from "sonner";

export const ProfileHeader = () => {
  const { fetchProfile, uploadAvatar } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Lucian",
    specialty: "Ortopedia",
    crm: "Não informado",
    avatarUrl: ""
  });

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadAvatar(file);
      if (url) {
        setProfile(prev => ({ ...prev, avatarUrl: url }));
        toast.success("Foto atualizada com sucesso");
      }
    } catch (error) {
      toast.error("Erro ao atualizar foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            ) : (
              <AvatarFallback className="text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <label 
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="text-center md:text-left flex-1">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.specialty}</p>
            {profile.crm && (
              <p className="text-sm">CRM: {profile.crm}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            <Badge variant="secondary">Ortopedia</Badge>
            <Badge variant="secondary">Traumatologia</Badge>
            <Badge variant="outline">Cirurgia</Badge>
          </div>
        </div>

        <div className="w-full md:w-auto grid grid-cols-2 gap-8 text-center">
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
    </Card>
  );
};
