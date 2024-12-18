'use strict';

const mathML = [
    "<math display=\"block\"><mrow><mfrac><mn>1</mn><mrow><mn>2</mn><mi>𝜋</mi></mrow></mfrac><mrow intent=\":integral(0,$h,$n)\"><msubsup><mo>∫</mo><mn>0</mn><mrow arg=\"h\"><mn>2</mn><mpadded width=\"0\"><mi>𝜋</mi></mpadded></mrow></msubsup><mfrac arg=\"n\"><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝜃</mi></mrow><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mi>𝜃</mi></mrow></mrow></mfrac></mrow><mo>=</mo><mfrac><mn>1</mn><msqrt><mrow><msup><mi>𝑎</mi><mn>2</mn></msup><mo>−</mo><msup><mi>𝑏</mi><mn>2</mn></msup></mrow></msqrt></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝛁</mi><mo>⨯</mo><mi>𝐄</mi><mo>=</mo><mo>−</mo><mfrac intent=\":partial-derivative(1,𝐁,𝑡)\"><mrow><mi>𝜕</mi><mi>𝐁</mi></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow><mi>𝑖</mi><mi>ℏ</mi></mrow><mfrac intent=\":partial-derivative(1,$f,𝑡)\"><mrow><mi>𝜕</mi><mrow arg=\"f\"><mi>𝜓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac><mo>=</mo><mrow><mrow intent=\":fenced\"><mo>[</mo><mrow><mo>−</mo><mfrac><msup><mi>ℏ</mi><mn>2</mn></msup><mrow><mn>2</mn><mi>𝑚</mi></mrow></mfrac><mfrac intent=\":partial-derivative(2,,𝑥)\"><msup><mi>𝜕</mi><mn>2</mn></msup><mrow><mi>𝜕</mi><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></mfrac><mo>+</mo><mrow><mi>𝑉</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mo>]</mo></mrow><mi>𝜓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup><mo>=</mo><mrow intent=\":sum($l,𝑛,$n)\"><munderover><mo>∑</mo><mrow arg=\"l\"><mi>𝑘</mi><mo>=</mo><mn>0</mn></mrow><mi>𝑛</mi></munderover><mrow arg=\"n\"><mrow intent=\"binomial-coefficient(𝑛,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mi>𝑛</mi><mi>𝑘</mi></mfrac><mo>)</mo></mrow><msup><mi>𝑎</mi><mi>𝑘</mi></msup><msup><mi>𝑏</mi><mrow><mi>𝑛</mi><mo>−</mo><mi>𝑘</mi></mrow></msup></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑥</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mi>𝑏</mi><mo>±</mo><msqrt><mrow><msup><mi>𝑏</mi><mn>2</mn></msup><mo>−</mo><mrow><mn>4</mn><mrow><mi>𝑎</mi><mi>𝑐</mi></mrow></mrow></mrow></msqrt></mrow><mrow><mn>2</mn><mi>𝑎</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><msup><mi>sin</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>+</mo><mrow intent=\":function\"><msup><mi>cos</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>=</mo><mn>1</mn></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":integral($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><msup><mi>𝑒</mi><mrow><mo>−</mo><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></msup><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑥</mi></mrow></mrow></mrow><mo>=</mo><msqrt><mi>𝜋</mi></msqrt></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mspace width=\"thinmathspace\" /><mi>𝑏</mi></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><munder><mi>lim</mi><mrow><mi>𝑛</mi><mo stretchy=\"true\">→</mo><mi>∞</mi></mrow></munder><mo>⁡</mo><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mi>𝑛</mi></mfrac></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup></mrow><mo>=</mo><mi>𝑒</mi></mrow></math>",
    "<math display=\"block\"><mrow><mover accent=\"true\"><mi>𝑓</mi><mo>&#x302;</mo></mover><mrow intent=\":fenced\"><mo>(</mo><mi>𝜉</mi><mo>)</mo></mrow><mo>=</mo><mrow intent=\":integral($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow><msup><mi intent=\"ⅇ\">𝑒</mi><mrow><mo>−</mo><mrow><mn>2</mn><mrow><mi>𝜋</mi><mi intent=\"ⅈ\">𝑖</mi><mi>𝑥</mi><mi>𝜉</mi></mrow></mrow></mrow></msup><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑥</mi></mrow></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mroot><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mi>𝑛</mi></mroot></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><mi>cos</mi><mo>⁡</mo><mi>𝜃</mi></mrow><mo>=</mo><mfrac displaystyle=\"false\"><mn>1</mn><mn>2</mn></mfrac><msup><mi>𝑒</mi><mrow><mi intent=\"ⅈ\">𝑖</mi><mi>𝜃</mi></mrow></msup><mo>+</mo><mtext>c.c.</mtext></mrow></math>",
    "<math display=\"block\"><mrow intent=\":fenced\"><mo>(</mo><mtable intent=\":matrix(2,2)\"><mtr><mtd><mi>𝑎</mi></mtd><mtd><mi>𝑏</mi></mtd></mtr><mtr><mtd><mi>𝑐</mi></mtd><mtd><mi>𝑑</mi></mtd></mtr></mtable><mo>)</mo></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":fenced\"><mo>|</mo><mi>𝑥</mi><mo>|</mo></mrow><mo>=</mo><mrow intent=\":cases\"><mo>{</mo><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup /><mrow><mrow><mtext>if </mtext><mi>𝑥</mi></mrow><mo>≥</mo></mrow><malignmark /><mrow><mn>0</mn><mo>,</mo></mrow><maligngroup /><mi>𝑥</mi></mtd></mtr><mtr><mtd><maligngroup /><mrow><mrow><mtext>if </mtext><mi>𝑥</mi></mrow><mo>&#x3C;</mo></mrow><malignmark /><mrow><mn>0</mn><mo>,</mo></mrow><maligngroup /><mrow><mo>−</mo><mi>𝑥</mi></mrow></mtd></mtr></mtable><mo></mo></mrow></mrow></math>",
    "<math display=\"block\"><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup/><mn>10</mn><malignmark/><mrow><mi>𝑥</mi><mo>+</mo></mrow><maligngroup/><mn>3</mn><malignmark/><mrow><mi>𝑦</mi><mo>=</mo><mn>2</mn></mrow></mtd></mtr><mtr><mtd><maligngroup/><mn>3</mn><malignmark/><mrow><mi>𝑥</mi><mo>+</mo></mrow><maligngroup/><mn>13</mn><malignmark/><mrow><mi>𝑦</mi><mo>=</mo><mn>4</mn></mrow></mtd></mtr></mtable></math>",
    //"<math display=\"block\"><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup /><mn>10</mn><malignmark /><mrow><mrow><mi>𝑥</mi><mo></mo></mrow><mo>+</mo></mrow></mtd><mtd><maligngroup /><mn>3</mn><malignmark /><mrow><mi>𝑦</mi><mo>=</mo><mn>2</mn></mrow></mtd></mtr><mtr><mtd><maligngroup /><mn>3</mn><malignmark /><mrow><mrow><mi>𝑥</mi><mo></mo></mrow><mo>+</mo></mrow></mtd><mtd><maligngroup /><mn>13</mn><malignmark /><mrow><mi>𝑦</mi><mo>=</mo><mn>4</mn></mrow></mtd></mtr></mtable></math>",
    "<math display=\"block\"><mrow intent=\"absolute-value($a)\"><mo>|</mo><mrow arg=\"a\"><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mo>|</mo></mrow></math>",
    "<math display=\"block\"><mstyle mathcolor=\"#e01f32\"><mi>𝛼</mi></mstyle></math>",
    "<math display=\"block\"><mstyle mathbackground=\"brown\"><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></mstyle></math>",
    "<math display=\"block\"><mrow><mmultiscripts><mi>𝐶</mi><mi>𝑘</mi><none /><mprescripts /><mi>𝑛</mi><none /></mmultiscripts><mo>=</mo><mrow intent=\"binomial-coefficient(𝑛,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mi>𝑛</mi><mi>𝑘</mi></mfrac><mo>)</mo></mrow><mo>=</mo><mfrac><mrow><mi>𝑛</mi><mo>!</mo></mrow><mrow><mrow><mi>𝑘</mi><mo>!</mo></mrow><mrow><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑛</mi><mo>−</mo><mi>𝑘</mi></mrow><mo>)</mo></mrow><mo>!</mo></mrow></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mfenced><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mrow><mi>𝑐</mi><mo>+</mo><mi>𝑑</mi></mrow></mfenced></math>",
    "<math display=\"block\"><menclose><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></menclose></math>",
    "<math display=\"block\"><menclose notation=\"right left bottom\"><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></menclose></math>",
    "<math display=\"block\"><mover><mover><mrow><msub><mi>𝑥</mi><mn>1</mn></msub><mo>+</mo><mo>⋯</mo><mo>+</mo><msub><mi>𝑥</mi><mi>𝑘</mi></msub></mrow><mo stretchy=\"true\">⏞</mo></mover><mrow><mi>𝑘</mi><mtext> times</mtext></mrow></mover></math>",
    "<math display=\"block\"><munder><munder><mrow><msub><mi>𝑥</mi><mn>1</mn></msub><mo>+</mo><mo>⋯</mo><mo>+</mo><msub><mi>𝑥</mi><mi>𝑘</mi></msub></mrow><mo stretchy=\"true\">⏟</mo></munder><mrow><mi>𝑘</mi><mtext> times</mtext></mrow></munder></math>",
    "<math display=\"block\"><mrow><mi>a</mi><mphantom><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></mphantom><mo>+</mo><mn>1</mn></mrow></math>",
    "<math display=\"block\"><mrow><mn>1</mn><mo>+</mo><menclose notation=\"box\"><mphantom><mfrac><mfrac><mfrac><mfrac><mn>1</mn><mn>2</mn></mfrac><mn>3</mn></mfrac><mn>4</mn></mfrac><mn>5</mn></mfrac></mphantom></menclose></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mo>+</mo><mpadded depth=\"0\" height=\"0\"><mphantom><mrow><mi>𝑏</mi><mo>+</mo><mi>𝑐</mi></mrow></mphantom></mpadded><mo>+</mo><mi>𝑑</mi></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mpadded height=\"0\"><mphantom><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></mphantom></mpadded><mi>𝑐</mi></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mpadded width=\"0\" height=\"0\"><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow></mpadded><mi>𝑐</mi></mrow></math>",
    "<math display=\"block\"><mtable><mlabeledtr id=\"-20-\"><mtd><mtext>(20)</mtext></mtd><mtd> <mrow><mi>𝐸</mi><mo>=</mo><mrow><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mrow></mrow></mtd></mlabeledtr></mtable></math>",
    "<math display=\"block\"><mi mathvariant=\"fraktur\">H</mi></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mo>&#x2264;</mo><mi>𝑏</mi><mo>&#8804;</mo><mi>𝑐</mi></mrow></math>",
    "<math display=\"block\"><mrow><mfrac><mrow><mi>𝑑</mi><mrow intent=\":function\"><mi>𝜓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝑑</mi><mi>𝑡</mi></mrow></mfrac><mo>=</mo><mn>0</mn></mrow></math>",
    "<mml:math display=\"block\"><mml:mrow><mml:msup><mml:mi>𝑎</mml:mi><mml:mn>2</mml:mn></mml:msup><mml:mo>+</mml:mo><mml:msup><mml:mi>𝑏</mml:mi><mml:mn>2</mml:mn></mml:msup><mml:mo>=</mml:mo><mml:msup><mml:mi>𝑐</mml:mi><mml:mn>2</mml:mn></mml:msup></mml:mrow></mml:math>",
    "<math display=\"block\"><mrow><mrow><mi>𝑍</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝛾</mi><mo>+</mo><mrow><mi>𝑖</mi><mi>𝜔</mi></mrow><mo>−</mo><mrow><mi>𝑖</mi><mi>𝜈</mi></mrow></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mfrac><mi>𝑖</mi><msqrt><mi>𝜋</mi></msqrt></mfrac><mrow intent=\":integral($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><mfrac><msup><mi>𝑒</mi><mrow><mo>−</mo><mrow><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝜔</mi><mo>−</mo><msup><mi>𝜔</mi><mo>′</mo></msup></mrow><mo>)</mo></mrow><mn>2</mn></msup><mo>/</mo><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>Δ</mi><mi>𝜔</mi></mrow><mo>)</mo></mrow><mn>2</mn></msup></mrow></mrow></msup><mrow><mi>𝛾</mi><mo>+</mo><mrow><mi>𝑖</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><msup><mi>𝜔</mi><mo>′</mo></msup><mo>−</mo><mi>𝜈</mi></mrow><mo>)</mo></mrow></mrow></mrow></mfrac><mrow><mi intent=\"ⅆ\">𝑑</mi><msup><mi>𝜔</mi><mo>′</mo></msup></mrow></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo></mo><mfrac><mrow><mi>𝑥</mi><mo>+</mo><mi>𝑎</mi></mrow><mn>2</mn></mfrac><mo></mo></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":fenced\"><mo>|</mo><mi>𝑥</mi><mo>|</mo></mrow><mo>=</mo><mrow intent=\":fenced\"><mo>{</mo><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup /><mspace width=\"0\" /><malignmark /><mrow><mrow><mi>𝑥</mi><mtext> if </mtext><mi>𝑥</mi></mrow><mo>≥</mo><mn>0</mn></mrow></mtd></mtr><mtr><mtd><maligngroup /><mo>−</mo><malignmark /><mrow><mrow><mi>𝑥</mi><mtext> if </mtext><mi>𝑥</mi></mrow><mo>&lt;</mo><mn>0</mn></mrow></mtd></mtr></mtable><mo></mo></mrow></mrow></math>",
    "<m:math xmlns:m=\"http://www.w3.org/1998/Math/MathML\" altimg=\"E7.png\" altimg-height=\"49px\" altimg-valign=\"-16px\" altimg-width=\"249px\" alttext=\"\\frac{\\mathrm{d}}{\\mathrm{d}z}\\operatorname{arcsin}z=(1-z^{2})^{-1/2},\" display=\"block\"><m:mrow><m:mrow><m:mrow><m:mfrac><m:mo href=\"DLMF:/1.4#E4\" title=\"derivative\">d</m:mo><m:mrow><m:mo href=\"DLMF:/1.4#E4\" rspace=\"0em\" title=\"derivative\">d</m:mo><m:mi href=\"DLMF:/4.1#p2.t1.r4\" title=\"complex variable\">z</m:mi></m:mrow></m:mfrac><m:mo lspace=\"0.167em\">⁡</m:mo><m:mrow><m:mi href=\"DLMF:/4.23#ii.p1\" title=\"arcsine function\">arcsin</m:mi><m:mo lspace=\"0.167em\">⁡</m:mo><m:mi href=\"DLMF:/4.1#p2.t1.r4\" title=\"complex variable\">z</m:mi></m:mrow></m:mrow><m:mo>=</m:mo><m:msup><m:mrow><m:mo stretchy=\"false\">(</m:mo><m:mrow><m:mn>1</m:mn><m:mo>−</m:mo><m:msup><m:mi href=\"DLMF:/4.1#p2.t1.r4\" title=\"complex variable\">z</m:mi><m:mn>2</m:mn></m:msup></m:mrow><m:mo stretchy=\"false\">)</m:mo></m:mrow><m:mrow><m:mo>−</m:mo><m:mrow><m:mn>1</m:mn><m:mo>/</m:mo><m:mn>2</m:mn></m:mrow></m:mrow></m:msup></m:mrow><m:mo>,</m:mo></m:mrow></m:math>",
    "<math display=\"block\"><mrow><msub><mi>𝜃</mi><mn>1</mn></msub><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑧</mi><mo>│</mo><mi>𝜏</mi></mrow><mo>)</mo></mrow><mo>=</mo><msub><mi>𝜃</mi><mn>1</mn></msub><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑧</mi><mo>,</mo><mi>𝑞</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>2</mn><mo>⁢</mo><mrow intent=\":sum($l,∞,$n)\"><munderover><mo>∑</mo><mrow arg=\"l\"><mi>𝑛</mi><mo>=</mo><mn>0</mn></mrow><mi>∞</mi></munderover><mrow arg=\"n\"><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup></mrow></mrow><mo>⁢</mo><msup><mi>𝑞</mi><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑛</mi><mo>+</mo><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><mo>)</mo></mrow><mn>2</mn></msup></msup><mo>⁢</mo><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mrow intent=\":fenced\"><mo>(</mo><mrow><mn>2</mn><mo>⁢</mo><mi>𝑛</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⁢</mo><mi>𝑧</mi></mrow><mo>)</mo></mrow></mrow><mo>,</mo></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\"binomial-coefficient(𝑧,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mi>𝑧</mi><mi>𝑘</mi></mfrac><mo>)</mo></mrow><mo>=</mo><mfrac><mrow><mi>𝑧</mi><mo>⁢</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑧</mi><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⁢</mo><mo>⋯</mo><mo>⁢</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑧</mi><mo>−</mo><mi>𝑘</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mrow><mi>𝑘</mi><mo>!</mo></mrow></mfrac><mo>=</mo><mfrac><mrow><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mi>𝑘</mi></msup><mo>⁢</mo><msub><mrow intent=\":fenced\"><mo>(</mo><mrow><mo>−</mo><mi>𝑧</mi></mrow><mo>)</mo></mrow><mi>𝑘</mi></msub></mrow><mrow><mi>𝑘</mi><mo>!</mo></mrow></mfrac><mo>=</mo><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mi>𝑘</mi></msup><mo>⁢</mo><mrow intent=\"binomial-coefficient($t,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mrow arg=\"t\"><mrow><mi>𝑘</mi><mo>−</mo><mi>𝑧</mi><mo>−</mo><mn>1</mn></mrow></mrow><mi>𝑘</mi></mfrac><mo>)</mo></mrow><mo>.</mo></mrow></math>",
    "<math display=\"block\"><mfrac intent=\":derivative(1,$f,𝑧)\"><mrow><mi intent=\"ⅆ\">𝑑</mi><msup arg=\"f\"><mi>𝛾</mi><mo>′</mo></msup></mrow><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑧</mi></mrow></mfrac></math>",
    "<math display=\"block\"><mrow><mfrac intent=\":derivative(2,$f,𝑧)\"><mrow><msup><mi intent=\"ⅆ\">𝑑</mi><mn>2</mn></msup><msup arg=\"f\"><mi>𝛾</mi><mo>∗</mo></msup></mrow><mrow><mi intent=\"ⅆ\">𝑑</mi><msup><mi>𝑧</mi><mn>2</mn></msup></mrow></mfrac><mo>≠</mo><mfrac intent=\":derivative(1,$f,𝑧)\"><mrow><mi intent=\"ⅆ\">𝑑</mi><msup arg=\"f\"><mi>𝛾</mi><mo>∗</mo></msup></mrow><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑧</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mfrac intent=\":partial-derivative(1,$f,𝑥′)\"><mrow><mi>𝜕</mi><mrow arg=\"f\" intent=\":function\"><mi>𝑓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><msup><mi>𝑥</mi><mo>′</mo></msup></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝜕</mi><msup><mi>𝑥</mi><mo>′</mo></msup></mrow></mfrac><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mfrac intent=\":partial-derivative(2,$f,𝑥)\"><mrow><msup><mi>𝜕</mi><mn>2</mn></msup><mrow arg=\"f\" intent=\":function\"><mi>𝑓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝜕</mi><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></mfrac></math>",
    "<m:math xmlns:m=\"http://www.w3.org/1998/Math/MathML\" altimg=\"E6.png\" altimg-height=\"58px\" altimg-valign=\"-22px\" altimg-width=\"623px\" alttext=\"\\genfrac{(}{)}{0.0pt}{}{z}{k}=\\frac{z(z-1)\\cdots(z-k+1)}{k!}=\\frac{(-1)^{k}{%&#10;\\left(-z\\right)_{k}}}{k!}=(-1)^{k}\\genfrac{(}{)}{0.0pt}{}{k-z-1}{k}.\" display=\"block\"><m:mrow><m:mrow><m:mrow><m:mo href=\"DLMF:/1.2#i\" title=\"binomial coefficient\">(</m:mo><m:mfrac linethickness=\"0.0pt\"><m:mi href=\"DLMF:/1.1#p2.t1.r2\" title=\"variable\">z</m:mi><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi></m:mfrac><m:mo href=\"DLMF:/1.2#i\" title=\"binomial coefficient\">)</m:mo></m:mrow><m:mo>=</m:mo><m:mfrac><m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r2\" title=\"variable\">z</m:mi><m:mo>⁢</m:mo><m:mrow><m:mo stretchy=\"false\">(</m:mo><m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r2\" title=\"variable\">z</m:mi><m:mo>−</m:mo><m:mn>1</m:mn></m:mrow><m:mo stretchy=\"false\">)</m:mo></m:mrow><m:mo>⁢</m:mo><m:mi mathvariant=\"normal\">⋯</m:mi><m:mo>⁢</m:mo><m:mrow><m:mo stretchy=\"false\">(</m:mo><m:mrow><m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r2\" title=\"variable\">z</m:mi><m:mo>−</m:mo><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi></m:mrow><m:mo>+</m:mo><m:mn>1</m:mn></m:mrow><m:mo stretchy=\"false\">)</m:mo></m:mrow></m:mrow><m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi><m:mo href=\"../../front/introduction#common.p1.t1.r15\" title=\"factorial (as in 𝑛!)\">!</m:mo></m:mrow></m:mfrac><m:mo>=</m:mo><m:mfrac><m:mrow><m:msup><m:mrow><m:mo stretchy=\"false\">(</m:mo><m:mrow><m:mo>−</m:mo><m:mn>1</m:mn></m:mrow><m:mo stretchy=\"false\">)</m:mo></m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi></m:msup><m:mo>⁢</m:mo><m:msub><m:mrow><m:mo href=\"DLMF:/5.2#iii\" title=\"Pochhammer’s symbol (or shifted factorial)\">(</m:mo><m:mrow><m:mo>−</m:mo><m:mi href=\"DLMF:/1.1#p2.t1.r2\" title=\"variable\">z</m:mi></m:mrow><m:mo href=\"DLMF:/5.2#iii\" title=\"Pochhammer’s symbol (or shifted factorial)\">)</m:mo></m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi></m:msub></m:mrow><m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi><m:mo href=\"../../front/introduction#common.p1.t1.r15\" title=\"factorial (as in 𝑛!)\">!</m:mo></m:mrow></m:mfrac><m:mo>=</m:mo><m:mrow><m:msup><m:mrow><m:mo stretchy=\"false\">(</m:mo><m:mrow><m:mo>−</m:mo><m:mn>1</m:mn></m:mrow><m:mo stretchy=\"false\">)</m:mo></m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi></m:msup><m:mo>⁢</m:mo><m:mrow><m:mo href=\"DLMF:/1.2#i\" title=\"binomial coefficient\">(</m:mo><m:mfrac linethickness=\"0.0pt\"><m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi><m:mo>−</m:mo><m:mi href=\"DLMF:/1.1#p2.t1.r2\" title=\"variable\">z</m:mi><m:mo>−</m:mo><m:mn>1</m:mn></m:mrow><m:mi href=\"DLMF:/1.1#p2.t1.r4\" title=\"integer\">k</m:mi></m:mfrac><m:mo href=\"DLMF:/1.2#i\" title=\"binomial coefficient\">)</m:mo></m:mrow></m:mrow></m:mrow><m:mo lspace=\"0em\">.</m:mo></m:mrow></m:math>",
    "<m:math xmlns:m=\"http://www.w3.org/1998/Math/MathML\" altimg=\"E5.png\" altimg-height=\"75px\" altimg-valign=\"-28px\" altimg-width=\"236px\" alttext=\"\\left\\lfloor\\frac{1}{n}\\right\\rfloor=\\begin{cases}1,&amp;n=1,0,&amp;n&gt;1.\\end{cases}\" display=\"block\"><m:mrow><m:mrow><m:mo href=\"../../front/introduction#common.p1.t1.r17\" title=\"floor of 𝑥\">⌊</m:mo><m:mfrac><m:mn>1</m:mn><m:mi href=\"DLMF:/27.1#p2.t1.r1\" title=\"positive integer\">n</m:mi></m:mfrac><m:mo href=\"../../front/introduction#common.p1.t1.r17\" title=\"floor of 𝑥\">⌋</m:mo></m:mrow><m:mo>=</m:mo><m:mrow><m:mo>{</m:mo><m:mtable columnspacing=\"5pt\" displaystyle=\"true\" rowspacing=\"0pt\"><m:mtr><m:mtd class=\"ltx_align_left\" columnalign=\"left\"><m:mrow><m:mn>1</m:mn><m:mo>,</m:mo></m:mrow></m:mtd><m:mtd class=\"ltx_align_left\" columnalign=\"left\"><m:mrow><m:mrow><m:mi href=\"DLMF:/27.1#p2.t1.r1\" title=\"positive integer\">n</m:mi><m:mo>=</m:mo><m:mn>1</m:mn></m:mrow><m:mo>,</m:mo></m:mrow></m:mtd></m:mtr><m:mtr><m:mtd class=\"ltx_align_left\" columnalign=\"left\"><m:mrow><m:mn>0</m:mn><m:mo>,</m:mo></m:mrow></m:mtd><m:mtd class=\"ltx_align_left\" columnalign=\"left\"><m:mrow><m:mrow><m:mi href=\"DLMF:/27.1#p2.t1.r1\" title=\"positive integer\">n</m:mi><m:mo>&gt;</m:mo><m:mn>1</m:mn></m:mrow><m:mo lspace=\"0em\">.</m:mo></m:mrow></m:mtd></m:mtr></m:mtable></m:mrow></m:mrow></m:math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mo>+</mo><mfrac displaystyle=\"false\"><mn>1</mn><mn>20</mn></mfrac><mo>+</mo><mfrac displaystyle=\"false\"><mn>56</mn><mn>625</mn></mfrac><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mrow><mfrac intent=\":derivative(𝑛,$f,𝑥)\"><mrow><msup><mi>𝑑</mi><mi>𝑛</mi></msup><mrow arg=\"f\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝑑</mi><msup><mi>𝑥</mi><mi>𝑛</mi></msup></mrow></mfrac><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mrow><mfrac intent=\":derivative($n,$f,𝑥)\"><mrow><msup><mi>𝑑</mi><mrow arg=\"n\"><mi>𝑛</mi><mo>−</mo><mn>1</mn></mrow></msup><mrow arg=\"f\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝑑</mi><msup><mi>𝑥</mi><mrow><mi>𝑛</mi><mo>−</mo><mn>1</mn></mrow></msup></mrow></mfrac><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mrow intent=\"closed-interval(−∞,3)\"><mo>[</mo><mrow><mrow><mo>−</mo><mi>∞</mi></mrow><mo>,</mo><mn>3</mn></mrow><mo>]</mo></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":partial-derivative(2,$f,𝑥,𝑥′)\"><msub><mi>𝜕</mi><mrow><mi>𝑥</mi><msup><mi>𝑥</mi><mo>′</mo></msup></mrow></msub><mrow arg=\"f\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><msup><mi>𝑥</mi><mo>′</mo></msup></mrow><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mfrac intent=\":partial-derivative(2,$f,𝑥,𝑥′)\"><mrow><msup><mi>𝜕</mi><mn>2</mn></msup><mrow arg=\"f\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><msup><mi>𝑥</mi><mo>′</mo></msup></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mrow><mi>𝜕</mi><mi>𝑥</mi><mi>𝜕</mi></mrow><msup><mi>𝑥</mi><mo>′</mo></msup></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\"$op($a)\"><msup><mi arg=\"a\">𝐴</mi><mi arg=\"op\" intent=\"transpose\">𝑇</mi></msup></mrow><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":derivative(1,𝑓(𝑥),𝑥)\"><msup><mi>𝑓</mi><mo>′</mo></msup><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow intent=\":derivative(1,𝑓(𝑥′),𝑥′)\"><msup><mi>𝑓</mi><mo>′</mo></msup><mrow intent=\":fenced\"><mo>(</mo><msup><mi>𝑥</mi><mo>′</mo></msup><mo>)</mo></mrow></mrow></mrow></math>",
    "<math display=\"block\"><msup intent=\":sup\"><mi>𝑎</mi><mn>2</mn></msup></math>",
    "<math display=\"block\"><mrow><mrow intent=\"cardinality(𝑥)\"><mo>|</mo><mi>𝑥</mi><mo>|</mo></mrow><mrow intent=\"absolute-value($a)\"><mo>|</mo><mrow arg=\"a\"><mi>𝑥</mi><mo>+</mo><mn>2</mn></mrow><mo>|</mo></mrow><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mrow intent=\":parenthesized-matrix\"><mo>(</mo><mtable intent=\":matrix(2,2)\"><mtr><mtd><mn>1</mn></mtd><mtd><mn>0</mn></mtd></mtr><mtr><mtd><mn>0</mn></mtd><mtd><mn>1</mn></mtd></mtr></mtable><mo>)</mo></mrow></math>",
    "<math display=\"block\"><mfrac><msubsup><mi>𝛼</mi><mn>2</mn><mn>3</mn></msubsup><mrow><msubsup><mi>𝛽</mi><mn>2</mn><mn>3</mn></msubsup><mo>+</mo><msubsup><mi>𝛾</mi><mn>2</mn><mn>3</mn></msubsup></mrow></mfrac></math>",
    "<math display=\"block\"><mfenced open=\"[\" close=\"]\"><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mrow><mi>𝑐</mi><mo>+</mo><mi>𝑑</mi></mrow></mfenced></math>",
    "<math display=\"block\"><mrow><mi>𝐸</mi><mo>=</mo><mrow><mi selanchor=\"-0\">𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝐸</mi><mo>=</mo><mrow><mi>𝑚</mi><msup selanchor=\"0\" selfocus=\"2\"><mi>𝑐</mi><mn>2</mn></msup></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝐸</mi><mo>=</mo><mrow><mi selanchor=\"-0\">𝑚</mi><msup selfocus=\"2\"><mi>𝑐</mi><mn>2</mn></msup></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><msup><mi selanchor=\"-1\" selfocus=\"-2\">sin</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>+</mo><mrow intent=\":function\"><msup><mi>cos</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>=</mo><mn>1</mn></mrow></math>",
    "<math display=\"block\"><mrow><mn selanchor=\"-1\" selfocus=\"-2\">123</mn><mo>=</mo></mrow></math>",
    "<math display=\"block\"><mrow intent=\":function\"><mi selanchor=\"-1\" selfocus=\"-2\">sin</mi><mo>⁡</mo><mi>𝑥</mi></mrow></math>",
    "<math display=\"block\"><mrow><mrow><msup><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mn>2</mn><mo>)</mo></mrow></msup><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow></mrow><mo>=</mo><mn>0</mn></mrow></math>",
    "<math display=\"block\"><mfrac><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mo>)</mo></mrow><mi>𝑐</mi></mfrac></math>",
    "<math display=\"block\"><msubsup><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑎</mi><mo>−</mo><mn>0</mn></mrow><mo>)</mo></mrow><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑏</mi><mo>+</mo><mi>𝑐</mi></mrow><mo>)</mo></mrow></msubsup></math>",
    "<math display=\"block\"><mrow><mfrac intent=\"derivative(1,$f,𝑥)\"><mi>𝑑</mi><mrow><mi>𝑑</mi><mi>𝑥</mi></mrow></mfrac><mrow arg=\"f\"><mrow intent=\":fenced\"><mo>(</mo><mrow><msup><mi>𝑥</mi><mn>2</mn></msup><mo>+</mo><mi>𝑥</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mn>2</mn><mi>𝑥</mi></mrow><mo>+</mo><mn>1</mn></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mo selanchor=\"0\">^</mo></mrow></math>",
    "<math display=\"block\"><mrow intent=\":determinant\"><mo>|</mo><mtable intent=\":array(2,2)\"><mtr><mtd><mi>𝑎</mi></mtd><mtd><mi>𝑏</mi></mtd></mtr><mtr><mtd><mi>𝑐</mi></mtd><mtd><mi>𝑑</mi></mtd></mtr></mtable><mo>|</mo></mrow></math>",
]

const unicodeMath = [
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)",
    "𝛁⨯𝐄=−𝜕𝐁/𝜕𝑡",
    "𝑖ℏ 𝜕𝜓⁡(𝑥,𝑡)/𝜕𝑡=[−ℏ²/2𝑚 𝜕²/𝜕𝑥²+𝑉(𝑥,𝑡)]𝜓(𝑥,𝑡)",
    "(𝑎+𝑏)^𝑛=∑_(𝑘=0)^𝑛 𝑛⒞𝑘 𝑎^𝑘 𝑏^(𝑛−𝑘)",
    "𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎",
    "sin²⁡𝜃+cos²⁡𝜃=1",
    "∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋",
    "𝑎 𝑏",
    "lim_(𝑛→∞) ⁡(1+1/𝑛)^𝑛=𝑒",
    "𝑓̂(𝜉)=∫_−∞^∞ 𝑓(𝑥)ⅇ^−2𝜋ⅈ𝑥𝜉 ⅆ𝑥",
    "√(𝑛&𝑎+𝑏)",
    'cos⁡𝜃=½𝑒^ⅈ𝜃+"c.c."',
    "(■(𝑎&𝑏@𝑐&𝑑))",
    "|𝑥|=Ⓒ(\"if \"𝑥≥&0,&𝑥@\"if \"𝑥<&0,&−𝑥)",
    "█(10&𝑥+&3&𝑦=2@3&𝑥+&13&𝑦=4)",
    "|𝑎+𝑏|",
    "✎(#e01f32&𝛼)",
    "☁(brown&𝑎+𝑏)",
    "_𝑛 𝐶_𝑘=𝑛⒞𝑘=𝑛!/𝑘!(𝑛−𝑘)!",
    "(𝑎+𝑏,𝑐+𝑑)",
    "▭(𝑎+𝑏)",
    "▭(1&𝑎+𝑏)",
    "⏞(𝑥₁+⋯+𝑥_𝑘)┴(𝑘\" times\")",
    "⏟(𝑥₁+⋯+𝑥_𝑘)┬(𝑘\" times\")",
    "𝑎⟡(𝑎+𝑏)+1",
    "1+▭⟡(1/2/3/4/5)",
    "𝑎+⬄(𝑏+𝑐)+𝑑",
    "𝑎⟡(4&𝑎+𝑏)𝑐",
    "𝑎⟡(7&𝑎+𝑏)𝑐",
    "𝐸=𝑚𝑐²#(20)",
    "ℌ",
    "𝑎≤𝑏≤𝑐",
    "𝑑𝜓⁡(𝑥,𝑡)/𝑑𝑡=0",
    "𝑎²+𝑏²=𝑐²",
    "𝑍(𝛾+𝑖𝜔−𝑖𝜈)=𝑖/√𝜋 ∫_−∞^∞ 𝑒^(−(𝜔−𝜔′)²\\/(Δ𝜔)²)/(𝛾+𝑖(𝜔′−𝜈)) ⅆ𝜔′",
    "sin⁡〖(𝑥+𝑎)/2〗",
    "|𝑥|={█(​&𝑥\" if \"𝑥≥0@−&𝑥\" if \"𝑥<0)┤",
    "ⅆ/ⅆ𝑧 ⁡arcsin⁡𝑧=(1−𝑧²)^(−1\\/2) ,",
    "𝜃₁⁡(𝑧│𝜏)=𝜃₁⁡(𝑧,𝑞)=2⁢∑_(𝑛=0)^∞ (−1)^𝑛 ⁢𝑞^(𝑛+1/2)² ⁢sin⁡((2⁢𝑛+1)⁢𝑧),",
    "𝑧⒞𝑘=(𝑧⁢(𝑧−1)⁢⋯⁢(𝑧−𝑘+1))/𝑘!=((−1)^𝑘 ⁢(−𝑧)_𝑘)/𝑘!=(−1)^𝑘 ⁢(𝑘−𝑧−1)⒞𝑘 .",
    "ⅆ𝛾′/ⅆ𝑧",
    "ⅆ²𝛾^∗/ⅆ𝑧² ≠ⅆ𝛾^∗/ⅆ𝑧",
    "𝜕𝑓⁡(𝑥,𝑥′)/𝜕𝑥′=0",
    "𝜕²𝑓⁡(𝑥)/𝜕𝑥²",
    "𝑧⒞𝑘=(𝑧⁢(𝑧−1)⁢⋯⁢(𝑧−𝑘+1))/𝑘!=((−1)^𝑘 ⁢(−𝑧)_𝑘)/𝑘!=(−1)^𝑘 ⁢(𝑘−𝑧−1)⒞𝑘 .",
    "⌊1/𝑛 ⌋={■(1,&𝑛=1,@0,&𝑛>1.)┤",
    "𝑎+¹⁄₂₀+⁵⁶⁄₆₂₅=0",
    "𝑑^𝑛 𝑓(𝑥)/𝑑𝑥^𝑛=0",
    "𝑑^(𝑛−1) 𝑓(𝑥)/𝑑𝑥^(𝑛−1)=0",
    "[−∞,3]",
    "𝜕_𝑥𝑥′ 𝑓(𝑥,𝑥′)=𝜕²𝑓(𝑥,𝑥′)/𝜕𝑥𝜕𝑥′",
    "ⓘ(\"$op($a)\"ⓐ(a 𝐴)^ⓐopⓘ(\"transpose\"𝑇))=0",
    "ⓘ(\":derivative\"𝑓′(𝑥))=ⓘ(\":derivative\"𝑓′(𝑥′))",
    "ⓘ(\": sup\"𝑎²)",
    "ⓒ𝑥 |𝑥+2|=0",
    "⒨(1&0@0&1)",
    "𝛼₂³/(𝛽₂³+𝛾₂³)",
    "[𝑎+𝑏,𝑐+𝑑]",
    "𝐸=Ⓐ(-0)𝑚𝑐²",
    "𝐸=𝑚Ⓐ()Ⓕ(2)𝑐²",
    "𝐸=Ⓐ(-0)𝑚Ⓕ(2)𝑐²",
    "Ⓐ(-1)Ⓕ(-2)sin²⁡𝜃+cos²⁡𝜃=1",
    "Ⓐ(-1)Ⓕ(-2)123=",
    "Ⓐ(-1)Ⓕ(-2)sin⁡𝑥",
    "𝑓^((2)) (𝑥)=0",
    "((𝑎+𝑏))/𝑐",
    "𝑓_((𝑎−0))^((𝑏+𝑐))",
    "𝑑/𝑑𝑥 (𝑥²+𝑥+1)=2𝑥+1",
    "𝑎Ⓐ()^",
    "⒱(𝑎&𝑏@𝑐&𝑑)",
]

