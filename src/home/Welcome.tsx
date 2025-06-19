import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import {
  cancelFrame,
  frame,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import background from "../assets/imgs/welcome.jpeg";
import maskFile from "../assets/imgs/logo-pushodev.webp";

const Welcome = () => {
  const lenisRef = useRef<LenisRef>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref });
  const maskImage = useTransform(scrollYProgress, [0, 1], ["4000%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1.2, 1]);

  useEffect(() => {
    scrollYProgress.on("change", (v) => {
      console.log("scrollYProgress:", v.toFixed(3));
    });
  }, [scrollYProgress]);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div
        className="relative h-[200vh] w-full bg-black overflow-hidden"
        ref={ref}
      >
        <motion.div
          className="w-full h-screen fixed inset-0 z-0"
          style={{
            background: `url(${background})`,
            scale: scale,
            maskImage: `url(${maskFile})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: maskImage,
          }}
        ></motion.div>
      </div>
    </ReactLenis>
  );
};

export default Welcome;
