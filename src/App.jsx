import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { TodoApp } from './components/TodoApp';

function App() {
  const { user, loading, signIn, logOut } = useAuth();

  // 인증 상태 확인 중 (자동 로그인 체크)
  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', color: '#94a3b8', fontSize: 16
      }}>
        로딩 중...
      </div>
    );
  }

  // 비로그인 → 로그인 화면
  if (!user) {
    return <Login onSignIn={signIn} />;
  }

  // 로그인 → Todo 화면
  return <TodoApp user={user} onLogOut={logOut} />;
}

export default App;
