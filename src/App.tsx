import {
  Badge,
  Block,
  DesignSystem,
  Heading,
  Inline,
  Panel,
  Paragraph,
  TextLink,
} from '@block65/react-design-system';
import {
  useColorSchemeEffect,
  useLocalStorageState,
} from '@block65/react-design-system/hooks';
import { clsx } from 'clsx';
import {
  type FC,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import styles from './app.module.scss';
import { AutoResizeTextArea } from '../lib/AutoResizeTextArea.js';
import { parseJwt, tryNormalise, encodeObject } from './common.js';

export const App: FC = () => {
  useColorSchemeEffect();

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
      setJwt(value);
    },
    [setJwt],
  );

  const [, startTransition] = useTransition();
  const decodeAndSetJwt: typeof realDecodeAndSetJwt = useCallback(
    (...args) => {
      startTransition(() => {
        realDecodeAndSetJwt(...args);
      });
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
    <DesignSystem>
      <Block className={styles.wrapper} padding="2">
        <Block component="main" className={styles.main}>
          <Block marginBlock="11" textAlign="center">
            <Heading level="1" className={styles.title}>
              jwt.one
            </Heading>
            <Paragraph secondary>
              Simple JWT encoder / decoder. Optimized for load speed
            </Paragraph>
          </Block>

          <Panel className={styles.card}>
            <label htmlFor="jwt">
              <Heading>JWT</Heading>
            </label>
            <AutoResizeTextArea
              autoFocus
              spellCheck={false}
              className={clsx(styles.input, styles.jwt)}
              value={jwt}
              placeholder="Empty"
              onChange={(e) => decodeAndSetJwt(e.currentTarget.value.trim())}
            />
          </Panel>

          <Block className={styles.card}>
            <label htmlFor="header">
              <Inline>
                <Heading>Header</Heading>
                {header === null && (
                  <Badge variant="attention">Unparseable</Badge>
                )}
              </Inline>
            </label>
            <AutoResizeTextArea
              spellCheck={false}
              className={clsx(styles.input, styles.header)}
              value={header || ''}
              placeholder="Empty"
              onChange={(e) => setHeaderAndEncode(e.currentTarget.value)}
            />
          </Block>
          <Block className={styles.card}>
            <label htmlFor="payload">
              <Inline>
                <Heading>Payload</Heading>
                {payload === null && (
                  <Badge variant="attention">Unparseable</Badge>
                )}
              </Inline>
            </label>
            <AutoResizeTextArea
              spellCheck={false}
              className={clsx(styles.input, styles.payload)}
              value={payload || ''}
              placeholder="Empty"
              onChange={(e) => setPayloadAndEncode(e.currentTarget.value)}
            />
          </Block>
          <Block className={styles.card}>
            <label htmlFor="signature">
              <Inline>
                <Heading>Signature</Heading>
                {signature === null && (
                  <Badge variant="attention">Unparseable</Badge>
                )}
              </Inline>
            </label>
            <AutoResizeTextArea
              spellCheck={false}
              className={clsx(styles.input, styles.signature)}
              value={signature || ''}
              placeholder="Empty"
              onChange={(e) => setSignatureAndEncode(e.currentTarget.value)}
            />
          </Block>
        </Block>
        <Block component="footer" className={styles.footer}>
          <Paragraph secondary>
            Made possible by our lovely friends at{' '}
            <TextLink
              weight="weak"
              href="https://www.colacube.io?utm_source=jwt.one"
            >
              Colacube
            </TextLink>
          </Paragraph>
        </Block>
      </Block>
    </DesignSystem>
  );
};
