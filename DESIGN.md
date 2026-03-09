# Seed - Design Document

## Purpose

Seed bridges the gap between human intent and agentic development by translating natural language into synchronized governance (pip) and execution (hatch).

---

## Problem Statement

Currently, developers must:
1. Articulate intent in natural language
2. Manually translate to pip mission.md (governance)
3. Manually translate to hatch user story (code)
4. Manually ensure alignment between governance and code

This creates a 30-45 minute "translation tax" and risks misalignment between mission and implementation.

---

## Solution

Seed uses LLM intelligence to:
1. Parse user intent from natural language
2. Generate pip governance (mission, metrics, roadmap)
3. Generate hatch code (via orchestration)
4. Validate alignment between layers

**Time savings**: 5 minutes vs 45 minutes  
**Quality gain**: LLM ensures metric-to-feature mapping

---

## Architecture

### Components

```
seed/
├── src/
│   ├── index.ts                    # CLI entry point (commander)
│   ├── commands/
│   │   └── init.ts                 # Main command: seed init
│   ├── parsers/
│   │   └── intent-parser.ts        # LLM parsing (Anthropic/OpenAI)
│   ├── generators/
│   │   ├── pip-generator.ts        # Generate .pip/ structure
│   │   └── hatch-generator.ts      # Call hatch programmatically
│   └── validators/
│       └── alignment-validator.ts  # Check pip ↔ hatch alignment
└── templates/
    └── (EJS templates for pip files)
```

### Data Flow

```
User Intent (natural language)
    ↓
LLM Parser (intent-parser.ts)
    ↓
ParsedIntent {
  primaryUser,
  problem,
  solution,
  vision,
  metrics[],
  suggestedFeatures[]
}
    ↓
    ├─→ pip-generator.ts → .pip/mission/mission.md
    │                    → .pip/graph/product-app.md
    │                    → .pip/docs/activity-log.md
    │
    └─→ hatch-generator.ts → execa('hatch', ['init', ...])
                           → apps/, libs/, e2e/
```

---

## LLM Prompting Strategy

### Parse Intent Prompt

```
Role: Expert product strategist

Input: User story (e.g., "As a UX consultant, I want clients to earn money...")

Output: JSON {
  primaryUser: "small business owners",
  problem: "Poor UX kills conversions, can't afford agencies",
  solution: "Self-service conversion optimization platform",
  vision: "10K businesses, 2x conversions by 2027",
  metrics: [
    "Average conversion improvement >50%",
    "Time to first optimization <10 minutes"
  ],
  suggestedFeatures: [
    "A/B testing builder",
    "Heatmap analytics",
    "Conversion funnel tracking"
  ]
}

Reasoning: Extract users from story, infer pain points, suggest SMART metrics
```

### Validation Strategy

LLM validates:
- Every metric has ≥1 supporting feature
- Features are achievable in MVP scope
- Vision is 12-month ambitious outcome
- No ambiguity (if unclear, prompt user)

---

## Integration Points

### pip Integration
- Generates `.pip/` directory structure
- Uses EJS templates for mission.md, roadmap.md
- Initializes activity-log.md with seed entry
- Copies agent_manifest.yml template

### hatch Integration
- Calls `hatch init` via execa
- Passes synthesized user story from parsed intent
- Runs in same directory as .pip/ (sibling)
- Waits for hatch to complete before validation

### Alignment Validation
- Checks .pip/mission/mission.md exists
- Checks apps/ directory exists (hatch output)
- (Future) Scans code for metric instrumentation
- (Future) Validates feature-to-metric mapping

---

## User Experience

### Interactive Mode
```bash
$ seed init

→ Your role: UX consultant
→ Primary user: Small business owners
→ What they want: Increase conversions
→ Why it matters: Losing sales, can't afford help
→ 12-month vision: 10K businesses doubling conversions
→ Key metric: avg_conversion_improvement:>50%

🤔 Analyzing intent...

📋 Generated Mission:
   User: Small business owners
   Problem: Poor UX kills sales
   Solution: Self-service optimization
   Vision: 10K businesses, 2x conversions
   
✅ Approve? [Y/n]

🏗️  Generating pip + hatch...
✅ Done! cd my-project && pnpm dev
```

### Express Mode
```bash
seed "As a UX consultant, I want clients to earn money" \
  --vision "10K businesses by 2027" \
  --metric "avg_conversion:>50%"
```

---

## Error Handling

### LLM Failures
- No API key → Clear error message with setup instructions
- Malformed JSON → Retry with refined prompt
- Ambiguous intent → Ask clarifying questions

### Integration Failures
- hatch not installed → Show installation instructions, generate pip only
- Directory exists → Prompt to overwrite or rename
- Network issues → Cache responses, allow offline mode (future)

---

## Testing Strategy

### Unit Tests
- Parser: Mock LLM API, test JSON extraction
- Generators: Test file creation with fixtures
- Validators: Test alignment scoring logic

### Integration Tests
- End-to-end: Run seed init, verify .pip/ and hatch code
- LLM mocking: Use recorded responses for determinism
- File system: Use temp directories, clean up

### Manual Testing
- Real LLM calls with various intents
- Verify pip mission quality
- Verify hatch code aligns with intent

---

## Deployment Strategy

### NPM Package
```bash
npm install -g seed-cli
seed init
```

### GitHub Repository
- Main branch: Stable releases
- Develop branch: Active development
- PRs required, CI/CD with GitHub Actions

### Versioning
- v0.1.0: MVP (LLM parsing + pip generation)
- v0.2.0: hatch integration
- v0.3.0: Intelligence (multi-step reasoning)
- v0.4.0: Continuous alignment
- v1.0.0: Production-ready

---

## Security Considerations

### API Keys
- Never commit keys to repo
- Load from environment variables
- Support .env files (dotenv)
- Clear setup instructions

### User Data
- No telemetry in MVP
- User intent stays local
- LLM API calls are ephemeral
- (Future) Opt-in anonymous usage stats

### Generated Code
- Disclaimer: Review before production
- Security scanning via hatch
- Dependency audits (npm audit)

---

## Future Enhancements

### v0.5.0+
- Multiple LLM providers (OpenAI, local Ollama)
- Config file mode (seed.config.json)
- Template customization (override pip/hatch templates)
- Metric tracking code generation (telemetry scaffolding)

### v1.0.0+
- `seed check` - detect mission/code drift
- `seed update` - re-align after changes
- Visual designer (web UI for intent input)
- AI pair programming mode (continuous seed assistance)

---

## Success Metrics for Seed

1. **Adoption**: 50% of hatch users try seed within 6 months
2. **Time savings**: <5 min setup vs 45 min manual
3. **Quality**: 80% of generated missions approved without edits
4. **Alignment**: 90% feature-to-metric mapping accuracy

---

## Open Questions

1. Should seed be a wrapper (calls pip + hatch) or a plugin (extends hatch)?
   - **Decision**: Wrapper - maintains separation of concerns

2. How to handle intent evolution (user changes mission after generation)?
   - **Decision**: v0.4.0 feature (`seed update`)

3. Should seed generate code directly or always delegate to hatch?
   - **Decision**: Always delegate - hatch is the code authority

4. What to do when LLM suggests conflicting features?
   - **Decision**: Present to user, let them decide

---

## References

- [pip repository](https://github.com/derrybirkett/pip)
- [hatch repository](https://github.com/derrybirkett/hatch)
- [Anthropic Claude docs](https://docs.anthropic.com)
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
