import React, { ReactNode, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  ButtonBase,
  ButtonBaseProps,
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CreateNewFolder, Folder, MenuOpen } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import theme from '../../../muiTheme';
import { EXISTING_OBJECTS, NEW_OBJECT } from '../../../configs/path-configs';

interface StyledDrawerProps extends DrawerProps {
  open?: boolean;
}

interface StyledButtonBaseProps extends ButtonBaseProps {
  open?: boolean;
}

interface MenuItem {
  label: string;
  key: string;
  icon: ReactNode;
  path: string;
}

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)<StyledDrawerProps>(({ open }) => ({
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : 0,
    flexShrink: 0,
    paddingTop: '64px',
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'space-between',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    '&::before': {
      backgroundColor: theme.palette.primary.main, // For Safari
    },
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '1.6em',
    },
    '&::-webkit-scrollbar-thumb:vertical': {
      border: '0.5em solid rgba(0, 0, 0, 0)',
      backgroundClip: 'padding-box',
      '-webkit-border-radius': '1em',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      '-webkit-box-shadow': 'inset 0 0 0 1px rgba(0, 0, 0, 0.025)',
    },
    '&::-webkit-scrollbar-corner': {
      display: 'none',
    },

    [theme.breakpoints.down('sm')]: {
      border: open ? 'inherit' : 'none',
    },
  },
  width: open ? drawerWidth : 0,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
  }),
}));

const StyledButtonBase = styled(ButtonBase)<StyledButtonBaseProps>(({ open }) => ({
  top: 80,
  backgroundColor: theme.palette.primary.dark,
  padding: '16px 8px',
  borderRadius: '0 4px 4px 0',
  fill: 'FFF',
  zIndex: 100,
  position: 'fixed',
  left: open ? drawerWidth : 0,
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const menuItems = [
  {
    label: 'Eksisteerivad objektid',
    key: 'existingObjects',
    path: EXISTING_OBJECTS,
    icon: <Folder sx={{ color: 'white' }} />,
  },
  {
    label: 'Lisa uus objekt',
    key: 'existingObjects',
    path: NEW_OBJECT,
    icon: <CreateNewFolder sx={{ color: 'white' }} />,
  },
];

const HeaderNavigationContainer = () => {
  const [open, setOpen] = useState<boolean>(false);

  const renderMenuItem = ({ label, key, path, icon }: MenuItem) => {
    const textWidth = drawerWidth - 56 - 32;
    return (
      <ListItemButton
        {...(path && { component: Link, to: path })}
        key={key}
        onClick={onToggle}
        sx={{
          height: '54px',
          [theme.breakpoints.up('sm')]: {
            paddingLeft: '24px',
          },
        }}
      >
        <ListItemIcon sx={{ width: 40, minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={label}
          sx={{
            color: '#FFF',
            overflow: 'hidden',
            minWidth: textWidth,
            width: textWidth,
          }}
        />
      </ListItemButton>
    );
  };

  const onToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledDrawer variant='permanent' open={open}>
        <List>{menuItems.map((item) => renderMenuItem(item))}</List>
      </StyledDrawer>
      <StyledButtonBase onClick={onToggle} open={open}>
        <MenuOpen
          sx={{
            fill: '#FFF',
            transition: '0.3s ease',
            transform: open ? 'matrix(-1, 0, 0, 1, 0, 0)' : 'inherit',
          }}
        />
      </StyledButtonBase>
    </>
  );
};

export default HeaderNavigationContainer;
