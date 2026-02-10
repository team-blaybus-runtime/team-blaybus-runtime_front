"use client";

import { useRef } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { useRenderStore } from "@/store/useRenderStore";
import { useModelStore } from "@/store/useModelStore";
import { StudyComponent } from "@/apis/study";

/* ─── 쉐이더 설정 ─── */

export function ShaderSettingsPanel() {
  const { bloom, ao, lighting, setBloom, setAO, setLighting, reset } =
    useRenderStore();

  return (
    <PanelContainer>
      <PanelTitle>쉐이더 설정</PanelTitle>

      <SectionLabel>Bloom</SectionLabel>
      <SliderRow
        label="밝기"
        value={bloom.intensity}
        min={0}
        max={3}
        step={0.1}
        onChange={(v) => setBloom({ intensity: v })}
      />
      <SliderRow
        label="임계값"
        value={bloom.threshold}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => setBloom({ threshold: v })}
      />
      <SliderRow
        label="부드러움"
        value={bloom.smoothing}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => setBloom({ smoothing: v })}
      />

      <SectionLabel>앰비언트 오클루전</SectionLabel>
      <SliderRow
        label="반경"
        value={ao.radius}
        min={0}
        max={2}
        step={0.1}
        onChange={(v) => setAO({ radius: v })}
      />
      <SliderRow
        label="강도"
        value={ao.intensity}
        min={0}
        max={5}
        step={0.1}
        onChange={(v) => setAO({ intensity: v })}
      />

      <SectionLabel>조명</SectionLabel>
      <SliderRow
        label="주 조명"
        value={lighting.keyLightIntensity}
        min={0}
        max={5}
        step={0.1}
        onChange={(v) => setLighting({ keyLightIntensity: v })}
      />
      <SliderRow
        label="환경광"
        value={lighting.ambientIntensity}
        min={0}
        max={2}
        step={0.05}
        onChange={(v) => setLighting({ ambientIntensity: v })}
      />

      <ResetButton onClick={reset}>초기화</ResetButton>
    </PanelContainer>
  );
}

/* ─── 메쉬 목록 ─── */

interface MeshListPanelProps {
  components: StudyComponent[];
}

export function MeshListPanel({ components }: MeshListPanelProps) {
  const { hiddenParts, togglePartVisibility, setAllPartsVisible } =
    useModelStore();

  return (
    <PanelContainer>
      <Row style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <PanelTitle>메쉬 목록</PanelTitle>
        <SmallButton onClick={setAllPartsVisible}>전체 표시</SmallButton>
      </Row>

      <MeshList>
        {components.map((comp, i) => {
          const hidden = hiddenParts.has(comp.componentId);
          return (
            <MeshItem key={comp.componentId} onClick={() => togglePartVisibility(comp.componentId)}>
              <EyeIcon visible={!hidden} />
              <Font typo="caption_m" color={hidden ? colors.neutral_700 : colors.neutral_0}>
                {comp.componentName}
              </Font>
            </MeshItem>
          );
        })}
        {components.length === 0 && (
          <Font typo="caption_m" color={colors.neutral_500}>
            로드된 메쉬가 없습니다
          </Font>
        )}
      </MeshList>
    </PanelContainer>
  );
}

/* ─── 에셋 업로드 ─── */

export function AssetUploadPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // TODO: 파일 업로드 API 연동
    alert(`${files[0].name} 선택됨 (업로드 API 연동 필요)`);
    e.target.value = "";
  };

  return (
    <PanelContainer>
      <PanelTitle>에셋 업로드</PanelTitle>
      <Font typo="caption_m" color={colors.neutral_500}>
        GLB/GLTF 파일을 업로드하세요
      </Font>
      <UploadArea onClick={() => fileInputRef.current?.click()}>
        <UploadIcon />
        <Font typo="caption_m" color={colors.neutral_400}>
          클릭하여 파일 선택
        </Font>
        <Font typo="caption_s" color={colors.neutral_600}>
          .glb, .gltf 지원
        </Font>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileSelect}
        />
      </UploadArea>
    </PanelContainer>
  );
}

/* ─── 공통 SliderRow ─── */

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <SliderContainer>
      <SliderLabel>
        <Font typo="caption_s" color={colors.neutral_400}>{label}</Font>
        <Font typo="caption_s" color={colors.neutral_0}>{value.toFixed(2)}</Font>
      </SliderLabel>
      <StyledSlider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </SliderContainer>
  );
}

/* ─── Icons ─── */

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke={colors.neutral_400} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2.5" stroke={colors.neutral_400} strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8" stroke={colors.neutral_700} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 13L13 3" stroke={colors.neutral_700} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 20V8M16 8L12 12M16 8L20 12" stroke={colors.neutral_500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 22V24C6 25.1046 6.89543 26 8 26H24C25.1046 26 26 25.1046 26 24V22" stroke={colors.neutral_500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Styles ─── */

const PanelContainer = styled(Column)`
  background-color: ${colors.neutral_1000};
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
  width: 240px;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.neutral_700};
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const PanelTitle = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.neutral_0};
`;

const SectionLabel = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${colors.blue_400};
  margin-top: 4px;
`;

const SliderContainer = styled(Column)`
  gap: 4px;
  width: 100%;
`;

const SliderLabel = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;

const StyledSlider = styled.input`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: ${colors.neutral_800};
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${colors.blue_700};
    cursor: pointer;
  }
`;

const ResetButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${colors.neutral_700};
  border-radius: 8px;
  background: transparent;
  color: ${colors.neutral_400};
  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;

  &:hover {
    border-color: ${colors.neutral_500};
    color: ${colors.neutral_0};
  }
`;

const SmallButton = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: ${colors.neutral_900};
  color: ${colors.neutral_400};
  font-family: "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${colors.neutral_0};
  }
`;

const MeshList = styled(Column)`
  gap: 4px;
  width: 100%;
`;

const MeshItem = styled(Row)`
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: ${colors.neutral_900};
  }
`;

const UploadArea = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  border: 1px dashed ${colors.neutral_700};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: ${colors.blue_700};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;
