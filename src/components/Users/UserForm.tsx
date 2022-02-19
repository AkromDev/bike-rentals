import React, { useState } from 'react';
import { useForm } from '@mantine/hooks';
import { CheckIcon, EnvelopeClosedIcon, LockClosedIcon } from '@modulz/radix-icons';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  useMantineTheme,
  Select,
} from '@mantine/core';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useNotifications } from '@mantine/notifications';
import useCreateUser, { Role } from './hooks/useCreateUser';

export interface UserFormProps {
  onSuccess: () => void;
  onError?: () => void;
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  style?: React.CSSProperties;
}

export default function UserForm({ noShadow, noPadding, style, onSuccess }: UserFormProps) {
  const auth = getAuth(getApp());
  const theme = useMantineTheme();
  const notifications = useNotifications();

  const [createUser, loading, error] = useCreateUser(auth);

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'User' as Role,
    },

    validationRules: {
      fullName: (value) => value.trim().length >= 2,
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.trim().length >= 6,
    },

    errorMessages: {
      fullName: 'Fullname is too short',
      email: 'Invalid email',
      password: 'Password should be at least 6 characters',
    },
  });

  const roles: Array<{ value: Role; label: string }> = [
    { value: 'User', label: 'User' },
    { value: 'Manager', label: 'Manager' },
  ];

  const handleSubmit = () => {
    const { email, password, role, fullName } = form.values;
    createUser(email, password, role, fullName)
      .then(() => {
        onSuccess();
        notifications.showNotification({
          title: 'Success',
          message: 'User is successfully created',
          icon: <CheckIcon />,
        });
      })
      .catch((err) => {
        console.log({ err });
      });
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
        <LoadingOverlay visible={loading} />
        <TextInput
          data-autofocus
          required
          placeholder="Fullname"
          label="Full name"
          {...form.getInputProps('fullName')}
        />
        <TextInput
          mt="md"
          required
          placeholder="Email"
          label="Email"
          icon={<EnvelopeClosedIcon />}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          required
          placeholder="Password"
          label="Password"
          icon={<LockClosedIcon />}
          {...form.getInputProps('password')}
        />
        <Select
          mt="md"
          label="User role"
          placeholder="Pick one"
          data={roles}
          {...form.getInputProps('role')}
        />
        {error && (
          <Text color="red" size="sm" mt="sm">
            {error?.response?.data?.message || 'User creation failed'}
          </Text>
        )}

        <Button color="blue" type="submit" mt={20}>
          Create User
        </Button>
      </form>
    </Paper>
  );
}
