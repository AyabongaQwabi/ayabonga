---
title: "Building Declarative Applications with Functional JavaScript"
excerpt: "Declarative vs imperative thinking, composition, partial application, currying, combinators, and state containers — with Ramda, Redux, and practical examples."
date: April 11, 2026
readTime: 28 min read
tags: JavaScript, Functional programming, Ramda, Redux, Composition
categories: Engineering
---

*Compiled by **Ayabonga Qwabi**, Namoota Technologies — [namootatech.com](https://www.namootatech.com)*

---

## What is declarative programming?

Declarative programming is a software development paradigm where the main focus is on describing **what** needs to be achieved or the desired outcome, rather than explicitly specifying **how** to achieve it. You provide declarations, configurations, or statements that outline the desired behavior.

It is called *declarative* because you declare **what** should be done rather than **how**. You describe the desired result; the language or runtime figures out the steps. That contrasts with **imperative** programming, where you list step-by-step instructions for the machine.

In imperative programming the focus is on procedures and algorithms: explicit instructions for how to reach the outcome.

---

## Let’s simplify it further

**Imperative (driving directions):** “Turn left at the next intersection, go straight, then take a right onto X Street.” Step-by-step instructions.

**Declarative (GPS):** You enter the destination; the system computes the route. You state **where** you want to go; it handles **how**.

Declarative programming can simplify development, improve readability and maintainability, and let the system optimize execution. It can be limiting when you need fine-grained control or very complex custom logic.

**Functional programming** is a subtype of declarative programming: define functions, compose them, favour immutability, and avoid side effects where possible.

---

## If we only declare the output, how does the machine know the steps?

The **runtime, framework, or engine** interprets your declarations and maps them to concrete operations — via libraries, optimizers, or internal rules.

1. You define the desired outcome (high-level instructions or config).
2. The system interprets those instructions.
3. The system executes the necessary actions (often optimized).
4. You receive the output without specifying every low-level step.

### Why bother if something imperative still runs under the hood?

Declarative style **abstracts** implementation noise so that application code can be:

1. **Human-readable** — reads like intent, not micro-steps.
2. **Maintainable** — modular pieces and clearer separation of concerns.
3. **Abstract** — reuse and manage complexity in larger systems.
4. **Intent-focused** — less noise, clearer logic.
5. **Higher-level** — less boilerplate when the platform gives good primitives.
6. **Easier to debug and test** — clearer boundaries (when discipline is kept).

Declarative programming does not replace imperative code everywhere; it **layers** over it. The right mix depends on the problem and the tools you use.

---

## Examples: HTML, CSS, SQL

### HTML

HTML describes structure and content; the browser decides how to lay it out and paint.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Declarative Example</title>
</head>
<body>
  <h1>Welcome to Declarative Programming!</h1>
  <p>This is an example of declarative HTML.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</body>
</html>
```

### CSS

You declare presentation; the engine applies it.

```css
h1 {
  color: blue;
  font-size: 24px;
}

p {
  color: green;
}
```

### SQL

You declare the result set; the database plans and executes the query.

```sql
SELECT first_name, last_name
FROM employees
WHERE department = 'IT'
ORDER BY last_name;
```

In each case you focus on **what**; the system handles much of the **how**.

---

## Declarative programming and abstraction

In its purest form, declarative programming is closely tied to **abstraction**: separating **what** (behaviour you want) from **how** (implementation). That separation supports readability, maintenance, and staying close to the problem domain.

---

## Declarative apps with functional JavaScript

Building declarative-style apps in JavaScript often combines several ideas. Below: composition, partial application, currying, point-free style, typing notes, combinators, and containers for state.

### Function composition

Composition chains functions so the output of one feeds the next. It matches declarative style: express a pipeline of transformations instead of manual sequencing.

Composition has deep roots in **lambda calculus**: functions can take functions and return functions.

#### Basic composition

**Composition** assembles smaller blocks into larger behaviour. In functions, you chain steps so each step receives the previous step’s output.

```js
const add = (x) => x + 2;
const multiply = (x) => x * 3;
const composedFunction = (x) => multiply(add(x));
const result = composedFunction(5); // (5 + 2) * 3 = 21
```

`composedFunction` first adds 2, then multiplies by 3. Composition generalizes this pattern and is a foundation for currying, partial application, and larger pipelines.

#### Ramda `compose`

[Ramda](https://ramdajs.com/)’s `R.compose` builds a right-to-left pipeline: the **rightmost** function runs first.

```js
import * as R from 'ramda';

const add = (x) => x + 2;
const multiply = (x) => x * 3;

const composedFunction = R.compose(multiply, add);

composedFunction(5); // 21
```

---

### Partial application

**Partial application** fixes some arguments of a function and returns a new function for the rest.

```js
const add = (x, y, z) => x + y + z;
const addFive = add.bind(null, 5);
addFive(3, 2); // 10
```

This supports reusable, specialized functions and fits a declarative, data-flow-oriented style.

#### Ramda `partial`

```js
import * as R from 'ramda';

const add = (a, b, c) => a + b + c;
const addFive = R.partial(add, [5]);
addFive(2, 3); // 10

const subtract = (a, b) => a - b;
const subtractFive = R.partial(subtract, [R.__, 5]);
subtractFive(10); // 5
```

`R.__` marks argument positions to fill in later.

---

### Function currying

**Currying** turns a multi-argument function into a sequence of unary functions: each call returns the next function until all arguments are supplied.

```js
const add = (x) => (y) => x + y;
const incrementByTwo = add(2);
incrementByTwo(5); // 7
```

Currying supports modularity, reuse, and composition.

#### Ramda `curry`

```js
import * as R from 'ramda';

const add = (a, b) => a + b;
const curriedAdd = R.curry(add);

const add5 = curriedAdd(5);
add5(3); // 8
curriedAdd(2, 3); // 5
```

---

### Point-free programming

**Point-free** (tacit) style defines functions without naming every argument, often via composition and currying. It can be concise; it rewards familiarity with your utilities.

For “square then add the original value” — e.g. \(3^2 + 3 = 12\) — Ramda’s `converge` expresses that clearly:

```js
import * as R from 'ramda';

// x² + x  →  at x = 3: 9 + 3 = 12
const squareAndAdd = R.converge(R.add, [R.square, R.identity]);

squareAndAdd(3); // 12
```

Point-free style leans on **abstraction**, **declarative** pipelines, and **composition**; readability depends on team conventions.

---

### Type annotations (JSDoc / TypeScript)

Annotating inputs and outputs improves **safety**, **documentation**, **tooling**, **refactors**, and clarity of **intent** in composed code.

```js
/**
 * Adds 2 to a number.
 * @param {number} x
 * @returns {number}
 */
const add = (x) => x + 2;

/**
 * Multiplies a number by 3.
 * @param {number} x
 * @returns {number}
 */
const multiply = (x) => x * 3;

/**
 * Adds 2, then multiplies by 3.
 * @param {number} x
 * @returns {number}
 */
const composedFunction = (x) => multiply(add(x));

composedFunction(5); // 21
```

---

### Hindley–Milner style as documentation

JavaScript does not infer ML-family types natively, but **Hindley–Milner-like** comments document contracts:

`functionName: (Arg1) => (Arg2) => Return`

```js
/**
 * add: (number) => (number) => number
 * @param {number} x
 * @returns {(y: number) => number}
 */
const add = (x) => (y) => x + y;

/**
 * multiply: (number) => (number) => number
 */
const multiply = (x) => (y) => x * y;

/**
 * composedFunction: (number) => number
 */
const composedFunction = (x) => multiply(add(x)(2))(3);

composedFunction(5); // 21
```

---

### Laws of composability

Laws help reason about composed systems.

#### Law of identity

Composing with an **identity** function should not change behaviour.

```js
import { compose } from 'ramda';

const identity = (x) => x;
const multiplyByTwo = (x) => x * 2;
const composed = compose(identity, multiplyByTwo);

composed(5); // 10
```

#### Law of association (composition)

For function composition, **associativity** means \((f \circ g) \circ h = f \circ (g \circ h)\): grouping of composed functions does not change the result.

(Array `map`/`reduce` examples mix different operations; true associativity of composition is best illustrated directly with `compose` or `pipe`.)

---

### Function combinators

A **combinator** is a higher-order function that builds new functions from simpler ones, typically **without free variables** — only parameters matter.

**Purpose:** combine functions so output flows through a chain (like `compose`).

#### Common JavaScript combinator sketches

```js
// identity (R.identity)
const I = (x) => x;

// constant (R.always)
const K = (x) => (y) => x;

// apply (R.call)
const A = (f) => (x) => f(x);

// thrush (R.applyTo)
const T = (x) => (f) => f(x);

// duplication
const W = (f) => (x) => f(x)(x);

// flip (R.flip)
const C = (f) => (y) => (x) => f(x)(y);

// compose (R.compose)
const B = (f) => (g) => (x) => f(g(x));

// substitution (S combinator sketch)
const S = (f) => (g) => (x) => f(x)(g(x));

// converge-style (related to R.converge)
const S2 = (f) => (g) => (h) => (x) => f(g(x))(h(x));

// on (R.on)
const P = (f) => (g) => (x) => (y) => f(g(x))(g(y));
```

#### Free variables

A **free variable** is used inside a function but bound in an **outer** scope rather than declared inside the function.

```js
function outerFunction() {
  const outerVariable = 'Hello';

  function innerFunction() {
    console.log(outerVariable); // free variable from outer scope
  }

  innerFunction();
}
```

#### Pure functions

A **pure** function always returns the same output for the same input and causes **no observable side effects**.

```js
function add(a, b) {
  return a + b;
}
```

---

## State management in declarative apps

### Containers

**Containers** hold application state in a structured, predictable way. Many designs favour **immutability**: updates produce new values instead of mutating old ones.

Why they matter:

1. **Predictable** central state.
2. **Immutability** reduces accidental coupling.
3. **Separation** of state logic from UI.
4. **Reuse** of stateful modules.
5. **Performance** options (e.g. shallow equality in subscribers).
6. **Scale** as features grow.

### Redux

**Redux** keeps state in a single **store** (container). Updates are described by **actions** and applied by pure **reducers** that return the next state object.

```js
// store.js
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);
export default store;
```

```js
// reducers.js
const initialState = { count: 0 };

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

