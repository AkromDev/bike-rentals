import React from 'react';
import { ScrollArea, DEFAULT_THEME } from '@mantine/core';
import { HomeIcon, DashboardIcon, PersonIcon } from '@modulz/radix-icons';
import { SignInIcon } from '@primer/octicons-react';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import NavbarMainLink from './NavbarMainLink';
import useStyles from './Navbar.styles';

const loggedinUsers = [
  {
    to: '/',
    label: 'Home',
    theme: DEFAULT_THEME.colors.blue[6],
    icon: HomeIcon,
  },
  {
    to: '/profile',
    label: 'Profile',
    theme: DEFAULT_THEME.colors.blue[6],
    icon: PersonIcon,
  },
];

const unLoggedUsers = [
  {
    to: '/',
    label: 'Home',
    theme: DEFAULT_THEME.colors.blue[6],
    icon: HomeIcon,
  },
  {
    to: '/auth',
    label: 'Register',
    theme: DEFAULT_THEME.colors.blue[6],
    icon: SignInIcon,
  },
];

const adminLinks = [
  ...loggedinUsers,
  {
    to: '/admin',
    label: 'Admin',
    theme: DEFAULT_THEME.colors.violet[6],
    icon: DashboardIcon,
  },
];

function getLinks(user) {
  if (!user) {
    return unLoggedUsers;
  }
  if (user.claims.role === 'Manager') {
    return adminLinks;
  }

  return loggedinUsers;
}
interface NavbarProps {
  opened: boolean;
  onClose(): void;
}

function Navbar({ opened, onClose }: NavbarProps) {
  const { classes, cx } = useStyles();
  const authUser = useAuthUser();
  const links = getLinks(authUser);

  const main = links.map((item) => (
    <NavbarMainLink
      key={item.to}
      to={item.to}
      color={item.theme}
      icon={<item.icon style={{ height: 18, width: 18 }} />}
      onClick={onClose}
    >
      {item.label}
    </NavbarMainLink>
  ));

  return (
    <nav className={cx(classes.navbar, { [classes.opened]: opened })}>
      <ScrollArea style={{ height: '100vh' }} type="scroll">
        <div className={classes.body}>{main}</div>
      </ScrollArea>
    </nav>
  );
}

export default withAuthUser<any>()(Navbar);
