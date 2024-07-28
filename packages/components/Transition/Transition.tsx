import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

export type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-right' | 'zoom-in-bottom';

export type TransitionProps = CSSTransitionProps & {
  animation?: AnimationName;
};

const Transition: React.FC<TransitionProps> = (props) => {
  const {
    children,
    classNames,
    animation,
    unmountOnExit = true,
    appear = true,
    ...restProps
  } = props;
  return (
    <CSSTransition
      classNames={classNames ? classNames : animation}
      unmountOnExit={unmountOnExit}
      appear={appear}
      {...restProps}
    >
      {children}
    </CSSTransition>
  );
};

export default Transition;
