import React, { useEffect, useState } from "react";
import {
  Box, Select, Heading, VStack, HStack, Text, SimpleGrid, useToast
} from "@chakra-ui/react";
import TraitListPanel from "./NationDesigner/TraitListPanel";
import CustomTraitPanel from "./NationDesigner/CustomTraitPanel";
import DesignerControls from "./NationDesigner/DesignerControls";
import { NationData, TraitOrFlaw, NationDesign } from "../types";
import { saveNationDesign, loadNationDesign, clearNationDesign } from "../helpers/nationDesignerStorage";
import TraitBox from "./TraitBox";

type NationDesignerProps = {
  nations: NationData[];
  commonTraits: TraitOrFlaw[];
  commonFlaws: TraitOrFlaw[];
  traitBoxColor?: string;
  flawBoxColor?: string;
};

const defaultDesign: NationDesign = {
  nationType: "",
  scale: "Balanced",
  selectedCommonTraits: [],
  selectedCommonFlaws: [],
  selectedNationTraits: [],
  selectedNationFlaws: [],
  selectedForeignTraits: [],
  customTrait: null
};

const SCALES = ["Wide", "Tall", "Balanced"] as const;
const SCALE_POINTS = {
  Balanced: { CT: 20, NT: 8, CF: 2, NF: 1 },
  Tall:     { CT: 15, NT: 10, CF: 1, NF: 2 },
  Wide:     { CT: 25, NT: 6, CF: 3, NF: 0 }
};

