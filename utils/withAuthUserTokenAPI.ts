import { NextApiRequest, NextApiResponse } from 'next';
import { AuthUser, verifyIdToken } from 'next-firebase-auth';
import { Role } from 'src/components/Users/hooks/useCreateUser';

const manager: Role = 'Manager';

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  AuthUser?: AuthUser;
}

/**
 * API Middleware for Firebase ID Token Authorization.
 * API endpoints wrapped with this middleware will be required to be executes with a
 * `bearer <id token>` Authorization header.
 * e.g.,
 * ```
 * await fetch('<baseUrl>/api/hello', { headers: {authorization: 'bearer <IDToken>'}});
 * ```
 * @param {*} handler
 * @returns Wrapped handler method that is used by NextJS.
 */
const withAuthUserTokenAPI: <T extends unknown>(
  handler: (authReq: AuthenticatedNextApiRequest, res: NextApiResponse<T>) => void,
  adminOnly?: boolean
) => (req: NextApiRequest, res: NextApiResponse) => void =
  (handler, adminOnly) => async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.match(/^bearer .*$/i)) {
      res.status(401).send({ message: 'Unauthorized', code: 1 });
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const authUser = await verifyIdToken(token);

      if (!authUser.id) {
        res.status(401).send({ message: 'Unauthorized', code: 2 });
        return;
      }

      if (adminOnly && authUser.claims.role !== manager) {
        res.status(401).send({ message: 'Unauthorized', code: 2 });
        return;
      }

      (req as AuthenticatedNextApiRequest).AuthUser = authUser;
      handler(req, res);
    } catch (err: any) {
      console.error('Error verifying Provided ID Token', err.message, err.stack);
      res.status(401).send({ message: 'Unauthorized', code: 3 });
    }
  };

export default withAuthUserTokenAPI;
