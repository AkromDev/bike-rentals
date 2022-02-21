import {
  Button,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { CheckIcon, EnvelopeClosedIcon, LockClosedIcon } from '@modulz/radix-icons';
import { UserInfo } from 'firebase/auth';

import React from 'react';
import { Role } from 'src/common-types';
import useCreateUser from './hooks/useCreateUser';
import useUpdateUser from './hooks/useUpdateUser';

function getInitialValues(formType: UserFormType, user: FormUser | undefined) {
  if (formType === 'update' && user) {
    return {
      fullName: user.displayName || '',
      email: user.email || '',
      password: '',
      role: user.role ? user.role : 'User',
    };
  }
  return {
    fullName: '',
    email: '',
    password: '',
    role: 'User' as Role,
  };
}

export type UserFormType = 'update' | 'create';
export interface UserFormProps {
  onSuccess: () => void;
  onError?: () => void;
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  formType?: UserFormType;
  user?: FormUser;
  style?: React.CSSProperties;
}

export interface FormUser extends UserInfo {
  role: Role;
}
export default function UserForm({
  noShadow,
  noPadding,
  style,
  onSuccess,
  formType = 'create',
  user,
}: UserFormProps) {
  const theme = useMantineTheme();
  const notifications = useNotifications();

  const [createUser, createLoading, createError] = useCreateUser();
  const [updateUser, updateLoading, updateError] = useUpdateUser();

  const form = useForm({
    initialValues: getInitialValues(formType, user),

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
    if (formType === 'create') {
      const { email, password, role, fullName } = form.values;
      createUser(email, password, role, fullName)
        .then(() => {
          onSuccess();
          notifications.showNotification({
            title: 'Success',
            message: 'User is successfully created updated',
            icon: <CheckIcon />,
          });
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      const { email, password, role, fullName } = form.values;
      updateUser(user?.uid || '', email, password, role, fullName)
        .then(() => {
          onSuccess();
          notifications.showNotification({
            title: 'Success',
            message: 'User is successfully updated',
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
          label={formType === 'create' ? 'Password' : 'New password'}
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
        {formType === 'create' && createError && (
          <Text color="red" size="sm" mt="sm">
            {createError?.message || 'User creation failed'}
          </Text>
        )}

        {formType === 'update' && updateError && (
          <Text color="red" size="sm" mt="sm">
            {updateError?.message || 'User failed'}
          </Text>
        )}

        <Button color="blue" type="submit" mt={20}>
          {formType === 'create' ? 'Create' : 'Update'} User
        </Button>
      </form>
    </Paper>
  );
}
