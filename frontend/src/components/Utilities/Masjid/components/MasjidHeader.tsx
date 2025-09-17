import React from 'react'
import BackButton from '@/components/ui/BackButton'
import type { MasjidHeaderProps } from '../types'
import { VIETNAMESE_TEXT } from '../constants'

/**
 * Header component cho Masjid Locator (Vietnamese UI)
 */
const MasjidHeader = React.memo<MasjidHeaderProps>(() => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <BackButton />

      <span className="text-xl">🕌</span>

      <div className="flex flex-col">
        <h1 className="text-base font-semibold leading-tight text-foreground">
          {VIETNAMESE_TEXT.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          {VIETNAMESE_TEXT.subtitle}
        </p>
      </div>
    </div>
  )
})

MasjidHeader.displayName = 'MasjidHeader'

export default MasjidHeader
