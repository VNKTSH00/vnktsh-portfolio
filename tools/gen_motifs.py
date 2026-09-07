# -*- coding: utf-8 -*-
"""
Generates the background motifs for vnktsh.com as SVG data URIs.

Nothing here traces the reference images (which were watermarked stock).
These are drawn from scratch in the same line-art idiom, so they scale
cleanly, weigh a few KB, and are coloured from the site's own palette.
"""
import math, re

INK = "%232a1f16"   # --ink, pre-encoded
TERRA = "%23a0472a" # --terracotta-deep, pre-encoded


def uri(svg):
    svg = re.sub(r"\s+", " ", svg).strip()
    svg = svg.replace('"', "'")
    svg = (svg.replace("%", "\x00").replace("#", "%23")
              .replace("<", "%3C").replace(">", "%3E")
              .replace("\x00", "%"))
    return "data:image/svg+xml," + svg


# ---------------------------------------------------------------- kolam
# A pulli kolam: the looped lattice drawn in rice flour on the threshold
# of a Tamil home to welcome whoever arrives. Built as a rotated grid of
# rounded cells with a dot in each, ringed by pointed petals.
def kolam(n=9, d=44):
    span = (n - 1) * d
    pad = d * 2.6
    size = span + pad * 2
    c = size / 2
    g = []
    g.append("<g transform='rotate(45 %.1f %.1f)'>" % (c, c))

    # lattice cells + their dots
    inset = 6.5
    s = d - inset * 2
    r = s * 0.30
    for i in range(n):
        for j in range(n):
            x = pad + i * d - s / 2
            y = pad + j * d - s / 2
            g.append("<rect x='%.1f' y='%.1f' width='%.1f' height='%.1f' rx='%.1f'/>" % (x, y, s, s, r))
            g.append("<circle cx='%.1f' cy='%.1f' r='2.1' fill='CLR' stroke='none'/>"
                     % (pad + i * d, pad + j * d))

    # petals around the four edges — the frilled border of a kolam
    pl, pw = d * 0.92, d * 0.46
    petal = ("M0 0 C %.1f %.1f %.1f %.1f 0 %.1f C %.1f %.1f %.1f %.1f 0 0 Z"
             % (pw * .55, -pl * .30, pw * .52, -pl * .72, -pl,
                -pw * .52, -pl * .72, -pw * .55, -pl * .30))
    for k in range(n):
        p = pad + k * d
        e0, e1 = pad - d * 0.62, pad + span + d * 0.62
        for (x, y, a) in ((p, e0, 0), (p, e1, 180), (e0, p, -90), (e1, p, 90)):
            g.append("<g transform='translate(%.1f %.1f) rotate(%d)'>"
                     "<path d='%s'/><circle cx='0' cy='%.1f' r='2.1' fill='CLR' stroke='none'/></g>"
                     % (x, y, a, petal, -pl * 0.55))

    # centre rosette
    cx = cy = pad + span / 2
    rp = d * 0.80
    rosette = ("M0 0 C %.1f %.1f %.1f %.1f 0 %.1f C %.1f %.1f %.1f %.1f 0 0 Z"
               % (rp * .34, -rp * .30, rp * .30, -rp * .72, -rp,
                  -rp * .30, -rp * .72, -rp * .34, -rp * .30))
    for a in range(0, 360, 45):
        g.append("<g transform='translate(%.1f %.1f) rotate(%d)'><path d='%s'/></g>" % (cx, cy, a, rosette))
    g.append("<circle cx='%.1f' cy='%.1f' r='3.4' fill='CLR' stroke='none'/>" % (cx, cy))
    g.append("</g>")

    body = "".join(g).replace("CLR", INK)
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %.0f %.0f'>"
            "<g fill='none' stroke='%s' stroke-width='2.1' stroke-linejoin='round'>%s</g></svg>"
            % (size, size, INK, body))


