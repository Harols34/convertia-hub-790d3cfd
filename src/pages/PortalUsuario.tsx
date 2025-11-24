import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Package, AlertCircle } from "lucide-react";

interface UsuarioInfo {
  id: string;
  nombre_completo: string;
  numero_documento: string;
  celular: string | null;
  email: string | null;
  empresas: {
    nombre: string;
  };
}

const PortalUsuario = () => {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const { toast } = useToast();

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("usuarios_finales")
        .select(`
          *,
          empresas (
            nombre
          )
        `)
        .eq("codigo_unico", codigo.trim())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "No encontrado",
          description: "El código ingresado no existe",
          variant: "destructive",
        });
        return;
      }

      setUsuario(data);
    } catch (error) {
      console.error("Error buscando usuario:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar el código",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
          <div className="text-center text-white mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shadow-premium">
                <Shield className="w-10 h-10 text-secondary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Busca tu Info</h1>
            <p className="text-white/90">
              Ingresa tu código único para acceder a tus aplicativos
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleBuscar} className="space-y-4">
                <div>
                  <Label htmlFor="codigo">Código Único</Label>
                  <Input
                    id="codigo"
                    placeholder="Ej: 12345_juan"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Buscando..." : "Buscar mi información"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {usuario && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{usuario.nombre_completo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Empresa</p>
                      <p className="font-medium">{usuario.empresas.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Documento</p>
                      <p className="font-medium">{usuario.numero_documento}</p>
                    </div>
                    {usuario.celular && (
                      <div>
                        <p className="text-sm text-muted-foreground">Celular</p>
                        <p className="font-medium">{usuario.celular}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Mis Aplicativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>No tienes aplicativos asignados aún</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalUsuario;
