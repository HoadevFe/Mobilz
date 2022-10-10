import StyledEngineProvider from '@mui/material/StyledEngineProvider'

export const ThemeProvider = (props: { children: JSX.Element }) => {
  return <StyledEngineProvider injectFirst>{props.children}</StyledEngineProvider>
}
