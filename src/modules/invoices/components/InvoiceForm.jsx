import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch, Controller } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { supabase } from "../../../lib/supabase";
import { generateInvoiceNumber } from "../../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"../../../components/ui/Table";
import { ElegantInvoiceTemplate } from "../../pdf/templates/ElegantInvoiceTemplate";

import { usePaymentMethods } from "../../payments/hooks/usePaymentMethods";
import { useVendors } from "../../vendors/hooks/useVendors";
import { useInvoices } from "../hooks/useInvoices";

import { FileDown, Plus, Trash2 } from "lucide-react";

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Required"),
  invoice_date: z.string().min(1, "Required"),
  due_date: z.string().min(1, "Required"),
  vendor_id: z.string().min(1, "Vendor is required"),
  payment_method_id: z.string().min(1, "Payment Method is required"),
  tax_rate: z.number().min(0).max(100),
  save_to_storage: z.boolean().default(false),
  items: z.
  array(
    z.object({
      description: z.string().min(1, "Description required"),
      quantity: z.number().min(1, "Min 1"),
      price: z.number().min(0, "Min 0")
    })
  ).
  min(1, "At least 1 item required")
});



export function InvoiceForm() {
  const { vendors, fetchVendors } = useVendors();
  const { payments, fetchPayments } = usePaymentMethods();
  const { createInvoice } = useInvoices();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInvoiceData, setCreatedInvoiceData] = useState(null);

  useEffect(() => {
    fetchVendors();
    fetchPayments();
  }, [fetchVendors, fetchPayments]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: generateInvoiceNumber(),
      invoice_date: format(new Date(), "yyyy-MM-dd"),
      due_date: format(
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      vendor_id: "",
      payment_method_id: "",
      tax_rate: 0,
      save_to_storage: false,
      items: [{ description: "", quantity: 1, price: 0 }]
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (payments.length > 0) {
      const defaultPayment =
      payments.find((p) => p.is_default) || payments[0];
      setValue("payment_method_id", defaultPayment.id);
    }
  }, [payments, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const formValues = useWatch({ control });

  const itemsSubtotal = (formValues.items || []).reduce(
    (acc, item) => acc + (item?.quantity || 0) * (item?.price || 0),
    0
  );
  const taxAmount = itemsSubtotal * ((formValues.tax_rate || 0) / 100);
  const grandTotal = itemsSubtotal + taxAmount;

  const handleSaveInvoice = async (data) => {
    setIsSubmitting(true);
    try {
      const selectedVendor = vendors.find((v) => v.id === data.vendor_id);
      const selectedPayment = payments.find(
        (p) => p.id === data.payment_method_id
      );

      if (!selectedVendor || !selectedPayment)
      throw new Error("Invalid selections");

      const invoiceDataToSave = {
        invoice_number: data.invoice_number,
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        vendor_id: data.vendor_id,
        payment_method_id: data.payment_method_id,
        subtotal: itemsSubtotal,
        tax: taxAmount,
        total: grandTotal
      };

      const itemsDataToSave = data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      }));

      const newInvoice = await createInvoice(invoiceDataToSave, itemsDataToSave);

      const fullInvoiceData = {
        ...invoiceDataToSave,
        vendor: selectedVendor,
        payment_method: selectedPayment,
        items: itemsDataToSave
      };

      // Handle optional storage upload
      if (data.save_to_storage) {
        try {
          const blob = await pdf(<ElegantInvoiceTemplate data={fullInvoiceData} />).toBlob();
          const fileName = `invoices/${data.invoice_number}_${Date.now()}.pdf`;

          const { error: uploadError } = await supabase.storage
            .from('invoices')
            .upload(fileName, blob);

          if (uploadError) throw uploadError;
          console.log("Uploaded to storage:", fileName);
        } catch (storageErr) {
          console.error("Storage upload failed:", storageErr);
          // Don't fail the whole process if storage fails
        }
      }

      // Prepare data for PDF generation
      setCreatedInvoiceData(fullInvoiceData);

      alert("Invoice created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-generate PDF data if form is valid and not saved yet (just for live preview logic if needed)
  const currentVendor = vendors.find((v) => v.id === formValues.vendor_id);
  const currentPayment = payments.find(
    (p) => p.id === formValues.payment_method_id
  );

  const livePdfData =
  isValid && currentVendor ?
  {
    invoice_number: formValues.invoice_number || "",
    invoice_date: formValues.invoice_date || "",
    due_date: formValues.due_date || "",
    subtotal: itemsSubtotal,
    tax: taxAmount,
    total: grandTotal,
    vendor: currentVendor,
    payment_method: currentPayment,
    items: (formValues.items || []).map((i) => ({
      description: i?.description || "",
      quantity: i?.quantity || 1,
      price: i?.price || 0,
      total: (i?.quantity || 1) * (i?.price || 0)
    }))
  } :
  null;

  return (
    <div className="space-y-8">
            {createdInvoiceData &&
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Invoice Created!
                        </h3>
                        <p className="text-sm">
                            Download your elegant PDF invoice below.
                        </p>
                    </div>
                    <PDFDownloadLink
          document={
          <ElegantInvoiceTemplate data={createdInvoiceData} />
          }
          fileName={`Invoice_${createdInvoiceData.invoice_number}.pdf`}>
          
                        {/* @ts-ignore PDFDownloadLink child function type */}
                        {({ loading }) =>
          <Button
            disabled={loading}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            
                                <FileDown className="w-5 h-5" />
                                {loading ? "Preparing PDF..." : "Download PDF"}
                            </Button>
          }
                    </PDFDownloadLink>
                </div>
      }

            <form
        onSubmit={handleSubmit(handleSaveInvoice)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        
                <div className="p-8 space-y-8">
                    {/* Header Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input
              label="Invoice Number *"
              {...register("invoice_number")}
              error={errors.invoice_number?.message} />
            
                        <Input
              label="Invoice Date *"
              type="date"
              {...register("invoice_date")}
              error={errors.invoice_date?.message} />
            
                        <Input
              label="Due Date *"
              type="date"
              {...register("due_date")}
              error={errors.due_date?.message} />
            
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Vendors & Payments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            name="vendor_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Select Vendor *"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    options={vendors.map((v) => ({
                                        value: v.id,
                                        label: v.name
                                    }))}
                                    error={errors.vendor_id?.message}
                                />
                            )}
                        />
            
                        <Controller
                            name="payment_method_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Payment Method *"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    options={payments.map((p) => ({
                                        value: p.id,
                                        label: `${p.name} ${p.is_default ? "(Default)" : ""}`
                                    }))}
                                    error={errors.payment_method_id?.message}
                                />
                            )}
                        />
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Items Table */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Line Items
                            </h3>
                            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                append({
                  description: "",
                  quantity: 1,
                  price: 0
                })
                }>
                
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/2">
                                            Description
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Qty
                                        </TableHead>
                                        <TableHead className="w-48">
                                            Price
                                        </TableHead>
                                        <TableHead className="w-32 text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="w-16"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => {
                    const qty =
                    formValues.items?.[index]?.
                    quantity || 0;
                    const price =
                    formValues.items?.[index]?.price ||
                    0;
                    const total = qty * price;

                    return (
                      <TableRow
                        key={field.id}
                        className="group">
                        
                                                <TableCell>
                                                    <Input
                            {...register(
                              `items.${index}.description`
                            )}
                            error={
                            errors.items?.[
                            index]?.
                            description?.
                            message
                            }
                            placeholder="Item description"
                            className="h-9" />
                          
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                            type="number"
                            min="1"
                            {...register(
                              `items.${index}.quantity`,
                              {
                                valueAsNumber:
                                true
                              }
                            )}
                            error={
                            errors.items?.[
                            index]?.
                            quantity?.message
                            }
                            className="h-9" />
                          
                                                </TableCell>
                                                <TableCell>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                            $
                                                        </span>
                                                        <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...register(
                                `items.${index}.price`,
                                {
                                  valueAsNumber:
                                  true
                                }
                              )}
                              error={
                              errors.items?.[
                              index]?.
                              price?.
                              message
                              }
                              className="pl-7 h-9" />
                            
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-gray-700 dark:text-gray-300">
                                                    ${total.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                            remove(index)
                            }
                            disabled={
                            fields.length === 1
                            }
                            className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>);

                  })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Totals Section */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="save_to_storage"
                                {...register("save_to_storage")}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            <label htmlFor="save_to_storage" className="text-sm text-gray-700 dark:text-gray-300">
                                Save a copy to Supabase Storage
                            </label>
                        </div>

                        <div className="w-72 space-y-4">
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    ${itemsSubtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span>Tax Rate (%)</span>
                                    <Input
                    type="number"
                    min="0"
                    max="100"
                    {...register("tax_rate", {
                      valueAsNumber: true
                    })}
                    className="w-20 h-8 text-right" />
                  
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    ${taxAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Total Due
                                </span>
                                <span className="text-xl font-bold text-primary-600">
                                    ${grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make sure to double check the details before saving.
                    </p>
                    <div className="flex gap-3">
                        {livePdfData &&
            <PDFDownloadLink
              document={
              <ElegantInvoiceTemplate
                data={livePdfData} />

              }
              fileName={`Preview_${livePdfData.invoice_number}.pdf`}>
              
                                {/* @ts-ignore */}
                                {({ loading }) =>
              <Button
                type="button"
                variant="outline"
                disabled={loading}>
                
                                        {loading ?
                "Generating preview..." :
                "Export PDF Preview"}
                                    </Button>
              }
                            </PDFDownloadLink>
            }

                        <Button
              type="submit"
              disabled={isSubmitting || !isValid}>
              
                            {isSubmitting ?
              "Saving..." :
              "Save & Generate Invoice"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>);

}