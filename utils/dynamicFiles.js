const fs = require('fs')
const path = require('path')

let enabledPages = []

const getEnabledPages = (content) => {
  return Object.keys(content.pages).reduce((acc, key) => {
    return content.pages[key].enabled ? [...acc, key] : acc
  }, [])
}

const generateMainFile = (content) => {
  let structure
  if (content.page === 'single') {
    structure = (
      `<React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>`
    )
  } else if (content.page === 'multi') {
    structure = (
      `<React.StrictMode>
    <Router>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Router>
  </React.StrictMode>`
    )
  }

  return `import React from 'react'
import ReactDOM from 'react-dom/client'
${ content.page === 'multi' ? "import { BrowserRouter as Router } from 'react-router-dom'" : ''}
import App from './App.jsx'

import { AppContextProvider } from './contexts/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  ${structure}
)
`
}

const generateAppFile = (content) => {
  let structure 
  if (content.page === 'single') {
    structure = (
      `{enabledPages.map(
        page => <div key={page}>{pagesComponent[page]}</div>
      )}`
    )
  } else if (content.page === 'multi') {
    structure = (
      `<div>
        <Routes>
          <Route path="/" element={<About />} />
          {enabledPages.map(page => <Route key={page} path={page} element={pagesComponent[page]} />)}
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </div>`
    )
  }

  return `${ content.page === 'multi' ? "import { Routes, Route } from 'react-router-dom'" : ''}
import { ThemeContextProvider } from './contexts/ThemeContext'
import './index.css'

import About from './components/About'
import Projects from './components/Projects'
import Blogs from './components/Blogs'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import AboutMeCard from './components/AboutMeCard'

const App = () => {
  const enabledPages = ${JSON.stringify(enabledPages)}

  const pagesComponent = {
    about: <About />,
    projects: <Projects />,
    blog: <Blogs />,
    contact: <Contact />
  }

  return (
    <ThemeContextProvider>
      <div className="main ${content.page} text-sm md:text-base lg:text-base max-w-[480px] pb-[70px] md:py-[70px] flex flex-col md:flex-row md:gap-[50px] md:max-w-[700px] lg:p-[70px] lg:max-w-[1180px] mx-auto">
        <div id="about" className="nav-section pt-[24px] md:pt-0 pb-0 mx-auto shrink-0 md:min-w-[255px] md:w-[35%] lg:w-[30%]">
          <AboutMeCard />
        </div>
        <div className="relative w-full">
          <Navbar />
          ${structure}
        </div>
      </div>
    </ThemeContextProvider>
  )
}

export default App

`
}

const generateAboutFile = (sections) => (
`import AboutMe from "./AboutMe"
import Education from "./Education"
import Experience from "./Experience"
import Skills from "./Skills"
import SoftSkills from "./SoftSkills"
import Certifications from "./Certifications"

const About = () => {
  const sections = ${JSON.stringify(sections)}

  return (
    <div className="flex flex-col lg:gap-3">
      <AboutMe />
      { sections.includes('education') && <Education /> }
      { sections.includes('experience') && <Experience /> }
      { sections.includes('tech-skills') && <Skills /> }
      { sections.includes('soft-skills') && <SoftSkills /> }
      { sections.includes('certs') && <Certifications /> }
    </div>
  )
}

export default About
`
)

