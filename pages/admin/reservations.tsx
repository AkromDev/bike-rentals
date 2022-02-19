import { Container } from '@mantine/core';
import React, { ReactNode } from 'react';
import AdminLayout from 'src/components/layout/admin-layout';
import UsersTable from 'src/components/Users/Users';
import withAuthorizationSSR from 'utils/withAuthorizationSSR';

export default function Users() {
  return (
    <Container>
      <UsersTable />
    </Container>
  );
}

export const getServerSideProps = withAuthorizationSSR();
Users.getLayout = function getLayout(page: ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};
