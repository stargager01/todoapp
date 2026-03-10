export function Login({ onSignIn }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: 360
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 24, color: '#1e293b' }}>TODO 앱</h1>
        <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: 14 }}>
          Google 계정으로 로그인하면<br />어디서든 할 일을 확인할 수 있어요
        </p>
        <button
          onClick={onSignIn}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 24px', borderRadius: 8, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600,
            color: '#1e293b', width: '100%', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
          />
          Google로 로그인
        </button>
      </div>
    </div>
  );
}
