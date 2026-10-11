import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// ── DRONE 3D MODEL (procedural geometry) ──────────────────────────────────────
function Drone({ scrollY }) {
  const groupRef = useRef()
  const wingL = useRef()
  const wingR = useRef()
  const engineGlow = useRef()
  const t = useRef(0)

  useFrame((state, delta) => {
    t.current += delta
    if (!groupRef.current) return

    // Hover float
    groupRef.current.position.y = Math.sin(t.current * 0.8) * 0.12
    groupRef.current.rotation.y = t.current * 0.25
    groupRef.current.rotation.x = Math.sin(t.current * 0.5) * 0.05

    // Wing pulse
    if (wingL.current) wingL.current.rotation.z = Math.sin(t.current * 4) * 0.02
    if (wingR.current) wingR.current.rotation.z = -Math.sin(t.current * 4) * 0.02

    // Engine glow pulse
    if (engineGlow.current) {
      engineGlow.current.intensity = 1.5 + Math.sin(t.current * 6) * 0.5
    }
  })

  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#0a1a28',
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1,
  })
  const accentMat = new THREE.MeshStandardMaterial({
    color: '#00c8ff',
    metalness: 0.8,
    roughness: 0.1,
    emissive: '#00c8ff',
    emissiveIntensity: 0.4,
  })
  const engineMat = new THREE.MeshStandardMaterial({
    color: '#ff6600',
    emissive: '#ff4400',
    emissiveIntensity: 1.2,
    metalness: 0.5,
    roughness: 0.3,
  })
  const glassMat = new THREE.MeshStandardMaterial({
    color: '#00c8ff',
    metalness: 0.1,
    roughness: 0,
    transparent: true,
    opacity: 0.35,
    emissive: '#0088ff',
    emissiveIntensity: 0.5,
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.1}>
      {/* Engine exhaust glow light */}
      <pointLight ref={engineGlow} position={[0, 0, 1.8]} color="#ff6600" intensity={2} distance={4} />
      <pointLight position={[0, 0.5, 0]} color="#00c8ff" intensity={0.8} distance={5} />

      {/* FUSELAGE — main body */}
      <mesh material={bodyMat} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 2.8, 8]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>
      {/* Fuselage nose cone */}
      <mesh position={[0, 1.7, 0]} material={bodyMat} castShadow>
        <coneGeometry args={[0.18, 0.6, 8]} />
      </mesh>
      {/* Fuselage tail taper */}
      <mesh position={[0, -1.7, 0]} material={bodyMat} castShadow>
        <coneGeometry args={[0.28, 0.5, 8]} />
      </mesh>

      {/* COCKPIT CANOPY */}
      <mesh position={[0, 0.7, 0.16]} material={glassMat}>
        <sphereGeometry args={[0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>

      {/* MAIN DELTA WINGS */}
      <group ref={wingL} position={[0, 0, 0]}>
        {/* Left wing */}
        <mesh position={[-1.2, -0.1, 0]} rotation={[0, 0, 0.18]} material={bodyMat} castShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
        </mesh>
        {/* Left wing leading edge accent */}
        <mesh position={[-1.2, -0.06, -0.38]} rotation={[0, 0, 0.18]} material={accentMat}>
          <boxGeometry args={[2.0, 0.04, 0.06]} />
        </mesh>
        {/* Left winglet */}
        <mesh position={[-2.15, -0.22, 0]} rotation={[0, 0, 0.5]} material={bodyMat}>
          <boxGeometry args={[0.04, 0.45, 0.28]} />
        </mesh>
      </group>

      <group ref={wingR} position={[0, 0, 0]}>
        {/* Right wing */}
        <mesh position={[1.2, -0.1, 0]} rotation={[0, 0, -0.18]} material={bodyMat} castShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
        </mesh>
        {/* Right wing leading edge accent */}
        <mesh position={[1.2, -0.06, -0.38]} rotation={[0, 0, -0.18]} material={accentMat}>
          <boxGeometry args={[2.0, 0.04, 0.06]} />
        </mesh>
        {/* Right winglet */}
        <mesh position={[2.15, -0.22, 0]} rotation={[0, 0, -0.5]} material={bodyMat}>
          <boxGeometry args={[0.04, 0.45, 0.28]} />
        </mesh>
      </group>

      {/* TAIL FINS - horizontal stabilizers */}
      <mesh position={[0, -0.9, 0]} rotation={[0, 0, 0]} material={bodyMat}>
        <boxGeometry args={[1.1, 0.05, 0.35]} />
      </mesh>
      {/* Vertical tail fin */}
      <mesh position={[0, -0.85, -0.2]} rotation={[0.3, 0, 0]} material={bodyMat}>
        <boxGeometry args={[0.05, 0.55, 0.38]} />
      </mesh>

      {/* ENGINE NACELLE */}
      <mesh position={[0, -1.1, 0.28]} material={bodyMat} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.55, 8]} />
      </mesh>
      {/* Engine intake ring */}
      <mesh position={[0, -0.82, 0.28]} material={accentMat}>
        <torusGeometry args={[0.15, 0.02, 8, 24]} />
      </mesh>
      {/* Engine exhaust flame */}
      <mesh position={[0, -1.4, 0.28]} material={engineMat}>
        <coneGeometry args={[0.08, 0.35, 8]} />
      </mesh>

      {/* SENSOR POD belly */}
      <mesh position={[0, 0.1, 0.32]} material={bodyMat}>
        <sphereGeometry args={[0.12, 10, 8]} />
      </mesh>
      <mesh position={[0, 0.1, 0.38]} material={glassMat}>
        <sphereGeometry args={[0.07, 8, 6]} />
      </mesh>

      {/* CYAN accent stripes */}
      <mesh position={[0, 0.3, 0.18]} material={accentMat}>
        <boxGeometry args={[0.36, 0.02, 0.06]} />
      </mesh>
      <mesh position={[0, -0.2, 0.18]} material={accentMat}>
        <boxGeometry args={[0.36, 0.02, 0.06]} />
      </mesh>
    </group>
  )
}

