import React, { useState } from "react";
import { Box, Button, Flex, Text, useColorModeValue, Badge } from "@chakra-ui/react";
import { TraitOrFlaw, TraitOrFlawList } from "../types";
import TraitBox from "./TraitBox";

interface Props {
  title: string;
  items: TraitOrFlawList;
  traitBoxColor: string;
  traitsNotFlaws: boolean;
}

const CommonTab: React.FC<Props> = ({ title, items, traitBoxColor, traitsNotFlaws }) => {
  const isArray = Array.isArray(items);
  const categoryKeys = !isArray ? Object.keys(items) : [];
  const [activeTab, setActiveTab] = useState(isArray ? "All" : categoryKeys[0] ?? "");

  // For background and text colors
  const cardBg = traitBoxColor;
  const cardBorder = useColorModeValue("#c6c6c6", "#3a4250");
  const titleColor = useColorModeValue("gray.800", "gray.100");
  const descColor = useColorModeValue("gray.700", "gray.100");
  const emptyColor = useColorModeValue("gray.500", "gray.400");

  // Select items to display
  const shownItems: TraitOrFlaw[] =
    isArray
      ? (items as TraitOrFlaw[])
      : (items as Record<string, TraitOrFlaw[]>)[activeTab] ?? [];

  return (
    <Flex className="commonTab" direction="column" h="100%" minH={0} maxH="100%">
      <Box className="heading">
        {!isArray && (
          <Flex mb={2} gap={2} flexWrap="wrap">
            {categoryKeys.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveTab(cat)}
                colorScheme="teal"
                size="sm"
                variant={activeTab === cat ? "solid" : "ghost"}
              >
                {cat}
              </Button>
            ))}
          </Flex>
        )}
      </Box>
      <Box className="traitList"
        flex="1"
        minH={0}
        overflowY="auto"
        pr={2}
      >
        {shownItems.length === 0 && (
          <Text color={emptyColor} fontStyle="italic">
            No {title.toLowerCase()} in this category.
          </Text>
        )}
        {shownItems.map((trait, i) => (
          <TraitBox
              key={"traitBox" + trait.title + i}
            title={trait.title}
            description={trait.description}
            isTrait={traitsNotFlaws}
            points={trait.points}
            boxBg={traitBoxColor}
            boxBorder={cardBorder}
            descColor={descColor}
          />
        ))}
      </Box>
    </Flex>
  );
};

export default CommonTab;
