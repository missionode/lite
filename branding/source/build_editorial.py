"""Srishti editorial edition 2. Vector typography, original artwork, linked PDFs.
Requires reportlab and pypdf. Coordinates use points from the top of each page.
"""
from pathlib import Path
import json
import os
from reportlab import rl_config
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF, renderSVG
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT,ASSETS=ROOT/'output',ROOT/'assets'
INK,NAVY,PAPER,GOLD,LINE,MUTED,WHITE,SKY='#10253D','#071629','#F6F2EA','#A77B40','#DCD6CA','#546374','#FFFFFF','#B5C9DD'
PHONE,EMAIL,WEB='+91 7510726715','syamnath.s@srishtiinnovative.com','https://www.srishtis.com/'
NOTE='Chakras, mantra, visualization and sound are contemplative practices. They are not medical treatments or guarantees of outcomes.'
rl_config.useA85=False
fonts=Path(os.environ.get('BRAND_FONT_DIR','/System/Library/Fonts/Supplemental'))
for name,f in [('Sans','Arial.ttf'),('SansBold','Arial Bold.ttf'),('SansItalic','Arial Italic.ttf'),('Serif','Georgia.ttf'),('SerifItalic','Georgia Italic.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(fonts/f)))
pdfmetrics.registerFontFamily('Sans',normal='Sans',bold='SansBold',italic='SansItalic',boldItalic='SansBold')
pdfmetrics.registerFontFamily('Serif',normal='Serif',bold='Serif',italic='SerifItalic',boldItalic='SerifItalic')
DAYS=[
 ('Root','#A54C45','Meditation basics, healthy expectations, breathwork, safety, stability and belonging.','Box Breathing + Root'),
 ('Sacral','#B26534','Creativity, emotion, boundaries, visualization and an introduction to the Vijnana Bhairava Tantra.','Box Breathing + Visualization + Root &amp; Sacral'),
 ('Solar Plexus','#9D7A25','Confidence, agency and disciplined attention, with a kind approach to distraction.','Visualization + Focused Attention + Root to Solar Plexus'),
 ('Heart','#42765B','Compassion, gratitude and emotional awareness, with room for healthy boundaries.','Focused Attention + Ho\'oponopono + Root to Heart'),
 ('Throat','#3C8193','Authentic expression, mindful communication, deep listening and the value of silence.','Ho\'oponopono + Undo &amp; Unlearn + Root to Throat'),
 ('Third Eye','#596499','Body awareness, observation, interpretation and intuition with clear attention.','Undo &amp; Unlearn + Body Scan + Root to Third Eye'),
 ('Crown','#866293','Meaning, connection, humility and spacious awareness through the seven-chakra framework.','Body Scan + Noting and Labeling + all seven chakras'),
 ('Integrated Sound','#8B7349','Bring all seven chakras together with two selected add-ons. Sound-therapy-inspired meditation is optional. Comfortable volume and personal choice guide the experience.','Two appropriate add-ons + all seven chakras'),
 ('Resonant Energy','#8B7349','Uplifting rhythmic sound, mantra-inspired vocal energy and mindful listening, followed by a music jam. Conclude with a personal plan for continuing practice.','Resonant Energy Meditation + mindful music jam')]
PROCESS=[('Consultation','Understand your space, audience and objectives.'),('Experience planning','Plan seating, visuals, sound, software and branding.'),('Integration','Configure the technology and guided content.'),('People &amp; training','Train your team or help recruit operators locally.'),('Launch','Test the experience and prepare the operating workflow.'),('Continuing support','Software, content updates and operator guidance.')]

def qr(size):
    q=QrCodeWidget(WEB,barLevel='M',barBorder=4,barFillColor=HexColor(INK))
    a,b,c,d=q.getBounds(); obj=Drawing(size,size,transform=[size/(c-a),0,0,size/(d-b),0,0]); obj.add(q)
    return obj

class Page:
    def __init__(self,c,w,h): self.c,self.w,self.h=c,w,h
    def rect(self,x,y,w,h,color):
        self.c.setFillColor(HexColor(color)); self.c.rect(x,self.h-y-h,w,h,fill=1,stroke=0)
    def line(self,x,y,w,color=LINE):
        self.c.setStrokeColor(HexColor(color)); self.c.setLineWidth(.6); self.c.line(x,self.h-y,x+w,self.h-y)
    def text(self,s,x,y,w,size=12,color=INK,font='Sans',leading=None,limit=None):
        p=Paragraph(s,ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.4,textColor=HexColor(color),splitLongWords=False))
        _,h=p.wrap(w,1000)
        if limit is not None and h>limit+.1: raise ValueError(f'Overflow: {h} > {limit}: {s[:80]}')
        if y+h>self.h-9: raise ValueError('Page overflow: '+s[:80])
        p.drawOn(self.c,x,self.h-y-h); return h
    def label(self,s,x,y,color=GOLD,size=8,spacing=1.3):
        self.c.saveState()
        t=self.c.beginText(x,self.h-y-size); t.setFont('SansBold',size); t.setCharSpace(spacing); t.setFillColor(HexColor(color)); t.textOut(s.upper()); self.c.drawText(t)
        self.c.restoreState()
    def logo(self,x,y,w=170):
        self.c.drawImage(str(ASSETS/'srishti-innovative-logo.png'),x,self.h-y-w*66/438,w,w*66/438,mask='auto')
    def hero(self,x,y,w):
        self.c.drawImage(str(ASSETS/'meditation-room-hero.png'),x,self.h-y-w*941/1672,w,w*941/1672)
    def link(self,url,x,y,w,h): self.c.linkURL(url,(x,self.h-y-h,x+w,self.h-y),relative=1,thickness=0)
    def qr(self,x,y,size):
        self.rect(x,y,size,size,WHITE); renderPDF.draw(qr(size),self.c,x,self.h-y-size); self.link(WEB,x,y,size,size)
    def header(self,s):
        self.rect(0,0,self.w,59,WHITE); self.logo(36,17); self.label(s,340,27,MUTED,7,1); self.line(36,59,self.w-72)
    def footer(self,n,dark=False):
        color=SKY if dark else MUTED; self.line(36,642,self.w-72,'#26394F' if dark else LINE)
        self.label('SRISHTI / MEDITATION JOURNEY',36,653,color,6.7,1); self.label(f'{n:02d} / 07',459,653,color,6.7,.7)

def canvas(path,size,title):
    c=Canvas(str(path),pagesize=size,invariant=1,pageCompression=1)
    c.setTitle(title); c.setAuthor('Srishti Innovative'); c.setCreator('Srishti branding / editorial edition 2'); return c

def digital():
    path=OUT/'srishti-nine-day-meditation-digital.pdf'; c=canvas(path,(540,675),'Srishti Innovative | Nine-Day Meditation Journey'); p=Page(c,540,675)
    p.rect(0,0,540,675,NAVY); p.header('THE EXPERIENCE')
    p.label('A GUIDED MEDITATION PROGRAMME',36,81,SKY)
    p.text('Nine days.<br/>Seven centres.<br/><i>One immersive journey.</i>',36,103,482,32,WHITE,'Serif',38,116)
    p.text('Discover meditation in a private, immersive space designed for comfort, attention and inner exploration.',36,232,445,12,SKY,limit=39)
    p.hero(0,284,540)
    p.text('Join the Nine-Day Meditation Journey',36,602,465,15,WHITE,'SansBold',limit=23)
    p.text(PHONE+'   |   www.srishtis.com',36,626,465,9,SKY)
    p.link('https://wa.me/917510726715',36,625,210,15)
    p.footer(1,True); c.showPage()
    p.rect(0,0,540,675,PAPER); p.header('BEGIN HERE')
    p.label('NO PREVIOUS EXPERIENCE REQUIRED',36,81)
    p.text('A gentle way in.',36,101,470,32,font='Serif')
    p.text('Clear explanations. Guided practice. Space to reflect.<br/>Learn at your own pace, with comfort and choice throughout.',36,156,452,12.2,limit=51)
    groups=[('Breathe','Breath awareness and Box Breathing.'),('Imagine','Guided Visualization for personal inner exploration.'),('Focus','Focused Attention Meditation, also known as Dharana.'),('Notice','Guided Body Scan, Noting and Labeling.'),('Release','Ho\'oponopono-inspired reflection and Undo &amp; Unlearn.'),('Integrate','Seven-chakra guidance, Resonant Energy Meditation and mindful music.')]
    for i,(t,d) in enumerate(groups):
        x=36+i%2*244; y=232+i//2*92
        p.label(f'{i+1:02d}',x,y); p.text(t,x+26,y-4,193,18,font='Serif'); p.text(d,x,y+30,212,11.1,MUTED,limit=49)
        if i<4:p.line(x,y+78,216)
    p.rect(36,528,468,89,'#E9EDF1'); p.label('QUICK STARTER DEMO',52,542,'#0758A8')
    p.text('A guided introduction to the experience.',52,565,343,11.1); p.text('Charges may apply.',52,590,330,8.2,MUTED)
    p.text('1',432,542,58,32,font='Serif'); p.label('HOUR',435,584,MUTED,7)
    p.footer(2); c.showPage()
    for num,start,end,title,sub in [(3,0,3,'Find your grounding.','Build familiarity with breath, emotion and attention.'),(4,3,7,'Make room for awareness.','Compassion, expression, observation and connection.')]:
        p.rect(0,0,540,675,PAPER); p.header('THE CURRICULUM'); p.label(f'DAYS {start+1:02d}-{end:02d} / THE JOURNEY',36,81)
        p.text(title,36,101,475,29,font='Serif'); p.text(sub,36,155,466,11.8,MUTED)
        stride=130 if num==3 else 101
        for i,(title,color,desc,practice) in enumerate(DAYS[start:end]):
            y=206+i*stride
            p.text(f'{start+i+1:02d}',36,y-4,51,30,color,'Serif'); p.text(title+' Chakra',103,y,397,20,font='Serif')
            p.text(desc,103,y+32,390,11.1,MUTED,limit=48 if num==3 else 33)
            p.text('<b>Practice:</b> '+practice,103,y+(83 if num==3 else 66),390,9.5,limit=30)
            if i<end-start-1:p.line(36,y+stride-15,468)
        if num==3:
            p.rect(36,604,468,24,'#E9EDF1'); p.text('Day 1: 3 hours / Day 2: 2 hours / Days 3-9: 2-3 hours',47,609,446,9.2,limit=16)
        p.footer(num); c.showPage()
    p.rect(0,0,540,675,NAVY); p.header('INTEGRATION'); p.label('DAYS 08-09 / TAKE IT INTO LIFE',36,81,SKY)
    p.text('Carry the practice<br/><i>with you.</i>',36,103,476,32,WHITE,'Serif',38)
    for i,(title,color,desc,practice) in enumerate(DAYS[7:]):
        y=211+i*131; p.label('DAY '+str(8+i),36,y,'#D7B784'); p.text(title+(' Experience' if i==0 else ' Meditation'),36,y+23,468,21,WHITE,'Serif')
        p.text(desc,36,y+59,460,11.7,SKY,limit=51)
        if i==0:p.line(36,y+114,468,'#26394F')
    p.rect(36,498,468,119,'#132B43'); p.label('WHAT YOU TAKE HOME',52,513,'#D7B784')
    p.text('A choice of attention anchors.<br/>A kinder way to return when the mind wanders.<br/>A realistic personal meditation routine.',52,537,434,12,WHITE,leading=20,limit=65)
    p.footer(5,True); c.showPage()
    p.rect(0,0,540,675,PAPER); p.header('FOR YOUR BUSINESS'); p.label('SOFTWARE / PEOPLE / EXPERIENCE',36,81)
    p.text('Create a place<br/><i>to pause.</i>',36,103,466,32,font='Serif',leading=38)
    p.text('Bring the Srishti meditation experience to your premises with digital software, guided content and trained operators.',36,192,466,12,limit=51)
    offers=[('The space','Room and seating planning, immersive cosmic visuals, spatial audio and installation guidance.'),('The software','Meditation software, multilingual guided content, session workflows and customized digital solutions.'),('The people','Train your team, or receive assistance recruiting and deploying trained operators at your premises.')]
    for i,(t,d) in enumerate(offers):
        y=262+i*70; p.text(t,36,y,128,16,font='Serif'); p.text(d,173,y,331,11.4,MUTED,limit=51); p.line(36,y+58,468)
    p.rect(36,482,468,103,NAVY); p.label('FRANCHISE OPPORTUNITY',52,497,'#D7B784')
    p.text('Build a meditation destination in your city.',52,520,438,17,WHITE,'Serif')
    p.text('Branding, software, content, operator training, recruitment assistance, launch guidance and ongoing support.',52,549,435,10.9,SKY,limit=32)
    p.text('For hotels, resorts, workplaces, technoparks, malls, wellness centres, educational institutions, residences and retreats.',36,600,468,9.5,MUTED,limit=28)
    p.footer(6); c.showPage()
    p.rect(0,0,540,675,PAPER); p.header('LET\'S BEGIN'); p.label('YOUR SPACE. A SHARED PLAN.',36,81)
    p.text('From idea to opening.',36,103,470,29,font='Serif')
    for i,(t,d) in enumerate(PROCESS):
        x=36+i%2*244; y=176+i//2*78
        p.label(f'{i+1:02d}',x,y); p.text(t,x+26,y-3,196,14.6,font='Serif',limit=24); p.text(d,x,y+27,219,10.4,MUTED,limit=33)
    p.rect(36,422,468,166,NAVY); p.label('PROGRAMME & FRANCHISE ENQUIRIES',52,438,'#D7B784',7.5,1)
    p.text(PHONE,52,460,333,23,WHITE,'Serif'); p.link('https://wa.me/917510726715',52,458,293,30)
    p.text('Phone &amp; WhatsApp',52,490,260,9.2,SKY); p.text(EMAIL,52,511,333,10.5,WHITE); p.link('mailto:'+EMAIL,52,511,331,18)
    p.text('www.srishtis.com',52,534,290,11,WHITE); p.link(WEB,52,534,290,19)
    p.text('Head Office: Thiruvananthapuram',52,559,300,9.4,SKY); p.qr(408,465,79); p.label('EXPLORE',418,551,SKY,6.4,.8)
    p.text(NOTE,36,606,468,8.1,MUTED,leading=11.1,limit=34); p.footer(7); c.save(); return path

def print_frame(c,folds):
    w,h,o=297*mm,210*mm,9*mm
    c.setStrokeColor(HexColor('#555555')); c.setLineWidth(.25)
    for x in (o,o+w):c.line(x,mm,x,5*mm); c.line(x,o+h+4*mm,x,o+h+8*mm)
    for y in (o,o+h):c.line(mm,y,5*mm,y); c.line(o+w+4*mm,y,o+w+8*mm,y)
    c.setTrimBox((o,o,o+w,o+h)); c.setBleedBox((o-3*mm,o-3*mm,o+w+3*mm,o+h+3*mm)); c.saveState(); c.translate(o,o)
    p=Page(c,w,h); p.rect(-3*mm,-3*mm,w+6*mm,h+6*mm,PAPER)
    for x in folds:
        c.setStrokeColor(HexColor(GOLD)); c.line(x*mm,-7*mm,x*mm,-4*mm); c.line(x*mm,h+4*mm,x*mm,h+7*mm)
    return p

def trifold():
    path=OUT/'srishti-nine-day-meditation-trifold.pdf'; c=canvas(path,(315*mm,228*mm),'Srishti Innovative | A4 roll-fold / 3 mm bleed')
    p=print_frame(c,[97,197]); H=210*mm
    p.rect(97*mm,-3*mm,203*mm,H+6*mm,NAVY)
    x,w=8*mm,81*mm
    p.label('THE EXPERIENCE',x,10*mm,size=7.2,spacing=1.2); p.text('Make space<br/>for yourself.',x,20*mm,w,25,font='Serif',leading=29)
    p.text('A gentle introduction to meditation through breath, attention, bodily awareness, visualization and sound.',x,45*mm,w,10.2,limit=61)
    for i,(t,d) in enumerate([('Comfort','Inclined luxury seating and immersive cosmic visuals.'),('Guidance','Clear explanations, multilingual narration and trained operators.'),('Choice','A beginner-friendly pace, reflection and adaptable practices.')]):
        y=(74+i*26)*mm; p.label(t,x,y,size=7.4,spacing=1); p.text(d,x,y+13,w,9.6,MUTED,limit=40)
    p.rect(x,155*mm,w,32*mm,'#E9EDF1'); p.label('QUICK STARTER DEMO',x+4*mm,160*mm,'#0758A8',7,.75)
    p.text('1 hour',x+4*mm,168*mm,w-8*mm,19,font='Serif'); p.text('Charges may apply.',x+4*mm,179*mm,w-8*mm,7.5,MUTED)
    p.text('No previous meditation experience required.',x,194*mm,w,8.4,MUTED)
    x,w=105*mm,84*mm
    p.label('LET\'S BEGIN',x,10*mm,'#D7B784',7.2,1.2); p.text('Bring the<br/>experience<br/><i>to your space.</i>',x,21*mm,w,24,WHITE,'Serif',29)
    p.text('Programme &amp; franchise enquiries',x,61*mm,w,10,SKY); p.text(PHONE,x,77*mm,w,19,WHITE,'Serif'); p.link('https://wa.me/917510726715',x,76*mm,w,27)
    p.text('PHONE &amp; WHATSAPP',x,89*mm,w,7.4,SKY); p.text(EMAIL,x,102*mm,w,9.1,WHITE); p.link('mailto:'+EMAIL,x,102*mm,w,18)
    p.text('www.srishtis.com',x,114*mm,w,11.5,WHITE); p.link(WEB,x,114*mm,w,20)
    p.text('Head Office: Thiruvananthapuram',x,128*mm,w,8.7,SKY); p.qr(x,145*mm,28*mm)
    p.text('Explore the<br/>Srishti experience.',x+33*mm,150*mm,50*mm,10,WHITE); p.text(NOTE,x,183*mm,w,7.1,SKY,leading=9.4,limit=57)
    x,w=205*mm,84*mm
    p.rect(197*mm,-3*mm,103*mm,29*mm,WHITE); p.logo(206*mm,8*mm,79*mm)
    p.label('GUIDED MEDITATION',x,34*mm,SKY,7.3,1.25); p.text('Nine days.<br/>Seven centres.',x,45*mm,w,27,WHITE,'Serif',31)
    p.text('One immersive<br/><i>journey.</i>',x,71*mm,w,24,WHITE,'Serif',28); p.hero(197*mm,101*mm,103*mm)
    p.text('Join the Nine-Day<br/>Meditation Journey',x,166*mm,w,16,WHITE,'Serif',21)
    p.text('Comfort. Attention. Inner exploration.',x,188*mm,w,9.5,SKY); p.label('SRISHTI INNOVATIVE',x,199*mm,SKY,6.5,1)
    c.restoreState(); c.showPage(); p=print_frame(c,[100,200]); p.rect(200*mm,-3*mm,100*mm,H+6*mm,'#E9E7DF')
    for panel,(lo,hi,title) in enumerate([(0,4,'Ground & grow.'),(4,9,'Notice & integrate.')]):
        x,w=(panel*100+8)*mm,84*mm; p.label('THE NINE-DAY JOURNEY',x,10*mm,size=7.1,spacing=1); p.text(title,x,20*mm,w,23,font='Serif')
        for i,(t,col,desc,practice) in enumerate(DAYS[lo:hi]):
            y=(42+i*(35 if panel==0 else 29))*mm
            p.text(f'{lo+i+1:02d}',x,y,27,13,col,'Serif'); p.text(t,x+33,y-1,w-33,13.6,font='Serif',limit=37)
            short=desc.split('.')[0]+'.' if lo+i<7 else ('Sound-therapy-inspired meditation is optional.' if lo+i==7 else 'Uplifting sound and personal integration.')
            p.text(short+'<br/><b>Practice:</b> '+practice,x,y+23,w,8.9,MUTED,leading=12,limit=60)
            if i<hi-lo-1:p.line(x,y+(91 if panel==0 else 75),w)
        if panel==0:
            p.line(x,187*mm,w); p.text('Day 1: 3 hours / Day 2: 2 hours<br/>Days 3-9: 2-3 hours',x,193*mm,w,8.5,MUTED,leading=11.5,limit=24)
    x,w=208*mm,81*mm
    p.label('FOR YOUR BUSINESS',x,10*mm,size=7.2,spacing=1); p.text('The space.<br/>The software.<br/><i>The people.</i>',x,20*mm,w,22,font='Serif',leading=27)
    p.text('Room planning, immersive visuals, spatial audio, digital software and content, brand integration and operational guidance.',x,54*mm,w,9.4,limit=62)
    p.text('Train your team or receive assistance recruiting and deploying trained operators at your premises.',x,81*mm,w,9.4,limit=49); p.line(x,105*mm,w)
    p.label('FRANCHISE OPPORTUNITY',x,112*mm,size=7.2,spacing=.65)
    p.text('Create a meditation destination with Srishti branding, software, guided programmes, training, launch guidance and continuing support.',x,122*mm,w,9.4,limit=63)
    p.label('HOW IT WORKS',x,152*mm,size=7.2,spacing=1)
    p.text('Consultation / Experience planning / Integration / Recruitment &amp; training / Launch / Continuing support',x,162*mm,w,9.2,leading=13,limit=53)
    p.text('For hospitality, workplaces, malls, wellness centres, education, communities and retreats.',x,189*mm,w,8.3,MUTED,limit=33)
    c.restoreState(); c.save(); return path

if __name__=='__main__':
    OUT.mkdir(exist_ok=True); paths=[digital(),trifold()]
    renderSVG.drawToFile(qr(300),str(ASSETS/'website-qr.svg'))
    report=[]
    for path,count in zip(paths,[7,2]):
        r=PdfReader(path); assert len(r.pages)==count
        text=' '.join(page.extract_text() for page in r.pages).casefold()
        for s in ['quick starter demo','charges may apply','franchise opportunity',EMAIL,PHONE,'resonant energy']:
            assert s.casefold() in text,(path,s)
        links=sum(len(page.get('/Annots',[])) for page in r.pages); assert links>=4
        report.append({'file':path.name,'pages':count,'bytes':path.stat().st_size,'links':links})
    (ROOT/'source/build-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
