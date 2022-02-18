import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminIdex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/reservations');
  }, []);
  return null;
}
