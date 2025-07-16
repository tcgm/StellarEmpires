import { NationData, TraitOrFlaw } from "../types";

export async function fetchNationData(nationName: string): Promise<NationData> {
  const [nationRes, traitsRes, flawsRes] = await Promise.all([
    fetch(`/data/nations/${nationName}/nation.json`),
    fetch(`/data/nations/${nationName}/traits.json`),
    fetch(`/data/nations/${nationName}/flaws.json`)
  ]);
  const [nationObj, traits, flaws] = await Promise.all([
    nationRes.json(),
    traitsRes.json(),
    flawsRes.json()
  ]);
  return {
    nation: nationObj.nation ?? nationName,
    ...nationObj,
    traits: traits ?? [],
    flaws: flaws ?? [],
  };
}

export async function fetchAllNationData(): Promise<NationData[]> {
  const res = await fetch("/data/nations/nationList.json");
  const nationNames: string[] = await res.json();
  const allData = await Promise.all(nationNames.map(n => fetchNationData(n)));
//   console.log(JSON.stringify(allData));
  return allData;
}
