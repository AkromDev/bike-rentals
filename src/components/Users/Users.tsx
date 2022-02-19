import { Box, Button, Group, Modal } from '@mantine/core';
import { ReloadIcon } from '@modulz/radix-icons';
import axios from 'axios';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { DataTable } from 'src/components/DataTable';
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
          { accessor: 'email', Header: 'Email Address' },
          { accessor: 'role', Header: 'Role' },
          {
            Header: 'Actions',
            Filter: () => null,
            Cell: ({ cell }) => <UsersActionMenu row={cell.row} />,
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

export default withAuthUser()(UsersTable);
