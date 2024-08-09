'use strict';

var input = document.getElementById("input");
var codepoints = document.getElementById("codepoints");
var output = document.getElementById("output");
var output_pegjs_ast = document.getElementById("output_pegjs_ast");
var output_preprocess_ast = document.getElementById("output_preprocess_ast");
var output_mathml_ast = document.getElementById("output_mathml_ast");
var output_source = document.getElementById("output_source");
var measurements_parse = document.getElementById("measurements_parse");
var measurements_transform = document.getElementById("measurements_transform");
var measurements_pretty = document.getElementById("measurements_pretty");

var activeTab = "source";
var atEnd = false;                          // True if at end of output object
var hist = [];
var prevInputValue = "";
const SELECTNODE = -1024
var inputUndoStack = [{uMath: ''}]
var inputRedoStack = []
var outputUndoStack = ['']
var outputRedoStack = ['']
var selectionStart
var selectionEnd
var anchorNode
var focusNode
var inSelChange = false

document.onselectionchange = () => {
    if (inSelChange)
        return
    let sel = window.getSelection()
    inSelChange = true
    sel = checkMathSelection(sel)
    inSelChange = false
    if (!sel)
        return                              // Not math output window

    // In math output window
    removeSelAttributes()
    let offset = sel.anchorOffset
    anchorNode = sel.anchorNode
    if (anchorNode.nodeName == '#text') {
        anchorNode = anchorNode.parentElement
        offset = '-' + offset               // Indicate offset is a #text offset
    }
    setSelAttributes(anchorNode, 'selanchor', offset)

    if (sel.focusOffset != sel.anchorOffset || sel.focusNode != sel.anchorNode) {
        // Nondegenerate selection
        offset = sel.focusOffset
        focusNode = sel.focusNode
        if (focusNode.nodeName == '#text') {
            focusNode = focusNode.parentElement
            offset = '-' + offset
        }
        setSelAttributes(focusNode, 'selfocus', offset)
    }
    // Update MathML window
    if (!testing) {
        output_source.innerHTML = highlightMathML(escapeMathMLSpecialChars(indentMathML(output.innerHTML)));
        console.log('uMath = ' + getUnicodeMath(output.firstElementChild, true))
        input.innerHTML = getUnicodeMath(output.firstElementChild, true)
    }
}

function removeSuperfluousMrow(node) {
    // The following doesn't work reliably when selection attributes are
    // involved. Might be fixable...
    //if (node && node.nodeName == 'mrow' && node.childElementCount == 1 &&
    //    !node.attributes.length && node.firstElementChild.nodeName == 'mrow' &&
    //    !node.firstElementChild.hasAttribute('intent')) {
    //    let nodeP = node.parentElement

    //    if (nodeP) {
    //        // node is an attributeless mrow with a single child that's also
    //        // an mrow. Replace the superfluous mrow node with its mrow child
    //        nodeP.replaceChild(node.firstElementChild, node)
    //        return nodeP.firstElementChild
    //    }
    //}
    return node
}

function setSelection(sel, node, offset, nodeFocus, offsetFocus) {
    if (!sel)
        sel = window.getSelection()
    if (!node)
        return sel

    if (offset == SELECTNODE) {
        offset = node.nodeName == '#text'
               ? node.textContent.length : node.childNodes.length
        sel.setBaseAndExtent(node, 0, node, offset)
        return
    }

    if (node.nodeName == 'mtext')
        node = node.firstChild
    if (offset < 0) {                       // Text offset (not child index)
        offset = -offset
        if (node.nodeName != '#text')
            node = node.firstChild          // Should be '#text' now
    }
    if (nodeFocus) {
        if (offsetFocus < 0) {              // Text offset (not child index)
            offsetFocus = -offsetFocus
            if (nodeFocus.nodeName != '#text')
                nodeFocus = nodeFocus.firstChild
        }
    } else {                                // Make an insertion point (IP)
        nodeFocus = node
        offsetFocus = offset
    }
    try {
        if (node.nodeName == '#text') {
            if (offset > node.textContent.length)
                offset = offsetFocus = node.textContent.length
        } else if (offset > node.childNodes.length) {
            offset = offsetFocus = node.childNodes.length
        }
        sel.setBaseAndExtent(node, offset, nodeFocus, offsetFocus)
    } catch(error) {
        console.log(error)
        console.log("output = " + output.firstElementChild.outerHTML)
        console.log("sel.anchorNode = " + node.outerHTML + ', sel.anchorOffset = ' + offset)
        console.log("sel.focusNode = " + nodeFocus.outerHTML + ', sel.focusOffset = ' + offsetFocus)
    }

    if(!testing)
        console.log("sel.anchorNode = " + node.nodeName + ', sel.focusNode = ' + nodeFocus.nodeName)
    return sel
}

var mappedPair = {
    "+-": "\u00B1",
    "<=": "\u2264",
    ">=": "\u2265",
    "~=": "\u2245",
    "~~": "\u2248",
    "::": "\u2237",
    ":=": "\u2254",
    "<<": "\u226A",
    ">>": "\u226B",
    "−>": "\u2192",
    "−+": "\u2213",
    "!!": "\u203C",
    "...": "…"
};

var mappedSingle = {
    "-": "\u2212",
    "\'": "\u2032"
};

////////////////////
// DEMO FUNCTIONS //
////////////////////

var demoID = 0;
var demoPause = false;
var iExample = 0;                           // Index of next Examples[] equation

function startDemo() {
    if (demoID) {
        // Already running demo: turn it off
        endDemo()
        return;
    }
    nextEq();
    demoID = setInterval(nextEq, 2000);     // Display next equation every 2 seconds
    demoPause = false;                      // Not paused (pause by entering ' ')
    var demoEq = document.getElementById('demos');
    demoEq.style.backgroundColor = 'DodgerBlue'; // Show user demo mode is active
}

function endDemo() {
    var demoEq = document.getElementById('demos');
    clearInterval(demoID);
    demoID = 0;
    demoEq.style.backgroundColor = 'inherit';
    demoEq.style.color = 'inherit';
}

function nextEq() {
    // Send Alt+Enter to display Examples[iExample] equation
    input.focus();
    const event = new Event('keydown');
    event.key = 'Enter';
    event.altKey = true;
    input.dispatchEvent(event);
    outputUndoStack = ['']
    draw();
}

function prevEq() {
    iExample -= 2;
    if (iExample < 0)
        iExample = cExamples - 1;
    nextEq();
}

function stackTop(arr) {
    return arr.length ? arr[arr.length - 1] : ''
}

function mathSpeak() {
    // Called if Speak button is clicked on
    input.focus();
    const event = new Event('keydown');
    event.key = 's';
    event.altKey = true;
    input.dispatchEvent(event);
}

function mathBraille() {
    // Called if Braille button is clicked on
    input.focus();
    const event = new Event('keydown');
    event.key = 'b';
    event.altKey = true;
    input.dispatchEvent(event);
}

function speak(s) {
    if(!testing)
        console.log(s)
    s = symbolSpeech(s)
    let utterance = new SpeechSynthesisUtterance(s)
    if (voiceZira)
        utterance.voice = voiceZira
    if (speechSynthesis.pending)        // Inter-utterance pause is too long
        speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
}

function setUnicodeMath(uMath) {
    if (!uMath)
        uMath = '⬚'
    let i = uMath.indexOf('"')
    if (i != -1 && uMath[i + 1] == '\\' && uMath[i + 2] != '"') {
        let j = uMath.indexOf('"', i + 1)
        if (j != -1) {
            // Remove quotes around partial control words to aid parser
            uMath = uMath.substring(0, i) + uMath.substring(i + 1, j) +
                uMath.substring(j + 1)
        }
    }
    let t = unicodemathml(uMath, true) // uMath → MathML
    output.innerHTML = t.mathml

    if (!testing) {
        output_source.innerHTML = highlightMathML(escapeMathMLSpecialChars(indentMathML(output.innerHTML)));
        if (t.details["intermediates"]) {
            let pegjs_ast = t.details["intermediates"]["parse"];
            let preprocess_ast = t.details["intermediates"]["preprocess"];
            output_pegjs_ast.innerHTML = highlightJson(pegjs_ast) + "\n";
            output_preprocess_ast.innerHTML = highlightJson(preprocess_ast) + "\n";
        }
    }
    refreshDisplays('', true)
}

// escape mathml tags and entities, via https://stackoverflow.com/a/13538245
function escapeMathMLSpecialChars(str) {
    var replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return str.replace(/[&<>]/g, tag => {
        return replacements[tag] || tag;
    });
};

// via https://stackoverflow.com/a/49458964
function indentMathML(str) {
    var formatted = '', indent = '';
    str.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) {
            indent = indent.substring(2);   // End tag decreases indent
        } else {
            formatted += '\n' + indent;     // Start tag gets new line indented
        }
        formatted += '<' + node + '>';      // Append tag(s), content
        if (node.match(/^<?\w[^>]*[^\/]$/))
            indent += '  ';
    });
    return formatted.substring(2, formatted.length - 1);
};

// loosely based on https://www.w3schools.com/howto/howto_syntax_highlight.asp
function highlightMathML(mathml) {
    mathml = mathmlMode(mathml);
    return mathml;

    function extract(str, start, end, func, repl) {
        var s, e, d = "", a = [];
        while (str.search(start) > -1) {
            s = str.search(start);
            e = str.indexOf(end, s);
            if (e == -1) {e = str.length;}
            if (repl) {
                a.push(func(str.substring(s, e + (end.length))));
                str = str.substring(0, s) + repl + str.substr(e + (end.length));
            } else {
                d += str.substring(0, s);
                d += func(str.substring(s, e + (end.length)));
                str = str.substr(e + (end.length));
            }
        }
        this.rest = d + str;
        this.arr = a;
    }
    function mathmlMode(txt) {
        var rest = txt, done = "", comment, angular, startpos, endpos, note, i;
        comment = new extract(rest, "&lt;!--", "--&gt;", commentMode, "W3HTMLCOMMENTPOS");
        rest = comment.rest;
        while (rest.indexOf("&lt;") > -1) {
            startpos = rest.indexOf("&lt;");
            endpos = rest.indexOf("&gt;", startpos);
            if (endpos == -1) {endpos = rest.length;}
            done += rest.substring(0, startpos);
            done += tagMode(rest.substring(startpos, endpos + 4));
            rest = rest.substr(endpos + 4);
        }
        rest = done + rest;
        for (i = 0; i < comment.arr.length; i++) {
            rest = rest.replace("W3HTMLCOMMENTPOS", comment.arr[i]);
        }
        return "<span class=\"text\">" + rest + "</span>";
    }
    function tagMode(txt) {
        var rest = txt, done = "", startpos, endpos, result;
        while (rest.search(/(\s|<br>)/) > -1) {
            startpos = rest.search(/(\s|<br>)/);
            endpos = rest.indexOf("&gt;");
            if (endpos == -1) {endpos = rest.length;}
            done += rest.substring(0, startpos);
            done += attributeMode(rest.substring(startpos, endpos));
            rest = rest.substr(endpos);
        }
        result = done + rest;
        result = "<span class=\"bracket\">&lt;</span>" + result.substring(4);
        if (result.substr(result.length - 4, 4) == "&gt;") {
            result = result.substring(0, result.length - 4) + "<span class=\"bracket\">&gt;</span>";
        }
        return "<span class=\"tag\">" + result + "</span>";
    }
    function attributeMode(txt) {
        var rest = txt, done = "", startpos, endpos, singlefnuttpos, doublefnuttpos, spacepos;
        while (rest.indexOf("=") > -1) {
            endpos = -1;
            startpos = rest.indexOf("=") + 1;
            singlefnuttpos = rest.indexOf("'", startpos);
            doublefnuttpos = rest.indexOf('"', startpos);
            spacepos = rest.indexOf(" ", startpos + 2);
            if (spacepos > -1 && (spacepos < singlefnuttpos || singlefnuttpos == -1) && (spacepos < doublefnuttpos || doublefnuttpos == -1)) {
                endpos = rest.indexOf(" ", startpos);
            } else if (doublefnuttpos > -1 && (doublefnuttpos < singlefnuttpos || singlefnuttpos == -1) && (doublefnuttpos < spacepos || spacepos == -1)) {
                endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
            } else if (singlefnuttpos > -1 && (singlefnuttpos < doublefnuttpos || doublefnuttpos == -1) && (singlefnuttpos < spacepos || spacepos == -1)) {
                endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
            }
            if (!endpos || endpos == -1 || endpos < startpos) {endpos = rest.length;}
            done += rest.substring(0, startpos);
            done += attributeValueMode(rest.substring(startpos, endpos + 1));
            rest = rest.substr(endpos + 1);
        }
        return "<span class=\"attribute\">" + done + rest + "</span>";
    }
    function attributeValueMode(txt) {
        return "<span class=\"value\">" + txt + "</span>";
    }
    function commentMode(txt) {
        return "<span class=\"comment\">" + txt + "</span>";
    }
}

