import React from "react";
import { HStack, Button, Tooltip, Box } from "@chakra-ui/react";

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
  <Box className="designerControls">
    <HStack spacing={2}>
      <Tooltip label="Reset">
        <Button onClick={onReset} aria-label="Reset" variant="solid" px={3}>
          ♻️
        </Button>
      </Tooltip>
      <Tooltip label="Load Saved">
        <Button onClick={onLoad} aria-label="Load Saved" variant="solid" px={3}>
          💾
        </Button>
      </Tooltip>
      <Tooltip label="Clear Saved">
        <Button onClick={onClear} aria-label="Clear Saved" variant="solid" px={3}>
          🗑️
        </Button>
      </Tooltip>
      <Tooltip label="Copy JSON">
        <Button onClick={onCopy} aria-label="Copy JSON" variant="solid" px={3}>
          📋
        </Button>
      </Tooltip>
      <Tooltip label="Import JSON">
        <Button onClick={onImport} aria-label="Import JSON" variant="solid" px={3}>
          ⬆️
        </Button>
      </Tooltip>
    </HStack>
  </Box>
);

export default DesignerControls;
