"use client"

import type React from "react"
import type { ReactNode } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface DndWrapperProps {
  children: ReactNode
}

const DndWrapper: React.FC<DndWrapperProps> = ({ children }) => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return <>{children}</>
  }

  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}

// Add a getInitialProps to prevent automatic static optimization
// @ts-ignore
DndWrapper.getInitialProps = async () => {
  return {}
}

export default DndWrapper

