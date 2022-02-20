import { Box, Button, Group, Modal } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { CheckIcon, ReloadIcon } from '@modulz/radix-icons';
import { XCircleFillIcon } from '@primer/octicons-react';
import axios from 'axios';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { DataTable } from 'src/components/DataTable';
import SelectFilter from '../DataTable/Filters/SelectFilter';
import useDeleteUser from './hooks/useDeleteUser';
import UserForm from './UserForm';
import UsersActionMenu from './UsersActionMenu';

const UsersTable = () => {
  const [data, setData] = useState([]);

  const [loading, toggleLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const AuthUser = useAuthUser();
  const [refresh, setRefresh] = useState(false);
  const [deleteUser] = useDeleteUser();
  const notifications = useNotifications();
  const [loadingItemId, setLoadingItemId] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      toggleLoading(true);
      const idToken = await AuthUser.getIdToken();
      try {
        const usersRes = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setData(usersRes.data.users);
        setTotal(usersRes.data.users.length);
        setPageCount(Math.ceil(usersRes.data.users.length / 10));
      } catch (error) {
        console.log('getUsersError', error);
      } finally {
        toggleLoading(false);
      }
    };
    getUsers();
  }, [AuthUser, refresh]);

  const onDeleteClick = (id: string) => {
    setLoadingItemId(id);
    deleteUser(id)
      .then(() => {
        notifications.showNotification({
          title: 'Success',
          message: 'User is successfully deleted',
          icon: <CheckIcon />,
        });
        setRefresh((r) => !r);
      })
      .catch((err) => {
        notifications.showNotification({
          title: 'Error',
          message: err?.message || 'User deletetion failed',
          icon: <XCircleFillIcon />,
          color: 'red',
        });
      })
      .finally(() => {
        setLoadingItemId('');
      });
  };
  return (
    <Box sx={(t) => ({ height: '100%', padding: t.spacing.lg, background: 'white' })}>
      <Group sx={{ marginBottom: 20 }}>
        <Button disabled={loading} onClick={() => setRefresh((r) => !r)}>
          <ReloadIcon color="white" />
        </Button>
        <Button onClick={() => setModalOpen(true)}>Create user</Button>
      </Group>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Create a new user">
        <UserForm
          noShadow
          noPadding
          onSuccess={() => {
            setModalOpen(false);
            setRefresh((r) => !r);
          }}
        />
      </Modal>
      <DataTable
        columns={[
          { accessor: 'displayName', Header: 'Name' },
          { accessor: 'email', Header: 'Email' },
          {
            accessor: 'role',
            Header: 'Role',
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
              <UsersActionMenu
                onDeleteClick={() => onDeleteClick(cell.value)}
                loading={cell.value === loadingItemId}
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
})(UsersTable);
