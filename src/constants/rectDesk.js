// Material categories for Build Your Desks™ (Rectangular).
// Mirrors LSHAPE_MATERIALS so both calculators share the same tab pattern.
export const RECT_MATERIALS = {
  mdf: {
    label: 'MDF',
    tag: 'Standard',
    rateType: 'flat',
  },
  solid: {
    label: 'Solid Wood',
    tag: 'Side-Joint Construction',
    rateType: 'species',
  },
}

export const RECT_FRAMES = {
  single: { name: 'Build Your Desks\u2122 Lite', price: 279, maxLen: 160 },
  dual: { name: 'Build Your Desks\u2122 Pro', price: 379, maxLen: 180 },
}

// Frame colour — no price impact (#20)
export const FRAME_COLOURS = ['Black', 'White']

export const FLAT_TIER_PRICE = 349

export const RECT_MIN_LEN = 90
export const RECT_DEPTH_MIN = 60
export const RECT_DEPTH_MAX = 80

// 🔴 CHANGE BELOW — FINAL MFC COLOUR LIST (10 colours)
export const MFC_COLOURS = [
  { id: 'wk301', name: 'Pearl White', hex: '#F4F1EA', image: 'images/swatches/mfc-wk301.jpg' },
  { id: 'wk306', name: 'Nordic Maple', hex: '#C9A874', image: 'images/swatches/mfc-wk306.jpg' },
  { id: 'wk310', name: 'Honey Oak', hex: '#C9943A', image: 'images/swatches/mfc-wk310.jpg' },
  { id: 'wk313', name: 'Golden Walnut', hex: '#8B6340', image: 'images/swatches/mfc-wk313.jpg' },
  { id: 'wk303', name: 'Stone Grey', hex: '#B0ACA6', image: 'images/swatches/mfc-wk303.jpg' },
  { id: 'wk305', name: 'Graphite Grey', hex: '#585450', image: 'images/swatches/mfc-wk305.jpg' },
  { id: 'wk319', name: 'Cocoa Walnut', hex: '#7A5840', image: 'images/swatches/mfc-wk319.jpg' },
  { id: 'wk323', name: 'Mocha Walnut', hex: '#6B4A32', image: 'images/swatches/mfc-wk323.jpg' },
  { id: 'wk317', name: 'Espresso Walnut', hex: '#4A3020', image: 'images/swatches/mfc-wk317.jpg' },
  { id: 'wk318', name: 'Midnight Ebony', hex: '#2A2420', image: 'images/swatches/mfc-wk318.jpg' },
]

// 🔴 CHANGE BELOW — FINAL MDF COLOUR LIST (10 colours)
export const MDF_COLOURS = [
  {
    id: 'pearl-white',
    name: 'Pearl White',
    hex: '#F4F1EA',
    image: 'images/swatches/mdf-pearl-white.jpg',
  },
  {
    id: 'white-oak',
    name: 'White Oak',
    hex: '#E3D5BD',
    image: 'images/swatches/mdf-white-oak.jpg',
  },
  { id: 'pear-hue', name: 'Pear Hue', hex: '#D9C49A', image: 'images/swatches/mdf-pear-hue.jpg' },
  {
    id: 'natural-oak',
    name: 'Natural Oak',
    hex: '#C7A874',
    image: 'images/swatches/mdf-natural-oak.jpg',
  },
  { id: 'ash-grey', name: 'Ash Grey', hex: '#A8A099', image: 'images/swatches/mdf-ash-grey.jpg' },
  {
    id: 'amber-cherry',
    name: 'Amber Cherry',
    hex: '#7A3020',
    image: 'images/swatches/mdf-amber-cherry.jpg',
  },
  {
    id: 'light-walnut',
    name: 'Light Walnut',
    hex: '#9A7050',
    image: 'images/swatches/mdf-light-walnut.jpg',
  },
  {
    id: 'dark-walnut',
    name: 'Dark Walnut',
    hex: '#4A3020',
    image: 'images/swatches/mdf-dark-walnut.jpg',
  },
  {
    id: 'carbon-black',
    name: 'Carbon Black',
    hex: '#2A2422',
    image: 'images/swatches/mdf-carbon-black.jpg',
  },
  {
    id: 'black-oak',
    name: 'Black Oak',
    hex: '#2A2820',
    image: 'images/swatches/mdf-black-oak.jpg',
  },
]

// Custom Desk (rectangular / MDF) edge styles — text only
export const MDF_EDGES = [
  { id: 'ergo-slope', label: 'Waterfall\u2122 Edge', image: 'images/edges/waterfall-edge.png' },
  { id: 'ergo-curve', label: 'Waterfall\u2122 Curve', image: 'images/edges/waterfall-curve.png' },
]

// Solid-wood (L-Shape) edge styles — 6 photo styles
export const WOOD_EDGE_STYLES = [
  { id: 'style-01', label: 'Style 01', image: 'images/edges/style-01.png' },
  { id: 'style-02', label: 'Style 02', image: 'images/edges/style-02.png' },
  { id: 'style-03', label: 'Style 03', image: 'images/edges/style-03.png' },
  { id: 'style-04', label: 'Style 04', image: 'images/edges/style-04.png' },
  { id: 'style-05', label: 'Style 05', image: 'images/edges/style-05.png' },
  { id: 'style-06', label: 'Style 06', image: 'images/edges/style-06.png' },
]

// Grommet — Rectangular (#10: flat $19.90, except 20cm black at $9.90)
export const GROMMET_RECT_SIZES = ['9cm', '13cm', '20cm', '30cm']
export const GROMMET_RECT_POSITIONS = ['Left', 'Centre', 'Right']
export const GROMMET_RECT_COLOURS = ['Black', 'Other']
export const GROMMET_RECT_BASE_PRICE = 19.9
export const GROMMET_RECT_20CM_PRICE = 9.9

export function grommetRectPrice(size) {
  return size === '20cm' ? GROMMET_RECT_20CM_PRICE : GROMMET_RECT_BASE_PRICE
}

// Grommet — Round / Circle (60mm = 6cm diameter) — #8: flat $9.90
export const GROMMET_ROUND_POSITIONS = ['Left', 'Centre', 'Right']
export const GROMMET_ROUND_COLOURS = ['Black', 'Other']
export const GROMMET_ROUND_BLACK_PRICE = 9.9
export const GROMMET_ROUND_OTHER_PRICE = 9.9

export function grommetRoundPrice(colour) {
  return colour === 'Black' ? GROMMET_ROUND_BLACK_PRICE : GROMMET_ROUND_OTHER_PRICE
}

// Grommet hole cut-out (free) + optional grommet cap add-on
// Square removed per #11.
export const GROMMET_HOLE_TYPES = ['None', 'Circle', 'Rectangular']
export const GROMMET_COLOURS = ['Black', 'Other']
export const GROMMET_POSITION_NOTE =
  "Left/Right positions sit 25cm in from the table top's width edge (standard offset)."

// Price for the physical grommet cap add-on (hole cut-out is always free)
export function grommetAddonPrice(holeType, size, colour) {
  if (holeType === 'Circle') return grommetRoundPrice(colour)
  return grommetRectPrice(size)
}