// via https://stackoverflow.com/a/7220510 plus compact indentation
function highlightJson(json) {
    if (json == undefined)
        return '';
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined);
    }
    // Insert compact indents
    var indent = '';
    var chPrev = '';
    var json1 = '';
    var cJson = json.length;

    for (var i = 0; i < cJson; i++) {
        var ch = json[i];
        switch (ch) {
            case '{':
            case '[':
                if (chPrev == '[' || chPrev == '{' || chPrev == ',')
                    json1 += '\n' + indent;
                indent += !(indent.length % 4) ? '·\u00A0' : '\u00A0\u00A0';
                break;
            case '}':
            case ']':
                indent = indent.substring(0, indent.length - 2);
                break;
            case '"':
                if (!isAsciiAlphanumeric(chPrev) &&
                    (chPrev != '\u00A0' || i > 2 && json[i - 2] != ':') &&
                    json[i + 1] != '}' && json[i + 1] != ',') {
                    json1 += '\n' + indent;
                }
                break;
            case ':':
                json1 += ':';
                ch = '\u00A0';
                if (i < cJson - 2 && json[i + 1] == '"') {
                    json1 += ch;
                    ch = json[i++ + 1];
                }
        }
        json1 += ch;
        chPrev = ch;
    }
    json = escapeMathMLSpecialChars(json1);

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function hexToUnicode(input, offsetEnd, cchSel) {
    if (cchSel > 10)
        return [0, 0];
    let offsetStart = offsetEnd - cchSel;
    let cch = cchSel ? cchSel : 10;         // 10 is enough for 5 surrogate pairs
    let ch = '';
    let [n, i] = GetCodePoint(input, offsetEnd, cch);
    if (n)
        offsetStart = i

    if (n < 0x20 || n > 0x10FFFF) {
        if (n || cchSel)
            return [0, 0];
        // Convert ch to hex str. Sadly code.toString(16) only works correctly
        // for code <= 0xFFFF
        n = codeAt(input, offsetEnd - 1);
        offsetStart--;
        if (n <= 0xFFFF) {                  // toString truncates larger values
            ch = n.toString(16);
        } else {
            offsetStart--;
            for (var d = 1; d < n; d <<= 4)	// Get d = smallest power of 16 > n
                ;
            if (n && d > n)
                d >>= 4;
            for (; d; d >>= 4) {
                var quot = n / d;
                var rem = n % d;
                n = quot + 0x0030;
                if (n > 0x0039)
                    n += 0x0041 - 0x0039 - 1;
                ch += String.fromCharCode(n);
                n = rem;
            }
        }
    } else {
        if (n <= 0xFFFF) {
            ch = String.fromCharCode(n);
            if (isTrailSurrogate(n) && offsetStart > 5) {
                var chPrev = input[offsetStart - 1];
                if (chPrev == ' ' || chPrev == ',') {
                    [m, i] = GetCodePoint(input, offsetStart - 1, 8);
                    if (isLeadSurrogate(m)) {
                        ch = String.fromCharCode(m) + ch;
                    }
                }
            }
        } else {
            ch = String.fromCharCode(0xD7C0 + (n >> 10)) +
                 String.fromCharCode(0xDC00 + (n & 0x3FF));
        }
    }
    return [ch, offsetEnd - offsetStart]
}

function boldItalicToggle(chars, key) {
    // Get current bold and italic states from first char in selection
    if (!chars)
        return;                             // Nothing selected
    var code = chars.codePointAt(0);
    var ch = chars[0];
    var [font, chFolded] = foldMathAlphanumeric(code, ch);
    var bold = font.startsWith('mbf');
    var italic = bold ? font.substring(3, 5) == 'it' : font.startsWith('mit');
    var symbols = '';

    // Toggle bold/italic state of selected characters
    for (var i = 0; i < chars.length; i++) {
        code = chars.codePointAt(i);
        ch = chars[i];
        if (code > 0xFFFF) {
            ch = chars.substring(i, i + 2);
            i++;
        }

        [font, chFolded] = foldMathAlphanumeric(code, ch);
        switch (key) {
            case 'i':
                if (italic) {
                    font = (font.length == 3) ? 'mup'
                         : bold ? 'mbf' + font.substring(5)
                         : 'm' + font.substring(3);
                } else {
                    font = (font == 'mup') ? font = 'mit'
                         : bold ? 'mbfit' + font.substring(3)
                         : 'mit' + font.substring(1);
                }
                break;
            case 'b':
                if (bold) {
                    font = (font.length == 3) ? 'mup' : 'm' + font.substring(3);
                } else {
                    font = (font == 'mup') ? 'mbf' : 'mbf' + font.substring(1);
                }
                break;
        }
        if (font == 'mup') {
            symbols += chFolded;
        } else {
            symbols += (chFolded in mathFonts && font in mathFonts[chFolded])
                ? mathFonts[chFolded][font] : ch;
        }
    }
    return symbols
}

function GetCodePoint(str, i, cch) {
    // Code point for hex string of max length cch in str ending at offset i
    if (cch > i)
        cch = i;
    if (cch < 2)
        return 0;

    var cchCh = 1;
    var cchChPrev = 1;
    var code = 0;
    var n = 0;                              // Accumulates code point

    for (var j = 0; cch > 0; j += 4, cch--) {
        code = str.codePointAt(i - 1);
        cchCh = 1;
        if (code < 0x0030)
            break;                          // Not a hexadigit

        if (isTrailSurrogate(code)) {
            code = str.codePointAt(i - 2);
            if (code < 0x1D434 || code > 0x1D467)
                break;                      // Surrogate pair isn't math italic
            code -= code >= 0x1D44E ? (0x1D44E - 0x0061) : (0x1D434 - 0x0061);
            cch--;
            cchCh = 2;
        }
        code |= 0x0020;                     // Convert to lower case (if ASCII uc letter)
        if (code >= 0x0061)                 // Map lower-case ASCII letter
            code -= 0x0061 - 0x003A;        //  to hex digit
        else if (code >= 0x003A)
            break;                          // Not a hexadigit
        code -= 0x0030;                     // Convert hex digit to binary number
        if (code > 15)
            break;                          // Not a hexadigit
        n += code << j;					    // Shift left & add in binary hex
        i -= cchCh;
        cchChPrev = cchCh;
    }
    if (n < 16 && cchChPrev == 2)
        n = 0;                              // Set up converting single 𝑎...𝑓 to hex
    return [n, i];
}

function closeFormatModeList() {
    var x = document.getElementById("formatmode-list");

    if (x != undefined)
        x.remove();
}

function setFormatMode(value, list) {
    if(list == 1)
        ummlConfig.doubleStruckMode = value;
    else
        ummlConfig.transposeChar = value;

    Array.from(document.getElementsByClassName('formatmode-active')).map(t => t.classList.remove('formatmode-active'));
    document.getElementById(value).parentNode.classList.add('formatmode-active');
}

function getSubSupDigit(str, i, delim) {
    // Return e.g., '²' for '^2 ' (str[i-1] = '^', str[i] = '2', delim = ' ')
    var ch = str[i];
    var op = str[i - 1];

    if (!'_^'.includes(op) || !'+-=/ )]}'.includes(delim) || !/[0-9]/.test(ch))
        return '';

    // If the preceding op is the other subsup op, return '', e.g., for a_0^2
    var opSupSub = op == '^' ? '_' : '^';

    for (var j = i - 2; j >= 0; j--) {
        if (str[j] == opSupSub)
            return '';
        if (str[j] < '\u3017' && !isAsciiAlphanumeric(str[j]) && !isDoubleStruck(str[j]))
            break;                          // Could allow other letters...
    }
    if (j == i - 2)
        return '';                          // No base character(s)

    return (op == '^') ? digitSuperscripts[ch] : digitSubscripts[ch];
}

///////////////////////////////
// UNICODEMATH INPUT EDITING //
///////////////////////////////

function opAutocorrect(ip, delim) {
    // Perform operator autocorrections like '+-' → '±' and '/=' → ≠
    let i = ip - 2;

    if (input.value[i] == '"')
        return false;

    if (input.value[i] == '/' && delim in negs) {
        // Convert /<op> to negated op, e.g., /= to ≠
        input.value = input.value.substring(0, i) + negs[delim] + input.value.substring(ip);
        input.selectionStart = input.selectionEnd = ip - 1;
        return false;
    }

    if (ip > 4) {
        // Convert span of math-italic characters to ASCII and check for
        // function name
        var fn = "";
        while (i > 0) {
            var code = codeAt(input.value, i);
            var ch = foldMathItalic(code);
            if (!ch) break;
            fn = ch + fn;
            i -= code > 0xFFFF ? 2 : 1;
        }
        if (isFunctionName(fn) || delim == '\u2061') {
            i++;                    // Move to start of span
            input.value = input.value.substring(0, i) + fn + input.value.substring(ip - 1);
            input.selectionStart = input.selectionEnd = i + fn.length + 1;
            return false;
        }
    }
    if (input.value.substring(ip - 2, ip) in mappedPair) {
        input.value = input.value.substring(0, ip - 2)
            + mappedPair[input.value.substring(ip - 2, ip)] + input.value.substring(ip);
        input.selectionStart = input.selectionEnd = ip - 1;
        return false;
    }

    if (ip >= 4) {                          // E.g., replace "𝑎^2+" by "𝑎²+"
        var ch = getSubSupDigit(input.value, ip - 2, delim);
        if (ch) {
            var j = (delim == ' ') ? ip : ip - 1;
            input.value = input.value.substring(0, ip - 3) + ch + input.value.substring(j);
            input.selectionStart = input.selectionEnd = j;
            return false;
        }
    }
    if (delim in mappedSingle) {
        // Convert ASCII - and ' to Unicode minus (2212) and prime (2032)
        input.value = input.value.substring(0, ip - 1) + mappedSingle[delim]
            + input.value.substring(ip);
        input.selectionStart = input.selectionEnd = ip;
        return false;
    }
    if (ip >= 4 && ' +-='.includes(delim) && input.value[ip - 3] == '/') {
        // Convert linear numeric fraction to Unicode fraction, e.g., 1/3 to ⅓
        let chNum = input.value[ip - 4];
        let chDenom = input.value[ip - 2];

        if (isAsciiDigit(chNum) && isAsciiDigit(chDenom)) {
            let ch = getUnicodeFraction(chNum, chDenom);
            if (ch != undefined) {
                let iRem = (delim == ' ') ? ip : ip - 1;
                input.value = input.value.substring(0, ip - 4) + ch + input.value.substring(iRem);
                input.selectionStart = input.selectionEnd = ip - 3;
            }
        }
    }
    return false;
}
input.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list")
    if (handleAutocompleteKeys(x, e))
        return

    // Target is input. For undo, save the selection before it changes
    if (inputUndoStack.length && (!e.ctrlKey || e.key != 'z')) {
        let undoTop = stackTop(inputUndoStack)
        undoTop.selEnd = input.selectionEnd
        undoTop.selStart = input.selectionStart
    }
    if (e.altKey) {
        switch (e.key) {
            case 'b':                       // Alt+b
                // Braille MathML
                e.preventDefault()
                let mathML = isMathML(input.value)
                    ? input.value
                    : document.getElementById('output_source').innerText
                let braille = MathMLtoBraille(mathML)
                console.log('Math braille = ' + braille)
                speechDisplay.innerText += '\n' + braille
                return

            case 'd':                       // Alt+d
                // Toggle dictation mode on/off
                e.preventDefault()
                $("#mic").click()
                return

            case 'Enter':                   // Alt+Enter
                // Enter Examples[iExample] (see also Demo mode)
                x = document.getElementById('Examples').childNodes[0]
                input.value = x.childNodes[iExample].innerText
                var cExamples = x.childNodes.length

                iExample++                 // Increment for next time
                if (iExample > cExamples - 1)
                    iExample = 0
                return

            case 'm':                       // Alt+m
                // Toggle Unicode and MathML in input display
                e.preventDefault()
                ksi = true
                input.value = isMathML(input.value)
                    ? MathMLtoUnicodeMath(input.value, true)
                    : document.getElementById('output_source').innerText
                draw()
                return

            case 'p':                       // Alt+p
                // Presentation: toggle demo mode on/off
                e.preventDefault()
                startDemo()
                return

            case 's':                       // Alt+s
                // Speak MathML
                e.preventDefault()
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel()
                } else {
                    let mathML = isMathML(input.value)
                        ? input.value
                        : document.getElementById('output_source').innerText
                    let speech = MathMLtoSpeech(mathML)
                    console.log('Math speech = ' + speech)
                    speechDisplay.innerText = '\n' + speech
                    let utterance = new SpeechSynthesisUtterance(speech)
                    if (voiceZira)
                        utterance.voice = voiceZira
                    speechSynthesis.speak(utterance)
                }
                return

            case 'x':                       // Alt+x
                // Toggle between char code and char
                e.preventDefault()
                let cchSel = input.selectionEnd - input.selectionStart
                let [ch, cchDel] = hexToUnicode(input.value, input.selectionEnd, cchSel)
                let offsetStart = input.selectionEnd - cchDel
                input.value = input.value.substring(0, offsetStart) + ch +
                    input.value.substring(input.selectionEnd)
                input.selectionStart = input.selectionEnd = offsetStart + ch.length
                return
        }
    }
    if (e.ctrlKey) {
        switch (e.key) {
            case 'b':                       // Ctrl+b
            case 'i':                       // Ctrl+i
                // Toggle math bold/italic
                e.preventDefault()
                let chars = getInputSelection()
                if (chars[0] == '"' && chars[chars.length - 1] == '"')
                    chars = chars.substring(1, chars.length - 1)
                chars = boldItalicToggle(chars, e.key)
                if (chars.length == 1 && (isAsciiAlphabetic(chars) || isLcGreek(chars)))
                    chars = '"' + chars + '"'
                insertAtCursorPos(chars)
                input.selectionStart -= chars.length
                return

            case 's':                       // Ctrl+s
                // Set output selection according to selection attributes
                e.preventDefault()
                let sel = window.getSelection()
                let selanchor, selfocus
                let node, nodeAnchor, nodeFocus
                let walker = document.createTreeWalker(output.firstElementChild, NodeFilter.SHOW_ELEMENT, null)

                for (node = walker.currentNode; node; node = walker.nextNode()) {
                    if (!selanchor) {
                        selanchor = node.getAttribute('selanchor')
                        if (selanchor)
                            nodeAnchor = node
                    }
                    if (!selfocus) {
                        selfocus = node.getAttribute('selfocus')
                        if (selfocus)
                            nodeFocus = node
                    }
                }
                if (!selanchor)
                    return
                if (!selfocus) {
                    selfocus = selanchor
                    nodeFocus = nodeAnchor
                }
                if (selanchor[0] == '-')    // Should switch to #text node...
                    selanchor = selanchor.substring(1)
                if (selfocus[0] == '-')
                    selfocus = selfocus.substring(1)
                sel.setBaseAndExtent(nodeAnchor, selanchor, nodeFocus, selfocus)
                checkMathSelection(sel)
                return

            case 'y':                       // Ctrl+y
                // Redo
                e.preventDefault()
                if (!inputRedoStack.length)
                    return

                inputUndoStack.push({
                    uMath: input.value, selStart: input.selectionStart,
                    selEnd: input.selectionEnd
                })

                let redoTop = inputRedoStack.pop()
                input.value = redoTop.uMath
                if (redoTop.selStart != undefined) {
                    input.selectionStart = redoTop.selStart
                    input.selectionEnd = redoTop.selEnd
                }
                draw(true)
                return

            case 'z':                       // Ctrl+z
                // Undo
                e.preventDefault()
                if (!inputUndoStack.length)
                    return
                let undoTop = inputUndoStack.pop()
                if (input.value == undoTop.uMath) {
                    if (!inputUndoStack.length)
                        return
                    undoTop = inputUndoStack.pop()
                }
                let redoNext = {
                    uMath: input.value, selStart: input.selectionStart,
                    selEnd: input.selectionEnd
                }
                inputRedoStack.push(redoNext)
                input.value = undoTop.uMath
                if (undoTop.selStart != undefined) {
                    input.selectionStart = undoTop.selStart
                    input.selectionEnd = undoTop.selEnd
                }
                draw(true)
                return
        }
    }
    if (e.shiftKey && e.key == 'Enter') {   // Shift+Enter
        //e.preventDefault()
        //insertAtCursorPos('\u200B')       // Want VT for math paragraph
    }
    if (demoID) {
        var demoEq = document.getElementById('demos')
        switch (e.key) {
            case 'ArrowRight':
                nextEq()
                return
            case 'ArrowLeft':
                prevEq()
                return
            case 'Escape':
                // Turn off demo mode
                endDemo()
                return
            case ' ':
                // Toggle pause
                e.preventDefault()
                if (demoPause) {
                    demoID = 0         // Needed to start (instead of end)
                    startDemo()
                } else {
                    demoPause = true
                    clearInterval(demoID)
                    demoEq.style.backgroundColor = 'green'
                }
                return
        }
    }
})

