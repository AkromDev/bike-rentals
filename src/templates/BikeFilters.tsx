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
  const { filters, bikesLength, initial, invalid } = props;
  const { models, locations, colors } = filters || {};
  const router = useRouter();
  const { query } = router;
  const [range, setRange] = useState([null, null]);

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
    if (query.rating > 0 && query.rating < 6) {
      const rating = Math.min(Math.ceil(Number(query.rating)), 5);
      setRating(String(rating));
    }
    const start = new Date(query.start);
    const end = new Date(query.end);

    if (dayjs(start).isValid() && dayjs(end).isValid()) {
      setRange([start, end]);
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
    if (rating) {
      router.query.rating = rating;
    } else {
      delete router.query.rating;
    }
    if (dayjs(range[0]).isValid()) {
      router.query.start = dayjs(range[0]).toISOString();
    } else {
      delete router.query.start;
    }
    if (dayjs(range[1]).isValid()) {
      router.query.end = dayjs(range[1]).toISOString();
    } else {
      delete router.query.end;
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
    const { query } = router;
    delete query.location;
    delete query.color;
    delete query.rating;
    delete query.model;
    setLocation('');
    setColor('');
    setModel('');
    setRating('');
    router.push(router);
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      {/* <Text mt={30} weight="bold" size="lg">Date range</Text> */}
      {initial && (
        <Text mt={20} mb={10} color="">
          Please select range and search to see bikes
        </Text>
      )}
      {invalid && (
        <Text mt={20} mb={10} color="red">
          Please select a valid date range
        </Text>
      )}
      <Group align="flex-end">
        <DateRangePicker
          label="From - To"
          placeholder="Pick dates range"
          value={range}
          onChange={setRange}
          minDate={dayjs(new Date()).add(1, 'days').toDate()}
          maxDate={dayjs(new Date()).add(10, 'months').toDate()}
          sx={{ flex: 1 }}
        />
        <Button onClick={onApplyFilters}>Search bikes</Button>
      </Group>
      <Text mt={30} weight="bold" size="lg">
        Filters
      </Text>
      <Group mt="md">
        <Select
          sx={{ flex: 1 }}
          label="Location"
          placeholder="Pick location"
          data={getOptions(locations)}
          value={location}
          onChange={(val) => setLocation(val)}
        />
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
          label="Min rate"
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
      {bikesLength === 0 &&
        Object.keys(query).some((q) => ['location', 'rating', 'color', 'model'].includes(q)) && (
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