// ── GRID FLOOR ─────────────────────────────────────────────────────────────────
function GridFloor() {
  const ref = useRef()
  useFrame((s) => {
    if (ref.current) ref.current.position.z = (s.clock.elapsedTime * 0.4) % 2
  })
  return (
    <group position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[40, 40, '#003344', '#001a22']} />
    </group>
  )
}

// ── RING SCANNER ───────────────────────────────────────────────────────────────
function ScanRings() {
  const r1 = useRef(), r2 = useRef(), r3 = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (r1.current) { r1.current.scale.setScalar(1 + (t * 0.5 % 1) * 1.5); r1.current.material.opacity = 1 - (t * 0.5 % 1) }
    if (r2.current) { r2.current.scale.setScalar(1 + ((t * 0.5 + 0.33) % 1) * 1.5); r2.current.material.opacity = 1 - ((t * 0.5 + 0.33) % 1) }
    if (r3.current) { r3.current.scale.setScalar(1 + ((t * 0.5 + 0.66) % 1) * 1.5); r3.current.material.opacity = 1 - ((t * 0.5 + 0.66) % 1) }
  })
  const mat = () => new THREE.MeshBasicMaterial({ color: '#00c8ff', transparent: true, opacity: 0.5, side: THREE.DoubleSide })
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={r1}><torusGeometry args={[1.8, 0.008, 4, 80]} /><primitive object={mat()} attach="material" /></mesh>
      <mesh ref={r2}><torusGeometry args={[1.8, 0.008, 4, 80]} /><primitive object={mat()} attach="material" /></mesh>
      <mesh ref={r3}><torusGeometry args={[1.8, 0.008, 4, 80]} /><primitive object={mat()} attach="material" /></mesh>
    </group>
  )
}

// ── SCENE ──────────────────────────────────────────────────────────────────────
function Scene({ scrollY }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#0088ff" />
      <pointLight position={[0, 3, 3]} color="#00c8ff" intensity={0.4} distance={8} />
      <Stars radius={80} depth={60} count={3000} factor={3} fade speed={0.5} />
      <GridFloor />
      <ScanRings />
      <Drone scrollY={scrollY} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
      <fog attach="fog" args={['#020508', 8, 30]} />
    </>
  )
}

