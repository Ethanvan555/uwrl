# uwrl
Universal Web Resilience Layer — a production-quality TypeScript library for browser application reliability through progressive enhancement and developer-controlled resilience mechanisms.

## When UWRL Won't Be Effective

**Despite its robust design, UWRL may not provide full resilience in these scenarios:**

- **Completely isolated network environments** (air-gapped systems, dedicated hardware with no external connectivity)
- **Hard-coded browser restrictions** that mutate the document object model after initial load
- **Server-side rendering blocks** where the server itself enforces strict CSP before JavaScript runs
- **Native app embeds** (Cordova/Capacitor/React Native) without proper bridge configuration for resilience hooks
- **Hardware-level filtering** (enterprise firewalls that drop packets before reaching the browser)
- **Extension-based blockers** that inject their own scripts mid-render after UWRL initialization
- **WebSocket-only connections** where initial handshake is blocked but streaming is allowed

In these cases, consider hybrid approaches combining UWRL with server-side polyfills or native app configuration.

## Integration Instructions

Choose the method that best fits your project type:

### Method 1: Direct Import (for simple sites / static HTML)

**Where to move the `src/` folder:**

If you have a simple HTML/JS site without a bundler:

1. Copy the `src/` folder **into your project's source directory** (e.g., `my-project/src/`)
2. Build the library in that location:
   ```bash
   cd my-project/src/uwrl
   npm run build
   ```
3. In your HTML file, add a script tag pointing to your built bundle:
   ```html
   <script src="src/uwrl/dist/bundle.js"></script>
   ```
4. Use the API in your scripts:
   ```typescript
   import * as uwrl from './src/uwrl/index.ts';
   // or after building
   import * as uwrl from './src/uwrl/dist/index.js';
   ```

### Method 2: npm Package (for Node.js / Vite / Webpack projects)

**Where to move the `src/` folder:**

If you plan to build and distribute UWRL as a package:

1. Build the library in your workspace:
   ```bash
   cd uwrl
   npm run build
   ```
2. Install it locally in your project:
   ```bash
   cd my-project
   npm link uwrl
   # or
   npm install ./uwrl
   ```
3. Import in your code:
   ```typescript
   import * as uwrl from 'uwrl';
   ```

### Method 3: CDN (for quick prototyping / testing)

1. Build the library and host it on a CDN or static server
2. Reference it directly in your HTML:
   ```html
   <script src="https://cdn.example.com/uwrl/bundle.js"></script>
   ```

### Method 4: Framework Integration (React, Vue, Angular, etc.)

**Where to move the `src/` folder:**

For framework-based projects:

1. Add UWRL as a dependency in your `package.json`:
   ```bash
   cd my-project
   npm install uwrl
   ```
2. Import it in your entry point or main app file:
   ```typescript
   // In your entry.tsx or main.ts
   import * as uwrl from 'uwrl';
   
   // Use it throughout your app
   const resilientComponent = uwrl.makeResilient(MyComponent);
   ```

### Typical Integration Flow

Regardless of method, the general pattern is:

1. **Move `src/` contents** into your project's source folder (or install as a dependency)
2. **Configure your build tool** to bundle with your existing setup
3. **Import at your app's entry point** (e.g., `index.html`, `main.tsx`, `App.vue`)
4. **Use the API** throughout your application where resilience is needed

The library will then be bundled with your existing build process, and your application gains all of UWRL's progressive enhancement capabilities automatically.

## Core Features

- Bypass CORS, CSP, TLS/certificate validation
- Bypass authentication/authorization
- Defeat browser security boundaries
- Exploit browser vulnerabilities
- Circumvent platform access restrictions (GoGuardian, Lightspeed, etc.)

### Typical School Blocker Scenarios

1. **GoGuardian / Lightspeed** (CORS + CSP)
   - CORS headers: Access-Control-Allow-Origin with restrictions
   - CSP headers: Restrict where scripts/styles can load from
   - Sandbox attributes: Limit iframes and embedded content
   - **UWRL helps by**: Detecting failures, retrying via CDN mirrors/proxies, injecting polyfills, providing same-domain fallbacks

2. **Content Delivery Restrictions**
   - External CDNs blocked: cdn.jsdelivr.net, unpkg.com, cloudflare.com
   - Game frameworks: itch.io, itchy.io, itch.zone
   - Texture/image hosts: imgur.com, discordcdn.com, streamable.com
   - **UWRL helps by**: Maintaining blocked domain lists, providing self-hosted/school-approved CDN alternatives, detecting failed assets, offering local-first fallbacks

3. **JavaScript Execution Restrictions**
   - Filters block: Minified code, dynamic loading (import()/fetch()), Web Workers
   - **UWRL helps by**: Providing tree-shakeable/readable modules, sync alternatives when async fails, inline worker fallbacks

4. **Iframe/Canvas Restrictions**
   - Sandbox attributes: allow-scripts, allow-same-origin limitations
   - Cross-origin isolation requirements
   - Pointer lock for full-screen gameplay
   - **UWRL helps by**: Detecting sandbox constraints, providing "sandbox-friendly" API patterns, fallback input handling

## Development

- **Build**: `npm run build`
- **Test**: `npm test`
- **Watch**: `npm run watch`

## License

MIT
<EOF>