#!/usr/bin/env python3
"""Apply workforce infrastructure expansion patches (Phases 1–3)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "workforce-infrastructure.html"
ENGAGE = ROOT / "workforce-engage.html"
DILIGENCE = ROOT / "workforce-diligence.html"

def patch_html(text: str) -> str:
    if 'workforce-expansion.css' not in text:
        text = text.replace(
            '<link rel="stylesheet" href="assets/css/workforce-infrastructure.css" />',
            '<link rel="stylesheet" href="assets/css/workforce-infrastructure.css" />\n  <link rel="stylesheet" href="assets/css/workforce-expansion.css" />',
        )

    # Nav
    old_nav = """        <a href="#audiences">Who We Serve</a>
        <a href="#wddam-framework">WDDAM</a>
        <a href="#vendor-alignment">Vendors &amp; Standards</a>
        <a href="#lifecycle">Approach</a>
        <a href="#cohort">Cohort</a>
        <a href="workforce-diligence.html">Diligence</a>
        <a href="#partner">Engage</a>"""
    new_nav = """        <a href="#audiences">Buyers</a>
        <a href="#programme-economics">Economics</a>
        <a href="#vendor-alignment">Vendors</a>
        <a href="#enterprise-modes">Engage</a>
        <a href="#wddam-framework">WDDAM</a>
        <a href="workforce-diligence.html">Diligence</a>
        <a href="#partner">Partner</a>"""
    text = text.replace(old_nav, new_nav)

    # Hero rail
    if 'hero-audience-rail' not in text:
        text = text.replace(
            """        <motion class="hero-cta-row">""".replace('motion', 'motion'),  # noop guard
        )
        text = text.replace(
            """        <div class="hero-cta-row">
          <a href="workforce-engage.html?intent=briefing" class="btn btn-gold btn-lg">Schedule Executive Briefing</a>
          <a href="workforce-engage.html?intent=cohort" class="btn btn-outline btn-lg">Request Workforce Cohort</a>
        </motion>""".replace('<motion', '<div').replace('</motion>', '</motion>'),
        )
        hero_rail = """
        <nav class="hero-audience-rail" aria-label="Jump to institutional buyer sections">
          <a class="har-chip har-chip--un" href="#un-mandate">UN / IGO</a>
          <a class="har-chip har-chip--gov" href="#audiences">Government</a>
          <a class="har-chip har-chip--ent" href="#enterprise-modes">Enterprise</a>
          <a class="har-chip har-chip--cert" href="#certification-partners">Cert bodies</a>
          <a class="har-chip har-chip--inv" href="#partner">Investors</a>
        </nav>"""
        text = text.replace(
            """        <motion class="hero-cta-row">
          <a href="workforce-engage.html?intent=briefing" class="btn btn-gold btn-lg">Schedule Executive Briefing</a>
          <a href="workforce-engage.html?intent=cohort" class="btn btn-outline btn-lg">Request Workforce Cohort</a>
        </motion>""",
            hero_rail,
        )
        text = text.replace(
            """        <div class="hero-cta-row">
          <a href="workforce-engage.html?intent=briefing" class="btn btn-gold btn-lg">Schedule Executive Briefing</a>
          <a href="workforce-engage.html?intent=cohort" class="btn btn-outline btn-lg">Request Workforce Cohort</a>
        </div>""",
            """        <motion class="hero-cta-row">
          <a href="workforce-engage.html?intent=briefing" class="btn btn-gold btn-lg">Schedule Executive Briefing</a>
          <a href="workforce-engage.html?intent=cohort" class="btn btn-outline btn-lg">Request Workforce Cohort</a>
        </motion>""".replace('<motion', '<motion').replace('</motion>', '</motion>'),
        )
        # fix - only insert rail after hero-cta-row div
        if 'hero-audience-rail' not in text:
            text = text.replace(
                """        </motion>
      </motion>
      <aside class="hero-stat-panel">""".replace('motion', 'x'),
                '',
            )
            text = text.replace(
                """        </motion>
      </div>
      <aside class="hero-stat-panel">""",
                '',
            )
            text = text.replace(
                """        </div>
      </aside>""",
                '',
            )
            insert_after = """        </motion>
      </motion>
      <aside"""
            # simpler approach
            marker = """          <a href="workforce-engage.html?intent=cohort" class="btn btn-outline btn-lg">Request Workforce Cohort</a>
        </div>
      </div>
      <aside class="hero-stat-panel">"""
            replacement = """          <a href="workforce-engage.html?intent=cohort" class="btn btn-outline btn-lg">Request Workforce Cohort</a>
        </div>
""" + hero_rail.strip() + """
      </div>
      <aside class="hero-stat-panel">"""
            if marker in text:
                text = text.replace(marker, replacement)

    # Programme economics after at-a-glance
    if 'programme-economics-section' not in text:
        pe_section = open(ROOT / 'scripts/snippets/programme-economics.html', encoding='utf-8').read()
        text = text.replace(
            '  <!-- WHO WE SERVE — INSTITUTIONAL AUDIENCES -->',
            pe_section + '\n  <!-- WHO WE SERVE — INSTITUTIONAL AUDIENCES -->',
        )

    return text


if __name__ == '__main__':
    print('Run snippets first')
