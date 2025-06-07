import LeftSideBar from '@/components/layout/LeftSideBar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div>
      <LeftSideBar />
      <div className="md:pl-[250px] xl:pl-[300px]">
        {children}
      </div>
    </div>
  )
}

export default layout
