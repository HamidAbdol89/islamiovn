# React Webapp: Best Practices & Libraries

## 1. State & Data Management
- **`@tanstack/react-query`**: fetch, cache, prefetch data, tránh re-fetch bừa bãi.
- **`zustand`**: lightweight state management, ideal cho UI hoặc small global state.
- **`redux-toolkit`**: cho app phức tạp, nhiều state, middleware logic.

## 2. Animation & Motion
- **`framer-motion`**: route transition, layout animation, micro-interaction.
- **`react-spring`**: animation physics “thật”, tốt cho scroll/hover effects.
- **`lottie-react`**: render Lottie JSON đẹp.
- **`react-intersection-observer`**: trigger animation khi element vào viewport.

**Tips:**
- Lazy load Lottie, chỉ play khi visible.
- Dùng CSS transform (`translate`, `scale`, `opacity`) để GPU accelerate.
- Hạn chế animation loop nhiều trên 1 page.

## 3. Routing
- **`react-router-dom`**: chuẩn, support nested & dynamic route.
- **`react-location`**: alternative, hỗ trợ data fetching trên route.

## 4. UI Components & Styling
- **`shadcn/ui` + Tailwind**: ready-to-use, responsive, animation-friendly.
- **`radix-ui`**: accessible, headless component.
- **`clsx` / `cn`**: handle dynamic class dễ dàng.

## 5. List / Table / Scroll Performance
- **`react-window` / `react-virtualized`**: render list dài mượt.
- **`react-infinite-scroll-component`**: scroll load, lazy load content.

## 6. Forms & Validation
- **`react-hook-form`**: lightweight, performant, easy validation.
- **`zod`**: schema validation, tích hợp tốt với react-hook-form.

## 7. Misc / Helpers
- **`date-fns`**: xử lý date nhẹ, modular.
- **`axios`**: fetch API, dễ setup interceptors.
- **`react-hot-toast`**: toast nhẹ, animation đẹp.
- **`web-vitals`**: đo hiệu suất webapp.

---

# Performance “Tối Kỵ”
1. **Re-render vô tội vạ**
   - State global bừa bãi, component không memo.
2. **Animation nặng / quá nhiều**
   - Lottie loop quá nhiều, CSS/JS animate layout.
3. **Load tài nguyên lớn**
   - JS bundle, image, font chưa tối ưu.
4. **Network / API call bừa bãi**
   - Không cache, mỗi render fetch API.
5. **DOM quá sâu / layout phức tạp**
   - Nested div quá nhiều, flex/grid phức tạp + animation.
6. **Logic nặng trên main thread**
   - Loops, sort/filter list dài trong render.

**Cách khắc phục:** memoization, virtualized list, lazy load, cache API, GPU transform, code split, web worker.

---

# Animation + UX Tips
- Dùng **motion + Lottie hợp lý**:
  - Lottie: highlight/hero/splash.
  - Motion/CSS: micro-interaction, hover, route transition.
- Animation thời gian hợp lý:
  - 200–300ms: micro-interaction.
  - 400–600ms: transition trang.
- Easing: `easeInOut`, spring physics.
- Micro-interaction: hover scale, shadow, fade-in/out.

---

# Lottie Best Practices
- Lazy load, play only when visible.
- Reuse JSON, tránh copy nhiều chỗ.
- Optimize JSON size (minify, đơn giản hóa vector/mask).
- Dùng segments/goToAndStop nếu loop dài.
