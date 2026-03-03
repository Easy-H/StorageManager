import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    // 3초 후 자동으로 사라짐
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  }, []);

  return { toast, showToast };
};