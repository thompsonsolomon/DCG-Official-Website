# Disciples Church of God for All Nations - Website

A modern, responsive church website built with React + Vite, featuring public pages for visitors and a comprehensive admin dashboard for content management.

## Features

### Public Pages
- **Home**: Landing page with upcoming events and recent sermons
- **Events**: Browse and filter church events by category
- **Sermons**: Watch and search sermon library
- **Gallery**: View photos from church activities and events
- **Blog**: Read articles and spiritual insights
- **Testimonies**: Share and view member testimonies
- **Contact**: Send messages to the church
- **New Here**: Welcome guide for first-time visitors
- **Plan Visit**: Schedule your first visit
- **Live**: Watch live service streams

### Admin Panel
- **Dashboard**: Overview of all content with statistics
- **Events Management**: Create, edit, delete events
- **Sermons Management**: Manage sermon library
- **Blog Management**: Create and publish articles
- **Gallery Management**: Upload and organize photos
- **Testimonies Management**: Moderate and manage testimonies
- **Messages Management**: View and manage contact form submissions

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Image Hosting**: Cloudinary
- **Notifications**: React Hot Toast
- **Routing**: React Router v6

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in your project settings (Vars section):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Create a Firestore database with the following collections:
   - `events` - Church events
   - `sermons` - Sermon library
   - `blogs` - Blog articles
   - `gallery` - Gallery images
   - `testimonies` - Member testimonies
   - `messages` - Contact form messages

3. Enable Firestore read/write rules for public access (configure RLS as needed)

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Generate an unsigned upload preset for image uploads
3. Add your cloud name and upload preset to environment variables

## Running the Project

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Admin Access

Access the admin panel at `/admin` to manage all content. The admin pages automatically sync with Firebase in real-time.

## Project Structure

```
src/
├── pages/           # Public page components
├── admin/           # Admin panel components
├── components/      # Shared components (Navigation, Footer)
├── hooks/          # Custom React hooks for Firebase operations
├── config/         # Firebase configuration
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── App.tsx         # Main router configuration
```

## Customization

### Colors & Branding
Edit the color scheme in `globals.css` and update component colors throughout the project.

### Contact Information
Update contact details in:
- `src/pages/Contact.tsx`
- `src/pages/PlanVisit.tsx`
- `src/components/Footer.tsx`

### Service Times
Update church service times in:
- `src/pages/NewHere.tsx`
- `src/pages/PlanVisit.tsx`
- `src/components/Navigation.tsx`

## Deployment

### Deploy to Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

### Deploy to Other Platforms
The Vite build output can be deployed to any static hosting service (Netlify, GitHub Pages, AWS S3, etc.).

## Support

For issues or questions, please create an issue in the project repository.

## License

This project is proprietary and intended for use by Disciples Church of God for All Nations.
