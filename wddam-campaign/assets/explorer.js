(function () {
  "use strict";

  var mount = document.getElementById("explorer-mount");
  var slug = document.body.getAttribute("data-sector");
  var ladder = window.WDDAM_LADDERS && window.WDDAM_LADDERS[slug];
  var campaign = window.WDDAM_CAMPAIGN;
  if (!mount || !ladder || !campaign) return;

  var LEVELS = ["L1", "L2", "L3", "L4", "L5"];
  var state = { team: 0, level: 0 };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function money(value) {
    return "$" + Number(value).toLocaleString("en-US");
  }

  function mail(subject, body) {
    return "mailto:" + campaign.routes.workforceEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var team = parseInt(params.get("team"), 10);
    var level = LEVELS.indexOf(params.get("level"));
    if (team >= 1 && team <= ladder.teams.length) state.team = team - 1;
    if (level >= 0) state.level = level;
    return params.has("team") || params.has("level");
  }

  function writeUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set("team", String(state.team + 1));
    url.searchParams.set("level", LEVELS[state.level]);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function chips(list, className) {
    var wrap = el("ul", "chip-list" + (className ? " " + className : ""));
    list.forEach(function (item) {
      wrap.append(el("li", "chip", item));
    });
    return wrap;
  }

  function block(title, content) {
    var section = el("section", "level-block");
    section.append(el("h4", "", title));
    section.append(content);
    return section;
  }

  function renderMarket(team) {
    var market = ladder.market && ladder.market[state.team];
    var card = el("aside", "market-card");
    card.setAttribute("aria-label", "Labour-market pay reference");
    if (!market) return card;
    card.append(el("p", "eyebrow", "Labour-market reference"));
    card.append(el("h4", "", market.occupation));
    var range = el("div", "pay-range");
    var span = market.p90 - market.p10;
    var medianPct = Math.round(((market.median - market.p10) / span) * 100);
    var bar = el("div", "pay-bar");
    var marker = el("span", "pay-median");
    marker.style.left = medianPct + "%";
    bar.append(marker);
    range.append(bar);
    var figures = el("div", "pay-figures");
    [["Lower 10%", market.p10], ["Median", market.median], ["Upper 10%", market.p90]].forEach(function (pair, index) {
      var item = el("div", index === 1 ? "pay-figure is-median" : "pay-figure");
      item.append(el("strong", "", money(pair[1])));
      item.append(el("span", "", pair[0]));
      figures.append(item);
    });
    range.append(figures);
    card.append(range);
    card.append(el("p", "market-note", "US annual pay for the closest standard occupation" + (market.note ? " — " + market.note : "") + ". Early-career pay is usually nearer the lower end; senior specialists nearer the upper end."));
    card.append(el("p", "market-source", "Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics, May " + ladder.marketYear + ". This is a market reference, not a WDDAM™ pay offer, wage or placement guarantee."));
    return card;
  }

  function renderPortfolio(levelIndex) {
    var portfolio = ladder.portfolio;
    var wrap = el("div", "portfolio");
    var groups = levelIndex === 0 ? [portfolio.groups[0]] : portfolio.groups.slice(1);
    groups.forEach(function (group) {
      var part = el("div", "portfolio-group");
      part.append(el("h5", "", group.name));
      part.append(chips(group.items));
      wrap.append(part);
    });
    wrap.append(el("p", "portfolio-note", portfolio.note));
    return wrap;
  }

  function renderLevel(team, panel) {
    var level = team.levels[state.level];
    panel.replaceChildren();

    var head = el("header", "level-head");
    head.append(el("p", "eyebrow", LEVELS[state.level] + " · " + level.positioning));
    head.append(el("h3", "", level.title));
    panel.append(head);

    var grid = el("div", "level-grid");
    var main = el("div", "level-main");

    if (level.focus && level.focus.length) {
      var list = el("ul", "tick-list");
      level.focus.forEach(function (item) { list.append(el("li", "", item)); });
      main.append(block("What you develop at this level", list));
    }

    var certTitle = state.level === 0 ? "Certifications at this level" : "Certifications added at this level";
    if (level.certifications && level.certifications.length) {
      main.append(block(certTitle, chips(level.certifications, "chips-cert")));
    } else if (ladder.portfolio) {
      main.append(block("Approved certification portfolio", renderPortfolio(state.level)));
    } else {
      main.append(block(certTitle, el("p", "muted", "Credentials for this level are confirmed against the sector specification during enrolment.")));
    }

    if (state.level > 0) {
      var earlier = [];
      for (var index = 0; index < state.level; index += 1) {
        (team.levels[index].certifications || []).forEach(function (cert) {
          if (earlier.indexOf(cert) === -1) earlier.push(cert);
        });
      }
      if (earlier.length) {
        var details = el("details", "builds-on");
        details.append(el("summary", "", "Builds on " + earlier.length + " earlier credentials (L1–" + LEVELS[state.level - 1] + ")"));
        details.append(chips(earlier, "chips-muted"));
        main.append(details);
      }
    }
    grid.append(main);

    var side = el("div", "level-side");
    if (level.positions && level.positions.length) {
      var roles = el("ul", "role-list");
      level.positions.forEach(function (position) {
        var item = el("li", "");
        item.append(el("strong", "", position.title));
        item.append(el("span", "", position.count + (position.count === 1 ? " position per Team" : " positions per Team")));
        roles.append(item);
      });
      side.append(block("Roles in the Team", roles));
    }
    side.append(renderMarket(team));
    grid.append(side);
    panel.append(grid);

    var cta = el("div", "level-cta");
    var link = el("a", "button", "Ask about " + team.name + " · " + LEVELS[state.level] + " →");
    link.href = mail(
      "WDDAM Cohort 01 — " + ladder.sector + " — " + team.name + " — " + LEVELS[state.level],
      "Hello,\n\nI am interested in the " + team.name + " Team (" + LEVELS[state.level] + ") in the WDDAM™ " + ladder.sector + " Cohort 01 pathway. Please share the approved next step.\n\nThank you."
    );
    cta.append(link);
    cta.append(el("span", "muted", "Opens an email — not a formal application or job offer."));
    panel.append(cta);
  }

  function render() {
    var team = ladder.teams[state.team];
    mount.replaceChildren();

    var tabs = el("div", "team-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Specialized Teams");
    ladder.teams.forEach(function (item, index) {
      var tab = el("button", "team-tab");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(index === state.team));
      tab.append(el("span", "team-tab-index", "0" + (index + 1)));
      tab.append(el("span", "team-tab-name", item.name));
      tab.addEventListener("click", function () {
        state.team = index;
        writeUrl();
        render();
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (index + 1) % ladder.teams.length;
        if (event.key === "ArrowLeft") next = (index + ladder.teams.length - 1) % ladder.teams.length;
        if (next === null) return;
        event.preventDefault();
        state.team = next;
        writeUrl();
        render();
        mount.querySelectorAll(".team-tab")[next].focus();
      });
      tabs.append(tab);
    });
    mount.append(tabs);

    var intro = el("div", "team-intro");
    intro.append(el("h3", "", team.name));
    intro.append(el("p", "", team.summary));
    mount.append(intro);

    var steps = el("ol", "level-steps");
    steps.setAttribute("aria-label", "Capability levels");
    LEVELS.forEach(function (name, index) {
      var item = el("li", "");
      var button = el("button", "level-step" + (index <= state.level ? " is-reached" : ""));
      button.type = "button";
      button.setAttribute("aria-pressed", String(index === state.level));
      button.append(el("span", "level-step-name", name));
      button.append(el("span", "level-step-label", team.levels[index].positioning));
      button.addEventListener("click", function () {
        state.level = index;
        writeUrl();
        renderLevel(team, panel);
        steps.querySelectorAll(".level-step").forEach(function (node, nodeIndex) {
          node.setAttribute("aria-pressed", String(nodeIndex === index));
          node.classList.toggle("is-reached", nodeIndex <= index);
        });
      });
      item.append(button);
      steps.append(item);
    });
    mount.append(steps);

    var panel = el("div", "level-panel");
    panel.setAttribute("aria-live", "polite");
    renderLevel(team, panel);
    mount.append(panel);
  }

  var fromUrl = readUrl();
  render();
  if (fromUrl) {
    var target = document.getElementById("teams");
    if (target) target.scrollIntoView();
  }
}());
