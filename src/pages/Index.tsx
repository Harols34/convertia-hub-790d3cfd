import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Building2, Users, Package } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Usuarios Convert-IA
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sistema integral de gestión multiempresa para control de usuarios,
            accesos y mesa de ayuda
          </p>

          <div className="flex gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg"
            >
              Acceso Administrador
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/portal")}
              className="text-lg"
            >
              Portal Usuario
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <Building2 className="w-10 h-10 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Multiempresa</h3>
              <p className="text-muted-foreground text-sm">
                Arquitectura totalmente aislada por empresa con gestión independiente
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-10 h-10 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Gestión de Usuarios</h3>
              <p className="text-muted-foreground text-sm">
                Control completo de usuarios con carga masiva y códigos únicos
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <Package className="w-10 h-10 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Aplicativos</h3>
              <p className="text-muted-foreground text-sm">
                Gestión de credenciales y aplicativos globales o personalizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
