
export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: number;
          slug: string;
          name: string;
          description: string | null;
          long_description: string | null;
          features: string[] | null;
          price_amount: number | null;
          price_unit: string | null;
          image_hero: string | null;
          image_card: string | null;
          gallery: string[] | null;
          whatsapp_number: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          description?: string | null;
          long_description?: string | null;
          features?: string[] | null;
          price_amount?: number | null;
          price_unit?: string | null;
          image_hero?: string | null;
          image_card?: string | null;
          gallery?: string[] | null;
          whatsapp_number?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          description?: string | null;
          long_description?: string | null;
          features?: string[] | null;
          price_amount?: number | null;
          price_unit?: string | null;
          image_hero?: string | null;
          image_card?: string | null;
          gallery?: string[] | null;
          whatsapp_number?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: number;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          category: string;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          category?: string;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: number;
          service_id: number | null;
          service_name: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          travel_date: string | null;
          details: any | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          service_id?: number | null;
          service_name?: string | null;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          travel_date?: string | null;
          details?: any | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
