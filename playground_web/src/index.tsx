import React from "react";
import { Container } from "@mui/material";
import { createRoot } from "react-dom/client";
import App from "~/App";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Container maxWidth="lg">
    <App />
  </Container>
);
