// Math Nemeth braille code

function MathMLtoBraille(mathML) {
	const doc = getMathMLDOM(mathML);
	let text = braille(doc, false, '');		// Get braille symbols
	let ret = '';							// Collects speech
	let cchCh;								// Code count of current char
	let ch;									// Current char
	let code;								// UTF-32 code of current char

	if (isAsciiDigit(text[0]))				// Prefix numeric indicator since
		ret = '⠼';							//  digit starts expression

	// Convert symbols to braille chars
	for (let i = 0; i < text.length; i += cchCh) {
		code = text.codePointAt(i);
		cchCh = code > 0xFFFF ? 2 : 1;
		ch = text.substring(i, i + cchCh);
		if (isAsciiDigit(ch) && ret[ret.length - 1] == '\u2800') {
			// Need numeric indicator after braille space;
			ret += '⠼';
		}
		ch = symbolBraille(ch);
		if (ch[0] == '\u2800' && ret[ret.length - 1] == '⠐') {
			// Braille space returns to base line, so don't need '⠐'
			ret = ret.substring(0, ret.length - 1);
		}
		ret += ch;
	}
	if (ret[ret.length - 1] == '⠐') {
		// Don't need '⠐' at end either
		ret = ret.substring(0, ret.length - 1);
	}
	return ret;
}