// ── BOOT TERMINAL ──────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { label: 'SYS',    val: 'BOOT SEQUENCE... [ONLINE]',                    color: '#00ff88' },
  { label: 'SENSOR', val: 'THERMAL / LIDAR / RGB / IR [ACTIVE]',          color: '#00c8ff' },
  { label: 'STACK',  val: 'React · Next.js · Node · FastAPI · Python',    color: '#00c8ff' },
  { label: 'ROLE',   val: 'Robotics AI Intern @ Addverb Technologies',    color: '#00c8ff' },
  { label: 'UNIV',   val: 'AKTU · B.Tech CSE · 2023–2026',               color: '#00c8ff' },
  { label: 'LINK',   val: 'PHALANX SYSTEM [ESTABLISHED]',                 color: '#00ff88' },
  { label: 'STATUS', val: 'AVAILABLE FOR OPPORTUNITIES ✓',                color: '#00ff88' },
]

function Terminal() {
  const [lines, setLines] = useState([])
  useEffect(() => {
    BOOT_LINES.forEach((l, i) => {
      setTimeout(() => setLines(prev => [...prev, l]), 300 + i * 320)
    })
  }, [])
  return (
    <div style={{
      background: 'rgba(6,12,18,0.92)',
      border: '1px solid rgba(0,200,255,0.28)',
      borderRadius: '3px',
      padding: '1.1rem 1.4rem',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '12px',
      textAlign: 'left',
      width: '100%',
      maxWidth: '520px',
      margin: '0 auto 2.5rem',
      position: 'relative',
      minHeight: '170px',
    }}>
      <div style={{ position:'absolute', top:10, right:12, width:7, height:7, borderRadius:'50%', background:'#00ff88', animation:'pulse 1.5s infinite' }} />
      {lines.map((l, i) => (
        <div key={i} style={{ color: '#3a5566', lineHeight: '1.85' }}>
          <span style={{ color: 'rgba(0,200,255,0.6)' }}>{l.label.padEnd(7)}</span>
          <span style={{ color: l.color }}>{l.val}</span>
        </div>
      ))}
      {lines.length < BOOT_LINES.length && (
        <span style={{ color: '#00c8ff', animation: 'blink 1s infinite' }}>█</span>
      )}
    </div>
  )
}

// ── LEFT SIDE NAV (USAvionix style) ────────────────────────────────────────────
const NAV_ITEMS = ['Skills', 'Experience', 'Projects', 'Education', 'Contact']

function SideNav({ active }) {
  return (
    <div style={{
      position: 'fixed',
      left: '2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.8rem',
    }}>
      {NAV_ITEMS.map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: active === item.toLowerCase() ? '#00c8ff' : 'rgba(90,122,138,0.7)',
          textDecoration: 'none',
          letterSpacing: '0.18em',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transition: 'color 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            display: 'inline-block',
            width: active === item.toLowerCase() ? '20px' : '8px',
            height: '1px',
            background: active === item.toLowerCase() ? '#00c8ff' : 'rgba(90,122,138,0.5)',
            transition: 'width 0.3s',
            marginBottom: '6px',
          }} />
          {item.toUpperCase()}
        </a>
      ))}
    </div>
  )
}

// ── TOP NAV ────────────────────────────────────────────────────────────────────
function TopNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 3rem', height: '52px',
      background: 'rgba(2,5,8,0.85)',
      borderBottom: '1px solid rgba(0,200,255,0.1)',
      backdropFilter: 'blur(14px)',
    }}>
      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize:'12px', color:'#00c8ff', letterSpacing:'0.12em' }}>
        HOK://PORTFOLIO
      </span>
      <div style={{ display:'flex', gap:'2rem' }}>
        {['GitHub','LinkedIn','Portfolio'].map(l => (
          <a key={l} href={l==='GitHub'?'https://github.com/sangamyo':l==='LinkedIn'?'https://www.linkedin.com/in/hari-om-kasaundhan-321b0b2a6/':'https://3d-portfolio-3sin.vercel.app/'}
            target="_blank" rel="noreferrer"
            style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(90,122,138,0.8)', textDecoration:'none', letterSpacing:'0.15em', transition:'color 0.2s' }}
            onMouseEnter={e=>e.target.style.color='#00c8ff'} onMouseLeave={e=>e.target.style.color='rgba(90,122,138,0.8)'}
          >{l}</a>
        ))}
      </div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(0,255,136,0.7)', display:'flex', alignItems:'center', gap:'6px' }}>
        <span style={{ width:6,height:6,borderRadius:'50%',background:'#00ff88',display:'inline-block',animation:'pulse 2s infinite' }} />
        LINK: ACTIVE
      </div>
    </nav>
  )
}