const mathSpeech = [
    "1 over 2 pi integral from 0 to 2 width smash pi of , fraction d theta over eigh + b sine theta , end fraction = fraction 1 over square root , eigh squared minus b squared , end square root , end fraction",
    //"bold del  cross bold cap E = minus partial  bold cap B over partial  t",
    "bold del cross bold cap E = minus partial-derivative of bold cap B with respect to t",
    //"i h bar , partial  psi  open x comma t close over partial  t = open bracket minus fraction h bar squared over 2 m , end fraction , partial  squared over partial  x squared + cap V open x comma t close close bracket psi open x comma t close",
    "i h bar partial-derivative of psi of x comma t with respect to t = open bracket minus h bar squared over 2 m second partial-derivative with respect to x + cap V of x comma t , close bracket psi of x comma t",
    "open eigh + b close to the n , = sum from k = 0 to n of n choose k eigh to the k , b to the n minus k power",
    "x = fraction minus b plus or minus square root , b squared minus 4 eigh c , end square root over 2 eigh , end fraction",
    "sine squared theta + cosine squared theta = 1",
    "integral from minus infinity to infinity of e to the minus x squared , d x = square root , pi",
    "eigh   b",
    "limit as n goes to infinity of open 1 + 1 over n close to the n , = e",
    "f hat of xkai  = integral from minus infinity to infinity of f of x , e to the minus 2 pi i x xkai , d x",
    "root n of eigh + b , end root",
    "cosine theta = one half e to the i theta , + complex conjugate",
    "the 2 by 2 matrix,  , row 1 , eigh , b , row 2 , c , d , end matrix",
    "absolute value of x , = 2 cases , case 1 , if x greater than or equal to 0 comma x , case 2 , if x less than 0 comma minus x",
    "2 equation array , equation 1 , 10 x + 3 y = 2 , equation 2 , 3 x + 13 y = 4",
    "absolute value of eigh + b , end absolute value",
    "color hex e01 f32 , alpha , end color",
    "back color brown eigh + b , end back color",
    "sub n cap C sub k = n choose k = n factorial over k factorial open n minus k close factorial",
    "open eigh + b comma c + d close",
    "box eigh + b , end box",
    "line on right left bottom enclosing eigh + b , end enclosure",
    "modified modified x sub 1 + dot dot dot + x sub k with over brace above with k times above",
    "modified modified x sub 1 + dot dot dot + x sub k with under brace below with k times below",
    "a phantom eigh + b , end phantom + 1",
    "1 + box phantom fraction fraction fraction fraction 1 over 2 , end fraction over 3 , end fraction over 4 , end fraction over 5 , end fraction , end phantom , end box",
    "eigh + width phantom b + c , end phantom + d",
    "eigh phantom open 4 and eigh + b close c",
    "eigh phantom open 7 and eigh + b close c",
    "cap E = m c squared , equation 20",
    "fraktur cap H",
    "eigh less than or equal to b less than or equal to c",
    "d psi open x comma t close over d t = 0",
    "eigh squared + b squared = c squared",
    "cap Z open gamma + i omega minus i nu close = fraction i over square root , pi , end fraction integral from minus infinity to infinity of fraction e to the minus open omega minus omega prime close squared over open Delta omega close squared power over gamma + i open omega prime minus nu close , end fraction d omega prime",
    "sine fraction x + eigh over 2 , end fraction",
    "absolute value of x , = 2 cases , case 1 , , x if x greater than or equal to 0 , case 2 , minus x if x less than 0",
    "d over dz arcsine z= open 1 minus z squared close to the minus 1 over 2 power comma",
    "theta sub 1 open z vertical bar tau close = theta sub 1 open z comma q close = 2 sum from n = 0 to infinity of open minus 1 close to the n , q to the open n + one half close squared , sine open open 2 n + 1 close z close comma",
    "z choose k = fraction z open z minus 1 close dot dot dot open z minus k + 1 close over k factorial , end fraction = fraction open minus 1 close to the k , open minus z close sub k over k factorial , end fraction = open minus 1 close to the k , open k minus z minus 1 close choose k period",
    //"d gamma  prime over d z",
    "derivative of gamma prime with respect to z",
    //"fraction d squared gamma  conjugate over d z squared , end fraction not equal fraction d gamma  conjugate over d z , end fraction",
    "second derivative of gamma conjugate with respect to z not equal derivative of gamma conjugate with respect to z",
    //"partial  f open x comma x prime close over partial  x prime = 0",
    "partial-derivative of f of x comma x prime with respect to x prime = 0",
    //"partial  squared f of x over partial  x squared",
    "second partial-derivative of f of x with respect to x",
    "z choose k = fraction z open z minus 1 close dot dot dot open z minus k+ 1 close over k factorial , end fraction = fraction open minus 1 close to the k , open minus z close sub k over k factorial , end fraction = open minus 1 close to the k , open k minus z minus 1 close choose k period",
    "open floor 1 over n close floor = the 2 by 2 matrix,  , row 1 , 1 comma , n= 1 comma , row 2 , 0 comma , n greater than 1 period , end matrix",
    "eigh + 1 over 20 + 56 over 625 = 0",
    "nth derivative of f of x with respect to x = 0",
    "n minus first derivative of f of x with respect to x = 0",
    "closed interval from minus infinity to 3",
    "second partial-derivative of f of x comma x prime with respect to x and x prime = second partial-derivative of f of x comma x prime with respect to x and x prime",
    "transpose of cap eigh = 0",
    "derivative of f of x with respect to x = derivative of f of x prime with respect to x prime",
    "eigh soup 2",
    "cardinality of x , absolute value of x + 2 , end absolute value = 0",
    "the 2 by 2 matrix,  , row 1 , 1 , 0 , row 2 , 0 , 1 , end matrix",
    "fraction alpha sub 2 cubed over beta sub 2 cubed + gamma sub 2 cubed , end fraction",
    "open bracket eigh + b comma c + d close bracket",
    "cap E = insertion point m c squared",
    "cap E = m sel-anchor c squared sel-focus",
    "cap E = sel-anchor m c squared sel-focus",
    "s sel-anchor i sel-focus n squared theta + cosine squared theta = 1",
    "1 sel-anchor 2 sel-focus 3 =",
    "s sel-anchor i sel-focus n x",
    "second derivative of f of x = 0",
    "open eigh + b close over c",
    "f sub open eigh minus 0 close to the open b + c close",
    "derivative of x squared + x + 1 with respect to x = 2 x + 1",
    "eigh insertion point soup",
    "the 2 by 2 determinant , row 1 , eigh , b , row 2 , c , d , end determinant",
]

