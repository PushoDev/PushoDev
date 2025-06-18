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
  const scale = useTransform(scrollYProgress, [0, 1], [0, 10]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      console.log("scrollYProgress:", v.toFixed(3));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  console.log(background);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div className="relative h-[200vh] w-full overflow-hidden" ref={ref}>
        <motion.div
          className="w-full h-screen fixed inset-0 z-0"
          style={{
            background: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: `url(${maskFile})`,
            maskSize: "cover",
            maskPosition: "center",
          }}
        ></motion.div>
      </div>
    </ReactLenis>
  );
};

export default Welcome;
