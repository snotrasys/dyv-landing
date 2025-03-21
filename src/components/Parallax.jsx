import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  motion,
  useViewportScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

function Parallax({
  children,
  offset = 50,
  clampInitial,
  clampFinal,
  className,
  variants,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

const [ClaimInir, setClaimInir] = useState(0)
const [ClaimFin, setClaimFin] = useState(0)

  const ref = useRef(null);

  const { scrollY } = useViewportScroll();

  const [initial, setinitial] = useState(0)
  const [final, setfinal] = useState(0)
  useEffect(() => {
    let initial_ = elementTop - clientHeight;
    let final_ = elementTop + offset;  
    setinitial(initial_)
    setfinal(final_)
  }, [elementTop, clientHeight,offset])
  
  useEffect(() => {
    let initial_ =clampInitial ? 0 : offset
    let final_ = clampFinal ? 0 : -offset    
    setClaimInir(initial_)
    setClaimFin(final_)
  }, [clampInitial, clampFinal,offset])

  const yRange = useTransform(
    scrollY,
    [initial, final],
    [ClaimInir,ClaimFin ],
  );
  const y = useSpring(yRange, { stiffness: 400, damping: 90 });

  useLayoutEffect(() => {    
    const element = ref.current;
    const onResize = () => {
      setElementTop(
        element.getBoundingClientRect().top + window.scrollY ||
          window.pageYOffset,
      );
      setClientHeight(window.innerHeight);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [ref]);

  // Don't parallax if the user has "reduced motion" enabled
  if (prefersReducedMotion) {
    return children;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export default Parallax;