const mathBrailles = [
    "⠹⠂⠌⠆⠨⠏⠼⠮⠰⠴⠘⠆⠨⠏⠐⠹⠙⠨⠹⠌⠁⠬⠃⠀⠎⠊⠝⠀⠨⠹⠼⠀⠨⠅⠀⠹⠂⠌⠜⠁⠘⠆⠐⠤⠃⠘⠆⠐⠻⠼",
    "⠸⠨⠫⠈⠡⠸⠰⠠⠑⠀⠨⠅⠀⠤⠹⠈⠙⠸⠰⠠⠃⠌⠈⠙⠞⠼",
    "⠊⠈⠓⠹⠈⠙⠨⠽⠀⠷⠭⠠⠀⠞⠾⠌⠈⠙⠞⠼⠀⠨⠅⠀⠈⠷⠤⠹⠈⠓⠘⠆⠐⠌⠆⠍⠼⠹⠈⠙⠘⠆⠐⠌⠈⠙⠭⠘⠆⠐⠼⠬⠠⠧⠷⠭⠠⠀⠞⠾⠈⠾⠨⠽⠷⠭⠠⠀⠞⠾",
    "⠷⠁⠬⠃⠾⠘⠝⠀⠨⠅⠀⠐⠨⠠⠎⠩⠅⠀⠨⠅⠀⠼⠴⠣⠝⠻⠷⠝⠩⠅⠾⠁⠘⠅⠐⠃⠘⠝⠤⠅",
    "⠭⠀⠨⠅⠀⠹⠤⠃⠬⠤⠜⠃⠘⠆⠐⠤⠲⠁⠉⠻⠌⠆⠁⠼",
    "⠎⠊⠝⠘⠆⠀⠨⠹⠬⠉⠕⠎⠘⠆⠀⠨⠹⠀⠨⠅⠀⠼⠂",
    "⠮⠰⠤⠠⠿⠘⠠⠿⠐⠑⠘⠤⠭⠘⠘⠆⠐⠙⠭⠀⠨⠅⠀⠜⠨⠏⠻",
    "⠁⠃",
    "⠐⠇⠊⠍⠩⠝⠀⠫⠒⠒⠕⠀⠠⠿⠻⠀⠷⠂⠬⠹⠂⠌⠝⠼⠾⠘⠝⠀⠨⠅⠀⠑",
    "⠐⠋⠣⠸⠣⠻⠷⠨⠭⠾⠀⠨⠅⠀⠮⠰⠤⠠⠿⠘⠠⠿⠐⠋⠷⠭⠾⠑⠘⠤⠆⠨⠏⠊⠭⠨⠭⠐⠙⠭",
    "⠣⠝⠜⠁⠬⠃⠻",
    "⠉⠕⠎⠀⠨⠹⠀⠨⠅⠀⠹⠂⠌⠆⠼⠑⠘⠊⠨⠹⠐⠬⠉⠸⠲⠉⠸⠲",
    "⠠⠷⠁⠀⠃⣍⠉⠀⠙⠠⠾",
    "⠳⠭⠳⠀⠨⠅⠀⠨⠷⠊⠋ ⠭⠀⠨⠂⠱⠀⠼⠴⠠⠀⠭⣍⠊⠋ ⠭⠀⠐⠅⠀⠼⠴⠠⠀⠤⠭",
    "⠼⠂⠴⠭⠬⠒⠽⠀⠨⠅⠀⠼⠆⣍⠒⠭⠬⠂⠒⠽⠀⠨⠅⠀⠼⠲",
    "⠳⠁⠬⠃⠳",
    "⠨⠁",
    "⠁⠬⠃",
    "⠰⠝ ⠠⠉⠰⠅⠀⠨⠅⠀⠷⠝⠩⠅⠾⠀⠨⠅⠀⠹⠝⠸⠖⠌⠅⠸⠖⠷⠝⠤⠅⠾⠸⠖⠼",
    "⠷⠁⠬⠃⠠⠀⠉⠬⠙⠾",
    "⠫⠗⠸⠫⠁⠬⠃⠻",
    "⠳⠐⠁⠬⠃⠩⠱⠻⠳",
    "⠐⠐⠭⠂⠬⠀⠄⠄⠄ ⠬⠭⠰⠅⠐⠣⠨⠷⠻⠣⠅ ⠞⠊⠍⠑⠎⠻",
    "⠐⠐⠭⠂⠬⠀⠄⠄⠄ ⠬⠭⠰⠅⠐⠩⠨⠾⠻⠩⠅ ⠞⠊⠍⠑⠎⠻",
    "⠁⠁⠬⠃⠬⠂",
    "⠼⠂⠬⠫⠗⠸⠫⠹⠹⠹⠹⠂⠌⠆⠼⠌⠒⠼⠌⠲⠼⠌⠢⠼⠻",
    "⠁⠬⠃⠬⠉⠬⠙",
    "⠁⠁⠬⠃⠉",
    "⠁⠁⠬⠃⠉",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠐⠨⠼⠆⠴",
    "⠸⠰⠠⠓",
    "⠁⠀⠐⠅⠱⠀⠃⠀⠐⠅⠱⠀⠉",
    "⠹⠙⠨⠽⠀⠷⠭⠠⠀⠞⠾⠌⠙⠞⠼⠀⠨⠅⠀⠼⠴",
    "⠁⠘⠆⠐⠬⠃⠘⠆⠀⠨⠅⠀⠉⠘⠆",
    "⠠⠵⠷⠨⠛⠬⠊⠨⠺⠤⠊⠨⠝⠾⠀⠨⠅⠀⠹⠊⠌⠜⠨⠏⠻⠼⠮⠰⠤⠠⠿⠘⠠⠿⠐⠹⠑⠘⠤⠷⠨⠺⠤⠨⠺⠄⠾⠘⠘⠆⠐⠌⠷⠨⠠⠙⠨⠺⠾⠘⠘⠆⠐⠌⠨⠛⠬⠊⠷⠨⠺⠄⠤⠨⠝⠾⠼⠙⠨⠺⠄",
    "⠎⠊⠝⠀⠹⠭⠬⠁⠌⠆⠼",
    "⠳⠭⠳⠀⠨⠅⠀⠨⠷⠭ ⠊⠋ ⠭⠀⠨⠂⠱⠀⠼⠴⣍⠤⠭ ⠊⠋ ⠭⠀⠐⠅⠀⠼⠴",
    "⠹⠙⠌⠙⠵⠼⠀⠁⠗⠉⠎⠊⠝⠀⠵⠀⠨⠅⠀⠷⠂⠤⠵⠘⠆⠐⠾⠘⠤⠂⠌⠆⠐⠠⠀",
    "⠨⠹⠂⠀⠷⠵⠳⠨⠞⠾⠀⠨⠅⠀⠨⠹⠂⠀⠷⠵⠠⠀⠟⠾⠀⠨⠅⠀⠼⠆⁢⠐⠨⠠⠎⠩⠝⠀⠨⠅⠀⠼⠴⠣⠠⠿⠻⠷⠤⠂⠾⠘⠝⠐⁢⠟⠘⠷⠝⠬⠹⠂⠌⠆⠼⠾⠘⠘⠆⠐⁢⠎⠊⠝⠀⠷⠷⠆⁢⠝⠬⠂⠾⁢⠵⠾⠠⠀",
    "⠷⠵⠩⠅⠾⠀⠨⠅⠀⠹⠵⁢⠷⠵⠤⠂⠾⁢⠀⠄⠄⠄ ⁢⠷⠵⠤⠅⠬⠂⠾⠌⠅⠸⠖⠼⠀⠨⠅⠀⠹⠷⠤⠂⠾⠘⠅⠐⁢⠷⠤⠵⠾⠰⠅⠐⠌⠅⠸⠖⠼⠀⠨⠅⠀⠷⠤⠂⠾⠘⠅⠐⁢⠷⠷⠅⠤⠵⠤⠂⠾⠩⠅⠾⠸⠲",
    "⠹⠙⠨⠛⠄⠌⠙⠵⠼",
    "⠹⠙⠘⠆⠐⠨⠛⠘⠈⠼⠐⠌⠙⠵⠘⠆⠐⠼⠀⠌⠨⠅⠀⠹⠙⠨⠛⠘⠈⠼⠐⠌⠙⠵⠼",
    "⠹⠈⠙⠋⠀⠷⠭⠠⠀⠭⠄⠾⠌⠈⠙⠭⠄⠼⠀⠨⠅⠀⠼⠴",
    "⠹⠈⠙⠘⠆⠐⠋⠀⠷⠭⠾⠌⠈⠙⠭⠘⠆⠐⠼",
    "⠷⠵⠩⠅⠾⠀⠨⠅⠀⠹⠵⁢⠷⠵⠤⠂⠾⁢⠀⠄⠄⠄ ⁢⠷⠵⠤⠅⠬⠂⠾⠌⠅⠸⠖⠼⠀⠨⠅⠀⠹⠷⠤⠂⠾⠘⠅⠐⁢⠷⠤⠵⠾⠰⠅⠐⠌⠅⠸⠖⠼⠀⠨⠅⠀⠷⠤⠂⠾⠘⠅⠐⁢⠷⠅⠤⠵⠤⠂⠩⠅⠾⠸⠲",
    "⠈⠰⠷⠹⠂⠌⠝⠼⠈⠰⠾⠀⠨⠅⠀⠨⠷⠂⠠⠀⠀⠝⠀⠨⠅⠀⠼⠂⠠⠀⣍⠴⠠⠀⠀⠝⠀⠨⠂⠀⠼⠂⠸⠲",
    "⠁⠬⠹⠂⠌⠆⠴⠼⠬⠹⠢⠖⠌⠖⠆⠢⠼⠀⠨⠅⠀⠼⠴",
    "⠹⠙⠘⠝⠐⠋⠷⠭⠾⠌⠙⠭⠘⠝⠐⠼⠀⠨⠅⠀⠼⠴",
    "⠹⠙⠘⠝⠤⠂⠐⠋⠷⠭⠾⠌⠙⠭⠘⠝⠤⠂⠐⠼⠀⠨⠅⠀⠼⠴",
    "⠈⠷⠤⠠⠿⠠⠀⠼⠒⠈⠾",
    "⠈⠙⠰⠭⠭⠄⠐⠋⠷⠭⠠⠀⠭⠄⠾⠀⠨⠅⠀⠹⠈⠙⠘⠆⠐⠋⠷⠭⠠⠀⠭⠄⠾⠌⠈⠙⠭⠈⠙⠭⠄⠼",
    "⠠⠁⠘⠠⠞⠀⠨⠅⠀⠼⠴",
    "⠋⠄⠷⠭⠾⠀⠨⠅⠀⠋⠄⠷⠭⠄⠾",
    "⠁⠘⠆",
    "⠳⠭⠳⠳⠭⠬⠆⠳⠀⠨⠅⠀⠼⠴",
    "⠠⠷⠼⠂⠀⠼⠴⣍⠼⠴⠀⠼⠂⠠⠾",
    "⠹⠨⠁⠆⠘⠒⠐⠌⠨⠃⠆⠘⠒⠐⠬⠨⠛⠆⠘⠒⠐⠼",
    "⠈⠷⠁⠬⠃⠠⠀⠉⠬⠙⠈⠾",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆",
    "⠎⠊⠝⠘⠆⠀⠨⠹⠬⠉⠕⠎⠘⠆⠀⠨⠹⠀⠨⠅⠀⠼⠂",
    "⠼⠂⠆⠒⠀⠨⠅⠀",
    "⠎⠊⠝⠀⠭",
    "⠋⠘⠷⠆⠾⠐⠷⠭⠾⠀⠨⠅⠀⠼⠴",
    "⠹⠷⠁⠬⠃⠾⠌⠉⠼",
    "⠋⠰⠷⠁⠤⠴⠾⠘⠷⠃⠬⠉⠾",
    "⠹⠙⠌⠙⠭⠼⠷⠭⠘⠆⠐⠬⠭⠬⠂⠾⠀⠨⠅⠀⠼⠆⠭⠬⠂",
    "⠁⠸⠣",
    "⠠⠳⠁⠀⠃⣍⠉⠀⠙⠠⠳",
]

