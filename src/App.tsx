import {
  Badge,
  Block,
  DesignSystem,
  Heading,
  Inline,
  Paragraph,
  TextLink,
} from '@block65/react-design-system';
import {
  useColorSchemeEffect,
  useLocalStorageState,
} from '@block65/react-design-system/hooks';
import {
  type FC,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { AutoResizeTextArea } from '../lib/AutoResizeTextArea.js';
import {
  breakyWordyClassName,
  cardClassName,
  footerClassName,
  inputClassName,
  labelClassName,
  mainClassName,
  titleClassName,
  wrapperClassName,
} from './app.css.js';
import { encodeObject, parseJwt, tryNormalise } from './common.js';
import {
  darkModeThemeClassName,
  lightModeThemeClassName,
} from './global.css.js';

export const App: FC = () => {
  const [wantsDarkMode] = useColorSchemeEffect();

  const [jwt, setJwt] = useLocalStorageState<string>(
    'jwt',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  );
  const [payload, setPayload] = useState<string | null>('');
  const [header, setHeader] = useState<string | null>('');
  const [signature, setSignature] = useState<string | null>('');

  const realDecodeAndSetJwt = useCallback(
    (value: string) => {
      try {
        const decodedJwt = parseJwt(value);
        setHeader(tryNormalise(decodedJwt?.header));
        setPayload(tryNormalise(decodedJwt?.payload));
        setSignature(tryNormalise(decodedJwt?.signature));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
      setJwt(value.replaceAll(/\n|\s/g, ''));
    },
    [setJwt],
  );

  const decodeAndSetJwt: typeof realDecodeAndSetJwt = useCallback(
    (...args) => {
      realDecodeAndSetJwt(...args);
    },
    [realDecodeAndSetJwt],
  );

  const setHeaderAndEncode = useCallback(
    (value: string) => {
      const normalized = tryNormalise(value);
      setHeader(normalized);
      setJwt(encodeObject({ header: normalized, payload, signature }));
    },
    [payload, setJwt, signature],
  );

  const setPayloadAndEncode = useCallback(
    (value: string) => {
      const normalized = tryNormalise(value);
      setPayload(normalized);
      setJwt(encodeObject({ header, payload: normalized, signature }));
    },
    [header, setJwt, signature],
  );

  const setSignatureAndEncode = useCallback(
    (value: string) => {
      setSignature(value);
      setJwt(encodeObject({ header, payload, signature: value }));
    },
    [header, payload, setJwt],
  );

  // bootstrap
  useEffect(() => {
    decodeAndSetJwt(jwt);
  }, [decodeAndSetJwt, jwt]);

  return (
    <DesignSystem
      className={
        wantsDarkMode ? darkModeThemeClassName : lightModeThemeClassName
      }
    >
      <Block className={wrapperClassName} padding="2">
        <Block component="main" className={mainClassName}>
          <Block marginBlock="11" textAlign="center">
            <Heading level="1" className={titleClassName}>
              jwt.one
            </Heading>
            <Paragraph secondary textWrap="pretty">
              Simple JWT encoder / decoder. Optimized for load speed
            </Paragraph>
          </Block>

          <Block className={cardClassName}>
            <Inline component="label" htmlFor="jwt" className={labelClassName}>
              <Heading level="2" fontSize="2" fontWeight="medium">
                JWT
              </Heading>
            </Inline>

            <AutoResizeTextArea
              id="jwt"
              autoFocus
              spellCheck={false}
              className={[inputClassName, breakyWordyClassName]}
              placeholder="Empty"
              value={jwt}
              onChange={(e) => decodeAndSetJwt(e.currentTarget.value)}
            />
          </Block>

          <Block className={cardClassName}>
            <Inline
              component="label"
              htmlFor="header"
              className={labelClassName}
            >
              <Heading level="2" fontSize="2" fontWeight="medium">
                Header
              </Heading>

              {header === null && (
                <Badge variant="attention">Unparseable</Badge>
              )}
            </Inline>
            <AutoResizeTextArea
              id="header"
              spellCheck={false}
              className={[inputClassName, breakyWordyClassName]}
              placeholder="Empty"
              value={header || ''}
              onChange={(e) => setHeaderAndEncode(e.currentTarget.value)}
            />
          </Block>
          <Block className={cardClassName}>
            <Inline
              component="label"
              htmlFor="payload"
              className={labelClassName}
            >
              <Heading level="2" fontSize="2" fontWeight="medium">
                Payload
              </Heading>

              {payload === null && (
                <Badge variant="attention">Unparseable</Badge>
              )}
            </Inline>
            <AutoResizeTextArea
              id="payload"
              spellCheck={false}
              className={[inputClassName, breakyWordyClassName]}
              placeholder="Empty"
              value={payload || ''}
              onChange={(e) => setPayloadAndEncode(e.currentTarget.value)}
            />
          </Block>

          <Block className={cardClassName}>
            <Inline
              component="label"
              htmlFor="signature"
              className={labelClassName}
            >
              <Heading level="2" fontSize="2" fontWeight="medium">
                Signature
              </Heading>
              {signature === null && (
                <Badge variant="attention">Unparseable</Badge>
              )}
            </Inline>
            <AutoResizeTextArea
              id="signature"
              spellCheck={false}
              value={signature || ''}
              className={[inputClassName, breakyWordyClassName]}
              placeholder="Empty"
              onChange={(e) => setSignatureAndEncode(e.currentTarget.value)}
            />
          </Block>
        </Block>
        <Block component="footer" className={footerClassName}>
          <Paragraph secondary>
            Made possible by our lovely friends at{' '}
            <TextLink href="https://www.colacube.io?utm_source=jwt.one">
              Colacube
            </TextLink>
          </Paragraph>
        </Block>
      </Block>
    </DesignSystem>
  );
};
