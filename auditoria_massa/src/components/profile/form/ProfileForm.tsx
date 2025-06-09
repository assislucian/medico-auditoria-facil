
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfileForm } from "@/hooks/use-profile-form";
import { BasicInfoFields } from "../form-fields/BasicInfoFields";
import { ProfessionalFields } from "../form-fields/ProfessionalFields";
import { useState } from "react";
import { toast } from "sonner";

export interface ProfileFormProps {
  loading?: boolean;
}

export const ProfileForm = ({ loading }: ProfileFormProps) => {
  const { form, onSubmit } = useProfileForm();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSubmit = async (data: any) => {
    try {
      setFormState('submitting');
      await onSubmit(data);
      setFormState('submitted');
      setTimeout(() => setFormState('idle'), 2000);
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      setFormState('idle');
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-base font-medium">Dados pessoais</h3>
              <BasicInfoFields form={form} />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-base font-medium">Informações profissionais</h3>
              <ProfessionalFields form={form} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || formState === 'submitting'} 
              className="min-w-[140px]"
            >
              {formState === 'submitting' ? "Salvando..." : 
               formState === 'submitted' ? "Salvo com sucesso!" : 
               "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
