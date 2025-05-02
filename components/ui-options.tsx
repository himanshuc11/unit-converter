import { UnitType } from "@/types"
import { SelectItem } from "@/components/ui/select"
import OPTIONS from "@/constants/options"

type SelectItemProps = React.ComponentProps<typeof SelectItem>;

type UnitOptionsProps = {
    type: UnitType;
    RenderItem?: React.ComponentType<any>;
}

function UnitOptions({ type, RenderItem = SelectItem }: UnitOptionsProps) {
    const options: Record<string, string | undefined> = OPTIONS[type] ?? {}
    const optionList = Object.keys(options)

    const optionItems = optionList.map(optionId => <RenderItem key={optionId} value={optionId}>{options[optionId]}</RenderItem>)
    return optionItems ?? []    
}
  
export default UnitOptions