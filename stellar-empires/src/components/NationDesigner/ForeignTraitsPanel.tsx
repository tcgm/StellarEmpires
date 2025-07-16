import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import TraitBox from "../TraitBox";
import { TraitOrFlaw } from "../../types";

interface ForeignTraitsPanelProps {
  allForeignTraits: TraitOrFlaw[];
  selected: string[];
  onToggle: (trait: TraitOrFlaw) => void;
}

const ForeignTraitsPanel: React.FC<ForeignTraitsPanelProps> = ({
  allForeignTraits, selected, onToggle
}) => (
  <Box>
    <Text fontWeight="bold" mb={2}>Foreign Traits (max 2)</Text>
    <SimpleGrid columns={[1]} spacing={2}>
      {allForeignTraits.map(trait => (
        <Box
          key={trait.title}
          onClick={() => onToggle(trait)}
          style={{ cursor: "pointer" }}
        >
          <TraitBox
            title={trait.title}
            description={trait.description}
            points={trait.points}
            isTrait={true}
            showTypeBadge
            showPointsBadge
            boxBg={selected.includes(trait.title) ? "#f7e6ff" : undefined}
            boxBorder={selected.includes(trait.title) ? "purple.400" : "gray.300"}
          />
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

export default ForeignTraitsPanel;
