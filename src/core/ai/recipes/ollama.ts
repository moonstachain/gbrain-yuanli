import type { Recipe } from '../types.ts';

export const ollama: Recipe = {
  id: 'ollama',
  name: 'Ollama (local)',
  tier: 'openai-compat',
  implementation: 'openai-compatible',
  base_url_default: 'http://localhost:11434/v1',
  auth_env: {
    required: [], // Ollama runs unauthenticated locally; users pass `ollama` as the key.
    optional: ['OLLAMA_BASE_URL', 'OLLAMA_API_KEY'],
    setup_url: 'https://ollama.ai',
  },
  touchpoints: {
    // Local pin patch (yuanli): declare a chat touchpoint so probeChatModel
    // accepts ollama models for think/synthesis. Ollama serves an
    // OpenAI-compatible /v1/chat/completions endpoint locally at zero cost.
    chat: {
      models: ['deepseek-r1:8b', 'llama3.1', 'qwen2.5'],
      supports_tools: false,
      supports_subagent_loop: false,
      supports_prompt_cache: false,
      max_context_tokens: 32768,
      cost_per_1m_input_usd: 0,
      cost_per_1m_output_usd: 0,
      price_last_verified: '2026-07-02',
    },
    embedding: {
      models: ['nomic-embed-text', 'mxbai-embed-large', 'all-minilm', 'bge-m3'],
      default_dims: 768, // nomic-embed-text native dim
      // Local pin patch (yuanli): bge-m3 emits 1024-dim vectors natively;
      // declared so init's Tier-1 dim check accepts --embedding-dimensions 1024.
      dims_options: [768, 1024],
      cost_per_1m_tokens_usd: 0,
      price_last_verified: '2026-04-20',
      // Ollama's batch capacity depends on the locally loaded model + the
      // OLLAMA_NUM_PARALLEL config; no static cap to declare. v0.32 (#779).
      no_batch_cap: true,
    },
  },
  setup_hint: 'Install Ollama from https://ollama.ai, then `ollama pull nomic-embed-text` and `ollama serve`.',
};
