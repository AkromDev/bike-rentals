import { useRouter } from 'next/router';
import { useEffect } from 'react';
import withAuthorizationSSR from 'utils/withAuthorizationSSR';

export default function AdminIdex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/reservations');
  }, []);
  return null;
}
export const getServerSideProps = withAuthorizationSSR();
