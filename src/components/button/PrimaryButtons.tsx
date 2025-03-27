import {Button, ButtonProps} from '@gravity-ui/uikit';

import './Buttons.scss';

export const PrimaryButton: React.FC<ButtonProps> = ({children, ...props}) => (
  <Button className="primary-button" {...props}>
    {children}
  </Button>
);
