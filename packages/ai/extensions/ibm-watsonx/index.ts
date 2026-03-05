/**
 * IBM Watsonx provider extension for pi
 * 
 * Installation:
 *   pi install ./packages/ai/extensions/ibm-watsonx
 * 
 * Configuration:
 *   export WATSONX_AI_APIKEY=your-api-key
 *   export WATSONX_AI_PROJECT_ID=your-project-id
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { streamWatsonx } from "./stream.js";

export default function (pi: ExtensionAPI) {
	pi.registerProvider("ibm-watsonx", {
		baseUrl: "https://us-south.ml.cloud.ibm.com",
		apiKey: "WATSONX_AI_APIKEY",
		api: "watsonx-ai-text-chat" as any,
		streamSimple: streamWatsonx as any,
		models: [
			{
				id: "openai/gpt-oss-120b",
				name: "GPT OSS 120B",
				reasoning: true,
				input: ["text"],
				cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
				contextWindow: 131072,
				maxTokens: 4096,
			},
			{
				id: "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
				name: "Llama 4 Maverick 17B 128E Instruct FP8",
				reasoning: true,
				input: ["text"],
				cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
				contextWindow: 131072,
				maxTokens: 4096,
			},
		],
	});
}
