import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const ENTOURAGE = {
  groomsmenGroups: [
    {
      header: 'Best Men',
      members: [
        { name: 'Jonas Mellona',    role: 'Best Man',   initial: 'J' },
        { name: 'Angelo De Jesus',  role: 'Best Man',   initial: 'A' },
      ]
    },
    {
      header: 'Groomsmen',
      members: [
        { name: 'Rod Christian Dizon',       role: 'Groomsman',        initial: 'R' },
        { name: 'John Patrik Cao',           role: 'Groomsman',        initial: 'J' },
        { name: 'Reymart Bajande',           role: 'Groomsman',        initial: 'R' },
      ]
    },
    {
      header: 'Secondary Sponsors',
      members: [
        { name: 'John Paolo Balabbo',        role: 'Candle Sponsor',   initial: 'J' },
        { name: 'John Bryan Javier',         role: 'Candle Sponsor',   initial: 'J' },
        { name: 'Adrian Bernardo',           role: 'Veil Sponsor',     initial: 'A' },
        { name: 'John Louie Dizon',          role: 'Veil Sponsor',     initial: 'J' },
        { name: 'Aldrich Salas',             role: 'Cord Sponsor',     initial: 'A' },
        { name: 'Bryan Quintero',            role: 'Cord Sponsor',     initial: 'B' }
      ]
    }
  ],
  bridesmaidsGroups: [
    {
      header: 'Maid of Honor',
      members: [
        { name: 'Janine Cao',       role: 'Maid of Honor',   initial: 'J' },
      ]
    },
    {
      header: 'Matron of Honor',
      members: [
        { name: 'Almira De Jesus',  role: 'Matron of Honor', initial: 'A' },
      ]
    },
    {
      header: 'Bridesmaids',
      members: [
        { name: 'Trisha Dizon',              role: 'Bridesmaid',       initial: 'T' },
        { name: 'Rachelle Parungao',         role: 'Bridesmaid',       initial: 'R' },
        { name: 'Ruscel Joy Dizon',          role: 'Bridesmaid',       initial: 'R' },
      ]
    },
    {
      header: 'Secondary Sponsors',
      members: [
        { name: 'Shandy Shanine Del Rosario', role: 'Candle Sponsor',   initial: 'S' },
        { name: 'Ninna Balabbo',              role: 'Candle Sponsor',   initial: 'N' },
        { name: 'Rhaine Danielle Caling',     role: 'Veil Sponsor',     initial: 'R' },
        { name: 'Jilian Leigh Linao',         role: 'Veil Sponsor',     initial: 'J' },
        { name: 'Robinett Caling',            role: 'Cord Sponsor',     initial: 'R' },
        { name: 'Elaine Quintero',            role: 'Cord Sponsor',     initial: 'E' }
      ]
    }
  ]
}

export default function Entourage() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="entourage" ref={ref} style={{
      padding: 'clamp(5rem, 10vw, 10rem) 2rem',
      background: 'var(--cream)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--ff-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--taupe)',
            marginBottom: '1rem',
          }}
        >
          Our Beloved
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--ff-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            color: 'var(--text)',
            marginBottom: '4rem',
          }}
        >
          Wedding <span style={{ color: 'var(--taupe)' }}>Party</span>
        </motion.h2>

        <div className="entourage-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Groomsmen Column */}
          <div>
            {ENTOURAGE.groomsmenGroups.map((group, gIdx) => (
              <div key={group.header} style={{ marginBottom: gIdx < ENTOURAGE.groomsmenGroups.length - 1 ? '2.5rem' : 0 }}>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontFamily: 'var(--ff-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: 'var(--taupe)',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  {group.header}
                </motion.h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {group.members.map((p, i) => (
                    <PersonCard key={p.name} person={p} index={i} inView={inView} delay={0.4} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Center monogram */}
          <motion.div
            className="entourage-monogram"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '4rem',
            }}
          >
            <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, var(--champagne))', marginBottom: '1rem' }} />
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              border: '1px solid var(--champagne)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--ff-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              fontWeight: 300,
              color: 'var(--taupe)',
              background: 'var(--cream-light)',
            }}>
              R&A
            </div>
            <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, var(--champagne), transparent)', marginTop: '1rem' }} />
          </motion.div>

          {/* Bridesmaids Column */}
          <div>
            {ENTOURAGE.bridesmaidsGroups.map((group, gIdx) => (
              <div key={group.header} style={{ marginBottom: gIdx < ENTOURAGE.bridesmaidsGroups.length - 1 ? '2.5rem' : 0 }}>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontFamily: 'var(--ff-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: 'var(--taupe)',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  {group.header}
                </motion.h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {group.members.map((p, i) => (
                    <PersonCard key={p.name} person={p} index={i} inView={inView} delay={0.5} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bearers & Flower Girls Section */}
        <div style={{ marginTop: '5rem', borderTop: '1px dashed var(--champagne)', paddingTop: '4rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              textAlign: 'center',
              fontFamily: 'var(--ff-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: 'var(--taupe)',
              marginBottom: '3rem',
            }}
          >
            To carry our symbol of Love, Treasure and Faith
          </motion.p>

          {/* Bearers Grid */}
          <div className="bearers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '4rem',
          }}>
            {[
              { title: 'Ring Bearer', name: 'Ram Chester Caling', initial: 'R' },
              { title: 'Bible Bearer', name: 'King Santiago', initial: 'K' },
              { title: 'Coin Bearer', name: 'Paulo Gyle Ponce', initial: 'P' }
            ].map((bearer, idx) => (
              <div key={bearer.title} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'var(--ff-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  color: 'var(--taupe)',
                  marginBottom: '0.8rem'
                }}>{bearer.title}</p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1.2rem',
                  background: 'var(--cream-light)',
                  border: '1px solid var(--blush)',
                  borderRadius: '0px'
                }}>
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--blush), var(--champagne))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--ff-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    color: 'var(--taupe-dark)'
                  }}>
                    {bearer.initial}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--text)' }}>{bearer.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Flower Girls Section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--ff-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              color: 'var(--taupe)',
              marginBottom: '1.5rem'
            }}>Flower Girls</p>
            <div className="flower-girls-grid" style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
            }}>
              {[
                { name: 'Celine Iris Meriballes', initial: 'C' },
                { name: 'Ashrielle Kaye Dizon', initial: 'A' },
                { name: 'Ayesha Jay Dizon', initial: 'A' }
              ].map((girl) => (
                <div key={girl.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1.2rem',
                  background: 'var(--cream-light)',
                  border: '1px solid var(--blush)',
                  borderRadius: '0px'
                }}>
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--blush), var(--champagne))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--ff-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    color: 'var(--taupe-dark)'
                  }}>
                    {girl.initial}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--text)' }}>{girl.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .entourage-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .entourage-monogram {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .bearers-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .flower-girls-grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
          .flower-girls-grid > div {
            width: 100% !important;
            max-width: 280px !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  )
}

function PersonCard({ person, index, inView, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: delay + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.9rem 1.2rem',
        background: hovered ? 'var(--cream-light)' : 'var(--cream)',
        border: `1px solid ${hovered ? 'var(--champagne)' : 'var(--blush)'}`,
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.06)' : 'none',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <div style={{
        width: 42, height: 42,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--blush), var(--champagne))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--ff-serif)',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        color: 'var(--taupe-dark)',
        flexShrink: 0,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        {person.initial}
      </div>
      <div>
        <p style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--text)' }}>{person.name}</p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-soft)', letterSpacing: '0.05em' }}>{person.role}</p>
      </div>
    </motion.div>
  )
}
