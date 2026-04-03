import { motion } from 'framer-motion';
import { 
  SiReact, SiNodedotjs, SiExpress, SiMysql, 
  SiJavascript, SiHtml5, SiCss , SiTailwindcss,
  SiGit, SiMongodb
} from 'react-icons/si';

const skills = [
  { name: 'React', icon: SiReact, level: 90, color: '#61DAFB' },
  { name: 'Node.js', icon: SiNodedotjs, level: 85, color: '#68A063' },
  { name: 'Express', icon: SiExpress, level: 80, color: '#808080' },
  { name: 'MySQL', icon: SiMysql, level: 75, color: '#00758F' },
  { name: 'JavaScript', icon: SiJavascript, level: 95, color: '#F7DF1E' },
  { name: 'HTML5', icon: SiHtml5, level: 95, color: '#E44D26' },
  { name: 'CSS3', icon: SiCss , level: 90, color: '#1572B6' },
  { name: 'Tailwind', icon: SiTailwindcss, level: 85, color: '#38B2AC' },
  { name: 'Git', icon: SiGit, level: 80, color: '#F1502F' },
  { name: 'MongoDB', icon: SiMongodb, level: 70, color: '#4DB33D' },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Tech <span className="gradient-text">Stack</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="glass p-6 rounded-2xl flex flex-col items-center"
            >
              <skill.icon className="text-5xl mb-3" style={{ color: skill.color }} />
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">{skill.name}</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;