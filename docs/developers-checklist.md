<h1>Γ£à Coding Best Practices Checklist</h1>

<button id="copyBtn">Copy All Checklist</button>

<pre id="checklistText" style="display:none;">
≡ƒºá Core Principles
- One Centralized Reusable Logic: Write functions/utilities in a single place and reuse them throughout the app.
- Avoid Hardcoding ΓÇö Use Constants: Store values like URLs, strings, and keys in a constants file or .env file.

Γ£¿ Recommended Professional Practices
- Keep Code DRY (DonΓÇÖt Repeat Yourself): Avoid duplicating logic. Reuse functions, components, and constants.
- Use Meaningful Names: Use clear, descriptive names for variables, functions, and files.
- Write Small, Focused Functions: Each function should do one thing well.
- Consistent Code Formatting: Use a linter (e.g., ESLint) and formatter (e.g., Prettier).
- Handle Errors Gracefully: Use proper error handling (try-catch, fallback logic, user-friendly messages).
- Comment Why, Not What: Explain why something is done, not just what it does.
- Organize Files and Folders Clearly: Use a logical structure (/components, /utils, /services, /constants).
- Use Environment Variables: Store sensitive or environment-specific values in .env.
- Version Control with Git: Use clear commit messages and commit regularly.
- Write Tests (When Applicable): Add unit/integration tests to improve reliability and support refactoring.
- Keep It Simple (KISS Principle): Avoid unnecessary complexity. Solve the problem in the simplest way possible.
- Avoid Global Variables: Minimize use of global state to prevent conflicts and hard-to-find bugs.
- Code Reviews and Pair Programming: Collaborate with others, get feedback, and improve together.

ΓÜ¢∩╕Å React Performance Best Practices
- Avoid Anonymous Functions in JSX.
- Use memo and useCallback hooks to optimize renders.
- Lazy Load Components and implement Code Splitting.
- Optimize Re-renders by managing dependencies.
- Use React Profiler to identify bottlenecks.
- Use Debouncing and Throttling for expensive events.
- Optimize Images for performance and size.
- Use Virtualization (e.g., react-window) for large lists.
- Reduce Bundle Size with tree shaking and dynamic imports.
- Consider SSR for performance.
- Network Performance Optimization (e.g., caching, CDN).

≡ƒ¬¥ React Hooks Best Practices
- Keep React State Immutable.
- Don't use useState for everything; consider server state (React Query), URL state (useLocation), or localStorage.
- Compute derived values without extra state or effects.
- Use unique keys (e.g., crypto-random UUID).
- Never forget dependencies in useEffect; useEffect should be last in your hooks list.

≡ƒûÑ∩╕Å Responsive Design Best Practices
- Use flexible layouts (Flexbox/Grid).
- Use relative units (%, rem, em) instead of fixed px.
- Test on multiple devices and screen sizes (mobile, tablet, desktop).
- Use CSS media queries to adapt UI.
- Optimize touch targets for mobile.
- Use viewport meta tag properly.
- Optimize images for different screen densities.
- Avoid horizontal scrolling.
- Use mobile-first design approach.

≡ƒöº Backend (Node.js / Express) & RESTful API Best Practices
- Organize routes, controllers, services, models separately.
- Use environment variables for config and secrets.
- Modularize code with single responsibility functions.
- Centralized error handling middleware with proper HTTP status codes.
- Use async/await; avoid callback hell.
- Validate and sanitize input data (Joi, express-validator).
- Implement logging (Winston, Morgan).
- Follow RESTful endpoint conventions (GET, POST, PUT, DELETE).
- Implement pagination and filtering.
- Use rate limiting and throttling.
- Secure APIs with JWT/OAuth authentication and authorization.
- Use Helmet and CORS for security.
- API versioning for backward compatibility.
- Document APIs (OpenAPI/Swagger).
- Use Postman/Insomnia for manual API testing.
- Graceful error handling and logging.

