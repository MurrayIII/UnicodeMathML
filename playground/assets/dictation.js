(function (root) {
	'use strict';

const dictationWords = {
	// English math dictation dictionary. Keep in ASCII order for binary search
	'absolute value':			'⒜',		// \abs
	'alpha':					'α',		// α
	'ampersand':				'&',		// & (for matrix cell separator or eqarray alignments)
	'and':						'&',		// & (for matrix cell separator)
	'angle bracket':			'⟨',			// ⟨ (for "bra")
	'approximately equal':		'≅',			// ≅
	'arccosine':				'acos⁡',		// arc cosine (ends with \u2061--FUNCTAPPLY)
	'arcsine':					'asin⁡',		// arc sine
	'arctangent':				'atan⁡',		// arc tangent
	'aren\'t':					'/',		// Treat as "not"
	'array':					'■(',		// ■ (bare matrix)
	'arrow':					'←',		// ←
	'as':						'_(',		// _( (for limit)
	'atop':						'¦',		// ¦ (for binomial coefficient)
	'back slash':				'\\',		// Backslash
	'backslash':				'\\',		// Backslash
	'bar':						'\u0305',	// Bar combining mark
	'be':						'b',		// b (autocorrect misspelled b)
	'begin':					'\u3016',	// Begin
	'beginning':				'\u3016',	// Begin (autocorrect misspelled)
	'beta':						'β',		// β
	'bold':						'style',	// Math bold style
	'bra':						'⟨',			// ⟨ (for Dirac notation)
	'brace':					'{',		// {
	'bracket':					'[',		// [
	'by':						'×',		// Times (U+00D7--looks like cross U+2A2F but isn't)
	'cap':						'style',	// Capital letter shift
	'capped':					'style',	// cap (autocorrect misspelled)
	'cases':					'Ⓒ\u3016',	// TeX cases
	'chi':						'χ',		// χ
	'choose':					'⒞',		// TeX binomial coefficient
	'close':					'\u3017',	// Close TeX cases or other construct
	'closed interval':			'[]',		// Closed-interval template
	'closed open interval':		'[)',		// Closed-open-interval template
	'comma':					',',		// ,
	'complex conjugate':		'\"c.c.\"',	// c.c.
	'conjugate':				'^* ',		// complex conjugate asterisk
	'contour integral':			'∮',		// ∮
	'cosine':					'cos⁡',		// cosine
	'cotangent':				'cot⁡',		// cotangent
	'cross':					'⨯',		// Vector cross product (U+2A2F)
	'cube root':				'∛',			// Cube root
	'cubed':					'³',		// Cubed
	'dagger':					'^† ',		// † accent (adjoint)
	'del':						'∇',		// ∇
	'dell':						'∇',		// ∇
	'delta':					'δ',		// δ
	'derivative of':			'ⅆ',		// ⅆ
	'determinant':				'⒱(',		// \vmatrix (|array|)
	'divided by':				'/',		// Fraction
	'does':						'\uFFFF',	// (ignore)
	'doesn\'t':					'/',		// Treat as "not"
	'dot':						'\u0307 ',	// Dot combining mark
	'dots':						'…',		// Ellipsis
	'double dot':				'\u0308 ',	// Double dot combining mark
	'double integral':			'∬',		// ∬
	'double struck':			'style',	// Math double-struck or open-face style
	'down arrow':				'↓',		// ↓
	'eight':					'8',		// 8
	'eighth':					'/8 ',		// 1/8
	'eighths':					'/8 ',		// n/8
	'ellipse':					'⬭',		// ⬭ enclosure
	'ellipsis':					'…',		// Ellipsis
	'end':						'\u3017',	// End
	'enter':					'\uFFFF',	// (ignore)
	'epsilon':					'ϵ',		// ϵ
	'equal':					'=',		// =
	'equals':					'=',		// =
	'equation':					'\uFFFF',	// (ignore)
	'equivalent':				'≍',			// ≍
	'eta':						'η',		// η
	'factorial':				'!',		// !
	'fifth':					'/5 ',		// 1/5
	'fifths':					'/5 ',		// n/5
	'five':						'5',		// 5
	'for all':					'∀',		// ∀
	'four':						'4',		// 4
	'fourth':					'/4 ',		// 1/4
	'fourth root':				'∜',			// Fourth root
	'fourths':					'/4 ',		// n/4
	'fraction':					'⍁',		// Start fraction
	'fractor':					'style',	// Math fraktur style
	'fraktur':					'style',	// Math fraktur style
	'from':						'_(',		// Lower limit
	'gamma':					'γ',		// γ
	'goes to':					'→',		// →
	'greater than':				'>',		// >
	'grow':						'∫',		// ∫ (autocorrection)
	'half':						'/2 ',		// 1/2
	'halves':					'/2 ',		// n/2
	'hat':						'\u0302 ',	// Caret combining mark
	'hbar':						'ℏ',			// Plank's constant / 2π
	'hyperbolic cosine':		'cosh⁡',		// Hyperbolic cosine
	'hyperbolic secant':		'sech⁡',		// Hyperbolic secant
	'hyperbolic sine':			'sinh⁡',		// Hyperbolic sine
	'identical':				'≡',		// ≡
	'identity':					'≡',		// ≡ (for identity matrix/determinant)
	'if':						'\"if \"',	// Ordinary-text "if "
	'imaginary part':			'Im⁡',		// Imaginary part of complex number
	'in':						'∈',		// Element of
	'infinity':					'∞',		// ∞
	'integral':					'∫',		// ∫
	'interval':					'][',		// Alias for open interval
	'iota':						'ι',		// ι
	'is':						'\uFFFF',	// (ignore)
	'isn\'t':					'/',		// Treat as "not"
	'italic':					'style',	// Math italic style
	'jay':						'j',		// (autocorrect misspelled j)
	'kappa':					'κ',		// κ
	'kay':						'k',		// (autocorrect misspelled k)
	'kent':						'⟩',			// ⟩ (autocorrect misspelled)
	'ket':						'⟩',			// ⟩ (for Dirac notation)
	'lambda':					'λ',		// λ
	'left angle bracket':		'⟨',			// ⟨ (for "bra")
	'left arrow':				'←',		// ←
	'left brace':				'{',		// {}
	'left bracket':				'[',		// []
	'left double arrow':		'⇐',			// ⇐
	'left open interval':		'(]',		// Open-closed-interval template
	'left paren':				'(',		// ()
	'left right arrow':			'↔',		// ↔
	'left right double arrow':	'⇔',		// ⇔
	'less than':				'<',		// <
	'letter':					'\uFFFF',	// (ignore)
	'limit':					'lim⁡',		// Limit
	'matrix':					'⒨(',		// ■ (parenthesized matrix)
	'minus':					'−',		// -
	'more than':				'>',		// >
	'mu':						'μ',		// μ
	'nabla':					'∇',		// ∇
	'next':						'@',		// @ (for matrix row separator)
	'nine':						'9',		// 9
	'nineth':					'/9 ',		// 1/9
	'nineths':					'/9 ',		// n/9
	'no serif':					'style',	// Math sans-serif style (alternate speech)
	'not':						'/',		// / (for negation)
	'nth':						'/n ',		// nth (for nth derivative)
	'nu':						'ν',		// ν
	'of':						'▒',		// Get naryand
	'okay':						'k',		// (autocorrect misspelled k)
	'omega':					'ω',		// ω
	'omicron':					'ο',		// ο
	'one':						'1',		// 1
	'open closed interval':		'(]',		// Open-closed-interval template
	'open face':				'style',	// Math double-struck or open-face style
	'open interval':			'][',		// Open-interval template
	'or':						'\uFFFF',	// (ignore)
	'over':						'/',		// Fraction
	'oversea':					'/c',		// (autocorrect misspelled 'over c')
	'oversee':					'/c',		// (autocorrect misspelled 'over c')
	'paren':					'(',		// (
	'partial':					'∂',		// ∂
	'phi':						'ϕ',		// ϕ
	'pi':						'π',		// π
	'plus':						'+',		// +
	'power':					'\uFFFF',	// (ignore)
	'prime':					'′',		// ′
	'product':					'∏',		// ∏
	'psi':						'ψ',		// ψ
	'quote':					'\"',		// " (for ordinary text)
	'raised':					'\uFFFF',	// (ignore)
	'real part':				'Re⁡',		// Real part of complex number
	'rectangle':				'▭',		// ▭ enclosure
	'rho':						'ρ',		// ρ
	'right angle bracket':		'⟩',			// ⟩ (for "ket")
	'right arrow':				'→',		// →
	'right brace':				'}',		// }
	'right bracket':			']',		// ]
	'right double arrow':		'⇒',		// ⇒
	'right open interval':		'[)',		// Closed-open-interval template
	'right paren':				')',		// )
	'root':						'⒭',		// Root as in "root n of x"
	'sans serif':				'style',	// Math sans-serif style
	'script':					'style',	// Math script style
	'sea':						'c',		// c (autocorrect misspelled)
	'secant':					'sec⁡',		// secant
	'second':					'/2 ',		// For setting up second derivative
	'see':						'c',		// c (autocorrect misspelled)
	'seven':					'7',		// 7
	'seventh':					'/7 ',		// 1/7
	'sevenths':					'/7 ',		// n/7
	'si':						'ψ',		// ψ (autocorrect misspelled psi)
	'sigh':						'ψ',		// ψ (autocorrect misspelled psi)
	'sigma':					'σ',		// σ
	'sign':						'sin⁡',		// sine
	'sine':						'sin⁡',		// sine
	'six':						'6',		// 6
	'sixth':					'/6 ',		// 1/6
	'sixths':					'/6 ',		// n/6
	'size':						'\uFFFF',	// (ignore) (for "of size n")
	'some':						'∑',		// Summation (autocorrect misspelled)
	'space':					' ',		// Space (to build something up)
	'sqrt':						'√',		// Square root
	'square root':				'√',		// Square root
	'squared':					'²',		// Squared
	'sub':						'_',		// Subscript
	'sum':						'∑',		// Summation
	'summation':				'∑',		// Summation
	'surface integral':			'∯',			// ∯
	'tangent':					'tan⁡',		// tangent
	'tau':						'τ',		// τ
	'ten':						'10',		// 10
	'the':						'\uFFFF',	// (ignore)
	'there exists':				'∃',		// ∃
	'therefore':				'∴',		// ∴
	'theta':					'θ',		// θ
	'third':					'/3 ',		// 1/3
	'thirds':					'/3 ',		// n/3
	'three':					'3',		// 3
	'tilde':					'\u0303 ',	// Tilde combining mark
	'times':					'×',		// Times (U+00D7--looks like cross U+2A2F but isn't)
	'to':						'^',		// Upper limit or power
	'too':						'2',		// 2 (autocorrect misspelling)
	'top':						'¦',		// → "atop" if preceded by 'a' (for binomial coefficient)
	'two':						'2',		// 2
	'up arrow':					'↑',		// ↑
	'upsilon':					'υ',		// υ
	'var epsilon':				'𝜀',			// 𝜀
	'var phi':					'φ',		// φ
	'var theta':				'ϑ',		// ϑ
	'vertical bar':				'|',		// For absolute value (see also "abs" '⒜')
	'with respect to':			'/ⅆ',		// As in "derivative of f with respect to x"
	'wp':						'℘',			// ℘
	'wrt':						'/ⅆ',		// (speed up debugging involving "with respect to")
	'xi':						'ξ',		// ξ
	'zero':						'0',		// 0
	'zeta':						'ζ',		// ζ
};

const keys = Object.keys(dictationWords);
var cKeys = keys.length;

function resolveDW(dictation) {
	// Get longest dictationWords match
	var iMax = cKeys - 1;
	var iMid;
	var iMin = 0;
	var matchKey = '';

	// Find length of first word
	for (var cchWord = 0; cchWord < dictation.length && (isLcAscii(dictation[cchWord]) || dictation[cchWord] == '\''); cchWord++)
		;

	var firstWord = dictation.substring(0, cchWord);

	do {									// Binary search for a match
		iMid = Math.floor((iMin + iMax) / 2);
		var key = keys[iMid];
		if (key.startsWith(firstWord) &&
			(key.length <= cchWord || key[cchWord] == ' ')) {
			matchKey = key;
			break;
		}
		if (dictation < key)
			iMax = iMid - 1;
		else
			iMin = iMid + 1;
	} while (iMin <= iMax);

	if (matchKey == '')
		return '';							// Not in dictionary


	// matchKey matches first word. Check for matches preceding iMid
	for (let j = iMid - 1; j >= 0; j--) {
		key = keys[j];
		if (!key.startsWith(firstWord))
			break;
		if (dictation.startsWith(key)) {
			//console.log("Dictation match: " + key);
			return key;
		}
	}
	// Check for matches following iMid
	for (let j = iMid + 1; j < cKeys; j++) {
		key = keys[j];
		if (!key.startsWith(firstWord))
			break;
		if (dictation.startsWith(key)) {
			//console.log("Dictation match: " + key);
			return key;
		}
	}
	//console.log("Longest match key = " + matchKey);
	return matchKey;
}

function isAsciiDigit(ch) { return /[0-9]/.test(ch); }
function isIntegral(ch) { return '∫∬∭⨌∮∯∰∱⨑∲∳⨍⨎⨏⨕⨖⨗⨘⨙⨚⨛⨜⨒⨓⨔'.includes(ch); }
function isLcAscii(ch) { return /[a-z]/.test(ch); }
function isLcGreek(ch) { return /[α-ϵ]/.test(ch); }
function isMatrix(ch) { return '⒨⒱'.includes(ch); }
function isNary(ch) { return '∑⅀⨊∏∐⨋∫∬∭⨌∮∯∰∱⨑∲∳⨍⨎⨏⨕⨖⨗⨘⨙⨚⨛⨜⨒⨓⨔⋀⋁⋂⋃⨃⨄⨅⨆⨀⨁⨂⨉⫿'.includes(ch); }

// The following includes most relational (R) operators in
// https://www.unicode.org/Public/math/revision-15/MathClassEx-15.txt
const relationalRanges = [
	[0x003C, 0x003E], [0x2190, 0x21FF], [0x2208, 0x220D], [0x221D, 0x221D],
	[0x2223, 0x2226], [0x2223, 0x2226], [0x2234, 0x2237], [0x2239, 0x223D], 
	[0x2241, 0x228B], [0x228F, 0x2292], [0x22A2, 0x22B8], [0x22D4, 0x22FF],
	[0x27F0, 0x297F], [0x2B00, 0x2B11], [0x2B30, 0x2B4C], [0x2B95, 0x2B95]
];

function isRelational(ch) {
	var n = ch.codePointAt(0);

	for (var i = 0; i < relationalRanges.length; i++) {
		var pair = relationalRanges[i];
		if (n < pair[0])
			return false;
		if (n <= pair[1])
			return true;
	}
	return false;
}

function getMathAlphanumeric(ch, mathStyle) {
	// Return ch in the math style described by mathStyle
	var style = '';

	if (mathStyle.includes('cap')) {
		ch = ch.toUpperCase();
	}
	if (mathStyle.includes('script')) {
		style = mathStyle.includes('bold') ? 'mbfscr' : 'mscr';
	} else if (mathStyle.includes('fraktur') || mathStyle.includes('fractor')) {
		style = mathStyle.includes('bold') ? 'mbffrak' : 'mfrak';
	} else if (mathStyle.includes('sans') || mathStyle.includes('no serif')) {
		style = 'sans';						// Finish below
	}
	else if (mathStyle.includes('monospace')) {
		style = 'mtt';
	}
	else if (mathStyle.includes('double struck') || mathStyle.includes('open face')) {
		style = 'Bbb';
	}
	if (!style || style == 'sans') {		// Finish 'sans' and serif
		if (mathStyle.includes('bold')) {
			style = (mathStyle.includes('italic') ? 'mbfit' : 'mbf') + style;
		}
		if (mathStyle.includes('italic')) {
			style = 'mit' + style;
		}
	}
	return (ch in mathFonts && style in mathFonts[ch])
		? mathFonts[ch][style] : ch;
}

function dictationToUnicodeMath(dictation) {
	// Translate dictated text to UnicodeMath

	if ('.?'.includes(dictation[dictation.length - 1])) {
		// Discard trailing '.' or '?'
		dictation = dictation.substring(0, dictation.length - 1);
	}
	dictation = dictation.replaceAll(',', '').toLowerCase();

	var cDerivOrder = 0;
	var ch = '';
	var ch2 = '';
	var chPrev = '';
	var derivClose = false;
	var derivOrder = 0;
	var derivPartial = false;
	var fraction = 0
	var integral = false;
	var interval = 0;
	var iSubSup = 0;
	var limit = false;
	var mathStyle = [];
	var nary = '';

	for (var i = 0; i < dictation.length; chPrev = ch) {
		ch = dictation[i];

		if (i >= 2)
			ch2 = dictation[i - 2];

		if (ch == ' ' && (!isAsciiDigit(chPrev) || ch2 != '^' || nary == 'naryLim')) {
			// Delete space except following "^<ASCII digit>" which may need
			// a space to build up the superscript. Restore the space below
			// if it's needed to separate a letter from a function name.
			dictation = dictation.substring(0, i) + dictation.substring(i + 1);
			continue;
		}
		if (!chPrev && mathStyle.length && (isLcAscii(ch) || isAsciiDigit(ch)) &&
			(i == dictation.length - 1 || !isLcAscii(dictation[i + 1]))) {
			ch = getMathAlphanumeric(ch, mathStyle);
			dictation = dictation.substring(0, i) + ch + dictation.substring(i + 1);
			i += ch.length;
			mathStyle = [];
			continue;
		}
		if (isLcAscii(ch) && isLcAscii(chPrev)) {
			var key = resolveDW(dictation.substring(i - 1));
			if (key != '') {
				var unicodeMath = dictationWords[key];
				var b = '';
				var iRem = i - 1 + key.length;

				if (unicodeMath == '\uFFFF' ||
					unicodeMath == '▒' && '√∛∜⒜⒨⒭⒱('.includes(ch2) ||
					key == 'from' && (ch2 == ']' || ch2 == '[' || ch2 == '(') ||
					key == 'to' && isRelational(ch2)) {
					unicodeMath = '';		// Ignore word
				} else if ((ch2 == '\u3017' || ch2 == '&') &&
					unicodeMath[unicodeMath.length - 1] == '(') {
					i--;
					unicodeMath = ')';
				} else if (interval) {		// Mathematical interval fix-ups
					if (unicodeMath == '][') {
						// Finalize the interval-text order
						var chClose = dictation[interval]; // Save closing char & delete it
						dictation = dictation.substring(0, interval) + dictation.substring(interval + 1);
						i--;
						if (ch2 == '\u3017' || ch2 == '&')
							i--;			// Will delete '\u3017' ('end') or 'and'
						unicodeMath = chClose; // Insert closing char at end
						interval = 0;		// Terminate interval mode
					} else if (unicodeMath == '^') {
						unicodeMath = ',';	// 'to' → ','
					}
				} else if (key.endsWith('interval')) { // Start interval
					interval = i;			// Remember start-interval location for final fix-up
				} else if (unicodeMath == 'style') {
					mathStyle.push(key);	// Collect math style words
					unicodeMath = '';		// Will delete control word
				} else if (unicodeMath == '⍁') {
					if (ch2 == '\u3017') {
						fraction--;
						unicodeMath = '';
					} else {
						fraction++;
					}
				}

				var cchUni = unicodeMath.length;

				if (dictation[iRem] == ' ')
					iRem++;					// Remove space following key

				if (cchUni) {
					if (unicodeMath[cchUni - 1] == '\u2061') {
						if (isLcAscii(ch2)) {
							// Insert a space before math function
							b = ' ';		// E.g., bsin → b sin
						}
						if (unicodeMath == 'lim\u2061') {
							unicodeMath = 'lim '; // Replace 2061 by ' '
							limit = true;
						}
					} else if (cchUni == 3 && unicodeMath[0] == '/' && unicodeMath[2] == ' ') {
						if (ch2 == '^') {
							unicodeMath = unicodeMath.substring(1);	// E.g., "^/n " → "^n "
						} else if (isAsciiDigit(ch2) && isAsciiDigit(unicodeMath[1])) {
							unicodeMath = getUnicodeFraction(ch2, unicodeMath[1]);
							i--;
						}
					} else if (key == 'to' && nary == 'naryLim') {
						unicodeMath = ')^';		// End lower limit; start upper
					} else if (unicodeMath == '▒') {
						if (limit) {
							unicodeMath = ") ";	// End limit subscript
							limit = false;
						} else if (nary == 'naryLim') {
							unicodeMath = ' ';
							nary = 'naryand';	// End nary limits
						} else if (derivOrder) {
							unicodeMath = '(';	// E.g., df(
							derivClose = true;	// Queue up corresponding ')'
						} else if (ch2 == '\u2061') {
							unicodeMath = '⒡';
						}
					} else if (mathStyle.length && (isAsciiDigit(unicodeMath) || isLcGreek(unicodeMath))) {
						unicodeMath = getMathAlphanumeric(unicodeMath, mathStyle);
						mathStyle = [];
					} else if (ch2 == 'h' && key == 'bar') {
						unicodeMath = 'ℏ';	// 'h bar' → ℏ
						i--;
					} else if (key == 'end' && ch2 == '^') {
						unicodeMath = 'n';	// Autocorrect 'end' to 'n'
					} else if (key == 'derivative of') {
						derivClose = derivPartial = false;
						derivOrder = 1;
						var j = i;
						if (ch2 == '∂') {
							unicodeMath = '';
							derivPartial = true;
							j--;
						}
						if (j > 3 && dictation[j - 2] == ' ' && dictation[j - 4] == '/') {
							// E.g., "/2 ⅆ" → "ⅆ^2 "
							derivOrder = dictation[j - 3];
							unicodeMath = (derivPartial ? '∂^' : 'ⅆ^') + derivOrder + ' ';
							j -= 3;
							i = j;
						}
					} else if (derivOrder && unicodeMath == '/ⅆ') {
						unicodeMath = derivClose ? ')/' : '/';
						unicodeMath += derivPartial ? '∂' : 'ⅆ';
						derivClose = derivPartial = false;
						if (derivOrder >= '2')
							cDerivOrder = 2; // Countdown for denominator derivative order
					}
					else if (unicodeMath == '\\') { // Include TeX control word
						for (; iRem < dictation.length && isLcAscii(dictation[iRem]); iRem++) {
							unicodeMath += dictation[iRem];
						}
						if (dictation[iRem] == ' ') {
							unicodeMath += ' ';
							iRem++;
						}
					} else if (isMatrix(unicodeMath[0]) &&
						(ch2 == '≡' || i >= 3 && isAsciiDigit(ch2) && dictation[i - 3] == '×')) {
						unicodeMath = unicodeMath[0];
						if (ch2 == '≡') i--; // Identity matrix: delete '≡'
					} else if (unicodeMath == '/' && fraction) {
						unicodeMath = '&';	// For ⍁...&...〗 fraction construct
					} else if (unicodeMath == '^') {
						iSubSup++;
					} else if (unicodeMath == '_') {
						iSubSup--;
					}
				}
				if (cDerivOrder > 0) {
					cDerivOrder--;
					if (!cDerivOrder) {		// E.g., to get "∂^2 f(θ)/∂θ^2 " 
						unicodeMath += '^' + derivOrder + ' ';
					}
				}
				dictation = dictation.substring(0, i - 1) + b + unicodeMath + dictation.substring(iRem);
				cchUni = unicodeMath.length;
				i += cchUni - 1;
				ch = 0;						// To set chPrev = 0
				if (cchUni != 1) continue;

				if (isNary(unicodeMath)) {
					nary = 'naryLim';
					integral = isIntegral(unicodeMath);
					continue;
				}
				continue;
			}
			if (isAsciiDigit(ch2) && chPrev == 't' && ch == 'h') {
				continue;					// E.g., delete "th" in "4th"
			}
		}	// (isLcAscii(ch) && isLcAscii(chPrev))

		if (interval && ch2 == '(' && i > 2) {
			dictation = dictation.substring(0, i - 3) + dictation.substring(i - 1);
			i -= 2;
		}

		if (cDerivOrder > 0 && !isLcAscii(dictation[i])) {
			cDerivOrder = 0;				// E.g., to get "ⅆ^2 f(x)/ⅆx^2 "
			unicodeMath = '^' + derivOrder;
			dictation = dictation.substring(0, i) + unicodeMath + dictation.substring(i);
			i += unicodeMath.length;
		}
		if (ch == 'd' && integral) {
			ch = 'ⅆ';
			if (iSubSup > 0) {
				iSubSup--;
				ch = ' ⅆ';
			}
			integral = false;
			dictation = dictation.substring(0, i) + ch + dictation.substring(i + 1);
		} else if (ch == '/' && fraction) {
			// Use ⍁...&...〗 fraction construct to satisfy peg processing
			dictation = dictation.substring(0, i) + '&' + dictation.substring(i + 1);
		}
		if (nary == 'naryAnd') nary = '';
		i++;
	}	// for loop over dictation
	return dictation;
}

root.dictationToUnicodeMath = dictationToUnicodeMath;

})(this);
