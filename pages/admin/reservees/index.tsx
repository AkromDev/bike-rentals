import { Container } from '@mantine/core';
import React, { ReactNode } from 'react';
import AdminLayout from 'src/components/layout/admin-layout';
import ReserveesTable from 'src/templates/reservers/Reservees';
import { withAuthorizationSSR } from 'utils';

export default function Reservees() {
  return (
    <Container>
      <ReserveesTable />
    </Container>
  );
}

export const getServerSideProps = withAuthorizationSSR();

Reservees.getLayout = function getLayout(page: ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};
