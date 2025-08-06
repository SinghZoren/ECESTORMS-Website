// Environment configuration helper
export const isAWSConfigured = () => {
  return !!(
    process.env.AWS_BUCKET_NAME && 
    process.env.AWS_ACCESS_KEY_ID && 
    process.env.AWS_SECRET_ACCESS_KEY && 
    process.env.AWS_REGION
  );
};

export const getAWSConfigStatus = () => {
  const missing = [];
  
  if (!process.env.AWS_BUCKET_NAME) missing.push('AWS_BUCKET_NAME');
  if (!process.env.AWS_ACCESS_KEY_ID) missing.push('AWS_ACCESS_KEY_ID');
  if (!process.env.AWS_SECRET_ACCESS_KEY) missing.push('AWS_SECRET_ACCESS_KEY');
  if (!process.env.AWS_REGION) missing.push('AWS_REGION');
  
  return {
    isConfigured: missing.length === 0,
    missing,
    message: missing.length > 0 
      ? `Missing AWS environment variables: ${missing.join(', ')}`
      : 'AWS is properly configured'
  };
};

export const AWS_CONFIG = {
  BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  REGION: process.env.AWS_REGION || 'us-east-1'
};