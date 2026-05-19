import LeftSideBar from '@/components/layout/LeftSideBar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <LeftSideBar />
      <main className="flex-1 min-w-0 md:pl-[320px] w-full">
        {children}
      </main>
    </div>
  )
}

export default layout
