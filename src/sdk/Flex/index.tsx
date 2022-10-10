import { Grid, GridProps } from '@mui/material';

export const Flex = (props: GridProps) => {
  return <Grid {...props} display="flex" container />;
};

export const FlexItem = (props: GridProps) => {
  return <Grid {...props} display="flex" item />;
};
