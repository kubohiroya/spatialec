import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const CircularProgressBox = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
      }}
    >
      <CircularProgress variant={'indeterminate'} size={100} />
    </Box>
  );
};
