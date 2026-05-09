import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiSearch, FiX } from "react-icons/fi";
import { projects } from "../data/data";
import { fadeIn, staggerContainer } from "../animations";

// Komponen Modal Detail Proyek
const ProjectModal = ({ project, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-neon hover:text-dark transition-colors z-10"
        >
          <FiX size={20} />
        </button>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-60 object-cover"
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {project.title}
          </h3>
          <p className="text-gray-300 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-neon/20 text-neon border border-neon/30"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-neon text-dark rounded-full hover:bg-neon/90 transition-all text-sm font-semibold"
            >
              <FiExternalLink /> Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 border border-neon text-neon rounded-full hover:bg-neon/10 transition-all text-sm font-semibold"
            >
              <FiGithub /> Source Code
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // Gabungkan semua kategori dari tech yang ada
  const allTechs = useMemo(() => {
    const techs = new Set();
    projects.forEach((p) => p.tech.forEach((t) => techs.add(t)));
    return [
      "All",
      "React",
      "C++",
      ...Array.from(techs).filter((t) => t !== "React" && t !== "C++"),
    ];
  }, []);

  // Filter berdasarkan kategori + search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory =
        activeFilter === "All" ||
        project.tech.some((t) => t.includes(activeFilter));
      const matchSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech.some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchCategory && matchSearch;
    });
  }, [activeFilter, searchTerm]);

  // Handler klik tag untuk langsung filter
  const handleTagClick = (tag) => {
    setActiveFilter(tag);
    setSearchTerm("");
  };

  return (
    <section id="projects" className="py-20 bg-dark relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-neon/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="h-1 w-20 bg-gradient-to-r from-neon to-transparent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Project <span className="text-neon">Portfolio</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Kumpulan proyek yang telah saya kerjakan, mulai dari web development
            hingga pemrograman C++.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Cari proyek atau teknologi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-full text-white text-sm focus:outline-none focus:border-neon/50 transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Filter Tabs dengan animasi */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {allTechs.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-neon text-dark shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                    : "border border-gray-600 text-gray-300 hover:border-neon"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Counter */}
          <p className="text-gray-500 text-sm mt-4">
            Menampilkan {filteredProjects.length} dari {projects.length} proyek
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-neon/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-4">
                      <div className="flex gap-2">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-neon rounded-full text-dark hover:bg-white transition-colors"
                        >
                          <FiExternalLink size={18} />
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-white/10 rounded-full text-white hover:bg-neon hover:text-dark transition-colors"
                        >
                          <FiGithub size={18} />
                        </a>
                      </div>
                      <span className="text-xs text-white/80 font-mono">
                        {project.tech.length} tech
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((tech, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tech);
                          }}
                          className="text-xs px-2 py-1 rounded-full bg-neon/10 text-neon border border-neon/20 hover:bg-neon/30 transition-colors cursor-pointer"
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 text-lg">
                  Tidak ada proyek yang cocok dengan filter atau pencarian.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchTerm("");
                  }}
                  className="mt-4 px-5 py-2 border border-neon text-neon rounded-full hover:bg-neon/10 transition-all text-sm"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
