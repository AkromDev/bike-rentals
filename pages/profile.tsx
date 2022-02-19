import React from 'react';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import getAbsoluteURL from 'utils/getAbsoluteURL';

const Profile = ({ favoriteColor }: any) => {
  const AuthUser = useAuthUser();
  return (
    <div>
      <p>Signed in as {AuthUser.email}</p>
      <button
        type="button"
        onClick={() => {
          AuthUser.signOut();
        }}
      >
        Sign out
      </button>
      <p>Your favorite color is: {favoriteColor}</p>
      <pre>{JSON.stringify(AuthUser, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  // Optionally, get other props.
  // You can return anything you'd normally return from
  // `getServerSideProps`, including redirects.
  // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  const token = await AuthUser.getIdToken();

  // Note: you shouldn't typically fetch your own API routes from within
  // `getServerSideProps`. This is for example purposes only.
  // https://github.com/gladly-team/next-firebase-auth/issues/264
  const endpoint = getAbsoluteURL('/api/example', req);
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: token || 'unauthenticated',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
  }
  return {
    props: {
      favoriteColor: data.favoriteColor,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Profile);
