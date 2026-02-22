import { supabase } from "../../../lib/supabase";






export const vendorService = {
  async getAll() {
    const { data, error } = await supabase.
    from("vendors").
    select("*").
    order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase.
    from("vendors").
    select("*").
    eq("id", id).
    single();

    if (error) throw error;
    return data;
  },

  async create(vendor) {
    const { data, error } = await supabase.
    from("vendors").
    insert(vendor).
    select().
    single();

    if (error) throw error;
    return data;
  },

  async update(id, vendor) {
    const { data, error } = await supabase.
    from("vendors").
    update(vendor).
    eq("id", id).
    select().
    single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from("vendors").delete().eq("id", id);

    if (error) throw error;
  }
};