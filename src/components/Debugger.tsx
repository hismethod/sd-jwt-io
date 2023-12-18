import { Input, Checkbox, message } from 'antd';
import './Debugger.css';
import CodeMirror from 'codemirror';
import { useEffect, useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import sdjwt from '@hopae/sd-jwt';
import { Warning } from './Warning';
import {
  copyCurrentURLToClipboard,
  stringToUint8Array,
  updateURLWithQuery,
} from '../utils';
import { SelectAlg } from './SelectAlg';

const initialToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6InNkK2p3dCJ9.eyJsYXN0bmFtZSI6IkRvZSIsInNzbiI6IjEyMy00NS02Nzg5IiwiX3NkIjpbIk4yUXhZV1UxTlRnME1qQmpOR1JpWVRCaU1tRmtaamN5WXpSbFpXUmhaRGd5WkRCbE1qaGhZVGcwTnpJMU9XSXpZek5qWkdNNE1qZG1NVGN6TmpZd05RIiwiWlRSalkyUTVOemRoWkRVM05tWTFZV0UyTmpka01XVmpNRE16WXpOak5qQmtNak5pT0dZelpHSTBOelV4TURsak9EWTRNREEzWm1JeFpUY3daREZqTmciXSwiX3NkX2FsZyI6InNoYS0yNTYifQ.mX14Sw86xy8NFQta7tCfNmhVCqzfaJ_K3VEIhTjbLDY~WyJmYjlhZTU3OTMwMDE1NTA4NjY2YTQzODQwNGU1MzA1YiIsImZpcnN0bmFtZSIsIkpvaG4iXQ~WyJiOTYzMDcyNWViZjViYTE4OTc1ZWU4MWY4MWZkNTc3YyIsImlkIiwiMTIzNCJd~';

const JWTCode = ({
  token,
  setToken,
}: {
  token: string;
  setToken: (t: string) => void;
}) => {
  return (
    <ControlledEditor
      value={token}
      options={{
        mode: 'jwt',
        lineWrapping: true,
      }}
      onBeforeChange={(editor, data, value) => {
        updateURLWithQuery(`token=${value}`);
        setToken(value);
        console.log(value);
      }}
    />
  );
};

const JWTHeader = ({
  header,
  setHeader,
}: {
  header: string;
  setHeader: any;
}) => {
  return (
    <ControlledEditor
      value={header}
      options={{
        mode: 'javascript',
        lineWrapping: true,
      }}
      onBeforeChange={(editor, data, value) => {
        console.log(value);
        setHeader(value);
      }}
      className="json-header"
    />
  );
};

const JWTPayload = ({
  payload,
  setPayload,
}: {
  payload: string;
  setPayload: any;
}) => {
  return (
    <ControlledEditor
      value={payload}
      options={{
        mode: 'javascript',
        lineWrapping: true,
      }}
      onBeforeChange={(editor, data, value) => {
        console.log(value);
        setPayload(value);
      }}
      className="json-payload"
    />
  );
};

const JWTDecode = ({
  secret,
  setSecret,
  checked,
  setChecked,
}: {
  secret: any;
  setSecret: any;
  checked: boolean;
  setChecked: any;
}) => {
  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
    setChecked(e.target.checked);
  };
  return (
    <pre
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
        color: 'rgb(0, 185, 241)',
      }}
    >
      <div>{'HMACSHA256('}</div>
      <div>{`base64UrlEncode(header) + "." +`}</div>
      <div>{'base64UrlEncode(payload),'}</div>
      <div>
        <Input
          onChange={(e) => setSecret(e.target.value)}
          value={secret}
          style={{
            width: '200px',
            color: 'rgb(0, 185, 241)',
          }}
        />
      </div>
      <div>
        {')  '}
        <Checkbox
          checked={checked}
          onChange={onChange}
          style={{
            color: 'rgb(0, 185, 241)',
          }}
        >
          {'secret base64 encoded'}
        </Checkbox>
      </div>
    </pre>
  );
};

