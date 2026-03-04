import React, { useState, useEffect } from 'react';

const Toast = ({ message, show }) => {
  // 실제 DOM에서 렌더링할지 결정하는 상태
  const [render, setRender] = useState(show);
  // 애니메이션 클래스를 결정하는 상태
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setRender(true);
      setIsExiting(false);
    } else {
      // show가 false가 되면 바로 끄지 않고 퇴장 애니메이션 시작
      setIsExiting(true);
      // 애니메이션 시간(0.3초) 후에 렌더링 중단
      const timer = setTimeout(() => {
        setRender(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!render) return null;

  return (
    <div 
      className={`toast-container ${isExiting ? 'toast-fade-out' : 'toast-fade-in'}`}
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)', // transform은 CSS 클래스에서 애니메이션과 함께 관리됨
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '25px',
        fontSize: '14px',
        zIndex: 3000,
        whiteSpace: 'nowrap'
      }}
    >
      {message}
    </div>
  );
};

export default Toast;