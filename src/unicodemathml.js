var autoBuildUp = false                     // (could be a unicodemathml() arg)
var ksi = false
var testing
var selanchor
var selfocus
var useMfenced = 0                          // Generate recommended MathML
var emitDefaultIntents =
    typeof ummlConfig === "undefined" ||
    typeof ummlConfig.defaultIntents === "undefined" ||
    ummlConfig.defaultIntents;

function escapeHTMLSpecialChars(str) {
    const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }

    return str.replace(/[&<>]/g, tag => {
        return replacements[tag] || tag;
    });
}

const digitSuperscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const digitSubscripts = "₀₁₂₃₄₅₆₇₈₉";

const overBrackets = '\u23B4\u23DC\u23DE\u23E0¯';
const underBrackets = '\u23B5\u23DD\u23DF\u23E1';

const argCounts = {
    'msup': 2, 'msub': 2, 'msubsup': 3, 'munder': 2, 'mover': 2, 'munderover': 3,
    'mfrac': 2, 'msqrt': 1, 'mroot': 2
}

const unicodeFractions = {
    "½": [1, 2], "⅓": [1, 3], "⅔": [2, 3], "¼": [1, 4], "¾": [3, 4], "⅕": [1, 5],
    "⅖": [2, 5], "⅗": [3, 5], "⅘": [4, 5], "⅙": [1, 6], "⅚": [5, 6], "⅐": [1, 7],
    "⅛": [1, 8], "⅜": [3, 8], "⅝": [5, 8], "⅞": [7, 8], "⅑": [1, 9], "↉": [0, 3],
    "⅒": [1, 10]
};

const mappedSingle = { "-": "\u2212", "\'": "\u2032" }

const mappedPair = {
    "+-": "\u00B1", "<=": "\u2264", ">=": "\u2265", "~=": "\u2245",
    "~~": "\u2248", "::": "\u2237", ":=": "\u2254", "<<": "\u226A",
    ">>": "\u226B", "−>": "\u2192", "−+": "\u2213", "!!": "\u203C",
    "...": "…", '≯=': '≱', '≮=': '≰', '⊀=': '⪱', '⊁=': '⪲',
    '⊄=': '⊈', '⊅=': '⊉', '+−': '±', '−+': '∓',
}

function getSubSupDigits(str, i, delim) {
    // Return e.g., '²' for '^2 ' (str[i-1] = '^', str[i] = '2', delim = ' ')
    if (!'+-=/ )]}'.includes(delim))
        return ''
    let j
    for (j = i; j > 0 && isAsciiDigit(str[j]); j--)
        ;                                   // Find digit span indices
    if (j == i)
        return ''                           // No digits
    let op = str[j]                         // Char preceding digits

    if (!'_^'.includes(op))                 // Digits not preceded by * or _
        return ''

    let n = ''                              // Gets sub/sup number from digits
    let k = j + 1
    for (; k < i + 1; k++)
        n += (op == '^') ? digitSuperscripts[str[k]] : digitSubscripts[str[k]]

    // If the preceding op is the other subsup op, return '', e.g., for a_0^2
    // Code doesn't handle subsups (but could...)
    let opSupSub = (op == '^') ? '_' : '^'
    k = j - 1

    for (; k >= 0; k--) {
        if (str[k] == opSupSub)
            return ''
        if (str[k] < '\u3017' && !isAsciiAlphanumeric(str[k]) && !isDoubleStruck(str[k]))
            break                           // Could allow other letters...
    }
    if (k == j - 1)
        return ''                           // No base character(s)

    return n
}

function getFencedOps(value) {
    let opClose = value.getAttribute('close')
    let opOpen = value.getAttribute('open')
    let opSeparators = value.getAttribute('separators')

    if (!opClose)
        opClose = ')'
    if (!opOpen)
        opOpen = '('
    if (!opSeparators)
        opSeparators = ','
    return [opClose, opOpen, opSeparators]
}

function getUnicodeFraction(chNum, chDenom) {
    if (chNum.length == 1) {
        if (chDenom == '10' && chNum == '1')
            return "⅒";

        if (chDenom.length <= 2) {
            for (const [key, val] of Object.entries(unicodeFractions)) {
                if (chNum == val[0] && chDenom == val[1])
                    return key;             // Unicode fraction char like ½
            }
        }
    }
    let n;
    let result = '';

    for (let i = 0; i < chNum.length; i++, result += digitSuperscripts[n]) {
        n = chNum.codePointAt(i) - 0x30;
        if (n < 0 || n > 9)
            return '';
    }
    result += '\u2044';                     // Fraction slash
    for (let i = 0; i < chDenom.length; i++, result += digitSubscripts[n]) {
        n = chDenom.codePointAt(i) - 0x30;
        if (n < 0 || n > 9)
            return '';
    }
    return result;                          // Unicode fraction string like ¹²/₃₄₅
}

// determine space width attribute values: x/18em
//                    0         1                       2                   3                  4                   5               6                       7                 8       9      10    11    12   13    14     15    16   17     18
const uniSpaces = ['\u200B', '\u200A',            '\u200A\u200A',       '\u2009',          '\u205F',          '\u2005',         '\u2004',              '\u2004\u200A',       '', '\u2002',  '',   '',   '',   '',  '',    '',   '',  '', '\u2003'];
const spaceWidths = ['0', 'veryverythinmathspace', 'verythinmathspace', 'thinmathspace', 'mediummathspace', 'thickmathspace', 'verythickmathspace', 'veryverythickmathspace', null, '0.5em', null, null, null, null, null, null, null, null, '1em'];

const anCodesEng = [
    // 0      1       2       3        4        5       6        7
    'mbf', 'mit', 'mbfit', 'mscr', 'mbfscr', 'mfrak', 'Bbb', 'mbffrak',
    // 8         9          10          11        12
    'msans', 'mbfsans', 'mitsans', 'mbfitsans', 'mtt'];
const anCodesGr = [
    'mbf', 'mit', 'mbfit', 'mbfsans', 'mbfitsans'];
const anCodesDg = [
    'mbf', 'Bbb', 'msans', 'mbfsans', 'mtt'];
const letterLikeSymbols = {
    'ℂ': [6, 'C'], 'ℊ': [3, 'g'], 'ℋ': [3, 'H'], 'ℌ': [5, 'H'], 'ℍ': [6, 'H'], 'ℎ': [1, 'h'],
    'ℐ': [3, 'I'], 'ℑ': [5, 'I'], 'ℒ': [3, 'L'], 'ℕ': [6, 'N'], 'ℙ': [6, 'P'], 'ℚ': [6, 'Q'],
    'ℛ': [3, 'R'], 'ℜ': [5, 'R'], 'ℝ': [6, 'R'], 'ℤ': [6, 'Z'], 'ℨ': [5, 'Z'], 'ℬ': [3, 'B'],
    'ℭ': [5, 'C'], 'ℯ': [3, 'e'], 'ℰ': [3, 'E'], 'ℱ': [3, 'F'], 'ℳ': [3, 'M'], 'ℴ': [3, 'o']
};

const mathvariants = {
    // MathML mathvariant values to TeX unicode-math names in unimath-symbols.pdf
    'normal': 'mup',
    'bold': 'mbf',
    'italic': 'mit',
    'bold-italic': 'mbfit',
    'double-struck': 'Bbb',
    'bold-fraktur': 'mbffrak',
    'script': 'mscr',
    'bold-script': 'mbfscr',
    'fraktur': 'mfrak',
    'sans-serif': 'msans',
    'bold-sans-serif': 'mbfsans',
    'sans-serif-italic': 'mitsans',
    'sans-serif-bold-italic': 'mbfitsans',
    'monospace': 'mtt',
};

const matrixIntents = {
    '⒨': ':parenthesized-matrix',
    '⒱': ':determinant',
    '⒩': ':normed-matrix',
    'ⓢ': ':bracketed-matrix',
    'Ⓢ': ':curly-braced-matrix',
}

// Enclosure notation attributes options based on a bit mask or symbol
const symbolClasses = {
    '▭': 'box',
    '̄': 'top',
    '▁': 'bottom',
    '▢': 'roundedbox',
    '○': 'circle',
    '⟌': 'longdiv',
    "⃧": 'actuarial',
    '⬭': 'circle',
    '╱': 'cancel',
    '╲': 'bcancel',
    '╳': 'xcancel'
};

const maskClasses = {
    1: 'top',
    2: 'bottom',
    4: 'left',
    8: 'right',
    16: 'horizontalstrike',
    32: 'verticalstrike',
    64: 'downdiagonalstrike',
    128: 'updiagonalstrike'
};

function inRange(ch0, ch, ch1) {
    return ch >= ch0 && ch <= ch1 && ch.length == ch0.length;
}

function isAccent(ch) {
    return inRange('\u0300', ch, '\u034F')
}

function isAlphanumeric(ch) {
    return /[\w]/.test(ch) || ch >= '\u3018' || isGreek(ch) || inRange('ℂ', ch, 'ⅉ');
}

function isAsciiAlphabetic(ch) { return /[A-Za-z]/.test(ch); }

function isAsciiAlphanumeric(ch) { return /[\w]/.test(ch); }

function isAsciiDigit(ch) {
    return inRange('0', ch, '9');
}

function isBraille(ch) {
    return inRange('\u2800', ch, '\u28FF');
}

function isCloseDelimiter(op) {
    return ')]}⟩〗⌉⌋❳⟧⟩⟫⟭⟯⦄⦆⦈⦊⦌⦎⦐⦒⦔⦖⦘⧙⧛⧽'.includes(op)
}

function isDoubleStruck(ch) {
    return inRange('\u2145', ch, '\u2149');
}

function isGreek(ch) {
    return inRange('\u0391', ch, '\u03F5');
}

function isIntegral(op) {
    return inRange('∫', op, '∳') || op == '⨌';  // 222B..2233, 2A0C
}

function isLcAscii(ch) { return /[a-z]/.test(ch); }

function isLcGreek(ch) {
    return inRange('\u03B1', ch, '\u03F5');
}

function isLeadSurrogate(code) { return code >= 0xD800 && code <= 0xDBFF; }

function isMathColor(val) { return val == '☁(' || val == '✎(' }

function isMathML(unicodemath) {
    return unicodemath.startsWith("<math") ||
           unicodemath.startsWith("<mml:math") ||
           unicodemath.startsWith("<m:math");
}

function isMrowLike(node) {
    return ['math', 'menclose', 'merror', 'mpadded', 'mphantom', 'mrow',
        'mscarry', 'msqrt', 'mstyle', 'mtd'].includes(node.localName)
}

function isNary(op) {
    return '∑⅀⨊∏∐⨋∫∬∭⨌∮∯∰∱⨑∲∳⨍⨎⨏⨕⨖⨗⨘⨙⨚⨛⨜⨒⨓⨔⋀⋁⋂⋃⨃⨄⨅⨆⨀⨁⨂⨉⫿'.includes(op);
}

function isOpenDelimiter(op) {
    return '([{⟨〖⌈⌊❲⟦⟨⟪⟬⟮⦃⦅⦇⦉⦋⦍⦏⦑⦓⦕⦗⧘⧚⧼'.includes(op)
}

function isTrailSurrogate(code) { return code >= 0xDC00 && code <= 0xDFFF; }

function isTranspose(value) {
    return Array.isArray(value) &&
        value[0].hasOwnProperty('atoms') &&
        Array.isArray(value[0].atoms) &&
        value[0].atoms[0].hasOwnProperty("chars") &&
        value[0].atoms[0].chars == '⊺';
}

function isUcAscii(ch) { return /[A-Z]/.test(ch); }

function removeOuterParens(ret) {
    if (ret[0] == '(') {
        // Remove outermost parens if they match one another. Needed
        // to remove parentheses enclosing, e.g., 𝑎+𝑏 in ▭(2&𝑎+𝑏)
        let cParen = 1
        for (let i = 1; i < ret.length - 1; i++) {
            if (ret[i] == '(')
                cParen++
            else if (ret[i] == ')')
                cParen--
            if (!cParen)
                break                   // Balanced before final char
        }
        if (cParen == 1 && ret[ret.length - 1] == ')')
            ret = ret.substring(1, ret.length - 1)
    }
    return ret
}

function hasEqLabel(node) {
    if (node.nodeName != 'mtable')
        return false
    node = node.firstElementChild           // <mtr> or <mlabeledtr>

    return node.nodeName == 'mlabeledtr' ||
        node.firstElementChild.getAttribute('intent') == ':equation-label'
}

function checkCardinalityIntent(intent, miContent) {
    if (intent) {
        if (intent[0] == 'ⓒ')
            intent = 'cardinality' + intent.substring(1)
        if (miContent && intent.startsWith('cardinality'))
            intent = 'cardinality(' + miContent + ')'
    }
    return intent
}

function checkBrackets(node) {
    // Return count of open brackets - count of close brackets. The value 0
    // implies equal counts, but the code doesn't check for correct balance
    // order. Also return the node index of the final child that shouldn't be
    // included in partial build up. Partial build up of trailing children
    // may occur for a nonzero bracket count difference, e.g., √(𝑎²-𝑏². Also
    // return opBuildUp: 1 means possible build up; 2 means possible build up
    // and that an nary op is present.
    let cNode = node.childElementCount
    let cBracket = 0
    let ket = false
    let opBuildUp = 0
    let vbar = false
    let k = -1                              // Index of final child not in
                                            //  partial build up
    if (!isMrowLike(node) || !cNode)
        return 0

    for (let i = cNode - 1; i >= 0; i--) {
        let nodeC = node.children[i]
        let text = nodeC.textContent

        if (nodeC.childElementCount) {
            // Most built-up objects currently aren't included in partial
            // build up but just in case base of msup, etc. is a function
            // name or nary operator...
            const scripts = ['msub', 'msup', 'msubsup', 'mover', 'munder', 'munderover']

            if (scripts.includes(nodeC.nodeName)) {
                opBuildUp = isNary(nodeC.firstElementChild.textContent) ? 2 : 1
            } else if (k == -1) {
                k = i
            }
        } else if (nodeC.localName == 'mo') { // Sometimes nodeName is capitalized...
            if (isOpenDelimiter(text)) {
                if (k == -1)
                    k = i
                cBracket++
                if (cBracket > 0)
                    break
            } else if (isCloseDelimiter(text)) {
                if (text == '⟩')            // Set up |𝜓⟩
                    ket = true
                cBracket--
                if (k == -1)
                    k = i
                opBuildUp = 1
            } else if (text == '|') {
                if (k == -1)
                    k = i
                if (vbar) {
                    vbar = false
                    opBuildUp = 1
                    break
                } else if (ket) {           // Handle |𝜓⟩
                    cBracket++
                    continue
                }
                vbar = true
            } else if ('_^/√⒞\u2061▒'.includes(text)) {
                opBuildUp = 1
            } else if (isNary(text)) {
                opBuildUp = 2
            }
        }
    }
    if (vbar)
        cBracket = 1
    if (k == cNode - 1)
        k = -1
    return [cBracket, k, opBuildUp]
}

function checkSpace(i, node, ret) {
    // Return ' ' if node is an <mrow> containing an ASCII-alphabetic first
    // child and preceded by an alphanumeric character. Else return ''. E.g.,
    // need a ' ' between '𝑏' and 'sin' in '𝑎+𝑏 sin 𝜃'
    if (i && node.nodeName == 'mrow' && node.firstElementChild &&
        node.firstElementChild.nodeName == 'mi' &&
        isAsciiAlphabetic(node.firstElementChild.textContent[0]) &&
        isAlphanumeric(ret[ret.length - 1])) {
        return ' '
    }
    return ''
}

function getMathMLDOM(mathML) {
    // Get DOM for converting MathML to UnicodeMath
    if (mathML.startsWith('<mml:math') || mathML.startsWith('<m:math'))
        mathML = removeMmlPrefixes(mathML);

    const parser = new DOMParser();
    return parser.parseFromString(mathML, "application/xml");
}

function foldSupDigit(char) {   // Fold Unicode superscript digit to ASCII
    switch (char) {
        case '¹':
            return '1';
        case '²':
            return '2';
        case '³':
            return '3';
    }
    if (inRange('⁰', char, '⁹') && !inRange('\u2071', char, '\u2073'))
        return String.fromCodePoint(char.codePointAt(0) - 0x2040);
    return '';
}

function foldMathAlphanumeric(code, ch) {   // Generalization of foldMathItalic()
    let anCode = '';
    if (code < 0x1D400) {
        if (code < 0x2102)                  // 1st Letterlike math alphabetic
            return ['mup', ch];
        let letterLikeSymbol = letterLikeSymbols[ch];
        return (letterLikeSymbol == undefined) ? ['mup', ch]
            : [anCodesEng[letterLikeSymbol[0]], letterLikeSymbol[1]];
    }
    if (code > 0x1D7FF)
        return ['', ch];                    // Not math alphanumeric

    code -= 0x1D400;

    if (code < 13 * 52) {                   // 13 English math alphabets
        anCode = anCodesEng[Math.floor(code / 52)];
        code %= 52;
        if (code >= 26) { code += 6; }        // 'a' - 'Z' - 1
        return [anCode, String.fromCodePoint(code + 65)];
    }
    code -= 13 * 52;                        // Bypass English math alphabets
    if (code < 4) {
        if (code > 2)
            return ['', ' '];
        return ['mit', code ? 'ȷ' : 'ı'];
    }
    code -= 4;                              // Advance to Greek math alphabets
    if (code < 5 * 58) {
        anCode = anCodesGr[Math.floor(code / 58)];
        code = (code % 58) + 0x0391;
        if (code <= 0x03AA) {               // Upper-case Greek
            if (code == 0x03A2)
                code = 0x03F4;			    // Upper-case ϴ variant
            if (code == 0x03AA)
                code = 0x2207;              // ∇
        } else {                            // Lower-case Greek
            code += 6;                      // Advance to α
            if (code >= 0x03CA && code <= 0x03D1) {
                return [anCode, '∂ϵϑϰϕϱϖ'[code - 0x03CA]];
            }
        }
        return [anCode, String.fromCodePoint(code)];
    }
    code -= 5 * 58;						    // Bypass Greek math alphabets
    if (code < 4) {
        if (code > 1)
            return ['', ' '];			    // Not defined (yet)
        return ['mbf', code ? 'ϝ' : 'Ϝ'];   // Digammas
    }
    code -= 4;                              // Convert to offset of 5 digit sets
    anCode = anCodesDg[Math.floor(code / 10)];
    code = 0x30 + (code % 10);
    return [anCode, String.fromCodePoint(code)];
}

function needParens(ret) {
    // Return true if ret is a compound expression that needs to be parenthesized
    let cch = ret.length;
    let ch1;

    for (let i = 0; i < cch; i++) {
        if (ret[i] == '(' && i < cch - 1) {
            // Handle nested brackets?
            let j = ret.indexOf(')', i + 1);
            if (j > 0) {
                i = j;                      // Include parenthesized expression
                continue;
            }
            return true;
        }
        if (ret.codePointAt(i) > 0xFFFF) {
            i++;
            continue;
        }
        if (ret[i] == ' ' && ch1 == '^' || isAlphanumeric(ret[i]) || ret[i] == '∑')
            continue;                       // Space is removed in build up

        if (!digitSuperscripts.includes(ret[i]) &&
            !isPrime(ret[i]) && !digitSubscripts.includes(ret[i]) &&
            !'\u2061∞⬌!^ⒶⒻ'.includes(ret[i]) && (i || ret[i] != '−')) {
            return true;
        }
        ch1 = ret[i];
    }
    return false;
}

function removeMmlPrefixes(mathML) {
    let prefix;
    if (mathML.startsWith('<m:'))
        prefix = 'm:';
    else if (mathML.startsWith('<mml:'))
        prefix = 'mml:';
    else
        return;                             // No mml: or m: prefix

    // Remove 'mml:' or 'm:' prefixes (renderers don't understand them and
    // the conversion code is simplified)
    let j = 0;
    let mathML1 = '<math';

    for (let i = 5 + prefix.length; i < mathML.length; i = j + prefix.length) {
        j = mathML.indexOf(prefix, i);
        if (j < 0)
            j = mathML.length;
        mathML1 += mathML.substring(i, j);
    }
    return mathML1;
}

function isPrime(ch) {
    return '′″‴⁗	'.includes(ch);
}

// generate prime symbol(s) based on a number of desired primes
function processPrimes(primes) {
    switch (primes) {
        case 4:
            return "⁗";
        case 3:
            return "‴";
        case 2:
            return "″";
        default:
            return "′".repeat(primes);
    }
}

function isMathMLObject(value, ignoreIntent) {
    // Return true iff objs includes value.nodeName
    const objs = ['mfrac', 'msqrt', 'mroot', 'menclose', 'msup', 'msub',
        'munderover', 'msubsup', 'mover', 'munder', 'mpadded', 'mphantom',
        'multiscripts']

    if (value && value.nodeName == 'mrow') {
        if (!ignoreIntent && value.hasAttribute('intent')) {
            // Conversions to speech, braille, and UnicodeMath ignore
            // parenthesizing due to <mrow> intent values
            let intent = value.getAttribute('intent')
            if (intent == ':function' || intent == ':fenced' ||
                intent.indexOf('integral') != -1 ||
                intent.startsWith(':n-ary') || intent.startsWith('binomial-coefficient'))
                return true
        }
        if (value.childElementCount == 1)
            value = value.parentElement
    }
    return value ? objs.includes(value.nodeName) : false
}

function hasSingleMrow(value) {
    return Array.isArray(value) && value.length == 1 &&
        value[0].hasOwnProperty('mrow');
}

function codeAt(chars, i) {
    // Get UTF-32 code of character at position i, where i can be at a
    // trail surrogate
    let code = chars.codePointAt(i);
    if (code >= 0xDC00 && code <= 0xDFFF)
        code = chars.codePointAt(i - 1);
    return code;
}
function getCch(chars, i) {
    return codeAt(chars, i) > 0xFFFF ? 2 : 1
}

function getCh(str, i) {
    // Get BMP character or surrogate pair at offset i
    let m = str.codePointAt(i);
    if (isTrailSurrogate(m))
        m = str.codePointAt(i - 1)
    return String.fromCodePoint(m);
}

function getChars(value) {
    let chars = '';                         // Collects chars & primes
    let n = 1;                              // 1 in case value isn't an array
    let primes;                             // No primes yet
    let val = value;                        // Moves down AST to chars

    if (Array.isArray(value)) {
        n = value.length;
        val = val[0];
        if (Array.isArray(val))
            val = val[0];
    }
    for (let i = 0; i < n; val = value[++i]) {
        if (val.hasOwnProperty('script')) {
            val = val.script.base;
        }
        if (val.hasOwnProperty('primed')) {
            primes = val.primed.primes;
            val = val.primed.base;
        }
        if (val.hasOwnProperty('atoms')) {
            val = val.atoms;
            if (Array.isArray(val))
                val = val[0];
            chars += primes ? val.chars + processPrimes(primes) : val.chars;
        } else if (val.hasOwnProperty('number'))
            chars = val.number;
        if (n == 1)
            break;                          // No array or value.length = 1
    }
    return chars ? chars : '';
}

function getChD(value) {
    // Get differential d. Return '' if not found
    let chars = getChars(value);
    if(!chars)
        return ''

    let chD = getCh(chars, 0);    // Get leading char

    return 'dⅆ∂𝑑𝜕'.includes(chD) ? chD : '';
}

