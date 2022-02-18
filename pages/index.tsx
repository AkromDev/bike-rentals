import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import MainLayout from 'src/components/layout/main-layout';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/bikes');
  }, []);
  return null;
}

HomePage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
