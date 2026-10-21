"""Inspect encoded artifacts mechanically and extract frames for visual review."""
from pathlib import Path
import os, sys, subprocess, re, json
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'output'
sys.path.insert(0,str(ROOT/'.render-deps'))
from PIL import Image, ImageDraw, ImageFont, ImageStat
import imageio_ffmpeg
exe=imageio_ffmpeg.get_ffmpeg_exe()
times=[0,8.96,9.4,23.96,24.4,30,33,35,38,39.96,40.4,43,49,54,57.96,58.4,65,71.96,72.4,80,83.9]
qa=OUT/'qa';qa.mkdir(exist_ok=True)
sheet=Image.new('RGB',(1920,7*390),'white');d=ImageDraw.Draw(sheet)
f=ImageFont.truetype(os.path.join(os.environ.get('EXPLAINER_FONTS','C:/Windows/Fonts'),'segoeui.ttf'),22)
for i,t in enumerate(times):
    path=qa/f'encoded-{t:06.3f}.png'
    result=subprocess.run([exe,'-y','-ss',str(t),'-i',str(OUT/'agent-explainer.mp4'),'-frames:v','1',str(path)],capture_output=True)
    assert result.returncode==0 and path.exists()
    im=Image.open(path);assert im.size==(1920,1080)
    assert sum(ImageStat.Stat(im).stddev)>10,'Blank frame'
    x=i%3*640;y=i//3*390;sheet.paste(im.resize((640,360)),(x,y));d.text((x+8,y+363),f'Encoded MP4 / {t:.3f}s',font=f,fill='#17212B')
sheet.save(OUT/'encoded-contact-sheet.png')
gif=Image.open(OUT/'agent-explainer-teaser.gif');dur=0
for i in range(gif.n_frames):gif.seek(i);dur+=gif.info.get('duration',0)
assert gif.info['loop']==0 and gif.size==(960,540) and dur==10000
report={'mp4':{'dimensions':[1920,1080],'fps':30,'duration_seconds':84,'decoded_frames':2520,'extracted_frames':len(times)},'gif':{'dimensions':list(gif.size),'stored_frames':gif.n_frames,'duration_ms':dur,'loop':gif.info['loop']},'ffmpeg_version':imageio_ffmpeg.get_ffmpeg_version()}
vtt=(OUT/'agent-explainer.vtt').read_text(encoding='utf-8');assert vtt.startswith('WEBVTT') and vtt.count('-->')==24
for filename in ['preview.html','article-illustrated.md']:
    txt=(OUT/filename).read_text(encoding='utf-8')
    refs=re.findall(r'(?:src|href)="([^"]+)"',txt) if filename.endswith('.html') else re.findall(r'!\[[^\]]*\]\(([^)]+)\)',txt)
    for ref in refs:assert (OUT/ref).exists(),ref
(OUT/'media-metadata.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
