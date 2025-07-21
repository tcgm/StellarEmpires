import React from "react";
import { HStack, Button, Tooltip, Box } from "@chakra-ui/react";
import { FiLoader, FiSave } from "react-icons/fi";
import { LuImport } from "react-icons/lu";
import { FaPaste, FaRegCopy, FaTrash } from "react-icons/fa";
import { MdOutlineRecycling } from "react-icons/md";

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
  <Box className="designerControls" justifyContent={"center"}>
    <HStack spacing={2} justifyContent={"center"}>
      <Tooltip label="Reset">
        <Button onClick={onReset} aria-label="Reset" variant="solid" px={3}>
          <MdOutlineRecycling color="lime"/>
        </Button>
      </Tooltip>
      <Tooltip label="Load Saved">
        <Button onClick={onLoad} aria-label="Load Saved" variant="solid" px={3}>
          <FiLoader color="lightGray"/>
        </Button>
      </Tooltip>
      <Tooltip label="Clear Saved">
        <Button onClick={onClear} aria-label="Clear Saved" variant="solid" px={3}>
          <FaTrash color="brown"/>
        </Button>
      </Tooltip>
      <Tooltip label="Copy JSON">
        <Button onClick={onCopy} aria-label="Copy JSON" variant="solid" px={3}>
          <FaRegCopy color="yellow"/>
        </Button>
      </Tooltip>
      <Tooltip label="Import JSON">
        <Button onClick={onImport} aria-label="Import JSON" variant="solid" px={3}>
          <LuImport color="lightblue"/>
        </Button>
      </Tooltip>
    </HStack>
  </Box>
);

export default DesignerControls;
