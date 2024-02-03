// Math speech code

const symbolSpeechStrings = {
	// This list includes speech strings for math symbols. In addition, it has
	// some nonmath symbols used to represent connecting words like 'from' and
	// 'to'. As such, it is the only list that needs to be localized, provided
	// English math speech order is adequate for the target language.
	'!': 'factorial',
	'#': ', equation',
	'&': 'and',
	'(': 'open paren',
	')': 'close paren',
	',': 'comma',
	'/': 'over',
	'<': 'less than',
	'>': 'greater than',
	'@': ', next row,',
	'[': 'open bracket',
	']': 'close bracket',
	'^': 'sup',
	'_': 'sub',
	'{': 'open brace',
	'|': 'vertical bar',
	'}': 'close brace',
	'¦': ', atop,',							// 00A6
	'¬': 'not',								// 00AC
	'¯': 'overbar',							// 00AF
	'°': 'degrees',							// 00B0
	'±': 'plus or minus',					// 00B1
	'²': 'squared',							// 00B2
	'³': 'cubed',							// 00B3
	'¶': ', end',							// 00B6, e.g., '¶ ⍁' for 'end fraction'
	'¼': 'one fourth',						// 00BC
	'½': 'one half',						// 00BD
	'×': 'times',							// 00D7
	'·': 'dot',								// 00B7
	'÷': 'divided by',						// 00F7
	'ı': 'dotless i',						// 0131
	'ȷ': 'dotless j',						// 0237
	'\u0300': 'grave',
	'\u0301': 'acute',
	'\u0302': 'hat',
	'\u0303': 'tilde',
	'\u0305': 'bar',
	'\u0307': 'dot',
	'\u0308': 'double dot',
	'Γ': 'Gamma',
	'Δ': 'Delta',
	'Θ': 'Theta',
	'Λ': 'Lambda',
	'Π': 'Pi',
	'Σ': 'Sigma',
	'Φ': 'Phi',
	'Ψ': 'Psi',
	'Ω': 'Omega',
	'α': 'alpha',							// 03B1
	'β': 'beta',
	'γ': 'gamma',
	'δ': 'delta',
	'ε': 'script epsilon',
	'ζ': 'zeta',
	'η': 'eta',
	'θ': 'theta',
	'ι': 'iota',
	'κ': 'kappa',
	'λ': 'lambda',
	'μ': 'mu',
	'ν': 'nu',
	'ξ': 'xi',
	'ο': 'omicron',
	'π': 'pi',
	'ρ': 'rho',
	'ς': 'final sigma',
	'σ': 'sigma',
	'τ': 'tau',
	'υ': 'upsilon',
	'φ': 'script phi',
	'χ': 'chi',
	'ψ': 'psi',
	'ω': 'omega',
	'ϑ': 'script theta',
	'ϕ': 'phi',
	'Ϝ': 'cap digamma',
	'ϝ': 'digamma',
	'ϵ': 'epsilon',
	'\u200B': ',',							// ZWSP
	'‖': 'double vertical line',				// 2016
	'…': 'dot dot dot',						// 2026
	'′': 'prime',							// 2032
	'⁄': 'slash',							// 2044
	'⁅': ', equation',						// 2045
	'⁆': ',',								// 2046
	'\u2061': ' ',							// FunctionApply
	'₁': 'tenths',							// 2081
	'₂': 'halves',							// 2082
	'₃': 'thirds',							// 2083
	'₄': 'fourths',							// 2084
	'₅': 'fifths',							// 2085
	'₆': 'sixths',							// 2086
	'₇': 'sevenths',						// 2087
	'₈': 'eighths',							// 2088
	'₉': 'ninths',							// 2089
	'ℏ': 'h bar',							// 210F
	'ⅅ': 'differential D',					// 2145
	'ⅆ': 'differential d',					// 2146
	'ⅇ': 'e',								// 2147
	'ⅈ': 'i',								// 2148
	'ⅉ': 'j',								// 2149
	'⅐': 'one seventh',						// 2150
	'⅑': 'one ninth',						// 2151
	'⅒': 'one tenth',						// 2152
	'⅓': 'one third',						// 2153
	'⅕': 'one fifth',						// 2155
	'⅙': 'one sixth',						// 2159
	'⅛': 'one eighth',						// 215B
	'←': 'left arrow',						// 2190
	'↑': 'up arrow',						// 2191
	'→': 'goes to',							// 2192
	'↓': 'down arrow',						// 2193
	'↔': 'left right arrow',				// 2194
	'⇒': 'implies',							// 21D2
	'⇔': 'if and only if',					// 21D4
	'∀': 'for all',							// 2200 (All chars in 2200 block)
	'∁': 'complement',
	'∂': 'partial',
	'∃': 'there exists',
	'∄': 'there doesn\'t exist',
	'∅': 'empty set',
	'∆': 'increment',
	'∇': 'del',
	'∈': 'element of',
	'∉': 'not element of',
	'∊': 'small element of',
	'∋': 'contains as member',
	'∌': 'doesn\'t contain as member',
	'∍': 'small contains as member',
	'∎': 'q e d',
	'∏': 'product',
	'∐': 'coproduct',						// 2210
	'∑': 'sum',
	'−': 'minus',
	'∓': 'minus or plus',
	'∔': 'dot plus',
	'∕': 'linear divide',
	'∖': 'set minus',
	'∗': 'asterisk operator',
	'∘': 'ring operator',
	'∙': 'bullet',
	'√': 'square root',
	'∛': 'cube root',
	'∜': 'fourth root',
	'∝': 'proportional to',
	'∞': 'infinity',
	'∟': 'right angle',
	'∠': 'angle',							// 2220
	'∡': 'measured angle',
	'∢': 'spherical angle',
	'∣': 'divides',
	'∤': 'doesn\'t divide',
	'∥': 'parallel to',
	'∦': 'not parallel to',
	'∧': 'logical andd',
	'∨': 'logical or',
	'∩': 'intersection',
	'∪': 'union',
	'∫': 'integral',
	'∬': 'double integral',
	'∭': 'triple integral',					// 2230
	'∮': 'contour integral',
	'∯': 'surface integral',
	'∰': 'volume integral',
	'∱': 'clockwise integral',
	'∲': 'clockwise contour integral',
	'∳': 'anticlockwise contour integral',
	'∴': 'therefore',
	'∵': 'because',
	'∶': 'ratio',
	'∷': 'proportion',
	'∸': 'dot minus',
	'∹': 'excess',
	'∺': 'geometric proportion',
	'∻': 'homothetic',
	'∼': 'tilde operator',
	'∽': 'reverse tilde operator',
	'∾': 'inverted lazy s',
	'∿': '\'sine\' wave',
	'≀': 'wreath product',					// 2240
	'≁': 'not tilde',
	'≂': 'minus tilde',
	'≃': 'asymptotically equal to',
	'≄': 'not asymptotically equal to',
	'≅': 'approximately equal to',
	'≆': 'approximately but not equal to',
	'≇': 'neither approximately nor equal to',
	'≈': 'almost equal to',
	'≉': 'not almost equal to',
	'≊': 'almost equal or equal to',
	'≋': 'triple tilde',
	'≌': 'all equal to',
	'≍': 'equivalent to',
	'≎': 'geometrically equivalent to',
	'≏': 'difference between',
	'≐': 'approaches the limit',				// 2250
	'≑': 'geometrically equal to',
	'≒': 'nearly equals',
	'≓': 'image of or approximately equal to',
	'≔': 'colon equals',
	'≕': 'equals colon,',
	'≖': 'ring in equal to',
	'≗': 'ring equal to',
	'≘': 'corresponds to',
	'≙': 'estimates',
	'≚': 'equiangular to',
	'≛': 'star equals',
	'≜': 'delta equals',
	'≝': 'equals by definition',
	'≞': 'measured by',
	'≟': 'questioned equals',
	'≠': 'not equal',						// 2260
	'≡': 'identical to',
	'≢': 'not identical to',
	'≣': 'strictly equivalent to',
	'≤': 'less than or equal to',
	'≥': 'greater than or equal to',
	'≦': 'less than over equal to',
	'≧': 'greater than over equal to',
	'≨': 'less than but not equal to',
	'≩': 'greater than but not equal to',
	'≪': 'much less than',
	'≫': 'much greater than',
	'≬': 'between',
	'≭': 'not equivalent to',
	'≮': 'not less than',
	'≯': 'not greater than',
	'≰': 'not less than or equal',			// 2270
	'≱': 'not greater than or equal',
	'≲': 'less than or equivalent',
	'≳': 'greater than or equivalent to',
	'≴': 'neither less than nor equivalent to',
	'≵': 'neither greater than nor equivalent to',
	'≶': 'less than or greater than',
	'≷': 'greater than or less than',
	'≸': 'neither less than nor greater than',
	'≹': 'neither greater than nor less than',
	'≺': 'precedes',
	'≻': 'succeeds',
	'≼': 'precedes or equals',
	'≽': 'succeeds or equals',
	'≾': 'precedes or is equivalent to',
	'≿': 'succeeds or is equivalent to',
	'⊀': 'doesn\'t precede',					// 2280
	'⊁': 'doesn\'t succeed',
	'⊂': 'subset of',
	'⊃': 'superset of',
	'⊄': 'not subset of',
	'⊅': 'not superset of',
	'⊆': 'subset or equals',
	'⊇': 'superset or equals',
	'⊈': 'neither a subset nor equal to',
	'⊉': 'neither a superset nor equal to',
	'⊊': 'subset of with not equal to',
	'⊋': 'superset of with not equal to',
	'⊌': 'multiset',
	'⊍': 'multiset times',
	'⊎': 'multiset union',
	'⊏': 'square image of',
	'⊐': 'square original of',				// 2290
	'⊑': 'square image of or equal to',
	'⊒': 'square original of or equal to',
	'⊓': 'square cap',
	'⊔': 'square cup',
	'⊕': 'circled plus',
	'⊖': 'circled minus',
	'⊗': 'circled times',
	'⊘': 'circled divide',
	'⊙': 'circled dot',
	'⊚': 'circled ring',
	'⊛': 'circled asterisk',
	'⊜': 'circled equals',
	'⊝': 'circled dash',
	'⊞': 'squared plus',
	'⊟': 'squared minus',
	'⊠': 'squared times',					// 22A0
	'⊡': 'squared dot',
	'⊢': 'right tack',
	'⊣': 'left tack',
	'⊤': 'down tack',
	'⊥': 'up tack',
	'⊦': 'reduces to',
	'⊧': 'models',
	'⊨': 'results in',
	'⊩': 'forces',
	'⊪': 'triple vertical bar right turnstile',
	'⊫': 'double vertical bar double right turnstile',
	'⊬': 'does not prove',
	'⊭': 'doesn\'t result in',
	'⊮': 'doesn\'t force',
	'⊯': 'negated double vertical bar double right turnstile',
	'⊰': 'precedes under relation',			// 22B0
	'⊱': 'succeeds under relation',
	'⊲': 'is a normal subgroup of',
	'⊳': 'contains as normal subgroup',
	'⊴': 'is a normal subgroup of or equals',
	'⊵': 'contains as normal subgroup of or equals',
	'⊶': 'original of',
	'⊷': 'image of',
	'⊸': 'multimap',
	'⊹': 'hermitian conjugate matrix',
	'⊺': 'intercalate',
	'⊻': 'xor',
	'⊼': 'nand',
	'⊽': 'nor',
	'⊾': 'right angle with arc',
	'⊿': 'right triangle',
	'⋀': 'n-ary logical andd',				// 22C0
	'⋁': 'n-ary logical or',
	'⋂': 'n-ary intersection',
	'⋃': 'n-ary union',
	'⋄': 'diamond',
	'⋅': 'dot',
	'⋆': 'star',
	'⋇': 'division times',
	'⋈': 'bowtie',
	'⋉': 'left normal factor semidirect product',
	'⋊': 'right normal factor semidirect product',
	'⋋': 'left semidirect product',
	'⋌': 'right semidirect product',
	'⋍': 'reverse tilde equals',
	'⋎': 'curly logical or',
	'⋏': 'curly logical andd',
	'⋐': 'double subset',					// 22D0
	'⋑': 'double superset',
	'⋒': 'double intersection',
	'⋓': 'double union',
	'⋔': 'pitchfork',
	'⋕': 'equal and parallel to',
	'⋖': 'dotted less than',
	'⋗': 'dotted greater than',
	'⋘': 'very much less than',
	'⋙': 'very much greater than',
	'⋚': 'less than equals or greater than',
	'⋛': 'greater than equals or less than',
	'⋜': 'equals or less than',
	'⋝': 'equals or greater than',
	'⋞': 'equals or precedes',
	'⋟': 'equals or succeeds',
	'⋠': 'doesn\'t precede or equal',		// 22E0
	'⋡': 'doesn\'t succeed or equal',
	'⋢': 'not square image of or equal to',
	'⋣': 'not square original of or equal to',
	'⋤': 'square image of or not equal to',
	'⋥': 'square original of or not equal to',
	'⋦': 'less than but not equivalent to',
	'⋧': 'greater than but not equivalent to',
	'⋨': 'precedes but not equivalent to',
	'⋩': 'succeeds but not equivalent to',
	'⋪': 'not normal subgroup of',
	'⋫': 'does not contain as normal subgroup',
	'⋬': 'not normal subgroup of or equal to',
	'⋭': 'does not contain as normal subgroup or equal',
	'⋮': 'vertical ellipsis',
	'⋯': 'dot dot dot',
	'⋰': 'up right diagonal ellipsis',		// 22F0
	'⋱': 'down right diagonal ellipsis',
	'⋲': 'element of with long horizontal stroke',
	'⋳': 'element of with vertical bar at stroke end ',
	'⋴': 'small element of with vertical bar at stroke end',
	'⋵': 'dotted element of ',
	'⋶': 'overbar element of',
	'⋷': 'small overbar element of',
	'⋸': 'underbar element of',
	'⋹': 'double stroke element of',
	'⋺': 'long-stroke contains',
	'⋻': 'contains with vertical bar at stroke end',
	'⋼': 'small contains with vertical bar at stroke end',
	'⋽': 'overbar contains',
	'⋾': 'small overbar contains',
	'⋿': 'z notation bag membership',		// 22FF

	'⌈': 'open ceiling',						// 2308
	'⌉': 'close ceiling',					// 2309
	'⌊': 'open floor',						// 230A
	'⌋': 'close floor',						// 230B
	'⍁': 'fraction',						// 2341
	'⍆': ', next case, ',					// 2346
	"⍈": ', next equation, ',				// 2348
	'⍨': 'as',								// 2368
	'⎴': 'over bracket',					// 23B4
	'⎵': 'under bracket',					// 23B5
	'⏉': 'transpose',						// 23C9
	'⏜': 'over paren',						// 23DC
	'⏝': 'under paren',						// 23DD
	'⏞': 'over brace',						// 23DE
	'⏟': 'under brace',						// 23DF
	'⏠': 'over shell',						// 23E0
	'⏡': 'under shell',						// 23E1
	'⏳': ',',								// 23F3
	'⒜': 'absolute value',					// 249C
	'⒞': 'choose',							// 249E
	'⒨': 'parenthesized matrix',			// 24A8
	'⒩': 'normed matrix',					// 24A9
	'⒭': 'root',							// 24AD
	'⒱': 'determinant',						// 24B1
	'Ⓒ': 'cases',							// 24B8
	'Ⓢ': 'curly braced matrix',				// 24C8
	'ⓢ': 'bracketed matrix',				// 24E2
	'│': 'vertical bar',					// 2502
	'┤': 'close',							// 2524
	'┬': 'lower limit',						// 252C
	'┴': 'upper limit',						// 2534
	'▁': 'underbar',						// 2581
	'█': 'equation array',					// 2588
	'▒': 'of',								// 2592
	'■': 'matrix, ',						// 25A0
	'▭': 'box',								// 25AD
	'☁': 'back color',						// 2601
	'★': 'complex conjugate',				// 2605 (for c.c.)
	'☆': 'conjugate',						// 2606 (for variable conjugate like 𝑧^∗)
	'☟': 'from',							// 261A (as in ∫ from 0 to 1)
	'☝': 'to',								// 261B
	'✎': 'color',							// 270E
	'⟡': 'phantom',							// 27E1
	'⟦': 'open white square bracket',		// 27E6
	'⟧': 'close white square bracket',		// 27E7
	'⟨': 'open angle bracket',				// 27E8
	'⟩': 'close angle bracket',				// 27E9
	'⨯': 'cross',							// 2A2F
	'⬆': 'eigh smash',						// 2B06 - ascent smash
	'⬇': 'd smash',							// 2B07 - descent smash
	'⬌': 'h smash',							// 2B0C - horizontal smash
	'⬢': 'hex',								// 2B22 (for hex in color/back color)
	'⮵': 'to the',							// 2BB5
	'〖': ', ',								// 3016
	'〗': ', ',								// 3017
}

