import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// ALL VISUALIZATION COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── 1. BPE Tokenizer Viz ────────────────────────────────────────
function TokenizerViz({ accent }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const merges = [
    { label: "Start: characters", tokens: ["p","l","a","y","i","n","g"], merge: null },
    { label: "Merge: i+n → 'in'", tokens: ["p","l","a","y","in","g"], merge: [4,5] },
    { label: "Merge: in+g → 'ing'", tokens: ["p","l","a","y","ing"], merge: [4,5] },
    { label: "Merge: p+l → 'pl'", tokens: ["pl","a","y","ing"], merge: [0,1] },
    { label: "Merge: pl+a → 'pla'", tokens: ["pla","y","ing"], merge: [0,1] },
    { label: "Merge: pla+y → 'play'", tokens: ["play","ing"], merge: [0,1] },
    { label: "Final BPE tokens ✓", tokens: ["play","ing"], merge: null },
  ];
  useEffect(() => {
    if (!playing) return;
    if (step >= merges.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [playing, step]);
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:24, marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700 }}>🎬 BPE Merge Animation — "playing"</span>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => { setStep(0); setPlaying(false); }} style={{ background:"#111827", border:"1px solid #1e293b", color:"#475569", borderRadius:6, padding:"4px 12px", fontSize:11, cursor:"pointer", fontFamily:"system-ui" }}>reset</button>
          <button onClick={() => { if (step >= merges.length-1) setStep(0); setPlaying(p=>!p); }} style={{ background:accent+"20", border:`1px solid ${accent}50`, color:accent, borderRadius:6, padding:"4px 14px", fontSize:11, cursor:"pointer", fontFamily:"system-ui" }}>{playing?"⏸ pause":"▶ play"}</button>
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:13, color:"#64748b", marginBottom:20, fontFamily:"system-ui", minHeight:22 }}>Step {step}: <span style={{ color:accent }}>{merges[step].label}</span></div>
      <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap", minHeight:60, alignItems:"center" }}>
        {merges[step].tokens.map((tok,i) => {
          const isMerging = merges[step].merge && (i===merges[step].merge[0]||i===merges[step].merge[1]);
          return <div key={i} style={{ background:isMerging?accent+"30":"#0f1a2e", border:`2px solid ${isMerging?accent:"#1e3a5f"}`, borderRadius:8, padding:"10px 16px", fontSize:16, fontWeight:700, color:isMerging?accent:"#94a3b8", fontFamily:"'JetBrains Mono',monospace", transition:"all 0.3s", boxShadow:isMerging?`0 0 12px ${accent}40`:"none", minWidth:44, textAlign:"center" }}>{tok}{isMerging&&<div style={{ fontSize:9, color:accent, marginTop:3 }}>merging</div>}</div>;
        })}
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:20, paddingTop:16, borderTop:"1px solid #0f1a2e" }}>
        {[["tokens now", merges[step].tokens.length, "#e2e8f0"],["chars saved", 7-merges[step].tokens.length, accent],["merges done", step, "#60a5fa"]].map(([l,v,c])=>(
          <div key={l} style={{ textAlign:"center" }}><div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui" }}>{l}</div></div>
        ))}
      </div>
      <div style={{ marginTop:16, background:"#0a1220", borderRadius:4, height:4, overflow:"hidden" }}><div style={{ height:"100%", background:accent, borderRadius:4, width:`${(step/(merges.length-1))*100}%`, transition:"width 0.4s" }}/></div>
      <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
        {[["500–2k","tiny"],["8k–16k","medium"],["32k–50k","GPT-2/3"],["100k","GPT-4"]].map(([s,l])=>(
          <div key={s} style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:6, padding:"6px 12px", fontSize:11, color:"#475569", fontFamily:"system-ui" }}><span style={{ color:"#94a3b8", fontWeight:600 }}>{s}</span> → {l}</div>
        ))}
      </div>
    </div>
  );
}

