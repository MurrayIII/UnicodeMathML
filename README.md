# UnicodeMathML

*This repository provides a JavaScript-based translation of [UnicodeMath](https://www.unicode.org/notes/tn28/) to [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML) (hence "UnicodeMathML"). An interactive playground allows for experimentation with UnicodeMath's syntax and insight into the translation pipeline. UnicodeMathML can be easily integrated into arbitrary HTML or [Markdeep](https://casual-effects.com/markdeep/) documents.*

#### 🎮 Get familar with the syntax via [the playground](https://doersino.github.io/UnicodeMathML/playground/playground.html)!

#### 📑 [Learn how to](#getting-started) integrate UnicodeMathML into your website or Markdeep document.

UnicodeMath is an **easy-to-read linear format** for mathematics initially developed as an input method and interchange representation for Microsoft Office. Its author, Murray Sargent III, has published a [*Unicode Technical Note*](https://www.unicode.org/notes/tn28/) detailing the format, based on which this UnicodeMath to MathML translator was built. *More in the FAQ section below.*

![](docs/readme-images/1-hero.png)

*The initial development of UnicodeMathML was part of [my Master's thesis](docs/doersing-unicodemath-to-mathml.pdf).*


## Getting Started

For a **first look**, check out...

* ...the [UnicodeMathML playground](https://doersino.github.io/UnicodeMathML/playground/playground.html), an interactive environment that allows you to play around with UnicodeMath's syntax and its translation into MathML.
* ...an [example Markdeep document](https://doersino.github.io/UnicodeMathML/src/integration/example.md.html) whose source can be found [here](https://github.com/doersino/UnicodeMathML/blob/master/src/integration/example.md.html).
* ...or an [example HTML document](https://doersino.github.io/UnicodeMathML/src/integration/example.html) whose source is located [here](https://github.com/doersino/UnicodeMathML/blob/master/src/integration/example.html).

Depending on whether you'd like to write UnicodeMath in a Markdeep document or use UnicodeMathML on your website, there are two paths. But first:

1. **Clone this repository** or [download a ZIP](https://github.com/doersino/UnicodeMathML/archive/master.zip).

    ```
    git clone https://github.com/doersino/UnicodeMathML.git
    ```

### HTML

Open `dist/example.html` in a text editor of your choice and scroll to the bottom. There, you'll see the following lines:

```html
<script>
    var unicodemathmlOptions = {
        resolveControlWords: true,
    };
</script>
<script src="unicodemathml.js"></script>
<script src="unicodemathml-parser.js"></script>
<script src="unicodemathml-integration.js"></script>
<script>
    document.body.onload = renderUnicodemath();
</script>
```

You'll need to **include the same lines (modulo path changes) at the bottom of your own HTML document** or website (but *before* the closing `</body>` tag).

* Of course, you can use [webpack](https://webpack.js.org) or similar tools to combine and minify the JavaScript files.
* If you need to support [browsers that don't support MathML natively](https://caniuse.com/#search=mathml), you will also need to load a polyfill like [MathJax](https://www.mathjax.org) – UnicodeMathML will notify MathJax when the generated MathML is ready to render.
* The `unicodemathmlOptions` variable allows you to tweak things a bit – see the "Configuration" section below for more details.

### Markdeep

UnicodeMathML comes with a lightly modified variant of Markdeep that kicks off the translation at the correct point in the document rendering process. Open `dist/example.md.html` in a text editor of your choice and scroll to the bottom. There, you'll see the following lines:

```html
<script>
    var unicodemathmlOptions = {
        resolveControlWords: true,
    };
</script>
<script src="unicodemathml.js"></script>
<script src="unicodemathml-parser.js"></script>
<script src="unicodemathml-integration.js"></script>
<script src="markdeep-1.11.js" charset="utf-8"></script>
```

Replace the Markdeep loading code at the bottom of your document with this code (modulo path changes).

* Markdeep will automatically load [MathJax](https://www.mathjax.org), a polyfill that will allow [browsers that don't support MathML natively](https://caniuse.com/#search=mathml) to render the generate MathML.
* The `unicodemathmlOptions` variable allows you to tweak things a bit – see the "Configuration" section below for more details.


### Node

While I haven't tested server-side translation of UnicodeMath into MathML, there shouldn't be any problems integrating the core of UnicodeMathML into a Node project – it's all vanilla JavaScript. If you run into any trouble, don't hesistate to [file an issue](https://github.com/doersino/UnicodeMathML/issues)!


### Configuration

The `unicodemathmlOptions` variable must be a **dictionary containing one or many of the key-value pairs described below**. If you're happy with the defaults, you can leave `unicodemathmlOptions` undefined.

```js
var unicodemathmlOptions = {

    // whether a progress meter should be shown in the bottom right of the
    // viewport during translation (you can probably disable this in most cases,
    // but it should remain enabled for large documents containing more than
    // 1000 UnicodeMath expressions where translation might take more than a
    // second or two)
    showProgress: true,

    // whether to resolve control words like "\alpha" to "α", this also includes
    // unicode escapes like "\u1234"
    resolveControlWords: false,

    // a dictionary defining a number of custom control words, e.g.:
    // customControlWords: {'playground': '𝐏𝓁𝔞𝚢𝗴𝑟𝖔𝓊𝙣𝕕'},
    // which would make the control word "\playground" available – this is handy
    // in documents where certain expressions or subexpressions are repeated
    // frequently
    customControlWords: undefined,

    // how to display double-struck symbols (which signify differentials,
    // imaginary numbers, etc.; see section 3.11 of the tech note):
    // "us-tech" (ⅆ ↦ 𝑑), "us-patent" (ⅆ ↦ ⅆ), or "euro-tech" (ⅆ ↦ d)
    doubleStruckMode: "us-tech",

    // a function that will run before the translation is kicked off
    before: Function.prototype,

    // a function that will run after the translation has finished (and after
    // MathJax, if loaded, has been told to render the generated MathML)
    after: Function.prototype
};
```


## FAQ

Got **further questions** that aren't answered below, or ideas for **potential improvements**, or **found a bug**? *Feel free to [file an issue](https://github.com/doersino/UnicodeMathML/issues)!*


### What's this *UnicodeMath* you're talking about?

UnicodeMath is a **linear format for mathematics** initially developed as an input method and interchange representation for Microsoft Office. Its author, Murray Sargent III, has published a [*Unicode Technical Note*](https://www.unicode.org/notes/tn28/) (a copy of which is included at `docs/sargent-unicodemathml-tech-note.pdf`) describing its syntax and semantics. By using Unicode symbols in lieu of keywords wherever possible, it's **significantly more readable than alternative formats** in plain text:

![](docs/readme-images/2-example.png)

TODO more from thesis/presentation – maybe refer to it outright


### How does its syntax compare to AsciiMath, LaTeX, and MathML?

Here's a table showing a few formulas as you'd write them in UnicodeMath, AsciiMath and LaTeX, along with rendering examples:

![](docs/readme-images/3-examples.png)

There are more subtleties as you get into the nitty-gritty, but you'll see that UnicodeMath consistently makes for the most readable plaintext. LaTeX, in contrast, is significantly more verbose – but since it's been around forever, you might find it to be more versatile in practice.

To summarize, here's a totally-not-biased-and-super-scientific evaluation of these notations:

![](docs/readme-images/4-stars.png)


### Does UnicodeMath support colors, monospaced text and comments?

Not in its canonical form as described in Sargent's tech note – in Section 1, he mentions that such properties should be delegated to a "higher layer", which is perfectly reasonable in GUI-based environments like Microsoft Office – but there is not such layer in HTML/Markdeep.

To remedy this, UnicodeMathML supports a few non-standard constructs:

![](docs/readme-images/5-additions.png)

For your copy-and-pasting pleasure, that's `✎`, `☁`, `ￗ`, `⫷`, and `⫷`.


### Alright, but I can't find any of these fancy Unicode symbols on my keyboard!

Nobody's keeping you from adapting [Tom Scott's emoji keyboard](https://www.youtube.com/watch?v=lIFE7h3m40U) idea for math.

More realistically, there's a bunch of tooling and text editor plugins that can help out here:

* TODO sublime plugin (note this: https://github.com/mvoidex/UnicodeMath/issues/20)
* TODO other tools (see the ones torsten recommended, macos popup thingy, something for windows?)

Additially, you can configure UnicodeMathML to automatically translate keywords like `\infty` into their respective symbols before processing proper commences – see the "Configuration" section above.


### Alright, that's not as big of a problem as I feared. What's *MathML*, then?

TODO explain


### Isn't browser support for MathML really lackluster?

Sort of – according to [caniuse.com](https://caniuse.com/#search=mathml), native support for MathML is available for around 21% of users as of late 2020 as only Firefox and Safari currently support MathML.

However, Igalia [is working]() on adding MathML support to Chromium, which should push this number upwards quite significantly in the coming months or years.

All of this isn't really an issue: [MathJax](https://www.mathjax.org), which you'd probably use to render LaTeX math on the web anyway, provides a polyfill for MathML rendering.


### But LaTeX seems more TODO widespread, usable, omnipresent., and KaTeX is so much faster than MathJax!

Can't argue with that – which is why I've been experimenting with enabling UnicodeMathML to emit LaTeX code, too – most but not all UnicodeMath features are supported at a basic level. You can take a look at the progress in the playground by enabling the "Enable EXPERIMENTAL LaTeX output" setting.

TODO file issue if you want me to actively work on this again


## Development

*This section is largely a reminder to myself and other potential contributors.*

UnicodeMathML is intentionally kept simple and doesn't have any dependencies beyond PEG.js – that way, it's easier to maintain and extend.

* TODO simple architecture overview


### Local development

Depending on how your browser implementis its same-origin policy, you might not be able to serve the playground from the file system (i.e. with a URL like `file:///⋯/UnicodeMathML/playground/playground.html`) during development:

* Safari seems to work fine.
* Firefox does, too, after you set the `security.fileuri.strict_origin_policy` key on the `about:config` page to `false`.
* Chrome is more restrictive and thus doesn't.

You can work around this by running a static web server that's serving the root directory of you local clone of this repository. Many programming environments, one of which is surely installed on your system, provide one-liners for this purpose – see [here](https://gist.github.com/willurd/5720255). If you've got Python installed, simply run `python3 -m http.server 8000` and point your browser at `localhost:8000/playground/playground.html`.


### Bundling

The contents of `dist/` are generated as follows:

1. Run the bash script `utils/bundle.sh` from the root directory of this repository.
2. Open `utils/generate-parser.html` in any web browser (the caveats discussed in the "Local development" section above apply) and move the file that will be downloaded into `dist/`.


## Related Work

* TODO see https://github.com/arnog/mathlive/blob/316023b89aa6ee5ba8f417bb016ccb2648f9a21f/src/editor/parse-math-string.ts#L23
* TODO https://github.com/runarberg/mathup
* TODO https://github.com/michael-brade/LaTeX.js


## License

You may use this repository's contents under the terms of the *MIT License*, see `LICENSE`.

However, the subdirectories `lib/` and `playground/assets/lib/` contain some **third-party software with its own licenses**:

* The parser generator [PEG.js](https://github.com/pegjs/pegjs), a copy of which is located at `lib/peg-0.10.0.min.js`, is licensed under the *MIT License*, see [here](https://github.com/pegjs/pegjs/blob/master/LICENSE).
* Morgan McGuire's [Markdeep](https://casual-effects.com/markdeep/), which – along with a slightly modified variant that integrates with UnicodeMathML – is located at `lib/markdeep-1.11-orig.js`, is licensed under the *BSD 2-Clause "Simplified" License*, see [here](https://casual-effects.com/markdeep/#license).
* Markdeep includes Ivan Sagalaev's [highlight.js](https://highlightjs.org) with its *BSD 3-Clause License*, see [here](https://github.com/highlightjs/highlight.js/blob/master/LICENSE).
* [JQuery](https://jquery.com), which powers some of the interactions in the UnicodeMathML playground and resides at `playground/assets/lib/jquery.min.js`, is licensed under the *MIT License*, see [here](https://jquery.org/license/).
* A stripped-down variant of [MathJax](https://www.mathjax.org) is included at `playground/assets/lib/mathjax/`, it's licensed under the *Apache License 2.0*, see [here](https://github.com/mathjax/MathJax/blob/master/LICENSE).
* [LM Math](http://www.gust.org.pl/projects/e-foundry/lm-math/download/index_html), the typeface used for rendered UnicodeMath expressions in the playground in browsers with native MathML support, can be found at `playground/assets/lib/latinmodern/` and is licensed under the *GUST Font License*, see [here](http://www.gust.org.pl/projects/e-foundry/licenses/GUST-FONT-LICENSE.txt/view).
* Belleve Invis' excellent typeface [Iosevka](https://github.com/be5invis/Iosevka) is located at `playground/assets/lib/iosevka/` and licensed under the *SIL OFL Version 1.1*, see [here](https://github.com/be5invis/Iosevka/blob/master/LICENSE.md).
