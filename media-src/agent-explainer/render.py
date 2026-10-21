"""Reproducible explainer: Python + Pillow + imageio-ffmpeg. No network at render time."""
from pathlib import Path
import os, sys, json, math, html, re, subprocess, argparse
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / '.render-deps'))
from PIL import Image, ImageDraw, ImageFont
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
DATA = json.loads((ROOT / 'scenes.json').read_text(encoding='utf-8-sig'))
BG='#F7F8FA'; INK='#17212B'; MUTED='#536477'; BLUE='#285FC2'; TEAL='#087C79'; VIOLET='#7254B3'; GREEN='#28744B'; AMBER='#966000'; SLATE='#536477'
# Segoe UI is not redistributable, so it is read from the Windows install; from WSL
# set EXPLAINER_FONTS=/mnt/c/Windows/Fonts.
FONTS=Path(os.environ.get('EXPLAINER_FONTS','C:/Windows/Fonts'))
FONT_CACHE={}
def font(size,bold=False):
    key=(size,bold)
    # BASIC layout: the shipped media were drawn without raqm; Linux Pillow wheels
    # include raqm and shift glyphs by sub-pixels, so the output stops matching.
    if key not in FONT_CACHE: FONT_CACHE[key]=ImageFont.truetype(str(FONTS/('segoeuib.ttf' if bold else 'segoeui.ttf')),size,layout_engine=ImageFont.Layout.BASIC)
    return FONT_CACHE[key]
