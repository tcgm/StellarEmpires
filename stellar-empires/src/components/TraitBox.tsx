import React from "react";
import { Box, Badge, Text, Flex, Link } from "@chakra-ui/react";

interface TraitBoxProps {
  index?: number;
  title: string;
  description: string;
  points?: number;
  showPointsBadge?: boolean; // Show 'Points' badge
  isTrait?: boolean; // true = Trait, false = Flaw; undefined = no badge
  colorScheme?: "green" | "orange" | string; // override
  showTypeBadge?: boolean; // Show 'Trait'/'Flaw' badge
  titleColor?: string;
  descColor?: string;
  boxBg?: string;
  boxBorder?: string;
  nations?: string[];
  getNationDisplayName?: (name: string) => string;
  goToNation?: (name: string) => void;
  mb?: number | string;
  p?: number | string;
  children?: React.ReactNode; // for rare advanced use
}

const TraitBox: React.FC<TraitBoxProps> = ({
  index,
  title,
  description,
  points,
  showPointsBadge = true,
  isTrait,
  colorScheme,
  showTypeBadge = false,
  titleColor = "inherit",
  descColor = "inherit",
  boxBg,
  boxBorder,
  nations,
  getNationDisplayName,
  goToNation,
  mb = 4,
  p = 4,
  children,
}) => (
  <Box
    className="traitBox"
    bg={boxBg}
    borderRadius={8}
    mb={mb}
    p={p}
    border="1px solid"
    borderColor={boxBorder}
    boxShadow="sm"
  >
    <Flex align="center" mb={2} wrap="wrap" gap={2}>
      {showTypeBadge && (
        <Badge colorScheme={colorScheme || (isTrait ? "green" : "orange")} fontSize="0.85em">
          {isTrait ? "Trait" : "Flaw"}
        </Badge>
      )}
      <Badge colorScheme={colorScheme || (isTrait ? "green" : "orange")} fontSize="0.85em" mr={2}>
        <Text className="traitName" fontWeight={700} fontSize="lg" color={titleColor}>
          {title}
        </Text>
      </Badge>
      {(showPointsBadge && points) && (
        <Badge colorScheme={colorScheme || (isTrait ? "green" : "orange")} fontSize="0.85em">
            {points}
        </Badge>
      )}
      {/* Optional: nation links */}
      {nations && nations.length > 0 && getNationDisplayName && goToNation && (
        <Flex gap={1} align="center">
          <Text fontSize="sm" color="gray.400" as="span">
            from
          </Text>
          {nations.map((nation, ni, arr) => (
            <Link
              key={"nationLink" + nation + ni}
              onClick={() => goToNation(nation)}
              _hover={{ textDecoration: "underline", color: "blue.100" }}
              mr={ni < arr.length - 1 ? 1 : 0}
            >
              {getNationDisplayName(nation)}
            </Link>
          ))}
        </Flex>
      )}
      {children}
    </Flex>
    <Text className="traitText" mt={2} color={descColor} whiteSpace="pre-line">
      {description}
    </Text>
  </Box>
);

export default TraitBox;
