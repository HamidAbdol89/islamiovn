# 🚀 Development Setup Guide

## Chạy song song Local + Production

### 1. **Backend Development (Port 8000)**
```bash
# Vào thư mục backend
cd backend/AI

# Cài dependencies (nếu chưa có)
npm install

# Chạy development server
npm run dev

# Hoặc với NODE_ENV explicit
NODE_ENV=development npm run dev
```

### 2. **Frontend Development (Port 5173)**
```bash
# Vào thư mục frontend
cd frontend

# Cài dependencies (nếu chưa có)
npm install

# Chạy development server
npm run dev
```

## 🔧 Environment Configuration

### **Development Mode:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Auto-detects development và sử dụng local API

### **Production Mode:**
- Frontend: `https://muslimviet.vercel.app`
- Backend: `https://mira-ai.fly.dev`
- Auto-detects production và sử dụng deployed API

## 📁 Environment Files

### **Frontend:**
- `.env` - Production settings
- `.env.development` - Development settings
- Auto-switches based on `import.meta.env.DEV`

### **Backend:**
- `.env` - Production settings (for Fly.io)
- `.env.development` - Development settings
- Auto-switches based on `NODE_ENV`

## 🔍 Debug Features

### **Development Mode có:**
- Console logging enabled
- Debug mode active
- Detailed error messages
- Environment info logging

### **Production Mode có:**
- Minimal logging
- Optimized performance
- Error tracking
- Production APIs

## 🚀 Quick Start Commands

```bash
# Terminal 1: Backend
cd backend/AI && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Truy cập: http://localhost:5173
```

## 🔧 Switching Between Environments

### **Force Development:**
```bash
# Frontend
VITE_NODE_ENV=development npm run dev

# Backend
NODE_ENV=development npm run dev
```

### **Force Production:**
```bash
# Frontend (build)
npm run build && npm run preview

# Backend
NODE_ENV=production npm start
```

## 📊 Environment Detection

Code tự động detect environment:
- `ENV.isDevelopment` - true khi dev mode
- `ENV.isProduction` - true khi production
- `getApiUrl()` - auto-switch API URLs
- `log()` - chỉ hoạt động trong dev mode
