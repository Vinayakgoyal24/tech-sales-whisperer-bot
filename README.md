# AI Sales Agent Frontend

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [User Interface & Experience](#user-interface--experience)
4. [Technology Stack](#technology-stack)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Usage](#usage)
8. [Component Architecture](#component-architecture)
9. [API Integration](#api-integration)
10. [Development Guidelines](#development-guidelines)
11. [Contributing](#contributing)
12. [License](#license)

## Overview

The AI Sales Agent Frontend is a modern, responsive web application that provides an intuitive interface for users to interact with our AI-powered sales assistant. Built with cutting-edge web technologies, it offers a seamless experience for sales professionals to generate quotes, manage customer interactions, and access AI-driven insights.

## Features

### Core User Interface Components

#### **Authentication System**
- **Signup Page**: Clean, user-friendly registration interface with form validation
- **Login Page**: Secure authentication with JWT token management
- **User Profile Management**: Access to user settings and account information

#### **Chat Interface**
- **Real-time Messaging**: Instant communication with the AI sales agent
- **Message History**: Persistent conversation storage and retrieval
- **Typing Indicators**: Visual feedback for ongoing AI processing
- **Message Status**: Delivery confirmations and error handling

#### **Voice Integration**
- **Voice Switch**: Toggle between text and voice input modes
- **Speech Recognition**: Convert spoken queries to text using Web Speech API
- **Voice Synthesis**: AI responses can be read aloud to users
- **Microphone Controls**: Intuitive voice recording interface

#### **Language Support**
- **Language Switch**: Seamless toggle between English and Japanese
- **Bilingual Interface**: Complete UI localization for both languages
- **Dynamic Content**: Real-time language switching without page reload
- **Cultural Adaptation**: Language-specific formatting and conventions

#### **Navigation & History**
- **Side Sidebar**: Collapsible navigation panel with chat history
- **Chat History**: Organized conversation threads with timestamps

### Advanced Features

#### **Interactive UI Elements**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth animaly error messages and recovery options


## User Interface & Experience

### Design Principles

#### **Modern & Intuitive**
- Clean, minimalist design following Material Design principles
- Consistent color scheme and typography across all components
- Intuitive navigation with clear visual hierarchy

#### **Responsive & Adaptive**
- Mobile-first design approach
- Fluid layouts that adapt to different screen sizes
- Keyboard navigation support for desktop users

#### **Performance-Focused**
- Smooth animations and transitions
- Efficient state management
- Optimized asset loading and caching

### User Experience Features

### Interactive Elements

#### **Chat Interface Design**
- **Message Bubbles**: Distinct styling for user and AI messages
- **Timestamp Display**: Clear timing information for conversations
- **Reaction System**: Quick feedback options for AI responses
- **Message Actions**: Copy, share, and save individual messages

#### **Voice Interface**
- **Visual Feedback**: Waveform visualization during voice input
- **Voice Activity Detection**: Automatic start/stop recording
- **Language Detection**: Automatic language switching based on speech
- **Voice Settings**: Customizable speech synthesis options

#### **Language Switching**
- **Instant Translation**: Real-time interface language switching
- **Flag Icons**: Visual language indicators
- **Auto-detection**: Automatic language preference based on browser settings

## Technology Stack

### Frontend Framework
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Fast build tool with hot module replacement
- **React Router**: Client-side routing and navigation

### UI Libraries & Styling
- **Material-UI (MUI)**: Component library for consistent design
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth interactions
- **React Icons**: Comprehensive icon library

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with ES6+ support
- Backend API server running

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ai-sales-agent-frontend.git
cd ai-sales-agent-frontend

# Install dependencies
npm install
# or
yarn install

# Install additional packages
npm install @mui/material @emotion/react @emotion/styled
npm install axios react-query framer-motion
npm install react-router-dom @reduxjs/toolkit react-redux
```

### Development Dependencies

```bash
# Install development tools
npm install --save-dev @types/react @types/node
npm install --save-dev eslint prettier @testing-library/react
npm install --save-dev @vitejs/plugin-react typescript
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_SECRET=your_jwt_secret
VITE_TOKEN_STORAGE_KEY=ai_sales_agent_token

# Features
VITE_ENABLE_VOICE=true
VITE_ENABLE_DARK_MODE=true
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ja

# WebSocket Configuration
VITE_WS_URL=ws://localhost:8000/ws
VITE_WS_RECONNECT_INTERVAL=5000

# Speech Recognition
VITE_SPEECH_RECOGNITION_LANG=en-US
VITE_SPEECH_SYNTHESIS_VOICE=default

# UI Configuration
VITE_THEME_PRIMARY_COLOR=#1976d2
VITE_THEME_SECONDARY_COLOR=#dc004e
VITE_ENABLE_ANIMATIONS=true
```

### Build Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000
  }
})
```

## Usage

### Starting the Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev

```

## Component Architecture

### Authentication Components

#### Login Component
```typescript
interface LoginProps {
  onLogin: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading, error }) => {
  // Component implementation
};
```

#### Signup Component
```typescript
interface SignupProps {
  onSignup: (userData: UserData) => void;
  loading?: boolean;
  error?: string;
}

const Signup: React.FC<SignupProps> = ({ onSignup, loading, error }) => {
  // Component implementation
};
```


## API Integration

### Authentication API

```typescript
// services/auth.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  },

  signup: async (userData: UserData) => {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/me`);
    return response.data;
  }
};
```


## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement proper error boundaries
- Use consistent naming conventions
- Write comprehensive unit tests

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Start development server (`npm run dev`)
5. Make your changes
6. Run tests (`npm test`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
