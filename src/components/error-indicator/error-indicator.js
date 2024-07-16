import React from 'react';
import { Alert } from 'antd';

const ErrorIndicator = () => {
  const className = {
    margin: '0 auto',
    maxWidth: '470px',
  };
  return (
    <Alert message="Error" description="Something went wrong!" type="error" style={className} showIcon />
  );
};
export default ErrorIndicator;
