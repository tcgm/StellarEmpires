import React, { useState } from "react";
import { Box, Button, Heading, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { TraitOrFlaw, TraitOrFlawList } from "../types";

interface Props {
  title: string;
  items: TraitOrFlawList;
  color: string; // Still passed in, but see note below!
}

const CommonTab: React.FC<Props> = ({ title, items, color }) => {
  const isArray = Array.isArray(items);
  const categoryKeys = !isArray ? Object.keys(items) : [];
  const [activeTab, setActiveTab] = useState(isArray ? "All" : categoryKeys[0] ?? "");

  // For background and text colors
  const cardBg = useColorModeValue(color, "gray.800");
  const cardBorder = useColorModeValue("#c6c6c6", "#3a4250");
  const titleColor = useColorModeValue("gray.800", "gray.100");
  const descColor = useColorModeValue("gray.700", "gray.200");
  const emptyColor = useColorModeValue("gray.500", "gray.400");

  // Select items to display
  const shownItems: TraitOrFlaw[] =
    isArray
      ? (items as TraitOrFlaw[])
      : (items as Record<string, TraitOrFlaw[]>)[activeTab] ?? [];

  return (
    <Flex className="commonTab" direction="column" h="100%" minH={0} maxH="100%">
      <Box className="heading">
        <Heading as="h2" size="md" mb={3} color={titleColor}>
          {title}
        </Heading>
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
          <Box className="traitBox"
            key={trait.title + i}
            bg={cardBg}
            borderRadius={8}
            mb={4}
            p={4}
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="sm"
          >
            <Text className="traitName" fontWeight={700} fontSize="lg" color={titleColor}>{trait.title}</Text>
            <Text className="traitText" mt={2} color={descColor} whiteSpace="pre-line">{trait.description}</Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};

export default CommonTab;
