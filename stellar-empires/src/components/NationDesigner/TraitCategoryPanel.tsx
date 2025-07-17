import React, { useState } from "react";
import { Box, List, ListItem, useColorModeValue, Collapse, IconButton, HStack } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
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

const SCROLL_CONTAINER_HEIGHT = "60vh";

const TraitCategoryPanel: React.FC<TraitCategoryPanelProps> = React.memo(({
  title, traits, selected, onToggle, isTrait, color, max
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const borderColor = useColorModeValue("#c6c6c6", "#3a4250");
  const descColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box
      className="traitCategoryPanel"
      maxH={SCROLL_CONTAINER_HEIGHT}
      overflowY="auto"
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={2}
      pt={0}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Section
        label={
          <HStack justify="space-between">
            <Box flex="1">
              {`${title} (${selected.length}${typeof max === "number" ? "/" + max : ""})`}
            </Box>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label={isOpen ? "Collapse traits" : "Expand traits"}
              icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              onClick={e => { e.stopPropagation(); setIsOpen(o => !o); }}
              tabIndex={0}
            />
          </HStack>
        }
        color={useColorModeValue("gray.700", "gray.200")}
        sticky
        stickyOffset={0}
      >
        <Collapse in={isOpen} animateOpacity>
          {isOpen && (
            <List spacing={3} mt={2}>
              {traits.map((trait, i) => (
                <ListItem
                  key={trait.title + "trait" + i}
                  onClick={() => onToggle(trait)}
                  style={{ cursor: "pointer" }}
                >
                  <TraitBox
                    key={"traitBox" + trait.title + title + i}
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
          )}
        </Collapse>
      </Section>
    </Box>
  );
});

export default TraitCategoryPanel;
