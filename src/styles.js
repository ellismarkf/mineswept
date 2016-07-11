export const tileStyle = {
  display: `block`,
  width: `${20}px`,
  height: `${20}px`,
  float: 'left',
  boxSizing: `border-box`,
  border: `${1}px solid #BBB`,
  backgroundColor: `#EEE`,
  textAlign: `center`,
  verticalAlign: `middle`
}

export const sweptTileStyle = Object.assign({}, tileStyle, {
  backgroundColor: `#CCC`
})

export const hasMineStyle = Object.assign({}, tileStyle, {
  backgroundColor: `red`
})