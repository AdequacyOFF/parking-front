import React from 'react';
import block from 'bem-cn-lite';
import { Box } from '@mui/material';


import './ImgWrapper.scss';


const b = block('img-wrapper');

interface ImgWrapperProps {
  src: string,
  width: number | string,
  height: number | string,
  select?: boolean,
  onClick?: () => void,
}

export const ImgWrapper: React.FC<ImgWrapperProps> = ({
  src,
  height,
  width,
  select,
  onClick
}) => (
  <Box 
    className={b({ select })} 
    width={width} 
    height={height}
    onClick={onClick}
  >
    <img src={src} alt=""/>
  </Box>
);
