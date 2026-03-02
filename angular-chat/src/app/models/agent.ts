export interface Agent {
    agentId: string;
    name: string;
    description: string;
    model: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    isEnabled: boolean;
    createdAtUtc: string;
}