const mathTeXs = [                          // Some cases aren't supported by TeX
    '\\frac{1}{2𝜋}∫_0^{2\\hsmash{𝜋}}\\frac{𝑑𝜃}{𝑎+𝑏 \\sin 𝜃}=\\frac{1}{\\sqrt{𝑎^2−𝑏^2}}',
    '𝛁⨯𝐄=−\\frac{𝜕𝐁}{𝜕𝑡}',
    '𝑖ℏ\\frac{𝜕𝜓(𝑥,𝑡)}{𝜕𝑡}=[−\\frac{ℏ^2}{2𝑚}\\frac{𝜕^2}{𝜕𝑥^2}+𝑉(𝑥,𝑡)]𝜓(𝑥,𝑡)',
    '(𝑎+𝑏)^𝑛=∑_{𝑘=0}^𝑛\\binom{𝑛}{𝑘}𝑎^𝑘𝑏^{𝑛−𝑘}',
    '𝑥=\\frac{−𝑏±\\sqrt{𝑏^2−4𝑎𝑐}}{2𝑎}',
    '\\sin ^2𝜃+\\cos ^2𝜃=1',
    '∫_{−∞}^∞𝑒^{−𝑥^2}𝑑𝑥=\\sqrt{𝜋}',
    '𝑎 𝑏',
    '\\lim _{𝑛→∞}(1+\\frac{1}{𝑛})^𝑛=𝑒',
    '\\hat{𝑓}(𝜉)=∫_{−∞}^∞𝑓(𝑥)𝑒^{−2𝜋𝑖𝑥𝜉}𝑑𝑥',
    '\\sqrt[𝑛]{𝑎+𝑏}',
    '\\cos 𝜃=\\frac{1}{2}𝑒^{𝑖𝜃}+\\textrm{c.c.}',
    '(\\begin{matrix}𝑎&𝑏\\\\𝑐&𝑑\\end{matrix})',
    '|𝑥|=\\begin{cases}\\textrm{if }𝑥≥&0,&𝑥\\\\\\textrm{if }𝑥<&0,&−𝑥\\end{cases}',
    '\\begin{aligned}10&𝑥+&3&𝑦=2\\\\3&𝑥+&13&𝑦=4\\end{aligned}',
    '\\abs{𝑎+𝑏}',
    '✎(#e01f32&𝛼)',                        // TeX has color?
    '☁(brown&𝑎+𝑏)',                        // TeX has backcolor?
    '_𝑛 𝐶_𝑘=\\binom{𝑛}{𝑘}=\\frac{𝑛!}{𝑘!(𝑛−𝑘)!}',
    '(𝑎+𝑏,𝑐+𝑑)',
    '\\boxed{𝑎+𝑏}',
    '\\boxed{𝑎+𝑏}',                          // TeX has partial \boxed?
    '\\overbrace{𝑥_1+⋅⋅⋅+𝑥_𝑘}^{𝑘\\textrm{ times}}',
    '\\underbrace{𝑥_1+⋅⋅⋅+𝑥_𝑘}_{𝑘\\textrm{ times}}',
    '𝑎\\phantom{𝑎+𝑏}+1',
    '1+\\boxed{\\phantom{\\frac{\\frac{\\frac{\\frac{1}{2}}{3}}{4}}{5}}}',
    '𝑎+\\hphantom{𝑏+𝑐}+𝑑',
    '𝑎⟡(4&𝑎+𝑏)𝑐',                           // TeX doesn't have this & next
    '𝑎⟡(7&𝑎+𝑏)𝑐',
    '\\begin{equation}𝐸=𝑚𝑐^2\\end{equation}',
    'ℌ',
    '𝑎≤𝑏≤𝑐',
    '\\frac{𝑑𝜓(𝑥,𝑡)}{𝑑𝑡}=0',
    '𝑎^2+𝑏^2=𝑐^2',
    '𝑍(𝛾+𝑖𝜔−𝑖𝜈)=\\frac{𝑖}{\\sqrt{𝜋}}∫_{−∞}^∞\\frac{𝑒^{−(𝜔−𝜔′)^2/(Δ𝜔)^2}}{𝛾+𝑖(𝜔′−𝜈)}𝑑𝜔′',
    '\\sin {\\frac{𝑥+𝑎}{2}}',
    '|𝑥|=\\begin{cases}​&𝑥\\textrm{ if }𝑥≥0\\\\−&𝑥\\textrm{ if }𝑥<0\\end{cases}',
    '\\frac{𝑑}{𝑑𝑧}\\arcsin 𝑧=(1−𝑧^2)^{−1/2},',
    '𝜃_1(𝑧│𝜏)=𝜃_1(𝑧,𝑞)=2⁢∑_{𝑛=0}^∞(−1)^𝑛⁢𝑞^(𝑛+\\frac{1}{2})^2⁢\\sin ((2⁢𝑛+1)⁢𝑧),',
    '\\binom{𝑧}{𝑘}=\\frac{𝑧⁢(𝑧−1)⁢⋅⋅⋅⁢(𝑧−𝑘+1)}{𝑘!}=\\frac{(−1)^𝑘⁢(−𝑧)_𝑘}{𝑘!}=(−1)^𝑘⁢\\binom{𝑘−𝑧−1}{𝑘}.',
    '\\frac{𝑑𝛾′}{𝑑𝑧}',
    '\\frac{𝑑^2𝛾^∗}{𝑑𝑧^2}≠\\frac{𝑑𝛾^∗}{𝑑𝑧}',
    '\\frac{𝜕𝑓(𝑥,𝑥′)}{𝜕𝑥′}=0',
    '\\frac{𝜕^2𝑓(𝑥)}{𝜕𝑥^2}',
    '\\binom{𝑧}{𝑘}=\\frac{𝑧⁢(𝑧−1)⁢⋯⁢(𝑧−𝑘+1)}{𝑘!}=\\frac{(−1)^𝑘⁢(−𝑧)_𝑘}{𝑘!}=(−1)^𝑘⁢\\binom{𝑘−𝑧−1}{𝑘}.',
    '⌊\\frac{1}{𝑛}⌋=\\begin{cases}1,&𝑛=1,\\\\0,&𝑛>1.\\end{cases}',
    '𝑎+\\frac{1}{20}+\\frac{56}{625}=0',
    '\\frac{𝑑^𝑛𝑓(𝑥)}{𝑑𝑥^𝑛}=0',
    '\\frac{𝑑^{𝑛−1}𝑓(𝑥)}{𝑑𝑥^{𝑛−1}}=0',
    '[−∞,3]',
    '𝜕_{𝑥𝑥′}𝑓(𝑥,𝑥′)=\\frac{𝜕^2𝑓(𝑥,𝑥′)}{𝜕𝑥𝜕𝑥′}',
    '𝐴^⊺=0',
    '𝑓′(𝑥)=𝑓′(𝑥′)',
    '𝑎^2',
    '\\card{𝑥}\\abs{𝑥+2}=0',
    '\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}',
    '\\frac{𝛼_2^3}{𝛽_2^3+𝛾_2^3}',
    '[𝑎+𝑏,𝑐+𝑑]',
    '𝐸=𝑚𝑐^2',
    '𝐸=𝑚𝑐^2',
    '𝐸=𝑚𝑐^2',
    '\\sin ^2𝜃+\\cos ^2𝜃=1',
    '123=',
    '\\sin 𝑥',
    '𝑓^(2)(𝑥)=0',
    '\\frac{(𝑎+𝑏)}{𝑐}',
    '𝑓_(𝑎−0)^(𝑏+𝑐)',
    '\\frac{𝑑}{𝑑𝑥}(𝑥^2+𝑥+1)=2𝑥+1',
    '𝑎^',
    '\\begin{vmatrix}𝑎&𝑏\\\\𝑐&𝑑\\end{vmatrix}',
]

