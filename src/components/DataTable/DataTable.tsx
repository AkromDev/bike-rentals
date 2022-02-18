import { useEffect } from 'react';
import {
  Column,
  Filters,
  Row,
  SortingRule,
  useFilters,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {
  Checkbox,
  createStyles,
  Divider,
  Group,
  LoadingOverlay,
  Pagination,
  Select,
  Table,
  Text,
  useCss,
} from '@mantine/core';

import { ArrowUpIcon } from '@modulz/radix-icons';
import { Icon } from '@iconify/react';
import arrowUpDown from '@iconify/icons-akar-icons/arrow-up-down';

import filterTypes from './filterTypes';
import { StringFilter } from './Filters';

const pageSizeOptions = ['10', '25', '50', '100'];

const useStyles = createStyles((t) => ({
  root: { height: '100%', display: 'block' },
  tableContainer: {
    display: 'block',
    overflow: 'auto',
    '& > table': {
      '& > thead': { backgroundColor: t.colors.gray[0], zIndex: 1 },
      '& > thead > tr > th': { padding: t.spacing.md },
      '& > tbody > tr > td': { padding: t.spacing.md },
    },
  },
  stickHeader: { top: 0, position: 'sticky' },
  sortableHeader: { '&:hover': { backgroundColor: t.colors.gray[2] } },
  disableSortIcon: { color: t.colors.gray[5] },
  sortDirectionIcon: { transition: 'transform 200ms ease' },
}));

const defaultColumn = {
  Filter: StringFilter,
  filter: 'stringFilter',
};

const selectionHook = (hook: any, selection: any) => {
  if (selection) {
    hook.visibleColumns.push((columns: Column<object>[]) => [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }: { getToggleAllRowsSelectedProps: any }) => (
          <Checkbox {...getToggleAllRowsSelectedProps({ title: undefined })} />
        ),
        Cell: ({ row }: { row: Row<object> }) => (
          <Checkbox
            {...row.getToggleRowSelectedProps({
              title: undefined,
              //@ts-ignore
              onClick: (e) => e.stopPropagation(),
            })}
          />
        ),
      },
      ...columns,
    ]);
  }
};

