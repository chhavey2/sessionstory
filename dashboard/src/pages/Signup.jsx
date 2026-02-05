import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Signup page redirects to Login page which now contains both login and signup in a swipeable stack
export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login with state to show signup card
    navigate('/login', { state: { showSignup: true }, replace: true });
  }, [navigate]);

  return null;
}
