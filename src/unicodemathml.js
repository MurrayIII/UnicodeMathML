(function(root) {
'use strict';

// if in debug mode, opens (or closes if the argument is null) a console.group
function debugGroup(s) {
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
    if (typeof ummlConfig !== "undefined" && typeof ummlConfig.debug !== "undefined" && ummlConfig.debug) {
        console.log(x);
    }
}

///////////
// PARSE //
///////////

// control words, to be replaced before parsing proper commences
// should match controlWords variable in playground.js
var controlWords = {
    // from tech note: Appendix B. Character Keywords and Properties and
    // updates from Microsoft implementation. See also the UnicodeMath
    // cheat sheet https://www.cs.bgu.ac.il/~khitron/Equation%20Editor.pdf
                                // Unicode code point
    'Bar':              '̿',	// 033F
    'Bio':              'Ⓞ',	// 24C4
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
    'bigcup':           '⋂',    	// 22C2
    'bigodot':          '⨀',	// 2A00
    'bigoplus':         '⨁',	// 2A01
    'bigotimes':        '⨂',	// 2A02
    'bigsqcap':         '⨅',	// 2A05
    'bigsqcup':         '⨆',	// 2A06
    'bigudot':          '⨃',	// 2A03
    'biguplus':         '⨄',	// 2A04
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
    'cases':            'Ⓒ',	// 24B8
    'cbrt':             '∛',	    // 221B
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
    'cup':              '∪',	// 222A
    'curlyeqprec':      '⋞',    	// 22DE
    'curlyeqsucc':      '⋟',    	// 22DF
    'curlyvee':         '⋎',    	// 22CE
    'curlywedge':       '⋏',    	// 22CF
    'curvearrowleft':   '↶',    	// 21B6
    'curvearrowright':  '↷',    	// 21B7
    'cwint':            '∱',    	// 2231
    'dag':              '†',	// 2020
    'daleth':           'ℸ',	    // 2138
    'dashleftarrow':    '⇠',	    // 21E0
    'dashrightarrow':   '⇢',	    // 21E2
    'dashv':            '⊣',	    // 22A3
    'dd':               'ⅆ',	// 2146
    'ddag':             '‡',	// 2021
    'ddddot':           '⃜',	// 20DC
    'dddot':            '⃛',	// 20DB
    'ddot':             '̈',	    // 0308
    'ddots':            '⋱',	    // 22F1
    'defeq':            '≝',	    // 225D
    'degc':             '℃',	// 2103
    'degf':             '℉',	    // 2109
    'degree':           '°',	// 00B0
    'delta':            'δ',	// 03B4
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
    'ell':              'ℓ',	// 2113
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
    'forall':           '∀',	// 2200
    'frakturH':         'ℌ',    // 210C
    'frown':            '⌢',	    // 2322
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
    'hairsp':           ' ',	    // 200A
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
    'intercal':         '⊺',	    // 22BA
    'iota':             'ι',	// 03B9
    'itimes':           '⁢',	    // 2062
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
    'longleftarrow':    '⟵',	// 27F5
    'longleftrightarrow':'⟷',	// 27F7
    'longmapsto':       '⟼',	// 27FC
    'longmapstoleft':   '⟻',	// 27FB
    'longrightarrow':   '⟶',	// 27F6
    'looparrowleft':    '↫',	    // 21AB
    'looparrowright':   '↬',	    // 21AC
    'lor':              '∨',	// 2228
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
    'nbsp':             ' ',	// 00A0
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
    'preceq':           '≼',	    // 227C
    'precnsim':         '⋨',	    // 22E8
    'precsim':          '≾',    	// 227E
    'prime':            '′',	// 2032
    'prod':             '∏',	// 220F
    'propto':           '∝',	// 221D
    'psi':              'ψ',	// 03C8
    'qdrt':             '∜',	    // 221C
    'qed':              '∎',	    // 220E
    'quad':             ' ',	// 2003
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
    'rightrightarrows': '⇉',    	// 21C9
    'rightthreetimes':  '⋌',	    // 22CC
    'righttriangle':    '⊿',	// 22BF
    'rightwavearrow':   '↝',	    // 219D
    'risingdotseq':     '≓',	    // 2253
    'rlhar':            '⇌',	    // 21CC
    'rmoust':           '⎱',	    // 23B1
    'root':             '⒭',	// 24AD
    'rrect':            '▢',	// 25A2
    'rtimes':           '⋊',    	// 22CA
    'scriptH':          'ℋ',    // 210B
    'sdiv':             '⁄',	// 2044
    'sdivide':          '⁄',	// 2044
    'searrow':          '↘',	    // 2198
    'setminus':         '∖',	    // 2216
    'sigma':            'σ',	// 03C3
    'sim':              '∼',	    // 223C
    'simeq':            '≃',	    // 2243
    'smash':            '⬍',	    // 2B0D
    'smile':            '⌣',	    // 2323
    'spadesuit':        '♠',	// 2660
    'sqcap':            '⊓',	    // 2293
    'sqcup':            '⊔',	    // 2294
    'sqrt':             '√',	// 221A
    'sqsupset':         '⊐',    	// 2290
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
    'thicksp':          ' ',	// 2005
    'thinsp':           ' ',	    // 2009
    'tilde':            '̃',	    // 0303
    'times':            '×',	// 00D7
    'to':               '→',	// 2192
    'top':              '⊤',	    // 22A4
    'triangle':         '△',	// 25B3
    'trianglelefteq':   '⊴',	    // 22B4
    'trianglerighteq':  '⊵',	    // 22B5
    'tvec':             '⃡',	// 20E1
    'twoheadleftarrow': '↞',	    // 219E
    'twoheadrightarrow':'↠',	    // 21A0
    'ubar':             '̲',	    // 0332
    'underbar':         '▁',	// 2581
    'underbrace':       '⏟',	    // 23DF
    'underbracket':     '⎵',	// 23B5
    'underline':        '▁',	// 2581
    'underparen':       '⏝',	    // 23DD
    'undershell':       '⏡',	    // 23E1
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
    'zeta':             'ζ',	// 03B6
    'zwnj':             '‌',	    // 200C
    'zwsp':             '',     // 200B
};

// replace control words with the specific characters. note that a control word
// must be postfixed with a non-alpha character such as an operator or a space
// in order to be properly terminated.
// this control word replacement would fly in the face of the UnicodeMath
// "literal" operator if there were single-character control words
function resolveCW(unicodemath) {
    var res = unicodemath.replace(/\\([A-Za-z0-9]+) ?/g, (match, cw) => {

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
                var symbol = String.fromCodePoint("0x" + cw.substring(1));
                return symbol;
            } catch(error) {
                // do nothing – it could be a regular control word starting with "u"
            }
        }

        // Check for control words like \scriptH. Note: bold and italic math styles
        // are handled by bold/italic UI in apps like Word.
        var cch = cw.length;
        if (cch >= 7) {
            var c = cw[cch - 1];
            var style = cw.substr(0, cch - 1);

            if (["script", "fraktur", "double"].includes(style) && c in mathFonts) {
                if (style == "double") {
                    style += "struck";
                }
                style += "-normal";
                if (style in mathFonts[c]) {
                    return mathFonts[c][style];
                }
            }
        }

        // Check built-in control words
        var symbol = controlWords[cw];
        if (symbol != undefined)
            return symbol;
        // Not a control word: display it in upright type
        return '"' + match + '"';
    });
    return res;
}

const keys = Object.keys(controlWords);
var cKeys = keys.length;

