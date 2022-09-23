import { extendTheme, ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
}

// const fonts = { mono: `'Menlo', monospace` }

// const breakpoints = {
//   sm: "40em",
//   md: "52em",
//   lg: "64em",
//   xl: "80em",
// }

const theme = extendTheme({
  // colors: {
  //   black: "#16161D",
  // },
  // fonts,
  // breakpoints,
  config,
})

export default theme
