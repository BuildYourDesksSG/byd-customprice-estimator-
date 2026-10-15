import { T } from '../constants/tokens'
import { CONTACT_URL } from '../constants/config'
import { LSHAPE_FRAME_PRICE } from '../constants/lshapeDesk'
import { FLAT_TIER_PRICE } from '../constants/rectDesk'
import { TOP_RATE } from '../constants/assembly'
import {
  ACCESSORY_CABLE_TRAY,
  ACCESSORY_DRAWER,
  ACCESSORY_RETRACT_SOCKET,
  ACCESSORY_SLIDING_SOCKET,
  ACCESSORY_CASTOR_4PCS,
  ACCESSORY_CASTOR_6PCS,
  ACCESSORY_RISER_SMALL,
  ACCESSORY_RISER_LARGE,
} from '../constants/accessories'
import { fmt } from '../utils/helpers'
import PriceRow from './ui/PriceRow'

const PAGE_STYLE =
  '@page { margin: 18mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }'

const section = (bg) => ({
  background: bg,
  padding: '16px 20px',
  borderBottom: `1px solid ${T.border}`,
  fontFamily: T.font,
})

const label = {
  fontSize: 11,
  fontWeight: 600,
  color: T.textMute,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontFamily: T.font,
  marginBottom: 4,
}

const value = {
  fontSize: 14,
  color: T.text,
  fontFamily: T.font,
}

function Row({ l, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={label}>{l}</span>
      <span style={{ ...value, fontWeight: 500 }}>{v}</span>
    </div>
  )
}

