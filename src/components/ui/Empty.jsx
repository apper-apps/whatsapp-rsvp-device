import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item",
  icon = "Inbox",
  actionLabel = "Create New",
  onAction,
  className = ""
}) => {
  return (
    <Card className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-whatsapp-primary to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={40} className="text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        {onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            icon="Plus"
            size="lg"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default Empty