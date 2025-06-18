export const formatBytes = (bytes: number) => {
  if (typeof bytes !== 'number') {
    return;
  }
  const KB = bytes / 1024;
  const MB = KB / 1024;
  if (MB >= 1) {
    return MB.toFixed(2) + 'MB';
  } else if (KB >= 1) {
    return KB.toFixed(2) + 'KB';
  } else {
    return bytes + 'B';
  }
};
