import {
  Button,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { CheckIcon } from '@modulz/radix-icons';
import React from 'react';
import { UserFormType } from '../users/UserForm';
import useBikeActionRequest from './useBikeActionRequest';

function getInitialValues(formType: UserFormType, bike: any | undefined) {
  if (formType === 'update' && bike) {
    return {
      location: bike.location || '',
      model: bike.model || '',
      color: bike.color || '',
      available: bike.available ? 'true' : 'false',
      imgUrl: bike.imgUrl || false,
      priceInUSD: bike.priceInUSD || 100,
    };
  }
  return {
    location: '',
    model: '',
    color: '',
    available: 'false',
    imgUrl: '',
    priceInUSD: 0,
  };
}

export interface BikeFormProps {
  onSuccess: () => void;
  onError?: () => void;
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  formType?: UserFormType;
  bike?: Record<string, any>;
  style?: React.CSSProperties;
}

export default function BikesForm({
  noShadow,
  noPadding,
  style,
  onSuccess,
  formType = 'create',
  bike,
  filters,
}: BikeFormProps) {
  const theme = useMantineTheme();
  const notifications = useNotifications();

  const [createBike, createLoading, createError] = useBikeActionRequest();
  const [updateBike, updateLoading, updateError] = useBikeActionRequest('PUT');

  const form = useForm({
    initialValues: getInitialValues(formType, bike),

    validationRules: {
      location: (value) => value.trim().length >= 2,
      model: (value) => value.trim().length >= 2,
      color: (value) => value.trim().length >= 2,
      imgUrl: (value) => value.trim().length >= 2,
      priceInUSD: (value) => value > 0,
    },

    errorMessages: {
      location: 'Location is too short',
    },
  });

  const bikeStatus: Array<{ value: string; label: string }> = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' },
  ];

  const handleSubmit = () => {
    const values = { ...form.values, available: form.values.available === 'true' };
    if (formType === 'create') {
      // const { model, location, color, role, fullName } = form.values;
      createBike(values)
        .then(() => {
          onSuccess();
          notifications.showNotification({
            title: 'Success',
            message: 'Bike is successfully created updated',
            icon: <CheckIcon />,
          });
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      updateBike({ id: bike?.id || '', bike: values })
        .then(() => {
          onSuccess();
          notifications.showNotification({
            title: 'Success',
            message: 'Bike is successfully updated',
            icon: <CheckIcon />,
          });
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  };

  return (
    <Paper
      padding={noPadding ? 0 : 'lg'}
      shadow={noShadow ? undefined : 'sm'}
      style={{
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        ...style,
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay visible={createLoading || updateLoading} />
        <Select
          mt="md"
          label="Location"
          placeholder="Location"
          data={filters.locations || []}
          {...form.getInputProps('location')}
        />
        <Select
          mt="md"
          label="Model"
          placeholder="Model"
          data={filters.models || []}
          {...form.getInputProps('model')}
        />
        <Select
          mt="md"
          label="Color"
          placeholder="Color"
          data={filters.colors || []}
          {...form.getInputProps('color')}
        />
        <TextInput
          mt="md"
          required
          placeholder="Image url"
          label="Image url"
          {...form.getInputProps('imgUrl')}
        />
        <NumberInput
          mt="md"
          required
          placeholder="Price in usd"
          label="Price (USD)"
          {...form.getInputProps('priceInUSD')}
          min={0}
          step={10}
        />
        <Select
          mt="md"
          label="Available"
          placeholder="Available"
          data={bikeStatus}
          {...form.getInputProps('available')}
        />
        {formType === 'create' && createError && (
          <Text color="red" size="sm" mt="sm">
            {createError?.message || 'Bike creation failed'}
          </Text>
        )}
        {formType === 'update' && updateError && (
          <Text color="red" size="sm" mt="sm">
            {updateError?.message || 'Bike failed'}
          </Text>
        )}
        <Button color="blue" type="submit" mt={20}>
          {formType === 'create' ? 'Create' : 'Update'} Bike
        </Button>
      </form>
    </Paper>
  );
}
