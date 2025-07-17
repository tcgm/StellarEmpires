export interface TraitOrFlaw {
  title: string;
  description: string;
  nations?: string[];
  isTrait?:boolean;
  points?:number;
  requires?: string[];
}

export interface NationData {
  nation: string;
  traits: TraitOrFlaw[];
  flaws: TraitOrFlaw[];
}

export type TraitOrFlawList =
  | TraitOrFlaw[] // for flat files like CommonFlaws
  | Record<string, TraitOrFlaw[]>; // for category-grouped files like CommonTraits

export interface NationDesign {
  nationName: string;
  nationType: string;               // The nation type selected (by name, e.g., "Spaceborn Collective")
  scale: "Wide" | "Tall" | "Balanced";
  selectedCommonTraits: string[];   // Use trait titles as IDs (easier for save/load)
  selectedCommonFlaws: string[];
  selectedNationTraits: string[];
  selectedNationFlaws: string[];
  selectedForeignTraits: string[];  // (titles from other nation types)
  customTrait?: TraitOrFlaw | null; // user’s own trait
}

export const SCALES = ["Wide", "Tall", "Balanced"] as const;
export type ScaleType = typeof SCALES[number]; // "Wide" | "Tall" | "Balanced"

export type NationScale = typeof SCALES[number];
