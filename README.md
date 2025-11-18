# DSA Mastery Roadmap Tracker

A comprehensive 110-day Data Structures & Algorithms learning tracker with **secure authentication**, **cloud database**, progress tracking, and streak monitoring. Production-ready and deployable in minutes!

## 🚀 Features

- ✅ **Secure Authentication** - Email-based signup with verification (Supabase Auth)
- 🗄️ **Cloud Database** - PostgreSQL database with automatic backups
- 📊 **Statistics Dashboard** - Track completion, streaks, and interview readiness
- 🔥 **Calendar-Based Streaks** - Maintain daily learning streaks with auto-calculation
- 📈 **Activity Heatmap** - GitHub-style visualization of your last 90 days
- 📝 **Personal Notes** - Add notes for each day's learning (synced to cloud)
- ⏭️ **Skip Days** - Mark days as skipped if needed
- 🔒 **Row-Level Security** - Your data is private and secure
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- ☁️ **Free Hosting** - Deploy to Vercel or Netlify at no cost
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🎯 Quick Start

New to the project? Choose your path:

- **⚡ [10-Minute Setup Guide](docs/QUICK_START.md)** - Get up and running fast
- **📖 [Complete Deployment Guide](docs/DEPLOYMENT.md)** - Detailed step-by-step instructions
- **🗄️ [Database Setup](database/README.md)** - Configure your Supabase database

## 📸 Demo

**Live Demo:** [Your deployed app URL here]

### Screenshots

```
[Add screenshots of your app here]
- Dashboard with stats
- Activity heatmap
- Week/day view
- Notes section
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - PostgreSQL database + Authentication
- **Row Level Security (RLS)** - Data isolation per user
- **Automatic Triggers** - Streak calculation on database level

### Hosting
- **Vercel** or **Netlify** - Free hosting with automatic deploys
- **Automatic HTTPS** - Secure by default

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 16+ installed ([Download](https://nodejs.org/))
- npm or yarn package manager
- A Supabase account (free) - [Sign up](https://supabase.com)
- A Vercel or Netlify account (free) for deployment

## 🚀 Installation & Setup

### Option 1: Quick Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/dsa-roadmap-tracker)

1. Click the button above
2. Follow the **[10-Minute Setup Guide](docs/QUICK_START.md)**
3. You're live!

### Option 2: Manual Setup

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dsa-roadmap-tracker.git
cd dsa-roadmap-tracker
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
3. Copy your project URL and anon key

See **[Database Setup Guide](database/README.md)** for details.

#### 4. Configure environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 5. Start development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

#### 6. Deploy to production

See **[Deployment Guide](docs/DEPLOYMENT.md)** for Vercel/Netlify deployment.

## 📁 Project Structure

```
dsa-roadmap-tracker/
│
├── docs/                           # 📚 Documentation
│   ├── DEPLOYMENT.md               # Complete deployment guide
│   └── QUICK_START.md              # 10-minute setup guide
│
├── database/                       # 🗄️ Database files
│   ├── schema.sql                  # SQL schema for Supabase
│   └── README.md                   # Database setup instructions
│
├── src/                            # 💻 Source code
│   ├── components/                 # React components
│   │   ├── Auth/
│   │   │   └── AuthModal.jsx      # Authentication modal
│   │   └── Dashboard/
│   │       ├── StatsDashboard.jsx # Statistics cards
│   │       └── ActivityHeatmap.jsx# Activity visualization
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js             # Authentication logic
│   │   └── useProgress.js         # Progress tracking
│   │
│   ├── lib/                        # Library configurations
│   │   └── supabaseClient.js      # Supabase client setup
│   │
│   ├── services/                   # API services
│   │   └── api.js                 # Database operations
│   │
│   ├── utils/                      # Utility functions
│   │   └── calculations.js        # Stats & streak calculations
│   │
│   ├── data/                       # Static data
│   │   └── roadmapData.js         # 110-day roadmap data
│   │
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
├── vercel.json                     # Vercel configuration (optional)
├── netlify.toml                    # Netlify configuration (optional)
└── README.md                       # This file
```

## 📖 Usage

### First Time Setup

1. **Sign Up**
   - Click "Login / Sign Up" in the header
   - Enter username, email, and password (min 6 characters)
   - Check your email for verification link
   - Click the verification link

2. **Login**
   - Enter your email and password
   - Start tracking your progress!

### Daily Workflow

1. **Login** to your account
2. **Expand** the current week you're working on
3. **Click on tasks** to mark them complete
4. **Add notes** for your learnings
5. **Track your streak** in the dashboard

### Features Explained

#### 🔥 Current Streak
- Tracks consecutive calendar days with at least one completed task
- Resets if you miss a day
- Updates automatically via database triggers

#### 📈 Max Streak
- Your best ever consecutive day streak
- Try to beat your record!
- Never decreases (only increases when you beat it)

#### 📊 Activity Heatmap
- Visual representation of your last 90 days
- Darker green = more tasks completed that day
- Hover over squares to see exact task count

#### 📝 Notes
- Add personal notes for each day
- Document learnings, questions, or insights
- Synced to cloud automatically
- Private to your account

#### ⏭️ Skip Days
- Mark days as skipped if you need a break
- Won't affect your streak negatively
- Can unskip later

#### 🎯 Interview Readiness Score
- Calculated based on completed days
- Shows how prepared you are
- Updates in real-time

## 🔧 Development

### Local Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Never commit the .env file to Git!
```

### Database Schema