const generateProjectsFile = (layout) => (
  `import AccentComponent from "./AccentComponent"
import Section from "./Section"
import Masonry from "./Masonry"
import { IconArrowUpRight } from "./Icons"

const projects = [
  {
    title: "WhisperNet",
    link: "",
    image: "/images/image-1.png",
    description: "Anonymous Feedback Platform",
    explanation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A platform for users to give and receive anonymous feedback in personal or professional settings.",
    technologies: ["Node.js", "Express", "MongoDB", "Socket.io", "React"]
  },
  {
    title: "InvestoGraph",
    link: "",
    code: "",
    image: "/images/image-2.png",
    description: "Stock Market Data Visualization",
    explanation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel odio nec nisi dignissim venenatis.",
    technologies: ["React", "D3.js", "Redux"]
  },
  {
    title: "Jobify",
    link: "",
    code: "",
    image: "/images/image-3.png",
    description: "Job Application Tracker",
    explanation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A tool to help users manage job applications.",
    technologies: ["Spring Boot", "Vue.js", "MySQL", "Bootstrap"]
  },
  {
    title: "Creation AI",
    link: "",
    image: "/images/image-1.png",
    description: "AI Model Training Platform",
    explanation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A platform for training and deploying AI models using TensorFlow.",
    technologies: ["Python", "TensorFlow", "Flask", "Docker"]
  }
]

const ProjectCard = ({ project }) => {
  return (
    <AccentComponent widthClass="" border={false}>
      <div className="rounded-2xl border border-accent-300/30 overflow-hidden">
        <img className="mx-auto border-b border-accent-300/30 opacity-20" src={project.image} alt={project.title} />
        <div className="flex flex-col gap-1 lg:gap-2 px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4">
            <ProjectTitle title={project.title} link={project.link} code={project.code} />
            <p className="text-content">{project.description}</p>
            <p className="text-sm text-content-700">{project.explanation}</p>
            <ProjectTechnologies technologies={project.technologies} />
        </div>
      </div>
    </AccentComponent>
  )
}

const ProjectList = ({ project }) => {
  return (
    <AccentComponent roundedClass="lg:rounded-2xl">
      <div className="flex flex-col gap-2 py-2 lg:px-5 lg:py-4">
        <ProjectTitle title={project.title} link={project.link} code={project.code} />
        <p className="text-content-700 font-semibold">{project.description}</p>
        <p className="text-content-700 max-w-[60ch]">{project.explanation}</p>
        <ProjectTechnologies technologies={project.technologies} />
      </div>
    </AccentComponent>
  )
}

const ProjectTitle = ({ title, link, code }) => {
  return (
    <div className="flex justify-between items-center">
      <a href={link} className="max-w-[95%] text-base md:text-lg font-bold text-accent-700 hover:text-accent-800 transition-all group">
        <span>{title}</span>
        <IconArrowUpRight classes="text-xs inline ml-1 mb-[3px] transition-all group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
      </a>
      {code !== undefined && <a href={code} className="text-xs text-content-700 uppercase border border-border/20 px-2 rounded-full hover:text-accent-800 hover:bg-accent-100/50 transition-all">code</a>}
    </div>
  )
}

const ProjectTechnologies = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {technologies.map((tech, index) => (
        <div key={index} className="text-xs text-accent border border-accent/20 bg-accent/10 px-2 rounded-3xl">{tech}</div>
      ))}
    </div>
  )
}

const Projects = () => {
  const layout = '${layout}'

  const items = projects.map((p, i) => layout === 'cards'
    ? <ProjectCard key={i} project={p} />
    : <ProjectList key={i} project={p} />
  )

  const view = {
    cards: (
      <Masonry minColWidth={218} numCols={2} >
        {items}
      </Masonry>
    ),
    list: (
      <div className="flex flex-col gap-2">
        {items}
      </div>
    )
  }
  
  return (
    <Section title="Projects" classes="nav-section">
      {view[layout]}
    </Section>
  )
}

export default Projects
`
)

