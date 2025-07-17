import { TraitOrFlawList, TraitOrFlaw } from "../types";

export function toTraitArray(list: TraitOrFlawList): TraitOrFlaw[] {
  const arr = Array.isArray(list) ? list : Object.values(list).flat();
  return arr.map(trait => ({
    ...trait,
    requireMode: trait.requireMode === "AND" || trait.requireMode === "OR"
      ? trait.requireMode
      : undefined
  }));
}

