# ChronoLink - Connecting Generations Through Timeless Stories

A full-stack web application that bridges the gap between older and younger generations through shared stories, wisdom, and experiences.

## 🌟 Overview

ChronoLink is a social platform designed to connect different generations through the power of storytelling. Whether you're sharing wisdom from decades of experience or learning from the fresh perspectives of youth, ChronoLink creates meaningful connections across age groups.

## ✨ Features

### 🔐 Authentication System
- JWT-based authentication with username/password (no email required)
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt

### 👥 User Management
- Generation-based profiles (Older/Younger)
- Interest categories (Spirituality, Literature, Art, Heritage, etc.)
- Achievement system (Best Storyteller, Cultural Keeper, etc.)
- Follow/unfollow functionality
- Profile customization with bio and interests

### 📝 Content Management
- Multi-media posts (text, images, videos)
- Category-based content organization
- Like and comment system
- Featured posts by admins
- View tracking and analytics

### 🌉 Generation Connection
- Interactive flashcards alternating between generations
- GSAP-powered animations for smooth transitions
- Dynamic color themes (Pastel for older, Bright for younger)
- Cross-generational content discovery

### 🤖 AI Recommendations
- Personalized content suggestions
- Interest-based matching algorithm
- Category filtering and search
- Smart feed generation

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- GSAP animations for enhanced user experience
- Mobile-first approach
- Accessibility-focused design

## 🛠 Tech Stack

### Frontend
- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **Language**: TypeScript
- **State Management**: RxJS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, Rate Limiting, CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd chronolink
   ```

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**:

   **Backend (.env)**:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://ChronoLink:9989371493@chronolink.jzedxh6.mongodb.net/?retryWrites=true&w=majority&appName=ChronoLink
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start the application**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000

## 📋 Demo Accounts

### Older Generation
- **grandpa_john** / password123
- **wisdom_sarah** / password123

### Younger Generation
- **young_maya** / password123
- **creative_alex** / password123

### Admin
- **admin_user** / admin123

## 📁 Project Structure

```
chronolink/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Feature components
│   │   │   ├── services/    # Angular services
│   │   │   └── guards/      # Route guards
│   │   └── environments/    # Environment configs
│   └── angular.json        # Angular configuration
└── package.json           # Root package file
```

## 🎯 Key Features Deep Dive

### Splash Screen Animation
- GSAP-powered logo zoom and slide effects
- Smooth transitions to authentication
- Brand introduction with tagline

### Authentication Flow
- Toggle between login/signup modes
- Form validation and error handling
- JWT token management
- Persistent sessions

### Home Feed
- Sidebar navigation with active states
- Post cards with hover effects
- Real-time like/comment interactions
- Infinite scroll capability

### Generation Connection Mode
- Animated arrows showing connection flow
- Swipeable flashcards with flip animations
- Alternating content from different generations
- Color-coded themes for visual distinction

### AI Recommendations
- Smart content filtering by interests
- Category-based discovery
- Personalized suggestions algorithm
- Visual feedback for user preferences

### Profile Management
- Statistics dashboard (posts, followers, following)
- Achievement badges and progress
- Interest tags for better matching
- Editable profile information

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev  # Development with nodemon
npm run seed # Seed database with sample data
```

### Frontend Development
```bash
cd frontend
npm install
ng serve     # Development server
ng build     # Production build
```

### Database Management
- MongoDB connection with retry logic
- Data validation at schema level
- Indexing for performance optimization
- Sample data seeding for development

## 🎨 Design System

### Color Palette
- **Older Generation**: Pastel beige/sepia tones
- **Younger Generation**: Bright blue/gradient colors
- **Primary**: Warm brown (#8B5A3C)
- **Secondary**: Gold accent (#D4AF37)
- **Accent**: Coral (#FF6B6B)

### Typography
- **Display Font**: Playfair Display (serif)
- **Body Font**: Inter (sans-serif)
- **Responsive scaling**: Fluid typography

### Animations
- **Page Transitions**: 0.6-0.8s duration
- **Hover Effects**: 0.2-0.3s transitions
- **Scroll Animations**: Triggered at 80% viewport
- **Loading States**: Skeleton animations

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token expiration (30 days)
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS configuration
- Error handling without information leakage

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch-Friendly**: Large tap targets
- **Performance**: Optimized for slow connections

## 🚀 Deployment

### Backend Deployment
```bash
npm install -g pm2
pm2 start backend/server.js --name "chronolink-backend"
pm2 startup
pm2 save
```

### Frontend Deployment
```bash
ng build --configuration production
# Deploy dist/frontend folder to web server
```

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB production URI
- [ ] Strong JWT secret
- [ ] CORS configured for production domain
- [ ] SSL certificate installed
- [ ] Reverse proxy configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- MongoDB Atlas for cloud database
- GSAP team for animation library
- Angular team for the amazing framework

## 📞 Support

For support, email support@chronolink.com or join our Discord community.

---

**Made with ❤️ for connecting generations**

 
