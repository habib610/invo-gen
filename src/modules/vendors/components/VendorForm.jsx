import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";




const vendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().optional(),
  logo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  theme_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex").default("#22c55e")
});










export function VendorForm({
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
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      logo_url: initialData?.logo_url || "",
      theme_color: initialData?.theme_color || "#22c55e"
    }
  });

  const handleFormSubmit = async (data) => {
    // Convert empty string back to undefined for optionals
    const submitData = {
      ...data,
      phone: data.phone || undefined,
      logo_url: data.logo_url || undefined
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
        label="Vendor Name *"
        {...register("name")}
        error={errors.name?.message}
        placeholder="e.g. Acme Corp" />
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
          label="Email Address *"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="contact@acme.com" />
        
                <Input
          label="Phone Number"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="+1 555 123 4567" />
        
            </div>
            <Input
        label="Physical Address *"
        {...register("address")}
        error={errors.address?.message}
        placeholder="123 Business Rd, City, Country" />
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Logo URL"
                    type="url"
                    {...register("logo_url")}
                    error={errors.logo_url?.message}
                    placeholder="https://example.com/logo.png" />

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Theme Color
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            {...register("theme_color")}
                            className="h-10 w-20 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer" />
                        <Input
                            {...register("theme_color")}
                            error={errors.theme_color?.message}
                            placeholder="#22c55e"
                            className="flex-1" />
                    </div>
                </div>
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
                    {isLoading ? "Saving..." : "Save Vendor"}
                </Button>
            </div>
        </form>);

}