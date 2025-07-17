import { Box, Heading } from "@chakra-ui/react";

interface SectionProps {
  label?: string | React.ReactNode;
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
  <Box mb={0}>
    {label && (
      <Heading
        as="h4"
        size="sm"
        mb={0}
        pb={1}
        color={color}
        letterSpacing={0.5}
        position={sticky ? "sticky" : undefined}
        top={sticky ? stickyOffset : undefined}
        bg={sticky ? "chakra-body-bg" : undefined}
        zIndex={sticky ? 1 : undefined}
        px={sticky ? 2 : undefined}
        verticalAlign={"center"}
      >
        {label}
      </Heading>
    )}
    {children}
  </Box>
);

export default Section;