// insert one or multiple characters at the current cursor position of
// the input field or, if there is no cursor, append them to its value,
// via https://stackoverflow.com/a/11077016
function insertAtCursorPos(symbols) {
    let sel = document.getSelection()
    let node = sel.anchorNode
    if (node.nodeName == '#text')
        node = node.parentElement
    if (node.nodeName[0] == 'm') {
        // Insert into output window
        const event = new Event('keydown')
        event.key = symbols
        output.dispatchEvent(event)
        return
    }

    if (input.selectionStart || input.selectionStart == '0') {
        var startPos = input.selectionStart;
        var endPos = input.selectionEnd;
        input.value = input.value.substring(0, startPos)
            + symbols
            + input.value.substring(endPos, input.value.length);
        input.selectionEnd = input.selectionStart = startPos + symbols.length;
    } else {
        input.value += symbols;
    }
    input.focus();
    draw();
}

function autocomplete() {
    // Try autocorrecting or autocompleting a control word when user
    // modifies UnicodeMath in input window
    input.addEventListener("input", function (e) {
        var ip = input.selectionStart;      // Insertion point

        if (e.inputType != "insertText" && e.inputType != "deleteContentBackward" ||
            !ip || ip != input.selectionEnd) {
            return false;
        }
        closeAutocompleteList();

        var delim = input.value[ip - 1];    // Last char entered
        var i = ip - 2;
        var oddQuote = delim == '"';
        var iQuote = 0;

        // Check if ip is inside a quoted literal
        for (var iOff = 0; ; iOff = iQuote + 1) {
            iQuote = input.value.indexOf('"', iOff);
            if (iQuote == -1 || iQuote >= ip - 1)
                break;                      // No more quotes before ip
            oddQuote = !oddQuote;
        }
        if (oddQuote) {                     // Inside quoted literal
            if (delim == '"') {             // Insert matching quote
                input.value = input.value.substring(0, ip - 1) + '"' + input.value.substring(ip - 1);
                input.selectionStart = input.selectionEnd = ip;
            }
            return false;
        }
        if (delim == '"' && input.value.length > ip && input.value[ip] == '"') {
            // Instead of inserting a quote at ip - 1 when a closing quote is at
            // ip, move past the closing quote (same as with program editors).
            input.value = input.value.substring(0, ip - 1) + input.value.substring(ip);
            input.selectionStart = input.selectionEnd = ip;
            return false;
        }

        // Move back alphanumeric span
        while (i > 0 && /[a-zA-Z0-9]/.test(input.value[i])) { i--; }

        if (input.value[i] == 'ⓐ')
            return false;                   // \arg: leave as is

        if (i < 0 || input.value[i] != '\\' &&
            (!i || !isMathColor(input.value.substring(i - 1, i + 1)))) {
            // Not control word; check for italicization & operator autocorrect
            var ch = italicizeCharacter(delim);
            if (ch != delim) {
                // Change ASCII or lower-case Greek letter to math-italic letter
                input.value = input.value.substring(0, ip - 1) + ch + input.value.substring(ip);
                if (ch.length > 1) { ip++; } // Bypass trail surrogate
                input.selectionStart = input.selectionEnd = ip;
                return false;
            }
            return opAutocorrect(ip, delim);
        }
        if (ip <= 2)
            return false;                   // Autocorrect needs > 1 letter

        if (!/[a-zA-Z0-9]/.test(delim)) {
            // Delimiter entered: try to autocorrect control word
            var symbol = resolveCW(input.value.substring(i, ip - 1));
            var cch = symbol.length;
            if (symbol[0] != '\"' || cch == 3) {
                // Control word found: replace it with its symbol and update
                // the input selection
                if (delim == " ") {
                    delim = "";
                }
                if (cch < 3) {
                    symbol = italicizeCharacter(symbol);
                    cch = symbol.length;
                }
                input.value = input.value.substring(0, i) + symbol + delim
                    + input.value.substring(ip);
                input.selectionStart = input.selectionEnd = i + cch + (delim ? 1 : 0);
            }
            return;
        }
        if (ip - i < 3) return;

        let cw = input.value.substring(i + 1, ip);  // Partial control word
        let autocl = createAutoCompleteMenu(cw, this.id, e => {
            // User clicked matching control word: insert its symbol
            let val = e.currentTarget.innerText;
            let ch = italicizeCharacter(val[val.length - 1]);
            let code = ch.codePointAt(0);

            input.value = input.value.substring(0, i) + ch + input.value.substring(ip);
            ip = i + (code > 0xFFFF ? 2 : 1);
            input.selectionStart = input.selectionEnd = ip;
            if (code >= 0x2061 && code <= 0x2C00)
                opAutocorrect(ip, ch);
            closeAutocompleteList();
        })

        // Append div element as a child of the input autocomplete container
        if (autocl)
            this.parentNode.appendChild(autocl);
    })
}


////////////////////////////
// AUTOCOMPLETE FUNCTIONS //
////////////////////////////

// Symbols whose autocomplete options should be selected by default
var commonSymbols = "αβδζθλχϕϵ⁡←∂√∞⒨■"; // 03B1 03B2 03B4 03B6 03B8 03BB 03C7 03D5 03F5 2061 2190 2202 221A 221E 24A8 25A0
var currentFocus = -1;

function closeAutocompleteList() {
    var x = document.getElementsByClassName("autocomplete-items");
    if (x == undefined) return;

    var cItem = x.length;

    for (var i = 0; i < cItem; i++) {
        x[i].parentNode.removeChild(x[i]);
    }
}

function createAutoCompleteMenu(cw, id, onAutoCompleteClick) {
    // Create an autocomplete menu of control-words that partially match cw.
    // Called for both input-window and output-window editing
    let matches = getPartialMatches(cw);
    if (!matches.length)
        return;

    // Create a <div> element to contain matching control words
    currentFocus = -1;
    let autocl = document.createElement("div");
    autocl.setAttribute("id", id + "autocomplete-list");
    autocl.setAttribute("class", "autocomplete-items");

    // Create a div element for each matching control word
    for (let j = 0; j < matches.length; j++) {
        let b = document.createElement("div");
        let cwOption = matches[j];

        // Bold the matching letters and insert an input field to hold
        // the current control word and symbol
        b.innerHTML = "<strong>" + cwOption.substring(0, cw.length) + "</strong>";
        b.innerHTML += matches[j].substring(cw.length);
        b.innerHTML += "<input type='hidden' value='" + cwOption + "'>";

        if (commonSymbols.includes(cwOption[cwOption.length - 1])) {
            // Activate option for most common symbol, e.g., for '\be'
            // highlight '\beta β'
            currentFocus = j;
            b.classList.add("autocomplete-active");
        }
        // Add click function for user click on a control word
        b.addEventListener("click", onAutoCompleteClick);
        autocl.appendChild(b);
    }
    if (currentFocus == -1) {
        // No common control-word option identified: highlight first option
        currentFocus = 0;
        autocl.firstChild.classList.add("autocomplete-active");
    }
    return autocl
}

function handleAutocompleteKeys(x, e) {
    // Callback to handle autocomplete drop-down input. Called for both
    // input-window and output-window editing
    if (!x)                             // Empty autocomplete list
        return false;                   // Signal didn't handle keydown

    x = x.getElementsByTagName("div");  // x = autocomplete entries

    switch (e.key) {
        case "ArrowDown":
            // Increase currentFocus & highlight corresponding control-word
            e.preventDefault();
            currentFocus++;
            addActive(x);
            return true;

        case "ArrowUp":
            // Decrease currentFocus & highlight corresponding control-word
            e.preventDefault();
            currentFocus--;
            addActive(x);
            return true;

        case " ":
        case "Enter":
        case "Tab":
        case "\\":
            // Simulate a click on the "active" control-word option
            if (currentFocus >= 0 && x)
                x[currentFocus].click();
            if (e.key != '\\') {
                e.preventDefault();
                return true
            }                               // Return false to input backslash
    }
    return false
}

function addActive(x) {
    if (!x) return false;

    // Classify an option as "active". First, remove "autocomplete-active"
    // class from all options, and ensure the currentFocus is valid
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);

    // Add class "autocomplete-active" to x[currentFocus]
    console.log("x[" + currentFocus + "] = " + x[currentFocus].innerText);
    x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
    // Remove "autocomplete-active" class from all autocomplete options
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}

///////////////////////////////////
// OUTPUT EDITING AND NAVIGATION //
///////////////////////////////////

function speechSel(sel) {
    let node = sel.anchorNode;

    if (node.nodeType != 3) {
        let name = node.nodeName
        if (names[name])
            name = names[name];
        speak(name)
        return
    }
    if (node.length == sel.anchorOffset) {
        handleEndOfTextNode(node.parentElement)
        return
    }

    let ch = node.data;
    let intent = getIntent(node.parentElement);
    if (isDoubleStruck(intent))
        speak(intent)
    else if (ch[0] >= '\uD835' || sel.anchorNode.length == 1)
        speak(ch)
    else
        speak(ch[sel.anchorOffset])
}

function checkTable(node) {
    let unit = 'row'
    let intent = getIntent(node.parentElement);
    if (intent == ':equations') {
        intent = getIntent(node.parentElement.parentElement)
        unit = intent == ':cases' ? 'case' : 'equation';
    }
    speak('next ' + unit)
    return node.firstElementChild;
}

function getNaryOp(node) {
    // If the first child of mrow is a msubsup or munderover with an N-ary
    // op for its first child, return the N-ary op; else return ''
    if (node.nodeName != 'mrow')
        return '';
    node = node.firstElementChild;
    if (node.nodeName != 'msubsup' && node.nodeName != 'munderover')
        return '';
    node = node.firstElementChild;
    if (node.nodeName != 'mo')
        return '';
    let ch = node.textContent;
    return isNary(ch) ? ch : ''
}

function getIntent(node) {
    return node.attributes.intent ? node.attributes.intent.value : '';
}

function checkSimpleSup(node) {
    if (node.nodeName == 'msup' || node.nodeName == 'msqrt') {
        let s = speech(node)
        if (s.length <= 3) {
            speak(resolveSymbols(s))
            return true
        }
    }
    return false
}

const names = {
    'msup': 'superscript', 'msub': 'subscript', 'msubsup': 'subsoup',
    'munder': 'modify below', 'mover': 'modify above', 'munderover': 'below above',
    'mfrac': 'fraction', 'msqrt': 'square root',
}

