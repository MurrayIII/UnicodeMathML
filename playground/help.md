﻿# Welcome to UnicodeMathML
[UnicodeMath](https://www.unicode.org/notes/tn28/UTN28-PlainTextMath-v3.2.pdf) is a linear representation of math that often resembles math notation and is easy to enter.
For example, a/b is UnicodeMath for <math><mrow><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>.</mo></mrow></math>
It works well in Microsoft desktop apps such as Word, PowerPoint, Outlook, and OneNote but it hasn't been generally available elsewhere.
The present applet implements UnicodeMath on the web and is open source.

You can enter equations in four ways:
1. Enter UnicodeMath in the input (upper-left) window. The corresponding 2D built-up math displays in the output (upper-right) window and the [MathML](https://w3c.github.io/mathml/) for it displays below the output window. This option is quite reliable.
2. Enter UnicodeMath directly into the output window. This option builds up what you enter automatically, similarly to entry in the Microsoft Office apps. This option is a work in progress.
3. Click on the Dictate button or type Alt+d, wait for the bell, and dictate the equation in English. You need to have Internet access, and you need to enunciate clearly. This option is also a work in progress but if you get it to work it’s the fastest entry method except for:
4. Paste MathML into the input or output window.

## See it in action
Click on the Demo button or type Alt+p in the input window to see it in action!
Hit the space bar to pause the demo and hit it again to continue the demo.
The arrow keys → and ← move to the next/previous equation, respectively.
Escape and Alt+p stop the demo. One of the equations has the UnicodeMath 1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²), which builds up to

<math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mn>1</mn><mrow><mn>2</mn><mi>𝜋</mi></mrow></mfrac><mrow intent=":integral(0,$h,$naryand)"><msubsup><mo>∫</mo><mn>0</mn><mrow arg="h"><mn>2</mn><mi>𝜋</mi></mrow></msubsup><mfrac arg="naryand"><mrow><mi intent="ⅆ">𝑑</mi><mi>𝜃</mi></mrow><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi><mrow intent=":function"><mi>sin</mi><mo>⁡</mo><mi>𝜃</mi></mrow></mrow></mfrac></mrow><mo>=</mo><mfrac><mn>1</mn><msqrt><mrow><msup><mi>𝑎</mi><mn>2</mn></msup><mo>−</mo><msup><mi>𝑏</mi><mn>2</mn></msup></mrow></msqrt></mfrac></mrow></math>

## Entering symbols
You can enter a symbol by clicking on the symbol in one of the symbol galleries below the input window.
But it’s faster to type the symbol’s LaTeX control word such as \alpha for α.
After typing two letters, you get a math autocomplete dropdown with possible matches.
This lets you enter the selected symbol (the one highlighted in blue) quickly by typing a space, Enter, or Tab.
I use the space key since it’s so convenient.

For example, if you type \al, you see

<img src="help-images/autocl.png" style="display: block; 
           margin-left: auto; margin-right: auto;
           width: 80%;"/>
 
Typing the space, Enter, or Tab key inserts 𝛼.
If you want a different symbol in the dropdown, use the up/down (↑↓) arrow keys or the mouse to select the symbol you want and type the space, Enter, or Tab key, or click to enter it.

The math autocomplete menu helps you discover a LaTeX control word, and it speeds entry especially for long control words such as those in the dropdown

<img src="help-images/autocllong.png" style="display: block; 
           margin-left: auto; margin-right: auto;
           width: 80%;"/>

The symbol dictionary includes some control-word aliases, such as \union for \cup (∪), since you might not guess \cup is the LaTeX control word for the union operator ∪.

## Character code points
Below the input window, there’s a Unicode codepoint window that displays the codepoints of the input symbols above the symbols.
This is particularly useful for comparing two strings that appear to be identical but differ in one or more characters.
Both the input and output windows support the Alt+x symbol entry method popular in Microsoft Word, OneNote, and NotePad.
(It should be supported in all editors 😊).
For example, type 222b Alt+x to insert ∫.

## Speech, braille, LaTeX, dictation
In addition to generating MathML, you can click on buttons or enter a hot key to
* Speak the math in English (Alt+s)
* Braille the math in Nemeth  braille (Alt+b)
* Convert the math to Unicode LaTeX (Alt+t)
* Dictate an equation (Alt+d)
* Display the Help page (Alt+h)
* Display the About page (Alt+a)

The results for speech, braille and LaTeX are displayed below the input window.
Dictation results are shown in the input, output, and MathML windows.
Dictation hint: wait for the start beep (else the first word(s) might be missing) and enunciate clearly.
## Math display
The math is rendered in the output window either natively or by MathJax according to a setting (click on the ⚙︎ to change it).
MathJax’s typography resembles LaTeX’s.
The native rendering is good although not yet as good as LaTeX.
But an advantage of the native renderer is that you can edit built-up equations directly in the output window and copy all or part of an equation.
If the selection is an insertion point, the whole equation is copied.
The only editing feature in the MathJax mode is Ctrl+c, which copies the MathML for the whole equation to the clipboard.
## Intents
UnicodeMathML generates [Presentation MathML 4](https://w3c.github.io/mathml/).
A key addition in MathML 4 is the intent attribute, which allows authors to disambiguate math notation and control math speech.

For example, does |𝑥| mean the absolute value of 𝑥 or the cardinality of 𝑥?
Absolute value is assumed by default since absolute value is more common than cardinality.
The default MathML for |x| is &#x003C;mrow intent="absolute-value(𝑥)">&#x003C;mo>|&#x003C;/mo>&#x003C;mi>𝑥&#x003C;/mi>&#x003C;mo>|&#x003C;/mo>&#x003C;/mrow>.

To specify cardinality, enter \card(x) (or ⓒ(x)).
These inputs produce the MathML &#x003C;mrow intent="cardinality(𝑥)">&#x003C;mo>|&#x003C;/mo>&#x003C;mi>𝑥&#x003C;/mi>&#x003C;mo>|&#x003C;/mo>&#x003C;/mrow>.

If you enter an absolute value or cardinality containing more than one symbol as in |a+b|, the MathML intent contains an argument reference $a.
For |a+b|, the MathML is &#x003C;mrow intent="absolute-value($a)">&#x003C;mo>|&#x003C;/mo>&#x003C;mrow arg="a">&#x003C;mi>𝑎&#x003C;/mi>&#x003C;mo>+&#x003C;/mo>&#x003C;mi>𝑏&#x003C;/mi>&#x003C;/mrow>&#x003C;mo>|&#x003C;/mo>&#x003C;/mrow>.

A matrix enclosed in vertical bars is treated as a determinant.
For example, the UnicodeMath |■(a&b@c&d)| builds up to

<math display="block"><mrow intent="determinant($a)"><mo>|</mo><mtable arg="a"><mtr><mtd><mi>𝑎</mi></mtd><mtd><mi>𝑏</mi></mtd></mtr><mtr><mtd><mi>𝑐</mi></mtd><mtd><mi>𝑑</mi></mtd></mtr></mtable><mo>|</mo></mrow></math>

which has the MathML &#x003C;mrow intent="determinant($a)">&#x003C;mo>|&#x003C;/mo>&#x003C;mtable arg="a">&#x003C;mtr>&#x003C;mtd>&#x003C;mi>𝑎&#x003C;/mi>&#x003C;/mtd>&#x003C;mtd>&#x003C;mi>𝑏&#x003C;/mi>&#x003C;/mtd>&#x003C;/mtr>&#x003C;mtr>&#x003C;mtd>&#x003C;mi>𝑐&#x003C;/mi>&#x003C;/mtd>&#x003C;mtd>&#x003C;mi>𝑑&#x003C;/mi>&#x003C;/mtd>&#x003C;/mtr>&#x003C;/mtable>&#x003C;mo>|&#x003C;/mo>&#x003C;/mrow>.

The program infers intent attributes for absolute value and determinant, so only cardinality needs to be input without vertical bars.
Note that the ambiguous expression |𝑎|𝑏+𝑐|𝑑| is assumed to be (|𝑎|)𝑏+𝑐(|𝑑|).
If you want |𝑎(|𝑏+𝑐|)𝑑|, enter |(𝑎|𝑏+𝑐|𝑑)| and the parentheses will be removed.

As we see here, some intent attribute values are implied by the input notations of LaTeX and UnicodeMath.
Others are implied by context.
Still others must be declared explicitly by the content author, by a math-knowledgeable copy editor, or maybe eventually by AI.
## Author intents
Since most content authors don’t know MathML, we need a way to allow them to enter intents easily.
To this end, UnicodeMathML has an output-window context-menu option that lets you tag entities with intents.
For example, clicking on the 𝐸 in 𝐸 = 𝑚𝑐², you get the input box

<img src="help-images/intentbox.png" style="display: block; 
           margin-left: auto; margin-right: auto;
           width: 60%;"/>

and you can type in “energy” or whatever you want followed by the Enter key.
If you type in “energy”, the resulting MathML is &#x003C;mrow>&#x003C;mi intent="energy">𝐸&#x003C;/mi>&#x003C;mo>=&#x003C;/mo>&#x003C;mrow>&#x003C;mi>𝑚&#x003C;/mi>&#x003C;msup>&#x003C;mi>𝑐&#x003C;/mi>&#x003C;mn>2&#x003C;/mn>&#x003C;/msup>&#x003C;/mrow>&#x003C;/mrow>.
Typing Atl+d speaks this as "energy equals m c squared".

## UnicodeMath editing
As you type into the input window, various conversions occur in the input window:
* Letters are converted to math italic unless they 1) are part of a function name or of a control word (backslash followed by letters), or 2) follow a quote. For example, a → 𝑎
* Numeric subscripts/superscripts are converted to Unicode subscript/superscript characters, respectively. For example, a_2 → 𝑎₂ and a^2 → 𝑎².
* Numeric fractions are converted to Unicode numeric fractions. For example, 1/2 → ½
* Control words are converted to their symbols, e.g., \alpha → 𝛼

