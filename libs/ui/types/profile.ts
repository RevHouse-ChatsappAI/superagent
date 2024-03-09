export interface Profile {
  api_key: string;
  created_at: string;
  first_name: string;
  is_onboarded: boolean;
  last_name: string;
  user_id: string;
  company?: string;
  id: string;
  stripe_customer_id: string;
}
