export interface Event {
  id: string
  EventTitle: string
  disc: string
  date: string
  time: string
  location: string
  image: string
  createdAt: Date
  updatedAt: Date
  Imgurl: string
  category: string
  featured?: boolean
}

export interface Sermon {
  id: string
  SermonTitle: string
  preacher: string
  description: string
  date: string
  videoUrl: string
  transcript?: string
  topic?: string
  image: string
  createdAt: Date
  updatedAt: Date
  Imgurl: string
}


export interface SermonForm {
  SermonTitle: string
  preacher: string
  topic: string
  description?: string
  videoUrl?: string
  Imgurl?: string
  image?: string
  date: string
}
export interface GalleryImage {
  id?: string
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt?: any
  updatedAt?: any
}



export interface BlogPost {
  id?: string
  title: string
  content: string
  date: string
  imageUrl?: string

  author?: string
  image?: string
  slug?: string
  createdAt?: any
  updatedAt?: any
}

export interface Testimony {
  id?: string
  name: string
  title: string
  story: string
  date: string
  imageUrl?: string
  approved?: boolean
  createdAt?: any
}

export interface Message {
  id?: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  date?: string
  read?: boolean
  createdAt?: any
}
export interface LiveStream {
  id: string
  title: string
  description: string
  streamUrl: string
  isLive: boolean
  startTime: string
  createdAt: Date
  updatedAt: Date
}

export type MemberType = 'member' | 'non-member'

export type AgeGroup = 'adult' | 'youth' | 'teenager' | 'child'

export interface EventRegistration {
  // eventId:string
  eventId: string
  id?: string
  eventTitle: string

  name: string
  email: string
  phone: string
  category: string

  gender: 'male' | 'female'

  ageGroup: AgeGroup
  

  memberType: MemberType

  // RCCG branch
  branch: string
  needsAccommodation: boolean

  // Only really needed for non-members
  churchName?: string

  // Automatically assigned
  studyGroup: string | null
  accommodation: string | null

  createdAt?: any
}

export interface ConventionSettings {
  id?: string

  studyGroupCount: number
  accommodationCount: number

  updatedAt?: any
}