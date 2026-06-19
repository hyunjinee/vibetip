import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const YELLOW = '#FFDD00';
const INK = '#191F28';
const MUTED = '#6B7684';
const PAPER = '#F7F8FA';
const WHITE = '#FFFFFF';
const DARK = '#101318';
const DEMO_URL = 'vibetip-demo.vercel.app';
const FONT =
  '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard Variable", Pretendard, "Noto Sans KR", sans-serif';

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const p = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const fadeWindow = (frame: number, enter: [number, number], exit: [number, number]) =>
  p(frame, enter[0], enter[1]) * (1 - p(frame, exit[0], exit[1]));

const baseText: CSSProperties = {
  fontFamily: FONT,
  color: INK,
  letterSpacing: '-0.035em',
  wordBreak: 'keep-all',
};

const Eyebrow = ({children, dark = false}: {children: ReactNode; dark?: boolean}) => (
  <div
    style={{
      ...baseText,
      color: dark ? '#A8B0BC' : '#687381',
      fontSize: 23,
      fontWeight: 750,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const Logo = ({inverse = false, size = 64}: {inverse?: boolean; size?: number}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.24}}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.31,
        background: YELLOW,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 ${size * 0.1}px ${size * 0.35}px #00000022`,
      }}
    >
      <div
        style={{
          width: size * 0.34,
          height: size * 0.34,
          borderRadius: '50%',
          background: INK,
          boxShadow: `${size * 0.19}px 0 0 ${INK}`,
          transform: `translateX(${-size * 0.095}px)`,
        }}
      />
    </div>
    <div
      style={{
        ...baseText,
        color: inverse ? WHITE : INK,
        fontSize: size * 0.61,
        fontWeight: 850,
        letterSpacing: '-0.055em',
      }}
    >
      VibeTip
    </div>
  </div>
);

const KakaoPayLogo = ({compact = false}: {compact?: boolean}) => {
  const symbolSize = compact ? 22 : 34;

  return (
    <div
      aria-label="KakaoPay"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={symbolSize}
        height={symbolSize}
        viewBox="0 0 34 34"
        aria-hidden="true"
        style={{display: 'block'}}
      >
        <path
          d="M17 3.5C9.27 3.5 3 8.51 3 14.7c0 4 2.62 7.5 6.56 9.48l-1.4 4.2c-.17.5.4.9.82.62l5-3.35c.98.18 2 .27 3.02.27 7.73 0 14-5.02 14-11.21C31 8.5 24.73 3.5 17 3.5Z"
          fill={INK}
        />
      </svg>
    </div>
  );
};

