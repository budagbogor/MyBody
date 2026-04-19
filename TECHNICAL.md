# CircaLife - Technical Documentation

## Architecture Overview

### Tech Stack
- **Framework**: React Native with Expo SDK 50
- **State Management**: React Hooks (useState, useEffect)
- **Navigation**: Tab-based navigation (custom implementation)
- **Styling**: StyleSheet API (platform-agnostic)
- **Future Backend**: Supabase (planned)

## Project Structure

```
CircaLife/
├── App.js                 # Main application entry
├── package.json          # Dependencies
├── app.json              # Expo configuration
├── README.md             # User documentation
├── TECHNICAL.md          # This file
└── assets/               # Images, icons (to be added)
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

## Core Components

### 1. Main App Component
```javascript
export default function App()
```
- Manages global state (activeTab, userName)
- Handles fade-in animation on mount
- Renders appropriate screen based on activeTab
- Includes BottomNavigation component

### 2. Screen Components

#### HomeScreen
- Displays current time & circadian phase
- 4 metric cards (Sleep, HRV, Autophagy, Light)
- Quick action buttons
- Hidden knowledge section

**Key Features**:
- Real-time clock with `useEffect` timer
- Dynamic phase calculation based on hour
- Color-coded phases (5 distinct phases)

#### CircadianScreen
- 24-hour clock visualization
- Circular layout using trigonometry
- Time-based recommendations (3 sections)
- Nobel Prize science explanation

**Algorithm**:
```javascript
const angle = (hour / 24) * 360 - 90;
const x = Math.cos((angle * Math.PI) / 180) * radius;
const y = Math.sin((angle * Math.PI) / 180) * radius;
```

#### AutophagyScreen
- Fasting window tracker (mock data: 8h)
- 4 autophagy phases with activation status
- Longevity tips & mitochondria metrics
- Progress visualization

**Phases**:
1. 8-12h: Glycogen Depletion
2. 12-16h: Autophagy Activation
3. 16-24h: Mitophagy Peak
4. 24h+: Deep Cellular Renewal

#### VagusScreen
- HRV score display (mock: 62ms)
- Breathing exercise (4-4-8 pattern)
- Vagus stimulation methods (4 cards)
- Research insights

**Breathing Pattern**:
- Inhale: 4 seconds
- Hold: 4 seconds
- Exhale: 8 seconds (vagus activation)

#### InsightsScreen
- 6 insight cards (different categories)
- Advanced protocol (6 steps)
- Scientific references

**Categories**:
1. Circadian Biology
2. Mitochondria
3. Neuroplasticity
4. Longevity
5. Chronotherapy
6. Exercise Biology

### 3. Helper Components

All helper components are pure presentational:

```javascript
MetricCard({ icon, label, value, color, trend })
ActionButton({ title, icon, color })
RecommendationItem({ text })
AutophagyPhase({ hours, title, icon, color, description, active })
LongevityTip({ icon, text })
MitoMetric({ label, value, color })
VagusMethod({ icon, title, description, benefit })
InsightCard({ category, title, icon, color, content, source })
ProtocolStep({ number, text })
Reference({ text })
```

### 4. BottomNavigation
- 5 tabs: Home, Circadian, Autophagy, Vagus, Insights
- Active state styling
- Icon + Label layout

## Styling System

### Color Variables (Hardcoded)
```javascript
Background: #0A0E27
Cards: #151B38, #1A1F3A
Text: #FFFFFF, #C5CAD9, #8E94A8
Accents: #FFB84D, #4DDBFF, #A3D977, #FF8C69, #9B59B6
Special: #FFD700 (Gold for hidden knowledge)
Health: #27AE60 (Green), #E74C3C (Red), #F39C12 (Orange)
```

### Typography Scale
```javascript
32px - Main titles (userName)
28px - Screen titles
20px - Section titles
18px - Card titles
16px - Subheadings
14px - Body text
13px - Small body
12px - Captions
11px - Tiny text
10px - Labels
```

### Spacing System
```javascript
Padding: 16px, 20px (cards)
Margins: 8px, 12px, 16px, 24px
Border Radius: 12px (cards), 16px (large cards)
```

## Data Flow

### Current Implementation (Mock Data)
```javascript
// Static data in component state
const [userName, setUserName] = useState('Hendra');
const [fastingHours, setFastingHours] = useState(8);
const [hrvScore, setHrvScore] = useState(62);
const [breathCount, setBreathCount] = useState(0);
```

### Future Implementation (Supabase)
```javascript
// User profile
users {
  id: uuid
  name: text
  created_at: timestamp
}

// Daily metrics
daily_metrics {
  id: uuid
  user_id: uuid (FK)
  date: date
  sleep_quality: int
  hrv_score: int
  autophagy_hours: int
  light_exposure_minutes: int
  created_at: timestamp
}

// Fasting logs
fasting_logs {
  id: uuid
  user_id: uuid (FK)
  start_time: timestamp
  end_time: timestamp
  duration_hours: float
}

