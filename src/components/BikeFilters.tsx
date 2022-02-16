import { Box, Group, Select } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import React, { useState } from 'react';

export default function BikeFilters() {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(dayjs(new Date()).add(3, 'days').toDate()),
  ]);
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Group>
        <Select
          label="Location"
          placeholder="Pick location"
          data={[
            { value: 'seoul', label: 'Seoul' },
            { value: 'busan', label: 'Busan' },
            { value: 'gwangju', label: 'Gwangju' },
            { value: 'degu', label: 'Degu' },
          ]}
        />
        <DateRangePicker
          label="From - To"
          placeholder="Pick dates range"
          value={value}
          onChange={setValue}
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
          defaultValue="all"
          data={[
            { value: 'all', label: 'All' },
            { value: 'seoul', label: 'Seoul' },
            { value: 'busan', label: 'Busan' },
            { value: 'gwangju', label: 'Gwangju' },
            { value: 'degu', label: 'Degu' },
          ]}
        />
        <Select
          sx={{ flex: 1 }}
          label="Color"
          placeholder="Pick color"
          defaultValue="all"
          data={[
            { value: 'all', label: 'All' },
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
          defaultValue="all"
          data={[
            { value: 'all', label: 'All' },
            { value: 'seoul', label: 'Seoul' },
            { value: 'busan', label: 'Busan' },
            { value: 'gwangju', label: 'Gwangju' },
            { value: 'degu', label: 'Degu' },
          ]}
        />
      </Group>
    </Box>
  );
}
