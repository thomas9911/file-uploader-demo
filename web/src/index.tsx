import { Container } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/App";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
<Container maxWidth="sm"><App /></Container>
);
