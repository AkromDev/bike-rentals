import React, { ReactNode, useEffect, useState } from 'react';
import { AppShell, Navbar, Header, Text, MediaQuery, Burger, useMantineTheme } from '@mantine/core';
import Head from 'src/components/Head/Head';
import { useRouter } from 'next/router';
import AdminLinks from './AdminLinks';
import Admin from './Admin';

type AdminLayout = {
  children: ReactNode;
};
export default function AdminLayout({ children }: AdminLayout) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setOpened(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head title="Admin Dashboard" />
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        fixed
        navbar={
          <Navbar padding="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 240, lg: 300 }}>
            <Navbar.Section grow mt="xs">
              <AdminLinks />
            </Navbar.Section>
            <Navbar.Section>
              <Admin />
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={70} padding="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>Admin Dashboard</Text>
            </div>
          </Header>
        }
      >
        {children}
      </AppShell>
    </>
  );
}
