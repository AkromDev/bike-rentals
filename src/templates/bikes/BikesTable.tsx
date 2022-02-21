import { Box, Button, Group, Modal } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { CheckIcon, ReloadIcon } from '@modulz/radix-icons';
import { XCircleFillIcon } from '@primer/octicons-react';
import axios from 'axios';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { DataTable } from 'src/components/datatable';
import AdminTableActionMenu from '../AdminTableActionMenu';
import BikeForm from './BikesForm';
import useBikeActionRequest from './useBikeActionRequest';

const BikesTable = () => {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, toggleLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalInfo, setModalInfo] = useState<'create' | Record<string, any> | null>(null);
  const AuthUser = useAuthUser();
  const [refresh, setRefresh] = useState(false);
  const notifications = useNotifications();
  const [loadingItemId, setLoadingItemId] = useState('');
  const [deleteBike] = useBikeActionRequest('DELETE');

  useEffect(() => {
    const getBikes = async () => {
      toggleLoading(true);
      const idToken = await AuthUser.getIdToken();
      try {
        const { data } = await axios.get('/api/bikes', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setData(data);
        setTotal(data.bikes.length);
        setPageCount(Math.ceil(data.bikes.length / 10));
      } catch (error) {
        console.log('getBikes', error);
      } finally {
        toggleLoading(false);
      }
    };
    getBikes();
  }, [AuthUser, refresh]);

  const onDeleteClick = (id: string) => {
    setLoadingItemId(id);
    deleteBike({ id })
      .then(() => {
        notifications.showNotification({
          title: 'Success',
          message: 'Bike is successfully deleted',
          icon: <CheckIcon />,
        });
        setRefresh((r) => !r);
      })
      .catch((err) => {
        notifications.showNotification({
          title: 'Error',
          message: err?.message || 'Bike deletetion failed',
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
        <Button onClick={() => setModalInfo('create')}>Create bike</Button>
      </Group>
      <Modal
        opened={!!modalInfo}
        onClose={() => setModalInfo(null)}
        title={isCreateMode ? 'Create a new bike' : 'Update the bike'}
      >
        <BikeForm
          noShadow
          noPadding
          onSuccess={() => {
            setModalInfo(null);
            setRefresh((r) => !r);
          }}
          formType={isCreateMode ? 'create' : 'update'}
          bike={isCreateMode ? undefined : modalInfo}
          filters={data.filters || {}}
        />
      </Modal>
      <DataTable
        columns={[
          { accessor: 'model', Header: 'Model' },
          { accessor: 'color', Header: 'Color' },
          { accessor: 'location', Header: 'Location' },
          {
            accessor: 'priceInUSD',
            Header: 'Price (USD)',
            disableFilters: true,
            disableSortBy: true,
          },
          {
            accessor: 'available',
            Header: 'Available',
            Cell: ({ cell }) => String(cell.value),
            disableFilters: true,
            disableSortBy: true,
          },
          {
            accessor: 'id',
            Header: 'Actions',
            Filter: () => null,
            disableSortBy: true,
            Cell: ({ cell }) => (
              <AdminTableActionMenu
                onDeleteClick={() => onDeleteClick(cell.value)}
                onEdit={() => {
                  console.log('cell', cell);
                  setModalInfo(cell.row.original);
                }}
                loading={cell.value === loadingItemId}
              />
            ),
          },
        ]}
        data={data.bikes || []}
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
})(BikesTable);
