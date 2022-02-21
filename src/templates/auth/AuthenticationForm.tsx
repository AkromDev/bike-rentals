import React, { useState } from 'react';
import { useForm } from '@mantine/hooks';
import { EnvelopeClosedIcon, LockClosedIcon } from '@modulz/radix-icons';
import {
  TextInput,
  PasswordInput,
  Group,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Anchor,
  useMantineTheme,
} from '@mantine/core';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseErrorMessages } from 'src/firebase/utils/firebaseErrorMessages';
import useSignUp from './hooks/useSignUp';
import useSignIn from './hooks/useSignIn';

export interface AuthenticationFormProps {
  noShadow?: boolean;
  noPadding?: boolean;
  noSubmit?: boolean;
  style?: React.CSSProperties;
}

export default function AuthenticationForm({
  noShadow,
  noPadding,
  noSubmit,
  style,
}: AuthenticationFormProps) {
  const auth = getAuth(getApp());
  const [formType, setFormType] = useState<'register' | 'login'>('register');
  const theme = useMantineTheme();

  const [signUp, _, registerLoading, registerError] = useSignUp(auth);
  const [signIn, __, loginLoading, loginError] = useSignIn(auth);

  const toggleFormType = () => {
    setFormType((current) => (current === 'register' ? 'login' : 'register'));
  };

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsOfService: true,
    },

    validationRules: {
      fullName: (value) => formType === 'login' || value.trim().length >= 2,
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.trim().length >= 6,
      confirmPassword: (val, values) => formType === 'login' || val === values?.password,
    },

    errorMessages: {
      email: 'Invalid email',
      password: 'Password should be at least 6 characters',
      confirmPassword: "Passwords don't match. Try again",
    },
  });

  const handleSubmit = () => {
    if (formType === 'login') {
      signIn(form.values.email, form.values.password);
    } else {
      signUp(form.values.email, form.values.password, form.values.fullName);
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
        <LoadingOverlay visible={registerLoading || loginLoading} />
        {formType === 'register' && (
          <TextInput
            data-autofocus
            required
            placeholder="Your fullname"
            label="Full name"
            {...form.getInputProps('fullName')}
          />
        )}

        <TextInput
          mt="md"
          required
          placeholder="Your email"
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

        {formType === 'register' && (
          <PasswordInput
            mt="md"
            required
            label="Confirm Password"
            placeholder="Confirm password"
            icon={<LockClosedIcon />}
            {...form.getInputProps('confirmPassword')}
          />
        )}

        {/* {formType === 'register' && (
          <Checkbox
            mt="xl"
            label="I agree to terms and conditions"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
        )} */}

        {formType === 'register' && registerError && (
          <Text color="red" size="sm" mt="sm">
            {registerError.message}
          </Text>
        )}

        {formType === 'login' && loginError && (
          <Text color="red" size="sm" mt="sm">
            {firebaseErrorMessages[loginError.code] || loginError.message}
          </Text>
        )}

        {!noSubmit && (
          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="blue"
              onClick={toggleFormType}
              size="sm"
            >
              {formType === 'register'
                ? 'Have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>

            <Button color="blue" type="submit">
              {formType === 'register' ? 'Register' : 'Login'}
            </Button>
          </Group>
        )}
      </form>
    </Paper>
  );
}
