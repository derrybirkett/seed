import fs from 'fs-extra';
import path from 'path';

interface AlignmentResult {
  score: number;
  checks: {
    groveExists: boolean;
    hatchExists: boolean;
    missionDefined: boolean;
    metricsDefined: boolean;
  };
}

export async function validateAlignment(projectName: string): Promise<AlignmentResult> {
  const projectPath = path.join(process.cwd(), projectName);
  const grovePath = path.join(projectPath, 'grove');

  const checks = {
    groveExists: await fs.pathExists(grovePath),
    hatchExists: await fs.pathExists(path.join(projectPath, 'apps')),
    missionDefined: await fs.pathExists(path.join(grovePath, 'mission', 'mission.md')),
    metricsDefined: await fs.pathExists(path.join(grovePath, 'mission', 'mission.md')),
  };

  // Simple scoring: each check is worth 25%
  const score = Object.values(checks).filter(Boolean).length * 25;

  return {
    score,
    checks,
  };
}
