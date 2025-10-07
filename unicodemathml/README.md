# UnicodeMathML

This package converts UnicodeMath to MathML. [UnicodeMath](https://www.unicode.org/notes/tn28/UTN28-PlainTextMath-v3.3.pdf)
is a linear representation of math that often resembles math notation and is easy
to enter. It works well in Microsoft desktop apps such as Word, PowerPoint, Outlook,
and OneNote but it hasn't been widely available elsewhere. For demos and discussion,
see [UnicodeMathML](https://murrayiii.github.io/UnicodeMathML/playground/).

unicodemathml.js contains four exported functions:

- convertUnicodeMathToMathML(uMath, config) converts the UnicodeMath string uMath to MathML and returns the MathML produced.
- convertUnicodeMathZonesToMathML(text, config) converts UnicodeMath zones embedded in text to MathML and returns the modified text.
- unicodeMathToMd(state, silent) is a markdown-it plug-in callback that converts UnicodeMath math zones into markdown-it tokens.
- ruleText(state, silent) is a markdown-it plug-in callback that adds support for the UnicodeMath math-zone delimiters ⁅ ⁆

A sample calling program is
```javascript
const unicodemathml = require('unicodemathml')
const text = `Given a function ⁅f⁆ of a real variable ⁅x⁆ and an interval ⁅[a, b]⁆ of the real line, the **definite integral**

⁅∫_a^b f(x) ⅆx⁆

can be interpreted informally as the signed area of the region in the ⁅xy⁆-plane that is bounded by the graph of ⁅f⁆, the ⁅x⁆-axis and the vertical lines ⁅x = a⁆ and ⁅x = b⁆.`

let result = unicodemathml.convertUnicodeMathZonesToMathML(text)
console.log(result)
```
The console logs this as
```html
Given a function <math><mi>𝑓</mi></math> of a real variable <math><mi>𝑥</mi></math> and an interval
<math><mrow intent=":fenced"><mo>[</mo><mrow><mi>𝑎</mi><mo>,</mo><mi>𝑏</mi></mrow><mo>]</mo></mrow></math>
of the real line, the **definite integral**

<math display="block"><mrow intent=":nary(𝑎,𝑏,$naryand)"><msubsup><mo>∫</mo><mi>𝑎</mi><mi>𝑏</mi></msubsup>
<mrow arg="naryand"><mi>𝑓</mi><mrow intent=":fenced"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow><mi intent="ⅆ">𝑑</mi><mi>𝑥</mi></mrow></mrow></math>

can be interpreted informally as the signed area of the region in the <math><mi>𝑥</mi><mi>𝑦</mi></math>-plane
that is bounded by the graph of <math><mi>𝑓</mi></math>, the <math><mi>𝑥</mi></math>-axis and the vertical
lines <math><mi>𝑥</mi><mo>=</mo><mi>𝑎</mi></math> and <math><mi>𝑥</mi><mo>=</mo><mi>𝑏</mi></math>.
```
A sample configuration file for [eleventy](https://www.11ty.dev/) compiling markdown files with embedded UnicodeMath math zones is
```javascript
/* eleventy.config.cjs */
const md = require("markdown-it")().set({ html: true })
const unicodemathml = require("unicodemathml")

md.inline.ruler.at('text', unicodemathml.ruleText)
md.inline.ruler.after('emphasis', '', unicodemathml.unicodeMathToMd)

module.exports = async function (eleventyConfig) {
  eleventyConfig.setLibrary(
    "md", 
    md
  );
}
```
