import type React from "react"
import type { PaginationState } from "./data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationSelectionProps {
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

const PaginationSelection: React.FC<PaginationSelectionProps> = ({ pagination, setPagination }) => {
  if (!pagination) {
    return null
  }
  
  return (
    <div className="flex justify-start gap-2 items-center">
      <div className="text-nowrap text-sm font-extralight">Rows Per Page</div>
      <Select
        value={pagination.pageSize.toString()}
        onValueChange={(value) => {
          setPagination((prev) => ({ ...prev, pageSize: Number(value) }))
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={pagination.pageSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          {[4, 6, 8, 10, 15, 20, 30].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PaginationSelection