The app uses these tables in Supabase:

- **`user_profiles`** - User profile information
- **`user_progress`** - Task completion tracking
- **`user_notes`** - User notes for each day
- **`skipped_days`** - Days that users skip
- **`user_stats`** - Cached statistics (streaks, totals)

All tables have Row Level Security (RLS) enabled for data privacy.

## 🎨 Customization

### Update Roadmap Data

Edit `src/data/roadmapData.js` to:
- Add more weeks or days
- Change topics and resources
- Update task descriptions
- Modify difficulty levels

### Change Colors

Update Tailwind classes throughout components:
- Primary: `indigo-600` → Your color
- Secondary: `purple-600` → Your color
- Accent: `green-500`, `orange-500` → Your colors

### Add Custom Features

1. Create new components in `src/components/`
2. Add business logic in `src/services/api.js`
3. Update database schema in `database/schema.sql`
4. Re-run schema in Supabase SQL Editor

## 🔒 Security

### What's Secure

✅ Passwords hashed by Supabase Auth (bcrypt)  
✅ Row Level Security (RLS) prevents data leaks  
✅ Environment variables for API keys  
✅ HTTPS enforced in production  
✅ Email verification required  
✅ Session management handled by Supabase  

### Best Practices

- Never commit `.env` files to Git
- Use strong passwords for Supabase dashboard
- Enable 2FA on Vercel/Netlify
- Regularly update dependencies: `npm audit fix`
- Monitor Supabase logs for suspicious activity

## 📊 Database Backup

### Automatic Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups, 7-day retention
- **Pro tier**: Daily backups, longer retention

### Manual Backup

1. Go to Supabase Dashboard → Database → Backups
2. Click "Download" for latest backup
3. Store safely

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check environment variables are set correctly
- Verify `.env` file exists locally
- On Vercel: Check Settings → Environment Variables

### "Email not confirmed" Error
- Check spam folder for verification email
- Resend: Supabase Dashboard → Authentication → Users → Send confirmation email

### "Network Error"
- Check if Supabase project is paused (auto-pauses after 1 week inactivity on free tier)
- Go to Supabase dashboard → Click "Resume project"

### Tasks Not Saving
- Check browser console for errors
- Verify RLS policies are active in Supabase
- Test query in Supabase SQL Editor

### More Issues?
See **[Troubleshooting Guide](docs/DEPLOYMENT.md#troubleshooting)** in deployment docs.

## 📈 Monitoring

### Free Tier Limits

**Supabase:**
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 2 GB/month
- API requests: 50,000/month
- Active users: 50,000 MAU

**Vercel:**
- Bandwidth: 100 GB/month
- Deployments: Unlimited
- Projects: Unlimited

**Result:** Can support ~1000 active users completely free! 🎉

### Check Usage

- **Supabase**: Dashboard → Settings → Usage
- **Vercel**: Dashboard → Analytics → Usage

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

See **[Deployment Guide](docs/DEPLOYMENT.md)** for detailed instructions.

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import your Git repository
3. Add environment variables
4. Deploy!

See **[Deployment Guide](docs/DEPLOYMENT.md)** for detailed instructions.

## 📝 Roadmap & Future Enhancements

- [ ] Email reminders for daily tasks
- [ ] Social features (share progress with friends)
- [ ] Export/Import progress
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Spaced repetition for review
- [ ] Custom roadmaps
- [ ] Leaderboards
- [ ] AI-powered recommendations

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation if needed

## 📄 License

MIT License - feel free to use for personal or commercial projects.

See [LICENSE](LICENSE) file for details.

## 💡 Tips for Success

- **Consistency > Intensity** - Daily practice beats weekend cramming
- **Understand Patterns** - Don't just memorize solutions
- **Maintain Your Streak** - Use the tracker daily for motivation
- **Take Notes** - Document your learnings and "aha!" moments
- **Review Regularly** - Revisit challenging problems weekly
- **Join Communities** - Share your progress on Twitter/LinkedIn
- **Ask Questions** - Use the notes section to track doubts
- **Celebrate Wins** - Acknowledge every milestone!

## 📚 Resources

### Learning Resources
- [NeetCode](https://neetcode.io/) - DSA roadmap and solutions
- [LeetCode](https://leetcode.com/) - Practice problems
- [GeeksforGeeks](https://www.geeksforgeeks.org/) - Tutorials and explanations

### Documentation
- [React Docs](https://react.dev/) - React documentation
- [Supabase Docs](https://supabase.com/docs) - Supabase documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Tailwind documentation
- [Vite](https://vitejs.dev/) - Vite documentation

### Community
- [Supabase Discord](https://discord.supabase.com/) - Get help with Supabase
- [Stack Overflow](https://stackoverflow.com/) - Ask technical questions

## 🙏 Acknowledgments

- Roadmap inspired by various DSA learning resources
- Built with modern web technologies
- Hosted on free-tier cloud services
- Community feedback and contributions

## 📧 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/dsa-roadmap-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/dsa-roadmap-tracker/discussions)
- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

## 🌟 Show Your Support

If this project helped you, please:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Contribute code
- 📢 Share with friends

---

**Built with ❤️ for DSA learners worldwide**

**Happy Learning! 🚀 Good luck with your DSA journey!**

---

### Quick Links
- [10-Minute Setup](docs/QUICK_START.md)
- [Full Deployment Guide](docs/DEPLOYMENT.md)
- [Database Setup](database/README.md)
- [Live Demo](#) (Add your deployed URL)