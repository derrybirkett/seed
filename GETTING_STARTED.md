# Getting Started with Seed Development

## Quick Setup

```bash
# You're in /Users/dbirkett/Projects/mnspc/seed/

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Add your Anthropic API key to .env
# Get key from: https://console.anthropic.com/settings/keys
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env

# Build the CLI
pnpm build

# Link for local testing
npm link

# Test the CLI
seed --version
seed --help
```

---

## Development Workflow

### Run in dev mode (auto-reload)
```bash
pnpm dev
```

### Build for production
```bash
pnpm build
```

### Test the CLI locally
```bash
# After building and linking
seed init test-project

# Or test directly without linking
node dist/index.js init test-project
```

---

## Project Structure

```
seed/
├── src/
│   ├── index.ts                    # CLI entry (commander)
│   ├── commands/
│   │   └── init.ts                 # Main command implementation
│   ├── parsers/
│   │   └── intent-parser.ts        # LLM parsing (Anthropic)
│   ├── generators/
│   │   ├── pip-generator.ts        # Generate .pip/ structure
│   │   └── hatch-generator.ts      # Call hatch programmatically
│   └── validators/
│       └── alignment-validator.ts  # Check alignment
├── dist/                           # Compiled output (gitignored)
├── package.json                    # NPM config
├── tsconfig.json                   # TypeScript config
├── README.md                       # User-facing docs
├── DESIGN.md                       # Architecture & design decisions
├── ROADMAP.md                      # Feature roadmap
└── .env.example                    # API key template
```

---

## Current Status

**v0.1.0 MVP** - In Progress

### Completed ✅
- [x] Project structure
- [x] package.json with dependencies
- [x] TypeScript configuration
- [x] CLI entry point (src/index.ts)
- [x] Command structure (src/commands/init.ts)
- [x] LLM parser scaffold (src/parsers/intent-parser.ts)
- [x] pip generator scaffold (src/generators/pip-generator.ts)
- [x] hatch orchestrator scaffold (src/generators/hatch-generator.ts)
- [x] Alignment validator scaffold (src/validators/alignment-validator.ts)
- [x] Documentation (README, DESIGN, ROADMAP)

### Next Steps 🚧
- [ ] Install dependencies (`pnpm install`)
- [ ] Add Anthropic API key
- [ ] Build and test CLI
- [ ] Implement full LLM parsing logic
- [ ] Test end-to-end flow
- [ ] Add error handling
- [ ] Add unit tests

---

## Testing Locally

### Test with interactive mode
```bash
seed init

# Follow prompts:
# → Project name: test-app
# → Your role: developer
# → Primary user: small teams
# → What they want: track tasks
# → Why: stay organized
# → Vision: best task manager for devs
# → Metric: task_creation_time:<5s
```

### Test with express mode
```bash
seed "As a developer, I want teams to stay organized, so they ship faster" \
  --vision "Best task manager for small teams" \
  --metric "task_creation_time:<5s" \
  --metric "daily_active_users:>60%"
```

### Check generated output
```bash
cd test-app
ls -la .pip/          # Should have mission/, ia/, docs/, etc.
cat .pip/mission/mission.md
cat .pip/graph/product-app.md
```

---

## Development Tips

### Debug LLM responses
Add console.log in `src/parsers/intent-parser.ts`:
```typescript
const message = await client.messages.create({...});
console.log('LLM Response:', JSON.stringify(message, null, 2));
```

### Skip hatch during testing
```bash
seed init --no-hatch test-project
# Only generates .pip/, skips code generation
```

### Test specific modules
```typescript
// In src/commands/init.ts
import { parseIntent } from '../parsers/intent-parser.js';

// Test parsing independently
const result = await parseIntent({
  projectName: 'test',
  story: 'As a dev, I want ...',
}, 'anthropic');
console.log(result);
```

---

## Common Issues

### Module resolution errors
```bash
# Make sure to build first
pnpm build

# TypeScript uses ESM, ensure package.json has:
"type": "module"
```

### Anthropic API errors
```bash
# Check API key is set
echo $ANTHROPIC_API_KEY

# Or in .env file
cat .env
```

### hatch not found
```bash
# Install hatch globally
cd ~/Projects/hatch
npm install
npm link
which hatch  # Should show path
```

---

## Next Session Checklist

When you open this project next:

1. ✅ Project structure is ready
2. ⏳ Run `pnpm install`
3. ⏳ Add Anthropic API key to `.env`
4. ⏳ Build with `pnpm build`
5. ⏳ Link with `npm link`
6. ⏳ Test with `seed init test-project`

---

## Resources

- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [pip framework](https://github.com/derrybirkett/pip)
- [hatch tool](https://github.com/derrybirkett/hatch)

---

## Goals for v0.1.0

**Prove the concept**: LLM can parse intent and generate pip governance

**Success criteria**:
- User runs `seed init`
- LLM generates mission.md with ≥80% approval
- Roadmap has ≥3 suggested features
- Time to complete: <5 minutes
- No errors in happy path

**Target**: Complete by end of Week 1
