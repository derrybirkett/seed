import fs from 'fs-extra';
import path from 'path';

interface AlignmentResult {
  score: number;
  checks: {
    pipExists: boolean;
    hatchExists: boolean;
    missionDefined: boolean;
    metricsDefined: boolean;
  };
}

export async function validateAlignment(projectName: string): Promise<AlignmentResult> {
  const projectPath = path.join(process.cwd(), projectName);
  const pipPath = path.join(projectPath, '.pip');

  const checks = {
    pipExists: await fs.pathExists(pipPath),
    hatchExists: await fs.pathExists(path.join(projectPath, 'apps')),
    missionDefined: await fs.pathExists(path.join(pipPath, 'mission', 'mission.md')),
    metricsDefined: await fs.pathExists(path.join(pipPath, 'graph', 'product-app.md')),
  };

  // Simple scoring: each check is worth 25%
  const score = Object.values(checks).filter(Boolean).length * 25;

  return {
    score,
    checks,
  };
}
