import { NextApiResponse } from 'next';

const _msg = 'Request failed with status 500';

export function invalidHTTPMethod(
  res: NextApiResponse,
  method = 'GET',
  status: number = 404
) {
  return res
    .status(status)
    .send({ message: `HTTP method ${method} does not exist for this route` });
}
