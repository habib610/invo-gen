import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";





const paymentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  details: z.string().min(5, "Details must be at least 5 characters"),
  is_default: z.boolean()
});










export function PaymentMethodForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: initialData?.name || "",
      details: initialData?.details || "",
      is_default: initialData?.is_default || false
    }
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
        label="Method Name *"
        {...register("name")}
        error={errors.name?.message}
        placeholder="e.g. Bank Transfer" />
      
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Details / Instructions *
                </label>
                <textarea
          {...register("details")}
          className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          errors.details ?
          "border-red-500 focus:ring-red-500" :
          ""}`
          }
          rows={4}
          placeholder="e.g. Account No: 123456789, Bank: Example Bank..." />
        
                {errors.details &&
        <p className="mt-1 text-sm text-red-500">
                        {errors.details.message}
                    </p>
        }
            </div>

            <div className="flex items-center gap-2">
                <input
          type="checkbox"
          id="is_default"
          {...register("is_default")}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
        
                <label htmlFor="is_default" className="text-sm text-gray-700">
                    Make this the default payment method
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
        </form>);

}