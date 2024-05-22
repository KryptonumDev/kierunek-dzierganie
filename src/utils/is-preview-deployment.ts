export const isProductionDeployment = process.env.NODE_ENV === 'production';
export const isPreviewDeployment = process.env.VERCEL_ENV === 'preview' || !isProductionDeployment;