// ── 2. Embedding Heatmap Viz ────────────────────────────────────
function EmbeddingViz({ accent }) {
  const [hover, setHover] = useState(null);
  const tokens = [
    { word:"cat",  vec:[0.82,-0.31,0.55,0.12,-0.67,0.44,0.28,-0.15], color:"#f59e0b" },
    { word:"dog",  vec:[0.79,-0.28,0.52,0.18,-0.61,0.41,0.32,-0.18], color:"#f59e0b" },
    { word:"sat",  vec:[-0.3,0.72,-0.18,0.65,0.21,-0.44,0.58,0.33],  color:"#60a5fa" },
    { word:"the",  vec:[0.04,0.01,-0.09,0.88,0.03,-0.22,0.11,-0.05], color:"#94a3b8" },
    { word:"king", vec:[0.71,0.22,-0.33,0.14,0.88,0.52,-0.31,0.44],  color:"#a855f7" },
    { word:"queen",vec:[0.68,0.19,-0.35,0.16,0.91,0.55,-0.29,0.48],  color:"#a855f7" },
  ];
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:24, marginBottom:16 }}>
      <div style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700, marginBottom:20 }}>📐 Embedding Space — Similar words cluster together</div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 300px" }}>
          <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:10, letterSpacing:2 }}>LEARNED VECTORS (8 dims shown of 512)</div>
          {tokens.map((t,ti)=>(
            <div key={ti} onMouseEnter={()=>setHover(ti)} onMouseLeave={()=>setHover(null)} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, padding:"6px 8px", borderRadius:6, background:hover===ti?"#0a1628":"transparent", cursor:"default", transition:"background 0.2s" }}>
              <div style={{ width:44, fontSize:11, color:t.color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{t.word}</div>
              {t.vec.map((v,vi)=>(
                <div key={vi} style={{ width:28, height:28, borderRadius:4, background:v>0?`rgba(96,165,250,${Math.abs(v)*0.9})`:`rgba(248,113,113,${Math.abs(v)*0.9})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"rgba(255,255,255,0.7)", fontFamily:"'JetBrains Mono',monospace", border:hover===ti?"1px solid #334155":"1px solid transparent", transition:"all 0.15s" }}>{v.toFixed(1)}</div>
              ))}
            </div>
          ))}
          <div style={{ display:"flex", gap:12, marginTop:10 }}>
            {[["rgba(96,165,250,0.8)","positive"],["rgba(248,113,113,0.8)","negative"]].map(([c,l])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#475569", fontFamily:"system-ui" }}><div style={{ width:12, height:12, borderRadius:2, background:c }}/>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ flex:"1 1 200px" }}>
          <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:10, letterSpacing:2 }}>SIMILARITY (cosine)</div>
          {[{pair:"cat ↔ dog",sim:0.94,note:"both animals"},{pair:"king ↔ queen",sim:0.91,note:"royalty"},{pair:"cat ↔ sat",sim:0.22,note:"unrelated"},{pair:"cat ↔ the",sim:0.08,note:"function word"}].map((r,i)=>(
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"'JetBrains Mono',monospace" }}>{r.pair}</span>
                <span style={{ fontSize:11, color:r.sim>0.7?accent:"#475569", fontFamily:"system-ui", fontWeight:600 }}>{r.sim}</span>
              </div>
              <div style={{ background:"#0a1220", borderRadius:3, height:6, overflow:"hidden" }}><div style={{ height:"100%", background:r.sim>0.7?accent:"#1e3a5f", width:`${r.sim*100}%`, borderRadius:3 }}/></div>
              <div style={{ fontSize:10, color:"#334155", marginTop:2, fontFamily:"system-ui" }}>{r.note}</div>
            </div>
          ))}
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:12, marginTop:8 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:4 }}>💡 Token + Position</div>
            <div style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui", lineHeight:1.6 }}>Final embedding = token vector + position vector.<br/>"cat" at pos 0 ≠ "cat" at pos 5</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 3. Attention Map Viz ────────────────────────────────────────
function AttentionViz({ accent }) {
  const [selectedToken, setSelectedToken] = useState(2);
  const tokens = ["The","animal","didn't","cross","because","it","was","tired"];
  const attentionWeights = [
    [0.5,0.1,0.1,0.1,0.05,0.05,0.05,0.05],
    [0.2,0.5,0.1,0.05,0.05,0.05,0.03,0.02],
    [0.1,0.15,0.5,0.1,0.05,0.05,0.03,0.02],
    [0.1,0.1,0.15,0.5,0.05,0.05,0.03,0.02],
    [0.05,0.1,0.1,0.15,0.5,0.05,0.03,0.02],
    [0.25,0.35,0.05,0.05,0.1,0.12,0.05,0.03],
    [0.05,0.1,0.1,0.1,0.1,0.3,0.2,0.05],
    [0.03,0.1,0.1,0.1,0.1,0.2,0.3,0.07],
  ];
  const weights = attentionWeights[selectedToken];
  const maxW = Math.max(...weights.slice(0, selectedToken+1));
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:24, marginBottom:16 }}>
      <div style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700, marginBottom:6 }}>👁️ Causal Attention Map — Click a token to see what it attends to</div>
      <div style={{ fontSize:11, color:"#334155", fontFamily:"system-ui", marginBottom:20 }}>(tokens can only attend to themselves and previous tokens — causal mask)</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:24 }}>
        {tokens.map((tok,i)=>(
          <button key={i} onClick={()=>setSelectedToken(i)} style={{ background:selectedToken===i?accent+"25":"#0a1220", border:`1px solid ${selectedToken===i?accent:"#1e293b"}`, color:selectedToken===i?accent:"#475569", borderRadius:6, padding:"7px 12px", fontSize:12, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", transition:"all 0.15s" }}>{tok}</button>
        ))}
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:10, letterSpacing:2 }}>ATTENTION FROM "{tokens[selectedToken].toUpperCase()}" TO:</div>
        {tokens.map((tok,i)=>{
          const isFuture=i>selectedToken; const w=isFuture?0:weights[i]; const isTop=!isFuture&&w===maxW;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
              <div style={{ width:70, fontSize:11, textAlign:"right", color:isFuture?"#1e293b":isTop?accent:"#64748b", fontFamily:"'JetBrains Mono',monospace", fontWeight:isTop?700:400 }}>{tok}</div>
              <div style={{ flex:1, background:"#0a1220", borderRadius:4, height:22, overflow:"hidden" }}>
                {!isFuture?<div style={{ height:"100%", borderRadius:4, background:isTop?accent:accent+"50", width:`${(w/maxW)*100}%`, transition:"width 0.4s", display:"flex", alignItems:"center", paddingLeft:8 }}><span style={{ fontSize:10, color:"rgba(0,0,0,0.7)", fontFamily:"system-ui", fontWeight:700 }}>{(w*100).toFixed(0)}%</span></div>:<div style={{ display:"flex", alignItems:"center", height:"100%", paddingLeft:10 }}><span style={{ fontSize:10, color:"#1e293b", fontFamily:"system-ui" }}>🔒 masked (future)</span></div>}
              </div>
              {isTop&&<span style={{ fontSize:10, color:accent, fontFamily:"system-ui" }}>← strongest</span>}
            </div>
          );
        })}
      </div>
      {selectedToken===5&&<div style={{ background:accent+"10", border:`1px solid ${accent}30`, borderRadius:8, padding:12, fontSize:12, color:accent, fontFamily:"system-ui" }}>💡 "it" attends most to "animal" — the model resolves coreference correctly!</div>}
      <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
        {["Head 1: syntax","Head 2: coreference","Head 3: proximity","Head 4: semantics"].map(h=>(
          <div key={h} style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:6, padding:"5px 10px", fontSize:10, color:"#475569", fontFamily:"system-ui" }}>{h}</div>
        ))}
      </div>
    </div>
  );
}


// ── 4. Transformer Block Viz ────────────────────────────────────
function TransformerBlockViz({ accent }) {
  const [activeLayer, setActiveLayer] = useState(null);
  const layers = [
    { id:"input",  label:"Input x",        shape:"(B, T, 512)", color:"#334155", desc:"Token + positional embeddings combined" },
    { id:"ln1",    label:"LayerNorm",       shape:"normalize",   color:"#0f2a4a", desc:"Normalize each token vector to mean=0, std=1" },
    { id:"attn",   label:"Self-Attention",  shape:"Q·Kᵀ/√d → V",color:"#1e1b4b", desc:"Each token attends to past tokens" },
    { id:"res1",   label:"Residual Add",    shape:"x = x + attn",color:"#0a2010", desc:"Skip connection: preserve original signal" },
    { id:"ln2",    label:"LayerNorm",       shape:"normalize",   color:"#0f2a4a", desc:"Normalize again before FFN" },
    { id:"ffn",    label:"FFN (4× expand)", shape:"512→2048→512",color:"#2d1b00", desc:"Token-wise transformation: apply knowledge" },
    { id:"res2",   label:"Residual Add",    shape:"x = x + ffn", color:"#0a2010", desc:"Another skip connection" },
    { id:"output", label:"Output x",        shape:"(B, T, 512)", color:"#334155", desc:"Same shape as input — passes to next block" },
  ];
  const nodeColors = { "#334155":"#64748b","#0f2a4a":"#60a5fa","#1e1b4b":"#a855f7","#0a2010":"#4ade80","#2d1b00":"#f59e0b" };
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:24, marginBottom:16 }}>
      <div style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700, marginBottom:20 }}>🏗️ Transformer Block — Click any layer to learn what it does</div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
          {layers.map((l,i)=>(
            <div key={l.id} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div onClick={()=>setActiveLayer(activeLayer===l.id?null:l.id)} style={{ background:activeLayer===l.id?(nodeColors[l.color]||"#64748b")+"40":l.color, border:`2px solid ${activeLayer===l.id?(nodeColors[l.color]||"#64748b"):"transparent"}`, borderRadius:8, padding:"10px 20px", width:220, cursor:"pointer", transition:"all 0.2s", boxShadow:activeLayer===l.id?`0 0 16px ${nodeColors[l.color]||"#64748b"}40`:"none" }}>
                <div style={{ fontSize:12, fontWeight:700, color:nodeColors[l.color]||"#94a3b8", fontFamily:"system-ui" }}>{l.label}</div>
                <div style={{ fontSize:10, color:"#475569", fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{l.shape}</div>
              </div>
              {i<layers.length-1&&<div style={{ width:2, height:12, background:"#1e293b" }}/>}
            </div>
          ))}
        </div>
        <div style={{ flex:1, minWidth:180 }}>
          {activeLayer?(
            <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:10, padding:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", fontFamily:"system-ui", marginBottom:10 }}>{layers.find(l=>l.id===activeLayer)?.label}</div>
              <div style={{ fontSize:12, color:"#94a3b8", fontFamily:"system-ui", lineHeight:1.7 }}>{layers.find(l=>l.id===activeLayer)?.desc}</div>
              {activeLayer==="ffn"&&<div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:6 }}>{[["Linear 512→2048","expand"],["GeLU","gate"],["Linear 2048→512","compress"]].map(([l,d])=><div key={l} style={{ background:"#050a12", border:"1px solid #1e293b", borderRadius:6, padding:"6px 10px" }}><div style={{ fontSize:11, color:"#f59e0b", fontFamily:"'JetBrains Mono',monospace" }}>{l}</div><div style={{ fontSize:10, color:"#475569", fontFamily:"system-ui" }}>{d}</div></div>)}</div>}
            </div>
          ):<div style={{ color:"#1e293b", fontSize:12, fontFamily:"system-ui", padding:12 }}>← click a block</div>}
          <div style={{ marginTop:16, background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:8 }}>STACKING BLOCKS (n_layers)</div>
            {[["4","~18M","fast"],["6","~50M","small"],["12","~124M","GPT-2sm"],["96","~175B","GPT-3"]].map(([n,p,l])=>(
              <div key={n} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                <div style={{ width:20, fontSize:11, color:"#94a3b8", fontFamily:"'JetBrains Mono',monospace", textAlign:"right" }}>{n}×</div>
                <div style={{ flex:1, background:"#050a12", borderRadius:3, height:16, overflow:"hidden" }}><div style={{ height:"100%", background:accent+"40", width:`${(parseInt(n)/96)*100}%`, minWidth:"4%", borderRadius:3 }}/></div>
                <div style={{ fontSize:10, color:"#475569", fontFamily:"system-ui", width:80 }}>{p} · {l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 5. Full Architecture Flow Viz ───────────────────────────────
function FullArchViz({ accent }) {
  const [flow, setFlow] = useState(-1);
  const nodes = [
    { id:0, label:"Raw Text",        sub:'"the cat sat"',     icon:"📄", color:"#334155" },
    { id:1, label:"BPE Tokenizer",   sub:"→ token IDs",      icon:"✂️", color:"#0f2a4a" },
    { id:2, label:"Embedding",       sub:"(B,T)→(B,T,512)",  icon:"📐", color:"#1a1040" },
    { id:3, label:"Block × N",       sub:"attention + FFN",  icon:"🔁", color:"#1e1b4b" },
    { id:4, label:"LayerNorm",       sub:"final normalize",  icon:"⚖️", color:"#0f2a4a" },
    { id:5, label:"LM Head",         sub:"(B,T,512)→(B,T,V)",icon:"📊", color:"#0a2010" },
    { id:6, label:"Softmax+Sample",  sub:"→ next token",     icon:"🎲", color:"#2d1b00" },
    { id:7, label:"Output Text",     sub:'"the cat sat on..."',icon:"✨",color:"#334155" },
  ];
  const nodeColors = ["#64748b","#60a5fa","#a855f7","#818cf8","#60a5fa","#4ade80","#f59e0b","#e2e8f0"];
  useEffect(() => {
    if (flow===-1) return;
    if (flow>=nodes.length) { setFlow(-1); return; }
    const t = setTimeout(() => setFlow(f=>f+1), 500);
    return () => clearTimeout(t);
  }, [flow]);
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:24, marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700 }}>🏛️ Complete GPT Forward Pass</span>
        <button onClick={()=>setFlow(0)} style={{ background:accent+"20", border:`1px solid ${accent}50`, color:accent, borderRadius:6, padding:"5px 14px", fontSize:11, cursor:"pointer", fontFamily:"system-ui" }}>▶ animate</button>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
          {nodes.map((n,i)=>(
            <div key={n.id} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ background:flow>=i?nodeColors[i]+"20":n.color, border:`2px solid ${flow>=i?nodeColors[i]:"transparent"}`, borderRadius:10, padding:"11px 22px", width:240, transition:"all 0.3s", boxShadow:flow===i?`0 0 20px ${nodeColors[i]}50`:"none" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:16 }}>{n.icon}</span>
                  <div><div style={{ fontSize:12, fontWeight:700, color:flow>=i?nodeColors[i]:"#64748b", fontFamily:"system-ui" }}>{n.label}</div><div style={{ fontSize:10, color:"#334155", fontFamily:"'JetBrains Mono',monospace" }}>{n.sub}</div></div>
                </div>
              </div>
              {i<nodes.length-1&&<div style={{ width:2, height:14, background:flow>i?nodeColors[i]:"#1e293b", transition:"background 0.3s" }}/>}
            </div>
          ))}
        </div>
        <div style={{ flex:1, minWidth:180, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:10, padding:16 }}>
            <div style={{ fontSize:11, color:"#60a5fa", fontFamily:"system-ui", fontWeight:700, marginBottom:10 }}>🔄 Autoregressive Loop</div>
            {["Feed: [BOS, the, cat]","→ predicts: 'sat'","Append: [..., sat]","→ predicts: 'on'","Repeat until [EOS]..."].map((s,i)=><div key={i} style={{ fontSize:11, color:"#475569", fontFamily:"system-ui", lineHeight:2 }}>{s}</div>)}
          </div>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:10, padding:16 }}>
            <div style={{ fontSize:11, color:"#a855f7", fontFamily:"system-ui", fontWeight:700, marginBottom:10 }}>🔗 Weight Tying</div>
            <div style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui", lineHeight:1.6 }}>Token Embed = LM Head weights (transposed). Same matrix in/out → saves params, improves quality.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. Training Simulation Viz ──────────────────────────────────
function TrainingViz({ accent }) {
  const [step, setStep] = useState(0);
  const maxStep = 200;
  const [isRunning, setIsRunning] = useState(false);
  const [lossHistory, setLossHistory] = useState([6.0]);
  const [lrHistory, setLrHistory] = useState([0]);
  const getLR = s => { const w=20,t=200,mx=0.0003,mn=0.00003; if(s<w) return mx*s/w; if(s>=t) return mn; const p=(s-w)/(t-w); return mn+0.5*(1+Math.cos(Math.PI*p))*(mx-mn); };
  const getLoss = s => Math.max(1.8, 6.0*Math.exp(-s/60)+0.3*Math.sin(s*0.3)*Math.exp(-s/80));
  useEffect(() => {
    if (!isRunning) return;
    if (step>=maxStep) { setIsRunning(false); return; }
    const t = setTimeout(() => { const ns=step+1; setStep(ns); setLossHistory(h=>[...h,getLoss(ns)]); setLrHistory(h=>[...h,getLR(ns)]); }, 40);
    return () => clearTimeout(t);
  }, [isRunning, step]);
  const reset = () => { setIsRunning(false); setStep(0); setLossHistory([6.0]); setLrHistory([0]); };
  const W=320, H=100, lossMin=1.5, lossMax=6.5;
  const toPath = (data,min,max) => data.map((v,i)=>`${i===0?"M":"L"} ${(i/maxStep)*W} ${H-((v-min)/(max-min))*H}`).join(" ");
  const curLoss = lossHistory[lossHistory.length-1];
  const curLR = lrHistory[lrHistory.length-1];
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:24, marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700 }}>📉 Live Training Simulation</span>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={reset} style={{ background:"#111827", border:"1px solid #1e293b", color:"#475569", borderRadius:6, padding:"4px 12px", fontSize:11, cursor:"pointer", fontFamily:"system-ui" }}>reset</button>
          <button onClick={()=>setIsRunning(r=>!r)} style={{ background:accent+"20", border:`1px solid ${accent}50`, color:accent, borderRadius:6, padding:"4px 14px", fontSize:11, cursor:"pointer", fontFamily:"system-ui" }}>{isRunning?"⏸ pause":"▶ train"}</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        {[["Step",step,""],["Loss",curLoss.toFixed(3),curLoss<3?"↓ good":curLoss<5?"improving":"still high"],["LR",curLR.toExponential(1),step<20?"warmup":"cosine"]].map(([l,v,n])=>(
          <div key={l} style={{ flex:1, background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:"12px 14px" }}>
            <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#e2e8f0", fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
            {n&&<div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginTop:2 }}>{n}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:6, letterSpacing:2 }}>TRAINING LOSS</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background:"#050a12", borderRadius:8, border:"1px solid #0f1a2e" }}>
          <defs><linearGradient id="lossG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity="0.3"/><stop offset="100%" stopColor={accent} stopOpacity="0"/></linearGradient></defs>
          {[0.25,0.5,0.75].map(p=><line key={p} x1="0" y1={H*p} x2={W} y2={H*p} stroke="#0f1a2e" strokeWidth="1"/>)}
          <line x1={(20/maxStep)*W} y1="0" x2={(20/maxStep)*W} y2={H} stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3,3"/>
          {lossHistory.length>1&&<><path d={toPath(lossHistory,lossMin,lossMax)+` L ${(step/maxStep)*W} ${H} L 0 ${H} Z`} fill="url(#lossG)"/><path d={toPath(lossHistory,lossMin,lossMax)} fill="none" stroke={accent} strokeWidth="2"/></>}
          <text x="4" y="12" fill="#334155" fontSize="8" fontFamily="'JetBrains Mono'">{lossMax}</text>
          <text x="4" y={H-2} fill="#334155" fontSize="8" fontFamily="'JetBrains Mono'">{lossMin}</text>
        </svg>
      </div>
      <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:6, letterSpacing:2 }}>LEARNING RATE (warmup → cosine decay)</div>
      <svg width="100%" viewBox={`0 0 ${W} 50`} style={{ background:"#050a12", borderRadius:8, border:"1px solid #0f1a2e" }}>
        {lrHistory.length>1&&<path d={toPath(lrHistory,0,0.00032)} fill="none" stroke="#60a5fa" strokeWidth="2"/>}
        <line x1={(20/maxStep)*W} y1="0" x2={(20/maxStep)*W} y2="50" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3,3"/>
      </svg>
    </div>
  );
}


// ── 7. RoPE Viz ─────────────────────────────────────────────────
function RoPEViz({ accent }) {
  const [pos, setPos] = useState(0);
  const [animating, setAnimating] = useState(false);
  const maxPos = 7;
  useEffect(() => {
    if (!animating) return;
    if (pos>=maxPos) { setAnimating(false); return; }
    const t = setTimeout(() => setPos(p=>p+1), 600);
    return () => clearTimeout(t);
  }, [animating, pos]);
  const getAngle = (position, dim) => position * Math.pow(10000, -2*dim/8);
  const rotate = (x,y,theta) => [x*Math.cos(theta)-y*Math.sin(theta), x*Math.sin(theta)+y*Math.cos(theta)];
  const baseVec = [[0.8,0.3],[0.5,-0.6],[-0.4,0.7],[0.2,0.9]];
  const rotated = baseVec.map((pair,i) => { const theta=getAngle(pos,i); return rotate(pair[0],pair[1],theta); });
  const W=280, H=140, cx=70, cy=70, r=50;
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:20, marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <span style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700 }}>🌀 RoPE — Rotating Q/K vectors by position angle</span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#334155", fontFamily:"system-ui" }}>position:</span>
          <input type="range" min={0} max={maxPos} value={pos} onChange={e=>{setAnimating(false);setPos(+e.target.value);}} style={{ width:80, accentColor:accent }}/>
          <span style={{ fontSize:12, color:accent, fontFamily:"'JetBrains Mono',monospace", width:16 }}>{pos}</span>
          <button onClick={()=>{setPos(0);setAnimating(true);}} style={{ background:accent+"20", border:`1px solid ${accent}50`, color:accent, borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", fontFamily:"system-ui" }}>▶ play</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        {[0,1].map(di=>{
          const [bx,by]=baseVec[di]; const [rx,ry]=rotated[di]; const theta=getAngle(pos,di);
          return (
            <div key={di} style={{ flex:"0 0 auto" }}>
              <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:6, textAlign:"center" }}>dim pair {di*2},{di*2+1} · θ={theta.toFixed(2)}rad</div>
              <svg width={W/2} height={H} viewBox={`0 0 ${W/2} ${H}`} style={{ background:"#050a12", borderRadius:8, border:"1px solid #0f1a2e" }}>
                <line x1={cx} y1={0} x2={cx} y2={H} stroke="#1e293b" strokeWidth="1"/>
                <line x1={0} y1={cy} x2={W/2} y2={cy} stroke="#1e293b" strokeWidth="1"/>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3"/>
                <line x1={cx} y1={cy} x2={cx+bx*r} y2={cy-by*r} stroke="#334155" strokeWidth="2" strokeDasharray="4,3"/>
                <circle cx={cx+bx*r} cy={cy-by*r} r={4} fill="#334155"/>
                <text x={cx+bx*r+5} y={cy-by*r-4} fill="#475569" fontSize="9" fontFamily="system-ui">orig</text>
                <line x1={cx} y1={cy} x2={cx+rx*r} y2={cy-ry*r} stroke={accent} strokeWidth="2.5"/>
                <circle cx={cx+rx*r} cy={cy-ry*r} r={5} fill={accent}/>
                <text x={cx+rx*r+5} y={cy-ry*r-4} fill={accent} fontSize="9" fontFamily="system-ui">pos={pos}</text>
                {pos>0&&<path d={`M ${cx+18} ${cy} A 18 18 0 ${Math.abs(theta)>Math.PI?1:0} 0 ${cx+18*Math.cos(-theta)} ${cy+18*Math.sin(-theta)}`} fill="none" stroke={accent+"60"} strokeWidth="1.5"/>}
              </svg>
            </div>
          );
        })}
        <div style={{ flex:1, minWidth:160, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:8 }}>WHY IT WORKS</div>
            <div style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui", lineHeight:1.7 }}>Q and K get rotated by the <em>same</em> angle per position. Q·Kᵀ only sees the <strong style={{ color:"#94a3b8" }}>relative angle</strong> — so the model learns distances, not absolute positions.</div>
          </div>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:8 }}>vs LEARNED POS EMBED</div>
            {[["Learned","max_seq_len fixed","GPT-2"],["RoPE","any length ✓","LLaMA/Mistral"]].map(([n,a,u])=>(
              <div key={n} style={{ background:"#050a12", borderRadius:6, padding:"8px 10px", marginBottom:6 }}>
                <div style={{ fontSize:11, color:n==="RoPE"?accent:"#64748b", fontWeight:700, fontFamily:"system-ui" }}>{n}</div>
                <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui" }}>{a} · Used by: {u}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #0f1a2e" }}>
        <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:8, letterSpacing:2 }}>ROTATION SPEED PER DIM PAIR (lower = faster)</div>
        <div style={{ display:"flex", gap:6 }}>
          {[0,1,2,3].map(di=>{ const theta=getAngle(pos,di); const pct=Math.abs(Math.sin(theta)); return (
            <div key={di} style={{ flex:1, textAlign:"center" }}>
              <div style={{ background:"#050a12", borderRadius:4, height:40, display:"flex", alignItems:"flex-end", justifyContent:"center", overflow:"hidden" }}>
                <div style={{ width:"60%", background:accent, borderRadius:"3px 3px 0 0", height:`${pct*100}%`, transition:"height 0.4s", minHeight:2 }}/>
              </div>
              <div style={{ fontSize:9, color:"#334155", fontFamily:"system-ui", marginTop:3 }}>dim {di*2}-{di*2+1}</div>
              <div style={{ fontSize:9, color:accent, fontFamily:"'JetBrains Mono',monospace" }}>{theta.toFixed(2)}</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

// ── 8. GQA Viz ──────────────────────────────────────────────────
function GQAViz({ accent }) {
  const [mode, setMode] = useState("gqa");
  const configs = {
    mha:{ label:"MHA — Multi-Head Attention", qHeads:8, kvHeads:8, desc:"Every Q head has its own K and V. Max quality, full memory cost. GPT-2.", color:"#60a5fa" },
    mqa:{ label:"MQA — Multi-Query Attention", qHeads:8, kvHeads:1, desc:"All Q heads share 1 K+V head. Fastest inference, quality can drop.", color:"#f59e0b" },
    gqa:{ label:"GQA — Grouped-Query Attention",qHeads:8, kvHeads:2, desc:"Q heads split into groups, each sharing one K/V. Best tradeoff. LLaMA 2/3, Mistral.", color:accent },
  };
  const cfg = configs[mode];
  const qPerKV = cfg.qHeads/cfg.kvHeads;
  const colors = ["#f87171","#fb923c","#fbbf24","#a3e635","#34d399","#22d3ee","#818cf8","#e879f9"];
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:20, marginBottom:16 }}>
      <div style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700, marginBottom:16 }}>🧠 Attention Variants — Q heads vs K/V heads</div>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {Object.entries(configs).map(([key,c])=>(
          <button key={key} onClick={()=>setMode(key)} style={{ flex:1, background:mode===key?c.color+"20":"#0a1220", border:`1px solid ${mode===key?c.color:"#1e293b"}`, color:mode===key?c.color:"#475569", borderRadius:7, padding:"8px 4px", fontSize:11, cursor:"pointer", fontFamily:"system-ui", fontWeight:mode===key?700:400, transition:"all 0.2s" }}>{key.toUpperCase()}</button>
        ))}
      </div>
      <div style={{ fontSize:12, color:cfg.color, fontFamily:"system-ui", fontWeight:700, marginBottom:12 }}>{cfg.label}</div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 280px" }}>
          <div style={{ fontSize:10, color:"#475569", fontFamily:"system-ui", marginBottom:8, letterSpacing:2 }}>QUERY HEADS ({cfg.qHeads})</div>
          <div style={{ display:"flex", gap:5, marginBottom:16 }}>
            {Array.from({length:cfg.qHeads}).map((_,i)=>(
              <div key={i} style={{ flex:1, height:36, borderRadius:6, background:colors[i]+"30", border:`2px solid ${colors[i]}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:colors[i], fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>Q{i}</div>
            ))}
          </div>
          <div style={{ position:"relative", height:30, marginBottom:8 }}>
            <svg width="100%" height="30" viewBox="0 0 400 30" preserveAspectRatio="none">
              {Array.from({length:cfg.kvHeads}).map((_,ki)=>{
                const gs=qPerKV; const sq=ki*gs; const eq=sq+gs-1;
                const x1=((sq+0.5)/cfg.qHeads)*400; const x2=((eq+0.5)/cfg.qHeads)*400; const xm=((ki+0.5)/cfg.kvHeads)*400;
                return <g key={ki}><line x1={x1} y1={0} x2={xm} y2={28} stroke={cfg.color} strokeWidth="1.5" opacity="0.5"/>{sq!==eq&&<line x1={x2} y1={0} x2={xm} y2={28} stroke={cfg.color} strokeWidth="1.5" opacity="0.5"/>}</g>;
              })}
            </svg>
          </div>
          <div style={{ fontSize:10, color:"#475569", fontFamily:"system-ui", marginBottom:8, letterSpacing:2 }}>KEY/VALUE HEADS ({cfg.kvHeads}) — shared</div>
          <div style={{ display:"flex", gap:5 }}>
            {Array.from({length:cfg.kvHeads}).map((_,ki)=>{
              const sq=ki*qPerKV; const gc=Array.from({length:qPerKV}).map((_,qi)=>colors[sq+qi]);
              return <div key={ki} style={{ flex:cfg.qHeads/cfg.kvHeads, height:36, borderRadius:6, background:`linear-gradient(90deg,${gc.map(c=>c+"40").join(",")})`, border:`2px solid ${cfg.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:cfg.color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>KV{ki}<span style={{ fontSize:9, color:"#334155", marginLeft:4 }}>({qPerKV}Q)</span></div>;
            })}
          </div>
          <div style={{ marginTop:16, background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:12 }}>
            <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:8 }}>KV CACHE SIZE (inference)</div>
            {[{label:"MHA",ratio:1.0,col:"#60a5fa"},{label:"GQA (8/2)",ratio:2/8,col:accent},{label:"MQA",ratio:1/8,col:"#f59e0b"}].map(m=>(
              <div key={m.label} style={{ marginBottom:7 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:11, color:m.label.startsWith("G")?accent:"#475569", fontFamily:"system-ui" }}>{m.label}</span>
                  <span style={{ fontSize:11, color:m.col, fontFamily:"'JetBrains Mono',monospace" }}>{Math.round(m.ratio*100)}%</span>
                </div>
                <div style={{ background:"#050a12", borderRadius:3, height:10, overflow:"hidden" }}><div style={{ height:"100%", background:m.col, width:`${m.ratio*100}%`, borderRadius:3 }}/></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:"0 1 200px", display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"#0a1220", border:`1px solid ${cfg.color}30`, borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:cfg.color, fontFamily:"system-ui", marginBottom:8 }}>HOW IT WORKS</div>
            <div style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui", lineHeight:1.7 }}>{cfg.desc}</div>
          </div>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:10 }}>WHO USES WHAT</div>
            {[["GPT-2/3","MHA","#60a5fa"],["PaLM","MQA","#f59e0b"],["LLaMA 2","GQA",accent],["LLaMA 3","GQA",accent],["Mistral 7B","GQA",accent]].map(([m,t,c])=>(
              <div key={m} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui" }}>{m}</span>
                <span style={{ fontSize:11, color:c, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ── 9. SwiGLU Viz ───────────────────────────────────────────────
function SwiGLUViz({ accent }) {
  const [inputVal, setInputVal] = useState(0.5);
  const pts = 120;
  const gelu = x => x*0.5*(1+Math.tanh(Math.sqrt(2/Math.PI)*(x+0.044715*x**3)));
  const silu = x => x/(1+Math.exp(-x));
  const relu = x => Math.max(0,x);
  const swiglu = (x,gate) => silu(gate)*x;
  const W=340, H=100;
  const toSVG = (x,y,xMn=-3,xMx=3,yMn=-0.5,yMx=2) => [((x-xMn)/(xMx-xMn))*W, H-((y-yMn)/(yMx-yMn))*H];
  const makePath = fn => Array.from({length:pts}).map((_,i)=>{ const x=-3+(i/(pts-1))*6; const y=Math.max(-0.5,Math.min(2,fn(x))); const [sx,sy]=toSVG(x,y); return `${i===0?"M":"L"} ${sx} ${sy}`; }).join(" ");
  const swiPath = () => Array.from({length:pts}).map((_,i)=>{ const x=-3+(i/(pts-1))*6; const g=x*0.7+0.3; const y=Math.max(-0.5,Math.min(2,swiglu(x,g))); const [sx,sy]=toSVG(x,y); return `${i===0?"M":"L"} ${sx} ${sy}`; }).join(" ");
  const [ix,iy] = toSVG(inputVal,Math.max(-0.5,Math.min(2,gelu(inputVal))));
  const [sx2,sy2] = toSVG(inputVal,Math.max(-0.5,Math.min(2,swiglu(inputVal,inputVal*0.7+0.3))));
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:20, marginBottom:16 }}>
      <div style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700, marginBottom:16 }}>⚡ Activation Functions — ReLU vs GeLU vs SwiGLU</div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 300px" }}>
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
            {[["ReLU","#475569"],["GeLU","#60a5fa"],["SiLU","#a855f7"],["SwiGLU(x,gate)",accent]].map(([n,c])=>(
              <div key={n} style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:18, height:2, background:c, borderRadius:1 }}/><span style={{ fontSize:10, color:c, fontFamily:"system-ui" }}>{n}</span></div>
            ))}
          </div>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background:"#050a12", borderRadius:8, border:"1px solid #0f1a2e" }}>
            <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="#1e293b" strokeWidth="1"/>
            <line x1={0} y1={H*(1-0/2.5)} x2={W} y2={H*(1-0/2.5)} stroke="#1e293b" strokeWidth="1"/>
            <path d={makePath(relu)} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,3"/>
            <path d={makePath(gelu)} fill="none" stroke="#60a5fa" strokeWidth="2"/>
            <path d={makePath(silu)} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2,2"/>
            <path d={swiPath()} fill="none" stroke={accent} strokeWidth="2.5"/>
            <circle cx={ix} cy={iy} r={5} fill="#60a5fa"/>
            <circle cx={sx2} cy={sy2} r={6} fill={accent}/>
          </svg>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
            <span style={{ fontSize:10, color:"#334155", fontFamily:"system-ui" }}>x =</span>
            <input type="range" min={-30} max={30} value={Math.round(inputVal*10)} onChange={e=>setInputVal(e.target.value/10)} style={{ flex:1, accentColor:accent }}/>
            <span style={{ fontSize:12, color:accent, fontFamily:"'JetBrains Mono',monospace", width:36 }}>{inputVal.toFixed(1)}</span>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            {[["GeLU(x)",gelu(inputVal),"#60a5fa"],["SwiGLU(x)",swiglu(inputVal,inputVal*0.7+0.3),accent]].map(([l,v,c])=>(
              <div key={l} style={{ flex:1, background:"#0a1220", border:`1px solid ${c}30`, borderRadius:6, padding:"6px 10px", textAlign:"center" }}>
                <div style={{ fontSize:9, color:"#334155", fontFamily:"system-ui" }}>{l}</div>
                <div style={{ fontSize:14, fontWeight:700, color:c, fontFamily:"'JetBrains Mono',monospace" }}>{v.toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:"0 1 220px", display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:"#60a5fa", fontFamily:"system-ui", marginBottom:10 }}>STANDARD FFN (GeLU)</div>
            {[["Linear","d → 4d"],["GeLU","activate"],["Linear","4d → d"]].map(([op,desc])=>(
              <div key={op} style={{ background:"#050a12", borderRadius:5, padding:"6px 10px", marginBottom:4, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui" }}>{op}</span>
                <span style={{ fontSize:10, color:"#334155", fontFamily:"'JetBrains Mono',monospace" }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"#0a1220", border:`1px solid ${accent}30`, borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:10 }}>SWIGLU FFN (LLaMA)</div>
            {[["W1·x","d→8/3d"],["W3·x","d→8/3d (gate)"],["SiLU(W1x)⊗W3x","gate multiply"],["W2·out","8/3d→d"]].map(([op,desc],i)=>(
              <div key={op} style={{ background:"#050a12", borderRadius:5, padding:"6px 10px", marginBottom:4, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:i===2?accent:"#64748b", fontFamily:"'JetBrains Mono',monospace" }}>{op}</span>
                <span style={{ fontSize:9, color:"#334155", fontFamily:"system-ui" }}>{desc}</span>
              </div>
            ))}
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginTop:6 }}>3 matrices, 8/3 dim = same FLOPs ✓</div>
          </div>
          <div style={{ background:"#0a1220", border:"1px solid #1e293b", borderRadius:8, padding:14 }}>
            <div style={{ fontSize:10, color:accent, fontFamily:"system-ui", marginBottom:8 }}>WHY BETTER?</div>
            <div style={{ fontSize:11, color:"#64748b", fontFamily:"system-ui", lineHeight:1.7 }}>The gate (W3·x) learns <em>which dims matter</em> for this token. SiLU has smooth gradient everywhere unlike ReLU.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 10. Classic vs Modern Comparison Viz ───────────────────────
function ComparisonViz({ accent }) {
  const [hover, setHover] = useState(null);
  const rows = [
    { feature:"Position Encoding", classic:"Learned Embed", modern:"RoPE", why:"RoPE generalizes to any length; learned embeddings cap at max_seq_len" },
    { feature:"Attention", classic:"MHA (full KV)", modern:"GQA (grouped KV)", why:"GQA cuts KV cache 4–8× at inference — critical for long contexts" },
    { feature:"FFN Activation", classic:"GeLU", modern:"SwiGLU", why:"SwiGLU adds a learned gate, letting the model suppress irrelevant dims" },
    { feature:"Normalization", classic:"Post-Norm LayerNorm", modern:"Pre-Norm RMSNorm", why:"RMSNorm is ~10% faster. Pre-Norm stabilizes deep training." },
    { feature:"Bias terms", classic:"bias=True", modern:"bias=False", why:"Removing biases saves params with no quality loss." },
  ];
  const models = [
    {name:"GPT-2",rope:false,gqa:false,swiglu:false,year:"2019"},
    {name:"GPT-3",rope:false,gqa:false,swiglu:false,year:"2020"},
    {name:"PaLM",rope:false,gqa:false,swiglu:true,year:"2022"},
    {name:"LLaMA 1",rope:true,gqa:false,swiglu:true,year:"2023"},
    {name:"LLaMA 2",rope:true,gqa:true,swiglu:true,year:"2023"},
    {name:"Mistral",rope:true,gqa:true,swiglu:true,year:"2023"},
    {name:"LLaMA 3",rope:true,gqa:true,swiglu:true,year:"2024"},
    {name:"Gemma 2",rope:true,gqa:true,swiglu:true,year:"2024"},
  ];
  return (
    <div style={{ background:"#070e1a", border:`1px solid ${accent}25`, borderRadius:12, padding:20, marginBottom:16 }}>
      <div style={{ fontSize:12, color:accent, fontFamily:"system-ui", fontWeight:700, marginBottom:20 }}>📊 GPT-2 Classic → LLaMA-3 Modern — What Changed</div>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:"#1e293b", borderRadius:8, overflow:"hidden", marginBottom:2 }}>
          {["Component","GPT-2 (Classic)","LLaMA 3 (Modern)"].map(h=><div key={h} style={{ background:"#0a1220", padding:"8px 12px", fontSize:10, color:"#475569", fontFamily:"system-ui", letterSpacing:2 }}>{h}</div>)}
        </div>
        {rows.map((row,i)=>(
          <div key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:"#1e293b", marginBottom:1, cursor:"default" }}>
            <div style={{ background:hover===i?"#0a1628":"#080e1a", padding:"10px 12px", fontSize:11, color:"#94a3b8", fontFamily:"system-ui" }}>{row.feature}</div>
            <div style={{ background:hover===i?"#0a1628":"#070d18", padding:"10px 12px", fontSize:11, color:"#475569", fontFamily:"'JetBrains Mono',monospace" }}>{row.classic}</div>
            <div style={{ background:hover===i?accent+"10":"#060a14", padding:"10px 12px", fontSize:11, color:accent, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{row.modern}</div>
          </div>
        ))}
        {hover!==null&&<div style={{ background:"#0a1628", border:`1px solid ${accent}30`, borderRadius:6, padding:"8px 12px", marginTop:6 }}><span style={{ fontSize:11, color:accent+"cc", fontFamily:"system-ui" }}>💡 {rows[hover].why}</span></div>}
      </div>
      <div style={{ fontSize:10, color:"#334155", fontFamily:"system-ui", marginBottom:12, letterSpacing:2 }}>MODEL ADOPTION TIMELINE</div>
      <div style={{ display:"flex", gap:1, overflowX:"auto" }}>
        {models.map((m,i)=>(
          <div key={i} style={{ flex:"0 0 auto", minWidth:80, background:"#080e1a", border:"1px solid #1e293b", borderRadius:8, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", fontFamily:"system-ui", marginBottom:4 }}>{m.name}</div>
            <div style={{ fontSize:9, color:"#334155", fontFamily:"system-ui", marginBottom:8 }}>{m.year}</div>
            {[["RoPE",m.rope,"#00e5a0"],["GQA",m.gqa,"#e879f9"],["SwiGLU",m.swiglu,accent]].map(([l,has,c])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:9, color:has?"#475569":"#1e293b", fontFamily:"system-ui" }}>{l}</span>
                <span style={{ fontSize:11, color:has?c:"#1e293b" }}>{has?"✓":"·"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// ALL STEPS — Foundation (1–6) + Modern Techniques (7–10)
// ═══════════════════════════════════════════════════════════════

const STEPS = [
  // ── FOUNDATION STEPS ────────────────────────────────────────
  {
    id:1, title:"Tokenization & BPE", color:"#00e5a0", tag:"FOUNDATION",
    tagline:"How raw text becomes numbers the model learns from",
    concept:`A vocabulary is your model's dictionary of sub-word pieces.
BPE builds it by repeatedly merging the most frequent character pairs
until vocab_size is reached.

"playing" → ['p','l','a','y','i','n','g']  (7 chars)
  → after BPE: ['play','ing']              (2 tokens!)

Every word gets broken into known pieces. Unknown words → characters.
GPT-2: 50,257 tokens. GPT-4: ~100,000. Your file: start with 500–3000.`,
    params:[
      {name:"vocab_size=2000",rule:"≈ √(total words). 1M words → ~1000 vocab",options:["500–2k tiny","8k–16k medium","50k production"]},
      {name:"min_frequency=2",rule:"Small corpus: 2. Large corpus (1GB+): 5–10",options:["1=memorize all","2–5 balanced","10+ conservative"]},
      {name:"special_tokens",rule:"Always include all 4. Add [SEP] for Q&A tasks.",options:["[PAD]=0 [UNK]=1 [BOS]=2 [EOS]=3"]},
    ],
    code:`from tokenizers import Tokenizer, models, trainers, pre_tokenizers
tokenizer = Tokenizer(models.BPE(unk_token="[UNK]"))
tokenizer.pre_tokenizer = pre_tokenizers.Whitespace()
trainer = trainers.BpeTrainer(
    vocab_size=2000, min_frequency=2,
    special_tokens=["[PAD]","[UNK]","[BOS]","[EOS]"]
)
tokenizer.train(["my_text.txt"], trainer)
tokenizer.save("bpe_tokenizer.json")
enc = tokenizer.encode("the cat sat")
print(enc.tokens, enc.ids)  # ['the','cat','sat'] [4,5,6]`,
    VizComponent: TokenizerViz,
  },
  {
    id:2, title:"Embeddings", color:"#ff6b35", tag:"FOUNDATION",
    tagline:"Integer IDs → meaningful floating-point vectors",
    concept:`Token IDs have no mathematical meaning — ID 500 is not "more" than ID 5.
Embeddings map each ID to a dense learned vector of d_model numbers.

  "cat"  → [0.82, -0.31, 0.55, ...]  similar to "dog"
  "the"  → [0.04,  0.01, -0.09, ...]  very different

Positional embeddings add WHERE each token is in the sequence.
Without them, "cat sat" and "sat cat" look identical to the model.

x = token_embedding + positional_embedding  →  (B, T, d_model)`,
    params:[
      {name:"d_model=512",rule:"Must be divisible by n_heads. 256→small, 512→medium, 768→GPT-2",options:["256 ~2GB","512 ~4GB","768 ~8GB"]},
      {name:"max_seq_len=1024",rule:"Context window. Start with 256 for experiments.",options:["256 fast","512 decent","1024 GPT-2","128k GPT-4"]},
      {name:"dropout=0.1",rule:"0.0 for tiny datasets, 0.1 standard, 0.2 large data",options:["0.0 no reg","0.1 standard","0.2 heavy"]},
    ],
    code:`import torch, torch.nn as nn
class GPTEmbedding(nn.Module):
    def __init__(self, vocab_size, d_model, max_seq_len, dropout=0.1):
        super().__init__()
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb   = nn.Embedding(max_seq_len, d_model)
        self.drop      = nn.Dropout(dropout)
    def forward(self, x):          # x: (B, T)
        B, T = x.shape
        pos = torch.arange(T, device=x.device)
        return self.drop(self.token_emb(x) + self.pos_emb(pos))`,
    VizComponent: EmbeddingViz,
  },
  {
    id:3, title:"Causal Self-Attention", color:"#a855f7", tag:"FOUNDATION",
    tagline:"Every token gathers context from all previous tokens",
    concept:`Self-attention lets each token look at other tokens and borrow meaning.

Q (Query) = "what am I looking for?"
K (Key)   = "what do I offer?"
V (Value) = "what do I pass if selected?"

Score = Q·Kᵀ / √d_head  →  how relevant is token j to token i?

"Causal" = token i can ONLY see positions 0..i. No future peeking.
Multi-head: 8 heads run in parallel, each learning different patterns.`,
    params:[
      {name:"n_heads=8",rule:"Must divide d_model. 512/8=64 per head (sweet spot).",options:["4 heads small","8 standard","12 GPT-2sm"]},
      {name:"d_head = d_model/n_heads",rule:"Keep ≥32. 64 is ideal.",options:["32 minimal","64 standard","128 fewer heads"]},
      {name:"is_causal=True",rule:"Always True for GPT. False for BERT/encoder models.",options:["True=GPT","False=BERT"]},
    ],
    code:`import torch.nn.functional as F
class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        self.n_heads = n_heads
        self.d_head  = d_model // n_heads
        self.qkv  = nn.Linear(d_model, 3*d_model, bias=False)
        self.proj = nn.Linear(d_model, d_model, bias=False)
        self.drop = nn.Dropout(dropout)
    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv(x).split(C, dim=2)
        q = q.view(B,T,self.n_heads,self.d_head).transpose(1,2)
        k = k.view(B,T,self.n_heads,self.d_head).transpose(1,2)
        v = v.view(B,T,self.n_heads,self.d_head).transpose(1,2)
        out = F.scaled_dot_product_attention(
            q, k, v, is_causal=True,
            dropout_p=self.drop.p if self.training else 0.0)
        return self.proj(out.transpose(1,2).contiguous().view(B,T,C))`,
    VizComponent: AttentionViz,
  },
  {
    id:4, title:"Transformer Block", color:"#f59e0b", tag:"FOUNDATION",
    tagline:"Attention + FFN + residuals = one layer of thinking",
    concept:`One block = two sublayers with Pre-Norm + Residual:

  x = x + attention(LayerNorm(x))   ← gather context
  x = x + ffn(LayerNorm(x))         ← process knowledge

Residual (skip connection): adds sublayer output to original input.
Prevents vanishing gradients in deep networks.

FFN: 512 → 2048 → 512 with GeLU. Acts as per-token memory.
Stack n_layers blocks for increasing depth of understanding.`,
    params:[
      {name:"FFN 4× expansion",rule:"4× proven. LLaMA uses 8/3× with SwiGLU (step 9).",options:["2× compact","4× standard","8/3 SwiGLU"]},
      {name:"GeLU activation",rule:"GeLU for GPT-2/3. SwiGLU for modern (LLaMA/Mistral).",options:["ReLU old","GeLU GPT-2/3","SwiGLU modern"]},
      {name:"n_layers=6",rule:"4 for learning, 12 GPT-2 small, 96 GPT-3.",options:["4 fast","6–8 small","12 GPT-2sm","96 GPT-3"]},
    ],
    code:`class FFN(nn.Module):
    def __init__(self, d_model, dropout=0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d_model, 4*d_model, bias=False),
            nn.GELU(),
            nn.Linear(4*d_model, d_model, bias=False),
            nn.Dropout(dropout))
    def forward(self, x): return self.net(x)

class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = CausalSelfAttention(d_model, n_heads, dropout)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = FFN(d_model, dropout)
    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.ffn(self.ln2(x))
        return x`,
    VizComponent: TransformerBlockViz,
  },
  {
    id:5, title:"Full GPT Model", color:"#3b82f6", tag:"FOUNDATION",
    tagline:"Assembling all components into a working language model",
    concept:`Full pipeline:
  tokens → Embedding → [Block × N] → LayerNorm → LM Head → logits

LM Head: Linear(d_model, vocab_size) — scores each vocab token.
Weight tying: LM Head shares weights with Token Embedding matrix.
Same matrix for input lookup AND output scoring → better quality.

Autoregressive generation:
  Feed [BOS, cat, sat] → predict "on"
  Feed [BOS, cat, sat, on] → predict "the"
  Until [EOS] or max_new tokens.`,
    params:[
      {name:"temperature=1.0",rule:"<1 focused, >1 creative. 0.7–0.9 for coherent text.",options:["0.1 greedy","0.8 balanced","1.3 creative"]},
      {name:"top_k=40",rule:"Only sample from 40 best tokens. Prevents weird outputs.",options:["1 greedy","20–50 diverse","top_p=0.9 nucleus"]},
      {name:"weight tying",rule:"Always use — free quality improvement.",options:["head.weight = embed.weight"]},
    ],
    code:`class GPT(nn.Module):
    def __init__(self, vocab_size, d_model=512, n_heads=8, n_layers=6, max_seq_len=1024, dropout=0.1):
        super().__init__()
        self.embed  = GPTEmbedding(vocab_size, d_model, max_seq_len, dropout)
        self.blocks = nn.ModuleList([TransformerBlock(d_model, n_heads, dropout) for _ in range(n_layers)])
        self.ln_f   = nn.LayerNorm(d_model)
        self.head   = nn.Linear(d_model, vocab_size, bias=False)
        self.head.weight = self.embed.token_emb.weight  # weight tying
        self.apply(lambda m: nn.init.normal_(m.weight, std=0.02) if isinstance(m,(nn.Linear,nn.Embedding)) else None)
    def forward(self, x, targets=None):
        x = self.embed(x)
        for blk in self.blocks: x = blk(x)
        logits = self.head(self.ln_f(x))
        loss = F.cross_entropy(logits.view(-1,logits.size(-1)), targets.view(-1)) if targets is not None else None
        return logits, loss`,
    VizComponent: FullArchViz,
  },
  {
    id:6, title:"Training Loop", color:"#10b981", tag:"FOUNDATION",
    tagline:"Teaching the model to predict next tokens from your text",
    concept:`Training = predict next token at every position.

  input  = [BOS, the, cat, sat, on, the]
  target = [the, cat, sat, on, the, mat]  (shifted by 1)

Loss = cross-entropy at every position, averaged.
Optimizer: AdamW — per-weight momentum + variance scaling.
LR schedule: linear warmup then cosine decay.
Gradient clip (norm ≤ 1.0): prevents training collapse.`,
    params:[
      {name:"max_lr=3e-4",rule:"Safe start. Scale down for bigger models.",options:["1e-3 risky","3e-4 standard","1e-4 safe"]},
      {name:"warmup_steps=100",rule:"~1% of total steps. Prevents early gradient explosion.",options:["0 skip","100 short","2000 large"]},
      {name:"weight_decay=0.1",rule:"Apply only to 2D+ params (weights, not biases/norms).",options:["0.0 none","0.01 light","0.1 standard"]},
    ],
    code:`import math
from torch.optim import AdamW
def get_lr(step, warmup=100, total=1000, max_lr=3e-4, min_lr=3e-5):
    if step < warmup: return max_lr * step / warmup
    if step >= total: return min_lr
    p = (step-warmup)/(total-warmup)
    return min_lr + 0.5*(1+math.cos(math.pi*p))*(max_lr-min_lr)
optimizer = AdamW([
    {'params':[p for p in model.parameters() if p.dim()>=2],'weight_decay':0.1},
    {'params':[p for p in model.parameters() if p.dim()<2], 'weight_decay':0.0},
], lr=3e-4, betas=(0.9,0.95))
for step, (x, y) in enumerate(loader):
    for g in optimizer.param_groups: g['lr'] = get_lr(step)
    with torch.autocast(device_type='cuda', dtype=torch.bfloat16):
        logits, loss = model(x.cuda(), targets=y.cuda())
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()`,
    VizComponent: TrainingViz,
  },

  // ── MODERN TECHNIQUES ───────────────────────────────────────
  {
    id:7, title:"RoPE", color:"#34d399", tag:"MODERN",
    tagline:"Rotary Position Embedding — used by LLaMA, Mistral, Gemma",
    concept:`Learned position embeddings (GPT-2) have one hard limit:
you set max_seq_len=1024 at training time and the model can NEVER
handle longer sequences.

RoPE fixes this by encoding position as a ROTATION of Q and K vectors.
Each dimension pair rotates at a different frequency:
  θᵢ = position × 10000^(-2i/d_head)

Key insight: Q·Kᵀ only sees the RELATIVE rotation between positions.
"cat at pos 2 attends to 'the' at pos 0" = relative distance of 2.
Absolute position cancels out. Model generalizes to any length.

Used by: LLaMA 1/2/3, Mistral, Falcon, Gemma, Qwen, Yi — every
major open-source model since 2023 uses RoPE.`,
    params:[
      {name:"base=10000",rule:"Default. LLaMA 3 uses 500000 for 128k context.",options:["10000 standard","500000 LLaMA3","1M+ very long"]},
      {name:"dim pairs",rule:"Auto: d_head//2 pairs. No choice needed.",options:["d_head=64→32 pairs","d_head=128→64 pairs"]},
      {name:"RoPE scaling",rule:"For context > training length: YaRN or linear scaling.",options:["None standard","linear simple","YaRN LLaMA3.1"]},
    ],
    code:`import torch, torch.nn as nn

class RotaryEmbedding(nn.Module):
    def __init__(self, d_head, base=10000):
        super().__init__()
        inv_freq = 1.0 / (base ** (torch.arange(0, d_head, 2).float() / d_head))
        self.register_buffer("inv_freq", inv_freq)  # not learned
    def forward(self, seq_len, device):
        t = torch.arange(seq_len, device=device).float()
        freqs = torch.outer(t, self.inv_freq)         # (T, d_head//2)
        emb = torch.cat([freqs, freqs], dim=-1)        # (T, d_head)
        return emb.cos(), emb.sin()

def rotate_half(x):
    x1, x2 = x[..., :x.shape[-1]//2], x[..., x.shape[-1]//2:]
    return torch.cat([-x2, x1], dim=-1)

def apply_rope(q, k, cos, sin):
    cos = cos[None, None, :, :]   # broadcast over batch+heads
    sin = sin[None, None, :, :]
    return q*cos + rotate_half(q)*sin, k*cos + rotate_half(k)*sin

# In attention: replace learned pos_emb with RoPE applied to Q and K
# cos, sin = self.rope(T, device)
# q, k = apply_rope(q, k, cos, sin)   ← only change needed`,
    VizComponent: RoPEViz,
  },
  {
    id:8, title:"GQA", color:"#e879f9", tag:"MODERN",
    tagline:"Grouped-Query Attention — share K/V heads, massive inference speedup",
    concept:`KV cache is the #1 inference bottleneck. For each generated token,
the model stores K and V for every past token in every layer:
  KV cache = 2 × n_layers × n_heads × seq_len × d_head × 2 bytes

Three approaches:
  MHA: n_Q = n_K = n_V heads. Full quality, full memory.
  MQA: all Q heads share 1 K/V head. Fast, quality drops.
  GQA: Q heads grouped, each group shares 1 K/V head. Best of both.

GQA with n_heads=32, n_kv_heads=8:
  KV cache = 8/32 = 25% of MHA
  Quality ≈ MHA (nearly identical in benchmarks)
  Inference 2–4× faster on long sequences

LLaMA 2 70B: 64Q, 8KV heads. Mistral 7B: 32Q, 8KV heads.`,
    params:[
      {name:"n_kv_heads",rule:"Must divide n_heads. Start at n_heads//4.",options:["n_heads=MHA","n_heads//4 GQA","1=MQA"]},
      {name:"groups = n_heads/n_kv_heads",rule:"32/8=4 groups (LLaMA standard). Each group shares 1 KV.",options:["2 groups mild","4 standard","8 aggressive"]},
      {name:"repeat_kv",rule:"Expand KV heads to match Q count before attention.",options:["torch.repeat_interleave"]},
    ],
    code:`def repeat_kv(x, n_rep):
    if n_rep == 1: return x         # MHA: no repeat needed
    B, nkv, T, d = x.shape
    return x[:,:,None,:,:].expand(B, nkv, n_rep, T, d).reshape(B, nkv*n_rep, T, d)

class GroupedQueryAttention(nn.Module):
    def __init__(self, d_model, n_heads, n_kv_heads, dropout=0.0):
        super().__init__()
        self.n_heads = n_heads; self.n_kv = n_kv_heads
        self.n_rep = n_heads // n_kv_heads
        self.d_head = d_model // n_heads
        self.wq = nn.Linear(d_model, n_heads    * self.d_head, bias=False)
        self.wk = nn.Linear(d_model, n_kv_heads * self.d_head, bias=False)  # smaller!
        self.wv = nn.Linear(d_model, n_kv_heads * self.d_head, bias=False)  # smaller!
        self.wo = nn.Linear(d_model, d_model, bias=False)
    def forward(self, x):
        B, T, C = x.shape
        q = self.wq(x).view(B,T,self.n_heads,self.d_head).transpose(1,2)
        k = self.wk(x).view(B,T,self.n_kv,self.d_head).transpose(1,2)
        v = self.wv(x).view(B,T,self.n_kv,self.d_head).transpose(1,2)
        k = repeat_kv(k, self.n_rep)   # expand to n_heads
        v = repeat_kv(v, self.n_rep)
        out = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        return self.wo(out.transpose(1,2).contiguous().view(B,T,C))`,
    VizComponent: GQAViz,
  },
  {
    id:9, title:"SwiGLU", color:"#fb923c", tag:"MODERN",
    tagline:"Swish-Gated Linear Unit — the FFN upgrade used by every modern LLM",
    concept:`Standard FFN: Linear → GeLU → Linear
GeLU activates based only on the value itself. No context.

SwiGLU FFN: two parallel projections, one gates the other.
  W1·x  = "content" — what information is here?
  W3·x  = "gate"    — which dimensions matter for THIS token?
  output = SiLU(W3·x) ⊗ W1·x       (element-wise multiply)

The gate learns to suppress irrelevant dimensions per-token.
Think of it as attention inside the FFN — but over dimensions.

SiLU(x) = x × sigmoid(x):
  Smooth everywhere (gradient never dies)
  Slight negative values (unlike ReLU) → richer representation

Dimension: 3 matrices × 8/3d = same FLOPs as 2 × 4d standard FFN.
Used by: LLaMA 1/2/3, PaLM, Gemma, Mistral, Qwen — all modern LLMs.`,
    params:[
      {name:"hidden_dim = 8/3 × d_model",rule:"Round to multiple of 256. LLaMA 7B uses 11008.",options:["int(8*d/3)","round to 256","LLaMA7B=11008"]},
      {name:"3 weight matrices",rule:"W1 (content), W3 (gate), W2 (out). All bias=False.",options:["W1:d→8/3d","W3:d→8/3d gate","W2:8/3d→d"]},
      {name:"F.silu",rule:"Same as Swish. Built-in PyTorch: F.silu(x) = x*sigmoid(x).",options:["F.silu(x)","x*torch.sigmoid(x)"]},
    ],
    code:`import torch.nn.functional as F

class SwiGLUFFN(nn.Module):
    def __init__(self, d_model, hidden_dim=None, dropout=0.0):
        super().__init__()
        if hidden_dim is None:
            hidden_dim = int(8 * d_model / 3)
            hidden_dim = (hidden_dim + 255) // 256 * 256  # round to 256
        self.w1 = nn.Linear(d_model, hidden_dim, bias=False)  # content
        self.w3 = nn.Linear(d_model, hidden_dim, bias=False)  # gate
        self.w2 = nn.Linear(hidden_dim, d_model, bias=False)  # output
        self.drop = nn.Dropout(dropout)
    def forward(self, x):
        # Gate: SiLU(W3·x) controls which dims W1·x passes through
        return self.drop(self.w2(F.silu(self.w1(x)) * self.w3(x)))

# Drop-in replacement for standard FFN in TransformerBlock:
class RMSNorm(nn.Module):
    def __init__(self, d, eps=1e-5):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(d)); self.eps = eps
    def forward(self, x):
        return self.weight * (x / x.pow(2).mean(-1,keepdim=True).add(self.eps).sqrt())

class ModernBlock(nn.Module):
    def __init__(self, d_model, n_heads, n_kv_heads):
        super().__init__()
        self.ln1  = RMSNorm(d_model)
        self.attn = GroupedQueryAttention(d_model, n_heads, n_kv_heads)
        self.ln2  = RMSNorm(d_model)
        self.ffn  = SwiGLUFFN(d_model)
    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.ffn(self.ln2(x))
        return x`,
    VizComponent: SwiGLUViz,
  },
  {
    id:10, title:"Modern LLM", color:"#60a5fa", tag:"MODERN",
    tagline:"All upgrades together: RoPE + GQA + SwiGLU = LLaMA-3 style",
    concept:`Combining all three upgrades:

  GPT-2 style:                     LLaMA-3 style:
  ─────────────────────────────    ──────────────────────────────
  Learned pos embedding         →  RoPE (any length)
  MHA full KV heads             →  GQA grouped KV
  FFN: Linear → GeLU → Linear   →  SwiGLU gated FFN
  LayerNorm post                →  RMSNorm pre (faster)
  bias=True                     →  bias=False

Benefits:
  2–4× faster inference      (GQA KV cache reduction)
  Any context length         (RoPE generalization)
  Better perplexity/FLOP     (SwiGLU gating)
  More stable deep training  (RMSNorm + no bias)

Your small learning model with modern stack:
  vocab=2000, d=512, n_heads=8, n_kv=2, n_layers=6 → ~50M params`,
    params:[
      {name:"small modern config",rule:"d=512, n_heads=8, n_kv=2, n_layers=6 → ~50M params",options:["512 dim","8/2 GQA","6 layers"]},
      {name:"rope_base=10000",rule:"10000 for short ctx. 500k–1M for long context models.",options:["10000 default","500000 long ctx","1M ultra long"]},
      {name:"n_kv = n_heads//4",rule:"LLaMA standard. 8 heads → 2 kv heads (4 groups).",options:["8 heads/2 kv","32 heads/8 kv","64 heads/8 kv"]},
    ],
    code:`class ModernGPT(nn.Module):
    def __init__(self, vocab_size, d_model=512, n_heads=8,
                 n_kv_heads=2, n_layers=6, rope_base=10000):
        super().__init__()
        self.embed  = nn.Embedding(vocab_size, d_model)
        self.rope   = RotaryEmbedding(d_model//n_heads, base=rope_base)
        self.blocks = nn.ModuleList([
            ModernBlock(d_model, n_heads, n_kv_heads)
            for _ in range(n_layers)
        ])
        self.norm = RMSNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)
        self.head.weight = self.embed.weight  # weight tying
        self.apply(lambda m: nn.init.normal_(m.weight,std=0.02) if isinstance(m,(nn.Linear,nn.Embedding)) else None)
    def forward(self, x, targets=None):
        B, T = x.shape
        h = self.embed(x)
        cos, sin = self.rope(T, x.device)
        for blk in self.blocks:
            h = blk(h)          # (blocks internally use GQA+SwiGLU)
        logits = self.head(self.norm(h))
        loss = F.cross_entropy(logits.view(-1,logits.size(-1)), targets.view(-1)) if targets is not None else None
        return logits, loss

# Small modern model — ~50M params
model = ModernGPT(vocab_size=tokenizer.get_vocab_size())
print(sum(p.numel() for p in model.parameters())/1e6, "M params")`,
    VizComponent: ComparisonViz,
  },
];


// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function GPTCompleteGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);
  const step = STEPS[activeStep];
  const VizComp = step.VizComponent;

  const foundationSteps = STEPS.filter(s => s.tag === "FOUNDATION");
  const modernSteps     = STEPS.filter(s => s.tag === "MODERN");

  return (
    <div style={{ minHeight:"100vh", background:"#060a12", color:"#e2e8f0", display:"flex", flexDirection:"column", fontFamily:"'JetBrains Mono',monospace" }}>

      {/* ─── Header ─── */}
      <div style={{ padding:"14px 24px", borderBottom:"1px solid #0f1a2e", display:"flex", alignItems:"center", gap:16, flexShrink:0, background:"#04070d" }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:4, color:"#1d4ed8", marginBottom:2 }}>COMPLETE VISUAL GUIDE</div>
          <h1 style={{ margin:0, fontSize:17, fontWeight:800, background:`linear-gradient(90deg, #e2e8f0 30%, ${step.color})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", transition:"all 0.4s" }}>
            Modern GPT from Scratch — Foundation → LLaMA-3 Style
          </h1>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:step.tag==="MODERN"?"#00e5a015":"#1d4ed815", border:`1px solid ${step.tag==="MODERN"?"#00e5a030":"#1d4ed830"}`, borderRadius:6, padding:"3px 10px", fontSize:10, color:step.tag==="MODERN"?"#00e5a0":"#60a5fa" }}>
            {step.tag}
          </div>
          <div style={{ background:step.color+"15", border:`1px solid ${step.color}30`, borderRadius:7, padding:"5px 12px", fontSize:10, color:step.color }}>
            {activeStep+1}/{STEPS.length} · {step.title}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ─── Sidebar ─── */}
        <div style={{ width:185, borderRight:"1px solid #0f1a2e", flexShrink:0, overflowY:"auto", padding:"10px 0", background:"#04070d" }}>

          {/* Foundation section */}
          <div style={{ padding:"6px 14px 4px", fontSize:9, letterSpacing:3, color:"#1d4ed8" }}>FOUNDATION</div>
          {foundationSteps.map((s,i) => (
            <button key={s.id} onClick={() => setActiveStep(STEPS.indexOf(s))} style={{ display:"block", width:"100%", textAlign:"left", background:activeStep===STEPS.indexOf(s)?"#0a1628":"transparent", border:"none", borderLeft:`3px solid ${activeStep===STEPS.indexOf(s)?s.color:"transparent"}`, padding:"9px 14px", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ fontSize:9, color:s.color, letterSpacing:2, opacity:activeStep===STEPS.indexOf(s)?1:0.4, marginBottom:2 }}>{String(s.id).padStart(2,"0")}</div>
              <div style={{ fontSize:11, fontWeight:600, color:activeStep===STEPS.indexOf(s)?"#e2e8f0":"#334155" }}>{s.title}</div>
            </button>
          ))}

          {/* Modern section */}
          <div style={{ padding:"14px 14px 4px", fontSize:9, letterSpacing:3, color:"#00e5a0", borderTop:"1px solid #0f1a2e", marginTop:8 }}>MODERN UPGRADES</div>
          {modernSteps.map((s) => (
            <button key={s.id} onClick={() => setActiveStep(STEPS.indexOf(s))} style={{ display:"block", width:"100%", textAlign:"left", background:activeStep===STEPS.indexOf(s)?"#0a1628":"transparent", border:"none", borderLeft:`3px solid ${activeStep===STEPS.indexOf(s)?s.color:"transparent"}`, padding:"9px 14px", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ fontSize:9, color:s.color, letterSpacing:2, opacity:activeStep===STEPS.indexOf(s)?1:0.4, marginBottom:2 }}>{String(s.id).padStart(2,"0")}</div>
              <div style={{ fontSize:11, fontWeight:600, color:activeStep===STEPS.indexOf(s)?"#e2e8f0":"#334155" }}>{s.title}</div>
            </button>
          ))}

          {/* Progress */}
          <div style={{ margin:"16px 12px 0", padding:"12px", background:"#091220", borderRadius:8, border:"1px solid #0f1a2e" }}>
            <div style={{ fontSize:9, color:"#1e3a5f", fontFamily:"system-ui", marginBottom:8, letterSpacing:2 }}>PROGRESS</div>
            <div style={{ background:"#050a12", borderRadius:3, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", background:`linear-gradient(90deg, #60a5fa, ${step.color})`, width:`${((activeStep+1)/STEPS.length)*100}%`, borderRadius:3, transition:"width 0.4s" }}/>
            </div>
            <div style={{ fontSize:9, color:"#334155", fontFamily:"system-ui", marginTop:6 }}>{activeStep+1} of {STEPS.length} steps</div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

          {/* Step header */}
          <div style={{ marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${step.color}20` }}>
            <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
              <div style={{ display:"inline-block", background:step.color+"15", border:`1px solid ${step.color}35`, color:step.color, borderRadius:5, padding:"2px 10px", fontSize:9, letterSpacing:3 }}>
                STEP {step.id}
              </div>
              <div style={{ background:step.tag==="MODERN"?"#00e5a015":"transparent", border:`1px solid ${step.tag==="MODERN"?"#00e5a030":"transparent"}`, color:"#00e5a0", borderRadius:5, padding:"2px 8px", fontSize:9, letterSpacing:2 }}>
                {step.tag==="MODERN"?"✦ MODERN TECHNIQUE":""}
              </div>
            </div>
            <h2 style={{ margin:"0 0 4px", fontSize:21, fontWeight:700, color:"#f1f5f9", fontFamily:"system-ui" }}>{step.title}</h2>
            <p style={{ margin:0, color:"#334155", fontSize:12, fontFamily:"system-ui" }}>{step.tagline}</p>
          </div>

          {/* Visualization */}
          <VizComp accent={step.color}/>

          {/* Concept */}
          <div style={{ background:"#0c1220", border:`1px solid ${step.color}20`, borderLeft:`3px solid ${step.color}`, borderRadius:10, padding:"18px 22px", marginBottom:16 }}>
            <div style={{ fontSize:10, color:step.color, letterSpacing:3, fontFamily:"system-ui", marginBottom:10 }}>CONCEPT</div>
            <pre style={{ margin:0, fontFamily:"system-ui", fontSize:12.5, lineHeight:1.85, color:"#94a3b8", whiteSpace:"pre-wrap" }}>{step.concept}</pre>
          </div>

          {/* Params */}
          <div style={{ background:"#0c1220", border:"1px solid #1e293b", borderRadius:10, padding:"18px 22px", marginBottom:16 }}>
            <div style={{ fontSize:10, color:step.color, letterSpacing:3, fontFamily:"system-ui", marginBottom:14 }}>PARAMETERS & HOW TO CHOOSE</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {step.params.map((p,i) => (
                <div key={i} style={{ background:"#080e1a", border:"1px solid #1e293b", borderRadius:8, padding:"12px 16px" }}>
                  <code style={{ fontSize:12, color:"#e2e8f0", background:step.color+"15", padding:"2px 8px", borderRadius:4 }}>{p.name}</code>
                  <div style={{ fontSize:12, color:step.color+"cc", marginTop:8, fontFamily:"system-ui" }}>💡 {p.rule}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                    {p.options.map((o,j) => <span key={j} style={{ background:"#111827", border:"1px solid #1e293b", borderRadius:4, padding:"2px 8px", fontSize:10, color:"#475569", fontFamily:"'JetBrains Mono',monospace" }}>{o}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code */}
          <div style={{ background:"#030508", border:`1px solid ${step.color}25`, borderRadius:10, overflow:"hidden", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 18px", background:"#0a0d14", borderBottom:`1px solid ${step.color}20` }}>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>)}
                <span style={{ fontSize:11, color:"#334155", marginLeft:6, fontFamily:"'JetBrains Mono',monospace" }}>step{step.id}_{step.title.toLowerCase().replace(/\s+/g,"_")}.py</span>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(step.code); setCodeCopied(true); setTimeout(()=>setCodeCopied(false),1500); }}
                style={{ background:codeCopied?step.color+"20":"#111827", border:`1px solid ${codeCopied?step.color:"#334155"}`, color:codeCopied?step.color:"#475569", borderRadius:6, padding:"3px 12px", fontSize:11, cursor:"pointer", fontFamily:"system-ui", transition:"all 0.2s" }}>
                {codeCopied?"✓ copied":"copy"}
              </button>
            </div>
            <pre style={{ margin:0, padding:"18px 22px", overflowX:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.8, color:"#cdd6f4" }}>
              <code>{step.code}</code>
            </pre>
          </div>

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, borderTop:"1px solid #0f1a2e" }}>
            <button onClick={() => setActiveStep(Math.max(0,activeStep-1))} disabled={activeStep===0}
              style={{ background:"transparent", border:"1px solid #1e293b", color:activeStep===0?"#1e293b":"#64748b", borderRadius:8, padding:"9px 22px", fontSize:12, cursor:activeStep===0?"default":"pointer", fontFamily:"system-ui" }}>
              ← prev
            </button>
            <div style={{ display:"flex", gap:4 }}>
              {STEPS.map((_,i) => (
                <div key={i} onClick={() => setActiveStep(i)}
                  style={{ width:i===activeStep?20:6, height:6, borderRadius:3, background:i===activeStep?step.color:"#1e293b", cursor:"pointer", transition:"all 0.3s" }}/>
              ))}
            </div>
            <button onClick={() => setActiveStep(Math.min(STEPS.length-1,activeStep+1))} disabled={activeStep===STEPS.length-1}
              style={{ background:activeStep===STEPS.length-1?"transparent":step.color+"18", border:`1px solid ${activeStep===STEPS.length-1?"#1e293b":step.color+"50"}`, color:activeStep===STEPS.length-1?"#1e293b":step.color, borderRadius:8, padding:"9px 22px", fontSize:12, cursor:activeStep===STEPS.length-1?"default":"pointer", fontFamily:"system-ui" }}>
              next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
