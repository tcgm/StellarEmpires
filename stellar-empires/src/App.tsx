import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, List, ListItem, Text, useColorModeValue } from "@chakra-ui/react";
import NationBrowser from "./components/NationBrowser";
import CommonTab from "./components/CommonTab";
// import nations from "./data/nations.json";
import { fetchAllNationData } from "./helpers/nationLoader";
import commonTraitsRaw from "./data/commonTraits.json";
import commonFlawsRaw from "./data/commonFlaws.json";
import { TraitOrFlawList, NationData, TraitOrFlaw } from "./types";
import ColorModeToggle from "./components/ColorModeToggle";
import TraitSearch from "./components/TraitSearch";

import se6bg from './assets/se6bg.png';
import NationDesigner from "./components/NationDesigner";
import { toTraitArray } from "./helpers/flatten";

type TabType = "nations" | "commonTraits" | "commonFlaws" | "traitSearch" | "nationDesign";

const TAB_LIST: { label: string; value: TabType }[] = [
  { label: "Nations", value: "nations" },
  { label: "Common Traits", value: "commonTraits" },
  { label: "Common Flaws", value: "commonFlaws" },
  { label: "Trait/Flaw Search", value: "traitSearch" },
  { label: "Nation Designer", value: "nationDesign" }
];

const commonTraits: TraitOrFlawList = commonTraitsRaw as TraitOrFlawList;

