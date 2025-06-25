# Mathematical Expression Rendering Guide

This application now supports rendering complex mathematical expressions in questions and answer options using KaTeX. The system automatically detects and renders mathematical expressions in multiple formats.

## 🎯 Supported Formats

### 1. LaTeX Math Expressions (Recommended)

Use `$...$` for inline math and `$$...$$` for block math:

#### Examples:

```javascript
// Inline math
"Find the value of $x^2 + y^2$ when $x = 3$ and $y = 4$";

// Block math (centered, larger)
"The correlation coefficient is: $$r = \\frac{\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\sum_{i=1}^{n}(y_i - \\bar{y})^2}}$$";

// Mixed inline and block
"Solve the equation $2x + 3 = 7$. The solution is: $$x = \\frac{7 - 3}{2} = 2$$";
```

### 2. Automatic Pattern Recognition

The system automatically converts common patterns to LaTeX:

#### Exponents:

- `asquare 1` → a¹
- `x^2` → x²
- `y^n` → y^n

#### Subscripts:

- `x_i` → xᵢ
- `a_n` → aₙ

#### Square Roots:

- `sqrt x` → √x
- `sqrt 16` → √16

#### Fractions:

- `frac 1 2` → ½
- `frac a b` → a/b

#### Greek Letters:

- `pi` → π
- `theta` → θ
- `alpha` → α
- `beta` → β
- `gamma` → γ
- `delta` → δ
- `sigma` → σ
- `omega` → ω

#### Mathematical Symbols:

- `int` → ∫
- `sum` → ∑
- `prod` → ∏
- `infinity` → ∞
- `partial` → ∂
- `nabla` → ∇

## 📝 How to Write Questions

### For Complex Formulas (Recommended)

Use LaTeX format directly in your question text:

```javascript
// Question with complex math
{
  question: "The Laplace transform of $\\sin(at)$ is:",
  answers: [
    { options: "$\\frac{a}{s^2 + a^2}$", answer_number: 1 },
    { options: "$\\frac{s}{s^2 + a^2}$", answer_number: 2 },
    { options: "$\\frac{1}{s - a}$", answer_number: 3 },
    { options: "$\\frac{a}{(s - a)^2}$", answer_number: 4 }
  ]
}

// Question with correlation formula
{
  question: "The Pearson correlation coefficient is given by: $$r = \\frac{\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\sum_{i=1}^{n}(y_i - \\bar{y})^2}}$$ What does this formula measure?",
  answers: [
    { options: "Linear correlation between two variables", answer_number: 1 },
    { options: "Standard deviation", answer_number: 2 },
    { options: "Mean value", answer_number: 3 },
    { options: "Variance", answer_number: 4 }
  ]
}
```

 

```javascript
{
  question: "If A is a square matrix such that A^2 = I, then which of the following is true?",
  answers: [
    { options: "A is a null matrix", answer_number: 1 },
    { options: "A is an identity matrix", answer_number: 2 },
    { options: "A is an involutory matrix", answer_number: 3 },
    { options: "A is a diagonal matrix", answer_number: 4 }
  ]
}
```

### Key Functions:

1. **`renderWithMath(text)`** - Renders LaTeX math expressions
2. **`hasMathExpressions(text)`** - Detects if text contains math
3. **`processMathPatterns(text)`** - Converts patterns to LaTeX
4. **`renderMathText(text)`** - Combines pattern processing and rendering

## 📚 Example Questions for Your Use Case

### 1. Laplace Transform Question:

```javascript
{
  question: "The Laplace transform of $\\sin(at)$ is:",
  answers: [
    { options: "$\\frac{a}{s^2 + a^2}$", answer_number: 1 },
    { options: "$\\frac{s}{s^2 + a^2}$", answer_number: 2 },
    { options: "$\\frac{1}{s - a}$", answer_number: 3 },
    { options: "$\\frac{a}{(s - a)^2}$", answer_number: 4 }
  ]
}
```

### 2. Matrix Question:

```javascript
{
  question: "If $A$ is a square matrix such that $A^2 = I$, then which of the following is true?",
  answers: [
    { options: "$A$ is a null matrix", answer_number: 1 },
    { options: "$A$ is an identity matrix", answer_number: 2 },
    { options: "$A$ is an involutory matrix", answer_number: 3 },
    { options: "$A$ is a diagonal matrix", answer_number: 4 }
  ]
}
```

### 3. Dimensional Formula Question:

```javascript
{
  question: "The dimensional formula of resistance is:",
  answers: [
    { options: "$MLT^{-3}A^{-2}$", answer_number: 1 },
    { options: "$ML^2T^{-2}A^{-2}$", answer_number: 2 },
    { options: "$ML^2T^{-3}$", answer_number: 3 },
    { options: "$ML^2T^{-3}A$", answer_number: 4 }
  ]
}
```

### 4. Differential Equation Question:

```javascript
{
  question: "The solution of the differential equation $\\frac{dy}{dx} + y = e^x$ is:",
  answers: [
    { options: "$y = e^x + C$", answer_number: 1 },
    { options: "$y = x + C$", answer_number: 2 },
    { options: "$y = Ce^{-x} + e^x$", answer_number: 3 },
    { options: "$y = Ce^x + x$", answer_number: 4 }
  ]
}
```

### 5. Complex Formula Question:

```javascript
{
  question: "The correlation coefficient formula is: $$r = \\frac{\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\sum_{i=1}^{n}(y_i - \\bar{y})^2}}$$ What does this measure?",
  answers: [
    { options: "Linear correlation between variables", answer_number: 1 },
    { options: "Standard deviation", answer_number: 2 },
    { options: "Mean value", answer_number: 3 },
    { options: "Variance", answer_number: 4 }
  ]
}
```

## 🎨 Benefits

1. **Professional Appearance** - Mathematical expressions look like they're from a textbook
2. **Automatic Detection** - No manual formatting needed for common patterns
3. **Flexible** - Supports both simple patterns and complex LaTeX
4. **Error Handling** - Graceful fallback for invalid math expressions
5. **Performance** - Only processes math when detected
6. **Cross-Platform** - Works on all devices and browsers

## 🚀 Getting Started

1. **For simple expressions**: Use automatic patterns like `x^2`, `sqrt x`, `frac 1 2`
2. **For complex formulas**: Use LaTeX format with `$...$` or `$$...$$`
3. **For mixed content**: Combine both approaches in the same question

The system will automatically detect and render all mathematical expressions beautifully!
