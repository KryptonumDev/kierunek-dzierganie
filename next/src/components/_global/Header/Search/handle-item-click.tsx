export default function handleItemClick(
  passedRef: React.RefObject<HTMLInputElement>,
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
) {
  console.log(passedRef);
  if (passedRef.current) {
    passedRef.current.value = '';
    setIsSearching(false);
  }
  return;
}
