# History cleanup and repo protection

Everything here is **manual and coordinated**. Nothing in this document has been
run. The force-push rewrites every commit SHA on the repo, so Mayank must have
pushed his work and be ready to re-clone before you start.

---

## 1. What is being removed, and why

| Path | Size in history | Why |
|---|---|---|
| `ananta-site/.next/` | ~43 MB | Build output. Two webpack cache packs alone are 22.1 MB and 21.1 MB. |
| `ananta-site/.next/prerender-manifest.json` | — | **Contains three secrets.** See below. |
| `ananta-site/.env.local` | 7 lines | Env file in a public repo. Placeholder values only — nothing to rotate. |
| `ananta-site/tsconfig.tsbuildinfo` | 1 line | Per-machine TypeScript state, added in `a8ad233`. |

### The secrets

`ananta-site/.next/prerender-manifest.json`, present in `f9e6c86` and `fd7718a`,
contains Next.js **preview-mode** keys:

```
previewModeId             32 hex chars
previewModeSigningKey     64 hex chars
previewModeEncryptionKey  64 hex chars
```

These sign and encrypt the Next draft-mode cookie. Next regenerates them on
every build, this pair came from a local dev build, and the site has no
draft-mode content — so the practical risk is low. But they are live secret
material in a public repository, which makes the purge **mandatory rather than
optional**. Nothing needs rotating: the keys are replaced the next time
`next build` runs.

`.env.local` held only placeholders (`YOUR_PROJECT`, `YOUR_SUPABASE_ANON_KEY`,
`admin@example.com`, `REPLACE_WITH_REAL_FORM`). **No Supabase credential was
ever committed** — verified by scanning every blob in the object graph.

---

## 2. Sequence

Do these in order. Steps 1–2 are yours, step 3 is Mayank's, step 4 is yours again.

### Step 0 — before you start

- [ ] Mayank has pushed everything he cares about to `origin`.
- [ ] Mayank has stopped committing and is at his keyboard.
- [ ] `design/site-redesign` is pushed and its PR is open (it gets rewritten too).
- [ ] Branch protection on `main` is **off** for now — a protected branch refuses
      a force-push. You turn it on in step 4.

### Step 1 — install git-filter-repo

```bash
brew install git-filter-repo
```

Do not use `git filter-branch`. It is slow, leaves replace-refs behind, and the
git docs themselves recommend against it.

### Step 2 — rewrite, in a throwaway clone

Work in a fresh mirror so your real checkout is never left in a half-rewritten
state. `--mirror` brings every branch and tag, so `main` and
`design/site-redesign` are rewritten consistently and keep their relationship.

```bash
cd ~/Downloads/code
git clone --mirror https://github.com/aryavsparihar/project-ananta.git ananta-purge.git
cd ananta-purge.git
```

Rewrite:

```bash
git filter-repo --invert-paths \
  --path ananta-site/.next \
  --path ananta-site/.env.local \
  --path ananta-site/tsconfig.tsbuildinfo
```

Verify before pushing anything — all four must print nothing:

```bash
git log --all --oneline -- ananta-site/.next          # expect empty
git log --all --oneline -- ananta-site/.env.local     # expect empty
git log --all --oneline -- ananta-site/tsconfig.tsbuildinfo  # expect empty
git grep -I previewModeSigningKey $(git rev-list --all) -- 2>/dev/null  # expect empty
```

Confirm the repo actually shrank:

```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
du -sh .                      # was ~47 MB, expect well under 2 MB
git log --all --oneline       # commits still there, new SHAs
```

If any check prints something, **stop** and do not push.

Then publish the rewrite:

```bash
git remote set-url origin https://github.com/aryavsparihar/project-ananta.git
git push --force --mirror origin
```

> `--mirror` force-pushes every ref. That is intended here. It is also why
> branch protection has to be off and why Mayank must re-clone.

### Step 3 — what Mayank runs

His old clone shares no history with the rewritten repo, so a `git pull` will
not work and must not be attempted. He has two options.

**If he has no uncommitted work** — simplest, just start clean:

```bash
cd ~/path/to/parent-folder
mv project-ananta project-ananta-old      # keep it until he has checked
git clone https://github.com/aryavsparihar/project-ananta.git
cd project-ananta/ananta-site
cp .env.example .env.local                # then paste the real values back in
npm install
```

