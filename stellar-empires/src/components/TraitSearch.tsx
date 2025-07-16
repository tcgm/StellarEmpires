import React, { useState } from "react";
import { Box, Input, Flex, Badge, Text, useColorModeValue, Link } from "@chakra-ui/react";
import { TraitOrFlaw, NationData } from "../types";

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
            <Box
              key={trait.title + i}
              bg={cardBg}
              borderRadius={8}
              p={4}
              border="1px solid"
              borderColor={cardBorder}
              boxShadow="sm"
            >
              <Flex align="center" mb={2} wrap="wrap" gap={2}>
                <Badge
                  colorScheme={trait.isTrait ? "green" : "orange"}
                  fontSize="0.85em"
                >
                  {trait.isTrait ? "Trait" : "Flaw"}
                </Badge>
                <Text fontWeight={700} fontSize="lg" color={titleColor} mr={2}>
                  {trait.title}
                </Text>
                {/* Show nation(s) if present */}
                {trait.nations && trait.nations.length > 0 && (
                    <Flex gap={1} align="center">
                        <Text fontSize="sm" color="gray.400" as="span">from</Text>
                        {(trait.nations ?? []).map((nation, ni, arr) => (
                        <Link
                            key={nation}
                            onClick={() => goToNation(nation)}
                            _hover={{ textDecoration: "underline", color: "blue.100" }}
                            mr={ni < (arr.length - 1) ? 1 : 0}
                        >
                            {getNationDisplayName(nation)}
                        </Link>
                        ))}
                    </Flex>
                )}
              </Flex>
              <Text color={descColor} whiteSpace="pre-line">{trait.description}</Text>
            </Box>
          ))
        )}
      </Flex>
    </Box>
  );
};

export default TraitSearch;
