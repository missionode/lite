from pathlib import Path

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate, Frame, Image, KeepTogether, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle
)

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ROOT / "output"
OUT.mkdir(parents=True, exist_ok=True)

MIDNIGHT = HexColor("#050B1A")
DEEP = HexColor("#081A36")
BLUE = HexColor("#0865C7")
VIOLET = HexColor("#7459CE")
GOLD = HexColor("#D7AE69")
WHITE = HexColor("#F4F6FB")
MUTED = HexColor("#B9C4D8")

FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
for path, name in [
    ("/System/Library/Fonts/Supplemental/Arial.ttf", "BrandRegular"),
    ("/System/Library/Fonts/Supplemental/Arial Bold.ttf", "BrandBold"),
]:
    if Path(path).exists():
        pdfmetrics.registerFont(TTFont(name, path))
        if name == "BrandRegular": FONT = name
        else: FONT_BOLD = name

styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", fontName=FONT_BOLD, fontSize=25, leading=28, textColor=WHITE, spaceAfter=8)
H2 = ParagraphStyle("H2", fontName=FONT_BOLD, fontSize=15, leading=18, textColor=GOLD, spaceBefore=5, spaceAfter=6)
H3 = ParagraphStyle("H3", fontName=FONT_BOLD, fontSize=10, leading=12, textColor=WHITE, spaceBefore=3, spaceAfter=2)
BODY = ParagraphStyle("Body", fontName=FONT, fontSize=8.4, leading=11.2, textColor=WHITE, spaceAfter=5)
SMALL = ParagraphStyle("Small", fontName=FONT, fontSize=7.1, leading=9, textColor=MUTED, spaceAfter=3)
CAP = ParagraphStyle("Cap", fontName=FONT_BOLD, fontSize=7, leading=8, textColor=GOLD, tracking=1.3, spaceAfter=5)
CENTER = ParagraphStyle("Center", parent=BODY, alignment=TA_CENTER)

def p(text, style=BODY):
    return Paragraph(text, style)

def bullet(text):
    return Paragraph(f"<font color='#D7AE69'>•</font> {text}", BODY)

def dark_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(MIDNIGHT)
    canvas.rect(0, 0, doc.pagesize[0], doc.pagesize[1], fill=1, stroke=0)
    canvas.restoreState()

def contact_block(compact=False):
    style = SMALL if compact else BODY
    return [
        p("SRISHTI INNOVATIVE", H2),
        p("Head Office: Thiruvananthapuram", style),
        p("Phone &amp; WhatsApp: +91 7510726715", style),
        p("syamnath.s@srishtiinnovative.com", style),
        p("www.srishtis.com", style),
    ]

