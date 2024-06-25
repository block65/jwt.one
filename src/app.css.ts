import { vars } from '@block65/react-design-system/vanilla-extract';
import { style } from '@vanilla-extract/css';

export const wrapperClassName = style({
  display: 'grid',
  gridTemplateRows: '1fr auto',
  maxWidth: '50em',
  width: '100%',
  margin: '0 auto',
  position: 'relative',
  minHeight: '100vh',
});

export const mainClassName = style({
  gridArea: '1/1',
});

export const titleClassName = style({
  color: vars.base.color.brand,
});

export const cardClassName = style({
  border: `${vars.formControl.outline.width} solid ${vars.base.color.muted.borderColor}`,
  borderRadius: vars.base.border.radius,
  transition: 'color 0.15s ease, border-color 0.15s ease',
  paddingTop: vars.props.space[8],
  gap: vars.props.space[8],
  selectors: {
    '&:hover, &:focus, &:focus-within, &:active': {
      borderColor: vars.base.color.borderColor,
    },
    '&:nth-child(1)': {
      gridArea: '1/1',
    },
  },
});

export const labelClassName = style({
  display: 'block',
  color: vars.base.color.brand,
  paddingInline: vars.props.space[8],
});

export const inputClassName = style({
  fontSize: '1.25rem',
  fontFamily: 'Roboto Mono, monospace',
  color: vars.base.color.fgColor,
  lineHeight: 1.5,
  border: 'none',
  outline: 'none',
  minHeight: '3em',
  resize: 'vertical',
  paddingInline: vars.props.space[8],
  paddingBottom: vars.props.space[8],
  selectors: {
    '&::placeholder': {
      color: vars.base.color.muted.fgColor,
    },
  },
});

export const breakyWordyClassName = style({
  wordBreak: 'break-all',
});

export const footerClassName = style({
  gridArea: '2/1',
  padding: '1em',
  textAlign: 'center',
});
