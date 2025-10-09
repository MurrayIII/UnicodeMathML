const md = require('markdown-it')().set({html: true})
const unicodemathml = require('unicodemathml')

md.inline.ruler.after('emphasis', '', unicodemathml.unicodeMathToMd)
md.inline.ruler.at('text', unicodemathml.ruleText)

const input = 'This ⁅a+b⁆ that \n⁅∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)⁆ other'

console.log('md: ' + input)
var result = md.render(input)
console.log('html: ' + result)

const expect = `<p>This <math><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></math> that\n<math display="block"><mrow intent=":nary(0,$h,$naryand)"><msubsup><mo>∫</mo><mn>0</mn><mrow arg="h"><mn>2</mn><mi>𝜋</mi></mrow></msubsup><mfrac arg="naryand"><mrow><mi intent="ⅆ">𝑑</mi><mi>𝜃</mi></mrow><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi><mrow intent=":function"><mi>sin</mi><mo>⁡</mo><mi>𝜃</mi></mrow></mrow></mfrac></mrow><mo>=</mo><mfrac><mn>1</mn><msqrt><msup><mi>𝑎</mi><mn>2</mn></msup><mo>−</mo><msup><mi>𝑏</mi><mn>2</mn></msup></msqrt></mfrac></math> other</p>\n`
if (result == expect)
    console.log("Succeeded")
else
    console.log('Failed')
