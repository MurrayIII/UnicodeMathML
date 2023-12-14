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
var hist = [];
var iExample = 0;

var prevInputValue = "";

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

const digitSuperscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const digitSubscripts = "₀₁₂₃₄₅₆₇₈₉";

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

function hexToUnicode() {
    var cchSel = input.selectionEnd - input.selectionStart;
    if (cchSel > 10)
        return;
    var cch = cchSel ? cchSel : 10;         // 10 is enough for 5 surrogate pairs
    var n = GetCodePoint(input.selectionEnd, cch);
    var ch = '';

    if (n < 0x20 || n > 0x10FFFF) {
        if (n || cchSel)
            return;
        // Convert ch to hex str. Sadly code.toString(16) only works correctly
        // for code <= 0xFFFF
        var n = codeAt(input.value, input.selectionEnd - 1);
        input.selectionStart--;
        if (n <= 0xFFFF) {               // toString truncates larger values
            ch = n.toString(16);
        } else {
            input.selectionStart--;
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
            if (isTrailSurrogate(n) && input.selectionStart > 5) {
                var chPrev = input.value[input.selectionStart - 1];
                if (chPrev == ' ' || chPrev == ',') {
                    var m = GetCodePoint(input.selectionStart - 1, 8);
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
    input.value = input.value.substring(0, input.selectionStart) + ch +
        input.value.substring(input.selectionEnd);
}

function boldItalicToggle(key) {
    // Get current bold and italic states from first char in selection
    var chars = getInputSelection();
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
    insertAtCursorPos(symbols);
    input.selectionStart -= symbols.length;
    input.focus();
    draw();
}

function isTrailSurrogate(code) { return code >= 0xDC00 && code <= 0xDFFF; }
function isLeadSurrogate(code) { return code >= 0xD800 && code <= 0xDBFF; }

function GetCodePoint(i, cch) {
    // Code point for hex string of length cch in input.value ending at offset i
    if (cch > i)
        cch = i;
    if (cch < 2)
        return 0;

    var cchCh = 1;
    var cchChPrev = 1;
    var code = 0;
    var n = 0;                              // Accumulates code point

    for (var j = 0; cch > 0; j += 4, cch--) {
        code = input.value.codePointAt(i - 1);
        cchCh = 1;
        if (code < 0x0030)
            break;                          // Not a hexadigit

        if (isTrailSurrogate(code)) {
            code = input.value.codePointAt(i - 2);
            if (code < 0x1D434 || code > 0x1D467)
                break;                      // Surrogate pair isn't math italic
            code -= code >= 0x1D44E ? (0x1D44E - 0x0061) : (0x1D434 - 0x0061);
            cch--;
            cchCh = 2;
        }
        code |= 0x0020;                     // Convert to lower case (if ASCII uc letter)
        if (code >= 0x0061)                 // Map lower-case ASCII letter
            code -= 0x0061 - 0x003A;        //  to hex digit
        code -= 0x0030;                     // Convert hex digit to binary number
        if (code > 15)
            break;                          // Not a hexadigit
        n += code << j;					    // Shift left & add in binary hex
        i -= cchCh;
        cchChPrev = cchCh;
    }
    if (n < 16 && cchChPrev == 2)
        n = 0;                              // Set up converting single 𝑎...𝑓 to hex
    if (n)
        input.selectionStart = i;
    return n;
}

function codeAt(chars, i) {
    // Get UTF-32 code of character at position i, where i can be at a
    // trail surrogate
    var code = chars.codePointAt(i);
    if (code >= 0xDC00 && code <= 0xDFFF)
        code = chars.codePointAt(i - 1);
    return code;
}

function closeAutocompleteList() {
    var x = document.getElementsByClassName("autocomplete-items");
    if (x == undefined) return;

    var cItem = x.length;

    for (var i = 0; i < cItem; i++) {
        x[i].parentNode.removeChild(x[i]);
    }
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

    if (!'_^'.includes(op) || !'+-= )]}'.includes(delim) || !/[0-9]/.test(ch))
        return '';

    // If the preceding op is the other subsup op, return '', e.g., for a_0^2
    var opSupSub = op == '^' ? '_' : '^';

    for (var j = i - 2; j > 0; j--) {
        if (str[j] == opSupSub)
            return '';
        if (str[j] < '\u3017' && !isAsciiAlphanumeric(str[j]))
            break;                          // Could allow other letters...
    }
    if (j == i - 2)
        return '';                          // No base character(s)

    return (op == '^') ? digitSuperscripts[ch] : digitSubscripts[ch];
}

function opAutocorrect(i, ip, delim) {
    // Perform operator autocorrections like '+-' → '±' and '/=' → ≠
    if (input.value[i] == '"')
        return false;

    if (input.value[i] == '/' && delim in negs) {
        input.value = input.value.substring(0, i) + negs[delim] + input.value.substring(ip);
        input.selectionStart = input.selectionEnd = ip - 1;
        return false;
    }

    if (i == ip - 2 && ip > 4) {
        // Convert span of math-italic characters to ASCII
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
    return false;
}

// Symbols whose autocomplete options should be selected by default
var commonSymbols = "αβδθλχϕϵ⁡←√∞⒨■"; // 03B1 03B2 03B4 03B8 03BB 03C7 03D5 03F5 2061 2190 221A 221E 24A8 25A0
function autocomplete() {
    var currentFocus = -1;
    // Try autocorrecting or autocompleting a control word when user
    // modifies text input
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
            (!i || input.value.substring(i - 1, i + 1) != '✎(')) {
            // Not control word; check for italicization & operator autocorrect
            var ch = italicizeCharacter(delim);
            if (ch != delim) {
                // Change ASCII or lower-case Greek letter to math-italic letter
                input.value = input.value.substring(0, ip - 1) + ch + input.value.substring(ip);
                if (ch.length > 1) { ip++; } // Bypass trail surrogate
                input.selectionStart = input.selectionEnd = ip;
                return false;
            }
            return opAutocorrect(i, ip, delim);
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

        var cw = input.value.substring(i + 1, ip);
        var matches = getPartialMatches(cw);
        if (!matches.length) return;

        // Create autocomplete menu of control-word partial matches. Start
        // by creating a <div> element to contain matching control words
        currentFocus = -1;
        var autocl = document.createElement("div");
        autocl.setAttribute("id", this.id + "autocomplete-list");
        autocl.setAttribute("class", "autocomplete-items");

        // Append div element as a child of the autocomplete container
        this.parentNode.appendChild(autocl);

        // Create a div element for each matching control word
        for (var j = 0; j < matches.length; j++) {
            var b = document.createElement("div");
            var cwOption = matches[j];

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
            b.addEventListener("click", function (e) {
                // Insert control-word symbol 
                var val = this.getElementsByTagName("input")[0].value;
                var ch = italicizeCharacter(val[val.length - 1]);
                var code = ch.codePointAt(0);
                input.value = input.value.substring(0, i) + ch + input.value.substring(ip);
                ip = i + (code > 0xFFFF ? 2 : 1);
                input.selectionStart = input.selectionEnd = ip;
                if (code >= 0x2061 && code <= 0x2C00)
                    opAutocorrect(ip - 2, ip, ch);
                closeAutocompleteList();
            });
            autocl.appendChild(b);
        }
        if (currentFocus == -1) {
            // No common control-word option identified: highlight first option
            currentFocus = 0;
            autocl.firstChild.classList.add("autocomplete-active");
        }
    });

    input.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (!x) {                           // Target is input
            if (e.key == 'x' && e.altKey) {
                e.preventDefault();
                hexToUnicode();
            } else if (e.ctrlKey && (e.key == 'b' || e.key == 'i')) {
                e.preventDefault();
                boldItalicToggle(e.key);
            } else if (e.shiftKey && e.key == 'Enter') {
                //e.preventDefault();
                insertAtCursorPos('\u200B');
            } else if (e.altKey && e.key == 'Enter') {
                // Enter Examples[iExample]
                x = document.getElementById('Examples').childNodes[0];
                input.value = x.childNodes[iExample].innerText;
                var cExamples = x.childNodes.length;

                iExample++;                 // Increment for next time
                if (iExample > cExamples - 1)
                    iExample = 0;
            }
            return;
        }
        x = x.getElementsByTagName("div");

        switch (e.key) {
            case "ArrowDown":
                // Increase currentFocus and highlight the corresponding control-word
                e.preventDefault();
                currentFocus++;
                addActive(x);
                break;

            case "ArrowUp":
                // Decrease currentFocus and highlight the corresponding control-word
                e.preventDefault();
                currentFocus--;
                addActive(x);
                break;

            case " ":
            case "Enter":
            case "Tab":
                // Prevent form from being submitted and simulate a click on the
                // "active" control-word option
                e.preventDefault();
                if (currentFocus >= 0 && x) {
                    x[currentFocus].click();
                }
        }
    });
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
}

function checkResize() {
    var h = document.getElementsByTagName('h1');
    var heading = document.getElementById("heading");

    if (window.innerWidth < 768) {
        heading.innerHTML = 'UnicodeMathML<br><em>𝐏𝓁𝔞𝚢𝗴𝑟𝖔𝓊𝙣𝕕</em><br>';
        h[0].style.textAlign = 'center';
        h[0].style.width = '100%';
    } else {
        heading.innerHTML = 'UnicodeMathML <em>𝐏𝓁𝔞𝚢𝗴𝑟𝖔𝓊𝙣𝕕 </em>';
        h[0].style.textAlign = 'left';
    }
}

checkResize();

if (window.innerWidth < 768 || !ummlConfig.debug) {
    // Suppress AST tabs for mobile devices
    var tabs = document.getElementsByClassName('tabs');
    tabs[0].style.display = "none";
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

// Enable autocorrect and autocomplete
autocomplete();

// compile and draw mathml code from input field
async function draw() {

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
    codepoints.innerHTML = "";
    if (ummlConfig.tracing) {
        output_trace.innerHTML = "";
    }
    //output.classList.add("hideAll");

    // if the input field is empty (as it is in the beginning), avoid doing much
    // with its contents
    if (input.value == "") {
        output.innerHTML = "";
        output_pegjs_ast.innerHTML = "";
        output_preprocess_ast.innerHTML = "";
        output_mathml_ast.innerHTML = "";
        output_source.innerHTML = "";
        measurements_parse.innerHTML = "";
        measurements_transform.innerHTML = "";
        measurements_pretty.innerHTML = "";
        measurements_parse.title = "";
        measurements_transform.title = "";
        measurements_pretty.title = "";
        window.localStorage.setItem('unicodemath', "");
        closeAutocompleteList();
        prevInputValue = "";
        return;
    }

    prevInputValue = input.value;

    // display code points corresponding to the characters
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
        if (symbolTooltips[c] != undefined && symbolTooltips[c] != "") {
            tooltip = symbolTooltips[c] + "<hr>" + tooltip;
        }

        codepoints_HTML += '<div class="cp' + (invisibleChar ? ' invisible-char' : '') + '" data-tooltip="' + tooltip + '"><div class="p">' + cp + '</div><div class="c">' + c + '</div></div>'

        if (c == "\n") {
            codepoints_HTML += "<br>";
        }
    });
    codepoints.innerHTML = codepoints_HTML;

    // update local storage
    window.localStorage.setItem('unicodemath', input.value.replace(/\n\r?/g, 'LINEBREAK'));

    // get input(s) – depending on the ummlConfig.splitInput option, either...
    var inp;
    if (ummlConfig.splitInput) {
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
            output_source_HTML += highlightMathML(escapeMathMLSpecialChars(indentMathML(mathml))) + "\n";

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

    // write outputs to dom (doing this inside the loop becomes excruciatingly
    // slow when more than a few dozen inputs are present)
    // if mathjax is loaded, tell it to redraw math
    output.innerHTML = output_HTML;
    output_pegjs_ast.innerHTML = output_pegjs_ast_HTML;
    output_preprocess_ast.innerHTML = output_preprocess_ast_HTML;
    output_mathml_ast.innerHTML = output_mathml_ast_HTML;
    output_source.innerHTML = output_source_HTML;

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
    if (!document.getElementById(id)) {
        id = activeTab;
    }

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

// insert one or multiple characters at the current cursor position of
// the input field or, if there is no cursor, append them to its value,
// via https://stackoverflow.com/a/11077016
function insertAtCursorPos(symbols) {
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
            str += '\n';                    // Add new line after an example
       } else {
            addToHistory(e.target.innerText);
        }
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
    if (input.selectionStart || input.selectionStart == '0') {
        var s = input.selectionStart;
        var e = input.selectionEnd;
        if (s == e) {
            return null;  // no selection
        } else {
            return input.value.substring(s, e);
        }
    } else {
        return null;  // no selection
    }
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

            if (code >= 0x2102) {                // Letterlike symbols or beyond
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

function isLcAscii(ch) { return /[a-z]/.test(ch); }

function isUcAscii(ch) { return /[A-Z]/.test(ch); }

function isAsciiDigit(ch) { return /[0-9]/.test(ch); }

function isAsciiAlphanumeric(ch) { return /[\w]/.test(ch); }

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
