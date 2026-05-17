"use client"

import { useState } from "react"
import { Drawer } from "vaul"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

import {
  Heart,
  Bookmark,
  ZoomIn,
  ZoomOut,
  Type,
  Share2,
  Copy,
  MessageCircle,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { HadithDetailSheetProps } from "../types"

const HadithDetailSheet = ({
  selectedHadith,
  isLoading,
  favorites,
  bookmarks,
  onClose,
  onToggleFavorite,
  onToggleBookmark,
}: HadithDetailSheetProps) => {
  const [fontSize, setFontSize] = useState<number>(1)

  const increaseFontSize = () =>
    setFontSize((p) => Math.min(p + 0.1, 1.5))

  const decreaseFontSize = () =>
    setFontSize((p) => Math.max(p - 0.1, 0.8))

  const resetFontSize = () => setFontSize(1)

  const shareHadith = async (
    method: "copy" | "whatsapp" | "telegram"
  ) => {
    if (!selectedHadith) return

    const shareText = `📖 ${selectedHadith.title.replace(/{/g, "")}

${selectedHadith.hadeeth.replace(/<[^>]*>/g, "")}

📚 ${selectedHadith.attribution}

🔗 Từ islam.io.vn`

    try {
      if (method === "copy") {
        await navigator.clipboard.writeText(shareText)
      }

      if (method === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`
        )
      }

      if (method === "telegram") {
        window.open(
          `https://t.me/share/url?text=${encodeURIComponent(shareText)}`
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Drawer.Root
      open={!!selectedHadith}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Drawer.Portal>
        {/* overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/50" />

        {/* sheet */}
        <Drawer.Content
          className="
            fixed bottom-0 left-0 right-0
            max-h-[92vh]
            bg-background
            rounded-t-2xl
            border-t
            flex flex-col
          "
        >
          {/* handle */}
          <div className="mx-auto mt-2 mb-2 h-1.5 w-12 rounded-full bg-muted" />

          {/* HEADER */}
          <div className="px-4 pt-2 pb-3">
            <h2 className="text-base font-semibold leading-snug line-clamp-2">
              {selectedHadith?.title?.replace(/{/g, "")}
            </h2>

            <p className="text-sm text-muted-foreground">
              {selectedHadith?.attribution}
            </p>

            {/* toolbar */}
            <div className="flex items-center gap-1 mt-3">
              <Button variant="ghost" size="icon" onClick={decreaseFontSize}>
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={resetFontSize}>
                <Type className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={increaseFontSize}>
                <ZoomIn className="h-4 w-4" />
              </Button>

              <div className="ml-auto flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (!selectedHadith) return
                    onToggleFavorite(selectedHadith.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      selectedHadith &&
                      favorites.includes(Number(selectedHadith.id))
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (!selectedHadith) return
                    onToggleBookmark(selectedHadith.id)
                  }}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      selectedHadith &&
                      bookmarks.includes(Number(selectedHadith.id))
                        ? "fill-blue-500 text-blue-500"
                        : ""
                    }`}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => shareHadith("copy")}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => shareHadith("whatsapp")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => shareHadith("telegram")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Telegram
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              selectedHadith && (
                <>
                  {/* HADITH */}
                  <div
                    className="bg-muted/40 p-3 rounded-lg text-sm leading-relaxed"
                    style={{ fontSize: `${fontSize}rem` }}
                    dangerouslySetInnerHTML={{
                      __html: selectedHadith.hadeeth,
                    }}
                  />

                  {/* EXPLANATION */}
                  {selectedHadith.explanation && (
                    <>
                      <Separator />

                      <div
                        className="text-sm text-muted-foreground"
                        style={{ fontSize: `${fontSize}rem` }}
                        dangerouslySetInnerHTML={{
                          __html: selectedHadith.explanation,
                        }}
                      />
                    </>
                  )}

                  {/* FAWAED */}
                  {selectedHadith.fawaed?.length > 0 && (
                    <>
                      <Separator />

                      <ul className="space-y-2">
                        {selectedHadith.fawaed.map((f, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm"
                            style={{ fontSize: `${fontSize}rem` }}
                          >
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary" />
                            <span
                              dangerouslySetInnerHTML={{ __html: f }}
                            />
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default HadithDetailSheet