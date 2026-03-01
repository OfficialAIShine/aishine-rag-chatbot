# Smartbhai - Flight Coupon Assistant

A Next.js-based chat application that provides an AI-powered flight coupon assistant. Users can interact with an AI chatbot to find flight offers, discounts, and deals.

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chatbot for flight-related queries
- **Real-time Communication**: Live chat with AI assistant
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Auto-scrolling Messages**: Smooth chat experience with auto-scroll to latest messages
- **Dynamic Text Input**: Auto-resizing textarea for better user experience
- **Infinite Scroll Animation**: Eye-catching animated banner
- **Modern UI**: Clean, modern interface with custom styling

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.2
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **Markdown Support**: React Markdown for rich text rendering
- **Environment**: Node.js with dotenv support

## 📁 Project Structure

```
frontend/
├── app/
│   ├── chat/
│   │   └── flight/
│   │       └── page.js          # Main chat interface
│   ├── favicon.ico
│   ├── globals.css              # Global styles and animations
│   └── layout.js                # Root layout with fonts and header
├── components/
│   ├── Category.js              # Category navigation component
│   ├── Footer.js                # Footer component (empty)
│   ├── Header.js                # Header with menu and branding
│   ├── InfiniteScroll.js       # Animated scrolling banner
│   └── Navbar.js                # Navigation bar with categories
├── public/
│   ├── category/
│   │   └── flight.png           # Flight category icon
│   └── icons/
│       ├── menu.svg             # Menu icon
│       ├── microphone.png       # Microphone icon
│       └── submit.svg           # Submit button icon
├── middleware.js                # Route redirection middleware
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
└── jsconfig.json                # JavaScript path mapping
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager

### Installation Steps

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://your-backend-url/api/chat
   ```
   Replace `http://your-backend-url/api/chat` with your actual backend API endpoint.

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Core Functionality

### Chat Interface
- **Main Chat Page**: Located at `/chat` (redirects from root `/`)
- **AI Assistant**: Provides flight coupon assistance and recommendations
- **Message History**: Maintains conversation context
- **Real-time Responses**: Fetches AI responses from backend API

### Key Components

#### 1. **Header Component** (`components/Header.js`)
- Displays "Smartbhai" branding
- Includes menu icon for navigation
- Fixed header with consistent styling

#### 2. **Chat Interface** (`app/chat/page.js`)
- Interactive chat with AI assistant
- Auto-scrolling message container
- Dynamic textarea with auto-resize
- Loading states and error handling
- Markdown support for rich text responses

#### 3. **Infinite Scroll Banner** (`components/InfiniteScroll.js`)
- Animated scrolling text banner
- CSS animations for smooth infinite scroll
- Eye-catching visual element

#### 4. **Navigation** (`components/Navbar.js` & `components/Category.js`)
- Category-based navigation
- Flight category with icon
- Extensible for additional categories

### Styling & Design

#### Color Scheme
- **Background**: `#EFEAE2` (warm beige)
- **Header Background**: `#F7F1ED` (light beige)
- **User Messages**: `#44403C` (dark gray)
- **AI Messages**: White background
- **Submit Button**: `#4C8829` (green)

#### Typography
- **Primary Font**: Geist Sans
- **Monospace Font**: Geist Mono
- **Fallback**: Arial, Helvetica, sans-serif

#### Animations
- **Infinite Scroll**: 40-second linear animation
- **Message Transitions**: Smooth scrolling behavior
- **Loading States**: Pulse animation for AI responses

## 🔧 Configuration

### Next.js Configuration (`next.config.mjs`)
- Basic Next.js setup with default configuration
- Ready for custom configurations as needed

### Tailwind CSS (`tailwind.config.js`)
- Content paths configured for app directory structure
- Dark mode support based on system preference
- Custom animations and utilities

### Path Mapping (`jsconfig.json`)
- `@/*` maps to project root for clean imports
- Enables absolute imports throughout the project

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Ensure the following environment variable is set:
- `NEXT_PUBLIC_BACKEND_URL`: Backend API endpoint for chat functionality

## 🔄 API Integration

The application expects a backend API endpoint that:
- Accepts POST requests
- Expects JSON payload with `chat_history` array
- Returns JSON response with `answer` field
- Handles conversation context and AI responses

### Example API Request:
```json
{
  "chat_history": [
    {
      "role": "ai",
      "content": "👋 Hi! I'm your Flight Coupon Assistant..."
    },
    {
      "role": "human", 
      "content": "Find me cheap flights to Paris"
    }
  ]
}
```

### Example API Response:
```json
{
  "answer": "I found some great flight deals to Paris! Here are the best options..."
}
```

## 🎨 Customization

### Adding New Categories
1. Add new category image to `public/category/`
2. Update `components/Navbar.js` to include new category
3. Create new route in `app/chat/[category]/page.js`

### Styling Modifications
- Global styles in `app/globals.css`
- Component-specific styles using Tailwind classes
- Custom animations and utilities defined in CSS

### Backend Integration
- Update `NEXT_PUBLIC_BACKEND_URL` environment variable
- Modify API call in `app/chat/page.js` if needed
- Add error handling and loading states as required

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Errors**:
   - Verify `NEXT_PUBLIC_BACKEND_URL` is correctly set
   - Check backend server is running and accessible
   - Ensure CORS is configured on backend

2. **Build Errors**:
   - Clear `.next` folder and rebuild
   - Check for TypeScript/JavaScript syntax errors
   - Verify all dependencies are installed

3. **Styling Issues**:
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Verify PostCSS configuration

## 📝 Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code quality

---

**Note**: This application requires a backend API to function properly. Ensure the backend is running and accessible before using the chat functionality.
