import { Container } from '@mantine/core';
import React, { ReactNode } from 'react';
import AdminLayout from 'src/components/layout/admin-layout';
import BikesTable from 'src/templates/bikes/BikesTable';
import { withAuthorizationSSR } from 'utils';

export default function Users() {
  return (
    <Container>
      <BikesTable />
    </Container>
  );
}

export const getServerSideProps = withAuthorizationSSR();

Users.getLayout = function getLayout(page: ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};
