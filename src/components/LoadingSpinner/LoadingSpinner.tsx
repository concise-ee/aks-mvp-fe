import React from 'react';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')({
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
  overflowY: 'auto',
  height: '100%',
  minHeight: '100px',
});

const LoadingSpinner = () => (
  <StyledDiv>
    <CircularProgress />
  </StyledDiv>
);
export default LoadingSpinner;
