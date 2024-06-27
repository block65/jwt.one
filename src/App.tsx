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
import { type FC, useCallback, useState } from 'react';
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
import {
  encodeObject,
  type Jwt,
  parseJwt,
  tryNormal,
  tryPretty,
} from './common.js';
import {
  darkModeThemeClassName,
  lightModeThemeClassName,
} from './global.css.js';

function useStatePartial<T>(initialState: T | (() => T)) {
  const [state, setState] = useState(initialState);
  const setPartialState = useCallback(
    (partialState: Partial<T> | ((previous: T) => T)) => {
      setState((s) =>
        typeof partialState === 'function'
          ? partialState(s)
          : { ...s, ...partialState },
      );
    },
    [setState],
  );
  return [state, setPartialState] as const;
}

export const App: FC = () => {
  const [wantsDarkMode] = useColorSchemeEffect();

  const [jwt, setJwt] = useLocalStorageState<string>(
    'jwt',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  );

  const [state, setState] = useStatePartial<Jwt>(() => {
    const decoded = parseJwt(jwt);

    return {
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature,
    };
  });

  const [prettyState, setPrettyState] = useStatePartial(() => ({
    header: tryPretty(state.header),
    payload: tryPretty(state.payload),
  }));

  const decodeAndSetJwt = useCallback(
    (newJwt: string) => {
      try {
        const decodedJwt = parseJwt(newJwt);
        setState({
          header: decodedJwt.header || null,
          payload: decodedJwt.payload || null,
          signature: decodedJwt.signature || null,
        });
        setPrettyState({
          header: decodedJwt ? tryPretty(decodedJwt?.header) : '',
          payload: decodedJwt ? tryPretty(decodedJwt?.payload) : '',
        });

        setJwt(newJwt.replaceAll(/\n|\s/g, ''));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    },
    [setJwt, setPrettyState, setState],
  );

  const setHeaderAndEncode = useCallback(
    (header: string) => {
      const nextHeader = tryNormal(header);

      setState({
        header: nextHeader,
      });
      setJwt(
        encodeObject({
          header: nextHeader,
          payload: state.payload,
          signature: state.signature,
        }),
      );
      setPrettyState({
        header: tryPretty(nextHeader),
      });
    },
    [setJwt, setPrettyState, setState, state.payload, state.signature],
  );

  const setPayloadAndEncode = useCallback(
    (payload: string) => {
      const nextPayload = tryNormal(payload);

      setJwt(
        encodeObject({
          header: state.header,
          payload: nextPayload,
          signature: state.signature,
        }),
      );
      setState({
        payload: nextPayload,
      });
      setPrettyState({
        payload: tryPretty(nextPayload),
      });
    },
    [setJwt, setPrettyState, setState, state.header, state.signature],
  );

  const setSignatureAndEncode = useCallback(
    (signature: string) => {
      setState({ signature });
      setJwt(
        encodeObject({
          header: state.header,
          payload: state.payload,
          signature,
        }),
      );
    },
    [setJwt, setState, state.header, state.payload],
  );

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

              {prettyState.header === null && (
                <Badge variant="attention">Unparseable</Badge>
              )}
            </Inline>
            <AutoResizeTextArea
              id="header"
              spellCheck={false}
              className={[inputClassName, breakyWordyClassName]}
              placeholder="Empty"
              value={prettyState.header || ''}
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

              {prettyState.payload === null && (
                <Badge variant="attention">Unparseable</Badge>
              )}
            </Inline>
            <AutoResizeTextArea
              id="payload"
              spellCheck={false}
              className={[inputClassName, breakyWordyClassName]}
              placeholder="Empty"
              value={prettyState.payload || ''}
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
            </Inline>
            <AutoResizeTextArea
              id="signature"
              spellCheck={false}
              value={state.signature || ''}
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
