import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { ErrorInterface } from "@/types/AppErrorInterface";
import type { AnyObjectProps } from "@/utils/types/types.utils";

export interface ResponseInterface<TStatus extends number = number> {
  status: TStatus;
  success: string;
}

export type CreatedSuccess<TData = AnyObjectProps> = ResponseInterface<201> & {
  data: TData;
};

export type GenericSuccess = ResponseInterface<200> & {
  data?: never;
};

export type SuccessWithData<TData = AnyObjectProps> = ResponseInterface<200> & {
  data: TData;
};

/**
 * Meta-information that can be attached to success responses.  This generic
 * parameter is **not** an arbitrary shape injected at the top level; it
 * describes the payload that will appear *inside* `data` for 200/201 responses.
 *
 * - `ApiSuccess<{x: string}>` expands to one of:
 *     - `CreatedSuccess<{x: string}>` (status 201)
 *     - `GenericSuccess` (status 200, no data)
 *     - `SuccessWithData<{x: string}>` (status 200, data present)
 *
 * Using a single generic lets callers simply write `ApiSuccess<{ user: User }>`
 * when the API always returns the user inside `data`, without having to spell
 * out the `data:` wrapper themselves.
 */
export type KnownApiSuccess<TMeta extends object = Record<string, never>> =
  | CreatedSuccess<TMeta>
  | GenericSuccess
  | SuccessWithData<TMeta>;

export type ApiSuccess<TMeta extends object = Record<string, never>> =
  KnownApiSuccess<TMeta>;
// -----------------------------------------------------------------------------
// Helpers for route/endpoint typing
// -----------------------------------------------------------------------------

/**
 * Base contract used throughout the app to describe a route response shape.
 * The success key contains the usual response interface while `error` is
 * constrained by `AppErrorInterface`.
 *
 * This alias lives here because a couple of inference utilities are defined
 * alongside it in the same module.
 */
export interface AppRouteResponseContract<
  S extends ResponseInterface = ResponseInterface,
  E extends ErrorInterface = ErrorInterface,
> {
  success: S;
  error: E;
}

/**
 * Union of every statically known endpoint string mapped to its response
 * contract.  The map is maintained manually – add an entry whenever you create a
 * new `/POST` or `/GET` route that has a corresponding `*RouteResponse` type.
 *
 * Keeping it in a single place makes it trivial for the generic helpers below
 * to figure out the correct contract based solely on the URL literal used
 * throughout the codebase.
 */
export type RouteResponseMap = {
  [key in keyof typeof API_ENDPOINTS]: (typeof API_ENDPOINTS)[key];
};

/**
 * Given a literal URL (or the return value of an endpoint factory), look up the
 * associated response contract in `RouteResponseMap`.
 */
export type InferRouteResponseFromUrl<TUrl extends string> =
  TUrl extends keyof RouteResponseMap
    ? RouteResponseMap[TUrl]
    : AppRouteResponseContract;

/**
 * Attempt to normalise whatever was passed as the `submitRoute` generic.
 * - string literal → use it directly
 * - function → infer its return type and then resolve using the map above
 * - anything else → fall back to the generic contract
 */
export type InferRouteResponseFromSubmitRoute<TRoute> = TRoute extends (
  ...args: unknown[]
) => infer R
  ? InferRouteResponseFromUrl<Extract<R, string>>
  : TRoute extends string
    ? InferRouteResponseFromUrl<TRoute>
    : AppRouteResponseContract;
