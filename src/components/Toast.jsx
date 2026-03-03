import React from 'react';

const Toast = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="toast-container" style={{
      position: 'fixed',
      bottom: '100px', // 하단 탭(65px)과 플로팅 버튼보다 위에 위치
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '25px',
      fontSize: '14px',
      zIndex: 3000,
      whiteSpace: 'nowrap',
      animation: 'fadeUp 0.3s ease-out'
    }}>
      {message}
    </div>
  );
};

export default Toast;