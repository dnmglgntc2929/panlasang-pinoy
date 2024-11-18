import { useState } from 'react'
import './App.css'

import Routing from './routes/Routing'

import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: "#0C0C0C",
      contrastText: "#FFF455",
    },
    secondary: {
      main: "#FFF455",
      contrastText: "#0C0C0C",
    },
    background: {
      default: "#e4f0e2",
      paper: "#FFF455",
    },

    
  },

  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    
  },
});


function App() {
 

  return (  
    <div className='App'>

      <ThemeProvider theme={theme}>
        <Routing />
      </ThemeProvider>
     
    </div>
  )
}

export default App
