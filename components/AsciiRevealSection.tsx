"use client"

import { AsciiReveal } from "ascii-reveal"

export default function AsciiRevealSection({
  children,
  ...props
}: React.ComponentProps<typeof AsciiReveal>) {
  return (
    <AsciiReveal preset="terminal" lazy {...props}>
      {children}
    </AsciiReveal>
  )
}
