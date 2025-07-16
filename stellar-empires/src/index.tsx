import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import './index.css';
import chakraDarkTheme from "./themes/chakraDark";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    {/* OUTSIDE ChakraProvider! */}
    <ColorModeScript initialColorMode={chakraDarkTheme.config.initialColorMode} />
    <ChakraProvider theme={chakraDarkTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);