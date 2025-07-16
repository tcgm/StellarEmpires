export interface TraitOrFlaw {
  title: string;
  description: string;
  nations?: string[];
  isTrait?:boolean;
  points?:number;
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
  nationType: string;               // The nation type selected (by name, e.g., "Spaceborn Collective")
  scale: "Wide" | "Tall" | "Balanced";
  selectedCommonTraits: string[];   // Use trait titles as IDs (easier for save/load)
  selectedCommonFlaws: string[];
  selectedNationTraits: string[];
  selectedNationFlaws: string[];
  selectedForeignTraits: string[];  // (titles from other nation types)
  customTrait?: TraitOrFlaw | null; // user’s own trait
}