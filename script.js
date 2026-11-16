
"use strict";

/*
  Career Dashboard
  TCSS 490 Artifact 5
  Yusuf Mohamoud

  Application management, interviews, analytics,
  resume organization, and browser storage.
*/

// ==========================================
// STORAGE AND APPLICATION STATE
// ==========================================

const STORAGE_KEYS = {
  applications: "careerDashboard_applications_v2",
  interviews: "careerDashboard_interviews_v2",
  resumes: "careerDashboard_resumes_v2"
};

const STATUSES = [
  "Saved",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected"
];

const PAGE_TITLES = {
  overview: "Overview",
  applications: "Applications",
  board: "Application Board",
  interviews: "Interviews",
  analytics: "Analytics",
  resumes: "Resumes"
};

function loadData(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn("Could not load saved data:", error);
    return [];
  }
}

let applications = loadData(STORAGE_KEYS.applications);
let interviews = loadData(STORAGE_KEYS.interviews);
let resumes = loadData(STORAGE_KEYS.resumes);

function saveData() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.applications,
      JSON.stringify(applications)
    );

    localStorage.setItem(
      STORAGE_KEYS.interviews,
      JSON.stringify(interviews)
    );

    localStorage.setItem(
      STORAGE_KEYS.resumes,
      JSON.stringify(resumes)
    );

    return true;
  } catch (error) {
    console.error("Saving failed:", error);
    showToast("Unable to save. Check browser storage.", true);
    return false;
  }
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString(36) +
    Math.random().toString(36).slice(2);
}

function byId(id) {
  return document.getElementById(id);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = String(text);
  }

  return element;
}

function formatDate(dateString) {
  if (!dateString) return "Not set";

  const date = new Date(dateString + "T12:00:00");

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function showToast(message, isError = false) {
  const toast = byId("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.background = isError ? "#582d39" : "#173e37";
  toast.style.borderColor = isError ? "#a14c61" : "#337763";
  toast.hidden = false;

  clearTimeout(showToast.timeoutId);

  showToast.timeoutId = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

function makeButton(text, className, handler) {
  const button = createElement("button", className, text);
  button.type = "button";
  button.addEventListener("click", handler);
  return button;
}

function emptyMessage(title, description) {
  const container = createElement("div", "empty-state");
  const heading = createElement("h4", "", title);
  const paragraph = createElement("p", "", description);

  container.append(heading, paragraph);
  return container;
}

// ==========================================
// NAVIGATION
// ==========================================

function closeSidebar() {
  const sidebar = byId("sidebar");
  const backdrop = byId("sidebar-backdrop");
  const menuButton = byId("mobile-menu-btn");

  sidebar.classList.remove("open");
  backdrop.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
}

function navigateTo(pageName) {
  if (!PAGE_TITLES[pageName]) return;

  document.querySelectorAll(".page").forEach(page => {
    const isActive = page.id === `page-${pageName}`;

    page.hidden = !isActive;
    page.classList.toggle("active", isActive);
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    const isActive = button.dataset.page === pageName;

    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  byId("current-page-title").textContent =
    PAGE_TITLES[pageName];

  closeSidebar();
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    navigateTo(button.dataset.page);
  });
});

document.querySelectorAll("[data-navigate]").forEach(button => {
  button.addEventListener("click", () => {
    navigateTo(button.dataset.navigate);
  });
});

byId("mobile-menu-btn").addEventListener("click", () => {
  const sidebar = byId("sidebar");
  const backdrop = byId("sidebar-backdrop");

  const isOpen = sidebar.classList.toggle("open");

  backdrop.hidden = !isOpen;

  byId("mobile-menu-btn").setAttribute(
    "aria-expanded",
    String(isOpen)
  );
});

byId("sidebar-backdrop").addEventListener(
  "click",
  closeSidebar
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeSidebar();
  }
});

// ==========================================
// MODAL MANAGEMENT
// ==========================================

let lastFocusedElement = null;

