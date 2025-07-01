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
    'primary': 'bg-primary-600 text-white',
    'accent-blue': 'bg-accent-blue text-white',
    'accent-green': 'bg-accent-green text-white',
    'accent-purple': 'bg-accent-purple text-white',
    'accent-orange': 'bg-accent-orange text-white',
    'accent-red': 'bg-accent-red text-white'
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