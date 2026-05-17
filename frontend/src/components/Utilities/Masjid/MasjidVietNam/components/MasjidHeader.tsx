import React from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import { VIETNAMESE_TEXT } from "../constants"

interface MasjidHeaderProps {
  tongSoMasjid: number
  favoritesCount?: number
}

const MasjidHeader: React.FC<MasjidHeaderProps> = React.memo(
  ({ tongSoMasjid, favoritesCount = 0 }) => {
    const navigate = useNavigate()
    const handleGoBack = () => navigate(-1)

    return (
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-2xl">
              {VIETNAMESE_TEXT.title}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {VIETNAMESE_TEXT.subtitle}
            </p>

          {/* Stats */}
<div className="mt-3 flex items-center justify-center gap-3">
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <Badge variant="secondary" className="px-3 py-1 text-sm">
      Tổng cộng: {tongSoMasjid}
    </Badge>
  </motion.div>

  <AnimatePresence>
    {favoritesCount > 0 && (
      <motion.div
        key={favoritesCount} // re-animate khi số thay đổi
        initial={{ opacity: 0, scale: 0.8, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Badge variant="default" className="px-3 py-1 text-sm">
          Yêu thích: {favoritesCount}
        </Badge>
      </motion.div>
    )}
  </AnimatePresence>
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="rounded-xl border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-300">
              <strong>{VIETNAMESE_TEXT.importantNotice.title}</strong>{" "}
              {VIETNAMESE_TEXT.importantNotice.content}
            </AlertDescription>
          </Alert>
        </div>
      </header>
    )
  }
)

MasjidHeader.displayName = "MasjidHeader"

export default MasjidHeader
