import { T } from '../../constants/tokens'
import {
  GROMMET_RECT_SIZES,
  GROMMET_RECT_POSITIONS,
  GROMMET_COLOURS,
  GROMMET_POSITION_NOTE,
  grommetAddonPrice,
} from '../../constants/rectDesk'
import PillSelect from './PillSelect'
import CheckOption from './CheckOption'

// Shared grommet sub-UI for any hole type.
// position/onPositionChange optional — omit for L-Shape (position handled externally).
export default function GrommetOptions({
  holeType,
  size,
  onSizeChange,
  position,
  onPositionChange,
  addon,
  onAddonChange,
  addonQuantity = 0,
  onAddonQuantityChange,
  colour,
  onColourChange,
}) {
  const holeNote =
    holeType === 'Circle'
      ? 'Circle · 6cm diameter'
      : `Rectangular · ${size}`

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {holeType === 'Rectangular' && (
        <div>
          <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8 }}>Size</div>
          <PillSelect options={GROMMET_RECT_SIZES} value={size} onChange={onSizeChange} />
        </div>
      )}
      {onPositionChange && (
        <div>
          <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8 }}>Position</div>
          <PillSelect
            options={GROMMET_RECT_POSITIONS}
            value={position}
            onChange={onPositionChange}
          />
          {position !== 'Middle' && (
            <div style={{ fontSize: 11, color: T.textMute, marginTop: 8 }}>
              {GROMMET_POSITION_NOTE}
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize: 12, color: T.textMute }}>
        {holeNote}
        {' — '}
        <span style={{ color: T.brand, fontWeight: 600 }}>Hole cut-out: Free</span>
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
        <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8, fontWeight: 500 }}>
          Grommet cap (optional add-on)
        </div>
        <CheckOption
          label='Add grommet cap'
          price={grommetAddonPrice(holeType, size, colour)}
          checked={addon}
          onChange={onAddonChange}
          qty={addonQuantity}
          onQuantityChange={onAddonQuantityChange}
        />
        {Boolean(addon) && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8 }}>Colour</div>
            <PillSelect options={GROMMET_COLOURS} value={colour} onChange={onColourChange} />
          </div>
        )}
      </div>
    </div>
  )
}
