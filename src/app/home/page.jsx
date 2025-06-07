import React from 'react'
import Main from '@/components/layout/Main'
import RightSideBar from '@/components/layout/RightSideBar'

const page = () => {
  return (
    <div className="flex justify-center gap-6 w-full">
      {/* Main content in center */}
      <div className="flex-[2] max-w-[600px]">
        <Main />
      </div>

      {/* Right sidebar */}
      <div className="hidden xl:block flex-1 max-w-[300px]">
        <RightSideBar />
      </div>
    </div>
  )
}

export default page
