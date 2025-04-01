(function (root) {
    'use strict';

var mathDictation = [
    'a ^2 + b ^2 = c ^2',
    'One over two pi space integral from zero to 2π of D theta over left paren a + b sine theta right paren equals one over square root of left paren a ^2 - b ^2 right paren',
    'Integral from minus infinity to infinity of e to the minus x ^2 dx equals square root of pi',
    'left paren a plus b right paren to the n equals sum from k = 0 to n of left paren n atop k right paren a to the k space b to the begin n - k end',
    'a hat plus b tilde - c dot + d double dot',
    'left brace a + b right brace + left bracket c + d right bracket + left paren q + r right paren left arrow right arrow',
    'fraktur H not equals script H not equals bold cap H',
    'one third a equals b',
    'root n minus one of x',
    'a backslash le b',
    'I H bar space partial over partial T space cap sigh left paren X comma t ) equals [minus h bar squared over 2M space space partial squared over partial X ^2 plus cap V left paren X comma t )] cap psi left paren X comma t right paren',
    'determinant a and b next c and d end determinant',
    'matrix a and b next c and d end matrix',
    'a not less than or equal to b',
    'left bracket a comma a dagger right bracket equals a a dagger minus a dagger a = 1',
    'left angle bracket psi vertical bar script cap h vertical bar psi right angle bracket',
    'derivative of f of x with respect to x = second derivative of f of x with respect to x = second partial derivative of f of x comma y with respect to x = 0',
    'X equals left paren minus B plus or minus square root of left paren b ^2 - 4 A C right paren right paren over 2A',
    'Del cross bold cap e equals minus partial derivative of bold cap b with respect to t',
    'sine squared x plus cosine squared x equals one',
    'sine left paren alpha + beta right paren equals sine alpha space cosine beta + cosine alpha space sine beta',
    'limit as N goes to infinity of ( 1 + 1 / n ) to the N equals e',
    'Quote rate quote equals quote distance quote over quote time quote space',
    'real part of e to the -i omega t equals cosine omega t',
    'identity matrix of size 3',
    '2 by 3 matrix',
    'absolute value of x equals cases if x greater than or equal to 0 comma ampersand x next if x less than 0 comma ampersand - x close',
    'left paren a plus b right paren raised to the nth power equals 1',
    'fraction a plus b over c plus d end fraction',
    'two thirds',
    'open interval from minus infinity to 3 end interval',
    'closed open interval from 3 to b end interval',
];

var unicodeMath = [
    '𝑎²+𝑏²=𝑐²',										        // 0
    '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',			        // 1
    '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋',							        // 2
    '(𝑎+𝑏)^𝑛=∑_(𝑘=0)^𝑛 (𝑛¦𝑘)𝑎^𝑘 𝑏^〖𝑛−𝑘〗',			    	// 3
    '𝑎̂ +𝑏̃ −𝑐̇ +𝑑̈ ',										// 4
    '{𝑎+𝑏}+[𝑐+𝑑]+(𝑞+𝑟)←→',									// 5
    '𝔥≠𝒽≠𝐇',												// 6
    '⅓𝑎=𝑏',												    // 7
    '⒭𝑛−1▒𝑥',												// 8
    '𝑎\\le 𝑏',												// 9
    '𝑖ℏ 𝜕/𝜕𝑡 Ψ(𝑥,𝑡)=[−ℏ²/2𝑚  𝜕²/𝜕𝑥²+𝑉(𝑥,𝑡)]Ψ(𝑥,𝑡)',           // 10
    '⒱(𝑎&𝑏@𝑐&𝑑)',											// 11
    '⒨(𝑎&𝑏@𝑐&𝑑)',											// 12
    '𝑎≰𝑏',												    // 13
    '[𝑎,𝑎^† ]=𝑎𝑎^† −𝑎^† 𝑎=1',								// 14
    '⟨𝜓|ℋ|𝜓⟩',												// 15
    'ⅆ𝑓(𝑥)/ⅆ𝑥=ⅆ²𝑓(𝑥)/ⅆ𝑥²=𝜕^2 𝑓(𝑥,𝑦)/𝜕𝑥²=0',	                // 16
    '𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎',								    // 17
    '∇⨯𝐄=−𝜕𝐁/𝜕𝑡',											// 18
    'sin⁡²𝑥+cos⁡²𝑥=1',									        // 19
    'sin⁡(𝛼+𝛽)=sin⁡𝛼 cos⁡𝛽+cos⁡𝛼 sin⁡𝛽',    						// 20
    'lim _(𝑛→∞) (1+1/𝑛)^𝑛=𝑒',								// 21
    '\"rate\"=\"distance\"/\"time\" ',						// 22
    'Re⁡⒡𝑒^−𝑖𝜔𝑡=cos⁡𝜔𝑡',					    				// 23
    '⒨3',									                // 24
    '2×3⒨',											        // 25
    '⒜𝑥=Ⓒ〖"if "𝑥≥0,&𝑥@"if "𝑥<0,&−𝑥〗',		    		    // 26
    '(𝑎+𝑏)^𝑛 =1',											// 27
    '⍁𝑎+𝑏&𝑐+𝑑〗',											// 28
    '⅔',                                                    // 29
    ']−∞,3[',                                               // 30
    '[3,𝑏)',                                                // 31
];

function testDictation() {
    var iSuccess = 0;
    for (var i = 0; i < mathDictation.length; i++) {
        var result = dictationToUnicodeMath(mathDictation[i]);
        if (result != unicodeMath[i]) {
            console.log("Expect: " + unicodeMath[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    var iFail = mathDictation.length - iSuccess;
    console.log(iSuccess + " passes; " + iFail + " failures\n");
}
input.addEventListener("keydown", function (e) {
    if (e.key == 'Enter') {
        e.preventDefault();
        var result = dictationToUnicodeMath(input.value);
        console.log(input.value + '\n' + result + '\n\n');
        output.value = result;
    }
});

    root.testDictation = testDictation;
})(this);