const commonFlaws: TraitOrFlawList = commonFlawsRaw as TraitOrFlawList;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("nations");
  const [passedNation, setPassedNation] = useState<string | null>(null);

  const [nations, setNations] = useState<NationData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNationData().then(data => {
      setNations(data);
      setLoading(false);
    });
  }, []);

  // console.log(JSON.stringify(nations));

  // These are color tokens that will adapt to the color mode
  const mainBg = useColorModeValue("gray.50", "gray.900");
  const innerBg = useColorModeValue("gray.100", "gray.800");
  const sidebarBg = useColorModeValue("gray.200", "gray.700");
  const contentBg = useColorModeValue("gray.50", "gray.700");
  const activeTabBg = useColorModeValue("blue.600", "blue.200");
  const activeTabColor = useColorModeValue("white", "blue.100");
  const inactiveTabColor = useColorModeValue("gray.900", "gray.100");
  const tabHoverBg = useColorModeValue("blue.100", "blue.200");
  const tabHoverColor = useColorModeValue("blue.900", "blue.100");
  const headingColor = useColorModeValue("blue.600", "blue.50");
  const footerColor = useColorModeValue("gray.400", "gray.200");

  // Use matching highlight color for traits/flaws (blue for traits, orange for flaws) in both modes
  const traitBg = useColorModeValue("#cdfddaff", "#25542aff");
  const flawBg = useColorModeValue("#fde4cd", "#4b3721");

  type TraitOrFlawMap = Record<string, TraitOrFlaw & { isTrait: boolean; nations: string[] }>;

  function buildAllTraitsAndFlaws(
    commonTraits: TraitOrFlawList,
    commonFlaws: TraitOrFlawList,
    nations: NationData[]
  ): TraitOrFlaw[] {
    // 1. Start with common traits/flaws, map by title for deduplication
    const map: TraitOrFlawMap = {};

    function flatten(list: TraitOrFlawList, isTrait: boolean) {
      if (Array.isArray(list)) {
        list.forEach(trait => {
          map[trait.title] = { ...trait, isTrait, nations: [] };
        });
      } else {
        Object.values(list).flat().forEach(trait => {
          map[trait.title] = { ...trait, isTrait, nations: [] };
        });
      }
    }
    flatten(commonTraits, true);
    flatten(commonFlaws, false);

    // 2. For each nation, add their traits/flaws; if unique, add new; if duplicate, add nation to .nations
    nations.forEach(nation => {
      (nation.traits ?? []).forEach(trait => {
        if (map[trait.title]) {
          // Already exists, just add the nation
          if (!map[trait.title].nations.includes(nation.nation))
            map[trait.title].nations.push(nation.nation);
        } else {
          // Unique, add as new
          map[trait.title] = { ...trait, isTrait: true, nations: [nation.nation] };
        }
      });
      (nation.flaws ?? []).forEach(flaw => {
        if (map[flaw.title]) {
          if (!map[flaw.title].nations.includes(nation.nation))
            map[flaw.title].nations.push(nation.nation);
        } else {
          map[flaw.title] = { ...flaw, isTrait: false, nations: [nation.nation] };
        }
      });
    });

    // 3. Return as array
    return Object.values(map);
  }

  const allTraitsAndFlaws: TraitOrFlaw[] = React.useMemo(() => {
    if (!nations) return [];
    return buildAllTraitsAndFlaws(
      commonTraits as TraitOrFlawList,
      commonFlaws as TraitOrFlawList,
      nations
    );
  }, [nations, commonTraits, commonFlaws, buildAllTraitsAndFlaws]);
    
  useEffect(() => {
    if (activeTab !== "nations" && passedNation) {
      setPassedNation(null);
    }
  }, [activeTab, passedNation]);

  return (
    <Flex
      h="100vh"
      w="100vw"
      // bg={mainBg}
      sx={{
        backgroundImage: `url(${se6bg})`,
        backgroundSize: 'cover',       // or 'contain', or 'auto'
        backgroundRepeat: 'no-repeat', // or 'repeat' if you want tiling
        backgroundPosition: 'center',
        backgroundColor: mainBg
      }}
      justify="center"
      align="center"
      overflow="hidden"
    >
      <Box
        w="100%"
        maxW="95vw"
        h="90vh"
        bg={innerBg}
        borderRadius="2xl"
        boxShadow="2xl"
        border="1px solid"
        borderColor={useColorModeValue("#b7bec7", "#2e3540")}
        display="flex"
        overflow="hidden"
        minH={0}
      >
        {/* Sidebar */}
        <Box
          w={["36%", "24%", "19%", "15%"]}
          minW={["120px", "140px", "170px"]}
          bg={sidebarBg}
          p={3}
          borderRight="1px solid"
          borderColor={useColorModeValue("#d0d6df", "#3c4352")}
          display="flex"
          flexDirection="column"
          minH={0}
        >
          <Heading
            as="h1"
            size="sm"
            mb={4}
            color={headingColor}
            textAlign="center"
            letterSpacing="1px"
          >
            Stellapedia
          </Heading>
          <List spacing={1}>
            {TAB_LIST.map(tab => (
              <ListItem
                key={tab.value}
                bg={activeTab === tab.value ? activeTabBg : "transparent"}
                color={activeTab === tab.value ? activeTabColor : inactiveTabColor}
                rounded="md"
                px={2}
                py={2}
                fontWeight={activeTab === tab.value ? 700 : 400}
                cursor="pointer"
                _hover={{
                  bg: activeTab === tab.value ? activeTabBg : tabHoverBg,
                  color: activeTab === tab.value ? activeTabColor : tabHoverColor
                }}
                onClick={() => setActiveTab(tab.value)}
                textAlign="center"
                transition="all 0.1s"
              >
                {tab.label}
              </ListItem>
            ))}
          </List>
          <Box flex="1" />
            <Text mt={6} fontSize="xs" color={footerColor} textAlign="center">
              Stellar Empires
            </Text>
            <ColorModeToggle />
        </Box>

        {/* Main Content Pane */}
        <Flex
          className="mainPanel"
          direction="column"
          flex="1"
          minH={0}
          bg={contentBg}
        >
          <Heading
            size="lg"
            color={headingColor}
            mb={4}
            letterSpacing={-1}
            fontWeight={700}
            textAlign="left"
            px={[3, 6]}
            pt={4}
          >
            {TAB_LIST.find(t => t.value === activeTab)?.label}
          </Heading>
          <Box
            className="content"
            flex="1"
            minH={0}
            overflowY="auto"
            px={[3, 6]}
            pb={6}
          >
            {activeTab === "nations" && (
              loading || !nations ? (
                <Box py={10} textAlign="center">Loading nations...</Box>
              ) : (
                <NationBrowser
                  nations={nations}
                  traitBoxColor={traitBg}
                  flawBoxColor={flawBg}
                  passedNation={passedNation}
                />
              )
            )}

            {activeTab === "commonTraits" && (
              <CommonTab
                title="Common Traits"
                items={commonTraits as TraitOrFlawList}
                traitBoxColor={traitBg}
                traitsNotFlaws={true}
              />
            )}
            {activeTab === "commonFlaws" && (
              <CommonTab
                title="Common Flaws"
                items={commonFlaws as TraitOrFlawList}
                traitBoxColor={flawBg}
                traitsNotFlaws={false}
              />
            )}
            {activeTab === "traitSearch" && (
              <TraitSearch
                allTraits={allTraitsAndFlaws}
                nations={nations as NationData[]}
                goToNation={nationName => {
                  // Custom function to activate the nations tab and select a nation
                  setActiveTab("nations");
                  setPassedNation(nationName);
                }}
              />
            )}
            {activeTab === "nationDesign" && (
              loading || !nations ? (
                <Box py={10} textAlign="center">Loading nations...</Box>
              ) : (
                <NationDesigner
                  nations={nations}
                  commonTraits={toTraitArray(commonTraits)}
                  commonFlaws={toTraitArray(commonFlaws)}
                  traitBoxColor={traitBg}
                  flawBoxColor={flawBg}
                />
              )
          )}

          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default App;
