export interface Summary {
  title: string;
  bullet_points: string[];
  tldr: string;
  additional_info: Record<string, string> | null;
}
