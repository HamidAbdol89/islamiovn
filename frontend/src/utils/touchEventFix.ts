// Fix for touch event conflicts and intervention warnings
import { getMobileSettings } from './mobileOptimizations';

// Disable pull-to-refresh globally on mobile to prevent conflicts
export const disablePullToRefresh = () => {
  const mobileSettings = getMobileSettings();
  
  if (mobileSettings.shouldOptimize) {
    // Add CSS to prevent pull-to-refresh
    const style = document.createElement('style');
    style.textContent = `
      /* Disable pull-to-refresh on mobile */
      body {
        overscroll-behavior-y: contain;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Prevent touch event conflicts */
      .scroll-container {
        touch-action: pan-y;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Disable browser pull-to-refresh */
      html, body {
        overflow-x: hidden;
        position: relative;
      }
      
      /* Fix for iOS Safari */
      @supports (-webkit-touch-callout: none) {
        body {
          position: fixed;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
        
        #root {
          overflow-y: auto;
          height: 100vh;
          -webkit-overflow-scrolling: touch;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Disable pull-to-refresh programmatically
    document.body.style.overscrollBehavior = 'contain';
    document.documentElement.style.overscrollBehavior = 'contain';
  }
};

// Safe event listener that checks cancelable before preventDefault
export const addSafeEventListener = (
  element: Element,
  event: string,
  handler: (e: Event) => void,
  options: AddEventListenerOptions = {}
) => {
  const safeHandler = (e: Event) => {
    // Only call preventDefault if the event is cancelable
    const originalPreventDefault = e.preventDefault;
    e.preventDefault = () => {
      if (e.cancelable) {
        originalPreventDefault.call(e);
      }
    };
    
    handler(e);
  };
  
  element.addEventListener(event, safeHandler, options);
  
  return () => {
    element.removeEventListener(event, safeHandler);
  };
};

// Simple refresh button component (no JSX)
export const createRefreshButton = (
  onRefresh: () => Promise<void> | void,
  isRefreshing: boolean = false
) => {
  const button = document.createElement('button');
  button.textContent = isRefreshing ? 'Đang tải...' : 'Làm mới';
  button.disabled = isRefreshing;
  button.className = `
    px-4 py-2 rounded-lg transition-colors
    ${isRefreshing 
      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
      : 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
  `;
  
  button.addEventListener('click', async () => {
    if (!isRefreshing) {
      await onRefresh();
    }
  });
  
  return button;
};
