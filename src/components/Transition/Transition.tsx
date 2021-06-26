import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'

type Animation =
  | 'zoom-in-top'
  | 'zoom-in-left'
  | 'zoom-in-right'
  | 'zoom-in-bottom'

// 4.2.4之后就不能在使用 extends CSSTransitionProps
interface TransitionProps extends CSSTransitionProps {
  animation?: Animation
}
const Transition: React.FC<TransitionProps> = (props) => {
  const { children, animation, classNames, ...restProps } = props
  return (
    <CSSTransition className={classNames ? classNames : animation} {...restProps}>
      {children}
    </CSSTransition>
  )
}

Transition.defaultProps = {
  unmountOnExit: true,
  appear: true
}

export default Transition
