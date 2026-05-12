# Seed — Tombstone

`seed` has been retired as an intent-parsing CLI. The idea it was solving for — bridging human intent and project scaffolding — is preserved in [idea](https://github.com/derrybirkett/idea) as templates humans fill in directly, and in [stack](https://github.com/derrybirkett/stack) as starter templates. The LLM parser and generator code are not preserved.

## Where Each Piece Went

| Was in seed | Now lives in | Notes |
|---|---|---|
| Intent capture (users, problems, solutions, metrics) | [idea/templates/intent.md](https://github.com/derrybirkett/idea) | Template — human-filled rather than LLM-parsed |
| Mission + vision + north star | [idea/templates/mission.md](https://github.com/derrybirkett/idea) | Same structure, no generator required |
| User story format | [idea/templates/user-story.md](https://github.com/derrybirkett/idea) | Direct template |
| Product surfaces map | [idea/templates/product-surfaces.md](https://github.com/derrybirkett/idea) | Direct template |
| Nx monorepo + auth + API scaffolding | [stack/templates/](https://github.com/derrybirkett/stack) | Static starters — lite (Supabase) and full (custom JWT) |

## Why Seed Was Retired

Seed tried to automate the 30-minute translation from intent to scaffolding. The automation was solving the wrong problem: the translation is not slow because it's hard to type — it's slow because intent is still unclear at that point. A parser can't clarify what you haven't decided yet.

Bloom's content-first principle: templates that humans fill in at their own pace outlast generators that fill templates at the machine's pace.

## What Was Not Worth Salvaging

The LLM intent parser (`src/parsers/`), the pip/hatch orchestration layer (`src/generators/`), the validation layer (`src/validators/`), and the CLI entry point (`src/index.ts`). These were tightly coupled to the retired pip + hatch combination.

## Final Version

`seed` v0.2.0, released March 2026.

## Recovery

This repository remains accessible at [github.com/derrybirkett/seed](https://github.com/derrybirkett/seed) for archeological reference. It receives no further updates. Intent capture now happens via [idea](https://github.com/derrybirkett/idea) templates.
