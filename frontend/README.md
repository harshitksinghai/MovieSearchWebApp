Work in progress... 

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

////////////////

Deep React Learning Notes (True Mental Model)
🔸 useState — How State Works
tsx
Copy
Edit
const [name, setName] = useState("Alice");
name is just a value — changes every render, holds the latest value.

setName is a stable function — it never changes.

When you call setName(...), it:

Updates the value

Triggers a component re-render

This re-executes the component function

🔁 Every re-render means the entire component function runs again.

🔸 Primitive vs Object (Comparison Behavior)
Type	Compared by	Meaning
Primitive	Value	"hello" === "hello" ✅ true
Object	Reference	{a: 1} === {a: 1} ❌ false

So if you're dealing with strings or numbers, value comparison is fine.
But with objects, even if content is same, a new object means new reference.

🔸 Arrays and Objects — “Floating in Memory”
tsx
Copy
Edit
const [people, setPeople] = useState([{ id: 1, name: "A" }, ...]);
The array is a reference to memory.

Each object inside ({ id: 1, ... }) is a separate object in memory.

When you do something like:

tsx
Copy
Edit
setPeople(prev => prev.map(p => p.id === 2 ? {...p, age: newAge} : p));
The array is new

The updated object is new

But all other objects still have the same reference

This helps in optimization because unchanged objects can be skipped during comparison.

🔸 Shallow Comparison (Used by React.memo)
Shallow comparison = compare references of top-level props only.

tsx
Copy
Edit
React.memo(Component);
If props haven't changed (same references), component won’t re-render.

So:

tsx
Copy
Edit
<PersonCard person={person} />
If person is a new object → re-render ❌

If same object (same reference) → skip render ✅

🔸 useCallback — Why and When?
By default, functions are recreated on every render.

tsx
Copy
Edit
const updateAge = useCallback((id, age) => {
  setPeople(prev => prev.map(...));
}, []);
Prevents function from being re-created each render

Helpful when:

Passing the function to a memoized child component (like PersonCard)

Used as a dependency in useEffect, useMemo, etc.

🔸 Closures in React — Stale Values Explained
tsx
Copy
Edit
const [count, setCount] = useState(0);

const logCount = useCallback(() => {
  console.log(count);
}, []);
Even if count changes later, logCount will always print 0
because it closed over the count at the time the function was created.

✅ Functions in JS remember the values of variables they were created with, not live-updating references.

So:
Variable Type	Captured in Closure?
useState variable	✅ Yes (value at creation)
Constant	✅ Yes
Props	✅ Yes
Function Parameters	❌ No (passed at call time)

🔸 The Real Purpose Behind React.memo
✅ The goal is to avoid re-executing the component function
if props haven’t changed.

When using:

tsx
Copy
Edit
<PersonCardMemo person={person} />
React checks if the person prop changed (shallow check). If not:

❌ It doesn't call the component function again
✅ It reuses the previous virtual DOM subtree from last render

So React doesn’t even recreate JSX or virtual DOM for that component.
It plugs in the last virtual DOM output, skipping everything internally.

🔁 But .map() Always Runs Again
Even if you're mapping over people:

tsx
Copy
Edit
people.map(p => <PersonCard key={p.id} person={p} />)
.map() runs again ✅

JSX returns new PersonCard elements ✅

But React:

Checks key

Sees same prop reference

Skips calling memoized component ❌

Reuses previous virtual DOM for that component ✅

So yes — virtual DOM is recreated, but memoized subtrees are directly reused.

✅ Summary: What React.memo Actually Saves
Step	Without React.memo	With React.memo (unchanged props)
.map()	✅ Yes	✅ Yes
Component function runs	✅ Yes	❌ Skipped
JSX creation (new virtual DOM)	✅ Yes	❌ Skipped
Virtual DOM diffing	✅ Yes	❌ Skipped (subtree reused)
Real DOM update	✅ Only if diff finds	❌ Skipped

🚀 The True Goal of React Optimization
React optimization is not about preventing renders blindly.
It’s about:

🧠 Reducing the work React does to generate & compare virtual DOM
🧱 And finally minimizing changes to the real DOM, which is the most expensive.

So:

React.memo = Skip re-render + reuse virtual DOM

useCallback = Prevent re-renders of children due to changing function reference

Shallow comparison = Detect whether props actually changed

key = Help React map old VDOM to new efficiently