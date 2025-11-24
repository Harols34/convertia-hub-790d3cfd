export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alarmas: {
        Row: {
          archivos_adjuntos: Json | null
          comentarios: Json | null
          created_at: string | null
          descripcion: string
          estado: string | null
          id: string
          prioridad: string | null
          resuelta_at: string | null
          resuelta_por: string | null
          titulo: string
          updated_at: string | null
          usuario_final_id: string
        }
        Insert: {
          archivos_adjuntos?: Json | null
          comentarios?: Json | null
          created_at?: string | null
          descripcion: string
          estado?: string | null
          id?: string
          prioridad?: string | null
          resuelta_at?: string | null
          resuelta_por?: string | null
          titulo: string
          updated_at?: string | null
          usuario_final_id: string
        }
        Update: {
          archivos_adjuntos?: Json | null
          comentarios?: Json | null
          created_at?: string | null
          descripcion?: string
          estado?: string | null
          id?: string
          prioridad?: string | null
          resuelta_at?: string | null
          resuelta_por?: string | null
          titulo?: string
          updated_at?: string | null
          usuario_final_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alarmas_usuario_final_id_fkey"
            columns: ["usuario_final_id"]
            isOneToOne: false
            referencedRelation: "usuarios_finales"
            referencedColumns: ["id"]
          },
        ]
      }
      aplicativos_empresa: {
        Row: {
          activo: boolean | null
          campos_personalizados: Json | null
          created_at: string | null
          descripcion: string | null
          empresa_id: string
          icono: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          campos_personalizados?: Json | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id: string
          icono?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          campos_personalizados?: Json | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: string
          icono?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aplicativos_empresa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      aplicativos_globales: {
        Row: {
          activo: boolean | null
          campos_requeridos: Json | null
          created_at: string | null
          descripcion: string | null
          icono: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          campos_requeridos?: Json | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          campos_requeridos?: Json | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      asignaciones_aplicativos: {
        Row: {
          aplicativo_empresa_id: string | null
          aplicativo_global_id: string | null
          created_at: string | null
          datos_acceso: Json | null
          id: string
          notas: string | null
          updated_at: string | null
          usuario_final_id: string
        }
        Insert: {
          aplicativo_empresa_id?: string | null
          aplicativo_global_id?: string | null
          created_at?: string | null
          datos_acceso?: Json | null
          id?: string
          notas?: string | null
          updated_at?: string | null
          usuario_final_id: string
        }
        Update: {
          aplicativo_empresa_id?: string | null
          aplicativo_global_id?: string | null
          created_at?: string | null
          datos_acceso?: Json | null
          id?: string
          notas?: string | null
          updated_at?: string | null
          usuario_final_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asignaciones_aplicativos_aplicativo_empresa_id_fkey"
            columns: ["aplicativo_empresa_id"]
            isOneToOne: false
            referencedRelation: "aplicativos_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_aplicativos_aplicativo_global_id_fkey"
            columns: ["aplicativo_global_id"]
            isOneToOne: false
            referencedRelation: "aplicativos_globales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_aplicativos_usuario_final_id_fkey"
            columns: ["usuario_final_id"]
            isOneToOne: false
            referencedRelation: "usuarios_finales"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion_sistema: {
        Row: {
          clave: string
          created_at: string | null
          descripcion: string | null
          id: string
          updated_at: string | null
          valor: Json
        }
        Insert: {
          clave: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          updated_at?: string | null
          valor: Json
        }
        Update: {
          clave?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          updated_at?: string | null
          valor?: Json
        }
        Relationships: []
      }
      empresas: {
        Row: {
          activa: boolean | null
          created_at: string | null
          direccion: string | null
          email: string | null
          id: string
          nit: string | null
          nombre: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          activa?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nit?: string | null
          nombre: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          activa?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nit?: string | null
          nombre?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      historial_cambios: {
        Row: {
          accion: string
          admin_user_id: string | null
          created_at: string | null
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          id: string
          registro_id: string
          tabla: string
        }
        Insert: {
          accion: string
          admin_user_id?: string | null
          created_at?: string | null
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          registro_id: string
          tabla: string
        }
        Update: {
          accion?: string
          admin_user_id?: string | null
          created_at?: string | null
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          registro_id?: string
          tabla?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios_finales: {
        Row: {
          activo: boolean | null
          celular: string | null
          codigo_unico: string | null
          created_at: string | null
          datos_adicionales: Json | null
          email: string | null
          empresa_id: string
          id: string
          nombre_completo: string
          numero_documento: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          celular?: string | null
          codigo_unico?: string | null
          created_at?: string | null
          datos_adicionales?: Json | null
          email?: string | null
          empresa_id: string
          id?: string
          nombre_completo: string
          numero_documento: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          celular?: string | null
          codigo_unico?: string | null
          created_at?: string | null
          datos_adicionales?: Json | null
          email?: string | null
          empresa_id?: string
          id?: string
          nombre_completo?: string
          numero_documento?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_finales_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generar_codigo_unico: {
        Args: { p_nombre_completo: string; p_numero_documento: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
