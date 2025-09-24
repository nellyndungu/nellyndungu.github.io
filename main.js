// Auto-fetch GitHub Pages projects
const username = "nellyndungu"; 
const projectsList = document.querySelector(".project-list");
const projectsCountElem = document.getElementById("projects-count");

fetch(`https://api.github.com/users/${username}/repos`)
  .then(res => res.json())
  .then(repos => {
    const pagesRepos = repos.filter(r => r.has_pages && !r.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      projectsCountElem.textContent = pagesRepos.length;
    
    // Latest Project
      if (pagesRepos.length > 0) {
  const latest = pagesRepos[0]; // Already sorted by updated date
  let overview = latest.description || "No description provided.";

  const latestCard = document.querySelector(".latest-project");
  if (latestCard) {
    latestCard.innerHTML = `
      <strong><a href="https://${username}.github.io/${latest.name}/">${latest.name}</a></strong><br>
      ${overview}
    `;
  }
}

    // ===== Latest Blog for Landing Page =====
const latestBlogCard = document.getElementById("latest-blog-card");

fetch('blogs.json')
  .then(res => res.json())
  .then(blogs => {
    if (!blogs || blogs.length === 0) {
      latestBlogCard.innerHTML = "<p>No blogs found.</p>";
      return;
    }

    // Sort by date descending and pick the first one
    const latest = blogs.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    const url = `blog-post.html?repo=${latest.repo}&file=${encodeURIComponent(latest.file)}`;

    latestBlogCard.innerHTML = `
      <h4><a href="${url}">${latest.title}</a></h4>
      <p>${latest.description}</p>
      <small>By ${latest.author} · ${new Date(latest.date).toLocaleDateString()}</small>
    `;
  })
  .catch(err => {
    latestBlogCard.innerHTML = "<p>Error loading latest blog.</p>";
    console.error(err);
  });




    if (pagesRepos.length === 0) {
      projectsList.innerHTML = "<li>No GitHub Pages projects found.</li>";
    } else {
      pagesRepos.forEach(r => {

        const li = document.createElement("li");
        const updated = new Date(r.updated_at).toLocaleDateString();

        li.innerHTML = `
          <a href="https://${username}.github.io/${r.name}/" target="_blank">
            ${r.name}
          </a>
          ${r.description ? `<p>${r.description}</p>` : ""}
          <p><small>Last updated: ${updated}</small></p>
        `;
        projectsList.appendChild(li);
      });
    }
  })
  .catch(err => {
    projectsList.innerHTML = "<li>Error loading projects.</li>";
    console.error("Error fetching repos:", err);
  });
