import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createRoot } from 'react-dom/client';
import Toast, { ToastType } from './Toast';

export interface ToastOptions {
  type: ToastType;
  content: string;
  duration?: number;
  onEnter?: () => void;
  onExited?: () => void;
}

export interface ToastManagerHandles {
  addToast: (toast: ToastOptions) => void;
}

export const ToastManager = forwardRef<ToastManagerHandles>((props, ref) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const addToast = useCallback((toast: ToastOptions) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  }, []);

  const removeToast = useCallback(() => {
    setToasts((prevToasts) => prevToasts.slice(1));
  }, []);

  useImperativeHandle(ref, () => ({
    addToast
  }));

  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          type={toast.type}
          content={toast.content}
          duration={toast.duration}
          onClose={removeToast}
          onEnter={() => toast?.onEnter?.()}
          onExited={() => toast?.onExited?.()}
        />
      ))}
    </>
  );
});

ToastManager.displayName = 'ToastManager';

const toastContainer = document.createElement('div');
document.body.appendChild(toastContainer);

const toastManagerRef = React.createRef<ToastManagerHandles>();
createRoot(toastContainer).render(<ToastManager ref={toastManagerRef} />);

export const toast = (options: ToastOptions) => {
  toastManagerRef.current?.addToast(options);
};

toast.info = (content: string, duration?: number) => {
  toast({ type: 'default', content, duration });
};

toast.success = (content: string, duration?: number) => {
  toast({ type: 'success', content, duration });
};

toast.warn = (content: string, duration?: number) => {
  toast({ type: 'warning' as ToastType, content, duration });
};

toast.error = (content: string, duration?: number) => {
  toast({ type: 'error', content, duration });
};
