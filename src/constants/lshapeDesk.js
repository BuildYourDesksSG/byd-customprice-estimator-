import { TOP_RATE } from './assembly'
export const LSHAPE_FRAME_PRICE = 599
export const LSHAPE_L1_MIN = 120
export const LSHAPE_L2_MIN = 90
export const LSHAPE_L2_MAX = 120
export const LSHAPE_WIDTH_MIN = 30
export const LSHAPE_WIDTH_MAX = 80
export const LSHAPE_MATERIALS = {
  mfc: {
    label: 'MFC',
    tag: 'Standard',
    l1max: 180,
    l2max: 120,
    rateType: 'flat',
    rate: TOP_RATE,
    cableNote: 'Rectangular or square grommet holes only — no concave slot.',
  },
  solid: {
    label: 'Solid Wood',
    tag: 'Side-Joint Construction',
    l1max: 180,
    l2max: 120,
    rateType: 'species',
    cableNote: 'Any cable routing style — concave, grommet, T-slot, or round hole.',
  },
}
// 🔴 CHANGE BELOW — MFC COLOURS FOR L-SHAPE
export const LSHAPE_MFC_COLOURS = [
  { id: 'wk301', name: 'Pearl White', hex: '#F4F1EA', image: 'images/swatches/mfc-wk301.jpg' },
  { id: 'wk307', name: 'Sand Maple', hex: '#E8DEC8', image: 'images/swatches/mfc-wk307.png' },
  { id: 'wk310', name: 'Honey Oak', hex: '#C9943A', image: 'images/swatches/mfc-wk310.jpg' },
  { id: 'wk313', name: 'Golden Walnut', hex: '#8B6340', image: 'images/swatches/mfc-wk313.jpg' },
  { id: 'wk303', name: 'Stone Grey', hex: '#B0ACA6', image: 'images/swatches/mfc-wk303.jpg' },
  { id: 'wk305', name: 'Graphite Grey', hex: '#585450', image: 'images/swatches/mfc-wk305.jpg' },
  { id: 'wk314', name: 'Hazel Cherry', hex: '#9A7A5A', image: 'images/swatches/mfc-wk314.png' },
  { id: 'wk323', name: 'Mocha Walnut', hex: '#6B4A32', image: 'images/swatches/mfc-wk323.jpg' },
  { id: 'wk317', name: 'Espresso Walnut', hex: '#4A3020', image: 'images/swatches/mfc-wk317.jpg' },
  { id: 'wk318', name: 'Midnight Ebony', hex: '#2A2420', image: 'images/swatches/mfc-wk318.jpg' },
]
// 🔴 CHANGE BELOW — SOLID WOOD SPECIES & RATES
export const SOLID_WOOD_SPECIES = [
  { id: 'beech', name: 'European Beech', rate: 275, hex: '#D9B98A', image: 'images/swatches/wood-beech.jpg' },
  { id: 'maple', name: 'Canadian Hard Maple', rate: 450, hex: '#E8D9B5', image: 'images/swatches/wood-maple.jpg' },
  { id: 'ash', name: 'American Ash Wood', rate: 430, hex: '#C9B896', image: 'images/swatches/wood-ash.jpg' },
  { id: 'whiteoak', name: 'American White Oak', rate: 470, hex: '#D9C7A3', image: 'images/swatches/wood-white-oak.jpg' },
  { id: 'redoak', name: 'American Red Oak', rate: 310, hex: '#C8975A', image: 'images/swatches/wood-red-oak.jpg' },
  { id: 'cherry', name: 'American Cherry Wood', rate: 400, hex: '#8B4A35', image: 'images/swatches/wood-cherry.jpg' },
  { id: 'walnut', name: 'American Black Walnut', rate: 650, hex: '#3D2B1F', image: 'images/swatches/wood-walnut.jpg' },
  { id: 'smokedoak', name: 'Smoked Red Oak', rate: 375, hex: '#5A4030', image: 'images/swatches/wood-smoked-red-oak.jpg' },
]
export const SOLID_WOOD_EDGE_STYLES = ['01', '03', '04', '05', '06']
export const CABLE_ROUTING_OPTIONS = {
  mfc: ['Grommet — Rectangular'],
  solid: ['Concave Slot', 'Grommet — Rectangular', 'T-Slot', 'Round Hole'],
}
export const CABLE_POSITIONS = ['Left', 'Middle', 'Right']
export const CABLE_POSITION_NOTE =
  "Left/Right positions sit 25cm in from the table top's width edge (standard offset)."
export const L2_ORIENTATIONS = ['Left', 'Right']