const symbolBrailleStrings = {

	// Math symbol braille strings in braille order
	'\u2524': '',				// ┤	Missing close bracket
	'\u2061': '⠀',				//		Use braille space for function apply
	'\u2062': '',				//		Ignore invisible times
	'\u2026': '⠀⠄⠄⠄',			// …	Ellipsis
	'\u2235': '⠀⠈⠌⠀',			// ∵	Because
	'\u2208': '⠀⠈⠑⠀',			// ∈	Element of
	'\u220B': '⠀⠈⠢⠀',			// ∋	Contains as member
	'\u224E': '⠀⠈⠣⠠⠣⠀',			// ≎		Geometrically equivalent to
	'\u2AAE': '⠀⠈⠣⠨⠅⠀',			// ⪮	Equals sign with bumpy above
	'\u224F': '⠀⠈⠣⠱⠀',			// ≏		Difference between
	'\u223C': '⠀⠈⠱⠀',			// ∼		Tilde operator
	'\u2AF3': '⠀⠈⠱⠈⠫⠇⠻⠀',		// ⫳	Parallel w tilde operator
	'\u2248': '⠀⠈⠱⠈⠱⠀',			// ≈	Almost equal to
	'\u224B': '⠀⠈⠱⠈⠱⠈⠱⠀',		// ≋		Triple tilde
	'\u2A70': '⠀⠈⠱⠈⠱⠨⠅⠀',		// ⩰	Approximately equal or equal to
	'\u224A': '⠀⠈⠱⠈⠱⠱⠀',		// ≊		Almost equal or equal to
	'\u2A9D': '⠀⠈⠱⠐⠅⠀',			// ⪝	Similar or less than
	'\u2A9F': '⠀⠈⠱⠐⠅⠨⠅⠀',		// ⪟	Similar above less than above equals sign
	'\u2A9E': '⠀⠈⠱⠨⠂⠀',			// ⪞	Similar or greater than
	'\u2AA0': '⠀⠈⠱⠨⠂⠨⠅⠀',		// ⪠	Similar above greater than above equals sign
	'\u2245': '⠀⠈⠱⠨⠅⠀',			// ≅		Approximately equal to
	'\u2243': '⠀⠈⠱⠱⠀',			// ≃		Asymptotically equal to
	'\u2A6C': '⠀⠈⠱⠱⠈⠱⠀',		// ⩬	Similar minus similar
	'\u2209': '⠀⠌⠈⠑⠀',			// ∉		Not an element of
	'\u220C': '⠀⠌⠈⠢⠀',			// ∌		Does not contain as member
	'\u226D': '⠀⠌⠈⠣⠠⠣⠀',		// ≭		Not equivalent to
	'\u226E': '⠀⠌⠐⠅⠀',			// ≮		Not less than
	'\u2274': '⠀⠌⠐⠅⠈⠱⠀',		// ≴		Neither less than nor equivalent to
	'\u2278': '⠀⠌⠐⠅⠨⠂⠀',		// ≸		Neither less than nor greater than
	'\u2270': '⠀⠌⠐⠅⠱⠀',			// ≰		Neither less than nor equal to
	'\u226F': '⠀⠌⠨⠂⠀',			// ≯		Not greater than
	'\u2275': '⠀⠌⠨⠂⠈⠱⠀',		// ≵		Neither greater than nor equivalent to
	'\u2279': '⠀⠌⠨⠂⠐⠅⠀',		// ≹		Neither greater than nor less than
	'\u2271': '⠀⠌⠨⠂⠱⠀',			// ≱		Neither greater than nor equal to
	'\u2260': '⠀⠌⠨⠅⠀',			// ≠	Not equal to
	'\u2226': '⠀⠌⠫⠇⠀',			// ∦		Not parallel to
	'\u2262': '⠀⠌⠸⠇⠀',			// ≢	Not identical to
	'\u2284': '⠀⠌⠸⠐⠅⠀',			// ⊄		Not a subset of
	'\u2288': '⠀⠌⠸⠐⠅⠱⠀',		// ⊈		Neither a subset of nor equal to
	'\u2285': '⠀⠌⠸⠨⠂⠀',			// ⊅		Not a superset of
	'\u2289': '⠀⠌⠸⠨⠂⠱⠀',		// ⊉		Neither a superset of nor equal to
	'\u2236': '⠀⠐⠂⠀',			// ∶	Ratio
	'\u2A74': '⠀⠐⠂⠐⠂⠨⠅⠀',		// ⩴	Double colon equal
	'\u2254': '⠀⠐⠂⠨⠅⠀',			// ≔		Colon equals
	'\u003C': '⠀⠐⠅⠀',			// <	less than sign
	'\u22D8': '⠀⠐⠅⠈⠐⠅⠈⠐⠅⠻⠀',	// ⋘		Much less than
	'\u226A': '⠀⠐⠅⠈⠐⠅⠻⠀',		// ≪	Much less than
	'\u2A79': '⠀⠐⠅⠈⠨⠡⠻⠀',		// ⩹	Less than w circle inside
	'\u2272': '⠀⠐⠅⠈⠱⠀',			// ≲		less than or equivalent to
	'\u2A85': '⠀⠐⠅⠈⠱⠈⠱⠀',		// ⪅	less than or approximate
	'\u2A8F': '⠀⠐⠅⠈⠱⠨⠂⠀',		// ⪏	less than above similar above greater than
	'\u2A8D': '⠀⠐⠅⠈⠱⠱⠀',		// ⪍	less than above similar or equal to
	'\u2268': '⠀⠐⠅⠌⠨⠅⠀',		// ≨		less than but not equal to
	'\u2276': '⠀⠐⠅⠨⠂⠀',			// ≶		less than or greater than
	'\u2A91': '⠀⠐⠅⠨⠂⠨⠅⠀',		// ⪑	less than above greater than above double - line equal
	'\u2266': '⠀⠐⠅⠨⠅⠀',			// ≦	less than over equal to
	'\u2A8B': '⠀⠐⠅⠨⠅⠨⠂⠀',		// ⪋	less than above double - line equal above greater than
	'\u2264': '⠀⠐⠅⠱⠀',			// ≤	less than or equal to
	'\u22F5': '⠀⠐⠈⠑⠣⠡⠻⠀',		// ⋵	Element of w dot above
	'\u2A6F': '⠀⠐⠈⠱⠈⠱⠣⠸⠣⠻⠀',	// ⩯	Almost equal to w circumflex
	'\u2A6A': '⠀⠐⠈⠱⠣⠡⠻⠀',		// ⩪	Tilde operator w dot above
	'\u2A6D': '⠀⠐⠈⠱⠨⠅⠣⠡⠻⠀',		// ⩭	Congruent w dot above
	'\u223B': '⠀⠐⠈⠱⠩⠡⠣⠡⠻⠀',		// ∻		Homothetic
	'\u2A7B': '⠀⠐⠐⠅⠣⠸⠦⠻⠀',		// ⩻	less than w question mark above
	'\u223A': '⠀⠐⠤⠩⠡⠡⠣⠡⠡⠻⠀',	// ∺		Geometric proportion
	'\u2A7C': '⠀⠐⠨⠂⠣⠸⠦⠻⠀',		// ⩼	greater than w question mark above
	'\u2A6E': '⠀⠐⠨⠅⠣⠈⠼⠻⠀',		// ⩮	Equals w asterisk
	'\u225E': '⠀⠐⠨⠅⠣⠍⠻⠀',		// ≞		Measured by
	'\u225D': '⠀⠐⠨⠅⠣⠙⠑⠋⠻⠀',		// ≝		Equal to by definition
	'\u2250': '⠀⠐⠨⠅⠣⠡⠻⠀',		// ≐		Approaches the limit
	'\u2257': '⠀⠐⠨⠅⠣⠨⠡⠻⠀',		// ≗		Ring equal to
	'\u2258': '⠀⠐⠨⠅⠣⠫⠁⠻⠀',		// ≘		Corresponds to
	'\u225B': '⠀⠐⠨⠅⠣⠫⠎⠻⠀',		// ≛		Star equals
	'\u225C': '⠀⠐⠨⠅⠣⠫⠞⠻⠀',		// ≜		Delta equal to
	'\u225F': '⠀⠐⠨⠅⠣⠸⠢⠻⠀',		// ≟		Questioned equal to
	'\u2259': '⠀⠐⠨⠅⠣⠸⠣⠻⠀',		// ≙		Estimates
	'\u225A': '⠀⠐⠨⠅⠣⠸⠩⠻⠀',		// ≚		Equiangular to
	'\u2A77': '⠀⠐⠨⠅⠩⠡⠡⠣⠡⠡⠻⠀',	// ⩷	Equals sign w two dots above and two dots below
	'\u2251': '⠀⠐⠨⠅⠩⠡⠣⠡⠻⠀',		// ≑		Geometrically equal to
	'\u2A66': '⠀⠐⠨⠅⠩⠡⠻⠀',		// ⩦	Equals sign w dot below
	'\u2A78': '⠀⠐⠸⠇⠣⠡⠡⠡⠡⠻⠀',	// ⩸	Equivalent w four dots above
	'\u2A67': '⠀⠐⠸⠇⠣⠡⠻⠀',		// ⩧	Identical w dot above
	'\u2AC1': '⠀⠐⠸⠐⠅⠩⠈⠡⠻⠀',		// ⫁	Subset with multiplication sign below
	'\u2ABF': '⠀⠐⠸⠐⠅⠩⠬⠻⠀',		// ⪿	Subset with plus sign below
	'\u2AC2': '⠀⠐⠸⠨⠂⠩⠈⠡⠻⠀',		// ⫂	Superset with multiplication sign below
	'\u2AC0': '⠀⠐⠸⠨⠂⠩⠬⠻⠀',		// ⫀	Superset with plus sign below
	'\u22EF': '⠀⠄⠄⠄ ',			// ⋯		Midline horizontal ellipsis
	'\u22F0': '⠀⠘⠒⠒⠒⠀',			// ⋰		Up right diagonal ellipsis
	'\u2234': '⠀⠠⠡⠀',			// ∴	Therefore
	'\u223D': '⠀⠠⠱⠀',			// ∽	Reversed tilde
	'\u224C': '⠀⠠⠱⠨⠅⠀',			// ≌		All equal to
	'\u22CD': '⠀⠠⠱⠱⠀',			// ⋍		Reversed tilde equals
	'\u22D6': '⠀⠡⠈⠐⠅⠻⠀',		// ⋖		less than w dot
	'\u22D7': '⠀⠡⠈⠨⠂⠻⠀',		// ⋗		greater than w dot
	'\u2ABD': '⠀⠡⠈⠸⠐⠅⠻⠀',		// ⪽	Subset w dot
	'\u2ABE': '⠀⠡⠈⠸⠨⠂⠻⠀',		// ⪾	Superset w dot
	'\u2239': '⠀⠤⠐⠂⠀',			// ∹		Excess
	'\u003E': '⠀⠨⠂⠀',			// >	Greater than sign
	'\u22D9': '⠀⠨⠂⠈⠨⠂⠈⠨⠂⠻⠀',	// ⋙		Much greater than
	'\u226B': '⠀⠨⠂⠈⠨⠂⠻⠀',		// ≫	Much greater than
	'\u2A7A': '⠀⠨⠂⠈⠨⠡⠻⠀',		// ⩺	Greater than w circle inside
	'\u2273': '⠀⠨⠂⠈⠱⠀',			// ≳		Greater than or equivalent to
	'\u2A86': '⠀⠨⠂⠈⠱⠈⠱⠀',		// ⪆	Greater than or approximate
	'\u2A90': '⠀⠨⠂⠈⠱⠐⠅⠀',		// ⪐	Greater than above similar above less than
	'\u2A8E': '⠀⠨⠂⠈⠱⠱⠀',		// ⪎	Greater than above similar or equal to
	'\u2269': '⠀⠨⠂⠌⠨⠅⠀',		// ≩		Greater than but not equal to
	'\u2277': '⠀⠨⠂⠐⠅⠀',			// ≷		Greater than or less than
	'\u2A92': '⠀⠨⠂⠐⠅⠨⠅⠀',		// ⪒	Greater than above less than above double - line equal
	'\u2267': '⠀⠨⠂⠨⠅⠀',			// ≧	Greater than over equal to
	'\u2A8C': '⠀⠨⠂⠨⠅⠐⠅⠀',		// ⪌	Greater than above double - line equal above less than
	'\u2265': '⠀⠨⠂⠱⠀',			// ≥	Greater than or equal to
	'\u003D': '⠀⠨⠅⠀',			// =	Equals sign
	'\u2A73': '⠀⠨⠅⠈⠱⠀',			// ⩳	Equals sign above tilde operator
	'\u2255': '⠀⠨⠅⠐⠂⠀',			// ≕		Equals colon
	'\u2A99': '⠀⠨⠅⠐⠅⠀',			// ⪙	Double - line equal to or less than
	'\u2A9A': '⠀⠨⠅⠨⠂⠀',			// ⪚	Double - line equal to or greater than
	'\u2A75': '⠀⠨⠅⠨⠅⠀',			// ⩵	Two consecutive equals signs
	'\u2A76': '⠀⠨⠅⠨⠅⠨⠅⠀',		// ⩶	Three consecutive equals signs
	'\u2A71': '⠀⠨⠅⠬⠀',			// ⩱	Equals sign above plus sign
	'\u227A': '⠀⠨⠐⠅⠀',			// ≺		Precedes
	'\u2ABB': '⠀⠨⠐⠅⠈⠨⠐⠅⠻⠀',		// ⪻	Double precedes
	'\u227E': '⠀⠨⠐⠅⠈⠱⠀',		// ≾		Precedes or equivalent to
	'\u2AB7': '⠀⠨⠐⠅⠈⠱⠈⠱⠀',		// ⪷	Precedes above almost equals to
	'\u2AB9': '⠀⠨⠐⠅⠌⠈⠱⠈⠱⠀',		// ⪹	Precedes above not almost equals to
	'\u2AB5': '⠀⠨⠐⠅⠌⠨⠅⠀',		// ⪵	Precedes above not equal to
	'\u2AB1': '⠀⠨⠐⠅⠌⠱⠀',		// ⪱	Precedes above single - line not equal to
	'\u2AB3': '⠀⠨⠐⠅⠨⠅⠀',		// ⪳	Precedes above equals sign
	'\u2AAF': '⠀⠨⠐⠅⠱⠀',			// ⪯	Precedes above single - line equals sign
	'\u2256': '⠀⠨⠡⠈⠨⠅⠻⠀',		// ≖		Ring in equal to
	'\u21F4': '⠀⠨⠡⠈⠫⠒⠒⠕⠻⠀',		// ⇴	Right arrow w small circle
	'\u2B30': '⠀⠨⠡⠈⠫⠪⠒⠒⠻⠀',		// ⬰	Left arrow w small circle
	'\u27C3': '⠀⠨⠡⠈⠸⠐⠅⠻⠀',		// ⟃	Open subset
	'\u27C4': '⠀⠨⠡⠈⠸⠨⠂⠻⠀',		// ⟄	Open superset
	'\u227B': '⠀⠨⠨⠂⠀',			// ≻		Succeeds
	'\u2ABC': '⠀⠨⠨⠂⠈⠨⠨⠂⠻⠀',		// ⪼	Double succeeds
	'\u227F': '⠀⠨⠨⠂⠈⠱⠀',		// ≿		Succeeds or equivalent to
	'\u2AB8': '⠀⠨⠨⠂⠈⠱⠈⠱⠀',		// ⪸	Succeeds above almost equals to
	'\u2ABA': '⠀⠨⠨⠂⠌⠈⠱⠈⠱⠀',		// ⪺	Succeeds above not almost equals to
	'\u2AB6': '⠀⠨⠨⠂⠌⠨⠅⠀',		// ⪶	Succeeds above not equal to
	'\u2AB2': '⠀⠨⠨⠂⠌⠱⠀',		// ⪲	Succeeds above single - line not equal to
	'\u2AB4': '⠀⠨⠨⠂⠨⠅⠀',		// ⪴	Succeeds above equals sign
	'\u2AB0': '⠀⠨⠨⠂⠱⠀',			// ⪰	Succeeds above single - line equals sign
	'\u22EE': '⠀⠩⠒⠒⠒⠀',			// ⋮		Vertical ellipsis
	'\u2322': '⠀⠫⠁⠀',			// ⌢ 	Frown
	'\u2323': '⠀⠫⠄⠀',			// ⌣ 	Smile
	'\u2225': '⠀⠫⠇⠀',			// ∥	Parallel to
	'\u21BC': '⠀⠫⠈⠪⠒⠒⠀',		// ↼		Leftwards harpoon w barb upwards
	'\u21CB': '⠀⠫⠈⠪⠒⠒⠫⠒⠒⠠⠕⠀',	// ⇋		Leftwards harpoon over rightwards harpoon
	'\u21AA': '⠀⠫⠈⠯⠒⠒⠕⠀',		// ↪		Rightwards arrow w hook
	'\u27C2': '⠀⠫⠏⠀',			// ⊥	Perpendicular
	'\u22A5': '⠀⠫⠏⠀',			// ⊥	Up tack(See also 27C2)
	'\u21E2': '⠀⠫⠒⠀⠒⠕⠀',		// ⇢		Rightwards dashed arrow
	'\u21C0': '⠀⠫⠒⠒⠈⠕⠀',		// ⇀		Rightwards harpoon w barb upwards
	'\u21CC': '⠀⠫⠒⠒⠈⠕⠫⠠⠪⠒⠒⠀',	// ⇌		Rightwards harpoon over leftwards harpoon
	'\u27F6': '⠀⠫⠒⠒⠒⠕⠀',		// ⟶	Long rightwards arrow
	'\u2192': '⠀⠫⠒⠒⠕⠀',			// →	Rightwards arrow
	'\u21A0': '⠀⠫⠒⠒⠕⠕⠀',		// ↠		Rightwards two headed arrow
	'\u21C9': '⠀⠫⠒⠒⠕⠫⠒⠒⠕⠀',		// ⇉		Rightwards paired arrows
	'\u21F6': '⠀⠫⠒⠒⠕⠫⠒⠒⠕⠫⠒⠒⠕⠀',	// ⇶	Three rightwards arrows
	'\u21C4': '⠀⠫⠒⠒⠕⠫⠪⠒⠒⠀',		// ⇄		Rightwards arrow over leftwards arrow
	'\u21E5': '⠀⠫⠒⠒⠕⠳⠀',		// ⇥		Rightwards arrow to bar
	'\u21C1': '⠀⠫⠒⠒⠠⠕⠀',		// ⇁		Rightwards harpoon w barb downwards
	'\u27DE': '⠀⠫⠒⠒⠳⠀',			// ⟞	Long left tack
	'\u22B8': '⠀⠫⠒⠨⠡⠀',			// ⊸		Multimap
	'\u22A3': '⠀⠫⠒⠳⠀',			// ⊣		Left tack
	'\u219D': '⠀⠫⠔⠒⠢⠕⠀',		// ↝		Rightwards wave arrow
	//'\u2192': '⠀⠫⠕⠀',			// →	Rightwards arrow
	'\u2197': '⠀⠫⠘⠒⠒⠕⠀',		// ↗		North east arrow
	'\u2196': '⠀⠫⠘⠪⠒⠒⠀',		// ↖		North west arrow
	'\u2921': '⠀⠫⠘⠪⠒⠒⠕⠀',		// ⤡	North west and south east arrow
	'\u21D6': '⠀⠫⠘⠪⠶⠶⠀',		// ⇖		North west double arrow
	'\u21D7': '⠀⠫⠘⠶⠶⠕⠀',		// ⇗		North east double arrow
	'\u21BD': '⠀⠫⠠⠪⠒⠒⠀',		// ↽		Leftwards harpoon w barb downwards
	'\u224D': '⠀⠫⠠⠫⠈⠀',			// ≍		Equivalent to
	'\u21A3': '⠀⠫⠠⠯⠒⠒⠕⠀',		// ↣		Rightwards arrow w tail
	'\u22B7': '⠀⠫⠡⠒⠨⠡⠀',		// ⊷		Image of
	'\u21BA': '⠀⠫⠢⠔⠕⠀',			// ↺		Anticlockwise open circle arrow
	'\u21DD': '⠀⠫⠢⠤⠔⠒⠢⠕⠀',		// ⇝		Rightwards squiggle arrow
	'\u27FF': '⠀⠫⠢⠤⠔⠒⠢⠤⠔⠒⠢⠕⠀',	// ⟿	Long rightwards squiggle arrow
	'\u21E1': '⠀⠫⠣⠒⠀⠒⠕⠀',		// ⇡	Upwards dashed arrow
	'\u21BF': '⠀⠫⠣⠒⠒⠈⠕⠀',		// ↿		Upwards harpoon w barb leftwards
	'\u2191': '⠀⠫⠣⠒⠒⠕⠀',		// ↑	Upwards arrow
	'\u21C8': '⠀⠫⠣⠒⠒⠕⠐⠫⠣⠒⠒⠕⠀',	// ⇈		Upwards paired arrows
	'\u21C5': '⠀⠫⠣⠒⠒⠕⠐⠫⠩⠒⠒⠕⠀',	// ⇅		Upwards arrow leftwards of downwards arrow
	'\u219F': '⠀⠫⠣⠒⠒⠕⠕⠀',		// ↟		Upwards two headed arrow
	'\u21BE': '⠀⠫⠣⠒⠒⠠⠕⠀',		// ↾		Upwards harpoon w barb rightwards
	'\u2AF0': '⠀⠫⠣⠨⠡⠒⠒⠀',		// ⫰		Vertical line w circle below
	'\u2AF1': '⠀⠫⠣⠨⠡⠒⠒⠳⠀',		// ⫱		Down tack w circle below
	'\u2195': '⠀⠫⠣⠪⠒⠒⠕⠀',		// ↕	Up down arrow
	'\u21A8': '⠀⠫⠣⠪⠒⠒⠕⠳⠀',		// ↨	Up down arrow w base
	'\u21D5': '⠀⠫⠣⠪⠶⠶⠕⠀',		// ⇕		Up down double arrow
	'\u21A5': '⠀⠫⠣⠳⠒⠒⠕⠀',		// ↥		Upwards arrow from bar
	'\u21D1': '⠀⠫⠣⠶⠶⠕⠀',		// ⇑		Upwards double arrow
	'\u27DC': '⠀⠫⠨⠡⠒⠒⠀',		// ⟜	Left multimap
	'\u22B6': '⠀⠫⠨⠡⠒⠡⠀',		// ⊶		Original of
	'\u21E3': '⠀⠫⠩⠒⠀⠒⠕⠀',		// ⇣	Downwards dashed arrow
	'\u21C2': '⠀⠫⠩⠒⠒⠈⠕⠀',		// ⇂		Downwards harpoon w barb rightwards
	'\u2193': '⠀⠫⠩⠒⠒⠕⠀',		// ↓	Downwards arrow
	'\u21F5': '⠀⠫⠩⠒⠒⠕⠐⠫⠣⠒⠒⠕⠀',	// ⇵	Downwards arrow leftwards of upwards arrow
	'\u21CA': '⠀⠫⠩⠒⠒⠕⠐⠫⠩⠒⠒⠕⠀',	// ⇊		Downwards paired arrows
	'\u21A1': '⠀⠫⠩⠒⠒⠕⠕⠀',		// ↡		Downwards two headed arrow
	'\u21C3': '⠀⠫⠩⠒⠒⠠⠕⠀',		// ⇃		Downwards harpoon w barb leftwards
	'\u21AF': '⠀⠫⠩⠔⠢⠔⠕⠀',		// ↯		Downwards zigzag arrow
	'\u21B4': '⠀⠫⠩⠠⠳⠒⠕⠀',		// ↴		Rightwards arrow w corner downwards
	'\u2AEF': '⠀⠫⠩⠨⠡⠒⠒⠀',		// ⫯		Vertical line w circle above
	'\u22A4': '⠀⠫⠩⠳⠒⠀',			// ⊤		Down tack
	'\u21A7': '⠀⠫⠩⠳⠒⠒⠕⠀',		// ↧		Downwards arrow from bar
	'\u21D3': '⠀⠫⠩⠶⠶⠕⠀',		// ⇓		Downwards double arrow
	'\u21E0': '⠀⠫⠪⠒⠀⠒⠀',		// ⇠		Leftwards dashed arrow
	'\u21B5': '⠀⠫⠪⠒⠈⠳⠀',		// ↵		Downwards arrow w corner leftwards
	'\u2190': '⠀⠫⠪⠒⠒⠀',			// ←	Leftwards arrow
	'\u2B32': '⠀⠫⠪⠒⠒⠈⠫⠉⠸⠫⠬⠻⠀',	// ⬲	Left arrow w circled plus
	'\u21A9': '⠀⠫⠪⠒⠒⠈⠽⠀',		// ↩		Leftwards arrow w hook
	'\u27F5': '⠀⠫⠪⠒⠒⠒⠀',		// ⟵	Long leftwards arrow
	'\u27F7': '⠀⠫⠪⠒⠒⠒⠕⠀',		// ⟷	Long left right arrow
	'\u27FB': '⠀⠫⠪⠒⠒⠒⠳⠀',		// ⟻	Long leftwards arrow from bar
	'\u2194': '⠀⠫⠪⠒⠒⠕⠀',		// ↔	Left right arrow
	'\u21A2': '⠀⠫⠪⠒⠒⠠⠽⠀',		// ↢		Leftwards arrow w tail
	'\u21C6': '⠀⠫⠪⠒⠒⠫⠒⠒⠕⠀',		// ⇆		Leftwards arrow over rightwards arrow
	'\u21C7': '⠀⠫⠪⠒⠒⠫⠪⠒⠒⠀',		// ⇇		Leftwards paired arrows
	'\u2B31': '⠀⠫⠪⠒⠒⠫⠪⠒⠒⠫⠪⠒⠒⠀',	// ⬱	Three leftwards arrows
	'\u21A4': '⠀⠫⠪⠒⠒⠳⠀',		// ↤		Leftwards arrow from bar
	'\u219C': '⠀⠫⠪⠔⠒⠢⠀',		// ↜		Leftwards wave arrow
	'\u21AD': '⠀⠫⠪⠔⠒⠢⠕⠀',		// ↭		Left right wave arrow
	'\u21BB': '⠀⠫⠪⠢⠔⠀',			// ↻		Clockwise open circle arrow
	'\u21DC': '⠀⠫⠪⠢⠤⠔⠒⠢⠀',		// ⇜		Leftwards squiggle arrow
	'\u219E': '⠀⠫⠪⠪⠒⠒⠀',		// ↞		Leftwards two headed arrow
	'\u21D0': '⠀⠫⠪⠶⠶⠀',			// ⇐		Leftwards double arrow
	'\u21D4': '⠀⠫⠪⠶⠶⠕⠀',		// ⇔	Left right double arrow
	'\u27F8': '⠀⠫⠪⠶⠶⠶⠀',		// ⟸	Long leftwards arrow
	'\u27FA': '⠀⠫⠪⠶⠶⠶⠕⠀',		// ⟺	Long left right arrow
	'\u27FD': '⠀⠫⠪⠶⠶⠶⠳⠀',		// ⟽	Long leftwards double arrow from bar
	'\u21DA': '⠀⠫⠪⠸⠸⠀',			// ⇚		Leftwards triple arrow
	'\u2198': '⠀⠫⠰⠒⠒⠕⠀',		// ↘		South east arrow
	'\u2199': '⠀⠫⠰⠪⠒⠒⠀',		// ↙		South west arrow
	'\u2922': '⠀⠫⠰⠪⠒⠒⠕⠀',		// ⤢	North east and south west arrow
	'\u21D9': '⠀⠫⠰⠪⠶⠶⠀',		// ⇙		South west double arrow
	'\u21D8': '⠀⠫⠰⠶⠶⠕⠀',		// ⇘		South east double arrow
	'\u22A2': '⠀⠫⠳⠒⠀',			// ⊢		Right tack
	'\u27DD': '⠀⠫⠳⠒⠒⠀',			// ⟝	Long right tack
	'\u27FC': '⠀⠫⠳⠒⠒⠒⠕⠀',		// ⟼	Long rightwards arrow from bar
	'\u21A6': '⠀⠫⠳⠒⠒⠕⠀',		// ↦		Rightwards arrow from bar
	'\u27FE': '⠀⠫⠳⠶⠶⠶⠕⠀',		// ⟾	Long rightwards double arrow from bar
	'\u21D2': '⠀⠫⠶⠶⠕⠀',			// ⇒	Rightwards double arrow
	'\u27F9': '⠀⠫⠶⠶⠶⠕⠀',		// ⟹	Long rightwards arrow
	'\u21DB': '⠀⠫⠸⠸⠕⠀',			// ⇛		Rightwards triple arrow
	'\u2A72': '⠀⠬⠨⠅⠀',			// ⩲	Plus sign above equals sign
	'\u2237': '⠀⠰⠆⠀',			// ∷		Proportion
	'\u22F1': '⠀⠰⠒⠒⠒⠀',			// ⋱		Down right diagonal ellipsis
	'\u22F2': '⠀⠱⠈⠈⠑⠻⠀',		// ⋲	Element of w long horizontal stroke
	'\u22FA': '⠀⠱⠈⠈⠢⠻⠀',		// ⋺	Contains w long horizontal stroke
	'\u2A5C': '⠀⠱⠈⠈⠩⠻⠀',		// ⩜	Logical AND with horizontal dash
	'\u2A5D': '⠀⠱⠈⠈⠬⠻⠀',		// ⩝	Logical OR with horizontal dash
	'\u22F6': '⠀⠱⠈⠑⠀',			// ⋶	Element of w overbar
	'\u22FD': '⠀⠱⠈⠢⠀',			// ⋽	Contains w overbar
	'\u2AF2': '⠀⠱⠈⠫⠇⠻⠀',		// ⫲	Parallel w horizontal stroke
	'\u2242': '⠀⠱⠈⠱⠀',			// ≂		Minus tilde
	'\u22DC': '⠀⠱⠐⠅⠀',			// ⋜		Equal to or less than
	'\u22DD': '⠀⠱⠨⠂⠀',			// ⋝		Equal to or greater than
	'\u2223': '⠀⠳⠀',			// ∣		Divides
	'\u219B': '⠀⠳⠈⠫⠒⠒⠕⠻⠀',		// ↛		Rightwards arrow w stroke
	'\u21F8': '⠀⠳⠈⠫⠒⠒⠕⠻⠀',		// ⇸	Rightwards arrow w vertical stroke
	'\u21AE': '⠀⠳⠈⠫⠪⠒⠒⠕⠀',		// ↮		Left right arrow w stroke
	'\u21F9': '⠀⠳⠈⠫⠪⠒⠒⠕⠻⠀',		// ⇹	Left right arrow w vertical stroke
	'\u219A': '⠀⠳⠈⠫⠪⠒⠒⠻⠀',		// ↚		Leftwards arrow w stroke
	'\u21F7': '⠀⠳⠈⠫⠪⠒⠒⠻⠀',		// ⇷	Leftwards arrow w vertical stroke
	'\u21CE': '⠀⠳⠈⠫⠪⠶⠶⠕⠻⠀',		// ⇎		Left right double arrow w stroke
	'\u21CD': '⠀⠳⠈⠫⠪⠶⠶⠻⠀',		// ⇍		Leftwards double arrow w stroke
	'\u21CF': '⠀⠳⠈⠫⠶⠶⠕⠻⠀',		// ⇏		Rightwards double arrow w stroke
	'\u21E4': '⠀⠳⠫⠪⠒⠒⠀',		// ⇤		Leftwards arrow to bar
	'\u21FB': '⠀⠳⠳⠈⠫⠒⠒⠕⠻⠀',		// ⇻	Rightwards arrow w double vertical stroke
	'\u21DE': '⠀⠳⠳⠈⠫⠣⠒⠒⠕⠻⠀',	// ⇞		Upwards arrow w double stroke
	'\u21DF': '⠀⠳⠳⠈⠫⠩⠒⠒⠕⠻⠀',	// ⇟		Downwards arrow w double stroke
	'\u21FC': '⠀⠳⠳⠈⠫⠪⠒⠒⠕⠻⠀',	// ⇼	Left right arrow w double vertical stroke
	'\u21FA': '⠀⠳⠳⠈⠫⠪⠒⠒⠻⠀',		// ⇺	Leftwards arrow w double vertical stroke
	'\u2AF4': '⠀⠳⠳⠳⠀',			// ⫴		Triple vertical bar binary relation
	'\u2261': '⠀⠸⠇⠀',			// ≡	Identical to
	'\u2282': '⠀⠸⠐⠅⠀',			// ⊂	Subset of
	'\u2AC7': '⠀⠸⠐⠅⠈⠱⠀',		// ⫇	Subset of above tilde operator
	'\u2AC9': '⠀⠸⠐⠅⠈⠱⠈⠱⠀',		// ⫉	Subset of above almost equal to
	'\u2ACB': '⠀⠸⠐⠅⠌⠨⠅⠀',		// ⫋	Subset of above not equals sign
	'\u228A': '⠀⠸⠐⠅⠌⠱⠀',		// ⊊		Subset of w not equal to
	'\u2AC5': '⠀⠸⠐⠅⠨⠅⠀',		// ⫅	Subset of above equals sign
	'\u2286': '⠀⠸⠐⠅⠱⠀',			// ⊆	Subset of or equal to
	'\u2AD5': '⠀⠸⠐⠅⠸⠐⠅⠀',		// ⫕	Subset above subset
	'\u2AD3': '⠀⠸⠐⠅⠸⠨⠂⠀',		// ⫓	Subset above superset
	'\u2283': '⠀⠸⠨⠂⠀',			// ⊃	Superset of
	'\u2AC8': '⠀⠸⠨⠂⠈⠱⠀',		// ⫈	Superset of above tilde operator
	'\u2ACA': '⠀⠸⠨⠂⠈⠱⠈⠱⠀',		// ⫊	Superset of above almost equal to
	'\u2ACC': '⠀⠸⠨⠂⠌⠨⠅⠀',		// ⫌	Superset of above not equals sign
	'\u228B': '⠀⠸⠨⠂⠌⠱⠀',		// ⊋		Superset of w not equal to
	'\u2AD7': '⠀⠸⠨⠂⠐⠸⠐⠅⠀',		// ⫗	Superset beside subset
	'\u2AC6': '⠀⠸⠨⠂⠨⠅⠀',		// ⫆	Superset of above equals sign
	'\u2287': '⠀⠸⠨⠂⠱⠀',			// ⊇	Superset of or equal to
	'\u2AD4': '⠀⠸⠨⠂⠸⠐⠅⠀',		// ⫔	Superset above subset
	'\u2AD6': '⠀⠸⠨⠂⠸⠨⠂⠀',		// ⫖	Superset above superset
	'\u221D': '⠀⠸⠿⠀',			// ∝	Proportional to
	'\u2032': '⠄',				// ′	Prime
	'\u2033': '⠄⠄',				// ″	Double prime
	'\u2034': '⠄⠄⠄',			// ‴	Triple prime
	'\u2057': '⠄⠄⠄⠄',			// ⁗		Quadruple prime
	'\u0040': '⠈⠁',				// @	Commercial at
	'\u2113': '⠈⠇',				// ℓ	Script small (differs from 1d4c1: 4 - 56 - 123)
	'\u210F': '⠈⠓',				// ℏ		Planck constant over two pi
	'\u2308': '⠈⠘⠷',			// ⌈		Left ceiling
	'\u2309': '⠈⠘⠾',			// ⌉		Right ceiling
	'\u212B': '⠈⠠⠁',			// Å	Angstrom sign
	'\u00A7': '⠈⠠⠎',			// §	Section sign
	'\u00B6': '⠈⠠⠏',			// ¶	Pilcrow sign
	'\u2A2F': '⠈⠡',				// ⨯	Cross product
	'\u00D7': '⠈⠡',				// ×	Multiplication sign
	'\u2A31': '⠈⠡⠱',			// ⨱	Multiplication sign w underbar
	'\u2227': '⠈⠩',				// ∧	Logical and
	'\u2A5F': '⠈⠩⠱',			// ⩟	Logical AND w underbar
	'\u2A60': '⠈⠩⠱⠱',			// ⩠	Logical AND w double underbar
	'\u2228': '⠈⠬',				// ∨	Logical OR
	//'\u2A63': '⠈⠬⠱⠱',			// ⩣	Logical OR w double underbar
	'\u2200': '⠈⠯',				// ∀	For all
	'\u230A': '⠈⠰⠷',			// ⌊		Left floor	
	'\u230B': '⠈⠰⠾',			// ⌋		Right floor	
	'\u007C': '⠳',				// |	Vertical bar
	'\u007E': '⠈⠱',				// ~	Tilde
	'\u0025': '⠈⠴',				// %	Percent sign
	'\u005B': '⠈⠷',				// [	Left square bracket
	'\u27E6': '⠈⠸⠷',			// ⟦		Mathematical left white square bracket	
	'\u27E7': '⠈⠸⠾',			// ⟧		Mathematical right white square bracket	
	'\u2217': '⠈⠼',				// ∗		Asterisk operator
	'\u005D': '⠈⠾',				// ]	Right square bracket
	'\u2203': '⠈⠿',				// ∃	There exists	
	'\u2204': '⠌⠈⠿',			// ∄		There does not exist	
	'\u2224': '⠌⠳⠀',			// ∤		Does not divide
	'\u2A30': '⠐⠈⠡⠣⠡⠻',			// ⨰	Multiplication sign w dot above
	'\u2A51': '⠐⠈⠩⠣⠡⠻',			// ⩑	Logical AND w dot above
	'\u2A52': '⠐⠈⠬⠣⠡⠻',			// ⩒	Logical OR w dot above
	'\u29CA': '⠐⠫⠞⠣⠡⠻',			// ⧊	Triangle w dot above
	'\u2A24': '⠐⠬⠣⠈⠱⠻',			// ⨤	Plus sign w tilde above
	'\u2214': '⠐⠬⠣⠡⠻',			// ∔		Dot plus
	'\u2A22': '⠐⠬⠣⠨⠡⠻',			// ⨢	Plus sign w small circle above
	'\u2A23': '⠐⠬⠣⠸⠣⠻',			// ⨣	Plus sign w circumflex accent above
	'\u2A25': '⠐⠬⠩⠡⠻',			// ⨥	Plus sign w dot below
	'\u2A2A': '⠐⠱⠩⠡⠻',			// ⨪	Minus sign w dot below
	// '\u2022': '⠔⠔',			// •	Bullet
	'\u00B0': '⠘⠨⠡',			// °	Degree sign
	// '\u221A': '⠜':	'',		// √	Square root
	'\u002C': '⠠⠀',				// ,	Comma	
	'\u221E': '⠠⠿',				// ∞	Infinity	
	'\u22C5': '⠡',				// ⋅		Dot operator 
	'\u2991': '⠡⠈⠨⠨⠷⠻',			// ⦑		Left angle bracket w dot
	'\u2992': '⠡⠈⠨⠨⠾⠻',			// ⦒		Right angle bracket w dot
	'\u2A40': '⠡⠈⠨⠩⠻',			// ⩀	Intersection w dot
	'\u228D': '⠡⠈⠨⠬⠻',			// ⊍		Multiset multiplication
	'\u0308': '⠡⠡',				// ̈		Double-dot accent
	// '\u20DB': '⠡⠡⠡':	'',		// ⃛	Triple-dot accent
	// '\u20DC': '⠡⠡⠡⠡':	'',		// ⃜	Quadruple-dot accent
	// '\u221B': '⠣⠒⠜':	'',		// ∛		Cube root
	'\u2A1B': '⠣⠮',				// ⨛	Integral w overbar(upper)	
	//'\u221C': ;⠣⠲⠜',			// ∜		Fourth root
	'\u2212': '⠤',				// −	Minus sign
	'\u2A41': '⠤⠈⠨⠬⠻',			// ⩁	Union w minus sign
	'\u2213': '⠤⠬',				// ∓		Minus - or -plus sign
	'\u00F7': '⠨⠌',				// ÷	Division sign	
	'\u2211': '⠨⠠⠎',			// ∑	Summation
	'\u2218': '⠨⠡',				// ∘		Ring operator 
	'\u2238': '⠨⠤',				// ∸		Dot minus	
	'\u27E8': '⠨⠨⠷',			// ⟨		Mathematical left angle bracket	
	'\u27E9': '⠨⠨⠾',			// ⟩		Mathematical right angle bracket	
	'\u2229': '⠨⠩',				// ∩	Intersection
	'\u222A': '⠨⠬',				// ∪	Union
	'\u007B': '⠨⠷',				// {	Left curly brace
	'\u23DE': '⠨⠷',				// {	Curly overbrace
	'\u2983': '⠨⠸⠷',			// ⦃		Left white curly bracket	
	'\u2984': '⠨⠸⠾',			// ⦄		Right white curly bracket	
	'\u0023': '⠨⠼',				// #	Number sign
	'\u23DF': '⠨⠾',				// {	Curly underbrace
	'\u007D': '⠨⠾',				// }	Right curly brace
	'\u002B': '⠬',				// +	Plus
	'\u00B1': '⠬⠤',				// ±	Plus minus
	'\u2A1C': '⠩⠮',				// ⨜	Integral w underbar(lower)	
	'\u25CB': '⠫⠉',				// ○	White circle
	'\u2297': '⠫⠉⠸⠫⠈⠡⠻',		// ⊗		Circled times
	'\u229B': '⠫⠉⠸⠫⠈⠼⠻',		// ⊛		Circled asterisk operator
	'\u2299': '⠫⠉⠸⠫⠡⠻',			// ⊙		Circled dot operator
	'\u229D': '⠫⠉⠸⠫⠤⠤⠻',		// ⊝		Circled dash
	'\u2296': '⠫⠉⠸⠫⠤⠻',			// ⊖		Circled minus
	'\u229C': '⠫⠉⠸⠫⠨⠅⠻',		// ⊜		Circled equals
	'\u2A38': '⠫⠉⠸⠫⠨⠌⠻',		// ⨸	Circled division sign
	'\u2295': '⠫⠉⠸⠫⠬⠻',			// ⊕		Circled plus
	'\u2298': '⠫⠉⠸⠫⠸⠌⠻',		// ⊘		Circled division slash
	'\u22C6': '⠫⠎',				// ⋆		Star operator
	'\u2B2D': '⠫⠑',				// ⬭	White ellipse
	'\u2B21': '⠫⠖',				// ⬡	White hexagon
	'\u25AD': '⠫⠗',				// ▭	Rectangle
	'\u25B3': '⠫⠞',				// △	White up - pointing triangle
	'\u29CC': '⠫⠞⠎',			// ⧌	s in triangle §114
	// '\u22BF': '⠫⠞⠨⠗⠻',		// ⊿	Right triangle
	'\u29CB': '⠫⠞⠱',			// ⧋	Triangle w underbar
	'\u2A3B': '⠫⠞⠸⠫⠈⠡⠻',		// ⨻	Multiplication sign in triangle
	'\u2A3A': '⠫⠞⠸⠫⠤⠻',			// ⨺	Minus sign in triangle
	'\u2A39': '⠫⠞⠸⠫⠬⠻',			// ⨹	Plus sign in triangle
	'\u2B20': '⠫⠢',				// ⬠	White pentagon
	'\u27DF': '⠫⠣⠳⠒⠒⠨⠡',		// ⟟		Up tack w circle above
	'\u2220': '⠫⠪',				// ∠	Angle
	// '\u2221': '⠫⠪⠈⠫⠁⠻',		// ∡		Measured angle
	// '\u221F': '⠫⠪⠨⠗⠻',		// ∟	Right angle
	'\u25A1': '⠫⠲',				// □	Square
	'\u22A0': '⠫⠲⠸⠫⠈⠡⠻',		// ⊠		Squared times
	'\u29C6': '⠫⠲⠸⠫⠈⠼⠻',		// ⧆	Squared asterisk
	'\u29C4': '⠫⠲⠸⠫⠔⠻',			// ⧄	Square rising diagonal slash
	'\u22A1': '⠫⠲⠸⠫⠡⠻',			// ⊡		Squared dot operator
	'\u29C5': '⠫⠲⠸⠫⠢⠻',			// ⧅	Square falling diagonal slash
	'\u229F': '⠫⠲⠸⠫⠤⠻',			// ⊟		Squared minus
	'\u229E': '⠫⠲⠸⠫⠬⠻',			// ⊞		Squared plus
	'\u25EB': '⠫⠲⠸⠫⠳⠻',			// ◫	White square w vertical bisecting line
	'\u29E6': '⠫⠳⠶⠶⠳',			// ⧦	Gleich stark
	'\u25CF': '⠫⠸⠉',			// ●	Black circle
	'\u2B2C': '⠫⠸⠑',			// ⬬	Black ellipse
	'\u2B22': '⠫⠸⠖',			// ⬢	Black hexagon
	'\u25AC': '⠫⠸⠗',			// ▬	Filled rectangle
	'\u25B2': '⠫⠸⠞',			// ▲	Black up - pointing triangle
	'\u2B1F': '⠫⠸⠢',			// ⬟	Black pentagon
	'\u2BC3': '⠫⠸⠦',			// ⯃	Horizontal black octagon
	'\u25A0': '⠫⠸⠲',			// ■	Filled square
	'\u228E': '⠬⠈⠨⠬⠻',			// ⊎		Multiset union
	'\u222B': '⠮',				// ∫	Integral
	'\u2A18': '⠮⠈⠈⠡⠻',			// ⨘	Integral w times sign
	'\u2A19': '⠮⠈⠨⠩⠻',			// ⨙	Integral w intersection
	'\u2A1A': '⠮⠈⠨⠬⠻',			// ⨚	Integral w union
	'\u222E': '⠮⠈⠫⠉⠻',			// ∮	Contour integral
	'\u2233': '⠮⠈⠫⠢⠔⠕⠻',		// ∳		Anticlockwise contour integral ? ? ?
	'\u2232': '⠮⠈⠫⠪⠢⠔⠻',		// ∲		Clockwise contour integral ? ? ? §156 has half arcs
	'\u2A16': '⠮⠈⠫⠲⠻',			// ⨖	Quaternion integral operator
	'\u2A0E': '⠮⠈⠱⠱⠻',			// ⨎	Integral w double stroke
	'\u2A0D': '⠮⠈⠱⠻',			// ⨍	Finite part integral
	'\u222C': '⠮⠮',				// ∬	Double integral
	'\u222D': '⠮⠮⠮',			// ∭		Triple integral
	'\u2A0C': '⠮⠮⠮⠮',			// ⨌	Quadruple integral operator
	'\u2A43': '⠱⠨⠩',			// ⩃	Intersection w overbar
	'\u2A42': '⠱⠨⠬',			// ⩂	Union w overbar
	'\u2A5E': '⠱⠱⠈⠩',			// ⩞	Logical AND w double overbar
	'\u2A62': '⠱⠱⠈⠬',			// ⩢	Logical OR w double overbar
	'\u007C': '⠳',				// |	Vertical bar
	'\u2502': '⠳',				// |	Vertical bar
	'\u0028': '⠷',				// (	Left paren
	'\u003B': '⠸⠆',				// ;	Semicolon
	'\u002F': '⠌',				// /	Solidus (nonmath mapping: ⠸⠌)
	'\u2215': '⠸⠌',				// ∕	Division slash
	'\u003A': '⠸⠒',				// :	Colon
	'\u0021': '⠸⠖',				// !	Exclamation mark
	'\u005E': '⠸⠣',				// ^	Circumflex accent
	// '\u002D': '⠸⠤',			// -	Hyphen (won't roundtrip since -> '\u2212 minus)
	'\u003F': '⠸⠦',				// ?	Question mark
	'\u25BC': '⠸⠨⠫',			// ▼	Black down - pointing triangle
	'\u0026': '⠸⠯',				// &	Ampersand
	'\u002E': '⠸⠲',				// .	Full stop
	'\u220E': '⠸⠳',				// ∎		End of proof
	'\u2205': '⠸⠴',				// ∅		Empty set
	'\u2021': '⠸⠸⠻',			// ‡	Double dagger
	'\u2020': '⠸⠻',				// †	Dagger
	'\u0029': '⠾',				// )	Right paren
}

