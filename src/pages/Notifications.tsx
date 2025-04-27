import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Mock data for notifications
const mockNotifications = [
  {
    id: "n1",
    type: "success",
    message: "Seu demonstrativo de Agosto foi processado com sucesso!",
    date: "2024-09-15T14:30:00",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    message: "Atenção: Há uma glosa pendente no demonstrativo de Julho.",
    date: "2024-09-10T09:00:00",
    read: true,
  },
  {
    id: "n3",
    type: "info",
    message: "Novo guia adicionado: Como contestar glosas.",
    date: "2024-09-05T16:45:00",
    read: true,
  },
];

const notificationColumns = [
  {
    field: "message",
    headerName: "Mensagem",
    flex: 1,
    renderCell: ({ row }) => (
      <div className="flex items-center">
        {row.type === "success" && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
        {row.type === "warning" && <XCircle className="w-4 h-4 mr-2 text-amber-500" />}
        {row.type === "info" && <Bell className="w-4 h-4 mr-2 text-blue-500" />}
        <span>{row.message}</span>
      </div>
    ),
  },
  {
    field: "date",
    headerName: "Data",
    width: 150,
    valueFormatter: ({ value }) => {
      const date = new Date(value);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    field: "read",
    headerName: "Status",
    width: 120,
    renderCell: ({ value }) => (
      <Badge variant={value ? "secondary" : "default"}>{value ? "Lida" : "Não Lida"}</Badge>
    ),
  },
];

const NotificationsPage = () => {
  const [notifications] = useState<any[]>(mockNotifications);

  return (
    <AuthenticatedLayout title="Notificações">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Bell className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-medium">Suas Notificações</h3>
            </div>
          </CardHeader>
          <CardContent>
            <DataGrid
              rows={notifications}
              columns={notificationColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default NotificationsPage;
