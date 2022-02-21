import { Badge, Box, Button, Container, Group, Paper, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { firestore } from 'firebase-admin';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React, { ReactNode } from 'react';
import MainLayout from 'src/components/layout/main-layout';

const Profile = ({ reservations }: any) => {
  const authUser = useAuthUser();

const hasReservations = Array.isArray(reservations) && reservations.length > 0;
  return (
    <Container sx={{ paddingBlock: 40 }}>
      <Title align="center">User Profile</Title>
      <Text size="lg" component="h2" weight="bold">
        Info
      </Text>
      <Text color="pink">Name: {authUser.displayName}</Text>
      <Text color="blue">Email: {authUser.email}</Text>
      {!hasReservations && (
        <Text size="lg" component="h2" weight="bold">
          No reservations
        </Text>
      )}
      {hasReservations && (
        <Box mt={20}>
          <Text size="lg" component="h2" weight="bold">
            Reservations
          </Text>
          {reservations.map((item) => (
            <Paper shadow="lg" mt={20} sx={{ paddingBlock: 20, paddingInline: 30 }}>
              <Group sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Group>
                    <Text weight="bolder" size="lg">
                      {item.model}
                    </Text>
                    <Badge color={item === 'CANCELLED' ? 'red' : ''}>{item.status}</Badge>
                  </Group>

                  <Text mt={5}>
                    Start date :{' '}
                    <Text component="span" color="pink">
                      {dayjs(item.startDate).format('MMMM DD,YYYY')}
                    </Text>
                  </Text>
                  <Text mt={5}>
                    End date :{' '}
                    <Text component="span" color="pink">
                      {dayjs(item.endDate).format('MMMM DD,YYYY')}
                    </Text>
                  </Text>
                  <Text mt={5}>
                    Reserved date :{' '}
                    <Text component="span" color="gray">
                      {item.createdAt}
                    </Text>
                  </Text>
                </Box>
                {item.status !== 'CANCELLED' && (
                  <Button color="red" variant="outline">
                    Cancel
                  </Button>
                )}
              </Group>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

Profile.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  const id = await AuthUser.id;

  const reservationsRef = firestore().collection('reservations').where('userId', '==', id);
  const reservationsSnapshot = await reservationsRef.get();
  const reservations = reservationsSnapshot.docs.map((doc) => {
    const _createdAt = doc.data().createdAt as firestore.Timestamp;
    const data = {
      ...doc.data(),
      id: doc.id,
      createdAt: dayjs(_createdAt.toDate()).format('MMMM DD,YYYY'),
    };
    return data;
  });

  return {
    props: {
      reservations,
    },
  };
});

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Profile);
