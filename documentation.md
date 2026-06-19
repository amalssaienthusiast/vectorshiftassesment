# VectorShift Frontend Technical Assessment

A visual node-based pipeline builder built with **React + React Flow** (frontend) and **Python + FastAPI** (backend). Users drag nodes onto a canvas, connect them with edges, and submit the pipeline for DAG validation.

---

## Quick Start

```bash
# Frontend
cd frontend
npm i
npm start        # http://localhost:3000

# Backend (separate terminal)
cd backend
uvicorn main:app --reload   # http://localhost:8000
```

---

## Part 1 — Node Abstraction

### Problem

The original 4 node components (Input, Output, LLM, Text) had heavily duplicated code — same wrapper structure, same Handle rendering, same field patterns. Adding a new node meant copying an entire file, which doesn't scale.

### Solution: BaseNode Component

Created `BaseNode.js` — a single reusable component that accepts a declarative configuration object:

```js
<BaseNode
  id={id}
  data={data}
  title="Input"
  icon="📥"
  fields={[
    { key: 'inputName', label: 'Name', type: 'text', default: 'input_1' },
    { key: 'inputType', label: 'Type', type: 'select', options: [...] },
  ]}
  handles={[
    { type: 'source', position: 'right', id: 'value' },
  ]}
/>
```

**BaseNode handles:**
- Renders the node wrapper (header with icon/title + body)
- Renders form fields (text inputs and select dropdowns) from the `fields` config
- Renders React Flow `Handle` components from the `handles` config with configurable positions and offsets
- Syncs all field changes to the Zustand store via `updateNodeField`
- Accepts `children` for nodes needing custom body content (LLM's static text, Text's textarea)

### Refactored Original Nodes

| Node | Before | After | Change |
|------|--------|-------|--------|
| InputNode | 48 lines, local useState | 31 lines, config only | State syncs to store |
| OutputNode | 48 lines, local useState | 31 lines, config only | Fixed value/label mismatch |
| LLMNode | 35 lines | 16 lines, uses `children` | Uses BaseNode wrapper |
| TextNode | 36 lines, basic input | 108 lines | Auto-resize + dynamic handles |

### 5 New Nodes

| Node | Purpose | Handles | Fields |
|------|---------|---------|--------|
| **API** | HTTP request config | 1 target (body), 1 source (response) | URL, Method (GET/POST/PUT/DELETE) |
| **Math** | Arithmetic operations | 2 targets (A, B), 1 source (result) | Operation (+, −, ×, ÷) |
| **Condition** | If/else branching | 1 target, 2 sources (true/false) | Value, Operator (==, !=, >, <, contains) |
| **Filter** | Data filtering | 1 target, 1 source | Field, Match (contains, startsWith, endsWith, regex) |
| **Merge** | Combine two inputs | 2 targets, 1 source | Strategy (concat, zip, interleave) |

---

## Part 2 — Styling

Built a complete dark-themed design system in `index.css` using CSS custom properties:

- **Glassmorphic node cards** — semi-transparent backgrounds with `backdrop-filter: blur(16px)` and subtle border glow on hover
- **Grouped toolbar** — sections (I/O, Processing, Logic) with hover lift effects
- **Gradient submit button** — indigo-to-purple gradient with shadow glow
- **Styled React Flow overrides** — handles, controls, minimap, edges, connection lines
- **Toast notifications** — slide-in/fade-out animations for success, warning, and error states
- **Inter font** via Google Fonts with proper weight hierarchy
- **Custom select dropdowns** — native `appearance: none` with SVG chevron

All colors, radii, shadows, and transitions are tokenized as CSS custom properties — changing the entire theme requires editing only the `:root` block.

---

## Part 3 — Text Node Logic

### Auto-Resize

The text input uses a `<textarea>` for multi-line support. On every keystroke:

