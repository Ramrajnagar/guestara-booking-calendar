# Engineering Notes - Guestara Assignment

## Open Scope Features

I implemented two high-impact features beyond the core requirements:

1.  **Dynamic Filtering (Room Type, Status, Source)**: 
    - **Why**: Real-world hotel managers need to see specific data segments (e.g., "How many Suites are booked this month?" or "Are we getting more bookings from Airbnb or Expedia?").
    - **Impact**: The heatmap updates in real-time based on filters, allowing for granular occupancy analysis.

2.  **Stats Dashboard**:
    - **Why**: Raw data is only useful if it's actionable. A summary of Revenue and Occupancy Rate gives the user an immediate pulse on business health.
    - **Impact**: Provides month-level and range-level insights (Revenue, Avg. Stay, Most Booked Room).

##  Engineering Decisions & Trade-offs

### 1. The "Checkout Day" Logic
The brief emphasizes that a guest occupying Feb 10-13 is only in the room for the nights of 10, 11, and 12. 
- **Implementation**: I used a strict `[checkIn, checkOut)` interval logic in `getBookingsForDate`. 
- **Trade-off**: While it's slightly more complex to calculate than simple overlapping, it ensures 100% accuracy for hotel occupancy reporting.

### 2. Native Drag Selection
Instead of reaching for a library like `react-dnd`, I implemented the selection logic using native `onMouseDown`, `onMouseEnter`, and `onMouseUp` events.
- **Why**: To keep the bundle size small and demonstrate a deep understanding of React state and DOM events.
- **Trade-off**: Handling "backward" selection (dragging from the future into the past) required normalizing the range in the state before rendering.

### 3. CSS-First Design
I avoided Tailwind or UI libraries in favor of Vanilla CSS.
- **Why**: To showcase my ability to build a custom, premium design system from scratch.
- **Benefit**: The "Glassmorphism" navbar and custom heatmap gradients feel unique and integrated, not generic.

##  Future Improvements (With More Time)

1.  **Persistence**: I would implement `localStorage` to remember the user's last-viewed month and active filters across page reloads.
2.  **Keyboard Navigation**: Implementing the "Arrow Key" navigation mentioned in the brief would significantly improve accessibility (A11y).
3.  **Unit Tests**: I would add Vitest suites for the `dateUtils.js` functions, specifically focusing on the edge cases of month boundaries and the inclusive/exclusive checkout rule.

## ❓ Justification: Calendar Sunday Start
I chose to start the calendar on **Sunday**. 
- **Reasoning**: This is the standard calendar format in North America and India (where Guestara operates). However, the grid is built dynamically, and shifting to a Monday-start would simply involve changing the `startOfWeek` configuration.
