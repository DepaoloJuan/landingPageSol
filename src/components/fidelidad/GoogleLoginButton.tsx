import { GoogleLogin } from '@react-oauth/google';
import { loginGoogle, guardarToken } from '../../lib/fidelidadApi';

interface GoogleLoginButtonProps {
  onLogueada: () => void;
  onError: (mensaje: string) => void;
}

export function GoogleLoginButton({ onLogueada, onError }: GoogleLoginButtonProps) {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        if (!credentialResponse.credential) {
          onError('No se pudo iniciar sesión con Google.');
          return;
        }
        try {
          const data = await loginGoogle(credentialResponse.credential);
          guardarToken(data.token);
          onLogueada();
        } catch {
          onError('No se pudo iniciar sesión. Probá de nuevo en un momento.');
        }
      }}
      onError={() => onError('No se pudo iniciar sesión con Google.')}
      theme="outline"
      size="large"
      shape="pill"
      text="continue_with"
    />
  );
}
