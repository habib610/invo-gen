import { supabase } from "../../../lib/supabase";








export const paymentService = {
  async getAll() {
    const { data, error } = await supabase.
    from("payment_methods").
    select("*").
    order("is_default", { ascending: false }).
    order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(payment) {
    const { data, error } = await supabase.
    from("payment_methods").
    insert(payment).
    select().
    single();

    if (error) throw error;
    return data;
  },

  async update(
  id,
  payment)
  {
    const { data, error } = await supabase.
    from("payment_methods").
    update(payment).
    eq("id", id).
    select().
    single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.
    from("payment_methods").
    delete().
    eq("id", id);

    if (error) throw error;
  }
};