≡ƒ¢í∩╕Å Backend Security
- Sanitize inputs to prevent injections.
- Hash passwords securely (bcrypt).
- Use HTTPS in production.
- Handle exceptions gracefully; do not leak sensitive info.
- Implement CSRF protection if applicable.
- Limit detailed error messages in production.

≡ƒùä∩╕Å Database (MongoDB Atlas) Best Practices
- Define schemas and validation with Mongoose.
- Index frequently queried fields.
- Use lean queries when methods are not needed.
- Project only needed fields to reduce data size.
- Monitor performance via Atlas dashboard.
- Use connection pooling and timeout settings.
- Handle DB errors and reconnect logic.
- Regular backups and disaster recovery plans.
- Use environment variables for credentials.
- Avoid embedding large arrays; prefer references.

≡ƒº╣ Avoiding Technical Debt
- Write clean, readable, well-documented code.
- Refactor regularly.
- Keep dependencies up to date.
- Automate testing and deployment.
- Avoid premature optimization.
- Review and update documentation.
- Use code linters and formatters.
- Regularly review and prune unused code.
</pre>

<section>
  <h2>≡ƒºá Core Principles</h2>
  <ul>
    <li>One Centralized Reusable Logic: Write functions/utilities in a single place and reuse them throughout the app.</li>
    <li>Avoid Hardcoding ΓÇö Use Constants: Store values like URLs, strings, and keys in a constants file or .env file.</li>
  </ul>
</section>

<section>
  <h2>Γ£¿ Recommended Professional Practices</h2>
  <ul>
    <li>Keep Code DRY (DonΓÇÖt Repeat Yourself): Avoid duplicating logic. Reuse functions, components, and constants.</li>
    <li>Use Meaningful Names: Use clear, descriptive names for variables, functions, and files.</li>
    <li>Write Small, Focused Functions: Each function should do one thing well.</li>
    <li>Consistent Code Formatting: Use a linter (e.g., ESLint) and formatter (e.g., Prettier).</li>
    <li>Use CSS Modules (e.g., ComponentName.module.css): Each component and page should have its own module.css file for scoped, maintainable styles where necessary.</li>
    <li>Handle Errors Gracefully: Use proper error handling (try-catch, fallback logic, user-friendly messages).</li>
    <li>Comment Why, Not What: Explain why something is done, not just what it does.</li>
    <li>Organize Files and Folders Clearly: Use a logical structure (/components, /utils, /services, /constants).</li>
    <li>Use Environment Variables: Store sensitive or environment-specific values in .env.</li>
    <li>Version Control with Git: Use clear commit messages and commit regularly.</li>
    <li>Write Tests (When Applicable): Add unit/integration tests to improve reliability and support refactoring.</li>
    <li>Keep It Simple (KISS Principle): Avoid unnecessary complexity. Solve the problem in the simplest way possible.</li>
    <li>Avoid Global Variables: Minimize use of global state to prevent conflicts and hard-to-find bugs.</li>
    <li>Code Reviews and Pair Programming: Collaborate with others, get feedback, and improve together.</li>
  </ul>
</section>

<section>
  <h2>ΓÜ¢∩╕Å React Performance Best Practices</h2>
  <ul>
    <li>Avoid Anonymous Functions in JSX.</li>
    <li>Use memo and useCallback hooks to optimize renders.</li>
    <li>Lazy Load Components and implement Code Splitting.</li>
    <li>Optimize Re-renders by managing dependencies.</li>
    <li>Use React Profiler to identify bottlenecks.</li>
    <li>Use Debouncing and Throttling for expensive events.</li>
    <li>Optimize Images for performance and size.</li>
    <li>Use Virtualization (e.g., react-window) for large lists.</li>
    <li>Reduce Bundle Size with tree shaking and dynamic imports.</li>
    <li>Consider SSR for performance.</li>
    <li>Network Performance Optimization (e.g., caching, CDN).</li>
  </ul>