const mathstylesBraille = {
	// TeX unicode-math names in unimath-symbols.pdf to braille
	'mup': '⠰',
	'mbf': '⠸',
	'mit': '⠨',
	'mbfit': '⠸⠨',
	'Bbb': '⠈⠈',			// Use Russian for double struck
	'mbffrak': '⠸⠸',
	'mscr': '⠈⠰',
	'mbfscr': '⠸⠈⠰',
	'mfrak': '⠸',
	'msans': '⠠⠨⠰',
	'mbfsans': '⠠⠨⠸⠰',
	'mitsans': '⠠⠨⠨⠰',
	'mbfitsans': '⠠⠨⠸⠨⠰',
	'mtt': '',
};
//					   !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_ 
const brailleAscii = '⠀⠮⠐⠼⠫⠩⠯⠄⠷⠾⠡⠬⠠⠤⠨⠌⠴⠂⠆⠒⠲⠢⠖⠶⠦⠔⠱⠰⠣⠿⠜⠹⠈⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵⠪⠳⠻⠘⠸';

//						αβγδεζηθικλμνξοπρςστυφχψω
const asciiFromGreek = 'ABGDEZ:?IKLMNXOPR STUF&YW';

function symbolBraille(ch) {
	if (isBraille(ch))
		return ch;							// Already braille

	let code = ch.codePointAt(0);
	let cap = '';
	let mathstyle = '';
	let ret = '';

	if (ch >= 'ℂ' && (ch <= 'ℴ' || ch > '〗')) {
		// Get braille for math alphanumerics
		[mathstyle, ch] = foldMathAlphanumeric(code, ch);

		if (mathstyle) {
			if (mathstyle == 'mit' || mathstyle == 'mup')
				mathstyle = '';			    // Suppress 'italic'
			else
				mathstyle = mathstylesBraille[mathstyle];
		}
		code = ch.codePointAt(0);
		ret = mathstyle;
	}
	if (isGreek(ch)) {
		ret += '⠨';							// Add Greek indicator
		if (ch <= 'ω') {					// Lower-case omega
			if (ch <= 'Ω')
				ret += '⠠';					// Add cap
			else
				code -= 0x0020;				// Convert to upper case
			ch = asciiFromGreek[code - 0x0391];
			code = ch.codePointAt(0);
			return ret + brailleAscii[code - 0x20];
		}
		// Translate special Greek letters to corresponding ASCII chars
		let chT = '';

		switch (ch) {
			case '\u03D1':					// ϑ vartheta
				chT = '?';
				break;

			case '\u03D5':					// ϕ phi
				chT = 'F';
				break;

			case '\u03D6':					// ϖ varpi
				chT = 'P';
				break;

			case '\u03F0':					// ϰ varkappa
				chT = 'K';
				break;

			case '\u03F1':					// ϱ varrho
				chT = 'R';
				break;

			case '\u03F4':					// ϴ cap vartheta
				chT = '?';
				cap = '⠠';
				break;

			case '\u03F5':					// ϵ epsilon
				chT = 'E';
				break;
		}
		if (chT) {
			if (chT != 'E' && chT != 'F')
				ret += '⠈';					// Greek alternative indicator

			code = chT.codePointAt(0);
			return ret += cap + brailleAscii[code - 0x20];
		}
	}
	if (isAsciiAlphanumeric(ch)) {
		if (ret)
			ret += '⠰';						// Add English indicator
		if (ch >= 'A') {
			if (ch <= 'Z') {
				ret += '⠠';
			} else {
				ch = ch.toUpperCase();
				code -= 0x20;
			}
		}
		return ret + brailleAscii[code - 0x20];
	}
	// partial and nabla may have math styles
	if (ch == '\u2202')						// ∂	partial
		return ret + '⠈⠙';
	if (ch == '\u2207')						// ∇	nabla
		return ret + '⠨⠫';

	// Get braille for operators and other symbols
	ret = symbolBrailleStrings[ch];
	return ret ? ret : ch;
}

