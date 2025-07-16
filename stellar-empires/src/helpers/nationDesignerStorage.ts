import { NationDesign } from "../types";

const STORAGE_KEY = "stellarEmpiresNationDesign";

export function saveNationDesign(design: NationDesign) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
}

export function loadNationDesign(): NationDesign | null {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json) as NationDesign;
  } catch {
    return null;
  }
}

export function clearNationDesign() {
  localStorage.removeItem(STORAGE_KEY);
}