const generateBlogFile = (layout) => (
`import AccentComponent from './AccentComponent'
import Section from './Section'
import Masonry from './Masonry'
import { IconArrowUpRight } from './Icons'

const blogs = [
  {
    title: 'My Journey with React and Beyond',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    date: '2023-10-28',
    link: ''
  },
  {
    title: 'Exploring the World of Web Development',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
    date: '2023-08-28',
    link: '',
  }
]

const BlogList = ({ blog }) => {
  return (
    <AccentComponent>
      <div className="flex flex-col gap-2 py-2 lg:px-4 lg:py-3">
        <BlogAttributes blog={blog} />
      </div>
    </AccentComponent>
  )
}

const BlogCard = ({ blog }) => {
  return (
    <AccentComponent widthClass="w-full" border={false}>
      <div className="flex flex-col gap-1 md:gap-2 rounded-2xl border border-accent-300/30 p-3 md:px-4 md:py-3 lg:px-5 lg:py-4 overflow-hidden">
        <BlogAttributes blog={blog} />
      </div>
    </AccentComponent>
  )
}

const BlogAttributes = ({ blog }) => {
  return (
    <>
      <p className="text-xs text-content-700">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      <BlogTitle title={blog.title} link={blog.link} />
      <p className="text-sm text-content-700">{blog.description}</p>
    </>
  )
}

const BlogTitle = ({ title, link }) => {
  return (
    <a href={link} className="max-w-[95%] font-semibold text-content-700 hover:text-accent-700 transition-all group">
      {title}
      <IconArrowUpRight size={11} stroke={2} classes="inline ml-1 mb-[3px] transition-all group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
    </a>
  )
}

const Blogs = () => {
  const layout = '${layout}'

  const items = blogs.map((b, i) => layout === 'cards'
    ? <BlogCard key={i} blog={b} />
    : <BlogList key={i} blog={b} />
  )

  const view = {
    cards: (
      <Masonry minColWidth={218} numCols={2} >
        {items}
      </Masonry>
    ),
    list: (
      <div className="flex flex-col gap-2">
        {items}
      </div>
    )
  }

  return (
    <Section title="Blog" classes="nav-section">
      {view[layout]}
    </Section>
  )
}

export default Blogs
`
)


const generateAppContextFile = () => (
`import { createContext, useState } from 'react'

const AppContext = createContext()

const defaultState = {
  activePage: 'about'
}

export const AppContextProvider = ({ children }) => {
  const [appState, setAppState] = useState(defaultState)

  const setActivePage = (page) => {
    setAppState({ ...appState, activePage: page })
  }

  return (
    <AppContext.Provider value={{ ...appState, setActivePage }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
`
)

