import { format } from "date-fns";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"../../../components/ui/Table";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceForm } from "./InvoiceForm";

export function InvoicesList() {
  const { invoices, isLoading, fetchInvoices, deleteInvoice } = useInvoices();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isCreating) {
      fetchInvoices();
    }
  }, [fetchInvoices, isCreating]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice(id);
    }
  };

  if (isCreating) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button
            variant="ghost"
            onClick={() => setIsCreating(false)}
            className="text-gray-500 hover:text-gray-900">
            
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Invoices
                    </Button>
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Create Invoice
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Fill out details to generate a new invoice.
                        </p>
                    </div>
                </div>
                <InvoiceForm />
            </div>);

  }

  return (
    <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Invoices
                    </h1>
                    <p className="mt-1 text-gray-500">
                        View and manage all generated invoices.
                    </p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Invoice
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice No.</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && invoices.length === 0 ?
            <TableRow>
                                <TableCell
                colSpan={5}
                className="text-center py-8 text-gray-500">
                
                                    Loading invoices...
                                </TableCell>
                            </TableRow> :
            invoices.length === 0 ?
            <TableRow>
                                <TableCell
                colSpan={5}
                className="text-center py-8 text-gray-500">
                
                                    No invoices found. Create one to get
                                    started.
                                </TableCell>
                            </TableRow> :

            invoices.map((invoice) =>
            <TableRow key={invoice.id}>
                                    <TableCell className="font-medium text-gray-900">
                                        {invoice.invoice_number}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.vendor?.name ||
                "Unknown Vendor"}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                  new Date(invoice.invoice_date),
                  "MMM dd, yyyy"
                )}
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900">
                                        ${Number(invoice.total).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                    handleDelete(invoice.id)
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
        </div>);

}