function refreshDisplays(uMath, noUndo) {
    // Update MathML, UnicodeMath, and code-point displays; push current content
    // onto output undo stack; restore selection from selanchor and selfocus
    let uMathCurrent = getUnicodeMath(output.firstElementChild, true)
    if (!testing)
        output_source.innerHTML = highlightMathML(escapeMathMLSpecialChars(indentMathML(output.innerHTML)))
    input.innerHTML = uMathCurrent

    if (!noUndo) {
        if (!uMath)
            uMath = uMathCurrent
        let undoTop = stackTop(outputUndoStack)
        if (uMath != undoTop) {
            outputUndoStack.push(uMath)
            if (!testing)
                console.log("Push " + uMath)
        }
    }

    input.innerHTML = uMathCurrent
    if (!testing)
        codepoints.innerHTML = getCodePoints()

    let node = output.firstElementChild     // <math> node
    if (!node)                              // No <math> node
        return

    if (node.firstElementChild.nodeName == 'mi' && node.textContent == '⬚') {
        setSelection(null, node.firstElementChild, SELECTNODE)
        return
    }

    // Restore selection if previous code set the selection attributes
    // selanchor and selfocus appropriately
    let nodeA, nodeF                        // Anchor, focus nodes
    let offsetA, offsetF                    // Anchor, focus offsets
    let walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null)

    while (!offsetA || !offsetF) {
        node = walker.currentNode
        if (!offsetA) {
            offsetA = node.getAttribute('selanchor')
            if (offsetA) {
                nodeA = node
                if (offsetA[0] == '-') {    // Move to #text child
                    offsetA = offsetA.substring(1)
                    nodeA = node.firstChild
                }
            }
        }
        if (!offsetF) {
            offsetF = node.getAttribute('selfocus')
            if (offsetF) {
                nodeF = node
                if (offsetF[0] == '-') {    // Move to #text child
                    offsetF = offsetF.substring(1)
                    nodeF = node.firstChild
                }
            }
        }
        if (!walker.nextNode())
            break
    }
    if (!nodeA)
        return                              // No selection attributes

    if (!nodeF) {                           // No 'selfocus': insertion point (IP)
        nodeF = nodeA
        offsetF = offsetA
    }

    let sel = window.getSelection()

    if (nodeA.textContent == '⬚') {
        setSelection(sel, nodeA, SELECTNODE)
    } else if (nodeA === nodeF && offsetA == offsetF) {
        if (nodeA.nodeName == '#text' && offsetA == nodeA.textContent.length ||
            !nodeA.childElementCount && offsetA == '1' ||
            offsetA && nodeA.childElementCount == offsetA) {
                atEnd = true
        }
        setSelection(sel, nodeA, offsetA)
    } else {
        sel.setBaseAndExtent(nodeA, offsetA, nodeF, offsetF)
    }
}

function checkFunction(node) {
    let cNode = node.childElementCount
    let i = cNode - 1
    let fn = ''

    for (; i >= 0 && node.children[i].nodeName == 'mi'; i--) {
        fn = node.children[i].textContent + fn
    }
    fn = foldMathItalics(fn)
    if (!isFunctionName(fn))
        return false
    node.children[i + 1].textContent = fn
    i += 2
    for (cNode = cNode - i; cNode > 0; cNode--)
        node.children[i].remove()           // Remove trailing <mi>'s
    return true
}

function removeSelAttributes(node) {
    if (!node) {
        node = output.firstElementChild
        if (!node)
            return
    }
    let walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null)

    for (; node; node = walker.nextNode()) { // Remove current selection attributes
        node.removeAttribute('selanchor')
        node.removeAttribute('selfocus')
    }
}

function handleEndOfTextNode(node) {
    let name = node.parentElement.nodeName
    let nameT = ''

    if (name == 'mrow') {
        let nodeNext = node.nextElementSibling
        let intent = getIntent(node);
        node = node.parentElement;
        name = node.parentElement.nodeName
        if (intent == ':function')
            name = 'function';
        else if (intent.indexOf('integral') != -1)
            name = 'integrand';
        else if (isMathMLObject(node.parentElement))
            nameT = getArgName(node)
        else if (nodeNext) {
            name = isMathMLObject(nodeNext) ? names[nodeNext.nodeName] : nodeNext.textContent
            speak(name)
            return nodeNext
        }
    } else {
        nameT = getArgName(node)
    }
    if (nameT)
        name = nameT
    if (names[name])
        name = names[name];

    if (name != 'mrow') {
        speak('end of ' + name);
        atEnd = true;
    }
    return node
}

function handleKeyboardInput(node, key, sel) {
    // Handle keyboard input into output window
    closeAutocompleteList()
    if (deleteSelection(sel)) {
        sel = window.getSelection()
        node = sel.anchorNode
    }
    if (key == '#') {
        // Create equation number table if child of <math> is <mi>, <mn>,
        // <mo>, or <mtext>
        let nodeT = output.firstElementChild.firstElementChild
        let createEqNo = !nodeT.childElementCount

        if (!createEqNo && nodeT.nodeName == 'mrow') {
            // Or create eqno table for <mrow> without unmatched parens
            let [cParen, k, opBuildUp] =
                checkBrackets(output.firstElementChild.firstElementChild)
            createEqNo = !cParen
        }
        if (createEqNo) {
            // Create equation number table with first mtd containing <mtext>
            // with place holder and second mtd containing current MathML
            removeSelAttributes()
            let html = `<mtable><mlabeledtr><mtd><mtext selanchor="0" selfocus="1">⬚</mtext></mtd><mtd>` +
                output.firstElementChild.innerHTML +
                `</mtd></mlabeledtr></mtable>`
            output.firstElementChild.innerHTML = html
            refreshDisplays()
            return
        }
    }
    let nodeNewName = getMmlTag(key)

    if (node.nodeName == 'math') {
        if(!testing)
            console.log('Input at end of math zone')
        if (node.lastElementChild)
            node = node.lastElementChild
        else {
            let nodeNew = document.createElement(nodeNewName)
            nodeNew.textContent = key
            setSelAttributes(nodeNew, 'selanchor', '1')
            node.appendChild(nodeNew)
            refreshDisplays()
            return
        }
    }
    removeSelAttributes()
    let autocl
    if (node.nodeName == '#text')
        node = node.parentElement
    let nodeName = node.nodeName.toLowerCase()
    let nodeP = node.parentElement

    if (isAsciiAlphabetic(key) && node.textContent.endsWith('\\')) {
        let nodeNew = document.createElement('mtext')
        nodeNew.innerHTML = node.textContent + key
        setSelAttributes(nodeNew, 'selanchor', '-' + nodeNew.textContent.length)
        nodeP.replaceChild(nodeNew, node)
        nodeP.innerHTML = nodeP.innerHTML
        refreshDisplays()
        return
    }

    if (nodeName == 'mtext' && nodeP.nodeName == 'mtd' &&
        nodeP.parentElement.nodeName == 'mlabeledtr') {
        // Entering an equation number
        if (node.textContent == '⬚')
            node.textContent = key
        else
            node.textContent += key
        setSelAttributes(node, 'selanchor', '-' + node.textContent.length)
        refreshDisplays()
        return
    }
    if (nodeName == 'mtext' && node.textContent[0] == '"') {
        if (key == '"')
            node.textContent = node.textContent.substring(1)
        else
            node.textContent += key
        setSelAttributes(node, 'selanchor', '-' + node.textContent.length)
        refreshDisplays()
        return
    }
    if (nodeName == 'mtext' && node.textContent[0] == '\\') {
        // Collect control word; offer autocompletion menu
        if (isAsciiAlphabetic(key)) {
            node.textContent += key         // Collect control word
            autocl = checkAutocomplete(node)
            let offset = '-' + node.textContent.length
            setSelAttributes(node, 'selanchor', offset)
            nodeP.innerHTML = nodeP.innerHTML // Force redraw
            refreshDisplays()
            speak(resolveSymbols(key))
            return autocl
        }
        let symbol = resolveCW(node.textContent)
        if (symbol[0] == '"')
            return
        nodeName = getMmlTag(symbol)
        let nodeNew = document.createElement(nodeName)
        if (isDoubleStruck(symbol)) {
            let ch = doublestruckChar(symbol)
            nodeNew.setAttribute('intent', symbol)
            symbol = ch
        }
        nodeNew.textContent = symbol
        setSelAttributes(nodeNew, 'selanchor', '1')
        nodeP.replaceChild(nodeNew, node)
        node = nodeNew
    }
    let offset = sel.anchorOffset
    let isFunction

    switch (nodeNewName) {
        case 'mi':
            if (nodeName == 'mi' && nodeP.attributes.intent &&
                nodeP.attributes.intent.nodeValue == ':function') {
                node.textContent = node.textContent.substring(0, offset) +
                    key + node.textContent.substring(offset)
                nodeNewName = ''            // No new node
                offset++
            }
            break
        case 'mn':
            if (nodeName == 'mn') {
                node.textContent = node.textContent.substring(0, offset) +
                    key + node.textContent.substring(offset)
                nodeNewName = ''            // No new node
                offset++
            }
            break
        case 'mo':
            if (nodeName == 'mi' && nodeP.nodeName == 'mrow') {
                isFunction = checkFunction(nodeP)
            } else if (nodeName == 'mrow' && node.lastElementChild) {
                if (node.lastElementChild.nodeName == 'mi') {
                    isFunction = checkFunction(node)
                } else if (node.lastElementChild.nodeName == 'mrow') {
                    let nodeT = node.lastElementChild
                    if (nodeT.nodeName == 'mrow' && nodeT.lastElementChild &&
                        nodeT.lastElementChild.nodeName == 'mrow') {
                        nodeT = nodeT.lastElementChild
                    }
                    if (!nodeT.attributes.intent)
                        isFunction = checkFunction(nodeT)
                }
            }
            if (isFunction) {
                if (key == ' ')
                    key = '\u2061'
                break
            }
            if (node.textContent == '/' && key in negs) {
                node.textContent = key = negs[key]
                nodeNewName = ''
            } else if (node.textContent + key in mappedPair) {
                node.textContent = key = mappedPair[node.textContent + key]
                nodeNewName = ''
            } else if (key in mappedSingle) {
                key = mappedSingle[key]
            } else if (key == ' ')
                key = '\u202F'          // Use NNBSP to maintain ' ' in mml
            break
    }
    speak(resolveSymbols(key))
    if (!nodeNewName) {
        // node textContent modified; no new node
        setSelAttributes(node, 'selanchor', -offset)
        nodeP.innerHTML = nodeP.innerHTML // Force redraw
        refreshDisplays();
        return
    }
    let nodeNew = document.createElement(nodeNewName)
    removeSelAttributes(nodeP)
    if (isDoubleStruck(key)) {
        let ch = doublestruckChar(key)
        nodeNew.setAttribute('intent', key)
        key = ch
    }
    nodeNew.textContent = key
    setSelAttributes(nodeNew, 'selanchor', '1')

    if (node.textContent == '⬚') {
        // Replace empty arg place holder symbol with key
        nodeP.replaceChild(nodeNew, node)
    } else if (node.nodeName == 'mrow' && atEnd) {
        node.appendChild(nodeNew)
    } else if (nodeP.nodeName == 'mrow') {
        if (atEnd) {
            if (node.nextElementSibling) {
                nodeP.insertBefore(nodeNew, node.nextElementSibling)
            } else {
                if (!node.textContent)
                    nodeP.replaceChild(nodeNew, node)
                else
                    nodeP.appendChild(nodeNew)
            }
        }
        else
            nodeP.insertBefore(nodeNew, node)
    } else {
        let nodeMrow = document.createElement('mrow')
        nodeP.insertBefore(nodeMrow, node)
        if (atEnd) {
            nodeMrow.appendChild(node)
            nodeMrow.appendChild(nodeNew)
        } else {
            nodeMrow.appendChild(nodeNew)
            nodeMrow.appendChild(node)
        }
        atEnd = false;
    }
    nodeP.innerHTML = nodeP.innerHTML   // Force redraw
    refreshDisplays();
    return autocl
}

function getMmlTag(ch) {
    if (ch < ' ')
        return ''
    if (isAsciiDigit(ch))
        return 'mn'
    if (isAsciiAlphabetic(ch) || isGreek(ch) || ch > '\u3017' || isDoubleStruck(ch))
        return 'mi'
    if (ch == '"')
        return 'mtext'
    return 'mo'
}

function setAnchorAndFocus(sel, nodeAnchor, offsetAnchor, nodeFocus, offsetFocus) {
    if (!testing) {
        console.log("anchor, focus = " +
            nodeAnchor.nodeName + ', ' + offsetAnchor + ', ' +
            nodeFocus.nodeName + ', ' + offsetFocus)
    }
    sel.setBaseAndExtent(nodeAnchor, offsetAnchor, nodeFocus, offsetFocus)
}

