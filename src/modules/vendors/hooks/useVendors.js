import { useCallback, useState } from "react";

import { vendorService } from "../services/vendor.service";





export function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getAll();
      setVendors(data);
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to fetch vendors")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVendor = async (vendorData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newVendor = await vendorService.create(vendorData);
      setVendors((prev) => [newVendor, ...prev]);
      return newVendor;
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to create vendor")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVendor = async (id, vendorData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedVendor = await vendorService.update(id, vendorData);
      setVendors((prev) =>
      prev.map((v) => v.id === id ? updatedVendor : v)
      );
      return updatedVendor;
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to update vendor")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await vendorService.delete(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ?
        err :
        new Error("Failed to delete vendor")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vendors,
    isLoading,
    error,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor
  };
}