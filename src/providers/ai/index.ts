import type { AIProvider } from './types';
import { LocalRuleProvider } from './LocalRuleProvider';
import { GeminiProvider, hasGeminiKey } from './GeminiProvider';

export * from './types';
export { LocalRuleProvider } from './LocalRuleProvider';
export { MockAIProvider } from './MockAIProvider';
export { GeminiProvider, hasGeminiKey } from './GeminiProvider';

const local = new LocalRuleProvider();
const gemini = hasGeminiKey() ? new GeminiProvider() : null;

/** 실제 AI(Gemini) 기능이 켜져 있는지 (빌드에 키가 주입된 경우) */
export function isAIEnabled(): boolean {
  return gemini !== null;
}

/**
 * 현재 활성 제공자.
 * - 빌드 시 GEMINI_API_KEY가 주입되면 Gemini,
 * - 아니면 인터넷 없이 동작하는 규칙 기반(Local).
 * 원격 호출이 실패하면 호출 측에서 getFallbackProvider()로 대체합니다.
 */
export function getProvider(): AIProvider {
  return gemini ?? local;
}

export function getFallbackProvider(): AIProvider {
  return local;
}
