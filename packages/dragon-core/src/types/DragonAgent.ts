export interface DragonAgent {
  id: string;
  name: string;
  version: string;
  description: string;

  capabilities: string[];
  permissions: string[];

  canHandle(input: string): Promise<boolean>;

  execute(
    input: string,
    context?: unknown
  ): Promise<unknown>;
}