import { useState, useMemo, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { T } from '../../constants/tokens'
import { CONTACT_URL } from '../../constants/config'
import {
  RECT_FRAMES,
  RECT_MIN_LEN,
  RECT_DEPTH_MIN,
  RECT_DEPTH_MAX,
  MDF_COLOURS,
  MDF_EDGES,
  WOOD_EDGE_STYLES,
  FRAME_COLOURS,
  GROMMET_HOLE_TYPES,
  grommetAddonPrice,
} from '../../constants/rectDesk'
import { SOLID_WOOD_SPECIES } from '../../constants/lshapeDesk'
import { TOP_RATE, ASSEMBLY_STANDARD } from '../../constants/assembly'
import {
  ACCESSORY_CABLE_TRAY,
  ACCESSORY_DRAWER,
  ACCESSORY_RETRACT_SOCKET,
  ACCESSORY_SLIDING_SOCKET,
  ACCESSORY_CASTOR_4PCS,
  ACCESSORY_RISER_SMALL,
  ACCESSORY_RISER_LARGE,
  ADDONS_CATALOG,
} from '../../constants/accessories'
import { fmt } from '../../utils/helpers'
import { quantity, quantityLabel } from '../../utils/quantity'
import Card from '../ui/Card'
import SectionLabel from '../ui/SectionLabel'
import RangeSlider from '../ui/RangeSlider'
import ColourSwatchGrid from '../ui/ColourSwatchGrid'
import PillSelect from '../ui/PillSelect'
import CheckOption from '../ui/CheckOption'
import GrommetOptions from '../ui/GrommetOptions'
import PriceRow from '../ui/PriceRow'
import StopNotice from '../ui/StopNotice'
import InfoNotice from '../ui/InfoNotice'
import SpecSheet, { PAGE_STYLE } from '../SpecSheet'
import RectDiagram from './RectDiagram'

const PRINT_BTN = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 22px',
  background: T.brand,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  flexShrink: 0,
}

// New Add-Ons (#14, #23, #24) — shared catalogue with uniform white-bg PNGs.
const ADDONS = ADDONS_CATALOG

// Small edge-profile preview shown inside each Waterfall edge card.
// When an illustration is provided, show it; otherwise fall back to the
// original inline vector profile.
function EdgeThumb({ id, active, image, label }) {
  const stroke = active ? T.brand : T.textMute
  const fill = active ? T.brandTint : 'transparent'
  if (image) {
    return (
      <img
        src={image}
        alt={label ?? 'Edge style'}
        onError={(ev) => {
          ev.currentTarget.style.display = 'none'
        }}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'contain',
          background: '#fff',
          borderRadius: 8,
          display: 'block',
          marginBottom: 8,
        }}
      />
    )
  }
  return (
    <svg
      width='100%'
      height='46'
      viewBox='0 0 120 46'
      style={{ display: 'block', marginBottom: 8 }}
      preserveAspectRatio='xMidYMid meet'
    >
      {id === 'ergo-curve' ? (
        <path
          d='M6 8 H114 V30 Q114 40 104 40 H80 C71 40 67 27 60 27 C53 27 49 40 40 40 H16 Q6 40 6 30 Z'
          fill={fill}
          stroke={stroke}
          strokeWidth='2'
        />
      ) : (
        <path d='M6 8 H114 V40 H6 Z' fill={fill} stroke={stroke} strokeWidth='2' />
      )}
      {id === 'ergo-slope' && (
        <line
          x1='16'
          y1='34'
          x2='104'
          y2='34'
          stroke={stroke}
          strokeWidth='1'
          strokeDasharray='4 3'
          strokeOpacity='0.6'
        />
      )}
    </svg>
  )
}

