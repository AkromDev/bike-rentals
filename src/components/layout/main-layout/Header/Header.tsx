import { Anchor, Burger, Container, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import React from 'react';
import { NAVBAR_BREAKPOINT } from '../Navbar/Navbar.styles';
import useStyles from './Header.styles';

interface HeaderProps {
  navbarOpened: boolean;
  toggleNavbar(): void;
}

export default function Header({ navbarOpened, toggleNavbar }: HeaderProps) {
  const { classes } = useStyles();
  const burgerTitle = navbarOpened ? 'Open navigation' : 'Hide navigation';
  const renderNavbar = useMediaQuery(`(max-width: ${NAVBAR_BREAKPOINT}px)`);

  return (
    <div className={classes.header}>
      <Container sx={{ flex: 1 }}>
        <div className={classes.mainSection}>
          <Burger
            opened={navbarOpened}
            className={classes.burger}
            size="sm"
            onClick={toggleNavbar}
            title={burgerTitle}
            aria-label={burgerTitle}
          />
        </div>
        {!renderNavbar && (
          <Group className={classes.links} spacing="xs">
            <Link href="/">
              <Anchor variant="text">Home</Anchor>
            </Link>
            <Link href="/admin/reservations">
              <Anchor variant="text">Admin</Anchor>
            </Link>
          </Group>
        )}
      </Container>
    </div>
  );
}