</section>

<section>
  <h2>≡ƒ¬¥ React Hooks Best Practices</h2>
  <ul>
    <li>Keep React State Immutable.</li>
    <li>Don't use useState for everything; consider server state (React Query), URL state (useLocation), or localStorage.</li>
    <li>Compute derived values without extra state or effects.</li>
    <li>Use unique keys (e.g., crypto-random UUID).</li>
    <li>Never forget dependencies in useEffect; useEffect should be last in your hooks list.</li>
  </ul>
</section>

<section>
  <h2>≡ƒûÑ∩╕Å Responsive Design Best Practices</h2>
  <ul>
    <li>Use flexible layouts (Flexbox/Grid).</li>
    <li>Use relative units (%, rem, em) instead of fixed px.</li>
    <li>Test on multiple devices and screen sizes (mobile, tablet, desktop).</li>
    <li>Use CSS media queries to adapt UI.</li>
    <li>Optimize touch targets for mobile.</li>
    <li>Use viewport meta tag properly.</li>
    <li>Optimize images for different screen densities.</li>
    <li>Avoid horizontal scrolling.</li>
    <li>Use mobile-first design approach.</li>
  </ul>
</section>

<section>
  <h2>≡ƒöº Backend (Node.js / Express) & RESTful API Best Practices</h2>
  <ul>
    <li>Organize routes, controllers, services, models separately.</li>
    <li>Use environment variables for config and secrets.</li>
    <li>Modularize code with single responsibility functions.</li>
    <li>Centralized error handling middleware with proper HTTP status codes.</li>
    <li>Use async/await; avoid callback hell.</li>
    <li>Validate and sanitize input data (Joi, express-validator).</li>
    <li>Implement logging (Winston, Morgan).</li>
    <li>Follow RESTful endpoint conventions (GET, POST, PUT, DELETE).</li>
    <li>Implement pagination and filtering.</li>
    <li>Use rate limiting and throttling.</li>
    <li>Secure APIs with JWT/OAuth authentication and authorization.</li>
    <li>Use Helmet and CORS for security.</li>
    <li>API versioning for backward compatibility.</li>
    <li>Document APIs (OpenAPI/Swagger).</li>
    <li>Use Postman/Insomnia for manual API testing.</li>
    <li>Graceful error handling and logging.</li>
  </ul>
</section>

<section>
  <h2>≡ƒ¢í∩╕Å Backend Security</h2>
  <ul>
    <li>Sanitize inputs to prevent injections.</li>
    <li>Hash passwords securely (bcrypt).</li>
    <li>Use HTTPS in production.</li>
    <li>Handle exceptions gracefully; do not leak sensitive info.</li>
    <li>Implement CSRF protection if applicable.</li>
    <li>Limit detailed error messages in production.</li>
  </ul>
</section>

<section>
  <h2>≡ƒùä∩╕Å Database (MongoDB Atlas) Best Practices</h2>
  <ul>
    <li>Define schemas and validation with Mongoose.</li>
    <li>Index frequently queried fields.</li>
    <li>Use lean queries when methods are not needed.</li>
    <li>Project only needed fields to reduce data size.</li>
    <li>Monitor performance via Atlas dashboard.</li>
    <li>Use connection pooling and timeout settings.</li>
    <li>Handle DB errors and reconnect logic.</li>
    <li>Regular backups and disaster recovery plans.</li>
    <li>Use environment variables for credentials.</li>
    <li>Avoid embedding large arrays; prefer references.</li>
  </ul>
</section>

<section>
  <h2>≡ƒº╣ Avoiding Technical Debt</h2>
  <ul>
    <li>Write clean, readable, well-documented code.</li>
    <li>Refactor regularly.</li>
    <li>Keep dependencies up to date.</li>
    <li>Automate testing and deployment.</li>
    <li>Avoid premature optimization.</li>
    <li>Review and update documentation.</li>
    <li>Use code linters and formatters.</li>
    <li>Regularly review and prune unused code.</li>
  </ul>
