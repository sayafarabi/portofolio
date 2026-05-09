import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { personalInfo } from "../data/data";
import { fadeIn, staggerContainer } from "../animations";

const Contact = () => {
  const [state, handleSubmit] = useForm("YOUR_FORMSPREE_ID"); // Ganti dengan ID Formspree Anda
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 bg-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Hubungi <span className="text-neon">Saya</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Punya pertanyaan atau ingin bekerja sama? Jangan ragu untuk mengirim
            pesan.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          {/* Contact Info */}
          <motion.div
            variants={fadeIn("right", "spring", 0, 0.8)}
            className="space-y-6"
          >
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">
                Informasi Kontak
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <FiMail className="text-neon text-xl" />
                  <span>rafifarabi21@email.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-neon text-xl" />
                  <span>Bogor, Indonesia</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-neon text-xl" />
                  <span>+62 812-3456-7890</span>
                </div>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 text-2xl">
              {personalInfo.socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon transition-colors"
                  whileHover={{ scale: 1.2, y: -3 }}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeIn("left", "spring", 0.3, 0.8)}>
            <form
              onSubmit={handleSubmit}
              className="glass p-6 rounded-2xl border border-white/5 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  placeholder="email@example.com"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors resize-none"
                  placeholder="Tulis pesan Anda..."
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                />
              </div>
              <motion.button
                type="submit"
                disabled={state.submitting}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  state.submitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-neon text-dark hover:bg-opacity-90"
                }`}
                whileHover={{ scale: state.submitting ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {state.submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Pesan"
                )}
              </motion.button>
              {state.succeeded && (
                <p className="text-green-400 text-center mt-3">
                  Pesan berhasil dikirim! Terima kasih.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
