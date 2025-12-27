# GearGuard Frontend

A modern, premium SaaS dashboard for equipment maintenance tracking built with React, Tailwind CSS, and Framer Motion.

## Features

- **Kanban Board**: Visual task management with drag-ready layout
- **Calendar View**: Preventive maintenance scheduling
- **Equipment Management**: Comprehensive equipment tracking and filtering
- **Request Management**: Maintenance request tracking with status and priority
- **Modern UI/UX**: Clean, spacious design with smooth animations

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **Spline** (optional) - 3D elements

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   └── SplineWrapper.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── CalendarView.jsx
│   │   ├── EquipmentList.jsx
│   │   └── RequestList.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Backend Integration

Currently, the app uses mock data from `src/data/mockData.js`. To connect to the backend:

1. Update API endpoints in components/pages
2. Replace mock data imports with API calls
3. Add authentication/authorization context
4. Handle loading and error states

### API Endpoints (Expected)

- `GET /api/equipment` - List equipment
- `GET /api/requests` - List requests
- `POST /api/requests` - Create request
- `PUT /api/requests/:id` - Update request status
- `GET /api/teams` - List teams
- `GET /api/users` - List users

## Design System

### Colors

- **Primary**: Blue (`primary-500` to `primary-900`)
- **Gray Scale**: Neutral grays for backgrounds and text
- **Status Colors**:
  - New: Blue
  - In Progress: Yellow
  - Repaired: Green
  - Scrap: Gray
  - High Priority: Red
  - Medium Priority: Yellow
  - Low Priority: Blue

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

### Spacing

- Generous padding and margins
- Consistent gap spacing (4px base unit)

## Notes

- The Kanban board is drag-ready but requires a drag-and-drop library (e.g., `react-beautiful-dnd` or `@dnd-kit/core`) for full functionality
- Spline 3D elements are optional and should be used sparingly for performance
- All components are responsive and mobile-friendly
- Empty states include placeholders for Spline integration

## License

ISC

