import React from "react";
import { Box, Heading, Text, Divider, List, ListItem, Badge } from "@chakra-ui/react";
import { NationData } from "../types";

interface Props {
  data: NationData;
}

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Box mb={5}>
    <Heading as="h4" size="sm" mb={2} color="gray.700" letterSpacing={0.5}>
      {label}
    </Heading>
    {children}
  </Box>
);

const NationView: React.FC<Props> = ({ data }) => (
  <Box>
    <Heading as="h2" size="lg" mb={4} color="blue.800" letterSpacing={-0.5}>
      {data.nation}
    </Heading>
    <Divider mb={4} />
    <Section label="Traits">
      <List spacing={3}>
        {data.traits.map((t, i) => (
          <ListItem key={t.title + i}>
            <Badge colorScheme="blue" fontSize="0.85em" mr={2}>
              {t.title}
            </Badge>
            <Text as="span">{t.description}</Text>
          </ListItem>
        ))}
      </List>
    </Section>
    <Section label="Flaws">
      <List spacing={3}>
        {data.flaws.map((f, i) => (
          <ListItem key={f.title + i}>
            <Badge colorScheme="orange" fontSize="0.85em" mr={2}>
              {f.title}
            </Badge>
            <Text as="span">{f.description}</Text>
          </ListItem>
        ))}
      </List>
    </Section>
  </Box>
);

export default NationView;
