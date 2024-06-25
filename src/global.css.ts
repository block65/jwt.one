import { tokens, vars } from '@block65/react-design-system/vanilla-extract';
import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';
import defaults from 'defaults';

const globalSelector = ':root';

createGlobalTheme(
  globalSelector,
  vars,
  defaults(
    {
      base: {
        color: {
          brand: '#cc0088',
          accent: '#cc0088',
          bgColor: '#151515',
        },
      },
      text: {
        size: {
          '5': {
            fontSize: '3rem',
          },
        },
      },
      textlink: {
        normal: {
          fontWeight: tokens.text.fontWeight.medium,
          rest: {
            fgColor: tokens.base.color.brand,
          },
        },
      },
      purpose: {
        attention: {
          fgColor: vars.base.color.brand,
          borderColor: vars.base.color.brand,
          bgColor: 'transparent',
        },
      },
    },
    tokens,
  ),
);

globalStyle(globalSelector, {
  fontFamily: 'Inter, sans-serif',
  fontOpticalSizing: 'auto',
  fontStyle: 'normal',
  fontVariationSettings: '"slnt" 0',
});

globalStyle(`::selection`, {
  backgroundColor: vars.base.color.brand,
  color: 'white',
});