(function(root) {
'use strict';

// if in debug mode, opens (or closes if the argument is null) a console.group
function debugGroup(s) {
    if (testing)
        return
    if (typeof ummlConfig !== "undefined" && typeof ummlConfig.debug !== "undefined" && ummlConfig.debug) {
        if (s != null) {
            console.group(s);
        } else {
            console.groupEnd();
        }
    }
}

// if in debug mode, console.log the given value
function debugLog(x) {
    if (testing)
        return
    if (typeof ummlConfig !== "undefined" && typeof ummlConfig.debug !== "undefined" && ummlConfig.debug) {
        console.log(x);
    }
}

///////////
// PARSE //
///////////

// control words, to be replaced before parsing proper commences
const controlWords = {
    // from tech note: Appendix B. Character Keywords and Properties updated
    // with the Microsoft math autocorrect list. For a more complete list, see
    // https://ctan.math.utah.edu/ctan/tex-archive/macros/unicodetex/latex/unicode-math/unimath-symbols.pdf
                                // Unicode code point
    'Angstrom':         'Å',   // 212B
    'Bar':              '̿',	// 033F
    'Bmatrix':          'Ⓢ',	// 24C8
    'Bumpeq':           '≎',    	// 224E
    'Cap':              '⋒',    	// 22D2
    'Colon':            '∷',    	// 2237
    'Cup':              '⋓',    	// 22D3
    'Dd':               'ⅅ',	// 2145
    'Delta':            'Δ',	// 0394
    'Deltaeq':          '≜',    	// 225C
    'Doteq':            '≑',    	// 2251
    'Downarrow':        '⇓',    	// 21D3
    'Gamma':            'Γ',	// 0393
    'Im':               'ℑ',    	// 2111
    'Intersection':     '⋂',    	// 22C2
    'Join':             '⨝',   // 2A1D
    'Lambda':           'Λ',	// 039B
    'Langle':           '⟪',    	// 27EA
    'Lbrack':           '⟦',    	// 27E6
    'Leftarrow':        '⇐',    	// 21D0
    'Leftrightarrow':   '⇔',	// 21D4
    'Lleftarrow':       '⇚',	    // 21DA
    'Longleftarrow':    '⟸',	// 27F8
    'Longleftrightarrow':'⟺',	// 27FA
    'Longrightarrow':   '⟹',	// 27F9
    'Lsh':              '↰',    	// 21B0
    'Omega':            'Ω',	// 03A9
    'Phi':              'Φ',	// 03A6
    'Pi':               'Π',	// 03A0
    'Psi':              'Ψ',	// 03A8
    'Rangle':           '⟫',	    // 27EB
    'Rbrack':           '⟧',	    // 27E7
    'Re':               'ℜ',	    // 211C
    'Rightarrow':       '⇒',	// 21D2
    'Rrightarrow':      '⇛',	    // 21DB
    'Rsh':              '↱',    	// 21B1
    'Sigma':            'Σ',	// 03A3
    'Subset':           '⋐',    	// 22D0
    'Supset':           '⋑',    	// 22D1
    'Theta':            'Θ',	// 0398
    'Ubar':             '̳',	// 0333
    'Union':            '⋃',    	// 22C3
    'Uparrow':          '⇑',    	// 21D1
    'Updownarrow':      '⇕',	    // 21D5
    'Upsilon':          'Υ',	// 03A5
    'VDash':            '⊫',	    // 22AB
    'Vdash':            '⊩',	    // 22A9
    'Vert':             '‖',	    // 2016
    'Vmatrix':          '⒩',	// 24A9
    'Vvdash':           '⊪',	    // 22AA
    'Xi':               'Ξ',	// 039E
    'above':            '┴',	// 2534
    'abs':              '⒜',	// 249C
    'acute':            '́',	    // 0301
    'aleph':            'ℵ',    	// 2135
    'alpha':            'α',	// 03B1
    'amalg':            '∐',	    // 2210
    'angle':            '∠',	// 2220
    'angmsd':           '∡',	    // 2221
    'angrtvb':          '⊾',	    // 22BE
    'angsph':           '∢',	    // 2222
    'aoint':            '∳',	    // 2233
    'approx':           '≈',	// 2248
    'approxeq':         '≊',    	// 224A
    'arg':              'ⓐ',   // 24D0
    'asmash':           '⬆',    	// 2B06
    'ast':              '∗',    	// 2217
    'asymp':            '≍',    	// 224D
    'atop':             '¦',	// 00A6
    'backcolor':        '☁',	// 2601
    'backepsilon':      '϶',	// 03F6
    'backsim':          '∽',	// 223D
    'backsimeq':        '⋍',	    // 22CD
    'bar':              '̅',	// 0305
    'bcancel':          '╲',	// 2572
    'because':          '∵',	// 2235
    'begin':            '〖',	// 3016
    'below':            '┬',	// 252C
    'beta':             'β',	// 03B2
    'beth':             'ℶ',    	// 2136
    'between':          '≬',    	// 226C
    'bigcap':           '⋂',    	// 22C2
    'bigcup':           '⋃',    	// 22C3
    'bigintersection':  '⋂',    	// 22C2
    'bigodot':          '⨀',	// 2A00
    'bigoplus':         '⨁',	// 2A01
    'bigotimes':        '⨂',	// 2A02
    'bigsqcap':         '⨅',	// 2A05
    'bigsqcup':         '⨆',	// 2A06
    'bigudot':          '⨃',	// 2A03
    'biguplus':         '⨄',	// 2A04
    'bigunion':         '⋃',    	// 22C3
    'bigvee':           '⋁',    	// 22C1
    'bigwedge':         '⋀',	    // 22C0
    'bmatrix':          'ⓢ',	// 24E2
    'bot':              '⊥',	// 22A5
    'bowtie':           '⋈',	    // 22C8
    'box':              '□',	// 25A1
    'boxdot':           '⊡',    	// 22A1
    'boxminus':         '⊟',    	// 229F
    'boxplus':          '⊞',    	// 229E
    'boxtimes':         '⊠',    	// 22A0
    'bra':              '⟨',	    // 27E8
    'breve':            '̆',	    // 0306
    'bullet':           '∙',	// 2219
    'bumpeq':           '≏',	    // 224F
    'by':               '×',	// 00D7
    'cancel':           '╱',	// 2571
    'cap':              '∩',	// 2229
    'card':             'ⓒ',   // 24D2
    'cases':            'Ⓒ',	// 24B8
    'cbrt':             '∛',	    // 221B
    'ccwint':           '⨑',    // 2A11
    'cdot':             '⋅',	    // 22C5
    'cdots':            '⋯',	    // 22EF
    'cents':            '¢',    // 00A2
    'check':            '̌',	    // 030C
    'chi':              'χ',	// 03C7
    'choose':           '⒞',	// 249E
    'circ':             '∘',	    // 2218
    'circeq':           '≗',    	// 2257
    'circle':           '○',	// 25CB
    'circlearrowleft':  '↺',    	// 21BA
    'circlearrowright': '↻',	    // 21BB
    'close':            '┤',	// 2524
    'clubsuit':         '♣',	// 2663
    'coint':            '∲',	    // 2232
    'colon':            '∶',	// 2236
    'color':            '✎',	// 270E
    'complement':       '∁',	    // 2201
    'cong':             '≅',    	// 2245
    'contain':          '∋',	// 220B
    'coprod':           '∐',	    // 2210
    'cross':            '⨯',	// 2A2F
    'cup':              '∪',	// 222A
    'curlyeqprec':      '⋞',    	// 22DE
    'curlyeqsucc':      '⋟',    	// 22DF
    'curlyvee':         '⋎',    	// 22CE
    'curlywedge':       '⋏',    	// 22CF
    'curvearrowleft':   '↶',    	// 21B6
    'curvearrowright':  '↷',    	// 21B7
    'cwint':            '∱',    	// 2231
    'dag':              '†',	// 2020
    'dagger':           '†',	// 2020
    'daleth':           'ℸ',	    // 2138
    'dashleftarrow':    '⇠',	    // 21E0
    'dashrightarrow':   '⇢',	    // 21E2
    'dashv':            '⊣',	    // 22A3
    'dd':               'ⅆ',	// 2146
    'ddag':             '‡',	// 2021
    'ddagger':          '‡',	// 2021
    'ddddot':           '⃜',	// 20DC
    'dddot':            '⃛',	// 20DB
    'ddot':             '̈',	    // 0308
    'ddots':            '⋱',	    // 22F1
    'defeq':            '≝',	    // 225D
    'degc':             '℃',	// 2103
    'degf':             '℉',	    // 2109
    'degree':           '°',	// 00B0
    'delta':            'δ',	// 03B4
    'det':              '⒱',	// 24B1
    'diamond':          '⋄',	    // 22C4
    'diamondsuit':      '♢',	    // 2662
    'div':              '÷',	// 00F7
    'divideontimes':    '⋇',	    // 22C7
    'dot':              '̇',	    // 0307
    'doteq':            '≐',	    // 2250
    'dotminus':         '∸',	    // 2238
    'dotplus':          '∔',	    // 2214
    'dots':             '…',	// 2026
    'doubleH':          'ℍ',    // 210D
    'downarrow':        '↓',	// 2193
    'downdownarrows':   '⇊',    	// 21CA
    'downharpoonleft':  '⇃',    	// 21C3
    'downharpoonright': '⇂',    	// 21C2
    'dsmash':           '⬇',    	// 2B07
    'ee':               'ⅇ',	// 2147
    'eight':            '8',    // 0038
    'ell':              'ℓ',	// 2113
    'ellipse':          '⬭',    // 2B2D
    'emptyset':         '∅',	    // 2205
    'emsp':             ' ',	// 2003
    'end':              '〗',	// 3017
    'ensp':             ' ',	    // 2002
    'epar':             '⋕',    	// 22D5
    'epsilon':          'ϵ',	// 03F5
    'eqalign':          '█',	// 2588
    'eqarray':          '█',	// 2588
    'eqcirc':           '≖',	    // 2256
    'eqgtr':            '⋝',	    // 22DD
    'eqless':           '⋜',	    // 22DC
    'eqno':             '#',	// 0023
    'equiv':            '≡',	// 2261
    'eta':              'η',	// 03B7
    'exists':           '∃',	// 2203
    'fallingdotseq':    '≒',	// 2252
    'five':             '5',    // 0035
    'forall':           '∀',	// 2200
    'four':             '4',    // 0034
    'frakturH':         'ℌ',    // 210C
    'frown':            '⌢',	    // 2322
    'fullouterjoin':    '⟗',   // 27D7
    'funcapply':        '⁡',	    // 2061
    'gamma':            'γ',	// 03B3
    'ge':               '≥',	// 2265
    'geq':              '≥',	// 2265
    'geqq':             '≧',	// 2267
    'gets':             '←',	// 2190
    'gg':               '≫',	// 226B
    'ggg':              '⋙',    	// 22D9
    'gimel':            'ℷ',    	// 2137
    'gneqq':            '≩',    	// 2269
    'gnsim':            '⋧',    	// 22E7
    'grave':            '̀',	    // 0300
    'gtrdot':           '⋗',    	// 22D7
    'gtreqless':        '⋛',    	// 22DB
    'gtrless':          '≷',    	// 2277
    'gtrsim':           '≳',    	// 2273
    'hairsp': ' ',	    // 200A
    'half':             '½',    // 00BD
    'hat':              '̂',	    // 0302
    'hbar':             'ℏ',    	// 210F
    'heartsuit':        '♡',    	// 2661
    'hookleftarrow':    '↩',    	// 21A9
    'hookrightarrow':   '↪',    	// 21AA
    'hphantom':         '⬄',	// 2B04
    'hsmash':           '⬌',	// 2B0C
    'hvec':             '⃑',	// 20D1
    'iff':              '⟺',	// 27FA
    'ii':               'ⅈ',    	// 2148
    'iiiint':           '⨌',	// 2A0C
    'iiint':            '∭',	    // 222D
    'iint':             '∬',	// 222C
    'imath':            'ı',	// 0131
    'in':               '∈',	// 2208
    'inc':              '∆',	// 2206
    'infty':            '∞',	// 221E
    'int':              '∫',	// 222B
    'intent':           'ⓘ',   // 24D8
    'intercal':         '⊺',	    // 22BA
    'intersection':     '∩',	// 2229
    'iota':             'ι',	// 03B9
    'iplus':            '⁤',	    // 2064
    'isep':             '⁣',	    // 2063
    'itimes':           '⁢',	    // 2062
    'intercal':         '⊺',    // 22BA
    'jj':               'ⅉ',    	// 2149
    'jmath':            'ȷ',	// 0237
    'kappa':            'κ',	// 03BA
    'ket':              '⟩',	    // 27E9
    'labove':           '└',	// 2514
    'lambda':           'λ',	// 03BB
    'land':             '∧',	// 2227
    'langle':           '⟨',	    // 27E8
    'lbbrack':          '⟦',	    // 27E6
    'lbelow':           '┌',	// 250C
    'lbrace':           '{',	// 007B
    'lbrack':           '[',	// 005B
    'lceil':            '⌈',	    // 2308
    'ldiv':             '∕',	// 2215
    'ldivide':          '∕',	// 2215
    'ldots':            '…',	// 2026
    'ldsh':             '↲',	// 21B2
    'le':               '≤',	// 2264
    'left':             '├',	// 251C
    'leftarrow':        '←',	// 2190
    'leftarrowtail':    '↢',	    // 21A2
    'leftharpoondown':  '↽',	    // 21BD
    'leftharpoonup':    '↼',	    // 21BC
    'leftleftarrows':   '⇇',	    // 21C7
    'leftouterjoin':    '⟕',    // 27D5
    'leftrightarrow':   '↔',	// 2194
    'leftrightarrows':  '⇆',	    // 21C6
    'leftrightharpoons':'⇋',	    // 21CB
    'leftrightwavearrow':'↭',	// 21AD
    'leftsquigarrow':   '⇜',    	// 21DC
    'leftthreetimes':   '⋋',    	// 22CB
    'leftwavearrow':    '↜',    	// 219C
    'leq':              '≤',	// 2264
    'leqq':             '≦',	// 2266
    'lessdot':          '⋖',	    // 22D6
    'lesseqgtr':        '⋚',	    // 22DA
    'lessgtr':          '≶',	    // 2276
    'lesssim':          '≲',	    // 2272
    'lfloor':           '⌊',	    // 230A
    'lhvec':            '⃐',	// 20D0
    'll':               '≪',	// 226A
    'lll':              '⋘',	    // 22D8
    'lmoust':           '⎰',	    // 23B0
    'lneqq':            '≨',	    // 2268
    'lnot':             '¬',	// 00AC
    'lnsim':            '⋦',	    // 22E6
    'longdiv':          '⟌',    // 27CC
    'longleftarrow':    '⟵',	// 27F5
    'longleftrightarrow':'⟷',	// 27F7
    'longmapsto':       '⟼',	// 27FC
    'longmapstoleft':   '⟻',	// 27FB
    'longrightarrow':   '⟶',	// 27F6
    'looparrowleft':    '↫',	    // 21AB
    'looparrowright':   '↬',	    // 21AC
    'lor':              '∨',	// 2228
    'lparen':           '(',    // 0028
    'lrhar':            '⇋',	    // 21CB
    'ltimes':           '⋉',    	// 22C9
    'lvec':             '⃖',	// 20D6
    'mapsto':           '↦',	    // 21A6
    'mapstoleft':       '↤',	    // 21A4
    'matrix':           '■',	// 25A0
    'medsp':            ' ',	    // 205F
    'meq':              '≞',	    // 225E
    'mid':              '∣',	    // 2223
    'models':           '⊨',	    // 22A8
    'mp':               '∓',	    // 2213
    'mu':               'μ',	// 03BC
    'multimap':         '⊸',    	// 22B8
    'nLeftarrow':       '⇍',    	// 21CD
    'nLeftrightarrow':  '⇎',    	// 21CE
    'nRightarrow':      '⇏',    	// 21CF
    'nVDash':           '⊯',    	// 22AF
    'nVdash':           '⊮',    	// 22AE
    'nabla':            '∇',	// 2207
    'napprox':          '≉',    	// 2249
    'naryand':          '▒',	// 2592
    'nasymp':           '≭',	    // 226D
    'nbsp':            '\u00A0',// 00A0
    'ncong':            '≇',    	// 2247
    'ndiv':             '⊘',	    // 2298
    'ne':               '≠',	// 2260
    'nearrow':          '↗',	    // 2197
    'neg':              '¬',	// 00AC
    'neq':              '≠',	// 2260
    'nequiv':           '≢',	// 2262
    'nexists':          '∄',	    // 2204
    'ngeq':             '≱',	    // 2271
    'ngt':              '≯',	    // 226F
    'ni':               '∋',	// 220B
    'nine':             '9',    // 0039
    'nleftarrow':       '↚',	    // 219A
    'nleftrightarrow':  '↮',	    // 21AE
    'nleq':             '≰',	    // 2270
    'nless':            '≮',	    // 226E
    'nmid':             '∤',	    // 2224
    'norm':             '‖',	    // 2016
    'not':              '/',	// 002F
    'notin':            '∉',    	// 2209
    'notni':            '∌',    	// 220C
    'nparallel':        '∦',    	// 2226
    'nprec':            '⊀',    	// 2280
    'npreccurlyeq':     '⋠',    	// 22E0
    'nrightarrow':      '↛',    	// 219B
    'nsim':             '≁',    	// 2241
    'nsimeq':           '≄',    	// 2244
    'nsqsubseteq':      '⋢',    	// 22E2
    'nsqsupseteq':      '⋣',    	// 22E3
    'nsub':             '⊄',    	// 2284
    'nsubseteq':        '⊈',    	// 2288
    'nsucc':            '⊁',    	// 2281
    'nsucccurlyeq':     '⋡',    	// 22E1
    'nsup':             '⊅',    	// 2285
    'nsupseteq':        '⊉',    	// 2289
    'ntriangleleft':    '⋪',    	// 22EA
    'ntrianglelefteq':  '⋬',    	// 22EC
    'ntriangleright':   '⋫',    	// 22EB
    'ntrianglerighteq': '⋭',    	// 22ED
    'nu':               'ν',	// 03BD
    'numsp':            ' ',    	// 2007
    'nvDash':           '⊭',	    // 22AD
    'nvdash':           '⊬',	    // 22AC
    'nwarrow':          '↖',	    // 2196
    'oast':             '⊛',	    // 229B
    'ocirc':            '⊚',	    // 229A
    'odash':            '⊝',	    // 229D
    'odot':             '⊙',	    // 2299
    'oeq':              '⊜',	    // 229C
    'of':               '▒',	// 2592
    'oiiint':           '∰',	    // 2230
    'oiint':            '∯',    	// 222F
    'oint':             '∮',	// 222E
    'omega':            'ω',	// 03C9
    'ominus':           '⊖',	    // 2296
    'one':              '1',    // 0031
    'oo':               '∞',	// 221E
    'open':             '├',	// 251C
    'oplus':            '⊕',	    // 2295
    'oslash':           '⊘',	    // 2298
    'otimes':           '⊗',	    // 2297
    'over':             '/',	// 002F
    'overbar':          '¯',	// 00AF
    'overbrace':        '⏞',	    // 23DE
    'overbracket':      '⎴',	// 23B4
    'overline':         '¯',	// 00AF
    'overparen':        '⏜',	    // 23DC
    'overshell':        '⏠',	    // 23E0
    'parallel':         '∥',	// 2225
    'partial':          '∂',	// 2202
    'perp':             '⊥',	// 22A5
    'phantom':          '⟡',	// 27E1
    'phi':              'ϕ',	// 03D5
    'pi':               'π',	// 03C0
    'pitchfork':        '⋔',	    // 22D4
    'pm':               '±',	// 00B1
    'pmatrix':          '⒨',	// 24A8
    'pppprime':         '⁗',	    // 2057
    'ppprime':          '‴',	// 2034
    'pprime':           '″',	// 2033
    'prcue':            '≼',	    // 227C
    'prec':             '≺',	    // 227A
    'preccurlyeq':      '≼',	    // 227C
    'preceq':           '⪯',	// 2AAF
    'precneq':          '⪱',	// 2AB1
    'precnsim':         '⋨',	    // 22E8
    'precsim':          '≾',    	// 227E
    'prime':            '′',	// 2032
    'prod':             '∏',	// 220F
    'propto':           '∝',	// 221D
    'psi':              'ψ',	// 03C8
    'qdrt':             '∜',	    // 221C
    'qed':              '∎',	    // 220E
    'quad':             ' ',	// 2003
    'quarter':          '¼',    // 00BC
    'rangle':           '⟩',	    // 27E9
    'ratio':            '∶',	// 2236
    'rbbrack':          '⟧',	    // 27E7
    'rbelow':           '┐',	// 2510
    'rbrace':           '}',	// 007D
    'rbrack':           ']',	// 005D
    'rceil':            '⌉',    	// 2309
    'rddots':           '⋰',	    // 22F0
    'rect':             '▭',	// 25AD
    'rfloor':           '⌋',	    // 230B
    'rho':              'ρ',	// 03C1
    'rhvec':            '⃑',	// 20D1
    'right':            '┤',	// 2524
    'rightangle':       '∟',	// 221F
    'rightarrow':       '→',	// 2192
    'rightarrowtail':   '↣',	    // 21A3
    'rightharpoondown': '⇁',	    // 21C1
    'rightharpoonup':   '⇀',	    // 21C0
    'rightleftarrows':  '⇄',	    // 21C4
    'rightleftharpoons':'⇌',    	// 21CC
    'rightouterjoin':   '⟖',    // 27D6
    'rightrightarrows': '⇉',    	// 21C9
    'rightthreetimes':  '⋌',	    // 22CC
    'righttriangle':    '⊿',	// 22BF
    'rightwavearrow':   '↝',	    // 219D
    'risingdotseq':     '≓',	    // 2253
    'rlhar':            '⇌',	    // 21CC
    'rmoust':           '⎱',	    // 23B1
    'root':             '⒭',	// 24AD
    'rparen':           ')',    // 0029
    'rrect':            '▢',	// 25A2
    'rtimes':           '⋊',    	// 22CA
    'sdiv':             '⁄',	// 2044
    'sdivide':          '⁄',	// 2044
    'searrow':          '↘',	    // 2198
    'setminus':         '∖',	    // 2216
    'seven':            '7',    // 0037
    'sigma':            'σ',	// 03C3
    'sim':              '∼',	    // 223C
    'simeq':            '≃',	    // 2243
    'six':              '6',    // 0036
    'smash':            '⬍',	    // 2B0D
    'smile':            '⌣',	    // 2323
    'spadesuit':        '♠',	// 2660
    'sqcap':            '⊓',	    // 2293
    'sqcup':            '⊔',	    // 2294
    'sqrt':             '√',	// 221A
    'sqsubset':         '⊏',    	// 228F
    'sqsubseteq':       '⊑',    	// 2291
    'sqsupset':         '⊐',    	// 2290
    'sqsupseteq':       '⊒',    	// 2292
    'star':             '⋆',    	// 22C6
    'subset':           '⊂',	// 2282
    'subseteq':         '⊆',	// 2286
    'subsetneq':        '⊊',    	// 228A
    'subsub':           '⫕',	// 2AD5
    'subsup':           '⫓',	// 2AD3
    'succ':             '≻',	    // 227B
    'succcurlyeq':      '≽',	    // 227D
    'succeq':           '≽',	    // 227D
    'succnsim':         '⋩',	    // 22E9
    'succsim':          '≿',	    // 227F
    'sum':              '∑',	// 2211
    'supset':           '⊃',	// 2283
    'supseteq':         '⊇',	// 2287
    'supsetneq':        '⊋',    	// 228B
    'supsub':           '⫔',	// 2AD4
    'supsup':           '⫖',	// 2AD6
    'surd':             '√',	// 221A
    'swarrow':          '↙',    	// 2199
    'tau':              'τ',	// 03C4
    'therefore':        '∴',	// 2234
    'theta':            'θ',	// 03B8
    'thicksp':         '\u2005',// 2005
    'thinsp':           ' ',	    // 2009
    'third':            '⅓',    // 2153
    'three':            '3',    // 0033
    'tilde':            '̃',	    // 0303
    'times':            '×',	// 00D7
    'to':               '→',	// 2192
    'top':              '⊤',	    // 22A4
    'triangle':         '△',	// 25B3
    'triangleleft':     '◁',    // 25C1
    'trianglelefteq':   '⊴',	    // 22B4
    'triangleright':    '▷',    // 25B7
    'trianglerighteq':  '⊵',	    // 22B5
    'tvec':             '⃡',	// 20E1
    'two':              '2',    // 0032
    'twoheadleftarrow': '↞',	    // 219E
    'twoheadrightarrow':'↠',	    // 21A0
    'ubar':             '̲',	    // 0332
    'underbar':         '▁',	// 2581
    'underbrace':       '⏟',	    // 23DF
    'underbracket':     '⎵',	// 23B5
    'underline':        '▁',	// 2581
    'underparen':       '⏝',	    // 23DD
    'undershell':       '⏡',	    // 23E1
    'union':           '∪',	    // 222A
    'uparrow':          '↑',	// 2191
    'updownarrow':      '↕',	// 2195
    'updownarrows':     '⇅',    	// 21C5
    'upharpoonleft':    '↿',    	// 21BF
    'upharpoonright':   '↾',    	// 21BE
    'uplus':            '⊎',    	// 228E
    'upsilon':          'υ',	// 03C5
    'upuparrows':       '⇈',	    // 21C8
    'varepsilon':       'ε',	// 03B5
    'varkappa':         'ϰ',	// 03F0
    'varphi':           'φ',	// 03C6
    'varpi':            'ϖ',	// 03D6
    'varrho':           'ϱ',	// 03F1
    'varsigma':         'ς',	// 03C2
    'vartheta':         'ϑ',	// 03D1
    'vartriangleleft':  '⊲',	    // 22B2
    'vartriangleright': '⊳',	    // 22B3
    'vbar':             '│',	// 2502
    'vdash':            '⊢',    	// 22A2
    'vdots':            '⋮',	    // 22EE
    'vec':              '⃗',	// 20D7
    'vectimes':         '⨯',    // 2A2F
    'vee':              '∨',	// 2228
    'vert':             '|',	// 007C
    'vmatrix':          '⒱',	// 24B1
    'vphantom':         '⇳',	// 21F3
    'vthicksp':         ' ',    	// 2004
    'wedge':            '∧',	// 2227
    'widehat':          '̂',	    // 0302
    'widetilde':        '̃',	    // 0303
    'wp':               '℘',	    // 2118
    'wr':               '≀',	    // 2240
    'xcancel':          '╳',	// 2573
    'xi':               'ξ',	// 03BE
    'zero':             '0',    // 0030
    'zeta':             'ζ',	// 03B6
    'zwnj':             '‌',
    'zwsp':             '​',
};

// replace control words with the specific characters. note that a control word
// must be postfixed with a non-alpha character such as an operator or a space
// in order to be properly terminated.
// this control word replacement would fly in the face of the UnicodeMath
// "literal" operator if there were single-character control words
function resolveCW(unicodemath) {
    let res = unicodemath.replace(/\\([A-Za-z0-9]+) ?/g, (match, cw) => {

        // check custom control words first (i.e. custom ones shadow built-in ones)
        if (typeof ummlConfig !== "undefined" &&
            typeof ummlConfig.customControlWords !== "undefined" &&
            cw in ummlConfig.customControlWords) {
            return ummlConfig.customControlWords[cw];
        }

        // if the control word begins with "u", try parsing the rest of it as
        // a Unicode code point
        if (cw.startsWith("u") && cw.length >= 5) {
            try {
                let symbol = String.fromCodePoint("0x" + cw.substring(1));
                return symbol;
            } catch(error) {
                // do nothing – could be a regular control word starting with "u"
            }
        }

        // Check for math alphanumeric control words like \mscrH for ℋ defined in
        // unimath-symbols.pdf (link below)
        let cch = cw.length;
        if (cch > 3) {
            let mathStyle = '';
            let c = '';
            if (cw.startsWith('Bbb')) {
                // Blackboard bold (double-struck)
                mathStyle = 'Bbb';
            }
            else if (cw[0] == 'm') {
                // Check for the 14 other math styles
                const mathStyles = [
                    'mup', 'mscr', 'mfrak', 'msans', 'mitBbb', 'mitsans', 'mit', 'mtt',
                    'mbfscr', 'mbffrak', 'mbfsans', 'mbfitsans', 'mbfit', 'mbf'];

                for (let i = 0; i < mathStyles.length; i++) {
                    if (cw.startsWith(mathStyles[i])) {
                        mathStyle = mathStyles[i];
                        break;
                    }
                }
            }
            if (mathStyle) {
                c = cw.substring(mathStyle.length);
                if (c != undefined && c.length) {
                    if (c.length > 1) {     // Might be Greek
                        c = controlWords[c];
                    }
                    if (c != undefined) {
                        if (mathStyle == 'mup') { // Upright
                            return '"' + c + '"';
                        }
                        if (mathStyle == 'mitBbb') {
                            // Short control words are, e.g., \\d for 'ⅆ'.
                            // The only \mitBbb characters are:
                            const mitBbb = {'D': 'ⅅ', 'd': 'ⅆ', 'e': 'ⅇ', 'i': 'ⅈ', 'j': 'ⅉ'};
                            return mitBbb[c];
                        }
                        return mathFonts[c][mathStyle];
                    }
                }
            }
        }

        // Check built-in control words
        let symbol = controlWords[cw];
        if (symbol != undefined)
            return symbol;
        // Not a control word: display it in upright type
        return '"' + match + '"';
    });
    return res;
}

const keys = Object.keys(controlWords);

function getPartialMatches(cw) {
    // Get array of control-word partial matches for autocomplete drop down
    let cKeys = keys.length;
    let iMax = cKeys - 1;
    let iMid;
    let iMin = 0;
    let key
    let matches = [];

    do {                                // Binary search for a partial match
        iMid = Math.floor((iMin + iMax) / 2);
        key = keys[iMid];
        if (key.startsWith(cw)) {
            matches.push(key + ' ' + controlWords[key]);
            break;
        }
        if (cw < key)
            iMax = iMid - 1;
        else
            iMin = iMid + 1;
    } while (iMin <= iMax);

    if (matches.length) {
        // Check for partial matches preceding iMid
        for (let j = iMid - 1; j >= 0; j--) {
            key = keys[j];
            if (!key.startsWith(cw))
                break;
            // Matched: insert at start of matches[]
            matches.unshift(key + ' ' + controlWords[key]);
        }
        // Check for partial matches following iMid
        for (let j = iMid + 1; j < cKeys; j++) {
            key = keys[j];
            if (!key.startsWith(cw))
                break;
            matches.push(key + ' ' + controlWords[key]);
        }
    }
    return matches;
}

const negs = {
    '<': '≮',   // /<
    '=': '≠',   // /=
    '>': '≯',   // />
    '~': '≁',   // /\sim
    '∃': '∄',  // /\exists
    '∈': '∉',  // /\in
    '∋': '∌',  // /\ni
    '∼': '≁',   // /\sim
    '≃': '≄',   // /\simeq
    '≅': '≇',   // /\cong
    '≈': '≉',   // /\approx
    '≍': '≭',   // /\asymp
    '≡': '≢',   // /\equiv
    '≤': '≰',   // /\le
    '≥': '≱',   // /\ge
    '≶': '≸',   // /\lessgtr
    '≷': '≹',   // /\gtrless
    '≺': '⊀',   // /\prec
    '≻': '⊁',   // /\succ
    '⪯': '⪱',  // /\preceq
    '⪰': '⪲',  // /\succeq
    '⊂': '⊄',  // /\subset
    '⊃': '⊅',  // /\supset
    '⊆': '⊈',  // /\subseteq
    '⊇': '⊉',  // /\supseteq
    '⊑': '⋢',   // /\sqsubseteq
    '⊒': '⋣'    // /\sqsupseteq
};

// Math-alphanumeric-style conversions
const mathFonts = {
    // Courtesy of https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
    // and sublime text's multiple cursors. The math style names are the unicode-math
    // style names in https://texdoc.org/serve/unimath-symbols.pdf/0

    'A': {'mbf': '𝐀', 'mit': '𝐴', 'mbfit': '𝑨', 'msans': '𝖠', 'mbfsans': '𝗔', 'mitsans': '𝘈', 'mbfitsans': '𝘼', 'mscr': '𝒜', 'mbfscr': '𝓐', 'mfrak': '𝔄', 'mbffrak': '𝕬', 'mtt': '𝙰', 'Bbb': '𝔸'},
    'B': {'mbf': '𝐁', 'mit': '𝐵', 'mbfit': '𝑩', 'msans': '𝖡', 'mbfsans': '𝗕', 'mitsans': '𝘉', 'mbfitsans': '𝘽', 'mscr': 'ℬ', 'mbfscr': '𝓑', 'mfrak': '𝔅', 'mbffrak': '𝕭', 'mtt': '𝙱', 'Bbb': '𝔹'},
    'C': {'mbf': '𝐂', 'mit': '𝐶', 'mbfit': '𝑪', 'msans': '𝖢', 'mbfsans': '𝗖', 'mitsans': '𝘊', 'mbfitsans': '𝘾', 'mscr': '𝒞', 'mbfscr': '𝓒', 'mfrak': 'ℭ', 'mbffrak': '𝕮', 'mtt': '𝙲', 'Bbb': 'ℂ'},
    'D': {'mbf': '𝐃', 'mit': '𝐷', 'mbfit': '𝑫', 'msans': '𝖣', 'mbfsans': '𝗗', 'mitsans': '𝘋', 'mbfitsans': '𝘿', 'mscr': '𝒟', 'mbfscr': '𝓓', 'mfrak': '𝔇', 'mbffrak': '𝕯', 'mtt': '𝙳', 'Bbb': '𝔻'},
    'E': {'mbf': '𝐄', 'mit': '𝐸', 'mbfit': '𝑬', 'msans': '𝖤', 'mbfsans': '𝗘', 'mitsans': '𝘌', 'mbfitsans': '𝙀', 'mscr': 'ℰ', 'mbfscr': '𝓔', 'mfrak': '𝔈', 'mbffrak': '𝕰', 'mtt': '𝙴', 'Bbb': '𝔼'},
    'F': {'mbf': '𝐅', 'mit': '𝐹', 'mbfit': '𝑭', 'msans': '𝖥', 'mbfsans': '𝗙', 'mitsans': '𝘍', 'mbfitsans': '𝙁', 'mscr': 'ℱ', 'mbfscr': '𝓕', 'mfrak': '𝔉', 'mbffrak': '𝕱', 'mtt': '𝙵', 'Bbb': '𝔽'},
    'G': {'mbf': '𝐆', 'mit': '𝐺', 'mbfit': '𝑮', 'msans': '𝖦', 'mbfsans': '𝗚', 'mitsans': '𝘎', 'mbfitsans': '𝙂', 'mscr': '𝒢', 'mbfscr': '𝓖', 'mfrak': '𝔊', 'mbffrak': '𝕲', 'mtt': '𝙶', 'Bbb': '𝔾'},
    'H': {'mbf': '𝐇', 'mit': '𝐻', 'mbfit': '𝑯', 'msans': '𝖧', 'mbfsans': '𝗛', 'mitsans': '𝘏', 'mbfitsans': '𝙃', 'mscr': 'ℋ', 'mbfscr': '𝓗', 'mfrak': 'ℌ', 'mbffrak': '𝕳', 'mtt': '𝙷', 'Bbb': 'ℍ'},
    'I': {'mbf': '𝐈', 'mit': '𝐼', 'mbfit': '𝑰', 'msans': '𝖨', 'mbfsans': '𝗜', 'mitsans': '𝘐', 'mbfitsans': '𝙄', 'mscr': 'ℐ', 'mbfscr': '𝓘', 'mfrak': 'ℑ', 'mbffrak': '𝕴', 'mtt': '𝙸', 'Bbb': '𝕀'},
    'J': {'mbf': '𝐉', 'mit': '𝐽', 'mbfit': '𝑱', 'msans': '𝖩', 'mbfsans': '𝗝', 'mitsans': '𝘑', 'mbfitsans': '𝙅', 'mscr': '𝒥', 'mbfscr': '𝓙', 'mfrak': '𝔍', 'mbffrak': '𝕵', 'mtt': '𝙹', 'Bbb': '𝕁'},
    'K': {'mbf': '𝐊', 'mit': '𝐾', 'mbfit': '𝑲', 'msans': '𝖪', 'mbfsans': '𝗞', 'mitsans': '𝘒', 'mbfitsans': '𝙆', 'mscr': '𝒦', 'mbfscr': '𝓚', 'mfrak': '𝔎', 'mbffrak': '𝕶', 'mtt': '𝙺', 'Bbb': '𝕂'},
    'L': {'mbf': '𝐋', 'mit': '𝐿', 'mbfit': '𝑳', 'msans': '𝖫', 'mbfsans': '𝗟', 'mitsans': '𝘓', 'mbfitsans': '𝙇', 'mscr': 'ℒ', 'mbfscr': '𝓛', 'mfrak': '𝔏', 'mbffrak': '𝕷', 'mtt': '𝙻', 'Bbb': '𝕃'},
    'M': {'mbf': '𝐌', 'mit': '𝑀', 'mbfit': '𝑴', 'msans': '𝖬', 'mbfsans': '𝗠', 'mitsans': '𝘔', 'mbfitsans': '𝙈', 'mscr': 'ℳ', 'mbfscr': '𝓜', 'mfrak': '𝔐', 'mbffrak': '𝕸', 'mtt': '𝙼', 'Bbb': '𝕄'},
    'N': {'mbf': '𝐍', 'mit': '𝑁', 'mbfit': '𝑵', 'msans': '𝖭', 'mbfsans': '𝗡', 'mitsans': '𝘕', 'mbfitsans': '𝙉', 'mscr': '𝒩', 'mbfscr': '𝓝', 'mfrak': '𝔑', 'mbffrak': '𝕹', 'mtt': '𝙽', 'Bbb': 'ℕ'},
    'O': {'mbf': '𝐎', 'mit': '𝑂', 'mbfit': '𝑶', 'msans': '𝖮', 'mbfsans': '𝗢', 'mitsans': '𝘖', 'mbfitsans': '𝙊', 'mscr': '𝒪', 'mbfscr': '𝓞', 'mfrak': '𝔒', 'mbffrak': '𝕺', 'mtt': '𝙾', 'Bbb': '𝕆'},
    'P': {'mbf': '𝐏', 'mit': '𝑃', 'mbfit': '𝑷', 'msans': '𝖯', 'mbfsans': '𝗣', 'mitsans': '𝘗', 'mbfitsans': '𝙋', 'mscr': '𝒫', 'mbfscr': '𝓟', 'mfrak': '𝔓', 'mbffrak': '𝕻', 'mtt': '𝙿', 'Bbb': 'ℙ'},
    'Q': {'mbf': '𝐐', 'mit': '𝑄', 'mbfit': '𝑸', 'msans': '𝖰', 'mbfsans': '𝗤', 'mitsans': '𝘘', 'mbfitsans': '𝙌', 'mscr': '𝒬', 'mbfscr': '𝓠', 'mfrak': '𝔔', 'mbffrak': '𝕼', 'mtt': '𝚀', 'Bbb': 'ℚ'},
    'R': {'mbf': '𝐑', 'mit': '𝑅', 'mbfit': '𝑹', 'msans': '𝖱', 'mbfsans': '𝗥', 'mitsans': '𝘙', 'mbfitsans': '𝙍', 'mscr': 'ℛ', 'mbfscr': '𝓡', 'mfrak': 'ℜ', 'mbffrak': '𝕽', 'mtt': '𝚁', 'Bbb': 'ℝ'},
    'S': {'mbf': '𝐒', 'mit': '𝑆', 'mbfit': '𝑺', 'msans': '𝖲', 'mbfsans': '𝗦', 'mitsans': '𝘚', 'mbfitsans': '𝙎', 'mscr': '𝒮', 'mbfscr': '𝓢', 'mfrak': '𝔖', 'mbffrak': '𝕾', 'mtt': '𝚂', 'Bbb': '𝕊'},
    'T': {'mbf': '𝐓', 'mit': '𝑇', 'mbfit': '𝑻', 'msans': '𝖳', 'mbfsans': '𝗧', 'mitsans': '𝘛', 'mbfitsans': '𝙏', 'mscr': '𝒯', 'mbfscr': '𝓣', 'mfrak': '𝔗', 'mbffrak': '𝕿', 'mtt': '𝚃', 'Bbb': '𝕋'},
    'U': {'mbf': '𝐔', 'mit': '𝑈', 'mbfit': '𝑼', 'msans': '𝖴', 'mbfsans': '𝗨', 'mitsans': '𝘜', 'mbfitsans': '𝙐', 'mscr': '𝒰', 'mbfscr': '𝓤', 'mfrak': '𝔘', 'mbffrak': '𝖀', 'mtt': '𝚄', 'Bbb': '𝕌'},
    'V': {'mbf': '𝐕', 'mit': '𝑉', 'mbfit': '𝑽', 'msans': '𝖵', 'mbfsans': '𝗩', 'mitsans': '𝘝', 'mbfitsans': '𝙑', 'mscr': '𝒱', 'mbfscr': '𝓥', 'mfrak': '𝔙', 'mbffrak': '𝖁', 'mtt': '𝚅', 'Bbb': '𝕍'},
    'W': {'mbf': '𝐖', 'mit': '𝑊', 'mbfit': '𝑾', 'msans': '𝖶', 'mbfsans': '𝗪', 'mitsans': '𝘞', 'mbfitsans': '𝙒', 'mscr': '𝒲', 'mbfscr': '𝓦', 'mfrak': '𝔚', 'mbffrak': '𝖂', 'mtt': '𝚆', 'Bbb': '𝕎'},
    'X': {'mbf': '𝐗', 'mit': '𝑋', 'mbfit': '𝑿', 'msans': '𝖷', 'mbfsans': '𝗫', 'mitsans': '𝘟', 'mbfitsans': '𝙓', 'mscr': '𝒳', 'mbfscr': '𝓧', 'mfrak': '𝔛', 'mbffrak': '𝖃', 'mtt': '𝚇', 'Bbb': '𝕏'},
    'Y': {'mbf': '𝐘', 'mit': '𝑌', 'mbfit': '𝒀', 'msans': '𝖸', 'mbfsans': '𝗬', 'mitsans': '𝘠', 'mbfitsans': '𝙔', 'mscr': '𝒴', 'mbfscr': '𝓨', 'mfrak': '𝔜', 'mbffrak': '𝖄', 'mtt': '𝚈', 'Bbb': '𝕐'},
    'Z': {'mbf': '𝐙', 'mit': '𝑍', 'mbfit': '𝒁', 'msans': '𝖹', 'mbfsans': '𝗭', 'mitsans': '𝘡', 'mbfitsans': '𝙕', 'mscr': '𝒵', 'mbfscr': '𝓩', 'mfrak': 'ℨ', 'mbffrak': '𝖅', 'mtt': '𝚉', 'Bbb': 'ℤ'},
    'a': {'mbf': '𝐚', 'mit': '𝑎', 'mbfit': '𝒂', 'msans': '𝖺', 'mbfsans': '𝗮', 'mitsans': '𝘢', 'mbfitsans': '𝙖', 'mscr': '𝒶', 'mbfscr': '𝓪', 'mfrak': '𝔞', 'mbffrak': '𝖆', 'mtt': '𝚊', 'Bbb': '𝕒'},
    'b': {'mbf': '𝐛', 'mit': '𝑏', 'mbfit': '𝒃', 'msans': '𝖻', 'mbfsans': '𝗯', 'mitsans': '𝘣', 'mbfitsans': '𝙗', 'mscr': '𝒷', 'mbfscr': '𝓫', 'mfrak': '𝔟', 'mbffrak': '𝖇', 'mtt': '𝚋', 'Bbb': '𝕓'},
    'c': {'mbf': '𝐜', 'mit': '𝑐', 'mbfit': '𝒄', 'msans': '𝖼', 'mbfsans': '𝗰', 'mitsans': '𝘤', 'mbfitsans': '𝙘', 'mscr': '𝒸', 'mbfscr': '𝓬', 'mfrak': '𝔠', 'mbffrak': '𝖈', 'mtt': '𝚌', 'Bbb': '𝕔'},
    'd': {'mbf': '𝐝', 'mit': '𝑑', 'mbfit': '𝒅', 'msans': '𝖽', 'mbfsans': '𝗱', 'mitsans': '𝘥', 'mbfitsans': '𝙙', 'mscr': '𝒹', 'mbfscr': '𝓭', 'mfrak': '𝔡', 'mbffrak': '𝖉', 'mtt': '𝚍', 'Bbb': '𝕕'},
    'e': {'mbf': '𝐞', 'mit': '𝑒', 'mbfit': '𝒆', 'msans': '𝖾', 'mbfsans': '𝗲', 'mitsans': '𝘦', 'mbfitsans': '𝙚', 'mscr': 'ℯ', 'mbfscr': '𝓮', 'mfrak': '𝔢', 'mbffrak': '𝖊', 'mtt': '𝚎', 'Bbb': '𝕖'},
    'f': {'mbf': '𝐟', 'mit': '𝑓', 'mbfit': '𝒇', 'msans': '𝖿', 'mbfsans': '𝗳', 'mitsans': '𝘧', 'mbfitsans': '𝙛', 'mscr': '𝒻', 'mbfscr': '𝓯', 'mfrak': '𝔣', 'mbffrak': '𝖋', 'mtt': '𝚏', 'Bbb': '𝕗'},
    'g': {'mbf': '𝐠', 'mit': '𝑔', 'mbfit': '𝒈', 'msans': '𝗀', 'mbfsans': '𝗴', 'mitsans': '𝘨', 'mbfitsans': '𝙜', 'mscr': 'ℊ', 'mbfscr': '𝓰', 'mfrak': '𝔤', 'mbffrak': '𝖌', 'mtt': '𝚐', 'Bbb': '𝕘'},
    'h': {'mbf': '𝐡', 'mit': 'ℎ', 'mbfit': '𝒉', 'msans': '𝗁', 'mbfsans': '𝗵', 'mitsans': '𝘩', 'mbfitsans': '𝙝', 'mscr': '𝒽', 'mbfscr': '𝓱', 'mfrak': '𝔥', 'mbffrak': '𝖍', 'mtt': '𝚑', 'Bbb': '𝕙'},
    'i': {'mbf': '𝐢', 'mit': '𝑖', 'mbfit': '𝒊', 'msans': '𝗂', 'mbfsans': '𝗶', 'mitsans': '𝘪', 'mbfitsans': '𝙞', 'mscr': '𝒾', 'mbfscr': '𝓲', 'mfrak': '𝔦', 'mbffrak': '𝖎', 'mtt': '𝚒', 'Bbb': '𝕚'},
    'j': {'mbf': '𝐣', 'mit': '𝑗', 'mbfit': '𝒋', 'msans': '𝗃', 'mbfsans': '𝗷', 'mitsans': '𝘫', 'mbfitsans': '𝙟', 'mscr': '𝒿', 'mbfscr': '𝓳', 'mfrak': '𝔧', 'mbffrak': '𝖏', 'mtt': '𝚓', 'Bbb': '𝕛'},
    'k': {'mbf': '𝐤', 'mit': '𝑘', 'mbfit': '𝒌', 'msans': '𝗄', 'mbfsans': '𝗸', 'mitsans': '𝘬', 'mbfitsans': '𝙠', 'mscr': '𝓀', 'mbfscr': '𝓴', 'mfrak': '𝔨', 'mbffrak': '𝖐', 'mtt': '𝚔', 'Bbb': '𝕜'},
    'l': {'mbf': '𝐥', 'mit': '𝑙', 'mbfit': '𝒍', 'msans': '𝗅', 'mbfsans': '𝗹', 'mitsans': '𝘭', 'mbfitsans': '𝙡', 'mscr': '𝓁', 'mbfscr': '𝓵', 'mfrak': '𝔩', 'mbffrak': '𝖑', 'mtt': '𝚕', 'Bbb': '𝕝'},
    'm': {'mbf': '𝐦', 'mit': '𝑚', 'mbfit': '𝒎', 'msans': '𝗆', 'mbfsans': '𝗺', 'mitsans': '𝘮', 'mbfitsans': '𝙢', 'mscr': '𝓂', 'mbfscr': '𝓶', 'mfrak': '𝔪', 'mbffrak': '𝖒', 'mtt': '𝚖', 'Bbb': '𝕞'},
    'n': {'mbf': '𝐧', 'mit': '𝑛', 'mbfit': '𝒏', 'msans': '𝗇', 'mbfsans': '𝗻', 'mitsans': '𝘯', 'mbfitsans': '𝙣', 'mscr': '𝓃', 'mbfscr': '𝓷', 'mfrak': '𝔫', 'mbffrak': '𝖓', 'mtt': '𝚗', 'Bbb': '𝕟'},
    'o': {'mbf': '𝐨', 'mit': '𝑜', 'mbfit': '𝒐', 'msans': '𝗈', 'mbfsans': '𝗼', 'mitsans': '𝘰', 'mbfitsans': '𝙤', 'mscr': 'ℴ', 'mbfscr': '𝓸', 'mfrak': '𝔬', 'mbffrak': '𝖔', 'mtt': '𝚘', 'Bbb': '𝕠'},
    'p': {'mbf': '𝐩', 'mit': '𝑝', 'mbfit': '𝒑', 'msans': '𝗉', 'mbfsans': '𝗽', 'mitsans': '𝘱', 'mbfitsans': '𝙥', 'mscr': '𝓅', 'mbfscr': '𝓹', 'mfrak': '𝔭', 'mbffrak': '𝖕', 'mtt': '𝚙', 'Bbb': '𝕡'},
    'q': {'mbf': '𝐪', 'mit': '𝑞', 'mbfit': '𝒒', 'msans': '𝗊', 'mbfsans': '𝗾', 'mitsans': '𝘲', 'mbfitsans': '𝙦', 'mscr': '𝓆', 'mbfscr': '𝓺', 'mfrak': '𝔮', 'mbffrak': '𝖖', 'mtt': '𝚚', 'Bbb': '𝕢'},
    'r': {'mbf': '𝐫', 'mit': '𝑟', 'mbfit': '𝒓', 'msans': '𝗋', 'mbfsans': '𝗿', 'mitsans': '𝘳', 'mbfitsans': '𝙧', 'mscr': '𝓇', 'mbfscr': '𝓻', 'mfrak': '𝔯', 'mbffrak': '𝖗', 'mtt': '𝚛', 'Bbb': '𝕣'},
    's': {'mbf': '𝐬', 'mit': '𝑠', 'mbfit': '𝒔', 'msans': '𝗌', 'mbfsans': '𝘀', 'mitsans': '𝘴', 'mbfitsans': '𝙨', 'mscr': '𝓈', 'mbfscr': '𝓼', 'mfrak': '𝔰', 'mbffrak': '𝖘', 'mtt': '𝚜', 'Bbb': '𝕤'},
    't': {'mbf': '𝐭', 'mit': '𝑡', 'mbfit': '𝒕', 'msans': '𝗍', 'mbfsans': '𝘁', 'mitsans': '𝘵', 'mbfitsans': '𝙩', 'mscr': '𝓉', 'mbfscr': '𝓽', 'mfrak': '𝔱', 'mbffrak': '𝖙', 'mtt': '𝚝', 'Bbb': '𝕥'},
    'u': {'mbf': '𝐮', 'mit': '𝑢', 'mbfit': '𝒖', 'msans': '𝗎', 'mbfsans': '𝘂', 'mitsans': '𝘶', 'mbfitsans': '𝙪', 'mscr': '𝓊', 'mbfscr': '𝓾', 'mfrak': '𝔲', 'mbffrak': '𝖚', 'mtt': '𝚞', 'Bbb': '𝕦'},
    'v': {'mbf': '𝐯', 'mit': '𝑣', 'mbfit': '𝒗', 'msans': '𝗏', 'mbfsans': '𝘃', 'mitsans': '𝘷', 'mbfitsans': '𝙫', 'mscr': '𝓋', 'mbfscr': '𝓿', 'mfrak': '𝔳', 'mbffrak': '𝖛', 'mtt': '𝚟', 'Bbb': '𝕧'},
    'w': {'mbf': '𝐰', 'mit': '𝑤', 'mbfit': '𝒘', 'msans': '𝗐', 'mbfsans': '𝘄', 'mitsans': '𝘸', 'mbfitsans': '𝙬', 'mscr': '𝓌', 'mbfscr': '𝔀', 'mfrak': '𝔴', 'mbffrak': '𝖜', 'mtt': '𝚠', 'Bbb': '𝕨'},
    'x': {'mbf': '𝐱', 'mit': '𝑥', 'mbfit': '𝒙', 'msans': '𝗑', 'mbfsans': '𝘅', 'mitsans': '𝘹', 'mbfitsans': '𝙭', 'mscr': '𝓍', 'mbfscr': '𝔁', 'mfrak': '𝔵', 'mbffrak': '𝖝', 'mtt': '𝚡', 'Bbb': '𝕩'},
    'y': {'mbf': '𝐲', 'mit': '𝑦', 'mbfit': '𝒚', 'msans': '𝗒', 'mbfsans': '𝘆', 'mitsans': '𝘺', 'mbfitsans': '𝙮', 'mscr': '𝓎', 'mbfscr': '𝔂', 'mfrak': '𝔶', 'mbffrak': '𝖞', 'mtt': '𝚢', 'Bbb': '𝕪'},
    'z': {'mbf': '𝐳', 'mit': '𝑧', 'mbfit': '𝒛', 'msans': '𝗓', 'mbfsans': '𝘇', 'mitsans': '𝘻', 'mbfitsans': '𝙯', 'mscr': '𝓏', 'mbfscr': '𝔃', 'mfrak': '𝔷', 'mbffrak': '𝖟', 'mtt': '𝚣', 'Bbb': '𝕫'},
    'ı': {'mit': '𝚤'},
    'ȷ': {'mit': '𝚥'},
    'Α': {'mbf': '𝚨', 'mit': '𝛢', 'mbfit': '𝜜', 'mbfsans': '𝝖', 'mbfitsans': '𝞐'},
    'Β': {'mbf': '𝚩', 'mit': '𝛣', 'mbfit': '𝜝', 'mbfsans': '𝝗', 'mbfitsans': '𝞑'},
    'Γ': {'mbf': '𝚪', 'mit': '𝛤', 'mbfit': '𝜞', 'mbfsans': '𝝘', 'mbfitsans': '𝞒'},
    'Δ': {'mbf': '𝚫', 'mit': '𝛥', 'mbfit': '𝜟', 'mbfsans': '𝝙', 'mbfitsans': '𝞓'},
    'Ε': {'mbf': '𝚬', 'mit': '𝛦', 'mbfit': '𝜠', 'mbfsans': '𝝚', 'mbfitsans': '𝞔'},
    'Ζ': {'mbf': '𝚭', 'mit': '𝛧', 'mbfit': '𝜡', 'mbfsans': '𝝛', 'mbfitsans': '𝞕'},
    'Η': {'mbf': '𝚮', 'mit': '𝛨', 'mbfit': '𝜢', 'mbfsans': '𝝜', 'mbfitsans': '𝞖'},
    'Θ': {'mbf': '𝚯', 'mit': '𝛩', 'mbfit': '𝜣', 'mbfsans': '𝝝', 'mbfitsans': '𝞗'},
    'Ι': {'mbf': '𝚰', 'mit': '𝛪', 'mbfit': '𝜤', 'mbfsans': '𝝞', 'mbfitsans': '𝞘'},
    'Κ': {'mbf': '𝚱', 'mit': '𝛫', 'mbfit': '𝜥', 'mbfsans': '𝝟', 'mbfitsans': '𝞙'},
    'Λ': {'mbf': '𝚲', 'mit': '𝛬', 'mbfit': '𝜦', 'mbfsans': '𝝠', 'mbfitsans': '𝞚'},
    'Μ': {'mbf': '𝚳', 'mit': '𝛭', 'mbfit': '𝜧', 'mbfsans': '𝝡', 'mbfitsans': '𝞛'},
    'Ν': {'mbf': '𝚴', 'mit': '𝛮', 'mbfit': '𝜨', 'mbfsans': '𝝢', 'mbfitsans': '𝞜'},
    'Ξ': {'mbf': '𝚵', 'mit': '𝛯', 'mbfit': '𝜩', 'mbfsans': '𝝣', 'mbfitsans': '𝞝'},
    'Ο': {'mbf': '𝚶', 'mit': '𝛰', 'mbfit': '𝜪', 'mbfsans': '𝝤', 'mbfitsans': '𝞞'},
    'Π': {'mbf': '𝚷', 'mit': '𝛱', 'mbfit': '𝜫', 'mbfsans': '𝝥', 'mbfitsans': '𝞟'},
    'Ρ': {'mbf': '𝚸', 'mit': '𝛲', 'mbfit': '𝜬', 'mbfsans': '𝝦', 'mbfitsans': '𝞠'},
    'ϴ': {'mbf': '𝚹', 'mit': '𝛳', 'mbfit': '𝜭', 'mbfsans': '𝝧', 'mbfitsans': '𝞡'},
    'Σ': {'mbf': '𝚺', 'mit': '𝛴', 'mbfit': '𝜮', 'mbfsans': '𝝨', 'mbfitsans': '𝞢'},
    'Τ': {'mbf': '𝚻', 'mit': '𝛵', 'mbfit': '𝜯', 'mbfsans': '𝝩', 'mbfitsans': '𝞣'},
    'Υ': {'mbf': '𝚼', 'mit': '𝛶', 'mbfit': '𝜰', 'mbfsans': '𝝪', 'mbfitsans': '𝞤'},
    'Φ': {'mbf': '𝚽', 'mit': '𝛷', 'mbfit': '𝜱', 'mbfsans': '𝝫', 'mbfitsans': '𝞥'},
    'Χ': {'mbf': '𝚾', 'mit': '𝛸', 'mbfit': '𝜲', 'mbfsans': '𝝬', 'mbfitsans': '𝞦'},
    'Ψ': {'mbf': '𝚿', 'mit': '𝛹', 'mbfit': '𝜳', 'mbfsans': '𝝭', 'mbfitsans': '𝞧'},
    'Ω': {'mbf': '𝛀', 'mit': '𝛺', 'mbfit': '𝜴', 'mbfsans': '𝝮', 'mbfitsans': '𝞨'},
    '∇': {'mbf': '𝛁', 'mit': '𝛻', 'mbfit': '𝜵', 'mbfsans': '𝝯', 'mbfitsans': '𝞩'},
    'α': {'mbf': '𝛂', 'mit': '𝛼', 'mbfit': '𝜶', 'mbfsans': '𝝰', 'mbfitsans': '𝞪'},
    'β': {'mbf': '𝛃', 'mit': '𝛽', 'mbfit': '𝜷', 'mbfsans': '𝝱', 'mbfitsans': '𝞫'},
    'γ': {'mbf': '𝛄', 'mit': '𝛾', 'mbfit': '𝜸', 'mbfsans': '𝝲', 'mbfitsans': '𝞬'},
    'δ': {'mbf': '𝛅', 'mit': '𝛿', 'mbfit': '𝜹', 'mbfsans': '𝝳', 'mbfitsans': '𝞭'},
    'ε': {'mbf': '𝛆', 'mit': '𝜀', 'mbfit': '𝜺', 'mbfsans': '𝝴', 'mbfitsans': '𝞮'},
    'ζ': {'mbf': '𝛇', 'mit': '𝜁', 'mbfit': '𝜻', 'mbfsans': '𝝵', 'mbfitsans': '𝞯'},
    'η': {'mbf': '𝛈', 'mit': '𝜂', 'mbfit': '𝜼', 'mbfsans': '𝝶', 'mbfitsans': '𝞰'},
    'θ': {'mbf': '𝛉', 'mit': '𝜃', 'mbfit': '𝜽', 'mbfsans': '𝝷', 'mbfitsans': '𝞱'},
    'ι': {'mbf': '𝛊', 'mit': '𝜄', 'mbfit': '𝜾', 'mbfsans': '𝝸', 'mbfitsans': '𝞲'},
    'κ': {'mbf': '𝛋', 'mit': '𝜅', 'mbfit': '𝜿', 'mbfsans': '𝝹', 'mbfitsans': '𝞳'},
    'λ': {'mbf': '𝛌', 'mit': '𝜆', 'mbfit': '𝝀', 'mbfsans': '𝝺', 'mbfitsans': '𝞴'},
    'μ': {'mbf': '𝛍', 'mit': '𝜇', 'mbfit': '𝝁', 'mbfsans': '𝝻', 'mbfitsans': '𝞵'},
    'ν': {'mbf': '𝛎', 'mit': '𝜈', 'mbfit': '𝝂', 'mbfsans': '𝝼', 'mbfitsans': '𝞶'},
    'ξ': {'mbf': '𝛏', 'mit': '𝜉', 'mbfit': '𝝃', 'mbfsans': '𝝽', 'mbfitsans': '𝞷'},
    'ο': {'mbf': '𝛐', 'mit': '𝜊', 'mbfit': '𝝄', 'mbfsans': '𝝾', 'mbfitsans': '𝞸'},
    'π': {'mbf': '𝛑', 'mit': '𝜋', 'mbfit': '𝝅', 'mbfsans': '𝝿', 'mbfitsans': '𝞹'},
    'ρ': {'mbf': '𝛒', 'mit': '𝜌', 'mbfit': '𝝆', 'mbfsans': '𝞀', 'mbfitsans': '𝞺'},
    'ς': {'mbf': '𝛓', 'mit': '𝜍', 'mbfit': '𝝇', 'mbfsans': '𝞁', 'mbfitsans': '𝞻'},
    'σ': {'mbf': '𝛔', 'mit': '𝜎', 'mbfit': '𝝈', 'mbfsans': '𝞂', 'mbfitsans': '𝞼'},
    'τ': {'mbf': '𝛕', 'mit': '𝜏', 'mbfit': '𝝉', 'mbfsans': '𝞃', 'mbfitsans': '𝞽'},
    'υ': {'mbf': '𝛖', 'mit': '𝜐', 'mbfit': '𝝊', 'mbfsans': '𝞄', 'mbfitsans': '𝞾'},
    'φ': {'mbf': '𝛗', 'mit': '𝜑', 'mbfit': '𝝋', 'mbfsans': '𝞅', 'mbfitsans': '𝞿'},
    'χ': {'mbf': '𝛘', 'mit': '𝜒', 'mbfit': '𝝌', 'mbfsans': '𝞆', 'mbfitsans': '𝟀'},
    'ψ': {'mbf': '𝛙', 'mit': '𝜓', 'mbfit': '𝝍', 'mbfsans': '𝞇', 'mbfitsans': '𝟁'},
    'ω': {'mbf': '𝛚', 'mit': '𝜔', 'mbfit': '𝝎', 'mbfsans': '𝞈', 'mbfitsans': '𝟂'},
    '∂': {'mbf': '𝛛', 'mit': '𝜕', 'mbfit': '𝝏', 'mbfsans': '𝞉', 'mbfitsans': '𝟃'},
    'ϵ': {'mbf': '𝛜', 'mit': '𝜖', 'mbfit': '𝝐', 'mbfsans': '𝞊', 'mbfitsans': '𝟄'},
    'ϑ': {'mbf': '𝛝', 'mit': '𝜗', 'mbfit': '𝝑', 'mbfsans': '𝞋', 'mbfitsans': '𝟅'},
    'ϰ': {'mbf': '𝛞', 'mit': '𝜘', 'mbfit': '𝝒', 'mbfsans': '𝞌', 'mbfitsans': '𝟆'},
    'ϕ': {'mbf': '𝛟', 'mit': '𝜙', 'mbfit': '𝝓', 'mbfsans': '𝞍', 'mbfitsans': '𝟇'},
    'ϱ': {'mbf': '𝛠', 'mit': '𝜚', 'mbfit': '𝝔', 'mbfsans': '𝞎', 'mbfitsans': '𝟈'},
    'ϖ': {'mbf': '𝛡', 'mit': '𝜛', 'mbfit': '𝝕', 'mbfsans': '𝞏', 'mbfitsans': '𝟉'},
    'Ϝ': {'mbf': '𝟊'},
    'ϝ': {'mbf': '𝟋'},
    '0': {'mbf': '𝟎', 'Bbb': '𝟘', 'msans': '𝟢', 'mbfsans': '𝟬', 'mtt': '𝟶'},
    '1': {'mbf': '𝟏', 'Bbb': '𝟙', 'msans': '𝟣', 'mbfsans': '𝟭', 'mtt': '𝟷'},
    '2': {'mbf': '𝟐', 'Bbb': '𝟚', 'msans': '𝟤', 'mbfsans': '𝟮', 'mtt': '𝟸'},
    '3': {'mbf': '𝟑', 'Bbb': '𝟛', 'msans': '𝟥', 'mbfsans': '𝟯', 'mtt': '𝟹'},
    '4': {'mbf': '𝟒', 'Bbb': '𝟜', 'msans': '𝟦', 'mbfsans': '𝟰', 'mtt': '𝟺'},
    '5': {'mbf': '𝟓', 'Bbb': '𝟝', 'msans': '𝟧', 'mbfsans': '𝟱', 'mtt': '𝟻'},
    '6': {'mbf': '𝟔', 'Bbb': '𝟞', 'msans': '𝟨', 'mbfsans': '𝟲', 'mtt': '𝟼'},
    '7': {'mbf': '𝟕', 'Bbb': '𝟟', 'msans': '𝟩', 'mbfsans': '𝟳', 'mtt': '𝟽'},
    '8': {'mbf': '𝟖', 'Bbb': '𝟠', 'msans': '𝟪', 'mbfsans': '𝟴', 'mtt': '𝟾'},
    '9': {'mbf': '𝟗', 'Bbb': '𝟡', 'msans': '𝟫', 'mbfsans': '𝟵', 'mtt': '𝟿'},
};

function isFunctionName(fn) {
    if (!fn.length)
        return false

    if (fn.length >= 4 && fn[0] == 'a') {
        // Remove 'a' or 'arc' trigonmetric prefix
        let i = (fn.substring(1, 3) == 'rc') ? 3 : 1
        fn = fn.substring(i)
    }
    if (fn.length == 4 && fn[3] == 'h')     // Possibly hyperbolic
        fn = fn.substring(0, 3)             // Remove h suffix

    return ["Im", "Pr", "Re", "arg", "cos", "cot", "csc", "ctg", "def", "deg",
        "det", "dim", "erf", "exp", "gcd", "hom", "inf", "ker", "lim", "log",
        "ln", "max", "min", "mod", "sec", "sin", "sup", "tan", "tg"].includes(fn)
}

function foldMathItalic(code) {
    if (code == 0x210E) return 'h';                     // ℎ (Letterlike symbol)
    if (code < 0x1D434 || code > 0x1D467) return '';    // Not math italic
    code += 0x0041 - 0x1D434;                           // Convert to upper-case ASCII
    if (code > 0x005A) code += 0x0061 - 0x005A - 1;     // Adjust for lower case
    return String.fromCodePoint(code);                  // ASCII letter corresponding to math italic code
}

function foldMathItalics(chars) {
    let fn = ""
    let code

    for (let i = 0; i < chars.length; i += code > 0xFFFF ? 2 : 1) {
        let ch = chars[i]
        code = chars.codePointAt(i);
        if (code >= 0x2102) {
            ch = foldMathItalic(code);
        }
        fn += ch;
    }
    return fn;
}

function italicizeCharacter(c) {
    // The 'Α' here is an upper-case Greek alpha
    if (c in mathFonts && 'mit' in mathFonts[c] && (c < 'Α' || c > 'Ω' && c != '∇'))
        return mathFonts[c]['mit'];
    return c;
}

function italicizeCharacters(chars) {
    return Array.from(chars).map(c => {
        if (c in mathFonts && 'mit' in mathFonts[c] && (c < 'Α' || c > 'Ω' && c != '∇')) {
            return mathFonts[c]['mit'];
        } else {
            return c;
        }
    }).join("");
}

function getAbsArg(content) {
    if (Array.isArray(content) && content[0].hasOwnProperty("atoms") &&
        content[0].atoms.length == 1 && content[0].atoms[0].hasOwnProperty("chars")) {
        let arg = content[0].atoms[0].chars;
        let ch = getCh(arg, 0);
        if (ch.length == arg.length)
            return ch;
    }
    return '$a';
}

function getIntervalArg(content, n) {
    if (!Array.isArray(content) || n != 0 && n !=2)
        return '';                          // Invalid content
    let arg = content[n];
    if (Array.isArray(arg))
        arg = arg.flat().join('');
    let ch = getCh(arg, 0);
    if (arg.length > ch.length && !isAsciiDigit(arg[0]) && !'-−+∞'.includes(arg[0]))
        arg = '$' + (n ? 'b' : 'a');
    return arg;
}

function getIntervalEndPoint(arg, content) {
    if (arg[0] == '$') {
        let ret = {atoms: [{chars: content.flat().join('')}]};
        ret.atoms.arg = arg.substring(1);
        return ret;
    }
    return (isAsciiDigit(arg[0])) ? {number: arg} : {atoms: [{chars: arg}]};
}

 function getOrder(high) {
    if (high.hasOwnProperty('expr'))
        return high.expr[0][0].number;

    if (high.hasOwnProperty('atoms'))
        return high.atoms[0].chars;

    if (Array.isArray(high)) {
        if (high[0].hasOwnProperty('number'))
            return high[0].number;
        if (high[0].hasOwnProperty('operator'))
            return '';
        if (high[0].hasOwnProperty('atoms'))
            return high[0].atoms[0].chars;
    }
    return '$n';                            // Order n
}

function getScriptArg(dsty, value) {
    // Include arg property for script high/low given by value
    let arg = value.arg;
    let intent = value.intent;

    if (!arg && Array.isArray(value) && value[0].hasOwnProperty("bracketed"))
        arg = value[0].bracketed.arg;

    if (!arg && !intent)
        return mtransform(dsty, dropOutermostParens(value));

    value = dropOutermostParens(value);
    if (Array.isArray(value) && value[0].hasOwnProperty('expr')) {
        if(arg)
            value[0].expr.arg = arg;
        if (intent)
            value[0].expr.intent = intent;
    } else {
        if(arg)
            value.arg = arg;
        if (intent)
            value.intent = intent;
    }
    return mtransform(dsty, value);
}

function getScript(limit, ref) {
    if (limit == undefined)
        return '';
    if (!Array.isArray(limit)) {
        if (!limit.hasOwnProperty('expr') || !Array.isArray(limit.expr))
            return '';
        limit = limit.expr[0];
    }
    if (limit.length > 1)
        return ref;
    limit = limit[0];

    if (limit.hasOwnProperty('atoms')) {
        if (limit.atoms.hasOwnProperty('chars'))
            return limit.atoms.chars;
        if (Array.isArray(limit.atoms) && limit.atoms[0].hasOwnProperty('chars'))
            return limit.atoms[0].chars;
    }
    if (limit.hasOwnProperty('number')) {
        return limit.number;
    }
    return ref;
}

function getVariable(arg) {
    // Return atomic variables as is; return '$' if an arg reference
    // is needed.
    if (!Array.isArray(arg) || !arg[0].hasOwnProperty('atoms') ||
        arg[0].atoms.length > 1 || !arg[0].atoms[0].hasOwnProperty('chars')) {
        return '$';
    }
    let ch = getCh(arg[0].atoms[0].chars, 0);
    return ch.length == arg[0].atoms[0].chars.length ? ch : '$';
}

function getDifferentialInfo(of, n) {
    // Get [differential-d, order, of/wrt] for a derivative of the form dy/dx.
    // n = 0 is for numerator and 'of' (argument, e.g, y). n = 1 for denominator
    // and wrt (e.g., x).
    let arg = of[n];
    let darg = '';                          // Differential argument/variable
    let order = '1';                        // Derivative order
    let script = false;
    let arg1;

    if (n != 0 && n != 1 || !Array.isArray(arg))
        return [0, 0, 0];                   // Can't be differential

    arg = arg[0];
    if (arg == undefined)
        return [0, 0, 0];                   // Can't be differential

    if (arg.hasOwnProperty('expr')) {       // Happens if argument was bracketed
        arg = arg.expr;
        if (Array.isArray(arg))
            arg = arg[0];
        if (Array.isArray(arg)) {
            if (arg.length > 1)
                arg1 = arg[1];
            arg = arg[0];
        }
    }

    if (arg.hasOwnProperty('function')) {
        arg = arg.function.f;
        if (n == 1 && arg.hasOwnProperty('atoms') &&
            arg.atoms.hasOwnProperty('chars')) {
            // Function in denominator, For, e.g., ⅆ/ⅆ𝑧⁡arcsin⁡𝑧.
            // Get diffentiation variable, here 𝑧
            let chars = arg.atoms.chars;
            let chD = getCh(chars, 0);
            let iOff = chD.length;

            if (!'dⅆ∂𝑑𝜕'.includes(chD))
                return [0, 0, 0];           // Not a differential
            if (chars[iOff] == ',')
                iOff++;
            return [chD, order, chars.substring(iOff)];
        }
    }
    let chD = getChD(arg);
    if (!chD)
        return [0, 0, 0];                   // Not a differential
    let cchChD = chD.length;

    if (arg.hasOwnProperty('script')) {     // For, e.g., 𝑑𝑥², 𝑑²𝑓(𝑥), ⅆ²𝛾^∗, ⅆ𝛾^∗
        if (arg.script.hasOwnProperty('high')) {
            order = getOrder(arg.script.high);
            if (!arg1 && !order) {          // For, e.g., ⅆ𝛾^∗
                order = '1';
                darg = '$f';
            }
        }
        arg = arg.script.base;
        script = true;
    }

    if (n == 1) {                           // Denominator
        if (script) {                       // Non-script handled further down
            let chars = getChars(arg);
            darg = chars.substring(cchChD); // wrt, e.g., 𝑥 in 𝑑𝑥² or 𝑥′ in 𝑑𝑥′²
        }  else {
            // Get differentiation variable(s) in denominator with no superscript
            // e.g., 𝑥, 𝑡 in 𝜕²𝜓(𝑥,𝑡)/𝜕𝑥𝜕𝑡, 𝑥 in 𝑑𝑦/𝑑𝑥, 𝑥, 𝑥′ in 𝜕²𝑓(𝑥,𝑥′)/𝜕𝑥𝜕𝑥′
            let primes = 0;
            if (arg.hasOwnProperty('primed')) {
                primes = arg.primed.primes; // For, e.g., 𝜕²𝑓(𝑥,𝑥′)/𝜕𝑥𝜕𝑥′
                arg = arg.primed.base;
            }
            let cch = arg.atoms[0].chars.length;
            let chD1 = chD;
            let k = 1;                      // Numeric differentiation order
            darg = [];                      // Gets differentiation (wrt) variable(s)

            for (let i = cchChD; cch > i && chD1 == chD; k++) {
                let chWrt = getCh(arg.atoms[0].chars, i); // Get wrt char
                if (primes && i + chWrt.length >= cch)
                    chWrt += processPrimes(primes);
                darg.push(chWrt);
                i += chWrt.length;          // Advance char offset
                if (cch <= i)
                    break;                  // Done
                chD1 = getCh(arg.atoms[0].chars, i);
                i += cchChD;
            }
            order = k.toString();
        }
    } else {                                // Numerator (n = 0)
        if (script) {                       // For, e.g., 𝑑²𝑓(𝑥)
            if (!arg1 && of[0].length > 1)
                arg1 = of[0][1];
            if (arg1) {
                if (arg1.hasOwnProperty('script') || arg1.hasOwnProperty('primed') ||
                    arg1.hasOwnProperty('function') || of[0].length > 2) {
                    darg = '$f';
                } else if (arg1.hasOwnProperty('atoms')) {
                    darg = getCh(arg1.atoms[0].chars, 0); // Derivative argument
                }
            }
        } else if (of[0].length > 0 && arg.hasOwnProperty('atoms')) {
            // For, e.g., 𝑑𝑓(𝑥)
            arg = arg.atoms;
            if (Array.isArray(arg))
                arg = arg[0];
            if (arg.chars.length == cchChD) {
                // No char preceding '('. Handle cases like ⅆ(tan x)/ⅆx
                if (of[0].length > 1 && of[0][1].hasOwnProperty('bracketed')) {
                    of[0][1].bracketed.arg = 'f';
                    darg = '$f';
                }
            } else if (arg.hasOwnProperty('funct')) {
                darg = '$f';                     // 𝑑𝑓⁡(𝑥)/𝑑𝑥 (\u2061 follows 𝑓)
            } else {                             // Get function name char
                if (arg.chars[cchChD] == ',')
                    cchChD++;
                darg = getCh(arg.chars, cchChD); // Derivative function
                if (of[0].length > 1) {
                    darg = '$f';                 // Ref for derivative function
                }
            }
        } else if (arg.hasOwnProperty('primed')) {
            darg = '$f';
        }
    }
    return [chD, order, darg];
}

// mapping betwen codepoint ranges in astral planes and bmp's private use area
const astralPrivateMap = [

    // dummy entry
    {astral: {begin: 0, end: 0}, private: {begin: 0, end: 0}},

    // Mathematical Alphanumeric Symbols
    {astral: {begin: 0x1D400, end: 0x1D7FF}, private: {begin: 0xE000, end: 0xE3FF}},

    // emoji (generated by ../utils/emoji.py)
    {astral: {begin: 0x1F004, end: 0x1F004}, private: {begin: 0xE400, end: 0xE400}},
    {astral: {begin: 0x1F0CF, end: 0x1F0CF}, private: {begin: 0xE401, end: 0xE401}},
    {astral: {begin: 0x1F18E, end: 0x1F18E}, private: {begin: 0xE402, end: 0xE402}},
    {astral: {begin: 0x1F191, end: 0x1F19A}, private: {begin: 0xE403, end: 0xE40C}},
    {astral: {begin: 0x1F1E6, end: 0x1F1FF}, private: {begin: 0xE40D, end: 0xE426}},
    {astral: {begin: 0x1F201, end: 0x1F201}, private: {begin: 0xE427, end: 0xE427}},
    {astral: {begin: 0x1F21A, end: 0x1F21A}, private: {begin: 0xE428, end: 0xE428}},
    {astral: {begin: 0x1F22F, end: 0x1F22F}, private: {begin: 0xE429, end: 0xE429}},
    {astral: {begin: 0x1F232, end: 0x1F236}, private: {begin: 0xE42A, end: 0xE42E}},
    {astral: {begin: 0x1F238, end: 0x1F23A}, private: {begin: 0xE42F, end: 0xE431}},
    {astral: {begin: 0x1F250, end: 0x1F251}, private: {begin: 0xE432, end: 0xE433}},
    {astral: {begin: 0x1F300, end: 0x1F320}, private: {begin: 0xE434, end: 0xE454}},
    {astral: {begin: 0x1F32D, end: 0x1F335}, private: {begin: 0xE455, end: 0xE45D}},
    {astral: {begin: 0x1F337, end: 0x1F37C}, private: {begin: 0xE45E, end: 0xE4A3}},
    {astral: {begin: 0x1F37E, end: 0x1F393}, private: {begin: 0xE4A4, end: 0xE4B9}},
    {astral: {begin: 0x1F3A0, end: 0x1F3CA}, private: {begin: 0xE4BA, end: 0xE4E4}},
    {astral: {begin: 0x1F3CF, end: 0x1F3D3}, private: {begin: 0xE4E5, end: 0xE4E9}},
    {astral: {begin: 0x1F3E0, end: 0x1F3F0}, private: {begin: 0xE4EA, end: 0xE4FA}},
    {astral: {begin: 0x1F3F4, end: 0x1F3F4}, private: {begin: 0xE4FB, end: 0xE4FB}},
    {astral: {begin: 0x1F3F8, end: 0x1F43E}, private: {begin: 0xE4FC, end: 0xE542}},
    {astral: {begin: 0x1F440, end: 0x1F440}, private: {begin: 0xE543, end: 0xE543}},
    {astral: {begin: 0x1F442, end: 0x1F4FC}, private: {begin: 0xE544, end: 0xE5FE}},
    {astral: {begin: 0x1F4FF, end: 0x1F53D}, private: {begin: 0xE5FF, end: 0xE63D}},
    {astral: {begin: 0x1F54B, end: 0x1F54E}, private: {begin: 0xE63E, end: 0xE641}},
    {astral: {begin: 0x1F550, end: 0x1F567}, private: {begin: 0xE642, end: 0xE659}},
    {astral: {begin: 0x1F57A, end: 0x1F57A}, private: {begin: 0xE65A, end: 0xE65A}},
    {astral: {begin: 0x1F595, end: 0x1F596}, private: {begin: 0xE65B, end: 0xE65C}},
    {astral: {begin: 0x1F5A4, end: 0x1F5A4}, private: {begin: 0xE65D, end: 0xE65D}},
    {astral: {begin: 0x1F5FB, end: 0x1F64F}, private: {begin: 0xE65E, end: 0xE6B2}},
    {astral: {begin: 0x1F680, end: 0x1F6C5}, private: {begin: 0xE6B3, end: 0xE6F8}},
    {astral: {begin: 0x1F6CC, end: 0x1F6CC}, private: {begin: 0xE6F9, end: 0xE6F9}},
    {astral: {begin: 0x1F6D0, end: 0x1F6D2}, private: {begin: 0xE6FA, end: 0xE6FC}},
    {astral: {begin: 0x1F6D5, end: 0x1F6D5}, private: {begin: 0xE6FD, end: 0xE6FD}},
    {astral: {begin: 0x1F6EB, end: 0x1F6EC}, private: {begin: 0xE6FE, end: 0xE6FF}},
    {astral: {begin: 0x1F6F4, end: 0x1F6FA}, private: {begin: 0xE700, end: 0xE706}},
    {astral: {begin: 0x1F7E0, end: 0x1F7EB}, private: {begin: 0xE707, end: 0xE712}},
    {astral: {begin: 0x1F90D, end: 0x1F93A}, private: {begin: 0xE713, end: 0xE740}},
    {astral: {begin: 0x1F93C, end: 0x1F945}, private: {begin: 0xE741, end: 0xE74A}},
    {astral: {begin: 0x1F947, end: 0x1F971}, private: {begin: 0xE74B, end: 0xE775}},
    {astral: {begin: 0x1F973, end: 0x1F976}, private: {begin: 0xE776, end: 0xE779}},
    {astral: {begin: 0x1F97A, end: 0x1F9A2}, private: {begin: 0xE77A, end: 0xE7A2}},
    {astral: {begin: 0x1F9A5, end: 0x1F9AA}, private: {begin: 0xE7A3, end: 0xE7A8}},
    {astral: {begin: 0x1F9AE, end: 0x1F9CA}, private: {begin: 0xE7A9, end: 0xE7C5}},
    {astral: {begin: 0x1F9CD, end: 0x1F9FF}, private: {begin: 0xE7C6, end: 0xE7F8}},
    {astral: {begin: 0x1FA70, end: 0x1FA73}, private: {begin: 0xE7F9, end: 0xE7FC}},
    {astral: {begin: 0x1FA78, end: 0x1FA7A}, private: {begin: 0xE7FD, end: 0xE7FF}},
    {astral: {begin: 0x1FA80, end: 0x1FA82}, private: {begin: 0xE800, end: 0xE802}},
    {astral: {begin: 0x1FA90, end: 0x1FA95}, private: {begin: 0xE803, end: 0xE808}}
];

// carries out all codepoint range sustitutions listed in astralPrivateMap on
// the passed string
function mapToPrivate(s) {
    let u = '';                             // Collects mapped string

    for (let i = 0; i < s.length; i++) {
        let cp = s.codePointAt(i);
        if (cp <= 0xFFFF) {
            // Convert numeric fractions like ¹²/₃₄₅ to UnicodeMath small
            // numeric fractions, e.g., 12⊘345. This is tricky to do with
            // the peg grammar since it handles Unicode subsup digits as
            // operators (see opScript). Require numerator and denominator
            // each to have at least one digit.
            if (cp >= 0x2080 && cp <= 0x2089 && i >= 2 &&
                (s[i - 1] == '/' || s[i - 1] == '\u2044')) {
                let j = i - 2;
                let numerator = '';

                while (j >= 0) {
                    let digit = foldSupDigit(s[j]);
                    if (!digit)
                        break;
                    numerator = digit + numerator;
                    j--;
                }
                j++;
                let k = i;
                let denominator = '';

                if (i - j >= 2) {
                    while (k < s.length) {
                        if (!inRange('₀', s[k], '₉'))
                            break;
                        denominator += String.fromCharCode(s[k].codePointAt(0) - 0x2050);
                        k++;
                    }
                    if (k - i >= 1) {
                        // Convert valid Unicode numeric fraction to
                        // UnicodeMath small numeric fraction
                        u = u.substring(0, u.length - (i - j)) + ' ' +
                            numerator + '⊘' + denominator + ' ';
                        i = k - 1;
                        continue;
                    }
                }
            }
            u += s[i]
            continue;
        }

        // go over all entries of the substitution map substituting if a match
        // is found. this could be more efficient, but it's not even close to
        // being a bottleneck
        let found = false;
        for (let m of astralPrivateMap) {
            if (m.astral.begin <= cp && cp <= m.astral.end) {
                u += String.fromCodePoint(m.private.begin + (cp - m.astral.begin));
                found = true;
                break;
            }
        }
        if (!found)                         // E.g., 🕷 (1F577)
            u += s[i] + s[i + 1];           // Copy surrogate pair
        i++;                                // Bypass lead surrogate
    }
    return u;
}

// inverts all codepoint range sustitutions listed in astralPrivateMap on the
// passed string
function mapFromPrivate(s) {
    return Array.from(s).map(c => {
        let cp = c.codePointAt(0);

        // do nothing if character is not in Private Use Area
        if (cp < 0xE000 || 0xF8FF < cp) {
            return c;
        }

        // go over all entries of the substitution map and and subsitute if a
        // match is found. this could be more efficient, but it's not even close
        // to being a bottleneck
        for (let m of astralPrivateMap) {
            if (m.private.begin <= cp && cp <= m.private.end) {
                c = String.fromCodePoint(m.astral.begin + (cp - m.private.begin));
                break;
            }
        }
        return c;
    }).join('');
}

// maps the conversion over an AST (represented as a nested object)
function astMapFromPrivate(ast) {
    if (ast == null) {
        return null;
    } else if (Array.isArray(ast)) {
        return ast.map(e => astMapFromPrivate(e));
    } else if (typeof ast === 'string') {
        return mapFromPrivate(ast);
    } else {
        for (let [key, value] of Object.entries(ast)) {
            ast[key] = astMapFromPrivate(value);
        }
        return ast;
    }
}

// simple tracing helper
function SimpleTracer() {
    this.traceLog = [];
    this.indent = 0;

    this.log = event => {
        this.traceLog.push(
                    event.location.start.line + ":" + event.location.start.column
            //+ "-" + event.location.end.line + ":" + event.location.end.column
            + " " + event.type.padEnd(10, " ")
            + " " + "  ".repeat(this.indent) + event.rule
        );
    }

    this.trace = event => {
        switch (event.type) {
          case "rule.enter":
            this.log(event);
            this.indent++;
            break;
          case "rule.match":
          case "rule.fail":
            this.indent--;
            this.log(event);
            break;
        }
    }

    this.reset = () => {
        this.traceLog = [];
    }

    // prettify trace log with colors
    this.traceLogHTML = () => {
        return this.traceLog.map(line => {
            if (line.indexOf('rule.match') !== -1) {
                return '<span class="match">' + line + '</span>';
            } else if (line.indexOf('rule.fail') !== -1) {
                return '<span class="fail">' + line + '</span>';
            } else {
                return line;
            }
        });
    };
}

function matrixRows(n, m) {
    // Generate matrix rows for identity and null matrices
    const b = [];

    let fIdentity = false;
    if (!m) {
        m = n;
        fIdentity = true;
    }

    for (let i = 0; i < n; i++) {
        const a = [];

        for (let j = 0; j < m; j++) {
            let x = '\u2B1A';
            if (fIdentity)
                x = i == j ? 1 : 0;
            a.push({expr: [[{number: x}]]});
        }
        b.push({mrow: a});
    }
    return {mrows: b};
}

// parse a string containing a UnicodeMath term to a UnicodeMath AST
function parse(unicodemath) {
    if (typeof ummlConfig !== "undefined" && typeof ummlConfig.resolveControlWords !== "undefined" && ummlConfig.resolveControlWords) {
        unicodemath = resolveCW(unicodemath);
    }
    unicodemath = mapToPrivate(unicodemath);

    let uast;
    if (typeof ummlConfig === "undefined" || typeof ummlConfig.tracing === "undefined" || !ummlConfig.tracing) {

        // no tracing
        uast = ummlParser.parse(unicodemath);
    } else {

        // tracing
        let tracer = new SimpleTracer();
        try {
            uast = ummlParser.parse(unicodemath, {tracer: tracer});
        } finally {

            // output trace (independent of whether the parse was successful or
            // not, hence the weird try..finally). the output_trace element is
            // defined in the playground
            if (output_trace) {
                output_trace.innerHTML = tracer.traceLogHTML().join('\n');
            }
            //debugLog(tracer.traceLog);
            tracer.reset();
        }
    }
    uast = astMapFromPrivate(uast);
    return uast;
}


///////////////
// UTILITIES //
///////////////

// get key (i.e. name) and value of an AST node
function k(ast) {
    return Object.keys(ast)[0];
}
function v(ast) {
    return Object.values(ast)[0];
}

// generate the structure inside each MathML AST node – basically, a MathML AST
// node is {TAG_NAME: {attributes: DICTIONARY_OF_ATTRIBUTES_AND_VALUES, content:
// INNER_MATHML}}
function noAttr(v) {
    return {attributes: {}, content: v};
}
function withAttrs(attrs, v) {
    return {attributes: attrs, content: v};
}

// clone an AST (i.e. an object or array containing only objects, arrays or
// simple types). based on https://stackoverflow.com/a/53737490, test:
/*
var a = {b: "c", d: ["e", 7]};
var aCopy = a;
var aClone = clone(a);
a.d[1] = 1;
console.log(a);
console.log(aCopy);
console.log(aClone);
*/
function clone(object) {
    if (object !== Object(object)) return object /*
    —— Check if the object belongs to a primitive data type */

    const _object = Array.isArray(object)
      ? []
      : Object.create(Object.getPrototypeOf(object)) /*
        —— Assign [[Prototype]] for inheritance */

    Reflect.ownKeys(object).forEach(key =>
        defineProp(_object, key, { value: clone(object[key]) }, object)
    )
    return _object

    function defineProp(object, key, descriptor = {}, copyFrom = {}) {
      const { configurable: _configurable, writable: _writable }
        = Object.getOwnPropertyDescriptor(object, key)
        || { configurable: true, writable: true }

      const test = _configurable // Can redefine property
        && (_writable === undefined || _writable) // Can assign to property

      if (!test || arguments.length <= 2) return test

      const basisDesc = Object.getOwnPropertyDescriptor(copyFrom, key)
        || { configurable: true, writable: true } // Custom…
        || {}; // …or left to native default settings

      ["get", "set", "value", "writable", "enumerable", "configurable"]
        .forEach(attr =>
          descriptor[attr] === undefined &&
          (descriptor[attr] = basisDesc[attr])
        )

      const { get, set, value, writable, enumerable, configurable }
        = descriptor

      return Object.defineProperty(object, key, {
        enumerable, configurable, ...get || set
          ? { get, set } // Accessor descriptor
          : { value, writable } // Data descriptor
      })
    }
}

// compute a list of nary options based on a bit mask
function naryOptions(mask) {
    if (mask < 0 || mask > 159)
        throw "nary mask is not between 0 and 159";

    let options = [];

    // first block
    switch (mask % 4) {
        case 0:
            options.push("nLimitsDefault");
            break;
        case 1:
            options.push("nLimitsUnderOver");
            break;
        case 2:
            options.push("nLimitsSubSup");
            break;
        case 3:
            options.push("nUpperLimitAsSuperScript");
            break;
    }
    mask -= mask % 4;

    // second block
    switch (mask % 32) {
        case 0:
            break;
        case 4:
            options.push("nLimitsOpposite");
            break;
        case 8:
            options.push("nShowLowLimitPlaceHolder");
            break;
        case 12:
            options.push("nLimitsOpposite");
            options.push("nShowLowLimitPlaceHolder");
            break;
        case 16:
            options.push("nShowUpLimitPlaceHolder");
            break;
        case 20:
            options.push("nLimitsOpposite");
            options.push("nShowUpLimitPlaceHolder");
            break;
        case 24:
            options.push("nShowLowLimitPlaceHolder");
            options.push("nShowUpLimitPlaceHolder");
            break;
        case 28:
            options.push("nLimitsOpposite");
            options.push("nShowLowLimitPlaceHolder");
            options.push("nShowUpLimitPlaceHolder");
            break;
    }
    mask -= mask % 32;

    // third block
    if (mask == 64) {
        options.push("fDontGrowWithContent");
    } else if (mask == 128) {
        options.push("fGrowWithContent");
    }
    return options;
}

function enclosureAttrs(mask, symbol) {
    if (mask < 0 || mask > 255)
        throw "enclosure mask is not between 0 and 255";

    // get classes corresponding to mask
    let ret = "";
    if (mask != null) {
        mask ^= 15;                         // spec inverts low 4 bits
        let binMask = mask.toString(2).split('').reverse().join('');
        let classes = []

        for (let i = binMask.length - 1; i >= 0; i--) {
            if (binMask[i] == '1')
                classes.push(maskClasses[Math.pow(2, i)]);
        }
        ret = classes.join(' ');
    } else if (symbol != null) {
        ret += symbolClasses[symbol];
    }
    return ret;
}

// compute a list of abstract box options based on a bit mask
function abstractBoxOptions(mask) {
    // nAlignBaseline 0
    // nAlignCenter 1
    //
    // nSpaceDefault 0
    // nSpaceUnary 4
    // nSpaceBinary 8
    // nSpaceRelational 12
    // nSpaceSkip 16
    // nSpaceOrd 20
    // nSpaceDifferential 24
    //
    // nSizeDefault 0
    // nSizeText 32
    // nSizeScript 64
    // nSizeScriptScript 96
    //
    // fBreakable 128
    // fXPositioning 256
    // fXSpacing 512

    let options = []

    // align
    switch (mask % 2) {
        case 0:
            options.push("nAlignBaseline");
            break;
        case 1:
            options.push("nAlignCenter");
            break;
    }
    mask -= mask % 4;

    // space
    switch (mask % 32) {
        case 0:
            options.push("nSpaceDefault");
            break;
        case 4:
            options.push("nSpaceUnary");
            break;
        case 8:
            options.push("nSpaceBinary");
            break;
        case 12:
            options.push("nSpaceRelational");
            break;
        case 16:
            options.push("nSpaceSkip");
            break;
        case 20:
            options.push("nSpaceOrd");
            break;
        case 24:
            options.push("nSpaceDifferential");
            break;
    }
    mask -= mask % 32;

    // size
    switch (mask % 128) {
        case 0:
            options.push("nSizeDefault");
            break;
        case 32:
            options.push("nSizeText");
            break;
        case 64:
            options.push("nSizeScript");
            break;
        case 96:
            options.push("nSizeScriptScript");
            break;
    }
    mask -= mask % 128;

    // others
    if (mask != 0) {
        if (mask % 128 == 0) {
            options.push("fBreakable");
        }
        if (mask % 256 == 0) {
            options.push("fXPositioning");
        }
        if (mask % 512 == 0) {
            options.push("fXSpacing");
        }
    }
    return options;
}

// should a diacritic be placed above (1), on top of (0), or under (-1) a
// character? (over/under-ness determined by navigating to
// https://www.fileformat.info/info/unicode/block/combining_diacritical_marks/images.htm
// and running
// document.querySelectorAll('.table td:nth-child(3)').forEach(n => console.log("a" + n.innerHTML + "  " + n.innerHTML));
// in the console)
const overlays = ['\u0334','\u0335','\u0336','\u0337','\u0338','\u20D2','\u20D3','\u20D8','\u20D9','\u20DA','\u20DD','\u20DE','\u20DF','\u20E0','\u20E2','\u20E3','\u20E4','\u20E5','\u20E6','\u20EA','\u20EB'];
const belows = ['\u0316','\u0317','\u0318','\u0319','\u031C','\u031D','\u031E','\u031F','\u0320','\u0321','\u0322','\u0323','\u0324','\u0325','\u0326','\u0327','\u0328','\u0329','\u032A','\u032B','\u032C','\u032D','\u032E','\u032F','\u0330','\u0331','\u0332','\u0333','\u0339','\u033A','\u033B','\u033C','\u0345','\u0347','\u0348','\u0349','\u034D','\u034E','\u0353','\u0354','\u0355','\u0356','\u0359','\u035A','\u035C','\u035F','\u0362','\u20E8','\u20EC','\u20ED','\u20EE','\u20EF'];

function diacriticPosition(d) {
    if (overlays.includes(d))
        return 0;
    if (belows.includes(d))
        return -1;
    return 1;
}

// determine sizes: negative numbers => smaller sizes, positive numbers =>
// larger sizes, 0 => 1. constant 1.25 determined empirically based on what
// mathjax is doing and what looks decent in most mathml renderers
function fontSize(n) {
    return Math.pow(1.25, n) + "em";
}

// determine char to emit based on config: "us-tech" (ⅆ ↦ 𝑑), "us-patent"
// (ⅆ ↦ ⅆ), or "euro-tech" (ⅆ ↦ d), see section 3.11 of the tech note
const variants = {
    "us-tech":   {"ⅅ": "𝐷", "ⅆ": "𝑑", "ⅇ": "𝑒", "ⅈ": "𝑖", "ⅉ": "𝑗"},
    "us-patent": {"ⅅ": "ⅅ", "ⅆ": "ⅆ", "ⅇ": "ⅇ", "ⅈ": "ⅈ", "ⅉ": "ⅉ"},
    "euro-tech": {"ⅅ": "D", "ⅆ": "d", "ⅇ": "e", "ⅈ": "i", "ⅉ": "j"}
}

function doublestruckChar(value) {
    if (typeof ummlConfig !== "undefined" && typeof ummlConfig.doubleStruckMode !== "undefined" &&
        ummlConfig.doubleStruckMode in variants) {
        return variants[ummlConfig.doubleStruckMode][value];
    }
    return variants["us-tech"][value];
}

function transposeChar() {
    if (typeof ummlConfig !== "undefined" && ummlConfig.transposeChar != undefined)
        return ummlConfig.transposeChar
    return "T"
}

// if the outermost node of an AST describes a parenthesized expression, remove
// the parentheses. used for fractions, exponentiation, etc.
function dropOutermostParens(uast) {
    if (uast.hasOwnProperty("expr"))
        return {expr: dropOutermostParens(uast.expr)};

    if (Array.isArray(uast)) {
        if (uast.length == 1)
            return [dropOutermostParens(uast[0])];
        if (uast.length == 2 && uast[0].hasOwnProperty("bracketed") &&
            uast[1].hasOwnProperty("intend")) {
            return [dropOutermostParens(uast[0]), uast[1]]
        }
    }
    if (!uast.hasOwnProperty("bracketed"))
        return uast;

    if (v(uast).open == "(" && v(uast).close == ")" &&
        !v(uast).content.hasOwnProperty("separated")) {
        return v(uast).content;
    }
    return uast;
}

// return the given AST, which may be wrapped in a stack of singleton lists,
// sans those lists
function dropSingletonLists(uast) {
    if (Array.isArray(uast) && uast.length == 1)
        return dropSingletonLists(uast[0]);
    return uast;
}

const brackets = {'⒨': '()', '⒩': '‖‖', 'ⓢ': '[]', 'Ⓢ': '{}', '⒱': '||'};

function isCharsButNotFunction(value) {
    return value.hasOwnProperty("chars") && value.chars[0] != 'Ⅎ' &&
        !isFunctionName(value.chars);
}

////////////////
// PREPROCESS //
////////////////

// certain desugarings, transformations and normalizations that must be
// performed no matter the output format
function preprocess(dsty, uast, index, arr) {

    // map preprocessing over lists
    if (Array.isArray(uast)) {
        for (let i = 0; i < uast.length; i++) {
            uast[i] = preprocess(dsty, uast[i], i, uast);
        }
    }

    let base
    let i
    let key = k(uast);
    let value = v(uast);
    let opClose, opOpen
    let ret
    let type
    let val

    var intent = dsty.intent;               // Currently intent and arg need
    var arg = dsty.arg;                     //  to be global to pass down to
    if (!arg)                               //  lower preprocess() calls
        arg = uast.arg;
    if (!intent)
        intent = uast.intent;
    dsty.intent = dsty.arg = '';

    switch (key) {
        case "unicodemath":
            return {unicodemath: {content: preprocess(dsty, value.content), eqnumber: value.eqnumber}};

        case "expr":
            return {expr: preprocess(dsty, value)};

        case "element":
            return {element: preprocess(dsty, value)};

        case "array":
            // TODO pad columns (also for matrices)
            return {array: preprocess(dsty, value)};
        case "arows":
            return {arows: preprocess(dsty, value)};
        case "arow":
            // divide "&" into alignment marks and stretchy gaps
            let currAcol = []
            ret = []
            i = 0

            if (value[0] == null)           // align mark at start of row
                i = 1

            for (; i < value.length; i++) {
                currAcol.push(!(i % 2) ? {aaligngroup: null} : {aalignmark: null})
                currAcol.push(preprocess(dsty, value[i]))
            }
            if (currAcol.length > 0)
                ret.push({acol: currAcol})
            return {arow: ret}

        case "specialMatrix":               // n×m or identity matrix
            type = value[2];
            value = matrixRows(value[0], value[1]);

            if (emitDefaultIntents) {
                let val = matrixIntents[type];
                if (val)
                    intent = val;
            }
            if (type != "■") {
                opOpen = brackets[type][0];
                opClose = brackets[type][1];
                return {bracketed: {open: opOpen, close: opClose, intent: intent, arg: arg, content: {matrix: preprocess(dsty, value)}}};
            }
            // Fall through to "matrix"
        case "matrix":
            return {matrix: preprocess(dsty, value)};
        case "mrows":
            return {mrows: preprocess(dsty, value)};
        case "mrow":
            // note that this is a matrix row, not a mathml <mrow>
            return {mrow: value.map(c => ({mcol: preprocess(dsty, c)}))};

        case "nary":
            let options = naryOptions(value.mask);
            value = clone(value);           // must be cloned since it's going
                                            // to be modified

            if (options.includes("nLimitsOpposite")) {

                // flip the scripts (not sure this is what's intended – the tech
                // note contains no details and word doesn't appear to implement
                // this feature)
                if ("low" in value.limits.script && "high" in value.limits.script) {
                    let tmp = value.limits.script.high;
                    value.limits.script.high = value.limits.script.low;
                    value.limits.script.low = tmp;
                } else if ("low" in value.limits.script) {
                    value.limits.script.high = value.limits.script.low;
                    delete value.limits.script.low;
                } else if ("high" in value.limits.script) {
                    value.limits.script.low = value.limits.script.high;
                    delete value.limits.script.high;
                } else {
                    // can only occur in a nary without sub or sup set
                }
            }
            if (options.includes("nShowLowLimitPlaceHolder")) {
                if (!("low" in value.limits.script))
                    value.limits.script.low = {operator: "⬚"};
            }
            if (options.includes("nShowUpLimitPlaceHolder")) {
                if (!("high" in value.limits.script))
                    value.limits.script.high = {operator: "⬚"};
            }

            if (options.includes("fDontGrowWithContent")) {
                value.naryand = {smash: {symbol: "⬆", of: value.naryand}};
            } else if (options.includes("fGrowWithContent")) {
                // default
            }

            let op = v(value.limits.script.base);
            let isInt = isIntegral(op);

            if (options.includes("nLimitsUnderOver")) {
                value.limits.script.type = "abovebelow";
            } else if (options.includes("nLimitsSubSup")) {
                value.limits.script.type = "subsup";
            } else if (options.includes("nUpperLimitAsSuperScript")) {

                // display low as abovebelow, high as subsup => generate two
                // nested scripts
                if (value.limits.script.type != "subsup" && "high" in value.limits.script) {
                    let high = value.limits.script.high;
                    delete value.limits.script.high;
                    value.limits.script.base = {script: {type: "subsup", base: value.limits.script.base, high: high}};
                }
            } else if (dsty.display && !isInt) {
                // In display mode if not an integral, display limits abovebelow
                value.limits.script.type = "abovebelow";
            }
            if (value.naryand.hasOwnProperty("binom") && arr != undefined &&
                index < arr.length - 1 && Array.isArray(arr[index + 1])) {
                // Include array following binomial coefficient in naryand.
                // Binomial coefficients like 𝑛⒞𝑘 should be part of operands
                // as are other bracketed expressions, but peg doesn't seem
                // to offer a way to match it that way.
                let naryand = arr[index + 1];
                naryand.unshift(value.naryand);
                value.naryand = naryand;
                arr.splice(index + 1, 1);
            } else if (isInt && arr != undefined && index < arr.length &&
                Array.isArray(arr[index + 1])) {
                // For integrals, if arr[index + 1] has atoms that start with ⅆ,
                // move that element into value.naryand. E.g., in ∫_1^2 1/𝑥 ⅆ𝑥=ln 2,
                // ⅆ𝑥 is moved into the integrand.
                let next = arr[index + 1][0];
                if (next.hasOwnProperty('primed'))
                    next = next.primed.base;
                if (next.hasOwnProperty('atoms') && Array.isArray(next.atoms) &&
                    next.atoms[0].hasOwnProperty('chars') &&
                    next.atoms[0].chars[0] == 'ⅆ') {    // Differential d
                    if (Array.isArray(value.naryand))
                        value.naryand.push(arr[index + 1][0]);
                    else
                        value.naryand = [value.naryand, arr[index + 1][0]];
                    arr.splice(index + 1, 1);
                }
            }
            value.naryand = preprocess(dsty, value.naryand);
            value.limits = preprocess(dsty, value.limits);

            if (useMfenced && !Array.isArray(value.naryand)) {
                // Word MML2OMML.XSL wants naryand to be an <mrow>
                value.naryand = [value.naryand]
            }
            if (!intent && emitDefaultIntents) {
                let arg0 = getScript(value.limits.script.low, '$l')
                let arg1 = getScript(value.limits.script.high, '$h')
                intent = ':nary(' + arg0 + ',' + arg1 + ',$naryand)'
                value.naryand.arg = 'naryand';
                if (arg0 == '$l')
                    value.limits.script.low.arg = arg0.substring(1);
                if (arg1 == '$h')
                    value.limits.script.high.arg = arg1.substring(1);
            }
            return {nary: {mask: value.mask, limits: value.limits, intent: intent,
                           arg: arg, naryand: value.naryand}};

        case "negatedoperator":
            return (value in negs) ? {operator: negs[value]} : {negatedoperator: value};

        case "phantom":
            return {phantom: {mask: value.mask, symbol: value.symbol, intent: intent, arg: arg, of: preprocess(dsty, value.of)}};
        case "smash":
            return {smash: {symbol: value.symbol, intent: intent, arg: arg, of: preprocess(dsty, value.of)}};

        case "fraction":
            if (value.symbol == '/' && !intent && !arg && emitDefaultIntents) {
                // Check for Leibniz derivatives
                let [chDifferential0, order0, arg0] = getDifferentialInfo(value.of, 0); // Numerator

                if (chDifferential0) {      // Might be a derivative
                    let [chDifferential1, order1, wrt] = getDifferentialInfo(value.of, 1); // Denominator

                    if (chDifferential0 == chDifferential1 && order0 == order1) {
                        // It's a derivative
                        if (!arg0) {        // Assign intent arg as for 𝜕²/𝜕𝑥² 𝜓(𝑥,𝑡)
                            if (Array.isArray(value.of[1])) { // Denominator
                                // Reorder tree for, e.g., ⅆ/ⅆ𝑧⁡arcsin⁡𝑧
                                let val = value.of[1][0];
                                if (val.hasOwnProperty('function') &&
                                    val.function.f.hasOwnProperty('atoms') &&
                                    val.function.f.atoms.hasOwnProperty('chars')) {
                                    let arg = val.function.of;
                                    value.of[1][0] = {atoms: {chars:
                                        value.of[1][0].function.f.atoms.chars.split(',').join('')}};
                                    arr.splice(index + 1, 0, arg);
                                }
                            }
                            if (Array.isArray(value.of[0]) && order0 == 1 &&
                                value.of[0][0].hasOwnProperty('script')) { // Handle ⅆ𝑓₁/ⅆ𝑧
                                arg0 = '$f';
                            }
                            if (index + 1 < arr.length) {
                                let ele = arr[index + 1];
                                if (ele.hasOwnProperty('operator') && ele.operator == '\u2061')
                                    ele = arr[index + 2];
                                if (Array.isArray(ele)) {
                                    if (ele.length == 1 && ele[0].hasOwnProperty("atoms"))
                                        ele[0].atoms.arg = '$f'; // Target <mi>
                                    else
                                        ele.unshift({arg: 'f'}); // Target <mrow>
                                    arg0 = '$f';
                                }
                            }
                        }
                        if (arg0.startsWith('$') || order0.startsWith('$')) {
                            // Handle intent argument reference(s)
                            let ofDiff = value.of;
                            let s = ofDiff[0][0];
                            if (s.hasOwnProperty('script')) {
                                // For, e.g., 𝑑^(n-1) 𝑓(𝑥)/𝑑𝑥^(𝑛-1), 𝑑^(𝑛-1) y/𝑑𝑥^(𝑛-1), ⅆ²𝛾′/ⅆ𝑧²
                                if (Array.isArray(s.script.high)) {
                                    if (order0.startsWith('$')) {
                                        if (s.script.high[0].hasOwnProperty('bracketed'))
                                            s.script.high[0].bracketed.arg = order0.substring(1);
                                        else if (s.script.high[0].hasOwnProperty('atoms'))
                                            s.script.high[0].atoms.arg = order0.substring(1);
                                    } else if (arg0.startsWith('$')) {
                                        if (ofDiff[0].length == 1) {
                                            s.script.arg = arg0.substring(1);
                                        } else if (ofDiff[0][1].hasOwnProperty('primed')) {
                                            ofDiff[0][1].primed.arg = arg0.substring(1); // ⅆ^2 𝛾′/ⅆ𝑧²
                                        }
                                    }
                                } else if (ofDiff[0].length == 2) {
                                    if (ofDiff[0][1].hasOwnProperty('script')) { // For, e.g., ⅆ²𝛾^∗/ⅆ𝑧²
                                        ofDiff[0][1].script.arg = arg0.substring(1);
                                    } else if (ofDiff[0][1].hasOwnProperty('primed')) {
                                        ofDiff[0][1].primed.arg = arg0.substring(1); // ⅆ²𝛾′/ⅆ𝑧²
                                    } else if (ofDiff[0][1].hasOwnProperty('function')) { // 𝜕²𝑓⁡(𝑥)/𝜕𝑥² (incl \u2061)
                                        ofDiff[0][1].arg = arg0.substring(1);
                                    }
                                } else if (s.script.low) {
                                    s.script.arg = arg0.substring(1);
                                }
                                // For, e.g., 𝑑²𝑓(𝑥)/𝑑𝑥² or 𝑑^(n-1) 𝑓(𝑥)/𝑑𝑥^(n-1)
                                if (ofDiff[0].length == 3 &&
                                    ofDiff[0][1].hasOwnProperty('atoms') &&
                                    ofDiff[0][2].hasOwnProperty('bracketed')) {
                                    value.of[0] = [s, [{arg: arg0.substring(1)},
                                        ofDiff[0][1], ofDiff[0][2]]];
                                } else if (ofDiff[0].length == 2) {
                                    // For, e.g., 𝑑^(n-1) y/𝑑𝑥^(n-1)
                                    value.of[0] = [s, ofDiff[0][1]];
                                }
                            } else if (s.hasOwnProperty('primed')) {
                                s.primed.arg = arg0.substring(1);
                            } else if (s.hasOwnProperty('function')) {
                                s.arg = arg0.substring(1);  // 𝜕𝑓⁡(𝑥,𝑥′)/𝜕𝑥′
                            } else if (ofDiff[0].length == 2 && // 𝑑𝑓(𝑥)/𝑑𝑥
                                s.hasOwnProperty('atoms') &&
                                ofDiff[0][1].hasOwnProperty('bracketed')) {
                                let ch = getCh(s.atoms[0].chars, 0);

                                if (s.atoms[0].chars.length > ch.length) {
                                    value.of[0] = [{atoms: [{chars: ch}]}, [{arg: arg0.substring(1)},
                                    {atoms: [{chars: getCh(s.atoms[0].chars, ch.length)}]},
                                        ofDiff[0][1]]];
                                }
                            }
                        }
                        intent = '∂𝜕'.includes(chDifferential0)
                            ? 'partial-derivative' : 'derivative';
                        intent += '(' + order0 + ',' + arg0 + ',' + wrt + ')';
                        return {fraction: {symbol: value.symbol, intent: intent, of: preprocess(dsty, value.of)}};
                   }
                }
            }
            return {fraction: {symbol: value.symbol, intent: intent, arg: arg, of: preprocess(dsty, value.of)}};

        case "unicodefraction":
            let uFrac = unicodeFractions[value];
            return (uFrac == undefined) ? value
                : {fraction: {symbol: "⊘", of: [{number: uFrac[0]}, {number: uFrac[1]}]}};

        case "atop":
            value = preprocess(dsty, value);
            if (intent)
                value.intent = intent;
            if (arg)
                value.arg = arg;

            return {atop: value};
        case "binom":
            value.top = preprocess(dsty, value.top);
            value.bottom = preprocess(dsty, value.bottom);

            if (!intent && emitDefaultIntents) {
                let top = getVariable(value.top);
                let bottom = getVariable(value.bottom);
                intent = "binomial-coefficient(";
                if (top[0] == '$') {
                    intent += '$t,';
                    value.top.arg = 't';
                } else {
                    intent += top + ',';
                }
                if (bottom[0] == '$') {
                    intent += '$b)';
                    value.bottom.arg = 'b';
                } else {
                    intent += bottom + ')';
                }
            }
            return {bracketed: {intent: intent, arg: arg, open: "(", close: ")",
                                content: {atop: [value.top, value.bottom]}}};

        case "script":
            value.base.inscript = true;     // Need for case "primed":
            ret = {type: value.type, base: preprocess(dsty, value.base)};
            if (intent)
                ret.intent = intent;
            if (arg)
                ret.arg = arg;
            if (value.arg)
                ret.arg = value.arg;

            switch (value.type) {
                case "subsup":
                    base = dropSingletonLists(value.base)
                    if (index > 0) {
                        let intend = arr[index - 1].intend
                        if (intend && intend.symbol == 'Ⓐ') {
                            base.selanchor = intend.value
                            ret.base = base
                        }
                    }
                    if (base.hasOwnProperty('intend') && base.intend.op == 'Ⓐ') {
                        // If the selanchor is applied to the base, make the
                        // selanchor apply to the sub/superscript object to
                        // make it parsable
                        val = base.intend.intent.text
                        ret.base = arr[index - 1]
                        ret.high = value.high
                        ret.low = value.low
                        arr[index - 1] = {intend: {anchor: val}}
                    } else if (base.hasOwnProperty("primed")) {
                        // if the subsup contains a primed expression, pull the
                        // prime up into the superscript and make the prime's
                        // base the subsup's base
                        let primes = {operator: processPrimes(base.primed.primes)};  // TODO not ideal for latex output
                        if ("low" in value) {
                            ret.low = preprocess(dsty, value.low);
                        }
                        if ("high" in value) {
                            ret.high = [primes, preprocess(dsty, value.high)];
                        } else {
                            ret.high = primes;
                        }
                        base = ret.base = base.primed.base;
                    } else {
                        if ("low" in value) {
                            ret.low = preprocess(dsty, value.low);
                        }
                        if ("high" in value) {
                            ret.high = preprocess(dsty, value.high);
                            if (isTranspose(ret.high))
                                ret.high[0].atoms.intent = 'transpose';
                        }
                    }
                    if (k(base) != "atoms" || base.atoms.funct != undefined)
                        break;
                    // If base contains more than one char and isn't a function
                    // name, make the subsup base be the end char. E.g., for
                    // 𝐸 = 𝑚𝑐², make 𝑐 be the base, not 𝑚𝑐.
                    let n = base.atoms.length;
                    if (n == undefined)
                        break;
                    let str = base.atoms[n - 1].chars;
                    if (str == undefined)
                        break;
                    let cch = str.length;
                    let fn = foldMathItalics(str);
                    if (isFunctionName(fn)) {
                        if (fn.length < cch)
                            ret.base.atoms[0].chars = fn;
                        break;
                    }
                    let cchCh = (str[cch - 1] >= '\uDC00') ? 2 : 1

                    if (cch > cchCh) {
                        // Return leading chars followed by scripted end char
                        ret.base.atoms[0].chars = str.substring(cch - cchCh);
                        delete ret.base.selanchor
                        return [{atoms: {chars: str.substring(0, cch - cchCh)}},
                                {script: ret}];
                    }
                    if (ret.intent || str[0] != 'ⅅ' && !str.startsWith('𝜕') ||
                        !emitDefaultIntents) {
                            break;
                    }

                    // Check for Euler derivative like ⅅ_𝑥 𝑓(𝑥) or 𝜕_𝑥𝑦 𝑓(𝑥,𝑦).
                    // First get potential derivative order and variables.
                    let order = '';
                    if (ret.high) {
                        if (str[0] != 'ⅅ') { // str == '𝜕' (a surrogate pair)
                            // Euler partial derivative can't have superscript
                            break;
                        }
                        if (Array.isArray(ret.high) || ret.high.hasOwnProperty('expr'))
                            order = getOrder(ret.high);
                    }
                    n = 1;                  // Count of subscript letters
                    let chars1 = ''
                    if (ret.low) {
                        let chars = getChars(ret.low[0]);
                        let cch = chars.length;

                        // Split chars treating surrogate chars as single chars
                        for (let i = 0; i < cch; ) {
                            let ch = getCh(chars, i);
                            chars1 += ch;
                            i += ch.length;
                            if (i < chars.length && !isPrime(chars[i])) {
                                chars1 += ',';
                                n++;
                            }
                        }
                    }
                    if (str[0] != 'ⅅ' && !n)
                        break;              // Euler partial derivative needs subscript

                    if (!order)
                        order = n;
                    let darg = '';
                    if (arr.length - 1 > index) {
                        if (arr.length - 2 == index ||
                            !arr[index + 2].hasOwnProperty('bracketed')) {
                            arr[index + 1].arg = 'f';
                            darg = '$f';
                        } else {
                            // Move function name and argument list into mrow
                            arr[index + 1] = [{arg: 'f'}, arr[index + 1], arr[index + 2]];
                            darg = '$f';
                            arr.splice(index + 2, 1);
                            if (!chars1) {
                                let val = arr[index + 1][2].bracketed.content;
                                if (val.hasOwnProperty('expr'))
                                    val = val.expr[0];
                                chars1 = getChars(val);
                            }
                        }
                    }
                    if (darg) {
                        ret.intent = str[0] == 'ⅅ'
                            ? 'derivative' : 'partial-derivative';
                        ret.intent += '(' + order + ',' + darg + ',' + chars1 + ')';
                    }
                    break;

                case "pre":
                    if ("prelow" in value) {
                        ret.prelow = preprocess(dsty, value.prelow);
                    }
                    if ("prehigh" in value) {
                        ret.prehigh = preprocess(dsty, value.prehigh);
                        if (isTranspose(ret.prehigh))
                            ret.prehigh[0].atoms.intent = 'transpose';
                    }

                    // if a prescript contains a subsup, pull its base and
                    // scripts up into the prescript, which will then have all
                    // four kinds of scripts set
                    base = dropSingletonLists(ret.base);
                    if (base.hasOwnProperty("script") && base.script.type == "subsup") {
                        if ("low" in base.script) {
                            ret.low = preprocess(dsty, base.script.low);
                        }
                        if ("high" in base.script) {
                            ret.high = preprocess(dsty, base.script.high);
                        }
                        ret.base = preprocess(dsty, base.script.base);
                    }
                    break;

                case "abovebelow":
                    if (index > 0) {
                        let intend = arr[index - 1].intend
                        if (intend && intend.symbol == 'Ⓐ') {
                            console.log("intend.value = " + intend.value)
                            ret.base.selanchor = intend.value
                        }
                    }
                    if ("low" in value) {
                        ret.low = preprocess(dsty, value.low);
                    }
                    if ("high" in value) {
                        ret.high = preprocess(dsty, value.high);
                    }
                    break;

                default:
                    throw "invalid or missing script type";
            }
            return {script: ret};

        case "enclosed":
            if (Array.isArray(value.of) && value.of[0].colored &&
                value.of[0].colored.color == '#F01') {
                // Unclosed parentheses: downgrade symbol to operator
                value.of.unshift({operator: value.symbol})
                return value.of
            }
            if (value.symbol == 'Ⓐ' || value.symbol == 'Ⓕ') {
                // Prepare selection attributes
                val = '0'
                if (value.of && value.of.expr) {
                    let i = value.of.expr.length - 1
                    val = value.of.expr[i][0].number
                    if (i > 0)
                        val = '-' + val
                }
                // For example, for '𝑎Ⓐ()^', value.mask = '^'
                return {intend: {symbol: value.symbol, value: val, op: value.mask}}
            }
            if (value.symbol >= "╱" && value.symbol <= "╳") {
                // Set mask for \cancel, \bcancel, \xcancel
                value.mask = (value.symbol == "╱") ? 79 : (value.symbol == "╲") ? 143 : 207;
            }
            return {enclosed: {mask: value.mask, symbol: value.symbol, intent: intent, arg: arg, of: preprocess(dsty, value.of)}};

        case "abstractbox":
            return {abstractbox: {mask: value.mask, of: preprocess(dsty, value.of)}};

        case "hbrack":
            return {hbrack: {intent: intent, arg: arg, bracket: value.bracket, of: preprocess(dsty, value.of)}};

        case "intend":
            if (value.content.hasOwnProperty("expr") && value.content.expr.length > 1) {
                // Set up to put attribute(s) on an <mrow>
                let c = preprocess(dsty, v(value.content));
                if (value.op == 'ⓘ') {
                    c.intent = value.intent.text;
                    if (c.intent == 'cardinality')
                        c.intent += '($a)'
                    if (arg)
                        c.arg = arg;
                } else {
                    c.arg = value.intent.text
                    if (intent)
                        c.intent = intent;
                }
                return c;
            }
            val = value.intent.text

            switch (value.op) {
                case 'ⓘ':
                    dsty.intent = val;
                    if (dsty.intent == 'cardinality')
                        dsty.intent += '($a)'
                    if (arg)
                        dsty.arg = arg;
                    break

                case 'ⓐ':
                    dsty.arg = val;
                    if (intent)
                        dsty.intent = intent;
            }
            return preprocess(dsty, v(value.content));

        case "root":
            return {root: {intent: intent, arg: arg, degree: value.degree, of: preprocess(dsty, value.of)}};
        case "sqrt":
            value = preprocess(dsty, value);
            if (Array.isArray(value) &&
                (value[0].colored && value[0].colored.color == '#F01' ||
                 value[0].intend && value.length == 1)) {
                // Unclosed parentheses or solo intend: downgrade √ to operator
                value.unshift({operator: '√'})
                return value
            }
            if (intent)
                value.intent = intent;
            if (arg)
                value.arg = arg;
            return {sqrt: value};

        case "function":
            // clone this since it's going to be modified
            let valuef = clone(value.f);

            // tech note, section 3.3: if display mode is active, convert
            // subscripts after certain function names into belowscripts. the
            // <mo> movablelimits attribute could in theory also be used here,
            // but it's not supported everywhere (e.g. safari)
            if (value.f.hasOwnProperty("script")) {
                let s = valuef.script;
                let f = s.base.atoms.chars;
                if (dsty.display && s.type == "subsup" && s.low &&
                    ["det", "gcd", "inf", "lim", "lim inf", "lim sup", "max", "min", "Pr", "sup"].includes(f)) {
                    if (!s.high) {
                        // just convert the script to abovebelow
                        s.type = "abovebelow";
                    } else {
                        // create a new belowscript around the base and superscript
                        s = {base: {script: {base: s.base, type: s.type, high: s.high}}, type: "abovebelow", low: s.low};
                    }
                }
                valuef.script = s;
            }
            // Handle ⒡ "parenthesize argument" dictation option
            let ofFunc = preprocess(dsty, value.of);
            if (Array.isArray(ofFunc)) {
                let x = ofFunc[0];
                if (Array.isArray(x))
                    x = x[0];                  // '⒡' as separate array element
                if (x != undefined && x.hasOwnProperty('atoms')) {
                    let ch = x.atoms[0].chars;
                    if (ch[0] == '⒡') {
                        // Remove '⒡' and enclose function arg in parens
                        if (ch.length == 1)
                            ofFunc[0].shift();
                        else
                            ofFunc[0].atoms[0].chars = ch.substring(1);
                        ofFunc = {bracketed: {open: '(', close: ')', content: ofFunc}}
                    }
                }
            }
            let extra = [];
            if (valuef.hasOwnProperty('atoms') && valuef.atoms.hasOwnProperty('chars')) {
                let chars = valuef.atoms.chars.split(",");
                valuef.atoms.chars = chars.pop();
                if (chars.length) {
                    // Separate out character(s) preceding function name,
                    // e.g., the 𝑑 in 𝑑𝜓⁡(𝑥,𝑡)/𝑑𝑡
                    extra.push({atoms: {chars: chars.join('')}});
                }
            }
            ret = {function: {f: preprocess(dsty, valuef), intent: intent, arg: arg, of: ofFunc}}
            if (extra.length) {
                extra.push(ret)
                return extra;
            }
            return ret;

        case "negatedoperator":
            return (value in negs) ? {operator: negs[value]} : {negatedoperator: value};

        case "sizeoverride":
            return {sizeoverride: {size: value.size, of: preprocess(dsty, value.of)}};

        case "colored":
            return {colored: {color: foldMathItalics(value.color), of: preprocess(dsty, value.of)}};
        case "bgcolored":
            return {bgcolored: {color: foldMathItalics(value.color), of: preprocess(dsty, value.of)}};

        case "primed":
            // Cannot do anything here if in script, since the script transform
            // rule relies on this
            if (value.arg)
                arg = value.arg;
            base = preprocess(dsty, value.base);
            if (!uast.hasOwnProperty('inscript') && base.hasOwnProperty('atoms') &&
                Array.isArray(base.atoms) && base.atoms[0].hasOwnProperty('chars')) {
                let chars = base.atoms[0].chars;
                let cch = chars.length;
                let cchCh = (chars[cch - 1] >= '\DC00') ? 2 : 1;

                if (cch > cchCh) {
                    // Return leading chars followed by primed end char
                    base.atoms[0].chars = chars.substring(cch - cchCh);
                    return [{atoms: {chars: chars.substring(0, cch - cchCh)}},
                            {primed: {base: base, intent: intent, arg: arg, primes: value.primes}}];
                }
                if (intent == 'derivative') {
                    // Handle, e.g., ⓘ(":derivative"𝑓′(𝑥))
                    intent = 'derivative(' + String.fromCodePoint(value.primes + 0x30) + ',' + chars;

                    if (index < arr.length - 1 && arr[index + 1].hasOwnProperty('bracketed')) {
                        let val = arr[index + 1].bracketed.content;
                        let wrt = '';

                        if (val.hasOwnProperty('expr') && Array.isArray(val.expr))
                            val = val.expr[0];
                        if (Array.isArray(val))
                            val = val[0];
                        if (val.hasOwnProperty('primed')) {
                            // Handle, e.g., ⓘ("derivative"𝑓′(𝑥′))
                            wrt = processPrimes(val.primed.primes);
                            val = val.primed.base;
                        }
                        if (val.hasOwnProperty('atoms') && Array.isArray(val.atoms)) {
                            wrt = val.atoms[0].chars + wrt;
                            intent += '(' + wrt + '),' + wrt + ')';
                        }
                    } else {
                        intent += ',)';
                    }
                }
            }
            return {primed: {base: base, intent: intent, arg: arg, primes: value.primes}};

        case "factorial":
            value = preprocess(dsty, value);
            if (intent)
                value.intent = intent;
            if (arg)
                value.arg = arg;
            return {factorial: value};

        case "atoms":
            if (!value.hasOwnProperty("funct")) {
                let chars;
                let darg = '';

                if (Array.isArray(value) && isCharsButNotFunction(value[0])) {
                    chars = value[0].chars = italicizeCharacters(value[0].chars);
                }
                else if (isCharsButNotFunction(value)) {
                    chars = value.chars = italicizeCharacters(value.chars);
                }
                if (chars && chars[0] == 'ⅅ' && chars.length > 1 && !intent &&
                    emitDefaultIntents) {
                    // Get default intent for, e.g., ⅅ𝑓(𝑥)
                    if (arr.length - 1 > index && arr[index + 1].hasOwnProperty('bracketed')) {
                        // Get derivative variable
                        let val = arr[index + 1].bracketed.content.expr;
                        if (val && Array.isArray(val))
                            val = val[0];
                        darg = getChars(val);
                        if (darg == 'undefined') {
                            darg = '$x';
                            if (Array.isArray(val))
                                val = val[0];
                           val.arg = 'x';
                        }
                    }
                    intent = 'derivative(1,' + chars.substring(1) + ',' + darg + ')';
                }
            }
            if (!arg && value.arg)
                arg = value.arg;            // Happens for intervals
            value = preprocess(dsty, value);
            if(intent)
                value.intent = intent;
            if(arg)
                value.arg = arg;
            return {atoms: value};

        case "diacriticized":
            return {diacriticized: {base: preprocess(dsty, value.base), diacritics: value.diacritics}};
        case "spaces":
            return {spaces: preprocess(dsty, value)};

        case "bracketedMatrix":
            type = value.type;
            opOpen = brackets[type][0];
            opClose = brackets[type][1];

            if (!value.intent && emitDefaultIntents) {
                val = matrixIntents[type];
                if (val)
                    value.intent = val;
            }
            return {bracketed: {
                    open: opOpen, close: opClose, intent: value.intent,
                    arg: arg, content: preprocess(dsty, value.content)}}

        case "bracketed":
            if (value.content.hasOwnProperty("separated")) {
                let sep = value.content.separated.separator
                if (value.open == '⟨' && sep == '│' && value.close == '⟩')  // U+2502
                    sep = '|'
                value.content = {separated: {separator: sep, of: preprocess(dsty, value.content.separated.of)}};
            } else {
                if (value.intent && value.intent.endsWith("interval") &&
                    Array.isArray(value.content) && value.content.length == 3) {
                    // Arrange interval endpoint arguments and content
                    let arg0 = getIntervalArg(value.content, 0);
                    let arg1 = getIntervalArg(value.content, 2);
                    if (emitDefaultIntents) {
                        value.intent += '(' + arg0 + ',' + arg1 + ')';
                        if (!intent)
                            intent = value.intent;
                    } else {
                        intent = value.intent = ''
                    }
                    value.content = {expr:
                            [getIntervalEndPoint(arg0, value.content[0]),
                             {operator: ','},
                             getIntervalEndPoint(arg1, value.content[2])]
                    };
                    value.content = preprocess(dsty, value.content);
                } else {
                    value.content = preprocess(dsty, value.content);
                    if (!value.intent && value.open == '\u007B' && !value.close &&
                        value.content.hasOwnProperty('expr') &&
                        Array.isArray(value.content.expr) &&
                        value.content.expr[0].hasOwnProperty('array')) {
                        value.intent = ':cases';
                    }
                    if (!arg && value.arg)
                        arg = value.arg;        // Happens for derivative w bracketed order
                    if (!intent && value.intent) {
                        intent = value.intent;  // Happens for cases & absolute-value
                        if (intent == 'ⓒ') {
                            let arg0 = getAbsArg(value.content);
                            intent += '(' + arg0 + ')';
                            if (arg0 == "$a")
                                value.content.expr.arg = 'a';
                        }
                    }
               }
            }
            return {bracketed: {open: value.open, close: value.close, arg: arg,
                                intent: intent, content: value.content}};

        case "operator":
            if (value.length > 1 && value[0] == '\\') {
                value = value[1]
                intent = ':text'
            }
            if (value == '<')
                value = '&lt;';
            return {[key]: {intent: intent, arg: arg, content: value}};

        case "chars":
        case "comment":
        case "newline":
        case "number":
        case "opnary":
        case "space":
        case "text":
        case "tt":

        default:
            return uast;
    }
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// MATHML /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function getAttrs(value, deflt) {
    let attrs = {};

    if (selanchor) {
        attrs.selanchor = selanchor
        selanchor = null
    }
    if (value.selanchor)
        attrs.selanchor = value.selanchor

    if (selfocus) {
        attrs.selfocus = selfocus
        selfocus = null
    }
    if (value.selfocus)
        attrs.selfocus = value.selfocus

    if (value.arg)
        attrs.arg = value.arg;
    if (value.intent)
        attrs.intent = value.intent;
    else if (deflt && emitDefaultIntents)
        attrs.intent = deflt;
    return attrs;
}

function getAttrsDoublestruck(ch, str) {
    let attrsDoublestruck = {};

    if (ch != str && emitDefaultIntents)
        attrsDoublestruck.intent = str;

    if (ch <= 'z')
        attrsDoublestruck.mathvariant = "normal";

    return attrsDoublestruck;
}

///////////////
// TRANSFORM //
///////////////

// transform preprocessed UnicodeMath AST to MathML AST, potentially in display
// style. invariant: must return a single mathml node, even on recursive calls.
// if multiple mathml nodes should be returned, they must be wrapped in an mrow
function mtransform(dsty, puast) {

    // map transformation over lists, wrap the result in an mrow. Note: here dsty
    // is a boolean; it doesn't include an intent property

    if (Array.isArray(puast) && puast.length) {
        let val;
        if (puast[0].hasOwnProperty('script'))
            val = puast[0].script;
        else if (puast[0].hasOwnProperty('primed'))
            val = puast[0].primed;

        if (val && val.intent && val.intent.indexOf('derivative') != -1) {
            // Move intent from script/primed to mrow containing script/primed,
            // e.g., for 𝜕_𝑥𝑥′ 𝑓(𝑥, 𝑥′) or ⓘ("derivative"𝑓′(𝑥))
            let attrs = getAttrs(val);
            val.intent = '';
            return {mrow: withAttrs(attrs, puast.map(e => mtransform(dsty, e)))};
        }
        let arg = {};
        if (puast.hasOwnProperty("arg"))
            arg = {arg: puast.arg};
        else if (puast[0].hasOwnProperty("arg"))
            arg = puast.shift();
        let ret = []
        for (let i = 0; i < puast.length; i++) {
            val = mtransform(dsty, puast[i])
            // Don't include null results returned by entries, e.g., by
            // selection 'intend' objects
            if (val)
                ret.push(val)
        }
        if (!ret.length)
            return ''

        return ret.length == 1 && puast.length > 1 // Check for attributes?
            ? ret[0] : {mrow: withAttrs(arg, ret)}
    }

    let attrs
    let key = k(puast);
    let mask
    let ret = ''
    let selanchor1
    let str
    let value = v(puast)
    let val
    if (value && !value.arg && puast.hasOwnProperty("arg"))
        value.arg = puast.arg;

    switch (key) {
        case "unicodemath":
            if (autoBuildUp)                // Used for WYSIWYG editing
                return mtransform(dsty, value.content);
            attrs = getAttrs(value, '')
            attrs.display = dsty ? "block" : "inline"
            if (value.eqnumber == null)
                return {math: withAttrs(attrs, mtransform(dsty, value.content))};

            // generate id, via https://stackoverflow.com/a/55008188. Together
            // with some javascript, this can be used to reference a specific
            // equation.
            let id = value.eqnumber.replace(/(^-\d-|^\d|^-\d|^--)/,'$1').replace(/[\W]/g, '-')

            // Assign equation numbers by wrapping everything in an mtable.
            // For MathJax, the table contains an <mlabeledtr> containing the
            // eqnumber and content in individual mtd's.
            if (ummlConfig.forceMathJax || testing) {
                return {math: withAttrs(attrs,
                    {mtable: withAttrs({displaystyle: true}, {mlabeledtr: withAttrs({id: id}, [
                        {mtd: noAttr({mtext: noAttr(value.eqnumber)})},
                        {mtd: noAttr(mtransform(dsty, value.content))} ])})})}
            }
            // For native rendering an <mtr> is used for which the labeling
            // (first) mtd has attributes that flush the equation number to
            // the right margin. Unfortunately this second method messes up
            // the vertical alignment of equations higher than 1em but native
            // renderers don't support <mlabeledtr>. MathJax doesn't support
            // this second method.
            let attrsEqNo = {intent: ':equation-label', style: 'margin-right:1em;position:absolute;right:0em' }
            return {math: withAttrs(attrs,
                {mtable: withAttrs({displaystyle: true}, {
                    mtr: withAttrs({id: id}, [
                        {mtd: withAttrs(attrsEqNo, {mtext: noAttr(value.eqnumber)})},
                        {mtd: noAttr(mtransform(dsty, value.content))}])})})}

        case "newline":
            return {mspace: withAttrs({linebreak: "newline"}, null)};

        case "expr":
            if (Array.isArray(value) && Array.isArray(value[0])) {
                if (value[0][0].hasOwnProperty("intent") || value[0][0].hasOwnProperty("arg")) {
                    let c = mtransform(dsty, value[0][0]);
                    c.mrow.attributes = getAttrs(value[0][0], '');
                    return c;
                }
                if (value[0] && Array.isArray(value[0]) && value[0][0].intend &&
                    value[0][0].intend.symbol == 'Ⓐ') {
                    let n = value[0].length
                    if (n == 1 || n == 2 && value[0][1].intend &&
                        value[0][1].intend.symbol == 'Ⓕ') {
                        let selarr = value.shift()
                        let c = mtransform(dsty, value)
                        if (c && c.mrow) {
                            c.mrow.attributes.selanchor = selarr[0].intend.value
                            if (n == 2)
                                c.mrow.attributes.selfocus = value.length //c.mrow.selarr[1].intend.value
                            return c
                        }
                    }
                }
            }
            return mtransform(dsty, value);

        case "operator":
            attrs = (value.content) ? getAttrs(value, '') : {};
            val = value.content ? value.content : value;

            if ('←→↔⇐⇒⇔↩↪↼⇀↽⇁⊢⊣⟵⟶⟷⟸⟹⟺↦⊨'.split('').includes(val)) {
                attrs.stretchy = true;
            }
            return {mo: withAttrs(attrs, val)};

        case "negatedoperator":
            return {mo: noAttr(value + "̸")};  // U+0338 COMBINING LONG SOLIDUS
                                               //  OVERLAY
        case "element":
            return mtransform(dsty, value);

        case "array":                       // Equation array
            value = mtransform(dsty, value);
            attrs = getAttrs(value, ':equations');
            attrs.columnspacing = '0pt'     // MathJax needs this
            return {mtable: withAttrs(attrs, value)};
        case "arows":
            return value.map(r => ({mtr: noAttr(mtransform(dsty, r))}));
        case "arow":
            return value.map(c => ({mtd: noAttr(mtransform(dsty, c))}));
        case "acol":
            return value.map(c => (mtransform(dsty, c)));
        case "aalignmark":
            return {malignmark: noAttr(null)};
        case "aaligngroup":
            return {maligngroup: noAttr(null)};

        case "matrix":
            value = mtransform(dsty, value);
            str = ':array(' + value.length + ',' + value[0].mtr.content.length + ')';
            attrs = getAttrs(value, str);
            return {mtable: withAttrs(attrs, value)};
        case "mrows":
            return value.map(r => ({mtr: noAttr(mtransform(dsty, r))}));
        case "mrow":
            // note that this is a matrix row, not a mathml <mrow>
            return value.map(c => ({mtd: noAttr(mtransform(dsty, c))}));
        case "mcol":
            return mtransform(dsty, value);

        case "nary":
            attrs = getAttrs(value, 'n-ary')
            let attrsn = getAttrs(value.naryand)
            value.limits = mtransform(dsty, value.limits)
            value.naryand = mtransform(dsty, value.naryand)
            if (attrsn != {})
                value.naryand.attributes = attrsn
            return {mrow: withAttrs(attrs, [value.limits, value.naryand])}

        case "opnary":
            attrs = getAttrs(value, '');
            return {mo: withAttrs(attrs, value)};

        case "phantom":
            attrs = getAttrs(value, '');
            mask = value.mask;

            if (mask) {
                if (mask & 2)               // fPhantomZeroWidth
                    attrs.width = 0;
                if (mask & 4)               // fPhantomZeroAscent
                    attrs.height = 0;
                if (mask & 8)               // fPhantomZeroDescent
                    attrs.depth = 0;
                if (mask & 1)               // fPhantomShow
                    return {mpadded: withAttrs(attrs, mtransform(dsty, value.of))};
                return {mpadded: withAttrs(attrs, {mphantom: noAttr(mtransform(dsty, value.of))})};
            }
            if (value.symbol == '⬄' || value.symbol == '⇳') {
                if (value.symbol == '⬄')
                    attrs.height = attrs.depth = 0;
                else
                    attrs.width = 0;
                return {mpadded: withAttrs(attrs, {mphantom: noAttr(mtransform(dsty, value.of))})};
            }
            // No dimensions were zeroed so no need for mpadded
            return {mphantom: withAttrs(attrs, mtransform(dsty, value.of))};

        case "smash":
            attrs = getAttrs(value, '');

            switch (value.symbol) {
                case "⬍":
                    attrs.depth = attrs.height = 0;
                    break;
                case "⬆":
                    attrs.height= 0;
                    break;
                case "⬇":
                    attrs.depth = 0;
                    break;
                case "⬌":
                    attrs.width = 0;
                    break;
                default:
                    throw "invalid smash symbol";
            }
            return {mpadded: withAttrs(attrs, mtransform(dsty, value.of))};

        case "fraction":
            attrs = getAttrs(value, '');
            let ofFrac = value.of.map(e => (mtransform(dsty, dropOutermostParens(e))));

            switch (value.symbol) {
                case "\u2298":              // small fraction
                    attrs.displaystyle = 'false'; // Fall through
                case "/":                   // normal fraction ¹-₂
                    return {mfrac: withAttrs(attrs, ofFrac)};
                case "\u2044":              // skewed fraction ¹/₂
                    return {mfrac: withAttrs({ bevelled: true }, ofFrac)};
                case "\u2215":              // linear fraction 1/2
                    return {mrow: noAttr([ofFrac[0], { mo: noAttr('/') }, ofFrac[1]])};
            }

        case "atop":
            attrs = getAttrs(value, '');
            attrs.linethickness = 0;
            let arg0 = value[0].arg;
            let arg1 = value[1].arg;
            let top = mtransform(dsty, dropOutermostParens(value[0]));
            let bottom = mtransform(dsty, dropOutermostParens(value[1]));
            if (arg0) {
                top.mrow.attributes.arg = arg0;
                if (hasSingleMrow(top.mrow.content))
                    top.mrow.content = top.mrow.content[0].mrow.content;
            }
            if (arg1) {
                bottom.mrow.attributes.arg = arg1;
                if (hasSingleMrow(bottom.mrow.content))
                    bottom.mrow.content = bottom.mrow.content[0].mrow.content;
            }
            return {mfrac: withAttrs(attrs, [top, bottom])};

        case "binom":
            // desugar (not done in preprocessing step since LaTeX requires this sugar)
            return mtransform(dsty, {bracketed: {intent: value.intent, arg: value.arg, open: "(", close: ")", content: {atop: [value.top, value.bottom]}}});

        case "script":
            attrs = getAttrs(value, '');

            switch (value.type) {
                case "subsup":
                    selanchor1 = value.base.selanchor
                    value.base = mtransform(dsty, value.base);
                    if (selanchor1) {
                        // Move selanchor to base. TODO: handle other bases too
                        // along with selfocus for all bases
                        value.base.mi.attributes.selanchor = selanchor1
                        delete attrs.selanchor
                    }
                    if ("low" in value) {
                        value.low = getScriptArg(dsty, value.low);
                    }
                    if ("high" in value) {
                        value.high = getScriptArg(dsty, value.high);
                        if ("low" in value) {
                            return {msubsup: withAttrs(attrs,
                                            [value.base, value.low, value.high])};
                        }
                        return {msup: withAttrs(attrs, [value.base, value.high])};
                    }
                    if ("low" in value) {
                       return {msub: withAttrs(attrs, [value.base, value.low])};
                    }
                    return value.base;      // No subscript/superscript
                case "pre":
                    ret = [mtransform(dsty, value.base)];
                    if ("low" in value && "high" in value) {
                        ret.push(mtransform(dsty, dropOutermostParens(value.low)));
                        ret.push(mtransform(dsty, dropOutermostParens(value.high)));
                    } else if ("low" in value) {
                        ret.push(mtransform(dsty, dropOutermostParens(value.low)));
                        ret.push({none: noAttr()});
                    } else if ("high" in value) {
                        ret.push({none: noAttr()});
                        ret.push(mtransform(dsty, dropOutermostParens(value.high)));
                    }

                    ret.push({mprescripts: noAttr()});

                    if ("prelow" in value && "prehigh" in value) {
                        ret.push(mtransform(dsty, dropOutermostParens(value.prelow)));
                        ret.push(mtransform(dsty, dropOutermostParens(value.prehigh)));
                    } else if ("prelow" in value) {
                        ret.push(mtransform(dsty, dropOutermostParens(value.prelow)));
                        ret.push({none: noAttr()});
                    } else if ("prehigh" in value) {
                        ret.push({none: noAttr()});
                        ret.push(mtransform(dsty, dropOutermostParens(value.prehigh)));
                    } else {
                        throw "neither presubscript nor presuperscript present in prescript";
                    }

                    return {mmultiscripts: noAttr(ret)};
                case "abovebelow":
                    selanchor1 = value.base.selanchor
                    value.base = mtransform(dsty, dropOutermostParens(value.base));
                    if (selanchor1) {
                        // Move selanchor to base. TODO: handle other bases too
                        // along with selfocus for all bases
                        value.base.mi.attributes.selanchor = selanchor1
                        delete attrs.selanchor
                    }
                    if ("low" in value) {
                        value.low = getScriptArg(dsty, value.low);
                    }
                    if ("high" in value) {
                        value.high = getScriptArg(dsty, value.high);

                        if ("low" in value) {
                            return {munderover: withAttrs(attrs,
                                            [value.base, value.low, value.high])};
                        }
                        return {mover: withAttrs(attrs, [value.base, value.high])};
                    }
                    if ("low" in value)
                        return {munder: withAttrs(attrs, [value.base, value.low])};

                    return value.base;      // No limits

                default:
                    throw "invalid or missing script type";
            }

        case "enclosed":
            let symbol = value.symbol;
            mask = value.mask;
            attrs = getAttrs(value, '');
            attrs.notation = enclosureAttrs(mask, symbol);

            return {menclose: withAttrs(attrs, mtransform(dsty,
                                            dropOutermostParens(value.of)))};

        case "abstractbox":
            let options = abstractBoxOptions(value.mask);

            // abstract boxes aren't clearly defined in the tech note, testing
            // of word's implementation didn't yield many insights either – so I
            // implemented what I could, along with the following non-standard
            // but potentially helpful class attribute

            // TODO remove this class once all options are properly implemented
            attrs = {class: options.join(" "), intent: intent};

            // nAlignBaseline, nSpaceDefault, nSizeDefault: do nothing, these
            // are the defaults

            // TODO nAlignCenter: vertical center alignment, would sort of work for mtables (?), but not for arbitrary things

            // TODO nSpaceUnary, nSpaceBinary, nSpaceRelational, nSpaceSkip, nSpaceOrd, nSpaceDifferential: see https://www.w3.org/TR/MathML3/appendixc.html#oper-dict.space

            // nSizeText, nSizeScript, nSizeScriptScript: adjust scriptlevel (not implemented by any mathml renderer, but easy)
            // TODO or set mathsize (would lead to inconsistency between different mathml renderers)
            if (options.includes("nSizeText")) {
                attrs[scriptlevel] = 0;
            } else if (options.includes("nSizeScript")) {
                attrs[scriptlevel] = 1;
            } else if (options.includes("nSizeScriptScript")) {
                attrs[scriptlevel] = 2;
            }

            // TODO fBreakable: maybe related to https://www.dessci.com/en/products/mathplayer/tech/mathml3-lb-indent.htm

            // TODO fXPositioning: no clue

            // TODO fXSpacing: no clue

            return {mrow: withAttrs(attrs, mtransform(dsty, value.of))}

        case "hbrack":
            // TODO can probably do most of the work in a preprocessing step.
            // If the bracket precedes a script, put the bracket below or above
            // the script's base and the script's sub or sup text below or above
            // the bracket
            let base = dropSingletonLists(value.of);
            let expLow, expHigh;
            attrs = getAttrs(value, '');
            let mtag = overBrackets.includes(value.bracket) ? 'mover' : 'munder';

            if (value.intent)
                attrs.intent = value.intent;

            if (base.hasOwnProperty("script") &&
                (base.script.type == "subsup" || base.script.type == "abovebelow")) {
                expLow = base.script.low;
                expHigh = base.script.high;
                let type = base.script.type;
                base = dropOutermostParens(base.script.base);

                let exp;
                if (mtag == "mover") {
                    exp = expHigh;
                    if (expLow != undefined) {
                        base = {script: {base: base, type: type, low: expLow}};
                    }
                } else {
                    exp = expLow;
                    if (expHigh != undefined) {
                        base = {script: {base: base, type: type, high: expHigh}};
                    }
                }
                if (exp == null) {
                    throw "hbrack bracket type doesn't match script type";
                }

                return {[mtag]: withAttrs({},
                        [{[mtag]: withAttrs(attrs,
                            [mtransform(dsty, base),
                             {mo: withAttrs({stretchy: true}, value.bracket)}])},
                         mtransform(dsty, dropOutermostParens(exp))])};
            } else {
                return {[mtag]: withAttrs(attrs,
                        [mtransform(dsty, dropOutermostParens(value.of)),
                         {mo: withAttrs({stretchy: true}, value.bracket)}])};
            }

        case "root":
            return {mroot: withAttrs(getAttrs(value, ''),
                        [mtransform(dsty, dropOutermostParens(value.of)),
                         mtransform(dsty, value.degree)])};
        case "sqrt":
            val = mtransform(dsty, dropOutermostParens(value))
            attrs = getAttrs(value, '')

            return {msqrt: withAttrs(attrs, val)};

        case "function":
            let selanchorSave = selanchor
            let selfocusSave = selfocus
            attrs = getAttrs(value, ':function')
            if (selfocusSave && selfocusSave[0] == '-') {
                // Selection is in function name: move it there
                delete attrs.selanchor
                delete attrs.selfocus
                selanchor = selanchorSave
                selfocus = selfocusSave
            }
            val = mtransform(dsty, value.f)
            return {mrow: withAttrs(attrs,
                        [val, {mo: noAttr('\u2061')},
                         mtransform(dsty, value.of)])};
        case "text":
            // replace spaces with non-breaking spaces (else leading and
            // trailing spaces are hidden)
            attrs = getAttrs(value, '');
            if (value.length == 1 && (isAsciiAlphabetic(value) || isLcGreek(value))) {
                attrs.mathvariant = 'normal'
                return {mi: withAttrs(attrs, value)}
            }
            return {mtext: withAttrs(attrs, value.split(" ").join("\xa0"))};

        case "sizeoverride":
            /*
            switch (value.size) {
                case "A":  // one size larger
                    return {mstyle: withAttrs({scriptlevel: "-"}, mtransform(dsty, value.of))};
                case "B":  // two sizes larger
                    return {mstyle: withAttrs({scriptlevel: "-"}, {mstyle: withAttrs({scriptlevel: "-"}, mtransform(dsty, value.of))})};
                case "C":  // one size smaller
                    return {mstyle: withAttrs({scriptlevel: "+"}, mtransform(dsty, value.of))};
                case "D":  // two sizes smaller
                    return {mstyle: withAttrs({scriptlevel: "+"}, {mstyle: withAttrs({scriptlevel: "+"}, mtransform(dsty, value.of))})};
            }*/

            // note that font size changes based on scriptlevel are not
            // supported anywhere, but the fontsize attribute doesn't work as
            // expected in scripts in safari and firefox... not good solution to
            // be had, really
            switch (value.size) {
                case "A":  // one size larger
                    return {mstyle: withAttrs({fontsize: fontSize(1)}, mtransform(dsty, value.of))};
                case "B":  // two sizes larger
                    return {mstyle: withAttrs({fontsize: fontSize(2)}, mtransform(dsty, value.of))};
                case "C":  // one size smaller
                    return {mstyle: withAttrs({fontsize: fontSize(-1)}, mtransform(dsty, value.of))};
                case "D":  // two sizes smaller
                    return {mstyle: withAttrs({fontsize: fontSize(-2)}, mtransform(dsty, value.of))};
            }

        case "colored":
            attrs = getAttrs(value.of, '')
            attrs.mathcolor = value.color
            value.of = mtransform(dsty, value.of);
            if (value.of.hasOwnProperty('mo'))
                return {mo: withAttrs(attrs, value.of.mo.content)};
            return {mstyle: withAttrs(attrs, value.of)}

        case "bgcolored":
            attrs = getAttrs(value.of, '')
            attrs.mathbackground = value.color
            return {mstyle: withAttrs(attrs, mtransform(dsty, value.of))}

        case "comment":
            return {"␢": noAttr()};
        case "tt":
            return {mstyle: withAttrs({fontfamily: "monospace"}, {mtext: noAttr(value.split(" ").join("\xa0"))})};

        case "primed":
            attrs = getAttrs(value, '');
            return {msup: withAttrs(attrs, [mtransform(dsty, value.base),
                                      {mo: noAttr(processPrimes(value.primes))}
                                     ])};

        case "factorial":
            attrs = getAttrs(value, '');
            return {mrow: withAttrs(attrs, [mtransform(dsty, value), {mo: noAttr("!")}])};

        case "atoms":
            attrs = getAttrs(value, '')

            if (value.funct != undefined)
                return {mi: withAttrs(attrs, value.chars)}

            // n > 1 for atoms with embedded spaces and/or diacritics, e.g., 𝑐𝑎̂𝑏𝑛
            let n = value.length;
            let mis = [];                   // MathML elements to return

            if (n == undefined) {           // value isn't an array
                str = value.chars;          // Maybe value is a chars
                n = 1;
            } else {
                str = value[0].chars;
            }

            for (let i = 0; i < n; ) {
                if (str == undefined || str[0] == 'Ⅎ' || isFunctionName(str)) {
                    let val = mtransform(dsty, Array.isArray(value) ? value[i] : value);
                    if (attrs.intent || attrs.arg)
                        mis.push({mrow: withAttrs(attrs, val)});
                    else
                        mis.push(val);
                } else {
                    if (n == 3 && value[1].hasOwnProperty('spaces') && str[0] == 'ⅆ' &&
                        value[0].hasOwnProperty('chars')) {
                        // Need a more general fix for cases like 𝑥 ⅆ𝑥
                        str = value[0].chars + '\u2009' + str;
                    }
                    let cch = str.length;

                    if (cch > 2 || cch == 2 && str.codePointAt(0) < 0xFFFF) {
                        let cchCh = 1;

                        for (let j = 0; j < cch; j += cchCh) {
                            cchCh = (cch >= 2 && str.codePointAt(j) > 0xFFFF) ? 2 : 1;

                            if (isDoubleStruck(str[j])) {
                                if (j && str[j] == 'ⅆ' && str[j - 1] != '\u2009') {
                                    mis.push({mi: noAttr('\u2009')});
                                }
                                let ch = doublestruckChar(str[j]);
                                let attrsDoublestruck = getAttrsDoublestruck(ch, str[j]);
                                let intentD = attrsDoublestruck.intent
                                attrsDoublestruck = {...attrsDoublestruck, ...attrs}
                                if (str[j] == 'ⅅ')
                                    attrsDoublestruck.intent = intentD
                                mis.push({mi: withAttrs(attrsDoublestruck, ch)});
                            } else if ("-−,+".includes(str[j])) {
                                if (isAsciiDigit(str[j + 1])) {
                                    mis.push({mn: noAttr(str.substring(j))});
                                    break;
                                }
                                mis.push({mo: noAttr(str[j])});
                            } else {
                                if (inRange('\uFE00', str[j + cchCh], '\uFE0F'))
                                    cchCh++; // Include variation selector
                                mis.push({mi: noAttr(str.substring(j, j + cchCh))});
                            }
                        }
                    } else {                // str contains 1 char
                        if (str >= 'ⅅ' && str <= 'ⅉ') {
                            let ch = doublestruckChar(str);
                            let attrsDoublestruck = getAttrsDoublestruck(ch, str);
                            attrsDoublestruck = {...attrsDoublestruck, ...attrs}
                            mis.push({mi: withAttrs(attrsDoublestruck, ch)});
                        } else if (str == '⊺' && value.intent == "transpose") {
                            let ch = transposeChar();
                            if (ch == '⊤' || ch == '⊺') {
                                mis.push({mo: withAttrs(attrs, ch)});
                            } else {
                                if (ch == 'T' || ch == 't')
                                    attrs.mathvariant = "normal";
                                mis.push({mi: withAttrs(attrs, ch)});
                            }
                        } else {
                            let val = mtransform(dsty, Array.isArray(value) ? value[i] : value);
                            if (attrs.selanchor)
                                val.mi.attributes.selanchor = attrs.selanchor;
                            if (attrs.selfocus)
                                val.mi.attributes.selfocus = attrs.selfocus;
                            if (attrs.arg)
                                val.mi.attributes.arg = attrs.arg;
                            if (attrs.intent)
                                val.mi.attributes.intent = attrs.intent;
                            mis.push(val);
                        }
                    }
                }
                i++;
                if (i >= n)
                    break;
                str = value[i].chars;
            }
            if (mis.length > 1)
                return {mrow: withAttrs(attrs, mis)};
            return mis[0];

        case "chars":
            // tech note, section 4.1: "Similarly it is easier to type ASCII
            // letters than italic letters, but when used as mathematical
            // variables, such letters are traditionally italicized in print
            // [...] translate letters deemed to be standalone to the
            // appropriate math alphabetic characters". But upper-case Greek
            // letters are not italicized by default.
            if (value.length > 1)           // Usually math function name
                return {mi: noAttr(value)};

            if (value[0] >= "Α" && value[0] <= "Ω") // Upper-case Greek
                return {mi: withAttrs({mathvariant: "normal"}, value)};

            return {mi: noAttr(italicizeCharacters(value))};

        case "diacriticized":
            // TODO some of the work could be done in preprocessing step? but
            // need the loop both in preprocessing as well as actual compilation,
            // so doubtful if that would actually be better
            let notation = '';
            ret = mtransform(dsty, value.base);

            for (let d of value.diacritics) {
                // Handle diacritics that can be represented by an enclosure
                switch (d) {
                    case "\u0305":          // U+0305 COMBINING OVERLINE
                        notation = 'top';
                        break;
                    case "\u0332":          // U+0332 COMBINING LOW LINE
                        notation = 'bottom';
                        break;
                    case "\u20E0":          // U+20E0 COMBINING ENCLOSING CIRCLE BACKSLASH
                        ret = {menclose: withAttrs({notation: "downdiagonalstrike"}, ret)};
                                            // Fall through to enclosing circle
                    case "\u20DD":          // U+20DD COMBINING ENCLOSING CIRCLE
                        notation = 'circle';
                        break;
                    case "\u20DE":          // U+20DE COMBINING ENCLOSING SQUARE
                        notation = 'box';
                        break;
                    default:
                        let tag = (diacriticPosition(d) == -1) ? "munder" : "mover";
                        d = "&#x" + d.codePointAt(0).toString(16) + ";";
                        ret = {[tag]: withAttrs({accent: true}, [ret, {mo: noAttr(d)}])};
                        continue;
                }
                ret = {menclose: withAttrs({notation: notation}, ret)};
            }
            return ret;
        case "spaces":
            return mtransform(dsty, value);
        case "space":
            if (typeof value == 'number') {
                return {mspace: withAttrs({width: spaceWidths[value]}, null)};
            } else if (value == 'digit') {
                // mathml provides no way of getting the width of a digit and
                // using that as a space, so let's use a phantomized 0 here
                // return {mphantom: noAttr({mtext: noAttr(0)})};
                // Let the display engine figure out the spacing
                return {mo: noAttr('\u2007')};
            } else if (value == 'space') {
                // same deal: phantomized non-breaking space
                //return {mphantom: noAttr({mtext: noAttr('\xa0')})};
                return {mo: noAttr('\u00A0')};
           } else {
                throw "incorrect space"
            }

        case "number":
            return {mn: withAttrs(getAttrs(value, ''), value)};

        case "bracketed":
            let content
            let defaultIntent = ':fenced'
            let miContent
            let separator = ""

            // handle potential separator
            if (value.content.hasOwnProperty("separated")) {
                separator = value.content.separated.separator;
                value.content = value.content.separated.of;
            }

            if (value.open == '|' && value.close == '|') {
                content = mtransform(dsty, dropOutermostParens(value.content))
                defaultIntent = 'absolute-value($a)'
                if (content.mrow && Array.isArray(content.mrow.content)) {
                    let c = content.mrow
                    if (c.content.length == 1) {
                        c = c.content[0]
                        if (c.mtable) {
                            defaultIntent = 'determinant($a)'
                            c = c.mtable
                        } else if (c.mfrac) {
                            c = c.mfrac
                        } else if (c.mrow) {
                            c = c.mrow
                            if (c.content.length == 1) {
                                if (c.content[0].mi) {
                                    miContent = c.content[0].mi.content
                                    defaultIntent = 'absolute-value(' + miContent + ')'
                                } else if (c.content[0].mtext) {
                                    c = c.content[0].mtext
                                }
                            }
                        }
                    }
                    if (!miContent)
                        c.attributes = {arg: 'a'}
                }
            } else if (separator == "") {
                if (value.open == '{' && !value.close)
                    value.close = '\u200B'  // Need non0 char for inline editing
                content = mtransform(dsty, value.content);
            } else {

                // intercalate elements of mrow returned by recursive call with
                // separator
                content = mtransform(dsty, value.content).mrow.content;
                content = content.map(e => [e]).reduce((acc, v) => acc.concat({mo: noAttr(separator)}, v));
                content = {mrow: noAttr(content)};
            }

            // handle brackets: first inner mrow (content and brackets). if
            // they are strings, they should grow with their contents. note
            // that if the brackets are invisible, that is,〖content〗, this
            // wraps content in an mrow as desired.
            //if (!value.open && !value.close)
            //    return {mrow: withAttrs(getAttrs(value, ''), content)};

            if (useMfenced == 1) {          // Word needs mfenced
                // (Can test using Ctrl+C in output window)
                attrs = getAttrs(value, defaultIntent);
                if (attrs.intent)
                    attrs.intent = checkCardinalityIntent(attrs.intent, miContent)
                if (typeof value.open === 'string' && value.open != '(')
                    attrs.open = value.open
                if (typeof value.close === 'string' && value.close != ')')
                    attrs.close = value.close
                return [{mfenced: withAttrs(attrs, content)}]
            }

            ret = []
            if (typeof value.open === 'string') {
                ret.push({mo: noAttr(value.open)});
            } else {
                let openSize = fontSize(value.open.size);
                ret.push({mo: withAttrs({minsize: openSize, maxsize: openSize}, value.open.bracket)});
            }
            ret.push(content);

            if (typeof value.close === 'string') {
                ret.push({mo: noAttr(value.close)});
            } else {
                let closeSize = fontSize(value.close.size);
                ret.push({mo: withAttrs({minsize: closeSize, maxsize: closeSize}, value.close.bracket)});
            }
            attrs = getAttrs(value, defaultIntent)
            if (attrs.intent)
                attrs.intent = checkCardinalityIntent(attrs.intent, miContent)

            return [{mrow: withAttrs(attrs, ret)}]

        case "intend":
            // Set up for next element to get selanchor via getAttrs()
            if (value.symbol == 'Ⓐ')
                selanchor = value.value
            else if (value.symbol == 'Ⓕ')
                selfocus = value.value
            return value.op ? {mo: withAttrs(getAttrs(value, ''), value.op)} : ''

        default:
            return value;
    }
}


//////////////////
// PRETTY-PRINT //
//////////////////

function a(ast) {
    return v(ast)['attributes'];
}
function c(ast) {
    return v(ast)['content'];
}

function tag(tagname, attribs, ...vals) {
    let attributes = "";
    if (Object.keys(attribs).length) {
        attributes = " " + Object.keys(attribs).map(key => {
            let value = attribs[key];
            return `${key}="${value}"`;
        }).join(' ');
    }
    if (vals.length == 1 && vals[0] == null) {
        return `<${tagname}${attributes} />`;
    }
    let values = vals.reduce((a,b) => `${a} ${b}`);
    return `<${tagname}${attributes}>${values}</${tagname}>`;
}

function promoteAttributelessMrowChildren(value) {
    // Move children of attributeless-mrow children up into this mrow-like
    // element after removing the parents.
    for (let j = 0; j < value.length; j++) {
        let node = value[j]
        if (node.mrow) {
            let attrs = a(node)
            if (!Object.keys(attrs).length) {
                // No attributes: replace mrow by its children
                let c = node.mrow.content.length // Count of grandchildren
                let arr = value.splice(j, 1)     // Grandchildren
                let jT = -2
                for (let i = 0; i < c; i++) {
                    let nodeG = arr[0].mrow.content[i]
                    value.splice(j++, 0, nodeG)  // Insert next grandchild
                    if (jT == -2 && nodeG.mrow) {
                        attrs = a(nodeG)         // Attributeless mrow?
                        if (!Object.keys(attrs).length)
                            jT = j - 1           // Index of mrow to check
                    }
                }
                j--                 // Added c children after deleting 1 mrow
                if (jT != -2)       // At least 1 mrow grandchild moved up
                    j = jT - 1      // Continue with first one
            }
        }
    }
}

// pretty-print MathML AST
function pretty(mast) {
    // map over lists and concat results
    if (Array.isArray(mast)) {
        let ret = ''

        for (let i = 0; i < mast.length; i++)
            ret += pretty(mast[i])
        return ret
    }

    if (typeof mast !== 'object') {
        return mast;
    }

    let key = k(mast)
    let attributes = a(mast)
    let value = c(mast)
    let arg, i

    switch (key) {
        case "mrow":
            // mrow elimination: ignore superfluous mrows, i.e. ones that
            // contain only a single child and have no attributes
            if (Array.isArray(value) && value.length == 1 && !attributes.arg) {
                // insert a dummy mrow around the singleton array value to fix
                // bug occurring if this singleton array value is again an array,
                // which the pretty() function would then simply map over,
                // which is problematic in certain contexts such as scripts
                // where a set number of nodes on one level is required
                return pretty({mrow: {attributes: attributes, content: value[0]}});
            }
            if (Array.isArray(value) && (!attributes.intent ||
                    attributes.intent != ':fenced')) {
                // Unless this mrow has the ':fenced' attribute, move the
                // children of attributeless-mrow children up into this mrow
                // after removing the parents.
                promoteAttributelessMrowChildren(value)
            } else if (!Object.keys(attributes).length) {
                return pretty(value);
            }
            return tag(key, attributes, pretty(value));

        case "math":
        case "menclose":
        case "merror":
        case "mphantom":
        case "mpadded":
        case "msqrt":
        case "mscarry":
        case "mstyle":
        case "mtd":
            if (Array.isArray(value)) {
                promoteAttributelessMrowChildren(value)
                return tag(key, attributes, pretty(value))
            }
            arg = pretty(value)
            i = 0
            if (arg.startsWith('<mrow') && arg.endsWith('</mrow>')) {
                if (arg.startsWith('<mrow selanchor="0"')) {
                    i = 20
                } else if (arg[5] == '>') {
                    i = 6
                }
            }
            if (i) {
                arg = arg.substring(i, arg.length - 7)
                if (i == 20) {
                    i = arg.indexOf('>')
                    arg = arg.substring(0, i) + ' selanchor="0"' + arg.substring(i)
                }
            }
            return tag(key, attributes, arg)

        case "mover":
        case "msub":
        case "msubsup":
        case "msup":
        case "munder":
        case "munderover":

        case "mfenced":
        case "mfrac":
        case "mroot":
        case "mtr":
        case "mlabeledtr":
        case "mtable":
        case "mmultiscripts":
        case "mprescripts":
        case "none":
            return tag(key, attributes, pretty(value));
        case "mi":
        case "mn":
        case "mo":
        case "mtext":
        case "mspace":
            return tag(key, attributes, value);
        case "maligngroup":
        case "malignmark":
            if (useMfenced == 1)            // Word needs malignmark, maligngroup
                return tag(key, attributes, value);
            return key == 'maligngroup'
                ? `</mtd><mtd style='padding-left:0;text-align:right;float:right;display:math'>`
                : `</mtd><mtd style='padding-left:0;text-align:left;vertical-align:middle'>`
        case "␢":
            return "";
        default:
            return value;
    }
}

///////////////////////////
// MathML to UnicodeMath //
///////////////////////////

function unary(node, op) {
    // Unary elements have the implied-mrow property
    let cNode = node.childElementCount
    let ret = nary(node, '', cNode)

    if (!op) {
        ret = removeOuterParens(ret)
    } else if (cNode > 1 || cNode == 1 && node.firstElementChild.nodeName == 'mfrac') {
        ret = '(' + ret + ')'
    }
    return op + ret
}

function binary(node, op) {
    let ret = dump(node.firstElementChild);
    let retd = dump(node.lastElementChild);

    if (isMathMLObject(node) && node.childElementCount) {
        // Add enclosing parens for parenthesized arguments that lose their
        // outermost parens when built up.
        let attr = node.lastElementChild.getAttribute('intent')
        if (attr == ':fenced' && retd[0] == '(' && retd[retd.length - 1] == ')')
            retd = '(' + retd + ')'
        if (node.nodeName == 'mfrac') {
            attr = node.firstElementChild.getAttribute('intent')
            if (attr == ':fenced' && ret[0] == '(' && ret[ret.length - 1] == ')')
                ret = '(' + ret + ')'
        }
    }

    if (op == '⊘') {
        let ch = getUnicodeFraction(ret, retd);
        if (ch)
            return ch;
    }
    if (op == '/' && (ret.endsWith('^∗ )') || ret.endsWith('^† )'))) {
        // Remove superfluous build-up space & parens
        ret = ret.substring(1, ret.length - 2);
    }
    ret += op + retd;
    if (op)
        ret += ' ';
    return ret;
}

function ternary(node, op1, op2) {
    let ret = [dump(node.children[1]), dump(node.children[2])]

    if (node.nodeName == 'msubsup' || node.nodeName == 'munderover') {
        // Add enclosing parens for parenthesized arguments that lose their
        // outermost parens when built up, here for munderover/msubsup
        // second and third children
        for (let i = 0; i < 2; i++) {
            let attr = node.children[i + 1].getAttribute('intent')

            if (attr == ':fenced' && ret[i][0] == '(' && ret[i][ret[i].length - 1] == ')')
                ret[i] = '(' + ret[i] + ')'
        }
    }
    return dump(node.firstElementChild) + op1 + ret[0] + op2 + ret[1] + ' '
}

function nary(node, op, cNode) {
    let ret = '';

    for (let i = 0; i < cNode; i++) {
        ret += dump(node.children[i]);
        if (i < cNode - 1)
            ret += op;
    }
    return ret;
}

function checkSelAttr(value, op) {
    let attr = op == 'Ⓐ' ? 'selanchor' : 'selfocus'
    let selattr = value.getAttribute(attr)
    if (!selattr)
        return ''
    if (selattr == '0')
        selattr = ''
    return op + '(' + selattr + ')'
}

function getSelectionCodes(value) {
    return ksi ? checkSelAttr(value, 'Ⓐ') + checkSelAttr(value, 'Ⓕ') : ''
}

function isDigitArg(node) {
    if (!node || !node.lastElementChild)
        return false

    return node.lastElementChild.nodeName == 'mn' && node.children[1] &&
        isAsciiDigit(node.children[1].textContent)
}

function dump(value, noAddParens) {
	// Function called recursively to convert MathML to UnicodeMath
    if (!value)
        return ''

    let cNode = value.childElementCount ? value.childElementCount : 1
    let intent
    let nodeLEC                             // node.lastElementChild
    let op
    let ret = ''
    let symbol
    let val

    switch (value.localName) {
        case 'mtable':
            symbol = '■';
            intent = value.getAttribute('intent')
            if (intent == ':equations') {
                symbol = '█';
            } else if (value.parentElement.hasAttribute('intent')) {
                intent = value.parentElement.getAttribute('intent');

                for (const [key, val] of Object.entries(matrixIntents)) {
                    if (val == intent) {
                        symbol = key;
                        break;
                    }
                }
            } else if (intent == ':math-paragraph') {
                for (let i = 0; i < cNode; i++) {
                    let node = value.children[i] // <mtr> or <mlabeledtr>
                    if (node.nodeName == 'mlabeledtr' ||
                        node.firstElementChild.getAttribute('intent')
                            == ':equation-label') {
                        let text = node.firstElementChild.textContent
                        if (node.childElementCount == 3)
                            ret += dump(node.children[1]) + '&'
                        ret += dump(node.lastElementChild) + '#' + text
                    } else {
                        ret += dump(node)
                    }
                    if (i < cNode - 1)
                        ret += '\n'             // Separate eqs by \n
                }
                break
            } else if (cNode == 1 && hasEqLabel(value)) {
                // Numbered equation: convert to UnicodeMath like 𝐸=𝑚𝑐²#(20)
                let eqno = value.firstElementChild.firstElementChild.firstElementChild.textContent
                return dump(value.firstElementChild.lastElementChild) + '#' + eqno
            }
            ret = symbol + '(' + nary(value, '@', cNode) + ')';
            break;

        case 'mtr':
            ret = nary(value, '&', cNode)
            if (ret[0] == '&')
                ret = ret.substring(1)
            break;

        case 'mtd':
            intent = value.getAttribute('intent')
            if (intent == ':no-equation-label')
                return ''
            ret = nary(value, '', cNode)
            if (ret[0] == '&')
                ret = ret.substring(1)
            break;

        case 'maligngroup':
        case 'malignmark':
            ret = '&';
            break;

        case 'menclose':
            let notation = value.getAttribute('notation')
            if (notation) {
                for (const [key, val] of Object.entries(symbolClasses)) {
                    if (val == notation) {
                        ret = unary(value, key);
                        break;
                    }
                }
                if (ret)
                    break;
                let mask = 0;

                while (notation) {
                    let attr = notation.match(/[a-z]+/)[0];
                    notation = notation.substring(attr.length + 1);
                    for (const [key, val] of Object.entries(maskClasses)) {
                        if (val == attr)
                            mask += Number(key);
                    }
                }
                if (mask) {
                    ret = unary(value, '')
                    ret = '▭(' + (mask ^ 15) + '&' + ret + ')';
                    break;
                }
            }
            ret = unary(value, '▭');
            break;

        case 'mphantom':
            ret = unary(value, '⟡');       // Full size, no display
            break;

        case 'mpadded':
            op = '';
            let mask = 0;                   // Compute phantom mask

            if (value.getAttribute('width') === '0')
                mask = 2;                   // fPhantomZeroWidth
            if (value.getAttribute('height') === '0')
                mask |= 4;                  // fPhantomZeroAscent
            if (value.getAttribute('depth') === '0')
                mask |= 8;                  // fPhantomZeroDescent

            if (value.firstElementChild &&
                value.firstElementChild.nodeName == 'mphantom') { // No display
                if (mask == 2)
                    op = '⇳';               // fPhantomZeroWidth
                else if (mask == 12)
                    op = '⬄';              // fPhantomZeroAscent | fPhantomZeroDescent
                ret = dump(value.firstElementChild).substring(1)
                ret = op ? op + ret
                    : '⟡(' + mask + '&' + removeOuterParens(ret) + ')'
                break
            }
            const opsShow = {2: '⬌', 4: '⬆', 8: '⬇', 12: '⬍'};
            op = opsShow[mask];
            mask |= 1;                      // fPhantomShow

            if (op) {
                ret = unary(value, op)
            } else {
                ret = removeOuterParens(nary(value, '', cNode))
                ret = '⟡(' + mask + '&' + ret + ')'
            }
            break

        case 'mstyle':
            ret = nary(value, '', cNode)
            val = value.getAttribute('mathcolor')
            if(val)
                ret = '✎(' + val + '&' + ret + ')';
            val = value.getAttribute('mathbackground')
            if (val)
                ret = '☁(' + val + '&' + ret + ')';
            break;

        case 'msqrt':
            ret = unary(value, '√');
            break;

        case 'mroot':
            ret = '√(' + dump(value.lastElementChild, true) + '&' +
                         dump(value.firstElementChild, true) + ')';
            break;

        case 'mfrac':
            op = '/';
            val = value.getAttribute('displaystyle')
            if (val === 'false')
                op = '⊘';
            val = value.getAttribute('linethickness')
            if (val == '0' || val == '0.0pt') {
                op = '¦';
                if (value.parentElement.hasAttribute('intent') &&
                    value.parentElement.getAttribute('intent').startsWith('binomial-coefficient') ||
                    value.parentElement.firstElementChild.hasAttribute('title') &&
                    value.parentElement.firstElementChild.getAttribute('title') == 'binomial coefficient')
                    op = '⒞';
            }
            ret = binary(value, op);
            // TODO: also add space for mi mrow mfrac
            if (value.previousElementSibling && value.previousElementSibling.nodeName != 'mo') {
                ret = ' ' + ret;                    // Separate variable and numerator
            }
            break;

        case 'msup':
            nodeLEC = value.lastElementChild
            if (isDigitArg(value) && !getSelectionCodes(nodeLEC)) {
                ret = dump(value.firstElementChild) +
                    digitSuperscripts[nodeLEC.textContent]
                break
            }
            op = '^';
            if (nodeLEC && isPrime(nodeLEC.textContent))
                op = '';
            ret = binary(value, op);

            // Check for intent='transpose'
            if (nodeLEC && nodeLEC.getAttribute('intent') == 'transpose') {
                let cRet = ret.length;
                let code = codeAt(ret, cRet - 2);
                if (code != 0x22BA) {       // '⊺'
                    if (code > 0xDC00)
                        cRet--;             // To remove whole surrogate pair
                    ret = ret.substring(0, cRet - 2) + '⊺';
                }
            }
            break;

        case 'mover':
            if (overBrackets.includes(value.lastElementChild.textContent)) {
                ret = dump(value.lastElementChild) + dump(value.firstElementChild);
                break;
            }
            op = value.hasAttribute('accent') ? '' : '┴';
            ret = binary(value, op);
            break;

        case 'munder':
            if (underBrackets.includes(value.lastElementChild.textContent)) {
                ret = dump(value.lastElementChild) + dump(value.firstElementChild);
                break;
            }

            op = value.hasAttribute('accentunder') ? '' : '┬';
            if (value.firstElementChild.innerHTML == 'lim')
                op = '_';
            ret = binary(value, op);
            break;

        case 'msub':
            nodeLEC = value.lastElementChild
            if (isDigitArg(value) && !getSelectionCodes(nodeLEC)) {
                ret = dump(value.firstElementChild) +
                    digitSubscripts[nodeLEC.textContent];
                break
            }
            ret = binary(value, '_');
            break;

        case 'munderover':
            intent = value.parentElement.getAttribute('intent')
            if (!intent || !intent.startsWith(':nary')) {
                ret = ternary(value, '┬', '┴');
                break;
            }
                                            // Fall through to msubsup
        case 'msubsup':
            nodeLEC = value.lastElementChild
            if (nodeLEC && !getSelectionCodes(value.children[1]) &&
                !getSelectionCodes(nodeLEC)) {
                if (isDigitArg(value)) {
                    ret = dump(value.firstElementChild) +
                        digitSubscripts[value.children[1].textContent];
                    if (isAsciiDigit(nodeLEC.textContent)) {
                        ret += digitSuperscripts[nodeLEC.textContent]
                        break;
                    }
                    ret += '^' + dump(nodeLEC);
                    break;
                }
                if (isPrime(nodeLEC.textContent) && value.children[1].childElementCount < 2) {
                    ret = dump(value.firstElementChild) + nodeLEC.textContent
                    if (isAsciiDigit(value.children[1].textContent))
                        ret += digitSubscripts[value.children[1].textContent]
                    else
                        ret += '_' + dump(value.children[1])
                    break
                }
            }
            ret = ternary(value, '_', '^');
            break;

        case 'mmultiscripts':
            ret = '';
            if (value.children[3].nodeName == 'mprescripts') {
                if (value.children[4].nodeName != 'none')
                    ret = '_' + dump(value.children[4]);
                if (value.children[5].nodeName != 'none')
                    ret += '^' + dump(value.children[5]);
                if (ret)
                    ret += ' ';
            }
            ret += dump(value.children[0]);
            if (value.children[1].nodeName != 'none')
                ret += '_' + dump(value.children[1]);
            if (value.children[2].nodeName != 'none')
                ret += '^' + dump(value.children[2]);
            break;

        case 'mfenced':
            let [opClose, opOpen, opSeparators] = getFencedOps(value)
            let cSep = opSeparators.length;

            ret = opOpen;
            for (let i = 0; i < cNode; i++) {
                ret += dump(value.children[i]);
                if (i < cNode - 1)
                    ret += i < cSep - 1 ? opSeparators[i] : opSeparators[cSep - 1];
            }
            ret += opClose;
            break;

        case 'mo':
            val = value.innerHTML;
            if (val == '\u200B' && value.parentElement.getAttribute('intent') == ':cases')
                return ''                   // Discard ZWSP (used for in-line editing)
            if (!intent)
                intent = value.getAttribute('intent')
            if (intent == ':text') {
                ret = '\\' + val
                break
            }
            if (val == '&fa;') {
                ret = '\u2061';
                break;
            }
            if (val == '&nbsp;') {
                ret = '\u00A0'
                break
            }
            if (val == '&lt;') {
                ret = '<';
                break;
            }
            if (val == '&gt;') {
                ret = '>';
                break;
            }
            if (val == '&amp;') {
                ret = '&';
                break;
            }
            if (val == '/' && !autoBuildUp) { // Quote other ops...
                ret = '\\/';
                break;
            }
            if (val == '\u202F' && autoBuildUp) {
                ret = ' '
                break;
            }
            if (val == '|') {
                ret = val
                let node = value.parentElement.parentElement
                if (node.getAttribute('intent') == ':fenced' &&
                    node.firstElementChild.textContent == '⟨' &&
                    node.lastElementChild.textContent == '⟩') {
                    ret = '│'               // U+2502
                }
                break
            }
            if (val.startsWith('&#') && val.endsWith(';')) {
                ret = value.innerHTML.substring(2, val.length - 1);
                if (ret[0] == 'x')
                    ret = '0' + ret;
                ret = String.fromCodePoint(ret);
                break;
            }
            if (value.hasAttribute('title')) {
                // The DLMF title attribute implies the following intents
                // (see also for 'mi')
                switch (value.getAttribute('title')) {
                    case 'differential':
                    case 'derivative':
                        ret = 'ⅆ';
                        break;
                    case 'binomial coefficient':
                        val = '';
                }
            }
            if (!ret)
                ret = val
            break;

        case 'mi':
            intent = value.getAttribute('intent')
            if (isDoubleStruck(intent)) {
                ret = intent;
                break;
            }
            if (value.innerHTML.length == 1) {
                let c = value.innerHTML;
                if (!value.hasAttribute('mathvariant')) {
                    ret = italicizeCharacter(c);
                    break;
                }
                let mathstyle = mathvariants[value.getAttribute('mathvariant')];
                if (c in mathFonts && mathstyle in mathFonts[c] && (c < 'Α' || c > 'Ω' && c != '∇')) {
                    ret = mathFonts[c][mathstyle];
                    break;
                }

                if (mathstyle == 'mup') {
                    if (value.hasAttribute('title')) {
                        // Differential d (ⅆ) appears in 'mo'
                        switch (value.getAttribute('title')) {
                            case 'base of natural logarithm':
                                ret = 'ⅇ';
                                break;
                            case 'imaginary unit':
                                ret = 'ⅈ';
                                break;
                        }
                        if (ret)
                            break;
                    }
                    if (c != '∞' && c != '⋯' && !inRange('\u0391', c, '\u03A9')) {
                        ret = '"' + c + '"';
                        break;
                    }
                }
            }                               // else fall through
        case 'mn':
            ret = value.textContent;
            break;

        case 'mtext':
            ret = value.textContent.replace(/\"/g, '\\\"')
            ret = '"' + ret + '"';
            break;

        case 'mspace':
            let width = value.getAttribute('width')
            if (width) {
                for (let i = 0; i < spaceWidths.length; i++) {
                    if (width == spaceWidths[i]) {
                        ret = uniSpaces[i];
                        break;
                    }
                }
            }
            break;
    }

    let selcode = getSelectionCodes(value)
    if (ret) {
        if (!selcode)
            return ret

        const needPreSpace = ['mfrac', 'mover', 'msub', 'msubsup', 'msup',
            'munder', 'munderover']

        if (needPreSpace.includes(value.nodeName)) {
            // Insert ' ' between the selection code(s) and certain MathML
            // elements so that the code(s) apply to the element and not to
            // its first child
            selcode += ' '
        }
        return selcode + ret
    }

    // Dump <mrow> children
    for (let i = 0; i < cNode; i++) {
        let node = value.children[i];
        ret += checkSpace(i, node, ret)
        ret += dump(node, false, i);
    }

    if (selcode) {
        if (value.localName == 'math' && selcode.length == 4 &&
            selcode[2] == value.childElementCount) {
            ret = ret + ' Ⓐ()'             // Insertion point at math-zone end
        } else {
            if (cNode > 1)
                selcode += ' '
            ret = selcode + ret
        }
    }

    let mrowIntent = value.nodeName == 'mrow' && value.hasAttribute('intent')
        ? value.getAttribute('intent') : '';

    if (mrowIntent) {
        if (mrowIntent == ':cases')
            return 'Ⓒ' + ret.substring(2);

        if (mrowIntent == ':fenced' && value.childElementCount &&
            !value.lastElementChild.textContent) {
            return !value.firstElementChild.textContent ? '〖' + ret + '〗' : ret + '┤';
        }
        if (mrowIntent.startsWith('cardinality')) {
            ret = ret.substring(1, ret.length - 1) // Remove '|'s
            return needParens(ret) ? 'ⓒ(' + ret + ')' : 'ⓒ' + ret + ' '
        }
        if (mrowIntent.startsWith('binomial-coefficient') ||
            mrowIntent.endsWith('matrix') || mrowIntent.endsWith('determinant')) {
            // Remove enclosing parens for 𝑛⒞𝑘 and bracketed matrices
            let i = ret.length - 1
            if (ret[0] == '|')              // Determinant
                return ret.substring(1, i)
            if (ret[0] == '(' && ret[i] == ')')
                return ret.substring(1, i)

            // ret doesn't start with '(' and end with ')'. Scan ret matching
            // parens. If a ')' follows a '⒞' and matches the a '(', remove
            // the parens. This allows selection anchor and focus to be present
            // with binomial coefficients
            let binomial
            let cParen = 0
            let iOpen = -1
            for (i = 0; i < ret.length; i++) {
                switch (ret[i]) {
                    case '(':
                        cParen++
                        iOpen = i
                        break;
                    case ')':
                        cParen--
                        if (!cParen && binomial && iOpen >= 0)
                            return ret.substring(0, iOpen) +
                                ret.substring(iOpen + 1, i) + ret.substring(i + 1)
                        iOpen = -1
                        break;
                    case '⒞':
                        binomial = true
                        break;
                }
            }
            return ret
        }
        if (mrowIntent == ':function' && value.previousElementSibling &&
            value.firstElementChild &&      // (in case empty)
            value.firstElementChild.nodeName == 'mi' &&
            value.firstElementChild.textContent < '\u2100' &&
            value.previousElementSibling.nodeName == 'mi') {
            return ' ' + ret;               // Separate variable & function name
        }
    }
    if (value.firstElementChild && value.firstElementChild.nodeName == 'mo' &&
        !autoBuildUp && isOpenDelimiter(value.firstElementChild.textContent)) {
        if (value.lastElementChild.nodeName != 'mo' || !value.lastElementChild.textContent)
            ret += '┤';                     // Happens for some DLMF pmml
    }

    if (cNode > 1 && value.nodeName != 'math' && !noAddParens &&
        (!mrowIntent || mrowIntent != ':fenced') &&
        isMathMLObject(value.parentElement, true) && needParens(ret)) {
        ret = '(' + ret + ')';
    }
    return ret;
}

function MathMLtoUnicodeMath(mathML, keepSelInfo) {
    const doc = getMathMLDOM(mathML);
    return getUnicodeMath(doc.firstElementChild, keepSelInfo)
}

function getUnicodeMath(doc, keepSelInfo, noAddParens) {
    ksi = keepSelInfo                        // Keep selection info for undo
    let unicodeMath = dump(doc, noAddParens) // Get UnicodeMath from DOM doc

    // Remove some unnecessary spaces
    for (let i = 0; ; i++) {
        i = unicodeMath.indexOf(' ', i);
        if (i < 0)
            break;                          // No more spaces
        if (i == unicodeMath.length - 1) {
            unicodeMath = unicodeMath.substring(0, i);
            break;
        }
        if ('=+−/ )]}〗'.includes(unicodeMath[i + 1])) {
            let j = 1;                      // Delete 1 space
            if (unicodeMath[i + 1] == ' ' && i < unicodeMath.length - 2 &&
                '=+−/)]}'.includes(unicodeMath[i + 2])) {
                j = 2;                      // Delete 2 spaces
            }
            unicodeMath = unicodeMath.substring(0, i) + unicodeMath.substring(i + j);
        }
    }
    return unicodeMath
}

//////////////
// PLUMBING //
//////////////

function unicodemathml(unicodemath, displaystyle) {
    debugGroup(unicodemath);
    selanchor = selfocus = null
    if (isMathML(unicodemath)) {
        if (unicodemath.startsWith('<mml:math') || unicodemath.startsWith('<m:math'))
            unicodemath = removeMmlPrefixes(unicodemath);
        return {mathml: unicodemath, details: {}};
    }
    let uast;
    let t1s = performance.now();
    try {
        uast = parse(unicodemath);
    } catch (error) {
        // Display unparsable string in red
        uast = {unicodemath: {content: [{expr: [{colored: {color: '#F00', of: {text: unicodemath}}}]}], eqnumber: null}}
        autoBuildUp = false                 // If called for autobuildup, return failure
        if(!testing)
            console.log(unicodemath + ' parse error: ' + error.name)
    }
    let jsonParse;                          // Initially undefined
    let puast;
    let mast;
    try {
        jsonParse = JSON.stringify(uast, undefined);
        let t1e = performance.now();
        debugLog(uast);

        let dsty = {display: displaystyle, intent: ''};
        let t2s = performance.now();
        puast = preprocess(dsty, uast);
        let t2e = performance.now();
        debugLog(puast);

        let t3s = performance.now();
        mast = mtransform(displaystyle, puast);
        if (selanchor && mast.math) {
            mast.math.attributes.selanchor = '1'
            selanchor = ''
        }
        let t3e = performance.now();
        debugLog(mast);

        let t4s = performance.now();
        let mathml = pretty(mast);
        let t4e = performance.now();
        useMfenced = 0
        mathml = mathml.replace(/<mtd><\/mtd>/g, '')

        debugGroup();
        return {
            mathml: mathml,
            details: {
                measurements: {
                    parse:      t1e - t1s,
                    preprocess: t2e - t2s,
                    transform:  t3e - t3s,
                    pretty:     t4e - t4s
                },
                intermediates: {
                    parse:      uast,
                    preprocess: puast,
                    transform:  mast,
                    json:       jsonParse
                }
            }
        };
    } catch(error) {
        debugLog(error);

        // convert error to string and invert any private use area mappings
        let strError = ''; // mapFromPrivate("" + error);

        // add variant of input with resolved control words, if any
        //if (typeof ummlConfig !== "undefined" && typeof ummlConfig.resolveControlWords !== "undefined" && ummlConfig.resolveControlWords && resolveCW(unicodemath) != unicodemath) {
        //    strError = "(Resolved to \"" + resolveCW(unicodemath) + "\".) " + error;
        //}

        autoBuildUp = false                 // If called for autobuildup, return failure
        useMfenced = 0
        debugGroup();
        return {
            //mathml: `<math class="unicodemath" xmlns="http://www.w3.org/1998/Math/MathML"><merror><mrow><mtext>⚠ [${escapeHTMLSpecialChars(unicodemath)}] ${escapeHTMLSpecialChars(strError)}</mtext></mrow></merror></math>`,
            mathml: `<span class="unicodemathml-error"><span class="unicodemathml-error-unicodemath">${escapeHTMLSpecialChars(unicodemath)}</span> <span class="unicodemathml-error-message">${escapeHTMLSpecialChars(strError)}</span></span>`,
            details: {
                intermediates: {            // Show what got defined
                    parse: uast,            // At least uast is defined
                    preprocess: puast,
                    transform: mast,
                    json: jsonParse
                }
            }
        };
    }
}


//////////////
// PLUMBING //
//////////////

root.doublestruckChar = doublestruckChar
root.dump = dump
root.foldMathItalic = foldMathItalic;
root.foldMathItalics = foldMathItalics;
root.foldMathAlphanumeric = foldMathAlphanumeric;
root.getPartialMatches = getPartialMatches;
root.isFunctionName = isFunctionName;
root.italicizeCharacter = italicizeCharacter;
root.italicizeCharacters = italicizeCharacters;
root.mathFonts = mathFonts;
root.MathMLtoUnicodeMath = MathMLtoUnicodeMath
root.negs = negs;
root.resolveCW = resolveCW;
root.unicodemathml = unicodemathml;
root.getUnicodeMath = getUnicodeMath
root.controlWords = controlWords

})(this);
