import { T } from '../../constants/tokens'
import { fmt } from '../../utils/helpers'
import { quantity } from '../../utils/quantity'

// One shared option row for grommet caps and accessories. Keep the existing
// brand checkbox and card treatment; quantity is independent of card clicks.
export default function CheckOption({ label, price, checked, onChange, image, qty, onQuantityChange }) {
  const hasQuantity = typeof onQuantityChange === 'function'
  const count = hasQuantity ? quantity(qty) : 0
  const selected = hasQuantity ? count > 0 : Boolean(checked)
  const toggle = () => onChange(!selected)
  const setCount = (next) => onQuantityChange(Math.max(0, Math.min(99, quantity(next))))

  const checkbox = (
    <span className='byd-option__checkbox' aria-hidden='true' style={{
      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
      border: `2px solid ${selected ? T.brand : T.border}`,
      background: selected ? T.brand : 'transparent', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
    }}>
      {selected ? <svg width='10' height='8' viewBox='0 0 10 8' fill='none' aria-hidden='true'>
        <path d='M1 4L3.5 6.5L9 1' stroke={T.textOnDark} strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
      </svg> : null}
    </span>
  )

  return (
    <div className={`byd-option${hasQuantity ? ' byd-option--quantity' : ''}`} style={{
      display: 'grid', gridTemplateColumns: hasQuantity ? 'minmax(0, 1fr) auto auto' : 'minmax(0, 1fr) auto',
      gap: 12, alignItems: 'center', minWidth: 0,
      padding: image ? '6px 12px 6px 6px' : '13px 16px', borderRadius: 12,
      border: `1.5px solid ${selected ? T.brand : T.border}`,
      background: selected ? T.brandTint : T.bg, transition: 'all 0.15s',
    }}>
      <div className='byd-option__label-group' role='checkbox' aria-checked={selected} aria-label={label} tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle() } }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, cursor: 'pointer' }}>
        {image ? <img src={image} alt='' width={72} height={48}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          style={{ width: 72, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: `1px solid ${T.border}` }} /> : null}
        {checkbox}
        <span className='byd-option__label' style={{ fontSize: 13.5, color: T.text, fontWeight: 500, fontFamily: T.font, minWidth: 0 }}>
          {label}{hasQuantity ? <span style={{ color: T.textMute, marginLeft: 5 }}>({count})</span> : null}
        </span>
      </div>

      {hasQuantity ? <div className='byd-option__quantity' role='group' aria-label={`${label} quantity`} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, whiteSpace: 'nowrap',
      }}>
        <button className='byd-option__qty-button' type='button' aria-label={`Decrease ${label} quantity`}
          disabled={count === 0} onClick={() => setCount(count - 1)} style={qtyButtonStyle}>−</button>
        <input className='byd-option__qty-input' type='number' min='0' max='99' step='1'
          aria-label={`${label} quantity`} value={count}
          onChange={(e) => setCount(e.target.value)}
          style={{ width: 35, height: 30, boxSizing: 'border-box', textAlign: 'center', fontSize: 13,
            padding: '2px 0', border: `1px solid ${T.border}`, borderRadius: 6,
            background: T.bgCard, color: T.text, MozAppearance: 'textfield', appearance: 'textfield' }} />
        <button className='byd-option__qty-button' type='button' aria-label={`Increase ${label} quantity`}
          disabled={count >= 99} onClick={() => setCount(count + 1)} style={qtyButtonStyle}>+</button>
      </div> : null}

      <span className='byd-option__price' style={{ fontSize: 13, color: T.brand, fontWeight: 600,
        fontFamily: T.font, whiteSpace: 'nowrap', textAlign: 'right', minWidth: 56 }}>
        +{fmt(price)}
      </span>
    </div>
  )
}

const qtyButtonStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 30, flexShrink: 0, padding: 0, borderRadius: 6,
  border: `1px solid ${T.border}`, background: T.bgCard, cursor: 'pointer',
  fontSize: 17, lineHeight: 1, color: T.brand,
}
