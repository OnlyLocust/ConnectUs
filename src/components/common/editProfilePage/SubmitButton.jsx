import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'


const SubmitButton = ({isLoading,userId}) => {

  const router = useRouter()

  const backNavigation = () => {
    router.push(`/home/user/profile/${userId}`)
  }

  return (
    <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={backNavigation}>
            Cancel
          </Button>
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
  )
}

export default SubmitButton