// ── SECTION WRAPPER ────────────────────────────────────────────────────────────
function Section({ id, tag, title, children }) {
  return (
    <section id={id} style={{ padding: '7rem 0 5rem', position:'relative' }}>
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 5rem 0 7rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'3.5rem' }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#00c8ff', letterSpacing:'0.3em', padding:'3px 9px', border:'1px solid rgba(0,200,255,0.28)', borderRadius:'2px' }}>{tag}</span>
          <h2 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'2.1rem', fontWeight:700, color:'#fff', letterSpacing:'-0.01em' }}>{title}</h2>
          <div style={{ flex:1, height:'1px', background:'rgba(0,200,255,0.1)' }} />
        </div>
        {children}
      </div>
    </section>
  )
}

// ── SKILLS ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  { label:'LANGUAGES',  tags:['Java','JavaScript','Python','SQL'] },
  { label:'FRONTEND',   tags:['React.js','Next.js','HTML5','Tailwind CSS'] },
  { label:'BACKEND',    tags:['Node.js','Express.js','FastAPI','Django'] },
  { label:'DATABASES',  tags:['MongoDB','PostgreSQL'] },
  { label:'CORE CS',    tags:['DSA','DBMS','OS','Networks'] },
  { label:'CONCEPTS',   tags:['REST API','System Design','Microservices','CI/CD','JWT/OAuth','Cloud Deploy'] },
]

function SkillTag({ children }) {
  const [hov, setHov] = useState(false)
  return (
    <span onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      fontFamily:"'Share Tech Mono',monospace", fontSize:'11px',
      color: hov ? '#00c8ff' : 'rgba(90,122,138,0.85)',
      padding:'3px 10px',
      border: `1px solid ${hov ? 'rgba(0,200,255,0.45)' : 'rgba(0,200,255,0.12)'}`,
      borderRadius:'2px',
      background: hov ? 'rgba(0,200,255,0.07)' : 'transparent',
      transition:'all 0.2s',
      cursor:'default',
    }}>{children}</span>
  )
}

// ── EXPERIENCE ─────────────────────────────────────────────────────────────────
const EXP = [
  {
    period: 'MAY 2026 — NOV 2026',
    company: 'ADDVERB TECHNOLOGIES',
    role: 'Robotics & AI Intern',
    points: [
      'Working in CEO Office\'s Advanced Robotics dept on VLA data collection for robotic manipulation models.',
      'Contributing to teleoperation pipelines and automation workflows across remote and local machines.',
      'Supporting AI-driven robotic systems to advance autonomous manipulation capabilities.',
    ],
  },
  {
    period: 'SEP 2024 — FEB 2025',
    company: 'PUREWASHR · STARTUP INDIA',
    role: 'Full Stack Developer Intern',
    points: [
      'Architected scalable MERN-based platform serving 500+ active users with real-time scheduling.',
      'Engineered RESTful APIs and integrated 15+ vendor workflows, improving operational efficiency.',
      'Optimized backend performance reducing latency by 40% through query and API optimization.',
    ],
  },
  {
    period: 'JUN 2023 — FEB 2024',
    company: 'FREELANCE',
    role: 'Software Developer',
    points: [
      'Built production-grade authentication systems, dashboards, and automation tools for clients.',
      'Reduced API response time by 50% using optimized backend logic and caching strategies.',
    ],
  },
]

