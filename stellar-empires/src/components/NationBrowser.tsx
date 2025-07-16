import React, { useState } from "react";
import { Box, Flex, Input, List, ListItem, Heading, Text } from "@chakra-ui/react";
import { NationData } from "../types";
import NationView from "./NationView";

interface Props {
  nations: NationData[];
}

const NationBrowser: React.FC<Props> = ({ nations }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = nations
    .filter(n => n.nation.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.nation.localeCompare(b.nation));

  const selectedNation = filtered[selectedIndex] || filtered[0];

  return (
    <Flex w="100%" h="min(660px, 74vh)">
      {/* Sidebar List */}
      <Box
        w={["36%", "28%", "20%"]}
        minW={["100px", "140px", "160px"]}
        bg="transparent"
        p={0}
        pr={[2, 3]}
        borderRight="1px solid #d0d6df"
        overflowY="auto"
        display="flex"
        flexDirection="column"
      >
        <Heading as="h3" size="sm" mb={2} color="blue.800" px={3} pt={3}>
        </Heading>
        <Box px={3} mb={2}>
          <Input
            placeholder="Search..."
            size="sm"
            mb={2}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </Box>
        <List spacing={1} px={1} pb={2}>
          {filtered.map((nation, i) => (
            <ListItem
              key={nation.nation}
              bg={i === selectedIndex ? "blue.600" : "transparent"}
              color={i === selectedIndex ? "white" : "gray.800"}
              rounded="md"
              px={2}
              py={1}
              fontWeight={i === selectedIndex ? 700 : 400}
              cursor="pointer"
              _hover={{
                bg: i === selectedIndex ? "blue.700" : "blue.50",
                color: i === selectedIndex ? "white" : "blue.900"
              }}
              transition="all 0.1s"
              onClick={() => setSelectedIndex(i)}
            >
              {nation.nation}
            </ListItem>
          ))}
          {!filtered.length && <Text color="gray.500" p={2}>No nations found.</Text>}
        </List>
      </Box>
      {/* Main Detail */}
      <Box flex="1" p={[3, 5]} overflowY="auto" bg="transparent">
        {selectedNation ? (
          <NationView data={selectedNation} />
        ) : (
          <Text color="gray.500" fontStyle="italic">No nation selected.</Text>
        )}
      </Box>
    </Flex>
  );
};

export default NationBrowser;
