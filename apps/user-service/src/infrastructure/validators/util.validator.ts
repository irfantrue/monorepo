import vine from '@vinejs/vine'

export const numericString = (defaultValue: number) => {
    return vine
        .string()
        .nullable()
        .optional()
        .transform(value => {
            if (!value) return defaultValue

            const parsed = Number(value)

            return Number.isNaN(parsed) ? defaultValue : parsed
        })
}

export const booleanString = (defaultValue: boolean) => {
    return vine
        .string()
        .nullable()
        .optional()
        .transform(value => {
            if (!value) return defaultValue

            const normalized = value.toLowerCase().trim()

            if (['true', '1', 'yes', 'on'].includes(normalized)) {
                return true
            }

            if (['false', '0', 'no', 'off'].includes(normalized)) {
                return false
            }

            return defaultValue
        })
}
