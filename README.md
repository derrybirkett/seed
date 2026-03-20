# Seed

**AI-powered intent bridge for governed project bootstrapping**

Seed translates your product intent into synchronized governance (grove) and execution (hatch) in one intelligent flow.

---

## What is Seed?

Seed is the missing bridge between human intent and agentic development:

- **You provide**: Natural language intent ("As a UX consultant, I want clients to earn money...")
- **Seed parses**: Uses LLM to extract users, problems, solutions, metrics
- **Seed generates**:
  - Agentic layer (grove): mission.md, metrics, agent roles, workflows
  - Technical foundation (hatch): Nx monorepo, auth, API, UI, tests
- **Result**: Aligned project ready for development in <5 minutes

---

## Quick Start

```bash
# Install seed globally
npm install -g seed-cli

# Initialize a new governed project
seed init

# Or use one-liner mode
seed "As a UX consultant, I want clients to earn money, so I provide conversion optimization tools" \
  --vision "10K businesses doubling conversions by 2027" \
  --metric "avg_conversion_improvement:>50%"

# Navigate to generated project
cd conversion-toolkit
pnpm install
pnpm dev

# Your project now has:
# ✓ grove/ - Agentic layer with mission, metrics, patterns
# ✓ apps/ - Working applications (website, dashboard, API)
# ✓ libs/ - Shared libraries (UI, auth, utilities)
# ✓ Full alignment between mission and code
```

---

## Features

### Intelligent Intent Parsing
- Extracts users, problems, solutions from natural language
- Suggests success metrics based on outcomes
- Infers features needed to achieve metrics
- Validates completeness before generation

### Bi-directional Alignment
- grove mission metrics → inform hatch features
- hatch generated code → populate grove roadmap
- Every feature maps to a success metric
- Activity log initialized with bootstrap entry

### Time Savings
- 5 minutes vs 45 minutes manual setup
- No context switching between governance and code
- Pre-vetted alignment reduces rework

### Ecosystem Integration
- Generates grove governance structure
- Calls hatch programmatically for code
- Maintains separation of concerns (intent → structures)

---

## How It Works

```
┌─────────────────────────────────────────┐
│  User Intent (Natural Language)        │
│  "As a X, I want Y, so I can Z"        │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  LLM Parser    │
        │  (Claude/GPT)  │
        └───────┬────────┘
                │
    ┌───────────┴───────────┐
    ▼                       ▼
┌───────────┐          ┌────────────┐
│   GROVE   │          │   HATCH    │
│ Generator │          │ Generator  │
└─────┬─────┘          └─────┬──────┘
      │                      │
      └──────────┬───────────┘
                 ▼
       ┌──────────────────┐
       │ Alignment Layer  │
       │ (Cross-validate) │
       └──────────────────┘
```

---

## Usage Modes

### Interactive Mode (Guided)
```bash
seed init

# Prompts you for:
# → Your role
# → Primary user
# → What they want
# → Why it matters
# → 12-month vision
# → Success metrics
```

### Express Mode (One-liner)
```bash
seed "As a developer, I want to track bugs efficiently, so I ship faster" \
  --vision "Replace Jira for small teams" \
  --metric "bugs_triaged_per_hour:>10" \
  --metric "time_to_resolution:<2d"
```

### Expert Mode (Config File)
```bash
# Create seed.config.json
seed init --config ./seed.config.json
```

---

## What Gets Generated

### Agentic Layer (grove/)
- `mission/mission.md` - Who, what, why, vision, metrics
- `agent-manifest.md` - Decision rights (Product, UX, Dev)
- `workflows/development.md` - Development methodology
- `docs/activity-log.md` - Initialized with seed entry

### Technical Foundation (via hatch)
- **Apps**: website (Next.js), dashboard (React), api (NestJS)
- **Libs**: ui, auth, shared
- **Testing**: Playwright E2E, Vitest unit
- **DevOps**: Docker, GitHub Actions
- **Database**: PostgreSQL + Prisma

### Alignment Artifacts
- Features mapped to metrics in roadmap
- Initial activity log entry documenting bootstrap
- Cross-reference between grove mission and hatch code

---

## Configuration

### API Keys
```bash
# Set your LLM provider API key
export ANTHROPIC_API_KEY="sk-ant-..."
# or
export OPENAI_API_KEY="sk-..."

# Seed will use Anthropic by default, fallback to OpenAI
```

### Provider Selection
```bash
seed init --provider anthropic  # Default
seed init --provider openai
seed init --provider local      # Use Ollama (coming soon)
```

---

## Architecture

Seed is designed with clear separation of concerns:

**seed** (this repo):
- Intent parsing (LLM)
- Governance generation (grove templates)
- Orchestration (calls hatch)
- Alignment validation

**grove** (governance):
- Mission templates
- Agent roles (Product, UX, Dev)
- Workflows
- Activity tracking

**hatch** (execution):
- Code generation
- Nx monorepo
- Technical scaffolding
- CI/CD setup

---

## Comparison

| Approach | Setup Time | Governance | Code Quality | Alignment |
|----------|------------|------------|--------------|-----------|
| **Manual** | 2-4 weeks | None | Variable | Drifts |
| **hatch only** | 3 minutes | None | High | N/A |
| **grove only** | 45 minutes | Strong | None | N/A |
| **seed** | 5 minutes | Strong | High | Locked |

---

## Roadmap

### v0.2.0 - Bloom Integration (Current)
- [x] Project structure
- [x] CLI with init command
- [x] Basic LLM parsing
- [x] grove mission.md generation
- [x] Hatch integration

### v0.3.0 - Intelligence
- [ ] Multi-step LLM reasoning
- [ ] Suggested features based on metrics
- [ ] Ambiguity detection and clarification
- [ ] Preview before generation

### v0.4.0 - Continuous Alignment
- [ ] `seed check` - detect drift
- [ ] `seed update` - re-align mission and code
- [ ] Metric tracking suggestions
- [ ] Feature-to-metric traceability

### v1.0.0 - Production Ready
- [ ] Multiple LLM providers
- [ ] Local model support (Ollama)
- [ ] Config file mode
- [ ] Comprehensive docs
- [ ] Example projects

---

## Contributing

Seed is in early development. Contributions welcome!

```bash
# Clone repo
git clone https://github.com/derrybirkett/seed.git
cd seed

# Install dependencies
pnpm install

# Run in dev mode
pnpm dev

# Test the CLI
node dist/index.js init
```

---

## License

MIT License - see [LICENSE](LICENSE) file

---

## Acknowledgments

Built on top of:
- [grove](https://github.com/derrybirkett/grove) - Agentic governance framework
- [hatch](https://github.com/derrybirkett/hatch) - SaaS application bootstrapping
- [prefs](https://github.com/derrybirkett/prefs) - Design values and preferences
- [Anthropic Claude](https://anthropic.com) - LLM intelligence
- [OpenAI GPT](https://openai.com) - Alternative LLM provider

---

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/derrybirkett/seed/issues)
- Discussions: [GitHub Discussions](https://github.com/derrybirkett/seed/discussions)

---

**Ready to plant the seeds of your next project?**

```bash
npm install -g seed-cli
seed init
```