// ── PROJECTS ───────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    num:'001', name:'PDF RAG Chat',
    desc:'Multimodal RAG chatbot that answers questions from the text, tables, charts and images inside PDFs. PyMuPDF extraction, vision-LLM chart reading, hybrid BM25 + embedding retrieval, cited answers via Groq and Streamlit.',
    live:'https://pdf-rag-chat-hariom.streamlit.app',
    github:'https://github.com/sangamyo/pdf-rag-chat',
  },
  {
    num:'002', name:'AlgoFlow Tracker',
    desc:'Full stack DSA analytics platform with Next.js and MongoDB. Real-time analytics, secure auth, cloud-deployed REST APIs.',
    live:'https://algo-flow-tracker.vercel.app/login',
    github:'https://github.com/sangamyo/AlgoFlow-tracker.git',
  },
  {
    num:'003', name:'ATS Resume Checker',
    desc:'AI-powered resume analysis using Google Gemini API for ATS scoring, keyword optimization, and semantic evaluation.',
    live:'https://atsresumecheckerbyappgeminigit-uw8c5qferlp44dqjjuas6w.streamlit.app',
    github:'https://github.com/sangamyo/ATS_RESUME_CHECKER_BY_GOOGLE_GEMiNI.git',
  },
  {
    num:'004', name:'SYNCRONET-AI',
    desc:'Adaptive AI traffic control system with vehicle density algorithms and real-time signal optimization in Python/Pygame.',
    github:'https://github.com/sangamyo/sangamyo-sangamyo-Synchronet-Traffic-Simulation-with-stats.git',
  },
  {
    num:'005', name:'Hand Gesture Control',
    desc:'Computer vision control system using OpenCV and MediaPipe for gesture and voice-based touchless interaction.',
    github:'https://github.com/sangamyo/control_with_hand_gesture.git',
  },
]