const generateNavbarFile = (content) => {
  let links
  if (content.page === 'single') {
    links = `enabledPages.map(
      page => <li key={page}><a href="" data-nav-section={page} onClick={handleClick} className={\`\${page === activePage ? 'active': ''} px-[1em] py-[.8em] inline-block rounded-full m-[1px] transition-all duration-500 hover:bg-accent-200 hover:text-accent-800 hover:font-semibold\`}>{page}</a></li>
    )`
  } else if (content.page === 'multi') {
    links = `enabledPages.map(
      page => <li key={page}><Link to={page} data-nav-section={page} onClick={handleClick} className={\`\${page === activePage ? 'active': ''} px-[1em] py-[.8em] inline-block rounded-full m-[1px] transition-all duration-500 hover:bg-accent-200 hover:text-accent-800 hover:font-semibold\`}>{page}</Link></li>
    )`
  }

  const scrollToSection = (
    `e.preventDefault()
    const target = document.querySelector(\`#\${e.target.dataset.navSection}\`)
    const targetRectTop = target.getBoundingClientRect().top

    let offset =  window.innerWidth < 768 ? 0 : 150
    const targetOffset = targetRectTop + window.pageYOffset

    window.scrollTo({
      top: targetOffset - offset,
      behavior: 'smooth'
    })
    `
  )

  const syncNavWithScroll = (
    `useEffect(() => {
      const sections = document.querySelectorAll('.nav-section')
  
      const handleScroll = () => {
        let activeSection
  
        sections.forEach((section) => {
          const { top, bottom } = section.getBoundingClientRect()
          const viewportHeight = window.innerHeight 

          if (window.scrollY === 0) {
            activeSection = sections[0].id
          } else {
            // check if the section covers more than 50% of the viewport/container height
            if (top < viewportHeight / 2 && bottom > viewportHeight / 2) {
              activeSection = section.id
            }
          }
        })
  
        setActivePage(activeSection)
      }
  
      window.addEventListener('scroll', handleScroll)
      // handleScroll()
  
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [setActivePage, enabledPages])
    `
  )

  return `import { useEffect, useContext } from 'react'
${content.page === 'multi' ? "import { Link } from 'react-router-dom'" : ''}
import AppContext from '../contexts/AppContext'
import ThemeContext from '../contexts/ThemeContext'
import { IconContrast } from './Icons'

const Navbar = () => {  
  const { activePage, setActivePage } = useContext(AppContext)
  const { toggleTheme } = useContext(ThemeContext)
  const enabledPages = ${JSON.stringify(enabledPages)}

  const handleClick = (e) => {
    ${content.page === 'single' ? scrollToSection : ''}
    setActivePage(e.target.dataset.navSection)
  }

  ${content.page === 'single' ? syncNavWithScroll : ''}
  const links = ${links}

  return (
    <nav className="navbar fixed md:sticky w-full bottom-[24px] lg:bottom-[50px] left-0 md:top-[70px] flex justify-center items-center z-50 md:translate-y-0 md:opacity-100 lg:mb-6 transition-all duration-500">
      <ul className="flex border capitalize bg-background-700/10 backdrop-blur-xl backdrop-saturate-150 md:bg-background-700 text-[13px] md:text-[14px] text-accent-800 border-accent-100 rounded-3xl shadow-lg lg:shadow-xl lg:hover:scale-105 lg:active:scale-100 transition-transform duration-500">
        {links}
      </ul>
      <button className='border p-2 md:p-[10px] ml-3 md:ml-4 rounded-full bg-background-700/10 backdrop-blur-xl backdrop-saturate-150 md:bg-background-700 text-[13px] md:text-[14px] text-content-700 border-border/10 shadow-lg lg:shadow-xl lg:hover:scale-105 lg:active:scale-100' onClick={toggleTheme}>
        <IconContrast />
      </button>
    </nav>
  )
}

export default Navbar
`
}

const generateIndexFile = () => (
  `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Template</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,400;0,600;0,700;0,900;1,100&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet">
    </head>
    <body class="bg-background text-content">
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>
  `
)