const SceneLabel = ({step, text, dark = false}: {step: string; text: string; dark?: boolean}) => {
  const frame = useCurrentFrame();
  const enter = p(frame, 4, 24);

  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: 72,
        right: 72,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          ...baseText,
          color: INK,
          background: YELLOW,
          borderRadius: 999,
          padding: '10px 17px 11px',
          fontSize: 20,
          fontWeight: 850,
          letterSpacing: '0.02em',
        }}
      >
        {step}
      </div>
      <div
        style={{
          ...baseText,
          color: dark ? WHITE : INK,
          fontSize: 30,
          fontWeight: 760,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Cursor = ({x, y, click}: {x: number; y: number; click: number}) => {
  const ringScale = interpolate(click, [0, 1], [1.8, 0.85]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: WHITE,
        border: '2px solid #15191F',
        boxShadow: '0 5px 16px #00000030',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translate(-50%, -50%) scale(${1 - click * 0.12})`,
      }}
    >
      {click > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: -7,
            border: `3px solid ${YELLOW}`,
            borderRadius: '50%',
            opacity: click,
            transform: `scale(${ringScale})`,
          }}
        />
      ) : null}
      <div style={{width: 8, height: 8, borderRadius: '50%', background: '#15191F'}} />
    </div>
  );
};

const BrowserChrome = ({children}: {children: ReactNode}) => (
  <div
    style={{
      width: 1650,
      height: 830,
      borderRadius: 32,
      background: WHITE,
      boxShadow: '0 34px 110px #25314A26, 0 0 0 1px #18233A12',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    <div
      style={{
        height: 64,
        background: '#F2F4F6',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 10,
        borderBottom: '1px solid #E6E9ED',
      }}
    >
      {['#FF6B63', '#FFBF45', '#31C653'].map((color) => (
        <div key={color} style={{width: 14, height: 14, borderRadius: '50%', background: color}} />
      ))}
      <div
        style={{
          ...baseText,
          marginLeft: 28,
          height: 36,
          width: 660,
          borderRadius: 12,
          background: WHITE,
          color: '#8A94A1',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          letterSpacing: '-0.01em',
        }}
      >
        {DEMO_URL}
      </div>
    </div>
    <div style={{position: 'absolute', inset: '64px 0 0'}}>{children}</div>
  </div>
);

const TipLink = ({icon, label, accent = false}: {icon: ReactNode; label: string; accent?: boolean}) => (
  <div
    style={{
      height: 78,
      borderRadius: 22,
      background: accent ? '#FFF9C7' : WHITE,
      border: `1px solid ${accent ? '#E9CF00' : '#E5E9EF'}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 15px',
      gap: 14,
      boxShadow: accent ? '0 8px 22px #FFDD0033' : '0 2px 4px #191F2808',
    }}
  >
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: 16,
        background: PAPER,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 25,
      }}
    >
      {icon}
    </div>
    <div style={{...baseText, fontSize: 19, fontWeight: 720, letterSpacing: '-0.02em'}}>{label}</div>
    <div
      style={{
        marginLeft: 'auto',
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: PAPER,
        color: '#8A94A1',
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ↗
    </div>
  </div>
);

const AppPage = ({frame}: {frame: number}) => {
  const panel = p(frame, 120, 144);
  const linkHover = p(frame, 196, 211);
  const fabClick = p(frame, 112, 124) * (1 - p(frame, 124, 138));
  const linkClick = p(frame, 215, 226) * (1 - p(frame, 226, 239));
  const cursorVisible = p(frame, 50, 64);
  const cursorX = interpolate(frame, [52, 108, 150, 208, 220], [820, 1550, 1550, 1395, 1395], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const cursorY = interpolate(frame, [52, 108, 150, 208, 220], [340, 699, 699, 558, 558], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#F5F2E9'}}>
      <div
        style={{
          height: 92,
          display: 'flex',
          alignItems: 'center',
          padding: '0 68px',
          borderBottom: '1px solid #DED9CC',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 30, height: 30, borderRadius: '50% 50% 50% 8px', background: '#29483A', transform: 'rotate(-12deg)'}} />
          <div style={{...baseText, fontSize: 25, fontWeight: 900, letterSpacing: '-0.045em'}}>STROLL SEOUL</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', ...baseText, fontSize: 16, fontWeight: 680}}>
          <span style={{padding: '10px 17px', borderRadius: 999, background: '#E7E2D5'}}>추천 코스</span>
          <span style={{padding: '10px 12px'}}>동네 탐색</span>
          <span style={{padding: '10px 12px'}}>저장한 산책</span>
          <div style={{width: 38, height: 38, borderRadius: '50%', background: '#29483A', color: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14}}>HJ</div>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '0.94fr 1.06fr', height: 674}}>
        <div style={{padding: '62px 0 0 76px', position: 'relative'}}>
          <div style={{...baseText, color: '#5F6E64', fontSize: 17, fontWeight: 800, letterSpacing: '0.08em'}}>CURATED CITY WALK · 06</div>
          <div
            style={{
              ...baseText,
              fontSize: 67,
              fontWeight: 870,
              lineHeight: 1.09,
              marginTop: 24,
              maxWidth: 640,
            }}
          >
            서울의 속도에서
            <br />
            한 걸음 벗어나기
          </div>
          <div style={{...baseText, color: '#657068', fontSize: 20, lineHeight: 1.65, marginTop: 25, maxWidth: 590}}>
            오래된 골목과 작은 정원을 잇는 4.8km.
            <br />
            오늘의 서울을 천천히 발견해 보세요.
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 31}}>
            <div style={{...baseText, height: 56, padding: '0 24px', borderRadius: 999, background: '#29483A', color: WHITE, display: 'flex', alignItems: 'center', fontSize: 17, fontWeight: 760}}>
              산책 시작하기&nbsp;&nbsp;→
            </div>
            <div style={{...baseText, width: 56, height: 56, borderRadius: '50%', border: '1px solid #CFC8B9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>♡</div>
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 34}}>
            {['4.8 km', '약 70분', '장소 7곳'].map((item) => (
              <div
                key={item}
                style={{
                  ...baseText,
                  borderTop: '1px solid #CEC7B8',
                  borderRadius: 999,
                  padding: '12px 19px 0',
                  fontSize: 15,
                  fontWeight: 720,
                  color: '#5D675F',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div style={{position: 'relative', padding: '36px 48px 38px 8px'}}>
          <div
            style={{
              position: 'absolute',
              inset: '36px 48px 38px 8px',
              borderRadius: 38,
              background: '#DDE6D5',
              border: '1px solid #C6D2BF',
              overflow: 'hidden',
              boxShadow: '0 22px 48px #3F554522',
            }}
          >
            <div style={{position: 'absolute', width: 460, height: 170, borderRadius: 120, background: '#B8CDAF', left: -80, top: -45, transform: 'rotate(-9deg)'}} />
            <div style={{position: 'absolute', width: 330, height: 260, borderRadius: '48% 52% 44% 56%', background: '#CAD9C0', right: -55, bottom: -40, transform: 'rotate(18deg)'}} />
            <div style={{position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: '#ECDFC2', right: 78, top: 58}} />
            <div style={{position: 'absolute', inset: 0, opacity: 0.24, backgroundImage: 'linear-gradient(#7C927F 1px, transparent 1px), linear-gradient(90deg, #7C927F 1px, transparent 1px)', backgroundSize: '70px 70px'}} />
            <svg width="100%" height="100%" viewBox="0 0 760 600" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path d="M-40 450C110 365 120 285 255 300C390 315 432 430 575 390C665 365 706 285 810 268" fill="none" stroke="#B8D4DF" strokeWidth="66" strokeLinecap="round" />
              <path d="M92 470C125 382 202 364 238 292C279 211 337 164 429 174C515 184 542 255 626 242" fill="none" stroke="#FFF" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M92 470C125 382 202 364 238 292C279 211 337 164 429 174C515 184 542 255 626 242" fill="none" stroke="#E36B45" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 18" />
              <circle cx="92" cy="470" r="17" fill="#29483A" stroke="#FFF" strokeWidth="7" />
              <circle cx="429" cy="174" r="13" fill="#E36B45" stroke="#FFF" strokeWidth="6" />
              <circle cx="626" cy="242" r="17" fill={YELLOW} stroke="#29483A" strokeWidth="6" />
            </svg>
            <div style={{...baseText, position: 'absolute', left: 48, top: 58, fontSize: 15, fontWeight: 780, color: '#526359'}}>서울숲</div>
            <div style={{...baseText, position: 'absolute', right: 55, top: 185, fontSize: 15, fontWeight: 780, color: '#526359'}}>성수동</div>
            <div style={{...baseText, position: 'absolute', left: 300, bottom: 80, fontSize: 15, fontWeight: 780, color: '#526359'}}>한강</div>
            <div
              style={{
                ...baseText,
                position: 'absolute',
                left: 34,
                bottom: 30,
                width: 238,
                padding: '17px 18px',
                borderRadius: 20,
                background: '#FFFEFAF2',
                boxShadow: '0 12px 32px #40533F25',
              }}
            >
              <div style={{fontSize: 12, color: '#7B857D', fontWeight: 800, letterSpacing: '0.08em'}}>NEXT STOP · 04</div>
              <div style={{fontSize: 18, fontWeight: 820, marginTop: 5}}>작은 정원 카페</div>
              <div style={{fontSize: 13, color: '#707A72', marginTop: 4}}>도보 8분 · 조용한 테라스</div>
            </div>
            <div style={{...baseText, position: 'absolute', right: 28, bottom: 28, width: 52, height: 52, borderRadius: '50%', background: '#29483A', color: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 8px 20px #29483A44'}}>⌖</div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 42,
          bottom: 34,
          height: 66,
          minWidth: 112,
          borderRadius: 35,
          padding: '0 26px',
          background: YELLOW,
          boxShadow: '0 12px 34px #191F2838',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${1 - fabClick * 0.1})`,
          zIndex: 12,
        }}
      >
        <div style={{...baseText, fontSize: 20, fontWeight: 820}}>{panel > 0.55 ? '✕' : 'Tip'}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 40,
          bottom: 120,
          width: 430,
          padding: 15,
          borderRadius: 34,
          background: PAPER,
          border: '1px solid #E1E5EA',
          boxShadow: '0 34px 76px #191F2836',
          opacity: panel,
          transform: `translateY(${interpolate(panel, [0, 1], [32, 0])}px) scale(${interpolate(panel, [0, 1], [0.9, 1])})`,
          transformOrigin: '88% 110%',
          zIndex: 11,
        }}
      >
        <div style={{padding: '10px 12px 16px'}}>
          <div style={{...baseText, color: '#8B95A1', fontSize: 12, fontWeight: 850, letterSpacing: '0.12em'}}>VIBETIP</div>
          <div style={{...baseText, fontSize: 23, fontWeight: 800, marginTop: 4}}>STROLL SEOUL</div>
          <div style={{...baseText, color: MUTED, fontSize: 17, marginTop: 4}}>이 산책이 좋았다면 커피 한 잔!</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <TipLink icon={<KakaoPayLogo compact />} label="카카오페이 송금" accent={linkHover > 0.45} />
        </div>
        <div style={{...baseText, color: '#8B95A1', textAlign: 'center', fontSize: 13, fontWeight: 650, margin: '16px 0 2px'}}>
          <span style={{color: YELLOW}}>●</span> &nbsp;Powered by VibeTip
        </div>
      </div>

      <div style={{opacity: cursorVisible}}>
        <Cursor x={cursorX} y={cursorY} click={Math.max(fabClick, linkClick)} />
      </div>
    </div>
  );
};

const Intro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = p(frame, 0.2 * fps, 1.0 * fps);
  const title = p(frame, 0.7 * fps, 1.6 * fps);
  const line = p(frame, 1.3 * fps, 2.1 * fps);

  return (
    <AbsoluteFill style={{background: DARK, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', width: 820, height: 820, borderRadius: '50%', background: '#FFDD0014', filter: 'blur(3px)'}} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1}}>
        <div style={{opacity: logo, transform: `translateY(${interpolate(logo, [0, 1], [24, 0])}px) scale(${interpolate(logo, [0, 1], [0.9, 1])})`}}>
          <Logo inverse size={86} />
        </div>
        <div
          style={{
            ...baseText,
            color: WHITE,
            fontSize: 86,
            lineHeight: 1.08,
            textAlign: 'center',
            fontWeight: 840,
            marginTop: 55,
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [38, 0])}px)`,
          }}
        >
          페이지에서 팁까지,
          <br />
          가장 짧은 흐름
        </div>
        <div
          style={{
            ...baseText,
            color: '#AEB6C1',
            fontSize: 25,
            marginTop: 34,
            opacity: line,
            letterSpacing: '-0.02em',
          }}
        >
          카카오페이 송금 링크를 모바일과 PC에 맞게 연결합니다
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BrowserScene = () => {
  const frame = useCurrentFrame();
  const enter = p(frame, 0, 28);

  return (
    <AbsoluteFill style={{background: '#EEECE6', alignItems: 'center', justifyContent: 'center'}}>
      <SceneLabel step="01" text="방문자가 페이지의 Tip 버튼을 누릅니다" />
      <div
        style={{
          marginTop: 72,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        <BrowserChrome>
          <AppPage frame={frame} />
        </BrowserChrome>
      </div>
    </AbsoluteFill>
  );
};

const Check = ({progress}: {progress: number}) => (
  <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="54" fill={YELLOW} />
    <path
      d="M35 61L52 78L87 41"
      fill="none"
      stroke={INK}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="80"
      strokeDashoffset={80 * (1 - progress)}
    />
  </svg>
);

const PaymentScene = () => {
  const frame = useCurrentFrame();
  const phoneIn = p(frame, 0, 30);
  const select = p(frame, 90, 112);
  const buttonPress = p(frame, 146, 160) * (1 - p(frame, 160, 176));
  const success = p(frame, 178, 211);
  const cursorIn = p(frame, 48, 65) * (1 - p(frame, 165, 179));
  const cursorX = interpolate(frame, [50, 94, 120, 150], [1040, 1304, 1304, 1405], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const cursorY = interpolate(frame, [50, 94, 120, 150], [520, 493, 493, 940], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const amountClick = p(frame, 98, 109) * (1 - p(frame, 109, 121));
  const sendClick = p(frame, 151, 163) * (1 - p(frame, 163, 176));

  return (
    <AbsoluteFill style={{background: DARK}}>
      <SceneLabel step="02" text="카카오페이에서 금액을 선택하고 보냅니다" dark />
      <div
        style={{
          position: 'absolute',
          left: 175,
          top: 260,
          width: 620,
          opacity: phoneIn,
          transform: `translateX(${interpolate(phoneIn, [0, 1], [-40, 0])}px)`,
        }}
      >
        <Eyebrow dark>KakaoPay transfer link</Eyebrow>
        <div style={{...baseText, color: WHITE, fontSize: 68, fontWeight: 830, lineHeight: 1.1, marginTop: 22}}>
          앱 안에서 헤매지 않고,
          <br />
          바로 카카오페이 송금 화면으로
        </div>
        <div style={{...baseText, color: '#A8B0BC', fontSize: 24, lineHeight: 1.65, marginTop: 32}}>
          별도 회원가입도, VibeTip 결제창도 없습니다.
          <br />
          사용자가 익숙한 카카오페이를 그대로 사용합니다.
        </div>
        <div
          style={{
            ...baseText,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 48,
            borderRadius: 18,
            padding: '14px 18px',
            background: '#20252C',
            color: '#C5CBD3',
            fontSize: 18,
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{color: YELLOW}}>●</span> 카카오페이 화면은 예시 연출입니다
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 265,
          top: 145,
          width: 500,
          height: 860,
          borderRadius: 62,
          background: '#08090B',
          padding: 15,
          boxShadow: '0 50px 140px #00000088',
          opacity: phoneIn,
          transform: `translateY(${interpolate(phoneIn, [0, 1], [95, 0])}px) scale(${interpolate(phoneIn, [0, 1], [0.92, 1])})`,
        }}
      >
        <div style={{position: 'absolute', top: 23, left: 190, width: 120, height: 29, borderRadius: 20, background: '#08090B', zIndex: 4}} />
        <div style={{position: 'relative', height: '100%', borderRadius: 49, overflow: 'hidden', background: '#FFF'}}>
          {success < 0.2 ? (
            <>
              <div style={{height: 94, background: YELLOW, display: 'flex', alignItems: 'flex-end', padding: '0 28px 18px'}}>
                <KakaoPayLogo />
              </div>
              <div style={{padding: '34px 28px'}}>
                <div style={{...baseText, color: MUTED, fontSize: 17, fontWeight: 650}}>STROLL SEOUL · 홍길동님에게</div>
                <div style={{...baseText, fontSize: 42, fontWeight: 850, marginTop: 10}}>얼마를 보낼까요?</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32}}>
                  {['1,000원', '3,000원', '5,000원', '10,000원'].map((amount) => {
                    const active = amount === '5,000원' && select > 0.45;
                    return (
                      <div
                        key={amount}
                        style={{
                          ...baseText,
                          height: 66,
                          borderRadius: 18,
                          border: `2px solid ${active ? INK : '#E7E9ED'}`,
                          background: active ? YELLOW : '#F7F8FA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 19,
                          fontWeight: 750,
                          transform: active ? 'scale(1.025)' : 'scale(1)',
                        }}
                      >
                        {amount}
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop: 38, borderTop: '1px solid #ECEEF1', paddingTop: 26}}>
                  <div style={{...baseText, color: MUTED, fontSize: 16}}>받는 분</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 13}}>
                    <div style={{width: 50, height: 50, borderRadius: 18, background: '#E8F0E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25}}>🚶</div>
                    <div>
                      <div style={{...baseText, fontSize: 20, fontWeight: 780}}>홍길동</div>
                      <div style={{...baseText, color: MUTED, fontSize: 14, marginTop: 3}}>STROLL SEOUL 만든 사람</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 25,
                  right: 25,
                  bottom: 25,
                  height: 76,
                  borderRadius: 22,
                  background: select > 0.45 ? YELLOW : '#E7E9ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${1 - buttonPress * 0.045})`,
                }}
              >
                <div style={{...baseText, fontSize: 22, fontWeight: 820}}>{select > 0.45 ? '5,000원 보내기' : '금액을 선택해 주세요'}</div>
              </div>
            </>
          ) : (
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: p(frame, 183, 203)}}>
              <Check progress={p(frame, 192, 220)} />
              <div style={{...baseText, fontSize: 36, fontWeight: 850, marginTop: 34}}>송금 완료</div>
              <div style={{...baseText, fontSize: 24, fontWeight: 700, marginTop: 14}}>홍길동님에게 5,000원</div>
              <div style={{...baseText, color: MUTED, fontSize: 17, marginTop: 10}}>카카오페이로 바로 전달했어요</div>
            </div>
          )}
        </div>
      </div>

      <div style={{opacity: cursorIn}}>
        <Cursor x={cursorX} y={cursorY} click={Math.max(amountClick, sendClick)} />
      </div>
    </AbsoluteFill>
  );
};

const FlowCard = ({emoji, eyebrow, title, enter}: {emoji: string; eyebrow: string; title: string; enter: number}) => (
  <div
    style={{
      width: 390,
      height: 250,
      borderRadius: 38,
      background: WHITE,
      boxShadow: '0 24px 70px #191F2826',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 40px',
      opacity: enter,
      transform: `translateY(${interpolate(enter, [0, 1], [45, 0])}px)`,
    }}
  >
    <div style={{fontSize: 52}}>{emoji}</div>
    <div style={{...baseText, color: MUTED, fontSize: 16, fontWeight: 760, letterSpacing: '0.08em', marginTop: 20}}>{eyebrow}</div>
    <div style={{...baseText, fontSize: 32, fontWeight: 830, marginTop: 5}}>{title}</div>
  </div>
);

const DirectScene = () => {
  const frame = useCurrentFrame();
  const title = p(frame, 0, 26);
  const left = p(frame, 20, 50);
  const right = p(frame, 36, 66);
  const line = p(frame, 58, 105);
  const receipt = p(frame, 78, 104);

  return (
    <AbsoluteFill style={{background: YELLOW, alignItems: 'center'}}>
      <div
        style={{
          ...baseText,
          fontSize: 64,
          fontWeight: 860,
          lineHeight: 1.12,
          textAlign: 'center',
          marginTop: 105,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [28, 0])}px)`,
        }}
      >
        팁은 카카오페이를 통해
        <br />
        만든 사람에게 직접 전달됩니다
      </div>
      <div style={{position: 'absolute', top: 430, left: 250}}>
        <FlowCard emoji="🙋" eyebrow="VISITOR" title="페이지 방문자" enter={left} />
      </div>
      <div style={{position: 'absolute', top: 430, right: 250}}>
        <FlowCard emoji="🚶" eyebrow="CREATOR" title="만든 사람" enter={right} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 700,
          right: 700,
          top: 548,
          height: 14,
          borderRadius: 999,
          background: INK,
          transformOrigin: 'left center',
          transform: `scaleX(${line})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: interpolate(line, [0, 1], [700, 1190]),
          top: 510,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: WHITE,
          boxShadow: '0 12px 32px #191F2838',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 38,
          opacity: line,
        }}
      >
        ₩
      </div>
      <div
        style={{
          position: 'absolute',
          top: 758,
          opacity: receipt,
          transform: `translateY(${interpolate(receipt, [0, 1], [28, 0])}px)`,
          background: '#191F28',
          color: WHITE,
          borderRadius: 24,
          padding: '18px 26px 19px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 14px 36px #191F2833',
        }}
      >
        <span style={{fontSize: 24}}>✓</span>
        <span style={{...baseText, color: WHITE, fontSize: 21, fontWeight: 740}}>5,000원 송금 완료</span>
      </div>
      <div
        style={{
          ...baseText,
          position: 'absolute',
          bottom: 70,
          fontSize: 20,
          fontWeight: 700,
          opacity: receipt,
          letterSpacing: '-0.02em',
        }}
      >
        VibeTip은 송금을 중개하지 않고, 카카오페이 송금 링크만 연결합니다
      </div>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const frame = useCurrentFrame();
  const logo = p(frame, 0, 24);
  const title = p(frame, 16, 46);
  const message = p(frame, 38, 68);

  return (
    <AbsoluteFill style={{background: DARK, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #FFDD0017, transparent 42%)'}} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1}}>
        <div style={{opacity: logo}}>
          <Logo inverse size={72} />
        </div>
        <div
          style={{
            ...baseText,
            color: WHITE,
            fontSize: 72,
            fontWeight: 850,
            marginTop: 42,
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [28, 0])}px)`,
          }}
        >
          페이지에서 팁까지,
          <br />
          더 자연스럽게.
        </div>
        <div
          style={{
            ...baseText,
            color: '#AEB6C1',
            fontSize: 25,
            lineHeight: 1.55,
            textAlign: 'center',
            letterSpacing: '-0.025em',
            marginTop: 32,
            opacity: message,
            transform: `translateY(${interpolate(message, [0, 1], [20, 0])}px)`,
          }}
        >
          만든 사람과 응원하는 사람을
          <br />
          가장 짧은 거리로 연결합니다
        </div>
        <div style={{width: 46, height: 4, borderRadius: 999, background: YELLOW, marginTop: 38, opacity: message}} />
        <div style={{...baseText, color: '#737D89', fontSize: 17, marginTop: 22, opacity: message, letterSpacing: '0.06em'}}>
          {DEMO_URL}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VibeTipFlow = () => {
  const frame = useCurrentFrame();

  const introOpacity = fadeWindow(frame, [0, 12], [74, 92]);
  const browserOpacity = fadeWindow(frame, [75, 95], [365, 388]);
  const paymentOpacity = fadeWindow(frame, [365, 389], [615, 638]);
  const directOpacity = fadeWindow(frame, [615, 639], [728, 752]);
  const outroOpacity = p(frame, 728, 754);

  return (
    <AbsoluteFill style={{background: DARK}}>
      <Sequence from={0} durationInFrames={96} premountFor={30}>
        <div style={{position: 'absolute', inset: 0, opacity: introOpacity}}>
          <Intro />
        </div>
      </Sequence>
      <Sequence from={75} durationInFrames={315} premountFor={30}>
        <div style={{position: 'absolute', inset: 0, opacity: browserOpacity}}>
          <BrowserScene />
        </div>
      </Sequence>
      <Sequence from={365} durationInFrames={275} premountFor={30}>
        <div style={{position: 'absolute', inset: 0, opacity: paymentOpacity}}>
          <PaymentScene />
        </div>
      </Sequence>
      <Sequence from={615} durationInFrames={140} premountFor={30}>
        <div style={{position: 'absolute', inset: 0, opacity: directOpacity}}>
          <DirectScene />
        </div>
      </Sequence>
      <Sequence from={728} durationInFrames={112} premountFor={30}>
        <div style={{position: 'absolute', inset: 0, opacity: outroOpacity}}>
          <Outro />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
