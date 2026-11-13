#!/usr/bin/env python3
"""Fills the <!-- BLOG:START --> ... <!-- BLOG:END --> block of the profile READMEs
with the latest dev.to articles (cover image + title + date).

Uses only the Python standard library and the public dev.to API (no token needed).
If the API fails or returns nothing, the READMEs are left untouched.
"""
import html
import json
import re
import sys
import urllib.request
from datetime import datetime

USER = "pushodev"
COUNT = 4          # how many articles to show
PER_ROW = 2        # cards per table row
FILES = ["README.md", "README.en.md"]
API = f"https://dev.to/api/articles?username={USER}&per_page={COUNT}"
BLOCK = re.compile(r"(<!-- BLOG:START -->)(.*?)(<!-- BLOG:END -->)", re.DOTALL)


def fetch_articles():
    req = urllib.request.Request(API, headers={"User-Agent": "profile-readme-blog-updater"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def card(article):
    title = html.escape(article["title"])
    url = html.escape(article["url"], quote=True)
    published = datetime.fromisoformat(article["published_at"].replace("Z", "+00:00"))
    cover = article.get("cover_image")
    image = ""
    if cover:
        image = (
            f'<a href="{url}"><img src="{html.escape(cover, quote=True)}" '
            f'width="320" alt="{title}"/></a><br/>'
        )
    return (
        f'<td align="center" valign="top" width="340">{image}'
        f'<a href="{url}"><b>{title}</b></a><br/>'
        f'<sub>{published:%Y-%m-%d}</sub></td>'
    )


def build_block(articles):
    cards = [card(a) for a in articles[:COUNT]]
    rows = [cards[i:i + PER_ROW] for i in range(0, len(cards), PER_ROW)]
    body = "\n".join("<tr>" + "".join(row) + "</tr>" for row in rows)
    return f'<table align="center">\n{body}\n</table>'


def main():
    try:
        articles = fetch_articles()
    except Exception as exc:  # network / API problem: keep the current README
        print(f"Could not fetch dev.to articles: {exc}")
        return 0
    if not articles:
        print("No articles returned; leaving the READMEs untouched.")
        return 0

    block = build_block(articles)
    changed = False
    for name in FILES:
        try:
            text = open(name, encoding="utf-8").read()
        except FileNotFoundError:
            continue
        if not BLOCK.search(text):
            print(f"{name}: BLOG markers not found, skipping.")
            continue
        new = BLOCK.sub(lambda m: f"{m.group(1)}\n{block}\n{m.group(3)}", text)
        if new != text:
            open(name, "w", encoding="utf-8").write(new)
            print(f"{name}: updated")
            changed = True
    if not changed:
        print("Nothing to update.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
