import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

export const MainListItems = (props) => {

    const {onClick, selected} = props;

    return <>
        <ListItemButton onClick={() => onClick('home')} selected={selected === 'home'}>
            <ListItemIcon>
                <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => onClick('search')} selected={selected === 'search'}>
            <ListItemIcon>
                <SearchOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
        </ListItemButton>
        <ListItemButton onClick={() => onClick('library')} selected={selected === 'library'}>
            <ListItemIcon>
                <LibraryMusicOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Your library" />
        </ListItemButton>
    </>
};

export const SecondaryListItems = (props) => {

    const {onClick, selected} = props;

    return <>
        <ListSubheader component="div" inset>
            Tags
        </ListSubheader>
        <ListItemButton onClick={() => onClick('g.115')} selected={selected === 'g.115'}>
            <ListItemIcon>
                <FeaturedPlayListOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Pop" />
        </ListItemButton>
        <ListItemButton onClick={() => onClick('g.5')} selected={selected === 'g.5'}>
            <ListItemIcon>
                <FeaturedPlayListOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Rock" />
        </ListItemButton>
        <ListItemButton onClick={() => onClick('g.299')} selected={selected === 'g.299'}>
            <ListItemIcon>
                <FeaturedPlayListOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Jazz" />
        </ListItemButton>
    </>
};