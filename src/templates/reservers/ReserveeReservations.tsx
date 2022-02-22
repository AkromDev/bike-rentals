import { Box, Button, Group, Text } from '@mantine/core';
import { ReloadIcon } from '@modulz/radix-icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { firestore } from 'firebase-admin';
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataTable } from 'src/components/datatable';
import SelectFilter from 'src/components/datatable/filters/SelectFilter';

const ReserveesTable = () => {
  const [data, setData] = useState([]);
  const [reserver, setReserver] = useState({});

  const [loading, toggleLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const AuthUser = useAuthUser();
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      toggleLoading(true);
      const idToken = await AuthUser.getIdToken();
      try {
        const usersRes = await axios.get('/api/reservees', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          params: {
            userId: router.query.userId,
          },
        });
        setData(usersRes.data.userReservations);
        setReserver(usersRes.data.reserver);
        setTotal(usersRes.data.userReservations.length);
        setPageCount(Math.ceil(usersRes.data.userReservations.length / 10));
      } catch (error) {
        console.log('getUsersError', error);
      } finally {
        toggleLoading(false);
      }
    };
    getUsers();
  }, [AuthUser, refresh]);

  return (
    <Box sx={(t) => ({ height: '100%', padding: t.spacing.lg, background: 'white' })}>
      <Group sx={{ marginBottom: 20 }}>
        <Button disabled={loading} onClick={() => setRefresh((r) => !r)}>
          <ReloadIcon />
        </Button>
      </Group>
      <Text mb={20}>
        Showing the reservations for{' '}
        <Text color="blue" component="span">
          {reserver.email}
        </Text>
      </Text>
      <DataTable
        columns={[
          { accessor: 'status', Header: 'Status', disableSortBy: true, Filter: SelectFilter, filter: 'includes' },
          {
            accessor: 'createdAt',
            Header: 'Reserved day',
            Cell: ({ cell }) => {
              const date: firestore.Timestamp = cell.value || {};
              const dd = new Date(date._seconds * 1000 + date._nanoseconds / 1000000);
              return dayjs(dd).format('MMMM DD, YYYY');
            },
            // Filter: NumberFilter,
            // filter: 'numberFilter',
            disableFilters: true,
            disableSortBy: true,
          },
          {
            accessor: 'startDate',
            Header: 'Start Date',
            Cell: ({ cell }) => dayjs(cell.value).format('MMMM DD, YYYY'),
            disableFilters: true,
            disableSortBy: true,
          },
          {
            accessor: 'endDate',
            Header: 'End Date',
            Cell: ({ cell }) => dayjs(cell.value).format('MMMM DD, YYYY'),
            disableFilters: true,
            disableSortBy: true,
          },
        ]}
        data={data}
        loading={loading}
        pageCount={pageCount}
        total={total}
        stickyHeader
        sorting
        pagination
        filtering
      />
    </Box>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(ReserveesTable);
