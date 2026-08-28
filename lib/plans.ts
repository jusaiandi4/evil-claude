export const FREE_DAILY = 10; // free-tier messages per day

export interface SubPlan {
  id: string; name: string; stars: number; creditsPerMonth: number; badge?: string;
}
export const SUB_PLANS: SubPlan[] = [
  { id: "spark",   name: "Spark",   stars: 100, creditsPerMonth: 300,  badge: "Popular" },
  { id: "blaze",   name: "Blaze",   stars: 300, creditsPerMonth: 1200 },
  { id: "inferno", name: "Inferno", stars: 900, creditsPerMonth: 5000 },
];

export interface Pack { id: string; name: string; usd: number; credits: number; }
export const PACKS: Pack[] = [
  { id: "p200",  name: "Starter", usd: 2,  credits: 200 },
  { id: "p600",  name: "Charged", usd: 5,  credits: 600 },
  { id: "p1500", name: "Overkill", usd: 10, credits: 1500 },
];
