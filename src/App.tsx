import {
  Badge,
  Block,
  DesignSystem,
  Heading,
  Inline,
  Panel,
  Text,
  TextLink,
} from '@block65/react-design-system';
import { clsx } from 'clsx';
import { FC, useCallback, useEffect, useState, useTransition } from 'react';
import styles from './index.module.scss';
import { useLocalStorageState } from '../gist_modules/maxholman/react-hooks/use-localstorage-state.js';
import { AutoResizeTextArea } from '../lib/AutoResizeTextArea.js';

type Jwt = {
  header?: string | null;
  payload?: string | null;
  signature?: string | null;
};

function createObject<T>(obj: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.assign(Object.create(null), obj);
}

function decodeBase64Url(value: string) {
  return atob(value.replace(/-/g, '+').replace(/_/g, '/'));
}

function encodeBase64Url(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_');
}

function tryDecodeJwtPart(value: string): string | null {
  try {
    return decodeBase64Url(value);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
    return null;
  }
}

function encodeObject(obj: Jwt) {
  return [
    obj.header && encodeBase64Url(obj.header),
    obj.payload && encodeBase64Url(obj.payload),
    obj.signature,
  ]
    .filter(Boolean)
    .join('.');
}

function parseJwt(jwt: string): Jwt | null {
  if (!jwt) {
    return {};
  }

  const [encodedHeader = '', encodedPayload = '', signature = ''] =
    jwt.split('.');

  if (!encodedPayload && !signature) {
    return createObject({
      payload: tryDecodeJwtPart(encodedHeader),
    });
  }

  if (!signature) {
    return createObject({
      header: tryDecodeJwtPart(encodedHeader),
      payload: tryDecodeJwtPart(encodedPayload),
    });
  }

  return createObject({
    header: tryDecodeJwtPart(encodedHeader),
    payload: tryDecodeJwtPart(encodedPayload),
    signature,
  });
}

function tryNormalise(value: string | null | undefined): string | null {
  if (!value) {
    return value === null ? null : '';
  }
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (err) {
    return value;
  }
}

export const App: FC = () => {
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
      <Block className={styles.wrapper} padding="tiny">
        <Block component="main" className={styles.main}>
          <Block marginBlock="huge" textAlign="center">
            <Heading level="2" className={styles.title}>
              jwt.one
            </Heading>
            <Text>JWT encoder and decoder. Optimized for load speed</Text>
          </Block>

          <Panel variant="ghost" className={styles.card}>
            <label htmlFor="jwt">
              <Heading level="3">JWT</Heading>
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
              <Inline space="tiny">
                <Heading level="3">Header</Heading>
                {header === null && <Badge tone="critical">Unparseable</Badge>}
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
              <Inline space="tiny">
                <Heading level="3">Payload</Heading>
                {payload === null && <Badge tone="critical">Unparseable</Badge>}
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
              <Inline space="tiny">
                <Heading level="3">Signature</Heading>
                {signature === null && (
                  <Badge tone="critical">Unparseable</Badge>
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
          <Text>
            Made possible by our lovely friends at{' '}
            <TextLink href="https://www.colacube.io?utm_source=jwt.one">
              Colacube
            </TextLink>
          </Text>
        </Block>
      </Block>
    </DesignSystem>
  );
};
