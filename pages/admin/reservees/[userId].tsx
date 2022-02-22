import { Container } from '@mantine/core';
import React, { ReactNode } from 'react';
import AdminLayout from 'src/components/layout/admin-layout';
import ReserveeReservations from 'src/templates/reservers/ReserveeReservations';
import { withAuthorizationSSR } from 'utils';

export default function Reservees() {
  return (
    <Container>
      <ReserveeReservations />
    </Container>
  );
}

export const getServerSideProps = withAuthorizationSSR();

Reservees.getLayout = function getLayout(page: ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};
