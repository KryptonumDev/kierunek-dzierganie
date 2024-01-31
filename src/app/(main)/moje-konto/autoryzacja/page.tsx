import Authorization from '@/components/_dashboard/temporary-authorization/authorization';
import Markdown from '@/components/ui/markdown';

const AuthorizationPage = async () => {
  const registerTitle = <Markdown.h1>**Zarejestruj się**</Markdown.h1>;
  const registerText = <Markdown>Dołącz do naszej **twórczej społeczności** i razem z nami rozwijaj swoją kreatywność!</Markdown>;
  const loginTitle = <Markdown.h1>**Zaloguj się**</Markdown.h1>;
  const loginText = <Markdown>Przejdź do swojego konta, aby uzyskać **dostęp do kursu** lub sprawdzić status zamówienia.</Markdown>;

  return (
    <Authorization
      registerTitle={registerTitle}
      loginTitle={loginTitle}
      registerText={registerText}
      loginText={loginText}
    />
  );
};
 
export default AuthorizationPage;
