import React from "react";
import { Box, Heading, Text, Divider, List, ListItem, Badge, useColorModeValue } from "@chakra-ui/react";
import { NationData } from "../types";

interface SectionProps {
  label?: string;
  color?: string;
  children: React.ReactNode;
  sticky?: boolean;
  stickyOffset?: number | string;
}

const Section: React.FC<SectionProps> = ({
  label,
  color,
  children,
  sticky,
  stickyOffset = 0
}) => (
  <Box mb={5}>
    {label && (
      <Heading
        as="h4"
        size="sm"
        mb={2}
        pb={1}
        color={color}
        letterSpacing={0.5}
        position={sticky ? "sticky" : undefined}
        top={sticky ? stickyOffset : undefined}
        bg={sticky ? "chakra-body-bg" : undefined}
        zIndex={sticky ? 1 : undefined}
        px={sticky ? 2 : undefined}
      >
        {label}
      </Heading>
    )}
    {children}
  </Box>
);


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
              <Box
                bg={traitBoxColor}
                borderRadius={8}
                mb={4}
                p={2}
                border="1px solid"
                borderColor={cardBorder}
                boxShadow="sm"
              >
                <Badge colorScheme="green" fontSize="0.85em" mr={2}>
                  {t.title}
                </Badge>
                <Text as="span" color={descColor}>
                  {t.description}
                </Text>
              </Box>
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
              <Box
                bg={flawBoxColor}
                borderRadius={8}
                mb={4}
                p={2}
                border="1px solid"
                borderColor={cardBorder}
                boxShadow="sm"
              >
                <Badge colorScheme="orange" fontSize="0.85em" mr={2}>
                  {f.title}
                </Badge>
                <Text as="span" color={descColor}>
                  {f.description}
                </Text>
              </Box>
            </ListItem>
          ))}
        </List>
      </Section>
    </Box>
  );
};

export default NationView;
