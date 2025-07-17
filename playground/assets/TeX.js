
///////////////////////////
//   MathML to [La]TeX   //
///////////////////////////

const accentsAbove = {
    '¯':        'overbar',
    '\u0300':   'grave',
    '\u0301':   'acute',
    '\u0302':   'hat',
    '\u0303':   'tilde',
    '\u0305':   'bar',
    '\u0306':   'breve',
    '\u0307':   'dot',
    '\u0308':   'ddot',
    '\u030C':   'check',
    '\u20D7':   'vec',
    '\u20DB':   'dddot',
    '\u20DC':   'ddddot',
    '\u23B4':   'overbracket',
    '\u23DC':   'overparen',
    '\u23DE':   'overbrace',
    '\u23E0':   'overshell',
}

const accentsBelow = {
    '\u23B5':   'underbracket',
    '\u23DD':   'underparen',
    '\u23DF':   'underbrace',
    '\u23E1':   'undershell',
    '\u2581':   'underbar',
}

const enclosures = {
    'box':          'boxed',
    'top':          '',
    'bottom':       '',
    'roundedbox':   '',
    'circle':       'circle',
    'longdiv':      '',
    'actuarial':    '',
    'cancel':       'cancel',
    'bcancel':      'bcancel',
    'xcancel':      'xcancel',
}

function MathMLtoTeX(mathML) {
    const doc = getMathMLDOM(mathML);
    return TeX(doc.firstElementChild)
}


function checkBracing(str) {
    let code = str.codePointAt(0)
    if (str.length > 2 && !isOpenDelimiter(str[0]) && str[0] != '\\' || str.length == 2 && code < 0xD800)
        str = '{' + str + '}'
    return str
}

function isDigitArg(node) {
    if (!node || !node.lastElementChild)
        return false

    return node.lastElementChild.nodeName == 'mn' && node.children[1] &&
        isAsciiDigit(node.children[1].textContent)
}