function DeskBadge({ children }) {
  return (
    <div
      style={{
        ...section(T.brandTint),
        fontSize: 15,
        fontWeight: 700,
        color: T.brand,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </div>
  )
}

function SectionBlock({ title, children, bg }) {
  return (
    <div style={section(bg || T.bgCard)}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.brandSoft,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10,
          fontFamily: T.font,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function TotalLine({ total }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: `1px solid ${T.brand}25`,
        background: T.bgCard,
        fontFamily: T.font,
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
      <span style={{ fontSize: 28, fontWeight: 700, color: T.brand, letterSpacing: '-0.02em' }}>
        {fmt(total)}
      </span>
    </div>
  )
}

function RectSpec({ spec }) {
  const hasAcc =
    spec.cableTray ||
    spec.drawer ||
    spec.retractSocket ||
    spec.slidingSocket ||
    spec.castors ||
    spec.riserSmall ||
    spec.riserLarge ||
    (spec.selectedAddons && spec.selectedAddons.length > 0)
  return (
    <>
      <SectionBlock title='Dimensions'>
        <Row l='Length' v={`${spec.length} cm`} />
        <Row l='Depth' v={`${spec.depth} cm`} />
      </SectionBlock>
      <SectionBlock title='Configuration'>
        <Row l='Material' v={spec.material === 'solid' ? 'Solid Wood' : spec.material === 'mfc' ? 'MFC' : 'MDF'} />
        {spec.flat ? (
          <Row l='Frame' v='T-03 Mini (flat tier, 80–99 cm)' />
        ) : (
          <Row l='Frame' v={spec.motorLabel} />
        )}
        {spec.frameColour && <Row l='Frame Colour' v={spec.frameColour} />}
        <Row l='Colour' v={spec.colourName} />
        {spec.edgeName && <Row l='Edge Style' v={spec.edgeName} />}
        {spec.holeType !== 'None' && (
          <Row
            l='Grommet Hole'
            v={
              spec.holeType === 'Circle'
                ? `Circle 6cm — ${spec.grommetPosition}`
                : `Rectangular ${spec.grommetSize} — ${spec.grommetPosition}`
            }
          />
        )}
        {spec.grommetAddon && spec.holeType !== 'None' && (
          <Row l='Grommet Cap' v={spec.grommetColour} />
        )}
      </SectionBlock>
      <SectionBlock title='Price Breakdown' bg={T.bgAlt}>
        {spec.flat ? (
          <>
            <PriceRow label='T-03 Mini, complete' value={fmt(FLAT_TIER_PRICE)} muted />
            <PriceRow label='Delivery' value='Free' muted />
          </>
        ) : (
          <>
            <PriceRow label={`Frame (${spec.motorLabel})`} value={fmt(spec.framePrice)} muted />
            <PriceRow
              label={`Table top (${spec.area.toFixed(2)} m² × $${TOP_RATE}/m²)`}
              value={fmt(spec.topPrice)}
              muted
            />
            <PriceRow label='Delivery' value='Free' muted />
          </>
        )}
        {spec.assembly && <PriceRow label='Assembly' value={fmt(spec.assemblyFee)} muted />}
        {spec.holeType !== 'None' && <PriceRow label='Grommet hole cut-out' value='Free' muted />}
        {spec.grommetAddon && spec.holeType !== 'None' && (
          <PriceRow label='Grommet cap' value={fmt(spec.grommetCost)} muted />
        )}
        {spec.cableTray && <PriceRow label='Cable Tray' value={fmt(ACCESSORY_CABLE_TRAY)} muted />}
        {spec.drawer && <PriceRow label='Slim Drawer' value={fmt(ACCESSORY_DRAWER)} muted />}
        {spec.retractSocket && (
          <PriceRow label='Retractable Socket' value={fmt(ACCESSORY_RETRACT_SOCKET)} muted />
        )}
        {spec.slidingSocket && (
          <PriceRow label='Sliding Socket' value={fmt(ACCESSORY_SLIDING_SOCKET)} muted />
        )}
        {spec.castors && (
          <PriceRow label='Castor Wheels (4pcs)' value={fmt(ACCESSORY_CASTOR_4PCS)} muted />
        )}
        {spec.riserSmall && (
          <PriceRow label='Desk Top Riser (600mm)' value={fmt(ACCESSORY_RISER_SMALL)} muted />
        )}
        {spec.riserLarge && (
          <PriceRow label='Desk Top Riser (1000mm)' value={fmt(ACCESSORY_RISER_LARGE)} muted />
        )}
        {(spec.selectedAddons || []).map((a) => (
          <PriceRow key={a.id} label={a.label} value={fmt(a.price)} muted />
        ))}
      </SectionBlock>
      <TotalLine total={spec.total} />
      {hasAcc && (
        <SectionBlock title='Accessories Selected'>
          {spec.cableTray && <Row l='Cable Tray' v={fmt(ACCESSORY_CABLE_TRAY)} />}
          {spec.drawer && <Row l='Slim Drawer' v={fmt(ACCESSORY_DRAWER)} />}
          {spec.retractSocket && <Row l='Retractable Socket' v={fmt(ACCESSORY_RETRACT_SOCKET)} />}
          {spec.slidingSocket && <Row l='Sliding Socket' v={fmt(ACCESSORY_SLIDING_SOCKET)} />}
          {spec.castors && <Row l='Castor Wheels (4pcs)' v={fmt(ACCESSORY_CASTOR_4PCS)} />}
          {spec.riserSmall && <Row l='Desk Top Riser (600mm)' v={fmt(ACCESSORY_RISER_SMALL)} />}
          {spec.riserLarge && <Row l='Desk Top Riser (1000mm)' v={fmt(ACCESSORY_RISER_LARGE)} />}
          {(spec.selectedAddons || []).map((a) => (
            <Row key={a.id} l={a.label} v={fmt(a.price)} />
          ))}
        </SectionBlock>
      )}
    </>
  )
}

function LShapeSpec({ spec }) {
  const hasAcc =
    spec.cableTray ||
    spec.drawer ||
    spec.retractSocket ||
    spec.slidingSocket ||
    spec.castors ||
    spec.riserSmall ||
    spec.riserLarge ||
    (spec.selectedAddons && spec.selectedAddons.length > 0)
  return (
    <>
      <SectionBlock title='Dimensions'>
        <Row l='L1 (Main) — Length' v={`${spec.l1} cm`} />
        <Row l='L1 (Main) — Width' v={`${spec.w1} cm`} />
        <Row l='L2 (Return) — Length' v={`${spec.l2} cm`} />
        <Row l='L2 (Return) — Width' v={`${spec.w2} cm`} />
        <Row l='L2 Orientation' v={spec.orientation} />
      </SectionBlock>
      <SectionBlock title='Configuration'>
        <Row l='Material' v={spec.materialLabel} />
        <Row
          l={spec.materialKey === 'solid' ? 'Wood Species' : 'Colour'}
          v={spec.speciesOrColourName}
        />
        {spec.edgeStyle && <Row l='Edge Style' v={spec.edgeStyle} />}
        <Row l='Rate' v={`$${spec.rate}/m²`} />
        {spec.holeType && spec.holeType !== 'None' && (
          <Row
            l='Grommet Hole'
            v={
              spec.holeType === 'Circle'
                ? `Circle 6cm — ${spec.position}`
                : `Rectangular ${spec.grommet?.size} — ${spec.position}`
            }
          />
        )}
        {spec.grommet?.addon && <Row l='Grommet Cap Colour' v={spec.grommet.colour} />}
      </SectionBlock>
      <SectionBlock title='Price Breakdown' bg={T.bgAlt}>
        <PriceRow label='Frame (3-Leg L-Shape)' value={fmt(LSHAPE_FRAME_PRICE)} muted />
        {spec.materialKey === 'solid' ? (
          <>
            <PriceRow
              label={`L1 area: ${spec.a1.toFixed(2)} m²  +  L2 area: ${spec.a2.toFixed(2)} m²`}
              value={`${spec.area.toFixed(2)} m²`}
              muted
            />
            <PriceRow
              label={`Table top — full area, joined (${spec.area.toFixed(2)} m² × $${spec.rate}/m²)`}
              value={fmt(spec.topPrice)}
              muted
            />
          </>
        ) : (
          <PriceRow
            label={`Table top — net area (${spec.area.toFixed(2)} m² × $${spec.rate}/m²)`}
            value={fmt(spec.topPrice)}
            muted
          />
        )}
        <PriceRow label='Delivery' value='Free' muted />
        {spec.assembly && <PriceRow label='Assembly' value={fmt(spec.assemblyFee)} muted />}
        {spec.holeType && spec.holeType !== 'None' && (
          <PriceRow label='Grommet hole cut-out' value='Free' muted />
        )}
        {spec.grommet?.addon && (
          <PriceRow
            label={`Grommet cap (${spec.grommet.colour})`}
            value={fmt(spec.grommetCost)}
            muted
          />
        )}
        {spec.cableTray && <PriceRow label='Cable Tray' value={fmt(ACCESSORY_CABLE_TRAY)} muted />}
        {spec.drawer && <PriceRow label='Slim Drawer' value={fmt(ACCESSORY_DRAWER)} muted />}
        {spec.retractSocket && (
          <PriceRow label='Retractable Socket' value={fmt(ACCESSORY_RETRACT_SOCKET)} muted />
        )}
        {spec.slidingSocket && (
          <PriceRow label='Sliding Socket' value={fmt(ACCESSORY_SLIDING_SOCKET)} muted />
        )}
        {spec.castors && (
          <PriceRow label='Castor Wheels (6pcs)' value={fmt(ACCESSORY_CASTOR_6PCS)} muted />
        )}
        {spec.riserSmall && (
          <PriceRow label='Desk Top Riser (600mm)' value={fmt(ACCESSORY_RISER_SMALL)} muted />
        )}
        {spec.riserLarge && (
          <PriceRow label='Desk Top Riser (1000mm)' value={fmt(ACCESSORY_RISER_LARGE)} muted />
        )}
        {(spec.selectedAddons || []).map((a) => (
          <PriceRow key={a.id} label={a.label} value={fmt(a.price)} muted />
        ))}
      </SectionBlock>
      <TotalLine total={spec.total} />
      {hasAcc && (
        <SectionBlock title='Accessories Selected'>
          {spec.cableTray && <Row l='Cable Tray' v={fmt(ACCESSORY_CABLE_TRAY)} />}
          {spec.drawer && <Row l='Slim Drawer' v={fmt(ACCESSORY_DRAWER)} />}
          {spec.retractSocket && <Row l='Retractable Socket' v={fmt(ACCESSORY_RETRACT_SOCKET)} />}
          {spec.slidingSocket && <Row l='Sliding Socket' v={fmt(ACCESSORY_SLIDING_SOCKET)} />}
          {spec.castors && <Row l='Castor Wheels (6pcs)' v={fmt(ACCESSORY_CASTOR_6PCS)} />}
          {spec.riserSmall && <Row l='Desk Top Riser (600mm)' v={fmt(ACCESSORY_RISER_SMALL)} />}
          {spec.riserLarge && <Row l='Desk Top Riser (1000mm)' v={fmt(ACCESSORY_RISER_LARGE)} />}
          {(spec.selectedAddons || []).map((a) => (
            <Row key={a.id} l={a.label} v={fmt(a.price)} />
          ))}
        </SectionBlock>
      )}
    </>
  )
}

function UniSpec({ spec }) {
  return (
    <>
      <SectionBlock title='Specification'>
        <Row l='Size' v={spec.size} />
        <Row l='Leg Colour' v={spec.legColour} />
        <Row l='Lead Time' v='4–6 weeks' />
      </SectionBlock>
      <TotalLine total={spec.price} />
    </>
  )
}

const DESK_LABELS = {
  rect: 'Rectangular Standing Desk',
  lshape: 'L-Shape Standing Desk',
  uni: 'UniDesk — Fixed Size',
}

function deskLabel(spec) {
  if (spec.type === 'lshape') return `L-Shape Standing Desk — ${spec.materialLabel}`
  return DESK_LABELS[spec.type] ?? spec.type
}

export default function SpecSheet({ spec }) {
  const today = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 700,
        background: T.bgCard,
        fontFamily: T.font,
        border: `1px solid ${T.border}`,
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: T.bgDark,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src='images/Design-Your-Desk3-1-300x300.png'
            alt='Build Your Desks'
            style={{
              width: 48,
              height: 48,
              objectFit: 'contain',
              display: 'block',
              filter: 'brightness(0) invert(1)',
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: T.textOnDark,
                fontFamily: T.font,
                letterSpacing: '-0.01em',
              }}
            >
              Build Your Desks
            </div>
            <div
              style={{
                fontSize: 12,
                color: `${T.textOnDark}99`,
                fontFamily: T.font,
                marginTop: 2,
              }}
            >
              buildyourdesks.com
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.textOnDark,
              fontFamily: T.font,
              letterSpacing: '0.02em',
            }}
          >
            Price Estimate
          </div>
          <div
            style={{
              fontSize: 11,
              color: `${T.textOnDark}80`,
              fontFamily: T.font,
              marginTop: 3,
            }}
          >
            {today}
          </div>
        </div>
      </div>

      {/* Desk type badge */}
      <DeskBadge>{deskLabel(spec)}</DeskBadge>

      {/* Content */}
      {spec.type === 'rect' && <RectSpec spec={spec} />}
      {spec.type === 'lshape' && <LShapeSpec spec={spec} />}
      {spec.type === 'uni' && <UniSpec spec={spec} />}

      {/* Next Steps */}
      <div
        style={{
          padding: '16px 20px',
          background: T.brandTint,
          borderTop: `1px solid ${T.brand}25`,
          fontFamily: T.font,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.brandSoft,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Next Steps
        </div>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>
          Send this printed estimate to the BuildYourDesks team to start your order:{' '}
          <a href={CONTACT_URL} style={{ color: T.brand, fontFamily: T.font, fontWeight: 500 }}>
            {CONTACT_URL}
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 20px',
          background: T.bg,
          fontFamily: T.font,
          fontSize: 11,
          color: T.textMute,
          fontStyle: 'italic',
          borderTop: `1px solid ${T.border}`,
        }}
      >
        Prices are estimates and subject to final confirmation.
      </div>
    </div>
  )
}

export { PAGE_STYLE }
