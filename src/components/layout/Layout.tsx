import React from 'react';
import block from 'bem-cn-lite';

import './Layout.scss';
import {AppBar} from '../app-bar';

const b = block('layout');

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className={b()}>
            <AppBar />
            {children}
        </div>
    );
};
