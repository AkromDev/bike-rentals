import { Container, Space, Text, Title } from '@mantine/core';
import { ReactNode } from 'react';
import BikeFilters from 'src/components/BikeFilters';
import BikesList from 'src/components/BikesList';
import MainLayout from 'src/components/layout/main-layout';
import bikesJson from 'src/data/bikes.json';

export default function Bikes() {
  return (
    <Container sx={{ paddingBottom: 100 }}>
      <Title sx={{ fontSize: 100, fontWeight: 900, letterSpacing: -2 }} align="center" mt={100}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'pink', to: 'cyan', deg: 45 }}
        >
          Bike
        </Text>{' '}
        Rental
      </Title>
      <Space h="md" />
      <BikeFilters />
      <BikesList bikes={bikesJson.data} />
    </Container>
  );
}

Bikes.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
