import React, { useEffect, useState } from "react";
import {
  Box, Button, Select, Heading, SimpleGrid, Textarea, Input, Text, Tag, VStack, HStack, useToast
} from "@chakra-ui/react";
import { NationData, TraitOrFlaw, NationDesign } from "../types";
import { saveNationDesign, loadNationDesign, clearNationDesign } from "../helpers/nationDesignerStorage";

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
  nations,
  commonTraits,
  commonFlaws,
  traitBoxColor = "#cdfddaff",
  flawBoxColor = "#fde4cd"
}) => {
  const toast = useToast();
  const [design, setDesign] = useState<NationDesign>(() => loadNationDesign() || defaultDesign);

  useEffect(() => { saveNationDesign(design); }, [design]);

  // Get selected nation's data
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

  // Foreign traits are traits from other nation types
  const allForeignTraits = nations
    .filter(n => n.nation !== design.nationType)
    .flatMap(n => n.traits);

  // --- Handler functions ---

  function handleScaleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDesign(d => ({ ...d, scale: e.target.value as NationDesign["scale"] }));
  }
  function handleNationTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDesign(d => ({
      ...d,
      nationType: e.target.value,
      selectedNationTraits: [],
      selectedNationFlaws: [],
      selectedForeignTraits: []
    }));
  }
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

  // Custom trait
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
          <Select value={design.nationType} onChange={handleNationTypeChange}>
            <option value="">-- Select Nation Type --</option>
            {nations.map(n => (
              <option key={n.nation} value={n.nation}>{n.nation}</option>
            ))}
          </Select>
        </Box>
        <Box>
          <Text>Scale</Text>
          <Select value={design.scale} onChange={handleScaleChange}>
            {SCALES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </Select>
        </Box>
      </HStack>

      <SimpleGrid columns={[1, 2, 2, 4]} spacing={4}>
        {/* Common Traits */}
        <Box>
          <Text fontWeight="bold">Common Traits ({used.CT}/{points.CT})</Text>
          {commonTraits.map(trait => (
            <TraitCard
              key={trait.title}
              trait={trait}
              selected={design.selectedCommonTraits.includes(trait.title)}
              color={traitBoxColor}
              onClick={() => selectTrait("common", { ...trait, isTrait: true })}
            />
          ))}
        </Box>
        {/* Common Flaws */}
        <Box>
          <Text fontWeight="bold">Common Flaws ({used.CF}/{points.CF})</Text>
          {commonFlaws.map(flaw => (
            <TraitCard
              key={flaw.title}
              trait={flaw}
              selected={design.selectedCommonFlaws.includes(flaw.title)}
              color={flawBoxColor}
              onClick={() => selectTrait("common", { ...flaw, isTrait: false })}
            />
          ))}
        </Box>
        {/* Nation Traits */}
        <Box>
          <Text fontWeight="bold">Nation Traits ({used.NT}/{points.NT})</Text>
          {nationTraits.map(trait => (
            <TraitCard
              key={trait.title}
              trait={trait}
              selected={design.selectedNationTraits.includes(trait.title)}
              color={traitBoxColor}
              onClick={() => selectTrait("nation", { ...trait, isTrait: true })}
            />
          ))}
        </Box>
        {/* Nation Flaws */}
        <Box>
          <Text fontWeight="bold">Nation Flaws ({used.NF}/{points.NF})</Text>
          {nationFlaws.map(flaw => (
            <TraitCard
              key={flaw.title}
              trait={flaw}
              selected={design.selectedNationFlaws.includes(flaw.title)}
              color={flawBoxColor}
              onClick={() => selectTrait("nation", { ...flaw, isTrait: false })}
            />
          ))}
        </Box>
      </SimpleGrid>

      {/* Foreign Traits (max 2) */}
      <Box>
        <Text fontWeight="bold">Foreign Traits (max 2)</Text>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={2}>
          {allForeignTraits.map(trait => (
            <TraitCard
              key={trait.title}
              trait={trait}
              selected={design.selectedForeignTraits.includes(trait.title)}
              color="#f7e6ff"
              onClick={() => selectTrait("foreign", { ...trait, isTrait: true })}
            />
          ))}
        </SimpleGrid>
      </Box>

      {/* Custom Trait */}
      <Box>
        <Text fontWeight="bold">Custom Trait</Text>
        <HStack align="start" spacing={3}>
          <Input
            placeholder="Trait Title"
            value={design.customTrait?.title || ""}
            onChange={handleCustomTraitTitle}
            width="200px"
          />
          <Textarea
            placeholder="Trait Description"
            value={design.customTrait?.description || ""}
            onChange={handleCustomTraitDesc}
            width="400px"
            rows={2}
          />
          <Button onClick={clearCustomTrait}>Clear</Button>
        </HStack>
      </Box>

      {/* Controls */}
      <HStack spacing={2}>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleLoad}>Load Saved</Button>
        <Button onClick={handleClear}>Clear Saved</Button>
        <Button onClick={handleCopyJSON}>Copy JSON</Button>
        <Button onClick={handleImportJSON}>Import JSON</Button>
      </HStack>

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

// ----- Helper Trait Card -----
type TraitCardProps = {
  trait: TraitOrFlaw;
  selected: boolean;
  color: string;
  onClick: () => void;
};
const TraitCard: React.FC<TraitCardProps> = ({ trait, selected, color, onClick }) => (
  <Box
    borderWidth="1px"
    borderRadius="md"
    p={2}
    m={1}
    bg={selected ? color : "transparent"}
    borderColor={selected ? "blue.400" : "gray.300"}
    cursor="pointer"
    onClick={onClick}
    minW="180px"
    maxW="320px"
    _hover={{ boxShadow: "md" }}
    transition="all 0.1s"
  >
    <Text fontWeight="bold">
      {trait.title}
      {trait.points && <Tag ml={2}>{trait.points > 0 ? "+" : ""}{trait.points}</Tag>}
    </Text>
    <Text fontSize="sm">{trait.description}</Text>
    {trait.nations && trait.nations.length > 0 && (
      <Text fontSize="xs" color="gray.500">
        ({trait.nations.join(", ")})
      </Text>
    )}
  </Box>
);
