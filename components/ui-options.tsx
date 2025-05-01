import { UnitType } from "@/types"
import { SelectItem } from "@/components/ui/select"
import OPTIONS from "@/constants/options"

function UnitOptions({ type }: { type: UnitType }) {
    const options: Record<string, string | undefined> = OPTIONS[type] ?? {}
    const optionList = Object.keys(options)
    const optionItems = optionList.map(optionId => <SelectItem key={optionId} value={optionId}>{options[optionId]}</SelectItem>)
    return optionItems ?? []    
}
  
export default UnitOptions