import { Menu } from '@mantine/core';
import { EyeIcon } from '@primer/octicons-react';

type ReserveesActionMenuProps = {
  onViewReservations: () => void;
};
export default function ReserveesActionMenu({ onViewReservations }: ReserveesActionMenuProps) {
  return (
    <Menu sx={{ zIndex: 9 }} onClick={(e) => e.stopPropagation()} size="xl">
      <Menu.Item icon={<EyeIcon />} onClick={onViewReservations}>
        View reservations
      </Menu.Item>
    </Menu>
  );
}
