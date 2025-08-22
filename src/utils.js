/**
 * Default options for UnicodeMath conversion
 */
const DEFAULT_OPTIONS = {
  resolveControlWords: false,
  customControlWords: {},
  doubleStruckMode: 'us-tech',
  displayMode: false
};

/**
 * Control words to Unicode mapping
 */
const CONTROL_WORDS = {
  // Greek letters
  'alpha': 'α',
  'beta': 'β',
  'gamma': 'γ',
  'delta': 'δ',
  'epsilon': 'ε',
  'zeta': 'ζ',
  'eta': 'η',
  'theta': 'θ',
  'iota': 'ι',
  'kappa': 'κ',
  'lambda': 'λ',
  'mu': 'μ',
  'nu': 'ν',
  'xi': 'ξ',
  'omicron': 'ο',
  'pi': 'π',
  'rho': 'ρ',
  'sigma': 'σ',
  'tau': 'τ',
  'upsilon': 'υ',
  'phi': 'φ',
  'chi': 'χ',
  'psi': 'ψ',
  'omega': 'ω',
  // Capital Greek letters
  'Alpha': 'Α',
  'Beta': 'Β',
  'Gamma': 'Γ',
  'Delta': 'Δ',
  'Epsilon': 'Ε',
  'Zeta': 'Ζ',
  'Eta': 'Η',
  'Theta': 'Θ',
  'Iota': 'Ι',
  'Kappa': 'Κ',
  'Lambda': 'Λ',
  'Mu': 'Μ',
  'Nu': 'Ν',
  'Xi': 'Ξ',
  'Omicron': 'Ο',
  'Pi': 'Π',
  'Rho': 'Ρ',
  'Sigma': 'Σ',
  'Tau': 'Τ',
  'Upsilon': 'Υ',
  'Phi': 'Φ',
  'Chi': 'Χ',
  'Psi': 'Ψ',
  'Omega': 'Ω',
  // Math symbols
  'infty': '∞',
  'sum': '∑',
  'prod': '∏',
  'int': '∫',
  'partial': '∂',
  'nabla': '∇',
  'pm': '±',
  'mp': '∓',
  'times': '×',
  'div': '÷',
  'ne': '≠',
  'le': '≤',
  'ge': '≥',
  'approx': '≈',
  'equiv': '≡',
  'propto': '∝',
  'in': '∈',
  'notin': '∉',
  'subset': '⊂',
  'supset': '⊃',
  'subseteq': '⊆',
  'supseteq': '⊇',
  'cup': '∪',
  'cap': '∩',
  'wedge': '∧',
  'vee': '∨',
  'neg': '¬',
  'forall': '∀',
  'exists': '∃',
  'emptyset': '∅',
  'angle': '∠',
  'perp': '⊥',
  'parallel': '∥'
};

/**
 * Normalize and validate options
 */
function normalizeOptions(options) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    customControlWords: {
      ...CONTROL_WORDS,
      ...(options.customControlWords || {})
    }
  };
}

/**
 * Resolve control words in UnicodeMath string
 */
function resolveControlWords(unicodeMath, controlWords) {
  let result = unicodeMath;
  
  // Replace control words
  for (const [word, unicode] of Object.entries(controlWords)) {
    const regex = new RegExp(`\\\\${word}\\b`, 'g');
    result = result.replace(regex, unicode);
  }
  
  // Handle Unicode escapes like \u1234
  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });
  
  return result;
}

module.exports = {
  DEFAULT_OPTIONS,
  CONTROL_WORDS,
  normalizeOptions,
  resolveControlWords
};