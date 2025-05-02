import { z } from "zod";

const formSchema = z.object({
    fromValue: z.coerce
      .number({
        required_error: "Value is required",
        invalid_type_error: "Value must be a number",
      })
      .refine((val) => !isNaN(val), {
        message: "Value must be a number",
      }),
    fromUnit: z.string().min(1, { message: "Please select a unit" }),
    toUnit: z.string().min(1, { message: "Please select a unit" }),
})

const onlyPositiveSchema = z.object({
    fromValue: z.coerce
      .number({
        required_error: "Value is required",
        invalid_type_error: "Value must be a number",
      })
      .refine((val) => !isNaN(val), {
        message: "Value must be a number",
      })
      .refine((val) => val > 0, {
        message: "Value must be positive",
      }),
})

const onlyPositiveFormSchema = formSchema.merge(onlyPositiveSchema)

export {
    formSchema,
    onlyPositiveFormSchema
}