import { UNIT_TYPES } from "@/constants/unit-types";

type UnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES]

export type {
    UnitType
}