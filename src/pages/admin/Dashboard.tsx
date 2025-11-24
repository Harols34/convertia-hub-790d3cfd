import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, Package, Bell, TrendingUp } from "lucide-react";

interface Stats {
  empresas: number;
  usuarios: number;
  aplicativos: number;
  alarmas: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    empresas: 0,
    usuarios: 0,
    aplicativos: 0,
    alarmas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empresasRes, usuariosRes, aplicativosGRes, aplicativosERes, alarmasRes] =
          await Promise.all([
            supabase.from("empresas").select("id", { count: "exact", head: true }),
            supabase.from("usuarios_finales").select("id", { count: "exact", head: true }),
            supabase.from("aplicativos_globales").select("id", { count: "exact", head: true }),
            supabase.from("aplicativos_empresa").select("id", { count: "exact", head: true }),
            supabase.from("alarmas").select("id", { count: "exact", head: true }),
          ]);

        setStats({
          empresas: empresasRes.count || 0,
          usuarios: usuariosRes.count || 0,
          aplicativos: (aplicativosGRes.count || 0) + (aplicativosERes.count || 0),
          alarmas: alarmasRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Empresas",
      value: stats.empresas,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Usuarios",
      value: stats.usuarios,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Aplicativos",
      value: stats.aplicativos,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Alarmas",
      value: stats.alarmas,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de gestión multiempresa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? "..." : stat.value}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <TrendingUp className="h-3 w-3 mr-1 text-success" />
                Sistema activo
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido a Convert-IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sistema integral de gestión de usuarios, accesos y mesa de ayuda con
            arquitectura multiempresa completamente aislada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">🏢 Gestión Multiempresa</h3>
              <p className="text-sm text-muted-foreground">
                Cada empresa funciona de forma independiente con sus propios
                aplicativos, usuarios y configuraciones.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">👥 Control de Usuarios</h3>
              <p className="text-sm text-muted-foreground">
                Gestión centralizada de usuarios finales con carga masiva y códigos
                únicos de acceso.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">📦 Aplicativos</h3>
              <p className="text-sm text-muted-foreground">
                Gestión de aplicativos globales y personalizados por empresa con
                credenciales seguras.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">🔔 Mesa de Ayuda</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de alarmas y tickets con historial completo y seguimiento
                en tiempo real.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