</section>

</body>
</html>

HOW TO SPEED UP YOUR APPLICATION
below are 6 points to speed up your application

1. perform code optimization
2. image and media optimization
3. manage plugins and scripts
4. server and hosting upgrades
5. google pagespeed insight
6. using cloudflare

TEN SYSTEM DESIGN PRINCIPLES TO BUILD SCALABLE , MAINTANABLE , AND RELIABLE APPLICATIONS

1. computer architecture: RAM, CPU, CACHE etc
2. production app architecture: CI/CD, load balancers, logging and monitoring
3. design requirements: theorem CAP, throughput, latency, and service objectives , and service level agreement
4. networking: TCP, UDP, DNS, IP ADDRESS
5. application layer protocols: HTTP, websockets, webRTC, MQTT
6. API design
7. caching and CDN(content delivery network)
8. proxy servers: forward and reverse proxy servers
9. load balancers
10. databases: database design including sharding, replication, ACID properties, vertical and horizontal scaling.

Understand the Problem Or YouΓÇÖre Just Guessing in Code

The biggest mistake most devs make isnΓÇÖt syntax errors.
ItΓÇÖs trying to solve a problem they donΓÇÖt truly understand.

You open your code editor, confident youΓÇÖll fix it.
But hours later:

- Nothing works.
- EverythingΓÇÖs broken.
- And now youΓÇÖve made it worse.

Why? Because you skipped the most important step:
Understanding the problem.

1. DonΓÇÖt Assume

ItΓÇÖs easy to think you know whatΓÇÖs broken.
But tech problems often lie beneath the surface.

Before you write a single line of code, ask:

- WhatΓÇÖs the actual issue?
- Can I replicate the bug?
- Is it happening for all users or just a specific case?
- Is the problem in the logic, the data, or the environment?

Assumptions waste time.
Clarity saves it.

2. Ask ΓÇ£WhyΓÇ¥ Until It Hurts

A senior dev doesnΓÇÖt just see the symptom they ask why until they uncover the real cause and boom, now youΓÇÖre solving the root, not the leaves.

3. DonΓÇÖt Touch the Code (Yet)

ItΓÇÖs tempting to start fixing things immediately.
But that often leads to more chaos.

Instead, step back:

- Map the flow
- Check the inputs and outputs
- Log values
- Write down the expected vs actual behavior

Treat it like a detective case. DonΓÇÖt move until the pieces make sense.

4. Visualize It

Draw the flow on a whiteboard, in Notion, or even on paper.
When you see the flow, you spot the break.

Most complicated problems are just poorly visualized logic.

5. Think Like the User, Not Just the Coder

Sometimes the problem isnΓÇÖt technical.
ItΓÇÖs how the user expected something to work.

You might say, ΓÇ£The code is working.ΓÇ¥
But if the experience is broken, the problem is still real.

Understanding a problem includes understanding the people using your solution.

6. Communicate Before You Fix

If you're working in a team or for a client clarify the problem with them before solving it.

What you think is broken might not match what they actually want fixed.

Understanding includes listening.

My Advice:
In tech, the axe is your understanding.
Sharpen it.
Or youΓÇÖll be swinging blindly for hours.

Anyone can write code.
Only the best can solve the right problem.

Stateless vs Stateful: Why ItΓÇÖs More Than Just Keeping Data

If youΓÇÖve ever been confused about what it really means for a system, server, or API to be stateless or stateful, youΓÇÖre not alone.

These are foundational concepts in computing, networking, and system design but they're often misunderstood or oversimplified.

LetΓÇÖs clear the air.

ΓÜÖ∩╕Å What is State?

Before diving into the two, letΓÇÖs define state.
In tech, state refers to the memory of a system a snapshot of what's happening or has happened at a certain point in time.

