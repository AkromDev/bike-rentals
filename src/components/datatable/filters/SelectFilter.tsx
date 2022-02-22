import { ActionIcon, Popover, Select } from '@mantine/core';
import { FilterIcon } from '@primer/octicons-react';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';

const SelectFilter = (props: any) => {
  const {
    column: { filterValue, setFilter, preFilteredRows, id },
  } = props;
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<null | string>('');

  const options = useMemo(() => {
    const _options = new Set();
    preFilteredRows.forEach((row: Row) => {
      _options.add('');
      if (row.values[id]) {
        _options.add(row.values[id]);
      }
    });
    //@ts-ignore
    return [..._options.values()];
  }, [id, preFilteredRows]);

  const handleClose = () => {
    setValue('');
    setOpened(false);
  };

  useEffect(() => {
    setFilter(value);
    setOpened(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Popover
      sx={{ zIndex: 999 }}
      target={
        <ActionIcon
          variant={filterValue ? 'light' : 'hover'}
          color={filterValue ? 'blue' : 'gray'}
          onClick={() => setOpened((o) => !o)}
        >
          <FilterIcon />
        </ActionIcon>
      }
      opened={opened}
      onClose={handleClose}
      onClick={(e) => e.stopPropagation()}
      position="bottom"
      transition="scale-y"
    >
      <Select
        data={options.map((op) => ({ value: op, label: op || 'All' }))}
        value={value}
        onChange={setValue}
        sx={{ marginBottom: 20, marginTop: 20 }}
      />
    </Popover>
  );
};

export default SelectFilter;
