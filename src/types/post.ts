export type PostStyle = 'personal' | 'data' | 'howto' | 'takeaways' | 'question' | 'story'

export interface PostOption {
  id: string
  angle: string
  content: string
  style: PostStyle
  estimated_engagement: number
  previousVersion?: string // Per tracciare modifiche
}

export type OutputStyle = 'short' | 'structured' | 'story'
export type ActiveMode = 'text' | 'media' | 'link'
