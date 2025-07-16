import React from "react";
import { Box, Heading, Text, Divider, List, ListItem, Badge, useColorModeValue } from "@chakra-ui/react";
import { NationData } from "../types";

interface SectionProps {
  label: string;
  color: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ label, color, children }) => (
  <Box mb={5}>
    <Heading as="h4" size="sm" mb={2} color={color} letterSpacing={0.5}>
      {label}
    </Heading>
    {children}
  </Box>
);

interface Props {
  data: NationData;
}

const NationView: React.FC<Props> = ({ data }) => {
  // Get all color mode values at the top level
  const sectionLabelColor = useColorModeValue("gray.700", "gray.200");
  const nationNameColor = useColorModeValue("blue.400", "blue.50");
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  const descColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4} color={nationNameColor} letterSpacing={-0.5}>
        {data.nation}
      </Heading>
      <Divider mb={4} borderColor={dividerColor} />
      <Section label="Traits" color={sectionLabelColor}>
        <List spacing={3}>
          {data.traits.map((t, i) => (
            <ListItem key={t.title + i}>
              <Badge colorScheme="green" fontSize="0.85em" mr={2}>
                {t.title}
              </Badge>
              <Text as="span" color={descColor}>{t.description}</Text>
            </ListItem>
          ))}
        </List>
      </Section>
      <Section label="Flaws" color={sectionLabelColor}>
        <List spacing={3}>
          {data.flaws.map((f, i) => (
            <ListItem key={f.title + i}>
              <Badge colorScheme="orange" fontSize="0.85em" mr={2}>
                {f.title}
              </Badge>
              <Text as="span" color={descColor}>{f.description}</Text>
            </ListItem>
          ))}
        </List>
      </Section>
    </Box>
  );
};

export default NationView;