function checkMathSelection(sel) {
    // Ensure selection in output window is valid for math, e.g., select whole
    // math object if selection boundary points are in different children
    let nodeAnchor = sel.anchorNode
    if (!nodeAnchor)
        return null

    if (nodeAnchor.nodeName == 'DIV') {
        if (nodeAnchor.id != 'output')
            return null

        // Empty DIV: insert math zone with place holder
        nodeAnchor.innerHTML = `<math display='block'><mi selanchor="0" selfocus="1">⬚</mi></math>`
        return setSelection(sel, nodeAnchor, SELECTNODE)
    }
    let node = nodeAnchor
    if (node.nodeName == '#text')
        node = node.parentElement
    if (node.nodeName[0] != 'm')
        return null                         // Not MathML ⇒ not output window

    if (sel.isCollapsed)
        return sel                          // All insertion points are valid

    // Nondegenerate selection
    let rel = 1                             // Default that nodeFocus ≠ nodeAnchor
    let nodeFocus = sel.focusNode

    if (nodeAnchor === nodeFocus) {
        if (nodeAnchor.nodeName == '#text') {
            // In a text node and in <mi>, <mn>, <mo>, or <mtext>, all offset
            // combinations are valid
            return sel
        }
        if (isMathMLObject(nodeAnchor)) {
            // Selecting a single child of a MathML object is valid. Selecting
            // more than one child must select the whole object
            return Math.abs(sel.anchorOffset - sel.focusOffset) <= 1
                ? sel : setSelection(sel, nodeAnchor, SELECTNODE)
        }
        rel = 0
    }

    let range = sel.getRangeAt(0)
    let nodeCA = range.commonAncestorContainer
    let needSelChange = false

    for (node = nodeAnchor; node != nodeCA; node = node.parentElement) {
        // Walk up to common ancestor checking if MathML objects are present
        if (isMathMLObject(node)) {
            nodeAnchor = node
            needSelChange = true
        }
    }
    if (!rel) {
        nodeFocus = nodeAnchor
    } else {
        for (node = nodeFocus; node != nodeCA; node = node.parentElement) {
            if (isMathMLObject(node)) {
                nodeFocus = node
                needSelChange = true
            }
        }
    }
    if (needSelChange) {
        if (!rel) {                         // nodeAnchor equals nodeFocus
            setAnchorAndFocus(sel, nodeAnchor, 0, nodeAnchor, nodeAnchor.childNodes.length)
        } else {
            // Compute rel = -1, 0, 1 for the focus node precedes, equals, or
            // follows the anchor node, respectively. Note: selection.direction
            // isn't supported by Chromium
            let offset
            range = document.createRange()
            range.selectNode(nodeAnchor)
            rel = range.comparePoint(nodeFocus, 0)
            if(!testing)
                console.log("rel =" + rel)

            if (rel > 0) {                  // nodeFocus follows nodeAnchor 
                offset = nodeFocus.nodeName == '#text'
                    ? nodeFocus.textContent.length : nodeFocus.childNodes.length
                setAnchorAndFocus(sel, nodeAnchor, 0, nodeFocus, offset)
            } else {                        // nodeFocus precedes nodeAnchor
                offset = nodeAnchor.nodeName == '#text'
                       ? nodeAnchor.textContent.length : nodeAnchor.childNodes.length
                setAnchorAndFocus(sel, nodeAnchor, offset, nodeFocus, 0)
            }
        }
    } else if (isMathMLObject(nodeCA) && nodeCA !== nodeAnchor) {
        setAnchorAndFocus(sel, nodeCA, 0, nodeCA, nodeCA.childNodes.length)
    }
    return sel
}

function deleteSelection(sel) {
    if (sel.isCollapsed) {
        closeAutocompleteList()
        return false                        // Nothing selected
    }
    let range = sel.getRangeAt(0)
    let nodeStart = range.startContainer

    if (nodeStart.nodeName == '#text')
        nodeStart = nodeStart.parentElement
    if (nodeStart.nodeName == 'math') {
        outputUndoStack = ['']
        nodeStart.innerHTML = `<mi selanchor="0" selfocus="1">⬚</mi>`
        refreshDisplays()
        return true
    }

    let singleArg = range.startContainer === range.endContainer
    if (singleArg) {
        if (nodeStart.textContent == '⬚')
            return true                         // Don't delete place holder
    }
    // Save current math for undo stack. If it's already on the stack top,
    // remove it since uMath will be added by checkEmpty()
    let uMath = getUnicodeMath(output.firstElementChild, true)
    if (uMath == stackTop(outputUndoStack))
        outputUndoStack.pop()

    sel.deleteFromDocument()                    // Deletes #text nodes but leaves element nodes
    if (ummlConfig.debug)                       // Set breakpoint to see what got deleted
        output_source.innerHTML = highlightMathML(escapeMathMLSpecialChars(indentMathML(output.innerHTML)));

    let node, nodeNext, nodeP

    if (!singleArg) {
        // Remove contentless elements that sel.deleteFromDocument() leaves
        // behind except for elements needed as MathML object arguments
        for (node = nodeStart; node && !node.textContent; node = nodeNext) {
            nodeP = node.parentElement
            nodeNext = node.nextElementSibling
            if (nodeP.nodeName == 'mrow') {
                for (; nodeP.childElementCount > 1 && node && !node.textContent;
                    node = nodeNext) {
                    nodeNext = node.nextElementSibling
                    node.remove()
                }
                if (!node || node.textContent) {
                    // No element left in mrow or element wasn't deleted. If
                    // only one child is left, replace an attribute-less mrow
                    // by that child
                    if (nodeP.childElementCount == 1 && !nodeP.attributes.length)
                        nodeP.parentElement.replaceChild(node, nodeP)
                    break;
                }
                if (isMathMLObject(nodeP))
                    nodeP.outerHTML = `<mi selanchor="0" selfocus="1">⬚</mi>`
                else
                    nodeP.remove()
            } else if (isMathMLObject(nodeP) && nodeNext && nodeNext.textContent) {
                node.innerHTML = `<mi selanchor="0" selfocus="1">⬚</mi>`
            } else {
                node.remove()
            }
        }
    }
    // Set up insertion point (IP)
    node = sel.anchorNode                   // Anchor node after deletions
    let offset = 0

    if (node.childElementCount) {
        let i = sel.anchorOffset            // Child index

        if (i == node.childElementCount) {  // Follows last child
            i--                             // Index of last child
            offset = 1                      // IP will follow last child
        }
        node = node.children[i]
        if (offset && node.childElementCount)
            offset = node.childElementCount // At end of last child
    } else {                                // mi, mo, mn, mtext
        offset = sel.anchorOffset           // 0 or 1
    }
    checkEmpty(node, offset, uMath)
    return true
}

function setSelAttributes(node, attr, value, attr1, value1) {
    if (!node || node.nodeName == 'math')
        return
    if (node.nodeName == '#text')
        node = node.parentElement
    node.setAttribute(attr, value)
    if (attr1)
        node.setAttribute(attr1, value1)
}

function deleteChar(node, offset) {
    let cchCh = 1
    let code = node.textContent.codePointAt(offset)
    if (isTrailSurrogate(code)) {
        cchCh = 2
        offset--
    } else if (code > 0xFFFF) {
        cchCh = 2
    }
    node.textContent = node.textContent.substring(0, offset)
        + node.textContent.substring(offset + cchCh)
    setSelAttributes(node, 'selanchor', node.textContent.length)
    return checkAutocomplete(node)
}

function checkAutocomplete(node) {
    if (node.textContent.length < 3)
        return null

    let cw = node.textContent.substring(1)
    let nodeP = node.parentElement

    return createAutoCompleteMenu(cw, 'output', e => {
        // User clicked matching control word: insert its symbol
        let val = e.currentTarget.innerText
        let symbol = val[val.length - 1]
        let nodeNew = document.createElement(getMmlTag(symbol))
        if (isDoubleStruck(symbol)) {
            let ch = doublestruckChar(symbol)
            nodeNew.setAttribute('intent', symbol)
            symbol = ch
        }
        nodeNew.textContent = symbol
        setSelAttributes(nodeNew, 'selanchor', '1')

        if (nodeP.hasAttribute('selanchor')) {
            nodeP.parentElement.replaceChild(nodeNew, nodeP)
        } else {
            // node is no longer a child of nodeP; find it
            let walker = document.createTreeWalker(nodeP,
                NodeFilter.SHOW_ELEMENT, null, false)
            while (walker.nextNode() && !walker.currentNode.hasAttribute('selanchor'))
                ;
            nodeP.replaceChild(nodeNew, walker.currentNode)
        }
        closeAutocompleteList()
        nodeP.innerHTML = nodeP.innerHTML // Force redraw
        refreshDisplays()
        speak(resolveSymbols(symbol))
        onac = true    // Suppress default speech, e.g., for 'mi'
    })
}

function checkEmpty(node, offset, uMath) {
    // If a deletion empties the active node, remove the node unless it's
    // required, e.g., for numerator, denominator, subscript, etc. For the
    // latter, insert the empty argument place holder '⬚'. Set the 'selanchor'
    // attribute for the node at the appropriate selection IP
    removeSelAttributes()

    if (!node.textContent) {
        if (node.nodeName == '#text')
            node = node.parentElement

        if (isMathMLObject(node.parentElement) || node.parentElement.nodeName == 'mtd') {
            node.outerHTML = `<mi selanchor="0" selfocus="1">⬚</mi>`
        } else {
            let nodeT = node.parentElement
            if (node.nextElementSibling)
                nodeT = node.nextElementSibling
            else if (node.previousElementSibling)
                nodeT = node.previousElementSibling
            node.remove()
            if (!nodeT.textContent && nodeT.nodeName == 'mrow' &&
                !isMathMLObject(nodeT.parentElement)) {
                nodeT.remove()
            } else {
                setSelAttributes(nodeT, 'selanchor', nodeT.textContent ? '1' : '0')
                setSelection(null, nodeT, 0)
                atEnd = true
            }
        }
    } else {
        if (offset == undefined)
            offset = atEnd ? '1' : '0'
        if (node.nodeName == '#text') {
            node = node.parentElement
            offset = '-' + offset
        }
        setSelAttributes(node, 'selanchor', offset)
    }
    if (output.firstElementChild && !output.firstElementChild.childElementCount)
        output.firstElementChild.innerHTML = `<mi selanchor="0" selfocus="1">⬚</mi>`
    refreshDisplays(uMath)
}

function checkAutoBuildUp(node, nodeP, key) {
    // Return new node if formula auto build up succeeds; else null
    if (nodeP.nodeName != 'mrow' ||
        node.nodeName == 'mtext' && node.textContent[0] == '\\')
        return null

    let cNode = nodeP.childElementCount
    if (key == '"') {
        for (let i = cNode - 1; i >= 0; i--) {
            if (nodeP.children[i].childElementCount)
                break;
            if (nodeP.children[i].textContent == '"') {
                // Replace child nodes i through cNode - 1 with <mtext>
                if (i == cNode - 1)
                    break;                  // No mtext content
                nodeP.removeChild(nodeP.children[i]) // Remove quote
                let str = ''
                for (let j = i + 1; j < cNode; j++) {
                    str += nodeP.children[i].textContent
                    nodeP.removeChild(nodeP.children[i])
                }
                let nodeNew = document.createElement('mtext')
                nodeNew.textContent = str
                nodeP.appendChild(nodeNew)
                return nodeP
            }
        }
    }
    if ('+=-<> )'.includes(key) ||
        key == '/' && !node.textContent.endsWith(')') || // Not end of numerator
        key == '#' && !node.textContent.endsWith('(')) { // Not hex RGB: eq-no
        // Try to build up <mrow> or trailing part of it
        let uMath = ''
        let [cParen, k, opBuildUp] = checkBrackets(nodeP)
        if (opBuildUp && (!cParen || k != -1)) {
            autoBuildUp = true
            if (!cParen) {
                // Same count of open and close delimiters: try to build
                // up nodeP: nodeP → UnicodeMath
                uMath = getUnicodeMath(nodeP)
            } else {
                // Differing count: try to build up nodeP trailing mi, mo,
                // mn, mtext children
                ksi = false
                for (let i = k + 1; i < cNode; i++)
                    uMath += dump(nodeP.children[i]);
            }
            uMath = uMath.replace('"\\"', '\\')
            let t = unicodemathml(uMath, true) // uMath → MathML
            if (autoBuildUp) {          // Autobuildup succeeded
                if (!testing && ummlConfig.debug) {
                    let pegjs_ast = t.details["intermediates"]["parse"];
                    let preprocess_ast = t.details["intermediates"]["preprocess"];
                    output_pegjs_ast.innerHTML = highlightJson(pegjs_ast) + "\n";
                    output_preprocess_ast.innerHTML = highlightJson(preprocess_ast) + "\n";
                }
                if (!cParen) {          // Full build up of nodeP
                    nodeP.innerHTML = t.mathml
                } else {                // Build up of trailing children
                    // Remove children[k + 1]...children[cNode - 1] and
                    // append their built-up counterparts
                    for (let i = cNode - 1; i > k; i--)
                        nodeP.children[i].remove()
                    const parser = new DOMParser();
                    let doc = parser.parseFromString(t.mathml, "application/xml");
                    nodeP.appendChild(doc.firstElementChild)
                }
                return removeSuperfluousMrow(nodeP)
            }
        }
    }
    return null
}
function getArgName(node) {
    let attrs
    let name = node.parentElement.nodeName

    switch (name) {
        case 'msubsup':
        case 'munderover':
            if (!node.previousElementSibling)
                name = 'base';
            else if (node.nextElementSibling)
                name = isNary(node.previousElementSibling.textContent) ? 'lowwer limit' : 'subscript';
            else
                name = isNary(node.parentElement.firstElementChild.textContent) ? 'upper limit' : 'superscript';
            break;
        case 'mfrac':
            name = node.nextElementSibling ? 'numerator' : 'denominator'
            break;
        case 'mroot':
            name = node.nextElementSibling ? 'radicand' : 'index'
            break;
        case 'msub':
        case 'msup':
            name = node.nextElementSibling ? 'base'
                : name == 'msub' ? 'subscript' : 'superscript'
            break;
        case 'mover':
        case 'munder':
            name = node.nextElementSibling ? 'base'
                : name == 'munder' ? 'below' : 'above'
            break;
        case 'menclose':
            if (node.parentElement.attributes.notation)
                return node.parentElement.attributes.notation.nodeValue
        case 'msqrt':
            name = names[name]
            break;

        default:
            name = ''
    }
    return name
}

