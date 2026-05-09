import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section
      id={id}
      ref={ref}
      className={`py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export default Section;
