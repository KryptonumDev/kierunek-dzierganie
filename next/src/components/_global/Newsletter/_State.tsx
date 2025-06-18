import Button from '@/components/ui/Button';
import styles from './Newsletter.module.scss';
import { ErrorIcon, SuccessIcon } from '@/components/ui/Icons';
import { StatusProps } from './Newsletter.types';

const getIcon = (success: boolean) => (success ? <SuccessIcon /> : <ErrorIcon />);
const getHeading = (success: boolean) =>
  success ? 'Już prawie <strong>gotowe</strong>!' : 'Coś poszło <strong>nie tak</strong>';
const getParagraph = (success: boolean) =>
  success
    ? 'Sprawdź swoją skrzynkę pocztową i potwierdź adres e-mail, abym mogła się z Tobą kontaktować. Pamiętaj, aby sprawdzić foldery SPAM, Oferty lub Społeczności, bo tam lubią chować się maile. Jeśli już wcześniej zapisałaś się do naszego newslettera, nie musisz nic robić bo jesteś na liście :)'
    : 'Nie udało nam się zapisać Cię do mojego newslettera. Spróbuj ponownie!';

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
