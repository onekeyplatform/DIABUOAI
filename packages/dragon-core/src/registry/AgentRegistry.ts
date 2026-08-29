import { DragonAgent } from "../types/DragonAgent";

export class AgentRegistry {
  private agents = new Map<string, DragonAgent>();

  register(agent: DragonAgent) {
    this.agents.set(agent.id, agent);
  }

  get(id: string) {
    return this.agents.get(id);
  }

  getAll() {
    return [...this.agents.values()];
  }
}