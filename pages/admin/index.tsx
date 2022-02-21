import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withAuthorizationSSR } from 'utils';

export default function AdminIdex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/bikes');
  }, []);
  return null;
}
export const getServerSideProps = withAuthorizationSSR();
