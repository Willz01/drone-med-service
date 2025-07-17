import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { Link } from "@tanstack/react-router";

import {DronesHomePage} from './routes/Home.tsx'
import DronesPage from "@/routes/Drones.tsx";
import RegisterDronePage from "@/routes/RegisterDrone.tsx";
import IdleDronesPage from "@/routes/IdleDrones.tsx";

import DroneEvents from "@/routes/DroneEvents.tsx";
import {PlaneIcon} from "lucide-react";
import { ThemeProvider } from './components/theme-provider.tsx'
import {Toaster} from "sonner";
import {MedicationsPage} from "./routes/Medications";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="p-2 flex gap-6 m-auto max-w-3xl ">

            <Link to="/" className="[&.active]:font-bold mr-5">
              <PlaneIcon />
            </Link>
            <Link to="/drones" className="[&.active]:font-bold text-md">
              Drones
            </Link>
            <Link to="/register" className="[&.active]:font-bold text-shadow-md">
              Register Drone
            </Link>
            <Link
                to="/idle-drones"
                className="[&.active]:font-bold text-shadow-md"
            >
              Idle Drones
            </Link>
            <Link
                to="/drone-events"
                className="[&.active]:font-extrabold text-shadow-md"
            >
              Drone Events
            </Link>
            <Link
                to="/medications"
                className="[&.active]:font-extrabold text-shadow-md"
            >
              Medications
            </Link>
          </div>
        <Toaster theme={"dark"} position="top-right" />
      <div>
        <Outlet />
      </div>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  ),
})

/**
 * Login (user page) // or drone page
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DronesHomePage,
})

/**
 * View all registered drones (state)[IDLE, LOADED]
 * View medications on drone
 * View details on drone
 * View battery level on drone
 */
const droneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/drones',
  component: DronesPage,

})

/**
 * Register drone
 */
const registerDroneRoute = createRoute({
  getParentRoute:() => rootRoute,
  path: '/register',
  component : RegisterDronePage,
})

/**
 * View idle (Available) drones
 * Load drone with meds
 */
const idleDronesRoute = createRoute({
  getParentRoute:() => rootRoute,
  path: '/idle-drones',
  component : IdleDronesPage,
})

/**
 * Event logger
 */
const droneEventsRoute = createRoute({
  getParentRoute:()=> rootRoute,
  path: '/drone-events',
  component: DroneEvents
})

/**
 * Medications
 */
const medicationsRoute = createRoute({
  getParentRoute:()=> rootRoute,
  path: '/medications',
  component: MedicationsPage
})

const routeTree =
    rootRoute.addChildren([indexRoute, droneRoute, registerDroneRoute, idleDronesRoute, droneEventsRoute, medicationsRoute])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
