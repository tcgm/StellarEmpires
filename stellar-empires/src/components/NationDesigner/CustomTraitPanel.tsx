import React from "react";
import { Input, Textarea, Button, HStack, Text } from "@chakra-ui/react";
import { TraitOrFlaw } from "../../types";

interface CustomTraitPanelProps {
  trait: TraitOrFlaw | null;
  onTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDesc: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
}
const CustomTraitPanel: React.FC<CustomTraitPanelProps> = ({
  trait, onTitle, onDesc, onClear
}) => (
  <div>
    <Text fontWeight="bold">Custom Trait</Text>
    <HStack align="start" spacing={3}>
      <Input
        placeholder="Trait Title"
        value={trait?.title || ""}
        onChange={onTitle}
        width="200px"
      />
      <Textarea
        placeholder="Trait Description"
        value={trait?.description || ""}
        onChange={onDesc}
        width="400px"
        rows={2}
      />
      <Button onClick={onClear}>Clear</Button>
    </HStack>
  </div>
);

export default CustomTraitPanel;
