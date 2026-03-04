import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthPage = (notice) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !agreed) return notice("약관에 동의해주세요.");
    try {
      if (isSignUp) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { notice(err.message); }
  };

  return (
    <div className="org-container">
      <div className='app-header'>
      <h2>🛒 Storage Manager</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-stack">
        <p style={{textAlign:"left"}}>이메일</p>
        <input type="email" placeholder="이메일" required onChange={e => setEmail(e.target.value)} className="input-basic" />
        <p style={{textAlign:"left"}}>비밀번호</p>
        <input type="password" placeholder="비밀번호" required onChange={e => setPassword(e.target.value)} className="input-basic" />
        {isSignUp && (
          <div className="checkbox-row">
            <input type="checkbox" id="ag" onChange={e => setAgreed(e.target.checked)} />
            <label htmlFor="ag" style={{fontSize: '12px', marginLeft: '5px'}}> 이용약관 동의</label>
          </div>
        )}
        <button type="submit" className="primary-button">{isSignUp ? "가입하기" : "로그인"}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="link-button">
        {isSignUp ? "로그인으로 이동" : "회원가입 하기"}
      </button>
    </div>
  );
};

export default AuthPage;