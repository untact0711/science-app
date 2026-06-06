import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, CheckCircle2, Image as ImageIcon, Loader2, AlertCircle, ClipboardPaste, FileText, HelpCircle, KeyRound, LogOut } from 'lucide-react';

// --- 2022 개정 과학교구 설비 기준 내장 데이터베이스 (공식 기준표 전체 반영) ---
const STANDARD_EQUIPMENT = [
  // ── 공통-일반교구 ──────────────────────────────────────────────────────────
  { category: "공통-일반교구", name: "가지 달린 삼각 플라스크", spec: "각종(100∼300 mL)", requirement: "4학생당 1", type: "필수", keywords: ["가지 달린 삼각 플라스크", "가지달린삼각플라스크", "가지달린 삼각플라스크"] },
  { category: "공통-일반교구", name: "감압 실험 용기", spec: "1 L 내외, 펌프 포함", requirement: "4학생당 1", type: "권장", keywords: ["감압 실험 용기", "감압실험용기", "감압용기", "진공 용기"] },
  { category: "공통-일반교구", name: "금속 비커", spec: "약 200 mL", requirement: "2학생당 1", type: "필수", keywords: ["금속 비커", "금속비커", "스테인리스 비커"] },
  { category: "공통-일반교구", name: "공구 세트", spec: "십자, 일자 드라이버, 펜치, 니퍼, 플라이어, 망치, 쇠톱, 줄셋트, 아크릴칼", requirement: "학교당 2", type: "필수", keywords: ["공구 세트", "공구세트", "드라이버", "공구"] },
  { category: "공통-일반교구", name: "금속판", spec: "구리판, 아연판, 철판 등", requirement: "4학생당 1", type: "필수", keywords: ["금속판", "구리판", "아연판", "철판"] },
  { category: "공통-일반교구", name: "깔때기", spec: "약 ø60 mm, 유리(플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["깔때기"] },
  { category: "공통-일반교구", name: "깔때기대", spec: "2구용, 목제 또는 플라스틱제", requirement: "4학생당 1", type: "필수", keywords: ["깔때기대", "깔때기 대"] },
  { category: "공통-일반교구", name: "냉장고", spec: "600 L 이상", requirement: "학교당 1", type: "필수", keywords: ["냉장고"] },
  { category: "공통-일반교구", name: "다용도 홈판", spec: "3종(6~96 well)", requirement: "2학생당 1", type: "필수", keywords: ["다용도 홈판", "다용도홈판", "홈판", "well 플레이트", "웰 플레이트"] },
  { category: "공통-일반교구", name: "돋보기", spec: "ø60 mm 이상, 6x 이상, 손잡이부", requirement: "2학생당 1", type: "필수", keywords: ["돋보기", "확대경", "루페"] },
  { category: "공통-일반교구", name: "링", spec: "ø50~100 mm, 홀더 포함", requirement: "4학생당 1", type: "필수", keywords: ["링", "링 클램프", "스탠드링"] },
  { category: "공통-일반교구", name: "막자사발", spec: "ø100 mm 이상, 막자포함", requirement: "4학생당 1", type: "필수", keywords: ["막자사발", "막자", "절구"] },
  { category: "공통-일반교구", name: "분무기", spec: "약 300 mL", requirement: "4학생당 1", type: "권장", keywords: ["분무기"] },
  { category: "공통-일반교구", name: "비커", spec: "각종(50∼1,000 mL)", requirement: "4학생당 1", type: "필수", keywords: ["비커", "유리 비커", "유리비커", "플라스틱 비커"] },
  { category: "공통-일반교구", name: "삼각 플라스크", spec: "각종(50∼500 mL)", requirement: "4학생당 1", type: "권장", keywords: ["삼각 플라스크", "삼각플라스크", "삼각형 플라스크"] },
  { category: "공통-일반교구", name: "삼각대", spec: "30x30x185 mm, 2단", requirement: "4학생당 1", type: "필수", keywords: ["삼각대", "삼발이"] },
  { category: "공통-일반교구", name: "솔", spec: "시험관, 비커, 피펫 세척용", requirement: "4학생당 1", type: "필수", keywords: ["솔", "세척용 솔", "시험관 솔", "비커 솔"] },
  { category: "공통-일반교구", name: "수조(사각)", spec: "250x150x150 mm 이상", requirement: "4학생당 1", type: "권장", keywords: ["수조 사각", "사각수조", "사각 수조"] },
  { category: "공통-일반교구", name: "수조(원형)", spec: "ø200 mm 이상", requirement: "4학생당 1", type: "필수", keywords: ["수조", "수조 원형", "원형수조", "원형 수조", "물통"] },
  { category: "공통-일반교구", name: "스마트 기기", spec: "", requirement: "1학생당 1", type: "필수", keywords: ["스마트 기기", "스마트기기", "태블릿", "스마트폰", "노트북", "PC", "패드"] },
  { category: "공통-일반교구", name: "스포이트", spec: "유리(5∼10 mL)", requirement: "4학생당 1", type: "필수", keywords: ["스포이트", "스포이드"] },
  { category: "공통-일반교구", name: "시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["시험관", "유리 시험관"] },
  { category: "공통-일반교구", name: "시험관 집게", spec: "철제 또는 목제", requirement: "2학생당 1", type: "필수", keywords: ["시험관 집게", "시험관집게"] },
  { category: "공통-일반교구", name: "시험관대", spec: "", requirement: "4학생당 1", type: "필수", keywords: ["시험관대", "시험관 대"] },
  { category: "공통-일반교구", name: "약숟가락", spec: "스테인리스 강제", requirement: "4학생당 1", type: "권장", keywords: ["약숟가락", "시약스푼", "약 숟가락", "약스푼"] },
  { category: "공통-일반교구", name: "유리 막대", spec: "ø5 mm, 길이 약 300 mm", requirement: "4학생당 1", type: "필수", keywords: ["유리 막대", "유리막대"] },
  { category: "공통-일반교구", name: "유리관", spec: "ø5 mm 정도, 길이 약 5 cm", requirement: "4학생당 1", type: "필수", keywords: ["유리관", "유리 관"] },
  { category: "공통-일반교구", name: "적외선등", spec: "150 W 이상", requirement: "4학생당 1", type: "필수", keywords: ["적외선등", "적외선 등", "적외선 전구", "적외선램프"] },
  { category: "공통-일반교구", name: "전기스탠드", spec: "AC, 광량조절식", requirement: "4학생당 1", type: "필수", keywords: ["전기스탠드", "전기 스탠드", "조명 스탠드", "스탠드 조명"] },
  { category: "공통-일반교구", name: "전기포트", spec: "AC 220 V, 2 L 정도", requirement: "실험실당 2", type: "필수", keywords: ["전기포트", "전기 포트", "전기 주전자"] },
  { category: "공통-일반교구", name: "전열기(또는 핫플레이트)", spec: "AC, 500∼1,000 W", requirement: "4학생당 1", type: "필수", keywords: ["전열기", "핫플레이트", "가열 장치", "가열장치", "히터", "전기 가열기"] },
  { category: "공통-일반교구", name: "점적병1", spec: "백색 2종(50 mL, 100 mL) 1조", requirement: "4학생당 1", type: "필수", keywords: ["점적병", "점적 병", "시약병 점적", "드롭퍼 병"] },
  { category: "공통-일반교구", name: "점적병2", spec: "갈색 2종(50 mL, 100 mL) 1조", requirement: "4학생당 1", type: "필수", keywords: ["갈색 점적병", "갈색점적병", "갈색 시약병"] },
  { category: "공통-일반교구", name: "점화기", spec: "압전식", requirement: "4학생당 1", type: "필수", keywords: ["점화기", "라이터", "가스 점화기", "압전식 점화기"] },
  { category: "공통-일반교구", name: "주사기", spec: "각종(20∼50mL), 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["주사기", "플라스틱 주사기"] },
  { category: "공통-일반교구", name: "증발 접시", spec: "ø60 mm 이상", requirement: "4학생당 1", type: "필수", keywords: ["증발 접시", "증발접시", "증발 dish"] },
  { category: "공통-일반교구", name: "증발 접시 집게", spec: "ø200 mm 정도, 스테인리스", requirement: "4학생당 1", type: "필수", keywords: ["증발 접시 집게", "증발접시집게", "도가니 집게"] },
  { category: "공통-일반교구", name: "집게", spec: "홀더 포함, 스탠드 고정용", requirement: "4학생당 1", type: "필수", keywords: ["집게", "클램프", "스탠드 집게"] },
  { category: "공통-일반교구", name: "철제스탠드", spec: "높이 600 mm 이상, 클램프 포함, 철제", requirement: "4학생당 1", type: "필수", keywords: ["철제스탠드", "스탠드", "철제 스탠드", "스텐드", "가열용 스탠드", "실험용 스탠드"] },
  { category: "공통-일반교구", name: "투명한 플라스틱 관", spec: "ø10 cm, 길이1 m", requirement: "4학생당 1", type: "권장", keywords: ["투명한 플라스틱 관", "투명 플라스틱 관", "투명관", "플라스틱 관"] },
  { category: "공통-일반교구", name: "페트리 접시", spec: "ø100∼150 mm, 유리 또는 PVC", requirement: "2학생당 1", type: "필수", keywords: ["페트리 접시", "페트리접시"] },
  { category: "공통-일반교구", name: "핀셋", spec: "스테인리스 강제", requirement: "4학생당 1", type: "권장", keywords: ["핀셋", "핀셑"] },
  { category: "공통-일반교구", name: "헤어드라이어", spec: "AC 220 V, 냉온 겸용", requirement: "4학생당 1", type: "필수", keywords: ["헤어드라이어", "드라이어", "드라이기"] },

  // ── 공통-측정교구 ──────────────────────────────────────────────────────────
  { category: "공통-측정교구", name: "MBL 인터페이스", spec: "MBL용", requirement: "4학생당 1", type: "권장", keywords: ["MBL 인터페이스", "MBL인터페이스", "MBL", "인터페이스"] },
  { category: "공통-측정교구", name: "각도기", spec: "약 ø200 mm", requirement: "4학생당 1", type: "필수", keywords: ["각도기"] },
  { category: "공통-측정교구", name: "눈금실린더", spec: "각종(10∼1,000 mL)", requirement: "4학생당 1", type: "필수", keywords: ["눈금실린더", "메스실린더", "눈금 실린더"] },
  { category: "공통-측정교구", name: "눈금피펫", spec: "각종(5∼25 mL)", requirement: "4학생당 1", type: "필수", keywords: ["눈금피펫", "눈금 피펫", "메스피펫"] },
  { category: "공통-측정교구", name: "디지털 온도계", spec: "접촉식, 온도 범위 약 -40~200 ℃", requirement: "4학생당 1", type: "필수", keywords: ["디지털 온도계", "디지털온도계"] },
  { category: "공통-측정교구", name: "센서(가속도)", spec: "유선 또는 무선", requirement: "4학생당 1", type: "확장", keywords: ["센서 가속도", "가속도 센서", "가속도센서"] },
  { category: "공통-측정교구", name: "센서(근전도)", spec: "20 Hz~500 Hz 내외", requirement: "4학생당 1", type: "확장", keywords: ["센서 근전도", "근전도 센서", "근전도센서", "EMG 센서"] },
  { category: "공통-측정교구", name: "센서(기체 압력)", spec: "0~2 atm 내외, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["센서 기체 압력", "기체 압력 센서", "기체압력센서", "압력 센서", "압력센서"] },
  { category: "공통-측정교구", name: "센서(온도)", spec: "온도 범위 약 -40~125 ℃, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["센서 온도", "온도 센서", "온도센서", "MBL 온도 센서", "무선 온도 센서"] },
  { category: "공통-측정교구", name: "센서(이산화 탄소)", spec: "0~5,000 ppm, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["센서 이산화탄소", "이산화탄소 센서", "이산화탄소센서", "CO2 센서", "CO2센서"] },
  { category: "공통-측정교구", name: "알코올 온도계", spec: "온도 범위 약 -20~110 ℃", requirement: "4학생당 1", type: "필수", keywords: ["알코올 온도계", "알코올온도계", "온도계", "유리 온도계"] },
  { category: "공통-측정교구", name: "열화상 카메라", spec: "온도 범위 약 -25~550 ℃", requirement: "4학생당 1", type: "필수", keywords: ["열화상 카메라", "열화상카메라", "적외선 카메라"] },
  { category: "공통-측정교구", name: "자1", spec: "1 m", requirement: "4학생당 1", type: "필수", keywords: ["1m 자", "1 m 자", "미터 자", "막대자", "1미터 자"] },
  { category: "공통-측정교구", name: "자2", spec: "30 cm", requirement: "2학생당 1", type: "필수", keywords: ["30cm 자", "30 cm 자", "플라스틱 자", "삼각자"] },
  { category: "공통-측정교구", name: "전자저울", spec: "칭량 100∼500 g, 감량 0.1 g", requirement: "4학생당 1", type: "필수", keywords: ["전자저울", "저울", "전자 저울", "디지털 저울"] },
  { category: "공통-측정교구", name: "초시계", spec: "디지털, 1/100초", requirement: "4학생당 1", type: "필수", keywords: ["초시계", "스톱워치"] },
  { category: "공통-측정교구", name: "피펫 필러", spec: "슬라이딩식 또는 스포이트식", requirement: "4학생당 1", type: "필수", keywords: ["피펫 필러", "피펫필러", "피펫 빨개", "안전 피펫"] },

  // ── 운동과 에너지 ──────────────────────────────────────────────────────────
  { category: "운동과 에너지", name: "간이 스위치", spec: "DC용", requirement: "4학생당 1", type: "필수", keywords: ["간이 스위치", "간이스위치", "스위치"] },
  { category: "운동과 에너지", name: "거울(볼록)", spec: "ø76 mm 이상", requirement: "4학생당 1", type: "필수", keywords: ["볼록 거울", "볼록거울", "거울 볼록"] },
  { category: "운동과 에너지", name: "거울(오목)", spec: "ø76 mm 이상", requirement: "4학생당 1", type: "필수", keywords: ["오목 거울", "오목거울", "거울 오목"] },
  { category: "운동과 에너지", name: "거울(평면)", spec: "100x150 mm 내외", requirement: "4학생당 1", type: "필수", keywords: ["평면 거울", "평면거울", "거울", "거울 평면"] },
  { category: "운동과 에너지", name: "고리 달린 나무 도막", spec: "약 100x70x10 mm, 양쪽 걸고리부", requirement: "4학생당 1", type: "권장", keywords: ["고리 달린 나무 도막", "나무 도막", "나무도막"] },
  { category: "운동과 에너지", name: "나침반", spec: "ø50 mm정도, 방위각 명시", requirement: "1학생당 1", type: "필수", keywords: ["나침반", "방위 나침반"] },
  { category: "운동과 에너지", name: "니크롬선", spec: "3종(100 W, 200 W, 300 W용) 1조", requirement: "4학생당 1", type: "필수", keywords: ["니크롬선", "니크롬 선"] },
  { category: "운동과 에너지", name: "대류관", spec: "약 175x15x250 mm, 약 90mL 용량", requirement: "4학생당 1", type: "권장", keywords: ["대류관", "대류 관"] },
  { category: "운동과 에너지", name: "렌즈(볼록)", spec: "ø76 mm 이상", requirement: "4학생당 1", type: "필수", keywords: ["볼록 렌즈", "볼록렌즈", "렌즈 볼록", "볼록렌즈"] },
  { category: "운동과 에너지", name: "렌즈(오목)", spec: "ø76 mm 이상", requirement: "4학생당 1", type: "필수", keywords: ["오목 렌즈", "오목렌즈", "렌즈 오목"] },
  { category: "운동과 에너지", name: "센서(힘)", spec: "-80~80 N 내외", requirement: "4학생당 1", type: "필수", keywords: ["센서 힘", "힘 센서", "힘센서", "포스 센서"] },
  { category: "운동과 에너지", name: "소리굽쇠", spec: "6종 세트", requirement: "4학생당 1", type: "권장", keywords: ["소리굽쇠", "음차"] },
  { category: "운동과 에너지", name: "속력 측정기", spec: "60x60x50 mm", requirement: "2학생당 1", type: "필수", keywords: ["속력 측정기", "속력측정기", "속도 측정기", "포토게이트"] },
  { category: "운동과 에너지", name: "손전등", spec: "광량 조절식", requirement: "4학생당 1", type: "필수", keywords: ["손전등", "후레쉬", "랜턴"] },
  { category: "운동과 에너지", name: "쇠구슬", spec: "ø10 mm이상, 질량 2종류 이상", requirement: "4학생당 1", type: "필수", keywords: ["쇠구슬", "금속 구슬", "철구슬"] },
  { category: "운동과 에너지", name: "역학용 금속추", spec: "20∼500 g, 고리부, 5종 1조", requirement: "4학생당 1", type: "필수", keywords: ["역학용 금속추", "금속추", "추", "역학 추"] },
  { category: "운동과 에너지", name: "연결용 도선", spec: "길이 300 mm 이상, 집게, 플러그부", requirement: "4학생당 6", type: "필수", keywords: ["연결용 도선", "도선", "전선", "전기 도선", "집게 달린 전선"] },
  { category: "운동과 에너지", name: "열량계", spec: "온도계, 교반기 포함", requirement: "4학생당 1", type: "필수", keywords: ["열량계", "열량 계"] },
  { category: "운동과 에너지", name: "용수철", spec: "길이 약 200 mm, 탄성률 20∼50 g중 / 10 mm", requirement: "4학생당 1", type: "필수", keywords: ["용수철", "스프링"] },
  { category: "운동과 에너지", name: "자기장 실험 세트", spec: "3종 1조(직선, 원형, 솔레노이드)", requirement: "4학생당 1", type: "필수", keywords: ["자기장 실험 세트", "자기장실험세트", "전자기 실험"] },
  { category: "운동과 에너지", name: "전류계", spec: "DC 0∼0.5 mA, 0∼5 A 겸용", requirement: "4학생당 1", type: "필수", keywords: ["전류계", "전류 계", "암미터"] },
  { category: "운동과 에너지", name: "전압계", spec: "DC 0∼1.5 V, 0∼15 V 겸용", requirement: "4학생당 1", type: "필수", keywords: ["전압계", "전압 계", "볼트미터"] },
  { category: "운동과 에너지", name: "직류전원장치", spec: "출력 50 W이상, DC 0∼24 V 연속가변", requirement: "4학생당 1", type: "필수", keywords: ["직류전원장치", "직류 전원장치", "전원 장치", "DC 전원장치", "전원공급기"] },

  // ── 물질 ──────────────────────────────────────────────────────────────────
  { category: "물질", name: "분별 깔때기", spec: "250 mL", requirement: "4학생당 1", type: "필수", keywords: ["분별 깔때기", "분별깔때기"] },
  { category: "물질", name: "뷰렛 집게", spec: "홀더 포함", requirement: "4학생당 1", type: "권장", keywords: ["뷰렛 집게", "뷰렛집게"] },
  { category: "물질", name: "뷰렛", spec: "백색, 50 mL", requirement: "4학생당 1", type: "권장", keywords: ["뷰렛"] },
  { category: "물질", name: "시약병", spec: "250∼500 mL, 광구, 백색 또는 갈색", requirement: "4학생당 1", type: "필수", keywords: ["시약병", "시약 병", "갈색 시약병", "백색 시약병"] },

  // ── 생명 ──────────────────────────────────────────────────────────────────
  { category: "생명", name: "고무망치", spec: "고무, 스테인리스제 손잡이", requirement: "4학생당 1", type: "필수", keywords: ["고무망치", "고무 망치"] },
  { category: "생명", name: "멀티미디어 영상 현미경", spec: "CCD카메라, 어댑터, 케이블", requirement: "실험실당 1", type: "권장", keywords: ["멀티미디어 영상 현미경", "영상 현미경", "CCD 현미경"] },
  { category: "생명", name: "영구표본(검정말)", spec: "", requirement: "2학생당 1", type: "권장", keywords: ["영구표본 검정말", "검정말 표본", "검정말 영구표본"] },
  { category: "생명", name: "영구표본(구강 상피세포)", spec: "", requirement: "2학생당 1", type: "필수", keywords: ["영구표본 구강 상피세포", "구강 상피세포 표본", "상피세포 표본"] },
  { category: "생명", name: "영구표본(식물 체세포 분열)", spec: "", requirement: "2학생당 1", type: "권장", keywords: ["영구표본 식물 체세포 분열", "체세포 분열 표본", "양파 세포분열 표본"] },
  { category: "생명", name: "영구표본(신경세포)", spec: "", requirement: "2학생당 1", type: "필수", keywords: ["영구표본 신경세포", "신경세포 표본"] },
  { category: "생명", name: "영구표본(적혈구)", spec: "", requirement: "2학생당 1", type: "필수", keywords: ["영구표본 적혈구", "적혈구 표본"] },
  { category: "생명", name: "영구표본(짚신벌레)", spec: "", requirement: "2학생당 1", type: "권장", keywords: ["영구표본 짚신벌레", "짚신벌레 표본"] },
  { category: "생명", name: "폐운동 원리 실험장치", spec: "플라스틱 병, 고무풍선, 고무막", requirement: "4학생당 1", type: "권장", keywords: ["폐운동 원리 실험장치", "폐운동 실험장치", "폐모형", "폐 모형"] },
  { category: "생명", name: "해부침", spec: "2개 세트", requirement: "1학생당 1", type: "필수", keywords: ["해부침", "해부 침", "해부 세트"] },
  { category: "생명", name: "현미경(광학)", spec: "접안렌즈10x,15x, 대물렌즈 10x, 40x, 60x, 광원장치부착", requirement: "4학생당 1", type: "필수", keywords: ["현미경", "광학 현미경", "광학현미경", "생물 현미경"] },
  { category: "생명", name: "현미경(실체)", spec: "10x~40x", requirement: "4학생당 1", type: "권장", keywords: ["실체 현미경", "실체현미경", "해부 현미경"] },

  // ── 지구와 우주 ────────────────────────────────────────────────────────────
  { category: "지구와 우주", name: "건습구 습도계", spec: "-20∼50 ℃", requirement: "4학생당 1", type: "권장", keywords: ["건습구 습도계", "건습구습도계", "습도계", "건습구 온도계"] },
  { category: "지구와 우주", name: "광물 결정구조 표본", spec: "320x200x45 mm(7종 1조)", requirement: "4학생당 1", type: "권장", keywords: ["광물 결정구조 표본", "결정구조 표본", "광물 결정 표본"] },
  { category: "지구와 우주", name: "광물 표본", spec: "ø40 mm 이상(20종 1조)", requirement: "4학생당 1", type: "필수", keywords: ["광물 표본", "광물표본"] },
  { category: "지구와 우주", name: "구름 발생 장치 실험 세트", spec: "디지털 온도계 포함, 아크릴타입", requirement: "4학생당 1", type: "필수", keywords: ["구름 발생 장치", "구름발생장치", "구름 발생 실험"] },
  { category: "지구와 우주", name: "기압계", spec: "ø150×55 mm, 아네로이드식", requirement: "4학생당 1", type: "권장", keywords: ["기압계", "아네로이드 기압계"] },
  { category: "지구와 우주", name: "망원경 스마트폰 거치대", spec: "", requirement: "학교당 2", type: "권장", keywords: ["망원경 스마트폰 거치대", "망원경 거치대"] },
  { category: "지구와 우주", name: "모스 굳기계", spec: "10종 1조", requirement: "4학생당 1", type: "필수", keywords: ["모스 굳기계", "모스굳기계", "굳기 실험 세트", "경도 시험"] },
  { category: "지구와 우주", name: "방해석 투명 결정", spec: "20x30 mm", requirement: "4학생당 1", type: "권장", keywords: ["방해석 투명 결정", "방해석", "방해석 결정"] },
  { category: "지구와 우주", name: "변성암 표본", spec: "ø70 mm 이상(10종 1조)", requirement: "4학생당 1", type: "필수", keywords: ["변성암 표본", "변성암표본"] },
  { category: "지구와 우주", name: "삼구의", spec: "태양, 지구, 달 회전식", requirement: "학교당 2", type: "권장", keywords: ["삼구의"] },
  { category: "지구와 우주", name: "성운 성단 사진 세트", spec: "30매 이상", requirement: "4학생당 1", type: "권장", keywords: ["성운 성단 사진 세트", "성운 사진", "성단 사진"] },
  { category: "지구와 우주", name: "수온의 연직분포 실험 세트", spec: "수조 크기 약 150x250 mm, 온도계 홀더 포함", requirement: "4학생당 1", type: "필수", keywords: ["수온의 연직분포 실험 세트", "연직분포 실험", "수온 연직분포"] },
  { category: "지구와 우주", name: "쌍안경", spec: "ø50 mm 이상", requirement: "학교당 2", type: "권장", keywords: ["쌍안경"] },
  { category: "지구와 우주", name: "조흔색 실험 광물 표본", spec: "275×200×45 mm(6종 1조)", requirement: "4학생당 1", type: "필수", keywords: ["조흔색 실험 광물 표본", "조흔색 표본", "조흔판 실험"] },
  { category: "지구와 우주", name: "조흔판", spec: "초벌구이판", requirement: "4학생당 1", type: "필수", keywords: ["조흔판"] },
  { category: "지구와 우주", name: "지학망치", spec: "", requirement: "4학생당 1", type: "권장", keywords: ["지학망치", "지질 망치", "암석 망치"] },
  { category: "지구와 우주", name: "천체 망원경", spec: "굴절식 또는 반사식, x10~x100", requirement: "학교당 2", type: "필수", keywords: ["천체 망원경", "천체망원경", "망원경"] },
  { category: "지구와 우주", name: "태양 투영판", spec: "ø200 mm 이상", requirement: "학교당 2", type: "권장", keywords: ["태양 투영판", "태양투영판"] },
  { category: "지구와 우주", name: "태양 필터", spec: "대물렌즈용, 보조 망원경용", requirement: "학교당 2", type: "필수", keywords: ["태양 필터", "태양필터"] },
  { category: "지구와 우주", name: "퇴적암 표본", spec: "ø70 mm 이상(10종 1조)", requirement: "4학생당 1", type: "필수", keywords: ["퇴적암 표본", "퇴적암표본"] },
  { category: "지구와 우주", name: "화성암 표본", spec: "ø70 mm 이상(10종 1조)", requirement: "4학생당 1", type: "필수", keywords: ["화성암 표본", "화성암표본"] },
  { category: "지구와 우주", name: "휴대용 조도계", spec: "디지털식", requirement: "4학생당 1", type: "권장", keywords: ["휴대용 조도계", "조도계", "빛 측정기", "럭스 미터"] },

  // ── 안전장구 ──────────────────────────────────────────────────────────────
  { category: "안전장구", name: "(안전)장갑", spec: "1회용 (폴리에틸렌, 라텍스, 나이트릴)", requirement: "1학생당 1", type: "필수", keywords: ["장갑", "안전장갑", "실험용 장갑", "라텍스 장갑", "니트릴 장갑", "일회용 장갑", "폴리에틸렌 장갑"] },
  { category: "안전장구", name: "내열장갑", spec: "내열온도 200 ℃", requirement: "학교당 6", type: "필수", keywords: ["내열장갑", "내열 장갑", "화상 방지 장갑"] },
  { category: "안전장구", name: "내화학장갑", spec: "총 길이 30 cm 이상, 나이트릴피복 등", requirement: "학교당 6", type: "필수", keywords: ["내화학장갑", "내화학 장갑", "화학 장갑"] },
  { category: "안전장구", name: "마스크1", spec: "일반 또는 방진용", requirement: "1학생당 1", type: "필수", keywords: ["마스크", "방진 마스크", "일반 마스크"] },
  { category: "안전장구", name: "마스크2", spec: "방독", requirement: "1학생당 1", type: "필수", keywords: ["방독 마스크", "방독마스크", "방독면"] },
  { category: "안전장구", name: "방염담요", spec: "", requirement: "실험실당 2", type: "필수", keywords: ["방염담요", "방염 담요", "소화 담요"] },
  { category: "안전장구", name: "보안경1", spec: "안경식", requirement: "1학생당 1", type: "필수", keywords: ["보안경", "안전경", "보호 안경"] },
  { category: "안전장구", name: "보안경2", spec: "레이저 보안경", requirement: "1학생당 1", type: "필수", keywords: ["레이저 보안경", "레이저보안경", "레이저 안전경"] },
  { category: "안전장구", name: "보안경3", spec: "고글식", requirement: "학교당 30", type: "권장", keywords: ["고글", "고글식 보안경"] },
  { category: "안전장구", name: "학생용 실험복", spec: "면소재 실험복", requirement: "1학생당 1", type: "필수", keywords: ["실험복", "학생용 실험복", "가운"] },
];

// 차단할 소모품/시약 블랙리스트 키워드
const EXCLUDED_KEYWORDS = [
  '거름종이', '거름 종이', '시약포지', '약포지', '시약 포지', '약 포지',
  '유산지', '리트머스', 'pH시험지', '시약', '용액', '물', '얼음',
  '에탄올', '메탄올', '가루', '소금', '설탕', '모래', '색소'
];

// ─── API 키 입력 화면 ───────────────────────────────────────────────────────
function ApiKeyScreen({ onSave }) {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setError('API 키를 입력해주세요.');
      return;
    }
 
    localStorage.setItem('gemini_api_key', trimmed);
    onSave(trimmed);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <KeyRound size={24} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">🔬 과학교구 분석기</h1>
        </div>

        <p className="text-slate-500 text-sm mt-3 mb-6 leading-relaxed">
          이 앱은 <strong>본인의 Gemini API 키</strong>를 사용하여 이미지를 분석합니다.<br />
          키는 이 기기의 브라우저에만 저장되며, 외부 서버로 전송되지 않습니다.
        </p>

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Gemini API Key
        </label>
        <input
          type="text"
          value={inputKey}
          onChange={(e) => { setInputKey(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="AIzaSy..."
          className="w-full border border-slate-300 rounded-xl px-4 py-3 font-mono text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && (
          <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
        {!error && <div className="mb-3" />}

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-3 rounded-xl font-medium transition-all text-sm"
        >
          저장하고 시작하기
        </button>

        <p className="text-xs text-slate-400 mt-5 text-center leading-relaxed">
          API 키가 없으신가요?{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline underline-offset-2"
          >
            Google AI Studio
          </a>
          에서 무료로 발급받을 수 있습니다.
        </p>
      </div>
    </div>
  );
}

// ─── 메인 앱 ────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [textbooks, setTextbooks] = useState([]);
  const [copyState, setCopyState] = useState('idle');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const fileInputRef = useRef(null);

  // ── API 키 없으면 입력 화면 표시 ──
  if (!apiKey) {
    return <ApiKeyScreen onSave={setApiKey} />;
  }

  const handleResetKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setTextbooks([]);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });

  const extractEquipmentFromImage = async (base64Data, mimeType) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const promptText = `
    당신은 텍스트 판독 및 과학교구 추출 전문가입니다.
    업로드된 이미지는 교과서 실험의 '준비물' 텍스트 부분만 아주 얇게 잘라낸 캡처 조각이거나 전체 페이지입니다.

    [핵심 임무]
    1. 2022 개정 과학교구 설비 기준표에 해당하는 정식 교구(비커, 온도계, 스마트 기기 등)와 일반 도구(가위, 자, 테이프 등)만 추출하세요.
    2. [강력 제외] 물, 에탄올, 시약 등의 '액체/화학 물질'과 거름종이, 시약포지, 약포지 등 1회성 '소모품류'는 목록에서 절대 추출하지 마세요.

    결과는 반드시 제공된 JSON 스키마에 따라 'equipment' 배열로 응답하세요.
    `;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: promptText }, { inlineData: { mimeType, data: base64Data } }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: { equipment: { type: 'ARRAY', items: { type: 'STRING' } } },
          required: ['equipment'],
        },
      },
    };

    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`API 통신 에러 (${response.status})`);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          try {
            const parsed = JSON.parse(text);
            const rawEquipment = parsed.equipment || [];
            return rawEquipment.filter((item) => {
              const normalizedItem = item.replace(/\s+/g, '');
              return !EXCLUDED_KEYWORDS.some((kw) => normalizedItem.includes(kw.replace(/\s+/g, '')));
            });
          } catch {
            return [];
          }
        }
        return [];
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise((r) => setTimeout(r, delays[i]));
      }
    }
  };

  // 자석(소모품), 자석젓개/자석교반기(기준표 외) 제외
  const MAGNET_EXCLUDE = ['자석젓개', '자석 젓개', '자석교반기', '자석 교반기', '자석',
    '전선집게', '전선 집게', '집게달린전선', '집게 달린 전선', 'L자전극', 'L 자 전극', 'L자 전극',
    '금속집게', '금속 집게'];

  const mapToStandardDb = (extractedItems) => {
    const filtered = extractedItems.filter((item) => {
      const n = item.replace(/\s+/g, '');
      return !MAGNET_EXCLUDE.some((kw) => n === kw.replace(/\s+/g, ''));
    });

    const mapped = filtered.map((item) => {
      const normalizedItem = item.replace(/\s+/g, '');
      let found = null;

      found = STANDARD_EQUIPMENT.find((std) =>
        std.keywords.some((kw) => normalizedItem === kw.replace(/\s+/g, ''))
      );

      if (!found) {
        found = STANDARD_EQUIPMENT.find((std) =>
          std.keywords.some((kw) => {
            const normalizedKw = kw.replace(/\s+/g, '');
            if (normalizedKw === '장갑' && normalizedItem.includes('내열')) return false;
            if (normalizedKw === '장갑' && normalizedItem.includes('고무')) return false;
            if (normalizedKw === '장갑' && normalizedItem.includes('화학')) return false;
            if (normalizedKw === '집게' && normalizedItem.includes('시험관')) return false;
            if (normalizedKw === '집게' && normalizedItem.includes('증발')) return false;
            if (normalizedKw === '집게' && normalizedItem.includes('전선')) return false;
            if (normalizedKw === '집게' && normalizedItem.includes('금속')) return false;
            if (normalizedKw === '수조' && normalizedItem.includes('사각')) return false;
            if (normalizedKw === '수조' && normalizedItem.includes('원형')) return false;
            if (normalizedKw === '마스크' && normalizedItem.includes('방독')) return false;
            if (normalizedKw === '보안경' && normalizedItem.includes('레이저')) return false;
            if (normalizedKw === '보안경' && normalizedItem.includes('고글')) return false;
            if (normalizedKw === '자' && normalizedItem.includes('자석')) return false;
            return normalizedItem.includes(normalizedKw);
          })
        );
      }

      return { original: item, standard: found || null };
    });

    const uniqueMapped = [];
    const seen = new Set();
    mapped.forEach((item) => {
      const key = item.standard ? `std_${item.standard.name}` : `org_${item.original.replace(/\s+/g, '')}`;
      if (!seen.has(key)) { seen.add(key); uniqueMapped.push(item); }
    });

    uniqueMapped.sort((a, b) => {
      if (a.standard && !b.standard) return -1;
      if (!a.standard && b.standard) return 1;
      return 0;
    });

    return uniqueMapped;
  };

  const processFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      for (const file of files) {
        const tbId = Date.now() + Math.random();
        const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
        const isHwp = ext === 'hwp' || ext === 'hwpx';

        setTextbooks((prev) => {
          const title = `교과서 ${prev.length + 1}`;
          return [
            ...prev,
            {
              id: tbId, title, fileName: file.name || 'Pasted Content',
              imageUrl: URL.createObjectURL(file),
              isLoading: !isHwp, isHwp,
              isPdf: ext === 'pdf' || file.type === 'application/pdf',
              items: [], error: null,
            },
          ];
        });

        if (isHwp) {
          setTextbooks((prev) =>
            prev.map((tb) =>
              tb.id === tbId
                ? { ...tb, isLoading: false, error: 'HWP 파일은 화면을 캡처하여 Ctrl+V로 붙여넣어 주세요.' }
                : tb
            )
          );
          continue;
        }

        try {
          const base64 = await getBase64(file);
          let targetMimeType = file.type;
          if (ext === 'pdf') targetMimeType = 'application/pdf';
          if (!targetMimeType || (!targetMimeType.startsWith('image/') && targetMimeType !== 'application/pdf')) {
            targetMimeType = 'image/png';
          }

          const extracted = await extractEquipmentFromImage(base64, targetMimeType);
          const mappedItems = mapToStandardDb(extracted);

          setTextbooks((prev) =>
            prev.map((tb) => (tb.id === tbId ? { ...tb, isLoading: false, items: mappedItems } : tb))
          );
        } catch {
          setTextbooks((prev) =>
            prev.map((tb) =>
              tb.id === tbId
                ? { ...tb, isLoading: false, error: '서버와 통신 중 문제가 발생했습니다. 다시 시도해 주세요.' }
                : tb
            )
          );
        }
      }
    },
    [apiKey]
  );

  const handleFileUpload = (e) => {
    processFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const filesToProcess = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('pdf') !== -1) {
          const file = items[i].getAsFile();
          if (file) filesToProcess.push(file);
        }
      }
      if (filesToProcess.length > 0) processFiles(filesToProcess);
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  const removeTextbook = (id) => {
    setTextbooks((prev) =>
      prev.filter((tb) => tb.id !== id).map((tb, idx) => ({ ...tb, title: `교과서 ${idx + 1}` }))
    );
  };

  const generateAnalysisTable = () => {
    const aggregated = {};
    textbooks.forEach((tb) => {
      if (tb.isLoading || tb.error) return;
      tb.items.forEach((item) => {
        const key = item.standard ? item.standard.name : item.original;
        if (!aggregated[key]) {
          aggregated[key] = {
            category: item.standard ? item.standard.category : '기타 (기준표 외)',
            name: item.standard ? item.standard.name : item.original,
            spec: item.standard ? item.standard.spec : '-',
            requirement: item.standard ? item.standard.requirement : '-',
            type: item.standard ? item.standard.type : '-',
            textbooks: new Set(),
          };
        }
        aggregated[key].textbooks.add(tb.title);
      });
    });

    const resultTable = Object.values(aggregated).map((item) => {
      const isCommon =
        item.textbooks.size === textbooks.filter((t) => !t.error).length && item.textbooks.size > 1;
      return { ...item, remarks: isCommon ? '공통' : Array.from(item.textbooks).join(', ') };
    });

    const order = { '공통-일반교구': 1, '공통-측정교구': 2, '운동과 에너지': 3, '물질': 4, '생명': 5, '지구와 우주': 6, '안전장구': 7, '기타 (기준표 외)': 8 };
    resultTable.sort((a, b) => (order[a.category] || 5) - (order[b.category] || 5));
    return resultTable;
  };

  const analysisData = generateAnalysisTable();

  const copyToHWP = (withHeader = true) => {
    if (analysisData.length === 0) return;

    const escapeHtml = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapeTsv = (v) => String(v ?? '').replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');
    const HEADERS = ['영역', '교구 종목', '규격', '소요 기준', '분류', '비고'];

    const tsvLines = [];
    if (withHeader) tsvLines.push(HEADERS.map(escapeTsv).join('\t'));
    analysisData.forEach((row) => {
      tsvLines.push(
        [row.category, row.name, row.spec, row.requirement, row.type, row.remarks].map(escapeTsv).join('\t')
      );
    });
    const tsv = tsvLines.join('\r\n');

    let html = `<table border="1" style="border-collapse: collapse;">`;
    if (withHeader) {
      html += `<tr>${HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
    }
    analysisData.forEach((row) => {
      html += `<tr>${[row.category, row.name, row.spec, row.requirement, row.type, row.remarks]
        .map((v) => `<td>${escapeHtml(v)}</td>`)
        .join('')}</tr>`;
    });
    html += `</table>`;

    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const handleCopy = (e) => {
      e.clipboardData.setData('text/html', html);
      e.clipboardData.setData('text/plain', tsv);
      e.preventDefault();
    };
    container.addEventListener('copy', handleCopy);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
      setCopyState(withHeader ? 'copiedWithHeader' : 'copiedDataOnly');
      setTimeout(() => setCopyState('idle'), 3000);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    } finally {
      container.removeEventListener('copy', handleCopy);
      selection.removeAllRanges();
      document.body.removeChild(container);
    }
  };

  const handleCopyCardList = (tb) => {
    if (!tb.items || tb.items.length === 0) return;
    const listText = tb.items.map((item) => (item.standard ? item.standard.name : item.original)).join(', ');
    const textArea = document.createElement('textarea');
    textArea.value = listText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCardId(tb.id);
      setTimeout(() => setCopiedCardId(null), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              🔬 스마트 과학교구 분석기
            </h1>
            <p className="mt-2 text-slate-500">
              이미지 캡처 후 <strong>Ctrl+V</strong>를 누르면 2022 개정 기준에 맞게 추출됩니다. (소모품 자동 제외)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* API 키 변경 버튼 */}
            <button
              onClick={handleResetKey}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors border border-slate-200 hover:border-red-200 px-3 py-2 rounded-lg"
              title="API 키 변경"
            >
              <LogOut size={13} />
              API 키 변경
            </button>
            <input
              type="file"
              multiple
              accept="image/*, application/pdf, .pdf, .hwp, .hwpx"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
            >
              <Upload size={20} />
              파일 직접 선택
            </button>
          </div>
        </header>

        {/* Uploaded Textbooks Grid */}
        {textbooks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="text-blue-500" />
              분석 중인 교과서 현황
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textbooks.map((tb) => (
                <div key={tb.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{tb.title}</h3>
                    <button onClick={() => removeTextbook(tb.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="삭제">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-4 relative flex items-center justify-center border border-slate-200 border-dashed">
                    {tb.isPdf ? (
                      <div className="flex flex-col items-center justify-center text-rose-500 opacity-80">
                        <FileText size={36} className="mb-2" />
                        <span className="font-bold">PDF 문서</span>
                      </div>
                    ) : (
                      <img src={tb.imageUrl} alt={tb.title} className="w-full h-full object-contain bg-white opacity-90 p-2" />
                    )}
                    {tb.isLoading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <Loader2 className="animate-spin text-blue-600 mb-2" size={28} />
                        <span className="text-sm font-bold text-blue-800">도구 텍스트 판독 중...</span>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => !tb.isLoading && !tb.error && handleCopyCardList(tb)}
                    className={`flex-1 relative rounded-xl border transition-all ${
                      tb.isLoading || tb.error
                        ? 'border-transparent'
                        : 'border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm cursor-pointer group p-3 -mx-3'
                    }`}
                    title={!tb.isLoading && !tb.error ? '가로로 배열된 목록 복사하기 (, )' : ''}
                  >
                    <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1.5">
                      <h4 className="text-sm font-bold text-slate-600 group-hover:text-blue-700 transition-colors">AI 추출 결과</h4>
                      {!tb.isLoading && !tb.error && tb.items.length > 0 && (
                        <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Copy size={12} /> 가로 배열 복사
                        </span>
                      )}
                    </div>

                    {tb.isLoading ? (
                      <div className="space-y-2 mt-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    ) : tb.error ? (
                      <div className="flex items-start gap-2 text-rose-600 text-sm bg-rose-50 p-2.5 rounded-lg border border-rose-100 leading-tight font-medium mt-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{tb.error}</span>
                      </div>
                    ) : (
                      <ul className="text-sm space-y-2 overflow-y-auto max-h-44 pr-2 custom-scrollbar">
                        {tb.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            {item.standard ? (
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            ) : (
                              <HelpCircle size={16} className="text-slate-400 shrink-0" />
                            )}
                            <span className="text-slate-700 font-medium">{item.original}</span>
                            {item.standard ? (
                              item.standard.name !== item.original && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-auto flex-shrink-0 font-bold border border-blue-100">
                                  → {item.standard.name}
                                </span>
                              )
                            ) : (
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-auto flex-shrink-0 border border-slate-200">
                                기타 도구
                              </span>
                            )}
                          </li>
                        ))}
                        {tb.items.length === 0 && (
                          <li className="text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg">
                            추출된 교구가 없습니다. (소모품 제외됨)
                          </li>
                        )}
                      </ul>
                    )}

                    {copiedCardId === tb.id && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                        <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                          <CheckCircle2 size={16} /> 가로 배열 복사됨!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analysis Table Section */}
        {textbooks.length > 0 &&
          textbooks.filter((t) => !t.error).every((tb) => !tb.isLoading) &&
          analysisData.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">📊 2022 개정 기준 통합 교구 분석표</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    업로드된 내용 중 기준표에 없는 항목은{' '}
                    <span className="text-slate-700 font-medium bg-slate-100 px-1 rounded">기타 (기준표 외)</span>
                    로 표 하단에 모아서 표시됩니다.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
                  <button
                    onClick={() => copyToHWP(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${
                      copyState === 'copiedWithHeader'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {copyState === 'copiedWithHeader' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    {copyState === 'copiedWithHeader' ? '헤더 포함 복사완료' : '헤더 포함 복사'}
                  </button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button
                    onClick={() => copyToHWP(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${
                      copyState === 'copiedDataOnly'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-transparent text-slate-600 hover:bg-slate-200/50'
                    }`}
                    title="표의 뼈대가 이미 있을 때 내용만 채워넣기 좋습니다."
                  >
                    {copyState === 'copiedDataOnly' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    {copyState === 'copiedDataOnly' ? '데이터만 복사완료' : '데이터만 복사'}
                  </button>
                </div>
              </div>

              {copyState !== 'idle' && (
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                  <div className="text-sm text-emerald-800 leading-relaxed">
                    <strong>클립보드에 표 데이터가 완벽하게 복사되었습니다!</strong>
                    <br />
                    한글 문서에서 표를 생성할 위치에 <code>Ctrl+V</code>를 누르시면{' '}
                    <strong>각 항목이 독립된 칸(셀)에 정확히 나뉘어 들어갑니다.</strong>
                    <br />
                    <span className="text-emerald-600">
                      (기존에 만들어둔 표에 덮어쓰시려면, 표 전체를 <code>F5</code>로 블록 지정한 후 붙여넣으세요)
                    </span>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold w-36">영역</th>
                      <th className="px-6 py-4 font-semibold w-48">교구 종목</th>
                      <th className="px-6 py-4 font-semibold">규격</th>
                      <th className="px-6 py-4 font-semibold w-28 whitespace-nowrap">소요 기준</th>
                      <th className="px-6 py-4 font-semibold w-28 text-center">분류</th>
                      <th className="px-6 py-4 font-semibold w-48">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisData.map((row, idx) => {
                      const isOther = row.category === '기타 (기준표 외)';
                      return (
                        <tr key={idx} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${isOther ? 'bg-slate-50/30' : 'bg-white'}`}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                            {isOther ? <span className="text-slate-400">기타 (기준 외)</span> : row.category.replace('공통-', '')}
                          </td>
                          <td className={`px-6 py-4 font-bold ${isOther ? 'text-slate-600' : 'text-slate-800'}`}>{row.name}</td>
                          <td className="px-6 py-4 text-slate-500">{row.spec}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">{row.requirement}</td>
                          <td className="px-6 py-4 text-center">
                            {isOther ? (
                              <span className="text-slate-400">-</span>
                            ) : (
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                row.type === '필수' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {row.type}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${row.remarks === '공통' ? 'text-blue-600' : 'text-slate-500'}`}>
                              {row.remarks}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        {/* Empty State */}
        {textbooks.length === 0 && (
          <div
            className="text-center py-24 px-6 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/80 transition-all hover:bg-slate-100/50 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="bg-white w-24 h-24 rounded-full flex flex-col items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <ClipboardPaste className="text-blue-600 mb-1" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">화면 캡처 후 Ctrl + V</h3>
            <p className="text-slate-500 max-w-lg mx-auto text-base">
              준비물 텍스트 한 줄만 캡처해도 완벽하게 인식합니다.
              <br />
              화면 아무 곳에서나 <strong>Ctrl+V</strong>를 눌러 분석을 시작하세요.
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
}
