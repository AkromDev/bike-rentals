export default function HomePage() {
  return null;
}

export const getServerSideProps = () => ({
    redirect: {
      destination: '/bikes',
      permament: true,
    },
  });