function TeX(value, noAddParens) {
    // Function called recursively to convert MathML to [La]TeX
    if (!value)
        return ''

    function unary(node, op) {
        // Unary elements have the implied-mrow property
        let cNode = node.childElementCount
        let ret = nary(node, '', cNode)

        if (!op)
            ret = removeOuterParens(ret)

        return op + '{' + ret + '}'
    }

    function binary(node, op) {
        let reta = checkBracing(TeX(node.firstElementChild))
        let retb = checkBracing(TeX(node.lastElementChild))

        return reta + op + retb;
    }

    function ternary(node, op1, op2) {
        let reta = checkBracing(TeX(node.firstElementChild))
        let retb = checkBracing(TeX(node.children[1]))
        let retc = checkBracing(TeX(node.lastElementChild))

        return reta + op1 + retb + op2 + retc
    }

    function nary(node, op, cNode) {
        let ret = '';

        for (let i = 0; i < cNode; i++) {
            ret += TeX(node.children[i])
            if (i < cNode - 1)
                ret += op;
        }
        return ret;
    }
    const matrixIntents = {
        'pmatrix': ':parenthesized-matrix',
        'vmatrix': ':determinant',
        'Vmatrix': ':normed-matrix',
        'bmatrix': ':bracketed-matrix',
        'Bmatrix': ':curly-braced-matrix',
    }

    let cNode = value.nodeName == '#text' ? 1 : value.childElementCount
    let intent
    let ret = ''
    let val

    switch (value.localName) {
        case 'mtable':
            let symbol = 'matrix'
            intent = value.getAttribute('intent')
            if (intent == ':equations')
                symbol = 'aligned'
            if (value.parentElement.firstElementChild.textContent == '{' &&
                (value.parentElement.childElementCount == 2 ||
                    !value.parentElement.lastElementChild.textContent) &&
                value.parentElement.children[1] == value) {
                    ret = '\\begin{cases}' + nary(value, '\\\\', cNode) + '\\end{cases}'
                    break
            } else if (value.parentElement.hasAttribute('intent')) {
                intent = value.parentElement.getAttribute('intent')

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
                        let eq = node.firstElementChild.textContent
                        if (eq && eq[0] == '(')
                            eq = eq.substring(1, eq.length - 1)
                        ret += '\\begin{equation}\\label{eq' + eq + '}'
                        if (node.childElementCount > 2)
                            ret += TeX(node.children[1]) + '&'
                        ret += TeX(value.firstElementChild.lastElementChild) +
                            '\\end{equation}'
                    } else {
                        ret += dump(node)
                    }
                    if (i < cNode - 1)
                        ret += '\\\\'             // Separate eqs by \\
                }
                break
            } else if (cNode == 1 && hasEqLabel(value)) {
                // Numbered equation
                let eq = value.firstElementChild.firstElementChild.firstElementChild.textContent
                if (eq && eq[0] == '(')
                    eq = eq.substring(1, eq.length - 1)
                ret = '\\begin{equation}\\label{eq' + eq + '}' +
                    TeX(value.firstElementChild.lastElementChild) + '\\end{equation}'
                break;
            }
            ret = '\\begin{' + symbol + '}' + nary(value, '\\\\', cNode) + '\\end{' + symbol + '}'
            break;

        case 'mtr':
            ret = nary(value, '&', cNode);
            break;

        case 'mtd':
            ret = nary(value, '', cNode);
            if (ret[0] == '&')
                ret = ret.substring(1)
            break;

        case 'maligngroup':
        case 'malignmark':
            ret = '&';
            break;

        case 'menclose':
            let notation = value.getAttribute('notation')
            if (notation && enclosures[notation]) {
                ret = unary(value, '\\' + enclosures[notation]);
                break;
            }
            ret = unary(value, '\\boxed');
            break;

        case 'mphantom':
            ret = unary(value,'\\phantom'); // Full size, no display
            break;

        case 'mpadded':
            var op = '';
            var mask = 0;                   // Compute phantom mask

            if (value.getAttribute('width') === '0')
                mask = 2;                   // fPhantomZeroWidth
            if (value.getAttribute('height') === '0')
                mask |= 4;                  // fPhantomZeroAscent
            if (value.getAttribute('depth') === '0')
                mask |= 8;                  // fPhantomZeroDescent

            if (value.firstElementChild.nodeName == 'mphantom') { // No display
                if (mask == 2)
                    op = '\\vphantom';        // fPhantomZeroWidth
                else if (mask == 12)
                    op = '\\hphantom';        // fPhantomZeroAscent | fPhantomZeroDescent
                ret = op ? op + TeX(value.firstElementChild).substring(8)
                    : '⟡(' + mask + '&' + TeX(value.firstElementChild.firstElementChild, true) + ')';
                break;
            }
            const opsShow = {2: '\\hsmash', 4: '\\asmash', 8: '\\dsmash', 12: '\\smash'};
            op = opsShow[mask];
            mask |= 1;                      // fPhantomShow

            ret = op ? unary(value, op)
                : '⟡(' + mask + '&' + TeX(value.firstElementChild, true) + ')';
            break;

        case 'mstyle':
            ret = TeX(value.firstElementChild);
            val = value.getAttribute('mathcolor')
            if (val)
                ret = '✎(' + val + '&' + ret + ')';
            val = value.getAttribute('mathbackground')
            if (val)
                ret = '☁(' + val + '&' + ret + ')';
            break;

        case 'msqrt':
            ret = unary(value, '\\sqrt');
            break;

        case 'mroot':
            ret = '\\sqrt[' + TeX(value.lastElementChild) + ']{' +
                TeX(value.firstElementChild, true) + '}';
            break;

        case 'mfrac':
            var op = '\\frac';
            val = value.getAttribute('displaystyle')
            if (!val) {
            }
            val = value.getAttribute('linethickness')
            if (val == '0' || val == '0.0pt') {
                op = '¦';
                if (value.parentElement.hasAttribute('intent') &&
                    value.parentElement.getAttribute('intent').startsWith('binomial-coefficient') ||
                    value.parentElement.firstElementChild.hasAttribute('title') &&
                    value.parentElement.firstElementChild.getAttribute('title') == 'binomial coefficient') {
                    op = '\\binom'
                }
            }
            ret = op + '{' + TeX(value.firstElementChild) + '}{' + TeX(value.lastElementChild) + '}'
            break;

        case 'msup':
            var op = '^';
            if (isPrime(value.lastElementChild.textContent))
                op = '';
            ret = binary(value, op);

            // Check for intent='transpose'
            if (value.lastElementChild.getAttribute('intent') == 'transpose') {
                let cRet = ret.length;
                let code = codeAt(ret, cRet - 2);
                if (code != 0x22BA) {       // '⊺'
                    if (code > 0xDC00)
                        cRet--;             // To remove whole surrogate pair
                    ret = ret.substring(0, cRet - 2) + '^⊺';
                }
            }
            break;

        case 'mover':
            if (value.lastElementChild.nodeName == 'mo') {
                let cwAccent = accentsAbove[value.lastElementChild.textContent]
                if (cwAccent) {
                    ret = '\\' + cwAccent + '{' + TeX(value.firstElementChild) + '}'
                    break
                }
            }
            op = value.hasAttribute('accent') ? '' : '^';
            ret = binary(value, op);
            break;

        case 'munder':
            if (value.lastElementChild.nodeName == 'mo') {
                let cwAccent = accentsBelow[value.lastElementChild.textContent]
                if (cwAccent) {
                    ret = '\\' + cwAccent + '{' + TeX(value.firstElementChild) + '}'
                    break
                }
            }
            op = value.hasAttribute('accentunder') ? '' : '_';
            if (value.firstElementChild.innerHTML == 'lim')
                op = '_';
            ret = binary(value, op);
            break;

        case 'msub':
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
            ret = ternary(value, '_', '^');
            break;

        case 'mmultiscripts':
            ret = '';
            if (value.children[3].nodeName == 'mprescripts') {
                if (value.children[4].nodeName != 'none')
                    ret = '_' + TeX(value.children[4]);
                if (value.children[5].nodeName != 'none')
                    ret += '^' + TeX(value.children[5]);
                if (ret)
                    ret += ' ';
            }
            ret += TeX(value.children[0]);
            if (value.children[1].nodeName != 'none')
                ret += '_' + TeX(value.children[1]);
            if (value.children[2].nodeName != 'none')
                ret += '^' + TeX(value.children[2]);
            break;

        case 'mfenced':
            let [opClose, opOpen, opSeparators] = getFencedOps(value)
            let cSep = opSeparators.length;

            ret = opOpen;
            for (let i = 0; i < cNode; i++) {
                ret += TeX(value.children[i]);
                if (i < cNode - 1)
                    ret += i < cSep - 1 ? opSeparators[i] : opSeparators[cSep - 1];
            }
            ret += opClose;
            break;

        case 'mo':
            const opmap = {
                '&amp;':    '&',
                '&fa;':     '',
                '&gt;':     '>',
                '&lt;':     '<',
                '&nbsp;':   ' ',
                '\u2061':   '',
                '⋯':        '⋅⋅⋅',
            }
            val = value.innerHTML
            if (val in opmap) {
                ret = opmap[val]
                break
            }
            if (!intent)
                intent = value.getAttribute('intent')
            if (intent == ':text') {
                ret = '\\' + val
                break
            }
            if (val.startsWith('&#') && val.endsWith(';')) {
                ret = value.innerHTML.substring(2, val.length - 1);
                if (ret[0] == 'x')
                    ret = '0' + ret;
                ret = String.fromCodePoint(ret);
                break;
            }
            if (!ret && value.hasAttribute('title')) {
                // The DLMF title attribute implies the following intents
                // (see also for 'mi')
                switch (value.getAttribute('title')) {
                    case 'differential':
                    case 'derivative':
                        ret = '𝑑';
                        break;
                    case 'binomial coefficient':
                        val = '';
                }
            }
            if (!ret)
                ret = val
            break;

        case 'mi':
            if (value.innerHTML.length == 1) {
                let c = value.innerHTML
                if (!value.hasAttribute('mathvariant')) {
                    ret = italicizeCharacter(c);
                    break;
                }
                var mathstyle = mathvariants[value.getAttribute('mathvariant')];
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
                } else if (mathstyle) {
                    ret = getMathAlphanumeric(c, mathstyle)
                    break
                }
            } else if (isFunctionName(value.textContent)) {
                ret = '\\' + value.textContent + ' '
                break
            }                              // else fall through

        case 'mn':
            ret = value.textContent;
            break;

        case 'mtext':
            ret = value.textContent.replace(/\"/g, '\\\"')
            ret = '\\textrm{' + ret + '}';
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

    if (ret)
        return ret

    // TeX <mrow> children
    for (let i = 0; i < cNode; i++) {
        let node = value.children[i];
        if (i == 1 && ret == '{' && node.nodeName == 'mtable' &&
            (value.childElementCount == 2 || !value.lastElementChild.textContent)) {
            // \begin{cases}...\end{cases} includes opening brace
            ret = ''
        }
        ret += TeX(node, false, i);
    }

    let mrowIntent = value.nodeName == 'mrow' && value.hasAttribute('intent')
        ? value.getAttribute('intent') : '';

    if (mrowIntent) {
        if (mrowIntent == ':fenced' && value.childElementCount &&
            !value.lastElementChild.textContent) {
            return !value.firstElementChild.textContent ? '{' + ret + '}' : ret
        }
        if (mrowIntent.startsWith('absolute-value') ||
            mrowIntent.startsWith('cardinality')) {
            let abs = mrowIntent[0] == 'a' ? '\\abs' : '\\card'
            ret = ret.substring(1, ret.length - 1) // Remove '|'s
            return abs + '{' + ret + '}'
        }
        if (mrowIntent.startsWith('binomial-coefficient') ||
            mrowIntent.endsWith('matrix') || mrowIntent.endsWith('determinant')) {
            // Remove enclosing parens for 𝑛⒞𝑘 and bracketed matrices
            let i = ret.length - 1
            if (ret[0] == '|')              // Determinant
                return ret.substring(1, i)
            if (ret[0] != '(')
                return ret
            if (ret[i] == ')')
                return ret.substring(1, i)

            // Doesn't end with ')'. Scan ret matching parens. If the last
            // ')' follows the '⒞' and matches the opening '(', remove them.
            let binomial
            let cParen = 1
            let k = 0

            for (i = 1; i < ret.length - 1; i++) {
                switch (ret[i]) {
                    case '(':
                        cParen++
                        break;
                    case ')':
                        cParen--
                        if (!cParen) {
                            if (!binomial)
                                return ret  // E.g., (𝑘−𝑧)⒞𝑧
                            k = i
                        }
                        break;
                    case '⒞':
                        binomial = true
                        break;
                }
            }
            return k ? ret.substring(1, k) + ret.substring(k + 1) : ret
        }
        if (mrowIntent == ':function' && value.previousElementSibling &&
            value.firstElementChild &&      // (in case empty)
            value.firstElementChild.nodeName == 'mi' &&
            value.firstElementChild.textContent < '\u2100' &&
            value.previousElementSibling.nodeName == 'mi') {
            return ' ' + ret;               // Separate variable & function name
        }
    }
    return ret;
}

