import Head from 'next/head';
import { useCallback, useState } from 'react';
import { classCat } from '@block65/classcat';
import styles from './index.module.scss';

function createObject<T>(obj: T): T {
  return Object.assign(Object.create(null), obj);
}

export function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function fromBase64Url(value: string): string {
  return atob(value.replace(/-/g, '+').replace(/_/g, '/'));
}

type Jwt = { header?: string; payload?: string; signature?: string };

function decode(encoded: string): string {
  return decodeURIComponent(
    fromBase64Url(encoded).replace(/(.)/g, (m, p) => {
      return `%${p.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`;
    }),
  );
}

function encodeObject(obj: Jwt): string {
  return [
    obj.header && toBase64Url(obj.header),
    obj.payload && toBase64Url(obj.payload),
    obj.signature,
  ]
    .filter(Boolean)
    .join('.');
}

function parseJwt(jwt: string): Jwt | null {
  try {
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
  } catch (err) {
    console.warn(err.message);
    return {};
  }
}

function tryNormalise(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value));
  } catch (err) {
    return value;
  }
}

export default function Home() {
  const [jwt, setJwt] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  );
  const [payload, setPayload] = useState<string | null>(null);
  const [header, setHeader] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const decodeAndSetJwt = useCallback((value: string) => {
    const decodedJwt = parseJwt(value);
    setHeader(decodedJwt.header || null);
    setPayload(decodedJwt.payload || null);
    setSignature(decodedJwt.signature || null);
    setJwt(value);
  }, []);

  const setHeaderAndEncode = useCallback(
    (value: string) => {
      const normalized = tryNormalise(value);
      setHeader(normalized);
      setJwt(encodeObject({ header: normalized, payload, signature }));
    },
    [payload, signature],
  );

  const setPayloadAndEncode = useCallback(
    (value: string) => {
      const normalized = tryNormalise(value);
      setPayload(normalized);
      setJwt(encodeObject({ header, payload: normalized, signature }));
    },
    [header, signature],
  );

  const setSignatureAndEncode = useCallback(
    (value: string) => {
      setSignature(value);
      setJwt(encodeObject({ header, payload, signature: value }));
    },
    [header, payload],
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>JWT.one - Online JSON Web Token Encoder / Decoder</title>
        <meta
          name="description"
          content="Fast Online JWT encoder and decoder for JSON Web Tokens"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          <a href="https://jwt.one">jwt.one</a>
        </h2>

        <p className={styles.description}>
          Super fast online JWT encoder and decoder
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <label htmlFor="jwt">
              <h3>JWT</h3>
            </label>
            <textarea
              id="jwt"
              autoFocus
              spellCheck={false}
              className={styles.input}
              value={jwt}
              onChange={(e) => decodeAndSetJwt(e.currentTarget.value.trim())}
            />
          </div>

          <div className={styles.card}>
            <label htmlFor="header">
              <h3>Header</h3>
            </label>
            <textarea
              id="header"
              spellCheck={false}
              className={classCat(styles.output, styles.header)}
              value={header || ''}
              onChange={(e) => setHeaderAndEncode(e.currentTarget.value.trim())}
            />
          </div>
          <div className={styles.card}>
            <label htmlFor="payload">
              <h3>Payload</h3>
            </label>
            <textarea
              id="payload"
              spellCheck={false}
              className={classCat(styles.output, styles.payload)}
              value={payload || ''}
              onChange={(e) =>
                setPayloadAndEncode(e.currentTarget.value.trim())
              }
            />
          </div>
          <div className={styles.card}>
            <label htmlFor="signature">
              <h3>Signature</h3>
            </label>
            <textarea
              id="signature"
              spellCheck={false}
              className={classCat(styles.output, styles.footer)}
              value={signature || ''}
              onChange={(e) =>
                setSignatureAndEncode(e.currentTarget.value.trim())
              }
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
