(function (root) {
    'use strict';

var mathML = [
    "<math display=\"block\"><mrow><mfrac><mn>1</mn><mrow><mn>2</mn><mi>𝜋</mi></mrow></mfrac><mrow intent=\"integral(0,$h,$n)\"><msubsup><mo>∫</mo><mn>0</mn><mrow arg=\"h\"><mn>2</mn><mpadded width=\"0\"><mi>𝜋</mi></mpadded></mrow></msubsup><mfrac arg=\"n\"><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝜃</mi></mrow><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mi>𝜃</mi></mrow></mrow></mfrac></mrow><mo>=</mo><mfrac><mn>1</mn><msqrt><mrow><msup><mi>𝑎</mi><mn>2</mn></msup><mo>−</mo><msup><mi>𝑏</mi><mn>2</mn></msup></mrow></msqrt></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝛁</mi><mo>⨯</mo><mi>𝐄</mi><mo>=</mo><mo>−</mo><mfrac intent=\"partial-derivative(𝐁,1,𝑡)\"><mrow><mi>𝜕</mi><mi>𝐁</mi></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow><mi>𝑖</mi><mi>ℏ</mi></mrow><mfrac intent=\"partial-derivative($f,1,𝑡)\"><mrow><mi>𝜕</mi><mrow arg=\"f\"><mi>𝜓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac><mo>=</mo><mrow><mrow intent=\":fenced\"><mo>[</mo><mrow><mo>−</mo><mfrac><msup><mi>ℏ</mi><mn>2</mn></msup><mrow><mn>2</mn><mi>𝑚</mi></mrow></mfrac><mfrac intent=\"partial-derivative(,2,𝑥)\"><msup><mi>𝜕</mi><mn>2</mn></msup><mrow><mi>𝜕</mi><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></mfrac><mo>+</mo><mrow><mi>𝑉</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mo>]</mo></mrow><mi>𝜓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup><mo>=</mo><mrow intent=\"sum($l,𝑛,$n)\"><munderover><mo>∑</mo><mrow arg=\"l\"><mi>𝑘</mi><mo>=</mo><mn>0</mn></mrow><mi>𝑛</mi></munderover><mrow arg=\"n\"><mrow intent=\"binomial-coefficient(𝑛,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mi>𝑛</mi><mi>𝑘</mi></mfrac><mo>)</mo></mrow><msup><mi>𝑎</mi><mi>𝑘</mi></msup><msup><mi>𝑏</mi><mrow><mi>𝑛</mi><mo>−</mo><mi>𝑘</mi></mrow></msup></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑥</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mi>𝑏</mi><mo>±</mo><msqrt><mrow><msup><mi>𝑏</mi><mn>2</mn></msup><mo>−</mo><mrow><mn>4</mn><mrow><mi>𝑎</mi><mi>𝑐</mi></mrow></mrow></mrow></msqrt></mrow><mrow><mn>2</mn><mi>𝑎</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><msup><mi>sin</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>+</mo><mrow intent=\":function\"><msup><mi>cos</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>=</mo><mn>1</mn></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\"integral($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><msup><mi>𝑒</mi><mrow><mo>−</mo><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></msup><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑥</mi></mrow></mrow></mrow><mo>=</mo><msqrt><mi>𝜋</mi></msqrt></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mspace width=\"thinmathspace\" /><mi>𝑏</mi></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><munder><mi>lim</mi><mrow><mi>𝑛</mi><mo stretchy=\"true\">→</mo><mi>∞</mi></mrow></munder><mo>⁡</mo><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mi>𝑛</mi></mfrac></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup></mrow><mo>=</mo><mi>𝑒</mi></mrow></math>",
    "<math display=\"block\"><mrow><mover accent=\"true\"><mi>𝑓</mi><mo>&#x302;</mo></mover><mrow intent=\":fenced\"><mo>(</mo><mi>𝜉</mi><mo>)</mo></mrow><mo>=</mo><mrow intent=\"integral($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow><msup><mi intent=\"ⅇ\">𝑒</mi><mrow><mo>−</mo><mrow><mn>2</mn><mrow><mi>𝜋</mi><mi intent=\"ⅈ\">𝑖</mi><mi>𝑥</mi><mi>𝜉</mi></mrow></mrow></mrow></msup><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑥</mi></mrow></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mroot><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mi>𝑛</mi></mroot></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><mi>cos</mi><mo>⁡</mo><mi>𝜃</mi></mrow><mo>=</mo><mfrac displaystyle=\"false\"><mn>1</mn><mn>2</mn></mfrac><msup><mi>𝑒</mi><mrow><mi intent=\"ⅈ\">𝑖</mi><mi>𝜃</mi></mrow></msup><mo>+</mo><mtext>c.c.</mtext></mrow></math>",
    "<math display=\"block\"><mrow intent=\":fenced\"><mo>(</mo><mtable intent=\":matrix\"><mtr><mtd><mi>𝑎</mi></mtd><mtd><mi>𝑏</mi></mtd></mtr><mtr><mtd><mi>𝑐</mi></mtd><mtd><mi>𝑑</mi></mtd></mtr></mtable><mo>)</mo></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":fenced\"><mo>|</mo><mi>𝑥</mi><mo>|</mo></mrow><mo>=</mo><mrow intent=\"cases\"><mo>{</mo><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup /><mrow><mrow><mtext>if </mtext><mi>𝑥</mi></mrow><mo>≥</mo></mrow><malignmark /><mrow><mn>0</mn><mo>,</mo></mrow></mtd><mtd><maligngroup /><mi>𝑥</mi></mtd></mtr><mtr><mtd><maligngroup /><mrow><mrow><mtext>if </mtext><mi>𝑥</mi></mrow><mo>&#x3C;</mo></mrow><malignmark /><mrow><mn>0</mn><mo>,</mo></mrow></mtd><mtd><maligngroup /><mrow><mo>−</mo><mi>𝑥</mi></mrow></mtd></mtr></mtable><mo></mo></mrow></mrow></math>",
    "<math display=\"block\"><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup /><mn>10</mn><malignmark /><mrow><mrow><mi>𝑥</mi><mo></mo></mrow><mo>+</mo></mrow></mtd><mtd><maligngroup /><mn>3</mn><malignmark /><mrow><mi>𝑦</mi><mo>=</mo><mn>2</mn></mrow></mtd></mtr><mtr><mtd><maligngroup /><mn>3</mn><malignmark /><mrow><mrow><mi>𝑥</mi><mo></mo></mrow><mo>+</mo></mrow></mtd><mtd><maligngroup /><mn>13</mn><malignmark /><mrow><mi>𝑦</mi><mo>=</mo><mn>4</mn></mrow></mtd></mtr></mtable></math>",
    "<math display=\"block\"><mrow intent=\"absolute-value($a)\"><mo>|</mo><mrow arg=\"a\"><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mo>|</mo></mrow></math>",
    "<math display=\"block\"><mstyle mathcolor=\"#e01f32\"><mi>𝛼</mi></mstyle></math>",
    "<math display=\"block\"><mstyle mathbackground=\"brown\"><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></mstyle></math>",
    "<math display=\"block\"><mrow><mmultiscripts><mi>𝐶</mi><mi>𝑘</mi><none /><mprescripts /><mi>𝑛</mi><none /></mmultiscripts><mo>=</mo><mrow intent=\"binomial-coefficient(𝑛,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mi>𝑛</mi><mi>𝑘</mi></mfrac><mo>)</mo></mrow><mo>=</mo><mfrac><mrow><mi>𝑛</mi><mo>!</mo></mrow><mrow><mrow><mi>𝑘</mi><mo>!</mo></mrow><mrow><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑛</mi><mo>−</mo><mi>𝑘</mi></mrow><mo>)</mo></mrow><mo>!</mo></mrow></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow><mi>𝑖</mi><mi>ℏ</mi></mrow><mfrac intent=\"partial-derivative($f,1,𝑡)\"><mrow><mi>𝜕</mi><mrow arg=\"f\"><mi>𝜓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac><mo>=</mo><mrow><mrow intent=\":fenced\"><mo>[</mo><mrow><mo>−</mo><mfrac><msup><mi>ℏ</mi><mn>2</mn></msup><mrow><mn>2</mn><mi>𝑚</mi></mrow></mfrac><mfrac intent=\"partial-derivative(,2,𝑥)\"><msup><mi>𝜕</mi><mn>2</mn></msup><mrow><mi>𝜕</mi><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></mfrac><mo>+</mo><mrow><mi>𝑉</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mo>]</mo></mrow><mi>𝜓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow></math>",
];

var unicodeMath = [
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)",
    "𝛁⨯𝐄=−𝜕𝐁/𝜕𝑡",
    "𝑖ℏ 𝜕𝜓⁡(𝑥,𝑡)/𝜕𝑡=[−ℏ²/2𝑚 𝜕²/𝜕𝑥²+𝑉(𝑥,𝑡)]𝜓(𝑥,𝑡)",
    "(𝑎+𝑏)^𝑛=∑_(𝑘=0)^𝑛 𝑛⒞𝑘 𝑎^𝑘 𝑏^(𝑛−𝑘)",
    "𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎",
    "sin²⁡𝜃+cos²⁡𝜃=1",
    "∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋",
    "𝑎 𝑏",
    "lim_(𝑛→∞)⁡(1+1/𝑛)^𝑛=𝑒",
    "𝑓̂ (𝜉)=∫_−∞^∞ 𝑓(𝑥)ⅇ^−2𝜋ⅈ𝑥𝜉 ⅆ𝑥",
    "⒭𝑛▒(𝑎+𝑏)",
    'cos⁡𝜃=½𝑒^ⅈ𝜃+"c.c."',
    "(■(𝑎&𝑏@𝑐&𝑑))",
    "|𝑥|=Ⓒ(\"if \"𝑥≥&0,&𝑥@\"if \"𝑥<&0,&−𝑥)",
    "█(10&𝑥+&3&𝑦=2@3&𝑥+&13&𝑦=4)",
    "⒜(𝑎+𝑏)",
    "✎(#e01f32&𝛼)",
    "☁(brown&𝑎+𝑏)",
    "_𝑛 𝐶_𝑘=𝑛⒞𝑘=𝑛!/𝑘!(𝑛−𝑘)!",
    "𝑖ℏ 𝜕𝜓⁡(𝑥,𝑡)/𝜕𝑡=[−ℏ²/2𝑚 𝜕²/𝜕𝑥²+𝑉(𝑥,𝑡)]𝜓(𝑥,𝑡)",
];

function testMathMLtoUnicodeMath() {
    var iSuccess = 0;
    for (var i = 0; i < mathML.length; i++) {
        var result = MathMLtoUnicodeMath(mathML[i]);
        if (result != unicodeMath[i]) {
            console.log("Expect: " + unicodeMath[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    var iFail = mathML.length - iSuccess;
    console.log(iSuccess + " passes; " + iFail + " failures\n");
}
input.addEventListener("keydown", function (e) {
    if (e.key == 'Enter') {
        e.preventDefault();
        var result = MathMLtoUnicodeMath(input.value);
        console.log(input.value + '\n' + result + '\n\n');
        output.value = result;
    }
});

    root.testMathMLtoUnicodeMath = testMathMLtoUnicodeMath;
})(this);