// ── PROJECT CARD ───────────────────────────────────────────────────────────────
function ProjectCard({ p }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background: hov ? '#0c1824' : '#0a1520',
      border: '1px solid rgba(0,200,255,0.1)',
      borderTop: `2px solid ${hov ? '#00c8ff' : 'transparent'}`,
      padding: '1.8rem',
      transition: 'all 0.3s',
      cursor: 'default',
    }}>
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(42,69,85,0.9)', marginBottom:'0.8rem', letterSpacing:'0.15em' }}>PROJECT // {p.num}</div>
      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'1.2rem', fontWeight:700, color:'#fff', marginBottom:'0.7rem' }}>{p.name}</div>
      <p style={{ fontSize:'13px', color:'rgba(90,122,138,0.9)', lineHeight:1.6, marginBottom:'1.4rem' }}>{p.desc}</p>
      <div style={{ display:'flex', gap:'1.2rem' }}>
        {p.live && <a href={p.live} target="_blank" rel="noreferrer" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(0,200,255,0.65)', textDecoration:'none', letterSpacing:'0.1em', borderBottom:'1px solid rgba(0,200,255,0.3)', paddingBottom:'1px' }}>LIVE ↗</a>}
        <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(0,200,255,0.65)', textDecoration:'none', letterSpacing:'0.1em', borderBottom:'1px solid rgba(0,200,255,0.3)', paddingBottom:'1px' }}>GITHUB ↗</a>
      </div>
    </div>
  )
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [scrollY, setScrollY] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
      const sections = ['skills','experience','projects','education','contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const { top, bottom } = el.getBoundingClientRect()
          if (top < window.innerHeight * 0.5 && bottom > 0) { setActive(id); break }
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .anim-0{animation:fadeUp 0.6s 0.2s both}
        .anim-1{animation:fadeUp 0.6s 0.45s both}
        .anim-2{animation:fadeUp 0.6s 0.65s both}
        .anim-3{animation:fadeUp 0.6s 0.85s both}
        .anim-4{animation:fadeUp 0.6s 1.05s both}
      `}</style>

      <TopNav />
      <SideNav active={active} />

      {/* ── HERO ── */}
      <div style={{ position:'relative', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>

        {/* 3D CANVAS */}
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <Canvas
            camera={{ position:[0, 1.5, 6], fov:50 }}
            gl={{ antialias:true, alpha:false }}
            style={{ background:'#020508' }}
          >
            <Suspense fallback={null}>
              <Scene scrollY={scrollY} />
            </Suspense>
          </Canvas>
        </div>

        {/* Radial vignette */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 65% 75% at 50% 50%, transparent 20%, #020508 100%)', zIndex:1, pointerEvents:'none' }} />

        {/* Hero text — sits on top of canvas */}
        <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:780, padding:'0 2rem', marginTop:'52px' }}>
          <div className="anim-0" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'#00c8ff', letterSpacing:'0.35em', marginBottom:'1.6rem' }}>
            ENGINEER · DEVELOPER · INNOVATOR
          </div>
          <h1 className="anim-1" style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'clamp(2.8rem,8vw,6rem)', fontWeight:700, color:'#fff', lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:'1.2rem' }}>
            HARI OM<br /><span style={{ color:'#00c8ff' }}>KASAUNDHAN</span>
          </h1>
          <p className="anim-2" style={{ fontFamily:"'Inter',sans-serif", fontSize:'15px', fontWeight:300, color:'rgba(90,122,138,0.9)', letterSpacing:'0.06em', marginBottom:'2.5rem' }}>
            Full Stack Developer &amp; Robotics AI Intern @ Addverb Technologies
          </p>

          <div className="anim-3">
            <Terminal />
          </div>

          <div className="anim-4" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { label:'VIEW PROJECTS', href:'#projects', primary:true },
              { label:'GITHUB', href:'https://github.com/sangamyo', primary:false },
              { label:'LINKEDIN', href:'https://www.linkedin.com/in/hari-om-kasaundhan-321b0b2a6/', primary:false },
            ].map(b => (
              <a key={b.label} href={b.href} target={b.href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                style={{
                  fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', letterSpacing:'0.12em',
                  padding:'10px 22px', borderRadius:'2px', textDecoration:'none', transition:'all 0.2s',
                  background: b.primary ? '#00c8ff' : 'transparent',
                  color: b.primary ? '#020508' : '#00c8ff',
                  border: `1px solid ${b.primary ? '#00c8ff' : 'rgba(0,200,255,0.3)'}`,
                  fontWeight: b.primary ? 700 : 400,
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=b.primary?'#fff':'rgba(0,200,255,0.08)';e.currentTarget.style.borderColor=b.primary?'#fff':'rgba(0,200,255,0.6)'}}
                onMouseLeave={e=>{e.currentTarget.style.background=b.primary?'#00c8ff':'transparent';e.currentTarget.style.borderColor=b.primary?'#00c8ff':'rgba(0,200,255,0.3)'}}
              >{b.label}</a>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'9px', color:'rgba(42,69,85,0.9)', letterSpacing:'0.25em' }}>SCROLL</span>
          <div style={{ width:'1px', height:'38px', background:'linear-gradient(to bottom,rgba(0,200,255,0.6),transparent)', animation:'scrollLine 2s infinite' }} />
        </div>
        <style>{`@keyframes scrollLine{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}`}</style>
      </div>

      {/* ── SKILLS ── */}
      <Section id="skills" tag="01 / CAPABILITIES" title="Technical Skills">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:'1px', background:'rgba(0,200,255,0.1)', border:'1px solid rgba(0,200,255,0.1)' }}>
          {SKILLS.map(s => (
            <div key={s.label} style={{ background:'#0a1520', padding:'1.5rem' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#00c8ff', letterSpacing:'0.2em', marginBottom:'1rem' }}>{s.label}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {s.tags.map(t => <SkillTag key={t}>{t}</SkillTag>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section id="experience" tag="02 / OPERATIONS" title="Experience">
        <div style={{ display:'flex', flexDirection:'column' }}>
          {EXP.map((e, i) => (
            <ExpItem key={i} e={e} />
          ))}
        </div>
      </Section>

      {/* ── PROJECTS ── */}
      <Section id="projects" tag="03 / DEPLOYMENTS" title="Projects">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:'1px', background:'rgba(0,200,255,0.1)', border:'1px solid rgba(0,200,255,0.1)' }}>
          {PROJECTS.map(p => <ProjectCard key={p.num} p={p} />)}
        </div>
      </Section>

      {/* ── EDUCATION ── */}
      <Section id="education" tag="04 / TRAINING" title="Education">
        <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(0,200,255,0.1)', border:'1px solid rgba(0,200,255,0.1)' }}>
          {[
            { degree:'B.Tech — Computer Science Engineering', school:'Dr. A.P.J. Abdul Kalam Technical University (AKTU)', year:'2023 — 2026' },
            { degree:'Polytechnic Diploma — Computer Science', school:'Board of Technical Education, Uttar Pradesh', year:'2020 — 2023' },
          ].map(e => (
            <div key={e.degree} style={{ background:'#0a1520', padding:'1.8rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
              <div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'1.1rem', fontWeight:600, color:'#fff', marginBottom:'0.3rem' }}>{e.degree}</div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'rgba(90,122,138,0.9)', letterSpacing:'0.05em' }}>{e.school}</div>
              </div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'rgba(0,200,255,0.65)', letterSpacing:'0.1em', flexShrink:0 }}>{e.year}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ borderTop:'1px solid rgba(0,200,255,0.1)', padding:'7rem 0', textAlign:'center' }}>
        <div style={{ maxWidth:600, margin:'0 auto', padding:'0 2rem' }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#00c8ff', letterSpacing:'0.3em', marginBottom:'1.5rem', display:'inline-block', padding:'3px 9px', border:'1px solid rgba(0,200,255,0.28)', borderRadius:'2px' }}>05 / CONNECT</div>
          <h2 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'3rem', fontWeight:700, color:'#fff', marginBottom:'0.8rem' }}>Ready to Talk?</h2>
          <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'rgba(42,69,85,0.9)', letterSpacing:'0.18em', marginBottom:'2.5rem' }}>OPEN TO OPPORTUNITIES · COLLABORATIONS · RESEARCH</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { label:'SEND MESSAGE', href:'mailto:sangamgupta988@gmail.com', primary:true },
              { label:'LINKEDIN', href:'https://www.linkedin.com/in/hari-om-kasaundhan-321b0b2a6/' },
              { label:'GITHUB', href:'https://github.com/sangamyo' },
            ].map(b => (
              <a key={b.label} href={b.href} target={b.href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                style={{
                  fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', letterSpacing:'0.12em',
                  padding:'10px 22px', borderRadius:'2px', textDecoration:'none',
                  background: b.primary ? '#00c8ff' : 'transparent',
                  color: b.primary ? '#020508' : '#00c8ff',
                  border: `1px solid ${b.primary ? '#00c8ff' : 'rgba(0,200,255,0.3)'}`,
                  fontWeight: b.primary ? 700 : 400,
                }}
              >{b.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(0,200,255,0.1)', padding:'1.5rem 3rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem', fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(42,69,85,0.9)', letterSpacing:'0.1em' }}>
        <span>© 2026 HARI OM KASAUNDHAN</span>
        <span>sangamgupta988@gmail.com · +91-9005979045</span>
        <span>HOK://SYS · V1.0</span>
      </footer>
    </div>
  )
}

function ExpItem({ e }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:0, borderTop:'1px solid rgba(0,200,255,0.1)', padding:'2.5rem 0', position:'relative' }}>
      <div style={{ position:'absolute', left:0, top:0, width:'2px', height: hov ? '100%' : '0%', background:'#00c8ff', transition:'height 0.4s ease' }} />
      <div style={{ paddingRight:'2rem' }}>
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(0,200,255,0.6)', letterSpacing:'0.1em', marginBottom:'0.4rem' }}>{e.period}</div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'rgba(42,69,85,0.9)', letterSpacing:'0.05em' }}>{e.company}</div>
      </div>
      <div>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'1.25rem', fontWeight:600, color:'#fff', marginBottom:'1rem', letterSpacing:'0.01em' }}>{e.role}</div>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {e.points.map((pt, i) => (
            <li key={i} style={{ fontSize:'13.5px', color:'rgba(90,122,138,0.9)', paddingLeft:'1.2rem', position:'relative', lineHeight:1.6 }}>
              <span style={{ position:'absolute', left:0, color:'#00c8ff', fontFamily:'monospace' }}>—</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
