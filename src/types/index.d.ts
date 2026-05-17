import { CookieJar as ToughCookieJar } from 'tough-cookie'

declare namespace TlsHttp {
  interface BrowserProfile {
    id: string
    browser: string
    userAgent: string
    [key: string]: any
  }

  interface ProxyConfig {
    host: string
    port: number
    protocol?: string
    username?: string
    password?: string
  }

  interface RequestConfig {
    url?: string
    method?: string
    headers?: Record<string, string>
    params?: Record<string, string | number | boolean | undefined>
    data?: any
    json?: any
    form?: Record<string, any>
    timeout?: number
    proxy?: ProxyConfig | string
    responseType?: 'text' | 'json' | 'arraybuffer' | 'stream'
    maxRedirects?: number
    retries?: number
    retryDelay?: number
    browser?: string
    profile?: string
    fingerprint?: string
    rotateFingerprint?: boolean
    randomizeFingerprint?: boolean
    http2?: boolean
    transport?: 'axios' | 'fetch'
    validateStatus?: (status: number) => boolean
    session?: boolean
    jar?: ToughCookieJar
  }

  interface Response<T = any> {
    status: number
    headers: Record<string, string>
    data: T
    cookies: any[]
    request?: any
    raw?: any
  }

  interface ClientOptions {
    timeout?: number
    maxRedirects?: number
    retries?: number
    retryDelay?: number
    transport?: 'axios' | 'fetch'
    profile?: string
    browser?: string
    fingerprint?: string
    jar?: ToughCookieJar
  }

  class Client {
    constructor(defaults?: ClientOptions)
    request<T = any>(config: RequestConfig): Promise<Response<T>>
    get<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
    post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
    put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
    patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
    delete<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
    useRequestInterceptor(onFulfilled: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig, onRejected?: (error: any) => any): void
    useResponseInterceptor(onFulfilled: (response: Response) => Promise<Response> | Response, onRejected?: (error: any) => any): void
  }

  class Session extends Client {}

  interface ModuleExports {
    Client: typeof Client
    Session: typeof Session
    create(config?: ClientOptions): Client
    createSession(config?: ClientOptions): Session
    get(url: string, config?: RequestConfig): Promise<Response>
    post(url: string, data?: any, config?: RequestConfig): Promise<Response>
    put(url: string, data?: any, config?: RequestConfig): Promise<Response>
    patch(url: string, data?: any, config?: RequestConfig): Promise<Response>
    delete(url: string, config?: RequestConfig): Promise<Response>
    request(config: RequestConfig): Promise<Response>
    getBrowserProfile(name?: string): BrowserProfile
    buildChromeProfile(): BrowserProfile
    buildEdgeProfile(): BrowserProfile
    buildFirefoxProfile(): BrowserProfile
    CookieJar: typeof ToughCookieJar
    createWebSocket(url: string, options?: any): any
    errors: {
      RequestError: typeof Error
      TimeoutError: typeof Error
      ProxyError: typeof Error
      NetworkError: typeof Error
    }
  }
}

declare const tlsHttp: TlsHttp.ModuleExports
export = tlsHttp
