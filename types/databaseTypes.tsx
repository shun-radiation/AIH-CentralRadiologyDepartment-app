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

export type ModalitiesType = Database['public']['Tables']['modalities']['Row'];

export type UserType = Database['public']['Tables']['users']['Row'];
