import type { AIProvider } from './types';
import { LocalRuleProvider } from './LocalRuleProvider';
import { RemoteAIProvider } from './RemoteAIProvider';

export * from './types';
export { LocalRuleProvider } from './LocalRuleProvider';
export { MockAIProvider } from './MockAIProvider';
export { RemoteAIProvider } from './RemoteAIProvider';

const ENDPOINT_KEY = 'hello-story:ai-endpoint';

/** 교사/운영자가 설정 화면에서 등록한 프록시 엔드포인트 (없으면 로컬 도우미 사용) */
export function getSavedEndpoint(): string {
  try {
    return localStorage.getItem(ENDPOINT_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveEndpoint(url: string): void {
  try {
    if (url.trim()) localStorage.setItem(ENDPOINT_KEY, url.trim());
    else localStorage.removeItem(ENDPOINT_KEY);
  } catch {
    // 저장 불가 환경에서는 무시 (핵심 기능에 영향 없음)
  }
}

const local = new LocalRuleProvider();

/** 현재 활성 제공자. 원격 실패 시 호출 측에서 local로 대체합니다. */
export function getProvider(): AIProvider {
  const endpoint = getSavedEndpoint();
  if (endpoint && /^https:\/\//.test(endpoint)) {
    return new RemoteAIProvider(endpoint);
  }
  return local;
}

export function getFallbackProvider(): AIProvider {
  return local;
}