def build_digital():
    path = OUT / "srishti-nine-day-meditation-digital.pdf"
    w, h = A4
    margin = 18 * mm
    frame = Frame(margin, margin, w - 2 * margin, h - 2 * margin, id="main", showBoundary=0)
    doc = BaseDocTemplate(str(path), pagesize=A4, pageTemplates=[PageTemplate(id="dark", frames=[frame], onPage=dark_page)],
                          leftMargin=margin, rightMargin=margin, topMargin=margin, bottomMargin=margin,
                          title="Srishti Innovative - Nine-Day Meditation Journey")
    story = []
    logo = Image(str(ASSETS / "srishti-innovative-logo.png"), width=70*mm, height=10.55*mm)
    hero = Image(str(ASSETS / "meditation-room-hero.png"), width=w-2*margin, height=(w-2*margin)*941/1672)
    story += [logo, Spacer(1, 10*mm), hero, Spacer(1, 8*mm), p("NINE DAYS. SEVEN CENTRES.<br/>ONE IMMERSIVE JOURNEY.", H1),
              p("Discover meditation through a structured nine-day programme in a luxurious, technology-supported environment designed for comfort, attention, and inner exploration."),
              p("JOIN THE NINE-DAY MEDITATION JOURNEY", H2), p("No previous meditation experience is required."), PageBreak()]
    story += [p("MEDITATION MADE UNDERSTANDABLE", H1),
              p("A beginner-friendly progression through breath, attention, bodily awareness, visualization, sound, and the traditional seven-chakra contemplative framework."),
              p("Participants experience", H2)]
    for item in ["Breath awareness and Box Breathing", "Guided Visualization and Focused Attention", "Ho'oponopono-inspired reflection", "Undo &amp; Unlearn", "Guided Body Scan", "Noting and Labeling", "Seven-chakra guided meditation", "Optional sound-therapy-inspired meditation", "Resonant Energy Meditation", "A concluding mindful music experience"]:
        story.append(bullet(item))
    story += [Spacer(1, 6*mm), p("QUICK STARTER DEMO", H2), p("Experience a guided introduction to the Srishti immersive meditation journey."), p("<b>Duration: 1 hour</b>"), p("<i>Charges may apply.</i>", SMALL), PageBreak()]
    story += [p("THE NINE-DAY JOURNEY", H1)]
    days = [
        ("1 · ROOT", "Meditation basics, breathwork, grounding, stability, safety, and belonging."),
        ("2 · SACRAL", "Creativity, emotion, boundaries, visualization, and the Vijnana Bhairava Tantra."),
        ("3 · SOLAR PLEXUS", "Focused attention, confidence, agency, and disciplined action."),
        ("4 · HEART", "Compassion, gratitude, healthy boundaries, and Ho'oponopono-inspired reflection."),
        ("5 · THROAT", "Authentic expression, mindful communication, listening, and Undo &amp; Unlearn."),
        ("6 · THIRD EYE", "Body awareness, clear observation, intuition, and Guided Body Scan."),
        ("7 · CROWN", "Meaning, connection, spacious awareness, Guided Noting, and all seven chakras."),
        ("8 · INTEGRATED SOUND", "Two selected add-ons, all seven chakras, and optional sound-inspired meditation."),
        ("9 · RESONANT ENERGY", "Uplifting sound, focused attention, mindful listening, music, and integration."),
    ]
    for title, text in days:
        story += [p(title, H2), p(text)]
    story += [PageBreak(), p("IMMERSIVE TECHNOLOGY. TRAINED PEOPLE.", H1),
              p("Srishti Innovative provides an integrated meditation-room solution for hotels, resorts, corporate campuses, technoparks, malls, wellness centres, educational institutions, residential communities, retreats, and hospitality destinations."),
              p("The solution can include", H2)]
    for item in ["Experience and meditation-room planning", "Immersive meditation software and digital content", "Visual and spatial-audio configuration", "Installation and operational guidance", "Brand integration", "Operator training", "Trained-manpower recruitment and deployment", "Ongoing software, content, and customized digital-business solutions"]:
        story.append(bullet(item))
    story += [Spacer(1, 4*mm), p("FRANCHISE OPPORTUNITY", H2),
              p("Build and operate a distinctive meditation experience in your city with Srishti branding, immersive software, guided-session workflows, trained-manpower assistance, launch guidance, and continuing support."), PageBreak(),
              p("FROM CONSULTATION TO LAUNCH", H1)]
    process = [("1", "Consultation", "Understand the location, audience, space, objectives, and operating model."),
               ("2", "Experience planning", "Define seating, visuals, sound, software, branding, and participant flow."),
               ("3", "Integration", "Configure software, guided content, immersive visuals, and sound."),
               ("4", "Recruitment &amp; training", "Train an existing team or help recruit trained operators."),
               ("5", "Launch", "Test the room and prepare operations and programme standards."),
               ("6", "Continuing support", "Provide software, content, operator, and digital-solution support.")]
    for n, title, text in process:
        story += [p(f"{n}  {title}", H2), p(text)]
    story += [Spacer(1, 8*mm)] + contact_block() + [Spacer(1, 6*mm),
              p("Chakras, mantras, visualization, sound, and related imagery are presented as traditional contemplative practices. They are not medical diagnoses, treatments, or guaranteed outcomes.", SMALL)]
    doc.build(story)
    return path

def draw_panel_bg(c, x, y, w, h, color=DEEP):
    c.setFillColor(color)
    c.rect(x, y, w, h, fill=1, stroke=0)

