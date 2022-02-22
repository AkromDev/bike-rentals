import { Badge, Box, Button, Group, Modal, Text } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { CheckIcon, ReloadIcon } from '@modulz/radix-icons';
import { XCircleFillIcon } from '@primer/octicons-react';
import axios from 'axios';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { DataTable } from 'src/components/datatable';
import SelectFilter from '../../components/datatable/filters/SelectFilter';
import useDeleteUser from './hooks/useDeleteUser';
import UserForm, { FormUser } from './UserForm';
import UsersActionMenu from './UsersActionMenu';

const UsersTable = () => {
  const [data, setData] = useState<Array<FormUser>>([]);

  const [loading, toggleLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalInfo, setModalInfo] = useState<'create' | FormUser | null>(null);
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
  const isCreateMode = !modalInfo || modalInfo === 'create';

  return (
    <Box sx={(t) => ({ height: '100%', padding: t.spacing.lg, background: 'white' })}>
      <Group sx={{ marginBottom: 20 }}>
        <Button disabled={loading} onClick={() => setRefresh((r) => !r)}>
          <ReloadIcon color="white" />
        </Button>
        <Button onClick={() => setModalInfo('create')}>Create user</Button>
      </Group>
      <Modal
        opened={!!modalInfo}
        onClose={() => setModalInfo(null)}
        title={isCreateMode ? 'Create a new user' : 'Update the user'}
      >
        <UserForm
          noShadow
          noPadding
          onSuccess={() => {
            setModalInfo(null);
            setRefresh((r) => !r);
          }}
          formType={isCreateMode ? 'create' : 'update'}
          user={isCreateMode ? undefined : modalInfo}
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
          // {
          //   Header: () => (
          //     <Box sx={{ position: 'relative', paddingBottom: 10 }}>
          //       <div>Reservations</div>
          //       <Badge sx={{ position: 'absolute', fontSize: 9 }} size="sm">
          //         Active /{' '}
          //         <Text component="span" color="red" sx={{ fontSize: 9 }}>
          //           Total
          //         </Text>
          //       </Badge>
          //     </Box>
          //   ),
          //   Filter: SelectFilter,
          //   filter: 'includes',
          //   accessor: 'totalResCount',
          //   disableSortBy: true,
          //   Cell: ({ cell }) => (
          //       <Text size="sm" ml={5}>
          //         {cell.row.original.activeResCount} / {cell.row.original.totalResCount}
          //       </Text>
          //     ),
          // },
          {
            accessor: 'uid',
            Header: 'Actions',
            Filter: () => null,
            disableSortBy: true,
            Cell: ({ cell }) => (
              <UsersActionMenu
                onDeleteClick={() => onDeleteClick(cell.value)}
                onEdit={() => {
                  console.log('cell', cell);
                  setModalInfo(cell.row.original as FormUser);
                }}
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
