import { TraitOrFlawList, TraitOrFlaw } from "../types";

export function toTraitArray(list: TraitOrFlawList): TraitOrFlaw[] {
  return Array.isArray(list) ? list : Object.values(list).flat();
}
