import { Box, Button, Group } from '@mantine/core';
import { ReloadIcon } from '@modulz/radix-icons';
import axios from 'axios';
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataTable, NumberFilter } from 'src/components/datatable';
import SelectFilter from '../../components/datatable/filters/SelectFilter';
import ReserveesActionMenu from './ReserveesActionMenu';

const ReserveesTable = () => {
  const [data, setData] = useState([]);

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
        });
        setData(usersRes.data.reservees);
        setTotal(usersRes.data.reservees.length);
        setPageCount(Math.ceil(usersRes.data.reservees.length / 10));
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
          <ReloadIcon color="white" />
        </Button>
      </Group>
      <DataTable
        columns={[
          { accessor: 'displayName', Header: 'Name' },
          { accessor: 'email', Header: 'Email' },
          {
            accessor: 'totalResCount',
            Header: 'Total',
            Filter: NumberFilter,
            filter: 'numberFilter',
            disableSortBy: true,
          },
          {
            accessor: 'activeResCount',
            Header: 'Active',
            Filter: SelectFilter,
            filter: 'includes',
            disableSortBy: true,
          },
          {
            accessor: 'uid',
            Header: 'Actions',
            Filter: () => null,
            disableSortBy: true,
            Cell: ({ cell }) => (
              <ReserveesActionMenu
                onViewReservations={() => router.push(`/admin/reservees/${cell.value}`)}
              />
            ),
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
