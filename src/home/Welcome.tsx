"use Client";

import ReactLenis from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
// Imagenes
import background from "../assets/imgs/welcome.jpeg";
import mascara from "../assets/imgs/full-logo.webp";

export const Welcome = () => {
  const lenisRef = useRef<LenisRef>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }
    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const mascaraImage = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 0.9, 1],
    ["2000%", "1000%", "350%", "10%", "0%"]
  );
  const scalePortfolio = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1.4, 1]);
  const textOpaco = useTransform(scrollYProgress, [0.3, 0.8, 1], [0, 0.3, 1]);
  const portfolioReal = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.8],
    [0, 0.2, 0.4, 1]
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
        <div
          className="relative h-[200vh] w-full bg-black overflow-hidden"
          ref={ref}
        >
          <motion.div
            className="w-full h-screen fixed inset-0 z-5"
            style={{
              background: `url(${background}) center/cover no-repeat`,
              scale: scalePortfolio,
              maskImage: `url(${mascara})`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: mascaraImage,
            }}
          ></motion.div>
          <motion.div
            className="w-full h-screen fixed inset-0 z-10 pointer-events-none"
            style={{
              backgroundColor: "white",
              scale: scale,
              opacity: textOpaco,
              maskImage: `url(${mascara})`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: mascaraImage,
            }}
          ></motion.div>
          <motion.div
            className="w-full h-screen fixed inset-0 z-0 animate-pulse"
            style={{
              background: `url(${background}) center/cover no-repeat`,
              scale: portfolioReal,
              opacity: portfolioReal,
            }}
          ></motion.div>
        </div>
      </ReactLenis>
    </>
  );
};

export default Welcome;