export const Debugger = () => {
  useEffect(() => {
    if (window.location.hash !== '#debugger') {
      return;
    }
    setTimeout(() => {
      const element = document.getElementById('debugger');
      if (element) {
        const offset = 150; // Number of pixels you want to scroll above the element
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  }, []);

  const [token, setToken] = useState(initialToken);
  const [tab, setTab] = useState<'claim' | 'discloseFrame' | 'discolsures'>(
    'claim'
  );

  const [secret, setSecret] = useState('your-256-bit-secret');
  const [base64Checked, setBase64Checked] = useState(false);

  const [discloseFrame, setDiscloseFrame] = useState(
    JSON.stringify(
      {
        _sd: ['firstname', 'id'],
      },
      null,
      2
    )
  );

  const [claims, setClaims] = useState(
    JSON.stringify(
      {
        firstname: 'John',
        lastname: 'Doe',
        ssn: '123-45-6789',
        id: '1234',
      },
      null,
      2
    )
  );

  const [discolsures, setDiscolsures] = useState(
    JSON.stringify(
      [
        {
          salt: 'fb9ae57930015508666a438404e5305b',
          key: 'firstname',
          value: 'John',
        },
        {
          salt: 'b9630725ebf5ba18975ee81f81fd577c',
          key: 'id',
          value: '1234',
        },
      ],
      null,
      2
    )
  );

  const tabValue = {
    claim: claims,
    discloseFrame: discloseFrame,
    discolsures: discolsures,
  };

  const tabHandler = {
    claim: setClaims,
    discloseFrame: setDiscloseFrame,
    discolsures: setDiscolsures,
  };

  const [header, setHeader] = useState(
    JSON.stringify(
      {
        alg: 'HS256',
        typ: 'sd+jwt',
      },
      null,
      2
    )
  );

  const encode = async () => {
    try {
      const data = JSON.parse(claims);
      const sd_Data = JSON.parse(discloseFrame) as any;
      console.log(data);
      const token = await sdjwt.issue(
        data,
        stringToUint8Array(secret),
        sd_Data,
        {
          sign_alg: 'HS256',
        }
      );
      setToken(token);
    } catch (e) {
      console.error(e);
      message.error('Encode Failed', 2);
    }
  };

  const decode = async () => {
    try {
      const sdJwtToken = sdjwt.decode(token);
      const header = JSON.stringify(sdJwtToken.jwt?.header ?? {}, null, 2);
      const disclosures = JSON.stringify(sdJwtToken.disclosures ?? [], null, 2);
      const claims = await sdjwt.getClaims(token);

      setHeader(header);
      setDiscolsures(disclosures);
      setClaims(JSON.stringify(claims, null, 2));
      setDiscloseFrame('');
    } catch (e) {
      console.error(e);
      message.error('Decode Failed', 2);
    }
  };

  const verify = async () => {
    try {
      const result = await sdjwt.validate(token, stringToUint8Array(secret));
      if (result) {
        message.success('Verify Success', 2);
      } else {
        message.error('Verify Failed', 2);
      }
    } catch (e) {
      console.error(e);
      message.error('Verify Failed', 2);
    }
  };

  useEffect(() => {
    // Parse the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get('token');

    // If the "token" parameter exists, use it as the initial state
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  return (
    <div className="debugger-wrapper">
      <div className="debugger-title" id="debugger">
        Debugger
      </div>
      <Warning />
      <SelectAlg />
      <div className="code-wrapper">
        <div className="code-item">
          <div className="code-title-wrapper">
            <div className="code-title">{'Encoded'}</div>
            <div className="code-desc">
              {'paste your token here'.toUpperCase()}
            </div>
          </div>
          <div className="area-wrapper">
            <JWTCode token={token} setToken={setToken} />
          </div>
        </div>
        <div className="code-item">
          <div className="code-title-wrapper">
            <div className="code-title">{'Decoded'}</div>
            <div className="code-desc">
              {'edit the payload and secret'.toUpperCase()}
            </div>
          </div>
          <div className="decode-area">
            <div className="decode-header">
              {'HEADER'}
              <span className="decode-desc">{'ALGORITHM & TOKEN TYPE'}</span>
            </div>
            <div className="decode-item">
              <JWTHeader header={header} setHeader={setHeader} />
            </div>
            <div className="decode-header decode-border-top">
              <span
                className={tab === 'claim' ? 'decode-tab-active' : 'decode-tab'}
                onClick={() => setTab('claim')}
              >
                {'Claims'}
              </span>
              <span
                className={
                  tab === 'discloseFrame' ? 'decode-tab-active' : 'decode-tab'
                }
                onClick={() => setTab('discloseFrame')}
              >
                {'DiscloseFrames'}
              </span>
              <span
                className={
                  tab === 'discolsures' ? 'decode-tab-active' : 'decode-tab'
                }
                onClick={() => setTab('discolsures')}
              >
                {'Discolsures'}
              </span>
            </div>
            <div className="decode-item">
              <JWTPayload
                payload={tabValue[tab]}
                setPayload={tabHandler[tab]}
              />
            </div>
            <div className="decode-header decode-border-top">
              {'VERIFY SIGNATURE'}
            </div>
            <div className="decode-item">
              <JWTDecode
                secret={secret}
                setSecret={setSecret}
                checked={base64Checked}
                setChecked={setBase64Checked}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="verified-share-wrapper">
        <div
          className="button small-button"
          onClick={() => {
            encode();
          }}
        >
          Encode SD JWT
        </div>
        <div
          className="button small-button"
          onClick={() => {
            decode();
          }}
        >
          Decode SD JWT
        </div>
        <div
          className="button small-button"
          onClick={() => {
            verify();
          }}
        >
          Verify Signature
        </div>
        <div
          className="button subdue small-button"
          style={{
            background: 'transparent',
          }}
          onClick={async () => {
            const result = await copyCurrentURLToClipboard();
            if (result) message.success('URL is copied to your clipboard', 2);
          }}
        >
          Share SD JWT
        </div>
      </div>
    </div>
  );
};

CodeMirror.defineMode('jwt', function () {
  return {
    token: function (stream, state) {
      if (stream.sol()) {
        state.partParsed = 'header'; // Start of line, assume header
      }

      if (stream.eat('.') || stream.eat('~')) {
        // Consume and style the dot
        if (state.partParsed === 'header') {
          state.partParsed = 'payload';
        } else if (state.partParsed === 'payload') {
          state.partParsed = 'signature';
        } else if (state.partParsed === 'signature') {
          state.partParsed = 'after-signature'; // After the signature, no styling
        }
        return 'jwt-dot';
      }

      stream.next(); // Consume the next character
      if (state.partParsed === 'after-signature') {
        return 'sdjwt-disclosure'; // No styling after the signature
      }
      return 'jwt-' + state.partParsed; // Style based on the current part
    },
    startState: function () {
      return { partParsed: null };
    },
  };
});
