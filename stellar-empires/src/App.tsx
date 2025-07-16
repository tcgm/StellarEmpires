import React, { useState } from "react";
import { Box, Flex, Heading, List, ListItem, Text, useColorModeValue } from "@chakra-ui/react";
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("nations");

  return (
    <Flex
      h="100vh"
      w="100vw"
      bg={useColorModeValue('gray.50', 'gray.900')}
      justify="center"
      align="center"
      overflow="hidden"
    >
      <Box
        w="100%"
        maxW="1200px"
        h="90vh"
        bg={useColorModeValue('gray.100', 'gray.800')}
        borderRadius="2xl"
        boxShadow="2xl"
        border="1px solid #b7bec7"
        display="flex"
        overflow="hidden"
        minH={0}
      >
        {/* Sidebar */}
        <Box
          w={["36%", "24%", "19%", "15%"]}
          minW={["120px", "140px", "170px"]}
          bg={useColorModeValue('gray.200', 'gray.700')}
          p={3}
          borderRight="1px solid #d0d6df"
          display="flex"
          flexDirection="column"
          minH={0}
        >
          <Heading
            as="h1"
            size="sm"
            mb={4}
            color="blue.700"
            textAlign="center"
            letterSpacing="1px"
          >
            Stellapedia
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

        {/* Main Content Pane */}
        <Flex
          className="mainPanel"
          direction="column"
          flex="1"
          minH={0}
          bg={useColorModeValue('gray.50', 'gray.600')}
        >
          <Heading
            size="lg"
            color="blue.800"
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
        </Flex>
      </Box>
    </Flex>
  );
};

export default App;
