import FollowsPage from '@/components/pages/Follows'
import React from 'react'

const page =async  ({params}) => {
  const { id } =await  params;
  return (
    <div>
      <FollowsPage id={id} followType={'following'}/>
    </div>
  )
}

export default page
