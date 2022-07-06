import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import FileUploader from "~FileUploader";

const Footer = (): any => {
  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction
        label="Minio dashboard"
        href="http://localhost:9001"
        target="_blank"
      />
    </BottomNavigation>
  );
};

const App = (): any => {
  return (
    <Box>
      <Typography variant="h2">Upload file</Typography>
      <FileUploader />
      <Footer />
    </Box>
  );
};

export default App;
