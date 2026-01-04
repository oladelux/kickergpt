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
    priceUSD: 2,
    priceEUR: 2,
    priceGBP: 2,
  },
  [AddonType.TWENTY_FIVE_PROMPT_CREDITS]: {
    credits: 25,
    priceNGN: 3000,
    priceUSD: 4,
    priceGBP: 4,
    priceEUR: 4,
  },
  [AddonType.FIFTY_PROMPT_CREDITS]: {
    credits: 50,
    priceNGN: 5000,
    priceUSD: 6,
    priceGBP: 6,
    priceEUR: 6,
  },
} as const;
