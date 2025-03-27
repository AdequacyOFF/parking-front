import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, Modal} from '@gravity-ui/uikit';

import './FormModal.scss';
import {Xmark} from '@gravity-ui/icons';

const b = block('form-modal');

interface FormModalProps {
  width?: string | number;
  title?: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  title,
  description,
  open,
  onClose,
  actions,
  children,
  width
}) => {
  return (
    <Modal open={open} onClose={onClose} className='modal'>
      <div className={b()} style={{ width }}>
        {title
          ? <div className={b('header')}>
              <div>
                <div className="title">{title}</div>
                <div className="description">{description}</div>
              </div>
              <Button 
                size="l" 
                view="normal" 
                onClick={onClose}
                style={{
                  marginLeft: 20
                }}
              >
                <Icon data={Xmark} size={18} />
              </Button>
            </div>
          : null
        }
        <div className={b('content')}>{children}</div>
        {actions ? <div className={b('actions')}>{actions}</div> : null}
      </div>
    </Modal>
  );
};
