export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Events: {
        Row: {
          id: number;
          name: string;
          startDate: string; // ISO date string
          endDate: string; // ISO date string
        };
        Insert: {
          id?: number;
          name: string;
          startDate: string;
          endDate: string;
        };
        Update: {
          id?: number;
          name?: string;
          startDate?: string;
          endDate?: string;
        };
      };
      Shifts: {
        Row: {
          id: number;
          event_id: number;
          number: number;
          startTime: string; // ISO timestamp string
          endTime: string; // ISO timestamp string
        };
        Insert: {
          id?: number;
          event_id: number;
          number: number;
          startTime: string;
          endTime: string;
        };
        Update: {
          id?: number;
          event_id?: number;
          number?: number;
          startTime?: string;
          endTime?: string;
        };
      };
      Drivers: {
        Row: {
          id: number;
          shift_id: number;
          name: string;
          phoneNumber: string;
          driverNumber: number;
          event_id: number;
        };
        Insert: {
          id?: number;
          shift_id: number;
          name: string;
          phoneNumber: string;
          driverNumber: number;
          event_id: number;
        };
        Update: {
          id?: number;
          shift_id?: number;
          name?: string;
          phoneNumber?: string;
          driverNumber?: number;
          event_id?: number;
        };
      };
      Cars: {
        Row: {
          id: number;
          driver_id: number;
          type: string;
          carNumber: number;
          event_id: number;
          licensePlate: string;
          color: string;
        };
        Insert: {
          id?: number;
          driver_id: number;
          type: string;
          carNumber: number;
          event_id: number;
          licensePlate: string;
          color: string;
        };
        Update: {
          id?: number;
          driver_id?: number;
          type?: string;
          carNumber?: number;
          event_id?: number;
          licensePlate?: string;
          color?: string;
        };
      };
      Hub: {
        Row: {
          id: number;
          event_id: number;
          longitude: number;
          latitude: number;
          address: string;
          name: string;
        };
        Insert: {
          id?: number;
          event_id: number;
          longitude: number;
          latitude: number;
          address: string;
          name: string;
        };
        Update: {
          id?: number;
          event_id?: number;
          longitude?: number;
          latitude?: number;
          address?: string;
          name?: string;
        };
      };
      PendingRides: {
        Row: {
          id: number;
          carType: string;
          hub_id: number;
          dropOffLocation: string;
          guestCategory: string;
          guestName: string;
          phoneNumber: string;
          shift_id: number;
          pickupTime: string;
          serviceType: string;
          event_id: number;
          shift_manager_id: number;
          pickupLocation?: string | null;
          pickupLat?: number | null;
          pickupLng?: number | null;
          dropoffLat?: number | null;
          dropoffLng?: number | null;
          pickup_note?: string | null;
          dropoff_note?: string | null;
        };
        Insert: {
          id?: number;
          carType: string;
          hub_id: number;
          dropOffLocation: string;
          guestCategory: string;
          guestName: string;
          phoneNumber: string;
          shift_id: number;
          pickupTime: string;
          serviceType: string;
          event_id: number;
          shift_manager_id?: number;
          pickupLocation?: string | null;
          pickupLat?: number | null;
          pickupLng?: number | null;
          dropoffLat?: number | null;
          dropoffLng?: number | null;
          pickup_note?: string | null;
          dropoff_note?: string | null;
        };
        Update: {
          id?: number;
          carType?: string;
          hub_id?: number;
          dropOffLocation?: string;
          guestCategory?: string;
          guestName?: string;
          phoneNumber?: string;
          shift_id?: number;
          pickupTime?: string;
          serviceType?: string;
          event_id?: number;
          shift_manager_id?: number;
          pickupLocation?: string | null;
          pickupLat?: number | null;
          pickupLng?: number | null;
          dropoffLat?: number | null;
          dropoffLng?: number | null;
          pickup_note?: string | null;
          dropoff_note?: string | null;
        };
      };
      ShiftManagers: {
        Row: {
          id: number;
          fisrtName: string;
          lastName: string;
          password: string;
          phoneNumber: string;
          email: string;
          event_id: number;
        };
        Insert: {
          id?: number;
          firstName: string;
          lastName: string;
          password: string;
          phoneNumber: string;
          email: string;
          event_id: number;
        };
        Update: {
          id?: number;
          firstName?: string;
          lastName?: string;
          password?: string;
          phoneNumber?: string;
          email?: string;
          event_id?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
