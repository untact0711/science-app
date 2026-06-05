import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, CheckCircle2, Loader2, AlertCircle, ClipboardPaste, FileText, HelpCircle, KeyRound, LogOut, FlaskConical } from 'lucide-react';

const STANDARD_EQUIPMENT = [
  { category: "공통-측정교구", name: "전자저울", spec: "칭량 100~500 g, 감량 0.1 g", requirement: "4학생당 1", type: "필수", keywords: ["전자저울", "저울"] },
  { category: "공통-측정교구", name: "디지털 온도계", spec: "접촉식, 온도범위 약 -40~200 ℃", requirement: "4학생당 1", type: "필수", keywords: ["디지털 온도계", "디지털온도계"] },
  { category: "공통-측정교구", name: "센서(온도)", spec: "온도 범위 약 -40~125 ℃, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["온도 센서", "무선 온도 센서", "MBL 온도 센서", "온도센서", "온도 측정기"] },
  { category: "공통-측정교구", name: "온도계", spec: "알코올, -10~100 ℃ 이상", requirement: "4학생당 1", type: "필수", keywords: ["온도계", "알코올 온도계", "유리 온도계"] },
  { category: "공통-측정교구", name: "초시계", spec: "디지털식", requirement: "4학생당 1", type: "권장", keywords: ["초시계", "스톱워치"] },
  { category: "공통-측정교구", name: "줄자", spec: "2m 이상", requirement: "4학생당 1", type: "필수", keywords: ["줄자", "자", "플라스틱 자", "막대자", "30cm 자"] },
  { category: "공통-일반교구", name: "비커", spec: "각종(50~1,000mL)", requirement: "4학생당 1", type: "필수", keywords: ["비커", "유리 비커", "유리비커", "플라스틱 비커"] },
  { category: "공통-일반교구", name: "시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["시험관", "유리 시험관"] },
  { category: "공통-일반교구", name: "가지 달린 시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["가지 달린 시험관", "가지달린시험관"] },
  { category: "공통-일반교구", name: "플라스크", spec: "각종(삼각, 둥근바닥 등)", requirement: "4학생당 1", type: "필수", keywords: ["플라스크", "둥근바닥 플라스크", "삼각 플라스크", "둥근 바닥 플라스크", "삼각플라스크"] },
  { category: "공통-일반교구", name: "전열기(또는 핫플레이트)", spec: "AC, 500~1,000 W", requirement: "4학생당 1", type: "필수", keywords: ["전열기", "핫플레이트", "가열 장치", "가열장치"] },
  { category: "공통-일반교구", name: "철제스탠드", spec: "클램프, 링 등 부속품 포함", requirement: "4학생당 1조", type: "필수", keywords: ["철제스탠드", "스탠드", "철제 스탠드", "스텐드", "가열용 스탠드"] },
  { category: "공통-일반교구", name: "끓음쪽", spec: "도자기 조각 등", requirement: "4학생당 1", type: "필수", keywords: ["끓음쪽", "비등석"] },
  { category: "공통-일반교구", name: "고무 마개", spec: "각종(구멍 뚫린 것 포함)", requirement: "4학생당 1조", type: "필수", keywords: ["고무 마개", "고무마개", "실리콘 마개", "실리콘마개"] },
  { category: "공통-일반교구", name: "페트리접시", spec: "유리 또는 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["페트리접시", "페트리 접시"] },
  { category: "공통-일반교구", name: "스마트 기기", spec: "태블릿 PC 등", requirement: "4학생당 1", type: "필수", keywords: ["스마트 기기", "스마트기기", "태블릿", "스마트폰", "노트북", "PC"] },
  { category: "공통-일반교구", name: "깔때기", spec: "약 Ø60 mm, 유리(플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["깔때기"] },
  { category: "공통-일반교구", name: "유리막대", spec: "Ø5 mm, 길이 약 300 mm", requirement: "4학생당 1", type: "필수", keywords: ["유리막대", "유리 막대"] },
  { category: "공통-일반교구", name: "약숟가락", spec: "스테인리스 강제", requirement: "4학생당 1", type: "권장", keywords: ["약숟가락", "시약스푼", "약 숟가락"] },
  { category: "공통-일반교구", name: "시험관 집게", spec: "철제 또는 목제", requirement: "2학생당 1", type: "필수", keywords: ["시험관 집게", "시험관집게", "집게"] },
  { category: "공통-일반교구", name: "교반기", spec: "자석식 교반기(가열 겸용 포함)", requirement: "4학생당 1", type: "권장", keywords: ["교반기", "자석 젓개", "자석교반기", "자석젓개"] },
  { category: "공통-일반교구", name: "시험관대", spec: "목제 또는 플라스틱제", requirement: "4학생당 1", type: "필수", keywords: ["시험관대", "가열용 시험관대", "시험관 대"] },
  { category: "공통-일반교구", name: "스포이트", spec: "각종", requirement: "4학생당 1", type: "필수", keywords: ["스포이트", "스포이드", "피펫"] },
  { category: "공통-일반교구", name: "수조", spec: "각종(유리, 플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["수조", "물통"] },
  { category: "공통-일반교구", name: "유리병", spec: "뚜껑 포함", requirement: "4학생당 1", type: "필수", keywords: ["유리병", "뚜껑 있는 유리병", "뚜껑있는유리병", "집기병"] },
  { category: "공통-일반교구", name: "눈금실린더", spec: "유리 또는 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["눈금실린더", "메스실린더"] },
  { category: "공통-일반교구", name: "핀셋", spec: "스테인리스", requirement: "4학생당 1", type: "필수", keywords: ["핀셋", "핀셑"] },
  { category: "공통-일반교구", name: "돋보기", spec: "각종", requirement: "4학생당 1", type: "권장", keywords: ["돋보기", "확대경", "루페"] },
  { category: "안전장구", name: "학생용 실험복", spec: "면소재 실험복", requirement: "1학생당 1", type: "필수", keywords: ["실험복", "학생용 실험복", "가운"] },
  { category: "안전장구", name: "내열 장갑", spec: "내열온도 200 ℃", requirement: "학교당 6", type: "필수", keywords: ["내열 장갑", "내열장갑", "화상 방지 장갑"] },
  { category: "안전장구", name: "(안전)장갑", spec: "1회용 (폴리에틸렌, 라텍스, 나이트릴)", requirement: "1학생당 1", type: "필수", keywords: ["장갑", "안전장갑", "실험용 장갑", "라텍스 장갑", "니트릴 장갑", "면장갑", "실험용장갑", "고무장갑"] },
  { category: "안전장구", name: "보안경", spec: "안경식", requirement: "1학생당 1", type: "필수", keywords: ["보안경", "안전경", "고글"] }
];

const EXCLUDED_KEYWORDS = ['거름종이','거름 종이','시약포지','약포지','시약 포지','약 포지','유산지','리트머스','pH시험지','시약','용액','물','얼음','에탄올','메탄올','가루','소금','설탕','모래','색소'];

function ApiKeyScreen({ onSave }) {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');
  const handleSave = () => {
    const trimmed = inputKey.trim();
    localStorage.setItem('gemini_api_key', trimmed);
    onSave(trimmed);
  };
  return (
    <div style={{minHeight:'100vh',background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:"'Pretendard', 'Noto Sans KR', sans-serif"}}>
      <div style={{background:'#fff',borderRadius:'20px',boxShadow:'0 8px 40px rgba(67,97,238,0.10)',padding:'3rem',width:'100%',maxWidth:'440px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
          <div style={{background:'#eef2ff',borderRadius:'12px',padding:'10px',display:'flex'}}>
            <KeyRound size={24} color="#4361ee" />
          </div>
          <div>
            <div style={{fontSize:'22px',fontWeight:'700',color:'#1a1a2e'}}>🔬 과학교구 분석기</div>
            <div style={{fontSize:'12px',color:'#7c83a0',marginTop:'2px'}}>2022 개정 기준</div>
          </div>
        </div>
        <p style={{color:'#5a6070',fontSize:'14px',lineHeight:'1.7',margin:'1.5rem 0'}}>
          본인의 <strong style={{color:'#4361ee'}}>Gemini API 키</strong>를 입력하세요.<br/>키는 이 브라우저에만 저장되며 외부로 전송되지 않습니다.
        </p>
        <label style={{fontSize:'11px',fontWeight:'700',color:'#9aa0b4',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Gemini API Key</label>
        <input type="text" value={inputKey} onChange={e=>{setInputKey(e.target.value);setError('');}} onKeyDown={e=>e.key==='Enter'&&handleSave()} placeholder="AIzaSy..."
          style={{width:'100%',border:error?'1.5px solid #ef4444':'1.5px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',fontFamily:'monospace',fontSize:'13px',outline:'none',boxSizing:'border-box',marginBottom:'6px',transition:'border-color 0.2s'}}
        />
        {error && <p style={{color:'#ef4444',fontSize:'12px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'4px'}}><AlertCircle size={12}/>{error}</p>}
        {!error && <div style={{height:'18px'}}/>}
        <button onClick={handleSave} style={{width:'100%',background:'linear-gradient(135deg,#4361ee,#7c3aed)',color:'#fff',border:'none',borderRadius:'12px',padding:'14px',fontWeight:'700',fontSize:'15px',cursor:'pointer',letterSpacing:'0.02em'}}>
          저장하고 시작하기
        </button>
        <p style={{fontSize:'12px',color:'#b0b8d0',marginTop:'1.5rem',textAlign:'center'}}>
          키가 없으신가요?{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{color:'#4361ee',textDecoration:'underline'}}>Google AI Studio</a>에서 무료 발급
        </p>
      </div>
    </div>
  );
}

function MainApp({ apiKey, onResetKey }) {
  const [textbooks, setTextbooks] = useState([]);
  const [copyState, setCopyState] = useState('idle');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const fileInputRef = useRef(null);

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });

  const mapToStandardDb = useCallback((extractedItems) => {
    const mapped = extractedItems.map((item) => {
      const n = item.replace(/\s+/g, '');
      let found = STANDARD_EQUIPMENT.find(s => s.keywords.some(k => n === k.replace(/\s+/g, '')));
      if (!found) found = STANDARD_EQUIPMENT.find(s => s.keywords.some(k => {
        const nk = k.replace(/\s+/g, '');
        if (nk === '장갑' && n.includes('내열')) return false;
        if (nk === '장갑' && n.includes('고무')) return false;
        return n.includes(nk);
      }));
      return { original: item, standard: found || null };
    });
    const unique = []; const seen = new Set();
    mapped.forEach(item => {
      const key = item.standard ? `std_${item.standard.name}` : `org_${item.original.replace(/\s+/g,'')}`;
      if (!seen.has(key)) { seen.add(key); unique.push(item); }
    });
    unique.sort((a,b) => { if(a.standard&&!b.standard) return -1; if(!a.standard&&b.standard) return 1; return 0; });
    return unique;
  }, []);

  const extractEquipmentFromImage = useCallback(async (base64Data, mimeType) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const promptText = `당신은 텍스트 판독 및 과학교구 추출 전문가입니다. 업로드된 이미지는 교과서 실험의 '준비물' 텍스트 부분입니다.
    [핵심 임무]
    1. 2022 개정 과학교구 설비 기준표에 해당하는 정식 교구와 일반 도구만 추출하세요.
    2. [강력 제외] 물, 에탄올, 시약 등 액체/화학 물질과 거름종이, 약포지 등 소모품은 절대 추출하지 마세요.
    결과는 반드시 'equipment' 배열로 응답하세요.`;
    const payload = {
      contents: [{ role:'user', parts:[{text:promptText},{inlineData:{mimeType,data:base64Data}}] }],
      generationConfig: { responseMimeType:'application/json', responseSchema:{type:'OBJECT',properties:{equipment:{type:'ARRAY',items:{type:'STRING'}}},required:['equipment']} }
    };
    const delays = [1000,2000,4000,8000,16000];
    for (let i=0;i<5;i++) {
      try {
        const res = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if (!res.ok) throw new Error(`${res.status}`);
        const result = await res.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          try {
            const parsed = JSON.parse(text);
            return (parsed.equipment||[]).filter(item => {
              const ni = item.replace(/\s+/g,'');
              return !EXCLUDED_KEYWORDS.some(kw=>ni.includes(kw.replace(/\s+/g,'')));
            });
          } catch { return []; }
        }
        return [];
      } catch(err) { if(i===4) throw err; await new Promise(r=>setTimeout(r,delays[i])); }
    }
  }, [apiKey]);

  const processFiles = useCallback(async (files) => {
    if (!files||files.length===0) return;
    for (const file of files) {
      const tbId = Date.now()+Math.random();
      const ext = file.name?file.name.split('.').pop().toLowerCase():'';
      const isHwp = ext==='hwp'||ext==='hwpx';
      setTextbooks(prev => [...prev, {id:tbId,title:`교과서 ${prev.length+1}`,fileName:file.name||'Pasted',imageUrl:URL.createObjectURL(file),isLoading:!isHwp,isHwp,isPdf:ext==='pdf'||file.type==='application/pdf',items:[],error:null}]);
      if (isHwp) { setTextbooks(prev=>prev.map(tb=>tb.id===tbId?{...tb,isLoading:false,error:'HWP는 캡처 후 Ctrl+V로 붙여넣어 주세요.'}:tb)); continue; }
      try {
        const base64 = await getBase64(file);
        let mime = file.type;
        if (ext==='pdf') mime='application/pdf';
        if (!mime||(!mime.startsWith('image/')&&mime!=='application/pdf')) mime='image/png';
        const extracted = await extractEquipmentFromImage(base64,mime);
        const items = mapToStandardDb(extracted);
        setTextbooks(prev=>prev.map(tb=>tb.id===tbId?{...tb,isLoading:false,items}:tb));
      } catch { setTextbooks(prev=>prev.map(tb=>tb.id===tbId?{...tb,isLoading:false,error:'통신 오류가 발생했습니다. 다시 시도해 주세요.'}:tb)); }
    }
  }, [extractEquipmentFromImage, mapToStandardDb]);

  const handleFileUpload = e => { processFiles(Array.from(e.target.files)); if(fileInputRef.current) fileInputRef.current.value=''; };

  useEffect(() => {
    const handlePaste = e => {
      const items = e.clipboardData?.items; if(!items) return;
      const files = [];
      for(let i=0;i<items.length;i++) if(items[i].type.includes('image')||items[i].type.includes('pdf')) { const f=items[i].getAsFile(); if(f) files.push(f); }
      if(files.length>0) processFiles(files);
    };
    window.addEventListener('paste',handlePaste);
    return ()=>window.removeEventListener('paste',handlePaste);
  }, [processFiles]);

  const removeTextbook = id => setTextbooks(prev=>prev.filter(tb=>tb.id!==id).map((tb,i)=>({...tb,title:`교과서 ${i+1}`})));

  const generateAnalysisTable = () => {
    const agg = {};
    textbooks.forEach(tb => {
      if(tb.isLoading||tb.error) return;
      tb.items.forEach(item => {
        const key = item.standard?item.standard.name:item.original;
        if(!agg[key]) agg[key]={category:item.standard?item.standard.category:'기타 (기준표 외)',name:item.standard?item.standard.name:item.original,spec:item.standard?item.standard.spec:'-',requirement:item.standard?item.standard.requirement:'-',type:item.standard?item.standard.type:'-',textbooks:new Set()};
        agg[key].textbooks.add(tb.title);
      });
    });
    const result = Object.values(agg).map(item => {
      const isCommon = item.textbooks.size===textbooks.filter(t=>!t.error).length&&item.textbooks.size>1;
      return {...item,remarks:isCommon?'공통':Array.from(item.textbooks).join(', ')};
    });
    const order = {'공통-측정교구':1,'공통-일반교구':2,'안전장구':3,'기타 (기준표 외)':4};
    result.sort((a,b)=>(order[a.category]||5)-(order[b.category]||5));
    return result;
  };

  const analysisData = generateAnalysisTable();

  const copyToHWP = (withHeader=true) => {
    if(analysisData.length===0) return;
    const eh = v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const et = v=>String(v??'').replace(/\t/g,' ').replace(/\n/g,' ').replace(/\r/g,'');
    const H=['영역','교구 종목','규격','소요 기준','분류','비고'];
    const tsv=[...(withHeader?[H.map(et).join('\t')]:[]),...analysisData.map(r=>[r.category,r.name,r.spec,r.requirement,r.type,r.remarks].map(et).join('\t'))].join('\r\n');
    let html=`<table border="1" style="border-collapse:collapse;">${withHeader?`<tr>${H.map(h=>`<th>${eh(h)}</th>`).join('')}</tr>`:''}${analysisData.map(r=>`<tr>${[r.category,r.name,r.spec,r.requirement,r.type,r.remarks].map(v=>`<td>${eh(v)}</td>`).join('')}</tr>`).join('')}</table>`;
    const c=document.createElement('div'); c.innerHTML=html; c.style.cssText='position:fixed;left:-9999px;'; document.body.appendChild(c);
    const hc=e=>{e.clipboardData.setData('text/html',html);e.clipboardData.setData('text/plain',tsv);e.preventDefault();};
    c.addEventListener('copy',hc);
    const sel=window.getSelection(); const r=document.createRange(); r.selectNodeContents(c); sel.removeAllRanges(); sel.addRange(r);
    try { document.execCommand('copy'); setCopyState(withHeader?'copiedWithHeader':'copiedDataOnly'); setTimeout(()=>setCopyState('idle'),3000); }
    catch { alert('복사 실패'); }
    finally { c.removeEventListener('copy',hc); sel.removeAllRanges(); document.body.removeChild(c); }
  };

  const handleCopyCardList = tb => {
    if(!tb.items||tb.items.length===0) return;
    const t=document.createElement('textarea'); t.value=tb.items.map(i=>i.standard?i.standard.name:i.original).join(', '); document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); setCopiedCardId(tb.id); setTimeout(()=>setCopiedCardId(null),2000); } catch(e){console.error(e);} finally { document.body.removeChild(t); }
  };

  const S = {
    page: {minHeight:'100vh',background:'#f0f4ff',fontFamily:"'Pretendard','Noto Sans KR',sans-serif",padding:'0'},
    header: {background:'linear-gradient(135deg,#4361ee 0%,#7c3aed 100%)',padding:'1.5rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 4px 20px rgba(67,97,238,0.25)'},
    headerTitle: {color:'#fff',fontSize:'22px',fontWeight:'800',display:'flex',alignItems:'center',gap:'10px',letterSpacing:'-0.02em'},
    headerSub: {color:'rgba(255,255,255,0.75)',fontSize:'13px',marginTop:'3px'},
    headerBtns: {display:'flex',alignItems:'center',gap:'10px'},
    resetBtn: {display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.15)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',borderRadius:'10px',padding:'8px 14px',fontSize:'12px',cursor:'pointer',backdropFilter:'blur(4px)'},
    uploadBtn: {display:'flex',alignItems:'center',gap:'8px',background:'#fff',color:'#4361ee',border:'none',borderRadius:'10px',padding:'10px 20px',fontSize:'13px',fontWeight:'700',cursor:'pointer',boxShadow:'0 2px 12px rgba(0,0,0,0.1)'},
    main: {padding:'2rem 2.5rem',maxWidth:'1400px',margin:'0 auto'},
    sectionLabel: {fontSize:'11px',fontWeight:'800',color:'#9aa0b4',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'},
    sectionLine: {flex:1,height:'1px',background:'#e2e8f0'},
    grid: {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'1.25rem',marginBottom:'2.5rem'},
    card: {background:'#fff',borderRadius:'16px',boxShadow:'0 2px 16px rgba(67,97,238,0.07)',border:'1px solid #eef0f8',overflow:'hidden'},
    cardHeader: {padding:'14px 18px',borderBottom:'1px solid #f0f2fa',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fafbff'},
    cardTitle: {fontSize:'14px',fontWeight:'700',color:'#1a1a2e'},
    deleteBtn: {background:'none',border:'none',color:'#c0c8d8',cursor:'pointer',borderRadius:'8px',padding:'4px',display:'flex',transition:'color 0.2s'},
    imgBox: {height:'120px',background:'#f7f8fc',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',borderBottom:'1px solid #f0f2fa'},
    resultBox: {padding:'14px 18px'},
    resultLabel: {fontSize:'11px',fontWeight:'700',color:'#9aa0b4',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'10px'},
    itemRow: {display:'flex',alignItems:'center',gap:'8px',padding:'6px 0',borderBottom:'1px solid #f7f8fc'},
    tagMatched: {marginLeft:'auto',background:'#eef2ff',color:'#4361ee',fontSize:'11px',fontWeight:'700',padding:'2px 8px',borderRadius:'6px',whiteSpace:'nowrap',flexShrink:0},
    tagOther: {marginLeft:'auto',background:'#f3f4f6',color:'#9ca3af',fontSize:'11px',padding:'2px 8px',borderRadius:'6px',whiteSpace:'nowrap',flexShrink:0},
    emptyDrop: {border:'2px dashed #c7d2fe',borderRadius:'16px',padding:'3rem 2rem',textAlign:'center',background:'#fafbff',cursor:'pointer',transition:'all 0.2s'},
    tableSection: {background:'#fff',borderRadius:'16px',boxShadow:'0 2px 16px rgba(67,97,238,0.07)',border:'1px solid #eef0f8',overflow:'hidden',marginBottom:'2.5rem'},
    tableHeader: {padding:'1.25rem 1.5rem',borderBottom:'1px solid #f0f2fa',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fafbff'},
    tableTitle: {fontSize:'16px',fontWeight:'800',color:'#1a1a2e'},
    copyBtns: {display:'flex',alignItems:'center',gap:'8px'},
    copyBtn: (active)=>({display:'flex',alignItems:'center',gap:'6px',background:active?'#10b981':'#fff',color:active?'#fff':'#4361ee',border:`1px solid ${active?'#10b981':'#c7d2fe'}`,borderRadius:'10px',padding:'8px 16px',fontSize:'12px',fontWeight:'700',cursor:'pointer',transition:'all 0.2s',whiteSpace:'nowrap'}),
    table: {width:'100%',borderCollapse:'collapse',fontSize:'13px'},
    th: {padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:'700',color:'#9aa0b4',letterSpacing:'0.06em',textTransform:'uppercase',background:'#f8f9ff',borderBottom:'1px solid #eef0f8'},
    td: {padding:'12px 16px',borderBottom:'1px solid #f7f8fc',color:'#374151',verticalAlign:'middle'},
  };

  const showTable = textbooks.length>0 && textbooks.filter(t=>!t.error).every(tb=>!tb.isLoading) && analysisData.length>0;

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <div>
          <div style={S.headerTitle}><FlaskConical size={24} color="#fff"/> 스마트 과학교구 분석기</div>
          <div style={S.headerSub}>이미지 캡처 후 Ctrl+V · 2022 개정 기준 자동 분석</div>
        </div>
        <div style={S.headerBtns}>
          <button onClick={onResetKey} style={S.resetBtn}><LogOut size={13}/> API 키 변경</button>
          <input type="file" multiple accept="image/*,application/pdf,.hwp,.hwpx" style={{display:'none'}} ref={fileInputRef} onChange={handleFileUpload}/>
          <button onClick={()=>fileInputRef.current.click()} style={S.uploadBtn}><Upload size={16}/> 파일 선택</button>
        </div>
      </div>

      <div style={S.main}>
        {/* 섹션1: 파일 업로드 영역 */}
        <div style={{...S.sectionLabel,marginTop:'1.5rem'}}>
          <span>📁 교과서 이미지</span><div style={S.sectionLine}/>
          <span style={{color:'#c7d2fe',fontWeight:'400',fontSize:'11px'}}>Ctrl+V 로 바로 붙여넣기 가능</span>
        </div>

        {textbooks.length === 0 ? (
          <div style={S.emptyDrop} onClick={()=>fileInputRef.current.click()}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#4361ee';e.currentTarget.style.background='#eef2ff';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#c7d2fe';e.currentTarget.style.background='#fafbff';}}>
            <ClipboardPaste size={40} color="#a5b4fc" style={{marginBottom:'12px'}}/>
            <div style={{fontSize:'18px',fontWeight:'800',color:'#3730a3',marginBottom:'6px'}}>화면 캡처 후 Ctrl + V</div>
            <div style={{fontSize:'13px',color:'#7c83a0',lineHeight:'1.7'}}>준비물 텍스트 한 줄만 캡처해도 완벽하게 인식합니다<br/>클릭하여 파일을 직접 선택할 수도 있어요</div>
          </div>
        ) : (
          <div style={S.grid}>
            {textbooks.map(tb => (
              <div key={tb.id} style={S.card}>
                <div style={S.cardHeader}>
                  <div style={S.cardTitle}>{tb.title}</div>
                  <button onClick={()=>removeTextbook(tb.id)} style={S.deleteBtn}
                    onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                    onMouseLeave={e=>e.currentTarget.style.color='#c0c8d8'}>
                    <Trash2 size={16}/>
                  </button>
                </div>
                <div style={S.imgBox}>
                  {tb.isPdf ? (
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',color:'#f87171'}}>
                      <FileText size={32}/><span style={{fontSize:'12px',fontWeight:'700',marginTop:'6px'}}>PDF 문서</span>
                    </div>
                  ) : (
                    <img src={tb.imageUrl} alt={tb.title} style={{width:'100%',height:'100%',objectFit:'contain',padding:'8px',boxSizing:'border-box'}}/>
                  )}
                  {tb.isLoading && (
                    <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.9)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                      <Loader2 size={28} color="#4361ee" style={{animation:'spin 1s linear infinite'}}/>
                      <span style={{fontSize:'12px',fontWeight:'700',color:'#4361ee'}}>판독 중...</span>
                    </div>
                  )}
                </div>
                <div style={S.resultBox}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                    <div style={S.resultLabel}>AI 추출 결과</div>
                    {!tb.isLoading&&!tb.error&&tb.items.length>0&&(
                      <button onClick={()=>handleCopyCardList(tb)}
                        style={{display:'flex',alignItems:'center',gap:'4px',background:'none',border:'none',color:'#a5b4fc',fontSize:'11px',cursor:'pointer',fontWeight:'700'}}>
                        {copiedCardId===tb.id?<><CheckCircle2 size={12} color="#10b981"/><span style={{color:'#10b981'}}>복사됨!</span></>:<><Copy size={12}/> 목록 복사</>}
                      </button>
                    )}
                  </div>
                  {tb.isLoading ? (
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {[75,55,65].map((w,i)=><div key={i} style={{height:'14px',background:'#f0f2fa',borderRadius:'6px',width:`${w}%`,animation:'pulse 1.5s ease-in-out infinite'}}/>)}
                    </div>
                  ) : tb.error ? (
                    <div style={{display:'flex',alignItems:'flex-start',gap:'8px',background:'#fef2f2',padding:'10px 12px',borderRadius:'10px',color:'#ef4444',fontSize:'12px',fontWeight:'600'}}>
                      <AlertCircle size={14} style={{flexShrink:0,marginTop:'1px'}}/>{tb.error}
                    </div>
                  ) : (
                    <div style={{maxHeight:'180px',overflowY:'auto'}}>
                      {tb.items.map((item,idx)=>(
                        <div key={idx} style={S.itemRow}>
                          {item.standard ? <CheckCircle2 size={15} color="#10b981" style={{flexShrink:0}}/> : <HelpCircle size={15} color="#d1d5db" style={{flexShrink:0}}/>}
                          <span style={{fontSize:'13px',color:'#374151',fontWeight:'500'}}>{item.original}</span>
                          {item.standard&&item.standard.name!==item.original && <span style={S.tagMatched}>→ {item.standard.name}</span>}
                          {!item.standard && <span style={S.tagOther}>기타</span>}
                        </div>
                      ))}
                      {tb.items.length===0&&<div style={{color:'#9ca3af',fontSize:'12px',textAlign:'center',padding:'1rem',fontStyle:'italic'}}>추출된 교구가 없습니다</div>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* 추가 업로드 카드 */}
            <div onClick={()=>fileInputRef.current.click()}
              style={{...S.card,border:'2px dashed #c7d2fe',boxShadow:'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'10px',padding:'2rem',cursor:'pointer',background:'#fafbff',minHeight:'200px'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#4361ee';e.currentTarget.style.background='#eef2ff';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#c7d2fe';e.currentTarget.style.background='#fafbff';}}>
              <Upload size={28} color="#a5b4fc"/>
              <span style={{fontSize:'13px',color:'#7c83a0',fontWeight:'600'}}>교과서 추가</span>
            </div>
          </div>
        )}

        {/* 섹션2: 분석표 */}
        {showTable && (
          <>
            <div style={S.sectionLabel}>
              <span>📊 통합 교구 분석표</span><div style={S.sectionLine}/>
              <span style={{color:'#c7d2fe',fontWeight:'400',fontSize:'11px'}}>2022 개정 기준</span>
            </div>
            <div style={S.tableSection}>
              <div style={S.tableHeader}>
                <div>
                  <div style={S.tableTitle}>통합 교구 분석표</div>
                  <div style={{fontSize:'12px',color:'#9aa0b4',marginTop:'3px'}}>기준표 외 항목은 하단에 별도 표시됩니다</div>
                </div>
                <div style={S.copyBtns}>
                  <button onClick={()=>copyToHWP(true)} style={S.copyBtn(copyState==='copiedWithHeader')}>
                    {copyState==='copiedWithHeader'?<CheckCircle2 size={14}/>:<Copy size={14}/>}
                    {copyState==='copiedWithHeader'?'복사완료':'헤더 포함 복사'}
                  </button>
                  <button onClick={()=>copyToHWP(false)} style={S.copyBtn(copyState==='copiedDataOnly')}>
                    {copyState==='copiedDataOnly'?<CheckCircle2 size={14}/>:<Copy size={14}/>}
                    {copyState==='copiedDataOnly'?'복사완료':'데이터만 복사'}
                  </button>
                </div>
              </div>
              {copyState!=='idle'&&(
                <div style={{background:'#f0fdf4',padding:'12px 20px',borderBottom:'1px solid #d1fae5',display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#065f46'}}>
                  <CheckCircle2 size={16} color="#10b981"/>
                  <strong>복사 완료!</strong> 한글 문서에서 Ctrl+V로 붙여넣으시면 됩니다.
                </div>
              )}
              <div style={{overflowX:'auto'}}>
                <table style={S.table}>
                  <thead>
                    <tr>{['영역','교구 종목','규격','소요 기준','분류','비고'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {analysisData.map((row,idx)=>{
                      const isOther = row.category==='기타 (기준표 외)';
                      return (
                        <tr key={idx} style={{background:idx%2===0?'#fff':'#fafbff'}}>
                          <td style={{...S.td,color:isOther?'#9ca3af':'#6366f1',fontWeight:'600',fontSize:'12px'}}>{isOther?'기타':row.category.replace('공통-','')}</td>
                          <td style={{...S.td,fontWeight:'700',color:isOther?'#6b7280':'#1a1a2e'}}>{row.name}</td>
                          <td style={{...S.td,color:'#6b7280'}}>{row.spec}</td>
                          <td style={{...S.td,color:'#6b7280',whiteSpace:'nowrap'}}>{row.requirement}</td>
                          <td style={{...S.td,textAlign:'center'}}>
                            {!isOther&&<span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',background:row.type==='필수'?'#fef2f2':'#fffbeb',color:row.type==='필수'?'#dc2626':'#d97706'}}>{row.type}</span>}
                            {isOther&&<span style={{color:'#d1d5db'}}>-</span>}
                          </td>
                          <td style={{...S.td,fontWeight:row.remarks==='공통'?'700':'400',color:row.remarks==='공통'?'#4361ee':'#6b7280'}}>{row.remarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:10px}
        ::-webkit-scrollbar-thumb{background:#c7d2fe;border-radius:10px}
      `}</style>
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState(()=>localStorage.getItem('gemini_api_key')||'');
  const handleResetKey = ()=>{ localStorage.removeItem('gemini_api_key'); setApiKey(''); };
  if (!apiKey) return <ApiKeyScreen onSave={setApiKey}/>;
  return <MainApp apiKey={apiKey} onResetKey={handleResetKey}/>;
}