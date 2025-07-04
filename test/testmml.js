﻿'use strict';

const mathML = [
    "<math display=\"block\"><mrow><mfrac><mn>1</mn><mrow><mn>2</mn><mi>𝜋</mi></mrow></mfrac><mrow intent=\":nary(0,$h,$n)\"><msubsup><mo>∫</mo><mn>0</mn><mrow arg=\"h\"><mn>2</mn><mpadded width=\"0\"><mi>𝜋</mi></mpadded></mrow></msubsup><mfrac arg=\"n\"><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝜃</mi></mrow><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mi>𝜃</mi></mrow></mrow></mfrac></mrow><mo>=</mo><mfrac><mn>1</mn><msqrt><mrow><msup><mi>𝑎</mi><mn>2</mn></msup><mo>−</mo><msup><mi>𝑏</mi><mn>2</mn></msup></mrow></msqrt></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝛁</mi><mo>⨯</mo><mi>𝐄</mi><mo>=</mo><mo>−</mo><mfrac intent=\":partial-derivative(1,𝐁,𝑡)\"><mrow><mi>𝜕</mi><mi>𝐁</mi></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow><mi>𝑖</mi><mi>ℏ</mi></mrow><mfrac intent=\":partial-derivative(1,$f,𝑡)\"><mrow><mi>𝜕</mi><mrow arg=\"f\"><mi>𝜓</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mrow><mi>𝜕</mi><mi>𝑡</mi></mrow></mfrac><mo>=</mo><mrow><mrow intent=\":fenced\"><mo>[</mo><mrow><mo>−</mo><mfrac><msup><mi>ℏ</mi><mn>2</mn></msup><mrow><mn>2</mn><mi>𝑚</mi></mrow></mfrac><mfrac intent=\":partial-derivative(2,,𝑥)\"><msup><mi>𝜕</mi><mn>2</mn></msup><mrow><mi>𝜕</mi><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></mfrac><mo>+</mo><mrow><mi>𝑉</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow><mo>]</mo></mrow><mi>𝜓</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑥</mi><mo>,</mo><mi>𝑡</mi></mrow><mo>)</mo></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup><mo>=</mo><mrow intent=\":nary($l,𝑛,$n)\"><munderover><mo>∑</mo><mrow arg=\"l\"><mi>𝑘</mi><mo>=</mo><mn>0</mn></mrow><mi>𝑛</mi></munderover><mrow arg=\"n\"><mrow intent=\"binomial-coefficient(𝑛,𝑘)\"><mo>(</mo><mfrac linethickness=\"0\"><mi>𝑛</mi><mi>𝑘</mi></mfrac><mo>)</mo></mrow><msup><mi>𝑎</mi><mi>𝑘</mi></msup><msup><mi>𝑏</mi><mrow><mi>𝑛</mi><mo>−</mo><mi>𝑘</mi></mrow></msup></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑥</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mi>𝑏</mi><mo>±</mo><msqrt><mrow><msup><mi>𝑏</mi><mn>2</mn></msup><mo>−</mo><mrow><mn>4</mn><mrow><mi>𝑎</mi><mi>𝑐</mi></mrow></mrow></mrow></msqrt></mrow><mrow><mn>2</mn><mi>𝑎</mi></mrow></mfrac></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><msup><mi>sin</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>+</mo><mrow intent=\":function\"><msup><mi>cos</mi><mn>2</mn></msup><mo>⁡</mo><mi>𝜃</mi></mrow><mo>=</mo><mn>1</mn></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":nary($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><msup><mi>𝑒</mi><mrow><mo>−</mo><msup><mi>𝑥</mi><mn>2</mn></msup></mrow></msup><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑥</mi></mrow></mrow></mrow><mo>=</mo><msqrt><mi>𝜋</mi></msqrt></mrow></math>",
    "<math display=\"block\"><mrow><mi>𝑎</mi><mspace width=\"thinmathspace\" /><mi>𝑏</mi></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":function\"><munder><mi>lim</mi><mrow><mi>𝑛</mi><mo stretchy=\"true\">→</mo><mi>∞</mi></mrow></munder><mo>⁡</mo><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mi>𝑛</mi></mfrac></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup></mrow><mo>=</mo><mi>𝑒</mi></mrow></math>",
    "<math display=\"block\"><mrow><mover accent=\"true\"><mi>𝑓</mi><mo>&#x302;</mo></mover><mrow intent=\":fenced\"><mo>(</mo><mi>𝜉</mi><mo>)</mo></mrow><mo>=</mo><mrow intent=\":nary($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><mi>𝑓</mi><mrow intent=\":fenced\"><mo>(</mo><mi>𝑥</mi><mo>)</mo></mrow><msup><mi intent=\"ⅇ\">𝑒</mi><mrow><mo>−</mo><mrow><mn>2</mn><mrow><mi>𝜋</mi><mi intent=\"ⅈ\">𝑖</mi><mi>𝑥</mi><mi>𝜉</mi></mrow></mrow></mrow></msup><mrow><mi intent=\"ⅆ\">𝑑</mi><mi>𝑥</mi></mrow></mrow></mrow></mrow></math>",
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
    "<math display=\"block\"><mfrac><msubsup><mi>𝛼</mi><mn>2</mn><mn>3</mn></msubsup><mrow><msubsup><mi>𝛽</mi><mn>2</mn><mn>3</mn></msubsup><mo>+</mo><msubsup><mi>𝛾</mi><mn>2</mn><mn>3</mn></msubsup></mrow></mfrac></math>",
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
    "<math display=\"block\"><mrow><mrow><mi>𝑍</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝛾</mi><mo>+</mo><mrow><mi>𝑖</mi><mi>𝜔</mi></mrow><mo>−</mo><mrow><mi>𝑖</mi><mi>𝜈</mi></mrow></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mfrac><mi>𝑖</mi><msqrt><mi>𝜋</mi></msqrt></mfrac><mrow intent=\":nary($l,∞,$n)\"><msubsup><mo>∫</mo><mrow arg=\"l\"><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><mrow arg=\"n\"><mfrac><msup><mi>𝑒</mi><mrow><mo>−</mo><mrow><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝜔</mi><mo>−</mo><msup><mi>𝜔</mi><mo>′</mo></msup></mrow><mo>)</mo></mrow><mn>2</mn></msup><mo intent=\":text\">/</mo><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>Δ</mi><mi>𝜔</mi></mrow><mo>)</mo></mrow><mn>2</mn></msup></mrow></mrow></msup><mrow><mi>𝛾</mi><mo>+</mo><mrow><mi>𝑖</mi><mrow intent=\":fenced\"><mo>(</mo><mrow><msup><mi>𝜔</mi><mo>′</mo></msup><mo>−</mo><mi>𝜈</mi></mrow><mo>)</mo></mrow></mrow></mrow></mfrac><mrow><mi intent=\"ⅆ\">𝑑</mi><msup><mi>𝜔</mi><mo>′</mo></msup></mrow></mrow></mrow></mrow></math>",
    "<math display=\"block\"><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo></mo><mfrac><mrow><mi>𝑥</mi><mo>+</mo><mi>𝑎</mi></mrow><mn>2</mn></mfrac><mo></mo></mrow></mrow></math>",
    "<math display=\"block\"><mrow><mrow intent=\":fenced\"><mo>|</mo><mi>𝑥</mi><mo>|</mo></mrow><mo>=</mo><mrow intent=\":fenced\"><mo>{</mo><mtable intent=\":equations\" columnalign=\"right\"><mtr><mtd><maligngroup /><mspace width=\"0\" /><malignmark /><mrow><mrow><mi>𝑥</mi><mtext> if </mtext><mi>𝑥</mi></mrow><mo>≥</mo><mn>0</mn></mrow></mtd></mtr><mtr><mtd><maligngroup /><mo>−</mo><malignmark /><mrow><mrow><mi>𝑥</mi><mtext> if </mtext><mi>𝑥</mi></mrow><mo>&lt;</mo><mn>0</mn></mrow></mtd></mtr></mtable><mo></mo></mrow></mrow></math>",
    "<m:math xmlns:m=\"http://www.w3.org/1998/Math/MathML\" altimg=\"E7.png\" altimg-height=\"49px\" altimg-valign=\"-16px\" altimg-width=\"249px\" alttext=\"\\frac{\\mathrm{d}}{\\mathrm{d}z}\\operatorname{arcsin}z=(1-z^{2})^{-1/2},\" display=\"block\"><m:mrow><m:mrow><m:mrow><m:mfrac><m:mo href=\"DLMF:/1.4#E4\" title=\"derivative\">d</m:mo><m:mrow><m:mo href=\"DLMF:/1.4#E4\" rspace=\"0em\" title=\"derivative\">d</m:mo><m:mi href=\"DLMF:/4.1#p2.t1.r4\" title=\"complex variable\">z</m:mi></m:mrow></m:mfrac><m:mo lspace=\"0.167em\">⁡</m:mo><m:mrow><m:mi href=\"DLMF:/4.23#ii.p1\" title=\"arcsine function\">arcsin</m:mi><m:mo lspace=\"0.167em\">⁡</m:mo><m:mi href=\"DLMF:/4.1#p2.t1.r4\" title=\"complex variable\">z</m:mi></m:mrow></m:mrow><m:mo>=</m:mo><m:msup><m:mrow><m:mo stretchy=\"false\">(</m:mo><m:mrow><m:mn>1</m:mn><m:mo>−</m:mo><m:msup><m:mi href=\"DLMF:/4.1#p2.t1.r4\" title=\"complex variable\">z</m:mi><m:mn>2</m:mn></m:msup></m:mrow><m:mo stretchy=\"false\">)</m:mo></m:mrow><m:mrow><m:mo>−</m:mo><m:mrow><m:mn>1</m:mn><m:mo>/</m:mo><m:mn>2</m:mn></m:mrow></m:mrow></m:msup></m:mrow><m:mo>,</m:mo></m:mrow></m:math>",
    "<math display=\"block\"><mrow><msub><mi>𝜃</mi><mn>1</mn></msub><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑧</mi><mo>│</mo><mi>𝜏</mi></mrow><mo>)</mo></mrow><mo>=</mo><msub><mi>𝜃</mi><mn>1</mn></msub><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑧</mi><mo>,</mo><mi>𝑞</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>2</mn><mo>⁢</mo><mrow intent=\":nary($l,∞,$n)\"><munderover><mo>∑</mo><mrow arg=\"l\"><mi>𝑛</mi><mo>=</mo><mn>0</mn></mrow><mi>∞</mi></munderover><mrow arg=\"n\"><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mi>𝑛</mi></msup></mrow></mrow><mo>⁢</mo><msup><mi>𝑞</mi><msup><mrow intent=\":fenced\"><mo>(</mo><mrow><mi>𝑛</mi><mo>+</mo><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><mo>)</mo></mrow><mn>2</mn></msup></msup><mo>⁢</mo><mrow intent=\":function\"><mi>sin</mi><mo>⁡</mo><mrow intent=\":fenced\"><mo>(</mo><mrow><mrow intent=\":fenced\"><mo>(</mo><mrow><mn>2</mn><mo>⁢</mo><mi>𝑛</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⁢</mo><mi>𝑧</mi></mrow><mo>)</mo></mrow></mrow><mo>,</mo></mrow></math>",
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
    "<math display=\"block\"><mi>𝑥</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mi>𝑏</mi><mo>±</mo><msqrt><msup><mi>𝑏</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>𝑎</mi><mi>𝑐</mi></msqrt></mrow><mrow><mn>2</mn><mi>𝑎</mi></mrow></mfrac></math>",
    "<math display=\"block\"><menclose notation=\"box\"><mi>𝑎</mi><mo>+</mo><mi>𝑏</mi></menclose></math>",
    "<math display=\"block\"><mrow intent=\":nary(𝑐,,$naryand)\"><msub><mo>∲</mo><mi>𝑐</mi></msub><mrow arg=\"naryand\"><mi>𝑑</mi><mi>𝜙</mi></mrow></mrow><mo>≠</mo><mrow intent=\":nary(𝑐,,$naryand)\"><munder><mo>∑</mo><mi>𝑐</mi></munder><mrow arg=\"naryand\"><mi>𝑑</mi><mi>𝑥</mi></mrow></mrow><mo>=</mo><mn>0</mn></math>",
    "<math display=\"block\"><mo>∫</mo><msup><mi>𝑑</mi><mn>3</mn></msup><mi>𝑟</mi><mrow intent=\":fenced\"><mo>|</mo><mi>𝑟</mi><mo>⟩</mo></mrow><mrow intent=\":fenced\"><mo>⟨</mo><mrow><mi>𝑟</mi><mo>|</mo><mi>𝜓</mi></mrow><mo>⟩</mo></mrow><mo>,</mo><mrow intent=\":fenced\"><mo>⟨</mo><mrow><mi>𝜓</mi><mo>|</mo><mi>ℋ</mi><mo>|</mo><mi>𝜓</mi></mrow><mo>⟩</mo></mrow></math>",
    "<math display=\"block\"><mtable displaystyle=\"true\"><mtr id=\"-3-\"><mtd intent=\":equation-label\" style=\"margin-right:1em;position:absolute;right:0em;bottom:2em\"><mtext>(3)</mtext></mtd><mtd><mi>𝐸</mi><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr></mtable></math>",
    "<math display=\"block\"><mtable displaystyle=\"true\" intent=\":math-paragraph\"><mlabeledtr><mtd><mtext>(1)</mtext></mtd><mtd><mi>𝐸</mi><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mlabeledtr><mtr><mtd><mi>𝐸</mi><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr><mlabeledtr><mtd><mtext>(3)</mtext></mtd><mtd><mi>𝐸</mi><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mlabeledtr></mtable></math>",
    "<math display=\"block\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mtable displaystyle=\"true\" intent=\":math-paragraph\"><mtr id=\"-1-\"><mtd intent=\":equation-label\" style=\"margin-right:1em;position:absolute;right:0em\"><mtext>(1)</mtext></mtd><mtd style=\"padding-left:0;text-align:right;float:right;display:math\"><mi>𝐸</mi><mo>+</mo><mn>1</mn></mtd><mtd><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr><mtr><mtd intent=\":no-equation-label\" style=\"margin-right:1em;position:absolute;right:0em\"><mtext></mtext></mtd><mtd style=\"padding-left:0;text-align:right;float:right;display:math\"><mi>𝐸</mi></mtd><mtd><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr><mtr id=\"-3-\"><mtd intent=\":equation-label\" style=\"margin-right:1em;position:absolute;right:0em\"><mtext>(3)</mtext></mtd><mtd style=\"padding-left:0;text-align:right;float:right;display:math\"><mi>𝐸</mi></mtd><mtd><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr></mtable></math>",
    "<math display=\"block\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mtable displaystyle=\"true\" intent=\":math-paragraph\"><mtr><mtd intent=\":no-equation-label\" style=\"margin-right:1em;position:absolute;right:0em\"><mtext></mtext></mtd><mtd style=\"padding-left:0;text-align:right;float:right;display:math\"><mi>𝐸</mi><mo>+</mo><mn>1</mn></mtd><mtd><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr><mtr id=\"-1-\"><mtd intent=\":equation-label\" style=\"margin-right:1em;position:absolute;right:0em\"><mtext>(1)</mtext></mtd><mtd style=\"padding-left:0;text-align:right;float:right;display:math\"><mi>𝐸</mi></mtd><mtd><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr><mtr id=\"-3-\"><mtd intent=\":equation-label\" style=\"margin-right:1em;position:absolute;right:0em\"><mtext>(3)</mtext></mtd><mtd style=\"padding-left:0;text-align:right;float:right;display:math\"><mi>𝐸</mi></mtd><mtd><mo>=</mo><mi>𝑚</mi><msup><mi>𝑐</mi><mn>2</mn></msup></mtd></mtr></mtable></math>",
    "<math display=\"block\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>𝑎</mi><mrow><msup><mi>𝑏</mi><mi>𝑖</mi></msup><mo>+</mo><mn>1</mn></mrow></msub><mo>+</mo><mn>1</mn><mo>+</mo><msup><mi>𝑐</mi><mrow><msub><mi>𝑑</mi><mi>𝑖</mi></msub><mo>+</mo><mn>2</mn></mrow></msup><mo>+</mo><mn>1</mn></math>",
    "<math display=\"block\"><mi mathvariant=\"roundhand\">H</mi><mo>+</mo><mi mathvariant=\"chancery\">Q</mi><mo>≠</mo><mi mathvariant=\"script\">T</mi></math>",
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
    "𝛼₂³/(𝛽₂³+𝛾₂³)",
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
    "[𝑎+𝑏,𝑐+𝑑]",
    "𝐸=Ⓐ(-0)𝑚𝑐²",
    "𝐸=𝑚Ⓐ()Ⓕ(2) 𝑐²",
    "𝐸=Ⓐ(-0)𝑚Ⓕ(2) 𝑐²",
    "Ⓐ(-1)Ⓕ(-2)sin²⁡𝜃+cos²⁡𝜃=1",
    "Ⓐ(-1)Ⓕ(-2)123=",
    "Ⓐ(-1)Ⓕ(-2)sin⁡𝑥",
    "𝑓^((2)) (𝑥)=0",
    "((𝑎+𝑏))/𝑐",
    "𝑓_((𝑎−0))^((𝑏+𝑐))",
    "𝑑/𝑑𝑥 (𝑥²+𝑥+1)=2𝑥+1",
    "𝑎Ⓐ()^",
    "⒱(𝑎&𝑏@𝑐&𝑑)",
    "𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎",
    "▭(𝑎+𝑏)",
    "∲_𝑐 𝑑𝜙≠∑┬𝑐 𝑑𝑥=0",
    "∫𝑑³𝑟|𝑟⟩⟨𝑟│𝜓⟩,⟨𝜓│ℋ│𝜓⟩",
    "𝐸=𝑚𝑐²#(3)",
    "𝐸=𝑚𝑐²#(1)\n𝐸=𝑚𝑐²\n𝐸=𝑚𝑐²#(3)",
    "𝐸+1&=𝑚𝑐²#(1)\n𝐸&=𝑚𝑐²\n𝐸&=𝑚𝑐²#(3)",
    "𝐸+1&=𝑚𝑐²\n𝐸&=𝑚𝑐²#(1)\n𝐸&=𝑚𝑐²#(3)",
    "𝑎_(𝑏^𝑖+1)+1+𝑐^(𝑑_𝑖+2)+1",
    "ℋ︁+𝒬︀≠𝒯",
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
    "fraction alpha sub 2 cubed over beta sub 2 cubed + gamma sub 2 cubed , end fraction",
    "modified modified x sub 1 + dot dot dot + x sub k with over brace above with k times above",
    "modified modified x sub 1 + dot dot dot + x sub k with under brace below with k times below",
    "a phantom eigh + b , end phantom + 1",
    "1 + box phantom fraction fraction fraction fraction 1 over 2 , end fraction over 3 , end fraction over 4 , end fraction over 5 , end fraction , end phantom , end box",
    "eigh + width phantom b + c , end phantom + d",
    "eigh phantom open 4 and eigh + b close c",
    "eigh phantom open 7 and eigh + b close c",
    "line 1 with label 20 , cap E = m c squared",
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
    "x = fraction minus b plus or minus square root , b squared minus 4 eigh c , end square root over 2 eigh , end fraction",
    "box eigh + b , end box",
    "clockwise contour integral over c of d phi not equal sum over c of d x = 0",
    "integral d cubed r vertical bar r close angle bracket open angle bracket r vertical bar psi close angle bracket comma open angle bracket psi vertical bar script cap H vertical bar psi close angle bracket",
    "line 1 with label 3 , cap E = m c squared",
    "3 lines , line 1 with label 1 , cap E = m c squared , line 2 cap E = m c squared , line 3 with label 3 , cap E = m c squared",
    "3 lines , line 1 with label 1 , cap E + 1 , = m c squared , line 2 , cap E , = m c squared , line 3 with label 3 , cap E , = m c squared",
    "3 lines , line 1 , cap E + 1 , = m c squared , line 2 with label 1 , cap E , = m c squared , line 3 with label 3 , cap E , = m c squared",
    "eigh sub open b to the i , + 1 close + 1 + c to the d sub i + 2 power + 1",
    "roundhand cap H + chancery cap Q not equal script cap T",
]

const mathBrailles = [
    "⠹⠂⠌⠆⠨⠏⠼⠮⠰⠴⠘⠆⠨⠏⠐⠹⠈⠈⠨⠰⠙⠨⠹⠌⠁⠬⠃⠀⠎⠊⠝⠀⠨⠹⠼⠀⠨⠅⠀⠹⠂⠌⠜⠁⠘⠆⠐⠤⠃⠘⠆⠐⠻⠼",
    "⠸⠨⠫⠈⠡⠸⠰⠠⠑⠀⠨⠅⠀⠤⠹⠈⠙⠸⠰⠠⠃⠌⠈⠙⠞⠼",
    "⠊⠈⠓⠹⠈⠙⠨⠽⠀⠷⠭⠠⠀⠞⠾⠌⠈⠙⠞⠼⠀⠨⠅⠀⠈⠷⠤⠹⠈⠓⠘⠆⠐⠌⠆⠍⠼⠹⠈⠙⠘⠆⠐⠌⠈⠙⠭⠘⠆⠐⠼⠬⠠⠧⠷⠭⠠⠀⠞⠾⠈⠾⠨⠽⠷⠭⠠⠀⠞⠾",
    "⠷⠁⠬⠃⠾⠘⠝⠀⠨⠅⠀⠐⠨⠠⠎⠩⠅⠀⠨⠅⠀⠼⠴⠣⠝⠻⠷⠝⠩⠅⠾⠁⠘⠅⠐⠃⠘⠝⠤⠅",
    "⠭⠀⠨⠅⠀⠹⠤⠃⠬⠤⠜⠃⠘⠆⠐⠤⠲⠁⠉⠻⠌⠆⠁⠼",
    "⠎⠊⠝⠘⠆⠀⠨⠹⠬⠉⠕⠎⠘⠆⠀⠨⠹⠀⠨⠅⠀⠼⠂",
    "⠮⠰⠤⠠⠿⠘⠠⠿⠐⠑⠘⠤⠭⠘⠘⠆⠐⠈⠈⠨⠰⠙⠭⠀⠨⠅⠀⠜⠨⠏⠻",
    "⠁⠃",
    "⠐⠇⠊⠍⠩⠝⠀⠫⠒⠒⠕⠀⠠⠿⠻⠀⠷⠂⠬⠹⠂⠌⠝⠼⠾⠘⠝⠀⠨⠅⠀⠑",
    "⠐⠋⠣⠸⠣⠻⠷⠨⠭⠾⠀⠨⠅⠀⠮⠰⠤⠠⠿⠘⠠⠿⠐⠋⠷⠭⠾⠈⠈⠨⠰⠑⠘⠤⠆⠨⠏⠈⠈⠨⠰⠊⠭⠨⠭⠐⠈⠈⠨⠰⠙⠭",
    "⠣⠝⠜⠁⠬⠃⠻",
    "⠉⠕⠎⠀⠨⠹⠀⠨⠅⠀⠹⠂⠌⠆⠼⠑⠘⠈⠈⠨⠰⠊⠨⠹⠐⠬⠉⠸⠲⠉⠸⠲",
    "⠠⠷⠁⠀⠃⣍⠉⠀⠙⠠⠾",
    "⠳⠭⠳⠀⠨⠅⠀⠨⠷⠊⠋⠀⠭⠀⠨⠂⠱⠀⠼⠴⠠⠀⠭⣍⠊⠋⠀⠭⠀⠐⠅⠀⠼⠴⠠⠀⠤⠭",
    "⠼⠂⠴⠭⠬⠒⠽⠀⠨⠅⠀⠼⠆⣍⠒⠭⠬⠂⠒⠽⠀⠨⠅⠀⠼⠲",
    "⠳⠁⠬⠃⠳",
    "⠨⠁",
    "⠁⠬⠃",
    "⠰⠝⠐⠠⠉⠰⠅⠀⠨⠅⠀⠷⠝⠩⠅⠾⠀⠨⠅⠀⠹⠝⠸⠖⠌⠅⠸⠖⠷⠝⠤⠅⠾⠸⠖⠼",
    "⠷⠁⠬⠃⠠⠀⠉⠬⠙⠾",
    "⠫⠗⠸⠫⠁⠬⠃⠻",
    "⠳⠐⠁⠬⠃⠩⠱⠻⠳",
    "⠹⠨⠁⠆⠘⠒⠐⠌⠨⠃⠆⠘⠒⠐⠬⠨⠛⠆⠘⠒⠐⠼",
    "⠐⠐⠭⠂⠬⠀⠄⠄⠄⠬⠭⠰⠅⠐⠣⠨⠷⠻⠣⠅⠀⠞⠊⠍⠑⠎⠻",
    "⠐⠐⠭⠂⠬⠀⠄⠄⠄⠬⠭⠰⠅⠐⠩⠨⠾⠻⠩⠅⠀⠞⠊⠍⠑⠎⠻",
    "⠁⠁⠬⠃⠬⠂",
    "⠼⠂⠬⠫⠗⠸⠫⠹⠹⠹⠹⠂⠌⠆⠼⠌⠒⠼⠌⠲⠼⠌⠢⠼⠻",
    "⠁⠬⠃⠬⠉⠬⠙",
    "⠁⠁⠬⠃⠉",
    "⠁⠁⠬⠃⠉",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠆⠴⠾",
    "⠸⠠⠓",
    "⠁⠀⠐⠅⠱⠀⠃⠀⠐⠅⠱⠀⠉",
    "⠹⠙⠨⠽⠀⠷⠭⠠⠀⠞⠾⠌⠙⠞⠼⠀⠨⠅⠀⠼⠴",
    "⠁⠘⠆⠐⠬⠃⠘⠆⠀⠨⠅⠀⠉⠘⠆",
    "⠠⠵⠷⠨⠛⠬⠊⠨⠺⠤⠊⠨⠝⠾⠀⠨⠅⠀⠹⠊⠌⠜⠨⠏⠻⠼⠮⠰⠤⠠⠿⠘⠠⠿⠐⠹⠑⠘⠤⠷⠨⠺⠤⠨⠺⠄⠾⠘⠘⠆⠘⠸⠌⠷⠨⠠⠙⠨⠺⠾⠘⠘⠆⠐⠌⠨⠛⠬⠊⠷⠨⠺⠄⠤⠨⠝⠾⠼⠈⠈⠨⠰⠙⠨⠺⠄",
    "⠎⠊⠝⠀⠹⠭⠬⠁⠌⠆⠼",
    "⠳⠭⠳⠀⠨⠅⠀⠨⠷⠭⠀⠊⠋⠀⠭⠀⠨⠂⠱⠀⠼⠴⣍⠤⠭⠀⠊⠋⠀⠭⠀⠐⠅⠀⠼⠴",
    "⠹⠈⠈⠨⠰⠙⠌⠈⠈⠨⠰⠙⠵⠼⠀⠁⠗⠉⠎⠊⠝⠀⠵⠀⠨⠅⠀⠷⠂⠤⠵⠘⠆⠐⠾⠘⠤⠂⠸⠌⠆⠐⠠⠀",
    "⠨⠹⠂⠀⠷⠵⠳⠨⠞⠾⠀⠨⠅⠀⠨⠹⠂⠀⠷⠵⠠⠀⠟⠾⠀⠨⠅⠀⠼⠆⠐⠨⠠⠎⠩⠝⠀⠨⠅⠀⠼⠴⠣⠠⠿⠻⠷⠤⠂⠾⠘⠝⠐⠟⠘⠷⠝⠬⠹⠂⠌⠆⠼⠾⠘⠘⠆⠐⠎⠊⠝⠀⠷⠷⠆⠝⠬⠂⠾⠵⠾⠠⠀",
    "⠷⠵⠩⠅⠾⠀⠨⠅⠀⠹⠵⠷⠵⠤⠂⠾⠀⠄⠄⠄⠷⠵⠤⠅⠬⠂⠾⠌⠅⠸⠖⠼⠀⠨⠅⠀⠹⠷⠤⠂⠾⠘⠅⠐⠷⠤⠵⠾⠰⠅⠐⠌⠅⠸⠖⠼⠀⠨⠅⠀⠷⠤⠂⠾⠘⠅⠐⠷⠅⠤⠵⠤⠂⠩⠅⠾⠸⠲",
    "⠹⠈⠈⠨⠰⠙⠨⠛⠄⠌⠈⠈⠨⠰⠙⠵⠼",
    "⠹⠈⠈⠨⠰⠙⠘⠆⠐⠨⠛⠘⠈⠼⠐⠌⠈⠈⠨⠰⠙⠵⠘⠆⠐⠼⠀⠌⠨⠅⠀⠹⠈⠈⠨⠰⠙⠨⠛⠘⠈⠼⠐⠌⠈⠈⠨⠰⠙⠵⠼",
    "⠹⠈⠙⠋⠀⠷⠭⠠⠀⠭⠄⠾⠌⠈⠙⠭⠄⠼⠀⠨⠅⠀⠼⠴",
    "⠹⠈⠙⠘⠆⠐⠋⠀⠷⠭⠾⠌⠈⠙⠭⠘⠆⠐⠼",
    "⠷⠵⠩⠅⠾⠀⠨⠅⠀⠹⠵⠷⠵⠤⠂⠾⠀⠄⠄⠄⠷⠵⠤⠅⠬⠂⠾⠌⠅⠸⠖⠼⠀⠨⠅⠀⠹⠷⠤⠂⠾⠘⠅⠐⠷⠤⠵⠾⠰⠅⠐⠌⠅⠸⠖⠼⠀⠨⠅⠀⠷⠤⠂⠾⠘⠅⠐⠷⠅⠤⠵⠤⠂⠩⠅⠾⠸⠲",
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
    "⠭⠀⠨⠅⠀⠹⠤⠃⠬⠤⠜⠃⠘⠆⠐⠤⠲⠁⠉⠻⠌⠆⠁⠼",
    "⠫⠗⠸⠫⠁⠬⠃⠻",
    "⠮⠈⠫⠪⠢⠔⠻⠰⠉⠐⠙⠨⠋⠀⠌⠨⠅⠀⠐⠨⠠⠎⠩⠉⠻⠙⠭⠀⠨⠅⠀⠼⠴",
    "⠮⠙⠘⠒⠐⠗⠳⠗⠨⠨⠾⠨⠨⠷⠗⠳⠨⠽⠨⠨⠾⠠⠀⠨⠨⠷⠨⠽⠳⠈⠰⠰⠠⠓⠳⠨⠽⠨⠨⠾",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠒⠾",
    "⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠂⠾⣍⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠐⣍⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠒⠾",
    "⠠⠑⠬⠂⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠂⠾⣍⠀⠠⠑⠀⠀⠨⠅⠀⠍⠉⠘⠆⠐⣍⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠒⠾",
    "⠀⠠⠑⠬⠂⠀⠀⠨⠅⠀⠍⠉⠘⠆⠐⣍⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠂⠾⣍⠠⠑⠀⠨⠅⠀⠍⠉⠘⠆⠀⠷⠒⠾",
    "⠁⠰⠃⠰⠘⠊⠰⠬⠂⠐⠬⠂⠬⠉⠘⠙⠘⠰⠊⠘⠬⠆⠐⠬⠂",
    "⠈⠰⠰⠠⠓︁⠬⠈⠰⠰⠠⠟︀⠀⠌⠨⠅⠀⠈⠰⠰⠠⠞",
]

const unicodeMathB = [
    "1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)",
    "𝛁×𝐄=−𝜕𝐁/𝜕𝑡",
    "𝑖ℏ 𝜕𝜓(𝑥,𝑡)/𝜕𝑡=[−ℏ²/2𝑚 𝜕²/𝜕𝑥²+𝑉(𝑥,𝑡)]𝜓(𝑥,𝑡)",
    "(𝑎+𝑏)^𝑛=∑_(𝑘=0)^𝑛 𝑛⒞𝑘 𝑎^𝑘 𝑏^(𝑛−𝑘)",
    "𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎",
    "sin²⁡𝜃+cos²⁡𝜃=1",
    "∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋",
    "𝑎𝑏",
    "lim_(𝑛→∞) ⁡(1+1/𝑛)^𝑛=𝑒",
    "𝑓̂(𝜉)=∫_−∞^∞ 𝑓(𝑥)ⅇ^−2𝜋ⅈ𝑥𝜉 ⅆ𝑥",
    "√(𝑛&𝑎+𝑏)",
    'cos⁡𝜃=1/2 𝑒^ⅈ𝜃+𝑐.𝑐.',
    "(■(𝑎&𝑏@𝑐&𝑑))",
    "|𝑥|=Ⓒ(\"if \"𝑥≥0,𝑥@\"if \"𝑥<0,−𝑥)",
    "█(10𝑥+3𝑦=2@3𝑥+13𝑦=4)",
    "|𝑎+𝑏|",
    "𝛼",
    "𝑎+𝑏",
    "_𝑛 𝐶_𝑘=𝑛⒞𝑘=𝑛!/𝑘!(𝑛−𝑘)!",
    "(𝑎+𝑏,𝑐+𝑑)",
    "▭(𝑎+𝑏)",
    "▭(1&𝑎+𝑏)",
    "𝛼₂³/(𝛽₂³+𝛾₂³)",
    "⏞(𝑥₁+⋯+𝑥_𝑘)┴𝑘𝑡𝑖𝑚𝑒𝑠",
    "⏟(𝑥₁+⋯+𝑥_𝑘)┬𝑘𝑡𝑖𝑚𝑒𝑠",
    "𝑎𝑎+𝑏+1",
    "1+▭(1/2/3/4/5)",
    "𝑎+𝑏+𝑐+𝑑",
    "𝑎𝑎+𝑏𝑐",
    "𝑎𝑎+𝑏𝑐",
    "𝐸=𝑚𝑐²(20)",
    "ℌ",
    "𝑎≤𝑏≤𝑐",
    "𝑑𝜓(𝑥,𝑡)/𝑑𝑡=0",
    "𝑎²+𝑏²=𝑐²",
    "𝑍(𝛾+𝑖𝜔−𝑖𝜈)=𝑖/√𝜋 ∫_−∞^∞ 𝑒^(−(𝜔−𝜔′)²\\/(Δ𝜔)²)/(𝛾+𝑖(𝜔′−𝜈)) ⅆ𝜔′",
    "sin⁡〖(𝑥+𝑎)/2〗",
    "|𝑥|=Ⓒ(𝑥\" if \"𝑥≥0@−𝑥\" if \"𝑥<0)",
    "ⅆ/ⅆ𝑧 arcsin⁡𝑧=(1−𝑧²)^(−1\\/2) ,",
    "𝜃₁(𝑧│𝜏)=𝜃₁(𝑧,𝑞)=2⁢∑_(𝑛=0)^∞ (−1)^𝑛 𝑞^(𝑛+1/2)² sin⁡((2𝑛+1)𝑧),",
    "𝑧⒞𝑘=(𝑧(𝑧−1)⋯(𝑧−𝑘+1))/𝑘!=(−1)^𝑘 (−𝑧)_𝑘/𝑘!=(−1)^𝑘 (𝑘−𝑧−1)⒞𝑘 .",
    "ⅆ𝛾′/ⅆ𝑧",
    "ⅆ²𝛾^∗/ⅆ𝑧² ≠ⅆ𝛾^∗/ⅆ𝑧",
    "𝜕𝑓(𝑥,𝑥′)/𝜕𝑥′=0",
    "𝜕²𝑓(𝑥)/𝜕𝑥²",
    "𝑧⒞𝑘=(𝑧(𝑧−1)⋯(𝑧−𝑘+1))/𝑘!=(−1)^𝑘 (−𝑧)_𝑘/𝑘!=(−1)^𝑘 (𝑘−𝑧−1)⒞𝑘 .",
    "⌊1/𝑛 ⌋=Ⓒ(1,𝑛=1,@0,𝑛>1.)",
    "𝑎+1/20+56/625=0",
    "𝑑^𝑛 𝑓(𝑥)/𝑑𝑥^𝑛=0",
    "𝑑^(𝑛−1) 𝑓(𝑥)/𝑑𝑥^(𝑛−1)=0",
    "[−∞,3]",
    "𝜕_𝑥𝑥′ 𝑓(𝑥,𝑥′)=𝜕²𝑓(𝑥,𝑥′)/𝜕𝑥𝜕𝑥′",
    "𝐴^𝑇=0",
    "𝑓′(𝑥)=𝑓′(𝑥′)",
    "𝑎²",
    "|𝑥||𝑥+2|=0",
    "(■(1&0@0&1))",
    "[𝑎+𝑏,𝑐+𝑑]",
]

const unicodeMathA = [
    "∫_(𝑎²+1)^(𝑏^𝑟+𝑞) 𝑑𝑥",
    "𝑎₂3",
    "𝑥^(𝑛_𝑎)",
    "𝑥_(𝑛^𝑎)",
    "𝑛_𝑥_𝑦",
    "𝑥^(𝑦_(𝑎^𝑛))",
    "𝑥_(𝑎^(𝑛_𝑏))",
    "𝑥̈+2𝛾𝑥̇+𝜔²𝑥=0",
    "∛(𝑎+𝑏)",
    "𝑥⃜=0",
]

const brailleA = [
    "⠮⠰⠁⠰⠘⠆⠰⠬⠂⠘⠃⠘⠘⠗⠘⠬⠟⠐⠙⠭",
    "⠁⠆⠐⠒",
    "⠭⠘⠝⠘⠰⠁",
    "⠭⠰⠝⠰⠘⠁",
    "⠝⠰⠭⠰⠰⠽",
    "⠭⠘⠽⠘⠰⠁⠘⠰⠘⠝",
    "⠭⠰⠁⠰⠘⠝⠰⠘⠰⠃",
    "⠐⠭⠣⠡⠡⠻⠬⠆⠨⠛⠐⠭⠣⠡⠻⠬⠨⠺⠘⠆⠐⠭⠀⠨⠅⠀⠼⠴",
    "⠣⠒⠜⠁⠬⠃⠻",
    "⠐⠭⠣⠡⠡⠡⠡⠻⠀⠨⠅⠀⠼⠴",
]

const unicodeMathC = [
    "∫_(a^2 +1)^(b^r +q) dx",
    "a₂3",
    "x^(n_a) ",
    "x_(n^a) ",
    "n_(x_y) ",
    "x^(y_(a^n)) ",
    "x_(a^(n_b)) ",
    "ẍ+2γ⁢ẋ+ω^2 x=0",
    "√(3&a+b) ",
    "x⃜=0",                                 // x\ddddot=0
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
    '\\frac{𝛼_2^3}{𝛽_2^3+𝛾_2^3}',
    '\\overbrace{𝑥_1+⋅⋅⋅+𝑥_𝑘}^{𝑘\\textrm{ times}}',
    '\\underbrace{𝑥_1+⋅⋅⋅+𝑥_𝑘}_{𝑘\\textrm{ times}}',
    '𝑎\\phantom{𝑎+𝑏}+1',
    '1+\\boxed{\\phantom{\\frac{\\frac{\\frac{\\frac{1}{2}}{3}}{4}}{5}}}',
    '𝑎+\\hphantom{𝑏+𝑐}+𝑑',
    '𝑎⟡(4&𝑎+𝑏)𝑐',                           // TeX doesn't have this & next
    '𝑎⟡(7&𝑎+𝑏)𝑐',
    '\\begin{equation}\\label{eq20}𝐸=𝑚𝑐^2\\end{equation}',
    'ℌ',
    '𝑎≤𝑏≤𝑐',
    '\\frac{𝑑𝜓(𝑥,𝑡)}{𝑑𝑡}=0',
    '𝑎^2+𝑏^2=𝑐^2',
    '𝑍(𝛾+𝑖𝜔−𝑖𝜈)=\\frac{𝑖}{\\sqrt{𝜋}}∫_{−∞}^∞\\frac{𝑒^{−(𝜔−𝜔′)^2\\/(Δ𝜔)^2}}{𝛾+𝑖(𝜔′−𝜈)}𝑑𝜔′',
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
    '𝑥=\\frac{−𝑏±\\sqrt{𝑏^2−4𝑎𝑐}}{2𝑎}',
    '\\boxed{𝑎+𝑏}',
    '∲_𝑐𝑑𝜙≠∑_𝑐𝑑𝑥=0',
    '∫𝑑^3𝑟|𝑟⟩⟨𝑟|𝜓⟩,⟨𝜓|ℋ|𝜓⟩',
    '\\begin{equation}\\label{eq3}𝐸=𝑚𝑐^2\\end{equation}',
    '\\begin{equation}\\label{eq1}𝐸=𝑚𝑐^2\\end{equation}\\\\𝐸=𝑚𝑐²\\\\\\begin{equation}\\label{eq3}𝐸=𝑚𝑐^2\\end{equation}',
    '\\begin{equation}\\label{eq1}𝐸+1&=𝑚𝑐^2\\end{equation}\\\\𝐸&=𝑚𝑐²\\\\\\begin{equation}\\label{eq3}𝐸&=𝑚𝑐^2\\end{equation}',
    '𝐸+1&=𝑚𝑐²\\\\\\begin{equation}\\label{eq1}𝐸&=𝑚𝑐^2\\end{equation}\\\\\\begin{equation}\\label{eq3}𝐸&=𝑚𝑐^2\\end{equation}',
    '𝑎_{𝑏^𝑖+1}+1+𝑐^{𝑑_𝑖+2}+1',
]

function testMathMLtoUnicodeMath() {
    let iSuccess = 0;
    let iFail = 0;
   for (let i = 0; i < mathML.length; i++) {
        let result = MathMLtoUnicodeMath(mathML[i], true);
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
    let iSuccess = 0;
    ummlConfig.speakSelectionEnds = true
    for (let i = 0; i < mathML.length; i++) {
        let result = MathMLtoSpeech(mathML[i]);
        if (result != mathSpeech[i]) {
            console.log(unicodeMath[i] + '\n');
            console.log("Expect: " + mathSpeech[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    let iFail = mathML.length - iSuccess;
    console.log("Test MathML to speech: " + iSuccess + " passes; " + iFail + " failures\n");
}

function testMathMLtoBraille() {
    let iSuccess = 0;
    for (let i = 0; i < mathML.length; i++) {
        let result = MathMLtoBraille(mathML[i]);
        if (result != mathBrailles[i]) {
            console.log(unicodeMath[i] + '\n');
            console.log("Expect: " + mathBrailles[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    let iFail = mathML.length - iSuccess;
    console.log("Test MathML to braille: " + iSuccess + " passes; " +
        iFail + " failures\n")

    // Test braille to MathML
    iSuccess = iFail = 0
    for (let i = 0; i < unicodeMathB.length; i++) {
        input.value = mathBrailles[i]
        draw()
        let uMath = getUnicodeMath(output.firstElementChild)
        if (uMath != unicodeMathB[i]) {
            console.log("Expect: " + unicodeMathB[i] + '\n');
            console.log("Result: " + uMath + '\n\n')
            iFail++
        } else {
            iSuccess++
        }
    }
    console.log("Test braille to MathML: " + iSuccess + " passes; " +
        iFail + " failures\n")

    // Additional braille-to-MathML tests
    iSuccess = iFail = 0
    for (let i = 0; i < unicodeMathA.length; i++) {
        let t = unicodemathml(unicodeMathA[i], true) 	// uMath → MathML
        let braille = MathMLtoBraille(t.mathml)		    // Test braille
        if (braille != brailleA[i]) {
            console.log("Expect: " + brailleA[i] + '\n');
            console.log("Result: " + braille + ' i = ' + i + '\n\n')
            iFail++
        }
        let uMath = braille2UnicodeMath(braille)		// Test uMathOut

        if (uMath != unicodeMathC[i]) {
            console.log("Expect: " + unicodeMathC[i] + '\n');
            console.log("Result: " + uMath + '\n\n')
            iFail++
        } else {
            iSuccess++
        }
    }
    console.log("More braille-to-MathML tests: " + iSuccess + " passes; " +
        iFail + " failures\n")
}

function testMathMLtoTeX() {
    let iSuccess = 0;
    for (let i = 0; i < mathTeXs.length; i++) {
        let result = MathMLtoTeX(mathML[i]);
        if (result != mathTeXs[i]) {
            console.log(unicodeMath[i] + '\n');
            console.log("Expect: " + mathTeXs[i] + '\n');
            console.log("Result: " + result + '\n\n');
        } else {
            iSuccess++;
        }
    }
    let iFail = mathTeXs.length - iSuccess;
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
}

function dispatchText(text) {
    for (let i = 0; i < text.length; i++) {
        const event = new Event('keydown')
        event.key = ' '
        if (i < text.length)
            event.key = getCh(text, i)
        output.dispatchEvent(event)
        if (event.key.length == 2)
            i++                             // Bypass trail surrogate
    }
}

function buildUp(uMath, uMathPartial, noFinalSpace) {
    // Build up UnicodeMath string one character at a time. If uMathPartial
    // is defined, check results against uMathPartial
    output.innerHTML = `<math display='block'><mi selanchor="0" selfocus="1">⬚</mi></math>`
    outputUndoStack = ['']
    let sel = window.getSelection()
    setSelection(sel, output, 0)
    let iSuccess = 0

    for (let i = 0, j = 0; i < uMath.length + 1; i++, j++) {
        const event = new Event('keydown')
        event.key = ' '
        if (i < uMath.length) {
            event.key = getCh(uMath, i)
            if (event.key == '\n') {
                event.key = 'Enter'
                event.shiftKey = true
            }
        } else if (noFinalSpace) {
            return iSuccess
        }
        output.dispatchEvent(event)
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
    let node = output.firstElementChild.lastElementChild
    if (node.textContent == '\u202F' && uMath[uMath.length - 1] == '1')
        node.remove()                       // Remove unused build-up ' '
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
        if (unicodeMath[k].indexOf('Ⓐ') != -1 || unicodeMath[k][0] == 'ⓘ') {
            iSuccess++
            continue                        // Users don't enter sel info
        }
        buildUp(unicodeMath[k])
        let result = getUnicodeMath(output.firstElementChild, false).trimEnd()
        result = result.replace(/\u202F/g, ' ')
        result = result.replace(/\u00A0/g, ' ')
        if (result != unicodeMath[k]) {
            console.log('Test ' + k + '\nExpect: ' + unicodeMath[k] + '\n');
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

// Right arrow tests including insertion of 'q' at the insertion point
const endExpect = "𝑎/𝑏+𝑐/𝑑=Ⓐ(1)0"
const homeExpect = "Ⓐ() 𝑎/𝑏+𝑐/𝑑=0"
const rightArrowExpect = ['Ⓐ()𝑎/𝑏+𝑐/𝑑=0', 'Ⓐ(1)𝑎/𝑏+𝑐/𝑑=0', '𝑎/Ⓐ()𝑏+𝑐/𝑑=0',
    '𝑎/Ⓐ(1)𝑏+𝑐/𝑑=0', '𝑎/𝑏 Ⓐ()+𝑐/𝑑=0', '𝑎/𝑏 Ⓐ(1)+𝑐/𝑑=0', '𝑎/𝑏+Ⓐ()𝑐/𝑑=0',
    '𝑎/𝑏+Ⓐ(1)𝑐/𝑑=0', '𝑎/𝑏+𝑐/Ⓐ()𝑑=0', '𝑎/𝑏+𝑐/Ⓐ(1)𝑑=0', '𝑎/𝑏+𝑐/𝑑 Ⓐ()=0',
    '𝑎/𝑏+𝑐/𝑑=Ⓐ()0', '𝑎/𝑏+𝑐/𝑑=Ⓐ(1)0',]
const speechExpect = ['eigh', 'end of numerator', 'b', 'end of denominator',
    '+', 'fraction', 'c', 'end of numerator', 'd', 'end of denominator',
    '=', '0', 'end of math',]
const rightArrowQExpect = ['Ⓐ(1)𝑞𝑎/𝑏+𝑐/𝑑=0', '𝑎Ⓐ(1)𝑞/𝑏+𝑐/𝑑=0', '𝑎/Ⓐ(1)𝑞𝑏+𝑐/𝑑=0',
    '𝑎/𝑏Ⓐ(1)𝑞+𝑐/𝑑=0', '𝑎/𝑏 𝑞Ⓐ()+𝑐/𝑑=0', '𝑎/𝑏+𝑞Ⓐ() 𝑐/𝑑=0', '𝑎/𝑏+Ⓐ(1)𝑞𝑐/𝑑=0',
    '𝑎/𝑏+𝑐Ⓐ(1)𝑞/𝑑=0', '𝑎/𝑏+𝑐/Ⓐ(1)𝑞𝑑=0', '𝑎/𝑏+𝑐/𝑑Ⓐ(1)𝑞=0', '𝑎/𝑏+𝑐/𝑑 𝑞Ⓐ()=0',
    '𝑎/𝑏+𝑐/𝑑=𝑞Ⓐ()0', '𝑎/𝑏+𝑐/𝑑=0Ⓐ(1)𝑞',]

const rats = [    // Right Arrow Tests
    {                                       // case 0
        uMath: '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',
        homeExpect: 'Ⓐ() 1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',
        rightArrowExpect: [
            'Ⓐ()1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',      // 1
            'Ⓐ(1)1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 2
            '1/Ⓐ()2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 3
            '1/2Ⓐ()𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 4
            '1/2Ⓐ(1)𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 5
            '1/2𝜋 Ⓐ() ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 6
            '1/2𝜋 Ⓐ()∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 7
            '1/2𝜋 Ⓐ(1)∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 8
            '1/2𝜋 ∫_Ⓐ()0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 9
            '1/2𝜋 ∫_Ⓐ(1)0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 10
            '1/2𝜋 ∫_0^Ⓐ()2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 11
            '1/2𝜋 ∫_0^2Ⓐ()𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 12
            '1/2𝜋 ∫_0^2Ⓐ(1)𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 13
            '1/2𝜋 ∫_0^2𝜋 Ⓐ() ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 14
            '1/2𝜋 ∫_0^2𝜋 Ⓐ()ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 15
            '1/2𝜋 ∫_0^2𝜋 ⅆⒶ()𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 16
            '1/2𝜋 ∫_0^2𝜋 ⅆⒶ(1)𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 17
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(Ⓐ()𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 18
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎Ⓐ()+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 19
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+Ⓐ()𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 20
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 Ⓐ() sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 21
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 Ⓐ()sin⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 22
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 Ⓐ(-1)sin⁡𝜃)=1/√(𝑎²−𝑏²)',	// 23
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 Ⓐ(-2)sin⁡𝜃)=1/√(𝑎²−𝑏²)',	// 24
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sinⒶ()⁡𝜃)=1/√(𝑎²−𝑏²)',	    // 25
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡Ⓐ()𝜃)=1/√(𝑎²−𝑏²)',	    // 26
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡Ⓐ(1)𝜃)=1/√(𝑎²−𝑏²)',	    // 27
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(Ⓐ(4) 𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	// 28
            '1/2𝜋 ∫_0^2𝜋 Ⓐ(2) ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏²)',	// 29
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃) Ⓐ()=1/√(𝑎²−𝑏²)',	    // 30
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃) Ⓐ(1)=1/√(𝑎²−𝑏²)',	// 31
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=Ⓐ()1/√(𝑎²−𝑏²)',	    // 32
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=Ⓐ(1)1/√(𝑎²−𝑏²)',	    // 33
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/Ⓐ()√(𝑎²−𝑏²)',	    // 34
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(Ⓐ() 𝑎²−𝑏²)',	    // 35
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(Ⓐ()𝑎²−𝑏²)',	    // 36
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(Ⓐ(1)𝑎²−𝑏²)',    // 37
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎^Ⓐ()2−𝑏²)',    // 38
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎^Ⓐ(1)2−𝑏²)',   // 39
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²Ⓐ()−𝑏²)',     // 40
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²Ⓐ(1)−𝑏²)',    // 41
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−Ⓐ()𝑏²)',     // 42
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−Ⓐ(1)𝑏²)',    // 43
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏^Ⓐ()2)',    // 44
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−𝑏^Ⓐ(1)2)',   // 45
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/√(𝑎²−Ⓐ(2) 𝑏²)',   // 46
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=1/Ⓐ(3)√(𝑎²−𝑏²)',    // 46
            '1/2𝜋 ∫_0^2𝜋 ⅆ𝜃/(𝑎+𝑏 sin⁡𝜃)=Ⓐ(2) 1/√(𝑎²−𝑏²)',], // 47
        speechExpect: ['1', 'end of numerator', '2', 'pi',
            'end of denominator', 'integral with limits', 'integral',
            'end of base', '0', 'end of lower limit', '2', 'pi',
            'end of upper limit', 'int- agrand fraction', 'differential d',
            'theta', 'end of numerator', 'eigh', '+', 'b', 'sine', 's',
            'i', 'n', 'function apply', 'theta', 'end of function',
            'end of denominator', 'end of int- agrand', '=', 'fraction', '1',
            'end of numerator', 'square root', 'eigh squared', 'eigh',
            'end of base', '2', 'end of superscript', 'minus', 'b squared',
            'b', 'end of base', '2', 'end of superscript', 'end of square root',
            'end of denominator', 'end of math']
    },
    {                                       // case 1
        uMath: '𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎',
        homeExpect: 'Ⓐ()𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎',
        rightArrowExpect: [
            '𝑥Ⓐ()=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎', '𝑥Ⓐ(1)=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎', '𝑥=(Ⓐ()−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎',
            '𝑥=(−Ⓐ()𝑏±√(𝑏²−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏Ⓐ()±√(𝑏²−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏Ⓐ(1)±√(𝑏²−4𝑎𝑐))/2𝑎',
            '𝑥=(−𝑏±√(Ⓐ() 𝑏²−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(Ⓐ()𝑏²−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(Ⓐ(1)𝑏²−4𝑎𝑐))/2𝑎',
            '𝑥=(−𝑏±√(𝑏^Ⓐ()2−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(𝑏^Ⓐ(1)2−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(𝑏²Ⓐ()−4𝑎𝑐))/2𝑎',
            '𝑥=(−𝑏±√(𝑏²−Ⓐ()4𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(𝑏²−4Ⓐ()𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(𝑏²−4𝑎Ⓐ()𝑐))/2𝑎',
            '𝑥=(−𝑏±√(𝑏²−4𝑎Ⓐ(1)𝑐))/2𝑎', '𝑥=(−𝑏±Ⓐ(5)√(𝑏²−4𝑎𝑐))/2𝑎', '𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/Ⓐ()2𝑎',
            '𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2Ⓐ()𝑎', '𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2Ⓐ(1)𝑎', '𝑥=Ⓐ(2) (−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎',],
        speechExpect: ['=', 'fraction', 'minus', 'b', 'plus or minus', 'square root',
            'b squared', 'b', 'end of base', '2', 'end of superscript', 'minus', '4',
            'eigh', 'c', 'end of square root', 'end of numerator', '2', 'eigh',
            'end of denominator', 'end of math',]
    },
    {                                       // case 2
        uMath: '𝑍(𝜔)≠𝑍(𝜔+1)',
        homeExpect: 'Ⓐ()𝑍(𝜔)≠𝑍(𝜔+1)',
        rightArrowExpect: ['𝑍Ⓐ() (𝜔)≠𝑍(𝜔+1)', '𝑍Ⓐ()(𝜔)≠𝑍(𝜔+1)', '𝑍(Ⓐ()𝜔)≠𝑍(𝜔+1)',
            '𝑍(𝜔Ⓐ())≠𝑍(𝜔+1)', '𝑍(𝜔)Ⓐ()≠𝑍(𝜔+1)', '𝑍(𝜔)≠Ⓐ()𝑍(𝜔+1)', '𝑍(𝜔)≠𝑍Ⓐ() (𝜔+1)',
            '𝑍(𝜔)≠𝑍Ⓐ()(𝜔+1)', '𝑍(𝜔)≠𝑍(Ⓐ()𝜔+1)', '𝑍(𝜔)≠𝑍(𝜔Ⓐ()+1)', '𝑍(𝜔)≠𝑍(𝜔+Ⓐ()1)',
            '𝑍(𝜔)≠𝑍(𝜔+1Ⓐ())', '𝑍(𝜔)≠𝑍Ⓐ(3) (𝜔+1)',],
        speechExpect: ['fenced', 'open', 'omega', 'close', 'not equal', 'cap Z',
            'fenced', 'open', 'omega', '+', '1', 'close', 'end of math',]
    },
    {                                       // case 3
        uMath: 'sin^2 𝜃+cos^2 𝜃=1',
        homeExpect: 'Ⓐ() sin²⁡𝜃+cos²⁡𝜃=1',
        rightArrowExpect: ['Ⓐ()sin²⁡𝜃+cos²⁡𝜃=1', 'Ⓐ(-1)sin²⁡𝜃+cos²⁡𝜃=1',
            'Ⓐ(-2)sin²⁡𝜃+cos²⁡𝜃=1', 'Ⓐ(1)sin²⁡𝜃+cos²⁡𝜃=1', 'sin^Ⓐ()2 ⁡𝜃+cos²⁡𝜃=1',
            'sin^Ⓐ(1)2 ⁡𝜃+cos²⁡𝜃=1', 'sin²Ⓐ()⁡𝜃+cos²⁡𝜃=1', 'sin²⁡Ⓐ()𝜃+cos²⁡𝜃=1',
            'sin²⁡Ⓐ(1)𝜃+cos²⁡𝜃=1', 'sin²⁡𝜃Ⓐ()+cos²⁡𝜃=1', 'sin²⁡𝜃+Ⓐ() cos²⁡𝜃=1',
            'sin²⁡𝜃+Ⓐ()cos²⁡𝜃=1', 'sin²⁡𝜃+Ⓐ(-1)cos²⁡𝜃=1', 'sin²⁡𝜃+Ⓐ(-2)cos²⁡𝜃=1',
            'sin²⁡𝜃+Ⓐ(1)cos²⁡𝜃=1', 'sin²⁡𝜃+cos^Ⓐ()2 ⁡𝜃=1', 'sin²⁡𝜃+cos^Ⓐ(1)2 ⁡𝜃=1',
            'sin²⁡𝜃+cos²Ⓐ()⁡𝜃=1', 'sin²⁡𝜃+cos²⁡Ⓐ()𝜃=1', 'sin²⁡𝜃+cos²⁡Ⓐ(1)𝜃=1',
            'sin²⁡𝜃+cos²⁡𝜃Ⓐ()=1', 'sin²⁡𝜃+cos²⁡𝜃=Ⓐ()1', 'sin²⁡𝜃+cos²⁡𝜃=Ⓐ(1)1',],
        speechExpect: ['s', 'i', 'n', 'end of base', '2', 'end of superscript',
            'function apply', 'theta', 'end of function', '+', 'cosine squared',
            'c', 'o', 's', 'end of base', '2', 'end of superscript', 'function apply',
            'theta', 'end of function', '=', '1', 'end of math',]
    },
    {                                       // case 4
        uMath: '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋',
        homeExpect: 'Ⓐ() ∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋',
        rightArrowExpect: ['Ⓐ()∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋', 'Ⓐ(1)∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋',
            '∫_(Ⓐ()−∞)^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋', '∫_−Ⓐ()∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋', '∫_−Ⓐ(1)∞^∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋',
            '∫_−∞^Ⓐ()∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋', '∫_−∞^Ⓐ(1)∞ 𝑒^−𝑥² ⅆ𝑥=√𝜋', '∫_−∞^∞ Ⓐ() 𝑒^−𝑥² ⅆ𝑥=√𝜋',
            '∫_−∞^∞ Ⓐ()𝑒^−𝑥² ⅆ𝑥=√𝜋', '∫_−∞^∞ Ⓐ(1)𝑒^−𝑥² ⅆ𝑥=√𝜋', '∫_−∞^∞ 𝑒^(Ⓐ()−𝑥²) ⅆ𝑥=√𝜋',
            '∫_−∞^∞ 𝑒^(Ⓐ(1)−𝑥²) ⅆ𝑥=√𝜋', '∫_−∞^∞ 𝑒^−Ⓐ()𝑥² ⅆ𝑥=√𝜋', '∫_−∞^∞ 𝑒^−Ⓐ(1)𝑥² ⅆ𝑥=√𝜋',
            '∫_−∞^∞ 𝑒^(−𝑥^Ⓐ()2) ⅆ𝑥=√𝜋', '∫_−∞^∞ 𝑒^(−𝑥^Ⓐ(1)2) ⅆ𝑥=√𝜋', '∫_−∞^∞ 𝑒^(−Ⓐ(2) 𝑥²) ⅆ𝑥=√𝜋',
            '∫_−∞^∞ 𝑒^−𝑥² Ⓐ()ⅆ𝑥=√𝜋', '∫_−∞^∞ 𝑒^−𝑥² ⅆⒶ()𝑥=√𝜋', '∫_−∞^∞ Ⓐ(3) 𝑒^−𝑥² ⅆ𝑥=√𝜋',
            '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥Ⓐ()=√𝜋', '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥Ⓐ(1)=√𝜋', '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√Ⓐ()𝜋',
            '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=√Ⓐ(1)𝜋', '∫_−∞^∞ 𝑒^−𝑥² ⅆ𝑥=Ⓐ(1)√𝜋',],
        speechExpect: ['integral', 'end of base', 'minus', 'infinity', 'end of lower limit',
            'infinity', 'end of upper limit', 'int- agrand superscript', 'e', 'end of base',
            'minus', 'x squared', 'x', 'end of base', '2', 'end of superscript',
            'end of superscript', 'differential d', 'x', 'end of int- agrand',
            '=', 'square root , pi', 'pi', 'end of square root', 'end of math',]
    },
    {                                       // case 5
        uMath: '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽-2𝑎′]',
        homeExpect: 'Ⓐ() 1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
        rightArrowExpect: ['Ⓐ()1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            'Ⓐ(1)1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/Ⓐ()8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/Ⓐ(1)8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8Ⓐ()𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8Ⓐ(1)𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/(8𝜋^Ⓐ()2) ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/(8𝜋^Ⓐ(1)2) ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/(8Ⓐ(2) 𝜋²) ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² Ⓐ() ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² Ⓐ()∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² Ⓐ(1)∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_Ⓐ() 𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_Ⓐ()𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_Ⓐ(1)𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼_Ⓐ()1 ^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼_Ⓐ(1)1 ^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_Ⓐ(2) 𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^Ⓐ() 𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^Ⓐ()𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^Ⓐ(1)𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼_Ⓐ()2 ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼_Ⓐ(1)2 ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^Ⓐ(2) 𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ Ⓐ() ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ Ⓐ()ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ Ⓐ(1)ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆⒶ()𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆⒶ(1)𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼_Ⓐ()2^′ [𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼_Ⓐ(1)2^′ [𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼_2^Ⓐ()′ [𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼_2^Ⓐ(1)′ [𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂Ⓐ() [𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂Ⓐ()[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[Ⓐ() 𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[Ⓐ()𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[Ⓐ(1)𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(Ⓐ() 𝛿₁𝜌₁)^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_Ⓐ()𝛿₁𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_Ⓐ(1)𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(𝛿_Ⓐ()1 𝜌₁)^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(𝛿_Ⓐ(1)1 𝜌₁)^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(𝛿₁Ⓐ() 𝜌₁)^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁Ⓐ()𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁Ⓐ(1)𝜌₁^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(𝛿₁𝜌_Ⓐ()1)^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(𝛿₁𝜌_Ⓐ(1)1)^2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_(𝛿₁Ⓐ(2) 𝜌₁)^2𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^Ⓐ()2𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2Ⓐ()𝛽−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2Ⓐ(1)𝛽−2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽 Ⓐ()−2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−Ⓐ()2𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−Ⓐ(1)2𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2Ⓐ()𝑎′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2Ⓐ(1)𝑎′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎Ⓐ()′]', '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎Ⓐ(1)′]',
            '1/8𝜋² ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′Ⓐ()]', '1/8𝜋² ∫_𝛼₁^𝛼₂ Ⓐ(3) ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',
            '1/8𝜋² Ⓐ(2) ∫_𝛼₁^𝛼₂ ⅆ𝛼′₂[𝑈_𝛿₁𝜌₁^2𝛽−2𝑎′]',],
        speechExpect: ['1', 'end of numerator', '8', 'pi squared', 'pi',
            'end of base', '2', 'end of superscript', 'end of denominator',
            'integral with limits', 'integral', 'end of base', 'alpha sub 1',
            'alpha', 'end of base', '1', 'end of subscript', 'end of lower limit',
            'alpha sub 2', 'alpha', 'end of base', '2', 'end of subscript',
            'end of upper limit', '', 'differential d', 'sub soup', 'alpha',
            'end of base', '2', 'end of subscript', 'prime', 'end of superscript',
            'fenced', 'open bracket', 'sub soup', 'cap U', 'end of base', 'delta sub 1',
            'delta', 'end of base', '1', 'end of subscript', 'rho sub 1', 'rho',
            'end of base', '1', 'end of subscript', 'end of subscript', '2', 'beta',
            'end of superscript', 'minus', '2', 'eigh prime', 'eigh', 'end of base',
            'prime', 'end of superscript', 'close bracket',
            'end of int- agrand', 'end of math',]
    },
    {                                       // case 6
        uMath: '𝑛⒞𝑘 𝑎² 𝑥²/2!',
        homeExpect: 'Ⓐ() 𝑛⒞𝑘 𝑎² 𝑥²/2!',
        rightArrowExpect: ['Ⓐ()𝑛⒞𝑘 𝑎² 𝑥²/2!', 'Ⓐ(1)𝑛⒞𝑘 𝑎² 𝑥²/2!', 'Ⓐ()𝑛⒞𝑘 𝑎² 𝑥²/2!',
            'Ⓐ(1)𝑛⒞𝑘 𝑎² 𝑥²/2!', '𝑛⒞Ⓐ()𝑘 𝑎² 𝑥²/2!', '𝑛⒞Ⓐ(1)𝑘 𝑎² 𝑥²/2!', '𝑛⒞𝑘 Ⓐ()𝑎² 𝑥²/2!',
            '𝑛⒞𝑘 Ⓐ() 𝑎² 𝑥²/2!', '𝑛⒞𝑘 Ⓐ()𝑎² 𝑥²/2!', '𝑛⒞𝑘 Ⓐ(1)𝑎² 𝑥²/2!', '𝑛⒞𝑘 𝑎^Ⓐ()2 𝑥²/2!',
            '𝑛⒞𝑘 𝑎^Ⓐ(1)2 𝑥²/2!', '𝑛⒞𝑘 𝑎²Ⓐ() 𝑥²/2!', '𝑛⒞𝑘 𝑎² Ⓐ() 𝑥²/2!', '𝑛⒞𝑘 𝑎² Ⓐ()𝑥²/2!',
            '𝑛⒞𝑘 𝑎² Ⓐ(1)𝑥²/2!', '𝑛⒞𝑘 𝑎² 𝑥^Ⓐ()2/2!', '𝑛⒞𝑘 𝑎² 𝑥^Ⓐ(1)2/2!', '𝑛⒞𝑘 𝑎² Ⓐ(2) 𝑥²/2!',
            '𝑛⒞𝑘 𝑎² 𝑥²/Ⓐ()2!', '𝑛⒞𝑘 𝑎² 𝑥²/2Ⓐ()!', '𝑛⒞𝑘 𝑎² 𝑥²/2Ⓐ(1)!', '𝑛⒞𝑘 𝑎²Ⓐ(2) 𝑥²/2!',],
        speechExpect: ['open', 'fraction', 'n', 'end of numerator', 'k',
            'end of denominator', 'close', 'eigh squared', 'eigh', 'end of base', '2',
            'end of superscript', 'fraction', 'x squared', 'x', 'end of base', '2',
            'end of superscript', 'end of numerator', '2', 'factorial', 'end of denominator',
            'end of math',]
    },
    {                                       // case 7
        uMath: 'ⅅ_𝑥 𝑓(𝑥)=1',
        homeExpect: 'Ⓐ() ⅅ_𝑥 𝑓(𝑥)=1',
        rightArrowExpect: ['Ⓐ()ⅅ_𝑥 𝑓(𝑥)=1', 'Ⓐ(1)ⅅ_𝑥 𝑓(𝑥)=1', 'ⅅ_Ⓐ()𝑥 𝑓(𝑥)=1',
            'ⅅ_Ⓐ(1)𝑥 𝑓(𝑥)=1', 'ⅅ_𝑥 Ⓐ()𝑓(𝑥)=1', 'ⅅ_𝑥 𝑓Ⓐ() (𝑥)=1', 'ⅅ_𝑥 𝑓Ⓐ()(𝑥)=1',
            'ⅅ_𝑥 𝑓(Ⓐ()𝑥)=1', 'ⅅ_𝑥 𝑓(𝑥Ⓐ())=1', 'ⅅ_𝑥 𝑓(𝑥)Ⓐ()=1', 'ⅅ_𝑥 𝑓(𝑥)=Ⓐ()1',
            'ⅅ_𝑥 𝑓(𝑥)=Ⓐ(1)1',],
        speechExpect: ['cap differential d', 'end of base', 'x', 'end of subscript',
            'f', 'fenced', 'open', 'x', 'close', '=', '1', 'end of math']
    },
    {                                       // case 8
        uMath: '|𝜓⟩=∫▒𝑑^3 𝑟|𝐫⟩⟨𝐫│𝜓⟩',
        homeExpect: 'Ⓐ() |𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩',
        rightArrowExpect: ['Ⓐ()|𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|Ⓐ()𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓Ⓐ()⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩',
            '|𝜓⟩Ⓐ()=∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=Ⓐ()∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=Ⓐ(1)∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩',
            '|𝜓⟩=∫Ⓐ()𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=∫Ⓐ(1)𝑑³𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑^Ⓐ()3 𝑟|𝐫⟩⟨𝐫│𝜓⟩',
            '|𝜓⟩=∫𝑑^Ⓐ(1)3 𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑³Ⓐ()𝑟|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑³𝑟Ⓐ() |𝐫⟩⟨𝐫│𝜓⟩',
            '|𝜓⟩=∫𝑑³𝑟Ⓐ()|𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑³𝑟|Ⓐ()𝐫⟩⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑³𝑟|𝐫Ⓐ()⟩⟨𝐫│𝜓⟩',
            '|𝜓⟩=∫𝑑³𝑟|𝐫⟩Ⓐ() ⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑³𝑟|𝐫⟩Ⓐ()⟨𝐫│𝜓⟩', '|𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨Ⓐ()𝐫│𝜓⟩',
            '|𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫Ⓐ()│𝜓⟩', '|𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫│Ⓐ()𝜓⟩', '|𝜓⟩=∫𝑑³𝑟|𝐫⟩⟨𝐫│𝜓Ⓐ()⟩',
            '|𝜓⟩=∫𝑑³𝑟|𝐫⟩Ⓐ(3) ⟨𝐫│𝜓⟩',],
        speechExpect: ['vertical bar', 'psi', 'close angle bracket', '=',
            'integral', 'd cubed', 'd', 'end of base', '3', 'end of superscript',
            'r', 'fenced', 'vertical bar', 'bold r', 'close angle bracket',
            'fenced', 'open angle bracket', 'bold r', 'vertical bar', 'psi',
            'close angle bracket', 'end of math',
        ]
    }
]                   // End of right-arrow tests

const ieqbus = [    // Intra-equation build-up Tests
    {
        uMath: '(𝑎+Ⓐ(1)𝑏)/𝑐=0',
        text: '^2 ',
        uMathExpect: '(𝑎+Ⓐ(2) 𝑏²)/𝑐=0',
    },
    {
        uMath: '𝑎+Ⓐ(1)𝑏+𝑐=0',
        text: '^2 ',
        uMathExpect: '𝑎+𝑏²Ⓐ()+𝑐=0',
    },
    {
        uMath: '(𝑎+𝑏Ⓐ()+c)/𝑐=0',
        text: '^2 ',
        uMathExpect: '(𝑎+𝑏²Ⓐ()+𝑐)/𝑐=0',
    },
]

function testOutputHotKey(key, expect) {
    const event = new Event('keydown')
    event.key = key
    if (key.length == 1) {
        event.ctrlKey = true
        key = 'Ctrl+' + key
    }
    output.dispatchEvent(event)
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

function testRightArrow(uMath, homeExpect, rightArrowExpect, speechExpect) {
    buildUp(uMath)
    if (dataAttributes)
        labelFixedArgs()
    testOutputHotKey('Home', homeExpect)
    speechCurrent = ''
    for (let i = 0; i < rightArrowExpect.length; i++) {
        testOutputHotKey('ArrowRight', rightArrowExpect[i])
        if (speechCurrent != speechExpect[i])
            console.log(uMath + ' Speech failed. result: ' + speechCurrent + " expect: " + speechExpect[i])
        speechCurrent = ''
        speechSynthesis.cancel()
    }
}

function testIntraEqBuildUp(uMath, text, uMathExpect) {
    // Check in-numerator build up, e.g., build up not at end of math zone
    let t = unicodemathml(uMath, true)
    output.innerHTML = t.mathml
    setOutputSelection()
    dispatchText(text)
    uMath = getUnicodeMath(output.firstElementChild, true)
    if (uMath != uMathExpect)
        console.log('Intra-equation build up failed: UnicodeMath = ' + uMath)
    else
        console.log('Intra-equation build up succeeded')
    removeSelAttributes()
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
    input.value = 'Ⓐ()𝑎/𝑏+Ⓕ(2) 𝑐/𝑑=0'
    prevInputValue = ''
    draw(false)
    let event = new Event('keydown')
    event.key = 's'
    event.ctrlKey = true
    input.dispatchEvent(event)
    event.key = 'c'
    event.shiftKey = true
    output.dispatchEvent(event)

    navigator.clipboard.readText()
        .then((clipText) => {
            if (clipText == clipExpect) {
                console.log('Output Ctrl+c succeeded')
                pasteMathML(clipText, output.firstElementChild, 0)
                if (output.firstElementChild.outerHTML != '<math display=\"block\"><mfrac selanchor=\"2\"><mi>𝑐</mi><mi>𝑑</mi></mfrac><mo>+</mo><mfrac><mi>𝑎</mi><mi>𝑏</mi></mfrac><mfrac><mi>𝑎</mi><mi>𝒃</mi></mfrac><mo>+</mo><mfrac><mi>𝑐</mi><mi>𝑑</mi></mfrac><mo>=</mo><mn>0</mn></math>')
                    console.log("paste error: " + output.firstElementChild.outerHTML)
            } else {
                console.log('Output Ctrl+c failed: clipText = ' + clipText)
            }
        })

    // Test output Home/End hot keys
    testOutputHotKey('End', endExpect)
    speechCurrent = ''
    testOutputHotKey('Home', homeExpect)
    if (speechCurrent != 'start of math , fraction')
        console.log('Home speech incorrect: ' + speechCurrent)

    // Test right-arrow navigation with insertion of q
    let i
    speechCurrent = ''
    for (i = 0; i < rightArrowExpect.length; i++) {
        testOutputHotKey('ArrowRight', rightArrowExpect[i])
        if (speechCurrent != speechExpect[i])
            console.log('Speech failed. result: ' + speechCurrent + " expect: " + speechExpect[i])
        speechCurrent = ''
        let uMath = getUnicodeMath(output.firstElementChild, true)
        outputUndoStack.push(uMath)
        const event = new Event('keydown')
        event.key = 'q'
        output.dispatchEvent(event)
        uMath = outputUndoStack.pop()
        if (uMath != rightArrowQExpect[i])
            console.log('Output q failed. result: ' + uMath + " expect: " + rightArrowQExpect[i])
        ctrlZ()
        speechSynthesis.cancel()
    }

    // More right-arrow navigation tests
    for (i = 0; i < rats.length; i++) {
        testRightArrow(rats[i].uMath, rats[i].homeExpect,
            rats[i].rightArrowExpect, rats[i].speechExpect)
    }

    // Check intra-equation build up, e.g., build up not at end of math zone
    for (i = 0; i < ieqbus.length; i++)
        testIntraEqBuildUp(ieqbus[i].uMath, ieqbus[i].text, ieqbus[i].uMathExpect)

    // Test Alt+l toggle fixed-arg-element child argument indices
    buildUp('𝑥=(−𝑏±√(𝑏²−4𝑎𝑐))/2𝑎')
    let mml = output.innerHTML
    dataAttributes = true
    labelFixedArgs()
    if (output.innerHTML != "<math display=\"block\" selanchor=\"3\"><mi>𝑥</mi><mo>=</mo><mfrac><mrow data-arg=\"0\"><mo>−</mo><mi>𝑏</mi><mo>±</mo><msqrt><msup><mi data-arg=\"0\">𝑏</mi><mn data-arg=\"1\">2</mn></msup><mo>−</mo><mn>4</mn><mi>𝑎</mi><mi>𝑐</mi></msqrt></mrow><mrow data-arg=\"1\"><mn>2</mn><mi>𝑎</mi></mrow></mfrac></math>")
        console.log("Fixed-arg labeling failed: " + output.innerHTML)
    else
        console.log("Fixed-arg labeling succeeded")
    let mathml = getMmlNoDataAttribs()
    if (mathml != mml)
        console.log("getMmlNoDataAttribs failed: " + mathml)
    else
        console.log("getMmlNoDataAttribs succeeded")
    dataAttributes = false
    labelFixedArgs()
    if (output.innerHTML != mml)
        console.log("Fixed-arg unlabeling failed: " + output.firstElementChild.innerHTML)
    else
        console.log("Fixed-arg unlabeling succeeded")

    // Test removeMathMlSelAttributes()
    mml = removeMathMlSelAttributes(`<math display="block" selanchor="0" selfocus="5"><mi>𝑎</mi><mo>+</mo><mfrac><mi mathbackground="#666">𝑏</mi><mi>𝑐</mi></mfrac><mo>=</mo><mn>0</mn></math>`)
    if (mml != `<math display="block"><mi>𝑎</mi><mo>+</mo><mfrac><mi>𝑏</mi><mi>𝑐</mi></mfrac><mo>=</mo><mn>0</mn></math>`)
        console.log('mml = ' + mml)

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
    testOutputHotKey('q', '𝑎/𝑏 𝑞Ⓐ()=0')
    speechSynthesis.cancel()

    // Test output autocomplete
    buildUp('\\al', null, true)
    testOutputHotKey('Tab', 'Ⓐ(1)𝛼')

    // Test Tab navigation
    //          →output →config →history
    const keys = ['Tab', 'Tab', 'Tab', 'Enter', 'Enter']

    input.value = '1/2𝜋'
    selectionEnd = selectionStart = 3
    hist = ['→']

    for (i = 0; i < keys.length; i++) {
        const event = new Event('keydown')
        event.key = keys[i]
        document.dispatchEvent(event)
    }
    if (input.value != '1/2→𝜋')
        console.log('Tab navigation failed: ' + input.value)
    else
        console.log('Tab navigation succeeded')
    input.value = ''

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

    // Test some input-window autocorrections
    const autocorrects = [
        {in: 'log_10 ', ip: 7, expect: 'log₁₀', ipNew: 5},
        {in: '1/2=', ip: 4, expect: '½=', ipNew: 2},
        {in: '𝑎...b', ip: 6, expect: '𝑎…𝑏', ipNew: 5},
        {in: '1+2+...+', ip: 8, expect: '1+2+⋯+', ipNew: 6},
        {in: '𝑎/=', ip: 4, expect: '𝑎≠', ipNew: 3},
        {in: '𝑎+-', ip: 4, expect: '𝑎±', ipNew: 3},
    ]
    autocorrects.forEach(x => {
        let key = x.in[x.in.length - 1]
        input.value = x.in
        input.selectionStart = input.selectionEnd = x.ip
        testInputHotKey(key, false, false, x.expect, x.ipNew, x.ipNew)
    })

    const cwch = [['𝓠', '\\mbfscrQ'], ['∈', '\\belongs'], ['ℋ', '\\mscrH'],]

    // Test symbol-to-control-word conversion
    for (i = 0; i < cwch.length; i++) {
        let cw = getSymbolControlWord(cwch[i][0])
        if (cw != cwch[i][1])
            console.log('Symbol-to-control-word conversion failed: ' + cw)
        else
            console.log('Symbol-to-control-word conversion succeeded')
    }
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
    'Integral from A+B to C + D of DX.',
];

const unicodeMathDictation = [
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
    '∫_(𝑎+𝑏)^(𝑐+ⅆ) 𝑑𝑥',                                     // 32
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
