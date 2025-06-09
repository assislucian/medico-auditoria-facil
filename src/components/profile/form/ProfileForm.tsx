
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfileForm } from "@/hooks/use-profile-form";
import { BasicInfoFields } from "../form-fields/BasicInfoFields";
import { ProfessionalFields } from "../form-fields/ProfessionalFields";

export interface ProfileFormProps {
  loading?: boolean;
}

export const ProfileForm = ({ loading }: ProfileFormProps) => {
  const { form, onSubmit } = useProfileForm();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informações Pessoais</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais e profissionais
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields form={form} />
          <ProfessionalFields form={form} />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
