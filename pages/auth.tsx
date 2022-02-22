import { Container } from '@mantine/core';
import { ReactNode } from 'react';
import AuthenticationForm from 'src/templates/auth/AuthenticationForm';
import MainLayout from 'src/components/layout/main-layout';
import { withAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';

function HomePage() {
  return (
    <Container mt={100} sx={{ maxWidth: 400 }}>
      <AuthenticationForm />
    </Container>
  );
}

HomePage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  authPageURL: '/auth/',
})(HomePage);
