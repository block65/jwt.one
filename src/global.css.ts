import { vars, tokens } from '@block65/react-design-system/vanilla-extract';
import { createGlobalTheme } from '@vanilla-extract/css';

const selector = ':root';

createGlobalTheme(selector, vars, {
  ...tokens,
  textlink: {
    ...tokens.textlink,
    normal: {
      ...tokens.textlink.normal,
      fontWeight: tokens.text.fontWeight.medium,
    },
  },
});
