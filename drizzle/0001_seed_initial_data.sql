INSERT OR IGNORE INTO `posts` (`id`, `slug`, `title`, `excerpt`, `content`, `raw_content`, `published`, `published_at`, `created_at`, `updated_at`)
VALUES (
  1,
  'manifesto',
  'Manifesto: The Death of the Grid',
  'On the necessity of abandoning the twelve columns and embracing the solitude of the craft.',
  'We have been held captive by the tyranny of the twelve-column grid for far too long. The moment has arrived to liberate ourselves. The web is not a magazine spread; it is a fluid medium, ever-shifting, ever-adapting.

When we design with rigid columns, we disregard the intrinsic rhythm of the content. We perceive boxes rather than words. We observe alignment rather than meaning.

The future belongs not to grids, but to relationships. The relationship between text and margin. The relationship between reader and white space.

---

## The Old Ways Must Perish

To design is to exclude. It is the art of determining what does not belong.

When we open our process to the committee, we dilute the vision. We smooth the sharp edges that render the work dangerous.

Stand firm in your convictions. The pixels are yours to command.

### What We Abandon

We reject the following:

- ~~Twelve-column layouts~~ — a vestige of print thinking
- ~~Hamburger menus~~ — indolence masquerading as convention
- ~~Infinite scroll~~ — the adversary of intentional reading
- ~~Dark patterns~~ — manipulation has no place here

### What We Embrace

1. **Intentional whitespace** — permit the content to breathe
2. **Typography as interface** — the word itself is the design
3. **Progressive disclosure** — reveal complexity with deliberation
4. **Semantic structure** — meaning over ornamentation

---

## The Principles

> Design is not merely what it looks like and feels like. Design is how it works.
>
> — Steve Jobs

We hold these truths to be self-evident:

| Principle | The Old Way | The New Way |
|-----------|-------------|-------------|
| Layout | Fixed grid | Fluid relationships |
| Typography | Decoration | Structure |
| Colour | Branding | Meaning |
| Motion | Spectacle | Purpose |
| Space | Filler | Intention |

### The Hierarchy of Needs

Every design decision follows this order:

1. **Legibility** — can it be read?
2. **Clarity** — can it be understood?
3. **Elegance** — does it feel inevitable?
4. **Delight** — does it spark joy?

One must never sacrifice the former for the latter.

---

## Technical Foundations

The instruments of our craft:

### The Typographic Scale

We employ a **perfect fourth** (1.333) ratio:

```css
--s-xs: 0.75rem;    /* 12px */
--s-sm: 1rem;       /* 16px */
--s-md: 1.333rem;   /* 21px */
--s-lg: 1.778rem;   /* 28px */
--s-xl: 2.369rem;   /* 38px */
```

### On Colour

Colour is not decoration. It is *information*.

- Employ `var(--c-fg)` for primary content
- Employ `var(--c-acc-subtle)` for secondary information
- Employ `var(--c-acc-1)` sparingly, for emphasis alone

### Keyboard Shortcuts

Respect the accomplished user. Common patterns:

| Action | Shortcut |
|--------|----------|
| Save | <kbd>Cmd</kbd> + <kbd>S</kbd> |
| Preview | <kbd>Cmd</kbd> + <kbd>P</kbd> |
| Publish | <kbd>Cmd</kbd> + <kbd>Enter</kbd> |

## The Manifesto

We, the designers of the margins, declare:

1. **Content is sacrosanct.** Every pixel exists in service of the word.
2. **Simplicity is not simple.** It is the consequence of relentless refinement.
3. **Constraints liberate.** Freedom within limits engenders creativity.
4. **Details matter.** The invisible labour is what distinguishes craft from commodity.
5. **Time is design.** ~~Haste~~ is not a virtue. *Considered* is.

### A Note on Process

The process matters as much as the outcome:

```typescript
function design(problem: Problem): Solution {
  const constraints = understand(problem);
  const possibilities = explore(constraints);
  const solution = refine(possibilities);

  return solution;
}
```

This is not a linear process. It is a **spiral** — we return to understanding with each iteration, each time more profoundly than before.

---

## Concluding Thoughts

The grid is dead. Long live the *relationship*.

What we construct is not websites. It is **spaces for contemplation**. Every margin, every line-height, every carefully chosen word — they conspire to create a moment of lucidity amidst the noise of the world.

This is our craft. This is our responsibility.

> In the beginner''s mind there are many possibilities, but in the expert''s mind there are few.
>
> — Shunryu Suzuki

Remain curious. Remain critical. Remain *marginal*.',
  'We have been held captive by the tyranny of the ||twelve-column grid||(A vestige of Bootstrap-era thinking. We define our own constraints henceforth.) for far too long. The moment has arrived to liberate ourselves. The web is not a magazine spread; it is a ||fluid medium||(As water assumes the shape of its vessel, so too should content adapt without losing its essence.), ever-shifting, ever-adapting.

When we design with rigid columns, we disregard the ||intrinsic rhythm||(Every piece of content possesses a natural cadence. One must learn to respect it.) of the content. We perceive boxes rather than words. We observe alignment rather than meaning.

The future belongs not to grids, but to relationships. The relationship between text and margin. The relationship between reader and white space.

---

## The Old Ways Must Perish

To design is to exclude. It is the art of determining what ||does not belong||(The greater part of things do not belong. Noise is the default state of the universe; signal is the exception.).

When we open our process to the committee, we dilute the vision. We smooth the sharp edges that render the work ||dangerous||(Safe design is forgettable design. If it fails to provoke a response, it has failed entirely.).

Stand firm in your convictions. The pixels are yours to command.

### What We Abandon

We reject the following:

- ~~Twelve-column layouts~~ — a vestige of print thinking
- ~~Hamburger menus~~ — indolence masquerading as convention
- ~~Infinite scroll~~ — the adversary of intentional reading
- ~~Dark patterns~~ — manipulation has no place here

### What We Embrace

1. **Intentional whitespace** — permit the content to breathe
2. **Typography as interface** — the word itself is the design
3. **Progressive disclosure** — reveal complexity with deliberation
4. **Semantic structure** — meaning over ornamentation

---

## The Principles

> Design is not merely what it looks like and feels like. Design is how it works.
>
> — Steve Jobs

We hold these truths to be self-evident:

| Principle | The Old Way | The New Way |
|-----------|-------------|-------------|
| Layout | Fixed grid | Fluid relationships |
| Typography | Decoration | Structure |
| Colour | Branding | Meaning |
| Motion | Spectacle | Purpose |
| Space | Filler | Intention |

### The Hierarchy of Needs

Every design decision follows this order:

1. **Legibility** — can it be read?
2. **Clarity** — can it be understood?
3. **Elegance** — does it feel inevitable?
4. **Delight** — does it spark joy?

One must never sacrifice the former for the latter.

---

## Technical Foundations

The instruments of our craft:

### The Typographic Scale

We employ a **perfect fourth** (1.333) ratio:

```css
--s-xs: 0.75rem;    /* 12px */
--s-sm: 1rem;       /* 16px */
--s-md: 1.333rem;   /* 21px */
--s-lg: 1.778rem;   /* 28px */
--s-xl: 2.369rem;   /* 38px */
```

### On Colour

Colour is not decoration. It is *information*.

- Employ `var(--c-fg)` for primary content
- Employ `var(--c-acc-subtle)` for secondary information
- Employ `var(--c-acc-1)` sparingly, for ||emphasis alone||(The accent colour is akin to a spice. An excess spoils the dish.)

### Keyboard Shortcuts

Respect the accomplished user. Common patterns:

| Action | Shortcut |
|--------|----------|
| Save | <kbd>Cmd</kbd> + <kbd>S</kbd> |
| Preview | <kbd>Cmd</kbd> + <kbd>P</kbd> |
| Publish | <kbd>Cmd</kbd> + <kbd>Enter</kbd> |

## The Manifesto

We, the designers of the margins, declare:

1. **Content is sacrosanct.** Every pixel exists in service of the word.
2. **Simplicity is not simple.** It is the consequence of ||relentless refinement||(Perfection is attained not when there is nothing more to add, but when there is nothing left to take away. — Antoine de Saint-Exupéry).
3. **Constraints liberate.** Freedom within limits engenders creativity.
4. **Details matter.** The invisible labour is what distinguishes craft from commodity.
5. **Time is design.** ~~Haste~~ is not a virtue. *Considered* is.

### A Note on Process

The process matters as much as the outcome:

```typescript
function design(problem: Problem): Solution {
  const constraints = understand(problem);
  const possibilities = explore(constraints);
  const solution = refine(possibilities);

  return solution;
}
```

This is not a linear process. It is a **spiral** — we return to understanding with each iteration, each time more profoundly than before.

---

## Concluding Thoughts

The grid is dead. Long live the *relationship*.

What we construct is not websites. It is **spaces for contemplation**. Every margin, every line-height, every carefully chosen word — they conspire to create a moment of lucidity amidst the noise of the world.

This is our craft. This is our ||responsibility||(With great power comes great responsibility. We shape how people read, think, and perceive.).

> In the beginner''s mind there are many possibilities, but in the expert''s mind there are few.
>
> — Shunryu Suzuki

Remain curious. Remain critical. Remain *marginal*.',
  1,
  1766620800,
  1766620800,
  1766620800
);
--> statement-breakpoint
INSERT OR IGNORE INTO `marginalia` (`id`, `post_id`, `content`, `context`, `created_at`) VALUES
(1, 1, 'A vestige of Bootstrap-era thinking. We define our own constraints henceforth.', 'twelve-column grid', 1766620800),
(2, 1, 'As water assumes the shape of its vessel, so too should content adapt without losing its essence.', 'fluid medium', 1766620800),
(3, 1, 'Every piece of content possesses a natural cadence. One must learn to respect it.', 'intrinsic rhythm', 1766620800),
(4, 1, 'The greater part of things do not belong. Noise is the default state of the universe; signal is the exception.', 'does not belong', 1766620800),
(5, 1, 'Safe design is forgettable design. If it fails to provoke a response, it has failed entirely.', 'dangerous', 1766620800),
(6, 1, 'The accent colour is akin to a spice. An excess spoils the dish.', 'emphasis alone', 1766620800),
(7, 1, 'Perfection is attained not when there is nothing more to add, but when there is nothing left to take away. — Antoine de Saint-Exupéry', 'relentless refinement', 1766620800),
(8, 1, 'With great power comes great responsibility. We shape how people read, think, and perceive.', 'responsibility', 1766620800);
--> statement-breakpoint
INSERT OR IGNORE INTO `settings` (`key`, `value`) VALUES
('siteTitle', 'Marginalia'),
('siteDescription', 'Notes in the margins.'),
('siteKeywords', 'blog, writing, marginalia');