This could include:

- A userΓÇÖs login session
- The contents of a shopping cart
- Where you left off in a video or form

If the system remembers this across interactions, it's dealing with state.

≡ƒöä So WhatΓÇÖs the Difference?

Γ£à Stateless: No memory between requests

Every interaction is independent. The server or component doesnΓÇÖt retain information from previous interactions.

Think of it like this:

You walk into a coffee shop, order a drink, and leave.
The next day, you come back the barista doesnΓÇÖt remember you. You must reintroduce yourself and re-order everything again from scratch.

In tech:

- Each HTTP request in a stateless API must contain all the information the server needs to fulfill it (e.g. tokens, credentials, parameters).
- Once a request is handled, the server doesnΓÇÖt keep any info about it.
- Examples: REST APIs, DNS, HTTP by default

Γ£à Stateful: Memory is maintained across interactions

The system remembers previous events, data, or contexts.

You walk into your favorite coffee shop. The barista greets you by name and says, ΓÇ£Your usual?ΓÇ¥
ThatΓÇÖs a stateful interaction the shop remembers you.

In tech:

- Sessions, user data, or progress is stored between interactions.
- The server, client, or app tracks your activity or context over time.
- Examples: Database connections, WebSockets, Sessions in web apps, Online games

≡ƒñ» Why the Confusion?

People often confuse the two because they see the effects of state, but not where itΓÇÖs being stored.

Here are some misconceptions:

≡ƒö╕ Stateless means no user experience.

Not true stateless systems can provide rich user experiences. But the client or another service must carry the burden of storing state (e.g., localStorage, tokens, or cache).

≡ƒö╕ All HTTP is stateless.

Technically, yes. HTTP is stateless.
But developers build stateful experiences on top of stateless protocols using cookies, sessions, or tokens to persist state on the client or server.

≡ƒö╕ Stateful is always better.

Not necessarily. Stateful systems are more complex to scale, manage, and recover. Stateless systems are simpler and more resilient to failure.

≡ƒôª Where This Shows Up in Real Life

≡ƒÆ╗ Web Development

- Stateless: REST APIs, CDN-delivered assets
- Stateful: Login sessions, shopping carts, user dashboards

≡ƒº¬ Testing & Debugging

- Stateless apps are easier to test because each interaction is isolated.
- Stateful apps require setting up a specific state before testing.

≡ƒò╕∩╕Å System Design

- Stateless systems scale better because any server can handle any request.
- Stateful systems may require sticky sessions (same server every time) or distributed session management (more complexity).

≡ƒÜÇ Developer Tip: Know Where the State Lives

Even stateless systems have state itΓÇÖs just not on the server.

The key is knowing where the state lives:

- In the client? (e.g., browser storage, JWTs)
- In a shared cache? (e.g., Redis)
- In the server? (session memory, DB)

Once you know where and how state is stored, you can:

- Debug better
- Design scalable systems
- Handle failovers and retries more gracefully

≡ƒºá In Summary

- Stateless: No memory of past interactions. Every request is standalone.
- Stateful: Memory is maintained between interactions. Context is preserved.
- ItΓÇÖs not about which is better itΓÇÖs about knowing when and where to use each.

≡ƒÆ¼ Final Thought

When designing systems, apps, or APIs, always ask:
ΓÇ£Should this interaction remember anything?ΓÇ¥

If yes be deliberate about how and where you manage state.
If no enjoy the simplicity and scalability of statelessness.

Your future self and your infrastructure will thank you

Coupling vs Cohesion: The Confusion That Hurts Code Quality

When developers talk about clean code or software design principles, two words often show up coupling and cohesion.

TheyΓÇÖre tossed around so frequently that many confuse them, misuse them, or think they mean the same thing.
But understanding the difference is key to writing code that is easy to scale, test, and maintain.

