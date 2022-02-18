import { createStyles, Group, Text, ThemeIcon } from '@mantine/core';
import { ChecklistIcon, HomeIcon, PeopleIcon, PersonIcon } from '@primer/octicons-react';
import Link from 'next/link';
import React from 'react';

interface AdminLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

const useStyles = createStyles((theme) => ({
  link: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    textDecoration: 'none',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

function AdminLink({ icon, color, label, link }: AdminLinkProps) {
  const { classes } = useStyles();

  return (
    <Link href={link}>
      <a className={classes.link}>
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </a>
    </Link>
  );
}

const data = [
  { icon: <ChecklistIcon />, color: 'violet', link: '/admin/reservations', label: 'Reservations' },
  { icon: <PersonIcon />, color: 'violet', link: '/admin/users', label: 'Users' },
  { icon: <PeopleIcon />, color: 'violet', link: '/admin/managers', label: 'Managers' },
  { icon: <HomeIcon />, color: 'violet', link: '/bikes', label: 'Home' },
];

export default function AdminLinks() {
  const links = data.map((link) => <AdminLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
