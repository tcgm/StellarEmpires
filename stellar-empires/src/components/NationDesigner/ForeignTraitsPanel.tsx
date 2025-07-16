import React from "react";
import { Box, List, ListItem, useColorModeValue } from "@chakra-ui/react";
import TraitBox from "../TraitBox";
import Section from "../StickySection";
import { TraitOrFlaw } from "../../types";

interface ForeignTraitsPanelProps {
  allForeignTraits: TraitOrFlaw[];
  selected: string[];
  onToggle: (trait: TraitOrFlaw) => void;
}

const SCROLL_CONTAINER_HEIGHT = "60vh";

const ForeignTraitsPanel: React.FC<ForeignTraitsPanelProps> = ({
  allForeignTraits, selected, onToggle
}) => {
  const borderColor = useColorModeValue("#c6c6c6", "#3a4250");
  const descColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box
      maxH={SCROLL_CONTAINER_HEIGHT}
      overflowY="auto"
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={2}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Section
        label="Foreign Traits (max 2)"
        color={useColorModeValue("gray.700", "gray.200")}
        sticky
        stickyOffset={0}
      >
        <List spacing={3}>
          {allForeignTraits.map(trait => (
            <ListItem key={trait.title} onClick={() => onToggle(trait)} style={{ cursor: "pointer" }}>
              <TraitBox
                title={trait.title}
                description={trait.description}
                points={trait.points}
                isTrait={true}
                showTypeBadge
                showPointsBadge
                boxBg={selected.includes(trait.title) ? "#f7e6ff" : undefined}
                boxBorder={selected.includes(trait.title) ? "purple.400" : "gray.300"}
                descColor={descColor}
              />
            </ListItem>
          ))}
        </List>
      </Section>
    </Box>
  );
};

export default ForeignTraitsPanel;
