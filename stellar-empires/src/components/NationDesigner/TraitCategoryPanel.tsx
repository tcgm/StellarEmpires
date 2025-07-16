import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import TraitBox from "../TraitBox";
import { TraitOrFlaw } from "../../types";

interface TraitCategoryPanelProps {
  title: string;
  traits: TraitOrFlaw[];
  selected: string[];
  onToggle: (trait: TraitOrFlaw) => void;
  isTrait: boolean;
  color: string;
  max?: number;
}
const TraitCategoryPanel: React.FC<TraitCategoryPanelProps> = ({
  title, traits, selected, onToggle, isTrait, color, max
}) => (
  <Box>
    <Text fontWeight="bold" mb={2}>{title} ({selected.length}{typeof max === "number" ? "/" + max : ""})</Text>
    <SimpleGrid columns={[1]} spacing={3}>
      {traits.map(trait => (
        <Box
          key={trait.title}
          onClick={() => onToggle(trait)}
          style={{ cursor: "pointer" }}
        >
          <TraitBox
            title={trait.title}
            description={trait.description}
            points={trait.points}
            isTrait={isTrait}
            showTypeBadge
            showPointsBadge
            boxBg={selected.includes(trait.title) ? color : undefined}
            boxBorder={selected.includes(trait.title) ? "blue.400" : "gray.300"}
          />
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);
export default TraitCategoryPanel;
