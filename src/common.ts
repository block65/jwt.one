import {
  decode as decodeBase64Url,
  encode as encodeBase64Url,
} from 'universal-base64url';

type Jwt = {
  header?: string | null;
  payload?: string | null;
  signature?: string | null;
};

function createObject<T>(obj: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.assign(Object.create(null), obj);
}

function tryDecodeJwtPart(value: string): string | null {
  try {
    return decodeBase64Url(value);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('tryDecodeJwtPart', Object(err).message);
    return null;
  }
}

export function encodeObject(obj: Jwt) {
  return [
    obj.header && encodeBase64Url(obj.header),
    obj.payload && encodeBase64Url(obj.payload),
    obj.signature,
  ]
    .filter(Boolean)
    .join('.');
}

export function parseJwt(jwt: string): Jwt | null {
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

export function tryNormalise(value: string | null | undefined): string | null {
  if (!value) {
    return value === null ? null : '';
  }
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (err) {
    return value;
  }
}
