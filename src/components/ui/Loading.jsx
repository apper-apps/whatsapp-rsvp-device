import React from 'react'
import Card from '@/components/atoms/Card'

const Loading = ({ type = 'cards', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table header skeleton */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-shimmer" style={{ width: `${80 + i * 20}px` }}></div>
            ))}
          </div>
        </div>
        
        {/* Table rows skeleton */}
        <div className="divide-y divide-gray-200">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded animate-shimmer" style={{ width: `${60 + j * 30}px` }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-20"></div>
                <div className="h-8 bg-gray-200 rounded animate-shimmer w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded animate-shimmer w-32"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-shimmer"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-24"></div>
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-20"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded-full animate-shimmer w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full animate-shimmer w-20"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Loading