LetΓÇÖs break it down.

≡ƒº⌐ What is Cohesion?

Cohesion is about how focused and related the responsibilities within a single component, module, or class are.

Think of it as how well the parts of a unit belong together.

Imagine a restaurant kitchen:

- A highly cohesive kitchen has chefs, tools, and stations all focused on cooking.
- If that same kitchen also managed accounting, deliveries, and marketing it would be a low-cohesion mess.

In code:

- A high-cohesion module does one job and does it well.
- A low-cohesion module does too many unrelated things making it confusing and fragile.

Γ£à High Cohesion = Clean, focused code.
Γ¥î Low Cohesion = Bloated, unclear responsibility.

≡ƒöù What is Coupling?

Coupling is about how interdependent two modules or components are.

The more one module relies on another to function, the tighter the coupling.

Imagine two coworkers:

- If one canΓÇÖt work without the constant help of the other, they are tightly coupled.
- If they can each do their job independently but collaborate when needed, theyΓÇÖre loosely coupled.

In code:

- Tightly coupled code breaks if you change one part.
- Loosely coupled code can be modified independently and reused easily.

Γ£à Loose Coupling = Flexibility and maintainability
Γ¥î Tight Coupling = Fragility and ripple-effect bugs

≡ƒñ» Why the Confusion?

Developers often mix the two up because they both deal with how parts of a system relate. But they focus on different dimensions.

A common misunderstanding is thinking that improving one automatically improves the other. But you can have:

- High cohesion but tight coupling (each module does one job, but depends too heavily on others)
- Low cohesion and loose coupling (modules donΓÇÖt depend on each other, but each does too much)

The goal is to maximize cohesion and minimize coupling.

≡ƒºá In Summary

- Cohesion: How well the responsibilities within a module belong together.
- Coupling: How tightly one module depends on another.
- Aim for: High Cohesion + Low Coupling
- This makes your code modular, maintainable, testable, and scalable.

## ≡ƒöº Vite + React Developer Debug Checklist

This section helps track common issues and fixes related to Vite + React + TypeScript development, especially routing, hot reload, and deployment bugs.

---

### ≡ƒöü General Debug Actions

- [ ] Restart Vite dev server (`Ctrl + C`, then `npm run dev`)
- [ ] Do a hard reload in the browser (`Ctrl + Shift + R`)
- [ ] Clear browser cache if UI behaves unexpectedly
- [ ] Delete `.vite/` cache folder (optional):
  ```bash
  rm -rf node_modules/.vite
  ```
- [ ] Delete `node_modules` and `package-lock.json` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

### ≡ƒöÇ React Router Debug Tips

- [ ] Use `<BrowserRouter>` in main App:
  ```tsx
  import { BrowserRouter } from 'react-router-dom';
  <BrowserRouter> ... </BrowserRouter>
  ```
- [ ] Ensure routes match lowercase paths exactly (e.g. `/about` not `/About`)
- [ ] Ensure components are imported with correct casing:
  ```tsx
  import About from './pages/About'; // matches file name exactly
  ```
- [ ] Always include a fallback route:
  ```tsx
  <Route path="*" element={<NotFound />} />
  ```

---

### ≡ƒº▒ Catch-All (404) Page Component

Create `NotFound.tsx`:

```tsx
const NotFound = () => <h1>404 - Page Not Found</h1>;
export default NotFound;
```

Add this to your router setup:

```tsx
<Route path="*" element={<NotFound />} />
```

---

### ΓÜÖ∩╕Å Disable HMR if Needed

To test if Vite HMR is causing issues, disable it temporarily in `vite.config.ts`:

```ts
export default defineConfig({
  server: {
    hmr: false
  }
});
```

---

### ≡ƒîÉ Deployment Fallback Setup

#### For Netlify

Create `public/_redirects` with this content:

```
/*    /index.html   200
```

This ensures all unknown paths are routed through `index.html`.