These conversions aren't needed in the input window, but they make the input more readable.
## Edit hot keys:
| Hot key | Function    |
| ------- | ----------- |
| Ctrl+b  | Toggle the bold attribute. For example, select 𝑎 (U+1D44E), type Ctrl+b and get 𝒂 (U+1D482) as you can verify in the codepoint window. |
| Ctrl+c  | Copy the selected text to the clipboard. |
| Alt+h   | Display the help page. |
| Ctrl+i  | Toggle the italic attribute. If applied to a math italic character, this changes the character to the UnicodeMath way of representing ordinary text, i.e., put it inside quotes as in select 𝑎, Ctrl+i → “a”. |
| Alt+m   | Toggle between displaying 1) UnicodeMath in the input window and MathML below the output window, and 2) MathML in the input window and UnicodeMath below the output window. |
| Ctrl+v  | Paste plain text from the clipboard. If the text starts with <math, <m:math, or <mml:math, the text is treated as MathML and builds up. |
| Ctrl+x  | Copy the selected text to the clipboard, then delete the selected text.|
| Ctrl+y  | Redo |
| Ctrl+z  | Undo |
## Symbol galleries
Unicode has [most](https://www.unicode.org/reports/tr25/) math symbols in usage today.
The symbol galleries located below the input and output windows contain the most common math symbols.
You can enter a symbol in a gallery by clicking on it or by typing its control word as described in the _Entering symbols_ section above.

Math styled letters, such as the math fraktur H (ℌ), can be entered by selecting the letter(s) and clicking on the 𝔄𝔅ℭ button or other math-style button.
Math styled letters can also be entered using control words like \mfrakH, in which the final letter determines the math styled letter.

Most symbols have LaTeX control-word tooltips.
For example, in the codepoint window, hovering over the integral symbol ∫ displays

<img src="help-images/CodePointHover.png" style="display: block; 
           margin-left: auto; margin-right: auto;
           width: 70%;"/>
 
Hovering over the ∪ in the Operators gallery displays

<img src="help-images/OperatorHover.png" style="display: block; 
           margin-left: auto; margin-right: auto;
           width: 30%;"/>
  
Here \cup is the standard [La]TeX control word for entering ∪ but since \union is easier to guess, it’s included too.

## Output window editing
You can enter equations and edit the built-up display in the output window as shown in this video

<video src="help-images/Autobuildup3.mp4" style="display: block; 
           margin-left: auto; margin-right: auto;
           width: 90%;" controls/>

This "in-place" editing mimics the [math editing experience](https://devblogs.microsoft.com/math-in-office/officemath/) in desktop Microsoft Word, Outlook, PowerPoint, and OneNote.
The hot keys listed above work here too, as do the symbol galleries and the math autocomplete menus.
The copy hot key, Ctrl+c, copies the MathML for the selected content into the plain-text copy slot, rather than copying the underlying plain text.
This enables you to paste built-up math equations into Word and other apps that interpret "plain-text" MathML as MathML rather than plain text.
Note: math autobuildup works with native MathML rendering; if MathJax is active, only Ctrl+c works.

Currently arrow-key navigation needs work and there are other glitches.
The implementation uses JavaScript to manipulate the MathML in the browser DOM and seems very promising.
## UnicodeMath selection attributes
In the video, you may notice that the input window starts with "Ⓐ()Ⓕ(1)⬚", whereas the output window has a selected "⬚".
The Ⓐ() defines the position of the selection _anchor_ and the Ⓕ(1) defines the position of the selection _focus_ (sometimes called the selection active end).

These constructs have been added to UnicodeMath to represent the state of the user selection.
If the selection is an insertion point (a degenerate selection), only the anchor expression Ⓐ() appears since the anchor and focus ends coincide.
Nondegenerate selections have the focus construct as well as in the UnicodeMath "Ⓐ()Ⓕ(1)⬚" for the selected "⬚".

The selection attributes are useful for accessibility and appear in the MathML with the attribute names "selanchor" and "selfocus".
They are needed in the UnicodeMathML applet since the multilevel undo facility for the output window saves past states in UnicodeMath strings that must be able to restore the selection as well as the content when the user hits Ctrl+z.

In principle, the applet doesn't need to show the user this selection information and it's likely to be hidden in a future update.

__Technical stuff__: The numbers inside the parentheses give the offsets for the selection returned by the DOM [getSelection()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection) method.
Negative values are used if the selection construct is followed by a text node.
Positive values are used if the construct is followed by an element.
If no number appears, 0 is assumed.

