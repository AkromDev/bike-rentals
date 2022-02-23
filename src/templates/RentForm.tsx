import calendarTwotone from '@iconify/icons-ant-design/calendar-twotone';
import clockCircleOutlined from '@iconify/icons-ant-design/clock-circle-outlined';
import dollarCircleOutlined from '@iconify/icons-ant-design/dollar-circle-outlined';
import environmentOutlined from '@iconify/icons-ant-design/environment-outlined';
import infoCircleOutlined from '@iconify/icons-ant-design/info-circle-outlined';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import React from 'react';
import usePostRequestWithToken from 'src/hooks/usePostRequestWithToken';

dayjs.extend(relativeTime);

export interface RentFormProps {
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  style?: React.CSSProperties;
}

function formatDate(date) {
  if (!date || !dayjs(date).isValid()) {
    return 'Invalid date';
  }

  return dayjs(date).format('MMMM DD,YYYY');
}
export function RentForm({ style, bike }: RentFormProps) {
  const theme = useMantineTheme();

  const { postRequestWithToken, loading, error } = usePostRequestWithToken(true);
  const notificaton = useNotifications();
  const router = useRouter();
  const { start, end } = router.query;

  const isRangeValid =
    dayjs(start).isValid() && dayjs(end).isValid() && dayjs(start).isBefore(dayjs(end));

  const days = isRangeValid ? dayjs(end).diff(start, 'days') : null;
  const totalPrices = Number(bike.priceInUSD || 0) * Number(days);

  const onSubmit = () => {
    postRequestWithToken('/api/reservations', {
      bikeId: bike.id,
      startDate: start,
      endDate: end,
      paymentAmount: totalPrices,
      model: bike.model,
    })
      .then(() => {
        notificaton.showNotification({
          title: 'Success',
          message: 'Successfully reserved',
        });

        router.replace('/profile');
      })
      .catch((err) => {
        console.log('errrr', err);
      });
  };
  return (
    <Paper
      padding="lg"
      shadow="md"
      style={{
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        flex: 1,
        maxWidth: 500,
        ...style,
      }}
    >
      <Box>
        <LoadingOverlay visible={loading} />
        <Group direction="column" spacing={7}>
          <Title mt={20} sx={{ fontSize: 25 }}>
            Summary
          </Title>
          <Group spacing={5}>
            <Icon icon={calendarTwotone} />
            <Text>Pickup on {formatDate(start)}</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={calendarTwotone} />
            <Text>Return on {formatDate(end)}</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={environmentOutlined} />
            <Text>{bike.location}</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={clockCircleOutlined} />
            <Text>visit store between 8am - 10pm</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={dollarCircleOutlined} />
            <Text>
              Total Price ${totalPrices} ({days || '0'} days)
            </Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={infoCircleOutlined} />
            <Text>Payment should be done at pickup</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={infoCircleOutlined} />
            <Text>You will be charged for late return</Text>
          </Group>
        </Group>
        {error && (
          <Text color="red" size="sm" mt="sm">
            {error?.message || 'Reservation failed'}
          </Text>
        )}

        <Button
          variant="light"
          color="blue"
          fullWidth
          mt={30}
          type="submit"
          disabled={!isRangeValid}
          onClick={onSubmit}
        >
          Book
        </Button>
      </Box>
    </Paper>
  );
}