interface FetchDateProps {
  pageIndex: number;
  pageSize: number;
  sortBy: SortingRule<object>[];
  filters: Filters<object>;
}
interface DataTableProps {
  columns: Column<object>[];
  data: any[];
  serverSideDataSource?: boolean;
  initialPageSize?: number;
  initialPageIndex?: number;
  pageCount?: number;
  total?: number;
  stickyHeader?: boolean;
  customFilterTypes?: object;
  debugging?: boolean;
  loading?: boolean;
  filtering?: boolean;
  sorting?: boolean;
  selection?: boolean;
  pagination?: boolean;
  onRowClick?: (rowData: any) => void;
  fetchData?: (ops: FetchDateProps) => void;
}
export const DataTable = (props: DataTableProps) => {
  const {
    columns,
    data = [],
    serverSideDataSource = false,
    initialPageSize = 10,
    initialPageIndex = 0,
    pageCount = 0,
    total = 0,
    stickyHeader,
    customFilterTypes = {},
    debugging,
    loading,
    filtering,
    sorting,
    selection,
    pagination,
    onRowClick,
    fetchData, // Pass function to fetch data for server side operations
  } = props;
  const { classes, cx } = useStyles();
  const { css } = useCss();

  const tableOptions = useTable(
    {
      data,
      columns,
      defaultColumn,
      disableFilters: !filtering,
      disableSortBy: !sorting,

      manualFilters: serverSideDataSource,
      manualPagination: serverSideDataSource,
      manualSortBy: serverSideDataSource,

      autoResetFilters: !serverSideDataSource,
      autoResetPage: !serverSideDataSource,
      autoResetSortBy: !serverSideDataSource,
      autoResetSelectedRows: !serverSideDataSource,

      pageCount,
      filterTypes: { ...filterTypes, ...customFilterTypes } as any,
      initialState: { pageSize: initialPageSize, pageIndex: initialPageIndex },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    (hook) => selectionHook(hook, selection)
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy, filters },
  } = tableOptions;

  useEffect(() => {
    fetchData && fetchData({ pageIndex, pageSize, sortBy, filters });
  }, [sortBy, fetchData, pageIndex, pageSize, filters]);

  const handleRowClick = (_e: React.MouseEvent<HTMLButtonElement>, row: Row<object>) => {
    console.log('Row Selected: ', row);
    onRowClick && onRowClick(row);
  };

  const getPageRecordInfo = () => {
    const firstRowNum = pageIndex * pageSize + 1;
    const totalRows = serverSideDataSource ? total : rows.length;

    const currLastRowNum = (pageIndex + 1) * pageSize;
    const lastRowNum = currLastRowNum < totalRows ? currLastRowNum : totalRows;
    return `${firstRowNum} - ${lastRowNum} of ${totalRows}`;
  };

  const getPageCount = () => {
    const totalRows = serverSideDataSource ? total : rows.length;
    return Math.ceil(totalRows / pageSize);
  };

  const handlePageChange = (pageNum: number) => gotoPage(pageNum - 1);

  const renderHeader = () =>
    headerGroups.map((hg) => (
      <tr {...hg.getHeaderGroupProps()}>
        {hg.headers.map((column) => (
          <th
            className={cx(
              { [classes.sortableHeader]: column.canSort },
              { [css({ minWidth: column.cellMinWidth })]: column.cellMinWidth },
              { [css({ width: column.cellWidth })]: column.cellWidth }
            )}
            {...column.getHeaderProps(column.getSortByToggleProps({ title: undefined }))}
          >
            <Group noWrap position={column.align || 'apart'}>
              <div>{column.render('Header')}</div>
              <Group noWrap position="left">
                {column.canFilter ? column.render('Filter') : null}
                {column.canSort ? (
                  column.isSorted ? (
                    <ArrowUpIcon
                      className={classes.sortDirectionIcon}
                      style={{
                        transform: column.isSortedDesc ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  ) : (
                    <Icon icon={arrowUpDown} />
                  )
                ) : null}
              </Group>
            </Group>
          </th>
        ))}
      </tr>
    ));

  const renderRow = (_rows: Row<object>[]) =>
    _rows.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps({ onClick: (e) => handleRowClick(e, row) })}>
          {row.cells.map((cell) => (
            <td align={cell.column.align || 'left'} {...cell.getCellProps()}>
              {cell.render('Cell')}
            </td>
          ))}
        </tr>
      );
    });

  return (
    <div className={classes.root}>
      <LoadingOverlay visible={!!loading} />
      <div
        className={classes.tableContainer}
        style={{ height: pagination ? 'calc(100% - 44px)' : '100%' }}
      >
        {debugging && (
          <pre>
            <code>{JSON.stringify(filters, null, 2)}</code>
          </pre>
        )}

        <Table {...getTableProps()} highlightOnHover>
          <thead className={cx({ [classes.stickHeader]: stickyHeader })}>{renderHeader()}</thead>

          <tbody {...getTableBodyProps()}>{pagination ? renderRow(page) : renderRow(rows)}</tbody>
        </Table>
      </div>
      {pagination && getPageCount() > 1 && (
        <>
          <Divider mb="md" variant="dotted" />
          <Group position="left">
            <Text size="sm">Rows per page: </Text>
            <Select
              style={{ width: '72px' }}
              variant="filled"
              data={pageSizeOptions}
              value={`${pageSize}`}
              onChange={(pgSize) => setPageSize(Number(pgSize))}
            />
            <Divider orientation="vertical" />

            <Text size="sm">{getPageRecordInfo()}</Text>
            <Divider orientation="vertical" />

            <Pagination page={pageIndex + 1} total={getPageCount()} onChange={handlePageChange} />
          </Group>
        </>
      )}
    </div>
  );
};
