import { Card, CardContent } from "../ui/card";
import { ProfileAvatar } from "./avatar/ProfileAvatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CalendarDays, MapPin, Award, Mail, FileEdit } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileOverviewProps {
  profile: {
    name: string;
    specialty: string;
    crm: string;
    email: string;
    avatarUrl: string;
    hospitalName: string;
    memberSince: string;
  };
  loading: boolean;
}

export const ProfileOverview = ({ profile, loading }: ProfileOverviewProps) => {
  return (
    <Card className="overflow-hidden border-muted bg-gradient-to-b from-background to-muted/20">
      <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5" />
      
      <CardContent className="relative px-6 pb-6 -mt-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
            {loading ? (
              <Skeleton className="h-24 w-24 rounded-full" />
            ) : (
              <div className="bg-background p-1 rounded-full">
                <ProfileAvatar 
                  name={profile.name}
                  avatarUrl={profile.avatarUrl}
                  onAvatarUpdate={() => {}}
                  size="xl"
                />
              </div>
            )}
            
            <div className="space-y-1 text-center md:text-left">
              {loading ? (
                <>
                  <Skeleton className="h-7 w-40 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mt-2">{profile.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="outline" className="text-primary bg-primary/5">
                      {profile.specialty}
                    </Badge>
                    <Badge variant="outline">
                      CRM: {profile.crm}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20">
                      MedCheck Pro
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end items-center gap-2 mt-4 md:mt-0 pb-2">
            <Button variant="outline" size="sm" className="h-9 px-4 gap-1" asChild>
              <Link to="/settings">
                <FileEdit className="h-4 w-4 mr-1" />
                Editar Perfil
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.specialty}</p>
                  <p className="text-xs">Especialidade</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.hospitalName}</p>
                  <p className="text-xs">Hospital Principal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Membro desde {profile.memberSince}</p>
                  <p className="text-xs">Status da conta</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 flex justify-center md:justify-start">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" asChild>
            <a href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 