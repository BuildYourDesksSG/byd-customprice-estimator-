import { useState, useMemo, useRef, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import { T } from '../../constants/tokens'
import { CONTACT_URL } from '../../constants/config'
import {
  LSHAPE_FRAME_PRICE,
  LSHAPE_L1_MIN,
  LSHAPE_L2_MIN,
  LSHAPE_L2_MAX,
  LSHAPE_WIDTH_MIN,
  LSHAPE_WIDTH_MAX,
  LSHAPE_MATERIALS,
  LSHAPE_MFC_COLOURS,
  SOLID_WOOD_SPECIES,
  L2_ORIENTATIONS,
} from '../../constants/lshapeDesk'
import { GROMMET_HOLE_TYPES, grommetAddonPrice, WOOD_EDGE_STYLES } from '../../constants/rectDesk'
import { ASSEMBLY_STANDARD, ASSEMBLY_TWO_PERSON } from '../../constants/assembly'
import {
  ACCESSORY_CABLE_TRAY,
  ACCESSORY_DRAWER,
  ACCESSORY_RETRACT_SOCKET,
  ACCESSORY_SLIDING_SOCKET,
  ACCESSORY_CASTOR_6PCS,
  ACCESSORY_RISER_SMALL,
  ACCESSORY_RISER_LARGE,
  ADDONS_CATALOG,
} from '../../constants/accessories'
import { fmt, clamp } from '../../utils/helpers'
import { quantity, quantityLabel } from '../../utils/quantity'
import Card from '../ui/Card'
import SpecSheet, { PAGE_STYLE } from '../SpecSheet'
import SectionLabel from '../ui/SectionLabel'
import RangeSlider from '../ui/RangeSlider'
import PillSelect from '../ui/PillSelect'
import ColourSwatchGrid from '../ui/ColourSwatchGrid'
import CheckOption from '../ui/CheckOption'
import PriceRow from '../ui/PriceRow'
import InfoNotice from '../ui/InfoNotice'
import GrommetOptions from '../ui/GrommetOptions'
import LShapeDiagram from './LShapeDiagram'

export default function LShapeMaterialPanel({ materialKey }) {
  const spec = LSHAPE_MATERIALS[materialKey]
  const isSpecies = spec.rateType === 'species'
  const l2max = Math.min(LSHAPE_L2_MAX, spec.l2max)

  const colours = materialKey === 'mfc' ? LSHAPE_MFC_COLOURS : SOLID_WOOD_SPECIES

  const [l1, setL1] = useState(clamp(140, LSHAPE_L1_MIN, spec.l1max))
  const [l2, setL2] = useState(clamp(120, LSHAPE_L2_MIN, l2max))
  const [w1, setW1] = useState(clamp(65, LSHAPE_WIDTH_MIN, LSHAPE_WIDTH_MAX))
  const [w2, setW2] = useState(clamp(60, LSHAPE_WIDTH_MIN, LSHAPE_WIDTH_MAX))
  const [orientation, setOrientation] = useState('Left')
  const [colour, setColour] = useState(colours[0].id)
  const [edgeStyle, setEdgeStyle] = useState(WOOD_EDGE_STYLES[0].id)
  const [holeType, setHoleType] = useState('None')
  const [position, setPosition] = useState('Middle')
  const [grommetSize, setGrommetSize] = useState('20cm')
  const [grommetColour, setGrommetColour] = useState('Black')
  const [grommetAddon, setGrommetAddon] = useState(0)
  const [assembly, setAssembly] = useState(false)
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isPrinting && printRef.current) {
      handlePrint()
    }
  }, [isPrinting])
  /* eslint-enable react-hooks/exhaustive-deps */

  const rate = isSpecies ? SOLID_WOOD_SPECIES.find((s) => s.id === colour)?.rate || 0 : spec.rate
  const assemblyFee = assembly
    ? materialKey === 'solid'
      ? ASSEMBLY_TWO_PERSON
      : ASSEMBLY_STANDARD
    : 0

  const result = useMemo(() => {
    const a1 = (l1 / 100) * (w1 / 100)
    const a2 = (l2 / 100) * (w2 / 100)
    const overlap = (w2 / 100) * (w1 / 100)
    const area = a1 + a2 - overlap
    const topPrice = area * rate
    const grommetCost =
      grommetAddon && holeType !== 'None'
        ? grommetAddonPrice(holeType, grommetSize, grommetColour) * quantity(grommetAddon)
        : 0
    const accCost =
      quantity(cableTray) * ACCESSORY_CABLE_TRAY +
      quantity(drawer) * ACCESSORY_DRAWER +
      quantity(retractSocket) * ACCESSORY_RETRACT_SOCKET +
      quantity(slidingSocket) * ACCESSORY_SLIDING_SOCKET +
      quantity(castors) * ACCESSORY_CASTOR_6PCS +
      quantity(riserSmall) * ACCESSORY_RISER_SMALL +
      quantity(riserLarge) * ACCESSORY_RISER_LARGE +
      ADDONS_CATALOG.reduce((sum, a) => sum + quantity(addons[a.id]) * a.price, 0)
    const total = LSHAPE_FRAME_PRICE + topPrice + assemblyFee + grommetCost + accCost
    return { a1, a2, area, topPrice, grommetCost, accCost, total }
  }, [
    l1,
    l2,
    w1,
    w2,
    rate,
    holeType,
    grommetSize,
    grommetColour,
    grommetAddon,
    assemblyFee,
    cableTray,
    drawer,
    retractSocket,
    slidingSocket,
    castors,
    riserSmall,
    riserLarge,
    addons,
  ])

  const speciesOrColourName = isSpecies
    ? (SOLID_WOOD_SPECIES.find((s) => s.id === colour)?.name ?? colour)
    : (colours.find((c) => c.id === colour)?.name ?? colour)

  const lshapeSpec = {
    type: 'lshape',
    materialLabel: spec.label,
    materialKey,
    l1,
    w1,
    l2,
    w2,
    orientation,
    speciesOrColourName,
    edgeStyle: isSpecies ? (WOOD_EDGE_STYLES.find((e) => e.id === edgeStyle)?.label ?? null) : null,
    rate,
    holeType,
    position,
    grommet:
      holeType !== 'None'
        ? {
            holeType: holeType.toLowerCase(),
            size: holeType === 'Rectangular' ? grommetSize : '6cm',
            addon: grommetAddon,
            qty: quantity(grommetAddon),
            colour: grommetAddon ? grommetColour : null,
          }
        : null,
    assembly,
    assemblyFee,
    cableTray,
    drawer,
    retractSocket,
    slidingSocket,
    castors,
    riserSmall,
    riserLarge,
    selectedAddons: ADDONS_CATALOG.filter((a) => quantity(addons[a.id])).map((a) => ({ ...a, qty: quantity(addons[a.id]) })),
    a1: result.a1,
    a2: result.a2,
    area: result.area,
    topPrice: result.topPrice,
    grommetCost: result.grommetCost,
    accCost: result.accCost,
    total: result.total,
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Main Side (L1) */}
      <Card>
        <SectionLabel>Main Side (L1)</SectionLabel>
        <div style={{ display: 'grid', gap: 18 }}>
          <RangeSlider label='Length' value={l1} set={setL1} min={LSHAPE_L1_MIN} max={spec.l1max} />
          <RangeSlider
            label='Width'
            value={w1}
            set={setW1}
            min={LSHAPE_WIDTH_MIN}
            max={LSHAPE_WIDTH_MAX}
          />
        </div>
      </Card>

      {/* Return Side (L2) */}
      <Card>
        <SectionLabel>Return Side (L2)</SectionLabel>
        <div style={{ display: 'grid', gap: 18, marginBottom: 14 }}>
          <RangeSlider
            label='Length'
            value={l2}
            set={setL2}
            min={LSHAPE_L2_MIN}
            max={l2max}
          />
          <RangeSlider
            label='Width'
            value={w2}
            set={setW2}
            min={LSHAPE_WIDTH_MIN}
            max={LSHAPE_WIDTH_MAX}
          />
        </div>
        <InfoNotice>
          Maximum dimensions: {spec.l1max}cm (main side length) × {LSHAPE_WIDTH_MAX}cm (width). Need
          something larger?{' '}
          <a href={CONTACT_URL} style={{ color: T.brand, fontWeight: 600 }}>
            Contact our team
          </a>
          .
        </InfoNotice>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: T.textMute, marginBottom: 8, fontWeight: 500 }}>
            L2 Orientation — which side the return side sits on (L1 is your main side)
          </div>
          <PillSelect options={L2_ORIENTATIONS} value={orientation} onChange={setOrientation} />
        </div>
      </Card>

      {/* Shape Preview */}
      <Card>
        <SectionLabel>Shape Preview</SectionLabel>
        <LShapeDiagram
          l1={l1}
          w1={w1}
          l2={l2}
          w2={w2}
          orientation={orientation}
          l1max={spec.l1max}
        />
      </Card>

      {/* Colour / Species */}
      <Card>
        <SectionLabel>{isSpecies ? 'Wood Species' : `${spec.label} Colour`}</SectionLabel>
        <ColourSwatchGrid
          colours={colours}
          selected={colour}
          onSelect={setColour}
          showRate={isSpecies}
          columns={isSpecies ? 4 : 5}
        />
        {isSpecies && (
          <div style={{ marginTop: 14 }}>
            <InfoNotice>
              Solid wood is a natural material — grain pattern and exact shade vary piece to piece
              and can&apos;t be guaranteed to match a sample.
            </InfoNotice>
          </div>
        )}
      </Card>

      {/* Edge Style — Solid Wood only */}
      {isSpecies && (
        <Card>
          <SectionLabel>Edge Style</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12 }}>
            {WOOD_EDGE_STYLES.map((e) => (
              <div
                key={e.id}
                onClick={() => setEdgeStyle(e.id)}
                style={{
                  cursor: 'pointer',
                  border: `1.5px solid ${edgeStyle === e.id ? T.brand : T.border}`,
                  background: edgeStyle === e.id ? T.brandTint : T.bg,
                  borderRadius: 12,
                  padding: 8,
                  transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                  boxShadow: edgeStyle === e.id ? `0 0 0 1px ${T.brand}25` : '0 0 0 1px transparent',
                }}
              >
                {e.image && (
                  <img
                    src={e.image}
                    alt={e.label}
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
                )}
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'center',
                    color: edgeStyle === e.id ? T.brand : T.text,
                  }}
                >
                  {e.label}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Grommet Hole Cut-out */}
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
              position={position}
              onPositionChange={setPosition}
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

      {/* Assembly */}
      <Card>
        <SectionLabel>Assembly</SectionLabel>
        <CheckOption
          label={
            materialKey === 'solid'
              ? 'Assembly (2 technicians required)'
              : 'Assembly Service (Free Cable Tray Worth $49)'
          }
          price={materialKey === 'solid' ? ASSEMBLY_TWO_PERSON : ASSEMBLY_STANDARD}
          checked={assembly}
          onChange={setAssembly}
        />
      </Card>

      {/* Add-Ons */}
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
            label='Castor Wheels Black/White (6pcs)'
            price={ACCESSORY_CASTOR_6PCS}
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
          {ADDONS_CATALOG.map((a) => (
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

      {/* Estimate */}
      {isPrinting && (
        <div style={{ display: 'none' }}>
          <div ref={printRef}>
            <SpecSheet spec={lshapeSpec} />
          </div>
        </div>
      )}
      <Card style={{ background: T.bgAlt }}>
        <SectionLabel>Your Estimate</SectionLabel>
        <PriceRow label='Frame (3-Leg L-Shape)' value={fmt(LSHAPE_FRAME_PRICE)} muted />
        {materialKey === 'solid' ? (
          <>
            <PriceRow
              label={`L1 area: ${result.a1.toFixed(2)} m²  +  L2 area: ${result.a2.toFixed(2)} m²`}
              value={`${result.area.toFixed(2)} m²`}
              muted
            />
            <PriceRow
              label={`Table top — full area, joined (${result.area.toFixed(2)} m² × $${rate}/m²)`}
              value={fmt(result.topPrice)}
              muted
            />
          </>
        ) : (
          <PriceRow
            label={`Table top — net area (${result.area.toFixed(2)} m² × $${rate}/m²)`}
            value={fmt(result.topPrice)}
            muted
          />
        )}
        <PriceRow label='Delivery' value='Free' muted />
        {assembly && (
          <PriceRow
            label={
              materialKey === 'solid'
                ? 'Assembly (2 technicians)'
                : 'Assembly Service (incl. free cable tray)'
            }
            value={fmt(assemblyFee)}
            muted
          />
        )}
        {holeType !== 'None' && (
          <PriceRow
            label={`Grommet hole cut-out (${holeType === 'Circle' ? '6cm circle' : `${grommetSize} rect`}, ${position})`}
            value='Free'
            muted
          />
        )}
        {grommetAddon && holeType !== 'None' && (
          <PriceRow
            label={quantityLabel(`Grommet cap (${grommetColour})`, grommetAddon)}
            value={fmt(result.grommetCost)}
            muted
          />
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
          <PriceRow label={quantityLabel('Castor Wheels (6pcs)', castors)} value={fmt(ACCESSORY_CASTOR_6PCS * quantity(castors))} muted />
        )}
        {riserSmall && (
          <PriceRow label={quantityLabel('Desk Top Riser (800mm)', riserSmall)} value={fmt(ACCESSORY_RISER_SMALL * quantity(riserSmall))} muted />
        )}
        {riserLarge && (
          <PriceRow label={quantityLabel('Desk Top Riser (1000mm)', riserLarge)} value={fmt(ACCESSORY_RISER_LARGE * quantity(riserLarge))} muted />
        )}
        {ADDONS_CATALOG.filter((a) => quantity(addons[a.id])).map((a) => ({ ...a, qty: quantity(addons[a.id]) })).map((a) => (
          <PriceRow key={a.id} label={quantityLabel(a.label, a.qty)} value={fmt(a.price * a.qty)} muted />
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.brand }}>Total</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: T.brand }}>{fmt(result.total)}</span>
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
            Click the button, then choose &ldquo;Save as PDF&rdquo; or select a printer. Send the
            PDF or a printed copy to the BuildYourDesks team.
          </div>
        </div>
        <button
          onClick={() => setIsPrinting(true)}
          style={{
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
          }}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  )
}