def panel_text(c, items, x, y, w, h, pad=8*mm):
    frame = Frame(x+pad, y+pad, w-2*pad, h-2*pad, showBoundary=0, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    frame.addFromList(items, c)

def build_trifold():
    path = OUT / "srishti-nine-day-meditation-trifold.pdf"
    pw, ph = landscape(A4)
    panel = pw / 3
    from reportlab.pdfgen.canvas import Canvas
    c = Canvas(str(path), pagesize=(pw, ph))
    c.setTitle("Srishti Innovative - Nine-Day Meditation Journey - Tri-fold")
    # Outside: flap, back, front
    for i in range(3): draw_panel_bg(c, i*panel, 0, panel, ph, MIDNIGHT if i != 1 else DEEP)
    panel_text(c, [p("QUICK STARTER DEMO", H2), p("Experience a guided introduction to the Srishti immersive meditation journey."), p("<b>Duration: 1 hour</b>"), p("<i>Charges may apply.</i>", SMALL), Spacer(1,5*mm), p("SUITABLE FOR", H2), p("Hotels · Resorts · Technoparks · Corporate campuses · Malls · Wellness centres · Educational institutions · Retreats · Residential communities", SMALL)], 0, 0, panel, ph)
    panel_text(c, [p("BRING THE EXPERIENCE TO YOUR SPACE", H2), p("Integrated meditation-room planning, immersive software, digital content, brand integration, operator training, trained-manpower recruitment, and continuing digital support."), p("FRANCHISE OPPORTUNITY", H2), p("Build a distinctive meditation destination with Srishti branding, software, guided workflows, launch guidance, and continuing support.")] + contact_block(True) + [Spacer(1,4*mm), p("Traditional contemplative practices; not medical treatment or guaranteed outcomes.", SMALL)], panel, 0, panel, ph)
    hero_path = str(ASSETS / "meditation-room-hero.png")
    c.drawImage(hero_path, 2*panel, ph*0.38, panel, ph*0.62, preserveAspectRatio=False, mask='auto')
    panel_text(c, [p("NINE DAYS.<br/>SEVEN CENTRES.<br/>ONE IMMERSIVE JOURNEY.", H1), p("A luxurious, technology-supported meditation experience for comfort, attention, and inner exploration."), p("JOIN THE JOURNEY", H2), p("No previous meditation experience is required.")], 2*panel, 0, panel, ph*0.43, pad=7*mm)
    c.showPage()
    # Inside spread
    for i in range(3): draw_panel_bg(c, i*panel, 0, panel, ph, DEEP if i != 1 else MIDNIGHT)
    panel_text(c, [p("MEDITATION MADE UNDERSTANDABLE", H2), p("A gradual, beginner-friendly progression through breath, attention, bodily awareness, visualization, sound, and the traditional seven-chakra framework."), p("EXPERIENCES", H2)] + [bullet(x) for x in ["Box Breathing", "Guided Visualization", "Focused Attention", "Ho'oponopono-inspired reflection", "Undo &amp; Unlearn", "Body Scan", "Noting and Labeling", "Optional sound-inspired meditation", "Resonant Energy Meditation"]], 0, 0, panel, ph, pad=7*mm)
    panel_text(c, [p("THE NINE-DAY JOURNEY", H2)] + [p(f"<b>{t}</b><br/>{d}", SMALL) for t,d in [("1 Root", "Grounding and breath"), ("2 Sacral", "Emotion and visualization"), ("3 Solar Plexus", "Confidence and focus"), ("4 Heart", "Compassion and boundaries"), ("5 Throat", "Expression and listening"), ("6 Third Eye", "Observation and body awareness"), ("7 Crown", "Meaning and spacious awareness"), ("8 Integrated Sound", "All seven chakras"), ("9 Resonant Energy", "Sound, music, and integration")]], panel, 0, panel, ph, pad=7*mm)
    panel_text(c, [p("FROM IDEA TO OPERATION", H2), p("1  Consultation", H3), p("Understand your space, audience, and objectives.", SMALL), p("2  Experience Planning", H3), p("Define seating, visuals, sound, software, and branding.", SMALL), p("3  Integration", H3), p("Configure software, content, visuals, and sound.", SMALL), p("4  Recruitment &amp; Training", H3), p("Train your team or recruit trained operators.", SMALL), p("5  Launch", H3), p("Test and prepare the complete experience.", SMALL), p("6  Continuing Support", H3), p("Software, content, operator, and digital support.", SMALL), p("IMMERSIVE TECHNOLOGY.<br/>TRAINED PEOPLE.", H2)], 2*panel, 0, panel, ph, pad=7*mm)
    c.save()
    return path

if __name__ == "__main__":
    # Keep the original edition for reference; the supported entry point builds v2.
    import runpy
    runpy.run_path(str(Path(__file__).with_name('build_editorial.py')), run_name='__main__')