//////////////////////////////
//  [La]TeX to UnicodeMath  //
/////////////////////////////

const environments = {
    'cases': 'Ⓒ', 'aligned': '█', 'pmatrix': '⒨', 'matrix': '■',
    'vmatrix': '⒱', 'bmatrix': 'ⓢ', 'Vmatrix': '⒩', 'Bmatrix': 'Ⓢ',
}

function findClosingBrace(text, i, chStop) {
    let cBrace = 1
    let over = 0

    for (; i < text.length; i++) {
        switch (text[i]) {
            case '{':
                cBrace++
                break
            case '}':
                cBrace--
                if (!cBrace)
                    return chStop == '/' ? [i, over] : i
                break
            case '⒞':                       // For parsing {...\choose...}
            case '/':                       // For parsing {...\over...}
                over = !over ? i : -1
                break
            case '\\':                      // End of row/equation?
                if (text[i + 1] == '\\')
                    return i
                break
            case '$':
                if (cBrace == 1 && chStop == text[i]) // At current level
                    return i
                break
            case '〗':
                return i
        }
    }
    return -1
}

function getArg(tex, i, checkNeedParens) {
    // Return argument at tex offset i: can be either ... of {...} or a single
    // character following optional whitespace
    let j
    let arg = ''
    while (tex[i] == ' ')
        i++

    if (tex[i] == '{') {
        i++                                 // Bypass '{'
        j = findClosingBrace(tex, i)
        if (j > 0) {
            arg = TeX2UMath(tex.substring(i, j))
            i = j + 1                       // Set up to bypass '}'
        }
    } else {
        arg = getCh(tex, i)
        i += arg.length                     // Set up to bypass char
    }
    if (checkNeedParens && needParens(arg))
        arg = '(' + arg + ')'
    return [arg, i]
}

