# AR Curtains & Blinds Dashboard

A professional AR-powered window treatment configurator with a Canva-inspired UI.

## Features

- 🪟 **Product Selection** - Choose between curtains and blinds
- 🎨 **Style Customization** - 4 curtain styles, 4 blind styles
- 📏 **Dimension Control** - Precise sizing with real-time preview
- 🎨 **Color Picker** - Custom colors + 8 presets
- ⚙️ **Settings** - Display options and export tools
- 📱 **AR Ready** - View in augmented reality
- 💰 **Price Calculator** - Real-time pricing based on dimensions

## Project Structure

```
src/
├── components/          # 3D Models
│   ├── ARDashboard.tsx  # Main container
│   ├── CurtainModel.tsx # Curtain 3D model
│   └── BlindModel.tsx   # Blind 3D model
├── features/            # Feature modules
│   ├── sidebar/         # Icon navigation
│   ├── panel/           # Content panel
│   ├── tabs/            # Tab components
│   └── viewer/          # 3D viewer
├── hooks/               # Custom hooks
│   └── useProductConfig.ts
├── utils/               # Utilities
│   └── priceCalculator.ts
├── constants/           # Constants
│   ├── tabs.ts
│   └── colors.ts
└── types/               # TypeScript types
    └── index.ts
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers
- **Vite** - Build tool

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Architecture

### Feature-Based Structure

Each feature is self-contained with its own:
- Components
- Styles
- Logic

### Custom Hooks

- `useProductConfig` - Manages all product configuration state

### Type Safety

Full TypeScript coverage with:
- Strict type checking
- Proper interfaces
- Type exports

### Separation of Concerns

- **Components** - UI rendering
- **Hooks** - State management
- **Utils** - Business logic
- **Constants** - Configuration
- **Types** - Type definitions

## UI Design

Inspired by Canva's interface:
- Icon-based sidebar (64px)
- Expandable content panel (350px)
- Clean, modern aesthetics
- Smooth animations
- Professional color scheme

## 3D Models

Procedurally generated with:
- Realistic materials
- Dynamic scaling
- Fabric simulations
- Proper lighting
- Shadow casting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Contributing

Contributions welcome! Please follow the existing code structure and conventions.
