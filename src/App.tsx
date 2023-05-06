import React, { Suspense, useContext, useEffect } from 'react'

import { ThemeContext } from './features/ThemeContext'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { SpinnerCircular } from 'spinners-react'

import Footer from './layout/Footer'
import Header from './layout/Header'
import { CssBaseline } from '@mui/material'

import { Box, Container, Typography } from '@mui/material'
import { ArrowRightAlt } from '@mui/icons-material'
import { Theme } from '@mui/material/styles'

const light = createTheme({
    palette: {
      mode: 'light',
    },
  }),
  dark = createTheme({
    palette: {
      mode: 'dark',
    },
  })

const App = () => {
  const theme = useContext(ThemeContext)
  const darkMode = theme.state.darkMode

  interface Quote {
    quoteText: ''
    quoteAuthor: ''
    quoteGenre: ''
  }
  const [quotes, setQuotes] = React.useState<Quote[]>([])

  useEffect(() => {
    if (quotes.length === 0 && !author)
      fetch('https://quote-garden.onrender.com/api/v3/quotes/random')
        .then((res) => res.json())
        .then((json) => {
          setQuotes(json.data)
        })
  }, [quotes])

  const [author, setAuthor] = React.useState<string | null>(null)

  useEffect(() => {
    if (author)
      fetch('https://quote-garden.onrender.com/api/v3/quotes/?author=' + author)
        .then((res) => res.json())
        .then((json) => {
          setQuotes(json.data)
        })
  }, [author])

  const clearQuotes = () => () => {
    setQuotes([])
    setAuthor(null)
  }

  const quoteList = (
    <>
      {author && (
        <Container maxWidth="sm" sx={{ paddingTop: '2em' }}>
          <Typography variant="h4" component="h2" gutterBottom paddingLeft={'50px'}>
            {author}
          </Typography>
        </Container>
      )}
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', flex: 1 }}>
        {quotes.map((quote) => (
          <Box paddingY={3} sx={{ width: '100%', typography: 'body1' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ borderLeft: '10px #F7DF94 solid' }}>
              <blockquote>
                <q>{quote.quoteText || ''}</q>
              </blockquote>
            </Typography>
            {quote.quoteAuthor !== author && (
              <Box
                m={'40px'}
                p={'10px'}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: (theme: Theme) => theme.palette.text.primary, color: (theme: Theme) => theme.palette.background.paper } }}
                onClick={() => {
                  setQuotes([])
                  setAuthor(quote.quoteAuthor)
                }}
              >
                <Box>
                  <Typography variant="h5" component="h3">
                    {quote.quoteAuthor}
                  </Typography>
                  <Typography variant="h6" component="h4">
                    {quote.quoteGenre}
                  </Typography>
                </Box>
                <ArrowRightAlt sx={{ color: (theme: Theme) => theme.palette.background.paper }} />
              </Box>
            )}
          </Box>
        ))}
        {quotes.length === 0 && <SpinnerCircular size={'30vh'} color={'grey'} secondaryColor={'transparent'} style={{ display: 'flex', margin: 'auto' }} />}
      </Container>
    </>
  )
  return (
    <ThemeProvider theme={darkMode ? dark : light}>
      <CssBaseline enableColorScheme />
      <Header getRandomQuote={clearQuotes} />
      <Suspense fallback={<SpinnerCircular size={'30vh'} color={'grey'} secondaryColor={'transparent'} style={{ display: 'flex', margin: 'auto' }} />}>{quoteList}</Suspense>
      <Footer />
    </ThemeProvider>
  )
}

export default App
