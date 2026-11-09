import { T } from '../../constants/tokens'
import { fmt } from '../../utils/helpers'
import { quantity } from '../../utils/quantity'

export default function CheckOption({ label, price, checked, onChange, image, qty, onQuantityChange }) {
  const count = quantity(qty)
  const hasQuantity = typeof onQuantityChange === 'function'
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: image ? '6px 12px 6px 6px' : '13px 16px',
        borderRadius: 12,
        border: `1.5px solid ${checked ? T.brand : T.border}`,
        background: checked ? T.brandTint : T.bg,
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 160px', minWidth: 0 }}>
        {image && (
          <img
            src={image}
            alt=''
            width={72}
            height={48}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            style={{
              width: 72,
              height: 48,
              borderRadius: 8,
              objectFit: 'cover',
              flexShrink: 0,
              border: `1px solid ${T.border}`,
            }}
          />
        )}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            flexShrink: 0,
            border: `2px solid ${checked ? T.brand : T.border}`,
            background: checked ? T.brand : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          {checked && (
            <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
              <path
                d='M1 4L3.5 6.5L9 1'
                stroke='#0C0C0E'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </div>
        <span style={{ fontSize: 13.5, color: T.text, fontWeight: 500, fontFamily: T.font, minWidth: 0 }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, marginLeft: 'auto' }}>
        {hasQuantity && checked && (
          <div role='group' aria-label={`${label} quantity`} onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <button type='button' aria-label={`Decrease ${label} quantity`} disabled={count <= 1}
              onClick={() => onQuantityChange(Math.max(1, count - 1))} style={qtyButtonStyle}>−</button>
            <input type='number' min='1' max='99' step='1' aria-label={`${label} quantity`}
              value={count} onChange={(e) => { if (e.target.value !== '') onQuantityChange(Math.max(1, quantity(e.target.value))) }}
              style={{ width: 38, textAlign: 'center', fontSize: 13, padding: '6px 2px', border: `1px solid ${T.border}`, borderRadius: 6, background: '#fff', color: T.text }} />
            <button type='button' aria-label={`Increase ${label} quantity`} disabled={count >= 99}
              onClick={() => onQuantityChange(Math.min(99, count + 1))} style={qtyButtonStyle}>+</button>
          </div>
        )}
        <span style={{ fontSize: 13, color: T.brand, fontWeight: 600, fontFamily: T.font, whiteSpace: 'nowrap' }}>
          +{fmt(hasQuantity && checked ? price * count : price)}
        </span>
      </div>
    </div>
  )
}

const qtyButtonStyle = { width: 27, height: 30, borderRadius: 6, border: '1px solid #d9d1c6', background: '#fff', cursor: 'pointer', fontSize: 17, color: '#644635' }
