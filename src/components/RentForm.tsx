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
import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export interface RentFormProps {
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  style?: React.CSSProperties;
}

export function RentForm({ style, bike }: RentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const theme = useMantineTheme();

  const pickupDay = range[0] ? dayjs(range[0]).format('MMMM DD,YYYY') : null;
  const returnDay = range[1] ? dayjs(range[1]).format('MMMM DD,YYYY') : null;
  const days = range[0] && range[1] ? dayjs(range[1]).from(range[0], true) : null;

  const dayCount = days?.split('')[0] || 0;
  const onSubmit = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setError('Booking failed');
    }, 2000);
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
        <DateRangePicker
          label="Rent period"
          placeholder="Pick a range"
          value={range}
          onChange={(val) => setRange(val)}
          minDate={dayjs(new Date()).add(1, 'days').toDate()}
          maxDate={range[0] ? dayjs(range[0]).add(21, 'days').toDate() : undefined}
          sx={{
            flex: 1,
            '.mantine-DateRangePicker-label': {
              fontWeight: 500,
              fontSize: 16,
            },
          }}
        />
        <Group direction="column" spacing={7}>
          <Title mt={20} sx={{ fontSize: 25 }}>
            Summary
          </Title>
          <Group spacing={5}>
            <Icon icon={calendarTwotone} />
            <Text>Pickup on {pickupDay}</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={calendarTwotone} />
            <Text>Return on {returnDay}</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={environmentOutlined} />
            <Text>Seoul, gwangjinu gunja 43</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={clockCircleOutlined} />
            <Text>visit store between 8am - 10pm</Text>
          </Group>
          <Group spacing={5}>
            <Icon icon={dollarCircleOutlined} />
            <Text>
              Total Price {Number(bike.priceInUSD || 0) * dayCount}$ ({days || '0 days'})
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
            {error}
          </Text>
        )}

        <Button
          variant="light"
          color="blue"
          fullWidth
          mt={30}
          type="submit"
          disabled={range.some((d) => d === null)}
          onClick={onSubmit}
        >
          Book
        </Button>
      </Box>
    </Paper>
  );
}
