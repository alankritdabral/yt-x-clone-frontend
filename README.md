# YT-X Clone Frontend

A modern React frontend for the YouTube/X (Twitter) Clone platform. Built with Vite, featuring video streaming, tweeting, comments, playlists, and more.

## 🚀 Features

- **Video Management**: Upload, view, search, and manage videos
- **Social Features**: Like videos, add comments, subscribe to channels
- **Playlists**: Create and manage video playlists
- **Tweets**: Post tweets and interact with the Twitter-like feed
- **User Authentication**: Register, login, and manage user profiles
- **Responsive Design**: Mobile-friendly UI with adaptive layouts
- **Modern Stack**: React 18+, Vite, Axios, and custom hooks

## 📋 Prerequisites

- Node.js 14.0 or higher
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend root directory (use `.env.example` as template):

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Server Configuration
VITE_SERVER_PORT=5173
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SOCIAL_LOGIN=false
VITE_ENABLE_NOTIFICATIONS=true

# OAuth Configuration (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id

# Cloudinary Configuration (Optional)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/               # API service files
│   │   ├── axiosClient.js
│   │   ├── commentAPI.js
│   │   ├── likeAPI.js
│   │   ├── playlistAPI.js
│   │   ├── subscriptionAPI.js
│   │   ├── tweetAPI.js
│   │   ├── userAPI.js
│   │   └── videoAPI.js
│   ├── components/        # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── VideoCard.jsx
│   ├── constants/         # App-wide constants
│   │   └── index.js
│   ├── hooks/             # Custom React hooks
│   │   ├── useAPI.js
│   │   ├── useAuth.js
│   │   ├── useForm.js
│   │   └── useVideos.js
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── VideoPage.jsx
│   │   ├── PlaylistPage.jsx
│   │   └── TweetFeedPage.jsx
│   ├── styles/            # CSS modules and global styles
│   ├── utils/             # Utility functions
│   │   ├── errorHandler.js
│   │   ├── helpers.js
│   │   └── storage.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example           # Environment variables template
├── package.json
├── vite.config.js
└── README.md
```

## 🔗 API Integration

### Using API Services

Import and use API services in your components:

```javascript
import videoAPI from '../api/videoAPI'
import { useAPI } from '../hooks/useAPI'

const MyComponent = () => {
  const { loading, error, request } = useAPI()

  const fetchVideos = async () => {
    try {
      const data = await request(() => videoAPI.getAllVideos())
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }

  return <button onClick={fetchVideos}>Fetch Videos</button>
}
```

### Available API Services

- **videoAPI** - Video CRUD and search operations
- **userAPI** - User authentication and profile management
- **tweetAPI** - Tweet creation and management
- **playlistAPI** - Playlist operations
- **commentAPI** - Comment management
- **likeAPI** - Like/unlike operations
- **subscriptionAPI** - Subscription management

## 🎯 Custom Hooks

### useAuth

Manage user authentication:

```javascript
import { useAuth } from '../hooks/useAuth'

const LoginComponent = () => {
  const { login, user, isAuthenticated } = useAuth()

  const handleLogin = async (email, password) => {
    await login(email, password)
  }

  return isAuthenticated ? <div>Welcome {user.username}</div> : <LoginForm />
}
```

### useVideos

Fetch and manage videos:

```javascript
import { useVideos } from '../hooks/useVideos'

const VideoList = () => {
  const { videos, loading, fetchVideos } = useVideos()

  useEffect(() => {
    fetchVideos()
  }, [])

  return loading ? <p>Loading...</p> : <div>{/* Render videos */}</div>
}
```

### useForm

Handle form state and validation:

```javascript
import { useForm } from '../hooks/useForm'

const MyForm = () => {
  const { values, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    (values) => console.log(values)
  )

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## 🎨 Styling

The application uses CSS modules and global CSS files. All styles follow the YouTube/X design system with:

- Responsive design for mobile, tablet, and desktop
- Consistent color scheme and typography
- Smooth transitions and hover effects
- Grid-based layouts for video feeds

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:

1. User registers/logs in
2. Access token is stored in localStorage
3. All API requests include the token in the Authorization header
4. Token is automatically refreshed on 401 responses
5. Failed refresh redirects to login page

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `10000` |
| `VITE_SERVER_PORT` | Dev server port | `5173` |
| `VITE_NODE_ENV` | Environment (development/production) | `development` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `true` |
| `VITE_ENABLE_SOCIAL_LOGIN` | Enable Google/GitHub login | `false` |
| `VITE_ENABLE_NOTIFICATIONS` | Enable push notifications | `true` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `` |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth client ID | `` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | `` |

## 🚨 Error Handling

The application includes comprehensive error handling:

- **API Errors**: Handled with `handleAPIError` utility
- **Form Validation**: Built into custom hooks
- **Network Errors**: Graceful fallback messages
- **Authentication Errors**: Auto-redirect to login

## 📦 Dependencies

Key dependencies:

- **axios** - HTTP client for API calls
- **react** - UI library
- **react-dom** - React DOM rendering
- **vite** - Build tool and dev server

## 🔍 Code Quality

- ESLint configuration included
- Comments and TODOs for implementation guidance
- Consistent code style and structure
- Error boundaries and error handling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting Services

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 Notes

- All TODO comments indicate areas where backend integration is needed
- Ensure backend API is running before starting the frontend
- Check `.env` configuration before running the app
- Use custom hooks for data fetching to maintain code consistency

## 🐛 Troubleshooting

### API Connection Issues

1. Ensure backend is running on correct port
2. Check `VITE_API_BASE_URL` in `.env`
3. Verify CORS is properly configured in backend

### Build Errors

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear vite cache: `rm -rf .vite`
3. Check Node.js version compatibility

### Authentication Issues

1. Clear localStorage
2. Verify token storage in browser DevTools
3. Check API response format matches expectations

## 📞 Support

For issues and questions, please refer to the backend documentation or create an issue in the repository.

## 📄 License

This project is part of the YT-X Clone application. All rights reserved.
