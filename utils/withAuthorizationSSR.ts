import { withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { Role } from 'src/common-types';

const withAuthorizationSSR = (role: Role = 'Manager', path = '/') =>
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser, req: _ }) => {
    const redirect = {
      redirect: {
        permanent: false,
        destination: path,
      },
    };
    if (!AuthUser) {
      return redirect;
    }
    const token = await AuthUser.getIdToken();
    if (!token) {
      return redirect;
    }

    if (AuthUser.claims.role !== role) {
      return redirect;
    }

    return {
      props: {},
    };
  });

export default withAuthorizationSSR;
