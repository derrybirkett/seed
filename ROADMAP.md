# Seed - Roadmap

## Vision

Seed becomes the standard way to bootstrap governed projects, eliminating the "translation tax" between human intent and agentic development.

---

## v0.1.0 - MVP (Current) [Target: Week 1]

**Goal**: Prove LLM can parse intent and generate pip governance

### Features
- [x] Project structure
- [ ] CLI with `seed init` command
- [ ] Basic LLM parsing (Anthropic Claude)
- [ ] pip mission.md generation
- [ ] pip roadmap generation
- [ ] pip activity-log initialization
- [ ] Interactive prompt mode
- [ ] Express flag mode (--story, --vision, --metric)

### Success Criteria
- User runs `seed init`, answers prompts
- LLM generates mission.md with ≥80% approval rate
- Roadmap has ≥3 suggested features
- Time to complete: <5 minutes

---

## v0.2.0 - Hatch Integration [Target: Week 2-3]

**Goal**: Automatically generate code via hatch

### Features
- [ ] Programmatic hatch execution (execa)
- [ ] Feature extraction from metrics
- [ ] hatch story synthesis from parsed intent
- [ ] Alignment validation (feature-to-metric mapping)
- [ ] Error handling (hatch not installed)
- [ ] Skip hatch mode (--no-hatch flag)

### Success Criteria
- User runs `seed init`, gets pip + hatch in one flow
- All features in roadmap map to ≥1 metric
- hatch apps/ directory created successfully
- Alignment score ≥90%

---

## v0.3.0 - Intelligence Layer [Target: Week 4-5]

**Goal**: Smarter LLM reasoning and validation

### Features
- [ ] Multi-step LLM reasoning (chain-of-thought)
- [ ] Ambiguity detection ("intent too vague")
- [ ] Clarifying questions (iterative refinement)
- [ ] Preview before generation (with edit option)
- [ ] Suggested features with rationale
- [ ] Metric feasibility validation
- [ ] Feature prioritization (P0/P1/P2 logic)

### Success Criteria
- Ambiguous intents are caught and refined
- Users can edit parsed intent before generation
- Feature suggestions have clear metric alignment
- 90% of users approve on first preview

---

## v0.4.0 - Continuous Alignment [Target: Week 6-7]

**Goal**: Detect and restore alignment over time

### Features
- [ ] `seed check` - scan codebase for drift
- [ ] Metric instrumentation detection
- [ ] Feature completeness scoring
- [ ] `seed update` - re-align mission or code
- [ ] Suggested code changes to meet metrics
- [ ] Activity log auto-update on alignment fixes

### Success Criteria
- Detects when metrics have no instrumentation
- Detects when features don't map to metrics
- Suggests concrete actions to restore alignment
- `seed update` can regenerate mission or code

---

## v0.5.0 - Multi-Provider Support [Target: Week 8-9]

**Goal**: Support OpenAI and local models

### Features
- [ ] OpenAI GPT integration
- [ ] Ollama local model support
- [ ] Provider auto-detection (based on API keys)
- [ ] Cost estimation per provider
- [ ] Response caching (reduce API calls)
- [ ] Offline mode (cached responses only)

### Success Criteria
- Works with Anthropic, OpenAI, Ollama
- Users can switch providers with --provider flag
- Cached responses work offline
- Cost breakdown shown after generation

---

## v1.0.0 - Production Ready [Target: Week 10-12]

**Goal**: Stable, documented, production-grade

### Features
- [ ] Config file mode (seed.config.json)
- [ ] Template customization (override pip/hatch)
- [ ] Comprehensive documentation
- [ ] Example projects repository
- [ ] Video tutorials
- [ ] NPM package published
- [ ] CI/CD with GitHub Actions
- [ ] Unit + integration tests (>80% coverage)
- [ ] Error tracking (Sentry)
- [ ] Usage analytics (opt-in)

### Success Criteria
- Published to NPM
- Documentation complete
- 50+ GitHub stars
- 10+ successful user deployments
- <5% error rate in production

---

## Future (v1.1.0+)

### Visual Designer
- Web UI for intent input
- Drag-drop feature prioritization
- Real-time LLM preview
- Export to seed CLI config

### AI Pair Programming
- Continuous seed assistance during development
- Auto-suggest features based on code changes
- Proactive alignment warnings
- Metric tracking code generation

### Enterprise Features
- Team collaboration (shared missions)
- Multi-project alignment (monorepo)
- Custom LLM fine-tuning
- On-premise deployment

### Ecosystem
- Seed marketplace (share intents)
- Community templates
- Plugin system
- Integration with Linear, Jira, etc.

---

## Success Metrics (Overall)

### Adoption
- 1,000 NPM downloads in first 3 months
- 50% of hatch users try seed within 6 months
- 100+ GitHub stars by v1.0.0

### Usage
- Average setup time: <5 minutes
- Mission approval rate: >80% on first attempt
- Alignment score: >90% after generation
- User retention: >60% create second project

### Quality
- Test coverage: >80%
- Production error rate: <5%
- Documentation completeness: 100%
- User satisfaction (NPS): >50

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM hallucinations | High | Human review step, validation prompts |
| API costs | Medium | Caching, cheaper models for simple parsing |
| hatch breaking changes | High | Version pinning, compatibility tests |
| User adoption | High | Clear value prop, video demos, examples |
| Complexity creep | Medium | Stay focused on core workflow, defer nice-to-haves |

---

## Dependencies

- **pip**: Governance templates and patterns
- **hatch**: Code generation engine
- **Anthropic/OpenAI**: LLM intelligence
- **Node.js ecosystem**: CLI tooling

---

## Next Steps

1. **Week 1**: Complete v0.1.0 MVP
2. **Week 2**: User testing with 5+ beta users
3. **Week 3**: Iterate based on feedback
4. **Week 4**: Begin v0.2.0 hatch integration
5. **Week 12**: Launch v1.0.0 publicly

**First milestone**: v0.1.0 MVP working end-to-end by end of Week 1.
