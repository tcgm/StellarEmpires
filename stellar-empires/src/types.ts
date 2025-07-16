export interface TraitOrFlaw {
  title: string;
  description: string;
  nations?: string[];
  isTrait?:boolean;
}

export interface NationData {
  nation: string;
  traits: TraitOrFlaw[];
  flaws: TraitOrFlaw[];
}

export type TraitOrFlawList =
  | TraitOrFlaw[] // for flat files like CommonFlaws
  | Record<string, TraitOrFlaw[]>; // for category-grouped files like CommonTraits
