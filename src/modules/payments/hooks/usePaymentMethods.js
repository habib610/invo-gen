import { useCallback, useState } from "react";

import { paymentService } from "../services/payment.service";







export function usePaymentMethods() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to fetch payment methods")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPayment = async (paymentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPayment = await paymentService.create(paymentData);
      setPayments((prev) => {
        const list = [newPayment, ...prev];
        return list.sort(
          (a, b) => Number(b.is_default) - Number(a.is_default)
        );
      });
      return newPayment;
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to create payment method")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePayment = async (
  id,
  paymentData) =>
  {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPayment = await paymentService.update(id, paymentData);
      setPayments((prev) => {
        const list = prev.map((p) =>
        p.id === id ? updatedPayment : p
        );
        return list.sort(
          (a, b) => Number(b.is_default) - Number(a.is_default)
        );
      });
      return updatedPayment;
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to update payment method")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePayment = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await paymentService.delete(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to delete payment method")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
  };
}