# 📅 Wall Calendar

A high-fidelity, interactive wall calendar experience designed with a focus on premium aesthetics, cinematic animations, and physically-accurate page physics.

##  Core Design Philosophy

The objective was to move beyond a standard digital grid and create something that felt grounded in the physical world.

*   **Cinematic Page Transitions**: Implemented a dual-render engine that treats the calendar like a physical stack of paper. Navigating forwards "reveals" the next month sitting still underneath, while navigating backwards "peels" the current page up to show the previous month.
*   **Responsive Spiral Binding**: Instead of a static image that stretches, the spiral uses a CSS-repeat pattern that maintains perfect aspect ratio and texture resolution across all screen sizes (Mobile, Tablet, Desktop).
*   **Monthly Editorial Curation**: Each month features a custom seasonal hero image, a color palette (accent, background, and ranges), and an inspiring quote, creating an evolving visual experience as you navigate the year.


##  Technical Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Typography**: Clash Display (Headings) & Inter (Body)
*   **State Management**: React Hooks with custom synchronization for 3D CSS animations.
*   **Weather Integration**: Real-time forecast data integrated directly into the date cells.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm start
```

## 🏗️ Project Structure

- `/src/components`: UI components (HeroPanel, DateGrid, NotesPanel, etc.)
- `/src/lib`: Core logic for calendar math, holidays, themes, and weather API.
- `/src/app`: Next.js App Router setup and global styles.
- `/public`: High-resolution seasonal assets and fonts.


