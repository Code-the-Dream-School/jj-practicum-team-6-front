import React from 'react';
import styles from './PrimaryButton.module.css';

const PrimaryButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      className={buttonClasses}
      disabled = {disabled}
      onClick={onClick}
      {...props}
      >
        {children}
      </button>
      );
};

export default PrimaryButton;