function applyMacro(tex, i) {
    // Apply macro starting at tex[i]
    let k, j
    let cArg = 0

    for (k = i; k < tex.length && tex[k] != '}'; k++) {
        if (tex[k] == '#') {
            if (cArg < 9)
                cArg++
            k++                             // Bypass digit
        }
    }
    if (tex[k] != '}')
        return ''
    let macro = tex.substring(2, k)
    i = k + 1

    // Get cArg args
    let args = []

    for (j = 0; j < cArg && i < tex.length; j++) {
        let arg = ''
        while (tex[i] == ' ')
            i++                             // Bypass '{'
        if (tex[i] == '{') {
            k = findClosingBrace(tex, i + 1)
            if (k == -1)
                return ''
            arg = tex.substring(i + 1, k)   // Don't include {}
            i = k + 1
        } else {
            arg = getCh(tex, i)
            i += arg.length                 // Set up to bypass char
        }
        args[j] = arg
    }
    for (j = args.length; j < cArg; j++)
        args[j] = ''                        // Null strings for missing args

    if (!testing)
        console.log('args: ' + args)
    // Substitute args for the corresponding #n's

    let val = ''
    for (k = 0; k < macro.length; k++) {
        if (macro[k] == '#') {
            k++                             // Advance to digit
            val += args[macro[k] - 1]
        } else {
            val += macro[k]
        }
    }
    if (!testing)
        console.log('macro → ' + val)
    return [val, i]
}

