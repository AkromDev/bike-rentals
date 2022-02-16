import { Container, Space, Text, Title } from '@mantine/core';
import BikesList from '../src/components/BikesList';
import bikesJson from '../src/data/bikes.json';

export default function HomePage() {
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
      <BikesList bikes={bikesJson.data} />
    </Container>
  );
}
