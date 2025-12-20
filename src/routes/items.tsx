import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout route for /items - required to establish parent-child relationship
// between /items (index) and /items/$itemId (detail) routes.
// This route doesn't add any UI, just provides the routing structure.
export const Route = createFileRoute('/items')({
  component: ItemsLayout,
})

function ItemsLayout() {
  return <Outlet />
}
