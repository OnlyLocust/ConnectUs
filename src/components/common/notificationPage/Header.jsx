import { Button } from '@/components/ui/button'
import React from 'react'

const Header = () => {
  return (
     <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">Mark all as read</Button>
        </div>
      </div>
  )
}

export default React.memo(Header);
