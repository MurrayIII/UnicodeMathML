const { resolveControlWords, normalizeOptions } = require('./utils');

// Import the main conversion function from the existing unicodemathml.js
const unicodemathmlModule = require('./unicodemathml.js');

// Check if unicodemathml function exists - it should be a global function in that file
// Since the file uses a UMD pattern, we need to extract it differently
let unicodemathmlFunction;

if (typeof unicodemathmlModule === 'function') {
    unicodemathmlFunction = unicodemathmlModule;
} else if (typeof unicodemathml !== 'undefined') {
    // The function might be global after requiring the file
    unicodemathmlFunction = unicodemathml;
} else {
    // Fallback: try to execute the file in a way that creates the global
    const vm = require('vm');
    const fs = require('fs');
    const path = require('path');
    
    const code = fs.readFileSync(path.join(__dirname, 'unicodemathml.js'), 'utf8');
    const context = { 
        require: require,
        module: { exports: {} },
        exports: {},
        console: console,
        performance: { now: () => Date.now() },
        // Create a minimal window-like object for the browser code
        window: {},
        document: {},
        ummlParser: require('./parser.js')
    };
    
    vm.createContext(context);
    vm.runInContext(code, context);
    
    unicodemathmlFunction = context.unicodemathml;
}

/**
 * Convert UnicodeMath string to MathML
 * @param {string} unicodeMath - The UnicodeMath expression to convert
 * @param {Object} options - Conversion options
 * @returns {string} The resulting MathML string
 */
function convertUnicodeToMathML(unicodeMath, options = {}) {
    const opts = normalizeOptions(options);
    
    try {
        // Set up global config for the unicodemathml function
        global.ummlConfig = {
            resolveControlWords: opts.resolveControlWords,
            customControlWords: opts.customControlWords,
            doubleStruckMode: opts.doubleStruckMode,
            debug: false,
            tracing: false
        };
        
        // Create a simple parser object that the unicodemathml.js expects
        if (typeof global.ummlParser === 'undefined') {
            global.ummlParser = require('./parser.js');
        }
        
        // Call the conversion function
        const result = unicodemathmlFunction(unicodeMath, opts.displayMode);
        
        if (result && result.mathml) {
            return result.mathml;
        } else if (typeof result === 'string') {
            return result;
        } else {
            throw new Error('Unexpected result format from unicodemathml function');
        }
        
    } catch (error) {
        throw new Error(`UnicodeMath conversion failed: ${error.message}`);
    } finally {
        // Clean up global config
        if (global.ummlConfig) {
            delete global.ummlConfig;
        }
    }
}

/**
 * Parse UnicodeMath to AST (for advanced users)
 * @param {string} unicodeMath - The UnicodeMath expression to parse
 * @param {Object} options - Parse options
 * @returns {Object} The Abstract Syntax Tree
 */
function parseUnicodeMath(unicodeMath, options = {}) {
    const opts = normalizeOptions(options);
    
    try {
        // Set up global config
        global.ummlConfig = {
            resolveControlWords: opts.resolveControlWords,
            customControlWords: opts.customControlWords,
            doubleStruckMode: opts.doubleStruckMode,
            debug: false,
            tracing: false
        };
        
        if (typeof global.ummlParser === 'undefined') {
            global.ummlParser = require('./parser.js');
        }
        
        const result = unicodemathmlFunction(unicodeMath, opts.displayMode);
        
        if (result && result.details && result.details.intermediates) {
            return result.details.intermediates.parse;
        } else {
            // Fallback: just try to parse directly
            const parser = require('./parser.js');
            return parser.parse(unicodeMath);
        }
        
    } catch (error) {
        throw new Error(`UnicodeMath parsing failed: ${error.message}`);
    } finally {
        // Clean up
        if (global.ummlConfig) {
            delete global.ummlConfig;
        }
    }
}

module.exports = {
    convertUnicodeToMathML,
    parseUnicodeMath
};
