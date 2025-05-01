import { UNIT_TYPES } from "@/constants/unit-types"
import { atom } from "jotai"

// Theme state
export const themeAtom = atom<string | null>(null)

// Unit converter state
export const unitTypeAtom = atom<(typeof UNIT_TYPES)[keyof typeof UNIT_TYPES]>(UNIT_TYPES.LENGTH)
export const fromUnitAtom = atom<string>("")
export const toUnitAtom = atom<string>("")
