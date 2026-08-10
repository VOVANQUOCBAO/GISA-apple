'use client';

import { Player, type PlayerRef } from '@remotion/player';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './site-intro.module.css';

const FPS = 30;
const DURATION_IN_FRAMES = 54;
const EXIT_DURATION_MS = 350;
const INTRO_SEEN_KEY = 'gisa-site-intro-seen';

// Covers client-side remounts even when browser storage is unavailable. The
// sessionStorage flag below covers hard reloads and history restoration.
let introHasStarted = false;

type IntroVariant = 'desktop' | 'mobile';
type IntroPhase = 'detecting' | 'playing' | 'exiting' | 'done';

type SiteIntroCompositionProps = {
  variant: IntroVariant;
};

function SiteIntroComposition({ variant }: SiteIntroCompositionProps) {
  const frame = useCurrentFrame();
  const mobile = variant === 'mobile';
  const entrance = Easing.bezier(0.16, 1, 0.3, 1);
  const vietnameseLines = mobile
    ? ['Viện Phát triển Bền vững', 'và Quản lý Nâng cao', 'Toàn cầu']
    : ['Viện Phát triển Bền vững và', 'Quản lý Nâng cao Toàn cầu'];
  const englishLines = mobile
    ? ['Global Institute for', 'Sustainable Development and', 'Advanced Management']
    : ['Global Institute for Sustainable Development and Advanced Management'];

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        backgroundColor: '#ffffff',
        color: '#19486a',
        display: 'flex',
        fontFamily: '"Source Sans 3", Calibri, "Segoe UI", Arial, sans-serif',
        justifyContent: 'center',
        padding: mobile ? 28 : 96,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: mobile ? 14 : 42,
          justifyContent: 'center',
          maxWidth: mobile ? 342 : 1240,
          textAlign: 'left',
          width: '100%',
        }}
      >
        <Img
          alt=""
          src={staticFile('brand/gisa-full-logo-source-2k.png')}
          style={{
            flex: '0 0 auto',
            height: mobile ? 84 : 200,
            objectFit: 'contain',
            opacity: interpolate(frame, [2, 14], [0, 1], {
              easing: entrance,
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            scale: interpolate(frame, [2, 18], [0.985, 1], {
              easing: entrance,
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            translate: `0 ${interpolate(frame, [2, 18], [8, 0], {
              easing: entrance,
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}px`,
            width: mobile ? 84 : 200,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            backgroundColor: '#f26f33',
            flex: '0 0 auto',
            height: mobile ? 190 : 172,
            opacity: interpolate(frame, [10, 24], [0, 1], {
              easing: entrance,
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            scale: `1 ${interpolate(frame, [10, 24], [0, 1], {
              easing: entrance,
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}`,
            transformOrigin: 'center',
            width: mobile ? 2 : 3,
          }}
        />

        <div
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            gap: mobile ? 12 : 18,
            maxWidth: mobile ? 230 : 900,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily: '"Source Serif 4", Cambria, Georgia, serif',
              fontSize: mobile ? 20 : 48,
              fontWeight: 600,
              letterSpacing: mobile ? '-0.15px' : '-0.65px',
              lineHeight: mobile ? 1.28 : 1.2,
            }}
          >
            {vietnameseLines.map((line, index) => {
              const lineStart = 18 + (index * 5);

              return (
                <span
                  key={line}
                  style={{
                    display: 'block',
                    filter: `blur(${interpolate(frame, [lineStart, lineStart + 16], [8, 0], {
                      easing: entrance,
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })}px)`,
                    opacity: interpolate(frame, [lineStart, lineStart + 14], [0, 1], {
                      easing: entrance,
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                    translate: `0 ${interpolate(frame, [lineStart, lineStart + 16], [24, 0], {
                      easing: entrance,
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })}px`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {bindPhrases(line)}{index < vietnameseLines.length - 1 ? ' ' : null}
                </span>
              );
            })}
          </div>

          <div
            style={{
              color: '#4d6577',
              fontSize: mobile ? 13 : 26,
              fontWeight: 400,
              letterSpacing: mobile ? '0.05px' : '0.2px',
              lineHeight: mobile ? 1.42 : 1.35,
            }}
          >
            {englishLines.map((line, index) => {
              const lineStart = 32 + (index * 4);

              return (
                <span
                  key={line}
                  style={{
                    display: 'block',
                    filter: `blur(${interpolate(frame, [lineStart, lineStart + 14], [6, 0], {
                      easing: entrance,
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })}px)`,
                    opacity: interpolate(frame, [lineStart, lineStart + 12], [0, 1], {
                      easing: entrance,
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                    translate: `0 ${interpolate(frame, [lineStart, lineStart + 14], [16, 0], {
                      easing: entrance,
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })}px`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {line}{index < englishLines.length - 1 ? ' ' : null}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function SiteIntro() {
  const pathname = usePathname();
  const shouldPlay = pathname === '/';
  const playerRef = useRef<PlayerRef>(null);
  const [phase, setPhase] = useState<IntroPhase>('detecting');
  const [variant, setVariant] = useState<IntroVariant>('desktop');

  useEffect(() => {
    const documentElement = document.documentElement;
    const previousIntroState = documentElement.dataset.siteIntro;
    documentElement.dataset.siteIntro = shouldPlay ? 'running' : 'complete';

    return () => {
      if (previousIntroState === undefined) {
        delete documentElement.dataset.siteIntro;
      } else {
        documentElement.dataset.siteIntro = previousIntroState;
      }
    };
  }, [shouldPlay]);

  useEffect(() => {
    if (phase === 'done') {
      document.documentElement.dataset.siteIntro = 'complete';
    }
  }, [phase]);

  useEffect(() => {
    if (!shouldPlay) return;

    if (typeof window.matchMedia !== 'function') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 48rem)');
    const syncVariant = () => {
      setVariant(mobileViewport.matches ? 'mobile' : 'desktop');
    };

    const startIntro = window.setTimeout(() => {
      let hasPlayed = introHasStarted;
      try {
        hasPlayed ||= window.sessionStorage.getItem(INTRO_SEEN_KEY) === 'true';
      } catch {
        // The in-memory guard still prevents a repeat during client navigation.
      }

      if (reduceMotion.matches || hasPlayed) {
        document.documentElement.dataset.siteIntro = 'complete';
        setPhase('done');
        return;
      }

      // Claim the intro before playback starts. This prevents a fast route
      // change or Back navigation from remounting it before `ended` fires.
      introHasStarted = true;
      try {
        window.sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
      } catch {
        // Storage can be unavailable in strict privacy modes.
      }

      syncVariant();
      setPhase('playing');
    }, 0);

    mobileViewport.addEventListener('change', syncVariant);

    return () => {
      window.clearTimeout(startIntro);
      mobileViewport.removeEventListener('change', syncVariant);
    };
  }, [shouldPlay]);

  useEffect(() => {
    if (!shouldPlay || phase === 'done') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase, shouldPlay]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const player = playerRef.current;
    if (!player) return;

    const finishIntro = () => setPhase('exiting');
    player.addEventListener('ended', finishIntro);

    return () => player.removeEventListener('ended', finishIntro);
  }, [phase, variant]);

  useEffect(() => {
    if (phase !== 'exiting') return;

    const timeout = window.setTimeout(() => {
      // Arm the hero reveal before removing the opaque overlay. Otherwise the
      // server-rendered hero flashes before jumping back to its first keyframe.
      document.documentElement.dataset.siteIntro = 'complete';
      setPhase('done');
    }, EXIT_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (!shouldPlay || phase === 'done') return null;

  const mobile = variant === 'mobile';

  return (
    <div aria-hidden="true" className={styles.introOverlay} data-phase={phase}>
      {phase !== 'detecting' ? (
        <Player
          allowFullscreen={false}
          autoPlay
          className={styles.player}
          clickToPlay={false}
          component={SiteIntroComposition}
          compositionHeight={mobile ? 844 : 900}
          compositionWidth={mobile ? 390 : 1440}
          controls={false}
          doubleClickToFullscreen={false}
          durationInFrames={DURATION_IN_FRAMES}
          fps={FPS}
          initiallyMuted
          inputProps={{ variant }}
          loop={false}
          moveToBeginningWhenEnded={false}
          numberOfSharedAudioTags={0}
          ref={playerRef}
          spaceKeyToPlayOrPause={false}
          style={{ height: '100%', width: '100%' }}
        />
      ) : null}
    </div>
  );
}
