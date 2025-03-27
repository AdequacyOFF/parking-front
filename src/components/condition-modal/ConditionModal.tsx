import React from 'react';
import block from 'bem-cn-lite';
import {Button, Divider, Modal} from '@gravity-ui/uikit';

import './ConditionModal.scss';
import { PrimaryButton } from '../button';
import { Stack } from '@mui/material';

const b = block('condition-modal');

interface ConditionModalProps {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
}

export const ConditionModal: React.FC<ConditionModalProps> = ({
  open,
  onOk,
  onClose,
}) => {
  return (
    <Modal open={open} onClose={onClose} className='modal'>
      <div className={b()}>
        <p className='fs17-primary-bold'>
          Вы действительно хотите выйти из аккаунта?
        </p>
        <Divider />
        <Stack 
          px={4}
          pb={4}
          pt={2}
          spacing={1}
          width='100%' 
          direction='row' 
          justifyContent='flex-end'
        >
          <Button view='flat' size='l' onClick={onClose}>
            Отменить
          </Button>
          <PrimaryButton onClick={onOk} size='l'>
            Выйти
          </PrimaryButton>
        </Stack>
      </div>
    </Modal>
  );
};
