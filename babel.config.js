module.exports = {
  presets:[
    "@babel/env"
  ],
  plugins: [
    ["transform-react-jsx", { pragma: "createElement" }]
  ]
}
