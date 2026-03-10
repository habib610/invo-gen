import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"../../../components/ui/Table";

import { useVendors } from "../hooks/useVendors";
import { VendorForm } from "./VendorForm";



export function VendorsList() {
  const {
    vendors,
    isLoading,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor
  } = useVendors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleOpenCreate = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await deleteVendor(id);
    }
  };

  const handleSubmit = async (
  data) =>
  {
    setIsSubmitting(true);
    try {
      if (editingVendor) {
        await updateVendor(editingVendor.id, data);
      } else {
        await createVendor(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                        Vendors
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Manage your clients and vendors.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vendor
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Theme</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && vendors.length === 0 ?
            <TableRow>
                                <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500">
                
                                    Loading vendors...
                                </TableCell>
                            </TableRow> :
            vendors.length === 0 ?
            <TableRow>
                                <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500">
                
                                    No vendors found. Add one to get started.
                                </TableCell>
                            </TableRow> :

            vendors.map((vendor) =>
            <TableRow key={vendor.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {vendor.logo_url ? (
                                                <img src={vendor.logo_url} alt={vendor.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                                                    NA
                                                </div>
                                            )}
                                            {vendor.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{vendor.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                                                style={{ backgroundColor: vendor.theme_color || '#22c55e' }}
                                            />
                                            <span className="text-xs font-mono uppercase text-gray-500">{vendor.theme_color || '#22c55e'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                    handleOpenEdit(vendor)
                    }
                    className="text-gray-500 hover:text-primary-600">
                    
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                    handleDelete(vendor.id)
                    }
                    className="text-gray-500 hover:text-red-600">
                    
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
            )
            }
                    </TableBody>
                </Table>
            </div>

            <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingVendor ? "Edit Vendor" : "Add New Vendor"}>
        
                <VendorForm
          initialData={editingVendor || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting} />
        
            </Modal>
        </div>);

}