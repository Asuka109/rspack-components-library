import './Button.css';
import { FC } from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'primary' | 'default' | 'ghost';
}

export const Button: FC<ButtonProps> = props => {
  const { children, type = 'default', ...rest } = props;
  return (
    <button className={`my-button my-button-${type}`} {...rest}>
      {children}
    </button>
  );
};
