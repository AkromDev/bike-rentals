import { useMediaQuery } from '@mantine/hooks';
import React, { useState } from 'react';
import Header from './Header/Header';
import useStyles from './Layout.styles';
import Navbar from './Navbar/Navbar';
import { NAVBAR_BREAKPOINT } from './Navbar/Navbar.styles';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const { classes, cx } = useStyles({ shouldRenderHeader: true });
  const [navbarOpened, setNavbarState] = useState(false);
  const renderNavbar = useMediaQuery(`(max-width: ${NAVBAR_BREAKPOINT}px)`);

  return (
    <div
      className={cx({
        [classes.withNavbar]: renderNavbar,
      })}
    >
      <Header navbarOpened={navbarOpened} toggleNavbar={() => setNavbarState((o) => !o)} />
      {renderNavbar && <Navbar opened={navbarOpened} onClose={() => setNavbarState(false)} />}

      <main className={classes.main}>
        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
