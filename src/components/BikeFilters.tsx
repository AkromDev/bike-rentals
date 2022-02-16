import { Box, Group, Select } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { queryTypes, useQueryState, useQueryStates } from 'next-usequerystate';
import React from 'react';

export default function BikeFilters() {
  const [range, setRange] = useQueryStates({
    start: queryTypes.isoDateTime,
    end: queryTypes.isoDateTime,
  });

  const [location, setLocation] = useQueryState('location');
  const [color, setColor] = useQueryState('color');
  const [model, setModel] = useQueryState('model');
  const [rating, setRating] = useQueryState('rating');

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Group>
        <Select
          label="Location"
          placeholder="Pick location"
          data={[
            { value: '', label: 'All' },
            { value: 'seoul', label: 'Seoul' },
            { value: 'busan', label: 'Busan' },
            { value: 'gwangju', label: 'Gwangju' },
            { value: 'degu', label: 'Degu' },
          ]}
          value={location}
          onChange={(val) => setLocation(val || null)}
        />
        <DateRangePicker
          label="From - To"
          placeholder="Pick dates range"
          value={[range.start, range.end]}
          onChange={([start, end]) => setRange({ start, end })}
          minDate={dayjs(new Date()).add(1, 'days').toDate()}
          maxDate={dayjs(new Date()).add(10, 'months').toDate()}
          sx={{ flex: 1 }}
        />
      </Group>
      <Group mt="lg">
        <Select
          sx={{ flex: 1 }}
          label="Model"
          placeholder="Pick model"
          data={[
            { value: '', label: 'All' },
            { value: 'seoul', label: 'Seoul' },
            { value: 'busan', label: 'Busan' },
            { value: 'gwangju', label: 'Gwangju' },
            { value: 'degu', label: 'Degu' },
          ]}
          value={model}
          onChange={(v) => setModel(v || null)}
        />
        <Select
          sx={{ flex: 1 }}
          label="Color"
          placeholder="Pick color"
          value={color}
          onChange={(v) => setColor(v || null)}
          data={[
            { value: '', label: 'All' },
            { value: 'seoul', label: 'Seoul' },
            { value: 'busan', label: 'Busan' },
            { value: 'gwangju', label: 'Gwangju' },
            { value: 'degu', label: 'Degu' },
          ]}
        />
        <Select
          sx={{ flex: 1 }}
          label="Rate"
          placeholder="Pick rate"
          value={rating}
          onChange={(v) => setRating(v || null)}
          data={[
            { value: '', label: 'All' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
          ]}
        />
      </Group>
    </Box>
  );
}
