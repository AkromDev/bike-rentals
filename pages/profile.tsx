import { Badge, Box, Button, Container, Group, Modal, Paper, Text, Title } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import MainLayout from 'src/components/layout/main-layout';
import RatingStar from 'src/components/RatingStar';
import admin from 'src/firebase/nodeApp';
import usePostRequestWithToken from 'src/hooks/usePostRequestWithToken';

const Profile = ({ reservations: _reservations }: any) => {
  const authUser = useAuthUser();
  const { postRequestWithToken } = usePostRequestWithToken();
  const notifications = useNotifications();
  const [reservations, setReservations] = useState();
  const [loadingId, setLoadingId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const modalItemRef = useRef();
  const [rate, setRate] = useState(0);

  useEffect(() => {
    setReservations(_reservations);
  }, [_reservations]);

  const onSuccess = (id, nextStatus) => {
    notifications.showNotification({
      title: 'Success',
      message: 'Successfully update the reservation',
    });

    setReservations((prevs) =>
      prevs.map((res) => (res.id === id ? { ...res, status: nextStatus } : res))
    );
  };

  const onError = (nextStatus) => {
    notifications.showNotification({
      title: 'Error',
      message: nextStatus === 'COMPLETED' ? 'Completing the reservation failed' : 'Cancelling the reservation failed',
    });
  };

  const updateReservation = (reservationId, bikeId, nextStatus: 'CANCELLED' | 'COMPLETED') => {
    setLoadingId(reservationId);
    if (nextStatus === 'COMPLETED') {
      postRequestWithToken('/api/reservations', {
        userId: authUser.id || authUser.uid,
        reservationId,
        bikeId,
        nextStatus,
        rate,
      }, 'PUT')
      .then(() => {
        onSuccess(reservationId, nextStatus);
      }).catch(() => {
        onError(nextStatus);
      }).finally(() => {
        setLoadingId('');
        setModalOpen(false);
      });
    } else {
      postRequestWithToken('/api/reservations', {
        reservationId,
        userId: authUser.id || authUser.uid,
        bikeId,
        nextStatus,
      }, 'PUT').then(() => {
        onSuccess(reservationId, nextStatus);
      }).catch(() => {
        onError(nextStatus);
      }).finally(() => setLoadingId(''));
    }
  };

  const hasReservations = Array.isArray(reservations) && reservations.length > 0;

  return (
    <Container sx={{ paddingBlock: 40 }}>
      <Title align="center">User Profile</Title>
      <Text size="lg" component="h2" weight="bold">
        Info
      </Text>
      <Text>Name: {authUser.displayName}</Text>
      <Text color="blue">Email: {authUser.email}</Text>
      {!hasReservations && (
        <Text size="lg" component="h2" weight="bold">
          No reservations
        </Text>
      )}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        title="Complete if you returned the bike"
        sx={{
        '.mantine-Modal-title': {
          textAlign: 'center',
          fontWeight: 'bolder',
        },
      }}
      >
        <Group direction="column" align="center" sx={{ padding: 20 }}>
          <Text>Consider to leave a good rating to help us</Text>
          <RatingStar onStarChange={(v) => setRate(v)} />
          <Button
            variant="outline"
            color="blue"
            fullWidth
            loading={modalItemRef.current?.id === loadingId}
            onClick={() => updateReservation(modalItemRef.current.id, modalItemRef.current.bikeId, 'COMPLETED')}
          >Complete
          </Button>
        </Group>
      </Modal>

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
                    Payment amount: {' '}
                    <Text component="span" weight="bold">
                      ${item.paymentAmount}
                    </Text>
                  </Text>
                  <Text mt={5}>
                    Start date :{' '}
                    <Text component="span" color="blue">
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
                {item.status === 'RESERVED' && (
                  <Group>
                    <Button
                      color="red"
                      variant="outline"
                      onClick={() => updateReservation(item.id, item.bikeId, 'CANCELLED',)}
                      disabled={loadingId === item.id}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="blue"
                      variant="outline"
                      onClick={() => {
                        modalItemRef.current = item;
                        setRate(0);
                        setModalOpen(true);
                      }}
                      disabled={loadingId === item.id}
                    >
                      Compelte
                    </Button>
                  </Group>
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

  const reservationsRef = admin.firestore().collection('reservations').where('userId', '==', id);
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
