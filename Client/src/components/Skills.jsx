import { motion } from 'framer-motion';
import { 
  SiReact, SiNodedotjs, SiExpress, SiMysql, 
  SiJavascript, SiHtml5, SiCss, SiTailwindcss,
  SiGit, SiMongodb
} from 'react-icons/si';

const skills = [
  { name: 'React', icon: SiReact, level: 90, color: '#61DAFB' },
  { name: 'Node.js', icon: SiNodedotjs, level: 85, color: '#68A063' },
  { name: 'Express', icon: SiExpress, level: 80, color: '#808080' },
  { name: 'MySQL', icon: SiMysql, level: 75, color: '#00758F' },
  { name: 'JavaScript', icon: SiJavascript, level: 95, color: '#F7DF1E' },
  { name: 'HTML5', icon: SiHtml5, level: 95, color: '#E44D26' },
  { name: 'CSS3', icon: SiCss, level: 90, color: '#1572B6' },
  { name: 'Tailwind', icon: SiTailwindcss, level: 85, color: '#38B2AC' },
  { name: 'Git', icon: SiGit, level: 80, color: '#F1502F' },
  { name: 'MongoDB', icon: SiMongodb, level: 70, color: '#4DB33D' },
];

// Duplicate array for seamless infinite scroll
const scrollingSkills = [...skills, ...skills, ...skills];

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Tech <span className="gradient-text">Stack</span>
        </motion.h2>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap hover:pause">
            {scrollingSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="glass p-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px] mx-3 transition-all duration-300 hover:scale-105 hover:shadow-xl group relative"
              >
                <skill.icon className="text-5xl mb-2" style={{ color: skill.color }} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skill.name}
                </span>
                {/* Progress Bar (hidden by default, appears on hover) */}
                <div className="absolute -bottom-2 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className='gradient-text'>Proficiency</span>
                    <span className='text-'>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
    </section>
  );
};

export default Skills;