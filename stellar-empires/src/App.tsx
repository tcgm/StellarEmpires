import React, { useState } from "react";
import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import NationBrowser from "./components/NationBrowser";
import CommonTab from "./components/CommonTab";
import nations from "./data/nations.json";
import commonTraits from "./data/commonTraits.json";
import commonFlaws from "./data/commonFlaws.json";
import { TraitOrFlawList, NationData } from "./types";

type TabType = "nations" | "commonTraits" | "commonFlaws";

const TAB_LIST: { label: string; value: TabType }[] = [
  { label: "Nations", value: "nations" },
  { label: "Common Traits", value: "commonTraits" },
  { label: "Common Flaws", value: "commonFlaws" }
];

const MAX_W = "95vw";
const MAX_H = "90vh";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("nations");

  return (
    <Flex
      minH="100vh"
      minW="100vw"
      bg="gray.50"
      justify="center"
      align="center"
      overflow="hidden"
    >
      <Box
        w="100%"
        maxW={MAX_W}
        h="100%"
        maxH={MAX_H}
        bg="gray.100"
        borderRadius="2xl"
        boxShadow="2xl"
        border="1px solid #b7bec7"
        display="flex"
        overflow="hidden"
      >
        {/* Sidebar */}
        <Box
          w={["36%", "26%", "19%", "16%"]}
          minW={["120px", "140px", "170px"]}
          bg="gray.200"
          p={3}
          borderRight="1px solid #d0d6df"
          display="flex"
          flexDirection="column"
        >
          <Heading
            as="h1"
            size="sm"
            mb={4}
            color="blue.700"
            textAlign="center"
            letterSpacing="1px"
          >
            Documentation
          </Heading>
          <List spacing={1}>
            {TAB_LIST.map(tab => (
              <ListItem
                key={tab.value}
                bg={activeTab === tab.value ? "blue.600" : "transparent"}
                color={activeTab === tab.value ? "white" : "gray.900"}
                rounded="md"
                px={2}
                py={2}
                fontWeight={activeTab === tab.value ? 700 : 400}
                cursor="pointer"
                _hover={{
                  bg: activeTab === tab.value ? "blue.700" : "blue.100",
                  color: activeTab === tab.value ? "white" : "blue.900"
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
          <Text mt={6} fontSize="xs" color="gray.400" textAlign="center">
            Stellar Empires
          </Text>
        </Box>

        {/* Main Pane */}
        <Box className="mainPanel"
            flex="1"
            h="100%"
            p={[3, 6]}
            bg="white"
            display="flex"
            flexDirection="column"
            overflowY="auto"
            minH={0}           // <-- add this!
            maxH="100%"        // <-- add this!
        >
          <Heading
            size="lg"
            color="blue.800"
            mb={6}
            letterSpacing={-1}
            fontWeight={700}
            textAlign="left"
          >
            {TAB_LIST.find(t => t.value === activeTab)?.label}
          </Heading>
          <Box className="content"
            flex="1"
            h="100%"
            minH={0}           // <-- add this!
            maxH="100%"        // <-- add this!
            p={[3, 6]}
            bg="white"
            display="flex"
            flexDirection="column"
            overflowY="auto"
          >
            {activeTab === "nations" && (
              <NationBrowser nations={nations as NationData[]} />
            )}
            {activeTab === "commonTraits" && (
              <CommonTab
                title="Common Traits"
                items={commonTraits as TraitOrFlawList}
                color="#cde4fd"
              />
            )}
            {activeTab === "commonFlaws" && (
              <CommonTab
                title="Common Flaws"
                items={commonFlaws as TraitOrFlawList}
                color="#fde4cd"
              />
            )}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default App;
