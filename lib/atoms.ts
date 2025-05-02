import { UNIT_TYPES } from "@/constants/unit-types"
import type { UnitType } from "@/types"
import { atom } from "jotai"

// Theme state
export const themeAtom = atom<string | null>(null)

// Unit converter state
export const unitTypeAtom = atom<UnitType>(
    typeof window === 'undefined' ? UNIT_TYPES.LENGTH : (() => {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type')?.toUpperCase() as keyof typeof UNIT_TYPES;
        
        return type && UNIT_TYPES[type] !== undefined 
            ? UNIT_TYPES[type] as UnitType 
            : UNIT_TYPES.LENGTH;
    })()
)
export const fromUnitAtom = atom<string>("")
export const toUnitAtom = atom<string>("")
