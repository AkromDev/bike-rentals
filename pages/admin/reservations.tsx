import { Title } from '@mantine/core';
import React, { ReactNode } from 'react';
import AdminLayout from 'src/components/layout/admin-layout';

export default function Users() {
  return (
    <div>
      <Title>Reservations</Title>
    </div>
  );
}

Users.getLayout = function getLayout(page: ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};
