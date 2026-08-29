import { AgentRegistry } from "../registry/AgentRegistry";

export class DragonCore {
  constructor(
    private registry: AgentRegistry
  ) {}

  async execute(input: string) {
    const agents = this.registry.getAll();

    for (const agent of agents) {
      if (await agent.canHandle(input)) {
        return agent.execute(input);
      }
    }

    throw new Error("No agent available.");
  }
}