import { vars, tokens } from '@block65/react-design-system/vanilla-extract';
import { createGlobalTheme } from '@vanilla-extract/css';

const selector = ':root';

createGlobalTheme(selector, vars, {
  ...tokens,
  textLinks: {
    ...tokens.textLinks,
    normal: {
      ...tokens.textLinks.normal,
      fontWeight: tokens.text.fontWeight.medium,
    },
  },
});