const generateCSSFile = (color) => {
  const { choice } = color
  const { hue, lightness } = color.accent

  const defaultColors = {
    light: (
      `--clr-accent-100: 0deg, 0%, 88%;
    --clr-accent-200: 0deg, 0%, 80%;
    --clr-accent-300: 0deg, 0%, 70%;
    --clr-accent: 0deg, 0%, 50%;
    --clr-accent-700: 0deg, 0%, 30%;
    --clr-accent-800: 0deg, 0%, 20%;`
    ),
    dark: (
      `--clr-accent-100: 0deg, 0%, 12%;
    --clr-accent-200: 0deg, 0%, 20%;
    --clr-accent-300: 0deg, 0%, 30%;
    --clr-accent: 0deg, 0%, 50%;
    --clr-accent-700: 0deg, 0%, 80%;
    --clr-accent-800: 0deg, 0%, 90%;`
    )
  }

  const customColors = {
    light: (
      `--clr-accent-100: ${hue}deg, 50%, 88%;
    --clr-accent-200: ${hue}deg, 55%, 80%;
    --clr-accent-300: ${hue}deg, 57%, ${Math.min(parseInt(lightness) + 15, 95)}%;
    --clr-accent: ${hue}deg, 60%, ${lightness}%;
    --clr-accent-700: ${hue}deg, 70%, ${Math.max(parseInt(lightness) - 15, 5)}%;
    --clr-accent-800: ${hue}deg, 75%, ${Math.max(parseInt(lightness) - 30, 5)}%;`
    ),
    dark: (
      `--clr-accent-100: ${hue}deg, 50%, 12%;
    --clr-accent-200: ${hue}deg, 55%, 25%;
    --clr-accent-300: ${hue}deg, 57%, ${Math.max(parseInt(lightness) - 15, 5)}%;
    --clr-accent: ${hue}deg, 60%, ${lightness}%;
    --clr-accent-700: ${hue}deg, 70%, ${Math.min(parseInt(lightness) + 15, 95)}%;
    --clr-accent-800: ${hue}deg, 75%, ${Math.min(parseInt(lightness) + 30, 95)}%;`
    )
  }

  const colors = choice === 'default' ? defaultColors : customColors

return `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 3px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  background: var(--clr-scrollbar);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--clr-scrollbar-hover);
}

a, button, input, textarea {
  -webkit-tap-highlight-color: transparent;
}

@layer base {
  :root {
    --clr-background: 255 255 255;
    --clr-background-700: 255 255 255;
    --clr-border: 0 0 0;
    --clr-content: 9 9 11;
    --clr-content-700: 63 63 70;
    --clr-content-500: 113 113 122;

    --clr-scrollbar: #b4b4b4;
    --clr-scrollbar-hover: #a1a1a1;

    ${colors.light}
  }
  
  :root[data-theme='dark'] {
    --clr-background: 19 19 21;
    --clr-background-700: 24 24 24;
    --clr-border: 255 255 255;
    --clr-content: 200 200 200;
    --clr-content-700: 141 141 141;
    --clr-content-500: 82 82 91;

    --clr-scrollbar: #525252;
    --clr-scrollbar-hover: #6b6b6b;

    ${colors.dark}
  }
}

.icon.flippable {
  transform-style: preserve-3d;
  transition: transform 0.3s;
}

.icon.flip {
  transform: rotateX(180deg);
}

.navbar .active {
  @apply font-semibold text-accent-800 bg-accent-200;
}

.main {
  margin: 0 auto;
}

.title { 
  z-index: 30;
}

.main .aboutme-card,
.main .section .title,
.main .section-body {
  padding: 0 24px;
}

@media (min-width: 768px) {
  .navbar::after {
    content: '';
    width: 100%;
    height: 140px;
    position: absolute;
    bottom: -20px;
    background-color: rgb(var(--clr-background) / 0.5);
    backdrop-filter: saturate(150%) blur(24px);
    z-index: -1;
  }

  .main .section-body {
    padding: 0 24px;
  }
  
  .main .aboutme-card {
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .main-wrapper {
    position: relative;
    left: 250px;
    width: calc(100% - 250px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    min-height: 100vh;
  }

  .main .section > * {
    padding: 0 24px;
  }
}`
}

const generateDynamicFiles = (content, id) => {
  enabledPages = getEnabledPages(content)

  const rootDir = path.resolve(__dirname, `../downloads/${id}`);
  const baseDir = path.join(rootDir, 'src');
  const contextsDir = path.join(baseDir, 'contexts');
  const componentsDir = path.join(baseDir, 'components');

  fs.mkdirSync(contextsDir, { recursive: true });
  fs.mkdirSync(componentsDir, { recursive: true });

  // Write files
  fs.writeFileSync(path.join(rootDir, 'index.html'), generateIndexFile());
  fs.writeFileSync(path.join(baseDir, 'main.jsx'), generateMainFile(content));
  fs.writeFileSync(path.join(baseDir, 'App.jsx'), generateAppFile(content));
  fs.writeFileSync(path.join(baseDir, 'index.css'), generateCSSFile(content.color));
  fs.writeFileSync(path.join(contextsDir, 'AppContext.jsx'), generateAppContextFile());
  fs.writeFileSync(path.join(componentsDir, 'Navbar.jsx'), generateNavbarFile(content));
  fs.writeFileSync(path.join(componentsDir, 'About.jsx'), generateAboutFile(content.pages.about.sections));
  fs.writeFileSync(path.join(componentsDir, 'Projects.jsx'), generateProjectsFile(content.pages.projects.layout));
  fs.writeFileSync(path.join(componentsDir, 'Blogs.jsx'), generateBlogFile(content.pages.blog.layout));
}

module.exports = { generateDynamicFiles }
