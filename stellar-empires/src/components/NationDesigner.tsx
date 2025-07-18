import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box, VStack, HStack, Text, Input, Divider, useBreakpointValue, useToast,
} from "@chakra-ui/react";
import NationTypeScaleSelector from "./NationDesigner/NationTypeScaleSelector";
import TraitCategoryPanel from "./NationDesigner/TraitCategoryPanel";
import ForeignTraitsPanel from "./NationDesigner/ForeignTraitsPanel";
import CustomTraitPanel from "./NationDesigner/CustomTraitPanel";
import DesignerControls from "./NationDesigner/DesignerControls";
import DesignSummary from "./NationDesigner/DesignSummary";
import { NationData, TraitOrFlaw, NationDesign, SCALES } from "../types";
import { saveNationDesign, loadNationDesign, clearNationDesign } from "../helpers/nationDesignerStorage";

// Memoized trait/summary/control components to prevent re-renders on nationName input
const MemoizedTraitCategoryPanel = React.memo(TraitCategoryPanel);
const MemoizedForeignTraitsPanel = React.memo(ForeignTraitsPanel);
const MemoizedCustomTraitPanel = React.memo(CustomTraitPanel);
const MemoizedDesignSummary = React.memo(DesignSummary);
const MemoizedDesignerControls = React.memo(DesignerControls);

type NationDesignerProps = {
  nations: NationData[];
  commonTraits: TraitOrFlaw[];
  commonFlaws: TraitOrFlaw[];
  traitBoxColor?: string;
  flawBoxColor?: string;
};

