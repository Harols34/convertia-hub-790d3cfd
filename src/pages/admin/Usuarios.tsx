import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Users, Search, Download } from "lucide-react";

interface Usuario {
  id: string;
  empresa_id: string;
  numero_documento: string;
  nombre_completo: string;
  celular: string | null;
  email: string | null;
  codigo_unico: string | null;
  activo: boolean;
  empresas: {
    nombre: string;
  };
}

interface Empresa {
  id: string;
  nombre: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    empresa_id: "",
    numero_documento: "",
    nombre_completo: "",
    celular: "",
    email: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usuariosRes, empresasRes] = await Promise.all([
        supabase.from("usuarios_finales").select(`
          *,
          empresas (
            nombre
          )
        `).order("created_at", { ascending: false }),
        supabase.from("empresas").select("id, nombre").eq("activa", true),
      ]);

      if (usuariosRes.error) throw usuariosRes.error;
      if (empresasRes.error) throw empresasRes.error;

      setUsuarios(usuariosRes.data || []);
      setEmpresas(empresasRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCodigoUnico = (documento: string, nombre: string) => {
    const nombrePart = nombre.split(" ")[0].toLowerCase();
    return `${documento}_${nombrePart}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codigoUnico = generateCodigoUnico(
      formData.numero_documento,
      formData.nombre_completo
    );

    try {
      const { error } = await supabase.from("usuarios_finales").insert([
        {
          ...formData,
          codigo_unico: codigoUnico,
        },
      ]);

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: `Usuario creado con código: ${codigoUnico}`,
      });

      setDialogOpen(false);
      setFormData({
        empresa_id: "",
        numero_documento: "",
        nombre_completo: "",
        celular: "",
        email: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error creating usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.numero_documento.includes(searchTerm) ||
      u.codigo_unico?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Usuarios Finales</h1>
          <p className="text-muted-foreground">
            Gestión de personal por empresa
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Importar CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="empresa_id">Empresa *</Label>
                  <Select
                    value={formData.empresa_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, empresa_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numero_documento">Número de Documento *</Label>
                  <Input
                    id="numero_documento"
                    value={formData.numero_documento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numero_documento: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                  <Input
                    id="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre_completo: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) =>
                      setFormData({ ...formData, celular: e.target.value })
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
                <Button type="submit" className="w-full">
                  Crear Usuario
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, documento o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Cargando usuarios...</div>
      ) : filteredUsuarios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron usuarios"
                : "No hay usuarios registrados. Crea el primer usuario."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Empresa</th>
                  <th className="p-4 font-medium">Documento</th>
                  <th className="p-4 font-medium">Nombre</th>
                  <th className="p-4 font-medium">Celular</th>
                  <th className="p-4 font-medium">Código Único</th>
                  <th className="p-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{usuario.empresas.nombre}</td>
                    <td className="p-4">{usuario.numero_documento}</td>
                    <td className="p-4 font-medium">{usuario.nombre_completo}</td>
                    <td className="p-4">{usuario.celular || "-"}</td>
                    <td className="p-4">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {usuario.codigo_unico}
                      </code>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          usuario.activo
                            ? "bg-success/20 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Usuarios;
