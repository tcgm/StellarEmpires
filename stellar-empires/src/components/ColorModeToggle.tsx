import React from "react";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <IconButton
      size="md"
      variant="ghost"
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
    />
  );
};

export default ColorModeToggle;
