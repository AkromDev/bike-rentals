import React from 'react';
import { Box, ThemeIcon, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import useStyles from './NavbarMainLink.styles';

interface NavbarMainLinkProps {
  className?: string;
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: string;
  onClick(): void;
}

export default function NavbarMainLink({
  to,
  className,
  icon,
  children,
  color,
  onClick,
}: NavbarMainLinkProps) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  return (
    <Link href={to}>
      <Box
        component="a"
        className={cx(classes.mainLink, className)}
        onClick={onClick}
        // activeClassName={classes.active}
      >
        <ThemeIcon size={30} style={{ backgroundColor: color, color: theme.white }} radius="lg">
          {icon}
        </ThemeIcon>
        <div className={classes.body}>{children}</div>
      </Box>
    </Link>
  );
}
