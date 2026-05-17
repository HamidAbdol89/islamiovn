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
      <>
        {/* Fixed Topbar */}
<header
  className="
    fixed inset-x-0 top-0 z-50
    border-b border-border
    bg-background
  "
>
  <div
    className="
      relative flex items-center justify-center
      h-14 px-4
      pt-[env(safe-area-inset-top)]
    "
  >
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleGoBack}
      className="
        absolute left-4
        rounded-full
      "
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>

    <h1 className="pointer-events-none text-[15px] font-semibold tracking-[-0.01em] text-foreground">
      {VIETNAMESE_TEXT.title}
    </h1>
  </div>
</header>

        {/* Spacer */}
        <div className="h-14" />

        {/* Main Header Content */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
            {/* Title */}
            <div className="text-center">
        

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
                  <Badge
                    variant="accent"
                    className="px-3 py-1 text-sm"
                  >
                    Tổng cộng: {tongSoMasjid}
                  </Badge>
                </motion.div>

                <AnimatePresence>
                  {favoritesCount > 0 && (
                    <motion.div
                      key={favoritesCount}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: -5,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <Badge
                        variant="default"
                        className="px-3 py-1 text-sm"
                      >
                        Yêu thích: {favoritesCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          {/* Important Notice */}
<Alert
  className="
    rounded-2xl
    border-border/50
    bg-muted/40
    shadow-none
  "
>
  <AlertTriangle
    className="
      h-4 w-4
      text-muted-foreground/70
    "
  />

  <AlertDescription
    className="
      text-sm leading-relaxed
      text-muted-foreground
    "
  >
    <span className="font-medium text-foreground">
      {VIETNAMESE_TEXT.importantNotice.title}
    </span>{" "}
    {VIETNAMESE_TEXT.importantNotice.content}
  </AlertDescription>
</Alert>
          </div>
        </div>
      </>
    )
  }
)

MasjidHeader.displayName = "MasjidHeader"

export default MasjidHeader