function getPartialMatches(cw) {
    // Get array of control-word partial matches for autocomplete drop down
    var cchCw = cw.length;
    var iMax = cKeys - 1;
    var iMid;
    var iMin = 0;
    var matches = [];

    do {                                // Binary search for a partial match
        iMid = Math.floor((iMin + iMax) / 2);
        var key = keys[iMid];
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

var negs = {
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
    '≽': '⋡',   // /\prec
    '≺': '⊀',   // /\succ
    '≻': '⊁',   // /\preceq
    '≼': '⋠',   // /\succeq
    '⊂': '⊄',  // /\subset
    '⊃': '⊅',  // /\supset
    '⊆': '⊈',  // /\subseteq
    '⊇': '⊉',  // /\supseteq
    '⊑': '⋢',   // /\sqsubseteq
    '⊒': '⋣'    // /\sqsupseteq
};

// math font conversion
// should match mathFonts variable in playground.js
var mathFonts = {

    // courtesy of
    // https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
    // and sublime text's multiple cursors
    'A': {'serif-bold': '𝐀', 'serif-italic': '𝐴', 'serif-bolditalic': '𝑨', 'sans-normal': '𝖠', 'sans-bold': '𝗔', 'sans-italic': '𝘈', 'sans-bolditalic': '𝘼', 'script-normal': '𝒜', 'script-bold': '𝓐', 'fraktur-normal': '𝔄', 'fraktur-bold': '𝕬', 'monospace-normal': '𝙰', 'doublestruck-normal': '𝔸'},
    'B': {'serif-bold': '𝐁', 'serif-italic': '𝐵', 'serif-bolditalic': '𝑩', 'sans-normal': '𝖡', 'sans-bold': '𝗕', 'sans-italic': '𝘉', 'sans-bolditalic': '𝘽', 'script-normal': 'ℬ', 'script-bold': '𝓑', 'fraktur-normal': '𝔅', 'fraktur-bold': '𝕭', 'monospace-normal': '𝙱', 'doublestruck-normal': '𝔹'},
    'C': {'serif-bold': '𝐂', 'serif-italic': '𝐶', 'serif-bolditalic': '𝑪', 'sans-normal': '𝖢', 'sans-bold': '𝗖', 'sans-italic': '𝘊', 'sans-bolditalic': '𝘾', 'script-normal': '𝒞', 'script-bold': '𝓒', 'fraktur-normal': 'ℭ', 'fraktur-bold': '𝕮', 'monospace-normal': '𝙲', 'doublestruck-normal': 'ℂ'},
    'D': {'serif-bold': '𝐃', 'serif-italic': '𝐷', 'serif-bolditalic': '𝑫', 'sans-normal': '𝖣', 'sans-bold': '𝗗', 'sans-italic': '𝘋', 'sans-bolditalic': '𝘿', 'script-normal': '𝒟', 'script-bold': '𝓓', 'fraktur-normal': '𝔇', 'fraktur-bold': '𝕯', 'monospace-normal': '𝙳', 'doublestruck-normal': '𝔻'},
    'E': {'serif-bold': '𝐄', 'serif-italic': '𝐸', 'serif-bolditalic': '𝑬', 'sans-normal': '𝖤', 'sans-bold': '𝗘', 'sans-italic': '𝘌', 'sans-bolditalic': '𝙀', 'script-normal': 'ℰ', 'script-bold': '𝓔', 'fraktur-normal': '𝔈', 'fraktur-bold': '𝕰', 'monospace-normal': '𝙴', 'doublestruck-normal': '𝔼'},
    'F': {'serif-bold': '𝐅', 'serif-italic': '𝐹', 'serif-bolditalic': '𝑭', 'sans-normal': '𝖥', 'sans-bold': '𝗙', 'sans-italic': '𝘍', 'sans-bolditalic': '𝙁', 'script-normal': 'ℱ', 'script-bold': '𝓕', 'fraktur-normal': '𝔉', 'fraktur-bold': '𝕱', 'monospace-normal': '𝙵', 'doublestruck-normal': '𝔽'},
    'G': {'serif-bold': '𝐆', 'serif-italic': '𝐺', 'serif-bolditalic': '𝑮', 'sans-normal': '𝖦', 'sans-bold': '𝗚', 'sans-italic': '𝘎', 'sans-bolditalic': '𝙂', 'script-normal': '𝒢', 'script-bold': '𝓖', 'fraktur-normal': '𝔊', 'fraktur-bold': '𝕲', 'monospace-normal': '𝙶', 'doublestruck-normal': '𝔾'},
    'H': {'serif-bold': '𝐇', 'serif-italic': '𝐻', 'serif-bolditalic': '𝑯', 'sans-normal': '𝖧', 'sans-bold': '𝗛', 'sans-italic': '𝘏', 'sans-bolditalic': '𝙃', 'script-normal': 'ℋ', 'script-bold': '𝓗', 'fraktur-normal': 'ℌ', 'fraktur-bold': '𝕳', 'monospace-normal': '𝙷', 'doublestruck-normal': 'ℍ'},
    'I': {'serif-bold': '𝐈', 'serif-italic': '𝐼', 'serif-bolditalic': '𝑰', 'sans-normal': '𝖨', 'sans-bold': '𝗜', 'sans-italic': '𝘐', 'sans-bolditalic': '𝙄', 'script-normal': 'ℐ', 'script-bold': '𝓘', 'fraktur-normal': 'ℑ', 'fraktur-bold': '𝕴', 'monospace-normal': '𝙸', 'doublestruck-normal': '𝕀'},
    'J': {'serif-bold': '𝐉', 'serif-italic': '𝐽', 'serif-bolditalic': '𝑱', 'sans-normal': '𝖩', 'sans-bold': '𝗝', 'sans-italic': '𝘑', 'sans-bolditalic': '𝙅', 'script-normal': '𝒥', 'script-bold': '𝓙', 'fraktur-normal': '𝔍', 'fraktur-bold': '𝕵', 'monospace-normal': '𝙹', 'doublestruck-normal': '𝕁'},
    'K': {'serif-bold': '𝐊', 'serif-italic': '𝐾', 'serif-bolditalic': '𝑲', 'sans-normal': '𝖪', 'sans-bold': '𝗞', 'sans-italic': '𝘒', 'sans-bolditalic': '𝙆', 'script-normal': '𝒦', 'script-bold': '𝓚', 'fraktur-normal': '𝔎', 'fraktur-bold': '𝕶', 'monospace-normal': '𝙺', 'doublestruck-normal': '𝕂'},
    'L': {'serif-bold': '𝐋', 'serif-italic': '𝐿', 'serif-bolditalic': '𝑳', 'sans-normal': '𝖫', 'sans-bold': '𝗟', 'sans-italic': '𝘓', 'sans-bolditalic': '𝙇', 'script-normal': 'ℒ', 'script-bold': '𝓛', 'fraktur-normal': '𝔏', 'fraktur-bold': '𝕷', 'monospace-normal': '𝙻', 'doublestruck-normal': '𝕃'},
    'M': {'serif-bold': '𝐌', 'serif-italic': '𝑀', 'serif-bolditalic': '𝑴', 'sans-normal': '𝖬', 'sans-bold': '𝗠', 'sans-italic': '𝘔', 'sans-bolditalic': '𝙈', 'script-normal': 'ℳ', 'script-bold': '𝓜', 'fraktur-normal': '𝔐', 'fraktur-bold': '𝕸', 'monospace-normal': '𝙼', 'doublestruck-normal': '𝕄'},
    'N': {'serif-bold': '𝐍', 'serif-italic': '𝑁', 'serif-bolditalic': '𝑵', 'sans-normal': '𝖭', 'sans-bold': '𝗡', 'sans-italic': '𝘕', 'sans-bolditalic': '𝙉', 'script-normal': '𝒩', 'script-bold': '𝓝', 'fraktur-normal': '𝔑', 'fraktur-bold': '𝕹', 'monospace-normal': '𝙽', 'doublestruck-normal': 'ℕ'},
    'O': {'serif-bold': '𝐎', 'serif-italic': '𝑂', 'serif-bolditalic': '𝑶', 'sans-normal': '𝖮', 'sans-bold': '𝗢', 'sans-italic': '𝘖', 'sans-bolditalic': '𝙊', 'script-normal': '𝒪', 'script-bold': '𝓞', 'fraktur-normal': '𝔒', 'fraktur-bold': '𝕺', 'monospace-normal': '𝙾', 'doublestruck-normal': '𝕆'},
    'P': {'serif-bold': '𝐏', 'serif-italic': '𝑃', 'serif-bolditalic': '𝑷', 'sans-normal': '𝖯', 'sans-bold': '𝗣', 'sans-italic': '𝘗', 'sans-bolditalic': '𝙋', 'script-normal': '𝒫', 'script-bold': '𝓟', 'fraktur-normal': '𝔓', 'fraktur-bold': '𝕻', 'monospace-normal': '𝙿', 'doublestruck-normal': 'ℙ'},
    'Q': {'serif-bold': '𝐐', 'serif-italic': '𝑄', 'serif-bolditalic': '𝑸', 'sans-normal': '𝖰', 'sans-bold': '𝗤', 'sans-italic': '𝘘', 'sans-bolditalic': '𝙌', 'script-normal': '𝒬', 'script-bold': '𝓠', 'fraktur-normal': '𝔔', 'fraktur-bold': '𝕼', 'monospace-normal': '𝚀', 'doublestruck-normal': 'ℚ'},
    'R': {'serif-bold': '𝐑', 'serif-italic': '𝑅', 'serif-bolditalic': '𝑹', 'sans-normal': '𝖱', 'sans-bold': '𝗥', 'sans-italic': '𝘙', 'sans-bolditalic': '𝙍', 'script-normal': 'ℛ', 'script-bold': '𝓡', 'fraktur-normal': 'ℜ', 'fraktur-bold': '𝕽', 'monospace-normal': '𝚁', 'doublestruck-normal': 'ℝ'},
    'S': {'serif-bold': '𝐒', 'serif-italic': '𝑆', 'serif-bolditalic': '𝑺', 'sans-normal': '𝖲', 'sans-bold': '𝗦', 'sans-italic': '𝘚', 'sans-bolditalic': '𝙎', 'script-normal': '𝒮', 'script-bold': '𝓢', 'fraktur-normal': '𝔖', 'fraktur-bold': '𝕾', 'monospace-normal': '𝚂', 'doublestruck-normal': '𝕊'},
    'T': {'serif-bold': '𝐓', 'serif-italic': '𝑇', 'serif-bolditalic': '𝑻', 'sans-normal': '𝖳', 'sans-bold': '𝗧', 'sans-italic': '𝘛', 'sans-bolditalic': '𝙏', 'script-normal': '𝒯', 'script-bold': '𝓣', 'fraktur-normal': '𝔗', 'fraktur-bold': '𝕿', 'monospace-normal': '𝚃', 'doublestruck-normal': '𝕋'},
    'U': {'serif-bold': '𝐔', 'serif-italic': '𝑈', 'serif-bolditalic': '𝑼', 'sans-normal': '𝖴', 'sans-bold': '𝗨', 'sans-italic': '𝘜', 'sans-bolditalic': '𝙐', 'script-normal': '𝒰', 'script-bold': '𝓤', 'fraktur-normal': '𝔘', 'fraktur-bold': '𝖀', 'monospace-normal': '𝚄', 'doublestruck-normal': '𝕌'},
    'V': {'serif-bold': '𝐕', 'serif-italic': '𝑉', 'serif-bolditalic': '𝑽', 'sans-normal': '𝖵', 'sans-bold': '𝗩', 'sans-italic': '𝘝', 'sans-bolditalic': '𝙑', 'script-normal': '𝒱', 'script-bold': '𝓥', 'fraktur-normal': '𝔙', 'fraktur-bold': '𝖁', 'monospace-normal': '𝚅', 'doublestruck-normal': '𝕍'},
    'W': {'serif-bold': '𝐖', 'serif-italic': '𝑊', 'serif-bolditalic': '𝑾', 'sans-normal': '𝖶', 'sans-bold': '𝗪', 'sans-italic': '𝘞', 'sans-bolditalic': '𝙒', 'script-normal': '𝒲', 'script-bold': '𝓦', 'fraktur-normal': '𝔚', 'fraktur-bold': '𝖂', 'monospace-normal': '𝚆', 'doublestruck-normal': '𝕎'},
    'X': {'serif-bold': '𝐗', 'serif-italic': '𝑋', 'serif-bolditalic': '𝑿', 'sans-normal': '𝖷', 'sans-bold': '𝗫', 'sans-italic': '𝘟', 'sans-bolditalic': '𝙓', 'script-normal': '𝒳', 'script-bold': '𝓧', 'fraktur-normal': '𝔛', 'fraktur-bold': '𝖃', 'monospace-normal': '𝚇', 'doublestruck-normal': '𝕏'},
    'Y': {'serif-bold': '𝐘', 'serif-italic': '𝑌', 'serif-bolditalic': '𝒀', 'sans-normal': '𝖸', 'sans-bold': '𝗬', 'sans-italic': '𝘠', 'sans-bolditalic': '𝙔', 'script-normal': '𝒴', 'script-bold': '𝓨', 'fraktur-normal': '𝔜', 'fraktur-bold': '𝖄', 'monospace-normal': '𝚈', 'doublestruck-normal': '𝕐'},
    'Z': {'serif-bold': '𝐙', 'serif-italic': '𝑍', 'serif-bolditalic': '𝒁', 'sans-normal': '𝖹', 'sans-bold': '𝗭', 'sans-italic': '𝘡', 'sans-bolditalic': '𝙕', 'script-normal': '𝒵', 'script-bold': '𝓩', 'fraktur-normal': 'ℨ', 'fraktur-bold': '𝖅', 'monospace-normal': '𝚉', 'doublestruck-normal': 'ℤ'},
    'a': {'serif-bold': '𝐚', 'serif-italic': '𝑎', 'serif-bolditalic': '𝒂', 'sans-normal': '𝖺', 'sans-bold': '𝗮', 'sans-italic': '𝘢', 'sans-bolditalic': '𝙖', 'script-normal': '𝒶', 'script-bold': '𝓪', 'fraktur-normal': '𝔞', 'fraktur-bold': '𝖆', 'monospace-normal': '𝚊', 'doublestruck-normal': '𝕒'},
    'b': {'serif-bold': '𝐛', 'serif-italic': '𝑏', 'serif-bolditalic': '𝒃', 'sans-normal': '𝖻', 'sans-bold': '𝗯', 'sans-italic': '𝘣', 'sans-bolditalic': '𝙗', 'script-normal': '𝒷', 'script-bold': '𝓫', 'fraktur-normal': '𝔟', 'fraktur-bold': '𝖇', 'monospace-normal': '𝚋', 'doublestruck-normal': '𝕓'},
    'c': {'serif-bold': '𝐜', 'serif-italic': '𝑐', 'serif-bolditalic': '𝒄', 'sans-normal': '𝖼', 'sans-bold': '𝗰', 'sans-italic': '𝘤', 'sans-bolditalic': '𝙘', 'script-normal': '𝒸', 'script-bold': '𝓬', 'fraktur-normal': '𝔠', 'fraktur-bold': '𝖈', 'monospace-normal': '𝚌', 'doublestruck-normal': '𝕔'},
    'd': {'serif-bold': '𝐝', 'serif-italic': '𝑑', 'serif-bolditalic': '𝒅', 'sans-normal': '𝖽', 'sans-bold': '𝗱', 'sans-italic': '𝘥', 'sans-bolditalic': '𝙙', 'script-normal': '𝒹', 'script-bold': '𝓭', 'fraktur-normal': '𝔡', 'fraktur-bold': '𝖉', 'monospace-normal': '𝚍', 'doublestruck-normal': '𝕕'},
    'e': {'serif-bold': '𝐞', 'serif-italic': '𝑒', 'serif-bolditalic': '𝒆', 'sans-normal': '𝖾', 'sans-bold': '𝗲', 'sans-italic': '𝘦', 'sans-bolditalic': '𝙚', 'script-normal': 'ℯ', 'script-bold': '𝓮', 'fraktur-normal': '𝔢', 'fraktur-bold': '𝖊', 'monospace-normal': '𝚎', 'doublestruck-normal': '𝕖'},
    'f': {'serif-bold': '𝐟', 'serif-italic': '𝑓', 'serif-bolditalic': '𝒇', 'sans-normal': '𝖿', 'sans-bold': '𝗳', 'sans-italic': '𝘧', 'sans-bolditalic': '𝙛', 'script-normal': '𝒻', 'script-bold': '𝓯', 'fraktur-normal': '𝔣', 'fraktur-bold': '𝖋', 'monospace-normal': '𝚏', 'doublestruck-normal': '𝕗'},
    'g': {'serif-bold': '𝐠', 'serif-italic': '𝑔', 'serif-bolditalic': '𝒈', 'sans-normal': '𝗀', 'sans-bold': '𝗴', 'sans-italic': '𝘨', 'sans-bolditalic': '𝙜', 'script-normal': 'ℊ', 'script-bold': '𝓰', 'fraktur-normal': '𝔤', 'fraktur-bold': '𝖌', 'monospace-normal': '𝚐', 'doublestruck-normal': '𝕘'},
    'h': {'serif-bold': '𝐡', 'serif-italic': 'ℎ', 'serif-bolditalic': '𝒉', 'sans-normal': '𝗁', 'sans-bold': '𝗵', 'sans-italic': '𝘩', 'sans-bolditalic': '𝙝', 'script-normal': '𝒽', 'script-bold': '𝓱', 'fraktur-normal': '𝔥', 'fraktur-bold': '𝖍', 'monospace-normal': '𝚑', 'doublestruck-normal': '𝕙'},
    'i': {'serif-bold': '𝐢', 'serif-italic': '𝑖', 'serif-bolditalic': '𝒊', 'sans-normal': '𝗂', 'sans-bold': '𝗶', 'sans-italic': '𝘪', 'sans-bolditalic': '𝙞', 'script-normal': '𝒾', 'script-bold': '𝓲', 'fraktur-normal': '𝔦', 'fraktur-bold': '𝖎', 'monospace-normal': '𝚒', 'doublestruck-normal': '𝕚'},
    'j': {'serif-bold': '𝐣', 'serif-italic': '𝑗', 'serif-bolditalic': '𝒋', 'sans-normal': '𝗃', 'sans-bold': '𝗷', 'sans-italic': '𝘫', 'sans-bolditalic': '𝙟', 'script-normal': '𝒿', 'script-bold': '𝓳', 'fraktur-normal': '𝔧', 'fraktur-bold': '𝖏', 'monospace-normal': '𝚓', 'doublestruck-normal': '𝕛'},
    'k': {'serif-bold': '𝐤', 'serif-italic': '𝑘', 'serif-bolditalic': '𝒌', 'sans-normal': '𝗄', 'sans-bold': '𝗸', 'sans-italic': '𝘬', 'sans-bolditalic': '𝙠', 'script-normal': '𝓀', 'script-bold': '𝓴', 'fraktur-normal': '𝔨', 'fraktur-bold': '𝖐', 'monospace-normal': '𝚔', 'doublestruck-normal': '𝕜'},
    'l': {'serif-bold': '𝐥', 'serif-italic': '𝑙', 'serif-bolditalic': '𝒍', 'sans-normal': '𝗅', 'sans-bold': '𝗹', 'sans-italic': '𝘭', 'sans-bolditalic': '𝙡', 'script-normal': '𝓁', 'script-bold': '𝓵', 'fraktur-normal': '𝔩', 'fraktur-bold': '𝖑', 'monospace-normal': '𝚕', 'doublestruck-normal': '𝕝'},
    'm': {'serif-bold': '𝐦', 'serif-italic': '𝑚', 'serif-bolditalic': '𝒎', 'sans-normal': '𝗆', 'sans-bold': '𝗺', 'sans-italic': '𝘮', 'sans-bolditalic': '𝙢', 'script-normal': '𝓂', 'script-bold': '𝓶', 'fraktur-normal': '𝔪', 'fraktur-bold': '𝖒', 'monospace-normal': '𝚖', 'doublestruck-normal': '𝕞'},
    'n': {'serif-bold': '𝐧', 'serif-italic': '𝑛', 'serif-bolditalic': '𝒏', 'sans-normal': '𝗇', 'sans-bold': '𝗻', 'sans-italic': '𝘯', 'sans-bolditalic': '𝙣', 'script-normal': '𝓃', 'script-bold': '𝓷', 'fraktur-normal': '𝔫', 'fraktur-bold': '𝖓', 'monospace-normal': '𝚗', 'doublestruck-normal': '𝕟'},
    'o': {'serif-bold': '𝐨', 'serif-italic': '𝑜', 'serif-bolditalic': '𝒐', 'sans-normal': '𝗈', 'sans-bold': '𝗼', 'sans-italic': '𝘰', 'sans-bolditalic': '𝙤', 'script-normal': 'ℴ', 'script-bold': '𝓸', 'fraktur-normal': '𝔬', 'fraktur-bold': '𝖔', 'monospace-normal': '𝚘', 'doublestruck-normal': '𝕠'},
    'p': {'serif-bold': '𝐩', 'serif-italic': '𝑝', 'serif-bolditalic': '𝒑', 'sans-normal': '𝗉', 'sans-bold': '𝗽', 'sans-italic': '𝘱', 'sans-bolditalic': '𝙥', 'script-normal': '𝓅', 'script-bold': '𝓹', 'fraktur-normal': '𝔭', 'fraktur-bold': '𝖕', 'monospace-normal': '𝚙', 'doublestruck-normal': '𝕡'},
    'q': {'serif-bold': '𝐪', 'serif-italic': '𝑞', 'serif-bolditalic': '𝒒', 'sans-normal': '𝗊', 'sans-bold': '𝗾', 'sans-italic': '𝘲', 'sans-bolditalic': '𝙦', 'script-normal': '𝓆', 'script-bold': '𝓺', 'fraktur-normal': '𝔮', 'fraktur-bold': '𝖖', 'monospace-normal': '𝚚', 'doublestruck-normal': '𝕢'},
    'r': {'serif-bold': '𝐫', 'serif-italic': '𝑟', 'serif-bolditalic': '𝒓', 'sans-normal': '𝗋', 'sans-bold': '𝗿', 'sans-italic': '𝘳', 'sans-bolditalic': '𝙧', 'script-normal': '𝓇', 'script-bold': '𝓻', 'fraktur-normal': '𝔯', 'fraktur-bold': '𝖗', 'monospace-normal': '𝚛', 'doublestruck-normal': '𝕣'},
    's': {'serif-bold': '𝐬', 'serif-italic': '𝑠', 'serif-bolditalic': '𝒔', 'sans-normal': '𝗌', 'sans-bold': '𝘀', 'sans-italic': '𝘴', 'sans-bolditalic': '𝙨', 'script-normal': '𝓈', 'script-bold': '𝓼', 'fraktur-normal': '𝔰', 'fraktur-bold': '𝖘', 'monospace-normal': '𝚜', 'doublestruck-normal': '𝕤'},
    't': {'serif-bold': '𝐭', 'serif-italic': '𝑡', 'serif-bolditalic': '𝒕', 'sans-normal': '𝗍', 'sans-bold': '𝘁', 'sans-italic': '𝘵', 'sans-bolditalic': '𝙩', 'script-normal': '𝓉', 'script-bold': '𝓽', 'fraktur-normal': '𝔱', 'fraktur-bold': '𝖙', 'monospace-normal': '𝚝', 'doublestruck-normal': '𝕥'},
    'u': {'serif-bold': '𝐮', 'serif-italic': '𝑢', 'serif-bolditalic': '𝒖', 'sans-normal': '𝗎', 'sans-bold': '𝘂', 'sans-italic': '𝘶', 'sans-bolditalic': '𝙪', 'script-normal': '𝓊', 'script-bold': '𝓾', 'fraktur-normal': '𝔲', 'fraktur-bold': '𝖚', 'monospace-normal': '𝚞', 'doublestruck-normal': '𝕦'},
    'v': {'serif-bold': '𝐯', 'serif-italic': '𝑣', 'serif-bolditalic': '𝒗', 'sans-normal': '𝗏', 'sans-bold': '𝘃', 'sans-italic': '𝘷', 'sans-bolditalic': '𝙫', 'script-normal': '𝓋', 'script-bold': '𝓿', 'fraktur-normal': '𝔳', 'fraktur-bold': '𝖛', 'monospace-normal': '𝚟', 'doublestruck-normal': '𝕧'},
    'w': {'serif-bold': '𝐰', 'serif-italic': '𝑤', 'serif-bolditalic': '𝒘', 'sans-normal': '𝗐', 'sans-bold': '𝘄', 'sans-italic': '𝘸', 'sans-bolditalic': '𝙬', 'script-normal': '𝓌', 'script-bold': '𝔀', 'fraktur-normal': '𝔴', 'fraktur-bold': '𝖜', 'monospace-normal': '𝚠', 'doublestruck-normal': '𝕨'},
    'x': {'serif-bold': '𝐱', 'serif-italic': '𝑥', 'serif-bolditalic': '𝒙', 'sans-normal': '𝗑', 'sans-bold': '𝘅', 'sans-italic': '𝘹', 'sans-bolditalic': '𝙭', 'script-normal': '𝓍', 'script-bold': '𝔁', 'fraktur-normal': '𝔵', 'fraktur-bold': '𝖝', 'monospace-normal': '𝚡', 'doublestruck-normal': '𝕩'},
    'y': {'serif-bold': '𝐲', 'serif-italic': '𝑦', 'serif-bolditalic': '𝒚', 'sans-normal': '𝗒', 'sans-bold': '𝘆', 'sans-italic': '𝘺', 'sans-bolditalic': '𝙮', 'script-normal': '𝓎', 'script-bold': '𝔂', 'fraktur-normal': '𝔶', 'fraktur-bold': '𝖞', 'monospace-normal': '𝚢', 'doublestruck-normal': '𝕪'},
    'z': {'serif-bold': '𝐳', 'serif-italic': '𝑧', 'serif-bolditalic': '𝒛', 'sans-normal': '𝗓', 'sans-bold': '𝘇', 'sans-italic': '𝘻', 'sans-bolditalic': '𝙯', 'script-normal': '𝓏', 'script-bold': '𝔃', 'fraktur-normal': '𝔷', 'fraktur-bold': '𝖟', 'monospace-normal': '𝚣', 'doublestruck-normal': '𝕫'},
    'ı': {'serif-italic': '𝚤'},
    'ȷ': {'serif-italic': '𝚥'},
    'Α': {'serif-bold': '𝚨', 'serif-italic': '𝛢', 'serif-bolditalic': '𝜜', 'sans-bold': '𝝖', 'sans-bolditalic': '𝞐'},
    'Β': {'serif-bold': '𝚩', 'serif-italic': '𝛣', 'serif-bolditalic': '𝜝', 'sans-bold': '𝝗', 'sans-bolditalic': '𝞑'},
    'Γ': {'serif-bold': '𝚪', 'serif-italic': '𝛤', 'serif-bolditalic': '𝜞', 'sans-bold': '𝝘', 'sans-bolditalic': '𝞒'},
    'Δ': {'serif-bold': '𝚫', 'serif-italic': '𝛥', 'serif-bolditalic': '𝜟', 'sans-bold': '𝝙', 'sans-bolditalic': '𝞓'},
    'Ε': {'serif-bold': '𝚬', 'serif-italic': '𝛦', 'serif-bolditalic': '𝜠', 'sans-bold': '𝝚', 'sans-bolditalic': '𝞔'},
    'Ζ': {'serif-bold': '𝚭', 'serif-italic': '𝛧', 'serif-bolditalic': '𝜡', 'sans-bold': '𝝛', 'sans-bolditalic': '𝞕'},
    'Η': {'serif-bold': '𝚮', 'serif-italic': '𝛨', 'serif-bolditalic': '𝜢', 'sans-bold': '𝝜', 'sans-bolditalic': '𝞖'},
    'Θ': {'serif-bold': '𝚯', 'serif-italic': '𝛩', 'serif-bolditalic': '𝜣', 'sans-bold': '𝝝', 'sans-bolditalic': '𝞗'},
    'Ι': {'serif-bold': '𝚰', 'serif-italic': '𝛪', 'serif-bolditalic': '𝜤', 'sans-bold': '𝝞', 'sans-bolditalic': '𝞘'},
    'Κ': {'serif-bold': '𝚱', 'serif-italic': '𝛫', 'serif-bolditalic': '𝜥', 'sans-bold': '𝝟', 'sans-bolditalic': '𝞙'},
    'Λ': {'serif-bold': '𝚲', 'serif-italic': '𝛬', 'serif-bolditalic': '𝜦', 'sans-bold': '𝝠', 'sans-bolditalic': '𝞚'},
    'Μ': {'serif-bold': '𝚳', 'serif-italic': '𝛭', 'serif-bolditalic': '𝜧', 'sans-bold': '𝝡', 'sans-bolditalic': '𝞛'},
    'Ν': {'serif-bold': '𝚴', 'serif-italic': '𝛮', 'serif-bolditalic': '𝜨', 'sans-bold': '𝝢', 'sans-bolditalic': '𝞜'},
    'Ξ': {'serif-bold': '𝚵', 'serif-italic': '𝛯', 'serif-bolditalic': '𝜩', 'sans-bold': '𝝣', 'sans-bolditalic': '𝞝'},
    'Ο': {'serif-bold': '𝚶', 'serif-italic': '𝛰', 'serif-bolditalic': '𝜪', 'sans-bold': '𝝤', 'sans-bolditalic': '𝞞'},
    'Π': {'serif-bold': '𝚷', 'serif-italic': '𝛱', 'serif-bolditalic': '𝜫', 'sans-bold': '𝝥', 'sans-bolditalic': '𝞟'},
    'Ρ': {'serif-bold': '𝚸', 'serif-italic': '𝛲', 'serif-bolditalic': '𝜬', 'sans-bold': '𝝦', 'sans-bolditalic': '𝞠'},
    'ϴ': {'serif-bold': '𝚹', 'serif-italic': '𝛳', 'serif-bolditalic': '𝜭', 'sans-bold': '𝝧', 'sans-bolditalic': '𝞡'},
    'Σ': {'serif-bold': '𝚺', 'serif-italic': '𝛴', 'serif-bolditalic': '𝜮', 'sans-bold': '𝝨', 'sans-bolditalic': '𝞢'},
    'Τ': {'serif-bold': '𝚻', 'serif-italic': '𝛵', 'serif-bolditalic': '𝜯', 'sans-bold': '𝝩', 'sans-bolditalic': '𝞣'},
    'Υ': {'serif-bold': '𝚼', 'serif-italic': '𝛶', 'serif-bolditalic': '𝜰', 'sans-bold': '𝝪', 'sans-bolditalic': '𝞤'},
    'Φ': {'serif-bold': '𝚽', 'serif-italic': '𝛷', 'serif-bolditalic': '𝜱', 'sans-bold': '𝝫', 'sans-bolditalic': '𝞥'},
    'Χ': {'serif-bold': '𝚾', 'serif-italic': '𝛸', 'serif-bolditalic': '𝜲', 'sans-bold': '𝝬', 'sans-bolditalic': '𝞦'},
    'Ψ': {'serif-bold': '𝚿', 'serif-italic': '𝛹', 'serif-bolditalic': '𝜳', 'sans-bold': '𝝭', 'sans-bolditalic': '𝞧'},
    'Ω': {'serif-bold': '𝛀', 'serif-italic': '𝛺', 'serif-bolditalic': '𝜴', 'sans-bold': '𝝮', 'sans-bolditalic': '𝞨'},
    '∇': {'serif-bold': '𝛁', 'serif-italic': '𝛻', 'serif-bolditalic': '𝜵', 'sans-bold': '𝝯', 'sans-bolditalic': '𝞩'},
    'α': {'serif-bold': '𝛂', 'serif-italic': '𝛼', 'serif-bolditalic': '𝜶', 'sans-bold': '𝝰', 'sans-bolditalic': '𝞪'},
    'β': {'serif-bold': '𝛃', 'serif-italic': '𝛽', 'serif-bolditalic': '𝜷', 'sans-bold': '𝝱', 'sans-bolditalic': '𝞫'},
    'γ': {'serif-bold': '𝛄', 'serif-italic': '𝛾', 'serif-bolditalic': '𝜸', 'sans-bold': '𝝲', 'sans-bolditalic': '𝞬'},
    'δ': {'serif-bold': '𝛅', 'serif-italic': '𝛿', 'serif-bolditalic': '𝜹', 'sans-bold': '𝝳', 'sans-bolditalic': '𝞭'},
    'ε': {'serif-bold': '𝛆', 'serif-italic': '𝜀', 'serif-bolditalic': '𝜺', 'sans-bold': '𝝴', 'sans-bolditalic': '𝞮'},
    'ζ': {'serif-bold': '𝛇', 'serif-italic': '𝜁', 'serif-bolditalic': '𝜻', 'sans-bold': '𝝵', 'sans-bolditalic': '𝞯'},
    'η': {'serif-bold': '𝛈', 'serif-italic': '𝜂', 'serif-bolditalic': '𝜼', 'sans-bold': '𝝶', 'sans-bolditalic': '𝞰'},
    'θ': {'serif-bold': '𝛉', 'serif-italic': '𝜃', 'serif-bolditalic': '𝜽', 'sans-bold': '𝝷', 'sans-bolditalic': '𝞱'},
    'ι': {'serif-bold': '𝛊', 'serif-italic': '𝜄', 'serif-bolditalic': '𝜾', 'sans-bold': '𝝸', 'sans-bolditalic': '𝞲'},
    'κ': {'serif-bold': '𝛋', 'serif-italic': '𝜅', 'serif-bolditalic': '𝜿', 'sans-bold': '𝝹', 'sans-bolditalic': '𝞳'},
    'λ': {'serif-bold': '𝛌', 'serif-italic': '𝜆', 'serif-bolditalic': '𝝀', 'sans-bold': '𝝺', 'sans-bolditalic': '𝞴'},
    'μ': {'serif-bold': '𝛍', 'serif-italic': '𝜇', 'serif-bolditalic': '𝝁', 'sans-bold': '𝝻', 'sans-bolditalic': '𝞵'},
    'ν': {'serif-bold': '𝛎', 'serif-italic': '𝜈', 'serif-bolditalic': '𝝂', 'sans-bold': '𝝼', 'sans-bolditalic': '𝞶'},
    'ξ': {'serif-bold': '𝛏', 'serif-italic': '𝜉', 'serif-bolditalic': '𝝃', 'sans-bold': '𝝽', 'sans-bolditalic': '𝞷'},
    'ο': {'serif-bold': '𝛐', 'serif-italic': '𝜊', 'serif-bolditalic': '𝝄', 'sans-bold': '𝝾', 'sans-bolditalic': '𝞸'},
    'π': {'serif-bold': '𝛑', 'serif-italic': '𝜋', 'serif-bolditalic': '𝝅', 'sans-bold': '𝝿', 'sans-bolditalic': '𝞹'},
    'ρ': {'serif-bold': '𝛒', 'serif-italic': '𝜌', 'serif-bolditalic': '𝝆', 'sans-bold': '𝞀', 'sans-bolditalic': '𝞺'},
    'ς': {'serif-bold': '𝛓', 'serif-italic': '𝜍', 'serif-bolditalic': '𝝇', 'sans-bold': '𝞁', 'sans-bolditalic': '𝞻'},
    'σ': {'serif-bold': '𝛔', 'serif-italic': '𝜎', 'serif-bolditalic': '𝝈', 'sans-bold': '𝞂', 'sans-bolditalic': '𝞼'},
    'τ': {'serif-bold': '𝛕', 'serif-italic': '𝜏', 'serif-bolditalic': '𝝉', 'sans-bold': '𝞃', 'sans-bolditalic': '𝞽'},
    'υ': {'serif-bold': '𝛖', 'serif-italic': '𝜐', 'serif-bolditalic': '𝝊', 'sans-bold': '𝞄', 'sans-bolditalic': '𝞾'},
    'φ': {'serif-bold': '𝛗', 'serif-italic': '𝜑', 'serif-bolditalic': '𝝋', 'sans-bold': '𝞅', 'sans-bolditalic': '𝞿'},
    'χ': {'serif-bold': '𝛘', 'serif-italic': '𝜒', 'serif-bolditalic': '𝝌', 'sans-bold': '𝞆', 'sans-bolditalic': '𝟀'},
    'ψ': {'serif-bold': '𝛙', 'serif-italic': '𝜓', 'serif-bolditalic': '𝝍', 'sans-bold': '𝞇', 'sans-bolditalic': '𝟁'},
    'ω': {'serif-bold': '𝛚', 'serif-italic': '𝜔', 'serif-bolditalic': '𝝎', 'sans-bold': '𝞈', 'sans-bolditalic': '𝟂'},
    '∂': {'serif-bold': '𝛛', 'serif-italic': '𝜕', 'serif-bolditalic': '𝝏', 'sans-bold': '𝞉', 'sans-bolditalic': '𝟃'},
    'ϵ': {'serif-bold': '𝛜', 'serif-italic': '𝜖', 'serif-bolditalic': '𝝐', 'sans-bold': '𝞊', 'sans-bolditalic': '𝟄'},
    'ϑ': {'serif-bold': '𝛝', 'serif-italic': '𝜗', 'serif-bolditalic': '𝝑', 'sans-bold': '𝞋', 'sans-bolditalic': '𝟅'},
    'ϰ': {'serif-bold': '𝛞', 'serif-italic': '𝜘', 'serif-bolditalic': '𝝒', 'sans-bold': '𝞌', 'sans-bolditalic': '𝟆'},
    'ϕ': {'serif-bold': '𝛟', 'serif-italic': '𝜙', 'serif-bolditalic': '𝝓', 'sans-bold': '𝞍', 'sans-bolditalic': '𝟇'},
    'ϱ': {'serif-bold': '𝛠', 'serif-italic': '𝜚', 'serif-bolditalic': '𝝔', 'sans-bold': '𝞎', 'sans-bolditalic': '𝟈'},
    'ϖ': {'serif-bold': '𝛡', 'serif-italic': '𝜛', 'serif-bolditalic': '𝝕', 'sans-bold': '𝞏', 'sans-bolditalic': '𝟉'},
    'Ϝ': {'serif-bold': '𝟊'},
    'ϝ': {'serif-bold': '𝟋'},
    '0': {'serif-bold': '𝟎', 'doublestruck-normal': '𝟘', 'sans-normal': '𝟢', 'sans-bold': '𝟬', 'monospace-normal': '𝟶'},
    '1': {'serif-bold': '𝟏', 'doublestruck-normal': '𝟙', 'sans-normal': '𝟣', 'sans-bold': '𝟭', 'monospace-normal': '𝟷'},
    '2': {'serif-bold': '𝟐', 'doublestruck-normal': '𝟚', 'sans-normal': '𝟤', 'sans-bold': '𝟮', 'monospace-normal': '𝟸'},
    '3': {'serif-bold': '𝟑', 'doublestruck-normal': '𝟛', 'sans-normal': '𝟥', 'sans-bold': '𝟯', 'monospace-normal': '𝟹'},
    '4': {'serif-bold': '𝟒', 'doublestruck-normal': '𝟜', 'sans-normal': '𝟦', 'sans-bold': '𝟰', 'monospace-normal': '𝟺'},
    '5': {'serif-bold': '𝟓', 'doublestruck-normal': '𝟝', 'sans-normal': '𝟧', 'sans-bold': '𝟱', 'monospace-normal': '𝟻'},
    '6': {'serif-bold': '𝟔', 'doublestruck-normal': '𝟞', 'sans-normal': '𝟨', 'sans-bold': '𝟲', 'monospace-normal': '𝟼'},
    '7': {'serif-bold': '𝟕', 'doublestruck-normal': '𝟟', 'sans-normal': '𝟩', 'sans-bold': '𝟳', 'monospace-normal': '𝟽'},
    '8': {'serif-bold': '𝟖', 'doublestruck-normal': '𝟠', 'sans-normal': '𝟪', 'sans-bold': '𝟴', 'monospace-normal': '𝟾'},
    '9': {'serif-bold': '𝟗', 'doublestruck-normal': '𝟡', 'sans-normal': '𝟫', 'sans-bold': '𝟵', 'monospace-normal': '𝟿'},
};

function italicizeCharacter(c) {
    if (c in mathFonts && 'serif-italic' in mathFonts[c] && (c < "Α" || c > "Ω"))
        return mathFonts[c]['serif-italic'];
    return c;
}

function italicizeCharacters(chars) {
    return Array.from(chars).map(c => {
        if (c in mathFonts && 'serif-italic' in mathFonts[c] && (c < "Α" || c > "Ω")) {
            return mathFonts[c]['serif-italic'];
        } else {
            return c;
        }
    }).join("");
}

// mapping betwen codepoint ranges in astral planes and the bmp's private use
// area
var astralPrivateMap = [

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
    return Array.from(s).map(c => {
        var cp = c.codePointAt(0);

        // do nothing if character is in BMP
        if (cp <= 0xFFFF) {
            return c;
        }

        // go over all entries of the substitution map and and subsitute if a
        // match is found. this could be more efficient, but it's not even close
        // to being a bottleneck
        for (let m of astralPrivateMap) {
            if (m.astral.begin <= cp && cp <= m.astral.end) {
                c = String.fromCodePoint(m.private.begin + (cp - m.astral.begin));
                break;
            }
        }
        return c;
    }).join('');
}

// inverts all codepoint range sustitutions listed in astralPrivateMap on the
// passed string
function mapFromPrivate(s) {
    return Array.from(s).map(c => {
        var cp = c.codePointAt(0);

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

    var fIdentity = false;
    if (!m) {
        m = n;
        fIdentity = true;
    }

    for (var i = 0; i < n; i++) {
        const a = [];

        for (var j = 0; j < m; j++) {
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

    var uast;
    if (typeof ummlConfig === "undefined" || typeof ummlConfig.tracing === "undefined" || !ummlConfig.tracing) {

        // no tracing
        uast = ummlParser.parse(unicodemath);
    } else {

        // tracing
        var tracer = new SimpleTracer();
        try {
            uast = ummlParser.parse(unicodemath, {tracer: tracer});
        } finally {

            // output trace (independent of whether the parse was successful or
            // not, hence the weird try..finally). the output_trace element is
            // defined in the playground
            if (output_trace) {
                output_trace.innerHTML = tracer.traceLogHTML().join('\n');
            }
            debugLog(tracer.traceLog);
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

    if (mask < 0 || mask > 159) {
        throw "nary mask is not between 0 and 159";
    }

    var options = [];

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

// compute a list of phantom options based on a bit mask
function phantomOptions(mask) {
    if (mask < 0 || mask > 31) {
        throw "phantom mask is not between 0 and 31";
    }

    var maskOptions = {
        1: 'fPhantomShow',
        2: 'fPhantomZeroWidth',
        4: 'fPhantomZeroAscent',
        8: 'fPhantomZeroDescent',
        16: 'fPhantomTransparent',
    };

    // accumulate options corresponding to mask
    var binMask = mask.toString(2).split('').reverse().join('');
    var options = [];
    for (var i = binMask.length - 1; i >= 0; i--) {
        if (binMask[i] == '1') {
            options.push(maskOptions[Math.pow(2, i)]);
        }
    }

    return options;
}

// compute a list of enclosure notation attributes options based on a bit mask
// or symbol
function enclosureAttrs(mask, symbol) {
    if (mask < 0 || mask > 255) {
        throw "enclosure mask is not between 0 and 255";
    }

    var symbolClasses = {
        '▭': 'box',
        '̄': 'top',
        '▁': 'bottom',
        '▢': 'roundedbox',
        '○': 'circle',
        '⟌': 'longdiv',
        "⃧"  : 'actuarial',
        '⬭': 'circle',
        '╱': 'cancel',
        '╲': 'bcancel',
        '╳': 'xcancel'
    };
    var maskClasses = {
        1: 'top',
        2: 'bottom',
        4: 'left',
        8: 'right',
        16: 'horizontalstrike',
        32: 'verticalstrike',
        64: 'downdiagonalstrike',
        128: 'updiagonalstrike'
    };

    // get classes corresponding to mask
    var ret = "";
    if (mask != null) {
        mask ^= 15;                         // spec inverts low 4 bits
        var binMask = mask.toString(2).split('').reverse().join('');
        var classes = [];
        for (var i = binMask.length - 1; i >= 0; i--) {
            if (binMask[i] == '1') {
                classes.push(maskClasses[Math.pow(2, i)]);
            }
        }
        ret = classes.join(' ');
    } else if (symbol != null) {
        ret += ' ' + symbolClasses[symbol];
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

    var options = [];

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

// should a diacritic be placed above (1), on top of (0), or under (-1) a
// character? (over/under-ness determined by navigating to
// https://www.fileformat.info/info/unicode/block/combining_diacritical_marks/images.htm
// and running
// document.querySelectorAll('.table td:nth-child(3)').forEach(n => console.log("a" + n.innerHTML + "  " + n.innerHTML));
// in the console)
function diacriticPosition(d) {
    var overlays = ['\u0334','\u0335','\u0336','\u0337','\u0338','\u20D2','\u20D3','\u20D8','\u20D9','\u20DA','\u20DD','\u20DE','\u20DF','\u20E0','\u20E2','\u20E3','\u20E4','\u20E5','\u20E6','\u20EA','\u20EB'];
    var belows = ['\u0316','\u0317','\u0318','\u0319','\u031C','\u031D','\u031E','\u031F','\u0320','\u0321','\u0322','\u0323','\u0324','\u0325','\u0326','\u0327','\u0328','\u0329','\u032A','\u032B','\u032C','\u032D','\u032E','\u032F','\u0330','\u0331','\u0332','\u0333','\u0339','\u033A','\u033B','\u033C','\u0345','\u0347','\u0348','\u0349','\u034D','\u034E','\u0353','\u0354','\u0355','\u0356','\u0359','\u035A','\u035C','\u035F','\u0362','\u20E8','\u20EC','\u20ED','\u20EE','\u20EF'];

    if (overlays.includes(d)) {
        return 0;
    }
    if (belows.includes(d)) {
        return -1;
    }
    return 1;
}

// determine space width attribute values: x/18em
function spaceWidth(x) {
    var spaceWidths = ['0', 'veryverythinmathspace','verythinmathspace','thinmathspace','mediummathspace','thickmathspace','verythickmathspace','veryverythickmathspace', null, '0.5em', null, null, null, null, null, null, null, null, '1em'];
    return spaceWidths[x];
}

// determine sizes: negative numbers => smaller sizes, positive numbers =>
// larger sizes, 0 => 1. constant 1.25 determined empirically based on what
// mathjax is doing and what looks decent in most mathml renderers
function fontSize(n) {
    return Math.pow(1.25, n) + "em";
}

// determine char to emit based on config: "us-tech" (ⅆ ↦ 𝑑), "us-patent"
// (ⅆ ↦ ⅆ), or "euro-tech" (ⅆ ↦ d), see section 3.11 of the tech note
function doublestruckChar(value) {
    var variants = {
        "us-tech": {
            "ⅅ": {mi: noAttr("𝐷")},
            "ⅆ": {mi: noAttr("𝑑")},
            "ⅇ": {mi: noAttr("𝑒")},
            "ⅈ": {mi: noAttr("𝑖")},
            "ⅉ": {mi: noAttr("𝑗")}
        },
        "us-patent": {
            "ⅅ": {mi: noAttr("ⅅ")},
            "ⅆ": {mi: noAttr("ⅆ")},
            "ⅇ": {mi: noAttr("ⅇ")},
            "ⅈ": {mi: noAttr("ⅈ")},
            "ⅉ": {mi: noAttr("ⅉ")}
        },
        "euro-tech": {
            "ⅅ": {mi: withAttrs({"mathvariant": "normal"}, "D")},
            "ⅆ": {mi: withAttrs({"mathvariant": "normal"}, "d")},
            "ⅇ": {mi: withAttrs({"mathvariant": "normal"}, "e")},
            "ⅈ": {mi: withAttrs({"mathvariant": "normal"}, "i")},
            "ⅉ": {mi: withAttrs({"mathvariant": "normal"}, "j")}
        }
    }

    if (typeof ummlConfig !== "undefined" && typeof ummlConfig.doubleStruckMode !== "undefined" && ummlConfig.doubleStruckMode in variants) {
        return variants[ummlConfig.doubleStruckMode][value];
    } else {
        return variants["us-tech"][value];
    }
}

// if the outermost node of an AST describes a parenthesized expression, remove
// the parentheses. used for fractions, exponentiation, etc.
function dropOutermostParens(uast) {
    if (uast.hasOwnProperty("expr")) {
        return {expr: dropOutermostParens(uast.expr)};
    }

    if (Array.isArray(uast) && uast.length == 1) {
        return [dropOutermostParens(uast[0])];
    }

    if (!uast.hasOwnProperty("bracketed")) {
        return uast;
    }

    if (v(uast).open == "(" && v(uast).close == ")" && !v(uast).content.hasOwnProperty("separated")) {
        return v(uast).content;
    }
    return uast;
}

// return the given AST, which may be wrapped in a stack of singleton lists,
// sans those lists
function dropSingletonLists(uast) {
    if (Array.isArray(uast) && uast.length == 1) {
        return dropSingletonLists(uast[0]);
    }
    return uast;
}

var brackets = { '⒨': '()', '⒩': '‖‖', 'ⓢ': '[]', 'Ⓢ': '{}', '⒱': '||' };

////////////////
// PREPROCESS //
////////////////

// certain desugarings, transformations and normalizations that must be
// performed no matter the output format
function preprocess(dsty, uast) {

    // map preprocessing over lists
    if (Array.isArray(uast)) {
        return uast.map(e => preprocess(dsty, e));
    }

    var key = k(uast);
    var value = v(uast);
    var intent;

    switch (key) {
        case "unicodemath":
            return {unicodemath: {content: preprocess(dsty, value.content), eqnumber: value.eqnumber}};
        case "newline":
            return uast;

        case "expr":
            return {expr: preprocess(dsty, value)};

        case "operator":
            return uast;
        case "negatedoperator":
            if (value in negs) {
                return {operator: negs[value]};
            } else {
                return {negatedoperator: value};
            }

        case "element":
            return {element: preprocess(dsty, value)};

        case "array":
            // TODO pad columns (also for matrices), required/helpful for latex output
            return {array: preprocess(dsty, value)};
        case "arows":
            return {arows: preprocess(dsty, value)};
        case "arow":

            // divide "&" into alignment marks and stretchy gaps
            var ret = []
            var i = 0;
            var currAcol = [];
            if (value[0] == null) {  // align mark immediately at start of row
                i = 1;
            }
            for (; i < value.length; i++) {
                if (i % 2 == 0) {
                    currAcol = [preprocess(dsty, value[i])];
                } else if (i % 2 == 1) {
                    currAcol.push({aalign: null});  // alignment mark
                    currAcol.push(preprocess(dsty, value[i]));
                    ret.push({acol: currAcol});  // stretchy gap may add space
                                                 // after this
                    currAcol = [];
                }
            }
            if (currAcol.length > 0) {
                ret.push({acol: currAcol});
            }
            return {arow: ret};

        case "specialMatrix":
            t = value[2];
            if (t == '⒱' && (!value[1] || value[0] == value[1])) {
                intent = 'determinant';
            }
            value = matrixRows(value[0], value[1]);

            if (t != "■") {
                var o = brackets[t][0];
                var c = brackets[t][1];
                return {bracketed: {open: o, close: c, intent: intent, content: {matrix: value}}};
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
            var options = naryOptions(value.mask);
            var value = clone(value);  // must be cloned since it's going to be
                                       // modified

            if (options.includes("nLimitsOpposite")) {

                // flip the scripts (not sure this is what's intended – the tech
                // note contains no details and word doesn't appear to implement
                // this feature)
                if ("low" in value.limits.script && "high" in value.limits.script) {
                    var tmp = value.limits.script.high;
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
                if (!("low" in value.limits.script)) {
                    value.limits.script.low = {operator: "⬚"};
                }
            }
            if (options.includes("nShowUpLimitPlaceHolder")) {
                if (!("high" in value.limits.script)) {
                    value.limits.script.high = {operator: "⬚"};
                }
            }

            if (options.includes("fDontGrowWithContent")) {
                value.naryand = {smash: {symbol: "⬆", of: value.naryand}};
            } else if (options.includes("fGrowWithContent")) {
                // default
            }

            if (options.includes("nLimitsUnderOver")) {
                value.limits.script.type = "abovebelow";
            } else if (options.includes("nLimitsSubSup")) {
                value.limits.script.type = "subsup";
            } else if (options.includes("nUpperLimitAsSuperScript")) {

                // display low as abovebelow, high as subsup => generate two
                // nested scripts
                if (value.limits.script.type != "subsup" && "high" in value.limits.script) {
                    var high = value.limits.script.high;
                    delete value.limits.script.high;
                    value.limits.script.base = {script: {type: "subsup", base: value.limits.script.base, high: high}};
                }
            } else if (dsty) {
                // in display mode if not an integral, display limits abovebelow
                var op = v(value.limits.script.base);
                if (op < '\u222B' || op > '\u2233') {   // exclude common integral signs
                    value.limits.script.type = "abovebelow";
                }
            }

            return {nary: {mask: value.mask, limits: preprocess(dsty, value.limits), naryand: preprocess(dsty, value.naryand)}};
        case "opnary":
            return uast;

        case "phantom":
            return {phantom: {mask: value.mask, symbol: value.symbol, of: preprocess(dsty, value.of)}};
        case "smash":
            return {smash: {symbol: value.symbol, of: preprocess(dsty, value.of)}};

        case "fraction":
            return {fraction: {symbol: value.symbol, of: preprocess(dsty, value.of)}};
        case "unicodefraction":
            var frac = (numerator, denominator) => {
                return {fraction: {symbol: "/", of: [{number: numerator}, {number: denominator}]}};
            }
            switch(value) {
                case "↉":
                    return frac(0, 3);
                case "½":
                    return frac(1, 2);
                case "⅓":
                    return frac(1, 3);
                case "⅔":
                    return frac(2, 3);
                case "¼":
                    return frac(1, 4);
                case "¾":
                    return frac(3, 4);
                case "⅕":
                    return frac(1, 5);
                case "⅖":
                    return frac(2, 5);
                case "⅗":
                    return frac(3, 5);
                case "⅘":
                    return frac(4, 5);
                case "⅙":
                    return frac(1, 6);
                case "⅚":
                    return frac(5, 6);
                case "⅐":
                    return frac(1, 7);
                case "⅛":
                    return frac(1, 8);
                case "⅜":
                    return frac(3, 8);
                case "⅝":
                    return frac(5, 8);
                case "⅞":
                    return frac(7, 8);
                case "⅑":
                    return frac(1, 9);
            }

        case "atop":
            return {atop: preprocess(dsty, value)};
        case "binom":
            return {binom: {top: preprocess(dsty, value.top), bottom: preprocess(dsty, value.bottom)}};

        case "script":
            ret = {type: value.type, base: preprocess(dsty, value.base)};

            switch (value.type) {
                case "subsup":

                    // if the subsup contains a primed expression, pull the
                    // prime up into the superscript and make the prime's base
                    // the subsup's base
                    var base = dropSingletonLists(value.base);
                    if (base.hasOwnProperty("primed")) {
                        var primes = {operator: processPrimes(base.primed.primes)};  // TODO not ideal for latex output
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
                        }
                    }
                    if (k(base) == "atoms" && base.atoms.funct == undefined) {
                        // if str contains more than a single variable, make
                        // the subsup base be the end variable. e.g., for
                        // 𝐸 = 𝑚𝑐², make 𝑐 be the base
                        var n = base.atoms.length;
                        if (n != undefined) {
                            var str = base.atoms[n - 1].chars;
                            if (str != undefined) {
                                var cch = str.length;
                                var cchCh = 1;

                                if (cch >= 2 && str.codePointAt(cch - 2) > 0xFFFF)
                                    cchCh = 2;      // surrogate pair

                                if (cch > cchCh) {
                                    ret.base.atoms[0].chars = str.substring(cch - cchCh, cch);
                                    return [{atoms: [{chars: str.substring(0, cch - cchCh)}]}, {script: ret}];
                                }
                            }
                        }
                    }
                    break;

                case "pre":
                    if ("prelow" in value) {
                        ret.prelow = preprocess(dsty, value.prelow);
                    }
                    if ("prehigh" in value) {
                        ret.prehigh = preprocess(dsty, value.prehigh);
                    }

                    // if a prescript contains a subsup, pull its base and
                    // scripts up into the prescript, which will then have all
                    // four kinds of scripts set
                    var base = dropSingletonLists(ret.base);
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
            if (value.symbol >= "╱" && value.symbol <= "╳") {
                // set mask for \cancel, \bcancel, \xcancel
                value.mask = (value.symbol == "╱") ? 79 : (value.symbol == "╲") ? 143 : 207;
            }
            return {enclosed: {mask: value.mask, symbol: value.symbol, of: preprocess(dsty, value.of)}};

        case "abstractbox":
            return {abstractbox: {mask: value.mask, of: preprocess(dsty, value.of)}};

        case "hbrack":
            return {hbrack: {bracket: value.bracket, of: preprocess(dsty, value.of)}};

        case "root":
            return {root: {degree: value.degree, of: preprocess(dsty, value.of)}};
        case "sqrt":
            return {sqrt: preprocess(dsty, value)};

        case "function":

            // clone this since it's going to be modified
            var valuef = clone(value.f);

            // tech note, section 3.3: if display mode is active, convert
            // subscripts after certain function names into belowscripts. the
            // <mo> movablelimits attribute could in theory also be used here,
            // but it's not supported everywhere (e.g. safari)
            if (value.f.hasOwnProperty("script")) {
                var s = valuef.script;
                var f = s.base.atoms.chars;
                if (dsty && s.type == "subsup" && s.low && ["det", "gcd", "inf", "lim", "lim inf", "lim sup", "max", "min", "Pr", "sup"].includes(f)) {
                    if (!s.high) {  // just convert the script to abovebelow
                        s.type = "abovebelow";
                    } else {  // create a new belowscript around the base and
                              // superscript
                        s = {base: {script: {base: s.base, type: s.type, high: s.high}}, type: "abovebelow", low: s.low};
                    }
                }
                valuef.script = s;
            }

            return {function: {f: preprocess(dsty, valuef), of: preprocess(dsty, value.of)}};

        case "text":
            return uast;

        case "sizeoverride":
            return {sizeoverride: {size: value.size, of: preprocess(dsty, value.of)}};

        case "colored":
            return {colored: {color: value.color, of: preprocess(dsty, value.of)}};
        case "bgcolored":
            return {bgcolored: {color: value.color, of: preprocess(dsty, value.of)}};
        case "comment":
            return uast;
        case "tt":
            return uast;

        case "primed":
            // cannot do anything here since the script transform rule relies on
            // this
            return {primed: {base: preprocess(dsty, value.base), primes: value.primes}};

        case "factorial":
            return [preprocess(dsty, value), {operator: "!"}];

        case "atoms":
            if (!value.hasOwnProperty("funct") && Array.isArray(value) && value[0].hasOwnProperty("chars") && value[0].chars[0] != 'Ⅎ') {
                value[0].chars = italicizeCharacters(value[0].chars);
            }
            return {atoms: preprocess(dsty, value)};
        case "chars":
            return uast;
        case "diacriticized":
            return {diacriticized: {base: preprocess(dsty, value.base), diacritics: value.diacritics}};
        case "spaces":
            return {spaces: preprocess(dsty, value)};
        case "space":
            return uast;

        case "number":
            return uast;

        case "doublestruck":
            return uast;

        case "bracketedMatrix":
            var t = value.type;
            var o = brackets[t][0];
            var c = brackets[t][1];
            if (t == '⒱') value.intent = 'determinant';

            return {bracketed: {open: o, close: c, intent: value.intent, content: preprocess(dsty, value.content)}};

        case "bracketed":
            var content;
            if (value.content.hasOwnProperty("separated")) {
                content = {separated: {separator: value.content.separated.separator, of: preprocess(dsty, value.content.separated.of)}};
            } else {
                content = preprocess(dsty, value.content);
            }
            return {bracketed: {open: value.open, close: value.close, intent: value.intent, content: content}};

        default:
            return uast;
    }
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// MATHML /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

///////////////
// TRANSFORM //
///////////////

// transform preprocessed UnicodeMath AST to MathML AST, potentially in display
// style. invariant: must return a single mathml node, even on recursive calls.
// if multiple mathml nodes should be returned, they must be wrapped in an mrow
function mtransform(dsty, puast) {

    // map transformation over lists, wrap the result in an mrow
    var fMath = dsty & 4;
    dsty &= ~4;

    if (Array.isArray(puast)) {
        return {mrow: noAttr(puast.map(e => mtransform(dsty, e)))};
    }

    var key = k(puast);
    var value = v(puast);
    switch (key) {
        case "unicodemath":
            var attrs = {class: "unicodemath", xmlns: "http://www.w3.org/1998/Math/MathML", display: dsty? "block" : "inline"}
            if (value.eqnumber == null) {
                return {math: withAttrs(attrs, mtransform(dsty, value.content))};
            } else {

                // generate id, via https://stackoverflow.com/a/55008188 (this
                // can be used, in conjunction with some javascript, for
                // referencing a specific equation)
                var id = value.eqnumber.replace(/(^-\d-|^\d|^-\d|^--)/,'$1').replace(/[\W]/g, '-');

                // equation numbers can only be assigned by wrapping
                // everything in an mtable with an mlabeledtr containing
                // eqnumber and content in separate mtds
                return {math:
                    withAttrs(
                        attrs,
                        {mtable: noAttr(
                            {mlabeledtr: withAttrs({id: id}, [
                                {mtd: noAttr({mtext: noAttr(value.eqnumber)})},
                                {mtd: noAttr(mtransform(dsty, value.content))}
                            ])}
                        )}
                    )
                };
            }
        case "newline":
            return {mspace: withAttrs({linebreak: "newline"}, null)};

        case "expr":
            return mtransform(dsty, value);

        case "operator":
            if ('←→↔⇐⇒⇔↩↪↼⇀↽⇁⊢⊣⟵⟶⟷⟸⟹⟺↦⊨'.split('').includes(value)) {
                return {mo: withAttrs({stretchy: true}, value)};
            } else {
                return {mo: noAttr(value)};
            }
        case "negatedoperator":
            return {mo: noAttr(value + "̸")};  // U+0338 COMBINING LONG SOLIDUS
                                              // OVERLAY

        case "element":
            return mtransform(dsty, value);

        case "array":
            return {mtable: noAttr(mtransform(dsty, value))};
        case "arows":
            return value.map(r => ({mtr: noAttr(mtransform(dsty, r))}));
        case "arow":
            return value.map(c => ({mtd: noAttr(mtransform(dsty, c))}));
        case "acol":
            return value.map(c => (mtransform(dsty, c)));
        case "aalign":
            return {malignmark: withAttrs({edge: "left"}, null)};

        case "matrix":
            return {mtable: noAttr(mtransform(dsty, value))};
        case "mrows":
            return value.map(r => ({mtr: noAttr(mtransform(dsty, r))}));
        case "mrow":
            // note that this is a matrix row, not a mathml <mrow>
            return value.map(c => ({mtd: noAttr(mtransform(dsty, c))}));
        case "mcol":
            return mtransform(dsty, value);

        case "nary":
            return {mrow: noAttr([mtransform(dsty, value.limits), mtransform(dsty, value.naryand)])};
        case "opnary":
            return {mo: noAttr(value)};

        case "phantom":
            var mask = value.mask;
            if (mask != null) {
                var options = phantomOptions(mask);

                // if empty, then just emit a phantom. also ignore fPhantomShow
                // (supposedly this would turn the phantom into a smash, but MS
                // Word keeps it a phantom, and who am i to question it?)
                var attrs = {};
                if (options.indexOf('fPhantomZeroWidth') !== -1) {
                    attrs.width = 0;
                }
                if (options.indexOf('fPhantomZeroAscent') !== -1) {
                    attrs.height = "1em";
                }
                if (options.indexOf('fPhantomZeroDescent') !== -1) {
                    attrs.depth = 0;
                }

                if (Object.keys(attrs).length === 0) {
                    return {mphantom: noAttr(mtransform(dsty, value.of))};
                } else {
                    return {mpadded: withAttrs(attrs, {mphantom: noAttr(mtransform(dsty, value.of))})};
                }
            }

            switch (value.symbol) {
                case "⟡":
                    return {mphantom: noAttr(mtransform(dsty, value.of))};
                case "⬄":
                    return {mpadded: withAttrs({height: 0, depth: 0}, {mphantom: noAttr(mtransform(dsty, value.of))})};
                case "⇳":
                    return {mpadded: withAttrs({width: 0}, {mphantom: noAttr(mtransform(dsty, value.of))})};
                default:
                    throw "invalid phantom symbol";
            }
        case "smash":
            switch (value.symbol) {
                case "⬍":
                    return {mpadded: withAttrs({height: 0, depth: 0}, mtransform(dsty, value.of))};
                case "⬆":
                    return {mpadded: withAttrs({height: "1em"}, mtransform(dsty, value.of))};
                case "⬇":
                    return {mpadded: withAttrs({depth: 0}, mtransform(dsty, value.of))};
                case "⬌":
                    return {mpadded: withAttrs({width: 0}, mtransform(dsty, value.of))};
                default:
                    throw "invalid smash symbol";
            }

        case "fraction":
            var of = value.of;
            switch (value.symbol) {
                case "/":       // normal fraction ¹-₂
                    return {mfrac: noAttr(of.map(e => (mtransform(dsty, dropOutermostParens(e)))))};
                case "\u2044":  // skewed fraction ¹/₂
                    return {mfrac: withAttrs({bevelled: true}, of.map(e => (mtransform(dsty, dropOutermostParens(e)))))};
                case "\u2215":  // linear fraction 1/2
                    var tmp = of.map(e => (mtransform(dsty, dropOutermostParens(e))));
                    return {mrow: noAttr([tmp[0], {mo: noAttr('/')}, tmp[1]])};
                case "\u2298":  // small fraction
                    return {mstyle: withAttrs({fontsize: fontSize(-1)}, {mfrac: noAttr(of.map(e => (mtransform(dsty, dropOutermostParens(e)))))})};
            }

        case "atop":
            return {mfrac: withAttrs({linethickness: 0}, value.map(e => (mtransform(dsty, dropOutermostParens(e)))))};
        case "binom":

            // desugar (not done in preprocessing step because LaTeX requires
            // this sugar)
            return mtransform(dsty, {bracketed: {intent: "binomial", open: "(", close: ")", content: {atop: [value.top, value.bottom]}}});

        case "script":
            switch (value.type) {
                case "subsup":
                    if ("low" in value && "high" in value) {
                        return {msubsup: noAttr([mtransform(dsty, value.base),
                                                 mtransform(dsty, dropOutermostParens(value.low)),
                                                 mtransform(dsty, dropOutermostParens(value.high))
                                                ])};
                    } else if ("low" in value) {
                        return {msub: noAttr([mtransform(dsty, value.base),
                                              mtransform(dsty, dropOutermostParens(value.low))
                                             ])};
                    } else if ("high" in value) {
                        return {msup: noAttr([mtransform(dsty, value.base),
                                              mtransform(dsty, dropOutermostParens(value.high))
                                             ])};
                    } else {  // can only occur in a nary without sub or sup set
                        return mtransform(dsty, value.base);
                    }
                case "pre":
                    var ret = [mtransform(dsty, value.base)];
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
                    if ("low" in value && "high" in value) {
                        return {munderover: noAttr([mtransform(dsty, value.base),
                                                    mtransform(dsty, dropOutermostParens(value.low)),
                                                    mtransform(dsty, dropOutermostParens(value.high))
                                                   ])};
                    } else if ("high" in value) {
                        return {mover: noAttr([mtransform(dsty, value.base),
                                               mtransform(dsty, dropOutermostParens(value.high))
                                              ])};
                    } else if ("low" in value) {
                        return {munder: noAttr([mtransform(dsty, value.base),
                                                mtransform(dsty, dropOutermostParens(value.low))
                                               ])};
                    } else {  // can only occur in a nary without sub or sup set
                        return mtransform(dsty, value.base);
                    }

                default:
                    throw "invalid or missing script type";
            }

        case "enclosed":
            var mask = value.mask;
            var symbol = value.symbol;
            return {menclose: withAttrs({notation: enclosureAttrs(mask, symbol)},
                                        mtransform(dsty, dropOutermostParens(value.of)))};

        case "abstractbox":
            var options = abstractBoxOptions(value.mask);

            // abstract boxes aren't clearly defined in the tech note, testing
            // of word's implementation didn't yield many insights either – so I
            // implemented what I could, along with the following non-standard
            // but potentially helpful class attribute

            // TODO remove this class once all options are properly implemented
            var attrs = {class: options.join(" ")};

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

            // TODO can probably do most of the work in a preprocessing step

            // determine if the bracket should be above or below contents
            var mtag = ["⏜", "⏞", "⏠", "⎴", "¯"].includes(value.bracket) ? "mover" : "munder";

            // if the bracket precedes a script, put the bracket below or above
            // the script's base and the script's sub or sup text below or above
            // the bracket
            var base = dropSingletonLists(value.of);
            var expLow;
            var expHigh;
            if (base.hasOwnProperty("script") && (base.script.type == "subsup" || base.script.type == "abovebelow")) {
                var expLow = base.script.low;
                var expHigh = base.script.high;
                var type = base.script.type;
                base = dropOutermostParens(base.script.base);

                var exp;
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

                return {[mtag]: withAttrs({"accentunder": true, "accent": true}, [
                    {[mtag]: withAttrs({"accentunder": true, "accent": true}, [
                        mtransform(dsty, base),
                        {mo: withAttrs({stretchy: true}, value.bracket)}
                    ])},
                    mtransform(dsty, dropOutermostParens(exp))
                ])};
            } else {
                return {[mtag]: withAttrs({"accentunder": true, "accent": true}, [
                    mtransform(dsty, dropOutermostParens(value.of)),
                    {mo: withAttrs({stretchy: true}, value.bracket)}
                ])};
            }

        case "root":
            return {mroot: noAttr([mtransform(dsty, dropOutermostParens(value.of)),
                                   mtransform(dsty, value.degree)
                                  ])};
        case "sqrt":
            return {msqrt: noAttr(mtransform(dsty, dropOutermostParens(value)))};

        case "function":
            return {mrow: noAttr([mtransform(dsty, value.f), {mo: noAttr("&ApplyFunction;")}, mtransform(dsty, value.of)])};

        case "text":

            // replace spaces with non-breaking spaces (leading and trailing
            // spaces are otherwise hidden)
            return {mtext: noAttr(value.split(" ").join("\xa0"))};

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
            return {mstyle: withAttrs({mathcolor: value.color}, mtransform(dsty, value.of))};
        case "bgcolored":
            return {mstyle: withAttrs({mathbackground: value.color}, mtransform(dsty, value.of))};
        case "comment":
            return {"␢": noAttr()};
        case "tt":
            return {mstyle: withAttrs({fontfamily: "monospace"}, {mtext: noAttr(value.split(" ").join("\xa0"))})};

        case "primed":
            return {msup: noAttr([mtransform(dsty, value.base),
                                  {mo: noAttr(processPrimes(value.primes))}
                                 ])};

        case "factorial":
            return {mrow: noAttr([mtransform(dsty, value), {mo: noAttr("!")}])};

        case "atoms":
            if (value.funct == undefined) {
                var n = value.length;
                if (n != undefined) {
                    var str = value[n - 1].chars;
                    if (str != undefined && str[0] != 'Ⅎ') {
                        var cch = str.length;

                        if (cch > 2 || cch == 2 && str.codePointAt(0) < 0xFFFF) {
                            var mis = [];
                            var cchCh = 1;

                            for (let i = 0; i < cch; i += cchCh) {
                                cchCh = (cch >= 2 && str.codePointAt(i) > 0xFFFF) ? 2 : 1;

                                if (str[i] >= 'ⅅ' && str[i] <= 'ⅉ') {
                                    if (i && str[i] <= 'ⅆ') {
                                        mis.push({mi: noAttr('\u2009')});
                                    }
                                    mis.push(doublestruckChar(str[i]));
                                } else {
                                    mis.push({mi: noAttr(str.substring(i, i + cchCh))});
                                }
                            }
                            return {mrow: noAttr(mis)};
                        } else if (str[0] >= 'ⅅ' && str[0] <= 'ⅉ') {
                            return doublestruckChar(str[0]);
                        }
                    }
                }
            }
            return mtransform(dsty, value);
        case "chars":

            // tech note, section 4.1: "Similarly it is easier to type ASCII
            // letters than italic letters, but when used as mathematical
            // variables, such letters are traditionally italicized in print
            // [...] translate letters deemed to be standalone to the
            // appropriate math alphabetic characters"
            if (value.length == 1) {
                if (value[0] >= "Α" && value[0] <= "Ω") {
                    return {mi: withAttrs({mathvariant: "normal"}, value)};
                } else {
                    return {mi: noAttr(italicizeCharacters(value))};
                }
            } else {
                return {mi: noAttr(value)};
            }
        case "diacriticized":

            // TODO some of the work could be done in preprocessing step? but need the loop both in preprocessing as well as actual compilation, so doubtful if that would actually be better
            var ret = mtransform(dsty, value.base);
            for (let d of value.diacritics) {

                // special cases for overscoring and underscoring (described in
                // tech note)
                if (d == "\u0305") {  // U+0305 COMBINING OVERLINE
                    ret = {menclose: withAttrs({notation: "top"}, ret)};
                } else if (d == "\u0332") {  // U+0332 COMBINING LOW LINE
                    ret = {menclose: withAttrs({notation: "bottom"}, ret)};

                // special cases for other diacritics that can be represented by
                // an enclosure
                } else if (d == "\u20DD") {  // U+20DD COMBINING ENCLOSING CIRCLE
                    ret = {menclose: withAttrs({notation: "circle"}, ret)};
                } else if (d == "\u20DE") {  // U+20DE COMBINING ENCLOSING SQUARE
                    ret = {menclose: withAttrs({notation: "box"}, ret)};
                } else if (d == "\u20E0") {  // U+20E0 COMBINING ENCLOSING CIRCLE BACKSLASH
                    ret = {menclose: withAttrs({notation: "circle"}, {menclose: withAttrs({notation: "downdiagonalstrike"}, ret)})};

                // standard case: place diacritic above or below. there is no
                // good way for dealing with overlays, so just place them above
                } else {
                    var tag = "mover"
                    if (diacriticPosition(d) == -1) {
                        tag = "munder"
                    }

                    // represent diacritic using an entity to improve
                    // readability of generated mathml code
                    d = "&#" + d.charCodeAt(0) + ";";

                    ret = {[tag]: withAttrs({accent: "true"}, [ret, {mo: noAttr(d)}])}
                }
            }
            return ret;
        case "spaces":
            return mtransform(dsty, value);
        case "space":
            if (typeof value == 'number') {
                return {mspace: withAttrs({width: spaceWidth(value)}, null)};
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
            return {mn: noAttr(value)};

        case "doublestruck":

            var char = doublestruckChar(value);

            // tech note, section 3.11: "in regular US technical publications,
            // these quantities can be rendered as math italic". also: "Notice
            // that the ⅆ character automatically introduces a small space
            // between the 𝑥 and the 𝑑𝑥"
            // Note: this is only true if ⅆ is preceded by a character in the
            // same <mrow>
            switch (value) {
                case "ⅅ":
                    return {mrow: noAttr([{mspace: withAttrs({width: "thinmathspace"}, null)}, char])};
                case "ⅆ":
                    return {mrow: noAttr([{mspace: withAttrs({width: "thinmathspace"}, null)}, char])};
                case "ⅇ":
                case "ⅈ":
                case "ⅉ":
                    return char;
            }

        case "bracketed":

            // handle potential separator
            var separator = "";
            if (value.content.hasOwnProperty("separated")) {
                separator = value.content.separated.separator;
                value.content = value.content.separated.of;
            }

            var content;
            if (typeof value.open === 'string' && typeof value.close === 'string' && value.open == "|" && value.close == "|") {
                content = mtransform(dsty, dropOutermostParens(value.content));
            } else if (separator == "") {
                content = mtransform(dsty, value.content);
            } else {

                // intercalate elements of mrow returned by recursive call with
                // separator
                content = mtransform(dsty, value.content).mrow.content;
                content = content.map(e => [e]).reduce((acc, v) => acc.concat({mo: noAttr(separator)}, v));
                content = {mrow: noAttr(content)};
            }

            // handle brackets: first inner mrow (content and brackets if they
            // are just strings, i.e. if they should grow with their contents).
            // note that if all-invisible brackets 〖a〗 are used, this simply
            // wraps content in an mrow as desired
            var ret = [];
            if (typeof value.open === 'string') {
                ret.push({mo: noAttr(value.open)});
            }
            ret.push(content);
            if (typeof value.close === 'string') {
                ret.push({mo: noAttr(value.close)});
            }
            if (value.intent) {
                ret = [{mrow: withAttrs({intent: value.intent}, ret)}];
            } else {
                ret = [{mrow: noAttr(ret)}];
            }
            // now handle potential manually resized brackets. note that
            // value.open.size and value.close.size should be at most 4
            // according to the tech note, but there is no strict need for this
            // limitation – so i'm not imposing one
            if (typeof value.open !== 'string') {
                var openSize = fontSize(value.open.size);

                var br = {mo: withAttrs({minsize: openSize, maxsize: openSize}, value.open.bracket)};
                ret = [br].concat(ret);
            }
            if (typeof value.close !== 'string') {
                var closeSize = fontSize(value.close.size);

                var br = {mo: withAttrs({minsize: closeSize, maxsize: closeSize}, value.close.bracket)};
                ret = ret.concat([br]);
            }
            return ret;

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
    var attributes = "";
    if (Object.keys(attribs).length) {
        attributes = " " + Object.keys(attribs).map(key => {
            var value = attribs[key];
            return `${key}="${value}"`;
        }).join(' ');
    }
    if (vals.length == 1 && vals[0] == null) {
        return `<${tagname}${attributes} />`;
    }
    var values = vals.reduce((a,b) => `${a} ${b}`);
    return `<${tagname}${attributes}>${values}</${tagname}>`;
}

// pretty-print MathML AST
function pretty(mast) {

    // unwrap singleton lists
    //if (Array.isArray(mast) && mast.length == 1) {
    //    return pretty(mast[0]);
    //}

    // map over lists and concat results
    if (Array.isArray(mast)) {
        return mast.map(e => pretty(e)).join("");
    }

    if (typeof mast !== 'object') {
        return mast;
    }

    var key = k(mast);
    var attributes = a(mast);
    var value = c(mast);

    switch (key) {
        case "math":
            return tag(key, attributes, pretty(value));
        case "mrow":

            // mrow elimination: ignore superfluous mrows, i.e. ones that
            // contain only a single child and have no attributes
            if (Array.isArray(value) && value.length == 1) {
                return pretty({mrow: {attributes: {}, content: value[0]}});  // insert a dummy mrow around the singleton array value to fix bug occurring if this singleton array value is again an array, which the pretty() function would then simply be mapped over, which would be problematic in certain contexts such as scripts where a set number of nodes on one level is required
            } else if (!(Array.isArray(value)) && Object.keys(attributes).length == 0) {
                return pretty(value);
            } else {
                return tag(key, attributes, pretty(value));
            }
        case "msubsup":
        case "msub":
        case "msup":
        case "munderover":
        case "munder":
        case "mover":
        case "mfrac":
        case "msqrt":
        case "mroot":
        case "menclose":
        case "mtd":
        case "mtr":
        case "mlabeledtr":
        case "mtable":
        case "mphantom":
        case "mpadded":
        case "mstyle":
        case "mmultiscripts":
        case "mprescripts":
        case "none":
            return tag(key, attributes, pretty(value));
        case "mi":
        case "mn":
        case "mo":
        case "mtext":
            return tag(key, attributes, value);
        case "malignmark":
        case "mspace":
            return tag(key, attributes, null);
        case "␢":
            return "";
        default:
            return value;
    }
}

//////////////
// PLUMBING //
//////////////

function escapeHTMLSpecialChars(str) {
    var replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return str.replace(/[&<>]/g, tag => {
        return replacements[tag] || tag;
    });
};

function unicodemathml(unicodemath, displaystyle) {
    debugGroup(unicodemath);
    try {
        var t1s = performance.now();
        var uast = parse(unicodemath);
        var t1e = performance.now();
        debugLog(uast);

        var t2s = performance.now();
        var puast = preprocess(displaystyle, uast);
        var t2e = performance.now();
        debugLog(puast);

        var t3s = performance.now();
        var mast = mtransform(displaystyle, puast);
        var t3e = performance.now();
        debugLog(mast);

        var t4s = performance.now();
        var mathml = pretty(mast);
        var t4e = performance.now();

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
                    transform:  mast
                }
            }
        };
    } catch(error) {
        debugLog(error);

        // convert error to string and invert any private use area mappings
        var strError = mapFromPrivate("" + error);

        // add variant of input with resolved control words, if any
        if (typeof ummlConfig !== "undefined" && typeof ummlConfig.resolveControlWords !== "undefined" && ummlConfig.resolveControlWords && resolveCW(unicodemath) != unicodemath) {
            strError = "(Resolved to \"" + resolveCW(unicodemath) + "\".) " + error;
        }

        debugGroup();
        return {
            //mathml: `<math class="unicodemath" xmlns="http://www.w3.org/1998/Math/MathML"><merror><mrow><mtext>⚠ [${escapeHTMLSpecialChars(unicodemath)}] ${escapeHTMLSpecialChars(strError)}</mtext></mrow></merror></math>`,
            mathml: `<span class="unicodemathml-error"><span class="unicodemathml-error-unicodemath">${escapeHTMLSpecialChars(unicodemath)}</span> <span class="unicodemathml-error-message">${escapeHTMLSpecialChars(strError)}</span></span>`,
            details: {
                error: error
            }
        };
    }
}








////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// LATEX /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// determine space width attribute values: x/18em, based on the following:
// \quad = space equal to the current font size (= 18 mu)
// \,    = 3/18 of \quad (= 3 mu)
// \:    = 4/18 of \quad (= 4 mu)
// \;    = 5/18 of \quad (= 5 mu)
// \!    = -3/18 of \quad (= -3 mu)
function spaceWidthL(x) {
    var spaceWidths = ['', '\\:\\!','\\;\\!','\\,','\\:','\\;','\\,\\,','\\,\\:', null, '\\:\\;', null, null, null, null, null, null, null, null, '\\quad'];
    return spaceWidths[x];
}

// TODO implement and use equivalent of fontSize() function

var latexEscapes = {
      "α": "\\alpha"
    , "TODO": "TODO"
/*
<
=
>
∃
∈
∋
∼
≃
≅
≈
≍
≡
≤
≥
≶
≷
≽
≺
≻
≼
⊂
⊃
⊆
⊇
⊑
⊒
≮
≠
≯
∄
∉
∌
≁
≄
≇
≉
≭
≢
≰
≱
≸
≹
⋡
⊀
⊁
⋠
⊄
⊅
⊈
⊉
⋢
⋣
etc.
*/
};
// TODO use mathFonts variable, compute reverse mapping (either dynamically or statically, doesn't matter)

// TODO actually call this function: operator, chars, doublestruck, opnary, eqnumber, ...?
function latexEscape(chars) {
    return Array.from(chars).map(c => {
        if (c in latexEscapes) {
            return latexEscapes[c];  // TODO wrap in {}?
        } else {
            return c;
        }
    }).join("");
}

//////////////////////////////
// TRANSFORM & PRETTY-PRINT //
//////////////////////////////

// since LaTeX code generation is EXPERIMENTAL, there's no point building up an
// ast yet – instead, this function does a whole bunch of nasty string
// concatenation. note that this generates LaTeX as understood by MathJax,
// see: https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference/

// TODO generally wrap more stuff in {}
// TODO map chars, numbers, operators, opnarys and maybe something else to latex escapes
function ltransform(dsty, puast) {

    // map transformation over lists, concatenate the results
    if (Array.isArray(puast)) {
        return puast.map(e => ltransform(dsty, e)).join("");
    }

    var key = k(puast);
    var value = v(puast);

    switch (key) {
        case "unicodemath":

            // use \(...\) and \[...\] instead of $...$ and $$...$$ since MathJax doesn't recognize $...$ (see http://docs.mathjax.org/en/latest/input/tex/delimiters.html)
            var openDelimiter = dsty? "\\[" : "\\(";
            var closeDelimiter = dsty? "\\]" : "\\)";
            var requires = "\\require{cancel}"
            if (value.eqnumber == null) {
                return `${openDelimiter}${requires} ${ltransform(dsty, value.content)} ${closeDelimiter}`
            } else {
                var label = value.eqnumber.replace(/(^-\d-|^\d|^-\d|^--)/,'$1').replace(/[\W]/g, '-');
                return `${openDelimiter} ${requires} ${ltransform(dsty, value.content)}\\tag{${value.eqnumber}}\\label{${label}} ${closeDelimiter}`;
            }
        case "newline":
            return "\\\\\n";

        case "expr":
            return ltransform(dsty, value);

        case "operator":
            return value; // TODO map to latex escapes
        case "negatedoperator":
            return `\\cancel{${value}}`;

        case "element":
            return ltransform(dsty, value);

        // TODO array

        case "matrix":
            return `\\begin{matrix}${ltransform(dsty, value)}\\end{matrix}`;
        case "mrows":
            return value.map(r => `${ltransform(dsty, r)} \\\\`).join("");
        case "mrow":
            // note that this is a matrix row, not a mathml <mrow>
            return value.map(r => ltransform(dsty, r)).join(" & ");
        case "mcol":
            return ltransform(dsty, value);

        case "nary":
            return `${ltransform(dsty, value.limits)} ${ltransform(dsty, value.naryand)}`;
        case "opnary":
            return value;

        case "phantom":
            return "";  // TODO
        case "smash":
            return "";  // TODO

        case "fraction":
            var sym = value.symbol;
            var of = value.of;
            switch (sym) {
                case "/":       // normal fraction ¹-₂
                    return `\\frac{${ltransform(dsty, dropOutermostParens(of[0]))}}{${ltransform(dsty, dropOutermostParens(of[1]))}}`;
                case "\u2044":  // skewed fraction ¹/₂
                    return `{^{${ltransform(dsty, dropOutermostParens(of[0]))}}}/{_{${ltransform(dsty, dropOutermostParens(of[1]))}}}`;  // TODO improve
                case "\u2215":  // linear fraction 1/2
                    return `${ltransform(dsty, dropOutermostParens(of[0]))}/${ltransform(dsty, dropOutermostParens(of[1]))}`;
                case "\u2298":  // small fraction
                    return `{\\small \\frac{${ltransform(dsty, dropOutermostParens(of[0]))}}{${ltransform(dsty, dropOutermostParens(of[1]))}}}`;
            }

        case "atop":
            return `\\substack{${ltransform(dsty, dropOutermostParens(value[0]))}\\\\ ${ltransform(dsty, dropOutermostParens(value[1]))}}`;  // TODO could be improved
        case "binom":
            return `{{${ltransform(dsty, dropOutermostParens(value.top))}} \\choose {${ltransform(dsty, dropOutermostParens(value.bottom))}}}`;

        case "script":
            switch (value.type) {
                case "subsup":  // TODO don't pull primes up into superscript in preprocessing step
                    var ret = `{${ltransform(dsty, value.base)}}`;
                    if ("low" in value) {
                        ret += `_{${ltransform(dsty, dropOutermostParens(value.low))}}`;
                    }
                    if ("high" in value) {
                        ret += `^{${ltransform(dsty, dropOutermostParens(value.high))}}`;
                    }
                    return `{${ret}}`;
                case "pre":
                    var ret = "{}";
                    if ("prelow" in value) {
                        ret += `_{${ltransform(dsty, dropOutermostParens(value.prelow))}}`;
                    } else if ("prehigh" in value) {
                        ret += `_{${ltransform(dsty, dropOutermostParens(value.prehigh))}}`;
                    } else {
                        throw "neither presubscript nor presuperscript present in prescript";
                    }

                    ret = `{${ret}}`;
                    ret += "\\!";

                    ret += `{${ltransform(dsty, value.base)}}`;
                    if ("low" in value) {
                        ret += `_{${ltransform(dsty, value.low)}}`;
                    }
                    if ("high" in value) {
                        ret += `^{${ltransform(dsty, value.high)}}`;
                    }

                    return `{${ret}}`;
                case "abovebelow":
                    var ret = `{${ltransform(dsty, value.base)}}`;
                    if ("low" in value) {
                        ret = `\\underset{${ltransform(dsty, dropOutermostParens(value.low))}}{${ret}}`;
                    }
                    if ("high" in value) {
                        ret = `\\overset{${ltransform(dsty, dropOutermostParens(value.high))}}{${ret}}`;
                    }
                    return `{${ret}}`;
                default:
                    throw "invalid or missing script type";
            }

        case "enclosed":
            return ltransform(dsty, value.of);  // TODO

        case "abstractbox":
            return ltransform(dsty, value.of);  // TODO

        case "hbrack":
            return ltransform(dsty, value.of);  // TODO

        case "root":
            return `\\sqrt[${ltransform(dsty, value.degree)}]{${ltransform(dsty, dropOutermostParens(value.of))}}`;
        case "sqrt":
            return `\\sqrt{${ltransform(dsty, dropOutermostParens(value))}}`;

        case "function":
            // TODO un-italicize function names – have some lookup for the usual latex escapes for lim, sin, etc., and emit the others as \text?
            return `${ltransform(dsty, value.f)}${ltransform(dsty, value.of)}`;

        case "text":
            //return `\\text{\\detokenize{${value}}}`;  // \detokenize doesn't work in mathjax
            return `\\text{${value}}`;

        case "sizeoverride":
            switch (value.size) {  // note that relative sizes are not really a thing afaik, so these are absolute
                case "A":  // one size larger
                    return `{\\large ${ltransform(dsty, value.of)}}`;
                case "B":  // two sizes larger
                    return `{\\Large ${ltransform(dsty, value.of)}}`;
                case "C":  // one size smaller
                    return `{\\small ${ltransform(dsty, value.of)}}`;
                case "D":  // two sizes smaller
                    return `{\\scriptsize ${ltransform(dsty, value.of)}}`;  // note that \footnotesize should come here, but doesn't exist in mathjax: https://github.com/mathjax/MathJax/issues/2039
            }

        case "colored":
            return "{\\color{green}" + ltransform(dsty, value.of) + "}";  // TODO requires "TeX: { ... extensions: ["color.js"] }" in mathjax config
        case "bgcolored":
            return ltransform(dsty, value.of);  // TODO mathjax: \bbox[color]{content}
        case "comment":
            return "";
        case "tt":
            return `\\mathtt{${value}}`;

        case "primed":
            return `{${ltransform(dsty, value.base)}}^{${"\\prime".repeat(value.primes)}}`;

        case "factorial":
            return `${ltransform(dsty, value)}!`;

        case "atoms":
            return ltransform(dsty, value);
        case "chars":
            if (value.length == 1) {
                return italicizeCharacters(value);
            } else {
                return value;
            }

        case "diacriticized":
            return ltransform(dsty, value.base);  // TODO

        case "spaces":
            return ltransform(dsty, value);
        case "space":
            if (typeof value == 'number') {
                return spaceWidthL(value);
            } else if (value == 'digit') {
                return "\\phantom{0}"
            } else if (value == 'space') {
                return "{\\ }";
            } else {
                throw "incorrect space"
            }

        case "number":
            return value;

        case "doublestruck":
            switch (value) {
                case "ⅅ":
                    return "𝐷";
                case "ⅆ":
                    return "\\,𝑑";
                case "ⅇ":
                    return "𝑒";
                case "ⅈ":
                    return "𝑖";
                case "ⅉ":
                    return "𝑗";
            }

        case "bracketed":
            return ltransform(dsty, value.content);  // TODO
            // TODO | as \lvert/\rvert, || as \lVert/\rVert, others somehow too

        default:
            return `\\text{${JSON.stringify(puast)}}`;  // just output it as text for now
    }
}

//////////////
// PLUMBING //
//////////////

function unicodemathtex(unicodemath, displaystyle = false) {
    debugGroup(unicodemath);
    try {
        var t1s = performance.now();
        var uast = parse(unicodemath);
        var t1e = performance.now();
        debugLog(uast);

        var t2s = performance.now();
        var puast = preprocess(displaystyle, uast);
        var t2e = performance.now();
        debugLog(puast);

        var t3s = performance.now();
        var latex = ltransform(displaystyle, puast);
        var t3e = performance.now();

        debugGroup();
        return {
            latex: latex,
            details: {
                measurements: {
                    parse:      t1e - t1s,
                    preprocess: t2e - t2s,
                    transform:  t3e - t3s,
                    pretty:     t3e - t3s
                },
                intermediates: {
                    parse:      uast,
                    preprocess: puast
                }
            }
        };
    } catch(error) {
        debugLog(error);

        // convert error to string and invert any private use area mappings
        var strError = mapFromPrivate("" + error);

        // add variant of input with resolved control words, if any
        if (typeof ummlConfig !== "undefined" && typeof ummlConfig.resolveControlWords !== "undefined" && ummlConfig.resolveControlWords && resolveCW(unicodemath) != unicodemath) {
            strError = "(Resolved to \"" + resolveCW(unicodemath) + "\".) " + error;
        }

        debugGroup();
        return {
            mathml: `<span class="unicodemathml-error"><span class="unicodemathml-error-unicodemath">${escapeHTMLSpecialChars(unicodemath)}</span> <span class="unicodemathml-error-message">${escapeHTMLSpecialChars(strError)}</span></span>`,
            details: {
                error: error
            }
        };
    }
}

root.getPartialMatches = getPartialMatches;
root.mathFonts = mathFonts;
root.italicizeCharacter = italicizeCharacter;
root.negs = negs;
root.resolveCW = resolveCW;
root.unicodemathml = unicodemathml;
root.unicodemathtex = unicodemathtex;

})(this);
