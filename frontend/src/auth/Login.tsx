import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const { loginWithGoogleIdToken } = useAuth();
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        await loginWithGoogleIdToken(resp.credential);
        window.location.href = '/';
      },
    });
    if (btnRef.current) {
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
      });
    }
  }, [loginWithGoogleIdToken]);

  return (
    <div style={{ display:'grid', placeItems:'center', height:'100vh', gap:16 }}>
      <h1>Mental Health Tracker</h1>
      <div ref={btnRef} />
    </div>
  );
}
