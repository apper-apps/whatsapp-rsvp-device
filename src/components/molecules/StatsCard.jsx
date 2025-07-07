import React from 'react'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend
}) => {
return (
    <Card hover={true}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold mt-1 text-primary">{value}</p>
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
        <div className="p-3 bg-primary-50 rounded-lg">
          <ApperIcon name={icon} size={24} className="text-primary-600" />
        </div>
      </div>
    </Card>
  )
}

export default StatsCard