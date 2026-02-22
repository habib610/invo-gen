import { useCallback, useState } from "react";
import {
  invoiceService } from



"../services/invoice.service";

export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to fetch invoices")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInvoiceById = async (id) => {
    setIsLoading(true);
    try {
      return await invoiceService.getById(id);
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to fetch invoice")
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoice = async (
  invoiceData,
  items) =>
  {
    setIsLoading(true);
    setError(null);
    try {
      const newInvoice = await invoiceService.create(invoiceData, items);
      setInvoices((prev) => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to create invoice")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await invoiceService.delete(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to delete invoice")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    deleteInvoice
  };
}