const NationDesigner: React.FC<NationDesignerProps> = ({
  nations, commonTraits, commonFlaws, traitBoxColor = "#cdfddaff", flawBoxColor = "#fde4cd"
}) => {
  const toast = useToast();
  const [design, setDesign] = useState<NationDesign>(() => loadNationDesign() || defaultDesign);

  useEffect(() => { saveNationDesign(design); }, [design]);

  const selectedNationData = nations.find(n => n.nation === design.nationType);
  const nationTraits: TraitOrFlaw[] = selectedNationData?.traits || [];
  const nationFlaws: TraitOrFlaw[] = selectedNationData?.flaws || [];
  const points = SCALE_POINTS[design.scale];

  const used = {
    CT: design.selectedCommonTraits.length,
    NT: design.selectedNationTraits.length,
    CF: design.selectedCommonFlaws.length,
    NF: design.selectedNationFlaws.length,
    FT: design.selectedForeignTraits.length,
  };

  const allForeignTraits = nations
    .filter(n => n.nation !== design.nationType)
    .flatMap(n => n.traits);

  // Toggle trait/flaw handlers
  function toggleInList(list: string[], value: string) {
    return list.includes(value)
      ? list.filter(t => t !== value)
      : [...list, value];
  }
  function selectTrait(type: "common" | "nation" | "foreign", trait: TraitOrFlaw) {
    if (type === "common") {
      if (trait.isTrait) {
        if (used.CT >= points.CT && !design.selectedCommonTraits.includes(trait.title)) {
          toast({ title: "No points left for Common Traits", status: "warning" }); return;
        }
        setDesign(d => ({
          ...d,
          selectedCommonTraits: toggleInList(d.selectedCommonTraits, trait.title)
        }));
      } else {
        if (used.CF >= points.CF && !design.selectedCommonFlaws.includes(trait.title)) {
          toast({ title: "No points left for Common Flaws", status: "warning" }); return;
        }
        setDesign(d => ({
          ...d,
          selectedCommonFlaws: toggleInList(d.selectedCommonFlaws, trait.title)
        }));
      }
    } else if (type === "nation") {
      if (trait.isTrait) {
        if (used.NT >= points.NT && !design.selectedNationTraits.includes(trait.title)) {
          toast({ title: "No points left for Nation Traits", status: "warning" }); return;
        }
        setDesign(d => ({
          ...d,
          selectedNationTraits: toggleInList(d.selectedNationTraits, trait.title)
        }));
      } else {
        if (used.NF >= points.NF && !design.selectedNationFlaws.includes(trait.title)) {
          toast({ title: "No points left for Nation Flaws", status: "warning" }); return;
        }
        setDesign(d => ({
          ...d,
          selectedNationFlaws: toggleInList(d.selectedNationFlaws, trait.title)
        }));
      }
    } else if (type === "foreign") {
      if (used.FT >= 2 && !design.selectedForeignTraits.includes(trait.title)) {
        toast({ title: "Maximum 2 foreign traits", status: "warning" }); return;
      }
      setDesign(d => ({
        ...d,
        selectedForeignTraits: toggleInList(d.selectedForeignTraits, trait.title)
      }));
    }
  }

  // Custom trait handlers
  function handleCustomTraitTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setDesign(d => ({
      ...d,
      customTrait: { ...d.customTrait, title: e.target.value } as TraitOrFlaw
    }));
  }
  function handleCustomTraitDesc(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDesign(d => ({
      ...d,
      customTrait: { ...d.customTrait, description: e.target.value } as TraitOrFlaw
    }));
  }
  function clearCustomTrait() {
    setDesign(d => ({ ...d, customTrait: null }));
  }

  // Save/load/clear/export/import
  function handleReset() { setDesign(defaultDesign); }
  function handleLoad() {
    const loaded = loadNationDesign();
    if (loaded) setDesign(loaded);
    else toast({ title: "No saved design!", status: "info" });
  }
  function handleClear() {
    clearNationDesign();
    setDesign(defaultDesign);
    toast({ title: "Cleared saved design!", status: "success" });
  }
  function handleCopyJSON() {
    navigator.clipboard.writeText(JSON.stringify(design, null, 2));
    toast({ title: "Design copied to clipboard!", status: "success" });
  }
  function handleImportJSON() {
    const txt = prompt("Paste JSON:");
    if (!txt) return;
    try {
      const imported = JSON.parse(txt) as NationDesign;
      setDesign(imported);
      toast({ title: "Imported!", status: "success" });
    } catch {
      toast({ title: "Invalid JSON", status: "error" });
    }
  }

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Nation Designer</Heading>
      <HStack spacing={4}>
        <Box>
          <Text>Nation Type</Text>
          <Select value={design.nationType} onChange={e => setDesign(d => ({
            ...d, nationType: e.target.value, selectedNationTraits: [], selectedNationFlaws: [], selectedForeignTraits: []
          }))}>
            <option value="">-- Select Nation Type --</option>
            {nations.map(n => (
              <option key={n.nation} value={n.nation}>{n.nation}</option>
            ))}
          </Select>
        </Box>
        <Box>
          <Text>Scale</Text>
          <Select value={design.scale} onChange={e => setDesign(d => ({ ...d, scale: e.target.value as NationDesign["scale"] }))}>
            {SCALES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </Select>
        </Box>
      </HStack>

      <SimpleGrid columns={[1, 2, 2, 4]} spacing={4}>
        <TraitListPanel
          title="Common Traits"
          traits={commonTraits.map(t => ({ ...t, isTrait: true }))}
          selected={design.selectedCommonTraits}
          onToggle={(trait: TraitOrFlaw) => selectTrait("common", { ...trait, isTrait: true })}
          isTrait={true}
          color={traitBoxColor}
          max={points.CT}
        />
        <TraitListPanel
          title="Common Flaws"
          traits={commonFlaws.map(f => ({ ...f, isTrait: false }))}
          selected={design.selectedCommonFlaws}
          onToggle={(trait: TraitOrFlaw) => selectTrait("common", { ...trait, isTrait: false })}
          isTrait={false}
          color={flawBoxColor}
          max={points.CF}
        />
        <TraitListPanel
          title="Nation Traits"
          traits={nationTraits.map(t => ({ ...t, isTrait: true }))}
          selected={design.selectedNationTraits}
          onToggle={(trait: TraitOrFlaw) => selectTrait("nation", { ...trait, isTrait: true })}
          isTrait={true}
          color={traitBoxColor}
          max={points.NT}
        />
        <TraitListPanel
          title="Nation Flaws"
          traits={nationFlaws.map(f => ({ ...f, isTrait: false }))}
          selected={design.selectedNationFlaws}
          onToggle={(trait: TraitOrFlaw) => selectTrait("nation", { ...trait, isTrait: false })}
          isTrait={false}
          color={flawBoxColor}
          max={points.NF}
        />
      </SimpleGrid>

      {/* Foreign Traits */}
      <Box>
        <Text fontWeight="bold">Foreign Traits (max 2)</Text>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={2}>
          {allForeignTraits.map(trait => (
            <div key={trait.title} onClick={() => selectTrait("foreign", { ...trait, isTrait: true })}>
              <TraitBox
                title={trait.title}
                description={trait.description}
                points={trait.points}
                isTrait={true}
                showTypeBadge
                showPointsBadge
                boxBg={design.selectedForeignTraits.includes(trait.title) ? "#f7e6ff" : undefined}
                boxBorder={design.selectedForeignTraits.includes(trait.title) ? "blue.400" : "gray.300"}
              />
            </div>
          ))}
        </SimpleGrid>
      </Box>

        <CustomTraitPanel
            trait={design.customTrait ?? null}
            onTitle={handleCustomTraitTitle}
            onDesc={handleCustomTraitDesc}
            onClear={clearCustomTrait}
        />


      <DesignerControls
        onReset={handleReset}
        onLoad={handleLoad}
        onClear={handleClear}
        onCopy={handleCopyJSON}
        onImport={handleImportJSON}
      />

      {/* Summary */}
      <Box>
        <Text fontWeight="bold">Summary</Text>
        <Text>
          <b>Nation Type:</b> {design.nationType}
        </Text>
        <Text>
          <b>Scale:</b> {design.scale}
        </Text>
        <Text>
          <b>Common Traits:</b> {design.selectedCommonTraits.join(", ")}
        </Text>
        <Text>
          <b>Common Flaws:</b> {design.selectedCommonFlaws.join(", ")}
        </Text>
        <Text>
          <b>Nation Traits:</b> {design.selectedNationTraits.join(", ")}
        </Text>
        <Text>
          <b>Nation Flaws:</b> {design.selectedNationFlaws.join(", ")}
        </Text>
        <Text>
          <b>Foreign Traits:</b> {design.selectedForeignTraits.join(", ")}
        </Text>
        <Text>
          <b>Custom Trait:</b> {design.customTrait?.title ? design.customTrait.title + ": " + design.customTrait.description : "None"}
        </Text>
      </Box>
    </VStack>
  );
};

export default NationDesigner;
