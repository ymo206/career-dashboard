
# CLAUDE.md

## Project Overview

Career Dashboard is my TCSS 490 Artifact 5 Moonshot project.

The goal is to expand my original Internship Application Tracker
into a larger application that students can use to organize
their internship and job searches.

This is a five-week project with a final demonstration
on December 7, 2026, and final submission on
December 13, 2026.

## Developer

Yusuf Mohamoud

Computer Science student at the University of Washington Tacoma.

## Project Goals

Build an application that allows students to:

1. Track internship and job applications.
2. Organize applications by status.
3. View application statistics.
4. Manage upcoming interviews.
5. Organize resumes.
6. Save their information between sessions.

User accounts and database integration are stretch goals.

## Technology Stack

Start with:

- HTML
- CSS
- JavaScript
- Git and GitHub
- Browser localStorage

Possible additions:

- Chart.js for analytics
- Supabase for authentication and database storage

Do not add a new framework or external dependency
without documenting why it is necessary.

## Development Guidelines

### General

- Keep the application organized and maintainable.
- Use clear variable and function names.
- Avoid unnecessary complexity.
- Make changes in manageable steps.
- Test existing features after adding new ones.
- Do not remove working features without explaining why.
- Keep the interface consistent across pages.
- Support desktop and mobile screen sizes.

### HTML

- Use semantic HTML elements.
- Give form inputs meaningful labels.
- Use accessible buttons and navigation.
- Keep the page structure organized.

### CSS

- Maintain a consistent dark navy design.
- Use blue accents for important actions.
- Keep spacing and typography consistent.
- Make layouts responsive.
- Avoid excessive animations.

### JavaScript

- Use modern JavaScript.
- Keep functions focused on specific tasks.
- Validate user inputs.
- Handle missing or invalid stored data.
- Avoid duplicating application logic.
- Keep application data consistent after edits.

### Data Management

Initially use localStorage to save application data.

Each application should have a unique ID.

Suggested application fields:

- id
- company
- position
- location
- status
- applicationDate
- deadline
- jobUrl
- notes
- createdAt
- updatedAt

Use consistent status values throughout the application:

- Saved
- Applied
- Interviewing
- Offer
- Rejected

When changing the data structure, preserve existing
saved applications whenever possible.

## Planned Features

### Application Management

Users should be able to add, edit, and delete
applications.

Include search and filtering by company,
position, and application status.

### Application Board

Display applications in columns according to
their current status.

Allow users to move applications between statuses.

### Analytics

Show total applications and counts by status.

Add charts for application activity and progress
when the basic dashboard is working.

### Interview Management

Allow users to record interview details and
view upcoming interviews.

### Resume Management

Allow users to organize resume information.

File uploads may require additional storage
services and should be treated separately
from basic localStorage data.

### User Accounts

Authentication and database integration
are optional stretch goals.

Do not claim these features are complete
until they have been implemented and tested.

## Testing Requirements

After each major change:

1. Open the application.
2. Add a test application.
3. Edit the application.
4. Change its status.
5. Delete the application.
6. Refresh the page to check saved data.
7. Test navigation and buttons.
8. Check the layout on a smaller screen.
9. Check the browser console for errors.

If a feature fails, identify the problem
before making unrelated changes.

## Repository Structure

Planned structure:

career-dashboard/
  index.html
  style.css
  script.js
  README.md
  PROJECT-PLAN.md
  CLAUDE.md
  DEVELOPMENT-LOG.md
  assets/

Additional folders may be created as the
project becomes larger.

Keep filenames and links consistent.

## Development Workflow

Before starting a coding session:

1. Read PROJECT-PLAN.md.
2. Review DEVELOPMENT-LOG.md.
3. Identify the next task.
4. Inspect the relevant files.
5. Plan changes before editing.

During development:

1. Make focused changes.
2. Test affected features.
3. Fix issues before moving on.
4. Commit meaningful progress to GitHub.

After each session:

1. Summarize the work completed.
2. Document problems encountered.
3. Record what was tested.
4. Identify the next task.
5. Update DEVELOPMENT-LOG.md.

## Working With Claude Code

Claude Code may help with:

- Planning features
- Writing and organizing code
- Reviewing existing files
- Identifying bugs
- Generating tests
- Explaining unfamiliar tools

The developer should review changes,
test the application, and approve
commits before deployment.

Do not assume a generated feature works
without testing it.

## Documentation

Keep README.md updated with:

- Project description
- Features completed
- Technologies used
- Setup instructions
- Deployment link
- Known limitations

Keep DEVELOPMENT-LOG.md updated with
actual development sessions.

Do not invent work sessions, completed
features, testing results, or user feedback.

## TCSS 490 Requirements

This project is Artifact 5: Moonshot.

The project should demonstrate a genuine
five-week effort toward building something
larger than previous coursework projects.

Requirements include:

- Project planning and scaffolding
- Organized repository
- CLAUDE.md
- Development log
- Regular progress updates
- Deployment when usable
- Final demonstration
- Artifact 5 portfolio card
- Final portfolio submission

Final show and tell: December 7, 2026.

Final submission: December 13, 2026.

## Important

The original Internship Tracker is a
separate Artifact 4 project.

Do not overwrite or modify the original
project repository.

The TCSS 490 portfolio is also a
separate repository.

Only update the TCSS 490 portfolio
when adding or revising the
Artifact 5 project card.
