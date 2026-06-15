export type StoreProduct = {
  id: "starter-pack";
  name: string;
  description: string;
  displayPrice: string;
};

export const STOREFRONT_PRODUCT: StoreProduct = {
  id: "starter-pack",
  name: "Starter Design Pack",
  description: "A compact bundle of digital design templates.",
  displayPrice: "$9.00",
};

export function getPriceIdForProduct(productId: string): string {
  if (productId !== STOREFRONT_PRODUCT.id) {
    throw new Error("Unknown product.");
  }

  const priceId = process.env.STRIPE_PRICE_ID_STARTER;

  if (!priceId) {
    throw new Error("Missing STRIPE_PRICE_ID_STARTER environment variable.");
  }

  return priceId;
}