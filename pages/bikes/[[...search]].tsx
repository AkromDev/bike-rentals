import { Container, Space, Text, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';
import MainLayout from 'src/components/layout/main-layout';
import { getBikes } from 'src/firebase/getBikes';
import BikeFilters from 'src/templates/BikeFilters';
import BikesList from 'src/templates/BikesList';

export default function Bikes({ data = {} }) {
  const { bikes, filters } = data || {};

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
      <BikeFilters
        models={filters?.models}
        locations={filters?.locations}
        colors={filters?.colors}
        bikesLength={bikes?.length}
      />
      <BikesList bikes={bikes} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { host } = context.req.headers;
  const { location, color, model } = query;
  const data = await getBikes({ location, color, model });

  return {
    props: {
      data,
      host,
    }, // will be passed to the page component as props
  };
};

Bikes.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
