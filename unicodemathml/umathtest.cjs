const md = require('markdown-it')().set({html: true})
const unicodemathml = require('unicodemathml')

// Convert math zones given by $UnicodeMath$ into MathML for markdown-it
function pushAttr(token, mml, i) {
    // Push MathML token attributes
    let j = i                               // Get attribute name
    for (; j < mml.length && /[a-z]/.test(mml[j]); j++)
        ;
    if (j == i || mml[j] != '=' || mml[j + 1] != '"') // No attribute name/value
        return -1
    j += 2
    let k = j
    for (; k < mml.length && mml[k] != '"'; k++)
        ;
    //console.log('attr: ' + mml.substring(i, j - 2) + ', value: ' + mml.substring(j, k))
    token.attrs.push([mml.substring(i, j - 2), mml.substring(j, k)])
    return k + 1
}

function pushToken(state, mml, i) {
    // Push MathML tokens
    let nesting = 1                         // Default: open tag

    if (mml[i] == '/') {
        nesting = -1                        // Close tag
        i++
    }
    let j = i                               // Get tag name
    for ( ; j < mml.length && /[a-z]/.test(mml[j]); j++)
        ;

    if (j == i)                             // No tag name
        return -1

    let tag = mml.substring(i, j)
    if (nesting == 1) {
        const token = state.push(tag + '_open', tag, 1)
        for (i = j; i < mml.length; i++) {
            if (/[a-z]/.test(mml[i])) {     // Attribute
                if (!token.attrs)
                    token.attrs = []
                i = pushAttr(token, mml, i)
                if (i == -1)
                    break
            } else if (mml[i] == '/') {
                token.nesting = 0           // Self closing tag
            } else if (mml[i] == '>') {
                return i + 1                // End of tag
            }
        }
    } else {
        const token = state.push(tag + '_close', tag, -1)
    }

    for (i = j; i < mml.length; i++) {
        if (mml[i] == '>') {
            //console.log((type == 1 ? "open" : "close") + " tag: " + tag)
            return i + 1
        }
    }
    return -1
}

function unicodeMath(state, silent) {
    // UnicodeMath plug-in for markdown-it. Similar to markdown-it superscript plug-in
    const max = state.posMax
    let start = state.pos
    //console.log('state.src: ' + state.src + ", start: " + start)

    if (state.src[start] != '⁅') { return false }
    if (silent) { return false } // don't run any pairs in validation mode
    if (start + 2 >= max) { return false }

    let display = false
    if (!start || state.src[start - 1] == '\n') {
        display = true
        state.md.inline.skipToken(state)
    }

    state.pos = start + 1
    let found = false

    while (state.pos < max) {
        if (state.src[state.pos] == '⁆') {
            found = true
            break
        }
        state.md.inline.skipToken(state)
    }
    if (!found || start + 1 === state.pos) {
        state.pos = start
        return false
    }

    // found!
    const content = state.src.slice(start + 1, state.pos)
    let config = display ? { displaystyle: true } : null
    const mml = unicodemathml.convertUnicodeMathToMathML(content, config)
    console.log("um: " + content)
    console.log("mml: " + mml)

    state.posMax = state.pos
    state.pos = start + 1

    let j = 0

    // Convert mml into markdown-it tokens
    for (let i = 0; i < mml.length; ) {
        if (mml[i] == '<') {
            if (i > j) {
                const token_t = state.push('text', '', 0)
                token_t.content = mml.substring(j, i)
                //console.log("text: " + token_t.content)
            }
            i = pushToken(state, mml, i + 1)
            if (i == -1)
                return                      // Error
            j = i
        } else {
            i++
        }
    }
    state.pos = state.posMax + 1
    state.posMax = max
    return true
}
function isTerminatorChar(ch) {
    // Include UnicodeMath math-zone delimiters ⁅ ⁆ in md terminator list
    return '#\n$%&*+-:<=>!@[\\]^_`{}~⁅⁆'.includes(ch)
}
function ruleText(state, silent) {
    let pos = state.pos;
    while (pos < state.posMax && !isTerminatorChar(state.src[pos])) {
        pos++;
    }
    if (pos === state.pos) {
        return false;
    }
    if (!silent) {
        state.pending += state.src.slice(state.pos, pos);
    }
    state.pos = pos;
    return true;
}

md.inline.ruler.after('emphasis', '', unicodeMath)
md.inline.ruler.at('text', ruleText)

const input = 'This ⁅a+b⁆ that \n⁅∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)⁆ other'

console.log('md: ' + input)
var result = md.render(input)
console.log('html: ' + result)

const expect = `<p>This <math><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></math> that\n<math display="block"><mrow intent=":nary(0,$h,$naryand)"><msubsup><mo>∫</mo><mn>0</mn><mrow arg="h"><mn>2</mn><mi>𝜋</mi></mrow></msubsup><mfrac arg="naryand"><mrow><mi intent="ⅆ">𝑑</mi><mi>𝜃</mi></mrow><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi><mrow intent=":function"><mi>sin</mi><mo>⁡</mo><mi>𝜃</mi></mrow></mrow></mfrac></mrow><mo>=</mo><mfrac><mn>1</mn><msqrt><msup><mi>𝑎</mi><mn>2</mn></msup><mo>−</mo><msup><mi>𝑏</mi><mn>2</mn></msup></msqrt></mfrac></math> other</p>\n`
if (result == expect)
    console.log("Succeeded")
else
    console.log('Failed')
