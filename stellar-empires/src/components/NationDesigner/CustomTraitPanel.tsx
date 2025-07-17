import React from "react";
import { Input, Textarea, Button, HStack, Text, Box } from "@chakra-ui/react";
import { TraitOrFlaw } from "../../types";

interface CustomTraitPanelProps {
  trait: TraitOrFlaw | null;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
}

const CustomTraitPanel: React.FC<CustomTraitPanelProps> = ({
  trait, onTitleChange, onDescChange, onClear
}) => (
  <Box mt={4}>
    <Text fontWeight="bold">Custom Trait</Text>
    <HStack align="start" spacing={3}>
      <Input
        placeholder="Trait Title"
        value={trait?.title || ""}
        onChange={onTitleChange}
        width="200px"
      />
      <Textarea
        placeholder="Trait Description"
        value={trait?.description || ""}
        onChange={onDescChange}
        width="400px"
        rows={2}
      />
      <Button onClick={onClear}>Clear</Button>
    </HStack>
  </Box>
);

export default CustomTraitPanel;
