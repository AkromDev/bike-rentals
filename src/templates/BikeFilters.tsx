import { Badge, Box, Button, Group, Select, Text, Title } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { queryTypes, useQueryStates } from 'next-usequerystate';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function getOptions(arr) {
  const options = [{ value: '', label: 'All' }];
  if (Array.isArray(arr)) {
    arr.map((l) => options.push({ value: l, label: l }));
  }

  return options;
}
export default function BikeFilters(props) {
  const { models, locations, colors, bikesLength } = props;
  const router = useRouter();
  const { query } = router;
  const [range, setRange] = useQueryStates({
    start: queryTypes.isoDateTime,
    end: queryTypes.isoDateTime,
  });

  const [location, setLocation] = useState('');
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (query.color) {
      setColor(query.color);
    }
    if (query.location) {
      setLocation(query.location);
    }
    if (query.model) {
      setModel(query.model);
    }
  }, [query]);

  const onApplyFilters = () => {
    if (location) {
      router.query.location = location;
    } else {
      delete router.query.location;
    }
    if (color) {
      router.query.color = color;
    } else {
      delete router.query.color;
    }
    if (model) {
      router.query.model = model;
    } else {
      delete router.query.model;
    }

    router.push(router);
  };

  const resetFilters = () => {
    setLocation('');
    setColor('');
    setModel('');
    router.push('/bikes');
  };
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Group>
        <Select
          label="Location"
          placeholder="Pick location"
          data={getOptions(locations)}
          value={location}
          onChange={(val) => setLocation(val)}
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
          data={getOptions(models)}
          value={model}
          onChange={(v) => setModel(v)}
        />
        <Select
          sx={{ flex: 1 }}
          label="Color"
          placeholder="Pick color"
          value={color}
          onChange={(v) => setColor(v)}
          data={getOptions(colors)}
        />
        <Select
          sx={{ flex: 1 }}
          label="Rate"
          placeholder="Pick rate"
          value={rating}
          onChange={(v) => setRating(v)}
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
      <Group mt={30}>
        <Button variant="outline" color="red" onClick={resetFilters}>
          Reset filters
        </Button>
        <Button onClick={onApplyFilters}>Apply filters</Button>
      </Group>
      {bikesLength === 0 && Object.keys(query).length > 0 && (
        <Group mt={30}>
          <Text size="lg">No bikes found for these filters</Text>
          <Group>
            {query.location && <Badge color="blue">{query.location}</Badge>}
            {query.color && <Badge color="cyan">{query.color}</Badge>}
            {query.model && <Badge color="pink">{query.model}</Badge>}
          </Group>
        </Group>
      )}
    </Box>
  );
}
