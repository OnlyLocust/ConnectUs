import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import React from 'react'

const EmailInput = ({value,onChange,errors}) => {
  return (
    <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={value}
            onChange={onChange}
            className={`pl-10 ${errors ? "border-red-500" : ""}`}
          />
        </div>
        {errors && <p className="text-sm text-red-500">{errors}</p>}
      </div>
  )
}

export default EmailInput
