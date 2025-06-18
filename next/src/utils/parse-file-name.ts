export default function parseFileName(fileName: string) {
  return fileName
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^(.)/, (match) => match.toUpperCase());
}
