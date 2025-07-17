import React from "react";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";
import TraitBox from "../TraitBox";
import { NationDesign } from "../../types";

// You may want to add props for trait lookup if you want to show descriptions as well.
const DesignSummary: React.FC<{ design: NationDesign }> = ({ design }) => (
  <Box className="designSummary" borderWidth={1} borderRadius="md" p={2} mb={1} boxShadow="md" bg="gray.600" maxH={"50vh"} overflowY={"auto"}>
    {/* <Heading size="sm" mb={3}>Summary</Heading> */}
    <VStack align="start" spacing={1}>
      <Text><b>Nation Name:</b> {design.nationName || "—"}</Text>
      <Text><b>Type:</b> {design.nationType || "—"}</Text>
      <Text><b>Scale:</b> {design.scale || "—"}</Text>
      <Text fontWeight="bold" mt={2}>Traits & Flaws</Text>
      <Text fontSize="sm"><b>Common Traits:</b> {design.selectedCommonTraits.join(", ") || "—"}</Text>
      <Text fontSize="sm"><b>Common Flaws:</b> {design.selectedCommonFlaws.join(", ") || "—"}</Text>
      <Text fontSize="sm"><b>Nation Traits:</b> {design.selectedNationTraits.join(", ") || "—"}</Text>
      <Text fontSize="sm"><b>Nation Flaws:</b> {design.selectedNationFlaws.join(", ") || "—"}</Text>
      <Text fontSize="sm"><b>Foreign Traits:</b> {design.selectedForeignTraits.join(", ") || "—"}</Text>
      <Text fontSize="sm"><b>Custom Trait:</b> {
        design.customTrait?.title
          ? `${design.customTrait.title}: ${design.customTrait.description}`
          : "None"
      }</Text>
    </VStack>
  </Box>
);

export default DesignSummary;
