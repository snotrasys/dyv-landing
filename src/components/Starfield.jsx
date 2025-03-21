// import Particles from "react-tsparticles";
// import { loadSlim } from "tsparticles-slim"; // loads tsparticles-slim
//import { loadFull } from "tsparticles"; // loads tsparticles
// import { useCallback, useMemo } from "react";
// import { useReducedMotion } from "framer-motion";
import clsx from "clsx";

// tsParticles Repository: https://github.com/matteobruni/tsparticles
// tsParticles Website: https://particles.js.org/
const ParticlesComponent = (props) => {
  // const shouldReduceMotion = useReducedMotion();
  // // using useMemo is not mandatory, but it's recommended since this value can be memoized if static
  // const options = useMemo(() => {
  //   // using an empty options object will load the default options, which are static particles with no background and 3px radius, opacity 100%, white color
  //   // all options can be found here: https://particles.js.org/docs/interfaces/Options_Interfaces_IOptions.IOptions.html
  //   return {
  //     background: {

  //     },
  //     fullScreen: {
  //       enable: true, // enabling this will make the canvas fill the entire screen, it's enabled by default
  //       zIndex: -1, // this is the z-index value used when the fullScreen is enabled, it's 0 by default
  //     },
  //     fpsLimit: 60,
  //     particles: {
  //       number: {
  //         value: shouldReduceMotion ? 20 : 100,
  //         density: {
  //           enable: true,
  //           value_area: shouldReduceMotion ? 2000 : 800,
  //         },
  //       },
  //       color: {
  //         value: '#ffffff',
  //       },
  
  //       opacity: {
  //         value: 1,
  //         random: true,
  //         anim: {
  //           enable: true,
  //           speed: shouldReduceMotion ? 0 : 2,
  //           opacity_min: 0,
  //           sync: false,
  //         },
  //       },
  //       size: {
  //         value: 3,
  //         random: true,
  //         anim: {
  //           enable: true,
  //           speed: shouldReduceMotion ? 0 : 2,
  //           size_min: 0,
  //           sync: false,
  //         },
  //       },
  //       line_linked: {
  //         enable: false,
  //       },
  //       move: {
  //         enable: true,
  //         speed: shouldReduceMotion ? 0.5 : 2,
  //         direction: 'none',
  //         random: true,
  //         straight: false,
  //         out_mode: 'out',
  //         bounce: false,
  //         attract: {
  //           enable: false,
  //           rotateX: 600,
  //           rotateY: 1200,
  //         },
  //       },
  //     },
  //     detectRetina: true,
  //   };
  // }, []);

  // // useCallback is not mandatory, but it's recommended since this callback can be memoized if static
  // const particlesInit = (engine) => {
  //   loadSlim(engine);
  //   // loadFull(engine); // for this sample the slim version is enough, choose whatever you prefer, slim is smaller in size but doesn't have all the plugins and the mouse trail feature
  // }

  // setting an id can be useful for identifying the right particles component, this is useful for multiple instances or reusable components
  return( 
  <div
  aria-hidden="true"
  className={clsx(
    "fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#39004d] to-[#000]",
    props.className
  )}
>
{/* <Particles id={props.id} init={particlesInit} options={options} />; */}
{props.children}
</div>
  )

};

export default ParticlesComponent;