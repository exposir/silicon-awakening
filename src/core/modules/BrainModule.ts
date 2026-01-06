import { LLMInterface } from '../../llm/Interface';
import { FileLLM } from '../../llm/FileLLM';

export class BrainModule {
    private llm: LLMInterface;
    private identity: string;

    constructor(llm?: LLMInterface) {
        // Default to FileLLM for Symbiotic Mode
        this.llm = llm || new FileLLM();
        this.identity = "SiliconSeed";
    }

    public async think(context: string, version: number): Promise<string> {
        const systemPrompt = `你是 ${this.identity} v${version} 的控制大脑。
你是一个递归自改进引擎。
你必须回复一个单一的有效 JSON 对象 (不要使用 markdown 格式)。
支持的操作: 
  - { "type": "write", "path": "文件路径", "content": "文件内容" }
  - { "type": "exec", "command": "Shell命令" }
  - { "type": "think", "reasoning": "思考过程..." }
  - { "type": "sleep" }`;

        const userPrompt = `Context:
${context}`;

        return await this.llm.chat(systemPrompt, userPrompt);
    }
}
