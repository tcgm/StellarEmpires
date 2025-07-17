import React from "react";
import { Box, Text } from "@chakra-ui/react";

/**
 * Displays a list of requirements, joined with AND/OR if applicable.
 * 
 * @param requires List of requirement strings.
 * @param requireMode "AND" or "OR" for joining multiple requirements.
 * @param showRequires If false, nothing is rendered.
 */
export function RequiresDisplay({
  requires,
  requireMode,
  showRequires = true,
}: {
  requires?: string[];
  requireMode?: "AND" | "OR";
  showRequires?: boolean;
}) {
  // Remove empty or whitespace requirements
  const validRequires = (requires ?? []).filter(
    (r) => r && r.trim() !== ""
  );

  if (!showRequires || validRequires.length === 0) return null;

  // Single or multiple requirements
  let content: React.ReactNode;
  if (validRequires.length > 1 && requireMode) {
    content = validRequires.reduce((acc, el, idx) => {
      if (idx === 0) return [el];
      return [
        ...acc,
        <span key={`joinword-${idx}`} style={{ margin: "0 0.25em", fontWeight: 600 }}>
          {requireMode}
        </span>,
        el,
      ];
    }, [] as React.ReactNode[]);
  } else {
    content = validRequires.join(", ");
  }

  return (
    <Box mt={2}>
      <Text fontSize="sm" color="gray.500">
        Requires: {content}
      </Text>
    </Box>
  );
}
