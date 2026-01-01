import { deletePurchase } from "@/api/purchases.api";

const handleDelete = async (id: number) => {
  await deletePurchase(id);
  refetch(); // or mutate(), depending on your setup
};

return {
  purchases,
  isLoading,
  handleDelete,
};