const defaultDesign: NationDesign = {
  nationName: "Unnamed Nation",
  nationType: "",
  scale: "Balanced",
  selectedCommonTraits: [],
  selectedCommonFlaws: [],
  selectedNationTraits: [],
  selectedNationFlaws: [],
  selectedForeignTraits: [],
  customTrait: null
};

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

  // Separate state for laggy input field
  const [nationNameInput, setNationNameInput] = useState(design.nationName);
  const nationNameDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Keep nationNameInput in sync with design.nationName if design changes (eg: reset/load)
  useEffect(() => { setNationNameInput(design.nationName); }, [design.nationName]);

  // Debounced nation name save
  function handleNationNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNationNameInput(e.target.value);
    if (nationNameDebounceRef.current) clearTimeout(nationNameDebounceRef.current);
    nationNameDebounceRef.current = setTimeout(() => {
      setDesign(d => d.nationName === e.target.value ? d : { ...d, nationName: e.target.value });
    }, 250);
  }

  // Save entire design on change (except for rapid nationName edits)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveNationDesign(design);
    }, 500);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [design]);

  const selectedNationData = nations.find(n => n.nation === design.nationType);
  const nationTraits: TraitOrFlaw[] = selectedNationData?.traits || [];
  const nationFlaws: TraitOrFlaw[] = selectedNationData?.flaws || [];
  const points = SCALE_POINTS[design.scale];
  const isWide = useBreakpointValue({ base: false, md: true });

  // --- Utilities ---
  function updateField<K extends keyof NationDesign>(key: K, value: NationDesign[K]) {
    setDesign(d => ({ ...d, [key]: value }));
  }

  function toggleInList(list: string[], value: string) {
    return list.includes(value)
      ? list.filter(t => t !== value)
      : [...list, value];
  }

  const selectTrait = useCallback((type: "common" | "nation" | "foreign", trait: TraitOrFlaw) => {
    const used = {
      CT: design.selectedCommonTraits.length,
      NT: design.selectedNationTraits.length,
      CF: design.selectedCommonFlaws.length,
      NF: design.selectedNationFlaws.length,
      FT: design.selectedForeignTraits.length,
    };
    if (type === "common") {
      if (trait.isTrait) {
        if (used.CT >= points.CT && !design.selectedCommonTraits.includes(trait.title)) {
          toast({ title: "No points left for Common Traits", status: "warning" }); return;
        }
        updateField("selectedCommonTraits", toggleInList(design.selectedCommonTraits, trait.title));
      } else {
        if (used.CF >= points.CF && !design.selectedCommonFlaws.includes(trait.title)) {
          toast({ title: "No points left for Common Flaws", status: "warning" }); return;
        }
        updateField("selectedCommonFlaws", toggleInList(design.selectedCommonFlaws, trait.title));
      }
    } else if (type === "nation") {
      if (trait.isTrait) {
        if (used.NT >= points.NT && !design.selectedNationTraits.includes(trait.title)) {
          toast({ title: "No points left for Nation Traits", status: "warning" }); return;
        }
        updateField("selectedNationTraits", toggleInList(design.selectedNationTraits, trait.title));
      } else {
        if (used.NF >= points.NF && !design.selectedNationFlaws.includes(trait.title)) {
          toast({ title: "No points left for Nation Flaws", status: "warning" }); return;
        }
        updateField("selectedNationFlaws", toggleInList(design.selectedNationFlaws, trait.title));
      }
    } else if (type === "foreign") {
      if (used.FT >= 2 && !design.selectedForeignTraits.includes(trait.title)) {
        toast({ title: "Maximum 2 foreign traits", status: "warning" }); return;
      }
      updateField("selectedForeignTraits", toggleInList(design.selectedForeignTraits, trait.title));
    }
  // dependencies are intentionally minimal for memoization (design and points are stable, toast can be omitted)
  // eslint-disable-next-line
  }, [design, points]);

  function handleCustomTraitTitle(e: React.ChangeEvent<HTMLInputElement>) {
    updateField("customTrait", { ...design.customTrait, title: e.target.value } as TraitOrFlaw);
  }
  function handleCustomTraitDesc(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateField("customTrait", { ...design.customTrait, description: e.target.value } as TraitOrFlaw);
  }
  function clearCustomTrait() {
    updateField("customTrait", null);
  }
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

  const allForeignTraits = nations
    .filter(n => n.nation !== design.nationType)
    .flatMap(n => n.traits);

  return (
    <Box
      h="100%"
      w="100%"
      display="flex"
      flexDirection="column"
      minH={0}
      minW={0}
      bg="chakra-body-bg"
      overflow="hidden"
    >
      {/* Header: nation name & selectors */}
      <Box p={[2, 3]} borderBottom="1px solid" borderColor="gray.200" flexShrink={0} bg="chakra-body-bg" zIndex={2}>
        <HStack spacing={3} mb={0} verticalAlign={"center"}>
          <Text fontWeight={500}>Nation Name</Text>
          <Input
            size="sm"
            maxW="180px"
            value={nationNameInput}
            onChange={handleNationNameChange}
            // Optionally, update onBlur as well:
            onBlur={() => setDesign(d => d.nationName === nationNameInput ? d : { ...d, nationName: nationNameInput })}
          />
          <NationTypeScaleSelector
            nations={nations}
            nationType={design.nationType}
            scale={design.scale}
            onChangeNation={nt => setDesign(d => ({
              ...d, nationType: nt, selectedNationTraits: [], selectedNationFlaws: [], selectedForeignTraits: []
            }))}
            onChangeScale={sc => setDesign(d => ({ ...d, scale: sc as typeof SCALES[number] }))}
            points={points}
          />
        </HStack>
      </Box>

      {/* Main content: trait panels (scrollable) + sidebar */}
      <Box flex="1" minH={0} minW={0} display="flex" flexDirection="row" overflow="hidden">
        {/* Traits column */}
        <Box
          flex="2"
          minW="320px"
          maxW="850px"
          mx="auto"
          px={[1, 4]}
          py={2}
          h="100%"
          overflowY="auto"
        >
          <MemoizedTraitCategoryPanel
            title="Common Traits"
            traits={commonTraits.map(t => ({ ...t, isTrait: true }))}
            selected={design.selectedCommonTraits}
            onToggle={trait => selectTrait("common", { ...trait, isTrait: true })}
            isTrait
            color={traitBoxColor}
            max={points.CT}
          />
          <MemoizedTraitCategoryPanel
            title="Common Flaws"
            traits={commonFlaws.map(f => ({ ...f, isTrait: false }))}
            selected={design.selectedCommonFlaws}
            onToggle={trait => selectTrait("common", { ...trait, isTrait: false })}
            isTrait={false}
            color={flawBoxColor}
            max={points.CF}
          />
          <MemoizedTraitCategoryPanel
            title="Nation Traits"
            traits={nationTraits.map(t => ({ ...t, isTrait: true }))}
            selected={design.selectedNationTraits}
            onToggle={trait => selectTrait("nation", { ...trait, isTrait: true })}
            isTrait
            color={traitBoxColor}
            max={points.NT}
          />
          <MemoizedTraitCategoryPanel
            title="Nation Flaws"
            traits={nationFlaws.map(f => ({ ...f, isTrait: false }))}
            selected={design.selectedNationFlaws}
            onToggle={trait => selectTrait("nation", { ...trait, isTrait: false })}
            isTrait={false}
            color={flawBoxColor}
            max={points.NF}
          />
          <MemoizedForeignTraitsPanel
            allForeignTraits={allForeignTraits}
            selected={design.selectedForeignTraits}
            onToggle={trait => selectTrait("foreign", { ...trait, isTrait: true })}
          />
          <MemoizedCustomTraitPanel
            trait={design.customTrait ?? null}
            onTitleChange={handleCustomTraitTitle}
            onDescChange={handleCustomTraitDesc}
            onClear={clearCustomTrait}
          />
        </Box>
        {/* Sidebar (summary + controls): sticky on desktop, below on mobile */}
        {isWide && (
          <Box
            flex="1"
            minW="260px"
            maxW="320px"
            position="relative"
            h="100%"
            px={2}
            py={0}
            display="flex"
            flexDirection="column"
            alignItems="stretch"
          >
            <Box
              position="sticky"
              zIndex={2}
              bg="chakra-body-bg"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.300"
              boxShadow="sm"
              p={2}
            >
              <MemoizedDesignSummary design={design} />
              <MemoizedDesignerControls
                onReset={handleReset}
                onLoad={handleLoad}
                onClear={handleClear}
                onCopy={handleCopyJSON}
                onImport={handleImportJSON}
              />
            </Box>
          </Box>
        )}
      </Box>
      {/* On mobile: summary/controls below trait list */}
      {!isWide && (
        <VStack align="stretch" spacing={4} my={4}>
          <Divider />
          <MemoizedDesignSummary design={design} />
          <MemoizedDesignerControls
            onReset={handleReset}
            onLoad={handleLoad}
            onClear={handleClear}
            onCopy={handleCopyJSON}
            onImport={handleImportJSON}
          />
        </VStack>
      )}
    </Box>
  );
};

export default NationDesigner;
