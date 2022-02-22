import { Container, Space, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';
import MainLayout from 'src/components/layout/main-layout';
import RatingStar from 'src/components/RatingStar';
import { getBikes } from 'src/firebase/getBikes';
import { getFilters } from 'src/firebase/getFilters';
import BikeFilters from 'src/templates/BikeFilters';
import BikesList from 'src/templates/BikesList';

export default function Bikes({ bikes = [], filters = {}, initial, invalid }) {
  return (
    <Container sx={{ paddingBottom: 100 }}>
      <Title sx={{ fontSize: 60, fontWeight: 900, letterSpacing: -2 }} align="center" mt={100}>
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
        filters={filters}
        bikesLength={bikes?.length}
        initial={initial}
        invalid={invalid}
      />
      <BikesList bikes={bikes} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { location, color, model, start, end } = query;

  const filters = await getFilters();

  if (!start && !end) {
    return {
      props: {
        initial: true,
        filters,
      },
    };
  }
  if (!dayjs(start).isValid() || !dayjs(end).isValid()) {
    return {
      props: {
        invalid: true,
        filters,
      },
    };
  }
  const data = await getBikes({ location, color, model, start, end });
  return {
    props: {
      bikes: data.bikes,
      filters,
    },
  };
};

Bikes.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
