import {
  type CSSVarFunction,
  type MapLeafNodes,
  tokens,
  vars,
} from '@block65/react-design-system/vanilla-extract';
import {
  createGlobalTheme,
  createTheme,
  globalStyle,
} from '@vanilla-extract/css';
import defaults from 'defaults';

globalStyle('html', {
  height: '100%',
  overflowY: 'scroll',
  fontFamily: 'Inter, sans-serif',
  fontOpticalSizing: 'auto',
  fontStyle: 'normal',
  fontVariationSettings: '"slnt" 0',
});

globalStyle('body', {
  width: '100vw',
  maxWidth: '100%',
  height: '100%',
});

const darkThemeBaseColorTokens = {
  ...tokens.base.color,
  brand: '#f200a1',
  accent: vars.base.color.brand,
  bgColor: '#151515',
  fgColor: '#f0f0f0',
  borderColor: '#666',
  muted: {
    ...tokens.base.color.muted,
    borderColor: '#333',
  },
} satisfies MapLeafNodes<typeof vars.base.color, CSSVarFunction | string>;

createGlobalTheme(
  'html',
  vars,
  defaults(
    {
      base: {
        color: darkThemeBaseColorTokens,
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
            textDecoration: 'underline',
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

globalStyle(`::selection`, {
  backgroundColor: vars.base.color.brand,
  color: 'white',
});

export const darkModeThemeClassName = createTheme(
  vars.base.color,
  darkThemeBaseColorTokens,
);

export const lightModeThemeClassName = createTheme(vars.base.color, {
  ...tokens.base.color,
  brand: '#cc0088',
  accent: vars.base.color.brand,
  bgColor: '#f0f0f0',
  fgColor: '#151515',
  borderColor: '#999',
  muted: {
    ...tokens.base.color.muted,
    fgColor: '#676d73',
    borderColor: '#ccc',
  },
});
