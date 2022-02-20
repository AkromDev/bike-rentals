import { Loader, Menu } from '@mantine/core';
import { Pencil1Icon, TrashIcon } from '@modulz/radix-icons';

type UsersActionMenuProps = {
  onDeleteClick: () => void;
  loading?: boolean;
};
export default function UsersActionMenu({ onDeleteClick, loading }: UsersActionMenuProps) {
  return (
    <Menu
      sx={{ zIndex: 9 }}
      onClick={(e) => e.stopPropagation()}
      size="xl"
      control={loading ? <Loader size="sm" /> : undefined}
    >
      <Menu.Item icon={<Pencil1Icon />}>Edit</Menu.Item>
      <Menu.Item color="red" icon={<TrashIcon />} onClick={onDeleteClick}>
        Delete
      </Menu.Item>
    </Menu>
  );
}
