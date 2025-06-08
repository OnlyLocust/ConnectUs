import { SearchIcon } from 'lucide-react'
import React from 'react'

const NoSearch = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No results found
            </h3>
            <p className="text-gray-500 mt-1">
              Try different keywords or check your spelling
            </p>
          </div>
  )
}

export default NoSearch
