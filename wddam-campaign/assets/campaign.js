(function () {
  "use strict";

  var data = window.WDDAM_CAMPAIGN;
  var SLUGS = ["medical-technology", "cybersecurity", "information-technology", "cloud-data-ai"];

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

  function interestMail(name) {
    return workforceMail("WDDAM Cohort 01 interest — " + name, "Hello,\n\nI am interested in the WDDAM™ " + name + " Cohort 01 pathway. Please share the approved next step.\n\nThank you.");
  }

  function header(eyebrow, title, lead, center) {
    var head = element("header", "gwix-section-header reveal" + (center ? " gwix-section-header--center" : ""));
    head.append(element("p", "gwix-eyebrow", eyebrow));
    head.append(element("h2", "", title));
    if (lead) head.append(element("p", "gwix-lead", lead));
    return head;
  }

  function section(id, tone, labelId) {
    var node = element("section", "gwix-section gwix-section--" + tone);
    if (id) node.id = id;
    var container = element("div", "gwix-container");
    node.append(container);
    return { node: node, container: container };
  }

  function setHeroTitle(node, text) {
    var words = text.split(" ");
    var last = words.pop();
    node.textContent = "";
    node.append(document.createTextNode(words.join(" ") + " "));
    node.append(element("em", "", last));
  }

  function addPathways(container, sectorName) {
    var cards = [
      { role: "Cohort · L1–L5", title: "Join a Specialized Team", text: "Explore the sector-specific member pathway. Your interests and experience help guide a review; they do not determine placement.", label: "Express interest", href: interestMail(sectorName) },
      { role: "L5 · Team Leader", title: "Team Leader pathway", text: "Explore the distinct leadership pathway, including Team capability, mentoring, assessment and readiness.", label: "Explore Team Leader", href: workforceMail("WDDAM L5 Team Leader pathway — " + sectorName, "Hello,\n\nI would like to learn more about the WDDAM™ L5 Team Leader pathway for " + sectorName + ". Please share the approved next step.\n\nThank you.") },
      { role: "WDS", title: "Workforce Development Specialist", text: "Explore the workforce-demand and organizational interface. WDS is distinct from the L5 Team Leader role.", label: "Explore WDS", href: workforceMail("WDDAM WDS pathway — " + sectorName, "Hello,\n\nI would like to learn more about the WDDAM™ WDS pathway related to " + sectorName + ". Please share the approved next step.\n\nThank you.") },
      { role: "Institutions", title: "Organizations and institutions", text: "Discuss a sector-specific Team, cohort or broader workforce requirement through the institutional intake.", label: "Open cohort intake", href: data.routes.organization }
    ];
    var grid = element("div", "gwix-entry-grid reveal");
    cards.forEach(function (item) {
      var card = element("article", "gwix-entry-card");
      card.append(element("div", "gwix-entry-card__role", item.role));
      card.append(element("h3", "", item.title));
      card.append(element("p", "", item.text));
      var link = element("a", "btn btn-primary", item.label);
      link.href = item.href;
      card.append(link);
      grid.append(card);
    });
    container.append(grid);
  }

  function renderSector() {
    var slug = document.body.getAttribute("data-sector");
    var sector = data.sectors[slug];
    var mount = document.getElementById("sector-content");
    var hero = document.querySelector(".gwix-hero");
    if (!sector || !mount || !hero) return;

    document.title = sector.name + " Cohort 01 | WDDAM™ — BTH Education Group";
    var description = document.querySelector('meta[name="description"]');
    if (description) description.content = sector.proposition;
    var badge = hero.querySelector("[data-sector-kicker]");
    var tagline = hero.querySelector("[data-sector-tagline]");
    var summary = hero.querySelector("[data-sector-summary]");
    if (badge) badge.textContent = sector.name + " · Cohort 01";
    if (tagline) setHeroTitle(tagline, sector.heroTitle);
    if (summary) summary.textContent = sector.campaignLead;
    var interest = hero.querySelector("[data-sector-interest]");
    if (interest) interest.href = interestMail(sector.name);

    var overview = section("overview", "light");
    overview.container.append(header("The sector architecture", sector.focusTitle, sector.fitStatement));
    var grid = element("div", "gwix-pathway-grid reveal");
    sector.teams.forEach(function (team, index) {
      var card = element("a", "gwix-pathway");
      card.href = "?team=" + (index + 1) + "#teams";
      card.append(element("h4", "", "Team 0" + (index + 1) + " · " + team.name));
      card.append(element("p", "", team.scope));
      grid.append(card);
    });
    overview.container.append(grid);

    var teams = section("teams", "dark");
    teams.container.append(header(sector.name + " · Five-Team architecture", sector.teamHeading, sector.teamIntro));
    var explorerMount = element("div", "explorer reveal");
    explorerMount.id = "explorer-mount";
    explorerMount.dataset.accent = sector.accent;
    teams.container.append(explorerMount);
    teams.container.append(element("p", "camp-source", "Source: " + sector.source));

    var pathways = section("pathways", "white");
    pathways.container.append(header("Choose the right next step", "Take the next step.", "Start by expressing interest. The campaign contact is not a formal application, offer of employment or guarantee of acceptance.", true));
    addPathways(pathways.container, sector.name);

    mount.replaceChildren(overview.node, teams.node, pathways.node);
    mount.querySelectorAll(".reveal").forEach(function (node) {
      node.classList.add("visible");
    });
  }

  function renderHub() {
    var grid = document.getElementById("sector-grid");
    if (!grid) return;
    SLUGS.forEach(function (slug, index) {
      var sector = data.sectors[slug];
      var card = element("article", "gwix-entry-card");
      card.append(element("div", "gwix-entry-card__role", "Sector 0" + (index + 1) + " · 5 Teams"));
      card.append(element("h3", "", sector.name));
      card.append(element("p", "", sector.campaignLead));
      var link = element("a", "btn btn-primary", "Find your pathway");
      link.href = slug + "/";
      card.append(link);
      grid.append(card);
    });
    grid.querySelectorAll(".gwix-entry-card").forEach(function (node) {
      node.classList.add("visible");
    });
  }

  renderHub();
  renderSector();
}());
