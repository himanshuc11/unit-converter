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

    const newUrl = `/?${QUERY_PARAMS.FROM}=${fromUnit}&${QUERY_PARAMS.TO}=${toUnit}&${QUERY_PARAMS.TYPE}=${unitType}&${QUERY_PARAMS.VALUE}=${value}`
    redirect(newUrl)
}