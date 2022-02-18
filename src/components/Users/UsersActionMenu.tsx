import { Menu } from '@mantine/core';
import { Pencil1Icon, TrashIcon } from '@modulz/radix-icons';
import { Row } from 'react-table';

export default function UsersActionMenu({ row }: { row: Row<object> }) {
  return (
    <Menu sx={{ zIndex: 999 }} onClick={(e) => e.stopPropagation()} size="xl">
      <Menu.Item icon={<Pencil1Icon />} onClick={() => alert(`Edit ${row.id}`)}>
        Edit
      </Menu.Item>
      <Menu.Item color="red" icon={<TrashIcon />}>
        Delete
      </Menu.Item>
    </Menu>
  );
}
