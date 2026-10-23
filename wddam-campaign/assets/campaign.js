(function () {
  "use strict";

  var data = window.WDDAM_CAMPAIGN;
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function workforceMail(subject, body) {
    var message = body || "Hello,\n\nI am interested in the WDDAM™ Cohort 01 pathway. Please share the approved next step.\n\nSector: ";
    return "mailto:" + data.routes.workforceEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
  }

  function setupNavigation() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".nav-links");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && window.matchMedia("(max-width: 600px)").matches) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  function addPathways(root, sectorName) {
    var cards = [
      {
        title: "Join a Specialized Team",
        text: "Explore the sector-specific member pathway. Your interests and experience help guide a review; they do not determine placement.",
        label: "Express interest in this sector",
        href: workforceMail("WDDAM Cohort 01 interest — " + sectorName, "Hello,\n\nI am interested in the WDDAM™ Cohort 01 " + sectorName + " pathway. Please share the approved next step.\n\nThank you.")
      },
      {
        title: "Team Leader · L5",
        text: "Explore the distinct leadership pathway, including Team capability, mentoring, assessment and readiness.",
        label: "Explore the Team Leader pathway",
        href: workforceMail("WDDAM L5 Team Leader pathway — " + sectorName, "Hello,\n\nI would like to learn more about the WDDAM™ L5 Team Leader pathway for " + sectorName + ". Please share the approved next step.\n\nThank you.")
      },
      {
        title: "Workforce Development Specialist",
        text: "Explore the workforce-demand and organizational interface. WDS is distinct from the L5 Team Leader role.",
        label: "Explore the WDS pathway",
        href: workforceMail("WDDAM WDS pathway — " + sectorName, "Hello,\n\nI would like to learn more about the WDDAM™ WDS pathway related to " + sectorName + ". Please share the approved next step.\n\nThank you.")
      },
      {
        title: "Organizations and institutions",
        text: "Discuss a sector-specific Team, cohort or broader workforce requirement through the existing institutional intake.",
        label: "Open organization cohort intake",
        href: data.routes.organization
      }
    ];
    var grid = element("div", "pathway-grid");
    cards.forEach(function (item) {
      var card = element("article", "pathway-card");
      card.append(element("h3", "", item.title));
      card.append(element("p", "", item.text));
      var link = element("a", "button button-secondary button-small", item.label);
      link.href = item.href;
      card.append(link);
      grid.append(card);
    });
    root.append(grid);
  }

  function addSectorVisual(root, sector) {
    if (!root) return;
    var figure = element("figure", "sector-visual");
    figure.dataset.visual = sector.visualStyle;
    figure.setAttribute("aria-label", sector.visualLabel + ": " + sector.teams.map(function (team) {
      return team.name;
    }).join("; "));

    var top = element("div", "visual-top");
    top.append(element("span", "", "COHORT 01 · SECTOR PATHWAY"));
    top.append(element("span", "", "COHORT 01"));
    figure.append(top);

    var heading = element("div", "visual-heading");
    heading.append(element("strong", "", sector.visualLabel));
    heading.append(element("span", "", "Five Specialized Teams"));
    figure.append(heading);

    var canvas = element("div", "visual-canvas");
    canvas.dataset.visual = sector.visualStyle;
    var nodes = element("ol", "visual-nodes");
    nodes.dataset.visual = sector.visualStyle;
    sector.teams.forEach(function (team, index) {
      var node = element("li", "visual-node");
      node.append(element("span", "visual-index", "0" + (index + 1)));
      node.append(element("strong", "", team.name));
      nodes.append(node);
    });
    canvas.append(nodes);
    if (sector.visualStyle === "radar") {
      var core = element("div", "visual-core");
      core.append(element("span", "", "WDDAM™"));
      core.append(element("strong", "", "Cybersecurity"));
      canvas.append(core);
    }
    figure.append(canvas);

    var caption = element("figcaption", "visual-caption");
    caption.append(element("span", "", sector.visualCaption));
    caption.append(element("strong", "", "Five defined Teams"));
    figure.append(caption);
    root.replaceChildren(figure);
  }

  function renderSector() {
    var body = document.body;
    var slug = body.getAttribute("data-sector");
    var sector = data.sectors[slug];
    var mount = document.getElementById("sector-content");
    var teamAnchor = document.getElementById("teams");
    var pathwayAnchor = document.getElementById("pathways");
    var hero = document.querySelector(".sector-hero");
    if (!sector || !mount || !hero) return;

    document.title = sector.name + " Cohort 01 | WDDAM™ — BTH Education Group";
    var description = document.querySelector('meta[name="description"]');
    if (description) description.content = sector.proposition;
    hero.dataset.accent = sector.accent;
    mount.dataset.visual = sector.visualStyle;
    var title = hero.querySelector("[data-sector-title]");
    var tagline = hero.querySelector("[data-sector-tagline]");
    var summary = hero.querySelector("[data-sector-summary]");
    var kicker = hero.querySelector("[data-sector-kicker]");
    var visualMount = hero.querySelector("[data-sector-visual]");
    if (title) title.textContent = sector.name;
    if (tagline) tagline.textContent = sector.heroTitle;
    if (summary) summary.textContent = sector.campaignLead;
    if (kicker) kicker.textContent = sector.name + " · Cohort 01";
    addSectorVisual(visualMount, sector);

    var interest = hero.querySelector("[data-sector-interest]");
    if (interest) interest.href = workforceMail("WDDAM Cohort 01 interest — " + sector.name, "Hello,\n\nI am interested in the WDDAM™ " + sector.name + " Cohort 01 pathway. Please share the approved next step.\n\nThank you.");

    var overviewSection = element("section", "section sector-overview");
    var overviewWrap = element("div", "wrap sector-overview-inner");
    overviewWrap.append(element("p", "eyebrow", "The sector architecture"));
    overviewWrap.append(element("h2", "", sector.focusTitle));
    overviewWrap.append(element("p", "", sector.fitStatement));
    overviewSection.append(overviewWrap);
    mount.insertBefore(overviewSection, teamAnchor || mount.firstChild);

    var teamSection = element("section", "section light-section sector-teams");
    teamSection.id = "teams";
    teamSection.dataset.visual = sector.visualStyle;
    var teamWrap = element("div", "wrap reveal");
    var teamHeading = element("div", "section-header");
    var headingGroup = element("div");
    headingGroup.append(element("p", "eyebrow", sector.name + " · Five-Team architecture"));
    headingGroup.append(element("h2", "", sector.teamHeading));
    teamHeading.append(headingGroup);
    teamHeading.append(element("p", "", sector.teamIntro));
    teamWrap.append(teamHeading);

    var teamGrid = element("div", "team-grid");
    sector.teams.forEach(function (team, index) {
      var card = element("article", "team-card");
      card.append(element("span", "", "Team 0" + (index + 1)));
      card.append(element("h3", "", team.name));
      card.append(element("p", "", team.scope));
      var link = element("a", "text-link", "Explore this Team →");
      link.href = workforceMail("WDDAM Cohort 01 interest — " + sector.name + " — " + team.name, "Hello,\n\nI am interested in learning more about the " + team.name + " Team in the WDDAM™ " + sector.name + " Cohort 01 pathway. Please share the approved next step.\n\nThank you.");
      card.append(link);
      teamGrid.append(card);
    });
    teamWrap.append(teamGrid);
    teamWrap.append(element("p", "source-line", "Source: " + sector.source));
    teamSection.append(teamWrap);
    if (teamAnchor) teamAnchor.replaceWith(teamSection);
    else mount.append(teamSection);

    var levelsSection = element("section", "section");
    var levelsWrap = element("div", "wrap reveal");
    var levelHeading = element("div", "sector-journey-heading");
    levelHeading.append(element("p", "eyebrow", "A clear, evidence-led pathway"));
    levelHeading.append(element("h2", "", "Bring what you know. Discover what comes next."));
    levelHeading.append(element("p", "", "No WDDAM™ level is assumed. Qualification and placement follow the approved process; prior experience and credentials inform review but do not guarantee readiness."));
    levelsWrap.append(levelHeading);
    var journey = element("div", "journey-grid");
    [
      ["01", "Explore your fit", "Choose a sector and the Team whose work interests you."],
      ["02", "Demonstrate capability", "Qualification and assessment use the approved sector standards and evidence."],
      ["03", "Progress with purpose", "Interview, acceptance, enrollment and Team assignment follow the readiness process."]
    ].forEach(function (step) {
      var card = element("article", "journey-card");
      card.append(element("span", "journey-number", step[0]));
      card.append(element("h3", "", step[1]));
      card.append(element("p", "", step[2]));
      journey.append(card);
    });
    levelsWrap.append(journey);
    levelsSection.append(levelsWrap);
    mount.insertBefore(levelsSection, pathwayAnchor || null);

    var pathwaySection = element("section", "section");
    pathwaySection.id = "pathways";
    var pathwayWrap = element("div", "wrap reveal");
    var pathwayHeading = element("div", "section-header");
    var pathwayGroup = element("div");
    pathwayGroup.append(element("p", "eyebrow", "Choose the right next step"));
    pathwayGroup.append(element("h2", "", "Take the next step."));
    pathwayHeading.append(pathwayGroup);
    pathwayHeading.append(element("p", "", "Start by expressing interest. The current campaign contact is not a formal application, offer of employment or guarantee of acceptance."));
    pathwayWrap.append(pathwayHeading);
    addPathways(pathwayWrap, sector.name);
    pathwaySection.append(pathwayWrap);
    if (pathwayAnchor) pathwayAnchor.replaceWith(pathwaySection);
    else mount.append(pathwaySection);

    var ctaSection = element("section", "section light-section");
    var ctaWrap = element("div", "wrap page-cta sector-interest-cta");
    var ctaCopy = element("div");
    ctaCopy.append(element("p", "eyebrow", "Your next step starts here"));
    ctaCopy.append(element("h2", "", "Curious about " + sector.name + "?"));
    ctaCopy.append(element("p", "", "Send a short expression of interest to the workforce team. They can provide the approved next step; this message is not a formal application."));
    ctaWrap.append(ctaCopy);
    var ctaActions = element("div", "cta-actions");
    var ctaLink = element("a", "button", "Express interest →");
    ctaLink.href = workforceMail("WDDAM Cohort 01 interest — " + sector.name, "Hello,\n\nI am interested in the WDDAM™ " + sector.name + " Cohort 01 pathway. Please share the approved next step.\n\nThank you.");
    ctaActions.append(ctaLink);
    ctaWrap.append(ctaActions);
    ctaSection.append(ctaWrap);
    mount.append(ctaSection);
  }

  function renderHub() {
    var grid = document.getElementById("sector-grid");
    if (!grid) return;
    Object.keys(data.sectors).forEach(function (slug, index) {
      var sector = data.sectors[slug];
      var card = element("article", "sector-card reveal");
      card.dataset.accent = sector.accent;
      card.dataset.visual = sector.visualStyle;
      var cardTop = element("div", "sector-card-top");
      cardTop.append(element("p", "eyebrow", "SECTOR 0" + (index + 1)));
      cardTop.append(element("span", "sector-card-count", "5 TEAMS"));
      card.append(cardTop);
      card.append(element("h3", "", sector.name));
      card.append(element("p", "", sector.campaignLead));
      var graphic = element("div", "sector-card-graphic");
      graphic.setAttribute("aria-hidden", "true");
      var track = element("div", "team-track");
      for (var teamIndex = 0; teamIndex < 5; teamIndex += 1) {
        var marker = element("span", "team-track-node", "0" + (teamIndex + 1));
        track.append(marker);
      }
      graphic.append(track);
      graphic.append(element("span", "sector-card-note", "ONE INTEGRATED SECTOR WORKFORCE"));
      card.append(graphic);
      var actions = element("div", "card-actions");
      var explore = element("a", "button button-small", "Find your pathway");
      explore.href = slug + "/";
      actions.append(explore);
      var target = element("span", "card-target", "5 defined Teams");
      actions.append(target);
      card.append(actions);
      grid.append(card);
    });
  }

  setupNavigation();
  renderHub();
  renderSector();
}());
