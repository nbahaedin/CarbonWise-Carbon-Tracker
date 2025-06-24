# 🌱 CarbonWise - Personal Carbon Footprint Tracker

CarbonWise is a comprehensive web application designed to help individuals track, analyze, and reduce their carbon footprint through intelligent activity logging, goal setting, and community engagement.

## ✨ Features

### 🎯 Core Functionality
- **Smart Activity Logging**: Easily log eco-friendly activities with automatic carbon impact calculations
- **Advanced Analytics**: Comprehensive dashboard with charts, trends, and insights
- **Goal Setting & Tracking**: Set personalized environmental goals and monitor progress
- **Achievement System**: Earn badges and rewards for sustainability milestones
- **Streak Tracking**: Maintain daily logging streaks to build sustainable habits

### 📊 Analytics & Insights
- Real-time carbon footprint tracking with interactive charts
- Monthly and yearly impact projections
- Category-wise emission analysis (Transportation, Energy, Food, Waste)
- Trend analysis and improvement suggestions
- Comparative benchmarking with community averages
- Weekly progress reports with actionable insights

### 🏆 Gamification
- Achievement badges for various milestones (First Activity, Week Warrior, Eco Champion, etc.)
- Daily streak tracking with visual progress indicators
- Community challenges and competitions
- Progress sharing and social features
- Impact certificates and detailed reports

### 🌍 Community Features
- Community challenges and leaderboards
- Impact stories and testimonials
- Carbon offset marketplace integration
- Social sharing of achievements
- Peer-to-peer motivation and support

### 🔐 Authentication & Security
- **Secure Email Authentication**: Sign up and sign in with email verification
- **OTP Password Reset**: Secure password reset via email-delivered OTP codes
- **Profile Management**: Complete user profile with preferences and settings
- **Session Management**: Secure session handling with automatic logout
- **Row Level Security**: Database-level security with Supabase RLS policies

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Intuitive Navigation**: Clean, modern interface with easy navigation
- **Real-time Updates**: Live data updates without page refreshes
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading indicators and skeleton screens

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks + Context

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom OTP system
- **Real-time**: Supabase Realtime subscriptions
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes + Server Actions
- **Email**: Custom OTP email system via Edge Functions

### Development & Deployment
- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Deployment**: Vercel
- **Environment**: Node.js 18+
- **Database Scripts**: Automated setup and seeding

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/carbonwise.git
   cd carbonwise
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Optional: For custom email webhook
   EMAIL_WEBHOOK_URL=your_email_webhook_url
   \`\`\`

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts/` folder in numerical order:
     - `001-create-tables.sql` - Core database tables
     - `002-seed-data.sql` - Initial data and categories
     - `003-create-functions.sql` - Database functions
     - `004-fix-auth-trigger.sql` - Authentication triggers
     - `005-enhanced-schema.sql` - Enhanced features
     - `006-update-functions.sql` - Function updates
     - `007-fix-database-issues.sql` - Bug fixes
     - `008-fix-ambiguous-column.sql` - Column fixes
     - `009-final-fix-ambiguous-column.sql` - Final column fixes
     - `010-fix-streak-calculation.sql` - Streak calculation fixes

5. **Configure authentication**
   - Enable email authentication in Supabase
   - Set up custom email templates (optional)
   - Configure redirect URLs for your domain

6. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
carbonwise/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   ├── signup/        # Sign up page
│   │   ├── forgot-password/ # Password reset
│   │   └── otp-info/      # OTP information
│   ├── dashboard/         # Dashboard pages
│   ├── features/          # Feature pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── how-it-works/      # How it works page
│   ├── actions/           # Server actions
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── homepage/         # Homepage components
│   └── auth-form.tsx     # Authentication forms
├── hooks/                # Custom React hooks
│   └── use-auth.tsx      # Authentication hook
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   └── supabase.ts       # Supabase client
├── scripts/              # Database scripts
│   ├── 001-create-tables.sql
│   ├── 002-seed-data.sql
│   └── ...               # Additional migration scripts
├── supabase/             # Supabase configuration
│   └── functions/        # Edge functions
└── public/               # Static assets
\`\`\`

## 🔧 Configuration

### Database Setup
The application uses Supabase as the backend. Run the SQL scripts in order:

1. **Core Tables** (`001-create-tables.sql`)
   - Users, activities, categories, goals, badges, streaks

2. **Initial Data** (`002-seed-data.sql`)
   - Activity categories, badge definitions, sample data

3. **Database Functions** (`003-create-functions.sql`)
   - Carbon calculation functions, streak tracking, badge awarding

4. **Authentication** (`004-fix-auth-trigger.sql`)
   - User profile creation triggers, RLS policies

5. **Enhanced Features** (`005-enhanced-schema.sql`)
   - Advanced analytics, community features, reporting

6. **Updates & Fixes** (`006-010-*.sql`)
   - Bug fixes, performance improvements, schema updates

### Environment Variables
Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

Optional environment variables:
- `EMAIL_WEBHOOK_URL` - Custom email webhook for OTP delivery

### Authentication Configuration
1. **Enable Email Auth** in Supabase dashboard
2. **Configure Site URL** to your domain
3. **Set up Redirect URLs** for authentication flows
4. **Deploy Edge Function** for custom OTP email delivery (optional)

## 🎨 UI/UX Design

CarbonWise features a modern, clean design with:
- **Responsive Layout**: Optimized for all device sizes
- **Accessible Components**: Following WCAG guidelines
- **Consistent Design System**: Green accent colors with professional styling
- **Intuitive Navigation**: Clear user flows and navigation patterns
- **Data Visualization**: Interactive charts and progress indicators
- **Loading States**: Smooth transitions and skeleton screens
- **Error Handling**: User-friendly error messages and recovery options

## 📱 Features in Detail

### Activity Logging
- **Quick Entry**: Fast activity logging with smart categorization
- **Smart Suggestions**: AI-powered activity recommendations
- **Photo Attachments**: Visual documentation of activities
- **Bulk Import**: CSV import for historical data
- **Automatic Calculations**: Real-time carbon impact calculations
- **Category Management**: Customizable activity categories

### Analytics Dashboard
- **Real-time Tracking**: Live carbon footprint monitoring
- **Interactive Charts**: Recharts-powered data visualizations
- **Trend Analysis**: Monthly and yearly progress tracking
- **Category Breakdown**: Detailed emission analysis by category
- **Benchmarking**: Compare with community averages
- **Export Functionality**: PDF and CSV report generation

### Goal Management
- **SMART Goals**: Specific, measurable, achievable goal setting
- **Progress Tracking**: Visual progress indicators and milestones
- **Deadline Management**: Automated reminders and notifications
- **Achievement System**: Unlock badges and rewards
- **Goal Sharing**: Community goal sharing and motivation
- **Custom Targets**: Personalized carbon reduction targets

### Authentication System
- **Email Verification**: Secure email-based registration
- **OTP Password Reset**: Email-delivered one-time passwords
- **Session Management**: Secure session handling
- **Profile Management**: Complete user profile customization
- **Security Features**: Rate limiting, secure password requirements

### Community Features
- **Leaderboards**: Community rankings and challenges
- **Impact Stories**: Share and discover success stories
- **Social Sharing**: Share achievements on social media
- **Group Challenges**: Organize team-based sustainability challenges
- **Peer Support**: Community motivation and support system

## 🤝 Contributing

We welcome contributions to CarbonWise! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Current Features ✅
- [x] User authentication with email verification
- [x] OTP-based password reset system
- [x] Activity logging with carbon calculations
- [x] Interactive analytics dashboard
- [x] Goal setting and progress tracking
- [x] Achievement badge system
- [x] Daily streak tracking
- [x] Community features and leaderboards
- [x] Responsive design for all devices
- [x] Real-time data updates