function moveSelection(sel, node, offset) {
    // Move selection forward in the MathML DOM and describe what's there
    let intent
    let name

    if (node.nodeType == 1) {               // Starting at an element...
        if (node.nodeName == 'math')
            return
        if (!node.childElementCount) {      // mi, mo, mn, or mtext
            // Move to start of next element in tree
            if (!node.nextElementSibling && node.parentElement)
                node = node.parentElement;

            while (!node.nextElementSibling && node.parentElement) {
                node = node.parentElement;
                name = node.nodeName;
                if (name != 'mrow') {
                    if (names[name])
                        name = names[name]
                    speak('end ' + name);
                    setSelection(sel, node, 0)
                    return;
                }
            }
            if (!node.nextElementSibling)
                return;
            atEnd = false;
            node = node.nextElementSibling;
            if (node.nodeName == 'mrow') {
                let ch = getNaryOp(node);
                if (ch) {
                    node = node.firstElementChild;
                } else {
                    intent = getIntent(node);
                    if (intent == ':function')
                        speak(getSpeech(node))
                }
                node = node.firstElementChild;
            } else if (node.nodeName == 'mtr') {
                node = checkTable(node)
            }
        } else if (atEnd) {                 // At end of element
            if (node.nextElementSibling) {
                atEnd = false;
                node = node.nextElementSibling
                if (node.nodeName == 'mrow') {
                    let ch = getNaryOp(node);
                    if (ch) {
                        node = node.firstElementChild;
                    } else {
                        let intent = getIntent(node);
                        if (intent == ':function')
                            speak(getSpeech(node))
                    }
                    node = node.firstElementChild;
                } else if (node.nodeName == 'mtr') {
                    node = checkTable(node)
                }
            } else {
                node = node.parentElement;
            }
        } else {
            // Element with element children: move down to first child
            if (!node.childNodes.length)    // 'malignmark' or 'maligngroup'
                node = node.nextElementSibling;
            node = node.firstElementChild;
            if (!node.childNodes.length)    // 'malignmark' or 'maligngroup'
                node = node.nextElementSibling;
            if (node.nodeName == 'mrow')
                node = node.firstElementChild;
        }
        name = node.nodeName;
        if (node.nodeType == 3 || !node.childElementCount && node.childNodes.length) {
            node = node.firstChild;
            name = node.nodeName;
        }
        sel = setSelection(sel, node, 0)
        if (!atEnd && checkSimpleSup(node)) // E.g., say "b squared" if at 𝑏²
            return;
        let fixedNumberArgs = false
        if (names[name]) {
            fixedNumberArgs = true
            name = names[name]
        }
        if (atEnd) {
            if (name == 'mrow') {
                if (node.attributes.arg && node.attributes.arg.nodeValue == 'naryand')
                    node = node.parentElement
                let ch = getNaryOp(node)
                name = ch ? symbolSpeech(ch) : getArgName(node)
            } else if (fixedNumberArgs && node.nextElementSibling) {
                atEnd = false
                node = node.nextElementSibling
                if (node.nodeName == 'mrow')
                    node = node.firstElementChild
                if (!node.childElementCount)
                    name = node.firstChild.textContent
                else {
                    name = node.nodeName
                    if (names[name])
                        name = names[name];
                }
                speak(name)
                setSelection(sel, node, 0);
                return
            }
            name = 'finish ' + name
        }
        if (name == '#text')
            speechSel(sel)
        else if (name != 'mtd')
            speak(name)
        return
    }
    if (node.nodeType != 3)
        return

    // Text node: child of <mi>, <mo>, <mn>, or <mtext>
    if (offset < sel.anchorNode.length) {
        // Move through, e.g., for 'sin'
        let code = node.data.codePointAt(offset);
        offset += code > 0xFFFF ? 2 : 1;
        if (offset < sel.anchorNode.length) {
            sel = setSelection(sel, node, offset);
            speechSel(sel)
            return                          // Not at end yet
        }
    }

    // At end of text node: move up to <mi>, <mo>, <mn>, <mtext>. Then move
    // to next sibling if in same <mrow>
    node = sel.anchorNode.parentElement;
    name = node.parentElement.nodeName

    if (name != 'mrow') {
        node = handleEndOfTextNode(node)
        setSelection(sel, node, 0);
        return
    }
    atEnd = false;
    if (node.nextElementSibling) {
        node = node.nextElementSibling;
        intent = getIntent(node);
        if (node.nodeName == 'mo') {
            if (node.textContent == '\u2061')
                node = node.nextElementSibling;
        } else if (node.nodeName == 'mtable') {
            name = 'row';
            if (intent == ':equations')
                name = 'equation';
            intent = getIntent(node.parentElement)
            if (intent == ':cases')
                name = 'case'
            speak(name + '1');
            setSelection(sel, node.firstElementChild, 0);
            return;
        } else if (node.nodeName == 'mrow') {
            let ch = getNaryOp(node);
            if (ch) {
                node = node.firstElementChild;
            } else {
                if (intent == ':function')
                    speak(getSpeech(node));
                else if (intent == ':cases')
                    speak('cases');
            }
            node = node.firstElementChild
        }
        if (node.nodeType == 3 || !node.childElementCount) {
            if (node.nodeName != '#text')
                node = node.firstChild
            let cch = getCch(node.textContent, 0)
            name = resolveSymbols(node.textContent.substring(0, cch))
        } else {
            name = node.nodeName
            if (name == 'menclose') {
                name = 'box'
                if (node.attributes.notation)
                    name = node.attributes.notation.nodeValue
            } else if (names[name])
                name = names[name];
        }
    } else {                                // No next sibling
        node = node.parentElement;          // Up to <mrow>
        atEnd = true;                       // At end of <mrow>
        name = getArgName(node)

        if (!name) {
            if (node.parentElement.nodeName == 'mtd') {
                if (node.nextElementSibling) {
                    node = node.nextElementSibling;
                    if (!node.childElementCount)  // 'malignmark' or 'maligngroup'
                        node = node.nextElementSibling;
                    node = node.firstElementChild
                    atEnd = false;
                    if (!node.childElementCount && node.childNodes.length)
                        node = node.firstChild;
                    setSelection(sel, node, 0);
                    speechSel(sel)
                    return
                }
                node = node.parentElement;
                name = node.nodeName;
            } else if (node.parentElement.nodeName == 'mrow') {
                if (node.nextElementSibling) {
                    node = node.nextElementSibling;
                    name = node.nodeName
                    atEnd = false;
                    if (!node.childElementCount) {
                        node = node.firstChild;
                        setSelection(sel, node, 0);
                        speechSel(sel)
                        return;
                    }
                } else if (node.attributes.intent)
                    name = node.attributes.intent.value
            }
        }
    }
    sel = setSelection(sel, node, atEnd ? 1 : 0);
    if (checkSimpleSup(node))
        return;
    if (!name)
        name = node.nodeName
    speak(atEnd ? 'at end ' + name : name)
}

var onac = false                        // true immediately after autocomplete click

output.addEventListener("click", function () {
    if (onac) {                         // Ignore click that follows autocomplete click
        onac = false
        return
    }
    //removeSelAttributes()
    let sel = window.getSelection()
    let node = sel.anchorNode
    console.log('getSelection anchorNode = ' + node.nodeName)

    if (node.nodeName == 'DIV')
        return                          // </math>
    atEnd = node.length == sel.anchorOffset
    if (sel.isCollapsed && node.nodeName == '#text' && node.textContent == '⬚')
        setSelection(sel, node, SELECTNODE)
    checkSimpleSup(node.parentElement.parentElement)
    speechSel(sel)
})

output.addEventListener('keydown', function (e) {
    var x = document.getElementById(this.id + "autocomplete-list")
    if (handleAutocompleteKeys(x, e))
        return

    let cchCh
    let dir = ''
    let i
    let intent = ''
    let key = e.key
    let sel = window.getSelection()

    let range = document.createRange()
    if (sel.type != 'None')
        range = sel.getRangeAt(0)           // Save entry selection

    let node = sel.anchorNode
    let name = node.nodeName
    let offset = sel.anchorOffset
    let uMath

    if (sel.anchorNode.nodeName == 'DIV') {
        // No MathML in output display; insert a math zone
        node.innerHTML = `<math display="block"><mi selanchor="0" selfocus="1">⬚</mi></math>`
        node = node.firstElementChild
        name = 'math'
        sel = setSelection(sel, node, 0)
        atEnd = true
    }

    switch (key) {
        case 'ArrowRight':
            e.preventDefault()
            dir = '→'
            moveSelection(sel, node, offset)
            if (e.shiftKey) {
                sel = window.getSelection()
                sel.setBaseAndExtent(range.startContainer, range.startOffset, sel.anchorNode, sel.anchorOffset)
                sel = window.getSelection()
                console.log(
                    "sel.anchorNode.nodeName = " + sel.anchorNode.nodeName + ', ' + sel.anchorOffset + '\n' +
                    "sel.focusNode.nodeName = " + sel.focusNode.nodeName + ', ' + sel.focusOffset)
            }
            return;

        case 'ArrowLeft':
            dir = '←'
            return;                     // Do default for now

        case 'Backspace':
            e.preventDefault()
            if (deleteSelection(sel))
                return
            if (node.nodeName == 'math') {
                if (!offset)
                    return
                node = node.children[offset - 1]
            }
            if (isMathMLObject(node)) {
                setSelection(sel, node, SELECTNODE)
                return
            }
            uMath = getUnicodeMath(output.firstElementChild, true)
            if (node.nodeName == '#text') {
                if (offset > 0) {
                    offset--
                    let autocl = deleteChar(node, offset)
                    if (autocl != undefined)
                        this.parentNode.appendChild(autocl)
                    checkEmpty(node, -offset, uMath)
                    return
                }
                node = node.parentElement
            }
            while (node.nodeName == 'mrow' && node.lastElementChild)
                node = node.lastElementChild

            if (isMathMLObject(node)) {
                setSelection(sel, node, SELECTNODE)
                return
            }
            if (offset > 0) {
                cchCh = getCch(node.textContent, offset - 1)
                if (offset < cchCh)
                    offset = cchCh
                node.textContent = node.textContent.substring(0, offset - cchCh) +
                    node.textContent.substring(offset)
            } else if (node.previousSibling) {
                node = node.previousSibling
                cchCh = getCch(node.textContent, node.textContent.length - 1)
                node.textContent = node.textContent.substring(0,
                    node.textContent.length - cchCh)
            }
            checkEmpty(node, 0, uMath)
            return

        case 'Delete':
            e.preventDefault()
            if (deleteSelection(sel))
                return

            if (node.nodeName == 'math')
                return

            if (isMathMLObject(node)) {
                setSelection(sel, node, SELECTNODE)
                return
            }
            uMath = getUnicodeMath(output.firstElementChild, true)
            if (node.nodeName == '#text') {
                if (offset < node.textContent.length) {
                    let autocl = deleteChar(node, offset)
                    if (autocl != undefined)
                        this.parentNode.appendChild(autocl)
                    checkEmpty(node, -offset, uMath)
                    return
                }
                node = node.parentElement
            }
            if (node.nodeName == 'mrow' && node.childElementCount)
                node = node.children[offset]

            if (isMathMLObject(node)) {
                setSelection(sel, node, SELECTNODE)
                return
            }
            cchCh = getCch(node.textContent, 0)
            node.textContent = node.textContent.substring(cchCh)

            checkEmpty(node, 0, uMath)
            return

        case 'End':
        case 'Home':
            e.preventDefault()
            node = output.firstElementChild
            if (node.nodeName != 'math' || node.firstElementChild.textContent == '⬚')
                return
            node = node.firstElementChild
            if (key == 'End') {
                atEnd = true
                while (node.nodeName == 'mrow') // UnicodeMath doesn't use <mrow>'s
                    node = node.lastElementChild
                offset = node.childElementCount ? node.childElementCount : 1
            } else {
                key = 'Start'
                atEnd = false
                offset = 0
                while (node.nodeName == 'mrow')
                    node = node.firstElementChild
            }
            if(!testing)
                speak(key + ' of math zone')
            removeSelAttributes()
            setSelAttributes(node, 'selanchor', offset)
            refreshDisplays('', true)
            return
    }
    if (key.length > 1 && !inRange('\uD800', key[0], '\uDBFF')) // 'Shift', etc.
        return

    e.preventDefault();
    let walker

    if (e.ctrlKey) {
        switch (key) {
            case 'a':                       // Ctrl+a
                // Select math zone
                sel = setSelection(sel, output.firstElementChild, SELECTNODE)
                return

            case 'b':                       // Ctrl+b
            case 'i':                       // Ctrl+i
                // Toggle math bold/italic ()
                if (sel.isCollapsed)
                    return
                if (node.nodeName == '#text')
                    node = node.parentElement
                let chars = node.textContent;

                if (chars.length == 1 && chars != 'ℎ') {
                    // Single letters display in math italic unless
                    // mathvariant = 'normal'
                    if (node.attributes.mathvariant &&
                        node.attributes.mathvariant.value == 'normal') {
                        node.removeAttribute('mathvariant')
                    } else {
                        chars = italicizeCharacter(chars)
                    }
                }
                chars = boldItalicToggle(chars, key)
                node.textContent = chars
                if (chars.length == 1 && chars != 'ℎ' && node.nodeName == 'mi')
                    node.setAttribute('mathvariant', 'normal')
                refreshDisplays()
                return

            case 'c':                       // Ctrl+c
                let mathml = ''             // Collects MathML for selected nodes
                let range = sel.getRangeAt(0)
                let nodeS = range.startContainer
                if (nodeS.nodeName == '#text')
                    nodeS = nodeS.parentElement
                let nodeE = range.endContainer
                if (nodeE.nodeName == '#text')
                    nodeE = nodeE.parentElement
                node = range.commonAncestorContainer
                if (node.nodeName == '#text')
                    node = node.parentElement
                walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null)

                while (node && node !== nodeS)
                    node = walker.nextNode() // Advance walker to starting node

                while (node) {
                    mathml += node.outerHTML
                    if (node === nodeE)     // Reached the ending node
                        break
                    if (!walker.nextSibling()) {
                        while (true) {      // Bypass current node
                            walker.nextNode()
                            let position = walker.currentNode.compareDocumentPosition(node)
                            if (!(position & 8))
                                break       // currentNode isn't inside node
                        }
                    }
                    node = walker.currentNode
                }
                navigator.clipboard.writeText(mathml)
                return

            case 'r':                       // Ctrl+r
                // Refresh MathML display (MathML → UnicodeMath → MathML)
                uMath = getUnicodeMath(output.firstElementChild, true)
                let t = unicodemathml(uMath, true) // uMath → MathML
                output.innerHTML = t.mathml
                refreshDisplays('', true)
                return

            case 'y':                       // Ctrl+y
                // Redo
                if (!outputRedoStack.length)
                    return
                outputUndoStack.push(input.innerHTML)
                uMath = outputRedoStack.pop()
                setUnicodeMath(uMath)
                return

            case 'z':                       // Ctrl+z
                if (!outputUndoStack.length)
                    return
                outputRedoStack.push(input.innerHTML)
                let undoTop = stackTop(outputUndoStack)
                if (input.innerHTML == undoTop)
                    outputUndoStack.pop()
                uMath = outputUndoStack.pop()
                setUnicodeMath(uMath)
                return
        }                                   // switch(e.key) {}
    } else if (e.altKey && e.key == 'x') {  // Alt+x: hex → Unicode
        let cchSel = 0                      // Default degenerate selection
        let str = ''                        // Collects hex string

        if (!sel.isCollapsed) {             // Nondegenerate selection
            let rg = sel.getRangeAt(0)
            node = rg.endContainer
            str = rg + ''
            cchSel = str.length
        }
        if (node.nodeName == '#text')
            node = node.parentElement
        let nodeP = node.parentElement
        if (nodeP.nodeName != 'mrow')
            return
        let cNode = nodeP.childElementCount
        let iEnd = -1                       // Index of node in nodeP
        let iStart = 0                      // Index of 1st node that might be part of hex

        // Collect span of alphanumerics ending with node
        for (i = cNode - 1; i >= 0; i--) {
            let nodeC = nodeP.children[i]
            if (nodeC.nodeName != 'mi' && nodeC.nodeName != 'mn') {
                if (iEnd > 0) {             // Index of last node is defined
                    iStart = i + 1          // Set index of first node
                    break
                }
            } else {
                if (nodeC == node)
                    iEnd = i                // Found node's index
                if (iEnd > 0 && !cchSel)
                    str = nodeC.textContent + str
            }
        }
        let [ch, cchDel] = hexToUnicode(str, str.length, cchSel)

        // Remove cchDel codes along with emptied nodes
        for (i = iEnd; i >= iStart && cchDel > 0; i--) {
            let nodeC = nodeP.children[i]
            let cch = nodeC.textContent.length

            if (cch > cchDel) {             // ∃ more codes than need deletion
                nodeC.innerHTML = nodeC.innerHTML.substring(0, cch - cchDel)
                break;
            }
            cchDel -= cch
            if (nodeP.childElementCount == 1) {
                // Leave empty child as place holder for ch
                nodeC.innerHTML = ''
            } else {
                nodeC.remove()
            }
        }
        node = nodeP.children[i >= 0 ? i : 0]
        name = node.nodeName
        atEnd = true
        key = ch
    }

    // Handle character input
    if (name == '#text')
        node = node.parentElement

    let nodeP = node
    if (!node.childElementCount && name != 'math')
        nodeP = node.parentElement

    atEnd = sel.anchorOffset != 0
    let nodeT = checkAutoBuildUp(node, nodeP, key)
    if (nodeT) {
        node = nodeT                        // FAB succeeded: update node
        atEnd = true
        if (key == ' ' || key == '"') {     // Set insertion point
            let cChild = node.childElementCount
            if (cChild) {
                while (node.nodeName == 'mrow') {
                    node = node.lastElementChild
                    cChild = node.childElementCount
                }
                node.setAttribute('selanchor', cChild ? cChild : 1)
            }
        } else {
            handleKeyboardInput(node, key, sel)
        }
        refreshDisplays('', true)
        autoBuildUp = false
        return
    }
    let autocl = handleKeyboardInput(node, key, sel)

    // If defined, append autocomplete list to output autocomplete container
    if (autocl != undefined)
        this.parentNode.appendChild(autocl)

    // Ignore other input for now
})

