import queryString from 'query-string';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Params {
    cacheTime?: number; // Cache time in seconds
    params?: Record<string, any>;
}

interface Props extends Params {
    url: string;
    method: Method;
}

type Config = { next: { revalidate: number } } | { cache: 'no-store' } | { cache: 'force-cache' };

class Request {
    /**
     * 请求拦截器
     * @param {Props}
     */
    interceptorsRequest({ url, method, params, cacheTime }: Props) {
        let queryParams = '';
        let requestPayload = '';
        const headers = {
            authorization: `Bearer ...`,
        };

        const config: Config =
            cacheTime || cacheTime === 0
                ? cacheTime > 0
                    ? { next: { revalidate: cacheTime } }
                    : { cache: 'no-store' }
                : { cache: 'force-cache' };

        if (method === 'GET' || method === 'DELETE') {
            if (params) {
                queryParams = queryString.stringify(params);
                url = `${url}?${queryParams}`;
            }
        } else {
            if (!['[object FormData]', '[object URLSearchParams]'].includes(Object.prototype.toString.call(params))) {
                Object.assign(headers, { 'Content-Type': 'application/json' });
                requestPayload = JSON.stringify(params);
            }
        }
        return {
            url,
            options: {
                method,
                headers,
                body: method !== 'GET' && method !== 'DELETE' ? requestPayload : undefined,
                ...config,
            },
        };
    }

    /**
     * 响应拦截器
     * @param {Response}
     */
    interceptorsResponse<T>(res: Response): Promise<T> {
        return new Promise((resolve, reject) => {
            const requestUrl = res.url;
            if (res.ok) {
                return resolve(res.json() as Promise<T>);
            } else {
                res
                    .clone()
                    .text()
                    .then((text) => {
                        try {
                            const errorData = JSON.parse(text);
                            return reject({ message: errorData || 'Error', url: requestUrl });
                        } catch {
                            return reject({ message: text, url: requestUrl });
                        }
                    });
            }
        });
    }

    async httpFactory<T>({ url = '', params = {}, method }: Props): Promise<T> {
        const req = this.interceptorsRequest({
            url: process.env.NEXT_PUBLIC_API_BASE_URL + url,
            method,
            params: params.params,
            cacheTime: params.cacheTime,
        });
        const res = await fetch(req.url, req.options);
        return this.interceptorsResponse<T>(res);
    }

    async request<T>(method: Method, url: string, params?: Params): Promise<T> {
        return this.httpFactory<T>({ url, params, method });
    }

    get<T>(url: string, params?: Params): Promise<T> {
        return this.request('GET', url, params);
    }

    post<T>(url: string, params?: Params): Promise<T> {
        return this.request('POST', url, params);
    }

    put<T>(url: string, params?: Params): Promise<T> {
        return this.request('PUT', url, params);
    }

    delete<T>(url: string, params?: Params): Promise<T> {
        return this.request('DELETE', url, params);
    }

    patch<T>(url: string, params?: Params): Promise<T> {
        return this.request('PATCH', url, params);
    }
}

const request = new Request();

export default request;