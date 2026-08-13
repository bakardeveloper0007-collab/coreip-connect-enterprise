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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          entity_label: string | null
          id: string
          metadata: Json
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          entity_label?: string | null
          id?: string
          metadata?: Json
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          entity_label?: string | null
          id?: string
          metadata?: Json
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          assigned_to: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          internal_notes: string | null
          message: string
          name: string
          phone: string | null
          product_interest: string | null
          requirement_type: string | null
          service_interest: string | null
          source: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          internal_notes?: string | null
          message: string
          name: string
          phone?: string | null
          product_interest?: string | null
          requirement_type?: string | null
          service_interest?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          internal_notes?: string | null
          message?: string
          name?: string
          phone?: string | null
          product_interest?: string | null
          requirement_type?: string | null
          service_interest?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          question: string
          related_product_id: string | null
          related_service_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          question: string
          related_product_id?: string | null
          related_service_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          question?: string
          related_product_id?: string | null
          related_service_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_related_service_id_fkey"
            columns: ["related_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string
          description: string | null
          hero_image_url: string | null
          highlights: string[]
          icon: string | null
          id: string
          long_description: string | null
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          highlights?: string[]
          icon?: string | null
          id?: string
          long_description?: string | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          highlights?: string[]
          icon?: string | null
          id?: string
          long_description?: string | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_articles: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          keywords: string[]
          link_label: string | null
          link_url: string | null
          related_product_id: string | null
          related_service_id: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          keywords?: string[]
          link_label?: string | null
          link_url?: string | null
          related_product_id?: string | null
          related_service_id?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          keywords?: string[]
          link_label?: string | null
          link_url?: string | null
          related_product_id?: string | null
          related_service_id?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_articles_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_articles_related_service_id_fkey"
            columns: ["related_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          title: string | null
          updated_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          icon: string | null
          id: string
          image_url: string | null
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          applications: string[]
          benefits: string[]
          brochure_url: string | null
          category_id: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          features: string[]
          gallery: string[]
          id: string
          image_url: string | null
          long_description: string | null
          model_3d_url: string | null
          name: string
          related_product_ids: string[]
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          specifications: Json
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          video_url: string | null
        }
        Insert: {
          applications?: string[]
          benefits?: string[]
          brochure_url?: string | null
          category_id?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          features?: string[]
          gallery?: string[]
          id?: string
          image_url?: string | null
          long_description?: string | null
          model_3d_url?: string | null
          name: string
          related_product_ids?: string[]
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          specifications?: Json
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          applications?: string[]
          benefits?: string[]
          brochure_url?: string | null
          category_id?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          features?: string[]
          gallery?: string[]
          id?: string
          image_url?: string | null
          long_description?: string | null
          model_3d_url?: string | null
          name?: string
          related_product_ids?: string[]
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          specifications?: Json
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          case_study_url: string | null
          cover_image_url: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          customer: string | null
          description: string | null
          gallery: string[]
          highlights: string[]
          id: string
          industry_id: string | null
          location: string | null
          project_date: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          solution: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          case_study_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          customer?: string | null
          description?: string | null
          gallery?: string[]
          highlights?: string[]
          id?: string
          industry_id?: string | null
          location?: string | null
          project_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          case_study_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          customer?: string | null
          description?: string | null
          gallery?: string[]
          highlights?: string[]
          id?: string
          industry_id?: string | null
          location?: string | null
          project_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          applications: string[]
          benefits: string[]
          category: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          featured: boolean
          features: string[]
          gallery: string[]
          hero_image_url: string | null
          icon: string | null
          id: string
          long_description: string | null
          name: string
          related_product_ids: string[]
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          video_url: string | null
        }
        Insert: {
          applications?: string[]
          benefits?: string[]
          category?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          featured?: boolean
          features?: string[]
          gallery?: string[]
          hero_image_url?: string | null
          icon?: string | null
          id?: string
          long_description?: string | null
          name: string
          related_product_ids?: string[]
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          applications?: string[]
          benefits?: string[]
          category?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          featured?: boolean
          features?: string[]
          gallery?: string[]
          hero_image_url?: string | null
          icon?: string | null
          id?: string
          long_description?: string | null
          name?: string
          related_product_ids?: string[]
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          department: string | null
          designation: string | null
          email: string | null
          id: string
          linkedin_url: string | null
          name: string
          profile_image_url: string | null
          short_bio: string | null
          social_links: Json
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          profile_image_url?: string | null
          short_bio?: string | null
          social_links?: Json
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          profile_image_url?: string | null
          short_bio?: string | null
          social_links?: Json
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_title: string | null
          avatar_url: string | null
          created_at: string
          id: string
          organisation: string | null
          quote: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author_name: string
          author_title?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          organisation?: string | null
          quote: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_title?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          organisation?: string | null
          quote?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          group_name: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          group_name?: string | null
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          group_name?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      website_statistics: {
        Row: {
          created_at: string
          enabled: boolean
          icon: string | null
          id: string
          label: string
          sort_order: number
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          icon?: string | null
          id?: string
          label: string
          sort_order?: number
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          enabled?: boolean
          icon?: string | null
          id?: string
          label?: string
          sort_order?: number
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_content: { Args: { _user_id: string }; Returns: boolean }
      can_manage_leads: { Args: { _user_id: string }; Returns: boolean }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      list_staff_accounts: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          full_name: string
          id: string
          roles: Database["public"]["Enums"]["app_role"][]
        }[]
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "content_admin"
        | "product_manager"
        | "sales_manager"
        | "support_admin"
      content_status: "draft" | "published" | "archived"
      inquiry_status:
        | "new"
        | "contacted"
        | "in_progress"
        | "qualified"
        | "closed"
        | "spam"
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
      app_role: [
        "super_admin",
        "content_admin",
        "product_manager",
        "sales_manager",
        "support_admin",
      ],
      content_status: ["draft", "published", "archived"],
      inquiry_status: [
        "new",
        "contacted",
        "in_progress",
        "qualified",
        "closed",
        "spam",
      ],
    },
  },
} as const
