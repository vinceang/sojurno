import { useState } from 'react'

/**
 * Open-state helper for `DemoActionDialog` so call sites stay tiny:
 * `const d = useDemoAction()` → `d.trigger()` opens, `<DemoActionDialog open={d.open} … />`.
 */
export function useDemoAction() {
  const [open, setOpen] = useState(false)
  return { open, setOpen, trigger: () => setOpen(true) }
}