const ordinals = {
	'4': 'fourth', '5': 'fifth', '6': 'sixth', '7': 'seventh', '8': 'eighth',
	'9': 'ninth', '10': 'tenth'
}

const functions = {
	'cos': 'cosine',
	'cot': 'cotangent',
	'csc': 'cosecant',
	'sec': 'secant',
	'sin': 'sine',
	'tan': 'tangent',
	'arccos': 'arccosine',
	'arccot': 'arccotangent',
	'arccos': 'arccosecant',
	'arcsec': 'arcsecant',
	'arcsin': 'arcsine',
	'arctan': 'arctangent',
	'cosh': 'hyperbolic cosine',
	'coth': 'hyperbolic cotangent',
	'csch': 'hyperbolic cosecant',
	'sech': 'hyperbolic secant',
	'sinh': 'hyperbolic sine',
	'tanh': 'hyperbolic tangent',
	'lim': 'limit',
}

function symbolSpeech(ch) {
	let ret = symbolSpeechStrings[ch];
	return ret ? ret + ' ' : ch;
}

function getPower(value) {
	if (value == '2')
		return '²';							// 'squared'

	if (value == '3')
		return '³';							// 'cubed'

	if (inRange('4', value, '10'))
		return '⮵' + ordinals[value] + ' '; // 'to the'

	return '⮵' + speech(value);		// 'to the'
}

