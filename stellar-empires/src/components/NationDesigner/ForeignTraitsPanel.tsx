import React, { useState } from "react";
import { Box, List, ListItem, useColorModeValue, Collapse, IconButton, HStack } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import TraitBox from "../TraitBox";
import Section from "../StickySection";
import { TraitOrFlaw } from "../../types";

interface ForeignTraitsPanelProps {
  allForeignTraits: TraitOrFlaw[];
  selected: string[];
  onToggle: (trait: TraitOrFlaw) => void;
}

const SCROLL_CONTAINER_HEIGHT = "60vh";

const ForeignTraitsPanel: React.FC<ForeignTraitsPanelProps> = React.memo(({
  allForeignTraits, selected, onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const borderColor = useColorModeValue("#c6c6c6", "#3a4250");
  const descColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box
      className="foreignTraitsPanel"
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
            <Box flex="1">Foreign Traits (max 2)</Box>
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
              {allForeignTraits.map((trait, i) => (
                <ListItem
                  key={trait.title + "foreignTrait" + i}
                  onClick={() => onToggle(trait)}
                  style={{ cursor: "pointer" }}
                >
                  <TraitBox
                    key={"traitBox" + trait.title + "foreignTrait" + i}
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
          )}
        </Collapse>
      </Section>
    </Box>
  );
});

export default ForeignTraitsPanel;