His `.env.local` is gitignored, so it only exists on his machine — he must copy
it across from `project-ananta-old/ananta-site/.env.local` before deleting
anything.

**If he has uncommitted work he wants to keep** — save it as a patch first:

```bash
# in the OLD clone
cd ~/path/to/project-ananta-old
git stash list                            # check nothing is hiding in a stash
git diff > ~/mayank-wip.patch             # unstaged
git diff --cached > ~/mayank-staged.patch # staged
git log origin/main..HEAD --oneline       # any unpushed commits?
```

If there are unpushed commits, export them too:

```bash
git format-patch origin/main --stdout > ~/mayank-commits.patch
```

Then clone fresh as above and replay:

```bash
cd ~/path/to/project-ananta
git checkout -b feat/supabase-restore
git apply ~/mayank-wip.patch              # or: git am < ~/mayank-commits.patch
```

Only delete `project-ananta-old` once he has confirmed the new clone builds and
his work is back.

### Step 4 — turn protection back on

Do this immediately after the force-push succeeds, in the same sitting. See
section 3.

---

## 3. GitHub settings

### Branch protection on `main`

**Settings → Branches → Add branch ruleset** (or classic *Add rule*), targeting `main`:

| Setting | Value |
|---|---|
| Require a pull request before merging | **on** |
| → Required approvals | **1** |
| → Dismiss stale approvals when new commits are pushed | **on** |
| → Require review from Code Owners | **on** (makes `.github/CODEOWNERS` binding) |
| Require status checks to pass before merging | **on** |
| → Require branches to be up to date before merging | **on** |
| → Required checks | `lint · typecheck · build`, `gitleaks (full history)` |
| Require conversation resolution before merging | **on** |
| Require linear history | **on** |
| **Allow force pushes** | **off** |
| **Allow deletions** | **off** |
| Do not allow bypassing the above settings | **on** |

> The two status checks only appear in the picker after CI has run at least
> once. Open the redesign PR first, let CI run, then add them.

> "Do not allow bypassing" applies the rules to admins too — including you.
> That is the point, but it means the next force-push needs the rule switched
> off again first.

With two people and `Require a pull request` on, neither of you can push
straight to `main`, and each needs the other's approval on files the other owns.

### Secret scanning and push protection

**Settings → Code security** (on older UI: *Code security and analysis*):

| Setting | Action |
|---|---|
| Secret scanning | **Enable** |
| Push protection | **Enable** |
| Secret scanning → *Scan for non-provider patterns* | Enable (catches generic high-entropy strings) |
| Dependabot alerts | **Enable** |
| Dependabot security updates | **Enable** |

All free on public repositories.

**Push protection is the one that matters**: it rejects the push itself when a
recognised credential is in the diff, so a key never reaches GitHub. The
pre-commit hook catches it one step earlier, and CI catches it one step later.

After enabling, check **Security → Secret scanning alerts**. It scans existing
history, so it may surface the preview-mode keys. Once the purge has been
force-pushed, close any alert as *Revoked* — the keys are regenerated by every
build and nothing deployed uses them.

### Also worth setting

- **Settings → General → Pull Requests**: untick *Allow merge commits*, tick
  *Allow squash merging*. With linear history required, squash is the one that
  works. Tick *Automatically delete head branches*.
- **Settings → Actions → General → Workflow permissions**: *Read repository
  contents permission*. The CI workflow already declares `contents: read`.

---

## 4. After the rewrite

Everyone, once, per clone — makes `git blame` skip the format commit:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

Install the local secret hook (optional but recommended):

```bash
brew install gitleaks
cd ananta-site && npm install     # sets up the pre-commit hook
```

Check the hook is live:

```bash
cat .git/hooks/pre-commit         # should reference ananta-site/scripts/pre-commit.sh
```

### If something goes wrong

The mirror clone is disposable, and until step 2's `git push --force --mirror`
runs, GitHub still holds the original. If a push lands badly, the old SHAs stay
recoverable for ~90 days through the GitHub API:

```bash
gh api repos/aryavsparihar/project-ananta/events --paginate | grep -o '"sha":"[a-f0-9]*"' | sort -u
```

Keep `ananta-purge.git` and Mayank's `project-ananta-old` until the new history
has been verified by both of you.
