'use server'

import { QUERY_PARAMS } from "@/constants/query-params";
import { UNIT_TYPES } from "@/constants/unit-types";
import { UnitType } from "@/types";
import { redirect } from "next/navigation";


export async function submitFormAction(formData: FormData) {
    const type = formData.get('type')?.toString().toUpperCase() as keyof typeof UNIT_TYPES;
    const unitType = type && UNIT_TYPES[type] !== undefined 
        ? UNIT_TYPES[type] as UnitType 
        : UNIT_TYPES.LENGTH;

    const fromUnit = formData.get('from')?.toString() ?? '';
    const toUnit = formData.get('to')?.toString() ?? '';
    const value = parseFloat(formData.get('value')?.toString() ?? '0');

    if(fromUnit && toUnit && value && unitType) {
        const newUrl = `/?${QUERY_PARAMS.FROM}=${fromUnit}&${QUERY_PARAMS.TO}=${toUnit}&${QUERY_PARAMS.TYPE}=${unitType}&${QUERY_PARAMS.VALUE}=${value}`
        redirect(newUrl)
    }
}

export async function submitUnitTypeAction(formData: FormData) {
    const paramKeys = Object.keys(UNIT_TYPES)
    const type = paramKeys.find((paramKey) => {
        return formData.getAll(paramKey.toLocaleLowerCase()).length > 0
    }) as keyof typeof UNIT_TYPES
    
    const unitType = type && UNIT_TYPES[type] !== undefined 
        ? UNIT_TYPES[type] as UnitType 
        : UNIT_TYPES.LENGTH;

    redirect(`/?${QUERY_PARAMS.TYPE}=${unitType}`)
}