class Canvas:
    def __init__(self):
        self.im=Image.new('RGB',(1920,1080),BG); self.d=ImageDraw.Draw(self.im); self.svg=[]
    def rect(self,x,y,w,h,fill='white',stroke=None,r=24,width=3):
        self.d.rounded_rectangle((x,y,x+w,y+h),radius=r,fill=fill,outline=stroke,width=width)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke or "none"}" stroke-width="{width}"/>')
    def text(self,x,y,s,size=38,color=INK,bold=False,anchor='left'):
        f=font(size,bold); w=self.d.textlength(s,font=f)
        xx=x-w/2 if anchor=='middle' else x-w if anchor=='right' else x
        assert xx>=0 and xx+w<=1921, f'Text outside canvas: {s}'
        self.d.text((xx,y),s,font=f,fill=color,anchor='lt')
        self.svg.append(f'<text x="{xx}" y="{y}" dominant-baseline="text-before-edge" font-family="Segoe UI,Arial,sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{html.escape(s)}</text>')
    def line(self,pts,color=MUTED,width=4,arrow=False):
        self.d.line(pts,fill=color,width=width,joint='curve')
        self.svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')
        if arrow:
            x,y=pts[-1]; px,py=pts[-2]; a=math.atan2(y-py,x-px)
            p=[(x,y),(x-17*math.cos(a-.48),y-17*math.sin(a-.48)),(x-17*math.cos(a+.48),y-17*math.sin(a+.48))]
            self.d.polygon(p,fill=color); self.svg.append(f'<polygon points="{" ".join(f"{a},{b}" for a,b in p)}" fill="{color}"/>')
    def save(self,name):
        self.im.save(OUT/(name+'.png'))
        (OUT/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="'+BG+'"/>'+''.join(self.svg)+'</svg>',encoding='utf-8')
def header(c,k,title,sub=None):
    c.text(100,74,k.upper(),26,TEAL,True)
    c.text(96,134,title,64,bold=True)
    if sub: c.text(100,225,sub,36,MUTED)
def card(c,x,y,w,title,desc,color,active=False,h=150):
    c.rect(x,y,w,h,'#FFFFFF',color if active else '#D7DEE5',width=5 if active else 2)
    c.rect(x+22,y+24,7,h-48,color,r=3)
    c.text(x+48,y+28,title,38,color,True)
    for i,s in enumerate(desc if isinstance(desc,list) else [desc]): c.text(x+48,y+82+i*43,s,34,MUTED)
def layers(c,phase=4):
    header(c,'02 / The components','Know which component does what')
    card(c,100,330,350,'Interface',['Where you','interact'],SLATE,phase==3,195)
    card(c,520,330,390,'Orchestrator',['Coordinates work','and stopping rules'],BLUE,phase==2,195)
    c.line([(450,425),(515,425)],BLUE,arrow=True)
    c.line([(910,425),(975,425)],BLUE,arrow=True)
    c.rect(980,295,840,320,'#EFF8F7',TEAL,width=5 if phase==1 else 3)
    c.text(1010,323,'Worker harness',42,TEAL,True)
    c.text(1010,380,'Manages context, tools and the agent loop',34,MUTED)
    card(c,1010,452,325,'Model','Responses',VIOLET,phase==0,h=138)
    card(c,1450,452,340,'Tools','Operations',TEAL,h=138)
    c.line([(1337,503),(1440,503)],TEAL,arrow=True)
    c.line([(1440,548),(1337,548)],TEAL,arrow=True)
    c.line([(1618,617),(1618,658)],TEAL,arrow=True)
    c.rect(980,665,840,145,'#FFF9EB',AMBER,width=5 if phase==4 else 2)
    c.text(1010,690,'Configured execution boundary',39,AMBER,True)
    c.text(1010,749,'Sandbox limits file, process or network access',32,MUTED)
    c.text(100,690,'Components may run',35,MUTED)
    c.text(100,737,'locally or remotely.',35,MUTED)
    c.text(100,805,'Check which tools and processes the boundary covers.',32,MUTED)
def flow(c,active=-1,full=False):
    header(c,'03 / A bounded development task','Build CSV export. Check the requirements.','Current user only  ·  Selected status  ·  Valid CSV  ·  Agreed columns')
    names=['Plan','Implement','Checks','Review','Accept','Deliver']
    desc=['Criteria','Candidate','Test runner','Find defects','Verify spec','+ evidence']
    colors=[BLUE,TEAL,SLATE,VIOLET,GREEN,GREEN]
    for i in range(6):
        x=100+i*290
        c.rect(x,360,260,145,'white',colors[i] if active==i else '#D7DEE5',width=6 if active==i else 2)
        c.text(x+130,390,names[i],39,colors[i],True,'middle')
        c.text(x+130,451,desc[i],31,MUTED,anchor='middle')
        if i<5:c.line([(x+264,431),(x+284,431)],MUTED,arrow=True)
    for x in [810,1100,1390]:c.line([(x,510),(x,588)],AMBER)
    c.line([(1390,588),(520,588),(520,515)],AMBER,5,True)
    c.text(720,620,'Concrete defects → repair within a budget',38,AMBER,True)
    c.line([(230,510),(230,734),(550,734)],SLATE,arrow=True)
    c.rect(560,692,1250,108,'#EEF1F5',r=20)
    c.text(592,717,'Unclear requirements or budget exhausted → human decision',35,SLATE)
    c.text(100,840,'Acceptance means configured criteria met; checks have limits.',32,MUTED)
def evidence(c,stage):
    header(c,'04 / Final verification','Evidence supports acceptance','Illustrative example · these are not executed test results')
    if stage==0:
        card(c,100,330,800,'Earlier review finding',['Selected: completed; open task exported.','Filter requirement fails.'],AMBER,True,h=245)
        card(c,1020,330,800,'Repair, then verify',['Fix the filter.','Check the final candidate again.'],TEAL,h=245)
        c.line([(920,449),(1000,449)],AMBER,arrow=True)
        c.text(100,690,'A specific finding gives the implementer something to fix.',39,MUTED)
    else:
        rows=['Selected status','Current user only','CSV special characters','Agreed columns']
        statuses=['Pass','Pass','Not checked' if stage==1 else 'Pass','Pass']
        c.text(125,312,'Original requirement',32,MUTED,True)
        c.text(850,312,'Observed check',32,MUTED,True)
        c.text(1550,312,'Status',32,MUTED,True)
        proofs=['Completed-only fixture','Other-user fixture','CSV round-trip test','Header comparison']
        for i,(row,status) in enumerate(zip(rows,statuses)):
            y=365+i*88;c.rect(100,y,1720,76,'white',r=12)
            c.text(125,y+17,row,35,bold=True)
            c.text(850,y+17,proofs[i] if status=='Pass' else 'Pending execution',33,MUTED)
            c.text(1550,y+17,status,33,GREEN if status=='Pass' else AMBER,True)
        c.text(100,765,'Keep uncertainty visible.' if stage==1 else 'Candidate + evidence → configured criteria met',40,AMBER if stage==1 else GREEN,True)
    c.text(100,842,'Agreement alone does not establish correctness.',38,bold=True)
def choices(c,phase):
    header(c,'05 / Reuse existing software','Choose the level to reuse','These are distinct roles, not a mandatory installation sequence.')
    for i,(title,role,col) in enumerate([('LangGraph','Workflow building blocks',BLUE),('Deep Agents','Reusable agent harness',TEAL),('Deep Agents Code','Terminal application',VIOLET)]):
        card(c,100+i*590,350,540,title,[role],col,phase==i,h=205)
    c.rect(420,665,1080,125,'#EEF1F5',SLATE,width=4 if phase==3 else 2)
    c.text(960,691,'Your existing interface',41,SLATE,True,'middle')
    c.text(960,747,'Connect through a script, API or tool integration',32,MUTED,anchor='middle')
    c.text(100,836,'Installing an SDK does not automatically connect a custom workflow.',33,MUTED)
def ending(c,phase=0):
    header(c,'06 / Your first experiment','Start small. Inspect the evidence.')
    for i,(a,b,col) in enumerate([('One task','A bounded change',BLUE),('Clear limits','Budget and stop rules',AMBER),('Visible checks','Candidate + evidence',GREEN)]):
        card(c,100+i*590,345,540,a,b,col,h=190)
    c.text(960,630,'Compare with one agent.',50,TEAL,True,'middle')
    c.text(960,720,'Choose the workflow. Check the evidence.',46,bold=True,anchor='middle')
    c.text(960,815,'How AI models and agents work together',33,MUTED,anchor='middle')
def opening(c,phase=0):
    c.text(100,92,'A PRACTICAL GUIDE TO AGENT WORKFLOWS',28,TEAL,True)
    c.text(96,192,'How AI models and agents',78,bold=True)
    c.text(96,291,'work together',78,bold=True)
    for i,(a,b,col) in enumerate([('Models','Generate responses',VIOLET),('Harnesses','Enable action',TEAL),('Workflows','Coordinate and check',BLUE)]):
        card(c,100+i*590,495,540,a,b,col,phase==i,h=190)
    c.text(100,784,'Define the roles. Make the results inspectable.',42,MUTED)
def scene_at(t):
    return next(s for s in DATA['scenes'] if s['start']<=t<s['end'])
def base(t,caption=True):
    s=scene_at(t); c=Canvas(); local=t-s['start']; sid=s['id']
    if sid==1: opening(c,min(2,int(local/3)))
    elif sid==2: layers(c,min(4,int(local/3)))
    elif sid==3: flow(c,0 if local<4 else 1 if local<8 else 2 if local<10 else 3 if local<12 else 1)
    elif sid==4: evidence(c,0 if local<4 else 1 if local<12 else 2)
    elif sid==5: choices(c,min(3,int(local/3.5)))
    else: ending(c)
    if caption:
        cue=next(q for q in s['captions'] if q['start']<=t<q['end'])
        words=cue['text'].split(); best=None
        for k in range(1,len(words)):
            a=' '.join(words[:k]);b=' '.join(words[k:]);score=max(c.d.textlength(a,font=font(43)),c.d.textlength(b,font=font(43)))
            if best is None or score<best[0]:best=(score,a,b)
        lines=[cue['text']] if c.d.textlength(cue['text'],font=font(43))<1550 else list(best[1:])
        c.rect(96,912,1728,130,INK,r=18)
        for i,line in enumerate(lines): c.text(960,938+(0 if len(lines)==2 else 24)+i*49,line,43,'#FFFFFF',anchor='middle')
    return c
def key(t):
    s=scene_at(t); cue=next(q for q in s['captions'] if q['start']<=t<q['end'])
    extra=0
    if s['id']==3:extra=0 if t<28 else 1 if t<32 else 2 if t<34 else 3 if t<36 else 1
    if s['id']==4:extra=0 if t<44 else 1 if t<52 else 2
    return (s['id'],cue['start'],extra)
CACHE={}
def frame(t):
    k=key(t)
    if k not in CACHE:CACHE[k]=base(t).im
    im=CACHE[k].copy(); d=ImageDraw.Draw(im)
    # Quiet progress line; instructional states hold rather than moving continuously.
    d.line((96,1060,1824,1060),fill='#D7DEE5',width=4)
    d.line((96,1060,96+1728*t/84,1060),fill=TEAL,width=4)
    s=scene_at(t)
    if s['id']>1 and t-s['start']<.3:
        old=base(s['start']-.001).im
        im=Image.blend(old,im,(t-s['start'])/.3)
    return im
def auxiliary():
    c=Canvas();layers(c,-1);c.save('agent-layers')
    c=Canvas();flow(c,-1,True);c.save('agent-workflow')
    c=Canvas();opening(c,-1);c.im.save(OUT/'poster.png')
    times=[0,8.9,12,21.5,30,38,42,49,55,65,75,83.9]
    contact=Image.new('RGB',(1440,4*300),'white'); d=ImageDraw.Draw(contact)
    for i,t in enumerate(times):
        im=frame(t); im.save(OUT/f'frame-{t:05.1f}.png')
        x=(i%3)*480;y=(i//3)*300;contact.paste(im.resize((480,270),Image.Resampling.LANCZOS),(x,y));d.text((x+8,y+275),f'{t:05.1f}s / scene {scene_at(t)["id"]}',font=font(16),fill=INK)
    contact.save(OUT/'contact-sheet.png')
    srt=(ROOT/'captions.srt').read_text(encoding='utf-8-sig')
    (OUT/'agent-explainer.vtt').write_text('WEBVTT\n\n'+re.sub(r'(\d{2}:\d{2}:\d{2}),(\d{3})',r'\1.\2',srt),encoding='utf-8')
    article=(ROOT/'article.md').read_text(encoding='utf-8-sig')
    article=article.replace('## Understand the pieces','![Models generate responses, harnesses enable action, and workflows coordinate and check the work.](poster.png)\n\n## Understand the pieces')
    article=article.replace('## Choose a workflow before choosing a framework','![An interface sends a job to an orchestrator, which coordinates a worker harness containing a model and tools. Tools connect to a configured execution boundary.](agent-layers.png)\n\n## Choose a workflow before choosing a framework')
    article=article.replace('## Measure success through evidence','![Plan, implement, check, review, verify acceptance, and deliver with evidence. Defects return to implementation within a budget; uncertainty or exhausted budgets go to a human.](agent-workflow.png)\n\n## Measure success through evidence')
    (OUT/'article-illustrated.md').write_text(article,encoding='utf-8')
    transcript=html.escape((ROOT/'narration.txt').read_text(encoding='utf-8-sig'))
    (OUT/'preview.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>How AI models and agents work together</title><style>body{margin:40px auto;max-width:1100px;padding:0 24px;background:#F7F8FA;color:#17212B;font:19px/1.6 system-ui}h1{font-size:44px;line-height:1.15}video,img{width:100%;border-radius:16px;margin:18px 0}a{color:#285FC2}pre{white-space:pre-wrap;font:inherit}figure{margin:0}figcaption{color:#536477}li{margin:8px 0}</style><h1>How AI models and agents work together</h1><p>An 84-second visual introduction. Silent video with visible captions.</p><video controls playsinline preload="metadata" poster="poster.png"><source src="agent-explainer.mp4" type="video/mp4"><track kind="captions" src="agent-explainer.vtt" srclang="en" label="English"></video><h2>Workflow in ten seconds</h2><img src="agent-explainer-teaser.gif" alt="An illustrative pipeline highlights planning, implementation, tests and review, then returns a defect for repair before acceptance and delivery."><h2>The components</h2><img src="agent-layers.png" alt="Interface to orchestrator to worker harness, with model and tools inside and a separate configured execution boundary."><h2>A development workflow</h2><img src="agent-workflow.png" alt="Six-step development workflow with bounded repair paths and a human decision branch."><h2>Transcript</h2><pre>'''+transcript+'''</pre><h2>Download and reuse</h2><ul><li><a href="article-illustrated.md">Illustrated article</a></li><li><a href="agent-explainer.mp4" download>MP4 video</a> · <a href="agent-explainer.vtt">Web captions</a></li><li><a href="agent-layers.svg">Layers SVG</a> · <a href="agent-workflow.svg">Workflow SVG</a></li><li><a href="../render-report.md">Render report</a> · <a href="../source-check.md">Sources</a> · <a href="../RENDERING.md">Reproduction</a></li></ul></html>''',encoding='utf-8')
def teaser():
    images=[]
    for n in range(100):
        t=n/10;c=Canvas();active=0 if t<1 else 1 if t<2.5 else 2 if t<4 else 3 if t<5.5 else 1 if t<7 else 4 if t<8.5 else 5
        flow(c,active)
        c.rect(96,912,1728,130,INK,r=18)
        label='A bounded task moves through the checks.' if t<4 else 'A concrete defect returns for repair.' if t<7 else 'Verify the repaired candidate. Deliver evidence.'
        c.text(960,951,label,43,'white',anchor='middle')
        images.append(c.im.resize((960,540),Image.Resampling.LANCZOS).convert('P',palette=Image.Palette.ADAPTIVE,colors=96))
    images[0].save(OUT/'agent-explainer-teaser.gif',save_all=True,append_images=images[1:],duration=100,loop=0,optimize=True,disposal=2)
def video():
    import imageio_ffmpeg
    exe=imageio_ffmpeg.get_ffmpeg_exe()
    cmd=[exe,'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'agent-explainer.mp4')]
    with (OUT/'encode.log').open('w') as log:
        p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
        for n in range(2520):
            p.stdin.write(frame(n/30).tobytes())
            if n%300==0:print(f'Rendered {n}/2520 frames',flush=True)
        p.stdin.close()
        if p.wait():raise RuntimeError('FFmpeg encode failed; see encode.log')
    probe=subprocess.run([exe,'-i',str(OUT/'agent-explainer.mp4'),'-f','null','-'],capture_output=True,text=True)
    (OUT/'decode-check.log').write_text(probe.stderr,encoding='utf-8')
    assert probe.returncode==0,'Full decode failed'
    print('MP4 full decode passed.',flush=True)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--stills',action='store_true');args=parser.parse_args()
    auxiliary()
    if not args.stills:teaser();video()
    print('Assets written to',OUT)
