import { useGetCommerce } from "hooks/useCommerce"; 

export const useCommerce = () => {
  const { data } = useGetCommerce();

  const currency = data?.currencyCode ?? "$";
  const shippingFee = Number(data?.defaultShippingFee ?? 0);
  const invoiceNotes = data?.invoiceNotes ?? "";

  const formatPrice = (amount: number | null | undefined) =>
    `${currency}${Number(amount ?? 0).toFixed(2)}`;

  return { currency, shippingFee, invoiceNotes, formatPrice };
};