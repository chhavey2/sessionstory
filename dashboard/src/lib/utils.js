export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
      continue;
    }

    if (Array.isArray(input)) {
      classes.push(cn(...input));
      continue;
    }

    if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.filter(Boolean).join(' ');
}

