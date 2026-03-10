import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

const paymentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["bank_transfer", "paypal", "stripe", "payoneer", "other"]),
  bank_details: z.object({
    account_holder: z.string().optional(),
    account_no: z.string().optional(),
    bank_name: z.string().optional(),
    bank_address: z.string().optional(),
    swift_code: z.string().optional(),
    routing_no: z.string().optional(),
  }).optional(),
  paypal_email: z.string().email().optional().or(z.literal("")),
  stripe_link: z.string().url().optional().or(z.literal("")),
  payoneer_email: z.string().email().optional().or(z.literal("")),
  other_details: z.string().optional(),
  is_default: z.boolean()
});

export function PaymentMethodForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) {
  // Parse initial details if they are stored as JSON
  let parsedDetails = {};
  try {
    parsedDetails = initialData?.details ? JSON.parse(initialData.details) : {};
  } catch (e) {
    parsedDetails = { other_details: initialData?.details || "" };
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: parsedDetails?.type || "bank_transfer",
      bank_details: parsedDetails?.bank_details || {},
      paypal_email: parsedDetails?.paypal_email || "",
      stripe_link: parsedDetails?.stripe_link || "",
      payoneer_email: parsedDetails?.payoneer_email || "",
      other_details: parsedDetails?.other_details || "",
      is_default: initialData?.is_default || false
    }
  });

  const selectedType = useWatch({ control, name: "type" });

  const handleFormSubmit = async (data) => {
    // Pack the specific fields into the details JSON
    const detailsObject = {
      type: data.type,
      bank_details: data.type === "bank_transfer" ? data.bank_details : undefined,
      paypal_email: data.type === "paypal" ? data.paypal_email : undefined,
      stripe_link: data.type === "stripe" ? data.stripe_link : undefined,
      payoneer_email: data.type === "payoneer" ? data.payoneer_email : undefined,
      other_details: data.type === "other" ? data.other_details : undefined,
    };

    const submitData = {
      name: data.name,
      details: JSON.stringify(detailsObject),
      is_default: data.is_default
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Method Name *"
          {...register("name")}
          error={errors.name?.message}
          placeholder="e.g. Business Account" />
        
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Payment Type *"
              value={field.value}
              onValueChange={field.onChange}
              error={errors.type?.message}
              options={[
                { value: "bank_transfer", label: "Bank Transfer" },
                { value: "paypal", label: "PayPal" },
                { value: "stripe", label: "Stripe" },
                { value: "payoneer", label: "Payoneer" },
                { value: "other", label: "Other" },
              ]}
            />
          )}
        />
      </div>

      {selectedType === "bank_transfer" && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Bank Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Account Holder Name" {...register("bank_details.account_holder")} />
            <Input label="Account Number" {...register("bank_details.account_no")} />
            <Input label="Bank Name" {...register("bank_details.bank_name")} />
            <Input label="Bank Address" {...register("bank_details.bank_address")} />
            <Input label="SWIFT/BIC Code" {...register("bank_details.swift_code")} />
            <Input label="Routing Number" {...register("bank_details.routing_no")} />
          </div>
        </div>
      )}

      {selectedType === "paypal" && (
        <Input
          label="PayPal Email *"
          type="email"
          {...register("paypal_email")}
          error={errors.paypal_email?.message}
          placeholder="your@paypal.com" />
      )}

      {selectedType === "stripe" && (
        <Input
          label="Stripe Payment Link / Account ID *"
          {...register("stripe_link")}
          error={errors.stripe_link?.message}
          placeholder="https://buy.stripe.com/..." />
      )}

      {selectedType === "payoneer" && (
        <Input
          label="Payoneer Email / Customer ID *"
          {...register("payoneer_email")}
          error={errors.payoneer_email?.message}
          placeholder="your@payoneer.com" />
      )}

      {selectedType === "other" && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Details / Instructions *
          </label>
          <textarea
            {...register("other_details")}
            className={`flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.other_details ? "border-red-500 focus:ring-red-500" : ""
            }`}
            rows={4}
            placeholder="Enter custom payment instructions..." />
          {errors.other_details && (
            <p className="mt-1 text-sm text-red-500">{errors.other_details.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="is_default"
          {...register("is_default")}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
        <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">
          Make this the default payment method
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Payment Method"}
        </Button>
      </div>
    </form>
  );
}