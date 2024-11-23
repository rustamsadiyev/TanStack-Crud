import { createLazyFileRoute } from '@tanstack/react-router'
import Home from '../../pages/home'

export const Route = createLazyFileRoute('/_main/')({
  component: Home
})