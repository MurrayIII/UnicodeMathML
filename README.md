# UnicodeMathML

This repository is a fork of [Noah Doersing's UnicodeMathML repository](https://github.com/doersino/unicodemathml)
with added commits by Murray Sargent III. The changes are summarized at the end of
this document. The facility is discussed in the [help file](./playground/help.html).

The repository provides a JavaScript-based translation of [UnicodeMath](https://www.unicode.org/notes/tn28/)
to [MathML 4.0](https://w3c.github.io/mathml/), hence the name "UnicodeMathML".
In addition, the facility supports dictation, speech, Nemeth braille, and LaTeX.
The interactive [playground](https://MurrayIII.github.io/UnicodeMathML/playground/)
lets you experiment with UnicodeMath, LaTeX, speech, and braille and gives insight
into the translation pipeline.

[UnicodeMath](https://www.unicode.org/notes/tn28/UTN28-PlainTextMath-v3.3.pdf) is a linear
representation of math that often resembles math notation and is easy to enter.
It works well in Microsoft desktop apps such as Word, PowerPoint, Outlook, and
OneNote but it hasn't been widely available elsewhere. See also [Plurimath](https://www.plurimath.org/).

## Methodology
UnicodeMath conversion to MathML starts with parsing the input with a peg grammar,
thereby producing an abstract syntax tree (AST). This AST is then recursively
preprocessed (via preprocess()) to make a new AST with some intent attributes
as well as fix ups not easily accomplished in the grammar parsing.

Originally the idea was to create an AST useful for creating not only MathML,
but also other formats such as LaTeX. But it turned out that creating LaTeX,
speech, and Nemeth braille was more easily accomplished from a MathML DOM.
The AST is then recursively converted into a MathML AST (via mtransform())
with additional intent attributes. The MathML AST is run through a prettifier
(pretty()) eliminating superfluous mrow's and compensating for limitations
in the MathML-Core 4.0 table functionality.

LaTeX, dictation, and Nemeth braille inputs are converted to UnicodeMath,
which is converted, in turn, to MathML. Since LaTeX, speech, and Nemeth
braille outputs are derived from a MathML DOM, a MathML parser would be
needed in node.js environments.

UnicodeMath entered into the output window, i.e., in-place editing, is handled
by autobuildup routines that manipulate the MathML DOM.

## Testing
There are two test pages: ./dist/example.html and ./test/MmlToUM.html used to
test conversions and UI behavior.

**example.html** contains text with myriad UnicodeMath or LaTeX math zones that
are converted to MathML and compared to known results. The tests pass if the
console reports 0 failures.

**MmlToUM.html** has a set of buttons for testing UI behavior and conversions
other than UnicodeMath/LaTeX to MathML. Clicking on the buttons runs the tests
and the results are reported in the console window.

Although there are many tests, they are not exhaustive. They sure help
in preventing regressions.

## Integration
Search the [npm registry](https://www.npmjs.com/) for "unicodemathml".
The README.md of the [unicodemathml package](https://www.npmjs.com/package/unicodemathml)
explains how to make three kinds of conversions of UnicodeMath to MathML.

- convert a UnicodeMath string to MathML
- convert UnicodeMath math zones embedded in text to MathML
- convert UnicodeMath math zones embedded in markdown into markdown-it tokens (markdown-it then produces HTML with the corresponding MathML).

Use version 1.0.6 or higher.

## License
You may use this repository's contents under the terms of the [MIT License](https://en.wikipedia.org/wiki/MIT_License).

However, the subdirectories `lib/` and `playground/assets/lib/` contain some **third-party software with its own licenses**:

* The parser generator [PEG.js](https://github.com/pegjs/pegjs), a copy of which is located at `lib/peg-0.10.0.min.js`, is licensed under the *MIT License*, see [here](https://github.com/pegjs/pegjs/blob/master/LICENSE).
* [JQuery](https://jquery.com), which powers some of the interactions in the UnicodeMathML playground and resides at `playground/assets/lib/jquery.min.js`, is licensed under the *MIT License*, see [here](https://jquery.org/license/).
* [LM Math](http://www.gust.org.pl/projects/e-foundry/lm-math/download/index_html), the typeface used for rendered UnicodeMath expressions in the playground in browsers with native MathML support, can be found at `playground/assets/lib/latinmodern/` and is licensed under the *GUST Font License*, see [here](http://www.gust.org.pl/projects/e-foundry/licenses/GUST-FONT-LICENSE.txt/view).
* Belleve Invis' excellent typeface [Iosevka](https://github.com/be5invis/Iosevka) is located at `playground/assets/lib/iosevka/` and licensed under the *SIL OFL Version 1.1*, see [here](https://github.com/be5invis/Iosevka/blob/master/LICENSE.md).

Lastly, Noah Doersing's Master's thesis is located at `docs/doersing-unicodemath-to-mathml.pdf`and is included in this repository as a reference for some implementation details.
It's not intended (or relevant) for general distribution.

## Changes in this forked version
Murray Sargent's forked version is located at https://github.com/MurrayIII/UnicodeMathML/tree/main.

* For UnicodeMath input, all ASCII letters and Greek lower-case letters are converted to math italic unless they comprise a mathematical function name, e.g., a trigonometric function, are quoted, or are in an unrecognized control word.
* The subscript and superscript operators apply to the variable or enclosed expression that immediately precedes them. For example, in “𝐸=𝑚𝑐^2”, the base of the superscript object is “𝑐”, not “𝑚𝑐”.
* The integrand can be attached to the integral via a space or the “glue” operator ▒.
* The trigonometric function names are defined by the expression
       'a'? ['sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot'] 'h'?
* The four \rect border flags are fixed (needed to be inverted).
* Display mode n-ary operators are changed to <​munderover> instead of <​msubsup>, except for integrals.
* The default math functions are converted with or without the function-apply operator U+2061.
* A thin space is inserted in front of differential d or D only if it is preceded by one or more letters in the same run. Ideally the thin space should be added by the display engine along with the choice of math style (math italic, upright, double-struck italic) instead of by the converter. The MathML would then retain the original semantics.
* Instead of displaying a large error message for a syntatically incorrect operator, display the operator in red. The user may be entering the whole expression and doesn't want to see an error message, but might like a hint that the syntax is wrong. For example, display “(a^2+” as “<span style="color:red">(</span>𝑎² +” with '(' in red instead of an error message.
* The operator sequence /" isn't treated as a negated quote. Else "distance"/"time" won't convert into a fraction.
* Upgrade to MathJax 4, which is noticably faster than MathJax 2.7.5 and doesn't flash an intermediate display.
* Replace all var declarations by set or const unless they are currently needed globally

## New features
* The identity matrix and n×m matrix short cuts are implemented.
* MathML tests are added to example.html with results displayed in the console.
* The Playground calls resolveCW() defined in unicodemathml.js to resolve control words instead of having a duplicate control-word list. Similarly to convert characters to math styles, the Playground uses the mathFonts[] defined in unicodemathml.js. Greek upper-case letters that look like ASCII letters are removed from the Greek letter gallery and Greek lower-case letter variants are added. 
* An autocomplete menu appears when a control word is entered partially. The user can use up/down arrows to select the desired control word and enter it by typing Enter, Tab, or a space. The most common choice is highlighted by default. Selected options are spoken.
* Control words and operator combinations typed into the Playground input text area are autocorrected there as well as in the output window.
* Variables are displayed in math italic in the Playground input as well as in the output.
* Many more LaTeX control words are included. \pmatrix, \bmatrix, \Bmatrix, \nmatrix, \vmatrix, \cancel, \bcancel, and \xcancel are implemented. Unicode LaTeX math alphanumeric control words like \mitX for 𝑥 are supported.
* Math dictation in English is supported
* In dictation input, ASCII letters and lower-case Greek letters are converted to math italic unless they comprise a function name, simple digit subscripts and superscripts are converted to the corresponding Unicode characters, ane three-character numeric fractions are converted to Unicode fractions. Negated operators like /= are converted (/= → ≠) along with various operator pairs such as +- → ±. ASCII - and ' are converted to Unicode minus (U+2212) and prime (U+2032), respectively.
* Most symbols in the Playground galleries have LaTeX control-word tooltips.
* Alt+x hex-to-Unicode (and vice versa) hot key is implemented in the Playground input and output windows. The Ctrl+b hot key toggles the selected characters between math bold and not math bold. Similarly, the Ctrl+i hot key toggles the selected characters between math italic and not math italic.
* AST (abstract syntax tree) tabs appear only in _debug_ mode and only on screens wider than 786 pixels. The display changes to accomodate small screens, such as on mobile phones.
* The class "unicodemath" and xmlns attributes are omitted on the <​math> tag. MathML and AST-tab indenting doesn't break a line between adjacent closing tags, thereby conserving screen height.
* The symbol sets are collected into tabbed arrays with one set displayed at a time.
* The new UnicodeMath transpose syntax <​base>^⊺ and ^⊺ <​base>, where ⊺ is U+22BA (\intercal), is implemented.
* Settings options to define the display characters for ⅅⅆⅇⅈⅉ and ⊺.
* The Alt+Enter hot key and Demo mode cycle through the Examples. The space key pauses/resumes the Demo mode. When paused, the left/right arrow key displays the previous/next equation. Clicking on the Demo button starts/stops the demo mode.
* Pasting MathML into the input text area passes the MathML to the renderer, and converts the MathML to UnicodeMath, which it displays in the MathML output window.
* Unicode numeric fractions like ⁵⁶/₆₂₅ are converted into 2D inline fractions.
* Math speech is added with support for some intent attributes, e.g., derivatives, n-ary elements, and intervals.
* Nemeth math braille output is supported by a Braille menu button and by Alt+b
* Nemeth math braille input is enabled in the input window if the first character is in the Unicode braille block (U+2800..U+28FF). Type ASCII braille or paste Unicode-braille-block text. The braille generated by the Alt+b hot key is Unicode braille and can be copied with Ctrl+c. To start entering braille into an empty input window, paste braille or type 2800 Alt+x, which enters a braille space (U+2800).
* Unicode TeX output is supported by a TeX menu button and by Alt+t
* In-place editing and formula autobuildup is supported in the output window provided native MathML rendering is active (not MathJax). The typography is not up to MathJax and the UI needs more polishing.
* The input and output windows have multilevel undo executed by Ctrl+z. Input window has redo executed by Ctrl+y.
* Edit-selection enclosure operators (Ⓐ for anchor, Ⓕ for focus) have been added to UnicodeMath that map to the MathML selection attributes selanchor and selfocus. This enables the current output-window selection to be represented and undone. Selection attributes are needed for accessible editing and for the output undo facility which represents previous editing states using a stack of UnicodeMath strings.
* Formula autobuild-up tests have been added in testmml.js
* Ctrl+c and Ctrl+x copy MathML for selected output-window nodes to the clipboard. Ctrl+x then deletes the selection. If the selection is collapsed (insertion point), the whole math zone is copied. The result can be pasted into Word via Ctrl+v. For the most faithful copy into Word, use Ctrl+Shift+c, which creates MathML that Word understands better, e.g., uses mfenced instead of an mrow. If the MathJax display mode is enabled, only Ctrl+c is supported and it copies MathML for the whole math zone.
* Ctrl+v pastes MathML (in text/plain slot) at the current output-window selection
* Initial drag and drop capability copies the current output-window selection to the drop target
* Help button launches a help page
* Shade MathML argument containing the insertion point
* Eliminate more superfluous mrows and support mrow-like elements, such as math and msqrt, with multiple children without an enclosing mrow
* Implement a Tab hierarchy for Tab navigation since there are myriad default tab stops
* Support roundhand and chancery scripts using STIX Two Math with stylistic sets ss01 and ss00.
* Support simplified OfficeMath math paragraph using an mtable
* Support Arabic math alphabetics and limited RTL math display
* Support inputting a subset of [La]TeX including macros with arguments
* Add mathclass and braille to symbol tooltips
* Facilitate entry of LaTeX and MathML by autocorrecting non-build-up control words to their Unicode symbols and converting some operator combinations to Unicode operators.

## MathML intent-attribute support:
* Derivative and partial-derivative intent attributes are defined for Leipzig and Euler derivative notations.
* The templates […,…], […,…[, ]…,…], and ]…,…[, produce closed-interval, closed-open-interval, open-closed-interval, and open-interval structures, respectively, each including the intent attribute with the interval name and arguments. The … can be a signed number, variable name or ∞. Similarly, the templates (…,…], and […,…) also produce open-closed-interval and closed-open-interval structures with the corresponding intent attribute values. The template (…,…) isn't given an intent attribute since it can be used for a math-function argument list or a point in a 2D plane.
* The \intent (ⓘ) and \arg (ⓐ) options are defined for enclosures, factorials, fences, atoms, sub/superscripts, and other expressions, thereby enabling the user to add intents explicitly to these constructs.
* \abs for unambiguous entry of absolute value with the absolute-value intent attribute. \choose along with its intent attribute (binomial-coefficient). Intent attributes are included for UnicodeMath equation arrays, matrices, and determinants.
* Default intents are defined for \abs, \choose, \cases, fences, n-ary objects, math-function objects, transpose objects, and double-struck italic symbols like differential d (ⅆ). This improves MathML readablity and supports round-tripping these concepts via MathML.
* Context menu for user to add intents in output window.