function isNumericSubscript(value) {
	return value.children[1].nodeName == 'mn' &&
		isAsciiDigit(value.children[1].textContent[0]) &&
		value.firstElementChild.nodeName == 'mi'
}

function styleBraille(mathStyle) {
	for (const [key, val] of Object.entries(mathvariants)) {
		if (val == mathStyle)
			return key;
	}
}

function braille(value, noAddParens, subsup) {
	// Function called recursively to convert MathML to Nemeth math braille

	function unary(node, op) {
		return op + braille(node.firstElementChild);
	}

	function binary(node, op) {
		let ret = braille(node.firstElementChild);
		let retd = braille(node.children[1]);

		if (op == '/' && (ret.endsWith('^∗ )') || ret.endsWith('^† )'))) {
			// Remove superfluous build-up space & parens
			ret = ret.substring(1, ret.length - 2);
		}
		ret += op + retd;
		return ret;
	}

	function ternary(node, op1, op2) {
		return braille(node.firstElementChild) + op1 + braille(node.children[1]) +
			op2 + braille(node.lastElementChild);
	}

	function nary(node, op, cNode) {
		let ret = '';

		for (let i = 0; i < cNode; i++) {
			// Get the rows
			ret += braille(node.children[i]);
			if (i < cNode - 1)
				ret += op;
		}
		return ret;
	}

	function Nary(node) {
		// symbol sub lower-limit sup upper-limit
		return braille(node.firstElementChild) + '⠰' +
			braille(node.children[1], true) + '⠘' +
			braille(node.lastElementChild, true) + '⠐';
	}

	let cNode = value.children.length;
	let ret = '';

	//ret = checkIntent(value);				// Check for MathML intent
	//if (ret)
	//	return ret;							// Intent overrules default braille

	switch (value.nodeName) {
		case 'mtable':
			var sep = '⣍';					// 'inline next row'

			if (value.firstElementChild.nodeName == 'mlabeledtr' &&
				value.firstElementChild.children.length == 2 &&
				value.firstElementChild.firstElementChild.firstElementChild.nodeName == 'mtext') {
				// Numbered equation: convert to UnicodeMath like 𝐸=𝑚𝑐²#(20)
				let eqno = value.firstElementChild.firstElementChild.firstElementChild.textContent;
				return braille(value.firstElementChild.lastElementChild.firstElementChild) +
					'#' + eqno.substring(1, eqno.length - 1);
			}
			return nary(value, sep, cNode);

		case 'mtr':
			var op = '⠀';					// Braille space (U+2800)
			if (value.parentElement.attributes.hasOwnProperty('intent') &&
				value.parentElement.attributes.intent.textContent.endsWith('equations'))
				op = '';
			ret = '';
			if (value.firstElementChild.firstElementChild.nodeName == 'mn')
				ret = '⠼';
			return ret + nary(value, op, cNode);

		case 'mtd':
			return nary(value, '', cNode);

		case 'menclose':
			let notation = '';
			ret = braille(value.firstElementChild, true);

			if (!value.attributes.hasOwnProperty('notation'))
				return '⠫⠗⠸⠫' + ret + '⠻';

			notation = value.attributes.notation.nodeValue;

			for (const [key, val] of Object.entries(symbolClasses)) {
				if (val == notation)
					return key + '⠸⠫' + ret + '⠻';
			}
			let nota = notation.split(' ');
			if (nota.includes('top') || nota.includes('bottom')) {
				if (nota.includes('top'))
					ret += '⠣⠱';
				if (nota.includes('bottom'))
					ret += '⠩⠱';
				ret = '⠐' + ret + '⠻';
			}
			if (nota.includes('left'))
				ret = '⠳' + ret;
			if (nota.includes('right'))
				ret = ret + '⠳';

			return ret;

		case 'mphantom':
		case 'mpadded':
			return braille(value.firstElementChild, true);

		case 'mstyle':
			return braille(value.firstElementChild);

		case 'mroot':
			ret = '⠣' + braille(value.lastElementChild, true);
											// Fall through to 'msqrt'
		case 'msqrt':
			return ret += '⠜' + braille(value.firstElementChild, true) + '⠻';

		case 'mfrac':
			let num = braille(value.firstElementChild, true);
			let den = braille(value.lastElementChild, true);

			if (value.attributes.hasOwnProperty('linethickness')) {
				var val = value.attributes.linethickness.nodeValue;
				if (val == '0' || val == '0.0pt')
					return num + '⠩' + den; // binomial coefficient
			}
			return '⠹' + num + '⠌' + den + '⠼';

		case 'msup':
			ret = braille(value.firstElementChild, false, subsup);
			if (subsup == undefined || subsup[0] != '⠘' && subsup[0] != '⠰')
				subsup = '⠘';
			else
				subsup += '⠘';
			var val = braille(value.lastElementChild, true, subsup);
			if (isPrime(val[0])) {
				ret += val[0];
				val = val.substring(1);
			}
			if (val && !val.endsWith('⠐'))
				val += '⠐';

			return val ? ret + subsup + val : ret;

		case 'mover':
			//if (value.attributes.hasOwnProperty('accent'))
			//	return binary(value, '');

			return '⠐' + braille(value.firstElementChild, true) +
				'⠣' + braille(value.lastElementChild, true) + '⠻';

		case 'munder':
			return '⠐' + braille(value.firstElementChild, true) + '⠩' +
				braille(value.lastElementChild, true) + '⠻';

			//if (value.attributes.hasOwnProperty('accentunder'))
			//	return binary(value, '');

			//return 'modified ' + braille(value.firstElementChild, true) +
			//	'⁐' + braille(value.lastElementChild, true) + '┬'; // 'with' ... 'below'

		case 'msub':
			if (subsup == undefined || subsup[0] != '⠘' && subsup[0] != '⠰')
				subsup = '⠰';
			else
				subsup += '⠰';
			if (isNumericSubscript(value))
				return binary(value, '');	// No sub op for sub'd numerals

			var val = braille(value.lastElementChild, true, subsup);
			if (!val.endsWith('⠐'))
				val += '⠐';

			return braille(value.firstElementChild, true) + subsup + val;

		case 'munderover':
			return '⠐' + braille(value.firstElementChild) + '⠩' +
				braille(value.children[1], true) + '⠣' +
				braille(value.lastElementChild, true) + '⠻';

		case 'msubsup':
			if (isNary(value.firstElementChild.innerHTML))
				return Nary(value);
			if (isNumericSubscript(value))
				val = binary(value, '') + '⠘' + braille(value.lastElementChild, true);
			else
				val = ternary(value, '⠰', '⠘');
			return val.endsWith('⠐') ? val : val + '⠐';

		case 'mmultiscripts':
			ret = '';
			if (value.children[3].nodeName == 'mprescripts') {
				if (value.children[4].nodeName != 'none')
					ret = '⠰' + braille(value.children[4]);
				if (value.children[5].nodeName != 'none')
					ret += '⠘' + braille(value.children[5]);
				if (ret)
					ret += ' ';
			}
			ret += braille(value.children[0]);
			if (value.children[1].nodeName != 'none')
				ret += '⠰' + braille(value.children[1]);
			if (value.children[2].nodeName != 'none')
				ret += '⠘' + braille(value.children[2]);
			return ret;

		case 'mfenced':
			var opOpen = value.attributes.hasOwnProperty('open') ? value.attributes.open : '(';
			var opClose = value.attributes.hasOwnProperty('close') ? value.attributes.close : ')';
			var opSeparators = value.attributes.hasOwnProperty('separators') ? value.attributes.separators : ',';
			var cSep = opSeparators.length;

			ret = opOpen;
			for (let i = 0; i < cNode; i++) {
				ret += braille(value.children[i]);
				if (i < cNode - 1)
					ret += i < cSep - 1 ? opSeparators[i] : opSeparators[cSep - 1];
			}
			return ret + opClose;

		case 'mo':
			var val = value.innerHTML;
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
			if (val == '\u0302')
				val = '^';
			return val;

		case 'mi':
			let c = value.innerHTML;
			//if (value.attributes.hasOwnProperty('intent')) {
			//	let ch = value.attributes.intent.nodeValue;
			//	if (isDoubleStruck(ch))
			//		c = ch;
			//}
			if (value.attributes.hasOwnProperty('mathvariant')) {
				// Convert to Unicode math alphanumeric. Conversion to speech
				// is done upon returning from the original braille() call.
				let mathstyle = mathvariants[value.attributes.mathvariant.nodeValue];
				if (c in mathFonts && mathstyle in mathFonts[c])
					c = mathFonts[c][mathstyle];
			}
			return c;

		case 'mn':
		case 'mtext':
			return value.textContent;

		case 'mspace':
			return '';
	}

	let mrowIntent = value.nodeName == 'mrow' && value.attributes.hasOwnProperty('intent')
		? value.attributes.intent.nodeValue : '';

	if (mrowIntent.startsWith('absolute-value') ||
		mrowIntent.startsWith('cardinality')) {
		return '|' + braille(value.children[1], true) + '|';
	}

	if (cNode == 3 && value.children[1].nodeName == 'mtable') {
		let open = value.firstElementChild.textContent;
		let close = value.lastElementChild.textContent;

		if ('([{|'.includes(open) && ')]}|'.includes(close)) {
			if ('(|'.includes(open)) {
				open = '⠠' + open;
				close = '⠠' + close;
			} else if (close) {
				open = symbolBrailleStrings[open];
				close = symbolBrailleStrings[close];
				open = open[0] + '⠠⠷';
				close = close[0] + '⠠⠾';
			}
		}
		return open + braille(value.children[1], true) + close;
	}
	if (mrowIntent == ':function') {
		// Separate function name and argument by braille space
		ret = braille(value.firstElementChild, true) + '⠀' +
			braille(value.lastElementChild, true);

		if (value.previousElementSibling &&
			value.firstElementChild.nodeName == 'mi' &&
			value.firstElementChild.textContent < '\u2100' &&
			value.previousElementSibling.nodeName == 'mi') {
			// Separate variable & function name
			ret = '⠀' + ret;				// Braille space: '\u2800'
		}
		return ret;
	}

	for (var i = 0; i < cNode; i++) {
		let node = value.children[i];
		ret += braille(node, false, subsup);
	}

	if (cNode > 1 && value.nodeName != 'math' && !noAddParens &&
		(!mrowIntent || mrowIntent != ':fenced') &&
		isMathMLObject(value.parentElement, true) && needParens(ret)) {
		ret = '(' + ret + ')';
	}
	return ret;
}
