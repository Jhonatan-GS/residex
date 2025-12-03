# Residex: Incident Management Workshop

> **Vibe Coding: Mission Critical Edition**

Welcome to the workshop! You are the **Lead Engineer** for **Residex**, the incident management system used by luxury high-rise residential towers.

---

## The Scenario

**Your Users:**
- **Tenants** use the mobile app (phone mockup on the right) to report urgent issues like leaks, fires, and security concerns
- **Building Managers** use the dashboard to monitor incidents and dispatch help in real-time

**The Crisis:**
Building managers are reporting **"Ghost Incidents"** - they receive angry calls from tenants about emergencies, but the dashboard shows nothing until they refresh the page multiple times. In a real emergency, this delay could be catastrophic.

**Your Mission:**
1. Fix the critical sync bug
2. Secure the application architecture
3. Implement emergency response features
4. Add intelligent dispatching

---

## Getting Started

### 1. Clone & Install
```bash
git clone <YOUR_REPO_URL>
cd residex
npm install
```

### 2. Run the App
```bash
npm run dev
```

### 3. Open the Dashboard
Visit [http://localhost:3000](http://localhost:3000)

**What You'll See:**
- **Left Side**: Manager Dashboard with incident feed and stats
- **Right Side**: Collapsible phone mockup (click the "Tenant App" tab to show/hide)

---

## Exercise 1: The Ghost Incident

**Difficulty:** Easy | **Time:** 5-10 minutes | **Skill:** Debugging Server Actions

### The Problem

1. Open the phone mockup (Tenant App) on the right side
2. Fill out the form and submit a new incident (e.g., "Water leak in Apt 404")
3. Look at the Manager Dashboard on the left

**What happens?** Nothing. The incident doesn't appear.

You have to manually refresh the entire page to see the new incident. In an emergency where seconds matter, this is unacceptable.

### The Root Cause

Next.js Server Actions modify data on the server, but the client doesn't know the data changed. The UI is "stale" - it shows old data until you force a refresh.

### Your Task

1. Open `app/actions.ts`
2. Find the `submitIncident` function
3. Notice the comment: `// BUG: Missing revalidatePath('/')`

**Prompt to Claude:**
> "The submitIncident function doesn't update the UI after adding a new incident. Add revalidatePath to refresh the page data after submission. Also fix the same issue in resolveIncident."

### Success Criteria

- [ ] Submit an incident from the phone mockup
- [ ] It appears instantly on the dashboard (no refresh needed)
- [ ] Resolving an incident also updates instantly

### What You Learned

- `revalidatePath()` tells Next.js to re-fetch data for a specific route
- Server Actions need explicit cache invalidation
- This is a common "gotcha" in Next.js App Router

---

## Exercise 2: Security Architecture

**Difficulty:** Medium | **Time:** 10-15 minutes | **Skill:** Code Organization & Security

### The Problem

Open `app/actions.ts` and look at the code structure:

```typescript
// Public action - any tenant can call this
export async function submitIncident(formData: FormData) { ... }

// Admin action - only managers should call this
export async function resolveIncident(id: number) { ... }
```

**The Risk:** Both functions live in the same file with no access control. A malicious tenant could potentially call `resolveIncident` directly and close other people's incidents.

### Your Task

Separate the code by privilege level:

1. Create `lib/services/tenant.ts` - Public functions (incident submission)
2. Create `lib/services/admin.ts` - Protected functions (resolve, delete, assign)
3. Keep `app/actions.ts` as thin wrappers that call these services

**Prompt to Claude:**
> "Refactor app/actions.ts for better security. Create lib/services/tenant.ts for public incident submission logic. Create lib/services/admin.ts for admin-only operations like resolving incidents. The actions.ts file should be simple wrappers that call these services."

### Bonus Challenge

Add a mock authentication check:

> "Add a check to admin.ts that verifies the user is an admin before allowing incident resolution. For now, use a mock isAdmin() function that returns true."

### Success Criteria

- [ ] `lib/services/tenant.ts` contains incident creation logic
- [ ] `lib/services/admin.ts` contains resolve/admin logic
- [ ] `app/actions.ts` is now a thin wrapper
- [ ] (Bonus) Admin functions check for authorization

### What You Learned

- Separation of concerns improves security
- Server-side code organization matters
- Defense in depth: multiple layers of protection

---

## Exercise 3: The Panic Button

**Difficulty:** Medium | **Time:** 15-20 minutes | **Skill:** Interactive UI Components

### The Problem

In a fire or active security threat, filling out a form is too slow. Tenants need a **one-tap emergency solution**.

Look at the phone mockup - there's already an SOS button at the bottom, but it's just a visual placeholder. **It doesn't actually do anything.**

### Your Task

Make the SOS button functional with these requirements:

1. **Hold-to-Activate**: User must hold the button for 3 seconds (prevents accidental triggers)
2. **Visual Feedback**: Show a progress ring or animation while holding
3. **Auto-Submit**: After 3 seconds, automatically submit a critical incident with:
   - Type: "Fire" (or allow selection)
   - Description: "EMERGENCY SOS ACTIVATED"
   - Location: "Unknown - GPS Pending"
   - Priority: "Critical"

**Prompt to Claude:**
> "The SOS button in PhoneMockup.tsx is just a visual placeholder. Make it functional: when the user holds it for 3 seconds, it should submit an emergency incident automatically. Add a circular progress animation that fills up while holding. If they release early, cancel the action."

### Bonus Challenge

> "Add haptic feedback simulation - make the button pulse or vibrate visually when the emergency is triggered."

### Success Criteria

- [ ] Holding the SOS button shows a progress animation
- [ ] Releasing early cancels the action
- [ ] After 3 seconds, an emergency incident appears on the dashboard
- [ ] The incident has "Critical" priority

### What You Learned

- Press-and-hold interactions for safety-critical actions
- CSS animations for user feedback
- Connecting UI components to server actions

---

## Exercise 4: AI Dispatcher

**Difficulty:** Hard | **Time:** 20-30 minutes | **Skill:** AI Integration & Business Logic

### The Problem

Managers are overwhelmed. They see incidents like:
- "Smoke in the hallway"
- "Suspicious person in parking garage"
- "Water dripping from ceiling"

For each one, they manually have to:
1. Read the description
2. Determine priority
3. Assign to the right team (Fire Dept, Security, Plumber)

This takes precious time in emergencies.

### Your Task

Create an intelligent auto-dispatch system:

1. Create a function that analyzes incident descriptions
2. Automatically set priority based on keywords
3. Auto-assign to the appropriate response team

**Keyword Logic:**
| Keywords | Priority | Assign To |
|----------|----------|-----------|
| fire, smoke, burning, flames | Critical | Fire Department |
| intruder, suspicious, threat, weapon | Critical | Security |
| leak, water, flooding, drip | High | Plumbing |
| broken, stuck, noise, malfunction | Medium | Maintenance |
| other | Low | General |

**Prompt to Claude:**
> "Create an autoDispatch function in lib/services/admin.ts. It should analyze the incident description and automatically set the priority and assignedTo fields based on keywords. Integrate this into the submitIncident flow so new incidents are auto-triaged."

### Bonus Challenge

> "Instead of keyword matching, use an actual AI API call (mock it for now) that returns a structured response with priority and assignment recommendations."

### Success Criteria

- [ ] Submit: "There's smoke coming from apartment 302"
  - Priority should be: Critical
  - Assigned to: Fire Department
- [ ] Submit: "Water is leaking from the ceiling"
  - Priority should be: High
  - Assigned to: Plumbing
- [ ] Submit: "Someone suspicious is in the lobby"
  - Priority should be: Critical
  - Assigned to: Security

### What You Learned

- AI-assisted decision making
- Keyword extraction and classification
- Reducing cognitive load on operators

---

## Wrap Up

Congratulations! You've built a **Mission Critical** system:

| Exercise | Skill | Impact |
|----------|-------|--------|
| Ghost Incident | Debugging | Fixed real-time sync |
| Security Architecture | Refactoring | Protected admin functions |
| Panic Button | UI/UX | Enabled one-tap emergencies |
| AI Dispatcher | AI Integration | Automated triage |

### Key Takeaways

1. **Server Actions need cache invalidation** - Always `revalidatePath()` after mutations
2. **Separate concerns by privilege level** - Public vs Admin code should be isolated
3. **Safety-critical UI needs confirmation** - Hold-to-activate prevents accidents
4. **AI can reduce cognitive load** - Auto-classification speeds up response times

---

## Bonus Challenges

If you finish early, try these:

### Real-Time Updates
> "Add WebSocket or Server-Sent Events so the dashboard updates automatically when new incidents come in, without polling."

### Incident History
> "Add a panel that shows resolved incidents with timestamps and who resolved them."

### Mobile Notifications
> "Add a mock push notification system that alerts managers when a Critical incident is submitted."

### Dark/Light Mode
> "The app already has a theme toggle. Add more theme options or customize the color palette."

---

**Happy Vibe Coding!**

*This is enterprise development - where code quality saves lives.*
