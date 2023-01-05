// ambient type for modules in *.module.scss
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