# ---------------------------------------------------------------- frond
def frond():
    parts = []
    # stem
    parts.append("<path d='M150 470 C 148 380 160 250 196 150'/>")
    n = 13
    for i in range(n):
        t = i / (n - 1.0)
        # point along the stem
        bx = 150 + 46 * (t ** 1.6) + 6 * t
        by = 470 - 320 * t - 0 * t
        bx = 150 + (196 - 150) * (t ** 1.5)
        by = 470 - (470 - 150) * t
        length = 70 + 130 * math.sin(math.pi * (0.18 + 0.72 * t))
        for side in (-1, 1):
            spread = math.radians(58 - 26 * t)
            ang = -math.pi / 2 + side * spread
            tipx = bx + length * math.cos(ang) * 1.15
            tipy = by + length * math.sin(ang) * 0.95
            mx, my = (bx + tipx) / 2, (by + tipy) / 2
            bow = 16 + 10 * (1 - t)
            nx, ny = -(tipy - by), (tipx - bx)
            ln = math.hypot(nx, ny) or 1
            nx, ny = nx / ln, ny / ln
            # outline: two bowed curves out and back
            parts.append(
                "<path d='M%.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1f'/>"
                % (bx, by,
                   mx + nx * bow, my + ny * bow, tipx, tipy,
                   mx - nx * bow, my - ny * bow, bx, by))
            # two internal veins
            for f in (0.34, 0.64):
                parts.append("<path d='M%.1f %.1f Q%.1f %.1f %.1f %.1f'/>"
                             % (bx, by,
                                mx + nx * bow * f, my + ny * bow * f,
                                bx + (tipx - bx) * 0.97, by + (tipy - by) * 0.97))
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>"
            "<g fill='none' stroke='%s' stroke-width='1.7' stroke-linecap='round'>%s</g></svg>"
            % (INK, "".join(parts)))


# ---------------------------------------------------------------- vines
def vines(w=760, h=760):
    parts = []
    # A wider tile with more variety in angle, length and leaf size, so the
    # repeat does not read as wallpaper at the size it is used.
    branches = [
        (40, 90, -14, 210, 1.0), (330, 40, 26, 175, 0.85), (150, 250, 6, 230, 1.1),
        (560, 120, 62, 165, 0.9), (60, 380, 34, 150, 0.75), (300, 470, -8, 205, 1.0),
        (620, 330, 118, 180, 0.95), (180, 610, 44, 160, 0.8), (470, 610, -28, 190, 1.05),
        (20, 660, -62, 140, 0.7), (690, 560, 152, 150, 0.85), (420, 200, 96, 145, 0.75),
        (640, 20, 74, 130, 0.7), (90, 180, 128, 120, 0.65),
    ]
    for (x0, y0, rot, ln, sc) in branches:
        a = math.radians(rot)
        x1, y1 = x0 + ln * math.cos(a), y0 + ln * math.sin(a)
        parts.append("<path d='M%.0f %.0f Q%.0f %.0f %.0f %.0f'/>"
                     % (x0, y0, (x0 + x1) / 2 + 18 * math.sin(a), (y0 + y1) / 2 - 22, x1, y1))
        n = 5 if ln > 160 else 4
        for k in range(1, n + 1):
            t = k / float(n + 1)
            px = x0 + (x1 - x0) * t
            py = y0 + (y1 - y0) * t - 11 * math.sin(math.pi * t)
            for side in (-1, 1):
                la = a + side * math.radians(50 + 8 * math.sin(k * 1.7))
                L = (34 - 4 * abs(k - (n + 1) / 2.0)) * sc
                tx, ty = px + L * math.cos(la), py + L * math.sin(la)
                mx, my = (px + tx) / 2, (py + ty) / 2
                nx, ny = -(ty - py), (tx - px)
                nl = math.hypot(nx, ny) or 1
                b = 8.0 * sc
                nx, ny = nx / nl * b, ny / nl * b
                parts.append("<path d='M%.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1f'/>"
                             % (px, py, mx + nx, my + ny, tx, ty, mx - nx, my - ny, px, py))
                parts.append("<path d='M%.1f %.1f L%.1f %.1f'/>" % (px, py, tx, ty))
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %d %d'>"
            "<g fill='none' stroke='%s' stroke-opacity='0.058' stroke-width='1.6' "
            "stroke-linecap='round'>%s</g></svg>" % (w, h, INK, "".join(parts)))

