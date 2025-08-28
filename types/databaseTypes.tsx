import type { Database } from './supabase';

// export interface OrganizationType {
//   id: number;
//   name: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface ModalitiesType {
//   id: number;
//   department_id: number;
//   name: string;
//   created_at: string;
//   updated_at: string;
// }

export type OrganizationType =
  Database['public']['Tables']['organizations']['Row'];

export type DepartmentsType =
  Database['public']['Tables']['departments']['Row'];

export type ModalitiesType = Database['public']['Tables']['modalities']['Row'];

export type UserType = Database['public']['Tables']['users']['Row'];

// usersテーブルとmodalitiesテーブルのjoin後のtype
export type UserWithModality = UserType & {
  modality: { id: number; name: string } | null;
};
export type FormUser = UserWithModality & {
  user_experienced_modality_ids: number[];
};

export type CalendarEvents =
  Database['public']['Tables']['calendar_events']['Row'];
