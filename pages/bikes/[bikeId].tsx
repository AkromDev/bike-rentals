import { Badge, Card, CardSection, Container, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { RentForm } from 'src/components/RentForm';
import bikesJson from 'src/data/bikes.json';
import Star from '../../public/star.svg';

function Bike() {
  const router = useRouter();
  const {
    query: { bikeId },
  } = router;
  const bike = bikeId && bikesJson.data.find((b) => String(b.id) === bikeId);
  if (!bike) {
    return (
      <Container>
        <Title sx={{ fontSize: 30, fontWeight: 600 }} align="center" mt={50}>
          <Text inherit component="span">
            This bike does not exist
          </Text>
        </Title>
      </Container>
    );
  }
  return (
    <Container sx={{ maxWidth: 1000, paddingBottom: 50 }}>
      <Title sx={{ fontSize: 50, fontWeight: 900 }} align="center" mt={50}>
        Rent the bike
      </Title>
      <Group
        sx={{
          marginTop: 50,
          alignItems: 'stretch',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            maxWidth: 500,
            marginInline: 'auto',
          },
        }}
      >
        <Card sx={{ flex: 1 }} shadow="xl">
          <Group>
            <Title>{bike.title}</Title>
          </Group>
          <Group mb={15} mt={10}>
            <Group align="center" spacing={5}>
              <Star style={{ height: 25 }} />
              <Text weight="bold" sx={{ lineHeight: '25px' }}>
                {bike.rating}
              </Text>
            </Group>
            <Badge color="cyan" variant="light">
              {bike.model}
            </Badge>
            <Badge color="pink" variant="light">
              {bike.color}
            </Badge>
          </Group>
          <CardSection>
            <Image
              src={bike.img}
              layout="responsive"
              width={500}
              height={400}
              objectFit="cover"
              quality={100}
            />
          </CardSection>
        </Card>
        <RentForm />
      </Group>
    </Container>
  );
}

export default Bike;
