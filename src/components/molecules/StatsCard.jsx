import React from 'react'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'whatsapp-primary',
  trend
}) => {
  const colorClasses = {
    'whatsapp-primary': 'bg-gradient-to-br from-whatsapp-primary to-green-500 text-white',
    'blue': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    'purple': 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
    'orange': 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
    'red': 'bg-gradient-to-br from-red-500 to-red-600 text-white'
  }

  return (
    <Card className={`${colorClasses[color]} text-white`} hover={true}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className="mr-1" 
              />
              <span className="text-sm">{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}

export default StatsCard