function checkResize() {
    let h = document.getElementsByTagName('h1');
    let heading = document.getElementById("heading");
    if (heading == undefined) {
        testing = true
        return                              // (for tests)
    }

    if (window.innerHeight > 1000) {
        let outputs = document.getElementsByClassName('tabcontent');
        for (let i = 0; i < outputs.length; i++) {
            outputs[i].style.height = '500px';
        }
    }
}

checkResize();

if (!testing) {
    if (window.innerWidth < 768 || !ummlConfig.debug) {
        // Suppress AST tabs for mobile devices
        var tabs = document.getElementsByClassName('tabs');
        tabs[0].style.display = "none";

        if (!input.value)
            output_source.innerHTML = 'MathML will appear here'

        if (window.innerWidth <= 768) {
            let history = document.getElementsByClassName("history")
            history[0].style.display = "none"
        }
    }

    // if LaTeX output is enabled, hide AST tab (since there is no LaTeX AST) and
    // rename source tab
    if (ummlConfig.outputLaTeX) {
        document.getElementById("mathml_ast").style.display = "none";
        document.getElementById("source").innerHTML = document.getElementById("source").innerHTML.replace("MathML", "LaTeX");
        measurements_pretty = document.getElementById("measurements_pretty");  // target lock reacquired
    }

    // if tracing is enabled, add trace tab
    if (ummlConfig.tracing) {
        var tempElem = document.createElement('button');
        tempElem.classList.add('tab');
        tempElem.id = 'trace';
        tempElem.innerHTML = 'Trace';
        document.getElementById('pegjs_ast').parentNode.insertBefore(tempElem, document.getElementById('pegjs_ast').nextSibling);

        tempElem = document.createElement('pre');
        tempElem.id = 'output_trace';
        output_pegjs_ast.parentNode.insertBefore(tempElem, output_pegjs_ast.nextSibling);
        var output_trace = document.getElementById('output_trace');
    }

    // load local storage data from previous page load
    if (window.localStorage.getItem('unicodemath')) {
        input.innerHTML = window.localStorage.getItem('unicodemath').replace(/LINEBREAK/g, '\n');
        draw();
    }
    if (window.localStorage.getItem('active_tab')) {
        setActiveTab(window.localStorage.getItem('active_tab'));
    } else {
        setActiveTab(activeTab);
    }
    if (window.localStorage.getItem('history')) {
        hist = JSON.parse(window.localStorage.getItem('history'));
        displayHistory();
    }
}

