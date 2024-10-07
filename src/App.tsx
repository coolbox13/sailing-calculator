// src/App.tsx

import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import SailingCalculator from './components/SailingCalculator';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <SailingCalculator />
      </Container>
    </>
  );
};

export default App;
