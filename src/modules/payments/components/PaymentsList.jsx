import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
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

import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { PaymentMethodForm } from "./PaymentMethodForm";



export function PaymentsList() {
  const {
    payments,
    isLoading,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
  } = usePaymentMethods();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleOpenCreate = () => {
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
    window.confirm(
      "Are you sure you want to delete this payment method?"
    ))
    {
      await deletePayment(id);
    }
  };

  const handleSubmit = async (
  data) =>
  {
    setIsSubmitting(true);
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, data);
      } else {
        await createPayment(data);
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
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Payment Methods
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Manage payment instructions for invoices.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Method
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Method Name</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Default</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && payments.length === 0 ?
            <TableRow>
                                <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500">
                
                                    Loading payment methods...
                                </TableCell>
                            </TableRow> :
            payments.length === 0 ?
            <TableRow>
                                <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500">
                
                                    No payment methods found. Add one to get
                                    started.
                                </TableCell>
                            </TableRow> :

            payments.map((payment) =>
            <TableRow key={payment.id}>
                                    <TableCell className="font-medium">
                                        {payment.name}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-gray-500">
                                        {payment.details}
                                    </TableCell>
                                    <TableCell>
                                        {payment.is_default ?
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Default
                                            </span> :

                <span className="text-gray-400">
                                                -
                                            </span>
                }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                    handleOpenEdit(payment)
                    }
                    className="text-gray-500 hover:text-primary-600">
                    
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                    handleDelete(payment.id)
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
        title={
        editingPayment ?
        "Edit Payment Method" :
        "Add Payment Method"
        }>
        
                <PaymentMethodForm
          initialData={editingPayment || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting} />
        
            </Modal>
        </div>);

}