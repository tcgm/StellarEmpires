import React from "react";
import { Box, List, ListItem, useColorModeValue } from "@chakra-ui/react";
import TraitBox from "../TraitBox";
import Section from "../StickySection";
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

const SCROLL_CONTAINER_HEIGHT = "60vh"; // or whatever fits your layout

const TraitCategoryPanel: React.FC<TraitCategoryPanelProps> = ({
  title, traits, selected, onToggle, isTrait, color, max
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
        label={`${title} (${selected.length}${typeof max === "number" ? "/" + max : ""})`}
        color={useColorModeValue("gray.700", "gray.200")}
        sticky
        stickyOffset={0}
      >
        <List spacing={3}>
          {traits.map(trait => (
            <ListItem key={trait.title} onClick={() => onToggle(trait)} style={{ cursor: "pointer" }}>
              <TraitBox
                title={trait.title}
                description={trait.description}
                points={trait.points}
                isTrait={isTrait}
                showTypeBadge
                showPointsBadge
                boxBg={selected.includes(trait.title) ? color : undefined}
                boxBorder={selected.includes(trait.title) ? "blue.400" : "gray.300"}
                descColor={descColor}
              />
            </ListItem>
          ))}
        </List>
      </Section>
    </Box>
  );
};

export default TraitCategoryPanel;