export default function RectMaterialPanel({ materialKey = 'mdf' }) {
  // Solid Wood prices per species; MDF uses the flat TOP_RATE.
  const isSpecies = materialKey === 'solid'
  const colours = isSpecies ? SOLID_WOOD_SPECIES : MDF_COLOURS
  const edges = isSpecies ? WOOD_EDGE_STYLES : MDF_EDGES

  const [length, setLength] = useState(140)
  const [depth, setDepth] = useState(70)
  const [motor, setMotor] = useState('dual')
  const [frameColour, setFrameColour] = useState(FRAME_COLOURS[0])
  const [colour, setColour] = useState(colours[0].id)
  const [edge, setEdge] = useState(edges[0].id)
  const [assembly, setAssembly] = useState(false)
  const [holeType, setHoleType] = useState('None')
  const [grommetPosition, setGrommetPosition] = useState('Centre')
  const [grommetColour, setGrommetColour] = useState('Black')
  const [grommetSize, setGrommetSize] = useState('20cm')
  const [grommetAddon, setGrommetAddon] = useState(0)
  const [cableTray, setCableTray] = useState(0)
  const [drawer, setDrawer] = useState(0)
  const [retractSocket, setRetractSocket] = useState(0)
  const [slidingSocket, setSlidingSocket] = useState(0)
  const [castors, setCastors] = useState(0)
  const [riserSmall, setRiserSmall] = useState(0)
  const [riserLarge, setRiserLarge] = useState(0)
  const [addons, setAddons] = useState({})
  const [isPrinting, setIsPrinting] = useState(false)

  const printRef = useRef(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: PAGE_STYLE,
    onAfterPrint: () => setIsPrinting(false),
  })

  const tooShort = length < RECT_MIN_LEN
  const tooLong = length > RECT_FRAMES.dual.maxLen
  const depthOk = depth >= RECT_DEPTH_MIN && depth <= RECT_DEPTH_MAX
  const singleOk = length >= RECT_MIN_LEN && length <= RECT_FRAMES.single.maxLen
  const dualOk = length >= 100 && length <= RECT_FRAMES.dual.maxLen

  // Auto-selects motor when length moves outside a frame's supported range.
  // singleOk/dualOk derive only from length — listing them as deps would be redundant.
  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!singleOk && dualOk) setMotor('dual')
    else if (singleOk && !dualOk) setMotor('single')
  }, [length])
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  // Trigger print after SpecSheet mounts in the DOM.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isPrinting && printRef.current) {
      handlePrint()
    }
  }, [isPrinting])
  /* eslint-enable react-hooks/exhaustive-deps */

  const assemblyFee = assembly ? ASSEMBLY_STANDARD : 0

  const grommetCost =
    grommetAddon && holeType !== 'None'
      ? grommetAddonPrice(holeType, grommetSize, grommetColour) * quantity(grommetAddon)
      : 0

  const accCost =
    quantity(cableTray) * ACCESSORY_CABLE_TRAY +
    quantity(drawer) * ACCESSORY_DRAWER +
    quantity(retractSocket) * ACCESSORY_RETRACT_SOCKET +
    quantity(slidingSocket) * ACCESSORY_SLIDING_SOCKET +
    quantity(castors) * ACCESSORY_CASTOR_4PCS +
    quantity(riserSmall) * ACCESSORY_RISER_SMALL +
    quantity(riserLarge) * ACCESSORY_RISER_LARGE +
    ADDONS.reduce((sum, a) => sum + quantity(addons[a.id]) * a.price, 0)

  // Table top rate: solid wood is priced per species ($/m²), MDF is a flat rate.
  const rate = isSpecies ? (SOLID_WOOD_SPECIES.find((s) => s.id === colour)?.rate ?? 0) : TOP_RATE

  const result = useMemo(() => {
    if (tooShort || tooLong || !depthOk) return null
    const frame = RECT_FRAMES[motor]
    if (!frame) return null
    const area = (length / 100) * (depth / 100)
    const topPrice = area * rate
    const total = frame.price + topPrice + assemblyFee + grommetCost + accCost
    return { frame, area, topPrice, total }
  }, [length, depth, motor, rate, tooShort, tooLong, depthOk, assemblyFee, grommetCost, accCost])

  const colourName = colours.find((c) => c.id === colour)?.name ?? colour
  const edgeName = edges.find((e) => e.id === edge)?.label ?? edge
  const motorLabel = RECT_FRAMES[motor]?.name ?? motor

  const rectSpec = result
    ? {
        type: 'rect',
        length,
        depth,
        material: materialKey,
        rate,
        motorLabel,
        frameColour,
        colourName,
        edgeName,
        assembly,
        assemblyFee,
        holeType,
        grommetAddon,
        grommetQuantity: quantity(grommetAddon),
        grommetPosition,
        grommetColour,
        grommetSize,
        grommetCost,
        cableTray,
        drawer,
        retractSocket,
        slidingSocket,
        castors,
        riserSmall,
        riserLarge,
        selectedAddons: ADDONS.filter((a) => quantity(addons[a.id])).map((a) => ({ ...a, qty: quantity(addons[a.id]) })),
        accCost,
        flat: false,
        frameName: result.frame.name,
        framePrice: result.frame.price,
        area: result.area,
        topPrice: result.topPrice,
        total: result.total,
      }
    : null

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Edge Style */}
      <Card>
        <SectionLabel>Edge Style</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isSpecies ? 'repeat(3,1fr)' : '1fr 1fr',
            gap: 12,
          }}
        >
          {edges.map((e) => (
            <div
              key={e.id}
              onClick={() => setEdge(e.id)}
              style={{
                cursor: 'pointer',
                border: `1.5px solid ${edge === e.id ? T.brand : T.border}`,
                background: edge === e.id ? T.brandTint : T.bg,
                borderRadius: 12,
                padding: 14,
                transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                boxShadow: edge === e.id ? `0 0 0 1px ${T.brand}25` : '0 0 0 1px transparent',
              }}
            >
              <EdgeThumb id={e.id} active={edge === e.id} image={e.image} label={e.label} />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13.5,
                  textAlign: 'center',
                  color: edge === e.id ? T.brand : T.text,
                }}
              >
                {e.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Size */}
      <Card>
        <SectionLabel>Size</SectionLabel>
        <div style={{ display: 'grid', gap: 18, marginBottom: 16 }}>
          <RangeSlider
            label='Length'
            value={length}
            set={setLength}
            min={RECT_MIN_LEN}
            max={RECT_FRAMES.dual.maxLen}
          />
          <RangeSlider
            label='Depth'
            value={depth}
            set={setDepth}
            min={RECT_DEPTH_MIN}
            max={RECT_DEPTH_MAX}
          />
        </div>
        <RectDiagram length={length} depth={depth} edge={edge} />
        {tooShort && (
          <StopNotice>
            This length is below what we can build. The shortest we offer is {RECT_MIN_LEN}cm.
          </StopNotice>
        )}
        {tooLong && (
          <StopNotice>
            This length is beyond our standard custom range.{' '}
            <a href={CONTACT_URL} style={{ color: T.warn, fontWeight: 600 }}>
              Contact us
            </a>{' '}
            for a custom quote above {RECT_FRAMES.dual.maxLen}cm.
          </StopNotice>
        )}
        {!depthOk && !tooShort && !tooLong && (
          <StopNotice>
            Depth should be between {RECT_DEPTH_MIN}–{RECT_DEPTH_MAX}cm.
          </StopNotice>
        )}
        {!tooShort && !tooLong && depthOk && (
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: T.brand,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
              <circle cx='6' cy='6' r='5' stroke={T.brand} strokeWidth='1.2' />
              <path d='M6 5v4M6 4V3' stroke={T.brand} strokeWidth='1.3' strokeLinecap='round' />
            </svg>
            {`This size builds on ${RECT_FRAMES[motor]?.name || ''}`}
          </div>
        )}
      </Card>

      {/* Frame */}
      {!tooShort && !tooLong && depthOk && (singleOk || dualOk) && (
        <Card>
          <SectionLabel>Frame</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: singleOk && dualOk ? '1fr 1fr' : '1fr',
              gap: 12,
            }}
          >
            {singleOk && (
              <div
                onClick={() => setMotor('single')}
                style={{
                  cursor: 'pointer',
                  border: `1.5px solid ${motor === 'single' ? T.brand : T.border}`,
                  background: motor === 'single' ? T.brandTint : T.bg,
                  borderRadius: 12,
                  padding: 14,
                  transition: 'all 0.15s',
                  boxShadow: motor === 'single' ? `0 0 0 1px ${T.brand}25` : 'none',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13.5,
                    color: motor === 'single' ? T.brand : T.text,
                  }}
                >
                  {RECT_FRAMES.single.name}
                </div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 3 }}>{RECT_FRAMES.single.description} · Frame: {fmt(RECT_FRAMES.single.price)}</div>
              </div>
            )}
            {dualOk && (
              <div
                onClick={() => setMotor('dual')}
                style={{
                  cursor: 'pointer',
                  border: `1.5px solid ${motor === 'dual' ? T.brand : T.border}`,
                  background: motor === 'dual' ? T.brandTint : T.bg,
                  borderRadius: 12,
                  padding: 14,
                  transition: 'all 0.15s',
                  boxShadow: motor === 'dual' ? `0 0 0 1px ${T.brand}25` : 'none',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13.5,
                    color: motor === 'dual' ? T.brand : T.text,
                  }}
                >
                  {RECT_FRAMES.dual.name}
                </div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 3 }}>{RECT_FRAMES.dual.description} · Frame: {fmt(RECT_FRAMES.dual.price)}</div>
              </div>
            )}
          </div>

          {/* Frame colour (#20) */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8, fontWeight: 500 }}>
              Frame Colour
            </div>
            <PillSelect options={FRAME_COLOURS} value={frameColour} onChange={setFrameColour} />
          </div>

          {/* Free cup + headphone holder for Lite/Pro (#18) */}
          <div style={{ marginTop: 14 }}>
            <InfoNotice>
              Includes a free cup holder and headphone holder (worth $39.90) with every Build Your
              Desks™ Lite and Pro frame.
            </InfoNotice>
          </div>
        </Card>
      )}

      {/* Colour + Edge + Grommet + Accessories */}
      {!tooShort && !tooLong && depthOk && (
        <>
          <Card>
            <SectionLabel>{isSpecies ? 'Wood Species' : 'MDF Colour'}</SectionLabel>
            <ColourSwatchGrid
              colours={colours}
              selected={colour}
              onSelect={setColour}
              showRate={isSpecies}
              columns={isSpecies ? 4 : 5}
            />
          </Card>

          <Card>
            <SectionLabel>Grommet Hole Cut-out</SectionLabel>
            <PillSelect
              options={GROMMET_HOLE_TYPES}
              value={holeType}
              onChange={(v) => {
                setHoleType(v)
                if (v === 'None') setGrommetAddon(false)
              }}
            />
            {holeType !== 'None' && (
              <div style={{ marginTop: 16 }}>
                <GrommetOptions
                  holeType={holeType}
                  size={grommetSize}
                  onSizeChange={setGrommetSize}
                  position={grommetPosition}
                  onPositionChange={setGrommetPosition}
                  addon={grommetAddon}
                  onAddonChange={(v) => setGrommetAddon(v ? Math.max(1, quantity(grommetAddon)) : 0)}
                  addonQuantity={quantity(grommetAddon)}
                  onAddonQuantityChange={setGrommetAddon}
                  colour={grommetColour}
                  onColourChange={setGrommetColour}
                />
              </div>
            )}
          </Card>

          <Card>
            <SectionLabel>Assembly</SectionLabel>
            <CheckOption
              label='Assembly Service (Free Cable Tray Worth $49)'
              price={ASSEMBLY_STANDARD}
              checked={assembly}
              onChange={setAssembly}
            />
          </Card>

          <Card>
            <SectionLabel>Add-Ons</SectionLabel>
            <div style={{ display: 'grid', gap: 10 }}>
              <CheckOption
                label='Cable Tray Black/White'
                price={ACCESSORY_CABLE_TRAY}
                checked={cableTray}
                onChange={(v) => setCableTray(v ? Math.max(1, quantity(cableTray)) : 0)}
                qty={quantity(cableTray)}
                onQuantityChange={setCableTray}
                image='images/accessories/cable-tray.jpg'
              />
              <CheckOption
                label='Slim Drawer Black/White'
                price={ACCESSORY_DRAWER}
                checked={drawer}
                onChange={(v) => setDrawer(v ? Math.max(1, quantity(drawer)) : 0)}
                qty={quantity(drawer)}
                onQuantityChange={setDrawer}
                image='images/accessories/slim-drawer.jpg'
              />
              <CheckOption
                label='Retractable Socket Black/White'
                price={ACCESSORY_RETRACT_SOCKET}
                checked={retractSocket}
                onChange={(v) => setRetractSocket(v ? Math.max(1, quantity(retractSocket)) : 0)}
                qty={quantity(retractSocket)}
                onQuantityChange={setRetractSocket}
                image='images/accessories/retractable-socket.jpg'
              />
              <CheckOption
                label='Sliding Socket Black/Silver'
                price={ACCESSORY_SLIDING_SOCKET}
                checked={slidingSocket}
                onChange={(v) => setSlidingSocket(v ? Math.max(1, quantity(slidingSocket)) : 0)}
                qty={quantity(slidingSocket)}
                onQuantityChange={setSlidingSocket}
                image='images/accessories/sliding-socket.jpg'
              />
              <CheckOption
                label='Castor Wheels Black/White (4pcs)'
                price={ACCESSORY_CASTOR_4PCS}
                checked={castors}
                onChange={(v) => setCastors(v ? Math.max(1, quantity(castors)) : 0)}
                qty={quantity(castors)}
                onQuantityChange={setCastors}
                image='images/accessories/castor-wheels.jpg'
              />
              <CheckOption
                label='Desk Top Riser Walnut (800×200×120mm)'
                price={ACCESSORY_RISER_SMALL}
                checked={riserSmall}
                onChange={(v) => setRiserSmall(v ? Math.max(1, quantity(riserSmall)) : 0)}
                qty={quantity(riserSmall)}
                onQuantityChange={setRiserSmall}
                image='images/accessories/riser-small.jpg'
              />
              <CheckOption
                label='Desk Top Riser Walnut (1000×200×120mm)'
                price={ACCESSORY_RISER_LARGE}
                checked={riserLarge}
                onChange={(v) => setRiserLarge(v ? Math.max(1, quantity(riserLarge)) : 0)}
                qty={quantity(riserLarge)}
                onQuantityChange={setRiserLarge}
                image='images/accessories/riser-large.jpg'
              />
              {ADDONS.map((a) => (
                <CheckOption
                  key={a.id}
                  label={a.label}
                  price={a.price}
                  checked={!!addons[a.id]}
                  onChange={(v) => setAddons((prev) => ({ ...prev, [a.id]: v ? Math.max(1, quantity(prev[a.id])) : 0 }))}
                  qty={quantity(addons[a.id])}
                  onQuantityChange={(v) => setAddons((prev) => ({ ...prev, [a.id]: v }))}
                  image={a.image}
                />
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Estimate */}
      {result && (
        <>
          {isPrinting && (
            <div style={{ display: 'none' }}>
              <div ref={printRef}>
                <SpecSheet spec={rectSpec} />
              </div>
            </div>
          )}
          <Card
            style={{
              background: T.bgAlt,
              border: `1px solid ${T.brand}30`,
              boxShadow: `0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px ${T.brand}15`,
            }}
          >
            <SectionLabel>Your Estimate</SectionLabel>
            <>
              <PriceRow
                label={`Frame (${RECT_FRAMES[motor].name})`}
                value={fmt(RECT_FRAMES[motor].price)}
                muted
              />
              <PriceRow
                label={`Table top — net area (${result.area.toFixed(2)} m² × $${rate}/m²)`}
                value={fmt(result.topPrice)}
                muted
              />
              <PriceRow label='Delivery' value='Free' muted />
            </>
            {assembly && (
              <PriceRow
                label='Assembly Service (incl. free cable tray)'
                value={fmt(ASSEMBLY_STANDARD)}
                muted
              />
            )}
            {holeType !== 'None' && (
              <PriceRow
                label={`Grommet hole cut-out (${holeType === 'Circle' ? '6cm circle' : `${grommetSize} rect`}, ${grommetPosition})`}
                value='Free'
                muted
              />
            )}
            {grommetAddon && holeType !== 'None' && (
              <PriceRow label={quantityLabel(`Grommet cap (${grommetColour})`, grommetAddon)} value={fmt(grommetCost)} muted />
            )}
            {cableTray && <PriceRow label={quantityLabel('Cable Tray', cableTray)} value={fmt(ACCESSORY_CABLE_TRAY * quantity(cableTray))} muted />}
            {drawer && <PriceRow label={quantityLabel('Slim Drawer', drawer)} value={fmt(ACCESSORY_DRAWER * quantity(drawer))} muted />}
            {retractSocket && (
              <PriceRow label={quantityLabel('Retractable Socket', retractSocket)} value={fmt(ACCESSORY_RETRACT_SOCKET * quantity(retractSocket))} muted />
            )}
            {slidingSocket && (
              <PriceRow label={quantityLabel('Sliding Socket', slidingSocket)} value={fmt(ACCESSORY_SLIDING_SOCKET * quantity(slidingSocket))} muted />
            )}
            {castors && (
              <PriceRow label={quantityLabel('Castor Wheels (4pcs)', castors)} value={fmt(ACCESSORY_CASTOR_4PCS * quantity(castors))} muted />
            )}
            {riserSmall && (
              <PriceRow label={quantityLabel('Desk Top Riser (800mm)', riserSmall)} value={fmt(ACCESSORY_RISER_SMALL * quantity(riserSmall))} muted />
            )}
            {riserLarge && (
              <PriceRow label={quantityLabel('Desk Top Riser (1000mm)', riserLarge)} value={fmt(ACCESSORY_RISER_LARGE * quantity(riserLarge))} muted />
            )}
            {ADDONS.filter((a) => quantity(addons[a.id])).map((a) => ({ ...a, qty: quantity(addons[a.id]) })).map((a) => (
              <PriceRow key={a.id} label={quantityLabel(a.label, a.qty)} value={fmt(a.price * a.qty)} muted />
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 16,
                marginTop: 4,
                borderTop: `1px solid ${T.brand}25`,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.brandSoft,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Estimated Total
              </span>
              <span
                style={{ fontSize: 30, fontWeight: 700, color: T.brand, letterSpacing: '-0.02em' }}
              >
                {fmt(result.total)}
              </span>
            </div>
          </Card>
          <div
            style={{
              background: T.brandTint,
              border: `1px solid ${T.brand}30`,
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>
                Save or print your estimate
              </div>
              <div style={{ fontSize: 12, color: T.textMute, lineHeight: 1.5 }}>
                Click the button, then choose &ldquo;Save as PDF&rdquo; or select a printer. Send
                the PDF or a printed copy to the BuildYourDesks team.
              </div>
            </div>
            <button onClick={() => setIsPrinting(true)} style={PRINT_BTN}>
              Print / Save as PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}
