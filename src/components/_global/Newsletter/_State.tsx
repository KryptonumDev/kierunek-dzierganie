import Button from '@/components/ui/Button';
import styles from './Newsletter.module.scss';
import { ErrorIcon, SuccessIcon } from '@/components/ui/Icons';
import { StatusProps } from './Newsletter.types';

const getIcon = (success: boolean) => (success ? <SuccessIcon /> : <ErrorIcon />);
const getHeading = (success: boolean) =>
  success ? 'Dziękujemy za zapis do <strong>newslettera</strong>' : 'Coś poszło <strong>nie tak</strong>';
const getParagraph = (success: boolean) =>
  success
    ? 'Od dawki fascynującej wiedzy dzieli Cię już tylko jeden krok. Sprawdź swojego maila i kliknij link z potwierdzeniem.'
    : 'Nie udało nam się zapisać Cię do naszego newslettera. Jeśli zależy Ci na subskrypcji, spróbuj ponownie!';

const State = ({
  success,
  setStatus,
}: {
  success: boolean | undefined;
  setStatus: React.Dispatch<React.SetStateAction<StatusProps>>;
}) => {
  return (
    success !== undefined && (
      <div
        className={styles['State']}
        data-success={success}
      >
        <h3>
          {getIcon(success)} <span dangerouslySetInnerHTML={{ __html: getHeading(success) }} />
        </h3>
        <p>{getParagraph(success)}</p>
        {success === false && (
          <Button
            type='button'
            onClick={() => setStatus({ sending: false, success: undefined })}
          >
            Spróbuj ponownie
          </Button>
        )}
      </div>
    )
  );
};

export default State;
