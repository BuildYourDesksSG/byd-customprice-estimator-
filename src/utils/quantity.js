// Quantity helpers. Existing boolean selections are treated as one unit for compatibility.
export const quantity = (value) => value === true ? 1 : value === false || value == null ? 0 : Math.max(0, Math.min(99, Math.trunc(Number(value) || 0)))
export const quantityLabel = (label, value) => `${label} × ${quantity(value)}`
