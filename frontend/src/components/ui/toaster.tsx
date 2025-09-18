import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Check, X, AlertTriangle, Info } from "lucide-react"

// iOS-style icon with background for different toast variants
const getToastIcon = (variant?: string | null) => {
  switch (variant) {
    case 'success':
      return (
        <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        </div>
      )
    case 'destructive':
      return (
        <div className="flex-shrink-0 w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
        </div>
      )
    case 'warning':
      return (
        <div className="flex-shrink-0 w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        </div>
      )
    case 'info':
      return (
        <div className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        </div>
      )
    default:
      return null // No icon for default variant
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            {/* iOS-style icon */}
            {getToastIcon(variant)}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <ToastTitle>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>
                  {description}
                </ToastDescription>
              )}
            </div>
            
            {/* Action (if any) */}
            {action && action}
            
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
