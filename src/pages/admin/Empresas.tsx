import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Building2, Edit, Trash2 } from "lucide-react";

interface Empresa {
  id: string;
  nombre: string;
  nit: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  activa: boolean;
  created_at: string;
}

const Empresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    nit: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error fetching empresas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("empresas").insert([formData]);

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Empresa creada correctamente",
      });

      setDialogOpen(false);
      setFormData({ nombre: "", nit: "", telefono: "", email: "", direccion: "" });
      fetchEmpresas();
    } catch (error) {
      console.error("Error creating empresa:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la empresa",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta empresa?")) return;

    try {
      const { error } = await supabase.from("empresas").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Empresa eliminada correctamente",
      });

      fetchEmpresas();
    } catch (error) {
      console.error("Error deleting empresa:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la empresa",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Empresas</h1>
          <p className="text-muted-foreground">
            Gestión de cuentas de empresas en el sistema
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Empresa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Empresa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  value={formData.nit}
                  onChange={(e) =>
                    setFormData({ ...formData, nit: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Crear Empresa
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">Cargando empresas...</div>
      ) : empresas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No hay empresas registradas. Crea la primera empresa.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <Card key={empresa.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {empresa.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {empresa.nit && (
                  <p className="text-sm">
                    <span className="font-medium">NIT:</span> {empresa.nit}
                  </p>
                )}
                {empresa.telefono && (
                  <p className="text-sm">
                    <span className="font-medium">Tel:</span> {empresa.telefono}
                  </p>
                )}
                {empresa.email && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {empresa.email}
                  </p>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(empresa.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Empresas;
