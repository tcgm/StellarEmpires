import React from "react";
import { HStack, Button } from "@chakra-ui/react";

interface DesignerControlsProps {
  onReset: () => void;
  onLoad: () => void;
  onClear: () => void;
  onCopy: () => void;
  onImport: () => void;
}

const DesignerControls: React.FC<DesignerControlsProps> = ({
  onReset, onLoad, onClear, onCopy, onImport
}) => (
  <HStack spacing={2}>
    <Button onClick={onReset}>Reset</Button>
    <Button onClick={onLoad}>Load Saved</Button>
    <Button onClick={onClear}>Clear Saved</Button>
    <Button onClick={onCopy}>Copy JSON</Button>
    <Button onClick={onImport}>Import JSON</Button>
  </HStack>
);

export default DesignerControls;
