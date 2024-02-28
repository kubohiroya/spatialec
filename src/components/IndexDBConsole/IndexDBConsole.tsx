import React, { useCallback } from "react";
import { Box, Button } from "@mui/material";
import { Projects } from '/app/services/database/Projects';
import { Resources } from '/app/services/database/Resources';

export const IndexDBConsole = ({ resource }: { resource: Resources }) => {
  const handleDelete = useCallback(() => {
    resource.countries.clear();
    resource.regions1.clear();
    resource.regions2.clear();
    resource.points.clear();
  }, []);
  return (
    <Box>
      <Button variant="outlined" onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  );
};
