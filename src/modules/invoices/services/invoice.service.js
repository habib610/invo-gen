import { supabase } from "../../../lib/supabase";

export const invoiceService = {
    async getAll() {
        const { data, error } = await supabase
            .from("invoices")
            .select("*, vendor:vendors(*), payment_method:payment_methods(*)")
            .order("invoice_date", { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id) {
        const { data, error } = await supabase
            .from("invoices")
            .select(
                "*, vendor:vendors(*), payment_method:payment_methods(*), items:invoice_items(*)"
            )
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(invoice, items) {
        // 1. Create invoice
        const { data: newInvoice, error: invoiceError } = await supabase
            .from("invoices")
            .insert(invoice)
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // 2. Create items
        if (items.length > 0) {
            const itemsToInsert = items.map((item) => ({
                ...item,
                invoice_id: newInvoice.id,
            }));

            const { error: itemsError } = await supabase
                .from("invoice_items")
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;
        }

        return this.getById(newInvoice.id);
    },
    async delete(id) {
        // Assuming cascading deletes are set up in DB, if not we must delete items first.
        // For safety, let's delete items first.
        await supabase.from("invoice_items").delete().eq("invoice_id", id);

        const { error } = await supabase.from("invoices").delete().eq("id", id);

        if (error) throw error;
    },
};
