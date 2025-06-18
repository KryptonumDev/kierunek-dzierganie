import { ErrorIcon, SuccessIcon } from '@/components/ui/Icons';
import styles from './ContactForm.module.scss';
import Button from '@/components/ui/Button';
import type { StatusProps } from './ContactForm.types';

const getIcon = (success: boolean) => (success ? <SuccessIcon /> : <ErrorIcon />);
const getHeading = (success: boolean) => (success ? 'Dziękujemy za wiadomość!' : 'Nie udało się wysłać wiadomości');
const getParagraph = (success: boolean) =>
  success
    ? 'Odezwiemy się najszybciej, jak to możliwe!'
    : 'Pojawił się problem z serwerem. Odczekaj 10 sekund i spróbuj ponownie.';

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
          {getIcon(success)} <span>{getHeading(success)}</span>
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