# ------------------------------------------------------------- utensils
def utensils():
    # Kitchen things, drawn the way you would doodle them on a shopping list.
    d = {
      "bowl":   "<path d='M8 28 C8 22 84 22 84 28 C84 60 66 80 46 80 C26 80 8 60 8 28 Z'/>"
                "<path d='M8 28 C8 34 84 34 84 28'/>",
      "whisk":  "<path d='M40 74 C8 54 10 20 40 6'/><path d='M40 74 C24 56 26 22 40 6'/>"
                "<path d='M40 74 C56 56 54 22 40 6'/><path d='M40 74 C72 54 70 20 40 6'/>"
                "<path d='M40 74 V100'/><path d='M32 98 H48 L46 120 H34 Z'/>",
      "pin":    "<path d='M26 18 H74 A12 12 0 0 1 74 42 H26 A12 12 0 0 1 26 18 Z'/>"
                "<path d='M2 30 H26'/><path d='M74 30 H98'/>",
      "jug":    "<path d='M18 12 H62 L58 78 A6 6 0 0 1 52 84 H28 A6 6 0 0 1 22 78 Z'/>"
                "<path d='M62 26 A15 15 0 0 1 60 54'/><path d='M26 34 H44'/><path d='M26 50 H44'/>",
      "pan":    "<path d='M6 32 A28 26 0 0 0 62 32 Z'/><path d='M6 32 H62'/>"
                "<path d='M62 28 L96 20 A5 5 0 0 1 97 31 L63 39'/>",
      "spoon":  "<ellipse cx='28' cy='26' rx='15' ry='21' transform='rotate(-18 28 26)'/>"
                "<path d='M33 46 C40 62 50 78 62 94'/>",
      "cup":    "<path d='M14 44 A24 22 0 0 1 62 44 Z'/><path d='M24 24 C24 12 36 16 36 6'/>"
                "<path d='M44 28 C44 18 54 20 54 12'/><path d='M6 44 H70 L62 86 H14 Z'/>",
      "carton": "<path d='M14 26 L38 10 L62 26 V84 H14 Z'/><path d='M14 26 H62'/>"
                "<path d='M27 46 C27 57 45 57 45 46 C45 37 30 39 30 50'/>",
      "cutter": "<path d='M46 8 A18 18 0 1 1 45 8 Z'/><path d='M46 20 A6 6 0 1 1 45 20 Z'/>"
                "<path d='M46 44 V78'/><path d='M36 76 H56 L54 96 H38 Z'/>",
    }
    place = [("bowl", 30, 40, 1.05, -6), ("whisk", 230, 20, .95, 8),
             ("pin", 400, 110, 1.0, -14), ("jug", 50, 240, 1.0, 5),
             ("pan", 240, 300, 1.0, -4), ("spoon", 470, 300, 1.0, 16),
             ("cup", 430, 8, .9, -9), ("carton", 300, 420, .95, 6),
             ("cutter", 120, 430, .9, 12), ("bowl", 480, 470, .85, 10),
             ("whisk", 60, 430, .0001, 0)]
    parts = []
    for (k, x, y, s, r) in place:
        if s < 0.01:
            continue
        parts.append("<g transform='translate(%d %d) scale(%.2f) rotate(%d)'>%s</g>"
                     % (x, y, s, r, d[k]))
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 560'>"
            "<g fill='none' stroke='%s' stroke-width='2.4' stroke-linecap='round' "
            "stroke-linejoin='round'>%s</g></svg>" % (TERRA, "".join(parts)))

# ----------------------------------------------------------------- code
def code():
    rows = [(0, 16, 118), (24, 36, 72), (24, 56, 94), (48, 76, 60),
            (48, 96, 86), (24, 116, 68), (0, 136, 108)]
    parts = []
    for (indent, y, w) in rows:
        parts.append("<rect x='%d' y='%d' width='%d' height='7' rx='3.5'/>" % (12 + indent, y, w))
    parts.append("<path d='M192 48 L172 78 L192 108'/>")
    parts.append("<path d='M210 42 L222 114'/>")
    parts.append("<path d='M232 48 L252 78 L232 108'/>")
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 264 158'>"
            "<g fill='none' stroke='%s' stroke-width='2.2' stroke-linecap='round' "
            "stroke-linejoin='round'>%s</g></svg>" % (INK, "".join(parts)))

out = {"kolam": kolam(), "frond": frond(), "vines": vines(),
       "utensils": utensils(), "code": code()}

lines = []
for name, svg in out.items():
    u = uri(svg)
    lines.append("  --motif-%s: url(\"%s\");" % (name, u))
    print("%-9s raw %5d bytes -> uri %5d bytes" % (name, len(svg), len(u)))

open("motifs.css", "w").write("\n".join(lines) + "\n")

# also write standalone files so the shapes can be eyeballed
for name, svg in out.items():
    open("motif-%s.svg" % name, "w").write(svg.replace(INK, "#2a1f16").replace(TERRA, "#a0472a"))
print("\nwrote motifs.css + motif-*.svg")
