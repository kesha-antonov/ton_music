import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {MainListItems, SecondaryListItems} from './list-items';
import {getTag, getTopChartTracks} from "./requests";
import {parseTracks} from "./tools";
import {Card, CardActionArea, CardContent, CardMedia} from "@mui/material";
import AppContext from "../app-context";
import PlayerWrapper from "./player-wrapper";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const Loading = styled(Container)(
    ({theme}) => ({
        zIndex: theme.zIndex.modal,
        backdropFilter: 'blur(2px)',
        height: '100%',
        width: '100%',
        position: 'absolute',
    })
)

const mdTheme = createTheme();

function DashboardContent({list, fetching, onGetTag, onSelectTrack}) {
    const [open, setOpen] = React.useState(true);
    const [tagSelected, setTagSelected] = React.useState('');
    const [mainSelected, setMainSelected] = React.useState('home');
    const [selectedTrack, setSelectedTrack] = React.useState(null);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleTagOnClick = (value) => {
        setMainSelected('');
        setTagSelected(value);
        setSelectedTrack(null);
        onGetTag(value);
    };

    const handleMainOnClick = (value) => {
        setMainSelected(value);
        setTagSelected('');
        setSelectedTrack(null);
    }

    const cards = useMemo(() => {
        return list.map((item, index) => {
            return <Grid item key={index}>
                <Card variant="outlined" sx={{width: 235}} onClick={() => setSelectedTrack(item)}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image={item.imageUrl}
                            alt={item.name}
                        />
                        <CardContent>
                            <Typography noWrap gutterBottom variant="h6" component="div">
                                {item.name}
                            </Typography>
                            <Typography noWrap gutterBottom variant="body2" color="text.secondary">
                                {item.artistName}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        })
    }, [list])

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            TON Music
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <List component="nav">
                        <MainListItems selected={mainSelected} onClick={handleMainOnClick}/>
                        <Divider sx={{my: 1}}/>
                        <SecondaryListItems selected={tagSelected} onClick={handleTagOnClick}/>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    {selectedTrack ?
                        <PlayerWrapper track={selectedTrack}/> :
                        <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                            {fetching && <Loading/>}
                            <Grid container spacing={{xs: 2, md: 4}} columns={{xs: 8, sm: 12, md: 16}}>
                                {cards}
                            </Grid>
                            <Copyright sx={{pt: 4}}/>
                        </Container>
                    }
                </Box>
            </Box>
        </ThemeProvider>
    );
}


export default function Dashboard() {
    const [fetching, setFetching] = useState(false);
    const [list, setList] = useState([]);

    const {token} = useContext(AppContext)

    useEffect(() => {
        if (!token) return;

        setFetching(true);

        getTopChartTracks(token)
            .then((values) => {
                setList(parseTracks(values));
                setFetching(false);
            })
            .catch(() => {
                setList([]);
                setFetching(false);
            })
    }, [token])

    const handleGetTags = (tag) => {
        if (!token) return;

        setFetching(true);

        getTag(tag, token)
            .then((values) => {
                setList(parseTracks(values));
                setFetching(false);
            })
            .catch(() => {
                setList([]);
                setFetching(false);
            })
    }

    return <DashboardContent
        list={list}
        fetching={fetching}
        onGetTag={handleGetTags}
    />
}