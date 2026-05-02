'use client'

/**
 * Sanity Studio embarqué dans Next.js
 * Accessible via /studio
 * Protégé en production — à sécuriser avec authentification (ex: Clerk, NextAuth)
 */

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
