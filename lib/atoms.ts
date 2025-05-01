import { atom } from "jotai"

// Theme state
export const themeAtom = atom<string | null>(null)

// Unit converter state
export const unitTypeAtom = atom<string>("length")
export const fromUnitAtom = atom<string>("")
export const toUnitAtom = atom<string>("")