// HRV readings
hrv_readings {
  id: uuid
  user_id: uuid (FK)
  timestamp: timestamp
  hrv_ms: int
  heart_rate: int
}
```

## Algorithms & Calculations

### 1. Circadian Phase Detection
```javascript
const getTimePhase = () => {
  const hour = currentTime.getHours();
  if (hour >= 5 && hour < 10) return 'Morning Rise';
  if (hour >= 10 && hour < 14) return 'Peak Performance';
  if (hour >= 14 && hour < 18) return 'Sustained Energy';
  if (hour >= 18 && hour < 22) return 'Wind Down';
  return 'Deep Recovery';
};
```

### 2. Autophagy Phase Activation
```javascript
const isPhaseActive = (fastingHours, requiredHours) => {
  return fastingHours >= requiredHours;
};

// Usage
<AutophagyPhase active={fastingHours >= 12} />
```

### 3. Progress Calculation
```javascript
// Fasting progress (0-100%)
const progress = (fastingHours / 16) * 100;

// HRV bar width
const hrvWidth = (hrvScore / 100) * 100;
```

## Performance Considerations

### Current Optimizations
1. **Component Memoization**: Not yet implemented (opportunity)
2. **FlatList**: Not needed (static lists)
3. **Image Optimization**: Icons are emoji (no images)
4. **Animation**: Single fade-in on mount (Animated API)

### Future Optimizations
1. Use `React.memo()` for helper components
2. Implement `useMemo()` for expensive calculations
3. Use `useCallback()` for event handlers
4. Add loading states for async data
5. Implement pagination for insights/references

## API Integration Points (Future)

### 1. Wearable Integration
```javascript
// Apple Health / Google Fit
- HRV data (real-time)
- Sleep tracking
- Heart rate
- Activity data
```

### 2. Location Services
```javascript
// expo-location
- Get sunrise/sunset times
- Local timezone
- Adjust circadian recommendations
```

### 3. Notifications
```javascript
// expo-notifications
- Morning light reminder (sunrise)
- Fasting window notifications
- Evening wind-down alert
- Breathing exercise prompts
```

### 4. Sensors
```javascript
// expo-sensors
- Accelerometer (sleep tracking)
- Barometer (altitude/pressure)
- Gyroscope (activity detection)
```

## Testing Strategy

### Unit Tests (To Implement)
```javascript
// Test phase calculation
describe('getTimePhase', () => {
  it('returns Morning Rise for 7am', () => {
    expect(getTimePhase(7)).toBe('Morning Rise');
  });
});

// Test autophagy activation
describe('AutophagyPhase', () => {
  it('activates at 12h', () => {
    expect(isActive(12, 12)).toBe(true);
  });
});
```

### Integration Tests
- Navigation flow
- Data persistence (AsyncStorage)
- API calls (when implemented)

### E2E Tests
- User onboarding flow
- Complete day tracking
- Metric logging

## Deployment

### Android (APK)
```bash
expo build:android
# Or with EAS
eas build --platform android
```

### iOS (IPA)
```bash
expo build:ios
# Or with EAS
eas build --platform ios
```

### Web (PWA)
```bash
expo build:web
# Deploy to Vercel/Netlify
```

## Environment Variables (Future)

```env
# .env.local
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
GOOGLE_PLACES_API_KEY=xxx
OPENAI_API_KEY=xxx (for AI insights)
```

## Known Issues & Limitations

### Current
1. Mock data only (no real backend)
2. No data persistence (state resets on reload)
3. No authentication
4. No real HRV monitoring
5. Static circadian clock (no GPS/location)

### Planned Fixes
1. Supabase integration
2. AsyncStorage for local persistence
3. Supabase Auth (email/OAuth)
4. Wearable device integration
5. expo-location for sunrise/sunset

## Contributing Guidelines

### Code Style
- Use functional components (no classes)
- Prefer hooks over HOCs
- Keep components under 300 lines
- Extract helpers to separate functions
- Comment complex algorithms

### Git Workflow
```bash
main (production)
  ├── develop (integration)
  │   ├── feature/circadian-gps
  │   ├── feature/supabase-auth
  │   └── feature/hrv-integration
```

### Commit Messages
```
feat: Add GPS-based sunrise calculation
fix: Correct autophagy phase thresholds
docs: Update README with new features
refactor: Extract time calculations to utils
test: Add unit tests for phase detection
```

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo SDK Reference](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)

### Scientific Papers
- Nobel Prize 2017: Circadian Rhythm
- Cell Death Discovery 2025: Mitochondrial Autophagy
- Nature Aging 2021: Autophagy & Longevity
- PMC: Vagus Nerve Stimulation

### Design Tools
- Figma (for UI mockups)
- Excalidraw (for architecture diagrams)

## FAQ

**Q: Why React Native + Expo?**
A: Cross-platform (iOS + Android + Web), fast development, excellent ecosystem.

**Q: Why not use a UI library like NativeBase?**
A: Full control over design, smaller bundle size, better performance.

**Q: How accurate is the HRV data?**
A: Currently mock. Real implementation requires wearable integration.

**Q: Can I use this offline?**
A: Yes (basic features). Backend integration will enable cloud sync.

**Q: What about privacy?**
A: All health data will be encrypted. User owns their data (Supabase RLS).

---

**Last Updated**: 2026-04-19
**Version**: 1.0.0
**Maintainer**: Hendra @ PSD Division