function styleSpeech(mathStyle) {
	for (const [key, val] of Object.entries(mathvariants)) {
		if (val == mathStyle)
			return key;
	}
}

function unary(node, op) {
	return op + speech(node.firstElementChild);
}

function binary(node, op) {
	let ret = speech(node.firstElementChild);
	let retd = speech(node.lastElementChild);

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
	return speech(node.firstElementChild) + op1 + speech(node.children[1]) +
		op2 + speech(node.lastElementChild) + ' ';
}

function nary(node, op, cNode) {
	let ret = '';

	for (let i = 0; i < cNode; i++) {
		// Get the rows
		ret += speech(node.children[i]);
		if (i < cNode - 1)
			ret += op;
	}
	return ret;
}


function Nary(node) {
	// symbol 'from' lower-limit 'to' upper-limit 'of'
	return speech(node.firstElementChild) + '☟' +	// 'from'
		speech(node.children[1], true) + '☝' +		// 'to'
		speech(node.lastElementChild, true) + '▒';	// 'of'
}

function handleAccent(value) {
	if (value.lastElementChild.attributes.hasOwnProperty('stretchy'))
		return speech(value.lastElementChild) + '(' + speech(value.firstElementChild, true) + ')';
	return binary(value, '');
}

function speech(value, noAddParens, index) {
	// Convert MathML to UnicodeMath
	let cNode = value.children.length;
	let ret = '';

	switch (value.nodeName) {
		case 'mtable':
			var symbol = '■';
			var sep = '@';
			let intnt = '';
			if (value.parentElement.attributes.hasOwnProperty('intent'))
				intnt = value.parentElement.attributes.intent.nodeValue;

			if (value.attributes.hasOwnProperty('intent') &&
				value.attributes.intent.value == ':equations') {
				symbol = '█';
				sep = '⍈';
				if (intnt == 'cases') {
					sep = '⍆';
					symbol = 'Ⓒ';
				}
			} else if (intnt) {
				for (const [key, val] of Object.entries(matrixIntents)) {
					if (val == intnt) {
						symbol = key;
						break;
					}
				}
			} else if (value.firstElementChild.nodeName == 'mlabeledtr' &&
				value.firstElementChild.children.length == 2 &&
				value.firstElementChild.firstElementChild.firstElementChild.nodeName == 'mtext') {
				// Numbered equation: convert to UnicodeMath like 𝐸=𝑚𝑐²#(20)
				let eqno = value.firstElementChild.firstElementChild.firstElementChild.textContent;
				return speech(value.firstElementChild.lastElementChild.firstElementChild) +
					'#' + eqno.substring(1, eqno.length - 1);
			}
			return symbol + nary(value, sep, cNode) + '¶ ' + symbol;

		case 'mtr':
			var op = '&';
			if (value.parentElement.attributes.hasOwnProperty('intent') &&
				value.parentElement.attributes.intent.textContent.endsWith('equations'))
				op = '';
			return nary(value, op, cNode);

		case 'mtd':
			return nary(value, '', cNode);

		case 'menclose':
			let notation = 'box';
			if (value.attributes.hasOwnProperty('notation'))
				notation = value.attributes.notation.nodeValue;

			for (const [key, val] of Object.entries(symbolClasses)) {
				if (val == notation) {
					let ret = speech(value.firstElementChild, true);
					return key + ' ' + ret + '¶ ' + key;
				}
			}

			while (notation) {
				let attr = notation.match(/[a-z]+/)[0];
				notation = notation.substring(attr.length + 1);
				for (const [key, val] of Object.entries(maskClasses)) {
					if (val == attr)
						mask += Number(key);
				}
			}
			if (mask) {
				ret = speech(value.firstElementChild, true);
				return '▭(' + (mask ^ 15) + '&' + ret + ')';
			}
			return unary(value, '▭');

		case 'mphantom':
			return unary(value, '⟡');       // Full size, no display

		case 'mpadded':
			var op = '';
			var mask = 0;                   // Compute phantom mask

			if (value.attributes.width && value.attributes.width.nodeValue == '0')
				mask = 2;                   // fPhantomZeroWidth
			if (value.attributes.height && value.attributes.height.nodeValue == '0')
				mask |= 4;                  // fPhantomZeroAscent
			if (value.attributes.depth && value.attributes.depth.nodeValue == '0')
				mask |= 8;                  // fPhantomZeroDescent

			if (value.firstElementChild.nodeName == 'mphantom') { // No display
				if (mask == 2)
					op = '⇳';               // fPhantomZeroWidth
				else if (mask == 12)
					op = '⬄';              // fPhantomZeroAscent | fPhantomZeroDescent
				return op ? op + speech(value.firstElementChild).substring(1)
					: '⟡(' + mask + '&' + speech(value.firstElementChild.firstElementChild, true) + ')';
			}
			const opsShow = { 2: '⬌', 4: '⬆', 8: '⬇', 12: '⬍' };
			op = opsShow[mask];
			mask |= 1;                      // fPhantomShow

			return op ? unary(value, op)
				: '⟡(' + mask + '&' + speech(value.firstElementChild, true) + ')';

		case 'mstyle':
			ret = speech(value.firstElementChild);
			if (value.attributes.hasOwnProperty('mathcolor')) {
				let color = value.attributes.mathcolor.value;
				if (color[0] == '#')
					color = '⬢ ' + color.substring(1) + '⏳';
				ret = '✎' + color + ' ' + ret + '¶ ✎';
			}
			if (value.attributes.hasOwnProperty('mathbackground')) {
				let color = value.attributes.mathbackground.value;
				if (color[0] == '#')
					color = '⬢ ' + color.substring(1) + '⏳';
				ret = '☁' + color + ' ' + ret + '¶ ☁';
			}
			return ret;

		case 'msqrt':
			ret = speech(value.firstElementChild, true);
			return needParens(ret) ? '√▒' + ret + '¶ √' : '√▒' + ret;

		case 'mroot':
			return '⒭' + speech(value.lastElementChild, true) + '▒ ' +
				speech(value.firstElementChild, true) + '¶ ⒭';

		case 'mfrac':
			var op = '/';
			let num = speech(value.firstElementChild, true);
			let den = speech(value.lastElementChild, true);

			if (value.attributes.hasOwnProperty('linethickness')) {
				var val = value.attributes.linethickness.nodeValue;
				if (val == '0' || val == '0.0pt') {
					op = '¦';
					if (value.parentElement.attributes.hasOwnProperty('intent') &&
						value.parentElement.attributes.intent.nodeValue.startsWith('binomial-coefficient') ||
						value.parentElement.firstElementChild.attributes.title &&
						value.parentElement.firstElementChild.attributes.title.nodeValue == 'binomial coefficient') {
						ret = (needParens(num) ? '(' + num + ')' : num) + ' ⒞';
						ret += (needParens(den) ? '(' + den + ')' : den) + ' ';
						op = '⒞';
					}
				}
			}
			if (op == '/') {
				if (needParens(num) || needParens(den)) {
					ret = '⍁' + num + "/" + den + '¶ ⍁';
				} else if (isAsciiDigit(num) && (isAsciiDigit(den) || den == '10')) {
					ret = (num == '1')
						? getUnicodeFraction(num, den)
						: num + String.fromCodePoint(den.charCodeAt(0) + 0x2050);
				} else {
					ret = num + '/' + den;
				}
			} else if (op != '⒞') {
				ret = binary(value, op);
			}
			if (value.previousElementSibling && value.previousElementSibling.nodeName != 'mo')
				ret = '⏳' + ret;		// Pause betw. variable & numerator
			return ret;

		case 'msup':
			if (value.lastElementChild.nodeName == 'mn' &&
				isAsciiDigit(value.lastElementChild.textContent[0])) {
				let power = getPower(value.lastElementChild.textContent);
				return speech(value.firstElementChild) + power;
			}
			if (value.lastElementChild.attributes.hasOwnProperty('intent') &&
				value.lastElementChild.attributes.intent.nodeValue == 'transpose') {
				return speech(value.firstElementChild) + '⏉';	// 'transpose'
			}
			var op = '⮵ ';				// 'to the'
			if (isPrime(value.lastElementChild.textContent))
				op = '';
			else if (value.lastElementChild.textContent == '∗')
				return speech(value.firstElementChild) + '☆';
			return binary(value, op);

		case 'mover':
			return value.attributes.hasOwnProperty('accent')
				? handleAccent(value) : binary(value, '┴');

		case 'munder':
			if (value.attributes.hasOwnProperty('accentunder'))
				return handleAccent(value);

			if (value.firstElementChild.innerHTML == 'lim') {
				return speech(value.firstElementChild) + '⍨' +
					speech(value.lastElementChild, true) + '▒';
			}
			if (value.firstElementChild.nodeName != 'mi')
				return binary(value, '┬');
			                                // Fall through to msub
		case 'msub':
			return binary(value, '_');

		case 'munderover':
			if (!value.parentElement.attributes.hasOwnProperty('intent') ||
				isNary(value.firstElementChild.innerHTML))
					return Nary(value);
			return ternary(value, '┬', '┴');

		case 'msubsup':
			return isNary(value.firstElementChild.innerHTML)
				? Nary(value) : ternary(value, '_', '⮵');	// 'to the'

		case 'mmultiscripts':
			ret = '';
			if (value.children[3].nodeName == 'mprescripts') {
				if (value.children[4].nodeName != 'none')
					ret = '_' + speech(value.children[4]);
				if (value.children[5].nodeName != 'none')
					ret += '^' + speech(value.children[5]);
				if (ret)
					ret += ' ';
			}
			ret += speech(value.children[0]);
			if (value.children[1].nodeName != 'none')
				ret += '_' + speech(value.children[1]);
			if (value.children[2].nodeName != 'none')
				ret += '^' + speech(value.children[2]);
			return ret;

		case 'mfenced':
			var opOpen = value.attributes.hasOwnProperty('open') ? value.attributes.open : '(';
			var opClose = value.attributes.hasOwnProperty('close') ? value.attributes.close : ')';
			var opSeparators = value.attributes.hasOwnProperty('separators') ? value.attributes.separators : ',';
			var cSep = opSeparators.length;

			ret = opOpen;
			for (let i = 0; i < cNode; i++) {
				ret += speech(value.children[i]);
				if (i < cNode - 1)
					ret += i < cSep - 1 ? opSeparators[i] : opSeparators[cSep - 1];
			}
			return ret + opClose;

		case 'mo':
			var val = value.innerHTML;
			if (val == '\u2062')				// Ignore invisible times
				return '';

			if (val[0] == '&') {
				if (val.startsWith('&#') && val.endsWith(';')) {
					ret = value.innerHTML.substring(2, val.length - 1);
					if (ret[0] == 'x')
						ret = '0' + ret;
					val = String.fromCodePoint(ret);
				} else switch (val) {
					case '&ApplyFunction;':
						val = '\u2061';
						break;
					case '&lt;':
						val = '<';
						break;
					case '&gt;':
						val = '>';
						break;
				}
			}
			if (value.attributes.title) {
				// The DLMF title attribute implies the following intents
				// (see also for 'mi')
				switch (value.attributes.title.textContent) {
					case 'differential':
					case 'derivative':
						return 'ⅆ';
					case 'binomial coefficient':
						return '';
				}
			}
			return val;

		case 'mi':
			let c = value.innerHTML;
			if (value.attributes.hasOwnProperty('intent')) {
				let ch = value.attributes.intent.nodeValue;
				if (isDoubleStruck(ch))
					c = ch;
			}
			if (value.attributes.hasOwnProperty('mathvariant')) {
				// Convert to Unicode math alphanumeric. Conversion to speech
				// is done upon returning from the original speech() call.
				let mathstyle = mathvariants[value.attributes.mathvariant.nodeValue];
				if (c in mathFonts && mathstyle in mathFonts[c])
					c = mathFonts[c][mathstyle];
			} else if (c in functions) {
				c = functions[c] + ' ';
			}
			return c;

		case 'mn':
			return value.innerHTML;

		case 'mtext':
			if (value.textContent == 'c.c.')
				return '★';					// 'complex conjugate'
			return value.textContent + ' ';

		case 'mspace':
			if (value.attributes.hasOwnProperty('width')) {
				for (let i = 0; i < spaceWidths.length; i++) {
					if (value.attributes.width.nodeValue == spaceWidths[i])
						return uniSpaces[i];
				}
			}
			break;
	}

	let mrowIntent = value.nodeName == 'mrow' && value.attributes.hasOwnProperty('intent')
		? value.attributes.intent.nodeValue : '';

	for (var i = 0; i < cNode; i++) {
		let node = value.children[i];
		ret += speech(node, false, i);
	}

	if (mrowIntent) {
		if (mrowIntent == 'cases')
			return 'Ⓒ' + ret.substring(2);

		if (mrowIntent == ':fenced' && !value.lastElementChild.textContent)
			return !value.firstElementChild.textContent ? '〖' + ret + '〗' : ret + '┤';

		if (mrowIntent.startsWith('absolute-value')) {
			ret = ret.substring(1, ret.length - 1); // Remove '|'s
			return '⒜' + ret + 'end absolute value';
		}
		if (mrowIntent.startsWith('binomial-coefficient')) {
			// Remove enclosing parens for 𝑛⒞𝑘
			return ret.substring(1, ret.length - 1);
		}
		if (mrowIntent.endsWith('matrix') || mrowIntent.endsWith('determinant')) {
			// Remove enclosing parens for bracketed matrices
			ret = ret[1] + ret.substring(3, ret.length - 2) + '¶ ' + ret[1];
		}
		else if (mrowIntent == ':function' && value.previousElementSibling &&
			value.firstElementChild.nodeName == 'mi' &&
			value.firstElementChild.textContent < '\u2100' &&
			value.previousElementSibling.nodeName == 'mi') {
			return ' ' + ret;               // Separate variable & function name
		}
	}
	if (value.firstElementChild && value.firstElementChild.nodeName == 'mo' &&
		'([{'.includes(value.firstElementChild.textContent)) {
		if (value.lastElementChild.nodeName != 'mo' || !value.lastElementChild.textContent)
			ret += '┤';						// Happens for DLMF pmml
	}
	if (cNode > 1 && value.nodeName != 'math' && !noAddParens &&
		(!mrowIntent || mrowIntent != ':fenced') &&
		isMathMLObject(value.parentElement) && needParens(ret)) {
			ret = '(' + ret + ')';
	}
	return ret;
}

