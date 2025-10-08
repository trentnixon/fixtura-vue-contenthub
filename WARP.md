# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential Commands

### Development
- `npm run serve` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code style and errors

### Testing
- `npm run test:unit` - Run Jest unit tests
- `npm run test:e2e` - Run Cypress end-to-end tests

### Single Test Execution
- `npx jest <test-file-name>` - Run a specific unit test file
- `npx cypress run --spec "cypress/e2e/<test-file>.cy.js"` - Run a specific e2e test

## Architecture Overview

This is a Vue 3 application built with the Composition API, using Vuetify 3 for UI components and Pinia for state management.

### Key Architecture Patterns

**Layout System**: The app uses a hierarchical layout structure:
- `DefaultLayout.vue` - Simple layout for basic pages like home
- `AccountLayout.vue` - Main application layout with sidebar and top navigation
- Account-specific routes are nested under `/:accountid` path structure

**Navigation Architecture**: 
- `TopNavigation.vue` - App bar with quick selectors and account switching
- `SideNavigation.vue` - Dynamic navigation that adapts based on current account/sport/render context
- Navigation is context-aware and updates based on URL parameters (accountid, sport, renderid, groupingcategory)

**State Management with Pinia**:
- Modular store structure in `src/store/` with separate modules for each domain
- Each store module follows the pattern: `index.ts`, `actions.ts`, `getters.ts`, `service.ts`, `private.ts`
- Key stores: `account`, `accountMediaLibrary`, `aiArticles`, `associationStore`, `clubStore`, `auth`

**Route Structure**:
- Dynamic routing with nested account-specific routes: `/:accountid/sport/:sport/render/:renderid/grouping/:groupingcategory/asset/:asset`
- Route parameters drive navigation context and data fetching
- Dynamic page titles based on route context

**Component Organization**:
- `components/` - Reusable UI components organized by type (navigation, containers, UI primitives)
- `pages/` - Route-specific components and their local components
- `layouts/` - Application layout components
- `actions/` - Shared data fetching utilities

**Chart Integration**:
- Uses ECharts with Vue-ECharts wrapper
- Custom theme configuration for consistent charting appearance
- ECharts components registered globally as `v-chart`

### Technology Stack Notes

- **Vue 3** with Composition API and TypeScript
- **Vuetify 3** with custom theme configuration
- **Pinia** for state management (replaces Vuex)
- **Vue Router 4** with programmatic navigation
- **ECharts** for data visualization
- **Vuelidate** for form validation
- **Axios** for HTTP requests
- **Jest** for unit testing, **Cypress** for e2e testing

### Development Patterns

**Composables Usage**: The codebase uses Vue composables extensively for shared logic:
- `useAccountData` - Account-related data and computed properties
- `useRenderData` - Render/bundle specific data management
- `useSideNav` - Navigation state and route parameter management

**Icon System**: Uses a global icon plugin (`PluginIcons.ts`) that provides consistent icon access across components through dependency injection.

**Styling**: Combines Vuetify's utility classes with custom SCSS variables and utilities in `assets/styles/`.

### Route-Based Data Flow

The application follows a pattern where URL parameters drive data fetching and component state. Components watch route changes and update their data accordingly. This creates a bookmarkable, SEO-friendly navigation experience where the URL represents the complete application state.