function openModal(modalId) {
  const modal = byId(modalId);
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const firstInput = modal.querySelector(
    "input:not([type='hidden']), select, textarea"
  );

  if (firstInput) {
    firstInput.focus();
  }
}

function closeModal(modalId) {
  const modal = byId(modalId);
  if (!modal) return;

  modal.hidden = true;

  if (!document.querySelector(".modal-overlay:not([hidden])")) {
    document.body.style.overflow = "";
  }

  if (lastFocusedElement &&
      typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

const modalNames = [
  "application",
  "interview",
  "resume"
];

modalNames.forEach(name => {
  const modalId = `${name}-modal`;

  byId(`close-${name}-modal`).addEventListener(
    "click",
    () => closeModal(modalId)
  );

  byId(`cancel-${name}`).addEventListener(
    "click",
    () => closeModal(modalId)
  );

  byId(modalId).addEventListener("click", event => {
    if (event.target === byId(modalId)) {
      closeModal(modalId);
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  const openDialog = document.querySelector(
    ".modal-overlay:not([hidden])"
  );

  if (openDialog) {
    closeModal(openDialog.id);
  } else {
    closeSidebar();
  }
});

// ==========================================
// APPLICATION FORM
// ==========================================

function openApplicationForm(application = null) {
  byId("application-form").reset();
  byId("application-id").value = "";

  if (application) {
    byId("application-modal-title").textContent =
      "Edit Application";

    byId("application-id").value = application.id;
    byId("company").value = application.company;
    byId("position").value = application.position;
    byId("location").value = application.location || "";
    byId("status").value = application.status;
    byId("application-date").value =
      application.applicationDate || "";
    byId("deadline").value = application.deadline || "";
    byId("job-url").value = application.jobUrl || "";
    byId("application-notes").value = application.notes || "";
  } else {
    byId("application-modal-title").textContent =
      "Add Application";

    byId("status").value = "Saved";
  }

  openModal("application-modal");
}

[
  "top-add-application",
  "overview-add-btn",
  "applications-add-btn",
  "board-add-btn"
].forEach(id => {
  byId(id).addEventListener("click", () => {
    openApplicationForm();
  });
});

byId("application-form").addEventListener("submit", event => {
  event.preventDefault();

  const id = byId("application-id").value;

  const company = byId("company").value.trim();
  const position = byId("position").value.trim();

  if (!company || !position) {
    showToast("Company and position are required.", true);
    return;
  }

  const now = new Date().toISOString();

  const data = {
    company,
    position,
    location: byId("location").value.trim(),
    status: byId("status").value,
    applicationDate: byId("application-date").value,
    deadline: byId("deadline").value,
    jobUrl: byId("job-url").value.trim(),
    notes: byId("application-notes").value.trim(),
    updatedAt: now
  };

  if (data.jobUrl) {
    try {
      const url = new URL(data.jobUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      showToast("Enter a valid job posting URL.", true);
      return;
    }
  }

  if (id) {
    const index = applications.findIndex(app => app.id === id);

    if (index === -1) {
      showToast("Application could not be found.", true);
      return;
    }

    applications[index] = {
      ...applications[index],
      ...data
    };
  } else {
    applications.unshift({
      id: createId(),
      ...data,
      createdAt: now
    });
  }

  saveData();
  closeModal("application-modal");
  renderAll();

  showToast(
    id ? "Application updated." : "Application added."
  );
});

function editApplication(id) {
  const application = applications.find(app => app.id === id);

  if (application) {
    openApplicationForm(application);
  }
}

function deleteApplication(id) {
  const application = applications.find(app => app.id === id);

  if (!application) return;

  const confirmed = confirm(
    `Delete the application for ${application.company}?`
  );

  if (!confirmed) return;

  applications = applications.filter(app => app.id !== id);

  saveData();
  renderAll();
  showToast("Application deleted.");
}

function updateApplicationStatus(id, status) {
  if (!STATUSES.includes(status)) return;

  const application = applications.find(app => app.id === id);

  if (!application) return;

  application.status = status;
  application.updatedAt = new Date().toISOString();

  saveData();
  renderAll();
  showToast("Application status updated.");
}

// ==========================================
// APPLICATION STATISTICS
// ==========================================

function getStatusCount(status) {
  return applications.filter(
    app => app.status === status
  ).length;
}

function getCounts() {
  return {
    total: applications.length,
    saved: getStatusCount("Saved"),
    applied: getStatusCount("Applied"),
    interviewing: getStatusCount("Interviewing"),
    offer: getStatusCount("Offer"),
    rejected: getStatusCount("Rejected")
  };
}

function renderStatistics() {
  const counts = getCounts();

  byId("stat-total").textContent = counts.total;
  byId("stat-applied").textContent = counts.applied;
  byId("stat-interviewing").textContent =
    counts.interviewing;
  byId("stat-offers").textContent = counts.offer;

  byId("analytics-total").textContent = counts.total;

  // Rates are based on current application statuses.
  // These are not lifetime conversion rates.
  const interviewRate = counts.total
    ? Math.round(
        (counts.interviewing / counts.total) * 100
      )
    : 0;

  const offerRate = counts.total
    ? Math.round((counts.offer / counts.total) * 100)
    : 0;

  byId("analytics-interview-rate").textContent =
    `${interviewRate}%`;

  byId("analytics-offer-rate").textContent =
    `${offerRate}%`;
}

function statusBadge(status) {
  const allowed = STATUSES.includes(status)
    ? status
    : "Saved";

  return createElement(
    "span",
    `status-badge status-${allowed.toLowerCase()}`,
    allowed
  );
}

// ==========================================
// RECENT APPLICATIONS
// ==========================================

function appendEmptyTable(tbody, columns, message) {
  const row = createElement("tr");
  const cell = createElement("td", "empty-table", message);

  cell.colSpan = columns;
  row.appendChild(cell);
  tbody.appendChild(row);
}

function renderRecentApplications() {
  const tbody = byId("recent-applications-body");
  tbody.replaceChildren();

  const recent = [...applications]
    .sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    )
    .slice(0, 5);

  if (!recent.length) {
    appendEmptyTable(
      tbody,
      4,
      "No applications yet. Add your first application."
    );
    return;
  }

  recent.forEach(app => {
    const row = createElement("tr");

    const company = createElement("td", "", app.company);
    const position = createElement("td", "", app.position);
    const status = createElement("td");
    const date = createElement(
      "td",
      "",
      formatDate(app.applicationDate)
    );

    status.appendChild(statusBadge(app.status));

    row.append(company, position, status, date);
    tbody.appendChild(row);
  });
}

// ==========================================
// APPLICATION TABLE
// ==========================================

function getFilteredApplications() {
  const search = byId("application-search")
    .value.trim().toLowerCase();

  const status = byId("status-filter").value;
  const sort = byId("sort-applications").value;

  let result = applications.filter(app => {
    const matchesSearch =
      app.company.toLowerCase().includes(search) ||
      app.position.toLowerCase().includes(search);

    const matchesStatus =
      status === "All" || app.status === status;

    return matchesSearch && matchesStatus;
  });

  result = [...result];

  if (sort === "company") {
    result.sort((a, b) =>
      a.company.localeCompare(b.company)
    );
  } else if (sort === "oldest") {
    result.sort((a, b) =>
      (a.createdAt || "").localeCompare(b.createdAt || "")
    );
  } else {
    result.sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
  }

  return result;
}

function renderApplicationsTable() {
  const tbody = byId("applications-table-body");
  tbody.replaceChildren();

  const filtered = getFilteredApplications();

  byId("application-count").textContent =
    `Showing ${filtered.length} of ${applications.length} applications`;

  if (!filtered.length) {
    appendEmptyTable(
      tbody,
      6,
      "No applications match your search."
    );
    return;
  }

  filtered.forEach(app => {
    const row = createElement("tr");

    const company = createElement("td", "", app.company);
    const position = createElement("td", "", app.position);
    const location = createElement(
      "td",
      "",
      app.location || "Not specified"
    );

    const status = createElement("td");
    status.appendChild(statusBadge(app.status));

    const date = createElement(
      "td",
      "",
      formatDate(app.applicationDate)
    );

    const actions = createElement("td");
    const actionGroup = createElement("div", "table-actions");

    actionGroup.append(
      makeButton("Edit", "", () => editApplication(app.id)),
      makeButton("Delete", "delete", () =>
        deleteApplication(app.id)
      )
    );

    actions.appendChild(actionGroup);

    row.append(
      company,
      position,
      location,
      status,
      date,
      actions
    );

    tbody.appendChild(row);
  });
}

[
  "application-search",
  "status-filter",
  "sort-applications"
].forEach(id => {
  const input = byId(id);

  input.addEventListener(
    id === "application-search" ? "input" : "change",
    renderApplicationsTable
  );
});

// ==========================================
// APPLICATION BOARD
// ==========================================

function renderBoard() {
  STATUSES.forEach(status => {
    const key = status.toLowerCase();

    const list = byId(`board-${key}`);
    const count = byId(`board-count-${key}`);

    list.replaceChildren();

    const matching = applications.filter(
      app => app.status === status
    );

    count.textContent = matching.length;

    if (!matching.length) {
      list.appendChild(
        createElement(
          "p",
          "kanban-empty",
          "No applications"
        )
      );
      return;
    }

    matching.forEach(app => {
      const card = createElement("article", "kanban-card");

      const company = createElement(
        "h4",
        "",
        app.company
      );

      const position = createElement(
        "p",
        "",
        app.position
      );

      const date = createElement(
        "span",
        "card-date",
        formatDate(app.applicationDate)
      );

      const select = createElement("select");
      select.setAttribute(
        "aria-label",
        `Update status for ${app.company}`
      );

      STATUSES.forEach(optionStatus => {
        const option = createElement(
          "option",
          "",
          optionStatus
        );

        option.value = optionStatus;

        if (optionStatus === app.status) {
          option.selected = true;
        }

        select.appendChild(option);
      });

      select.addEventListener("change", event => {
        updateApplicationStatus(
          app.id,
          event.target.value
        );
      });

      const edit = makeButton(
        "Edit Details",
        "text-button",
        () => editApplication(app.id)
      );

      card.append(
        company,
        position,
        date,
        select,
        edit
      );

      list.appendChild(card);
    });
  });
}

// ==========================================
// INTERVIEW MANAGEMENT
// ==========================================

function openInterviewForm(interview = null) {
  byId("interview-form").reset();
  byId("interview-id").value = "";

  if (interview) {
    byId("interview-modal-title").textContent =
      "Edit Interview";

    byId("interview-id").value = interview.id;
    byId("interview-company").value = interview.company;
    byId("interview-position").value =
      interview.position || "";
    byId("interview-date").value = interview.date;
    byId("interview-time").value =
      interview.time || "";
    byId("interview-type").value = interview.type;
    byId("interview-status").value = interview.status;
    byId("interview-notes").value =
      interview.notes || "";
  } else {
    byId("interview-modal-title").textContent =
      "Schedule Interview";
  }

  openModal("interview-modal");
}

byId("add-interview-btn").addEventListener(
  "click",
  () => openInterviewForm()
);

byId("interview-form").addEventListener("submit", event => {
  event.preventDefault();

  const id = byId("interview-id").value;

  const company = byId("interview-company")
    .value.trim();

  const date = byId("interview-date").value;

  if (!company || !date) {
    showToast("Company and interview date are required.", true);
    return;
  }

  const data = {
    company,
    position: byId("interview-position").value.trim(),
    date,
    time: byId("interview-time").value,
    type: byId("interview-type").value,
    status: byId("interview-status").value,
    notes: byId("interview-notes").value.trim()
  };

  if (id) {
    const index = interviews.findIndex(
      interview => interview.id === id
    );

    if (index === -1) return;

    interviews[index] = {
      ...interviews[index],
      ...data
    };
  } else {
    interviews.push({
      id: createId(),
      ...data,
      createdAt: new Date().toISOString()
    });
  }

  saveData();
  closeModal("interview-modal");
  renderAll();

  showToast(id ? "Interview updated." : "Interview scheduled.");
});

function deleteInterview(id) {
  if (!confirm("Delete this interview?")) return;

  interviews = interviews.filter(
    interview => interview.id !== id
  );

  saveData();
  renderAll();
  showToast("Interview deleted.");
}

function createInterviewCard(interview, showActions = true) {
  const card = createElement("article", "interview-card");
  const details = createElement("div");

  const heading = createElement(
    "h4",
    "",
    interview.company
  );

  const position = createElement(
    "p",
    "",
    interview.position || "Interview"
  );

  const date = createElement(
    "p",
    "",
    `${formatDate(interview.date)} ${
      interview.time ? "at " + interview.time : ""
    }`
  );

  const type = createElement(
    "p",
    "",
    `${interview.type} · ${interview.status}`
  );

  details.append(heading, position, date, type);

  if (interview.notes) {
    details.appendChild(
      createElement("p", "", interview.notes)
    );
  }

  card.appendChild(details);

  if (showActions) {
    const actions = createElement("div", "card-actions");

    actions.append(
      makeButton("Edit", "", () =>
        openInterviewForm(interview)
      ),
      makeButton("Delete", "delete", () =>
        deleteInterview(interview.id)
      )
    );

    card.appendChild(actions);
  }

  return card;
}

function renderInterviews() {
  const list = byId("interview-list");
  const overview = byId("overview-interviews");

  list.replaceChildren();
  overview.replaceChildren();

  const sorted = [...interviews].sort((a, b) =>
    `${a.date}T${a.time || "00:00"}`.localeCompare(
      `${b.date}T${b.time || "00:00"}`
    )
  );

  if (!sorted.length) {
    list.appendChild(
      emptyMessage(
        "No interviews yet",
        "Schedule an interview to start."
      )
    );
  } else {
    sorted.forEach(interview => {
      list.appendChild(
        createInterviewCard(interview)
      );
    });
  }

  const upcoming = sorted.filter(interview =>
    interview.status === "Scheduled" &&
    interview.date >= todayString()
  );

  if (!upcoming.length) {
    overview.appendChild(
      emptyMessage(
        "No upcoming interviews",
        "Your scheduled interviews will appear here."
      )
    );
  } else {
    upcoming.slice(0, 3).forEach(interview => {
      overview.appendChild(
        createInterviewCard(interview, false)
      );
    });
  }
}

// ==========================================
// RESUME ORGANIZATION
// ==========================================

function openResumeForm(resume = null) {
  byId("resume-form").reset();
  byId("resume-id").value = "";

  if (resume) {
    byId("resume-modal-title").textContent =
      "Edit Resume";

    byId("resume-id").value = resume.id;
    byId("resume-name").value = resume.name;
    byId("resume-purpose").value =
      resume.purpose || "";
    byId("resume-notes").value =
      resume.notes || "";
  } else {
    byId("resume-modal-title").textContent =
      "Add Resume";
  }

  openModal("resume-modal");
}

byId("add-resume-btn").addEventListener(
  "click",
  () => openResumeForm()
);

byId("resume-form").addEventListener("submit", event => {
  event.preventDefault();

  const id = byId("resume-id").value;
  const name = byId("resume-name").value.trim();

  if (!name) {
    showToast("Resume name is required.", true);
    return;
  }

  const data = {
    name,
    purpose: byId("resume-purpose").value.trim(),
    notes: byId("resume-notes").value.trim()
  };

  if (id) {
    const index = resumes.findIndex(
      resume => resume.id === id
    );

    if (index === -1) return;

    resumes[index] = {
      ...resumes[index],
      ...data
    };
  } else {
    resumes.push({
      id: createId(),
      ...data,
      createdAt: new Date().toISOString()
    });
  }

  saveData();
  closeModal("resume-modal");
  renderAll();

  showToast(
    id ? "Resume information updated." : "Resume added."
  );
});

function deleteResume(id) {
  if (!confirm("Delete this resume entry?")) return;

  resumes = resumes.filter(resume => resume.id !== id);

  saveData();
  renderAll();
  showToast("Resume entry deleted.");
}

function renderResumes() {
  const list = byId("resume-list");
  list.replaceChildren();

  if (!resumes.length) {
    list.appendChild(
      emptyMessage(
        "No resumes added",
        "Add a resume entry to organize your versions."
      )
    );
    return;
  }

  resumes.forEach(resume => {
    const card = createElement("article", "resume-card");
    const details = createElement("div");

    details.append(
      createElement("h4", "", resume.name),
      createElement(
        "p",
        "",
        resume.purpose || "General resume"
      )
    );

    if (resume.notes) {
      details.appendChild(
        createElement("p", "", resume.notes)
      );
    }

    const actions = createElement("div", "card-actions");

    actions.append(
      makeButton("Edit", "", () =>
        openResumeForm(resume)
      ),
      makeButton("Delete", "delete", () =>
        deleteResume(resume.id)
      )
    );

    card.append(details, actions);
    list.appendChild(card);
  });
}

// ==========================================
// ANALYTICS AND CHARTS
// ==========================================

function renderChartRow(container, label, count, total) {
  const row = createElement("div", "chart-row");

  const name = createElement("span", "", label);
  const track = createElement("div", "chart-bar");
  const fill = createElement("div", "chart-bar-fill");

  const percentage = total
    ? (count / total) * 100
    : 0;

  fill.style.width = `${percentage}%`;

  track.appendChild(fill);

  row.append(
    name,
    track,
    createElement("strong", "", count)
  );

  container.appendChild(row);
}

function renderAnalytics() {
  const chart = byId("analytics-status-chart");
  const activity = byId("analytics-activity-chart");
  const statusBars = byId("overview-status-bars");

  chart.replaceChildren();
  activity.replaceChildren();
  statusBars.replaceChildren();

  const total = applications.length;

  STATUSES.forEach(status => {
    const count = getStatusCount(status);

    renderChartRow(chart, status, count, total);

    const row = createElement("div", "status-row");
    const label = createElement("span", "", status);
    const track = createElement("div", "status-track");
    const fill = createElement("div", "status-fill");

    fill.style.width = total
      ? `${(count / total) * 100}%`
      : "0%";

    track.appendChild(fill);

    row.append(
      label,
      track,
      createElement("strong", "", count)
    );

    statusBars.appendChild(row);
  });

  // Show application activity for the last six months.
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0")
    ].join("-");

    months.push({
      key,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      })
    });
  }

  const monthlyCounts = months.map(month => {
    const count = applications.filter(app => {
      const date = app.applicationDate ||
        (app.createdAt || "").slice(0, 10);

      return date.startsWith(month.key);
    }).length;

    return {
      ...month,
      count
    };
  });

  const maxCount = Math.max(
    1,
    ...monthlyCounts.map(month => month.count)
  );

  monthlyCounts.forEach(month => {
    renderChartRow(
      activity,
      month.label,
      month.count,
      maxCount
    );
  });
}

// ==========================================
// EXPORT APPLICATION DATA
// ==========================================

byId("export-applications").addEventListener("click", () => {
  if (!applications.length) {
    showToast("No applications to export.", true);
    return;
  }

  const content = JSON.stringify(applications, null, 2);

  const blob = new Blob([content], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `career-applications-${todayString()}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  showToast("Application data exported.");
});

// ==========================================
// RENDER EVERYTHING
// ==========================================

function renderAll() {
  renderStatistics();
  renderRecentApplications();
  renderApplicationsTable();
  renderBoard();
  renderInterviews();
  renderResumes();
  renderAnalytics();
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

renderAll();

console.log("Career Dashboard initialized.");
