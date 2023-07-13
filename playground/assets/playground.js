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

var prevInputValue = "";

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
    var formatted = '', indent= '';
    str.split(/>\s*</).forEach(node => {
        if (node.match( /^\/\w/ )) indent = indent.substring(2);
        formatted += indent + '<' + node + '>\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += '  ';
    });
    return formatted.substring(1, formatted.length-2);
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

// via https://stackoverflow.com/a/7220510
function highlightJson(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = escapeMathMLSpecialChars(json);
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

function closeAutocompleteList() {
    var x = document.getElementsByClassName("autocomplete-items");
    if (x == undefined)
        return;

    var cItem = x.length;

    for (var i = 0; i < cItem; i++) {
        x[i].parentNode.removeChild(x[i]);
    }
}

function autocomplete() {
    var currentFocus = -1;
    // execute a function when someone writes in text field
    input.addEventListener("input", function (e) {
        var a, b, i;
        // close any open lists of autocompleted values
        closeAutocompleteList();
        var cch = input.value.length;
        if (cch <= 2) return false;
        var delim = input.value[cch - 1];
        i = cch - 2;

        while (i > 0 && /[a-zA-Z0-9]/.test(input.value[i])) {
            i--;                            // move back alphanumeric span
        }
        if (i < 0 || input.value[i] != '\\') return;

        if (!/[a-zA-Z0-9]/.test(delim)) {
            // delimiter entered: try to autocorrect control word
            var symbol = resolveCW(input.value.substr(i, cch - i - 1));
            if (symbol[0] != '\"') {
                if (delim == " ") {
                    delim = "";
                }
                input.value = input.value.substr(0, i) + symbol + delim;
            }
            return;
        }
        if (cch - i < 2) return;
        var cw = input.value.substr(i + 1, cch - i);
        var matches = getPartialMatches(cw);
        if (!matches.length) return;
        console.log("Partial matches: " + matches);

        // display autocomplete menu of partial matches

        currentFocus = -1;
        // create DIV element to contain matching control words
        var autocl = document.createElement("DIV");
        autocl.setAttribute("id", this.id + "autocomplete-list");
        autocl.setAttribute("class", "autocomplete-items");
        // append DIV element as a child of autocomplete container
        this.parentNode.appendChild(autocl);

        // create a DIV element for each matching element
        for (i = 0; i < matches.length; i++) {
            b = document.createElement("DIV");
            // bold the matching letters
            b.innerHTML = "<strong>" + matches[i].substr(0, cw.length) + "</strong>";
            b.innerHTML += matches[i].substr(cw.length);
            // insert an input field to hold the current control word and symbol
            b.innerHTML += "<input type='hidden' value='" + matches[i] + "'>";

            // execute a function when someone clicks on the item value (DIV element)
            b.addEventListener("click", function (e) {
                // insert the control-word symbol 
                var val = this.getElementsByTagName("input")[0].value;
                var i = input.value.lastIndexOf("\\");
                input.value = input.value.substr(0, i) + val[val.length - 1];
                // close the list of autocompleted values (and any other
                // open lists of autocompleted values)
                closeAutocompleteList();
                draw();
            });
            autocl.appendChild(b);
        }
    });
    // execute a function when user presses a key on the keyboard
    input.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (!x) return;
        x = x.getElementsByTagName("div");

        switch (e.keyCode) {
        case 40:
            // Arrow DOWN key pressed: increase currentFocus and make the
            // current item more visible
            currentFocus++;
            addActive(x);
            break;

        case 38:
            // Arrow UP key pressed: decrease currentFocus and make the
            // current item more visible
            currentFocus--;
            addActive(x);
            break;

        case 13:
        case 9:
            // ENTER or TAB key pressed: prevent form from being submitted
            // and simulate a click on the "active" item
            e.preventDefault();
            if (currentFocus > -1 && x) {
                x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        // function to classify an item as "active"
        if (!x) return false;
        // start by removing the "active" class on all items
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        // add class "autocomplete-active"
        console.log("x[" + currentFocus + "] = " + x[currentFocus].innerText);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        // function to remove the "active" class from all autocomplete items
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        // Close all autocomplete lists in the document except elmnt
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    // Execute a function when user clicks in the document
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// only use mathjax where mathml is not natively supported (i.e.
// anything but firefox and safari)
function browserIs(candidate) {
    return navigator.userAgent.toLowerCase().includes(candidate);
}
var loadMathJax = ummlConfig.outputLaTeX || ummlConfig.forceMathJax || !(browserIs('firefox') || (browserIs('safari') && !browserIs('chrome')));
if (loadMathJax) {
    document.write("<script src=\"assets/lib/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG\"></scr" + "ipt>");
}

// if latex output is enabled, hide AST tab (since there is no LaTeX AST) and
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
            "0009",
            "000A",
            "000B",
            "000C",
            "000D",
            "0020",
            "0085",
            "00A0",
            "1680",
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "200A",
            "200B",
            "2028",
            "2029",
            "202F",
            "205F",
            "3000",
            "180E",
            "200B",
            "200C",
            "200D",
            "200E",
            "202A",
            "202C",
            "202D",
            "2060",
            "2061",
            "2062",
            "2063",
            "2064",
            "2800",
            "FEFF",
            ].includes(cp);

        // lookup unicode data for tooltip
        var tooltip = "";
        if (typeof getCodepointData === "function") {
            try {
                var cpd = getCodepointData(cp);
                tooltip = `<b>name</b> ${cpd["name"].replace("<", "&amp;lt;").replace(">", "&amp;gt;")}<br><b>block</b> ${cpd["block"]}<br><b>category</b> ${cpd["category"]}`;
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

    // clear old results
    output.innerHTML = "";
    output_pegjs_ast.innerHTML = "";
    output_preprocess_ast.innerHTML = "";
    output_mathml_ast.innerHTML = "";
    output_source.innerHTML = "";

    // get input(s) – depending on the ummlConfig.splitInput option, either...
    var inp;
    if (ummlConfig.splitInput) {
        inp = input.value.split("\n");  // ...process each line of input seperately...
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

                output_pegjs_ast_HTML += highlightJson(pegjs_ast) + "\n";
                output_preprocess_ast_HTML += highlightJson(preprocess_ast) + "\n";
                output_mathml_ast_HTML += highlightJson(JSON.stringify(mathml_ast, null, 2)) + "\n";
            }
        } else {

            // latex output
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

    // write outputs to dom (doing this inside the loop becomes excruciatingly
    // slow when more than a few dozen inputs are present)
    output.innerHTML = output_HTML;
    output_pegjs_ast.innerHTML = output_pegjs_ast_HTML;
    output_preprocess_ast.innerHTML = output_preprocess_ast_HTML;
    output_mathml_ast.innerHTML = output_mathml_ast_HTML;
    output_source.innerHTML = output_source_HTML;

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

    // if mathjax is loaded, tell it to redraw math
    if (loadMathJax && typeof MathJax != "undefined") {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, output]);
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
        input.selectionStart = startPos + symbols.length;
        input.selectionEnd = startPos + symbols.length;
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
        insertAtCursorPos(e.target.innerText);
        addToHistory(e.target.innerText);
    } else if ($(e.target).hasClass('example')) {
        insertAtCursorPos(e.target.innerText);
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

// math font conversion (mathFonts[] is defined in unicodemathml.js)
$('#mathchar').keyup(function (e) {
    $('.mathfont').removeClass("disabled");

    var char = $('#mathchar').val();
    if (char == "") {
        return;
    }
    var fonts;
    try {
        fonts = Object.keys(mathFonts[char]);
    } catch (e) {
        fonts = [];
    }

    $('.mathfont').each(function () {
        if (!(fonts.includes(this.id))) {
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
        var symbol;
        try {
            symbol = mathFonts[char][font];
            if (symbol == undefined) {
                throw undefined;
            }
        } catch (e) {
            return;
        }
        insertAtCursorPos(symbol);
        addToHistory(symbol);
    } else if (getInputSelection() != null) {  // if no character entered, try converting
        var symbols = [];
        Array.from(getInputSelection()).forEach(char => {

            // also convert the current character if it already has been
            // converted to something previously – i.e. look to which "base
            // char" it corresponds to, and modify the char variable
            // accordingly
            Object.keys(mathFonts).forEach(base => {
                Object.values(mathFonts[base]).forEach(sym => {
                    if (char == sym) {
                        char = base;
                    }
                });
            });

            var symbol;
            try {
                symbol = mathFonts[char][font];
                if (symbol == undefined) {
                    throw undefined;
                }
            } catch (e) {
                symbol = char;
            }
            symbols.push(symbol);
        });
        insertAtCursorPos(symbols.join(""));
        input.focus();
        draw();
    } else {
        // nothing to be done
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
    var elem = this;
    var x = $(elem).offset().left;
    var y = $(elem).offset().top + $(elem).outerHeight(true) + 1;
    var text = elem.getAttribute("data-explanation");
    showTooltip(x, y, text);
}, hideTooltip);
