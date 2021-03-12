import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { classCat } from '@block65/classcat';
import { encode, decode } from 'universal-base64url';
import favicon16 from '../../public/favicon-16x16.png';
import favicon32 from '../../public/favicon-32x32.png';
import appleTouchIcon from '../../public/apple-touch-icon.png';
import styles from './index.module.scss';
import { AutoResizeTextArea } from '../../lib/AutoResizeTextArea';
import { useLocalStorageState } from '../../lib/use-localstorage-state';

function createObject<T>(obj: T): T {
  return Object.assign(Object.create(null), obj);
}

type Jwt = { header?: string; payload?: string; signature?: string };

function encodeObject(obj: Jwt): string {
  return [
    obj.header && encode(obj.header),
    obj.payload && encode(obj.payload),
    obj.signature,
  ]
    .filter(Boolean)
    .join('.');
}

function parseJwt(jwt: string): Jwt | null {
  if (!jwt) {
    return {};
  }

  const [encodedHeader = '', encodedPayload = '', signature = ''] = jwt.split(
    '.',
  );

  if (!encodedPayload && !signature) {
    return createObject({
      payload: decode(encodedHeader),
    });
  }

  if (!signature) {
    return createObject({
      header: decode(encodedHeader),
      payload: decode(encodedPayload),
    });
  }

  return createObject({
    header: decode(encodedHeader),
    payload: decode(encodedPayload),
    signature,
  });
}

function tryNormalise(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (err) {
    return value;
  }
}

export default function Home() {
  const [jwt, setJwt] = useLocalStorageState(
    'jwt',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  );
  const [payload, setPayload] = useState<string | null>(null);
  const [header, setHeader] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const decodeAndSetJwt = useCallback(
    (value: string) => {
      try {
        const decodedJwt = parseJwt(value);
        setHeader(tryNormalise(decodedJwt.header) || null);
        setPayload(tryNormalise(decodedJwt.payload) || null);
        setSignature(tryNormalise(decodedJwt.signature) || null);
      } catch (err) {
        console.warn(err.message);
      }
      setJwt(value);
    },
    [setJwt],
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
    <div className={styles.container}>
      <Head>
        <title>JWT.one - Online JSON Web Token Encoder / Decoder</title>
        <meta
          name="description"
          content="Fast Online JWT encoder and decoder for JSON Web Tokens"
        />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>jwt.one</h2>

        <p className={styles.description}>
          Super fast online JWT encoder and decoder
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <label htmlFor="jwt">
              <h3>JWT</h3>
            </label>
            <AutoResizeTextArea
              id="jwt"
              autoFocus
              spellCheck={false}
              className={styles.input}
              value={jwt}
              placeholder="Empty"
              onChange={(e) => decodeAndSetJwt(e.currentTarget.value)}
            />
          </div>

          <div className={styles.card}>
            <label htmlFor="header">
              <h3>Header</h3>
            </label>
            <AutoResizeTextArea
              id="header"
              spellCheck={false}
              className={classCat(styles.input, styles.header)}
              value={header || ''}
              placeholder="Empty"
              onChange={(e) => setHeaderAndEncode(e.currentTarget.value)}
            />
          </div>
          <div className={styles.card}>
            <label htmlFor="payload">
              <h3>Payload</h3>
            </label>
            <AutoResizeTextArea
              id="payload"
              spellCheck={false}
              className={classCat(styles.input, styles.payload)}
              value={payload || ''}
              placeholder="Empty"
              onChange={(e) => setPayloadAndEncode(e.currentTarget.value)}
            />
          </div>
          <div className={styles.card}>
            <label htmlFor="signature">
              <h3>Signature</h3>
            </label>
            <AutoResizeTextArea
              id="signature"
              spellCheck={false}
              className={classCat(styles.input, styles.signature)}
              value={signature || ''}
              placeholder="Empty"
              onChange={(e) => setSignatureAndEncode(e.currentTarget.value)}
            />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Made possible by our lovely friends at{' '}
          <a href="https://www.colacube.io?utm_source=jwt.one">Colacube</a>
        </p>
      </footer>
    </div>
  );
}