function TeX2UMath(tex) {
    let j
    let uniTeX = ''
    let val

    for (i = 0; i < tex.length;) {
        let ch = getCh(tex, i)
        i += ch.length
        uniTeX += ch
        if (i == tex.length)
            break

        switch (ch) {
            case '⒝':                       // E.g., \binom{n}{k}
            case '⍁':                       // E.g., \frac{a}{b}
                if (tex[i] == '{') {
                    j = findClosingBrace(tex, i + 1)
                    if (j == -1)
                        continue
                    uniTeX += TeX2UMath(tex.substring(i + 1, j)) + '&'
                    i = j + 1
                    if (tex[i] == ' ')
                        i++
                    j = findClosingBrace(tex, i + 1)
                    if (tex[i] != '{')
                        continue
                    uniTeX += TeX2UMath(tex.substring(i + 1, j)) + '〗 '
                    i = j + 1
                } else {                    // E.g., \frac12 is ½
                    uniTeX += tex[i++] + '&' + tex[i++] + '〗 '
                }
                continue
            case '⒭':                      // E.g., \root n\of{a+b} → ⒭𝑛▒(𝑎+𝑏)
                j = tex.indexOf('▒', i)
                if (j != -1) {
                    uniTeX += tex.substring(i, j) + '▒'
                    j++                     // Bypass '▒'
                    [val, i] = getArg(tex, j, true)
                    uniTeX += val
                    break
                }
                break
            case '√':
                if (tex[i] == '[') {        // E.g., √[n]{a+b} → √(n&a+b)
                    j = tex.indexOf(']', i + 1)
                    if (j != -1) {
                        uniTeX += '(' + tex.substring(i + 1, j) + '&'
                        j++                 // Bypass ']'
                        [val, i] = getArg(tex, j)
                        uniTeX += val + ')'
                    }
                    break
                }
            case 'ⓓ':
                if (getNonBlankChar(tex, i) != '{')
                    break
            case '▭':
            case '^':
            case '_':
                [val, i] = getArg(tex, i, true)
                uniTeX += val
                if (i < tex.length && !'+-=/^_ )'.includes(tex[i]))
                    uniTeX += ' '
                break
            case '{':
                [j, k] = findClosingBrace(tex, i, '/')
                if (k > 0) {
                    let op = tex[k] == '/' ? '⍁' : '⒝'
                        // E.g., TeX {a+b\over c+d}
                        uniTeX = uniTeX.substring(0, uniTeX.length - 1) + op +
                            TeX2UMath(tex.substring(i, k)) + '&' +
                            TeX2UMath(tex.substring(k + 1, j)) + '〗'
                        i = j + 1
                }
                break
            case '〖':                       // Begin environment
                if (tex[i] != '{')
                    break
                j = findClosingBrace(tex, i + 1)
                if (j == -1)
                    break
                let label = environments[tex.substring(i + 1, j)]
                if (!label)
                    return ''
                i = j + 1                   // Bypass \begin{<label>}
                uniTeX = uniTeX.substring(0, uniTeX.length - 1) + label + '('
                for (; ;) {
                    // Find end of equation
                    j = findClosingBrace(tex, i)
                    if (j == -1)
                        break
                    uniTeX += TeX2UMath(tex.substring(i, j))
                    if (tex[j] == '〗') {
                        // End of equation array
                        uniTeX += ')'
                        j = tex.indexOf('}', j + 2)
                        i = j + 1
                        break
                    }
                    // End of equation, but more to come
                    if (tex[j] == '\\')
                        j++
                    uniTeX += '@'
                    i = j + 1
                }
                break
            case 'ⓣ':
                // Flatten embedded math zones
                if (tex[i] != '{')
                    break
                for (; ;) {
                    // Find a math zone or closing brace
                    j = findClosingBrace(tex, i + 1, '$')
                    if (j == -1)
                        break
                    if (tex[j] == '$') {    // Found a math zone
                        k = findClosingBrace(tex, j + 1, '$')
                        if (tex[k] != '$')
                            break
                        uniTeX += '(' + tex.substring(i + 1, j) + ')'
                        uniTeX += TeX2UMath(tex.substring(j + 1, k) + ' ')
                        if (tex[k + 1] == '}') {
                            i = k + 2       // End of text
                            break
                        }
                        i = k               // More text
                        uniTeX += 'ⓣ'       // Start new text field
                    } else {                // End of text. Finish text field
                        uniTeX += '(' + tex.substring(i + 1, j) + ')'
                        i = j + 1           // Bypass original text field
                        break
                    }
                }
                break
            case 'Ⓜ':                      // Macro
                break
            default:
                if (isAccent(ch)) {
                    // Move accent from before to after the argument
                    [val, i] = getArg(tex, i, true)
                    uniTeX = uniTeX.substring(0, uniTeX.length - 1) + val + ch
                } else if (overBrackets.includes(ch) || underBrackets.includes(ch)) {
                    [val, i] = getArg(tex, i)
                    uniTeX += '(' + val + ')'
                }
        }
    }
    return uniTeX
}
function TeX2UnicodeMath(tex) {
    // Pass 1: Convert control words in tex to Unicode symbols
    let uniTeX = ''
    let firstMacroIndex = -1
    let cwPrev = ''
    let macrosEnabled = ummlConfig && ummlConfig.texMacros

    for (let i = 0; i < tex.length;) {
        switch (tex[i]) {
            case '\\':
                let cw = ''
                for (i++; i < tex.length && isAsciiAlphabetic(tex[i]); i++)
                    cw += tex[i]
                if (cwPrev == 'def') {      // Leave cw for defining in macro pass
                    cwPrev = ''
                    uniTeX += '\\' + cw
                    if (firstMacroIndex == -1)
                        firstMacroIndex = uniTeX.length - cw.length - 2
                    if (macrosEnabled)
                        ummlConfig.texMacros[cw] = '' // Don't use prev def
                    continue
                }
                cwPrev = cw
                let symbol
                if (macrosEnabled && cw in ummlConfig.texMacros) {
                    symbol = ummlConfig.texMacros[cw]
                    if (symbol[0] == 'ⓜ')
                        firstMacroIndex = i - 2// Need macro pass
                } else {
                    symbol = resolveCW('\\' + cw, true)
                }
                if (symbol[0] != '"')       // Only include recognized control words
                    uniTeX += symbol
                break
            case '\n':
                i++                         // Skip new lines
                break
            case '%':
                j = tex.indexOf('\n')       // Skip comments
                if (j == -1)
                    j = i
                i = j + 1
                break
            default:
                uniTeX += tex[i++]
        }
    }
    if (firstMacroIndex >= 0) {
        for (let i = firstMacroIndex; i < uniTeX.length;) {
            let m = uniTeX.indexOf('ⓜ', i)
            if (m == -1)
                break
            i = m
            if (uniTeX[i + 1] == '\\') {
                // Define macro
                let [cw, body, k] = getMacro(uniTeX, i)
                if (cw) {
                    if (!ummlConfig.texMacros)
                        ummlConfig.texMacros = {}
                    ummlConfig.texMacros[cw] = body
                    if (!testing)
                         console.log('cw: ' + cw + ', body: ' + body)
                    // Remove macro from uniTeX
                    uniTeX = uniTeX.substring(0, m) + uniTeX.substring(k + 1)
                    continue
                }
            } else if (uniTeX[i + 1] == '{') {
                // Apply macro with arguments
                let [val, k] = applyMacro(uniTeX, i + 2)
                uniTeX = uniTeX.substring(0, i) + val + uniTeX.substring(k)
                i = k
                continue
            }
        }
    }
    if (!testing)
        console.log('uniTeX = ' + uniTeX)
    // Pass 2: convert uniTeX to UnicodeMath
    uniTeX = TeX2UMath(uniTeX)

    //console.log('uniTeX = ' + uniTeX)
    return uniTeX
}
