import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { DataTable } from 'src/components/DataTable';
import UsersActionMenu from './UsersActionMenu';

const UsersTable = () => {
  const [data, setData] = useState([]);

  const [loading, toggleLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  const getDataSource = () => {
    toggleLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setTotal(resData.length);
        setPageCount(Math.ceil(resData.length / 10));
      })
      .finally(() => {
        toggleLoading(false);
      });
  };
  useEffect(() => {
    getDataSource();
  }, []);

  return (
    <Box sx={(t) => ({ height: '100%', padding: t.spacing.lg, background: 'white' })}>
      <DataTable
        columns={[
          // { accessor: 'id', Header: 'Id' },
          { accessor: 'name', Header: 'Name' },
          { accessor: 'email', Header: 'Email Address' },
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

export default UsersTable;
