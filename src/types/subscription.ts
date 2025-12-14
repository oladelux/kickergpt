export enum AddonType {
  TEN_PROMPT_CREDITS = "TEN_PROMPT_CREDITS",
  TWENTY_FIVE_PROMPT_CREDITS = "TWENTY_FIVE_PROMPT_CREDITS",
  FIFTY_PROMPT_CREDITS = "FIFTY_PROMPT_CREDITS",
}

export type AddonPurchaseResponse = {
  checkoutUrl?: string | null;
};

export const ADDON_PRICING = {
  [AddonType.TEN_PROMPT_CREDITS]: {
    credits: 10,
    priceNGN: 1500,
    priceUSD: 3,
    priceEUR: 3,
    priceGBP: 3,
  },
  [AddonType.TWENTY_FIVE_PROMPT_CREDITS]: {
    credits: 25,
    priceNGN: 3000,
    priceUSD: 5,
    priceGBP: 5,
    priceEUR: 5,
  },
  [AddonType.FIFTY_PROMPT_CREDITS]: {
    credits: 50,
    priceNGN: 5000,
    priceUSD: 8,
    priceGBP: 8,
    priceEUR: 8,
  },
} as const;
