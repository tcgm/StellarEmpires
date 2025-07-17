import React from "react";
import { Box, Heading, Text, Divider, List, ListItem, Badge, useColorModeValue } from "@chakra-ui/react";
import { NationData } from "../types";
import TraitBox from "./TraitBox";
import Section from "./StickySection";

interface Props {
  data: NationData;
  traitBoxColor: string;
  flawBoxColor: string;
}

const NATION_HEADER_HEIGHT = "56px"; // Tweak to match your main header size

const NationView: React.FC<Props> = ({
  data,
  traitBoxColor,
  flawBoxColor
}) => {
  // Color mode values
  const sectionLabelColor = useColorModeValue("gray.700", "gray.200");
  const nationNameColor = useColorModeValue("blue.400", "blue.50");
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  const descColor = useColorModeValue("gray.800", "gray.100");
  const cardBorder = useColorModeValue("#c6c6c6", "#3a4250");
  const bodyBg = useColorModeValue("white", "gray.800"); // For sticky bg
  
  

  return (
    <Box
      p={4}
      pt={0}
      bg={bodyBg}
      borderRadius="lg"
      border="1px solid"
      borderColor={cardBorder}
    >
      {/* Sticky nation name */}
      <Heading
        as="h2"
        size="lg"
        color={nationNameColor}
        position="sticky"
        top={0}
        bg={bodyBg}
        zIndex={2}
        px={2}
        letterSpacing={-0.5}
        boxShadow="sm"
        height={NATION_HEADER_HEIGHT} // Helps with measuring
        display="flex"
        alignItems="center"
      >
        {data.nation}
      </Heading>
      <Divider mb={4} borderColor={dividerColor} />

      <Section
        label="Traits"
        color={sectionLabelColor}
        sticky
        stickyOffset={NATION_HEADER_HEIGHT}
      >
        <List spacing={3}>
          {data.traits.map((t, i) => (
            <ListItem key={t.title + i}>
              <TraitBox
                key={"traitBox" + t.title + i}
                title={t.title}
                description={t.description}
                isTrait={true}
                points={t.points}
                boxBg={traitBoxColor}
                boxBorder={cardBorder}
                descColor={descColor}
              />
            </ListItem>
          ))}
        </List>
      </Section>
      <Section
        label="Flaws"
        color={sectionLabelColor}
        sticky
        stickyOffset={NATION_HEADER_HEIGHT}
      >
        <List spacing={3}>
          {data.flaws.map((f, i) => (
            <ListItem key={f.title + i}>
              <TraitBox
                key={"traitBox" + f.title + i}
                title={f.title}
                description={f.description}
                isTrait={false}
                points={f.points}
                boxBg={flawBoxColor}
                boxBorder={cardBorder}
                descColor={descColor}
              />
            </ListItem>
          ))}
        </List>
      </Section>
    </Box>
  );
};

export default NationView;