function MathMLtoSpeech(mathML) {
	// Convert MathML to speech
	if (mathML.startsWith('<mml:math') || mathML.startsWith('<m:math'))
		mathML = removeMmlPrefixes(mathML);

	const parser = new DOMParser();			// Parse mathML
	const doc = parser.parseFromString(mathML, "application/xml");
	let text = speech(doc);					// Get speech symbols
	let ret = '';							// Collects speech
	let ch;									// Current char
	let cchCh;								// Code count of current

	// Convert symbols to words and eliminate some spaces
	for (let i = 0; i < text.length; i += cchCh) {
		let mathstyle = '';
		let code = text.codePointAt(i);
		cchCh = code > 0xFFFF ? 2 : 1;

		if (text[i] == '\u2061') {
			if(ch != ' ')
				ret += ' ';
			ch = ' ';
			continue;
		}

		if (text[i] == ' ') {
			if (ch != ' ') {
				ret += ' ';
				ch = ' ';
			}
			continue;
		}
		if (text[i] == '(' && ret.length > 1 && isAsciiAlphabetic(ret[ret.length - 2])) {
			let code = text.codePointAt(i + 1);
			let cchCh = code > 0xFFFF ? 2 : 1;

			if (text[i + cchCh + 1] == ')') {
				// If parens enclose a single char & are preceded by a letter,
				// say 'of' + char instead of '(' + char + ')'. For example,
				// say 'f of x' instead of 'f(x)'.
				let ch1 = String.fromCodePoint(code);
				[mathstyle, ch1] = foldMathAlphanumeric(code, ch1);
				if (ch1 > 'z')
					ch1 = symbolSpeech(ch1);
				ret += symbolSpeech('▒') + ch1;
				if (!'/='.includes(text[i + cchCh + 2]))
					ret += symbolSpeech('⏳');
				else
					ret += ' ';
				i += cchCh + 1;
				continue;
			}
		}
		if (isAsciiDigit(ch) && !isAsciiDigit(text[i]))
			ret += ' ';
		ch = text.substring(i, i + cchCh);

		if (isAsciiAlphanumeric(ch) && ch != '_') {
			ret += ch;
			continue;
		}
		let c = symbolSpeech(ch);
		if (c != ch) {
			ch = c;
			if (i && isAsciiAlphabetic(text[i - 1]))
				ret += ' ';
			ret += ch;
			ch = ' ';
			continue;
		}

		// Handle math alphanumerics
		if (code > 122) {					// 'z'
			[mathstyle, ch] = foldMathAlphanumeric(code, ch);
			if (ch > 'z')
				ch = symbolSpeech(ch);		// Greek
		}
		if (mathstyle) {
			if (mathstyle == 'mit' || mathstyle == 'mup')
				mathstyle = '';				// Suppress 'italic'
			else
				mathstyle = styleSpeech(mathstyle) + ' ';
		}
		let cap = inRange('A', ch, 'Z') ? 'cap ' : '';
		if (ch == 'a' || ch == 'A')
			ch = 'eigh';
		ret += mathstyle + cap + ch + ' ';
		ch = ' ';
	}
	return ret;
}