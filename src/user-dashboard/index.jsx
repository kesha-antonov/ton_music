import React, { useContext, useEffect, useMemo, useState, useCallback, useLayoutEffect } from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { MainListItems, SecondaryListItems, SettignsListItems } from './list-items'
import { getTag, getTopChartTracks } from './requests'
import { parseTracks } from './tools'
import { Button, Card, CardActionArea, CardContent, CardMedia, InputAdornment, Switch, TextField } from '@mui/material'
import AppContext from '../app-context'
import PlayerWrapper from './player-wrapper'
import SettingsIcon from '@mui/icons-material/Settings'
import qr from '../assets/img/qr.png'
import payments from '../utils/payments'

function Copyright (props) {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'copyright © '}
      <Link color='inherit' underline='none' href='/'>
        music.ton
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      })
    }
  })
)

const Loading = styled(Container)(
  ({ theme }) => ({
    zIndex: theme.zIndex.modal,
    backdropFilter: 'blur(2px)',
    height: '100%',
    width: '100%',
    position: 'absolute'
  })
)

const mdTheme = createTheme()

function DashboardContent ({ list, fetching, onGetTag, onSelectTrack }) {
  const [open, setOpen] = React.useState(true)
  const [tagSelected, setTagSelected] = React.useState('')
  const [mainSelected, setMainSelected] = React.useState('home')
  const [isOpenSetting, setOpenSettings] = React.useState(false)
  const [selectedTrack, setSelectedTrack] = React.useState(null)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleTagOnClick = (value) => {
    setMainSelected('')
    setTagSelected(value)
    setSelectedTrack(null)
    onGetTag(value)
    setOpenSettings(false)
  }

  const handleMainOnClick = (value) => {
    setMainSelected(value)
    setTagSelected('')
    setSelectedTrack(null)
    setOpenSettings(false)
  }

  const cards = useMemo(() => {
    return list.map((item, index) => {
      return (
        <Grid item key={index}>
          <Card variant='outlined' sx={{ width: 235 }} onClick={() => setSelectedTrack(item)}>
            <CardActionArea>
              <CardMedia
                component='img'
                height='140'
                image={item.imageUrl}
                alt={item.name}
              />
              <CardContent>
                <Typography noWrap gutterBottom variant='h6' component='div'>
                  {item.name}
                </Typography>
                <Typography noWrap gutterBottom variant='body2' color='text.secondary'>
                  {item.artistName}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      )
    })
  }, [list])

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: '24px' // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1 }}
            >
              TON Music
            </Typography>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={() => setOpenSettings(true)} color='inherit'>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1]
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component='nav'>
            <MainListItems selected={mainSelected} onClick={handleMainOnClick} />
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems selected={tagSelected} onClick={handleTagOnClick} />
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto'
          }}
        >
          <Toolbar />
          {selectedTrack && !isOpenSetting
            ? <PlayerWrapper track={selectedTrack} />
            : <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
              {fetching && <Loading />}
              <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 8, sm: 12, md: 16 }}>
                {isOpenSetting ? <Settings setOpenSettings={setOpenSettings} /> : <>{cards}</>}
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default function Dashboard () {
  const [fetching, setFetching] = useState(false)
  const [list, setList] = useState([])

  const { token } = useContext(AppContext)

  useEffect(() => {
    if (!token) return

    setFetching(true)

    getTopChartTracks(token)
      .then((values) => {
        setList(parseTracks(values))
        setFetching(false)
      })
      .catch(() => {
        setList([])
        setFetching(false)
      })
  }, [token])

  const handleGetTags = (tag) => {
    if (!token) return

    setFetching(true)

    getTag(tag, token)
      .then((values) => {
        setList(parseTracks(values))
        setFetching(false)
      })
      .catch(() => {
        setList([])
        setFetching(false)
      })
  }

  return (
    <DashboardContent
      list={list}
      fetching={fetching}
      onGetTag={handleGetTags}
    />
  )
}

const Settings = (props) => {
  const { isPaymentsApiLoaded, funds, isFundsDepositing, isFundsWithdrawning, onSignOut } = useContext(AppContext)
  console.log('isPaymentsApiLoaded', isPaymentsApiLoaded)

  const [tonsToFund, setTonsToFund] = useState('')

  const initPayments = useCallback(async () => {
    await payments.init()
  }, [])

  const topUp = useCallback(async () => {
    await payments.depositFunds(tonsToFund)
    setTonsToFund('')
  }, [tonsToFund])

  useLayoutEffect(() => {
    initPayments()
  }, [])

  return (
    <Grid item>
      {
        isPaymentsApiLoaded ?
          (
            <Grid
              container
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
            >
              <Grid>
                <Typography style={style.head}>Settings</Typography>
                <Typography style={style.head2}>TOP-UP</Typography>
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-start'
                  alignItems='center'
                  sx={{ pt: 2 }}
                >
                  <Typography style={style.balance}>Balance:  {funds + ' TON'}</Typography>
                </Grid>
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-start'
                  alignItems='center'
                  sx={{ pt: 2 }}
                >
                  <TextField
                    id='outlined-basic' label='How many' variant='outlined'
                    onChange={e => setTonsToFund(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Typography>TON</Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-start'
                  alignItems='center'
                  sx={{ pt: 2 }}
                >
                  <Switch defaultChecked /><Typography>Auto top up same amount when use all the funds</Typography>
                </Grid>
                <Button sx={{ my: 2 }} variant='contained' disabled={!tonsToFund.length} onClick={topUp}>{isFundsDepositing ? 'Loading...' : 'Top up TONs'}</Button>
                {
                  Number(funds) > 0 && (
                    <Button sx={{ my: 2 }} variant='contained' onClick={() => payments.withdrawFunds()} style={{marginLeft: 30}}>{isFundsWithdrawning ? 'Loading...' : 'Withdrawn remaining TONs'}</Button>
                  )
                }
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-start'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    sx={{
                      height: 500,
                      width: 200,
                      maxHeight: { xs: 150, md: 150 },
                      maxWidth: { xs: 150, md: 150 }
                    }}
                    alt='The house from the offer.'
                    src={qr}
                  />
                  <Typography>Scan QR to pay amount 10 TON</Typography>
                </Grid>
                <Typography>*10 TON will be good for 1 month</Typography>
                <Typography style={style.head2}>Audio</Typography>
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-start'
                  alignItems='center'
                >
                  <Switch defaultChecked /><Typography>Hight Quality Audio (uses 2x TON)</Typography>
                </Grid>
                <Typography style={style.head2}>History of listening</Typography>
                <Typography>1. Kendrick Lamar - All The Stars (with SZA) 3:52</Typography>
                <Typography>2. XXXTENTACION - bad vibes forever          2:30</Typography>
                <Typography>3. The Silhouettes Project - Free Your Mind  4:11</Typography>
              </Grid>
            </Grid>
          ) : (
            <CircularProgress />
          )
      }
      <Grid style={{marginTop: 50}}>
        <Button onClick={() => onSignOut()} sx={{ my: 2 }} variant='contained'>Log Out</Button>
      </Grid>
    </Grid>
  )
}

const style = {
  head: {
    fontWeight: 800,
    fontSize: 20
  },
  head2: {
    fontWeight: 800,
    fontSize: 20,
    marginTop: '10px'
  },
  balance: {
    fontSize: 30
  }
}
