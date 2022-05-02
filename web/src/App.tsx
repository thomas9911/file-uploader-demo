import { Box, Typography } from "@mui/material";
import React from "react";
import FileUploader from "~FileUploader";

const App = (): any => {
  return (
    <Box>
      <Typography variant="h2">Upload file</Typography>
      <FileUploader />
    </Box>
  );
};

export default App;
