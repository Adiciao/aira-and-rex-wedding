import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, deleteDoc,
  onSnapshot, serverTimestamp,
  query, where, getDocs, limit,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Firestore document refs ──────────────────────────────────────────
const CONFIG_REF = doc(db, 'wedding', 'config')
const RSVPS_REF  = collection(db, 'rsvps')

// ── Helper to compress files to optimized JPEGs (under 100KB) ──────────
function compressImage(file, maxDim = 1000, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Default values ───────────────────────────────────────────────────
export const DEFAULTS = {
  bride: 'Aira',
  groom: 'Rex',
  weddingDate: '2026-10-17T10:00:00',
  location: 'San Miguel, Bulacan',
  heroSubtitle: 'October 17, 2026  ·  San Miguel, Bulacan',

  brideStory: [
    "Year 2019, 1st year college ako second semester marami akong nakakausap na lalaki nung time na yon kasi galing ako sa break up and I want to chill and don't cry anymore. And there's one guy got my attention nagmessage siya sakin and said hi at nireplyan ko ng hello and asking me after if tumatanggap daw ba ako ng compliment sa ibang tao. At ang sabi ko oo naman, bakit? Hahaha. There's a feeling na he knows me, but I don't know him.",
    "Then dun na kami nag start mag usap until na kwento na niya sakin nung elementary daw kami nakikita na daw niya ako at nung Christmas party namin madalas ako sinasagala at nakita niya akong nakacostume na Santa claus, ang cute cute ko daw. At syempre nung time na yun hindi ako naniniwala pabebe ang atake haha artii. By the way he is grade 5 that time and I was grade 3, then we decided to see each other in person at sinundo niya ako sa oriente galing ako sa school pagkakatanda ko mag weekends na nun kaya uuwi ako samin. So ayun na nga sinundo niya ako sa oriente at dumaan kami sa isang isawan sa Batasan bata nag date agad haha.",
    "After namin magmeryenda umuwi na din kami tapos binaba lang niya ako sa tapat ng bahay namin sa labas ng kalsada. At maraming araw ang lumipas naging maayos naman ang lahat at naging okay kami. Then March 24, 2019 fiesta samin nun at the same time kasal ni ate Annie. Nagka ayaan kaming dalawa magperya that time at sumakay ng octopus na rides, dun kami nagkaroon ng first pic. And someone saw us, isa sa mga kaibigan ni ate Almira at nagsumbong haha. After gumala sa peryahan inaya ko siya sa bahay para kumain at pinakilala ko siyang kaibigan ko sa family ko haha.",
    "At ayun nagtuloy tuloy na ang pag usap namin hanggang sa maging official na siyang nanligaw sakin na umabot ng halos 1 taon. At nung official na naging kami November 16, 2019 which is that day ay sinama niya ako sa family reunion nila. He asked me kung pwede na daw ba niya ako maging girlfriend and I said yes. Through the years maraming pagsubok na dumating samin, pagiging toyoin ko ay isang reason din haha until now na mag 7 years na kami going strong pa din hehe."
  ],

  groomStory: [
    "2019 nung una kameng nagka kilala nag lakas loob na mag chat sa kanya. Nasa 1st year college na sya nung habang ako kaka graduate ko lang at nag aapply palang sa trabaho. Nag approach ako sa kanya ng hi and she reply hello and the story goes on hanggang sa officially nanligaw nako sa kanya at after almost 1 year during the reunion ng family namin she gave me her big yes!.",
    "Kagaya ng ibang love story di kame dumaan sa shortcut nag talo, may mga di pag kakaintindihan at maraming di napagkakasunduan. Pero ang pag ibig namin sa isat isa at mas matimbang sa kahit ano man pag subok.",
    "Nagstart kame ng hi end up as hi mahal, tinanong ko sya ng nag aaccept kaba ng compliment sa stranger at we end up at saying I Do to each other. Napakahiwaga ng pag ibig at masasabi ko na ikaw na ang mamahalin ko hanggang sa huli."
  ],

  acrosticPoem: [
    {
      letter: 'A',
      lines: [
        "Akong isang manlalakbay na walang kahihinatnan.",
        "At ikaw ang destinansyon na matagal ko nang nais paroonan.",
        "Ang makilala ka ay batid ng langit."
      ]
    },
    {
      letter: 'I',
      lines: [
        "Ikaw ang nais kong makapiling.",
        "Kahit na ang bukas ay aking huli nang pag gising.",
        "Wala nakong gustong masilayan sa umaga.",
        "Kundi ang mukha mo aking asawa."
      ]
    },
    {
      letter: 'R',
      lines: [
        "Rason kung bakit ako'y umiral",
        "Malamang ay dahil sayo aking mahal",
        "Hanggang sa katapusan ng ating kwento.",
        "Mananatiling ikaw ang simula at katapusan nito."
      ]
    },
    {
      letter: 'A',
      lines: [
        "Ating litrato kaylan man ay di kukupas.",
        "Mananatiling nandito ngayon at bukas.",
        "Kwento nati'y hindi mag wawakas.",
        "Patuloy kong uulit utilin hanggang bukas."
      ]
    }
  ],

  schedule: [
    { time: '9:00 AM',  title: 'Ceremony',     venue: 'San Miguel Parish Church',    desc: 'The exchange of sacred vows before God and loved ones. Kindly be seated by 9:00 AM.', attire: 'Semi-Formal Attire', icon: '◆' },
    { time: '12:00 PM', title: 'Cocktail Hour',       venue: '5A\'s Private Place & Resort, San Miguel', desc: 'Sip on refreshments and mingle in the lush gardens while the newlyweds capture their first moments.', attire: 'Semi-Formal Attire', icon: '◇' },
    { time: '12:30 PM', title: 'Wedding Reception',   venue: '5A\'s Private Place & Resort',    desc: 'A celebration of love with heartfelt toasts, a sumptuous Filipino feast, and the joy of family and friends.', attire: 'Semi-Formal Attire', icon: '◆' },
    { time: '5:00 PM',  title: 'After Party',         venue: '5A\'s Private Place & Resort',      desc: 'Dance under the stars with live music, an open bar, and all the warmth of a Bulacan evening until midnight.', attire: 'Semi-Formal Attire', icon: '◇' },
  ],

  ceremonyVenueName:    'San Miguel Parish Church',
  ceremonyVenueAddress: 'Poblacion, San Miguel, Bulacan',
  receptionVenueName:   '5A\'s Private Place & Resort',
  receptionVenueAddress:'Tibagan, San Miguel, Bulacan',
  gettingThereText:     'San Miguel is approximately 2 hours from Metro Manila via NLEX. Jeepneys and tricycles are available from the town center.',
  accommodationText:    'Nearby options include Bulacan hotels in Malolos City (30 mins away). We recommend booking early due to limited rooms.',
  parkingText:          'Ample parking is available on-site at 5A\'s Private Place & Resort. A shuttle will run between the church and reception venue.',

  rsvpDeadline:  'September 1, 2026',
  adminPassword: 'admin2026',

  images: {
    hero:    '/hero_bg.jpg',
    couple:  '/couple_photo.jpg',
    gallery: [
      { src: '/gallery_ceremony.jpg',  label: 'The Ceremony',  aspect: '3/4'  },
      { src: '/gallery_reception.jpg', label: 'The Reception', aspect: '4/3'  },
      { src: '/gallery_rings.jpg',     label: 'The Details',   aspect: '4/3'  },
      { src: '/hero_bg.jpg',           label: 'The Venue',     aspect: '16/9' },
      { src: '/couple_photo.jpg',      label: 'The Couple',    aspect: '3/4'  },
    ],
  },
}

const STORAGE_KEY = 'wedding_config_v2'
const RSVP_KEY    = 'wedding_rsvps_v1'

// ── Context ───────────────────────────────────────────────────────────
const WeddingContext = createContext(null)

export function WeddingProvider({ children }) {
  const [config,  setConfig]  = useState(DEFAULTS)
  const [rsvps,   setRsvps]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // Track simple saving state for image uploading
  const [uploadProgress, setUploadProgress] = useState({})

  const debounceRef = useRef({})

  // ── Load config & custom base64 images from Firestore on mount ─────
  useEffect(() => {
    let resolved = false

    const timer = setTimeout(() => {
      if (!resolved) {
        setError('Firebase connection timed out. Cloud Firestore may not be initialized in your Firebase Console.')
        setLoading(false)
      }
    }, 4000)

    const unsub = onSnapshot(CONFIG_REF, (snap) => {
      resolved = true
      clearTimeout(timer)
      if (snap.exists()) {
        const data = snap.data()
        setConfig(prev => {
          const merged = { ...DEFAULTS, ...prev }
          Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
              merged[key] = data[key]
            }
          })

          // Fallback array fields if not present in Firestore document
          if (!merged.brideStory || merged.brideStory.length === 0) merged.brideStory = DEFAULTS.brideStory
          if (!merged.groomStory || merged.groomStory.length === 0) merged.groomStory = DEFAULTS.groomStory
          if (!merged.acrosticPoem || merged.acrosticPoem.length === 0) merged.acrosticPoem = DEFAULTS.acrosticPoem

          merged.images = {
            ...DEFAULTS.images,
            ...(prev.images ?? {}),
            ...(data.images ?? {}),
          }
          return merged
        })
      } else {
        setDoc(CONFIG_REF, DEFAULTS).catch(console.error)
      }
      setLoading(false)
    }, (err) => {
      resolved = true
      clearTimeout(timer)
      console.error('Firestore config error:', err)
      setError(err.message)
      setLoading(false)
    })
    return () => {
      clearTimeout(timer)
      unsub()
    }
  }, [])

  // ── Real-time RSVP listener ───────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(RSVPS_REF, (snap) => {
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      entries.sort((a, b) => {
        const ta = a.submitted_at?.toMillis?.() ?? 0
        const tb = b.submitted_at?.toMillis?.() ?? 0
        return tb - ta
      })
      setRsvps(entries)
    }, (err) => {
      console.error('Firestore RSVPs error:', err)
    })
    return unsub
  }, [])

  // ── Persist config to Firestore (debounced 800ms) ─────────────────
  const persistConfig = useCallback((key, value) => {
    clearTimeout(debounceRef.current[key])
    debounceRef.current[key] = setTimeout(async () => {
      try {
        await updateDoc(CONFIG_REF, { [key]: value })
      } catch (e) {
        try { await setDoc(CONFIG_REF, { [key]: value }, { merge: true }) }
        catch (e2) { console.error('Config save failed', e2) }
      }
    }, 800)
  }, [])

  // ── Config field updaters ──────────────────────────────────────────
  const update = useCallback((key, value) => {
    setConfig(c => ({ ...c, [key]: value }))
    persistConfig(key, value)
  }, [persistConfig])

  // ── Config bulk updater (useful for Save buttons) ─────────────────
  const updateBulk = useCallback(async (fields) => {
    setConfig(c => ({ ...c, ...fields }))
    try {
      await updateDoc(CONFIG_REF, fields)
    } catch (e) {
      try {
        await setDoc(CONFIG_REF, fields, { merge: true })
      } catch (e2) {
        console.error('Bulk save failed', e2)
        throw e2
      }
    }
  }, [])

  const updateScheduleItem = useCallback((index, field, value) => {
    setConfig(c => {
      const schedule = [...c.schedule]
      schedule[index] = { ...schedule[index], [field]: value }
      persistConfig('schedule', schedule)
      return { ...c, schedule }
    })
  }, [persistConfig])

  const updateStoryParagraph = useCallback((index, value) => {
    setConfig(c => {
      const story = [...c.story]
      story[index] = value
      persistConfig('story', story)
      return { ...c, story }
    })
  }, [persistConfig])

  const updateGalleryLabel = useCallback((index, label) => {
    setConfig(c => {
      const images = { ...c.images }
      const gallery = [...images.gallery]
      gallery[index] = { ...gallery[index], label }
      images.gallery = gallery
      persistConfig('images', images)
      return { ...c, images }
    })
  }, [persistConfig])

  // ── Upload image directly to Firestore (bypass Storage upgrade) ───
  const uploadMainImage = useCallback(async (key, file) => {
    setUploadProgress(p => ({ ...p, [key]: 50 }))
    try {
      // Compress to high-quality lightweight JPEG base64
      const base64 = await compressImage(file, 1024, 0.6)
      setUploadProgress(p => ({ ...p, [key]: 90 }))

      // Update config object in Firestore
      setConfig(c => {
        const images = { ...c.images, [key]: base64 }
        persistConfig('images', images)
        return { ...c, images }
      })
    } catch (e) {
      console.error(e)
      alert('Failed to process image: ' + e.message)
    } finally {
      setUploadProgress(p => ({ ...p, [key]: null }))
    }
  }, [persistConfig])

  const uploadGalleryImage = useCallback(async (index, file) => {
    const key = `gallery_${index}`
    setUploadProgress(p => ({ ...p, [key]: 50 }))
    try {
      const base64 = await compressImage(file, 1024, 0.6)
      setUploadProgress(p => ({ ...p, [key]: 90 }))

      setConfig(c => {
        const images = { ...c.images }
        const gallery = [...images.gallery]
        gallery[index] = { ...gallery[index], src: base64 }
        images.gallery = gallery
        persistConfig('images', images)
        return { ...c, images }
      })
    } catch (e) {
      console.error(e)
      alert('Failed to process image: ' + e.message)
    } finally {
      setUploadProgress(p => ({ ...p, [key]: null }))
    }
  }, [persistConfig])

  // ── Submit RSVP ───────────────────────────────────────────────────
  const submitRsvp = useCallback(async (formData) => {
    const email = formData.email.toLowerCase().trim()
    const fName = formData.first_name.trim()
    const lName = formData.last_name.trim()
    const searchName = `${fName.toLowerCase()} ${lName.toLowerCase()}`

    // 1. Check for duplicate email submission
    const emailQuery = query(RSVPS_REF, where('email', '==', email))
    const emailSnap = await getDocs(emailQuery)
    if (!emailSnap.empty) {
      throw new Error('This email address has already submitted an RSVP.')
    }

    // 2. Query Firestore allowed guests to check if whitelist is empty
    const whitelistRef = collection(db, 'invited_guests')
    const anyGuestQuery = query(whitelistRef, limit(1))
    const anyGuestSnap = await getDocs(anyGuestQuery)
    
    // If the whitelist is NOT empty, validate their name
    if (!anyGuestSnap.empty) {
      const matchQuery = query(whitelistRef, where('name_lowercase', '==', searchName))
      const matchSnap = await getDocs(matchQuery)
      if (matchSnap.empty) {
        throw new Error(`We're sorry, but "${fName} ${lName}" is not on the guest list. Please make sure the spelling matches your invitation, or contact the couple.`)
      }
    }

    // 3. Write RSVP
    const entry = {
      ...formData,
      first_name: fName,
      last_name: lName,
      email,
      submitted_at: serverTimestamp(),
    }
    const docRef = await addDoc(RSVPS_REF, entry)
    return { id: docRef.id, ...entry }
  }, [])

  // ── Delete RSVP ───────────────────────────────────────────────────
  const deleteRsvp = useCallback(async (id) => {
    await deleteDoc(doc(db, 'rsvps', id))
  }, [])

  // ── Reset to defaults ─────────────────────────────────────────────
  const resetToDefaults = useCallback(async () => {
    if (!confirm('Reset ALL wedding info to defaults? This cannot be undone.')) return
    await setDoc(CONFIG_REF, DEFAULTS)
  }, [])

  return (
    <WeddingContext.Provider value={{
      ...config,
      images: config.images ?? DEFAULTS.images,
      loading,
      error,
      uploadProgress,
      rsvps,

      update,
      updateBulk,
      updateScheduleItem,
      updateStoryParagraph,
      updateGalleryLabel,
      uploadMainImage,
      uploadGalleryImage,
      submitRsvp,
      deleteRsvp,
      resetToDefaults,
    }}>
      {children}
    </WeddingContext.Provider>
  )
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding must be inside WeddingProvider')
  return ctx
}
