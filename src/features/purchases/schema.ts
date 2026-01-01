import { z } from "zod";

export const purchaseSchema = z.object({
  itemId: z.string().min(1, "Item is required"),

  shopId: z.string().min(1, "Shop is required"),
  purchaseDate: z.string().min(1, "Date is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity is required" })
    .positive("Quantity must be greater than 0"),
  unitPrice: z
    .number({ invalid_type_error: "Unit price is required" })
    .positive("Unit price must be greater than 0"),
  mrp: z.number().positive("MRP must be greater than 0").optional(),
});

export type PurchaseFormSchema = z.infer<typeof purchaseSchema>;
