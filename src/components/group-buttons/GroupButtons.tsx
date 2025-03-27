import React from 'react';
import block from 'bem-cn-lite';
import './GroupButtons.scss';

const b = block('group-btns');

interface GroupButtonsProps {
    align?: string;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const GroupButtons: React.FC<GroupButtonsProps> = ({
    children,
    fullWidth = true,
    align = 'center',
}) => {
    return (
        <div
            className={b()}
            style={{
                alignItems: align,
                width: fullWidth ? '100%' : 'unset',
            }}
        >
            {children}
        </div>
    );
};