export default counterReducer;
```

```jsx
// CounterComponent.jsx
import React from 'react';
import { connect } from 'react-redux';

const CounterComponent = ({ count, increment, decrement }) => (
  <div>
    <p>Count: {count}</p>
    <button type="button" onClick={increment}>
      Increment
    </button>
    <button type="button" onClick={decrement}>
      Decrement
    </button>
  </div>
);

const mapStateToProps = (state) => ({ count: state.count });

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: 'INCREMENT' }),
  decrement: () => dispatch({ type: 'DECREMENT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterComponent);
```

---

## References

- X-Team — [Functional programming, composition, associativity](https://x-team.com/blog/functional-programming-composition-associativity/)
- TheEvilSoft — [YouTube](https://www.youtube.com/watch?v=ZS2_X-ZjFBI)
- Ramda — [Documentation](https://ramdajs.com/docs/)
- LinkedIn Learning — [Building declarative apps using functional JavaScript](https://www.linkedin.com/learning/building-declarative-apps-using-functional-javascript/nonlinear-composition-using-join-combinators?resume=false)
- ChatGPT — [chat.openai.com](https://chat.openai.com) (research / drafting aid)
- GitHub gist — [Combinators reference](https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45)
- The Codest — [Power of functional programming in JavaScript, part 2 — combinators](https://thecodest.co/blog/power-of-functional-programming-in-javascript-part-2-combinators/)
- InterTech — [Redux: when and why to use a state container](https://www.intertech.com/redux-when-why-to-use-a-state-container-with-your-javascript-apps/)
