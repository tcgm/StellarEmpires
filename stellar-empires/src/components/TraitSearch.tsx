import React, { useState } from "react";
import { Box, Input, Flex, Badge, Text, useColorModeValue, Link } from "@chakra-ui/react";
import { TraitOrFlaw, NationData } from "../types";
import TraitBox from "./TraitBox";

interface TraitSearchProps {
  allTraits: TraitOrFlaw[];
  nations: NationData[];
  goToNation: (nationName: string) => void;
}

const TraitSearch: React.FC<TraitSearchProps> = ({ allTraits, nations, goToNation }) => {
    const [query, setQuery] = useState("");

    const cardBg = useColorModeValue("gray.50", "gray.800");
    const cardBorder = useColorModeValue("#c6c6c6", "#3a4250");
    const titleColor = useColorModeValue("gray.800", "gray.100");
    const descColor = useColorModeValue("gray.700", "gray.100");
    const traitBg = useColorModeValue("#cdfddaff", "#25542aff");
    const flawBg = useColorModeValue("#fde4cd", "#4b3721");

  // Basic search
  const filtered = allTraits.filter(
    t =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  // Helper to get full nation info if needed
  const getNationDisplayName = (nationName: string) => {
    const match = nations.find(n => n.nation === nationName);
    return match ? match.nation || match.nation : nationName;
  };


  return (
    <Box>
      <Input
        placeholder="Search all traits and flaws..."
        mb={4}
        value={query}
        onChange={e => setQuery(e.target.value)}
        size="lg"
      />
      <Flex direction="column" gap={4} maxH="60vh" overflowY="auto">
        {filtered.length === 0 ? (
          <Text color="gray.400" fontStyle="italic">
            No traits or flaws match your search.
          </Text>
        ) : (
          filtered.map((trait, i) => (
            <TraitBox
                key={"traitBox" + trait.title + i}
                index={i}
                title={trait.title}
                description={trait.description}
                isTrait={trait.isTrait}
                showTypeBadge
                nations={trait.nations}
                boxBg={trait.isTrait ? traitBg : flawBg}
                getNationDisplayName={getNationDisplayName}
                goToNation={goToNation}
            />
          ))
        )}
      </Flex>
    </Box>
  );
};

export default TraitSearch;
