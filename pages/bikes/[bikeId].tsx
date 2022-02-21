import { Badge, Card, CardSection, Container, Group, Text, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import MainLayout from 'src/components/layout/main-layout';
import { getBike } from 'src/firebase/getBike';
import { RentForm } from 'src/templates/RentForm';
import Star from '../../public/star.svg';

function Bike({ bike }) {
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
            <Title>{bike.model}</Title>
          </Group>
          <Group mb={15} mt={10}>
            <Group align="center" spacing={5}>
              <Star style={{ height: 25 }} />
              <Text weight="bold" sx={{ lineHeight: '25px' }}>
                {bike.rating?.rateAvg}
              </Text>
            </Group>
            <Badge color="pink" variant="light">
              {bike.color}
            </Badge>
          </Group>
          <CardSection>
            {bike.imgUrl && (
              <Image
                src={bike.imgUrl}
                layout="responsive"
                width={500}
                height={400}
                objectFit="cover"
                unoptimized
              />
            )}
          </CardSection>
        </Card>
        <RentForm bike={bike} />
      </Group>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { bikeId } = query;
  const bike = await getBike(bikeId);
  console.log({ bikess: bike });
  console.log({ bikeId });

  return {
    props: {
      bike,
    }, // will be passed to the page component as props
  };
};

Bike.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuthUser<any>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Bike);
