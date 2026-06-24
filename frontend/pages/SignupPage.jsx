import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from '../components/api';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      alert('회원가입 성공! 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div className="auth-field">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit-btn">회원가입</button>
        </form>
        <p className="auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;