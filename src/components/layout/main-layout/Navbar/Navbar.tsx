import React from 'react';
import { ScrollArea, DEFAULT_THEME } from '@mantine/core';
import { HomeIcon, DashboardIcon } from '@modulz/radix-icons';
import NavbarMainLink from './NavbarMainLink';
import useStyles from './Navbar.styles';

const links = [
  {
    to: '/',
    label: 'Home',
    theme: DEFAULT_THEME.colors.blue[6],
    icon: HomeIcon,
  },
  {
    to: '/admin',
    label: 'Admin',
    theme: DEFAULT_THEME.colors.violet[6],
    icon: DashboardIcon,
  },
];

interface NavbarProps {
  opened: boolean;
  onClose(): void;
}

export default function Navbar({ opened, onClose }: NavbarProps) {
  const { classes, cx } = useStyles();

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