- **Height**: Resets to `auto`, then sets to `scrollHeight` — grows/shrinks with content
- **Width**: Measures the longest line using a hidden `<span>` with identical font properties, reads `offsetWidth`, then removes it. Clamped between 200–400px
- Applies dimensions to the parent `.base-node` wrapper

### Dynamic Variable Handles

When a user types `{{ variableName }}`:

- `useMemo` runs `text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)` to extract unique variable names
- For each variable, a target `Handle` appears on the left side
- Handles are evenly spaced: `top: ((index + 1) / (totalVariables + 1)) * 100%`
- Each handle displays its variable name as a CSS `::after` label
- `useUpdateNodeInternals()` re-registers connection points when handles change
- Removing a variable from the text removes its handle

**Example:** typing `"Send {{ query }} to {{ model }}"` creates two handles labeled `query` and `model` on the left side.

---

## Part 4 — Backend Integration

### Frontend (submit.js)

- Reads `nodes` and `edges` from the Zustand store
- Sends `POST /pipelines/parse` with `{ nodes, edges }` as JSON
- Error handling: empty pipeline, backend unreachable, server errors
- Displays results via `alert()` and styled toast notification

### Backend (main.py)

- `POST /pipelines/parse` accepts a Pydantic model: `{ nodes: List[Dict], edges: List[Dict] }`
- DAG detection via **Kahn's algorithm** (topological sort with BFS)
- CORS middleware for `localhost:3000`
- Returns `{ num_nodes: int, num_edges: int, is_dag: bool }`

### End-to-End Flow

1. User creates a pipeline on the canvas
2. Clicks "Submit Pipeline"
3. Alert displays: `Nodes: 4 | Edges: 3 | Valid DAG: Yes`
4. Cyclic pipelines show `Valid DAG: No`

---

## Bugs Found & Fixed in Original Code

| Bug | File | Fix |
|-----|------|-----|
| `nodeIDs` not initialized in store | store.js | Added `nodeIDs: {}` to initial state |
| Node state never synced to store (local useState) | All nodes | BaseNode calls `updateNodeField` on every change |
| `width: '100wv'` — invalid CSS unit | ui.js | Replaced with `flex: 1` CSS class |
| `GET` endpoint with `Form(...)` | main.py | Changed to `POST` with Pydantic JSON body |
| Output node `value="File"` / label "Image" mismatch | outputNode.js | Both now say `Image` |
| `zustand` imported but not in package.json | package.json | Added as dependency |
| Zustand v5 API break (`shallow` parameter removed) | ui.js, submit.js | Migrated to `useShallow()` |
| Global regex `/g` with stale `lastIndex` | textNode.js | Replaced with `text.matchAll()` |
| `scrollWidth` not measuring actual text width | textNode.js | Hidden span measurement |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 18.2.0 |
| Node Graph Canvas | React Flow | 11.8.3 |
| State Management | Zustand | 5.0.14 |
| Build Tool | Create React App | 5.0.1 |
| Backend | FastAPI (Python) | — |
| Styling | Vanilla CSS (custom properties) | — |
| Font | Inter (Google Fonts) | — |

---

## File Structure

```
frontend_technical_assessment/
├── .gitignore
├── documentation.md
├── backend/
│   └── main.py
└── frontend/
    ├── package.json
    ├── README.md
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css              ← Design system
        ├── App.js
        ├── store.js               ← Zustand global state
        ├── ui.js                  ← React Flow canvas + drag-drop
        ├── toolbar.js             ← Node palette (9 types, 3 groups)
        ├── draggableNode.js       ← Drag source component
        ├── submit.js              ← POST + alert + toast
        └── nodes/
            ├── BaseNode.js        ← Core abstraction
            ├── inputNode.js
            ├── outputNode.js
            ├── llmNode.js
            ├── textNode.js        ← Auto-resize + dynamic handles
            ├── apiNode.js
            ├── mathNode.js
            ├── conditionNode.js
            ├── filterNode.js
            └── mergeNode.js
```