// Enable autocorrect and autocomplete
autocomplete();
function setSpeech() {
    return new Promise(
        function (resolve, reject) {
            let synth = window.speechSynthesis;
            let id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    )
}
// Use Zira for speech if she's available
var voiceZira
let s = setSpeech();

s.then(v => voiceZira = v.filter(val => val.name.startsWith('Microsoft Zira'))[0])

function getCodePoints() {
    // display code points corresponding to the characters
    if (window.innerHeight < 1000)
        input.style.height = "200px";
    input.style.fontSize = "1.5rem";
    var codepoints_HTML = "";
    Array.from(input.value).forEach(c => {
        var cp = c.codePointAt(0).toString(16).padStart(4, '0').toUpperCase();

        // highlight special invisible characters and spaces (via
        // https://en.wikipedia.org/wiki/Whitespace_character#Unicode,
        // https://www.ptiglobal.com/2018/04/26/the-beauty-of-unicode-zero-width-characters/,
        // https://330k.github.io/misc_tools/unicode_steganography.html)
        var invisibleChar = [
            "0009", "000A", "000B", "000C", "000D", "0020", "0085", "00A0",
            "1680", "2000", "2001", "2002", "2003", "2004", "2005", "2006",
            "2007", "2008", "2009", "200A", "200B", "200C", "200D", "200E",
            "2028", "2029", "202A", "202C", "202D", "202F", "205F", "2060",
            "2061", "2062", "2063", "2064", "2800", "3000", "180E", "FEFF",
        ].includes(cp);

        // lookup unicode data for tooltip
        var tooltip = "";
        if (typeof getCodepointData === "function") {
            try {
                var cpd = getCodepointData(cp);
                tooltip = `Name: ${cpd["name"].replace("<", "&amp;lt;").replace(">", "&amp;gt;")}<br>Block: ${cpd["block"]}<br>Category: ${cpd["category"]}`;
            } catch (e) {
                tooltip = "no info found";
            }
        }

        // lookup tooltip data as previously defined for the on-screen buttons
        // and prepend it
        if (!testing && symbolTooltips[c] != undefined && symbolTooltips[c] != "") {
            tooltip = symbolTooltips[c] + "<hr>" + tooltip;
        }

        codepoints_HTML += '<div class="cp' + (invisibleChar ? ' invisible-char' : '') + '" data-tooltip="' + tooltip + '"><div class="p">' + cp + '</div><div class="c">' + c + '</div></div>'

        if (c == "\n") {
            codepoints_HTML += "<br>";
        }
    });
    return codepoints_HTML
}

// compile and draw mathml code from input field
async function draw(undo) {

    // if required, wait for the parser to be generated, via
    // https://stackoverflow.com/a/39914235
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (typeof ummlParser === "undefined") {
        await sleep(10);
    }

    // avoid doing anything if the input hasn't changed – e.g. when the
    // user has only been moving the cursor
    if (input.value == prevInputValue) {
        return;
    }

    // clear some stuff
    if (!testing) {
        codepoints.innerHTML = "";
        speechDisplay.innerHTML = "";
    }
    if (ummlConfig.tracing)
        output_trace.innerHTML = ""

    //output.classList.add("hideAll");

    // if the input field is empty (as it is in the beginning), avoid doing much
    // with its contents
    if (input.value == "") {
        output.innerHTML = "";
        output_pegjs_ast.innerHTML = "";
        output_preprocess_ast.innerHTML = "";
        output_mathml_ast.innerHTML = "";
        output_source.innerHTML = !ummlConfig.debug ? 'MathML will appear here' : ''
        measurements_parse.innerHTML = "";
        measurements_transform.innerHTML = "";
        measurements_pretty.innerHTML = "";
        measurements_parse.title = "";
        measurements_transform.title = "";
        measurements_pretty.title = "";
        window.localStorage.setItem('unicodemath', "");
        closeAutocompleteList();
        prevInputValue = "";
        inputUndoStack = [{uMath: ''}]
        inputRedoStack = []
        outputUndoStack = ['']
        outputRedoStack = ['']
        return;
    }

    prevInputValue = input.value;

    if (isMathML(input.value)) {
        // Resize to display input MathML
        input.style.height = window.innerHeight > 1000 ? "500px" : "400px";
        input.style.fontSize = "0.9rem";
    } else if(!testing) {
        codepoints.innerHTML = getCodePoints()
    }
    // update local storage
    window.localStorage.setItem('unicodemath', input.value.replace(/\n\r?/g, 'LINEBREAK'));

    if (undo == undefined) {
        let undoTop = stackTop(inputUndoStack)
        if (input.value != undoTop.uMath) {
            let undoNext = {uMath: input.value, selStart: input.selectionStart,
                            selEnd: input.selectionEnd}
            inputUndoStack.push(undoNext)
        }
    }

    // get input(s) – depending on the ummlConfig.splitInput option, either...
    var inp;
    if (ummlConfig.splitInput && !input.value.startsWith("<math")) {
        inp = input.value.split("\n");  // ...process each line of input separately...
    } else {
        inp = [input.value];  // ...or treat the entire input as a UnicodeMath expression
    }

    // compile inputs and accumulate outputs
    var m_parse = [];
    var m_preprocess = [];
    var m_transform = [];
    var m_pretty = [];
    var output_HTML = "";
    var output_pegjs_ast_HTML = "";
    var output_preprocess_ast_HTML = "";
    var output_mathml_ast_HTML = "";
    var output_source_HTML = "";
    inp.forEach(val => {

        // ignore empty lines
        if (val.trim() == "") {
            return;
        }

        // tell the user that unicodemath delimiters aren't required if they've
        // used them
        if (val.includes("⁅") || val.includes("⁆")) {
            output_HTML += '<div class="notice">Note that the UnicodeMath delimiters ⁅⋯⁆ you\'ve used in the expression below aren\'t required – ' + (ummlConfig.splitInput? 'each line of the' : 'the entire') + ' input is automatically treated as a UnicodeMath expression.</div>';
        }

        if (!ummlConfig.outputLaTeX) {

            // mathml output
            var mathml, details;
            ({mathml, details} = unicodemathml(val, ummlConfig.displaystyle));
            output_HTML += mathml;
            if (isMathML(input.value)) {
                output_source_HTML = MathMLtoUnicodeMath(input.value);
            } else {
                output_source_HTML += highlightMathML(escapeMathMLSpecialChars(indentMathML(mathml))) + "\n";
            }

            // show parse tree and mathml ast
            if (details["intermediates"]) {
                var pegjs_ast = details["intermediates"]["parse"];
                var preprocess_ast = details["intermediates"]["preprocess"];
                var mathml_ast = details["intermediates"]["transform"];

                output_pegjs_ast_HTML += highlightJson(details["intermediates"]["json"]) + "\n";
                output_preprocess_ast_HTML += highlightJson(preprocess_ast) + "\n";
                output_mathml_ast_HTML += highlightJson(mathml_ast) + "\n";
            }
        } else {

            // LaTeX output
            var latex, details;
            ({latex, details} = unicodemathtex(val, ummlConfig.displaystyle));
            output_HTML += latex;
            output_source_HTML += escapeMathMLSpecialChars(latex) + "\n";

            // show parse tree
            if (details["intermediates"]) {
                var pegjs_ast = details["intermediates"]["parse"];
                var preprocess_ast = details["intermediates"]["preprocess"];

                output_pegjs_ast_HTML += highlightJson(pegjs_ast) + "\n";
                output_preprocess_ast_HTML += highlightJson(preprocess_ast) + "\n";
            }
        }

        // tally measurements
        var extractMeasurement = name => parseInt(details["measurements"][name], 10);
        if (details["measurements"]) {
            m_parse.push(extractMeasurement("parse"));
            m_preprocess.push(extractMeasurement("preprocess"));
            m_transform.push(extractMeasurement("transform"));
            m_pretty.push(extractMeasurement("pretty"));
        }
    });

    // display measurements
    if (!testing) {
        var sum = a => a.reduce((a, b) => a + b, 0);
        measurements_parse.innerHTML = sum(m_parse) + 'ms';
        measurements_preprocess.innerHTML = sum(m_preprocess) + 'ms';
        measurements_transform.innerHTML = sum(m_transform) + 'ms';
        measurements_pretty.innerHTML = sum(m_pretty) + 'ms';
        if (m_parse.length > 1) {
            measurements_parse.title = m_parse.map(m => m + 'ms').join(" + ");
            measurements_preprocess.title = m_preprocess.map(m => m + 'ms').join(" + ");
            measurements_transform.title = m_transform.map(m => m + 'ms').join(" + ");
            measurements_pretty.title = m_pretty.map(m => m + 'ms').join(" + ");
        } else {
            measurements_parse.title = "";
            measurements_preprocess.title = "";
            measurements_transform.title = "";
            measurements_pretty.title = "";
        }
    }

    // write outputs to dom (doing this inside the loop becomes excruciatingly
    // slow when more than a few dozen inputs are present)
    // if mathjax is loaded, tell it to redraw math
    output.innerHTML = output_HTML;
    if (!testing) {
        output_pegjs_ast.innerHTML = output_pegjs_ast_HTML;
        output_preprocess_ast.innerHTML = output_preprocess_ast_HTML;
        output_mathml_ast.innerHTML = output_mathml_ast_HTML;
        output_source.innerHTML = output_source_HTML;
    }

    if (ummlConfig.forceMathJax) {
        try {
            MathJax.typeset([output]);
        }
        catch { }
    }
}

// add a symbol (or string) to history
function addToHistory(symbols) {
    // remove previous occurrences of symbols from history
    hist = hist.filter(s => s != symbols);

    hist.push(symbols);
    localStorage.setItem('history', JSON.stringify(hist));

    displayHistory();
}

function displayHistory() {

    // don't overwhelm the browser
    var historySize = 50;

    //                  ↙ clone array before reversing
    var histo = hist.slice().reverse().slice(0,historySize).map(c => {

        // get tooltip data
        var t = "";
        if (symbolTooltips[c] != undefined && symbolTooltips[c] != "") {
            t = symbolTooltips[c];
        }

        return `<button class="unicode" data-tooltip="${t}">${c}</button>`;
    });
    document.getElementById('history').innerHTML = histo.join('');
}

function setActiveTab(id) {
    if (!document.getElementById(id) || !ummlConfig.debug)
        id = activeTab

    Array.from(document.getElementsByClassName('tab')).map(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    Array.from(document.querySelectorAll(".tabcontent pre")).map(p => p.style.display = "none");
    document.getElementById("output_" + id).style.display = "block";

    window.localStorage.setItem('active_tab', id);
}

$(input).on("change keyup paste", function() {
    draw();
});
$('button.tab').click(function () {
    setActiveTab(this.id);
});

// because the history is updated after page load, which kills any
// previously defined event handlers, we can't simply do
// "$('.button').click(...)"
$(document).on('click', function (e) {
    if ($(e.target).hasClass('unicode')) {
        var str = e.target.innerText;

        if (str.length > 4) {
            // Must be an example. Determine index of example for use with
            // next Alt + Enter hot key
            var x = document.getElementById('Examples').childNodes[0];
            var cExamples = x.childNodes.length;

            for (iExample = 0; iExample < cExamples; iExample++) {
                if (str == x.childNodes[iExample].innerText)
                    break;
            }
            iExample++;
            if (iExample > cExamples)
                iExample = 0;
            input.value = str;
            input.focus();
            draw();
            if (demoID)
                endDemo();
            return;
        }
        addToHistory(e.target.innerText);
        insertAtCursorPos(str);
    }
});

// custom codepoint insertion
$('#codepoint').keypress(function (e) {
    var key = e.which;
    if (key == 13) {  // enter
        $('button#insert_codepoint').click();
    }
});
$('button#insert_codepoint').click(function () {
    var symbol = String.fromCodePoint("0x" + $('#codepoint').val())
    insertAtCursorPos(symbol);
    addToHistory(symbol);
});

// custom control word insertion. call resolveCW() in unicodemathml.js
$('#controlword').keydown(function (e) {
    $('#controlword').css('color', 'black');
});
$('#controlword').keypress(function (e) {
    var key = e.which;
    if (key == 13) {  // enter
        $('button#insert_controlword').click();
    }
});
$('button#insert_controlword').click(function () {
    var cw = $('#controlword').val();
    var symbol = resolveCW(cw);

    if (symbol[0] == '\"') {
        // control word not found; display it as is
        symbol = cw;
    } else {
        addToHistory(symbol);
    }
    insertAtCursorPos(symbol);
});

$('button#insert_dictation').click(function () {
    var dictation = $('#dictation').val();
    try {
        var unicodeMath = dictationToUnicodeMath(dictation);
        insertAtCursorPos(unicodeMath);
    }
    catch {
        alert('Math dictation is unavailable');
    }
});

$('#dictation').keydown(function (e) {
    if (e.key == 'Enter') {
        // Prevent form from being submitted and simulate a click on the
        // dictation button
        e.preventDefault();
        $('button#insert_dictation').click();
    }
});

// math font conversion (mathFonts[] is defined in unicodemathml.js)
$('#mathchar').on("change keyup paste", function (e) {
    $('.mathfont').removeClass("disabled");

    var char = mathchar.value;
    var code = char.codePointAt(0);
    var anCode = '';

    if (code >= 0x2102) {
        [anCode, char] = foldMathAlphanumeric(code, char);
    }
    if (char == "") {
        return;
    }
    code = char.codePointAt(0);
    mathchar.value = char = char.substring(0, code > 0xFFFF ? 2 : 1);  // Max of 1 char

    var fonts;
    try {
        fonts = Object.keys(mathFonts[char]);
    } catch (e) {
        fonts = [];
    }

    $('.mathfont').each(function () {
        if (this.id != 'mup' && !(fonts.includes(this.id))) {
            $(this).addClass("disabled");
        }
    });
});

function getInputSelection() {
    let s = input.selectionStart

    if (s || s == '0') {
        let e = input.selectionEnd
        if (s != e)
            return input.value.substring(s, e)
    }
    return null                             // no selection
}

$('button.mathfont').click(function () {
    var font = this.id;

    var char = $('#mathchar').val();
    if (char != "") {
        var symbol = char;
        if (font != 'mup') {
            try {
                symbol = mathFonts[char][font];
                if (symbol == undefined) {
                    throw undefined;
                }
            } catch (e) {
                return;
            }
        } else {
            // Quote symbol unless selection is inside a quoted string. Note
            // that \mup... should map to mi mathvariant=normal rather than
            // mtext. Probably need an input string parallel to input.value
            // to track this and maybe other properties as in OfficeMath.
            // Also code doesn't currently handle selecting part way into
            // a quoted string.
            var symbolSave = symbol;

            for (var iOff = 0;; ) {
                var iQuote = input.value.indexOf('"', iOff);
                var iQuoteClose = input.value.indexOf('"', iQuote + 1);

                if (iQuote == -1 || iQuoteClose == -1 || iQuote > input.selectionEnd ||
                    input.selectionStart <= iQuote && input.selectionEnd > iQuoteClose) {
                    symbol = '"' + symbol + '"';
                    break;                  // Selection not inside quotes or contains quotes
                }
                if (iQuote == input.selectionStart) {
                    input.selectionStart++; // Move symbol inside quotes
                    break;
                }
                if (iQuote == input.selectionStart - 1)
                    break;                  // Insert symbol inside quotes

                iOff = iQuoteClose + 2;
                if (input.selectionStart >= iOff)
                    continue;               // Selection might be inside a later quoted string

                if (input.selectionEnd == iQuoteClose)
                    break;                  // Insert symbol inside quotes

                if (input.selectionEnd == iQuoteClose + 1) {
                    input.selectionEnd--;   // Move symbol inside quotes
                    break;
                }
            }
        }
        insertAtCursorPos(symbol);
        addToHistory(symbolSave);
    } else if (input.selectionStart != input.selectionEnd) {
        // if no character entered, try converting nondegenerate selection
        var symbols = '';
        var chars = getInputSelection();

        for (var i = 0; i < chars.length; i++) {
            var code = chars.codePointAt(i);
            var ch = chars[i];
            var chFolded = ch;
            var anCode = 0;

            if (code >= 0x2102) {           // Letterlike symbols or beyond
                if (code > 0xFFFF) {
                    ch = chars.substring(i, i + 2);
                    i++;
                }
                [anCode, chFolded] = foldMathAlphanumeric(code, ch);
            }
            if (font == 'mup') {
                symbols += chFolded;
            } else {
                symbols += (chFolded in mathFonts && font in mathFonts[chFolded])
                    ? mathFonts[chFolded][font] : ch;
            }
        }
        insertAtCursorPos(symbols);
        input.selectionStart -= symbols.length;
        input.focus();
        draw();
    }
});

// button tooltips
function showTooltip(x, y, text) {
    if (text != null && text != "") {
        $(document.body).append($('<div class="tooltip" style="left: ' + x + 'px; top: ' + y + 'px;">' + text + '</div>'));
    }
}
function hideTooltip() {
    $(".tooltip").remove();
}
$('button').hover(function (e) {
    var elem = this;
    var x = $(elem).offset().left;
    var y = $(elem).offset().top + $(elem).outerHeight(true) + 1;
    var text = elem.getAttribute("data-tooltip");
    showTooltip(x, y, text);
}, hideTooltip);

$('#codepoints').on('mouseover', '.cp', function (e) {
    var elem = this;
    var x = $(elem).offset().left + 0.3 * $(elem).outerWidth(true);
    var y = $(elem).offset().top + 0.8 * $(elem).outerHeight(true);
    var text = elem.getAttribute("data-tooltip");
    showTooltip(x, y, text);
});
$('#codepoints').on('mouseout', '.cp', hideTooltip);

// explanatory tooltips
$('[data-explanation]').hover(function (e) {
    if (window.innerWidth < 768)            // Hover doesn't work on small devices
        return;
    var elem = this;
    var x = $(elem).offset().left;
    var y = $(elem).offset().top + $(elem).outerHeight(true) + 1;
    var text = elem.getAttribute("data-explanation");
    showTooltip(x, y, text);
}, hideTooltip);

var recognition;
try {
    dictationToUnicodeMath('');             // Fails if dictation.js is unavailable
    initDictation();
}
catch {}

function initDictation() {
    const SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return;
    }
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = function (event) {
        if (event.results.length > 0) {
            var current = event.results[event.results.length - 1][0];
            var result = current.transcript;
            console.log(result);
            result = dictationToUnicodeMath(result);
            var result1 = '';
            var ch = '';
            var chPrev;

            // Convert ASCII and lower-case Greek letters to math italic
            // unless they comprise function names
            for (var i = 0; i < result.length; i++) {
                chPrev = ch;
                ch = result[i];
                if (isLcAscii(ch) || isUcAscii(ch)) {
                    for (var j = i + 1; j < result.length; j++) {
                        if (!isLcAscii(result[j]) && !isUcAscii(result[j]))
                            break;
                    }
                    if (result[j] == '\u2061') { // Function name?
                        result1 += result.substring(i, j);
                    } else {
                        result1 += italicizeCharacters(result.substring(i, j))
                    }
                    i = j - 1;
                } else {
                    ch = italicizeCharacter(ch);     // Might be lc Greek
                    if (ch == result[i]) {           // Isn't
                        if (result.length > i + 1) { // Convert eg '^2 ' to '²'
                            var delim = result.length > i + 2 ? result[i + 2] : ' ';
                            var chScriptDigit = getSubSupDigit(result, i + 1, delim);
                            if (chScriptDigit) {
                                result1 += chScriptDigit;
                                i += (delim == ' ' && result.length > i + 2) ? 2 : 1;
                                continue;
                            }
                        }
                        if (result.length > i + 2 && isAsciiDigit(ch) &&
                            result[i + 1] == '/' && isAsciiDigit(result[i + 2]) &&
                            !isAsciiDigit(chPrev) && (result.length == i + 3 ||
                                !isAsciiDigit(result[i + 3]))) {
                            // Convert, e.g., 1/3 to ⅓
                            ch = getUnicodeFraction(ch, result[i + 2]);
                            i += 2;
                        }
                    }
                    result1 += ch;
                }
            }
            insertAtCursorPos(result1);
        }
    }
    recognition.onerror = function (event) {
        mic.click();
        alert((event.error == 'network') ? 'Not connected to Internet'
            : `Dictation recognition error detected: ${event.error}`);
    }
}

$("#mic").click(function () {
    if (recognition == undefined) {
        alert("dictation recognition API not available");
        return;
    }
    try {
        $(this).removeClass("fa-microphone-slash")
        $(this).addClass("fa-microphone blink")
        recognition.start()
    } catch (error) {
        $(this).removeClass("fa-microphone blink")
        $(this).addClass("fa-microphone-slash")
        recognition.stop() //already started - toggle
    }
})
