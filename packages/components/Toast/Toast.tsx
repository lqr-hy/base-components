import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Transition } from '../Transition';
import { createNamespace } from '@xb-onepiece/utils';

const toastBem = createNamespace('toast');

export type ToastType = 'default' | 'success' | 'warning' | 'error';

export interface ToastProps {
  type: ToastType;
  content: string;
  style?: React.CSSProperties;
  duration?: number; // Duration in milliseconds
  onClose?: () => void;
  onEnter?: () => void;
  onExited?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  type,
  content,
  duration = 2000,
  onClose,
  onEnter,
  onExited,
  style
}) => {
  const [visible, setVisible] = useState(true);
  const nodeRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <Transition
      in={visible}
      timeout={500}
      classNames="toast"
      onEnter={onEnter}
      onExited={onExited}
      nodeRef={nodeRef}
      unmountOnExit
    >
      <div
        style={style}
        ref={nodeRef}
        className={classNames(toastBem.b('container'), `${toastBem.be('container', type)}`)}
      >
        {content}
      </div>
    </Transition>
  );
};

export default Toast;
