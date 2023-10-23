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
    'a^2 +b^2 =c^2',										// 0
    '1/2π ∫_(0)^2π ⅆθ/(a+b sin⁡θ)=1/√(a^2 -b^2 )',			// 1
    '∫_(−∞)^∞ e^−x^2  ⅆx=√π',							    // 2
    '(a+b)^n=∑_(k=0)^n (n¦k)a^k b^〖n-k〗',			    	// 3
    'â +b̃ -ċ +d̈ ',											// 4
    '{a+b}+[c+d]+(q+r)←→',									// 5
    '𝔥/=𝒽/=𝐇',												// 6
    '⅓a=b',												    // 7
    '⒭n−1▒x',												// 8
    'a\\le b',												// 9
    'iℏ ∂/∂t Ψ(x,t)=[−ℏ²/2m  ∂²/∂x^2 +V(x,t)]Ψ(x,t)',       // 10
    '⒱(a&b@c&d)',											// 11
    '⒨(a&b@c&d)',											// 12
    'a/<=b',												// 13
    '[a,a^† ]=aa^† −a^† a=1',								// 14
    '⟨ψ|ℋ|ψ⟩',												// 15
    'ⅆf(x)/ⅆx=ⅆ^2 f(x)/ⅆx^2=∂^2 f(x,y)/∂x^2=0',	            // 16
    'x=(−b+−√(b^2 -4ac))/2a',								// 17
    '∇⨯𝐄=−∂𝐁/∂t',											// 18
    'sin⁡²x+cos⁡²x=1',									    // 19
    'sin⁡(α+β)=sin⁡α cos⁡β+cos⁡α sin⁡β',    						// 20
    'lim _(n→∞) (1+1/n)^n=e',								// 21
    '\"rate\"=\"distance\"/\"time\" ',						// 22
    'Re⁡⒡e^-iωt=cos⁡ωt',					    				// 23
    '⒨3',									                // 24
    '2×3⒨',											        // 25
    '⒜x=Ⓒ〖"if "x>=0,&x@"if "x<0,&-x〗',		    		// 26
    '(a+b)^n =1',											// 27
    '⍁a+b&c+d〗',											// 28
    '⅔',                                                    // 29
    ']−∞,3[',                                               // 30
    '[3,b)',                                                // 31
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
