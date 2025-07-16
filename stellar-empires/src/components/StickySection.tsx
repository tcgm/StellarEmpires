import { Box, Heading } from "@chakra-ui/react";

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

export default Section;