# Maintaining the Blog

Notes for the people who review PRs and keep the site running. For writing posts, see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Who owns what

- The [`@Cohere-Labs-Community/blog-owners`](https://github.com/orgs/Cohere-Labs-Community/teams/blog-owners) team owns the repository. Team maintainers can add or remove members from the team page.
- `.github/CODEOWNERS` assigns every file to that team, so each PR automatically requests a review from it.
- No personal tokens or repository secrets are needed. Every workflow uses the built-in `GITHUB_TOKEN`.

## How publishing works

1. A PR is merged into `main`.
2. **Deploy site** (`.github/workflows/deploy.yml`) builds the site with Jekyll and pushes `_site/` to the `gh-pages` branch.
3. GitHub Pages serves `gh-pages` at <https://cohere-labs-community.github.io/blog/> (the **pages-build-deployment** run).
4. **Check for broken links on site** rebuilds the site and checks internal links once the deploy finishes.

A deploy takes about two minutes. To redeploy without a new commit, go to **Actions → Deploy site → Run workflow** on `main`.

**Future-dated posts:** production builds skip posts whose `date` is in the future. Such a post only appears after a deploy that runs on or after its date. If a merged post is missing, check its `date`, then run **Deploy site** manually once that date has passed.

## Reviewing PRs

`main` is protected by the **main push** ruleset (Settings → Rules). A PR needs:

- 1 approving review from `blog-owners` (code owner review)
- all review threads resolved

Members of `blog-owners` can bypass the ruleset. Use that only to unblock urgent fixes.

Checks that run on PRs:

| Check                   | What it does                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Prettier code formatter | Fails if files aren't formatted. Download the HTML diff artifact to see the changes. |
| Check for broken links  | Builds the PR and checks internal links and asset paths.                             |
| Deploy site / pr-build  | Builds a preview (same-repo branches only).                                          |
| PR preview fork         | Builds a preview for fork PRs after approval (see below).                            |

## PR previews

- **Branches in this repository:** previews deploy automatically to `https://cohere-labs-community.github.io/blog/pr-preview/pr-<number>/`, and a bot comments the link on the PR.
- **Forks:** the **PR preview fork** run waits for approval in the `fork-pr-preview` environment, because it runs the fork's code (Jekyll plugins can run arbitrary Ruby). A `blog-owners` member should read the diff first, especially `_plugins/`, `Gemfile`, and any `.github/` changes. Then open the run and choose **Review deployments → Approve**.
- When a PR is closed or merged, **Cleanup PR preview** deletes its preview folder.

A preview run left waiting is harmless. Cancel it from the Actions tab if the PR is no longer active.

## When something breaks

Start from the failed run in the Actions tab and open the failing step's log.

- **Ruby setup fails** (`Unavailable version ... for ruby`): GitHub updated the `ubuntu-latest` runner image. Workflows ask for the `3.3` series so they pick up whichever patch release is available. If 3.3 itself is dropped, raise the version in every `ruby-version:` entry under `.github/workflows/`.
- **Prettier fails on files you didn't touch:** someone formatted with a different Prettier version. Run `npm ci`, then `npx prettier . --write`, and commit the result. Prettier is pinned to an exact version in `package.json` / `package-lock.json`. To upgrade it, run `npm install --save-dev --save-exact prettier@<version>` and reformat the repository in the same PR.
- **Broken link check fails:** the log lists each broken link and the page it's on. Usually it's a wrong image path or a typo in a link to another post.
- **Deploy succeeded but the site didn't change:** check the **pages-build-deployment** run, the post's `date` (see above), and your browser cache.

To reproduce a build locally:

```bash
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

## Settings outside the repository files

These live in GitHub settings, not in git:

- **Rules → main push:** PR and review requirements for `main`; bypass list.
- **Environments → fork-pr-preview:** required reviewers (the `blog-owners` team).
- **Pages:** deploy from the `gh-pages` branch, root folder.
- **Collaborators and teams:** `blog-owners` has write access, which `CODEOWNERS` requires.
- **General:** branches are deleted automatically after merge.
