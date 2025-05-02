import { UNIT_TYPES_WITH_NEGATIVE_VALUES } from "@/constants/unit-types-with-negative-values"
import { formSchema, onlyPositiveFormSchema } from "@/validations"

export const getCalculatedSchemaForValidation = (fromUnit: string) => {
    const areNegativeValuesAllowed = UNIT_TYPES_WITH_NEGATIVE_VALUES.has(fromUnit);
    return areNegativeValuesAllowed ? formSchema : onlyPositiveFormSchema;
}