function testMathMLtoUnicodeMath() {
    var iSuccess = 0;
    var iFail = 0;
   for (var i = 0; i < mathML.length; i++) {
        var result = MathMLtoUnicodeMath(mathML[i], true);
        if (result != unicodeMath[i]) {
            if (unicodeMath[i][0] != 'ⓘ') {
                console.log("Expect: " + unicodeMath[i] + '\n');
                console.log("Result: " + result + '\n\n');
                iFail++;
            }
        } else {
            iSuccess++;
        }
    }
    console.log("Test MathML to UnicodeMath: " + iSuccess + " passes; " + iFail + " failures\n");
}

function testMathMLtoSpeech() {
    var iSuccess = 0;
    for (var i = 0; i < mathML.length; i++) {
        var result = MathMLtoSpeech(mathML[i]);
        if (result != mathSpeech[i]) {
            console.log(unicodeMath[i] + '\n');
            console.log("Expect: " + mathSpeech[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    var iFail = mathML.length - iSuccess;
    console.log("Test MathML to speech: " + iSuccess + " passes; " + iFail + " failures\n");
}

function testMathMLtoBraille() {
    var iSuccess = 0;
    for (var i = 0; i < mathML.length; i++) {
        var result = MathMLtoBraille(mathML[i]);
        if (result != mathBrailles[i]) {
            console.log(unicodeMath[i] + '\n');
            console.log("Expect: " + mathBrailles[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    var iFail = mathML.length - iSuccess;
    console.log("Test MathML to braille: " + iSuccess + " passes; " + iFail + " failures\n");
}

function testMathMLtoTeX() {
    var iSuccess = 0;
    for (var i = 0; i < mathTeXs.length; i++) {
        var result = MathMLtoTeX(mathML[i]);
        if (result != mathTeXs[i]) {
            console.log(unicodeMath[i] + '\n');
            console.log("Expect: " + mathTeXs[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    var iFail = mathTeXs.length - iSuccess;
    console.log("Test MathML to TeX: " + iSuccess + " passes; " + iFail + " failures\n");
}

function ctrlZ(key) {
    // Execute undo (if 'z')
    if (!key)
        key = 'z'

    const event = new Event('keydown')
    event.key = key
    event.ctrlKey = true
    output.dispatchEvent(event)
    setTimeout(function () { }, 50)         // Sleep for 50 msec
}

function buildUp(uMath, uMathPartial) {
    // Build up UnicodeMath string one character at a time. If uMathPartial
    // is defined, check results against uMathPartial
    output.innerHTML = `<math display='block'><mi selanchor="0" selfocus="1">⬚</mi></math>`
    let sel = window.getSelection()
    setSelection(sel, output, 0)
    let iSuccess = 0

    for (let i = 0, j = 0; i < uMath.length + 1; i++, j++) {
        const event = new Event('keydown')
        event.key = ' '
        if (i < uMath.length)
            event.key = getCh(uMath, i)
        output.dispatchEvent(event)
        setTimeout(function () { }, 50)     // Sleep for 50 msec
        if (event.key.length == 2)
            i++                             // Bypass trail surrogate
        if (uMathPartial) {
            let result = getUnicodeMath(output.firstElementChild, true)
            if (result != uMathPartial[j]) {
                console.log('test ' + j + ': key = \'' + event.key + '\'\nExpect: ' + unicodeMathPartial[j] + '\n');
                console.log("Result: " + result + '\n')
            } else {
                iSuccess++
            }
        }
    }
    return iSuccess
}

function testUndo(uMathIn, uMathOut) {
    let iSuccess = 0

    buildUp(uMathIn)

    for (let i = uMathOut.length, j = 0; i > 0; i--, j++) {
        ctrlZ()
        let result = getUnicodeMath(output, true)
        if (result != uMathOut[j]) {
            console.log('test ' + j)
            console.log('Expect: ' + uMathOut[j])
            console.log('Result: ' + result)
        } else {
            iSuccess++
        }
    }
    let iFail = uMathOut.length - iSuccess
    console.log('Test undo build up of ' + uMathIn + ': ' + iSuccess + ' passes; ' + iFail + ' failures')
}

const unicodeMathPartial = [                            // test
    "Ⓐ(1)1",                                           // 0
    "1Ⓐ(1)\\/",                                        // 1
    "1\\/Ⓐ(1)2",                                       // 2
    "1\\/2Ⓐ(1)𝜋",                                      // 3
    "1/2𝜋 Ⓐ()",                                        // 4
    "1/2𝜋 Ⓐ(1)∫",                                      // 5
    "1/2𝜋 ∫Ⓐ(1)_",                                     // 6
    "1/2𝜋 ∫_Ⓐ(1)0",                                    // 7
    "1/2𝜋 ∫_0Ⓐ(1)^",                                   // 8
    "1/2𝜋 ∫_0^Ⓐ(1)2",                                  // 9
    "1/2𝜋 ∫_0^2Ⓐ(1)⬌",                                // 10
    "1/2𝜋 ∫_0^2⬌Ⓐ(1)𝜋",                               // 11
    "1/2𝜋 ∫_0^2⬌𝜋 Ⓐ()",                               // 12
    "1/2𝜋 ∫_0^2⬌𝜋 Ⓐ(1)ⅆ",                             // 13
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆⒶ(1)𝜃",                            // 14
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃Ⓐ(1)\\/",                         // 15
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/Ⓐ(1)(",                        // 16
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(Ⓐ(1)𝑎",                       // 17
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎Ⓐ(1)+",                      // 18
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+Ⓐ(1)𝑏",                     // 19
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏Ⓐ(1) ",                     // 20
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏 Ⓐ(1)𝑠",                    // 21
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏 𝑠Ⓐ(1)𝑖",                    // 22
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏 𝑠𝑖Ⓐ(1)𝑛",                   // 23
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏 sinⒶ(1)\u2061",            // 24
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏 sin⁡Ⓐ(1)𝜃",                 // 25
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃\\/(𝑎+𝑏 sin⁡𝜃Ⓐ(1))",               // 26
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃) Ⓐ(1)=",               // 27
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=Ⓐ(1)1",               // 28
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1Ⓐ(1)\\/",            // 29
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/Ⓐ(1)√",           // 30
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√Ⓐ(1)(",          // 31
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√(Ⓐ(1)𝑎",         // 32
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√(𝑎Ⓐ(1)²",        // 33
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√(𝑎²Ⓐ(1)−",       // 34
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√(𝑎²−Ⓐ(1)𝑏",      // 35
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√(𝑎²−𝑏Ⓐ(1)²",     // 36
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1\\/√(𝑎²−𝑏²Ⓐ(1))",    // 37
    "1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²) Ⓐ()",      // 38
]

function testAutoBuildUp() {
    let sel = window.getSelection()
    let output = document.getElementById('output')
    setSelection(sel, output, 0)

    // Test autobuildup of 1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)
    let iSuccess = buildUp(unicodeMath[0], unicodeMathPartial)
    let iFail = unicodeMathPartial.length - iSuccess
    console.log('Test build up of mode-locking equation: ' + iSuccess + " passes; " + iFail + " failures\n")

    // Test undo of autobuildup of 1/2𝜋 ∫_0^2⬌𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)
    iSuccess = 0
    //console.log('Undo mode-locking equation (work in progress...)')
    //for (let i = unicodeMathPartial.length - 2; i > 0; i--) {
    //    ctrlZ()
    //    let result = getUnicodeMath(output, true)
    //    if (result != unicodeMathPartial[i]) {
    //        console.log('test ' + i)
    //        console.log('Expect: ' + unicodeMathPartial[i])
    //        console.log("Result: " + result)
    //    } else {
    //        iSuccess++
    //    }
    //}
    //iFail = unicodeMathPartial.length - 1 - iSuccess
    //console.log(iSuccess + " passes; " + iFail + " failures\n")

    // Autobuildup UnicodeMath strings a character at a time and check
    // final results
    iFail = unicodeMath.length
    iSuccess = 0

    for (let k = 0; k < iFail; k++) {
        if (unicodeMath[k].indexOf('Ⓐ') != -1 ||
            unicodeMath[k][0] == 'ⓘ') {
            iSuccess++
            continue                        // Users don't enter sel info
        }
        buildUp(unicodeMath[k])
        let result = getUnicodeMath(output.firstElementChild, false).trimEnd()
        result = result.replace(/\u202F/g, ' ')
        result = result.replace(/\u00A0/g, ' ')
        if (result != unicodeMath[k]) {
            console.log('Expect: ' + unicodeMath[k] + '\n');
            console.log("Result: " + result + '\n\n')
        } else {
            iSuccess++
        }
    }
    iFail -= iSuccess
    console.log('Test build up of all equations: ' + iSuccess + " passes; " + iFail + " failures\n")

    // Test undo of autobuildup of 𝑎/𝑏+𝑐/𝑑=0, 1/√(𝑎²-𝑏²), \alpha , "rate"
    const unicodeMathPartialFractions = [
        '𝑎/𝑏+𝑐/𝑑=Ⓐ(1)0',                // Insertion point after '0'
        '𝑎/𝑏+𝑐/𝑑 Ⓐ(1)=',
        '𝑎/𝑏+𝑐\\/Ⓐ(1)𝑑',                // \/ implies build up did not occur
        '𝑎/𝑏+𝑐Ⓐ(1)\\/',
        '𝑎/𝑏+Ⓐ(1)𝑐',
        '𝑎/𝑏 Ⓐ(1)+',
        '𝑎\\/Ⓐ(1)𝑏',
        '𝑎Ⓐ(1)\\/',
        'Ⓐ(1)𝑎',
    ]
    const unicodeMathPartialSqrt = [
        '√(𝑎²−𝑏²Ⓐ(1))',
        '√(𝑎²−𝑏Ⓐ(1)²',
        '√(𝑎²−Ⓐ(1)𝑏',
        '√(𝑎²Ⓐ(1)−',
        '√(𝑎Ⓐ(1)²',
        '√(Ⓐ(1)𝑎',
        '√Ⓐ(1)(',
        'Ⓐ(1)√',
    ]
    const unicodeMathPartialControlWord = [
        'Ⓐ(1)𝛼',
        'Ⓐ(-6)𝛼',
        'Ⓐ(-5)"\\alph"',
        'Ⓐ(-4)"\\alp"',
        'Ⓐ(-3)"\\al"',
        'Ⓐ(-2)"\\a"',
        'Ⓐ(1)\\',
    ]
    const unicodeMathPartialText = [
        'Ⓐ(-4)"rate"',
        'Ⓐ(-5)"\\"rate"',
        'Ⓐ(-4)"\\"rat"',
        'Ⓐ(-3)"\\"ra"',
        'Ⓐ(-2)"\\"r"',
        'Ⓐ(1)"\\""',
    ]
    testUndo('a/b+c/d=0', unicodeMathPartialFractions)
    testUndo('√(𝑎²-𝑏²)', unicodeMathPartialSqrt)
    testUndo('\\alpha ', unicodeMathPartialControlWord)
    testUndo('"rate"', unicodeMathPartialText)
}

const clipExpect = "<math display=\"block\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfrac><mi>𝑎</mi><mi>𝑏</mi></mfrac><mo>+</mo><mfrac><mi>𝑐</mi><mi>𝑑</mi></mfrac></math>"
const homeExpect = "Ⓐ() 𝑎/𝑏+𝑐/𝑑=0"
const endExpect = "𝑎/𝑏+𝑐/𝑑=0 Ⓐ()"
const rightArrowExpect = ['Ⓐ()𝑎/𝑏+𝑐/𝑑=0', 'Ⓐ(1)𝑎/𝑏+𝑐/𝑑=0', '𝑎/Ⓐ()𝑏+𝑐/𝑑=0',
    '𝑎/Ⓐ(1)𝑏+𝑐/𝑑=0', '𝑎/𝑏 Ⓐ()+𝑐/𝑑=0', '𝑎/𝑏+Ⓐ() 𝑐/𝑑=0', '𝑎/𝑏+Ⓐ()𝑐/𝑑=0',
    '𝑎/𝑏+Ⓐ(1)𝑐/𝑑=0', '𝑎/𝑏+𝑐/Ⓐ()𝑑=0', '𝑎/𝑏+𝑐/Ⓐ(1)𝑑=0', '𝑎/𝑏+𝑐/𝑑 Ⓐ()=0',
    '𝑎/𝑏+𝑐/𝑑=Ⓐ()0', 'Ⓐ(5) 𝑎/𝑏+𝑐/𝑑=0',
]

function testOutputHotKey(key, expect) {
    const event = new Event('keydown')
    event.key = key
    if (key.length == 1) {
        event.ctrlKey = true
        key = 'Ctrl+' + key
    }
    output.dispatchEvent(event)
    setTimeout(function () { }, 50)
    let uMath = getUnicodeMath(output.firstElementChild, true)
    if (uMath == expect) {
        console.log('Output ' + key + ' succeeded')
    } else {
        console.log('Output ' + key + ' failed. result: ' + uMath + " expect: " + expect)
    }
}

function testInputHotKey(key, altKey, ctrlKey, expect, expectStart, expectEnd) {
    let hotKey = altKey || ctrlKey
    const event = new Event(hotKey ? 'keydown' : 'input')
    event.key = key
    if (altKey)
        event.altKey = true
    if (ctrlKey)
        event.ctrlKey = true
    if (!hotKey)
        event.inputType = 'insertText'
    input.dispatchEvent(event)
    setTimeout(function () { }, 50)
    if (event.altKey)
        key = 'Alt+' + key
    if (event.ctrlKey)
        key = 'Ctrl+' + key
    if (input.value == expect) {
        console.log(key + ' succeeded')
    } else {
        console.log(key + ' failed. result: ' + input.value + " expect: " + expect)
    }
    if (input.selectionStart != expectStart || input.selectionEnd != expectEnd) {
        console.log('Selection failed. result: ' + input.selectionStart + ', ' +
            input.selectionEnd + " expect: " + expectStart + ', ' + expectEnd)
    }
}

function testOutputContextMenu(intent, expect) {
    let event = new Event('contextmenu')
    output.dispatchEvent(event)
    let inp = document.getElementById('contextmenuinput')
    inp.value = intent
    event = new Event('keydown')
    event.key = 'Enter'
    output.dispatchEvent(event)
    if (output.innerHTML != expect)
        console.log(output.innerHTML)
    else
        console.log('Context menu succeeded')
}

function testHotKeys() {
    // Test output Ctrl+c (copy)
    input.textContent = 'Ⓐ()𝑎/𝑏+Ⓕ(2) 𝑐/𝑑=0'
    prevInputValue = ''
    draw(false)
    setTimeout(function () { }, 50)         // Sleep for 50 msec
    let event = new Event('keydown')
    event.key = 's'
    event.ctrlKey = true
    input.dispatchEvent(event)
    setTimeout(function () { }, 50)
    event.key = 'c'
    useMfenced = true
    output.dispatchEvent(event)
    useMfenced = false
    setTimeout(function () { }, 200)

    navigator.clipboard.readText()
        .then((clipText) => {
            if (clipText == clipExpect) {
                console.log('Output Ctrl+c succeeded')
                pasteMathML(clipText, output.firstElementChild, 0)
                if (output.firstElementChild.outerHTML != '<math display=\"block\"><mfrac selanchor=\"2\"><mi>𝑐</mi><mi>𝑑</mi></mfrac><mo>+</mo><mfrac><mi>𝑎</mi><mi>𝑏</mi></mfrac><mfrac><mi>𝑎</mi><mi>𝒃</mi></mfrac><mo>+</mo><mfrac><mi>𝑐</mi><mi>𝑑</mi></mfrac><mo>=</mo><mn>0</mn></math>')
                    console.log(output.firstElementChild.outerHTML)
            } else {
                console.log('Output Ctrl+c failed: clipText = ' + clipText)
            }
        })

    // Test output Home/End hot keys
    testOutputHotKey('End', endExpect)
    testOutputHotKey('Home', homeExpect)
    // New implementation uses the default navigation a lot. This doesn't
    // run in a test environment, so the following is bypassed for the
    // time being
    //for (let i = 0; i < rightArrowExpect.length; i++)
    //    testOutputHotKey('ArrowRight', rightArrowExpect[i])

    // Test output Ctrl+z and Ctrl+y hot keys
    buildUp('𝑎²+𝑏²=𝑐²')
    testOutputHotKey('z', '𝑎²+𝑏²=𝑐Ⓐ(1)²')
    testOutputHotKey('y', '𝑎²+𝑏²=𝑐²Ⓐ(1) ')
    testOutputHotKey('a', 'Ⓐ()Ⓕ(6) 𝑎²+𝑏²=𝑐² ')

    // Test output context menu
    testOutputContextMenu('Pythagorean theorem', '<math display=\"block\" selanchor=\"0\" selfocus=\"6\" intent=\"Pythagorean theorem\"><msup><mi>𝑎</mi><mn>2</mn></msup><mo>+</mo><msup><mi>𝑏</mi><mn>2</mn></msup><mo>=</mo><msup><mi>𝑐</mi><mn>2</mn></msup><mo> </mo></math>')
    let sel = window.getSelection()
    setSelection(sel, output.firstElementChild, SELECTNODE)
    testOutputContextMenu('arg=arg', '<math display=\"block\" selanchor=\"0\" selfocus=\"6\" intent=\"Pythagorean theorem\" arg=\"arg\"><msup><mi>𝑎</mi><mn>2</mn></msup><mo>+</mo><msup><mi>𝑏</mi><mn>2</mn></msup><mo>=</mo><msup><mi>𝑐</mi><mn>2</mn></msup><mo> </mo></math>')
    testOutputHotKey('a', 'Ⓐ()Ⓕ(6) 𝑎²+𝑏²=𝑐² ')
    testOutputHotKey('Delete', 'Ⓐ()Ⓕ(1)⬚')
    let t = unicodemathml('𝑎/𝑏 Ⓐ(-0)+Ⓕ(2) 𝑐/𝑑=0', true)
    output.innerHTML = t.mathml
    refreshDisplays('', true)
    testOutputHotKey('Delete', '𝑎/𝑏 Ⓐ()=0')
    testOutputHotKey('z', '𝑎/𝑏 Ⓐ(-0)+Ⓕ(2) 𝑐/𝑑=0')
    testOutputHotKey('q', '𝑎/𝑏 Ⓐ(1)𝑞=0')

    // Test input Ctrl+z and Ctrl+y hot keys
    input.focus()
    inputUndoStack = [{uMath: ''}]
    input.value = '𝑎/𝑏+𝑐/𝑑=0'
    input.selectionStart = 3                // Select 𝑏
    input.selectionEnd = 5
    draw()
    // Simulate Delete key
    input.value = input.value.substring(0, 3) + input.value.substring(5)
    input.selectionStart = 3
    input.selectionEnd = 3
    draw()
    //                    Alt   Ctrl    expect     sel
    testInputHotKey('z', false, true, '𝑎/𝑏+𝑐/𝑑=0', 3, 5)
    testInputHotKey('y', false, true, '𝑎/+𝑐/𝑑=0', 3, 3)
    testInputHotKey('z', false, true, '𝑎/𝑏+𝑐/𝑑=0', 3, 5)

    // Test input Ctrl+b hot key
    input.selectionStart = 3                // Select 𝑏
    input.selectionEnd = 5
    testInputHotKey('b', false, true, '𝑎/𝒃+𝑐/𝑑=0', 3, 5)

    // Test input Alt+x hot key
    input.value = '𝑎+222b'
    testInputHotKey('x', true, false, '𝑎+∫', 4, 4)

    // Test '1/2=' → '½='
    input.value = '1/2='
    input.selectionStart = input.selectionEnd = 4
    testInputHotKey('=', false, false, '½=', 2, 2)
}

const mathDictation = [
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

const unicodeMathDictation = [
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
    let iSuccess = 0;
    for (let i = 0; i < mathDictation.length; i++) {
        let result = dictationToUnicodeMath(mathDictation[i]);
        if (result != unicodeMathDictation[i]) {
            console.log("Expect: " + unicodeMathDictation[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    let iFail = mathDictation.length - iSuccess;
    console.log('Test dictation: ' + iSuccess + " passes; " + iFail + " failures\n");
}