#### For Vercel

Add `vercel.json` to root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### ≡ƒº⌐ Notes from Real Debug Scenario

Issue:
> Clicking on "About" in the nav bar returned a 404: *"Page not found ΓÇô broken link."*

Surprising Fix:
> Increasing the font size of a title elsewhere in the app unexpectedly fixed the issue.

Likely Cause:
> Vite's HMR (Hot Module Replacement) was stuck in a stale state. Updating another file triggered a rebuild that refreshed routing correctly.

Lesson:
> Use GitHub Issues to log even weird or unpredictable bugs ΓÇö they can help explain future mysteries.

---

### Γ£à Final Thoughts

If something feels weird:
- Restart Vite.
- Refresh the browser.
- Check routes and casing.
- Log what happened.
- DonΓÇÖt panic ΓÇö dev tools aren't always perfect.

middleware uses checklist
- request validation
- authentication
- authorization
- logging
- error handling
- cross origin resource sharing
- body parsing

## ≡ƒÜÇ How to Speed Up My Code & Avoid Slowness

This checklist helps ensure your code runs efficiently and doesn't slow down your web app unnecessarily.

---

### ≡ƒºá General Best Practices

- [ ] Avoid unnecessary re-renders in React (use `React.memo`, `useMemo`, `useCallback`)
- [ ] Minimize deeply nested loops or large `map()` calls ΓÇö consider refactoring
- [ ] Debounce or throttle expensive event handlers (e.g. `onScroll`, `onInput`)
- [ ] Limit the number of `setState()` calls inside a render cycle
- [ ] Use lazy loading for components or images (`React.lazy`, `import()`)

---

### ΓÜí Frontend Performance Tips (React + Vite)

- [ ] Split large components into smaller, focused ones
- [ ] Use **code splitting** to avoid loading everything at once:
  ```tsx
  const LazyAbout = React.lazy(() => import('./About'));
  ```
- [ ] Only load third-party libraries when needed (avoid bundling huge unused code)
- [ ] Avoid using large images ΓÇö compress or use `.webp` format

---

### ≡ƒº¬ DevTools and Monitoring

- [ ] Use React DevTools to inspect rendering behavior
- [ ] Use Chrome DevTools ΓåÆ Performance tab to analyze slowness
- [ ] Check bundle size with:
  ```bash
  npm run build && npx vite build --analyze
  ```

---

### ≡ƒùé∩╕Å Data & State Management

- [ ] DonΓÇÖt overuse global state (use local state where possible)
- [ ] Use pagination or infinite scroll for large datasets
- [ ] Memoize filtered or sorted data using `useMemo`

---

### ≡ƒ¢á∩╕Å Build Optimization (Vite)

- [ ] Use production build for performance testing:
  ```bash
  npm run build
  npm run preview
  ```
- [ ] Minify output with terser or esbuild (default with Vite)
- [ ] Enable tree-shaking and remove dead code
- [ ] Use dynamic imports for infrequently visited routes or heavy libraries

---

### ≡ƒº╣ Cleanup & Housekeeping

- [ ] Remove unused code, variables, and imports
- [ ] Keep dependencies up to date and avoid unnecessary packages
- [ ] Profile your app regularly as you build

---

### Γ£à Final Advice

> Always test real performance in a production build ΓÇö the dev environment is not always accurate.  
> Profile first, then optimize ΓÇö donΓÇÖt guess.


Γ£¿ Final Thought

Great architecture isnΓÇÖt about fancy tools itΓÇÖs about clean relationships.

When modules know too much about each other, systems get fragile.
When modules try to do too many things, systems become confusing.

Keep your code focused. Keep it independent.
Your future self and your teammates will thank you.

debugging tips: during debugging in programming dont just pay attention to code logic first check environment and configuration in .env second tooling which means is the application loading new changes or is using old code which is cashe problem, then third you can consider and check codes logic
