import React, { useState } from "react";
import { Box, Button, Heading, Flex, Text } from "@chakra-ui/react";
import { TraitOrFlaw, TraitOrFlawList } from "../types";

interface Props {
  title: string;
  items: TraitOrFlawList;
  color: string;
}

const CommonTab: React.FC<Props> = ({ title, items, color }) => {
  const isArray = Array.isArray(items);
  const categoryKeys = !isArray ? Object.keys(items) : [];
  const [activeTab, setActiveTab] = useState(isArray ? "All" : categoryKeys[0] ?? "");

  // Select items to display
  const shownItems: TraitOrFlaw[] =
    isArray
      ? (items as TraitOrFlaw[])
      : (items as Record<string, TraitOrFlaw[]>)[activeTab] ?? [];

  return (
    <Flex className="commonTab" direction="column" h="100%" minH={0} maxH="100%">
      {/* Heading and Tabs (fixed, not scrolling) */}
      <Box className="heading">
        <Heading as="h2" size="md" mb={3} color="gray.800">{title}</Heading>
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
      {/* Scrollable Trait List */}
      <Box className="traitList"
        flex="1"
        minH={0}
        overflowY="auto"
        pr={2}
        // Optional: give a subtle border if you like
      >
        {shownItems.length === 0 && (
          <Text color="gray.500" fontStyle="italic">
            No {title.toLowerCase()} in this category.
          </Text>
        )}
        {shownItems.map((trait, i) => (
          <Box className="traitBox"
            key={trait.title + i}
            bg={color}
            borderRadius={8}
            mb={4}
            p={4}
            border="1px solid #c6c6c6"
            boxShadow="sm"
          >
            <Text className="traitName" fontWeight={700} fontSize="lg" color="gray.800">{trait.title}</Text>
            <Text className="traitText" mt={2} color="gray.700" whiteSpace="pre-line">{trait.description}</Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};

export default CommonTab;
