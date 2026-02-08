"use client";

import { useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Row, Column } from "@/styles/base/BaseComponents";
import colors from "@/styles/constant/colors";
import { useSimulatorStore } from "@/store/useSimulatorStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SimulatorControls() {
  const { isPlaying, currentTime, duration, setIsPlaying, setCurrentTime, reset } =
    useSimulatorStore();
  const animRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
    lastTimestampRef.current = null;
  }, [setIsPlaying]);

  const handleReset = useCallback(() => {
    pause();
    reset();
  }, [pause, reset]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTime >= duration) setCurrentTime(0);
      lastTimestampRef.current = null;
      setIsPlaying(true);
    }
  }, [isPlaying, pause, currentTime, duration, setCurrentTime, setIsPlaying]);

  // 애니메이션 루프
  useEffect(() => {
    if (!isPlaying) return;

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const delta = (timestamp - lastTimestampRef.current) / 1000;
        const next = currentTime + delta;
        if (next >= duration) {
          setCurrentTime(duration);
          setIsPlaying(false);
          return;
        }
        setCurrentTime(next);
      }
      lastTimestampRef.current = timestamp;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, currentTime, duration, setCurrentTime, setIsPlaying]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(ratio * duration);
  };

  return (
    <Container>
      <TrackArea onClick={handleTrackClick}>
        <TrackBg />
        <TrackFill style={{ width: `${progress}%` }} />
      </TrackArea>
      <TimeRow>
        <TimeLabel>{formatTime(currentTime)}</TimeLabel>
        <TimeLabel>{formatTime(duration)}</TimeLabel>
      </TimeRow>
      <ButtonRow>
        <ControlButton onClick={handleReset} aria-label="리셋">
          <ResetIcon />
        </ControlButton>
        <ControlButton onClick={togglePlay} aria-label={isPlaying ? "일시정지" : "재생"}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </ControlButton>
      </ButtonRow>
    </Container>
  );
}

/* --- Icons --- */

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1.75 5.25C1.75 5.25 3.08 3.08 4.55 2.17C6.02 1.26 7.88 1.05 9.54 1.6C11.2 2.15 12.52 3.43 13.12 5.08C13.72 6.72 13.54 8.56 12.63 10.04C11.72 11.52 10.17 12.5 8.44 12.68C6.71 12.86 4.99 12.22 3.78 10.97C2.57 9.72 1.99 7.98 2.23 6.26"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.75 1.75V5.25H5.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 1.5L10 6L2.5 10.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="2" y="1.5" width="3" height="9" rx="0.5" fill="currentColor" />
      <rect x="7" y="1.5" width="3" height="9" rx="0.5" fill="currentColor" />
    </svg>
  );
}

/* --- Styles --- */

const Container = styled(Column)`
  background-color: ${colors.neutral_900};
  border-radius: 16px;
  padding: 10px 20px;
  width: 365px;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const TrackArea = styled.div`
  position: relative;
  width: 100%;
  height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const TrackBg = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 6px;
  border-radius: 2000px;
  background-color: ${colors.neutral_200};
`;

const TrackFill = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 6px;
  border-radius: 2000px;
  background-color: ${colors.blue_700};
  transition: width 0.05s linear;
`;

const TimeRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
`;

const TimeLabel = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 20px;
  color: ${colors.neutral_0};
  text-align: center;
`;

const ButtonRow = styled(Row)`
  gap: 6px;
  align-items: center;
  width: 100%;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 3px 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${colors.neutral_0};
  overflow: hidden;

  &:hover {
    color: ${colors.blue_400};
  }
`;
