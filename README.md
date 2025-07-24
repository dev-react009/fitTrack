# FitTrack

A Strava-inspired fitness tracking application built with Next.js, TypeScript, and Tailwind CSS.

![image](https://github.com/user-attachments/assets/6bfabd3e-538c-4de0-a063-eb36bb99744f)

## Overview

FitTrack is a modern web application that allows users to track their running and cycling activities. With a clean and intuitive interface inspired by Strava, users can record workouts, view their progress, and analyze their performance metrics.

## Features

- **Activity Tracking**: Record running and cycling activities with detailed metrics (distance, duration, calories, etc.)
- **Dashboard View**: Get a quick overview of your fitness journey with key statistics
- **Activity List**: View and manage all your recorded activities in one place
- **Progress Analysis**: Track your improvement over time with interactive charts and visualizations
- **Achievements**: Celebrate milestones and accomplishments in your fitness journey

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fittrack.git
   cd fittrack
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
fittrack/
├── app/               # Next.js app directory
│   ├── page.tsx       # Main page component
│   └── layout.tsx     # Root layout
├── components/        # React components
├── public/            # Static assets
├── styles/            # Global styles
├── tailwind.config.ts # Tailwind CSS configuration
└── package.json       # Project dependencies
```

## UI Design

The UI is inspired by modern design systems like Tailwindcss/Material Design with a focus on:

- Clean, modern aesthetics
- High readability and usability
- Intuitive navigation
- Responsive design for all device sizes
- Accessible color contrasts and interactions

## Future Enhancements

- User authentication and profiles
- Social features (friends, activity sharing)
- Route mapping and GPS integration
- Advanced analytics and goal setting
- Mobile app versions


## Acknowledgments

- Icons from [Lucide](https://lucide.dev/)
- Chart library [Recharts](https://recharts.org/)
