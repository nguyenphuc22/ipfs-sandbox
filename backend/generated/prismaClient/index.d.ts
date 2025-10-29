
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model File
 * 
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>
/**
 * Model FileChunk
 * 
 */
export type FileChunk = $Result.DefaultSelection<Prisma.$FileChunkPayload>
/**
 * Model AnonymousRevocation
 * 
 */
export type AnonymousRevocation = $Result.DefaultSelection<Prisma.$AnonymousRevocationPayload>
/**
 * Model IntegrityAlert
 * 
 */
export type IntegrityAlert = $Result.DefaultSelection<Prisma.$IntegrityAlertPayload>
/**
 * Model AnonymousFileAccess
 * 
 */
export type AnonymousFileAccess = $Result.DefaultSelection<Prisma.$AnonymousFileAccessPayload>
/**
 * Model AnonymousAuditLog
 * 
 */
export type AnonymousAuditLog = $Result.DefaultSelection<Prisma.$AnonymousAuditLogPayload>
/**
 * Model AnonymousSharingRequest
 * 
 */
export type AnonymousSharingRequest = $Result.DefaultSelection<Prisma.$AnonymousSharingRequestPayload>
/**
 * Model Signature
 * 
 */
export type Signature = $Result.DefaultSelection<Prisma.$SignaturePayload>
/**
 * Model ValidationToken
 * 
 */
export type ValidationToken = $Result.DefaultSelection<Prisma.$ValidationTokenPayload>
/**
 * Model InvestigationAudit
 * 
 */
export type InvestigationAudit = $Result.DefaultSelection<Prisma.$InvestigationAuditPayload>
/**
 * Model ValidationNonce
 * 
 */
export type ValidationNonce = $Result.DefaultSelection<Prisma.$ValidationNoncePayload>
/**
 * Model ValidationTokenAudit
 * 
 */
export type ValidationTokenAudit = $Result.DefaultSelection<Prisma.$ValidationTokenAuditPayload>
/**
 * Model BannedUser
 * 
 */
export type BannedUser = $Result.DefaultSelection<Prisma.$BannedUserPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<ExtArgs>;

  /**
   * `prisma.fileChunk`: Exposes CRUD operations for the **FileChunk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileChunks
    * const fileChunks = await prisma.fileChunk.findMany()
    * ```
    */
  get fileChunk(): Prisma.FileChunkDelegate<ExtArgs>;

  /**
   * `prisma.anonymousRevocation`: Exposes CRUD operations for the **AnonymousRevocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnonymousRevocations
    * const anonymousRevocations = await prisma.anonymousRevocation.findMany()
    * ```
    */
  get anonymousRevocation(): Prisma.AnonymousRevocationDelegate<ExtArgs>;

  /**
   * `prisma.integrityAlert`: Exposes CRUD operations for the **IntegrityAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IntegrityAlerts
    * const integrityAlerts = await prisma.integrityAlert.findMany()
    * ```
    */
  get integrityAlert(): Prisma.IntegrityAlertDelegate<ExtArgs>;

  /**
   * `prisma.anonymousFileAccess`: Exposes CRUD operations for the **AnonymousFileAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnonymousFileAccesses
    * const anonymousFileAccesses = await prisma.anonymousFileAccess.findMany()
    * ```
    */
  get anonymousFileAccess(): Prisma.AnonymousFileAccessDelegate<ExtArgs>;

  /**
   * `prisma.anonymousAuditLog`: Exposes CRUD operations for the **AnonymousAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnonymousAuditLogs
    * const anonymousAuditLogs = await prisma.anonymousAuditLog.findMany()
    * ```
    */
  get anonymousAuditLog(): Prisma.AnonymousAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.anonymousSharingRequest`: Exposes CRUD operations for the **AnonymousSharingRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnonymousSharingRequests
    * const anonymousSharingRequests = await prisma.anonymousSharingRequest.findMany()
    * ```
    */
  get anonymousSharingRequest(): Prisma.AnonymousSharingRequestDelegate<ExtArgs>;

  /**
   * `prisma.signature`: Exposes CRUD operations for the **Signature** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Signatures
    * const signatures = await prisma.signature.findMany()
    * ```
    */
  get signature(): Prisma.SignatureDelegate<ExtArgs>;

  /**
   * `prisma.validationToken`: Exposes CRUD operations for the **ValidationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ValidationTokens
    * const validationTokens = await prisma.validationToken.findMany()
    * ```
    */
  get validationToken(): Prisma.ValidationTokenDelegate<ExtArgs>;

  /**
   * `prisma.investigationAudit`: Exposes CRUD operations for the **InvestigationAudit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvestigationAudits
    * const investigationAudits = await prisma.investigationAudit.findMany()
    * ```
    */
  get investigationAudit(): Prisma.InvestigationAuditDelegate<ExtArgs>;

  /**
   * `prisma.validationNonce`: Exposes CRUD operations for the **ValidationNonce** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ValidationNonces
    * const validationNonces = await prisma.validationNonce.findMany()
    * ```
    */
  get validationNonce(): Prisma.ValidationNonceDelegate<ExtArgs>;

  /**
   * `prisma.validationTokenAudit`: Exposes CRUD operations for the **ValidationTokenAudit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ValidationTokenAudits
    * const validationTokenAudits = await prisma.validationTokenAudit.findMany()
    * ```
    */
  get validationTokenAudit(): Prisma.ValidationTokenAuditDelegate<ExtArgs>;

  /**
   * `prisma.bannedUser`: Exposes CRUD operations for the **BannedUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BannedUsers
    * const bannedUsers = await prisma.bannedUser.findMany()
    * ```
    */
  get bannedUser(): Prisma.BannedUserDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    File: 'File',
    FileChunk: 'FileChunk',
    AnonymousRevocation: 'AnonymousRevocation',
    IntegrityAlert: 'IntegrityAlert',
    AnonymousFileAccess: 'AnonymousFileAccess',
    AnonymousAuditLog: 'AnonymousAuditLog',
    AnonymousSharingRequest: 'AnonymousSharingRequest',
    Signature: 'Signature',
    ValidationToken: 'ValidationToken',
    InvestigationAudit: 'InvestigationAudit',
    ValidationNonce: 'ValidationNonce',
    ValidationTokenAudit: 'ValidationTokenAudit',
    BannedUser: 'BannedUser'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "file" | "fileChunk" | "anonymousRevocation" | "integrityAlert" | "anonymousFileAccess" | "anonymousAuditLog" | "anonymousSharingRequest" | "signature" | "validationToken" | "investigationAudit" | "validationNonce" | "validationTokenAudit" | "bannedUser"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      File: {
        payload: Prisma.$FilePayload<ExtArgs>
        fields: Prisma.FileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFile>
          }
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileCountArgs<ExtArgs>
            result: $Utils.Optional<FileCountAggregateOutputType> | number
          }
        }
      }
      FileChunk: {
        payload: Prisma.$FileChunkPayload<ExtArgs>
        fields: Prisma.FileChunkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileChunkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileChunkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>
          }
          findFirst: {
            args: Prisma.FileChunkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileChunkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>
          }
          findMany: {
            args: Prisma.FileChunkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>[]
          }
          create: {
            args: Prisma.FileChunkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>
          }
          createMany: {
            args: Prisma.FileChunkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileChunkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>[]
          }
          delete: {
            args: Prisma.FileChunkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>
          }
          update: {
            args: Prisma.FileChunkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>
          }
          deleteMany: {
            args: Prisma.FileChunkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileChunkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileChunkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileChunkPayload>
          }
          aggregate: {
            args: Prisma.FileChunkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileChunk>
          }
          groupBy: {
            args: Prisma.FileChunkGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileChunkGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileChunkCountArgs<ExtArgs>
            result: $Utils.Optional<FileChunkCountAggregateOutputType> | number
          }
        }
      }
      AnonymousRevocation: {
        payload: Prisma.$AnonymousRevocationPayload<ExtArgs>
        fields: Prisma.AnonymousRevocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnonymousRevocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnonymousRevocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>
          }
          findFirst: {
            args: Prisma.AnonymousRevocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnonymousRevocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>
          }
          findMany: {
            args: Prisma.AnonymousRevocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>[]
          }
          create: {
            args: Prisma.AnonymousRevocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>
          }
          createMany: {
            args: Prisma.AnonymousRevocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnonymousRevocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>[]
          }
          delete: {
            args: Prisma.AnonymousRevocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>
          }
          update: {
            args: Prisma.AnonymousRevocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>
          }
          deleteMany: {
            args: Prisma.AnonymousRevocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnonymousRevocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnonymousRevocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousRevocationPayload>
          }
          aggregate: {
            args: Prisma.AnonymousRevocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnonymousRevocation>
          }
          groupBy: {
            args: Prisma.AnonymousRevocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnonymousRevocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnonymousRevocationCountArgs<ExtArgs>
            result: $Utils.Optional<AnonymousRevocationCountAggregateOutputType> | number
          }
        }
      }
      IntegrityAlert: {
        payload: Prisma.$IntegrityAlertPayload<ExtArgs>
        fields: Prisma.IntegrityAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IntegrityAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IntegrityAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>
          }
          findFirst: {
            args: Prisma.IntegrityAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IntegrityAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>
          }
          findMany: {
            args: Prisma.IntegrityAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>[]
          }
          create: {
            args: Prisma.IntegrityAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>
          }
          createMany: {
            args: Prisma.IntegrityAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IntegrityAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>[]
          }
          delete: {
            args: Prisma.IntegrityAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>
          }
          update: {
            args: Prisma.IntegrityAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>
          }
          deleteMany: {
            args: Prisma.IntegrityAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IntegrityAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IntegrityAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrityAlertPayload>
          }
          aggregate: {
            args: Prisma.IntegrityAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntegrityAlert>
          }
          groupBy: {
            args: Prisma.IntegrityAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<IntegrityAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.IntegrityAlertCountArgs<ExtArgs>
            result: $Utils.Optional<IntegrityAlertCountAggregateOutputType> | number
          }
        }
      }
      AnonymousFileAccess: {
        payload: Prisma.$AnonymousFileAccessPayload<ExtArgs>
        fields: Prisma.AnonymousFileAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnonymousFileAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnonymousFileAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>
          }
          findFirst: {
            args: Prisma.AnonymousFileAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnonymousFileAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>
          }
          findMany: {
            args: Prisma.AnonymousFileAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>[]
          }
          create: {
            args: Prisma.AnonymousFileAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>
          }
          createMany: {
            args: Prisma.AnonymousFileAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnonymousFileAccessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>[]
          }
          delete: {
            args: Prisma.AnonymousFileAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>
          }
          update: {
            args: Prisma.AnonymousFileAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>
          }
          deleteMany: {
            args: Prisma.AnonymousFileAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnonymousFileAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnonymousFileAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousFileAccessPayload>
          }
          aggregate: {
            args: Prisma.AnonymousFileAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnonymousFileAccess>
          }
          groupBy: {
            args: Prisma.AnonymousFileAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnonymousFileAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnonymousFileAccessCountArgs<ExtArgs>
            result: $Utils.Optional<AnonymousFileAccessCountAggregateOutputType> | number
          }
        }
      }
      AnonymousAuditLog: {
        payload: Prisma.$AnonymousAuditLogPayload<ExtArgs>
        fields: Prisma.AnonymousAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnonymousAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnonymousAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>
          }
          findFirst: {
            args: Prisma.AnonymousAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnonymousAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>
          }
          findMany: {
            args: Prisma.AnonymousAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>[]
          }
          create: {
            args: Prisma.AnonymousAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>
          }
          createMany: {
            args: Prisma.AnonymousAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnonymousAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>[]
          }
          delete: {
            args: Prisma.AnonymousAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>
          }
          update: {
            args: Prisma.AnonymousAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AnonymousAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnonymousAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnonymousAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAuditLogPayload>
          }
          aggregate: {
            args: Prisma.AnonymousAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnonymousAuditLog>
          }
          groupBy: {
            args: Prisma.AnonymousAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnonymousAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnonymousAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AnonymousAuditLogCountAggregateOutputType> | number
          }
        }
      }
      AnonymousSharingRequest: {
        payload: Prisma.$AnonymousSharingRequestPayload<ExtArgs>
        fields: Prisma.AnonymousSharingRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnonymousSharingRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnonymousSharingRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>
          }
          findFirst: {
            args: Prisma.AnonymousSharingRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnonymousSharingRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>
          }
          findMany: {
            args: Prisma.AnonymousSharingRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>[]
          }
          create: {
            args: Prisma.AnonymousSharingRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>
          }
          createMany: {
            args: Prisma.AnonymousSharingRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnonymousSharingRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>[]
          }
          delete: {
            args: Prisma.AnonymousSharingRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>
          }
          update: {
            args: Prisma.AnonymousSharingRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>
          }
          deleteMany: {
            args: Prisma.AnonymousSharingRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnonymousSharingRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnonymousSharingRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousSharingRequestPayload>
          }
          aggregate: {
            args: Prisma.AnonymousSharingRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnonymousSharingRequest>
          }
          groupBy: {
            args: Prisma.AnonymousSharingRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnonymousSharingRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnonymousSharingRequestCountArgs<ExtArgs>
            result: $Utils.Optional<AnonymousSharingRequestCountAggregateOutputType> | number
          }
        }
      }
      Signature: {
        payload: Prisma.$SignaturePayload<ExtArgs>
        fields: Prisma.SignatureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SignatureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SignatureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>
          }
          findFirst: {
            args: Prisma.SignatureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SignatureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>
          }
          findMany: {
            args: Prisma.SignatureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>[]
          }
          create: {
            args: Prisma.SignatureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>
          }
          createMany: {
            args: Prisma.SignatureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SignatureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>[]
          }
          delete: {
            args: Prisma.SignatureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>
          }
          update: {
            args: Prisma.SignatureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>
          }
          deleteMany: {
            args: Prisma.SignatureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SignatureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SignatureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignaturePayload>
          }
          aggregate: {
            args: Prisma.SignatureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSignature>
          }
          groupBy: {
            args: Prisma.SignatureGroupByArgs<ExtArgs>
            result: $Utils.Optional<SignatureGroupByOutputType>[]
          }
          count: {
            args: Prisma.SignatureCountArgs<ExtArgs>
            result: $Utils.Optional<SignatureCountAggregateOutputType> | number
          }
        }
      }
      ValidationToken: {
        payload: Prisma.$ValidationTokenPayload<ExtArgs>
        fields: Prisma.ValidationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ValidationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ValidationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>
          }
          findFirst: {
            args: Prisma.ValidationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ValidationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>
          }
          findMany: {
            args: Prisma.ValidationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>[]
          }
          create: {
            args: Prisma.ValidationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>
          }
          createMany: {
            args: Prisma.ValidationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ValidationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>[]
          }
          delete: {
            args: Prisma.ValidationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>
          }
          update: {
            args: Prisma.ValidationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>
          }
          deleteMany: {
            args: Prisma.ValidationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ValidationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ValidationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenPayload>
          }
          aggregate: {
            args: Prisma.ValidationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateValidationToken>
          }
          groupBy: {
            args: Prisma.ValidationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<ValidationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.ValidationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<ValidationTokenCountAggregateOutputType> | number
          }
        }
      }
      InvestigationAudit: {
        payload: Prisma.$InvestigationAuditPayload<ExtArgs>
        fields: Prisma.InvestigationAuditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvestigationAuditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvestigationAuditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>
          }
          findFirst: {
            args: Prisma.InvestigationAuditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvestigationAuditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>
          }
          findMany: {
            args: Prisma.InvestigationAuditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>[]
          }
          create: {
            args: Prisma.InvestigationAuditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>
          }
          createMany: {
            args: Prisma.InvestigationAuditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvestigationAuditCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>[]
          }
          delete: {
            args: Prisma.InvestigationAuditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>
          }
          update: {
            args: Prisma.InvestigationAuditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>
          }
          deleteMany: {
            args: Prisma.InvestigationAuditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvestigationAuditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvestigationAuditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigationAuditPayload>
          }
          aggregate: {
            args: Prisma.InvestigationAuditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvestigationAudit>
          }
          groupBy: {
            args: Prisma.InvestigationAuditGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvestigationAuditGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvestigationAuditCountArgs<ExtArgs>
            result: $Utils.Optional<InvestigationAuditCountAggregateOutputType> | number
          }
        }
      }
      ValidationNonce: {
        payload: Prisma.$ValidationNoncePayload<ExtArgs>
        fields: Prisma.ValidationNonceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ValidationNonceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ValidationNonceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>
          }
          findFirst: {
            args: Prisma.ValidationNonceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ValidationNonceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>
          }
          findMany: {
            args: Prisma.ValidationNonceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>[]
          }
          create: {
            args: Prisma.ValidationNonceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>
          }
          createMany: {
            args: Prisma.ValidationNonceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ValidationNonceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>[]
          }
          delete: {
            args: Prisma.ValidationNonceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>
          }
          update: {
            args: Prisma.ValidationNonceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>
          }
          deleteMany: {
            args: Prisma.ValidationNonceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ValidationNonceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ValidationNonceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationNoncePayload>
          }
          aggregate: {
            args: Prisma.ValidationNonceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateValidationNonce>
          }
          groupBy: {
            args: Prisma.ValidationNonceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ValidationNonceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ValidationNonceCountArgs<ExtArgs>
            result: $Utils.Optional<ValidationNonceCountAggregateOutputType> | number
          }
        }
      }
      ValidationTokenAudit: {
        payload: Prisma.$ValidationTokenAuditPayload<ExtArgs>
        fields: Prisma.ValidationTokenAuditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ValidationTokenAuditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ValidationTokenAuditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>
          }
          findFirst: {
            args: Prisma.ValidationTokenAuditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ValidationTokenAuditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>
          }
          findMany: {
            args: Prisma.ValidationTokenAuditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>[]
          }
          create: {
            args: Prisma.ValidationTokenAuditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>
          }
          createMany: {
            args: Prisma.ValidationTokenAuditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ValidationTokenAuditCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>[]
          }
          delete: {
            args: Prisma.ValidationTokenAuditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>
          }
          update: {
            args: Prisma.ValidationTokenAuditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>
          }
          deleteMany: {
            args: Prisma.ValidationTokenAuditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ValidationTokenAuditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ValidationTokenAuditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidationTokenAuditPayload>
          }
          aggregate: {
            args: Prisma.ValidationTokenAuditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateValidationTokenAudit>
          }
          groupBy: {
            args: Prisma.ValidationTokenAuditGroupByArgs<ExtArgs>
            result: $Utils.Optional<ValidationTokenAuditGroupByOutputType>[]
          }
          count: {
            args: Prisma.ValidationTokenAuditCountArgs<ExtArgs>
            result: $Utils.Optional<ValidationTokenAuditCountAggregateOutputType> | number
          }
        }
      }
      BannedUser: {
        payload: Prisma.$BannedUserPayload<ExtArgs>
        fields: Prisma.BannedUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BannedUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BannedUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>
          }
          findFirst: {
            args: Prisma.BannedUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BannedUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>
          }
          findMany: {
            args: Prisma.BannedUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>[]
          }
          create: {
            args: Prisma.BannedUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>
          }
          createMany: {
            args: Prisma.BannedUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BannedUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>[]
          }
          delete: {
            args: Prisma.BannedUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>
          }
          update: {
            args: Prisma.BannedUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>
          }
          deleteMany: {
            args: Prisma.BannedUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BannedUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BannedUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BannedUserPayload>
          }
          aggregate: {
            args: Prisma.BannedUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBannedUser>
          }
          groupBy: {
            args: Prisma.BannedUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<BannedUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.BannedUserCountArgs<ExtArgs>
            result: $Utils.Optional<BannedUserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    uploadedFiles: number
    signatures: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploadedFiles?: boolean | UserCountOutputTypeCountUploadedFilesArgs
    signatures?: boolean | UserCountOutputTypeCountSignaturesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUploadedFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSignaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignatureWhereInput
  }


  /**
   * Count Type FileCountOutputType
   */

  export type FileCountOutputType = {
    anonymousAccess: number
    revocations: number
    sharingRequests: number
    chunks: number
    integrityAlerts: number
    signatures: number
  }

  export type FileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anonymousAccess?: boolean | FileCountOutputTypeCountAnonymousAccessArgs
    revocations?: boolean | FileCountOutputTypeCountRevocationsArgs
    sharingRequests?: boolean | FileCountOutputTypeCountSharingRequestsArgs
    chunks?: boolean | FileCountOutputTypeCountChunksArgs
    integrityAlerts?: boolean | FileCountOutputTypeCountIntegrityAlertsArgs
    signatures?: boolean | FileCountOutputTypeCountSignaturesArgs
  }

  // Custom InputTypes
  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileCountOutputType
     */
    select?: FileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountAnonymousAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousFileAccessWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountRevocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousRevocationWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountSharingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousSharingRequestWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountChunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileChunkWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountIntegrityAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrityAlertWhereInput
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountSignaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignatureWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    publicKey: string | null
    displayLabel: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    publicKey: string | null
    displayLabel: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    publicKey: number
    displayLabel: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    publicKey?: true
    displayLabel?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    publicKey?: true
    displayLabel?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    publicKey?: true
    displayLabel?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    publicKey: string
    displayLabel: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicKey?: boolean
    displayLabel?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    uploadedFiles?: boolean | User$uploadedFilesArgs<ExtArgs>
    signatures?: boolean | User$signaturesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicKey?: boolean
    displayLabel?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    publicKey?: boolean
    displayLabel?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploadedFiles?: boolean | User$uploadedFilesArgs<ExtArgs>
    signatures?: boolean | User$signaturesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      uploadedFiles: Prisma.$FilePayload<ExtArgs>[]
      signatures: Prisma.$SignaturePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      publicKey: string
      displayLabel: string | null
      role: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    uploadedFiles<T extends User$uploadedFilesArgs<ExtArgs> = {}>(args?: Subset<T, User$uploadedFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany"> | Null>
    signatures<T extends User$signaturesArgs<ExtArgs> = {}>(args?: Subset<T, User$signaturesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly publicKey: FieldRef<"User", 'String'>
    readonly displayLabel: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.uploadedFiles
   */
  export type User$uploadedFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * User.signatures
   */
  export type User$signaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    where?: SignatureWhereInput
    orderBy?: SignatureOrderByWithRelationInput | SignatureOrderByWithRelationInput[]
    cursor?: SignatureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SignatureScalarFieldEnum | SignatureScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    totalSize: number | null
    chunkCount: number | null
  }

  export type FileSumAggregateOutputType = {
    totalSize: number | null
    chunkCount: number | null
  }

  export type FileMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    totalSize: number | null
    mimeType: string | null
    chunkCount: number | null
    metadata: string | null
    metadataHash: string | null
    encryptedChunkKeys: string | null
    ringSignature: string | null
    ringPublicKeys: string | null
    escrowedIdentity: string | null
    ownershipPublicKey: string | null
    ownershipCreatedAt: Date | null
    uploaderId: string | null
    uploaderPublicKeyHash: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastRevocationId: string | null
    lastRevocationAt: Date | null
  }

  export type FileMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    totalSize: number | null
    mimeType: string | null
    chunkCount: number | null
    metadata: string | null
    metadataHash: string | null
    encryptedChunkKeys: string | null
    ringSignature: string | null
    ringPublicKeys: string | null
    escrowedIdentity: string | null
    ownershipPublicKey: string | null
    ownershipCreatedAt: Date | null
    uploaderId: string | null
    uploaderPublicKeyHash: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastRevocationId: string | null
    lastRevocationAt: Date | null
  }

  export type FileCountAggregateOutputType = {
    id: number
    fileName: number
    totalSize: number
    mimeType: number
    chunkCount: number
    metadata: number
    metadataHash: number
    encryptedChunkKeys: number
    ringSignature: number
    ringPublicKeys: number
    escrowedIdentity: number
    ownershipPublicKey: number
    ownershipCreatedAt: number
    uploaderId: number
    uploaderPublicKeyHash: number
    status: number
    createdAt: number
    updatedAt: number
    lastRevocationId: number
    lastRevocationAt: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    totalSize?: true
    chunkCount?: true
  }

  export type FileSumAggregateInputType = {
    totalSize?: true
    chunkCount?: true
  }

  export type FileMinAggregateInputType = {
    id?: true
    fileName?: true
    totalSize?: true
    mimeType?: true
    chunkCount?: true
    metadata?: true
    metadataHash?: true
    encryptedChunkKeys?: true
    ringSignature?: true
    ringPublicKeys?: true
    escrowedIdentity?: true
    ownershipPublicKey?: true
    ownershipCreatedAt?: true
    uploaderId?: true
    uploaderPublicKeyHash?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    lastRevocationId?: true
    lastRevocationAt?: true
  }

  export type FileMaxAggregateInputType = {
    id?: true
    fileName?: true
    totalSize?: true
    mimeType?: true
    chunkCount?: true
    metadata?: true
    metadataHash?: true
    encryptedChunkKeys?: true
    ringSignature?: true
    ringPublicKeys?: true
    escrowedIdentity?: true
    ownershipPublicKey?: true
    ownershipCreatedAt?: true
    uploaderId?: true
    uploaderPublicKeyHash?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    lastRevocationId?: true
    lastRevocationAt?: true
  }

  export type FileCountAggregateInputType = {
    id?: true
    fileName?: true
    totalSize?: true
    mimeType?: true
    chunkCount?: true
    metadata?: true
    metadataHash?: true
    encryptedChunkKeys?: true
    ringSignature?: true
    ringPublicKeys?: true
    escrowedIdentity?: true
    ownershipPublicKey?: true
    ownershipCreatedAt?: true
    uploaderId?: true
    uploaderPublicKeyHash?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    lastRevocationId?: true
    lastRevocationAt?: true
    _all?: true
  }

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[]
    by: FileScalarFieldEnum[] | FileScalarFieldEnum
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }

  export type FileGroupByOutputType = {
    id: string
    fileName: string
    totalSize: number
    mimeType: string | null
    chunkCount: number
    metadata: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature: string | null
    ringPublicKeys: string | null
    escrowedIdentity: string | null
    ownershipPublicKey: string
    ownershipCreatedAt: Date
    uploaderId: string | null
    uploaderPublicKeyHash: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    lastRevocationId: string | null
    lastRevocationAt: Date | null
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    totalSize?: boolean
    mimeType?: boolean
    chunkCount?: boolean
    metadata?: boolean
    metadataHash?: boolean
    encryptedChunkKeys?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    escrowedIdentity?: boolean
    ownershipPublicKey?: boolean
    ownershipCreatedAt?: boolean
    uploaderId?: boolean
    uploaderPublicKeyHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastRevocationId?: boolean
    lastRevocationAt?: boolean
    anonymousAccess?: boolean | File$anonymousAccessArgs<ExtArgs>
    revocations?: boolean | File$revocationsArgs<ExtArgs>
    sharingRequests?: boolean | File$sharingRequestsArgs<ExtArgs>
    uploader?: boolean | File$uploaderArgs<ExtArgs>
    chunks?: boolean | File$chunksArgs<ExtArgs>
    integrityAlerts?: boolean | File$integrityAlertsArgs<ExtArgs>
    signatures?: boolean | File$signaturesArgs<ExtArgs>
    validationToken?: boolean | File$validationTokenArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    totalSize?: boolean
    mimeType?: boolean
    chunkCount?: boolean
    metadata?: boolean
    metadataHash?: boolean
    encryptedChunkKeys?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    escrowedIdentity?: boolean
    ownershipPublicKey?: boolean
    ownershipCreatedAt?: boolean
    uploaderId?: boolean
    uploaderPublicKeyHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastRevocationId?: boolean
    lastRevocationAt?: boolean
    uploader?: boolean | File$uploaderArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectScalar = {
    id?: boolean
    fileName?: boolean
    totalSize?: boolean
    mimeType?: boolean
    chunkCount?: boolean
    metadata?: boolean
    metadataHash?: boolean
    encryptedChunkKeys?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    escrowedIdentity?: boolean
    ownershipPublicKey?: boolean
    ownershipCreatedAt?: boolean
    uploaderId?: boolean
    uploaderPublicKeyHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastRevocationId?: boolean
    lastRevocationAt?: boolean
  }

  export type FileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anonymousAccess?: boolean | File$anonymousAccessArgs<ExtArgs>
    revocations?: boolean | File$revocationsArgs<ExtArgs>
    sharingRequests?: boolean | File$sharingRequestsArgs<ExtArgs>
    uploader?: boolean | File$uploaderArgs<ExtArgs>
    chunks?: boolean | File$chunksArgs<ExtArgs>
    integrityAlerts?: boolean | File$integrityAlertsArgs<ExtArgs>
    signatures?: boolean | File$signaturesArgs<ExtArgs>
    validationToken?: boolean | File$validationTokenArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | File$uploaderArgs<ExtArgs>
  }

  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "File"
    objects: {
      anonymousAccess: Prisma.$AnonymousFileAccessPayload<ExtArgs>[]
      revocations: Prisma.$AnonymousRevocationPayload<ExtArgs>[]
      sharingRequests: Prisma.$AnonymousSharingRequestPayload<ExtArgs>[]
      uploader: Prisma.$UserPayload<ExtArgs> | null
      chunks: Prisma.$FileChunkPayload<ExtArgs>[]
      integrityAlerts: Prisma.$IntegrityAlertPayload<ExtArgs>[]
      signatures: Prisma.$SignaturePayload<ExtArgs>[]
      validationToken: Prisma.$ValidationTokenPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      totalSize: number
      mimeType: string | null
      chunkCount: number
      metadata: string | null
      metadataHash: string
      encryptedChunkKeys: string
      ringSignature: string | null
      ringPublicKeys: string | null
      escrowedIdentity: string | null
      ownershipPublicKey: string
      ownershipCreatedAt: Date
      uploaderId: string | null
      uploaderPublicKeyHash: string | null
      status: string
      createdAt: Date
      updatedAt: Date
      lastRevocationId: string | null
      lastRevocationAt: Date | null
    }, ExtArgs["result"]["file"]>
    composites: {}
  }

  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<Prisma.$FilePayload, S>

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File'], meta: { name: 'File' } }
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileFindUniqueArgs>(args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one File that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs>(args: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileFindFirstArgs>(args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs>(args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileWithIdOnly = await prisma.file.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileFindManyArgs>(args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
     */
    create<T extends FileCreateArgs>(args: SelectSubset<T, FileCreateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Files.
     * @param {FileCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileCreateManyArgs>(args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Files and returns the data saved in the database.
     * @param {FileCreateManyAndReturnArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileCreateManyAndReturnArgs>(args?: SelectSubset<T, FileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
     */
    delete<T extends FileDeleteArgs>(args: SelectSubset<T, FileDeleteArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileUpdateArgs>(args: SelectSubset<T, FileUpdateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileDeleteManyArgs>(args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileUpdateManyArgs>(args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
     */
    upsert<T extends FileUpsertArgs>(args: SelectSubset<T, FileUpsertArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the File model
   */
  readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    anonymousAccess<T extends File$anonymousAccessArgs<ExtArgs> = {}>(args?: Subset<T, File$anonymousAccessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "findMany"> | Null>
    revocations<T extends File$revocationsArgs<ExtArgs> = {}>(args?: Subset<T, File$revocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "findMany"> | Null>
    sharingRequests<T extends File$sharingRequestsArgs<ExtArgs> = {}>(args?: Subset<T, File$sharingRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "findMany"> | Null>
    uploader<T extends File$uploaderArgs<ExtArgs> = {}>(args?: Subset<T, File$uploaderArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    chunks<T extends File$chunksArgs<ExtArgs> = {}>(args?: Subset<T, File$chunksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "findMany"> | Null>
    integrityAlerts<T extends File$integrityAlertsArgs<ExtArgs> = {}>(args?: Subset<T, File$integrityAlertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "findMany"> | Null>
    signatures<T extends File$signaturesArgs<ExtArgs> = {}>(args?: Subset<T, File$signaturesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findMany"> | Null>
    validationToken<T extends File$validationTokenArgs<ExtArgs> = {}>(args?: Subset<T, File$validationTokenArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the File model
   */ 
  interface FileFieldRefs {
    readonly id: FieldRef<"File", 'String'>
    readonly fileName: FieldRef<"File", 'String'>
    readonly totalSize: FieldRef<"File", 'Int'>
    readonly mimeType: FieldRef<"File", 'String'>
    readonly chunkCount: FieldRef<"File", 'Int'>
    readonly metadata: FieldRef<"File", 'String'>
    readonly metadataHash: FieldRef<"File", 'String'>
    readonly encryptedChunkKeys: FieldRef<"File", 'String'>
    readonly ringSignature: FieldRef<"File", 'String'>
    readonly ringPublicKeys: FieldRef<"File", 'String'>
    readonly escrowedIdentity: FieldRef<"File", 'String'>
    readonly ownershipPublicKey: FieldRef<"File", 'String'>
    readonly ownershipCreatedAt: FieldRef<"File", 'DateTime'>
    readonly uploaderId: FieldRef<"File", 'String'>
    readonly uploaderPublicKeyHash: FieldRef<"File", 'String'>
    readonly status: FieldRef<"File", 'String'>
    readonly createdAt: FieldRef<"File", 'DateTime'>
    readonly updatedAt: FieldRef<"File", 'DateTime'>
    readonly lastRevocationId: FieldRef<"File", 'String'>
    readonly lastRevocationAt: FieldRef<"File", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }

  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
  }

  /**
   * File createManyAndReturn
   */
  export type FileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
  }

  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }

  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
  }

  /**
   * File.anonymousAccess
   */
  export type File$anonymousAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    where?: AnonymousFileAccessWhereInput
    orderBy?: AnonymousFileAccessOrderByWithRelationInput | AnonymousFileAccessOrderByWithRelationInput[]
    cursor?: AnonymousFileAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnonymousFileAccessScalarFieldEnum | AnonymousFileAccessScalarFieldEnum[]
  }

  /**
   * File.revocations
   */
  export type File$revocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    where?: AnonymousRevocationWhereInput
    orderBy?: AnonymousRevocationOrderByWithRelationInput | AnonymousRevocationOrderByWithRelationInput[]
    cursor?: AnonymousRevocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnonymousRevocationScalarFieldEnum | AnonymousRevocationScalarFieldEnum[]
  }

  /**
   * File.sharingRequests
   */
  export type File$sharingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    where?: AnonymousSharingRequestWhereInput
    orderBy?: AnonymousSharingRequestOrderByWithRelationInput | AnonymousSharingRequestOrderByWithRelationInput[]
    cursor?: AnonymousSharingRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnonymousSharingRequestScalarFieldEnum | AnonymousSharingRequestScalarFieldEnum[]
  }

  /**
   * File.uploader
   */
  export type File$uploaderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * File.chunks
   */
  export type File$chunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    where?: FileChunkWhereInput
    orderBy?: FileChunkOrderByWithRelationInput | FileChunkOrderByWithRelationInput[]
    cursor?: FileChunkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileChunkScalarFieldEnum | FileChunkScalarFieldEnum[]
  }

  /**
   * File.integrityAlerts
   */
  export type File$integrityAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    where?: IntegrityAlertWhereInput
    orderBy?: IntegrityAlertOrderByWithRelationInput | IntegrityAlertOrderByWithRelationInput[]
    cursor?: IntegrityAlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IntegrityAlertScalarFieldEnum | IntegrityAlertScalarFieldEnum[]
  }

  /**
   * File.signatures
   */
  export type File$signaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    where?: SignatureWhereInput
    orderBy?: SignatureOrderByWithRelationInput | SignatureOrderByWithRelationInput[]
    cursor?: SignatureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SignatureScalarFieldEnum | SignatureScalarFieldEnum[]
  }

  /**
   * File.validationToken
   */
  export type File$validationTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    where?: ValidationTokenWhereInput
  }

  /**
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
  }


  /**
   * Model FileChunk
   */

  export type AggregateFileChunk = {
    _count: FileChunkCountAggregateOutputType | null
    _avg: FileChunkAvgAggregateOutputType | null
    _sum: FileChunkSumAggregateOutputType | null
    _min: FileChunkMinAggregateOutputType | null
    _max: FileChunkMaxAggregateOutputType | null
  }

  export type FileChunkAvgAggregateOutputType = {
    chunkIndex: number | null
    size: number | null
  }

  export type FileChunkSumAggregateOutputType = {
    chunkIndex: number | null
    size: number | null
  }

  export type FileChunkMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    chunkIndex: number | null
    chunkHash: string | null
    ipfsCid: string | null
    size: number | null
    encryptedAt: Date | null
    createdAt: Date | null
  }

  export type FileChunkMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    chunkIndex: number | null
    chunkHash: string | null
    ipfsCid: string | null
    size: number | null
    encryptedAt: Date | null
    createdAt: Date | null
  }

  export type FileChunkCountAggregateOutputType = {
    id: number
    fileId: number
    chunkIndex: number
    chunkHash: number
    ipfsCid: number
    size: number
    encryptedAt: number
    createdAt: number
    _all: number
  }


  export type FileChunkAvgAggregateInputType = {
    chunkIndex?: true
    size?: true
  }

  export type FileChunkSumAggregateInputType = {
    chunkIndex?: true
    size?: true
  }

  export type FileChunkMinAggregateInputType = {
    id?: true
    fileId?: true
    chunkIndex?: true
    chunkHash?: true
    ipfsCid?: true
    size?: true
    encryptedAt?: true
    createdAt?: true
  }

  export type FileChunkMaxAggregateInputType = {
    id?: true
    fileId?: true
    chunkIndex?: true
    chunkHash?: true
    ipfsCid?: true
    size?: true
    encryptedAt?: true
    createdAt?: true
  }

  export type FileChunkCountAggregateInputType = {
    id?: true
    fileId?: true
    chunkIndex?: true
    chunkHash?: true
    ipfsCid?: true
    size?: true
    encryptedAt?: true
    createdAt?: true
    _all?: true
  }

  export type FileChunkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileChunk to aggregate.
     */
    where?: FileChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileChunks to fetch.
     */
    orderBy?: FileChunkOrderByWithRelationInput | FileChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileChunks
    **/
    _count?: true | FileChunkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileChunkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileChunkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileChunkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileChunkMaxAggregateInputType
  }

  export type GetFileChunkAggregateType<T extends FileChunkAggregateArgs> = {
        [P in keyof T & keyof AggregateFileChunk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileChunk[P]>
      : GetScalarType<T[P], AggregateFileChunk[P]>
  }




  export type FileChunkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileChunkWhereInput
    orderBy?: FileChunkOrderByWithAggregationInput | FileChunkOrderByWithAggregationInput[]
    by: FileChunkScalarFieldEnum[] | FileChunkScalarFieldEnum
    having?: FileChunkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileChunkCountAggregateInputType | true
    _avg?: FileChunkAvgAggregateInputType
    _sum?: FileChunkSumAggregateInputType
    _min?: FileChunkMinAggregateInputType
    _max?: FileChunkMaxAggregateInputType
  }

  export type FileChunkGroupByOutputType = {
    id: string
    fileId: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt: Date
    createdAt: Date
    _count: FileChunkCountAggregateOutputType | null
    _avg: FileChunkAvgAggregateOutputType | null
    _sum: FileChunkSumAggregateOutputType | null
    _min: FileChunkMinAggregateOutputType | null
    _max: FileChunkMaxAggregateOutputType | null
  }

  type GetFileChunkGroupByPayload<T extends FileChunkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileChunkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileChunkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileChunkGroupByOutputType[P]>
            : GetScalarType<T[P], FileChunkGroupByOutputType[P]>
        }
      >
    >


  export type FileChunkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    chunkIndex?: boolean
    chunkHash?: boolean
    ipfsCid?: boolean
    size?: boolean
    encryptedAt?: boolean
    createdAt?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileChunk"]>

  export type FileChunkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    chunkIndex?: boolean
    chunkHash?: boolean
    ipfsCid?: boolean
    size?: boolean
    encryptedAt?: boolean
    createdAt?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileChunk"]>

  export type FileChunkSelectScalar = {
    id?: boolean
    fileId?: boolean
    chunkIndex?: boolean
    chunkHash?: boolean
    ipfsCid?: boolean
    size?: boolean
    encryptedAt?: boolean
    createdAt?: boolean
  }

  export type FileChunkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type FileChunkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $FileChunkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileChunk"
    objects: {
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      chunkIndex: number
      chunkHash: string
      ipfsCid: string
      size: number
      encryptedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["fileChunk"]>
    composites: {}
  }

  type FileChunkGetPayload<S extends boolean | null | undefined | FileChunkDefaultArgs> = $Result.GetResult<Prisma.$FileChunkPayload, S>

  type FileChunkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileChunkFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileChunkCountAggregateInputType | true
    }

  export interface FileChunkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileChunk'], meta: { name: 'FileChunk' } }
    /**
     * Find zero or one FileChunk that matches the filter.
     * @param {FileChunkFindUniqueArgs} args - Arguments to find a FileChunk
     * @example
     * // Get one FileChunk
     * const fileChunk = await prisma.fileChunk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileChunkFindUniqueArgs>(args: SelectSubset<T, FileChunkFindUniqueArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FileChunk that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FileChunkFindUniqueOrThrowArgs} args - Arguments to find a FileChunk
     * @example
     * // Get one FileChunk
     * const fileChunk = await prisma.fileChunk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileChunkFindUniqueOrThrowArgs>(args: SelectSubset<T, FileChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FileChunk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkFindFirstArgs} args - Arguments to find a FileChunk
     * @example
     * // Get one FileChunk
     * const fileChunk = await prisma.fileChunk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileChunkFindFirstArgs>(args?: SelectSubset<T, FileChunkFindFirstArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FileChunk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkFindFirstOrThrowArgs} args - Arguments to find a FileChunk
     * @example
     * // Get one FileChunk
     * const fileChunk = await prisma.fileChunk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileChunkFindFirstOrThrowArgs>(args?: SelectSubset<T, FileChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FileChunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileChunks
     * const fileChunks = await prisma.fileChunk.findMany()
     * 
     * // Get first 10 FileChunks
     * const fileChunks = await prisma.fileChunk.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileChunkWithIdOnly = await prisma.fileChunk.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileChunkFindManyArgs>(args?: SelectSubset<T, FileChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FileChunk.
     * @param {FileChunkCreateArgs} args - Arguments to create a FileChunk.
     * @example
     * // Create one FileChunk
     * const FileChunk = await prisma.fileChunk.create({
     *   data: {
     *     // ... data to create a FileChunk
     *   }
     * })
     * 
     */
    create<T extends FileChunkCreateArgs>(args: SelectSubset<T, FileChunkCreateArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FileChunks.
     * @param {FileChunkCreateManyArgs} args - Arguments to create many FileChunks.
     * @example
     * // Create many FileChunks
     * const fileChunk = await prisma.fileChunk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileChunkCreateManyArgs>(args?: SelectSubset<T, FileChunkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileChunks and returns the data saved in the database.
     * @param {FileChunkCreateManyAndReturnArgs} args - Arguments to create many FileChunks.
     * @example
     * // Create many FileChunks
     * const fileChunk = await prisma.fileChunk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileChunks and only return the `id`
     * const fileChunkWithIdOnly = await prisma.fileChunk.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileChunkCreateManyAndReturnArgs>(args?: SelectSubset<T, FileChunkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FileChunk.
     * @param {FileChunkDeleteArgs} args - Arguments to delete one FileChunk.
     * @example
     * // Delete one FileChunk
     * const FileChunk = await prisma.fileChunk.delete({
     *   where: {
     *     // ... filter to delete one FileChunk
     *   }
     * })
     * 
     */
    delete<T extends FileChunkDeleteArgs>(args: SelectSubset<T, FileChunkDeleteArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FileChunk.
     * @param {FileChunkUpdateArgs} args - Arguments to update one FileChunk.
     * @example
     * // Update one FileChunk
     * const fileChunk = await prisma.fileChunk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileChunkUpdateArgs>(args: SelectSubset<T, FileChunkUpdateArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FileChunks.
     * @param {FileChunkDeleteManyArgs} args - Arguments to filter FileChunks to delete.
     * @example
     * // Delete a few FileChunks
     * const { count } = await prisma.fileChunk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileChunkDeleteManyArgs>(args?: SelectSubset<T, FileChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileChunks
     * const fileChunk = await prisma.fileChunk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileChunkUpdateManyArgs>(args: SelectSubset<T, FileChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FileChunk.
     * @param {FileChunkUpsertArgs} args - Arguments to update or create a FileChunk.
     * @example
     * // Update or create a FileChunk
     * const fileChunk = await prisma.fileChunk.upsert({
     *   create: {
     *     // ... data to create a FileChunk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileChunk we want to update
     *   }
     * })
     */
    upsert<T extends FileChunkUpsertArgs>(args: SelectSubset<T, FileChunkUpsertArgs<ExtArgs>>): Prisma__FileChunkClient<$Result.GetResult<Prisma.$FileChunkPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FileChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkCountArgs} args - Arguments to filter FileChunks to count.
     * @example
     * // Count the number of FileChunks
     * const count = await prisma.fileChunk.count({
     *   where: {
     *     // ... the filter for the FileChunks we want to count
     *   }
     * })
    **/
    count<T extends FileChunkCountArgs>(
      args?: Subset<T, FileChunkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileChunkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileChunkAggregateArgs>(args: Subset<T, FileChunkAggregateArgs>): Prisma.PrismaPromise<GetFileChunkAggregateType<T>>

    /**
     * Group by FileChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileChunkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileChunkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileChunkGroupByArgs['orderBy'] }
        : { orderBy?: FileChunkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileChunk model
   */
  readonly fields: FileChunkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileChunk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileChunkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileChunk model
   */ 
  interface FileChunkFieldRefs {
    readonly id: FieldRef<"FileChunk", 'String'>
    readonly fileId: FieldRef<"FileChunk", 'String'>
    readonly chunkIndex: FieldRef<"FileChunk", 'Int'>
    readonly chunkHash: FieldRef<"FileChunk", 'String'>
    readonly ipfsCid: FieldRef<"FileChunk", 'String'>
    readonly size: FieldRef<"FileChunk", 'Int'>
    readonly encryptedAt: FieldRef<"FileChunk", 'DateTime'>
    readonly createdAt: FieldRef<"FileChunk", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileChunk findUnique
   */
  export type FileChunkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * Filter, which FileChunk to fetch.
     */
    where: FileChunkWhereUniqueInput
  }

  /**
   * FileChunk findUniqueOrThrow
   */
  export type FileChunkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * Filter, which FileChunk to fetch.
     */
    where: FileChunkWhereUniqueInput
  }

  /**
   * FileChunk findFirst
   */
  export type FileChunkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * Filter, which FileChunk to fetch.
     */
    where?: FileChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileChunks to fetch.
     */
    orderBy?: FileChunkOrderByWithRelationInput | FileChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileChunks.
     */
    cursor?: FileChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileChunks.
     */
    distinct?: FileChunkScalarFieldEnum | FileChunkScalarFieldEnum[]
  }

  /**
   * FileChunk findFirstOrThrow
   */
  export type FileChunkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * Filter, which FileChunk to fetch.
     */
    where?: FileChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileChunks to fetch.
     */
    orderBy?: FileChunkOrderByWithRelationInput | FileChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileChunks.
     */
    cursor?: FileChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileChunks.
     */
    distinct?: FileChunkScalarFieldEnum | FileChunkScalarFieldEnum[]
  }

  /**
   * FileChunk findMany
   */
  export type FileChunkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * Filter, which FileChunks to fetch.
     */
    where?: FileChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileChunks to fetch.
     */
    orderBy?: FileChunkOrderByWithRelationInput | FileChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileChunks.
     */
    cursor?: FileChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileChunks.
     */
    skip?: number
    distinct?: FileChunkScalarFieldEnum | FileChunkScalarFieldEnum[]
  }

  /**
   * FileChunk create
   */
  export type FileChunkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * The data needed to create a FileChunk.
     */
    data: XOR<FileChunkCreateInput, FileChunkUncheckedCreateInput>
  }

  /**
   * FileChunk createMany
   */
  export type FileChunkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileChunks.
     */
    data: FileChunkCreateManyInput | FileChunkCreateManyInput[]
  }

  /**
   * FileChunk createManyAndReturn
   */
  export type FileChunkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FileChunks.
     */
    data: FileChunkCreateManyInput | FileChunkCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileChunk update
   */
  export type FileChunkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * The data needed to update a FileChunk.
     */
    data: XOR<FileChunkUpdateInput, FileChunkUncheckedUpdateInput>
    /**
     * Choose, which FileChunk to update.
     */
    where: FileChunkWhereUniqueInput
  }

  /**
   * FileChunk updateMany
   */
  export type FileChunkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileChunks.
     */
    data: XOR<FileChunkUpdateManyMutationInput, FileChunkUncheckedUpdateManyInput>
    /**
     * Filter which FileChunks to update
     */
    where?: FileChunkWhereInput
  }

  /**
   * FileChunk upsert
   */
  export type FileChunkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * The filter to search for the FileChunk to update in case it exists.
     */
    where: FileChunkWhereUniqueInput
    /**
     * In case the FileChunk found by the `where` argument doesn't exist, create a new FileChunk with this data.
     */
    create: XOR<FileChunkCreateInput, FileChunkUncheckedCreateInput>
    /**
     * In case the FileChunk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileChunkUpdateInput, FileChunkUncheckedUpdateInput>
  }

  /**
   * FileChunk delete
   */
  export type FileChunkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
    /**
     * Filter which FileChunk to delete.
     */
    where: FileChunkWhereUniqueInput
  }

  /**
   * FileChunk deleteMany
   */
  export type FileChunkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileChunks to delete
     */
    where?: FileChunkWhereInput
  }

  /**
   * FileChunk without action
   */
  export type FileChunkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileChunk
     */
    select?: FileChunkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileChunkInclude<ExtArgs> | null
  }


  /**
   * Model AnonymousRevocation
   */

  export type AggregateAnonymousRevocation = {
    _count: AnonymousRevocationCountAggregateOutputType | null
    _min: AnonymousRevocationMinAggregateOutputType | null
    _max: AnonymousRevocationMaxAggregateOutputType | null
  }

  export type AnonymousRevocationMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    revokedPublicKeyHash: string | null
    proofR: string | null
    proofS: string | null
    proofMessage: string | null
    proofTimestamp: Date | null
    ringSignature: string | null
    ringPublicKeys: string | null
    chunksReencrypted: string | null
    revocationStrategy: string | null
    createdAt: Date | null
    executedBySystem: boolean | null
  }

  export type AnonymousRevocationMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    revokedPublicKeyHash: string | null
    proofR: string | null
    proofS: string | null
    proofMessage: string | null
    proofTimestamp: Date | null
    ringSignature: string | null
    ringPublicKeys: string | null
    chunksReencrypted: string | null
    revocationStrategy: string | null
    createdAt: Date | null
    executedBySystem: boolean | null
  }

  export type AnonymousRevocationCountAggregateOutputType = {
    id: number
    fileId: number
    revokedPublicKeyHash: number
    proofR: number
    proofS: number
    proofMessage: number
    proofTimestamp: number
    ringSignature: number
    ringPublicKeys: number
    chunksReencrypted: number
    revocationStrategy: number
    createdAt: number
    executedBySystem: number
    _all: number
  }


  export type AnonymousRevocationMinAggregateInputType = {
    id?: true
    fileId?: true
    revokedPublicKeyHash?: true
    proofR?: true
    proofS?: true
    proofMessage?: true
    proofTimestamp?: true
    ringSignature?: true
    ringPublicKeys?: true
    chunksReencrypted?: true
    revocationStrategy?: true
    createdAt?: true
    executedBySystem?: true
  }

  export type AnonymousRevocationMaxAggregateInputType = {
    id?: true
    fileId?: true
    revokedPublicKeyHash?: true
    proofR?: true
    proofS?: true
    proofMessage?: true
    proofTimestamp?: true
    ringSignature?: true
    ringPublicKeys?: true
    chunksReencrypted?: true
    revocationStrategy?: true
    createdAt?: true
    executedBySystem?: true
  }

  export type AnonymousRevocationCountAggregateInputType = {
    id?: true
    fileId?: true
    revokedPublicKeyHash?: true
    proofR?: true
    proofS?: true
    proofMessage?: true
    proofTimestamp?: true
    ringSignature?: true
    ringPublicKeys?: true
    chunksReencrypted?: true
    revocationStrategy?: true
    createdAt?: true
    executedBySystem?: true
    _all?: true
  }

  export type AnonymousRevocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousRevocation to aggregate.
     */
    where?: AnonymousRevocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousRevocations to fetch.
     */
    orderBy?: AnonymousRevocationOrderByWithRelationInput | AnonymousRevocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnonymousRevocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousRevocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousRevocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnonymousRevocations
    **/
    _count?: true | AnonymousRevocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnonymousRevocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnonymousRevocationMaxAggregateInputType
  }

  export type GetAnonymousRevocationAggregateType<T extends AnonymousRevocationAggregateArgs> = {
        [P in keyof T & keyof AggregateAnonymousRevocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnonymousRevocation[P]>
      : GetScalarType<T[P], AggregateAnonymousRevocation[P]>
  }




  export type AnonymousRevocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousRevocationWhereInput
    orderBy?: AnonymousRevocationOrderByWithAggregationInput | AnonymousRevocationOrderByWithAggregationInput[]
    by: AnonymousRevocationScalarFieldEnum[] | AnonymousRevocationScalarFieldEnum
    having?: AnonymousRevocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnonymousRevocationCountAggregateInputType | true
    _min?: AnonymousRevocationMinAggregateInputType
    _max?: AnonymousRevocationMaxAggregateInputType
  }

  export type AnonymousRevocationGroupByOutputType = {
    id: string
    fileId: string
    revokedPublicKeyHash: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date
    ringSignature: string | null
    ringPublicKeys: string | null
    chunksReencrypted: string
    revocationStrategy: string | null
    createdAt: Date
    executedBySystem: boolean
    _count: AnonymousRevocationCountAggregateOutputType | null
    _min: AnonymousRevocationMinAggregateOutputType | null
    _max: AnonymousRevocationMaxAggregateOutputType | null
  }

  type GetAnonymousRevocationGroupByPayload<T extends AnonymousRevocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnonymousRevocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnonymousRevocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnonymousRevocationGroupByOutputType[P]>
            : GetScalarType<T[P], AnonymousRevocationGroupByOutputType[P]>
        }
      >
    >


  export type AnonymousRevocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    revokedPublicKeyHash?: boolean
    proofR?: boolean
    proofS?: boolean
    proofMessage?: boolean
    proofTimestamp?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    chunksReencrypted?: boolean
    revocationStrategy?: boolean
    createdAt?: boolean
    executedBySystem?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anonymousRevocation"]>

  export type AnonymousRevocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    revokedPublicKeyHash?: boolean
    proofR?: boolean
    proofS?: boolean
    proofMessage?: boolean
    proofTimestamp?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    chunksReencrypted?: boolean
    revocationStrategy?: boolean
    createdAt?: boolean
    executedBySystem?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anonymousRevocation"]>

  export type AnonymousRevocationSelectScalar = {
    id?: boolean
    fileId?: boolean
    revokedPublicKeyHash?: boolean
    proofR?: boolean
    proofS?: boolean
    proofMessage?: boolean
    proofTimestamp?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    chunksReencrypted?: boolean
    revocationStrategy?: boolean
    createdAt?: boolean
    executedBySystem?: boolean
  }

  export type AnonymousRevocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type AnonymousRevocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $AnonymousRevocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnonymousRevocation"
    objects: {
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      revokedPublicKeyHash: string | null
      proofR: string
      proofS: string
      proofMessage: string
      proofTimestamp: Date
      ringSignature: string | null
      ringPublicKeys: string | null
      chunksReencrypted: string
      revocationStrategy: string | null
      createdAt: Date
      executedBySystem: boolean
    }, ExtArgs["result"]["anonymousRevocation"]>
    composites: {}
  }

  type AnonymousRevocationGetPayload<S extends boolean | null | undefined | AnonymousRevocationDefaultArgs> = $Result.GetResult<Prisma.$AnonymousRevocationPayload, S>

  type AnonymousRevocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnonymousRevocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnonymousRevocationCountAggregateInputType | true
    }

  export interface AnonymousRevocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnonymousRevocation'], meta: { name: 'AnonymousRevocation' } }
    /**
     * Find zero or one AnonymousRevocation that matches the filter.
     * @param {AnonymousRevocationFindUniqueArgs} args - Arguments to find a AnonymousRevocation
     * @example
     * // Get one AnonymousRevocation
     * const anonymousRevocation = await prisma.anonymousRevocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnonymousRevocationFindUniqueArgs>(args: SelectSubset<T, AnonymousRevocationFindUniqueArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AnonymousRevocation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnonymousRevocationFindUniqueOrThrowArgs} args - Arguments to find a AnonymousRevocation
     * @example
     * // Get one AnonymousRevocation
     * const anonymousRevocation = await prisma.anonymousRevocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnonymousRevocationFindUniqueOrThrowArgs>(args: SelectSubset<T, AnonymousRevocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AnonymousRevocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationFindFirstArgs} args - Arguments to find a AnonymousRevocation
     * @example
     * // Get one AnonymousRevocation
     * const anonymousRevocation = await prisma.anonymousRevocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnonymousRevocationFindFirstArgs>(args?: SelectSubset<T, AnonymousRevocationFindFirstArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AnonymousRevocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationFindFirstOrThrowArgs} args - Arguments to find a AnonymousRevocation
     * @example
     * // Get one AnonymousRevocation
     * const anonymousRevocation = await prisma.anonymousRevocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnonymousRevocationFindFirstOrThrowArgs>(args?: SelectSubset<T, AnonymousRevocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AnonymousRevocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnonymousRevocations
     * const anonymousRevocations = await prisma.anonymousRevocation.findMany()
     * 
     * // Get first 10 AnonymousRevocations
     * const anonymousRevocations = await prisma.anonymousRevocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anonymousRevocationWithIdOnly = await prisma.anonymousRevocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnonymousRevocationFindManyArgs>(args?: SelectSubset<T, AnonymousRevocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AnonymousRevocation.
     * @param {AnonymousRevocationCreateArgs} args - Arguments to create a AnonymousRevocation.
     * @example
     * // Create one AnonymousRevocation
     * const AnonymousRevocation = await prisma.anonymousRevocation.create({
     *   data: {
     *     // ... data to create a AnonymousRevocation
     *   }
     * })
     * 
     */
    create<T extends AnonymousRevocationCreateArgs>(args: SelectSubset<T, AnonymousRevocationCreateArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AnonymousRevocations.
     * @param {AnonymousRevocationCreateManyArgs} args - Arguments to create many AnonymousRevocations.
     * @example
     * // Create many AnonymousRevocations
     * const anonymousRevocation = await prisma.anonymousRevocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnonymousRevocationCreateManyArgs>(args?: SelectSubset<T, AnonymousRevocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnonymousRevocations and returns the data saved in the database.
     * @param {AnonymousRevocationCreateManyAndReturnArgs} args - Arguments to create many AnonymousRevocations.
     * @example
     * // Create many AnonymousRevocations
     * const anonymousRevocation = await prisma.anonymousRevocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnonymousRevocations and only return the `id`
     * const anonymousRevocationWithIdOnly = await prisma.anonymousRevocation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnonymousRevocationCreateManyAndReturnArgs>(args?: SelectSubset<T, AnonymousRevocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AnonymousRevocation.
     * @param {AnonymousRevocationDeleteArgs} args - Arguments to delete one AnonymousRevocation.
     * @example
     * // Delete one AnonymousRevocation
     * const AnonymousRevocation = await prisma.anonymousRevocation.delete({
     *   where: {
     *     // ... filter to delete one AnonymousRevocation
     *   }
     * })
     * 
     */
    delete<T extends AnonymousRevocationDeleteArgs>(args: SelectSubset<T, AnonymousRevocationDeleteArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AnonymousRevocation.
     * @param {AnonymousRevocationUpdateArgs} args - Arguments to update one AnonymousRevocation.
     * @example
     * // Update one AnonymousRevocation
     * const anonymousRevocation = await prisma.anonymousRevocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnonymousRevocationUpdateArgs>(args: SelectSubset<T, AnonymousRevocationUpdateArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AnonymousRevocations.
     * @param {AnonymousRevocationDeleteManyArgs} args - Arguments to filter AnonymousRevocations to delete.
     * @example
     * // Delete a few AnonymousRevocations
     * const { count } = await prisma.anonymousRevocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnonymousRevocationDeleteManyArgs>(args?: SelectSubset<T, AnonymousRevocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnonymousRevocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnonymousRevocations
     * const anonymousRevocation = await prisma.anonymousRevocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnonymousRevocationUpdateManyArgs>(args: SelectSubset<T, AnonymousRevocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnonymousRevocation.
     * @param {AnonymousRevocationUpsertArgs} args - Arguments to update or create a AnonymousRevocation.
     * @example
     * // Update or create a AnonymousRevocation
     * const anonymousRevocation = await prisma.anonymousRevocation.upsert({
     *   create: {
     *     // ... data to create a AnonymousRevocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnonymousRevocation we want to update
     *   }
     * })
     */
    upsert<T extends AnonymousRevocationUpsertArgs>(args: SelectSubset<T, AnonymousRevocationUpsertArgs<ExtArgs>>): Prisma__AnonymousRevocationClient<$Result.GetResult<Prisma.$AnonymousRevocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AnonymousRevocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationCountArgs} args - Arguments to filter AnonymousRevocations to count.
     * @example
     * // Count the number of AnonymousRevocations
     * const count = await prisma.anonymousRevocation.count({
     *   where: {
     *     // ... the filter for the AnonymousRevocations we want to count
     *   }
     * })
    **/
    count<T extends AnonymousRevocationCountArgs>(
      args?: Subset<T, AnonymousRevocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnonymousRevocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnonymousRevocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnonymousRevocationAggregateArgs>(args: Subset<T, AnonymousRevocationAggregateArgs>): Prisma.PrismaPromise<GetAnonymousRevocationAggregateType<T>>

    /**
     * Group by AnonymousRevocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousRevocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnonymousRevocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnonymousRevocationGroupByArgs['orderBy'] }
        : { orderBy?: AnonymousRevocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnonymousRevocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnonymousRevocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnonymousRevocation model
   */
  readonly fields: AnonymousRevocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnonymousRevocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnonymousRevocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnonymousRevocation model
   */ 
  interface AnonymousRevocationFieldRefs {
    readonly id: FieldRef<"AnonymousRevocation", 'String'>
    readonly fileId: FieldRef<"AnonymousRevocation", 'String'>
    readonly revokedPublicKeyHash: FieldRef<"AnonymousRevocation", 'String'>
    readonly proofR: FieldRef<"AnonymousRevocation", 'String'>
    readonly proofS: FieldRef<"AnonymousRevocation", 'String'>
    readonly proofMessage: FieldRef<"AnonymousRevocation", 'String'>
    readonly proofTimestamp: FieldRef<"AnonymousRevocation", 'DateTime'>
    readonly ringSignature: FieldRef<"AnonymousRevocation", 'String'>
    readonly ringPublicKeys: FieldRef<"AnonymousRevocation", 'String'>
    readonly chunksReencrypted: FieldRef<"AnonymousRevocation", 'String'>
    readonly revocationStrategy: FieldRef<"AnonymousRevocation", 'String'>
    readonly createdAt: FieldRef<"AnonymousRevocation", 'DateTime'>
    readonly executedBySystem: FieldRef<"AnonymousRevocation", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * AnonymousRevocation findUnique
   */
  export type AnonymousRevocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousRevocation to fetch.
     */
    where: AnonymousRevocationWhereUniqueInput
  }

  /**
   * AnonymousRevocation findUniqueOrThrow
   */
  export type AnonymousRevocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousRevocation to fetch.
     */
    where: AnonymousRevocationWhereUniqueInput
  }

  /**
   * AnonymousRevocation findFirst
   */
  export type AnonymousRevocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousRevocation to fetch.
     */
    where?: AnonymousRevocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousRevocations to fetch.
     */
    orderBy?: AnonymousRevocationOrderByWithRelationInput | AnonymousRevocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousRevocations.
     */
    cursor?: AnonymousRevocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousRevocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousRevocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousRevocations.
     */
    distinct?: AnonymousRevocationScalarFieldEnum | AnonymousRevocationScalarFieldEnum[]
  }

  /**
   * AnonymousRevocation findFirstOrThrow
   */
  export type AnonymousRevocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousRevocation to fetch.
     */
    where?: AnonymousRevocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousRevocations to fetch.
     */
    orderBy?: AnonymousRevocationOrderByWithRelationInput | AnonymousRevocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousRevocations.
     */
    cursor?: AnonymousRevocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousRevocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousRevocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousRevocations.
     */
    distinct?: AnonymousRevocationScalarFieldEnum | AnonymousRevocationScalarFieldEnum[]
  }

  /**
   * AnonymousRevocation findMany
   */
  export type AnonymousRevocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousRevocations to fetch.
     */
    where?: AnonymousRevocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousRevocations to fetch.
     */
    orderBy?: AnonymousRevocationOrderByWithRelationInput | AnonymousRevocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnonymousRevocations.
     */
    cursor?: AnonymousRevocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousRevocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousRevocations.
     */
    skip?: number
    distinct?: AnonymousRevocationScalarFieldEnum | AnonymousRevocationScalarFieldEnum[]
  }

  /**
   * AnonymousRevocation create
   */
  export type AnonymousRevocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * The data needed to create a AnonymousRevocation.
     */
    data: XOR<AnonymousRevocationCreateInput, AnonymousRevocationUncheckedCreateInput>
  }

  /**
   * AnonymousRevocation createMany
   */
  export type AnonymousRevocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnonymousRevocations.
     */
    data: AnonymousRevocationCreateManyInput | AnonymousRevocationCreateManyInput[]
  }

  /**
   * AnonymousRevocation createManyAndReturn
   */
  export type AnonymousRevocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AnonymousRevocations.
     */
    data: AnonymousRevocationCreateManyInput | AnonymousRevocationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnonymousRevocation update
   */
  export type AnonymousRevocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * The data needed to update a AnonymousRevocation.
     */
    data: XOR<AnonymousRevocationUpdateInput, AnonymousRevocationUncheckedUpdateInput>
    /**
     * Choose, which AnonymousRevocation to update.
     */
    where: AnonymousRevocationWhereUniqueInput
  }

  /**
   * AnonymousRevocation updateMany
   */
  export type AnonymousRevocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnonymousRevocations.
     */
    data: XOR<AnonymousRevocationUpdateManyMutationInput, AnonymousRevocationUncheckedUpdateManyInput>
    /**
     * Filter which AnonymousRevocations to update
     */
    where?: AnonymousRevocationWhereInput
  }

  /**
   * AnonymousRevocation upsert
   */
  export type AnonymousRevocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * The filter to search for the AnonymousRevocation to update in case it exists.
     */
    where: AnonymousRevocationWhereUniqueInput
    /**
     * In case the AnonymousRevocation found by the `where` argument doesn't exist, create a new AnonymousRevocation with this data.
     */
    create: XOR<AnonymousRevocationCreateInput, AnonymousRevocationUncheckedCreateInput>
    /**
     * In case the AnonymousRevocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnonymousRevocationUpdateInput, AnonymousRevocationUncheckedUpdateInput>
  }

  /**
   * AnonymousRevocation delete
   */
  export type AnonymousRevocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
    /**
     * Filter which AnonymousRevocation to delete.
     */
    where: AnonymousRevocationWhereUniqueInput
  }

  /**
   * AnonymousRevocation deleteMany
   */
  export type AnonymousRevocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousRevocations to delete
     */
    where?: AnonymousRevocationWhereInput
  }

  /**
   * AnonymousRevocation without action
   */
  export type AnonymousRevocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousRevocation
     */
    select?: AnonymousRevocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousRevocationInclude<ExtArgs> | null
  }


  /**
   * Model IntegrityAlert
   */

  export type AggregateIntegrityAlert = {
    _count: IntegrityAlertCountAggregateOutputType | null
    _avg: IntegrityAlertAvgAggregateOutputType | null
    _sum: IntegrityAlertSumAggregateOutputType | null
    _min: IntegrityAlertMinAggregateOutputType | null
    _max: IntegrityAlertMaxAggregateOutputType | null
  }

  export type IntegrityAlertAvgAggregateOutputType = {
    chunkIndex: number | null
  }

  export type IntegrityAlertSumAggregateOutputType = {
    chunkIndex: number | null
  }

  export type IntegrityAlertMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    chunkIndex: number | null
    expectedHash: string | null
    actualHash: string | null
    reportedByPublicKeyHash: string | null
    reportedAt: Date | null
    resolved: boolean | null
    resolvedAt: Date | null
    resolution: string | null
  }

  export type IntegrityAlertMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    chunkIndex: number | null
    expectedHash: string | null
    actualHash: string | null
    reportedByPublicKeyHash: string | null
    reportedAt: Date | null
    resolved: boolean | null
    resolvedAt: Date | null
    resolution: string | null
  }

  export type IntegrityAlertCountAggregateOutputType = {
    id: number
    fileId: number
    chunkIndex: number
    expectedHash: number
    actualHash: number
    reportedByPublicKeyHash: number
    reportedAt: number
    resolved: number
    resolvedAt: number
    resolution: number
    _all: number
  }


  export type IntegrityAlertAvgAggregateInputType = {
    chunkIndex?: true
  }

  export type IntegrityAlertSumAggregateInputType = {
    chunkIndex?: true
  }

  export type IntegrityAlertMinAggregateInputType = {
    id?: true
    fileId?: true
    chunkIndex?: true
    expectedHash?: true
    actualHash?: true
    reportedByPublicKeyHash?: true
    reportedAt?: true
    resolved?: true
    resolvedAt?: true
    resolution?: true
  }

  export type IntegrityAlertMaxAggregateInputType = {
    id?: true
    fileId?: true
    chunkIndex?: true
    expectedHash?: true
    actualHash?: true
    reportedByPublicKeyHash?: true
    reportedAt?: true
    resolved?: true
    resolvedAt?: true
    resolution?: true
  }

  export type IntegrityAlertCountAggregateInputType = {
    id?: true
    fileId?: true
    chunkIndex?: true
    expectedHash?: true
    actualHash?: true
    reportedByPublicKeyHash?: true
    reportedAt?: true
    resolved?: true
    resolvedAt?: true
    resolution?: true
    _all?: true
  }

  export type IntegrityAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrityAlert to aggregate.
     */
    where?: IntegrityAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityAlerts to fetch.
     */
    orderBy?: IntegrityAlertOrderByWithRelationInput | IntegrityAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IntegrityAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IntegrityAlerts
    **/
    _count?: true | IntegrityAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IntegrityAlertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IntegrityAlertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IntegrityAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IntegrityAlertMaxAggregateInputType
  }

  export type GetIntegrityAlertAggregateType<T extends IntegrityAlertAggregateArgs> = {
        [P in keyof T & keyof AggregateIntegrityAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntegrityAlert[P]>
      : GetScalarType<T[P], AggregateIntegrityAlert[P]>
  }




  export type IntegrityAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrityAlertWhereInput
    orderBy?: IntegrityAlertOrderByWithAggregationInput | IntegrityAlertOrderByWithAggregationInput[]
    by: IntegrityAlertScalarFieldEnum[] | IntegrityAlertScalarFieldEnum
    having?: IntegrityAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IntegrityAlertCountAggregateInputType | true
    _avg?: IntegrityAlertAvgAggregateInputType
    _sum?: IntegrityAlertSumAggregateInputType
    _min?: IntegrityAlertMinAggregateInputType
    _max?: IntegrityAlertMaxAggregateInputType
  }

  export type IntegrityAlertGroupByOutputType = {
    id: string
    fileId: string
    chunkIndex: number
    expectedHash: string
    actualHash: string | null
    reportedByPublicKeyHash: string
    reportedAt: Date
    resolved: boolean
    resolvedAt: Date | null
    resolution: string | null
    _count: IntegrityAlertCountAggregateOutputType | null
    _avg: IntegrityAlertAvgAggregateOutputType | null
    _sum: IntegrityAlertSumAggregateOutputType | null
    _min: IntegrityAlertMinAggregateOutputType | null
    _max: IntegrityAlertMaxAggregateOutputType | null
  }

  type GetIntegrityAlertGroupByPayload<T extends IntegrityAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IntegrityAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IntegrityAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IntegrityAlertGroupByOutputType[P]>
            : GetScalarType<T[P], IntegrityAlertGroupByOutputType[P]>
        }
      >
    >


  export type IntegrityAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    chunkIndex?: boolean
    expectedHash?: boolean
    actualHash?: boolean
    reportedByPublicKeyHash?: boolean
    reportedAt?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolution?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integrityAlert"]>

  export type IntegrityAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    chunkIndex?: boolean
    expectedHash?: boolean
    actualHash?: boolean
    reportedByPublicKeyHash?: boolean
    reportedAt?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolution?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integrityAlert"]>

  export type IntegrityAlertSelectScalar = {
    id?: boolean
    fileId?: boolean
    chunkIndex?: boolean
    expectedHash?: boolean
    actualHash?: boolean
    reportedByPublicKeyHash?: boolean
    reportedAt?: boolean
    resolved?: boolean
    resolvedAt?: boolean
    resolution?: boolean
  }

  export type IntegrityAlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type IntegrityAlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $IntegrityAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IntegrityAlert"
    objects: {
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      chunkIndex: number
      expectedHash: string
      actualHash: string | null
      reportedByPublicKeyHash: string
      reportedAt: Date
      resolved: boolean
      resolvedAt: Date | null
      resolution: string | null
    }, ExtArgs["result"]["integrityAlert"]>
    composites: {}
  }

  type IntegrityAlertGetPayload<S extends boolean | null | undefined | IntegrityAlertDefaultArgs> = $Result.GetResult<Prisma.$IntegrityAlertPayload, S>

  type IntegrityAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IntegrityAlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IntegrityAlertCountAggregateInputType | true
    }

  export interface IntegrityAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IntegrityAlert'], meta: { name: 'IntegrityAlert' } }
    /**
     * Find zero or one IntegrityAlert that matches the filter.
     * @param {IntegrityAlertFindUniqueArgs} args - Arguments to find a IntegrityAlert
     * @example
     * // Get one IntegrityAlert
     * const integrityAlert = await prisma.integrityAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IntegrityAlertFindUniqueArgs>(args: SelectSubset<T, IntegrityAlertFindUniqueArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one IntegrityAlert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IntegrityAlertFindUniqueOrThrowArgs} args - Arguments to find a IntegrityAlert
     * @example
     * // Get one IntegrityAlert
     * const integrityAlert = await prisma.integrityAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IntegrityAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, IntegrityAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first IntegrityAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertFindFirstArgs} args - Arguments to find a IntegrityAlert
     * @example
     * // Get one IntegrityAlert
     * const integrityAlert = await prisma.integrityAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IntegrityAlertFindFirstArgs>(args?: SelectSubset<T, IntegrityAlertFindFirstArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first IntegrityAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertFindFirstOrThrowArgs} args - Arguments to find a IntegrityAlert
     * @example
     * // Get one IntegrityAlert
     * const integrityAlert = await prisma.integrityAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IntegrityAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, IntegrityAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more IntegrityAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IntegrityAlerts
     * const integrityAlerts = await prisma.integrityAlert.findMany()
     * 
     * // Get first 10 IntegrityAlerts
     * const integrityAlerts = await prisma.integrityAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const integrityAlertWithIdOnly = await prisma.integrityAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IntegrityAlertFindManyArgs>(args?: SelectSubset<T, IntegrityAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a IntegrityAlert.
     * @param {IntegrityAlertCreateArgs} args - Arguments to create a IntegrityAlert.
     * @example
     * // Create one IntegrityAlert
     * const IntegrityAlert = await prisma.integrityAlert.create({
     *   data: {
     *     // ... data to create a IntegrityAlert
     *   }
     * })
     * 
     */
    create<T extends IntegrityAlertCreateArgs>(args: SelectSubset<T, IntegrityAlertCreateArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many IntegrityAlerts.
     * @param {IntegrityAlertCreateManyArgs} args - Arguments to create many IntegrityAlerts.
     * @example
     * // Create many IntegrityAlerts
     * const integrityAlert = await prisma.integrityAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IntegrityAlertCreateManyArgs>(args?: SelectSubset<T, IntegrityAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IntegrityAlerts and returns the data saved in the database.
     * @param {IntegrityAlertCreateManyAndReturnArgs} args - Arguments to create many IntegrityAlerts.
     * @example
     * // Create many IntegrityAlerts
     * const integrityAlert = await prisma.integrityAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IntegrityAlerts and only return the `id`
     * const integrityAlertWithIdOnly = await prisma.integrityAlert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IntegrityAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, IntegrityAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a IntegrityAlert.
     * @param {IntegrityAlertDeleteArgs} args - Arguments to delete one IntegrityAlert.
     * @example
     * // Delete one IntegrityAlert
     * const IntegrityAlert = await prisma.integrityAlert.delete({
     *   where: {
     *     // ... filter to delete one IntegrityAlert
     *   }
     * })
     * 
     */
    delete<T extends IntegrityAlertDeleteArgs>(args: SelectSubset<T, IntegrityAlertDeleteArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one IntegrityAlert.
     * @param {IntegrityAlertUpdateArgs} args - Arguments to update one IntegrityAlert.
     * @example
     * // Update one IntegrityAlert
     * const integrityAlert = await prisma.integrityAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IntegrityAlertUpdateArgs>(args: SelectSubset<T, IntegrityAlertUpdateArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more IntegrityAlerts.
     * @param {IntegrityAlertDeleteManyArgs} args - Arguments to filter IntegrityAlerts to delete.
     * @example
     * // Delete a few IntegrityAlerts
     * const { count } = await prisma.integrityAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IntegrityAlertDeleteManyArgs>(args?: SelectSubset<T, IntegrityAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrityAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IntegrityAlerts
     * const integrityAlert = await prisma.integrityAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IntegrityAlertUpdateManyArgs>(args: SelectSubset<T, IntegrityAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one IntegrityAlert.
     * @param {IntegrityAlertUpsertArgs} args - Arguments to update or create a IntegrityAlert.
     * @example
     * // Update or create a IntegrityAlert
     * const integrityAlert = await prisma.integrityAlert.upsert({
     *   create: {
     *     // ... data to create a IntegrityAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IntegrityAlert we want to update
     *   }
     * })
     */
    upsert<T extends IntegrityAlertUpsertArgs>(args: SelectSubset<T, IntegrityAlertUpsertArgs<ExtArgs>>): Prisma__IntegrityAlertClient<$Result.GetResult<Prisma.$IntegrityAlertPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of IntegrityAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertCountArgs} args - Arguments to filter IntegrityAlerts to count.
     * @example
     * // Count the number of IntegrityAlerts
     * const count = await prisma.integrityAlert.count({
     *   where: {
     *     // ... the filter for the IntegrityAlerts we want to count
     *   }
     * })
    **/
    count<T extends IntegrityAlertCountArgs>(
      args?: Subset<T, IntegrityAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IntegrityAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IntegrityAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IntegrityAlertAggregateArgs>(args: Subset<T, IntegrityAlertAggregateArgs>): Prisma.PrismaPromise<GetIntegrityAlertAggregateType<T>>

    /**
     * Group by IntegrityAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrityAlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IntegrityAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IntegrityAlertGroupByArgs['orderBy'] }
        : { orderBy?: IntegrityAlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IntegrityAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrityAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IntegrityAlert model
   */
  readonly fields: IntegrityAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IntegrityAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IntegrityAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IntegrityAlert model
   */ 
  interface IntegrityAlertFieldRefs {
    readonly id: FieldRef<"IntegrityAlert", 'String'>
    readonly fileId: FieldRef<"IntegrityAlert", 'String'>
    readonly chunkIndex: FieldRef<"IntegrityAlert", 'Int'>
    readonly expectedHash: FieldRef<"IntegrityAlert", 'String'>
    readonly actualHash: FieldRef<"IntegrityAlert", 'String'>
    readonly reportedByPublicKeyHash: FieldRef<"IntegrityAlert", 'String'>
    readonly reportedAt: FieldRef<"IntegrityAlert", 'DateTime'>
    readonly resolved: FieldRef<"IntegrityAlert", 'Boolean'>
    readonly resolvedAt: FieldRef<"IntegrityAlert", 'DateTime'>
    readonly resolution: FieldRef<"IntegrityAlert", 'String'>
  }
    

  // Custom InputTypes
  /**
   * IntegrityAlert findUnique
   */
  export type IntegrityAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * Filter, which IntegrityAlert to fetch.
     */
    where: IntegrityAlertWhereUniqueInput
  }

  /**
   * IntegrityAlert findUniqueOrThrow
   */
  export type IntegrityAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * Filter, which IntegrityAlert to fetch.
     */
    where: IntegrityAlertWhereUniqueInput
  }

  /**
   * IntegrityAlert findFirst
   */
  export type IntegrityAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * Filter, which IntegrityAlert to fetch.
     */
    where?: IntegrityAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityAlerts to fetch.
     */
    orderBy?: IntegrityAlertOrderByWithRelationInput | IntegrityAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrityAlerts.
     */
    cursor?: IntegrityAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrityAlerts.
     */
    distinct?: IntegrityAlertScalarFieldEnum | IntegrityAlertScalarFieldEnum[]
  }

  /**
   * IntegrityAlert findFirstOrThrow
   */
  export type IntegrityAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * Filter, which IntegrityAlert to fetch.
     */
    where?: IntegrityAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityAlerts to fetch.
     */
    orderBy?: IntegrityAlertOrderByWithRelationInput | IntegrityAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrityAlerts.
     */
    cursor?: IntegrityAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrityAlerts.
     */
    distinct?: IntegrityAlertScalarFieldEnum | IntegrityAlertScalarFieldEnum[]
  }

  /**
   * IntegrityAlert findMany
   */
  export type IntegrityAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * Filter, which IntegrityAlerts to fetch.
     */
    where?: IntegrityAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrityAlerts to fetch.
     */
    orderBy?: IntegrityAlertOrderByWithRelationInput | IntegrityAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IntegrityAlerts.
     */
    cursor?: IntegrityAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrityAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrityAlerts.
     */
    skip?: number
    distinct?: IntegrityAlertScalarFieldEnum | IntegrityAlertScalarFieldEnum[]
  }

  /**
   * IntegrityAlert create
   */
  export type IntegrityAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * The data needed to create a IntegrityAlert.
     */
    data: XOR<IntegrityAlertCreateInput, IntegrityAlertUncheckedCreateInput>
  }

  /**
   * IntegrityAlert createMany
   */
  export type IntegrityAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IntegrityAlerts.
     */
    data: IntegrityAlertCreateManyInput | IntegrityAlertCreateManyInput[]
  }

  /**
   * IntegrityAlert createManyAndReturn
   */
  export type IntegrityAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many IntegrityAlerts.
     */
    data: IntegrityAlertCreateManyInput | IntegrityAlertCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * IntegrityAlert update
   */
  export type IntegrityAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * The data needed to update a IntegrityAlert.
     */
    data: XOR<IntegrityAlertUpdateInput, IntegrityAlertUncheckedUpdateInput>
    /**
     * Choose, which IntegrityAlert to update.
     */
    where: IntegrityAlertWhereUniqueInput
  }

  /**
   * IntegrityAlert updateMany
   */
  export type IntegrityAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IntegrityAlerts.
     */
    data: XOR<IntegrityAlertUpdateManyMutationInput, IntegrityAlertUncheckedUpdateManyInput>
    /**
     * Filter which IntegrityAlerts to update
     */
    where?: IntegrityAlertWhereInput
  }

  /**
   * IntegrityAlert upsert
   */
  export type IntegrityAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * The filter to search for the IntegrityAlert to update in case it exists.
     */
    where: IntegrityAlertWhereUniqueInput
    /**
     * In case the IntegrityAlert found by the `where` argument doesn't exist, create a new IntegrityAlert with this data.
     */
    create: XOR<IntegrityAlertCreateInput, IntegrityAlertUncheckedCreateInput>
    /**
     * In case the IntegrityAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IntegrityAlertUpdateInput, IntegrityAlertUncheckedUpdateInput>
  }

  /**
   * IntegrityAlert delete
   */
  export type IntegrityAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
    /**
     * Filter which IntegrityAlert to delete.
     */
    where: IntegrityAlertWhereUniqueInput
  }

  /**
   * IntegrityAlert deleteMany
   */
  export type IntegrityAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrityAlerts to delete
     */
    where?: IntegrityAlertWhereInput
  }

  /**
   * IntegrityAlert without action
   */
  export type IntegrityAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrityAlert
     */
    select?: IntegrityAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrityAlertInclude<ExtArgs> | null
  }


  /**
   * Model AnonymousFileAccess
   */

  export type AggregateAnonymousFileAccess = {
    _count: AnonymousFileAccessCountAggregateOutputType | null
    _avg: AnonymousFileAccessAvgAggregateOutputType | null
    _sum: AnonymousFileAccessSumAggregateOutputType | null
    _min: AnonymousFileAccessMinAggregateOutputType | null
    _max: AnonymousFileAccessMaxAggregateOutputType | null
  }

  export type AnonymousFileAccessAvgAggregateOutputType = {
    accessCount: number | null
  }

  export type AnonymousFileAccessSumAggregateOutputType = {
    accessCount: number | null
  }

  export type AnonymousFileAccessMinAggregateOutputType = {
    id: string | null
    accessorPublicKeyHash: string | null
    fileId: string | null
    grantedAt: Date | null
    expiresAt: Date | null
    lastAccessProof: string | null
    lastAccessAt: Date | null
    accessCount: number | null
    keyStatus: string | null
    keyPackageFingerprint: string | null
    status: string | null
    revokedAt: Date | null
    lastOwnerProof: string | null
  }

  export type AnonymousFileAccessMaxAggregateOutputType = {
    id: string | null
    accessorPublicKeyHash: string | null
    fileId: string | null
    grantedAt: Date | null
    expiresAt: Date | null
    lastAccessProof: string | null
    lastAccessAt: Date | null
    accessCount: number | null
    keyStatus: string | null
    keyPackageFingerprint: string | null
    status: string | null
    revokedAt: Date | null
    lastOwnerProof: string | null
  }

  export type AnonymousFileAccessCountAggregateOutputType = {
    id: number
    accessorPublicKeyHash: number
    fileId: number
    grantedAt: number
    expiresAt: number
    lastAccessProof: number
    lastAccessAt: number
    accessCount: number
    keyStatus: number
    keyPackageFingerprint: number
    status: number
    revokedAt: number
    lastOwnerProof: number
    _all: number
  }


  export type AnonymousFileAccessAvgAggregateInputType = {
    accessCount?: true
  }

  export type AnonymousFileAccessSumAggregateInputType = {
    accessCount?: true
  }

  export type AnonymousFileAccessMinAggregateInputType = {
    id?: true
    accessorPublicKeyHash?: true
    fileId?: true
    grantedAt?: true
    expiresAt?: true
    lastAccessProof?: true
    lastAccessAt?: true
    accessCount?: true
    keyStatus?: true
    keyPackageFingerprint?: true
    status?: true
    revokedAt?: true
    lastOwnerProof?: true
  }

  export type AnonymousFileAccessMaxAggregateInputType = {
    id?: true
    accessorPublicKeyHash?: true
    fileId?: true
    grantedAt?: true
    expiresAt?: true
    lastAccessProof?: true
    lastAccessAt?: true
    accessCount?: true
    keyStatus?: true
    keyPackageFingerprint?: true
    status?: true
    revokedAt?: true
    lastOwnerProof?: true
  }

  export type AnonymousFileAccessCountAggregateInputType = {
    id?: true
    accessorPublicKeyHash?: true
    fileId?: true
    grantedAt?: true
    expiresAt?: true
    lastAccessProof?: true
    lastAccessAt?: true
    accessCount?: true
    keyStatus?: true
    keyPackageFingerprint?: true
    status?: true
    revokedAt?: true
    lastOwnerProof?: true
    _all?: true
  }

  export type AnonymousFileAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousFileAccess to aggregate.
     */
    where?: AnonymousFileAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousFileAccesses to fetch.
     */
    orderBy?: AnonymousFileAccessOrderByWithRelationInput | AnonymousFileAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnonymousFileAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousFileAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousFileAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnonymousFileAccesses
    **/
    _count?: true | AnonymousFileAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnonymousFileAccessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnonymousFileAccessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnonymousFileAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnonymousFileAccessMaxAggregateInputType
  }

  export type GetAnonymousFileAccessAggregateType<T extends AnonymousFileAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateAnonymousFileAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnonymousFileAccess[P]>
      : GetScalarType<T[P], AggregateAnonymousFileAccess[P]>
  }




  export type AnonymousFileAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousFileAccessWhereInput
    orderBy?: AnonymousFileAccessOrderByWithAggregationInput | AnonymousFileAccessOrderByWithAggregationInput[]
    by: AnonymousFileAccessScalarFieldEnum[] | AnonymousFileAccessScalarFieldEnum
    having?: AnonymousFileAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnonymousFileAccessCountAggregateInputType | true
    _avg?: AnonymousFileAccessAvgAggregateInputType
    _sum?: AnonymousFileAccessSumAggregateInputType
    _min?: AnonymousFileAccessMinAggregateInputType
    _max?: AnonymousFileAccessMaxAggregateInputType
  }

  export type AnonymousFileAccessGroupByOutputType = {
    id: string
    accessorPublicKeyHash: string
    fileId: string
    grantedAt: Date
    expiresAt: Date | null
    lastAccessProof: string | null
    lastAccessAt: Date | null
    accessCount: number
    keyStatus: string
    keyPackageFingerprint: string | null
    status: string
    revokedAt: Date | null
    lastOwnerProof: string | null
    _count: AnonymousFileAccessCountAggregateOutputType | null
    _avg: AnonymousFileAccessAvgAggregateOutputType | null
    _sum: AnonymousFileAccessSumAggregateOutputType | null
    _min: AnonymousFileAccessMinAggregateOutputType | null
    _max: AnonymousFileAccessMaxAggregateOutputType | null
  }

  type GetAnonymousFileAccessGroupByPayload<T extends AnonymousFileAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnonymousFileAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnonymousFileAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnonymousFileAccessGroupByOutputType[P]>
            : GetScalarType<T[P], AnonymousFileAccessGroupByOutputType[P]>
        }
      >
    >


  export type AnonymousFileAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accessorPublicKeyHash?: boolean
    fileId?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    lastAccessProof?: boolean
    lastAccessAt?: boolean
    accessCount?: boolean
    keyStatus?: boolean
    keyPackageFingerprint?: boolean
    status?: boolean
    revokedAt?: boolean
    lastOwnerProof?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anonymousFileAccess"]>

  export type AnonymousFileAccessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accessorPublicKeyHash?: boolean
    fileId?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    lastAccessProof?: boolean
    lastAccessAt?: boolean
    accessCount?: boolean
    keyStatus?: boolean
    keyPackageFingerprint?: boolean
    status?: boolean
    revokedAt?: boolean
    lastOwnerProof?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anonymousFileAccess"]>

  export type AnonymousFileAccessSelectScalar = {
    id?: boolean
    accessorPublicKeyHash?: boolean
    fileId?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    lastAccessProof?: boolean
    lastAccessAt?: boolean
    accessCount?: boolean
    keyStatus?: boolean
    keyPackageFingerprint?: boolean
    status?: boolean
    revokedAt?: boolean
    lastOwnerProof?: boolean
  }

  export type AnonymousFileAccessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type AnonymousFileAccessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $AnonymousFileAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnonymousFileAccess"
    objects: {
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accessorPublicKeyHash: string
      fileId: string
      grantedAt: Date
      expiresAt: Date | null
      lastAccessProof: string | null
      lastAccessAt: Date | null
      accessCount: number
      keyStatus: string
      keyPackageFingerprint: string | null
      status: string
      revokedAt: Date | null
      lastOwnerProof: string | null
    }, ExtArgs["result"]["anonymousFileAccess"]>
    composites: {}
  }

  type AnonymousFileAccessGetPayload<S extends boolean | null | undefined | AnonymousFileAccessDefaultArgs> = $Result.GetResult<Prisma.$AnonymousFileAccessPayload, S>

  type AnonymousFileAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnonymousFileAccessFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnonymousFileAccessCountAggregateInputType | true
    }

  export interface AnonymousFileAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnonymousFileAccess'], meta: { name: 'AnonymousFileAccess' } }
    /**
     * Find zero or one AnonymousFileAccess that matches the filter.
     * @param {AnonymousFileAccessFindUniqueArgs} args - Arguments to find a AnonymousFileAccess
     * @example
     * // Get one AnonymousFileAccess
     * const anonymousFileAccess = await prisma.anonymousFileAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnonymousFileAccessFindUniqueArgs>(args: SelectSubset<T, AnonymousFileAccessFindUniqueArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AnonymousFileAccess that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnonymousFileAccessFindUniqueOrThrowArgs} args - Arguments to find a AnonymousFileAccess
     * @example
     * // Get one AnonymousFileAccess
     * const anonymousFileAccess = await prisma.anonymousFileAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnonymousFileAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, AnonymousFileAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AnonymousFileAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessFindFirstArgs} args - Arguments to find a AnonymousFileAccess
     * @example
     * // Get one AnonymousFileAccess
     * const anonymousFileAccess = await prisma.anonymousFileAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnonymousFileAccessFindFirstArgs>(args?: SelectSubset<T, AnonymousFileAccessFindFirstArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AnonymousFileAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessFindFirstOrThrowArgs} args - Arguments to find a AnonymousFileAccess
     * @example
     * // Get one AnonymousFileAccess
     * const anonymousFileAccess = await prisma.anonymousFileAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnonymousFileAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, AnonymousFileAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AnonymousFileAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnonymousFileAccesses
     * const anonymousFileAccesses = await prisma.anonymousFileAccess.findMany()
     * 
     * // Get first 10 AnonymousFileAccesses
     * const anonymousFileAccesses = await prisma.anonymousFileAccess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anonymousFileAccessWithIdOnly = await prisma.anonymousFileAccess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnonymousFileAccessFindManyArgs>(args?: SelectSubset<T, AnonymousFileAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AnonymousFileAccess.
     * @param {AnonymousFileAccessCreateArgs} args - Arguments to create a AnonymousFileAccess.
     * @example
     * // Create one AnonymousFileAccess
     * const AnonymousFileAccess = await prisma.anonymousFileAccess.create({
     *   data: {
     *     // ... data to create a AnonymousFileAccess
     *   }
     * })
     * 
     */
    create<T extends AnonymousFileAccessCreateArgs>(args: SelectSubset<T, AnonymousFileAccessCreateArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AnonymousFileAccesses.
     * @param {AnonymousFileAccessCreateManyArgs} args - Arguments to create many AnonymousFileAccesses.
     * @example
     * // Create many AnonymousFileAccesses
     * const anonymousFileAccess = await prisma.anonymousFileAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnonymousFileAccessCreateManyArgs>(args?: SelectSubset<T, AnonymousFileAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnonymousFileAccesses and returns the data saved in the database.
     * @param {AnonymousFileAccessCreateManyAndReturnArgs} args - Arguments to create many AnonymousFileAccesses.
     * @example
     * // Create many AnonymousFileAccesses
     * const anonymousFileAccess = await prisma.anonymousFileAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnonymousFileAccesses and only return the `id`
     * const anonymousFileAccessWithIdOnly = await prisma.anonymousFileAccess.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnonymousFileAccessCreateManyAndReturnArgs>(args?: SelectSubset<T, AnonymousFileAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AnonymousFileAccess.
     * @param {AnonymousFileAccessDeleteArgs} args - Arguments to delete one AnonymousFileAccess.
     * @example
     * // Delete one AnonymousFileAccess
     * const AnonymousFileAccess = await prisma.anonymousFileAccess.delete({
     *   where: {
     *     // ... filter to delete one AnonymousFileAccess
     *   }
     * })
     * 
     */
    delete<T extends AnonymousFileAccessDeleteArgs>(args: SelectSubset<T, AnonymousFileAccessDeleteArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AnonymousFileAccess.
     * @param {AnonymousFileAccessUpdateArgs} args - Arguments to update one AnonymousFileAccess.
     * @example
     * // Update one AnonymousFileAccess
     * const anonymousFileAccess = await prisma.anonymousFileAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnonymousFileAccessUpdateArgs>(args: SelectSubset<T, AnonymousFileAccessUpdateArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AnonymousFileAccesses.
     * @param {AnonymousFileAccessDeleteManyArgs} args - Arguments to filter AnonymousFileAccesses to delete.
     * @example
     * // Delete a few AnonymousFileAccesses
     * const { count } = await prisma.anonymousFileAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnonymousFileAccessDeleteManyArgs>(args?: SelectSubset<T, AnonymousFileAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnonymousFileAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnonymousFileAccesses
     * const anonymousFileAccess = await prisma.anonymousFileAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnonymousFileAccessUpdateManyArgs>(args: SelectSubset<T, AnonymousFileAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnonymousFileAccess.
     * @param {AnonymousFileAccessUpsertArgs} args - Arguments to update or create a AnonymousFileAccess.
     * @example
     * // Update or create a AnonymousFileAccess
     * const anonymousFileAccess = await prisma.anonymousFileAccess.upsert({
     *   create: {
     *     // ... data to create a AnonymousFileAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnonymousFileAccess we want to update
     *   }
     * })
     */
    upsert<T extends AnonymousFileAccessUpsertArgs>(args: SelectSubset<T, AnonymousFileAccessUpsertArgs<ExtArgs>>): Prisma__AnonymousFileAccessClient<$Result.GetResult<Prisma.$AnonymousFileAccessPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AnonymousFileAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessCountArgs} args - Arguments to filter AnonymousFileAccesses to count.
     * @example
     * // Count the number of AnonymousFileAccesses
     * const count = await prisma.anonymousFileAccess.count({
     *   where: {
     *     // ... the filter for the AnonymousFileAccesses we want to count
     *   }
     * })
    **/
    count<T extends AnonymousFileAccessCountArgs>(
      args?: Subset<T, AnonymousFileAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnonymousFileAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnonymousFileAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnonymousFileAccessAggregateArgs>(args: Subset<T, AnonymousFileAccessAggregateArgs>): Prisma.PrismaPromise<GetAnonymousFileAccessAggregateType<T>>

    /**
     * Group by AnonymousFileAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousFileAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnonymousFileAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnonymousFileAccessGroupByArgs['orderBy'] }
        : { orderBy?: AnonymousFileAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnonymousFileAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnonymousFileAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnonymousFileAccess model
   */
  readonly fields: AnonymousFileAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnonymousFileAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnonymousFileAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnonymousFileAccess model
   */ 
  interface AnonymousFileAccessFieldRefs {
    readonly id: FieldRef<"AnonymousFileAccess", 'String'>
    readonly accessorPublicKeyHash: FieldRef<"AnonymousFileAccess", 'String'>
    readonly fileId: FieldRef<"AnonymousFileAccess", 'String'>
    readonly grantedAt: FieldRef<"AnonymousFileAccess", 'DateTime'>
    readonly expiresAt: FieldRef<"AnonymousFileAccess", 'DateTime'>
    readonly lastAccessProof: FieldRef<"AnonymousFileAccess", 'String'>
    readonly lastAccessAt: FieldRef<"AnonymousFileAccess", 'DateTime'>
    readonly accessCount: FieldRef<"AnonymousFileAccess", 'Int'>
    readonly keyStatus: FieldRef<"AnonymousFileAccess", 'String'>
    readonly keyPackageFingerprint: FieldRef<"AnonymousFileAccess", 'String'>
    readonly status: FieldRef<"AnonymousFileAccess", 'String'>
    readonly revokedAt: FieldRef<"AnonymousFileAccess", 'DateTime'>
    readonly lastOwnerProof: FieldRef<"AnonymousFileAccess", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AnonymousFileAccess findUnique
   */
  export type AnonymousFileAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousFileAccess to fetch.
     */
    where: AnonymousFileAccessWhereUniqueInput
  }

  /**
   * AnonymousFileAccess findUniqueOrThrow
   */
  export type AnonymousFileAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousFileAccess to fetch.
     */
    where: AnonymousFileAccessWhereUniqueInput
  }

  /**
   * AnonymousFileAccess findFirst
   */
  export type AnonymousFileAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousFileAccess to fetch.
     */
    where?: AnonymousFileAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousFileAccesses to fetch.
     */
    orderBy?: AnonymousFileAccessOrderByWithRelationInput | AnonymousFileAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousFileAccesses.
     */
    cursor?: AnonymousFileAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousFileAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousFileAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousFileAccesses.
     */
    distinct?: AnonymousFileAccessScalarFieldEnum | AnonymousFileAccessScalarFieldEnum[]
  }

  /**
   * AnonymousFileAccess findFirstOrThrow
   */
  export type AnonymousFileAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousFileAccess to fetch.
     */
    where?: AnonymousFileAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousFileAccesses to fetch.
     */
    orderBy?: AnonymousFileAccessOrderByWithRelationInput | AnonymousFileAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousFileAccesses.
     */
    cursor?: AnonymousFileAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousFileAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousFileAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousFileAccesses.
     */
    distinct?: AnonymousFileAccessScalarFieldEnum | AnonymousFileAccessScalarFieldEnum[]
  }

  /**
   * AnonymousFileAccess findMany
   */
  export type AnonymousFileAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousFileAccesses to fetch.
     */
    where?: AnonymousFileAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousFileAccesses to fetch.
     */
    orderBy?: AnonymousFileAccessOrderByWithRelationInput | AnonymousFileAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnonymousFileAccesses.
     */
    cursor?: AnonymousFileAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousFileAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousFileAccesses.
     */
    skip?: number
    distinct?: AnonymousFileAccessScalarFieldEnum | AnonymousFileAccessScalarFieldEnum[]
  }

  /**
   * AnonymousFileAccess create
   */
  export type AnonymousFileAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * The data needed to create a AnonymousFileAccess.
     */
    data: XOR<AnonymousFileAccessCreateInput, AnonymousFileAccessUncheckedCreateInput>
  }

  /**
   * AnonymousFileAccess createMany
   */
  export type AnonymousFileAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnonymousFileAccesses.
     */
    data: AnonymousFileAccessCreateManyInput | AnonymousFileAccessCreateManyInput[]
  }

  /**
   * AnonymousFileAccess createManyAndReturn
   */
  export type AnonymousFileAccessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AnonymousFileAccesses.
     */
    data: AnonymousFileAccessCreateManyInput | AnonymousFileAccessCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnonymousFileAccess update
   */
  export type AnonymousFileAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * The data needed to update a AnonymousFileAccess.
     */
    data: XOR<AnonymousFileAccessUpdateInput, AnonymousFileAccessUncheckedUpdateInput>
    /**
     * Choose, which AnonymousFileAccess to update.
     */
    where: AnonymousFileAccessWhereUniqueInput
  }

  /**
   * AnonymousFileAccess updateMany
   */
  export type AnonymousFileAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnonymousFileAccesses.
     */
    data: XOR<AnonymousFileAccessUpdateManyMutationInput, AnonymousFileAccessUncheckedUpdateManyInput>
    /**
     * Filter which AnonymousFileAccesses to update
     */
    where?: AnonymousFileAccessWhereInput
  }

  /**
   * AnonymousFileAccess upsert
   */
  export type AnonymousFileAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * The filter to search for the AnonymousFileAccess to update in case it exists.
     */
    where: AnonymousFileAccessWhereUniqueInput
    /**
     * In case the AnonymousFileAccess found by the `where` argument doesn't exist, create a new AnonymousFileAccess with this data.
     */
    create: XOR<AnonymousFileAccessCreateInput, AnonymousFileAccessUncheckedCreateInput>
    /**
     * In case the AnonymousFileAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnonymousFileAccessUpdateInput, AnonymousFileAccessUncheckedUpdateInput>
  }

  /**
   * AnonymousFileAccess delete
   */
  export type AnonymousFileAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
    /**
     * Filter which AnonymousFileAccess to delete.
     */
    where: AnonymousFileAccessWhereUniqueInput
  }

  /**
   * AnonymousFileAccess deleteMany
   */
  export type AnonymousFileAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousFileAccesses to delete
     */
    where?: AnonymousFileAccessWhereInput
  }

  /**
   * AnonymousFileAccess without action
   */
  export type AnonymousFileAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousFileAccess
     */
    select?: AnonymousFileAccessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousFileAccessInclude<ExtArgs> | null
  }


  /**
   * Model AnonymousAuditLog
   */

  export type AggregateAnonymousAuditLog = {
    _count: AnonymousAuditLogCountAggregateOutputType | null
    _min: AnonymousAuditLogMinAggregateOutputType | null
    _max: AnonymousAuditLogMaxAggregateOutputType | null
  }

  export type AnonymousAuditLogMinAggregateOutputType = {
    id: string | null
    eventType: string | null
    fileId: string | null
    publicKeyHash: string | null
    deviceFingerprint: string | null
    ringSignature: string | null
    ringPublicKeys: string | null
    metadata: string | null
    timestamp: Date | null
    status: string | null
    revokedAt: Date | null
    lastOwnerProof: string | null
  }

  export type AnonymousAuditLogMaxAggregateOutputType = {
    id: string | null
    eventType: string | null
    fileId: string | null
    publicKeyHash: string | null
    deviceFingerprint: string | null
    ringSignature: string | null
    ringPublicKeys: string | null
    metadata: string | null
    timestamp: Date | null
    status: string | null
    revokedAt: Date | null
    lastOwnerProof: string | null
  }

  export type AnonymousAuditLogCountAggregateOutputType = {
    id: number
    eventType: number
    fileId: number
    publicKeyHash: number
    deviceFingerprint: number
    ringSignature: number
    ringPublicKeys: number
    metadata: number
    timestamp: number
    status: number
    revokedAt: number
    lastOwnerProof: number
    _all: number
  }


  export type AnonymousAuditLogMinAggregateInputType = {
    id?: true
    eventType?: true
    fileId?: true
    publicKeyHash?: true
    deviceFingerprint?: true
    ringSignature?: true
    ringPublicKeys?: true
    metadata?: true
    timestamp?: true
    status?: true
    revokedAt?: true
    lastOwnerProof?: true
  }

  export type AnonymousAuditLogMaxAggregateInputType = {
    id?: true
    eventType?: true
    fileId?: true
    publicKeyHash?: true
    deviceFingerprint?: true
    ringSignature?: true
    ringPublicKeys?: true
    metadata?: true
    timestamp?: true
    status?: true
    revokedAt?: true
    lastOwnerProof?: true
  }

  export type AnonymousAuditLogCountAggregateInputType = {
    id?: true
    eventType?: true
    fileId?: true
    publicKeyHash?: true
    deviceFingerprint?: true
    ringSignature?: true
    ringPublicKeys?: true
    metadata?: true
    timestamp?: true
    status?: true
    revokedAt?: true
    lastOwnerProof?: true
    _all?: true
  }

  export type AnonymousAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousAuditLog to aggregate.
     */
    where?: AnonymousAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAuditLogs to fetch.
     */
    orderBy?: AnonymousAuditLogOrderByWithRelationInput | AnonymousAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnonymousAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnonymousAuditLogs
    **/
    _count?: true | AnonymousAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnonymousAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnonymousAuditLogMaxAggregateInputType
  }

  export type GetAnonymousAuditLogAggregateType<T extends AnonymousAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAnonymousAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnonymousAuditLog[P]>
      : GetScalarType<T[P], AggregateAnonymousAuditLog[P]>
  }




  export type AnonymousAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousAuditLogWhereInput
    orderBy?: AnonymousAuditLogOrderByWithAggregationInput | AnonymousAuditLogOrderByWithAggregationInput[]
    by: AnonymousAuditLogScalarFieldEnum[] | AnonymousAuditLogScalarFieldEnum
    having?: AnonymousAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnonymousAuditLogCountAggregateInputType | true
    _min?: AnonymousAuditLogMinAggregateInputType
    _max?: AnonymousAuditLogMaxAggregateInputType
  }

  export type AnonymousAuditLogGroupByOutputType = {
    id: string
    eventType: string
    fileId: string | null
    publicKeyHash: string | null
    deviceFingerprint: string | null
    ringSignature: string | null
    ringPublicKeys: string | null
    metadata: string | null
    timestamp: Date
    status: string | null
    revokedAt: Date | null
    lastOwnerProof: string | null
    _count: AnonymousAuditLogCountAggregateOutputType | null
    _min: AnonymousAuditLogMinAggregateOutputType | null
    _max: AnonymousAuditLogMaxAggregateOutputType | null
  }

  type GetAnonymousAuditLogGroupByPayload<T extends AnonymousAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnonymousAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnonymousAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnonymousAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AnonymousAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AnonymousAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    fileId?: boolean
    publicKeyHash?: boolean
    deviceFingerprint?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    metadata?: boolean
    timestamp?: boolean
    status?: boolean
    revokedAt?: boolean
    lastOwnerProof?: boolean
  }, ExtArgs["result"]["anonymousAuditLog"]>

  export type AnonymousAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    fileId?: boolean
    publicKeyHash?: boolean
    deviceFingerprint?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    metadata?: boolean
    timestamp?: boolean
    status?: boolean
    revokedAt?: boolean
    lastOwnerProof?: boolean
  }, ExtArgs["result"]["anonymousAuditLog"]>

  export type AnonymousAuditLogSelectScalar = {
    id?: boolean
    eventType?: boolean
    fileId?: boolean
    publicKeyHash?: boolean
    deviceFingerprint?: boolean
    ringSignature?: boolean
    ringPublicKeys?: boolean
    metadata?: boolean
    timestamp?: boolean
    status?: boolean
    revokedAt?: boolean
    lastOwnerProof?: boolean
  }


  export type $AnonymousAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnonymousAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventType: string
      fileId: string | null
      publicKeyHash: string | null
      deviceFingerprint: string | null
      ringSignature: string | null
      ringPublicKeys: string | null
      metadata: string | null
      timestamp: Date
      status: string | null
      revokedAt: Date | null
      lastOwnerProof: string | null
    }, ExtArgs["result"]["anonymousAuditLog"]>
    composites: {}
  }

  type AnonymousAuditLogGetPayload<S extends boolean | null | undefined | AnonymousAuditLogDefaultArgs> = $Result.GetResult<Prisma.$AnonymousAuditLogPayload, S>

  type AnonymousAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnonymousAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnonymousAuditLogCountAggregateInputType | true
    }

  export interface AnonymousAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnonymousAuditLog'], meta: { name: 'AnonymousAuditLog' } }
    /**
     * Find zero or one AnonymousAuditLog that matches the filter.
     * @param {AnonymousAuditLogFindUniqueArgs} args - Arguments to find a AnonymousAuditLog
     * @example
     * // Get one AnonymousAuditLog
     * const anonymousAuditLog = await prisma.anonymousAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnonymousAuditLogFindUniqueArgs>(args: SelectSubset<T, AnonymousAuditLogFindUniqueArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AnonymousAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnonymousAuditLogFindUniqueOrThrowArgs} args - Arguments to find a AnonymousAuditLog
     * @example
     * // Get one AnonymousAuditLog
     * const anonymousAuditLog = await prisma.anonymousAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnonymousAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AnonymousAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AnonymousAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogFindFirstArgs} args - Arguments to find a AnonymousAuditLog
     * @example
     * // Get one AnonymousAuditLog
     * const anonymousAuditLog = await prisma.anonymousAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnonymousAuditLogFindFirstArgs>(args?: SelectSubset<T, AnonymousAuditLogFindFirstArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AnonymousAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogFindFirstOrThrowArgs} args - Arguments to find a AnonymousAuditLog
     * @example
     * // Get one AnonymousAuditLog
     * const anonymousAuditLog = await prisma.anonymousAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnonymousAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AnonymousAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AnonymousAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnonymousAuditLogs
     * const anonymousAuditLogs = await prisma.anonymousAuditLog.findMany()
     * 
     * // Get first 10 AnonymousAuditLogs
     * const anonymousAuditLogs = await prisma.anonymousAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anonymousAuditLogWithIdOnly = await prisma.anonymousAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnonymousAuditLogFindManyArgs>(args?: SelectSubset<T, AnonymousAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AnonymousAuditLog.
     * @param {AnonymousAuditLogCreateArgs} args - Arguments to create a AnonymousAuditLog.
     * @example
     * // Create one AnonymousAuditLog
     * const AnonymousAuditLog = await prisma.anonymousAuditLog.create({
     *   data: {
     *     // ... data to create a AnonymousAuditLog
     *   }
     * })
     * 
     */
    create<T extends AnonymousAuditLogCreateArgs>(args: SelectSubset<T, AnonymousAuditLogCreateArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AnonymousAuditLogs.
     * @param {AnonymousAuditLogCreateManyArgs} args - Arguments to create many AnonymousAuditLogs.
     * @example
     * // Create many AnonymousAuditLogs
     * const anonymousAuditLog = await prisma.anonymousAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnonymousAuditLogCreateManyArgs>(args?: SelectSubset<T, AnonymousAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnonymousAuditLogs and returns the data saved in the database.
     * @param {AnonymousAuditLogCreateManyAndReturnArgs} args - Arguments to create many AnonymousAuditLogs.
     * @example
     * // Create many AnonymousAuditLogs
     * const anonymousAuditLog = await prisma.anonymousAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnonymousAuditLogs and only return the `id`
     * const anonymousAuditLogWithIdOnly = await prisma.anonymousAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnonymousAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AnonymousAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AnonymousAuditLog.
     * @param {AnonymousAuditLogDeleteArgs} args - Arguments to delete one AnonymousAuditLog.
     * @example
     * // Delete one AnonymousAuditLog
     * const AnonymousAuditLog = await prisma.anonymousAuditLog.delete({
     *   where: {
     *     // ... filter to delete one AnonymousAuditLog
     *   }
     * })
     * 
     */
    delete<T extends AnonymousAuditLogDeleteArgs>(args: SelectSubset<T, AnonymousAuditLogDeleteArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AnonymousAuditLog.
     * @param {AnonymousAuditLogUpdateArgs} args - Arguments to update one AnonymousAuditLog.
     * @example
     * // Update one AnonymousAuditLog
     * const anonymousAuditLog = await prisma.anonymousAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnonymousAuditLogUpdateArgs>(args: SelectSubset<T, AnonymousAuditLogUpdateArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AnonymousAuditLogs.
     * @param {AnonymousAuditLogDeleteManyArgs} args - Arguments to filter AnonymousAuditLogs to delete.
     * @example
     * // Delete a few AnonymousAuditLogs
     * const { count } = await prisma.anonymousAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnonymousAuditLogDeleteManyArgs>(args?: SelectSubset<T, AnonymousAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnonymousAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnonymousAuditLogs
     * const anonymousAuditLog = await prisma.anonymousAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnonymousAuditLogUpdateManyArgs>(args: SelectSubset<T, AnonymousAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnonymousAuditLog.
     * @param {AnonymousAuditLogUpsertArgs} args - Arguments to update or create a AnonymousAuditLog.
     * @example
     * // Update or create a AnonymousAuditLog
     * const anonymousAuditLog = await prisma.anonymousAuditLog.upsert({
     *   create: {
     *     // ... data to create a AnonymousAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnonymousAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AnonymousAuditLogUpsertArgs>(args: SelectSubset<T, AnonymousAuditLogUpsertArgs<ExtArgs>>): Prisma__AnonymousAuditLogClient<$Result.GetResult<Prisma.$AnonymousAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AnonymousAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogCountArgs} args - Arguments to filter AnonymousAuditLogs to count.
     * @example
     * // Count the number of AnonymousAuditLogs
     * const count = await prisma.anonymousAuditLog.count({
     *   where: {
     *     // ... the filter for the AnonymousAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AnonymousAuditLogCountArgs>(
      args?: Subset<T, AnonymousAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnonymousAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnonymousAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnonymousAuditLogAggregateArgs>(args: Subset<T, AnonymousAuditLogAggregateArgs>): Prisma.PrismaPromise<GetAnonymousAuditLogAggregateType<T>>

    /**
     * Group by AnonymousAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnonymousAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnonymousAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AnonymousAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnonymousAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnonymousAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnonymousAuditLog model
   */
  readonly fields: AnonymousAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnonymousAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnonymousAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnonymousAuditLog model
   */ 
  interface AnonymousAuditLogFieldRefs {
    readonly id: FieldRef<"AnonymousAuditLog", 'String'>
    readonly eventType: FieldRef<"AnonymousAuditLog", 'String'>
    readonly fileId: FieldRef<"AnonymousAuditLog", 'String'>
    readonly publicKeyHash: FieldRef<"AnonymousAuditLog", 'String'>
    readonly deviceFingerprint: FieldRef<"AnonymousAuditLog", 'String'>
    readonly ringSignature: FieldRef<"AnonymousAuditLog", 'String'>
    readonly ringPublicKeys: FieldRef<"AnonymousAuditLog", 'String'>
    readonly metadata: FieldRef<"AnonymousAuditLog", 'String'>
    readonly timestamp: FieldRef<"AnonymousAuditLog", 'DateTime'>
    readonly status: FieldRef<"AnonymousAuditLog", 'String'>
    readonly revokedAt: FieldRef<"AnonymousAuditLog", 'DateTime'>
    readonly lastOwnerProof: FieldRef<"AnonymousAuditLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AnonymousAuditLog findUnique
   */
  export type AnonymousAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AnonymousAuditLog to fetch.
     */
    where: AnonymousAuditLogWhereUniqueInput
  }

  /**
   * AnonymousAuditLog findUniqueOrThrow
   */
  export type AnonymousAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AnonymousAuditLog to fetch.
     */
    where: AnonymousAuditLogWhereUniqueInput
  }

  /**
   * AnonymousAuditLog findFirst
   */
  export type AnonymousAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AnonymousAuditLog to fetch.
     */
    where?: AnonymousAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAuditLogs to fetch.
     */
    orderBy?: AnonymousAuditLogOrderByWithRelationInput | AnonymousAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousAuditLogs.
     */
    cursor?: AnonymousAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousAuditLogs.
     */
    distinct?: AnonymousAuditLogScalarFieldEnum | AnonymousAuditLogScalarFieldEnum[]
  }

  /**
   * AnonymousAuditLog findFirstOrThrow
   */
  export type AnonymousAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AnonymousAuditLog to fetch.
     */
    where?: AnonymousAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAuditLogs to fetch.
     */
    orderBy?: AnonymousAuditLogOrderByWithRelationInput | AnonymousAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousAuditLogs.
     */
    cursor?: AnonymousAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousAuditLogs.
     */
    distinct?: AnonymousAuditLogScalarFieldEnum | AnonymousAuditLogScalarFieldEnum[]
  }

  /**
   * AnonymousAuditLog findMany
   */
  export type AnonymousAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AnonymousAuditLogs to fetch.
     */
    where?: AnonymousAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAuditLogs to fetch.
     */
    orderBy?: AnonymousAuditLogOrderByWithRelationInput | AnonymousAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnonymousAuditLogs.
     */
    cursor?: AnonymousAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAuditLogs.
     */
    skip?: number
    distinct?: AnonymousAuditLogScalarFieldEnum | AnonymousAuditLogScalarFieldEnum[]
  }

  /**
   * AnonymousAuditLog create
   */
  export type AnonymousAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AnonymousAuditLog.
     */
    data: XOR<AnonymousAuditLogCreateInput, AnonymousAuditLogUncheckedCreateInput>
  }

  /**
   * AnonymousAuditLog createMany
   */
  export type AnonymousAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnonymousAuditLogs.
     */
    data: AnonymousAuditLogCreateManyInput | AnonymousAuditLogCreateManyInput[]
  }

  /**
   * AnonymousAuditLog createManyAndReturn
   */
  export type AnonymousAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AnonymousAuditLogs.
     */
    data: AnonymousAuditLogCreateManyInput | AnonymousAuditLogCreateManyInput[]
  }

  /**
   * AnonymousAuditLog update
   */
  export type AnonymousAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AnonymousAuditLog.
     */
    data: XOR<AnonymousAuditLogUpdateInput, AnonymousAuditLogUncheckedUpdateInput>
    /**
     * Choose, which AnonymousAuditLog to update.
     */
    where: AnonymousAuditLogWhereUniqueInput
  }

  /**
   * AnonymousAuditLog updateMany
   */
  export type AnonymousAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnonymousAuditLogs.
     */
    data: XOR<AnonymousAuditLogUpdateManyMutationInput, AnonymousAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AnonymousAuditLogs to update
     */
    where?: AnonymousAuditLogWhereInput
  }

  /**
   * AnonymousAuditLog upsert
   */
  export type AnonymousAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AnonymousAuditLog to update in case it exists.
     */
    where: AnonymousAuditLogWhereUniqueInput
    /**
     * In case the AnonymousAuditLog found by the `where` argument doesn't exist, create a new AnonymousAuditLog with this data.
     */
    create: XOR<AnonymousAuditLogCreateInput, AnonymousAuditLogUncheckedCreateInput>
    /**
     * In case the AnonymousAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnonymousAuditLogUpdateInput, AnonymousAuditLogUncheckedUpdateInput>
  }

  /**
   * AnonymousAuditLog delete
   */
  export type AnonymousAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
    /**
     * Filter which AnonymousAuditLog to delete.
     */
    where: AnonymousAuditLogWhereUniqueInput
  }

  /**
   * AnonymousAuditLog deleteMany
   */
  export type AnonymousAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousAuditLogs to delete
     */
    where?: AnonymousAuditLogWhereInput
  }

  /**
   * AnonymousAuditLog without action
   */
  export type AnonymousAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAuditLog
     */
    select?: AnonymousAuditLogSelect<ExtArgs> | null
  }


  /**
   * Model AnonymousSharingRequest
   */

  export type AggregateAnonymousSharingRequest = {
    _count: AnonymousSharingRequestCountAggregateOutputType | null
    _min: AnonymousSharingRequestMinAggregateOutputType | null
    _max: AnonymousSharingRequestMaxAggregateOutputType | null
  }

  export type AnonymousSharingRequestMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    sharerPublicKeyHash: string | null
    recipientPublicKeyHash: string | null
    ownershipProof: string | null
    ringSignature: string | null
    keyPackageFingerprint: string | null
    status: string | null
    requestedAt: Date | null
    respondedAt: Date | null
  }

  export type AnonymousSharingRequestMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    sharerPublicKeyHash: string | null
    recipientPublicKeyHash: string | null
    ownershipProof: string | null
    ringSignature: string | null
    keyPackageFingerprint: string | null
    status: string | null
    requestedAt: Date | null
    respondedAt: Date | null
  }

  export type AnonymousSharingRequestCountAggregateOutputType = {
    id: number
    fileId: number
    sharerPublicKeyHash: number
    recipientPublicKeyHash: number
    ownershipProof: number
    ringSignature: number
    keyPackageFingerprint: number
    status: number
    requestedAt: number
    respondedAt: number
    _all: number
  }


  export type AnonymousSharingRequestMinAggregateInputType = {
    id?: true
    fileId?: true
    sharerPublicKeyHash?: true
    recipientPublicKeyHash?: true
    ownershipProof?: true
    ringSignature?: true
    keyPackageFingerprint?: true
    status?: true
    requestedAt?: true
    respondedAt?: true
  }

  export type AnonymousSharingRequestMaxAggregateInputType = {
    id?: true
    fileId?: true
    sharerPublicKeyHash?: true
    recipientPublicKeyHash?: true
    ownershipProof?: true
    ringSignature?: true
    keyPackageFingerprint?: true
    status?: true
    requestedAt?: true
    respondedAt?: true
  }

  export type AnonymousSharingRequestCountAggregateInputType = {
    id?: true
    fileId?: true
    sharerPublicKeyHash?: true
    recipientPublicKeyHash?: true
    ownershipProof?: true
    ringSignature?: true
    keyPackageFingerprint?: true
    status?: true
    requestedAt?: true
    respondedAt?: true
    _all?: true
  }

  export type AnonymousSharingRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousSharingRequest to aggregate.
     */
    where?: AnonymousSharingRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousSharingRequests to fetch.
     */
    orderBy?: AnonymousSharingRequestOrderByWithRelationInput | AnonymousSharingRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnonymousSharingRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousSharingRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousSharingRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnonymousSharingRequests
    **/
    _count?: true | AnonymousSharingRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnonymousSharingRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnonymousSharingRequestMaxAggregateInputType
  }

  export type GetAnonymousSharingRequestAggregateType<T extends AnonymousSharingRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateAnonymousSharingRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnonymousSharingRequest[P]>
      : GetScalarType<T[P], AggregateAnonymousSharingRequest[P]>
  }




  export type AnonymousSharingRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousSharingRequestWhereInput
    orderBy?: AnonymousSharingRequestOrderByWithAggregationInput | AnonymousSharingRequestOrderByWithAggregationInput[]
    by: AnonymousSharingRequestScalarFieldEnum[] | AnonymousSharingRequestScalarFieldEnum
    having?: AnonymousSharingRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnonymousSharingRequestCountAggregateInputType | true
    _min?: AnonymousSharingRequestMinAggregateInputType
    _max?: AnonymousSharingRequestMaxAggregateInputType
  }

  export type AnonymousSharingRequestGroupByOutputType = {
    id: string
    fileId: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint: string | null
    status: string
    requestedAt: Date
    respondedAt: Date | null
    _count: AnonymousSharingRequestCountAggregateOutputType | null
    _min: AnonymousSharingRequestMinAggregateOutputType | null
    _max: AnonymousSharingRequestMaxAggregateOutputType | null
  }

  type GetAnonymousSharingRequestGroupByPayload<T extends AnonymousSharingRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnonymousSharingRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnonymousSharingRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnonymousSharingRequestGroupByOutputType[P]>
            : GetScalarType<T[P], AnonymousSharingRequestGroupByOutputType[P]>
        }
      >
    >


  export type AnonymousSharingRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    sharerPublicKeyHash?: boolean
    recipientPublicKeyHash?: boolean
    ownershipProof?: boolean
    ringSignature?: boolean
    keyPackageFingerprint?: boolean
    status?: boolean
    requestedAt?: boolean
    respondedAt?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anonymousSharingRequest"]>

  export type AnonymousSharingRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    sharerPublicKeyHash?: boolean
    recipientPublicKeyHash?: boolean
    ownershipProof?: boolean
    ringSignature?: boolean
    keyPackageFingerprint?: boolean
    status?: boolean
    requestedAt?: boolean
    respondedAt?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anonymousSharingRequest"]>

  export type AnonymousSharingRequestSelectScalar = {
    id?: boolean
    fileId?: boolean
    sharerPublicKeyHash?: boolean
    recipientPublicKeyHash?: boolean
    ownershipProof?: boolean
    ringSignature?: boolean
    keyPackageFingerprint?: boolean
    status?: boolean
    requestedAt?: boolean
    respondedAt?: boolean
  }

  export type AnonymousSharingRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type AnonymousSharingRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $AnonymousSharingRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnonymousSharingRequest"
    objects: {
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      sharerPublicKeyHash: string
      recipientPublicKeyHash: string
      ownershipProof: string
      ringSignature: string
      keyPackageFingerprint: string | null
      status: string
      requestedAt: Date
      respondedAt: Date | null
    }, ExtArgs["result"]["anonymousSharingRequest"]>
    composites: {}
  }

  type AnonymousSharingRequestGetPayload<S extends boolean | null | undefined | AnonymousSharingRequestDefaultArgs> = $Result.GetResult<Prisma.$AnonymousSharingRequestPayload, S>

  type AnonymousSharingRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnonymousSharingRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnonymousSharingRequestCountAggregateInputType | true
    }

  export interface AnonymousSharingRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnonymousSharingRequest'], meta: { name: 'AnonymousSharingRequest' } }
    /**
     * Find zero or one AnonymousSharingRequest that matches the filter.
     * @param {AnonymousSharingRequestFindUniqueArgs} args - Arguments to find a AnonymousSharingRequest
     * @example
     * // Get one AnonymousSharingRequest
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnonymousSharingRequestFindUniqueArgs>(args: SelectSubset<T, AnonymousSharingRequestFindUniqueArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AnonymousSharingRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnonymousSharingRequestFindUniqueOrThrowArgs} args - Arguments to find a AnonymousSharingRequest
     * @example
     * // Get one AnonymousSharingRequest
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnonymousSharingRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, AnonymousSharingRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AnonymousSharingRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestFindFirstArgs} args - Arguments to find a AnonymousSharingRequest
     * @example
     * // Get one AnonymousSharingRequest
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnonymousSharingRequestFindFirstArgs>(args?: SelectSubset<T, AnonymousSharingRequestFindFirstArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AnonymousSharingRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestFindFirstOrThrowArgs} args - Arguments to find a AnonymousSharingRequest
     * @example
     * // Get one AnonymousSharingRequest
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnonymousSharingRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, AnonymousSharingRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AnonymousSharingRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnonymousSharingRequests
     * const anonymousSharingRequests = await prisma.anonymousSharingRequest.findMany()
     * 
     * // Get first 10 AnonymousSharingRequests
     * const anonymousSharingRequests = await prisma.anonymousSharingRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anonymousSharingRequestWithIdOnly = await prisma.anonymousSharingRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnonymousSharingRequestFindManyArgs>(args?: SelectSubset<T, AnonymousSharingRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AnonymousSharingRequest.
     * @param {AnonymousSharingRequestCreateArgs} args - Arguments to create a AnonymousSharingRequest.
     * @example
     * // Create one AnonymousSharingRequest
     * const AnonymousSharingRequest = await prisma.anonymousSharingRequest.create({
     *   data: {
     *     // ... data to create a AnonymousSharingRequest
     *   }
     * })
     * 
     */
    create<T extends AnonymousSharingRequestCreateArgs>(args: SelectSubset<T, AnonymousSharingRequestCreateArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AnonymousSharingRequests.
     * @param {AnonymousSharingRequestCreateManyArgs} args - Arguments to create many AnonymousSharingRequests.
     * @example
     * // Create many AnonymousSharingRequests
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnonymousSharingRequestCreateManyArgs>(args?: SelectSubset<T, AnonymousSharingRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnonymousSharingRequests and returns the data saved in the database.
     * @param {AnonymousSharingRequestCreateManyAndReturnArgs} args - Arguments to create many AnonymousSharingRequests.
     * @example
     * // Create many AnonymousSharingRequests
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnonymousSharingRequests and only return the `id`
     * const anonymousSharingRequestWithIdOnly = await prisma.anonymousSharingRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnonymousSharingRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, AnonymousSharingRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AnonymousSharingRequest.
     * @param {AnonymousSharingRequestDeleteArgs} args - Arguments to delete one AnonymousSharingRequest.
     * @example
     * // Delete one AnonymousSharingRequest
     * const AnonymousSharingRequest = await prisma.anonymousSharingRequest.delete({
     *   where: {
     *     // ... filter to delete one AnonymousSharingRequest
     *   }
     * })
     * 
     */
    delete<T extends AnonymousSharingRequestDeleteArgs>(args: SelectSubset<T, AnonymousSharingRequestDeleteArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AnonymousSharingRequest.
     * @param {AnonymousSharingRequestUpdateArgs} args - Arguments to update one AnonymousSharingRequest.
     * @example
     * // Update one AnonymousSharingRequest
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnonymousSharingRequestUpdateArgs>(args: SelectSubset<T, AnonymousSharingRequestUpdateArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AnonymousSharingRequests.
     * @param {AnonymousSharingRequestDeleteManyArgs} args - Arguments to filter AnonymousSharingRequests to delete.
     * @example
     * // Delete a few AnonymousSharingRequests
     * const { count } = await prisma.anonymousSharingRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnonymousSharingRequestDeleteManyArgs>(args?: SelectSubset<T, AnonymousSharingRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnonymousSharingRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnonymousSharingRequests
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnonymousSharingRequestUpdateManyArgs>(args: SelectSubset<T, AnonymousSharingRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnonymousSharingRequest.
     * @param {AnonymousSharingRequestUpsertArgs} args - Arguments to update or create a AnonymousSharingRequest.
     * @example
     * // Update or create a AnonymousSharingRequest
     * const anonymousSharingRequest = await prisma.anonymousSharingRequest.upsert({
     *   create: {
     *     // ... data to create a AnonymousSharingRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnonymousSharingRequest we want to update
     *   }
     * })
     */
    upsert<T extends AnonymousSharingRequestUpsertArgs>(args: SelectSubset<T, AnonymousSharingRequestUpsertArgs<ExtArgs>>): Prisma__AnonymousSharingRequestClient<$Result.GetResult<Prisma.$AnonymousSharingRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AnonymousSharingRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestCountArgs} args - Arguments to filter AnonymousSharingRequests to count.
     * @example
     * // Count the number of AnonymousSharingRequests
     * const count = await prisma.anonymousSharingRequest.count({
     *   where: {
     *     // ... the filter for the AnonymousSharingRequests we want to count
     *   }
     * })
    **/
    count<T extends AnonymousSharingRequestCountArgs>(
      args?: Subset<T, AnonymousSharingRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnonymousSharingRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnonymousSharingRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnonymousSharingRequestAggregateArgs>(args: Subset<T, AnonymousSharingRequestAggregateArgs>): Prisma.PrismaPromise<GetAnonymousSharingRequestAggregateType<T>>

    /**
     * Group by AnonymousSharingRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousSharingRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnonymousSharingRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnonymousSharingRequestGroupByArgs['orderBy'] }
        : { orderBy?: AnonymousSharingRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnonymousSharingRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnonymousSharingRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnonymousSharingRequest model
   */
  readonly fields: AnonymousSharingRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnonymousSharingRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnonymousSharingRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnonymousSharingRequest model
   */ 
  interface AnonymousSharingRequestFieldRefs {
    readonly id: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly fileId: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly sharerPublicKeyHash: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly recipientPublicKeyHash: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly ownershipProof: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly ringSignature: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly keyPackageFingerprint: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly status: FieldRef<"AnonymousSharingRequest", 'String'>
    readonly requestedAt: FieldRef<"AnonymousSharingRequest", 'DateTime'>
    readonly respondedAt: FieldRef<"AnonymousSharingRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnonymousSharingRequest findUnique
   */
  export type AnonymousSharingRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousSharingRequest to fetch.
     */
    where: AnonymousSharingRequestWhereUniqueInput
  }

  /**
   * AnonymousSharingRequest findUniqueOrThrow
   */
  export type AnonymousSharingRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousSharingRequest to fetch.
     */
    where: AnonymousSharingRequestWhereUniqueInput
  }

  /**
   * AnonymousSharingRequest findFirst
   */
  export type AnonymousSharingRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousSharingRequest to fetch.
     */
    where?: AnonymousSharingRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousSharingRequests to fetch.
     */
    orderBy?: AnonymousSharingRequestOrderByWithRelationInput | AnonymousSharingRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousSharingRequests.
     */
    cursor?: AnonymousSharingRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousSharingRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousSharingRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousSharingRequests.
     */
    distinct?: AnonymousSharingRequestScalarFieldEnum | AnonymousSharingRequestScalarFieldEnum[]
  }

  /**
   * AnonymousSharingRequest findFirstOrThrow
   */
  export type AnonymousSharingRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousSharingRequest to fetch.
     */
    where?: AnonymousSharingRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousSharingRequests to fetch.
     */
    orderBy?: AnonymousSharingRequestOrderByWithRelationInput | AnonymousSharingRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousSharingRequests.
     */
    cursor?: AnonymousSharingRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousSharingRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousSharingRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousSharingRequests.
     */
    distinct?: AnonymousSharingRequestScalarFieldEnum | AnonymousSharingRequestScalarFieldEnum[]
  }

  /**
   * AnonymousSharingRequest findMany
   */
  export type AnonymousSharingRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * Filter, which AnonymousSharingRequests to fetch.
     */
    where?: AnonymousSharingRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousSharingRequests to fetch.
     */
    orderBy?: AnonymousSharingRequestOrderByWithRelationInput | AnonymousSharingRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnonymousSharingRequests.
     */
    cursor?: AnonymousSharingRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousSharingRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousSharingRequests.
     */
    skip?: number
    distinct?: AnonymousSharingRequestScalarFieldEnum | AnonymousSharingRequestScalarFieldEnum[]
  }

  /**
   * AnonymousSharingRequest create
   */
  export type AnonymousSharingRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a AnonymousSharingRequest.
     */
    data: XOR<AnonymousSharingRequestCreateInput, AnonymousSharingRequestUncheckedCreateInput>
  }

  /**
   * AnonymousSharingRequest createMany
   */
  export type AnonymousSharingRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnonymousSharingRequests.
     */
    data: AnonymousSharingRequestCreateManyInput | AnonymousSharingRequestCreateManyInput[]
  }

  /**
   * AnonymousSharingRequest createManyAndReturn
   */
  export type AnonymousSharingRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AnonymousSharingRequests.
     */
    data: AnonymousSharingRequestCreateManyInput | AnonymousSharingRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnonymousSharingRequest update
   */
  export type AnonymousSharingRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a AnonymousSharingRequest.
     */
    data: XOR<AnonymousSharingRequestUpdateInput, AnonymousSharingRequestUncheckedUpdateInput>
    /**
     * Choose, which AnonymousSharingRequest to update.
     */
    where: AnonymousSharingRequestWhereUniqueInput
  }

  /**
   * AnonymousSharingRequest updateMany
   */
  export type AnonymousSharingRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnonymousSharingRequests.
     */
    data: XOR<AnonymousSharingRequestUpdateManyMutationInput, AnonymousSharingRequestUncheckedUpdateManyInput>
    /**
     * Filter which AnonymousSharingRequests to update
     */
    where?: AnonymousSharingRequestWhereInput
  }

  /**
   * AnonymousSharingRequest upsert
   */
  export type AnonymousSharingRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the AnonymousSharingRequest to update in case it exists.
     */
    where: AnonymousSharingRequestWhereUniqueInput
    /**
     * In case the AnonymousSharingRequest found by the `where` argument doesn't exist, create a new AnonymousSharingRequest with this data.
     */
    create: XOR<AnonymousSharingRequestCreateInput, AnonymousSharingRequestUncheckedCreateInput>
    /**
     * In case the AnonymousSharingRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnonymousSharingRequestUpdateInput, AnonymousSharingRequestUncheckedUpdateInput>
  }

  /**
   * AnonymousSharingRequest delete
   */
  export type AnonymousSharingRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
    /**
     * Filter which AnonymousSharingRequest to delete.
     */
    where: AnonymousSharingRequestWhereUniqueInput
  }

  /**
   * AnonymousSharingRequest deleteMany
   */
  export type AnonymousSharingRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousSharingRequests to delete
     */
    where?: AnonymousSharingRequestWhereInput
  }

  /**
   * AnonymousSharingRequest without action
   */
  export type AnonymousSharingRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousSharingRequest
     */
    select?: AnonymousSharingRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnonymousSharingRequestInclude<ExtArgs> | null
  }


  /**
   * Model Signature
   */

  export type AggregateSignature = {
    _count: SignatureCountAggregateOutputType | null
    _min: SignatureMinAggregateOutputType | null
    _max: SignatureMaxAggregateOutputType | null
  }

  export type SignatureMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    signerId: string | null
    ringUserIds: string | null
    signature: string | null
    isOpened: boolean | null
    openingProof: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignatureMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    signerId: string | null
    ringUserIds: string | null
    signature: string | null
    isOpened: boolean | null
    openingProof: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignatureCountAggregateOutputType = {
    id: number
    fileId: number
    signerId: number
    ringUserIds: number
    signature: number
    isOpened: number
    openingProof: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SignatureMinAggregateInputType = {
    id?: true
    fileId?: true
    signerId?: true
    ringUserIds?: true
    signature?: true
    isOpened?: true
    openingProof?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignatureMaxAggregateInputType = {
    id?: true
    fileId?: true
    signerId?: true
    ringUserIds?: true
    signature?: true
    isOpened?: true
    openingProof?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignatureCountAggregateInputType = {
    id?: true
    fileId?: true
    signerId?: true
    ringUserIds?: true
    signature?: true
    isOpened?: true
    openingProof?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SignatureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Signature to aggregate.
     */
    where?: SignatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signatures to fetch.
     */
    orderBy?: SignatureOrderByWithRelationInput | SignatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SignatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Signatures
    **/
    _count?: true | SignatureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SignatureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SignatureMaxAggregateInputType
  }

  export type GetSignatureAggregateType<T extends SignatureAggregateArgs> = {
        [P in keyof T & keyof AggregateSignature]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSignature[P]>
      : GetScalarType<T[P], AggregateSignature[P]>
  }




  export type SignatureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignatureWhereInput
    orderBy?: SignatureOrderByWithAggregationInput | SignatureOrderByWithAggregationInput[]
    by: SignatureScalarFieldEnum[] | SignatureScalarFieldEnum
    having?: SignatureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SignatureCountAggregateInputType | true
    _min?: SignatureMinAggregateInputType
    _max?: SignatureMaxAggregateInputType
  }

  export type SignatureGroupByOutputType = {
    id: string
    fileId: string
    signerId: string
    ringUserIds: string
    signature: string
    isOpened: boolean
    openingProof: string | null
    createdAt: Date
    updatedAt: Date
    _count: SignatureCountAggregateOutputType | null
    _min: SignatureMinAggregateOutputType | null
    _max: SignatureMaxAggregateOutputType | null
  }

  type GetSignatureGroupByPayload<T extends SignatureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SignatureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SignatureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SignatureGroupByOutputType[P]>
            : GetScalarType<T[P], SignatureGroupByOutputType[P]>
        }
      >
    >


  export type SignatureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    signerId?: boolean
    ringUserIds?: boolean
    signature?: boolean
    isOpened?: boolean
    openingProof?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    signer?: boolean | UserDefaultArgs<ExtArgs>
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signature"]>

  export type SignatureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    signerId?: boolean
    ringUserIds?: boolean
    signature?: boolean
    isOpened?: boolean
    openingProof?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    signer?: boolean | UserDefaultArgs<ExtArgs>
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signature"]>

  export type SignatureSelectScalar = {
    id?: boolean
    fileId?: boolean
    signerId?: boolean
    ringUserIds?: boolean
    signature?: boolean
    isOpened?: boolean
    openingProof?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SignatureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    signer?: boolean | UserDefaultArgs<ExtArgs>
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type SignatureIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    signer?: boolean | UserDefaultArgs<ExtArgs>
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $SignaturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Signature"
    objects: {
      signer: Prisma.$UserPayload<ExtArgs>
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      signerId: string
      ringUserIds: string
      signature: string
      isOpened: boolean
      openingProof: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["signature"]>
    composites: {}
  }

  type SignatureGetPayload<S extends boolean | null | undefined | SignatureDefaultArgs> = $Result.GetResult<Prisma.$SignaturePayload, S>

  type SignatureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SignatureFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SignatureCountAggregateInputType | true
    }

  export interface SignatureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Signature'], meta: { name: 'Signature' } }
    /**
     * Find zero or one Signature that matches the filter.
     * @param {SignatureFindUniqueArgs} args - Arguments to find a Signature
     * @example
     * // Get one Signature
     * const signature = await prisma.signature.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SignatureFindUniqueArgs>(args: SelectSubset<T, SignatureFindUniqueArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Signature that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SignatureFindUniqueOrThrowArgs} args - Arguments to find a Signature
     * @example
     * // Get one Signature
     * const signature = await prisma.signature.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SignatureFindUniqueOrThrowArgs>(args: SelectSubset<T, SignatureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Signature that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureFindFirstArgs} args - Arguments to find a Signature
     * @example
     * // Get one Signature
     * const signature = await prisma.signature.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SignatureFindFirstArgs>(args?: SelectSubset<T, SignatureFindFirstArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Signature that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureFindFirstOrThrowArgs} args - Arguments to find a Signature
     * @example
     * // Get one Signature
     * const signature = await prisma.signature.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SignatureFindFirstOrThrowArgs>(args?: SelectSubset<T, SignatureFindFirstOrThrowArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Signatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Signatures
     * const signatures = await prisma.signature.findMany()
     * 
     * // Get first 10 Signatures
     * const signatures = await prisma.signature.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const signatureWithIdOnly = await prisma.signature.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SignatureFindManyArgs>(args?: SelectSubset<T, SignatureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Signature.
     * @param {SignatureCreateArgs} args - Arguments to create a Signature.
     * @example
     * // Create one Signature
     * const Signature = await prisma.signature.create({
     *   data: {
     *     // ... data to create a Signature
     *   }
     * })
     * 
     */
    create<T extends SignatureCreateArgs>(args: SelectSubset<T, SignatureCreateArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Signatures.
     * @param {SignatureCreateManyArgs} args - Arguments to create many Signatures.
     * @example
     * // Create many Signatures
     * const signature = await prisma.signature.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SignatureCreateManyArgs>(args?: SelectSubset<T, SignatureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Signatures and returns the data saved in the database.
     * @param {SignatureCreateManyAndReturnArgs} args - Arguments to create many Signatures.
     * @example
     * // Create many Signatures
     * const signature = await prisma.signature.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Signatures and only return the `id`
     * const signatureWithIdOnly = await prisma.signature.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SignatureCreateManyAndReturnArgs>(args?: SelectSubset<T, SignatureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Signature.
     * @param {SignatureDeleteArgs} args - Arguments to delete one Signature.
     * @example
     * // Delete one Signature
     * const Signature = await prisma.signature.delete({
     *   where: {
     *     // ... filter to delete one Signature
     *   }
     * })
     * 
     */
    delete<T extends SignatureDeleteArgs>(args: SelectSubset<T, SignatureDeleteArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Signature.
     * @param {SignatureUpdateArgs} args - Arguments to update one Signature.
     * @example
     * // Update one Signature
     * const signature = await prisma.signature.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SignatureUpdateArgs>(args: SelectSubset<T, SignatureUpdateArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Signatures.
     * @param {SignatureDeleteManyArgs} args - Arguments to filter Signatures to delete.
     * @example
     * // Delete a few Signatures
     * const { count } = await prisma.signature.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SignatureDeleteManyArgs>(args?: SelectSubset<T, SignatureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Signatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Signatures
     * const signature = await prisma.signature.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SignatureUpdateManyArgs>(args: SelectSubset<T, SignatureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Signature.
     * @param {SignatureUpsertArgs} args - Arguments to update or create a Signature.
     * @example
     * // Update or create a Signature
     * const signature = await prisma.signature.upsert({
     *   create: {
     *     // ... data to create a Signature
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Signature we want to update
     *   }
     * })
     */
    upsert<T extends SignatureUpsertArgs>(args: SelectSubset<T, SignatureUpsertArgs<ExtArgs>>): Prisma__SignatureClient<$Result.GetResult<Prisma.$SignaturePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Signatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureCountArgs} args - Arguments to filter Signatures to count.
     * @example
     * // Count the number of Signatures
     * const count = await prisma.signature.count({
     *   where: {
     *     // ... the filter for the Signatures we want to count
     *   }
     * })
    **/
    count<T extends SignatureCountArgs>(
      args?: Subset<T, SignatureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SignatureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Signature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SignatureAggregateArgs>(args: Subset<T, SignatureAggregateArgs>): Prisma.PrismaPromise<GetSignatureAggregateType<T>>

    /**
     * Group by Signature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignatureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SignatureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SignatureGroupByArgs['orderBy'] }
        : { orderBy?: SignatureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SignatureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSignatureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Signature model
   */
  readonly fields: SignatureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Signature.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SignatureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    signer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Signature model
   */ 
  interface SignatureFieldRefs {
    readonly id: FieldRef<"Signature", 'String'>
    readonly fileId: FieldRef<"Signature", 'String'>
    readonly signerId: FieldRef<"Signature", 'String'>
    readonly ringUserIds: FieldRef<"Signature", 'String'>
    readonly signature: FieldRef<"Signature", 'String'>
    readonly isOpened: FieldRef<"Signature", 'Boolean'>
    readonly openingProof: FieldRef<"Signature", 'String'>
    readonly createdAt: FieldRef<"Signature", 'DateTime'>
    readonly updatedAt: FieldRef<"Signature", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Signature findUnique
   */
  export type SignatureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * Filter, which Signature to fetch.
     */
    where: SignatureWhereUniqueInput
  }

  /**
   * Signature findUniqueOrThrow
   */
  export type SignatureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * Filter, which Signature to fetch.
     */
    where: SignatureWhereUniqueInput
  }

  /**
   * Signature findFirst
   */
  export type SignatureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * Filter, which Signature to fetch.
     */
    where?: SignatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signatures to fetch.
     */
    orderBy?: SignatureOrderByWithRelationInput | SignatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Signatures.
     */
    cursor?: SignatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Signatures.
     */
    distinct?: SignatureScalarFieldEnum | SignatureScalarFieldEnum[]
  }

  /**
   * Signature findFirstOrThrow
   */
  export type SignatureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * Filter, which Signature to fetch.
     */
    where?: SignatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signatures to fetch.
     */
    orderBy?: SignatureOrderByWithRelationInput | SignatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Signatures.
     */
    cursor?: SignatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Signatures.
     */
    distinct?: SignatureScalarFieldEnum | SignatureScalarFieldEnum[]
  }

  /**
   * Signature findMany
   */
  export type SignatureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * Filter, which Signatures to fetch.
     */
    where?: SignatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signatures to fetch.
     */
    orderBy?: SignatureOrderByWithRelationInput | SignatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Signatures.
     */
    cursor?: SignatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signatures.
     */
    skip?: number
    distinct?: SignatureScalarFieldEnum | SignatureScalarFieldEnum[]
  }

  /**
   * Signature create
   */
  export type SignatureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * The data needed to create a Signature.
     */
    data: XOR<SignatureCreateInput, SignatureUncheckedCreateInput>
  }

  /**
   * Signature createMany
   */
  export type SignatureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Signatures.
     */
    data: SignatureCreateManyInput | SignatureCreateManyInput[]
  }

  /**
   * Signature createManyAndReturn
   */
  export type SignatureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Signatures.
     */
    data: SignatureCreateManyInput | SignatureCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Signature update
   */
  export type SignatureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * The data needed to update a Signature.
     */
    data: XOR<SignatureUpdateInput, SignatureUncheckedUpdateInput>
    /**
     * Choose, which Signature to update.
     */
    where: SignatureWhereUniqueInput
  }

  /**
   * Signature updateMany
   */
  export type SignatureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Signatures.
     */
    data: XOR<SignatureUpdateManyMutationInput, SignatureUncheckedUpdateManyInput>
    /**
     * Filter which Signatures to update
     */
    where?: SignatureWhereInput
  }

  /**
   * Signature upsert
   */
  export type SignatureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * The filter to search for the Signature to update in case it exists.
     */
    where: SignatureWhereUniqueInput
    /**
     * In case the Signature found by the `where` argument doesn't exist, create a new Signature with this data.
     */
    create: XOR<SignatureCreateInput, SignatureUncheckedCreateInput>
    /**
     * In case the Signature was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SignatureUpdateInput, SignatureUncheckedUpdateInput>
  }

  /**
   * Signature delete
   */
  export type SignatureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
    /**
     * Filter which Signature to delete.
     */
    where: SignatureWhereUniqueInput
  }

  /**
   * Signature deleteMany
   */
  export type SignatureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Signatures to delete
     */
    where?: SignatureWhereInput
  }

  /**
   * Signature without action
   */
  export type SignatureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signature
     */
    select?: SignatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignatureInclude<ExtArgs> | null
  }


  /**
   * Model ValidationToken
   */

  export type AggregateValidationToken = {
    _count: ValidationTokenCountAggregateOutputType | null
    _min: ValidationTokenMinAggregateOutputType | null
    _max: ValidationTokenMaxAggregateOutputType | null
  }

  export type ValidationTokenMinAggregateOutputType = {
    id: string | null
    tokenId: string | null
    fileId: string | null
    fileMetadataHash: string | null
    userPublicKeyHash: string | null
    issuedAt: Date | null
    expiresAt: Date | null
    signature: string | null
    adjudicatorPublicKey: string | null
    createdAt: Date | null
  }

  export type ValidationTokenMaxAggregateOutputType = {
    id: string | null
    tokenId: string | null
    fileId: string | null
    fileMetadataHash: string | null
    userPublicKeyHash: string | null
    issuedAt: Date | null
    expiresAt: Date | null
    signature: string | null
    adjudicatorPublicKey: string | null
    createdAt: Date | null
  }

  export type ValidationTokenCountAggregateOutputType = {
    id: number
    tokenId: number
    fileId: number
    fileMetadataHash: number
    userPublicKeyHash: number
    issuedAt: number
    expiresAt: number
    signature: number
    adjudicatorPublicKey: number
    createdAt: number
    _all: number
  }


  export type ValidationTokenMinAggregateInputType = {
    id?: true
    tokenId?: true
    fileId?: true
    fileMetadataHash?: true
    userPublicKeyHash?: true
    issuedAt?: true
    expiresAt?: true
    signature?: true
    adjudicatorPublicKey?: true
    createdAt?: true
  }

  export type ValidationTokenMaxAggregateInputType = {
    id?: true
    tokenId?: true
    fileId?: true
    fileMetadataHash?: true
    userPublicKeyHash?: true
    issuedAt?: true
    expiresAt?: true
    signature?: true
    adjudicatorPublicKey?: true
    createdAt?: true
  }

  export type ValidationTokenCountAggregateInputType = {
    id?: true
    tokenId?: true
    fileId?: true
    fileMetadataHash?: true
    userPublicKeyHash?: true
    issuedAt?: true
    expiresAt?: true
    signature?: true
    adjudicatorPublicKey?: true
    createdAt?: true
    _all?: true
  }

  export type ValidationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationToken to aggregate.
     */
    where?: ValidationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokens to fetch.
     */
    orderBy?: ValidationTokenOrderByWithRelationInput | ValidationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ValidationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ValidationTokens
    **/
    _count?: true | ValidationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ValidationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ValidationTokenMaxAggregateInputType
  }

  export type GetValidationTokenAggregateType<T extends ValidationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateValidationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateValidationToken[P]>
      : GetScalarType<T[P], AggregateValidationToken[P]>
  }




  export type ValidationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ValidationTokenWhereInput
    orderBy?: ValidationTokenOrderByWithAggregationInput | ValidationTokenOrderByWithAggregationInput[]
    by: ValidationTokenScalarFieldEnum[] | ValidationTokenScalarFieldEnum
    having?: ValidationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ValidationTokenCountAggregateInputType | true
    _min?: ValidationTokenMinAggregateInputType
    _max?: ValidationTokenMaxAggregateInputType
  }

  export type ValidationTokenGroupByOutputType = {
    id: string
    tokenId: string
    fileId: string
    fileMetadataHash: string
    userPublicKeyHash: string
    issuedAt: Date
    expiresAt: Date
    signature: string
    adjudicatorPublicKey: string
    createdAt: Date
    _count: ValidationTokenCountAggregateOutputType | null
    _min: ValidationTokenMinAggregateOutputType | null
    _max: ValidationTokenMaxAggregateOutputType | null
  }

  type GetValidationTokenGroupByPayload<T extends ValidationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ValidationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ValidationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ValidationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], ValidationTokenGroupByOutputType[P]>
        }
      >
    >


  export type ValidationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    fileId?: boolean
    fileMetadataHash?: boolean
    userPublicKeyHash?: boolean
    issuedAt?: boolean
    expiresAt?: boolean
    signature?: boolean
    adjudicatorPublicKey?: boolean
    createdAt?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["validationToken"]>

  export type ValidationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    fileId?: boolean
    fileMetadataHash?: boolean
    userPublicKeyHash?: boolean
    issuedAt?: boolean
    expiresAt?: boolean
    signature?: boolean
    adjudicatorPublicKey?: boolean
    createdAt?: boolean
    file?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["validationToken"]>

  export type ValidationTokenSelectScalar = {
    id?: boolean
    tokenId?: boolean
    fileId?: boolean
    fileMetadataHash?: boolean
    userPublicKeyHash?: boolean
    issuedAt?: boolean
    expiresAt?: boolean
    signature?: boolean
    adjudicatorPublicKey?: boolean
    createdAt?: boolean
  }

  export type ValidationTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }
  export type ValidationTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | FileDefaultArgs<ExtArgs>
  }

  export type $ValidationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ValidationToken"
    objects: {
      file: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tokenId: string
      fileId: string
      fileMetadataHash: string
      userPublicKeyHash: string
      issuedAt: Date
      expiresAt: Date
      signature: string
      adjudicatorPublicKey: string
      createdAt: Date
    }, ExtArgs["result"]["validationToken"]>
    composites: {}
  }

  type ValidationTokenGetPayload<S extends boolean | null | undefined | ValidationTokenDefaultArgs> = $Result.GetResult<Prisma.$ValidationTokenPayload, S>

  type ValidationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ValidationTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ValidationTokenCountAggregateInputType | true
    }

  export interface ValidationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ValidationToken'], meta: { name: 'ValidationToken' } }
    /**
     * Find zero or one ValidationToken that matches the filter.
     * @param {ValidationTokenFindUniqueArgs} args - Arguments to find a ValidationToken
     * @example
     * // Get one ValidationToken
     * const validationToken = await prisma.validationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ValidationTokenFindUniqueArgs>(args: SelectSubset<T, ValidationTokenFindUniqueArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ValidationToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ValidationTokenFindUniqueOrThrowArgs} args - Arguments to find a ValidationToken
     * @example
     * // Get one ValidationToken
     * const validationToken = await prisma.validationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ValidationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, ValidationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ValidationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenFindFirstArgs} args - Arguments to find a ValidationToken
     * @example
     * // Get one ValidationToken
     * const validationToken = await prisma.validationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ValidationTokenFindFirstArgs>(args?: SelectSubset<T, ValidationTokenFindFirstArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ValidationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenFindFirstOrThrowArgs} args - Arguments to find a ValidationToken
     * @example
     * // Get one ValidationToken
     * const validationToken = await prisma.validationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ValidationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, ValidationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ValidationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ValidationTokens
     * const validationTokens = await prisma.validationToken.findMany()
     * 
     * // Get first 10 ValidationTokens
     * const validationTokens = await prisma.validationToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const validationTokenWithIdOnly = await prisma.validationToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ValidationTokenFindManyArgs>(args?: SelectSubset<T, ValidationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ValidationToken.
     * @param {ValidationTokenCreateArgs} args - Arguments to create a ValidationToken.
     * @example
     * // Create one ValidationToken
     * const ValidationToken = await prisma.validationToken.create({
     *   data: {
     *     // ... data to create a ValidationToken
     *   }
     * })
     * 
     */
    create<T extends ValidationTokenCreateArgs>(args: SelectSubset<T, ValidationTokenCreateArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ValidationTokens.
     * @param {ValidationTokenCreateManyArgs} args - Arguments to create many ValidationTokens.
     * @example
     * // Create many ValidationTokens
     * const validationToken = await prisma.validationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ValidationTokenCreateManyArgs>(args?: SelectSubset<T, ValidationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ValidationTokens and returns the data saved in the database.
     * @param {ValidationTokenCreateManyAndReturnArgs} args - Arguments to create many ValidationTokens.
     * @example
     * // Create many ValidationTokens
     * const validationToken = await prisma.validationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ValidationTokens and only return the `id`
     * const validationTokenWithIdOnly = await prisma.validationToken.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ValidationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, ValidationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ValidationToken.
     * @param {ValidationTokenDeleteArgs} args - Arguments to delete one ValidationToken.
     * @example
     * // Delete one ValidationToken
     * const ValidationToken = await prisma.validationToken.delete({
     *   where: {
     *     // ... filter to delete one ValidationToken
     *   }
     * })
     * 
     */
    delete<T extends ValidationTokenDeleteArgs>(args: SelectSubset<T, ValidationTokenDeleteArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ValidationToken.
     * @param {ValidationTokenUpdateArgs} args - Arguments to update one ValidationToken.
     * @example
     * // Update one ValidationToken
     * const validationToken = await prisma.validationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ValidationTokenUpdateArgs>(args: SelectSubset<T, ValidationTokenUpdateArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ValidationTokens.
     * @param {ValidationTokenDeleteManyArgs} args - Arguments to filter ValidationTokens to delete.
     * @example
     * // Delete a few ValidationTokens
     * const { count } = await prisma.validationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ValidationTokenDeleteManyArgs>(args?: SelectSubset<T, ValidationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ValidationTokens
     * const validationToken = await prisma.validationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ValidationTokenUpdateManyArgs>(args: SelectSubset<T, ValidationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ValidationToken.
     * @param {ValidationTokenUpsertArgs} args - Arguments to update or create a ValidationToken.
     * @example
     * // Update or create a ValidationToken
     * const validationToken = await prisma.validationToken.upsert({
     *   create: {
     *     // ... data to create a ValidationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ValidationToken we want to update
     *   }
     * })
     */
    upsert<T extends ValidationTokenUpsertArgs>(args: SelectSubset<T, ValidationTokenUpsertArgs<ExtArgs>>): Prisma__ValidationTokenClient<$Result.GetResult<Prisma.$ValidationTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ValidationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenCountArgs} args - Arguments to filter ValidationTokens to count.
     * @example
     * // Count the number of ValidationTokens
     * const count = await prisma.validationToken.count({
     *   where: {
     *     // ... the filter for the ValidationTokens we want to count
     *   }
     * })
    **/
    count<T extends ValidationTokenCountArgs>(
      args?: Subset<T, ValidationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ValidationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ValidationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ValidationTokenAggregateArgs>(args: Subset<T, ValidationTokenAggregateArgs>): Prisma.PrismaPromise<GetValidationTokenAggregateType<T>>

    /**
     * Group by ValidationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ValidationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ValidationTokenGroupByArgs['orderBy'] }
        : { orderBy?: ValidationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ValidationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetValidationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ValidationToken model
   */
  readonly fields: ValidationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ValidationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ValidationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ValidationToken model
   */ 
  interface ValidationTokenFieldRefs {
    readonly id: FieldRef<"ValidationToken", 'String'>
    readonly tokenId: FieldRef<"ValidationToken", 'String'>
    readonly fileId: FieldRef<"ValidationToken", 'String'>
    readonly fileMetadataHash: FieldRef<"ValidationToken", 'String'>
    readonly userPublicKeyHash: FieldRef<"ValidationToken", 'String'>
    readonly issuedAt: FieldRef<"ValidationToken", 'DateTime'>
    readonly expiresAt: FieldRef<"ValidationToken", 'DateTime'>
    readonly signature: FieldRef<"ValidationToken", 'String'>
    readonly adjudicatorPublicKey: FieldRef<"ValidationToken", 'String'>
    readonly createdAt: FieldRef<"ValidationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ValidationToken findUnique
   */
  export type ValidationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * Filter, which ValidationToken to fetch.
     */
    where: ValidationTokenWhereUniqueInput
  }

  /**
   * ValidationToken findUniqueOrThrow
   */
  export type ValidationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * Filter, which ValidationToken to fetch.
     */
    where: ValidationTokenWhereUniqueInput
  }

  /**
   * ValidationToken findFirst
   */
  export type ValidationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * Filter, which ValidationToken to fetch.
     */
    where?: ValidationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokens to fetch.
     */
    orderBy?: ValidationTokenOrderByWithRelationInput | ValidationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationTokens.
     */
    cursor?: ValidationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationTokens.
     */
    distinct?: ValidationTokenScalarFieldEnum | ValidationTokenScalarFieldEnum[]
  }

  /**
   * ValidationToken findFirstOrThrow
   */
  export type ValidationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * Filter, which ValidationToken to fetch.
     */
    where?: ValidationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokens to fetch.
     */
    orderBy?: ValidationTokenOrderByWithRelationInput | ValidationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationTokens.
     */
    cursor?: ValidationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationTokens.
     */
    distinct?: ValidationTokenScalarFieldEnum | ValidationTokenScalarFieldEnum[]
  }

  /**
   * ValidationToken findMany
   */
  export type ValidationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * Filter, which ValidationTokens to fetch.
     */
    where?: ValidationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokens to fetch.
     */
    orderBy?: ValidationTokenOrderByWithRelationInput | ValidationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ValidationTokens.
     */
    cursor?: ValidationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokens.
     */
    skip?: number
    distinct?: ValidationTokenScalarFieldEnum | ValidationTokenScalarFieldEnum[]
  }

  /**
   * ValidationToken create
   */
  export type ValidationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a ValidationToken.
     */
    data: XOR<ValidationTokenCreateInput, ValidationTokenUncheckedCreateInput>
  }

  /**
   * ValidationToken createMany
   */
  export type ValidationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ValidationTokens.
     */
    data: ValidationTokenCreateManyInput | ValidationTokenCreateManyInput[]
  }

  /**
   * ValidationToken createManyAndReturn
   */
  export type ValidationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ValidationTokens.
     */
    data: ValidationTokenCreateManyInput | ValidationTokenCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ValidationToken update
   */
  export type ValidationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a ValidationToken.
     */
    data: XOR<ValidationTokenUpdateInput, ValidationTokenUncheckedUpdateInput>
    /**
     * Choose, which ValidationToken to update.
     */
    where: ValidationTokenWhereUniqueInput
  }

  /**
   * ValidationToken updateMany
   */
  export type ValidationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ValidationTokens.
     */
    data: XOR<ValidationTokenUpdateManyMutationInput, ValidationTokenUncheckedUpdateManyInput>
    /**
     * Filter which ValidationTokens to update
     */
    where?: ValidationTokenWhereInput
  }

  /**
   * ValidationToken upsert
   */
  export type ValidationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the ValidationToken to update in case it exists.
     */
    where: ValidationTokenWhereUniqueInput
    /**
     * In case the ValidationToken found by the `where` argument doesn't exist, create a new ValidationToken with this data.
     */
    create: XOR<ValidationTokenCreateInput, ValidationTokenUncheckedCreateInput>
    /**
     * In case the ValidationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ValidationTokenUpdateInput, ValidationTokenUncheckedUpdateInput>
  }

  /**
   * ValidationToken delete
   */
  export type ValidationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
    /**
     * Filter which ValidationToken to delete.
     */
    where: ValidationTokenWhereUniqueInput
  }

  /**
   * ValidationToken deleteMany
   */
  export type ValidationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationTokens to delete
     */
    where?: ValidationTokenWhereInput
  }

  /**
   * ValidationToken without action
   */
  export type ValidationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationToken
     */
    select?: ValidationTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ValidationTokenInclude<ExtArgs> | null
  }


  /**
   * Model InvestigationAudit
   */

  export type AggregateInvestigationAudit = {
    _count: InvestigationAuditCountAggregateOutputType | null
    _min: InvestigationAuditMinAggregateOutputType | null
    _max: InvestigationAuditMaxAggregateOutputType | null
  }

  export type InvestigationAuditMinAggregateOutputType = {
    id: string | null
    investigationId: string | null
    fileId: string | null
    reason: string | null
    adminApproval: string | null
    legalAuthorization: string | null
    decryptedPublicKey: string | null
    createdAt: Date | null
  }

  export type InvestigationAuditMaxAggregateOutputType = {
    id: string | null
    investigationId: string | null
    fileId: string | null
    reason: string | null
    adminApproval: string | null
    legalAuthorization: string | null
    decryptedPublicKey: string | null
    createdAt: Date | null
  }

  export type InvestigationAuditCountAggregateOutputType = {
    id: number
    investigationId: number
    fileId: number
    reason: number
    adminApproval: number
    legalAuthorization: number
    decryptedPublicKey: number
    createdAt: number
    _all: number
  }


  export type InvestigationAuditMinAggregateInputType = {
    id?: true
    investigationId?: true
    fileId?: true
    reason?: true
    adminApproval?: true
    legalAuthorization?: true
    decryptedPublicKey?: true
    createdAt?: true
  }

  export type InvestigationAuditMaxAggregateInputType = {
    id?: true
    investigationId?: true
    fileId?: true
    reason?: true
    adminApproval?: true
    legalAuthorization?: true
    decryptedPublicKey?: true
    createdAt?: true
  }

  export type InvestigationAuditCountAggregateInputType = {
    id?: true
    investigationId?: true
    fileId?: true
    reason?: true
    adminApproval?: true
    legalAuthorization?: true
    decryptedPublicKey?: true
    createdAt?: true
    _all?: true
  }

  export type InvestigationAuditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvestigationAudit to aggregate.
     */
    where?: InvestigationAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigationAudits to fetch.
     */
    orderBy?: InvestigationAuditOrderByWithRelationInput | InvestigationAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvestigationAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigationAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigationAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvestigationAudits
    **/
    _count?: true | InvestigationAuditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvestigationAuditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvestigationAuditMaxAggregateInputType
  }

  export type GetInvestigationAuditAggregateType<T extends InvestigationAuditAggregateArgs> = {
        [P in keyof T & keyof AggregateInvestigationAudit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvestigationAudit[P]>
      : GetScalarType<T[P], AggregateInvestigationAudit[P]>
  }




  export type InvestigationAuditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigationAuditWhereInput
    orderBy?: InvestigationAuditOrderByWithAggregationInput | InvestigationAuditOrderByWithAggregationInput[]
    by: InvestigationAuditScalarFieldEnum[] | InvestigationAuditScalarFieldEnum
    having?: InvestigationAuditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvestigationAuditCountAggregateInputType | true
    _min?: InvestigationAuditMinAggregateInputType
    _max?: InvestigationAuditMaxAggregateInputType
  }

  export type InvestigationAuditGroupByOutputType = {
    id: string
    investigationId: string
    fileId: string
    reason: string
    adminApproval: string
    legalAuthorization: string
    decryptedPublicKey: string | null
    createdAt: Date
    _count: InvestigationAuditCountAggregateOutputType | null
    _min: InvestigationAuditMinAggregateOutputType | null
    _max: InvestigationAuditMaxAggregateOutputType | null
  }

  type GetInvestigationAuditGroupByPayload<T extends InvestigationAuditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvestigationAuditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvestigationAuditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvestigationAuditGroupByOutputType[P]>
            : GetScalarType<T[P], InvestigationAuditGroupByOutputType[P]>
        }
      >
    >


  export type InvestigationAuditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigationId?: boolean
    fileId?: boolean
    reason?: boolean
    adminApproval?: boolean
    legalAuthorization?: boolean
    decryptedPublicKey?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["investigationAudit"]>

  export type InvestigationAuditSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigationId?: boolean
    fileId?: boolean
    reason?: boolean
    adminApproval?: boolean
    legalAuthorization?: boolean
    decryptedPublicKey?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["investigationAudit"]>

  export type InvestigationAuditSelectScalar = {
    id?: boolean
    investigationId?: boolean
    fileId?: boolean
    reason?: boolean
    adminApproval?: boolean
    legalAuthorization?: boolean
    decryptedPublicKey?: boolean
    createdAt?: boolean
  }


  export type $InvestigationAuditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvestigationAudit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      investigationId: string
      fileId: string
      reason: string
      adminApproval: string
      legalAuthorization: string
      decryptedPublicKey: string | null
      createdAt: Date
    }, ExtArgs["result"]["investigationAudit"]>
    composites: {}
  }

  type InvestigationAuditGetPayload<S extends boolean | null | undefined | InvestigationAuditDefaultArgs> = $Result.GetResult<Prisma.$InvestigationAuditPayload, S>

  type InvestigationAuditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvestigationAuditFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvestigationAuditCountAggregateInputType | true
    }

  export interface InvestigationAuditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvestigationAudit'], meta: { name: 'InvestigationAudit' } }
    /**
     * Find zero or one InvestigationAudit that matches the filter.
     * @param {InvestigationAuditFindUniqueArgs} args - Arguments to find a InvestigationAudit
     * @example
     * // Get one InvestigationAudit
     * const investigationAudit = await prisma.investigationAudit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvestigationAuditFindUniqueArgs>(args: SelectSubset<T, InvestigationAuditFindUniqueArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InvestigationAudit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvestigationAuditFindUniqueOrThrowArgs} args - Arguments to find a InvestigationAudit
     * @example
     * // Get one InvestigationAudit
     * const investigationAudit = await prisma.investigationAudit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvestigationAuditFindUniqueOrThrowArgs>(args: SelectSubset<T, InvestigationAuditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InvestigationAudit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditFindFirstArgs} args - Arguments to find a InvestigationAudit
     * @example
     * // Get one InvestigationAudit
     * const investigationAudit = await prisma.investigationAudit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvestigationAuditFindFirstArgs>(args?: SelectSubset<T, InvestigationAuditFindFirstArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InvestigationAudit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditFindFirstOrThrowArgs} args - Arguments to find a InvestigationAudit
     * @example
     * // Get one InvestigationAudit
     * const investigationAudit = await prisma.investigationAudit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvestigationAuditFindFirstOrThrowArgs>(args?: SelectSubset<T, InvestigationAuditFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InvestigationAudits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvestigationAudits
     * const investigationAudits = await prisma.investigationAudit.findMany()
     * 
     * // Get first 10 InvestigationAudits
     * const investigationAudits = await prisma.investigationAudit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const investigationAuditWithIdOnly = await prisma.investigationAudit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvestigationAuditFindManyArgs>(args?: SelectSubset<T, InvestigationAuditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InvestigationAudit.
     * @param {InvestigationAuditCreateArgs} args - Arguments to create a InvestigationAudit.
     * @example
     * // Create one InvestigationAudit
     * const InvestigationAudit = await prisma.investigationAudit.create({
     *   data: {
     *     // ... data to create a InvestigationAudit
     *   }
     * })
     * 
     */
    create<T extends InvestigationAuditCreateArgs>(args: SelectSubset<T, InvestigationAuditCreateArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InvestigationAudits.
     * @param {InvestigationAuditCreateManyArgs} args - Arguments to create many InvestigationAudits.
     * @example
     * // Create many InvestigationAudits
     * const investigationAudit = await prisma.investigationAudit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvestigationAuditCreateManyArgs>(args?: SelectSubset<T, InvestigationAuditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvestigationAudits and returns the data saved in the database.
     * @param {InvestigationAuditCreateManyAndReturnArgs} args - Arguments to create many InvestigationAudits.
     * @example
     * // Create many InvestigationAudits
     * const investigationAudit = await prisma.investigationAudit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvestigationAudits and only return the `id`
     * const investigationAuditWithIdOnly = await prisma.investigationAudit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvestigationAuditCreateManyAndReturnArgs>(args?: SelectSubset<T, InvestigationAuditCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InvestigationAudit.
     * @param {InvestigationAuditDeleteArgs} args - Arguments to delete one InvestigationAudit.
     * @example
     * // Delete one InvestigationAudit
     * const InvestigationAudit = await prisma.investigationAudit.delete({
     *   where: {
     *     // ... filter to delete one InvestigationAudit
     *   }
     * })
     * 
     */
    delete<T extends InvestigationAuditDeleteArgs>(args: SelectSubset<T, InvestigationAuditDeleteArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InvestigationAudit.
     * @param {InvestigationAuditUpdateArgs} args - Arguments to update one InvestigationAudit.
     * @example
     * // Update one InvestigationAudit
     * const investigationAudit = await prisma.investigationAudit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvestigationAuditUpdateArgs>(args: SelectSubset<T, InvestigationAuditUpdateArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InvestigationAudits.
     * @param {InvestigationAuditDeleteManyArgs} args - Arguments to filter InvestigationAudits to delete.
     * @example
     * // Delete a few InvestigationAudits
     * const { count } = await prisma.investigationAudit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvestigationAuditDeleteManyArgs>(args?: SelectSubset<T, InvestigationAuditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvestigationAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvestigationAudits
     * const investigationAudit = await prisma.investigationAudit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvestigationAuditUpdateManyArgs>(args: SelectSubset<T, InvestigationAuditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvestigationAudit.
     * @param {InvestigationAuditUpsertArgs} args - Arguments to update or create a InvestigationAudit.
     * @example
     * // Update or create a InvestigationAudit
     * const investigationAudit = await prisma.investigationAudit.upsert({
     *   create: {
     *     // ... data to create a InvestigationAudit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvestigationAudit we want to update
     *   }
     * })
     */
    upsert<T extends InvestigationAuditUpsertArgs>(args: SelectSubset<T, InvestigationAuditUpsertArgs<ExtArgs>>): Prisma__InvestigationAuditClient<$Result.GetResult<Prisma.$InvestigationAuditPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InvestigationAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditCountArgs} args - Arguments to filter InvestigationAudits to count.
     * @example
     * // Count the number of InvestigationAudits
     * const count = await prisma.investigationAudit.count({
     *   where: {
     *     // ... the filter for the InvestigationAudits we want to count
     *   }
     * })
    **/
    count<T extends InvestigationAuditCountArgs>(
      args?: Subset<T, InvestigationAuditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvestigationAuditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvestigationAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvestigationAuditAggregateArgs>(args: Subset<T, InvestigationAuditAggregateArgs>): Prisma.PrismaPromise<GetInvestigationAuditAggregateType<T>>

    /**
     * Group by InvestigationAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigationAuditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvestigationAuditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvestigationAuditGroupByArgs['orderBy'] }
        : { orderBy?: InvestigationAuditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvestigationAuditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvestigationAuditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvestigationAudit model
   */
  readonly fields: InvestigationAuditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvestigationAudit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvestigationAuditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvestigationAudit model
   */ 
  interface InvestigationAuditFieldRefs {
    readonly id: FieldRef<"InvestigationAudit", 'String'>
    readonly investigationId: FieldRef<"InvestigationAudit", 'String'>
    readonly fileId: FieldRef<"InvestigationAudit", 'String'>
    readonly reason: FieldRef<"InvestigationAudit", 'String'>
    readonly adminApproval: FieldRef<"InvestigationAudit", 'String'>
    readonly legalAuthorization: FieldRef<"InvestigationAudit", 'String'>
    readonly decryptedPublicKey: FieldRef<"InvestigationAudit", 'String'>
    readonly createdAt: FieldRef<"InvestigationAudit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InvestigationAudit findUnique
   */
  export type InvestigationAuditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * Filter, which InvestigationAudit to fetch.
     */
    where: InvestigationAuditWhereUniqueInput
  }

  /**
   * InvestigationAudit findUniqueOrThrow
   */
  export type InvestigationAuditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * Filter, which InvestigationAudit to fetch.
     */
    where: InvestigationAuditWhereUniqueInput
  }

  /**
   * InvestigationAudit findFirst
   */
  export type InvestigationAuditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * Filter, which InvestigationAudit to fetch.
     */
    where?: InvestigationAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigationAudits to fetch.
     */
    orderBy?: InvestigationAuditOrderByWithRelationInput | InvestigationAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvestigationAudits.
     */
    cursor?: InvestigationAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigationAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigationAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvestigationAudits.
     */
    distinct?: InvestigationAuditScalarFieldEnum | InvestigationAuditScalarFieldEnum[]
  }

  /**
   * InvestigationAudit findFirstOrThrow
   */
  export type InvestigationAuditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * Filter, which InvestigationAudit to fetch.
     */
    where?: InvestigationAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigationAudits to fetch.
     */
    orderBy?: InvestigationAuditOrderByWithRelationInput | InvestigationAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvestigationAudits.
     */
    cursor?: InvestigationAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigationAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigationAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvestigationAudits.
     */
    distinct?: InvestigationAuditScalarFieldEnum | InvestigationAuditScalarFieldEnum[]
  }

  /**
   * InvestigationAudit findMany
   */
  export type InvestigationAuditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * Filter, which InvestigationAudits to fetch.
     */
    where?: InvestigationAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigationAudits to fetch.
     */
    orderBy?: InvestigationAuditOrderByWithRelationInput | InvestigationAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvestigationAudits.
     */
    cursor?: InvestigationAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigationAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigationAudits.
     */
    skip?: number
    distinct?: InvestigationAuditScalarFieldEnum | InvestigationAuditScalarFieldEnum[]
  }

  /**
   * InvestigationAudit create
   */
  export type InvestigationAuditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * The data needed to create a InvestigationAudit.
     */
    data: XOR<InvestigationAuditCreateInput, InvestigationAuditUncheckedCreateInput>
  }

  /**
   * InvestigationAudit createMany
   */
  export type InvestigationAuditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvestigationAudits.
     */
    data: InvestigationAuditCreateManyInput | InvestigationAuditCreateManyInput[]
  }

  /**
   * InvestigationAudit createManyAndReturn
   */
  export type InvestigationAuditCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InvestigationAudits.
     */
    data: InvestigationAuditCreateManyInput | InvestigationAuditCreateManyInput[]
  }

  /**
   * InvestigationAudit update
   */
  export type InvestigationAuditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * The data needed to update a InvestigationAudit.
     */
    data: XOR<InvestigationAuditUpdateInput, InvestigationAuditUncheckedUpdateInput>
    /**
     * Choose, which InvestigationAudit to update.
     */
    where: InvestigationAuditWhereUniqueInput
  }

  /**
   * InvestigationAudit updateMany
   */
  export type InvestigationAuditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvestigationAudits.
     */
    data: XOR<InvestigationAuditUpdateManyMutationInput, InvestigationAuditUncheckedUpdateManyInput>
    /**
     * Filter which InvestigationAudits to update
     */
    where?: InvestigationAuditWhereInput
  }

  /**
   * InvestigationAudit upsert
   */
  export type InvestigationAuditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * The filter to search for the InvestigationAudit to update in case it exists.
     */
    where: InvestigationAuditWhereUniqueInput
    /**
     * In case the InvestigationAudit found by the `where` argument doesn't exist, create a new InvestigationAudit with this data.
     */
    create: XOR<InvestigationAuditCreateInput, InvestigationAuditUncheckedCreateInput>
    /**
     * In case the InvestigationAudit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvestigationAuditUpdateInput, InvestigationAuditUncheckedUpdateInput>
  }

  /**
   * InvestigationAudit delete
   */
  export type InvestigationAuditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
    /**
     * Filter which InvestigationAudit to delete.
     */
    where: InvestigationAuditWhereUniqueInput
  }

  /**
   * InvestigationAudit deleteMany
   */
  export type InvestigationAuditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvestigationAudits to delete
     */
    where?: InvestigationAuditWhereInput
  }

  /**
   * InvestigationAudit without action
   */
  export type InvestigationAuditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigationAudit
     */
    select?: InvestigationAuditSelect<ExtArgs> | null
  }


  /**
   * Model ValidationNonce
   */

  export type AggregateValidationNonce = {
    _count: ValidationNonceCountAggregateOutputType | null
    _min: ValidationNonceMinAggregateOutputType | null
    _max: ValidationNonceMaxAggregateOutputType | null
  }

  export type ValidationNonceMinAggregateOutputType = {
    id: string | null
    nonce: string | null
    createdAt: Date | null
  }

  export type ValidationNonceMaxAggregateOutputType = {
    id: string | null
    nonce: string | null
    createdAt: Date | null
  }

  export type ValidationNonceCountAggregateOutputType = {
    id: number
    nonce: number
    createdAt: number
    _all: number
  }


  export type ValidationNonceMinAggregateInputType = {
    id?: true
    nonce?: true
    createdAt?: true
  }

  export type ValidationNonceMaxAggregateInputType = {
    id?: true
    nonce?: true
    createdAt?: true
  }

  export type ValidationNonceCountAggregateInputType = {
    id?: true
    nonce?: true
    createdAt?: true
    _all?: true
  }

  export type ValidationNonceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationNonce to aggregate.
     */
    where?: ValidationNonceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationNonces to fetch.
     */
    orderBy?: ValidationNonceOrderByWithRelationInput | ValidationNonceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ValidationNonceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationNonces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationNonces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ValidationNonces
    **/
    _count?: true | ValidationNonceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ValidationNonceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ValidationNonceMaxAggregateInputType
  }

  export type GetValidationNonceAggregateType<T extends ValidationNonceAggregateArgs> = {
        [P in keyof T & keyof AggregateValidationNonce]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateValidationNonce[P]>
      : GetScalarType<T[P], AggregateValidationNonce[P]>
  }




  export type ValidationNonceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ValidationNonceWhereInput
    orderBy?: ValidationNonceOrderByWithAggregationInput | ValidationNonceOrderByWithAggregationInput[]
    by: ValidationNonceScalarFieldEnum[] | ValidationNonceScalarFieldEnum
    having?: ValidationNonceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ValidationNonceCountAggregateInputType | true
    _min?: ValidationNonceMinAggregateInputType
    _max?: ValidationNonceMaxAggregateInputType
  }

  export type ValidationNonceGroupByOutputType = {
    id: string
    nonce: string
    createdAt: Date
    _count: ValidationNonceCountAggregateOutputType | null
    _min: ValidationNonceMinAggregateOutputType | null
    _max: ValidationNonceMaxAggregateOutputType | null
  }

  type GetValidationNonceGroupByPayload<T extends ValidationNonceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ValidationNonceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ValidationNonceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ValidationNonceGroupByOutputType[P]>
            : GetScalarType<T[P], ValidationNonceGroupByOutputType[P]>
        }
      >
    >


  export type ValidationNonceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nonce?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validationNonce"]>

  export type ValidationNonceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nonce?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validationNonce"]>

  export type ValidationNonceSelectScalar = {
    id?: boolean
    nonce?: boolean
    createdAt?: boolean
  }


  export type $ValidationNoncePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ValidationNonce"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nonce: string
      createdAt: Date
    }, ExtArgs["result"]["validationNonce"]>
    composites: {}
  }

  type ValidationNonceGetPayload<S extends boolean | null | undefined | ValidationNonceDefaultArgs> = $Result.GetResult<Prisma.$ValidationNoncePayload, S>

  type ValidationNonceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ValidationNonceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ValidationNonceCountAggregateInputType | true
    }

  export interface ValidationNonceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ValidationNonce'], meta: { name: 'ValidationNonce' } }
    /**
     * Find zero or one ValidationNonce that matches the filter.
     * @param {ValidationNonceFindUniqueArgs} args - Arguments to find a ValidationNonce
     * @example
     * // Get one ValidationNonce
     * const validationNonce = await prisma.validationNonce.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ValidationNonceFindUniqueArgs>(args: SelectSubset<T, ValidationNonceFindUniqueArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ValidationNonce that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ValidationNonceFindUniqueOrThrowArgs} args - Arguments to find a ValidationNonce
     * @example
     * // Get one ValidationNonce
     * const validationNonce = await prisma.validationNonce.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ValidationNonceFindUniqueOrThrowArgs>(args: SelectSubset<T, ValidationNonceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ValidationNonce that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceFindFirstArgs} args - Arguments to find a ValidationNonce
     * @example
     * // Get one ValidationNonce
     * const validationNonce = await prisma.validationNonce.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ValidationNonceFindFirstArgs>(args?: SelectSubset<T, ValidationNonceFindFirstArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ValidationNonce that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceFindFirstOrThrowArgs} args - Arguments to find a ValidationNonce
     * @example
     * // Get one ValidationNonce
     * const validationNonce = await prisma.validationNonce.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ValidationNonceFindFirstOrThrowArgs>(args?: SelectSubset<T, ValidationNonceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ValidationNonces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ValidationNonces
     * const validationNonces = await prisma.validationNonce.findMany()
     * 
     * // Get first 10 ValidationNonces
     * const validationNonces = await prisma.validationNonce.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const validationNonceWithIdOnly = await prisma.validationNonce.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ValidationNonceFindManyArgs>(args?: SelectSubset<T, ValidationNonceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ValidationNonce.
     * @param {ValidationNonceCreateArgs} args - Arguments to create a ValidationNonce.
     * @example
     * // Create one ValidationNonce
     * const ValidationNonce = await prisma.validationNonce.create({
     *   data: {
     *     // ... data to create a ValidationNonce
     *   }
     * })
     * 
     */
    create<T extends ValidationNonceCreateArgs>(args: SelectSubset<T, ValidationNonceCreateArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ValidationNonces.
     * @param {ValidationNonceCreateManyArgs} args - Arguments to create many ValidationNonces.
     * @example
     * // Create many ValidationNonces
     * const validationNonce = await prisma.validationNonce.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ValidationNonceCreateManyArgs>(args?: SelectSubset<T, ValidationNonceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ValidationNonces and returns the data saved in the database.
     * @param {ValidationNonceCreateManyAndReturnArgs} args - Arguments to create many ValidationNonces.
     * @example
     * // Create many ValidationNonces
     * const validationNonce = await prisma.validationNonce.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ValidationNonces and only return the `id`
     * const validationNonceWithIdOnly = await prisma.validationNonce.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ValidationNonceCreateManyAndReturnArgs>(args?: SelectSubset<T, ValidationNonceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ValidationNonce.
     * @param {ValidationNonceDeleteArgs} args - Arguments to delete one ValidationNonce.
     * @example
     * // Delete one ValidationNonce
     * const ValidationNonce = await prisma.validationNonce.delete({
     *   where: {
     *     // ... filter to delete one ValidationNonce
     *   }
     * })
     * 
     */
    delete<T extends ValidationNonceDeleteArgs>(args: SelectSubset<T, ValidationNonceDeleteArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ValidationNonce.
     * @param {ValidationNonceUpdateArgs} args - Arguments to update one ValidationNonce.
     * @example
     * // Update one ValidationNonce
     * const validationNonce = await prisma.validationNonce.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ValidationNonceUpdateArgs>(args: SelectSubset<T, ValidationNonceUpdateArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ValidationNonces.
     * @param {ValidationNonceDeleteManyArgs} args - Arguments to filter ValidationNonces to delete.
     * @example
     * // Delete a few ValidationNonces
     * const { count } = await prisma.validationNonce.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ValidationNonceDeleteManyArgs>(args?: SelectSubset<T, ValidationNonceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidationNonces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ValidationNonces
     * const validationNonce = await prisma.validationNonce.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ValidationNonceUpdateManyArgs>(args: SelectSubset<T, ValidationNonceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ValidationNonce.
     * @param {ValidationNonceUpsertArgs} args - Arguments to update or create a ValidationNonce.
     * @example
     * // Update or create a ValidationNonce
     * const validationNonce = await prisma.validationNonce.upsert({
     *   create: {
     *     // ... data to create a ValidationNonce
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ValidationNonce we want to update
     *   }
     * })
     */
    upsert<T extends ValidationNonceUpsertArgs>(args: SelectSubset<T, ValidationNonceUpsertArgs<ExtArgs>>): Prisma__ValidationNonceClient<$Result.GetResult<Prisma.$ValidationNoncePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ValidationNonces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceCountArgs} args - Arguments to filter ValidationNonces to count.
     * @example
     * // Count the number of ValidationNonces
     * const count = await prisma.validationNonce.count({
     *   where: {
     *     // ... the filter for the ValidationNonces we want to count
     *   }
     * })
    **/
    count<T extends ValidationNonceCountArgs>(
      args?: Subset<T, ValidationNonceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ValidationNonceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ValidationNonce.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ValidationNonceAggregateArgs>(args: Subset<T, ValidationNonceAggregateArgs>): Prisma.PrismaPromise<GetValidationNonceAggregateType<T>>

    /**
     * Group by ValidationNonce.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationNonceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ValidationNonceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ValidationNonceGroupByArgs['orderBy'] }
        : { orderBy?: ValidationNonceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ValidationNonceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetValidationNonceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ValidationNonce model
   */
  readonly fields: ValidationNonceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ValidationNonce.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ValidationNonceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ValidationNonce model
   */ 
  interface ValidationNonceFieldRefs {
    readonly id: FieldRef<"ValidationNonce", 'String'>
    readonly nonce: FieldRef<"ValidationNonce", 'String'>
    readonly createdAt: FieldRef<"ValidationNonce", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ValidationNonce findUnique
   */
  export type ValidationNonceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * Filter, which ValidationNonce to fetch.
     */
    where: ValidationNonceWhereUniqueInput
  }

  /**
   * ValidationNonce findUniqueOrThrow
   */
  export type ValidationNonceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * Filter, which ValidationNonce to fetch.
     */
    where: ValidationNonceWhereUniqueInput
  }

  /**
   * ValidationNonce findFirst
   */
  export type ValidationNonceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * Filter, which ValidationNonce to fetch.
     */
    where?: ValidationNonceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationNonces to fetch.
     */
    orderBy?: ValidationNonceOrderByWithRelationInput | ValidationNonceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationNonces.
     */
    cursor?: ValidationNonceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationNonces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationNonces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationNonces.
     */
    distinct?: ValidationNonceScalarFieldEnum | ValidationNonceScalarFieldEnum[]
  }

  /**
   * ValidationNonce findFirstOrThrow
   */
  export type ValidationNonceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * Filter, which ValidationNonce to fetch.
     */
    where?: ValidationNonceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationNonces to fetch.
     */
    orderBy?: ValidationNonceOrderByWithRelationInput | ValidationNonceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationNonces.
     */
    cursor?: ValidationNonceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationNonces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationNonces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationNonces.
     */
    distinct?: ValidationNonceScalarFieldEnum | ValidationNonceScalarFieldEnum[]
  }

  /**
   * ValidationNonce findMany
   */
  export type ValidationNonceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * Filter, which ValidationNonces to fetch.
     */
    where?: ValidationNonceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationNonces to fetch.
     */
    orderBy?: ValidationNonceOrderByWithRelationInput | ValidationNonceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ValidationNonces.
     */
    cursor?: ValidationNonceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationNonces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationNonces.
     */
    skip?: number
    distinct?: ValidationNonceScalarFieldEnum | ValidationNonceScalarFieldEnum[]
  }

  /**
   * ValidationNonce create
   */
  export type ValidationNonceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * The data needed to create a ValidationNonce.
     */
    data: XOR<ValidationNonceCreateInput, ValidationNonceUncheckedCreateInput>
  }

  /**
   * ValidationNonce createMany
   */
  export type ValidationNonceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ValidationNonces.
     */
    data: ValidationNonceCreateManyInput | ValidationNonceCreateManyInput[]
  }

  /**
   * ValidationNonce createManyAndReturn
   */
  export type ValidationNonceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ValidationNonces.
     */
    data: ValidationNonceCreateManyInput | ValidationNonceCreateManyInput[]
  }

  /**
   * ValidationNonce update
   */
  export type ValidationNonceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * The data needed to update a ValidationNonce.
     */
    data: XOR<ValidationNonceUpdateInput, ValidationNonceUncheckedUpdateInput>
    /**
     * Choose, which ValidationNonce to update.
     */
    where: ValidationNonceWhereUniqueInput
  }

  /**
   * ValidationNonce updateMany
   */
  export type ValidationNonceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ValidationNonces.
     */
    data: XOR<ValidationNonceUpdateManyMutationInput, ValidationNonceUncheckedUpdateManyInput>
    /**
     * Filter which ValidationNonces to update
     */
    where?: ValidationNonceWhereInput
  }

  /**
   * ValidationNonce upsert
   */
  export type ValidationNonceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * The filter to search for the ValidationNonce to update in case it exists.
     */
    where: ValidationNonceWhereUniqueInput
    /**
     * In case the ValidationNonce found by the `where` argument doesn't exist, create a new ValidationNonce with this data.
     */
    create: XOR<ValidationNonceCreateInput, ValidationNonceUncheckedCreateInput>
    /**
     * In case the ValidationNonce was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ValidationNonceUpdateInput, ValidationNonceUncheckedUpdateInput>
  }

  /**
   * ValidationNonce delete
   */
  export type ValidationNonceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
    /**
     * Filter which ValidationNonce to delete.
     */
    where: ValidationNonceWhereUniqueInput
  }

  /**
   * ValidationNonce deleteMany
   */
  export type ValidationNonceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationNonces to delete
     */
    where?: ValidationNonceWhereInput
  }

  /**
   * ValidationNonce without action
   */
  export type ValidationNonceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationNonce
     */
    select?: ValidationNonceSelect<ExtArgs> | null
  }


  /**
   * Model ValidationTokenAudit
   */

  export type AggregateValidationTokenAudit = {
    _count: ValidationTokenAuditCountAggregateOutputType | null
    _min: ValidationTokenAuditMinAggregateOutputType | null
    _max: ValidationTokenAuditMaxAggregateOutputType | null
  }

  export type ValidationTokenAuditMinAggregateOutputType = {
    id: string | null
    tokenId: string | null
    userPublicKey: string | null
    userPublicKeyHash: string | null
    fileMetadataHash: string | null
    requestNonce: string | null
    issuedAt: Date | null
    expiresAt: Date | null
    signature: string | null
    createdAt: Date | null
  }

  export type ValidationTokenAuditMaxAggregateOutputType = {
    id: string | null
    tokenId: string | null
    userPublicKey: string | null
    userPublicKeyHash: string | null
    fileMetadataHash: string | null
    requestNonce: string | null
    issuedAt: Date | null
    expiresAt: Date | null
    signature: string | null
    createdAt: Date | null
  }

  export type ValidationTokenAuditCountAggregateOutputType = {
    id: number
    tokenId: number
    userPublicKey: number
    userPublicKeyHash: number
    fileMetadataHash: number
    requestNonce: number
    issuedAt: number
    expiresAt: number
    signature: number
    createdAt: number
    _all: number
  }


  export type ValidationTokenAuditMinAggregateInputType = {
    id?: true
    tokenId?: true
    userPublicKey?: true
    userPublicKeyHash?: true
    fileMetadataHash?: true
    requestNonce?: true
    issuedAt?: true
    expiresAt?: true
    signature?: true
    createdAt?: true
  }

  export type ValidationTokenAuditMaxAggregateInputType = {
    id?: true
    tokenId?: true
    userPublicKey?: true
    userPublicKeyHash?: true
    fileMetadataHash?: true
    requestNonce?: true
    issuedAt?: true
    expiresAt?: true
    signature?: true
    createdAt?: true
  }

  export type ValidationTokenAuditCountAggregateInputType = {
    id?: true
    tokenId?: true
    userPublicKey?: true
    userPublicKeyHash?: true
    fileMetadataHash?: true
    requestNonce?: true
    issuedAt?: true
    expiresAt?: true
    signature?: true
    createdAt?: true
    _all?: true
  }

  export type ValidationTokenAuditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationTokenAudit to aggregate.
     */
    where?: ValidationTokenAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokenAudits to fetch.
     */
    orderBy?: ValidationTokenAuditOrderByWithRelationInput | ValidationTokenAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ValidationTokenAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokenAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokenAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ValidationTokenAudits
    **/
    _count?: true | ValidationTokenAuditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ValidationTokenAuditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ValidationTokenAuditMaxAggregateInputType
  }

  export type GetValidationTokenAuditAggregateType<T extends ValidationTokenAuditAggregateArgs> = {
        [P in keyof T & keyof AggregateValidationTokenAudit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateValidationTokenAudit[P]>
      : GetScalarType<T[P], AggregateValidationTokenAudit[P]>
  }




  export type ValidationTokenAuditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ValidationTokenAuditWhereInput
    orderBy?: ValidationTokenAuditOrderByWithAggregationInput | ValidationTokenAuditOrderByWithAggregationInput[]
    by: ValidationTokenAuditScalarFieldEnum[] | ValidationTokenAuditScalarFieldEnum
    having?: ValidationTokenAuditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ValidationTokenAuditCountAggregateInputType | true
    _min?: ValidationTokenAuditMinAggregateInputType
    _max?: ValidationTokenAuditMaxAggregateInputType
  }

  export type ValidationTokenAuditGroupByOutputType = {
    id: string
    tokenId: string
    userPublicKey: string
    userPublicKeyHash: string
    fileMetadataHash: string
    requestNonce: string
    issuedAt: Date
    expiresAt: Date
    signature: string
    createdAt: Date
    _count: ValidationTokenAuditCountAggregateOutputType | null
    _min: ValidationTokenAuditMinAggregateOutputType | null
    _max: ValidationTokenAuditMaxAggregateOutputType | null
  }

  type GetValidationTokenAuditGroupByPayload<T extends ValidationTokenAuditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ValidationTokenAuditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ValidationTokenAuditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ValidationTokenAuditGroupByOutputType[P]>
            : GetScalarType<T[P], ValidationTokenAuditGroupByOutputType[P]>
        }
      >
    >


  export type ValidationTokenAuditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    userPublicKey?: boolean
    userPublicKeyHash?: boolean
    fileMetadataHash?: boolean
    requestNonce?: boolean
    issuedAt?: boolean
    expiresAt?: boolean
    signature?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validationTokenAudit"]>

  export type ValidationTokenAuditSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenId?: boolean
    userPublicKey?: boolean
    userPublicKeyHash?: boolean
    fileMetadataHash?: boolean
    requestNonce?: boolean
    issuedAt?: boolean
    expiresAt?: boolean
    signature?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validationTokenAudit"]>

  export type ValidationTokenAuditSelectScalar = {
    id?: boolean
    tokenId?: boolean
    userPublicKey?: boolean
    userPublicKeyHash?: boolean
    fileMetadataHash?: boolean
    requestNonce?: boolean
    issuedAt?: boolean
    expiresAt?: boolean
    signature?: boolean
    createdAt?: boolean
  }


  export type $ValidationTokenAuditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ValidationTokenAudit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tokenId: string
      userPublicKey: string
      userPublicKeyHash: string
      fileMetadataHash: string
      requestNonce: string
      issuedAt: Date
      expiresAt: Date
      signature: string
      createdAt: Date
    }, ExtArgs["result"]["validationTokenAudit"]>
    composites: {}
  }

  type ValidationTokenAuditGetPayload<S extends boolean | null | undefined | ValidationTokenAuditDefaultArgs> = $Result.GetResult<Prisma.$ValidationTokenAuditPayload, S>

  type ValidationTokenAuditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ValidationTokenAuditFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ValidationTokenAuditCountAggregateInputType | true
    }

  export interface ValidationTokenAuditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ValidationTokenAudit'], meta: { name: 'ValidationTokenAudit' } }
    /**
     * Find zero or one ValidationTokenAudit that matches the filter.
     * @param {ValidationTokenAuditFindUniqueArgs} args - Arguments to find a ValidationTokenAudit
     * @example
     * // Get one ValidationTokenAudit
     * const validationTokenAudit = await prisma.validationTokenAudit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ValidationTokenAuditFindUniqueArgs>(args: SelectSubset<T, ValidationTokenAuditFindUniqueArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ValidationTokenAudit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ValidationTokenAuditFindUniqueOrThrowArgs} args - Arguments to find a ValidationTokenAudit
     * @example
     * // Get one ValidationTokenAudit
     * const validationTokenAudit = await prisma.validationTokenAudit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ValidationTokenAuditFindUniqueOrThrowArgs>(args: SelectSubset<T, ValidationTokenAuditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ValidationTokenAudit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditFindFirstArgs} args - Arguments to find a ValidationTokenAudit
     * @example
     * // Get one ValidationTokenAudit
     * const validationTokenAudit = await prisma.validationTokenAudit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ValidationTokenAuditFindFirstArgs>(args?: SelectSubset<T, ValidationTokenAuditFindFirstArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ValidationTokenAudit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditFindFirstOrThrowArgs} args - Arguments to find a ValidationTokenAudit
     * @example
     * // Get one ValidationTokenAudit
     * const validationTokenAudit = await prisma.validationTokenAudit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ValidationTokenAuditFindFirstOrThrowArgs>(args?: SelectSubset<T, ValidationTokenAuditFindFirstOrThrowArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ValidationTokenAudits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ValidationTokenAudits
     * const validationTokenAudits = await prisma.validationTokenAudit.findMany()
     * 
     * // Get first 10 ValidationTokenAudits
     * const validationTokenAudits = await prisma.validationTokenAudit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const validationTokenAuditWithIdOnly = await prisma.validationTokenAudit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ValidationTokenAuditFindManyArgs>(args?: SelectSubset<T, ValidationTokenAuditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ValidationTokenAudit.
     * @param {ValidationTokenAuditCreateArgs} args - Arguments to create a ValidationTokenAudit.
     * @example
     * // Create one ValidationTokenAudit
     * const ValidationTokenAudit = await prisma.validationTokenAudit.create({
     *   data: {
     *     // ... data to create a ValidationTokenAudit
     *   }
     * })
     * 
     */
    create<T extends ValidationTokenAuditCreateArgs>(args: SelectSubset<T, ValidationTokenAuditCreateArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ValidationTokenAudits.
     * @param {ValidationTokenAuditCreateManyArgs} args - Arguments to create many ValidationTokenAudits.
     * @example
     * // Create many ValidationTokenAudits
     * const validationTokenAudit = await prisma.validationTokenAudit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ValidationTokenAuditCreateManyArgs>(args?: SelectSubset<T, ValidationTokenAuditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ValidationTokenAudits and returns the data saved in the database.
     * @param {ValidationTokenAuditCreateManyAndReturnArgs} args - Arguments to create many ValidationTokenAudits.
     * @example
     * // Create many ValidationTokenAudits
     * const validationTokenAudit = await prisma.validationTokenAudit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ValidationTokenAudits and only return the `id`
     * const validationTokenAuditWithIdOnly = await prisma.validationTokenAudit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ValidationTokenAuditCreateManyAndReturnArgs>(args?: SelectSubset<T, ValidationTokenAuditCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ValidationTokenAudit.
     * @param {ValidationTokenAuditDeleteArgs} args - Arguments to delete one ValidationTokenAudit.
     * @example
     * // Delete one ValidationTokenAudit
     * const ValidationTokenAudit = await prisma.validationTokenAudit.delete({
     *   where: {
     *     // ... filter to delete one ValidationTokenAudit
     *   }
     * })
     * 
     */
    delete<T extends ValidationTokenAuditDeleteArgs>(args: SelectSubset<T, ValidationTokenAuditDeleteArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ValidationTokenAudit.
     * @param {ValidationTokenAuditUpdateArgs} args - Arguments to update one ValidationTokenAudit.
     * @example
     * // Update one ValidationTokenAudit
     * const validationTokenAudit = await prisma.validationTokenAudit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ValidationTokenAuditUpdateArgs>(args: SelectSubset<T, ValidationTokenAuditUpdateArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ValidationTokenAudits.
     * @param {ValidationTokenAuditDeleteManyArgs} args - Arguments to filter ValidationTokenAudits to delete.
     * @example
     * // Delete a few ValidationTokenAudits
     * const { count } = await prisma.validationTokenAudit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ValidationTokenAuditDeleteManyArgs>(args?: SelectSubset<T, ValidationTokenAuditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidationTokenAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ValidationTokenAudits
     * const validationTokenAudit = await prisma.validationTokenAudit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ValidationTokenAuditUpdateManyArgs>(args: SelectSubset<T, ValidationTokenAuditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ValidationTokenAudit.
     * @param {ValidationTokenAuditUpsertArgs} args - Arguments to update or create a ValidationTokenAudit.
     * @example
     * // Update or create a ValidationTokenAudit
     * const validationTokenAudit = await prisma.validationTokenAudit.upsert({
     *   create: {
     *     // ... data to create a ValidationTokenAudit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ValidationTokenAudit we want to update
     *   }
     * })
     */
    upsert<T extends ValidationTokenAuditUpsertArgs>(args: SelectSubset<T, ValidationTokenAuditUpsertArgs<ExtArgs>>): Prisma__ValidationTokenAuditClient<$Result.GetResult<Prisma.$ValidationTokenAuditPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ValidationTokenAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditCountArgs} args - Arguments to filter ValidationTokenAudits to count.
     * @example
     * // Count the number of ValidationTokenAudits
     * const count = await prisma.validationTokenAudit.count({
     *   where: {
     *     // ... the filter for the ValidationTokenAudits we want to count
     *   }
     * })
    **/
    count<T extends ValidationTokenAuditCountArgs>(
      args?: Subset<T, ValidationTokenAuditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ValidationTokenAuditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ValidationTokenAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ValidationTokenAuditAggregateArgs>(args: Subset<T, ValidationTokenAuditAggregateArgs>): Prisma.PrismaPromise<GetValidationTokenAuditAggregateType<T>>

    /**
     * Group by ValidationTokenAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidationTokenAuditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ValidationTokenAuditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ValidationTokenAuditGroupByArgs['orderBy'] }
        : { orderBy?: ValidationTokenAuditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ValidationTokenAuditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetValidationTokenAuditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ValidationTokenAudit model
   */
  readonly fields: ValidationTokenAuditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ValidationTokenAudit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ValidationTokenAuditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ValidationTokenAudit model
   */ 
  interface ValidationTokenAuditFieldRefs {
    readonly id: FieldRef<"ValidationTokenAudit", 'String'>
    readonly tokenId: FieldRef<"ValidationTokenAudit", 'String'>
    readonly userPublicKey: FieldRef<"ValidationTokenAudit", 'String'>
    readonly userPublicKeyHash: FieldRef<"ValidationTokenAudit", 'String'>
    readonly fileMetadataHash: FieldRef<"ValidationTokenAudit", 'String'>
    readonly requestNonce: FieldRef<"ValidationTokenAudit", 'String'>
    readonly issuedAt: FieldRef<"ValidationTokenAudit", 'DateTime'>
    readonly expiresAt: FieldRef<"ValidationTokenAudit", 'DateTime'>
    readonly signature: FieldRef<"ValidationTokenAudit", 'String'>
    readonly createdAt: FieldRef<"ValidationTokenAudit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ValidationTokenAudit findUnique
   */
  export type ValidationTokenAuditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * Filter, which ValidationTokenAudit to fetch.
     */
    where: ValidationTokenAuditWhereUniqueInput
  }

  /**
   * ValidationTokenAudit findUniqueOrThrow
   */
  export type ValidationTokenAuditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * Filter, which ValidationTokenAudit to fetch.
     */
    where: ValidationTokenAuditWhereUniqueInput
  }

  /**
   * ValidationTokenAudit findFirst
   */
  export type ValidationTokenAuditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * Filter, which ValidationTokenAudit to fetch.
     */
    where?: ValidationTokenAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokenAudits to fetch.
     */
    orderBy?: ValidationTokenAuditOrderByWithRelationInput | ValidationTokenAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationTokenAudits.
     */
    cursor?: ValidationTokenAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokenAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokenAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationTokenAudits.
     */
    distinct?: ValidationTokenAuditScalarFieldEnum | ValidationTokenAuditScalarFieldEnum[]
  }

  /**
   * ValidationTokenAudit findFirstOrThrow
   */
  export type ValidationTokenAuditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * Filter, which ValidationTokenAudit to fetch.
     */
    where?: ValidationTokenAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokenAudits to fetch.
     */
    orderBy?: ValidationTokenAuditOrderByWithRelationInput | ValidationTokenAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidationTokenAudits.
     */
    cursor?: ValidationTokenAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokenAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokenAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidationTokenAudits.
     */
    distinct?: ValidationTokenAuditScalarFieldEnum | ValidationTokenAuditScalarFieldEnum[]
  }

  /**
   * ValidationTokenAudit findMany
   */
  export type ValidationTokenAuditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * Filter, which ValidationTokenAudits to fetch.
     */
    where?: ValidationTokenAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidationTokenAudits to fetch.
     */
    orderBy?: ValidationTokenAuditOrderByWithRelationInput | ValidationTokenAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ValidationTokenAudits.
     */
    cursor?: ValidationTokenAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidationTokenAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidationTokenAudits.
     */
    skip?: number
    distinct?: ValidationTokenAuditScalarFieldEnum | ValidationTokenAuditScalarFieldEnum[]
  }

  /**
   * ValidationTokenAudit create
   */
  export type ValidationTokenAuditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * The data needed to create a ValidationTokenAudit.
     */
    data: XOR<ValidationTokenAuditCreateInput, ValidationTokenAuditUncheckedCreateInput>
  }

  /**
   * ValidationTokenAudit createMany
   */
  export type ValidationTokenAuditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ValidationTokenAudits.
     */
    data: ValidationTokenAuditCreateManyInput | ValidationTokenAuditCreateManyInput[]
  }

  /**
   * ValidationTokenAudit createManyAndReturn
   */
  export type ValidationTokenAuditCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ValidationTokenAudits.
     */
    data: ValidationTokenAuditCreateManyInput | ValidationTokenAuditCreateManyInput[]
  }

  /**
   * ValidationTokenAudit update
   */
  export type ValidationTokenAuditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * The data needed to update a ValidationTokenAudit.
     */
    data: XOR<ValidationTokenAuditUpdateInput, ValidationTokenAuditUncheckedUpdateInput>
    /**
     * Choose, which ValidationTokenAudit to update.
     */
    where: ValidationTokenAuditWhereUniqueInput
  }

  /**
   * ValidationTokenAudit updateMany
   */
  export type ValidationTokenAuditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ValidationTokenAudits.
     */
    data: XOR<ValidationTokenAuditUpdateManyMutationInput, ValidationTokenAuditUncheckedUpdateManyInput>
    /**
     * Filter which ValidationTokenAudits to update
     */
    where?: ValidationTokenAuditWhereInput
  }

  /**
   * ValidationTokenAudit upsert
   */
  export type ValidationTokenAuditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * The filter to search for the ValidationTokenAudit to update in case it exists.
     */
    where: ValidationTokenAuditWhereUniqueInput
    /**
     * In case the ValidationTokenAudit found by the `where` argument doesn't exist, create a new ValidationTokenAudit with this data.
     */
    create: XOR<ValidationTokenAuditCreateInput, ValidationTokenAuditUncheckedCreateInput>
    /**
     * In case the ValidationTokenAudit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ValidationTokenAuditUpdateInput, ValidationTokenAuditUncheckedUpdateInput>
  }

  /**
   * ValidationTokenAudit delete
   */
  export type ValidationTokenAuditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
    /**
     * Filter which ValidationTokenAudit to delete.
     */
    where: ValidationTokenAuditWhereUniqueInput
  }

  /**
   * ValidationTokenAudit deleteMany
   */
  export type ValidationTokenAuditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidationTokenAudits to delete
     */
    where?: ValidationTokenAuditWhereInput
  }

  /**
   * ValidationTokenAudit without action
   */
  export type ValidationTokenAuditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidationTokenAudit
     */
    select?: ValidationTokenAuditSelect<ExtArgs> | null
  }


  /**
   * Model BannedUser
   */

  export type AggregateBannedUser = {
    _count: BannedUserCountAggregateOutputType | null
    _min: BannedUserMinAggregateOutputType | null
    _max: BannedUserMaxAggregateOutputType | null
  }

  export type BannedUserMinAggregateOutputType = {
    id: string | null
    publicKey: string | null
    reason: string | null
    bannedByAdmin: string | null
    bannedAt: Date | null
  }

  export type BannedUserMaxAggregateOutputType = {
    id: string | null
    publicKey: string | null
    reason: string | null
    bannedByAdmin: string | null
    bannedAt: Date | null
  }

  export type BannedUserCountAggregateOutputType = {
    id: number
    publicKey: number
    reason: number
    bannedByAdmin: number
    bannedAt: number
    _all: number
  }


  export type BannedUserMinAggregateInputType = {
    id?: true
    publicKey?: true
    reason?: true
    bannedByAdmin?: true
    bannedAt?: true
  }

  export type BannedUserMaxAggregateInputType = {
    id?: true
    publicKey?: true
    reason?: true
    bannedByAdmin?: true
    bannedAt?: true
  }

  export type BannedUserCountAggregateInputType = {
    id?: true
    publicKey?: true
    reason?: true
    bannedByAdmin?: true
    bannedAt?: true
    _all?: true
  }

  export type BannedUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BannedUser to aggregate.
     */
    where?: BannedUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BannedUsers to fetch.
     */
    orderBy?: BannedUserOrderByWithRelationInput | BannedUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BannedUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BannedUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BannedUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BannedUsers
    **/
    _count?: true | BannedUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BannedUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BannedUserMaxAggregateInputType
  }

  export type GetBannedUserAggregateType<T extends BannedUserAggregateArgs> = {
        [P in keyof T & keyof AggregateBannedUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBannedUser[P]>
      : GetScalarType<T[P], AggregateBannedUser[P]>
  }




  export type BannedUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BannedUserWhereInput
    orderBy?: BannedUserOrderByWithAggregationInput | BannedUserOrderByWithAggregationInput[]
    by: BannedUserScalarFieldEnum[] | BannedUserScalarFieldEnum
    having?: BannedUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BannedUserCountAggregateInputType | true
    _min?: BannedUserMinAggregateInputType
    _max?: BannedUserMaxAggregateInputType
  }

  export type BannedUserGroupByOutputType = {
    id: string
    publicKey: string
    reason: string
    bannedByAdmin: string
    bannedAt: Date
    _count: BannedUserCountAggregateOutputType | null
    _min: BannedUserMinAggregateOutputType | null
    _max: BannedUserMaxAggregateOutputType | null
  }

  type GetBannedUserGroupByPayload<T extends BannedUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BannedUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BannedUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BannedUserGroupByOutputType[P]>
            : GetScalarType<T[P], BannedUserGroupByOutputType[P]>
        }
      >
    >


  export type BannedUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicKey?: boolean
    reason?: boolean
    bannedByAdmin?: boolean
    bannedAt?: boolean
  }, ExtArgs["result"]["bannedUser"]>

  export type BannedUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicKey?: boolean
    reason?: boolean
    bannedByAdmin?: boolean
    bannedAt?: boolean
  }, ExtArgs["result"]["bannedUser"]>

  export type BannedUserSelectScalar = {
    id?: boolean
    publicKey?: boolean
    reason?: boolean
    bannedByAdmin?: boolean
    bannedAt?: boolean
  }


  export type $BannedUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BannedUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      publicKey: string
      reason: string
      bannedByAdmin: string
      bannedAt: Date
    }, ExtArgs["result"]["bannedUser"]>
    composites: {}
  }

  type BannedUserGetPayload<S extends boolean | null | undefined | BannedUserDefaultArgs> = $Result.GetResult<Prisma.$BannedUserPayload, S>

  type BannedUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BannedUserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BannedUserCountAggregateInputType | true
    }

  export interface BannedUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BannedUser'], meta: { name: 'BannedUser' } }
    /**
     * Find zero or one BannedUser that matches the filter.
     * @param {BannedUserFindUniqueArgs} args - Arguments to find a BannedUser
     * @example
     * // Get one BannedUser
     * const bannedUser = await prisma.bannedUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BannedUserFindUniqueArgs>(args: SelectSubset<T, BannedUserFindUniqueArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BannedUser that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BannedUserFindUniqueOrThrowArgs} args - Arguments to find a BannedUser
     * @example
     * // Get one BannedUser
     * const bannedUser = await prisma.bannedUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BannedUserFindUniqueOrThrowArgs>(args: SelectSubset<T, BannedUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BannedUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserFindFirstArgs} args - Arguments to find a BannedUser
     * @example
     * // Get one BannedUser
     * const bannedUser = await prisma.bannedUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BannedUserFindFirstArgs>(args?: SelectSubset<T, BannedUserFindFirstArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BannedUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserFindFirstOrThrowArgs} args - Arguments to find a BannedUser
     * @example
     * // Get one BannedUser
     * const bannedUser = await prisma.bannedUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BannedUserFindFirstOrThrowArgs>(args?: SelectSubset<T, BannedUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BannedUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BannedUsers
     * const bannedUsers = await prisma.bannedUser.findMany()
     * 
     * // Get first 10 BannedUsers
     * const bannedUsers = await prisma.bannedUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bannedUserWithIdOnly = await prisma.bannedUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BannedUserFindManyArgs>(args?: SelectSubset<T, BannedUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BannedUser.
     * @param {BannedUserCreateArgs} args - Arguments to create a BannedUser.
     * @example
     * // Create one BannedUser
     * const BannedUser = await prisma.bannedUser.create({
     *   data: {
     *     // ... data to create a BannedUser
     *   }
     * })
     * 
     */
    create<T extends BannedUserCreateArgs>(args: SelectSubset<T, BannedUserCreateArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BannedUsers.
     * @param {BannedUserCreateManyArgs} args - Arguments to create many BannedUsers.
     * @example
     * // Create many BannedUsers
     * const bannedUser = await prisma.bannedUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BannedUserCreateManyArgs>(args?: SelectSubset<T, BannedUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BannedUsers and returns the data saved in the database.
     * @param {BannedUserCreateManyAndReturnArgs} args - Arguments to create many BannedUsers.
     * @example
     * // Create many BannedUsers
     * const bannedUser = await prisma.bannedUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BannedUsers and only return the `id`
     * const bannedUserWithIdOnly = await prisma.bannedUser.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BannedUserCreateManyAndReturnArgs>(args?: SelectSubset<T, BannedUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BannedUser.
     * @param {BannedUserDeleteArgs} args - Arguments to delete one BannedUser.
     * @example
     * // Delete one BannedUser
     * const BannedUser = await prisma.bannedUser.delete({
     *   where: {
     *     // ... filter to delete one BannedUser
     *   }
     * })
     * 
     */
    delete<T extends BannedUserDeleteArgs>(args: SelectSubset<T, BannedUserDeleteArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BannedUser.
     * @param {BannedUserUpdateArgs} args - Arguments to update one BannedUser.
     * @example
     * // Update one BannedUser
     * const bannedUser = await prisma.bannedUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BannedUserUpdateArgs>(args: SelectSubset<T, BannedUserUpdateArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BannedUsers.
     * @param {BannedUserDeleteManyArgs} args - Arguments to filter BannedUsers to delete.
     * @example
     * // Delete a few BannedUsers
     * const { count } = await prisma.bannedUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BannedUserDeleteManyArgs>(args?: SelectSubset<T, BannedUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BannedUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BannedUsers
     * const bannedUser = await prisma.bannedUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BannedUserUpdateManyArgs>(args: SelectSubset<T, BannedUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BannedUser.
     * @param {BannedUserUpsertArgs} args - Arguments to update or create a BannedUser.
     * @example
     * // Update or create a BannedUser
     * const bannedUser = await prisma.bannedUser.upsert({
     *   create: {
     *     // ... data to create a BannedUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BannedUser we want to update
     *   }
     * })
     */
    upsert<T extends BannedUserUpsertArgs>(args: SelectSubset<T, BannedUserUpsertArgs<ExtArgs>>): Prisma__BannedUserClient<$Result.GetResult<Prisma.$BannedUserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BannedUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserCountArgs} args - Arguments to filter BannedUsers to count.
     * @example
     * // Count the number of BannedUsers
     * const count = await prisma.bannedUser.count({
     *   where: {
     *     // ... the filter for the BannedUsers we want to count
     *   }
     * })
    **/
    count<T extends BannedUserCountArgs>(
      args?: Subset<T, BannedUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BannedUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BannedUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BannedUserAggregateArgs>(args: Subset<T, BannedUserAggregateArgs>): Prisma.PrismaPromise<GetBannedUserAggregateType<T>>

    /**
     * Group by BannedUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BannedUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BannedUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BannedUserGroupByArgs['orderBy'] }
        : { orderBy?: BannedUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BannedUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBannedUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BannedUser model
   */
  readonly fields: BannedUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BannedUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BannedUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BannedUser model
   */ 
  interface BannedUserFieldRefs {
    readonly id: FieldRef<"BannedUser", 'String'>
    readonly publicKey: FieldRef<"BannedUser", 'String'>
    readonly reason: FieldRef<"BannedUser", 'String'>
    readonly bannedByAdmin: FieldRef<"BannedUser", 'String'>
    readonly bannedAt: FieldRef<"BannedUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BannedUser findUnique
   */
  export type BannedUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * Filter, which BannedUser to fetch.
     */
    where: BannedUserWhereUniqueInput
  }

  /**
   * BannedUser findUniqueOrThrow
   */
  export type BannedUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * Filter, which BannedUser to fetch.
     */
    where: BannedUserWhereUniqueInput
  }

  /**
   * BannedUser findFirst
   */
  export type BannedUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * Filter, which BannedUser to fetch.
     */
    where?: BannedUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BannedUsers to fetch.
     */
    orderBy?: BannedUserOrderByWithRelationInput | BannedUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BannedUsers.
     */
    cursor?: BannedUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BannedUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BannedUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BannedUsers.
     */
    distinct?: BannedUserScalarFieldEnum | BannedUserScalarFieldEnum[]
  }

  /**
   * BannedUser findFirstOrThrow
   */
  export type BannedUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * Filter, which BannedUser to fetch.
     */
    where?: BannedUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BannedUsers to fetch.
     */
    orderBy?: BannedUserOrderByWithRelationInput | BannedUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BannedUsers.
     */
    cursor?: BannedUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BannedUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BannedUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BannedUsers.
     */
    distinct?: BannedUserScalarFieldEnum | BannedUserScalarFieldEnum[]
  }

  /**
   * BannedUser findMany
   */
  export type BannedUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * Filter, which BannedUsers to fetch.
     */
    where?: BannedUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BannedUsers to fetch.
     */
    orderBy?: BannedUserOrderByWithRelationInput | BannedUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BannedUsers.
     */
    cursor?: BannedUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BannedUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BannedUsers.
     */
    skip?: number
    distinct?: BannedUserScalarFieldEnum | BannedUserScalarFieldEnum[]
  }

  /**
   * BannedUser create
   */
  export type BannedUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * The data needed to create a BannedUser.
     */
    data: XOR<BannedUserCreateInput, BannedUserUncheckedCreateInput>
  }

  /**
   * BannedUser createMany
   */
  export type BannedUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BannedUsers.
     */
    data: BannedUserCreateManyInput | BannedUserCreateManyInput[]
  }

  /**
   * BannedUser createManyAndReturn
   */
  export type BannedUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BannedUsers.
     */
    data: BannedUserCreateManyInput | BannedUserCreateManyInput[]
  }

  /**
   * BannedUser update
   */
  export type BannedUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * The data needed to update a BannedUser.
     */
    data: XOR<BannedUserUpdateInput, BannedUserUncheckedUpdateInput>
    /**
     * Choose, which BannedUser to update.
     */
    where: BannedUserWhereUniqueInput
  }

  /**
   * BannedUser updateMany
   */
  export type BannedUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BannedUsers.
     */
    data: XOR<BannedUserUpdateManyMutationInput, BannedUserUncheckedUpdateManyInput>
    /**
     * Filter which BannedUsers to update
     */
    where?: BannedUserWhereInput
  }

  /**
   * BannedUser upsert
   */
  export type BannedUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * The filter to search for the BannedUser to update in case it exists.
     */
    where: BannedUserWhereUniqueInput
    /**
     * In case the BannedUser found by the `where` argument doesn't exist, create a new BannedUser with this data.
     */
    create: XOR<BannedUserCreateInput, BannedUserUncheckedCreateInput>
    /**
     * In case the BannedUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BannedUserUpdateInput, BannedUserUncheckedUpdateInput>
  }

  /**
   * BannedUser delete
   */
  export type BannedUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
    /**
     * Filter which BannedUser to delete.
     */
    where: BannedUserWhereUniqueInput
  }

  /**
   * BannedUser deleteMany
   */
  export type BannedUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BannedUsers to delete
     */
    where?: BannedUserWhereInput
  }

  /**
   * BannedUser without action
   */
  export type BannedUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BannedUser
     */
    select?: BannedUserSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    publicKey: 'publicKey',
    displayLabel: 'displayLabel',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FileScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    totalSize: 'totalSize',
    mimeType: 'mimeType',
    chunkCount: 'chunkCount',
    metadata: 'metadata',
    metadataHash: 'metadataHash',
    encryptedChunkKeys: 'encryptedChunkKeys',
    ringSignature: 'ringSignature',
    ringPublicKeys: 'ringPublicKeys',
    escrowedIdentity: 'escrowedIdentity',
    ownershipPublicKey: 'ownershipPublicKey',
    ownershipCreatedAt: 'ownershipCreatedAt',
    uploaderId: 'uploaderId',
    uploaderPublicKeyHash: 'uploaderPublicKeyHash',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastRevocationId: 'lastRevocationId',
    lastRevocationAt: 'lastRevocationAt'
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const FileChunkScalarFieldEnum: {
    id: 'id',
    fileId: 'fileId',
    chunkIndex: 'chunkIndex',
    chunkHash: 'chunkHash',
    ipfsCid: 'ipfsCid',
    size: 'size',
    encryptedAt: 'encryptedAt',
    createdAt: 'createdAt'
  };

  export type FileChunkScalarFieldEnum = (typeof FileChunkScalarFieldEnum)[keyof typeof FileChunkScalarFieldEnum]


  export const AnonymousRevocationScalarFieldEnum: {
    id: 'id',
    fileId: 'fileId',
    revokedPublicKeyHash: 'revokedPublicKeyHash',
    proofR: 'proofR',
    proofS: 'proofS',
    proofMessage: 'proofMessage',
    proofTimestamp: 'proofTimestamp',
    ringSignature: 'ringSignature',
    ringPublicKeys: 'ringPublicKeys',
    chunksReencrypted: 'chunksReencrypted',
    revocationStrategy: 'revocationStrategy',
    createdAt: 'createdAt',
    executedBySystem: 'executedBySystem'
  };

  export type AnonymousRevocationScalarFieldEnum = (typeof AnonymousRevocationScalarFieldEnum)[keyof typeof AnonymousRevocationScalarFieldEnum]


  export const IntegrityAlertScalarFieldEnum: {
    id: 'id',
    fileId: 'fileId',
    chunkIndex: 'chunkIndex',
    expectedHash: 'expectedHash',
    actualHash: 'actualHash',
    reportedByPublicKeyHash: 'reportedByPublicKeyHash',
    reportedAt: 'reportedAt',
    resolved: 'resolved',
    resolvedAt: 'resolvedAt',
    resolution: 'resolution'
  };

  export type IntegrityAlertScalarFieldEnum = (typeof IntegrityAlertScalarFieldEnum)[keyof typeof IntegrityAlertScalarFieldEnum]


  export const AnonymousFileAccessScalarFieldEnum: {
    id: 'id',
    accessorPublicKeyHash: 'accessorPublicKeyHash',
    fileId: 'fileId',
    grantedAt: 'grantedAt',
    expiresAt: 'expiresAt',
    lastAccessProof: 'lastAccessProof',
    lastAccessAt: 'lastAccessAt',
    accessCount: 'accessCount',
    keyStatus: 'keyStatus',
    keyPackageFingerprint: 'keyPackageFingerprint',
    status: 'status',
    revokedAt: 'revokedAt',
    lastOwnerProof: 'lastOwnerProof'
  };

  export type AnonymousFileAccessScalarFieldEnum = (typeof AnonymousFileAccessScalarFieldEnum)[keyof typeof AnonymousFileAccessScalarFieldEnum]


  export const AnonymousAuditLogScalarFieldEnum: {
    id: 'id',
    eventType: 'eventType',
    fileId: 'fileId',
    publicKeyHash: 'publicKeyHash',
    deviceFingerprint: 'deviceFingerprint',
    ringSignature: 'ringSignature',
    ringPublicKeys: 'ringPublicKeys',
    metadata: 'metadata',
    timestamp: 'timestamp',
    status: 'status',
    revokedAt: 'revokedAt',
    lastOwnerProof: 'lastOwnerProof'
  };

  export type AnonymousAuditLogScalarFieldEnum = (typeof AnonymousAuditLogScalarFieldEnum)[keyof typeof AnonymousAuditLogScalarFieldEnum]


  export const AnonymousSharingRequestScalarFieldEnum: {
    id: 'id',
    fileId: 'fileId',
    sharerPublicKeyHash: 'sharerPublicKeyHash',
    recipientPublicKeyHash: 'recipientPublicKeyHash',
    ownershipProof: 'ownershipProof',
    ringSignature: 'ringSignature',
    keyPackageFingerprint: 'keyPackageFingerprint',
    status: 'status',
    requestedAt: 'requestedAt',
    respondedAt: 'respondedAt'
  };

  export type AnonymousSharingRequestScalarFieldEnum = (typeof AnonymousSharingRequestScalarFieldEnum)[keyof typeof AnonymousSharingRequestScalarFieldEnum]


  export const SignatureScalarFieldEnum: {
    id: 'id',
    fileId: 'fileId',
    signerId: 'signerId',
    ringUserIds: 'ringUserIds',
    signature: 'signature',
    isOpened: 'isOpened',
    openingProof: 'openingProof',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SignatureScalarFieldEnum = (typeof SignatureScalarFieldEnum)[keyof typeof SignatureScalarFieldEnum]


  export const ValidationTokenScalarFieldEnum: {
    id: 'id',
    tokenId: 'tokenId',
    fileId: 'fileId',
    fileMetadataHash: 'fileMetadataHash',
    userPublicKeyHash: 'userPublicKeyHash',
    issuedAt: 'issuedAt',
    expiresAt: 'expiresAt',
    signature: 'signature',
    adjudicatorPublicKey: 'adjudicatorPublicKey',
    createdAt: 'createdAt'
  };

  export type ValidationTokenScalarFieldEnum = (typeof ValidationTokenScalarFieldEnum)[keyof typeof ValidationTokenScalarFieldEnum]


  export const InvestigationAuditScalarFieldEnum: {
    id: 'id',
    investigationId: 'investigationId',
    fileId: 'fileId',
    reason: 'reason',
    adminApproval: 'adminApproval',
    legalAuthorization: 'legalAuthorization',
    decryptedPublicKey: 'decryptedPublicKey',
    createdAt: 'createdAt'
  };

  export type InvestigationAuditScalarFieldEnum = (typeof InvestigationAuditScalarFieldEnum)[keyof typeof InvestigationAuditScalarFieldEnum]


  export const ValidationNonceScalarFieldEnum: {
    id: 'id',
    nonce: 'nonce',
    createdAt: 'createdAt'
  };

  export type ValidationNonceScalarFieldEnum = (typeof ValidationNonceScalarFieldEnum)[keyof typeof ValidationNonceScalarFieldEnum]


  export const ValidationTokenAuditScalarFieldEnum: {
    id: 'id',
    tokenId: 'tokenId',
    userPublicKey: 'userPublicKey',
    userPublicKeyHash: 'userPublicKeyHash',
    fileMetadataHash: 'fileMetadataHash',
    requestNonce: 'requestNonce',
    issuedAt: 'issuedAt',
    expiresAt: 'expiresAt',
    signature: 'signature',
    createdAt: 'createdAt'
  };

  export type ValidationTokenAuditScalarFieldEnum = (typeof ValidationTokenAuditScalarFieldEnum)[keyof typeof ValidationTokenAuditScalarFieldEnum]


  export const BannedUserScalarFieldEnum: {
    id: 'id',
    publicKey: 'publicKey',
    reason: 'reason',
    bannedByAdmin: 'bannedByAdmin',
    bannedAt: 'bannedAt'
  };

  export type BannedUserScalarFieldEnum = (typeof BannedUserScalarFieldEnum)[keyof typeof BannedUserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    publicKey?: StringFilter<"User"> | string
    displayLabel?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    uploadedFiles?: FileListRelationFilter
    signatures?: SignatureListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    publicKey?: SortOrder
    displayLabel?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    uploadedFiles?: FileOrderByRelationAggregateInput
    signatures?: SignatureOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    publicKey?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    displayLabel?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    uploadedFiles?: FileListRelationFilter
    signatures?: SignatureListRelationFilter
  }, "id" | "publicKey">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    publicKey?: SortOrder
    displayLabel?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    publicKey?: StringWithAggregatesFilter<"User"> | string
    displayLabel?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    id?: StringFilter<"File"> | string
    fileName?: StringFilter<"File"> | string
    totalSize?: IntFilter<"File"> | number
    mimeType?: StringNullableFilter<"File"> | string | null
    chunkCount?: IntFilter<"File"> | number
    metadata?: StringNullableFilter<"File"> | string | null
    metadataHash?: StringFilter<"File"> | string
    encryptedChunkKeys?: StringFilter<"File"> | string
    ringSignature?: StringNullableFilter<"File"> | string | null
    ringPublicKeys?: StringNullableFilter<"File"> | string | null
    escrowedIdentity?: StringNullableFilter<"File"> | string | null
    ownershipPublicKey?: StringFilter<"File"> | string
    ownershipCreatedAt?: DateTimeFilter<"File"> | Date | string
    uploaderId?: StringNullableFilter<"File"> | string | null
    uploaderPublicKeyHash?: StringNullableFilter<"File"> | string | null
    status?: StringFilter<"File"> | string
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    lastRevocationId?: StringNullableFilter<"File"> | string | null
    lastRevocationAt?: DateTimeNullableFilter<"File"> | Date | string | null
    anonymousAccess?: AnonymousFileAccessListRelationFilter
    revocations?: AnonymousRevocationListRelationFilter
    sharingRequests?: AnonymousSharingRequestListRelationFilter
    uploader?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    chunks?: FileChunkListRelationFilter
    integrityAlerts?: IntegrityAlertListRelationFilter
    signatures?: SignatureListRelationFilter
    validationToken?: XOR<ValidationTokenNullableRelationFilter, ValidationTokenWhereInput> | null
  }

  export type FileOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    totalSize?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    chunkCount?: SortOrder
    metadata?: SortOrderInput | SortOrder
    metadataHash?: SortOrder
    encryptedChunkKeys?: SortOrder
    ringSignature?: SortOrderInput | SortOrder
    ringPublicKeys?: SortOrderInput | SortOrder
    escrowedIdentity?: SortOrderInput | SortOrder
    ownershipPublicKey?: SortOrder
    ownershipCreatedAt?: SortOrder
    uploaderId?: SortOrderInput | SortOrder
    uploaderPublicKeyHash?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastRevocationId?: SortOrderInput | SortOrder
    lastRevocationAt?: SortOrderInput | SortOrder
    anonymousAccess?: AnonymousFileAccessOrderByRelationAggregateInput
    revocations?: AnonymousRevocationOrderByRelationAggregateInput
    sharingRequests?: AnonymousSharingRequestOrderByRelationAggregateInput
    uploader?: UserOrderByWithRelationInput
    chunks?: FileChunkOrderByRelationAggregateInput
    integrityAlerts?: IntegrityAlertOrderByRelationAggregateInput
    signatures?: SignatureOrderByRelationAggregateInput
    validationToken?: ValidationTokenOrderByWithRelationInput
  }

  export type FileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    fileName?: StringFilter<"File"> | string
    totalSize?: IntFilter<"File"> | number
    mimeType?: StringNullableFilter<"File"> | string | null
    chunkCount?: IntFilter<"File"> | number
    metadata?: StringNullableFilter<"File"> | string | null
    metadataHash?: StringFilter<"File"> | string
    encryptedChunkKeys?: StringFilter<"File"> | string
    ringSignature?: StringNullableFilter<"File"> | string | null
    ringPublicKeys?: StringNullableFilter<"File"> | string | null
    escrowedIdentity?: StringNullableFilter<"File"> | string | null
    ownershipPublicKey?: StringFilter<"File"> | string
    ownershipCreatedAt?: DateTimeFilter<"File"> | Date | string
    uploaderId?: StringNullableFilter<"File"> | string | null
    uploaderPublicKeyHash?: StringNullableFilter<"File"> | string | null
    status?: StringFilter<"File"> | string
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    lastRevocationId?: StringNullableFilter<"File"> | string | null
    lastRevocationAt?: DateTimeNullableFilter<"File"> | Date | string | null
    anonymousAccess?: AnonymousFileAccessListRelationFilter
    revocations?: AnonymousRevocationListRelationFilter
    sharingRequests?: AnonymousSharingRequestListRelationFilter
    uploader?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    chunks?: FileChunkListRelationFilter
    integrityAlerts?: IntegrityAlertListRelationFilter
    signatures?: SignatureListRelationFilter
    validationToken?: XOR<ValidationTokenNullableRelationFilter, ValidationTokenWhereInput> | null
  }, "id">

  export type FileOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    totalSize?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    chunkCount?: SortOrder
    metadata?: SortOrderInput | SortOrder
    metadataHash?: SortOrder
    encryptedChunkKeys?: SortOrder
    ringSignature?: SortOrderInput | SortOrder
    ringPublicKeys?: SortOrderInput | SortOrder
    escrowedIdentity?: SortOrderInput | SortOrder
    ownershipPublicKey?: SortOrder
    ownershipCreatedAt?: SortOrder
    uploaderId?: SortOrderInput | SortOrder
    uploaderPublicKeyHash?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastRevocationId?: SortOrderInput | SortOrder
    lastRevocationAt?: SortOrderInput | SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    OR?: FileScalarWhereWithAggregatesInput[]
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"File"> | string
    fileName?: StringWithAggregatesFilter<"File"> | string
    totalSize?: IntWithAggregatesFilter<"File"> | number
    mimeType?: StringNullableWithAggregatesFilter<"File"> | string | null
    chunkCount?: IntWithAggregatesFilter<"File"> | number
    metadata?: StringNullableWithAggregatesFilter<"File"> | string | null
    metadataHash?: StringWithAggregatesFilter<"File"> | string
    encryptedChunkKeys?: StringWithAggregatesFilter<"File"> | string
    ringSignature?: StringNullableWithAggregatesFilter<"File"> | string | null
    ringPublicKeys?: StringNullableWithAggregatesFilter<"File"> | string | null
    escrowedIdentity?: StringNullableWithAggregatesFilter<"File"> | string | null
    ownershipPublicKey?: StringWithAggregatesFilter<"File"> | string
    ownershipCreatedAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    uploaderId?: StringNullableWithAggregatesFilter<"File"> | string | null
    uploaderPublicKeyHash?: StringNullableWithAggregatesFilter<"File"> | string | null
    status?: StringWithAggregatesFilter<"File"> | string
    createdAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    lastRevocationId?: StringNullableWithAggregatesFilter<"File"> | string | null
    lastRevocationAt?: DateTimeNullableWithAggregatesFilter<"File"> | Date | string | null
  }

  export type FileChunkWhereInput = {
    AND?: FileChunkWhereInput | FileChunkWhereInput[]
    OR?: FileChunkWhereInput[]
    NOT?: FileChunkWhereInput | FileChunkWhereInput[]
    id?: StringFilter<"FileChunk"> | string
    fileId?: StringFilter<"FileChunk"> | string
    chunkIndex?: IntFilter<"FileChunk"> | number
    chunkHash?: StringFilter<"FileChunk"> | string
    ipfsCid?: StringFilter<"FileChunk"> | string
    size?: IntFilter<"FileChunk"> | number
    encryptedAt?: DateTimeFilter<"FileChunk"> | Date | string
    createdAt?: DateTimeFilter<"FileChunk"> | Date | string
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type FileChunkOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    chunkHash?: SortOrder
    ipfsCid?: SortOrder
    size?: SortOrder
    encryptedAt?: SortOrder
    createdAt?: SortOrder
    file?: FileOrderByWithRelationInput
  }

  export type FileChunkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    fileId_chunkIndex?: FileChunkFileIdChunkIndexCompoundUniqueInput
    AND?: FileChunkWhereInput | FileChunkWhereInput[]
    OR?: FileChunkWhereInput[]
    NOT?: FileChunkWhereInput | FileChunkWhereInput[]
    fileId?: StringFilter<"FileChunk"> | string
    chunkIndex?: IntFilter<"FileChunk"> | number
    chunkHash?: StringFilter<"FileChunk"> | string
    ipfsCid?: StringFilter<"FileChunk"> | string
    size?: IntFilter<"FileChunk"> | number
    encryptedAt?: DateTimeFilter<"FileChunk"> | Date | string
    createdAt?: DateTimeFilter<"FileChunk"> | Date | string
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id" | "fileId_chunkIndex">

  export type FileChunkOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    chunkHash?: SortOrder
    ipfsCid?: SortOrder
    size?: SortOrder
    encryptedAt?: SortOrder
    createdAt?: SortOrder
    _count?: FileChunkCountOrderByAggregateInput
    _avg?: FileChunkAvgOrderByAggregateInput
    _max?: FileChunkMaxOrderByAggregateInput
    _min?: FileChunkMinOrderByAggregateInput
    _sum?: FileChunkSumOrderByAggregateInput
  }

  export type FileChunkScalarWhereWithAggregatesInput = {
    AND?: FileChunkScalarWhereWithAggregatesInput | FileChunkScalarWhereWithAggregatesInput[]
    OR?: FileChunkScalarWhereWithAggregatesInput[]
    NOT?: FileChunkScalarWhereWithAggregatesInput | FileChunkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileChunk"> | string
    fileId?: StringWithAggregatesFilter<"FileChunk"> | string
    chunkIndex?: IntWithAggregatesFilter<"FileChunk"> | number
    chunkHash?: StringWithAggregatesFilter<"FileChunk"> | string
    ipfsCid?: StringWithAggregatesFilter<"FileChunk"> | string
    size?: IntWithAggregatesFilter<"FileChunk"> | number
    encryptedAt?: DateTimeWithAggregatesFilter<"FileChunk"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"FileChunk"> | Date | string
  }

  export type AnonymousRevocationWhereInput = {
    AND?: AnonymousRevocationWhereInput | AnonymousRevocationWhereInput[]
    OR?: AnonymousRevocationWhereInput[]
    NOT?: AnonymousRevocationWhereInput | AnonymousRevocationWhereInput[]
    id?: StringFilter<"AnonymousRevocation"> | string
    fileId?: StringFilter<"AnonymousRevocation"> | string
    revokedPublicKeyHash?: StringNullableFilter<"AnonymousRevocation"> | string | null
    proofR?: StringFilter<"AnonymousRevocation"> | string
    proofS?: StringFilter<"AnonymousRevocation"> | string
    proofMessage?: StringFilter<"AnonymousRevocation"> | string
    proofTimestamp?: DateTimeFilter<"AnonymousRevocation"> | Date | string
    ringSignature?: StringNullableFilter<"AnonymousRevocation"> | string | null
    ringPublicKeys?: StringNullableFilter<"AnonymousRevocation"> | string | null
    chunksReencrypted?: StringFilter<"AnonymousRevocation"> | string
    revocationStrategy?: StringNullableFilter<"AnonymousRevocation"> | string | null
    createdAt?: DateTimeFilter<"AnonymousRevocation"> | Date | string
    executedBySystem?: BoolFilter<"AnonymousRevocation"> | boolean
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type AnonymousRevocationOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    revokedPublicKeyHash?: SortOrderInput | SortOrder
    proofR?: SortOrder
    proofS?: SortOrder
    proofMessage?: SortOrder
    proofTimestamp?: SortOrder
    ringSignature?: SortOrderInput | SortOrder
    ringPublicKeys?: SortOrderInput | SortOrder
    chunksReencrypted?: SortOrder
    revocationStrategy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    executedBySystem?: SortOrder
    file?: FileOrderByWithRelationInput
  }

  export type AnonymousRevocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnonymousRevocationWhereInput | AnonymousRevocationWhereInput[]
    OR?: AnonymousRevocationWhereInput[]
    NOT?: AnonymousRevocationWhereInput | AnonymousRevocationWhereInput[]
    fileId?: StringFilter<"AnonymousRevocation"> | string
    revokedPublicKeyHash?: StringNullableFilter<"AnonymousRevocation"> | string | null
    proofR?: StringFilter<"AnonymousRevocation"> | string
    proofS?: StringFilter<"AnonymousRevocation"> | string
    proofMessage?: StringFilter<"AnonymousRevocation"> | string
    proofTimestamp?: DateTimeFilter<"AnonymousRevocation"> | Date | string
    ringSignature?: StringNullableFilter<"AnonymousRevocation"> | string | null
    ringPublicKeys?: StringNullableFilter<"AnonymousRevocation"> | string | null
    chunksReencrypted?: StringFilter<"AnonymousRevocation"> | string
    revocationStrategy?: StringNullableFilter<"AnonymousRevocation"> | string | null
    createdAt?: DateTimeFilter<"AnonymousRevocation"> | Date | string
    executedBySystem?: BoolFilter<"AnonymousRevocation"> | boolean
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id">

  export type AnonymousRevocationOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    revokedPublicKeyHash?: SortOrderInput | SortOrder
    proofR?: SortOrder
    proofS?: SortOrder
    proofMessage?: SortOrder
    proofTimestamp?: SortOrder
    ringSignature?: SortOrderInput | SortOrder
    ringPublicKeys?: SortOrderInput | SortOrder
    chunksReencrypted?: SortOrder
    revocationStrategy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    executedBySystem?: SortOrder
    _count?: AnonymousRevocationCountOrderByAggregateInput
    _max?: AnonymousRevocationMaxOrderByAggregateInput
    _min?: AnonymousRevocationMinOrderByAggregateInput
  }

  export type AnonymousRevocationScalarWhereWithAggregatesInput = {
    AND?: AnonymousRevocationScalarWhereWithAggregatesInput | AnonymousRevocationScalarWhereWithAggregatesInput[]
    OR?: AnonymousRevocationScalarWhereWithAggregatesInput[]
    NOT?: AnonymousRevocationScalarWhereWithAggregatesInput | AnonymousRevocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnonymousRevocation"> | string
    fileId?: StringWithAggregatesFilter<"AnonymousRevocation"> | string
    revokedPublicKeyHash?: StringNullableWithAggregatesFilter<"AnonymousRevocation"> | string | null
    proofR?: StringWithAggregatesFilter<"AnonymousRevocation"> | string
    proofS?: StringWithAggregatesFilter<"AnonymousRevocation"> | string
    proofMessage?: StringWithAggregatesFilter<"AnonymousRevocation"> | string
    proofTimestamp?: DateTimeWithAggregatesFilter<"AnonymousRevocation"> | Date | string
    ringSignature?: StringNullableWithAggregatesFilter<"AnonymousRevocation"> | string | null
    ringPublicKeys?: StringNullableWithAggregatesFilter<"AnonymousRevocation"> | string | null
    chunksReencrypted?: StringWithAggregatesFilter<"AnonymousRevocation"> | string
    revocationStrategy?: StringNullableWithAggregatesFilter<"AnonymousRevocation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AnonymousRevocation"> | Date | string
    executedBySystem?: BoolWithAggregatesFilter<"AnonymousRevocation"> | boolean
  }

  export type IntegrityAlertWhereInput = {
    AND?: IntegrityAlertWhereInput | IntegrityAlertWhereInput[]
    OR?: IntegrityAlertWhereInput[]
    NOT?: IntegrityAlertWhereInput | IntegrityAlertWhereInput[]
    id?: StringFilter<"IntegrityAlert"> | string
    fileId?: StringFilter<"IntegrityAlert"> | string
    chunkIndex?: IntFilter<"IntegrityAlert"> | number
    expectedHash?: StringFilter<"IntegrityAlert"> | string
    actualHash?: StringNullableFilter<"IntegrityAlert"> | string | null
    reportedByPublicKeyHash?: StringFilter<"IntegrityAlert"> | string
    reportedAt?: DateTimeFilter<"IntegrityAlert"> | Date | string
    resolved?: BoolFilter<"IntegrityAlert"> | boolean
    resolvedAt?: DateTimeNullableFilter<"IntegrityAlert"> | Date | string | null
    resolution?: StringNullableFilter<"IntegrityAlert"> | string | null
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type IntegrityAlertOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    expectedHash?: SortOrder
    actualHash?: SortOrderInput | SortOrder
    reportedByPublicKeyHash?: SortOrder
    reportedAt?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    file?: FileOrderByWithRelationInput
  }

  export type IntegrityAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IntegrityAlertWhereInput | IntegrityAlertWhereInput[]
    OR?: IntegrityAlertWhereInput[]
    NOT?: IntegrityAlertWhereInput | IntegrityAlertWhereInput[]
    fileId?: StringFilter<"IntegrityAlert"> | string
    chunkIndex?: IntFilter<"IntegrityAlert"> | number
    expectedHash?: StringFilter<"IntegrityAlert"> | string
    actualHash?: StringNullableFilter<"IntegrityAlert"> | string | null
    reportedByPublicKeyHash?: StringFilter<"IntegrityAlert"> | string
    reportedAt?: DateTimeFilter<"IntegrityAlert"> | Date | string
    resolved?: BoolFilter<"IntegrityAlert"> | boolean
    resolvedAt?: DateTimeNullableFilter<"IntegrityAlert"> | Date | string | null
    resolution?: StringNullableFilter<"IntegrityAlert"> | string | null
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id">

  export type IntegrityAlertOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    expectedHash?: SortOrder
    actualHash?: SortOrderInput | SortOrder
    reportedByPublicKeyHash?: SortOrder
    reportedAt?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    _count?: IntegrityAlertCountOrderByAggregateInput
    _avg?: IntegrityAlertAvgOrderByAggregateInput
    _max?: IntegrityAlertMaxOrderByAggregateInput
    _min?: IntegrityAlertMinOrderByAggregateInput
    _sum?: IntegrityAlertSumOrderByAggregateInput
  }

  export type IntegrityAlertScalarWhereWithAggregatesInput = {
    AND?: IntegrityAlertScalarWhereWithAggregatesInput | IntegrityAlertScalarWhereWithAggregatesInput[]
    OR?: IntegrityAlertScalarWhereWithAggregatesInput[]
    NOT?: IntegrityAlertScalarWhereWithAggregatesInput | IntegrityAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IntegrityAlert"> | string
    fileId?: StringWithAggregatesFilter<"IntegrityAlert"> | string
    chunkIndex?: IntWithAggregatesFilter<"IntegrityAlert"> | number
    expectedHash?: StringWithAggregatesFilter<"IntegrityAlert"> | string
    actualHash?: StringNullableWithAggregatesFilter<"IntegrityAlert"> | string | null
    reportedByPublicKeyHash?: StringWithAggregatesFilter<"IntegrityAlert"> | string
    reportedAt?: DateTimeWithAggregatesFilter<"IntegrityAlert"> | Date | string
    resolved?: BoolWithAggregatesFilter<"IntegrityAlert"> | boolean
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"IntegrityAlert"> | Date | string | null
    resolution?: StringNullableWithAggregatesFilter<"IntegrityAlert"> | string | null
  }

  export type AnonymousFileAccessWhereInput = {
    AND?: AnonymousFileAccessWhereInput | AnonymousFileAccessWhereInput[]
    OR?: AnonymousFileAccessWhereInput[]
    NOT?: AnonymousFileAccessWhereInput | AnonymousFileAccessWhereInput[]
    id?: StringFilter<"AnonymousFileAccess"> | string
    accessorPublicKeyHash?: StringFilter<"AnonymousFileAccess"> | string
    fileId?: StringFilter<"AnonymousFileAccess"> | string
    grantedAt?: DateTimeFilter<"AnonymousFileAccess"> | Date | string
    expiresAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    lastAccessProof?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    lastAccessAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    accessCount?: IntFilter<"AnonymousFileAccess"> | number
    keyStatus?: StringFilter<"AnonymousFileAccess"> | string
    keyPackageFingerprint?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    status?: StringFilter<"AnonymousFileAccess"> | string
    revokedAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    lastOwnerProof?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type AnonymousFileAccessOrderByWithRelationInput = {
    id?: SortOrder
    accessorPublicKeyHash?: SortOrder
    fileId?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    lastAccessProof?: SortOrderInput | SortOrder
    lastAccessAt?: SortOrderInput | SortOrder
    accessCount?: SortOrder
    keyStatus?: SortOrder
    keyPackageFingerprint?: SortOrderInput | SortOrder
    status?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    lastOwnerProof?: SortOrderInput | SortOrder
    file?: FileOrderByWithRelationInput
  }

  export type AnonymousFileAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accessorPublicKeyHash_fileId?: AnonymousFileAccessAccessorPublicKeyHashFileIdCompoundUniqueInput
    AND?: AnonymousFileAccessWhereInput | AnonymousFileAccessWhereInput[]
    OR?: AnonymousFileAccessWhereInput[]
    NOT?: AnonymousFileAccessWhereInput | AnonymousFileAccessWhereInput[]
    accessorPublicKeyHash?: StringFilter<"AnonymousFileAccess"> | string
    fileId?: StringFilter<"AnonymousFileAccess"> | string
    grantedAt?: DateTimeFilter<"AnonymousFileAccess"> | Date | string
    expiresAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    lastAccessProof?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    lastAccessAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    accessCount?: IntFilter<"AnonymousFileAccess"> | number
    keyStatus?: StringFilter<"AnonymousFileAccess"> | string
    keyPackageFingerprint?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    status?: StringFilter<"AnonymousFileAccess"> | string
    revokedAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    lastOwnerProof?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id" | "accessorPublicKeyHash_fileId">

  export type AnonymousFileAccessOrderByWithAggregationInput = {
    id?: SortOrder
    accessorPublicKeyHash?: SortOrder
    fileId?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    lastAccessProof?: SortOrderInput | SortOrder
    lastAccessAt?: SortOrderInput | SortOrder
    accessCount?: SortOrder
    keyStatus?: SortOrder
    keyPackageFingerprint?: SortOrderInput | SortOrder
    status?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    lastOwnerProof?: SortOrderInput | SortOrder
    _count?: AnonymousFileAccessCountOrderByAggregateInput
    _avg?: AnonymousFileAccessAvgOrderByAggregateInput
    _max?: AnonymousFileAccessMaxOrderByAggregateInput
    _min?: AnonymousFileAccessMinOrderByAggregateInput
    _sum?: AnonymousFileAccessSumOrderByAggregateInput
  }

  export type AnonymousFileAccessScalarWhereWithAggregatesInput = {
    AND?: AnonymousFileAccessScalarWhereWithAggregatesInput | AnonymousFileAccessScalarWhereWithAggregatesInput[]
    OR?: AnonymousFileAccessScalarWhereWithAggregatesInput[]
    NOT?: AnonymousFileAccessScalarWhereWithAggregatesInput | AnonymousFileAccessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnonymousFileAccess"> | string
    accessorPublicKeyHash?: StringWithAggregatesFilter<"AnonymousFileAccess"> | string
    fileId?: StringWithAggregatesFilter<"AnonymousFileAccess"> | string
    grantedAt?: DateTimeWithAggregatesFilter<"AnonymousFileAccess"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"AnonymousFileAccess"> | Date | string | null
    lastAccessProof?: StringNullableWithAggregatesFilter<"AnonymousFileAccess"> | string | null
    lastAccessAt?: DateTimeNullableWithAggregatesFilter<"AnonymousFileAccess"> | Date | string | null
    accessCount?: IntWithAggregatesFilter<"AnonymousFileAccess"> | number
    keyStatus?: StringWithAggregatesFilter<"AnonymousFileAccess"> | string
    keyPackageFingerprint?: StringNullableWithAggregatesFilter<"AnonymousFileAccess"> | string | null
    status?: StringWithAggregatesFilter<"AnonymousFileAccess"> | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"AnonymousFileAccess"> | Date | string | null
    lastOwnerProof?: StringNullableWithAggregatesFilter<"AnonymousFileAccess"> | string | null
  }

  export type AnonymousAuditLogWhereInput = {
    AND?: AnonymousAuditLogWhereInput | AnonymousAuditLogWhereInput[]
    OR?: AnonymousAuditLogWhereInput[]
    NOT?: AnonymousAuditLogWhereInput | AnonymousAuditLogWhereInput[]
    id?: StringFilter<"AnonymousAuditLog"> | string
    eventType?: StringFilter<"AnonymousAuditLog"> | string
    fileId?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    publicKeyHash?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    deviceFingerprint?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    ringSignature?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    ringPublicKeys?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    metadata?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    timestamp?: DateTimeFilter<"AnonymousAuditLog"> | Date | string
    status?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    revokedAt?: DateTimeNullableFilter<"AnonymousAuditLog"> | Date | string | null
    lastOwnerProof?: StringNullableFilter<"AnonymousAuditLog"> | string | null
  }

  export type AnonymousAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    eventType?: SortOrder
    fileId?: SortOrderInput | SortOrder
    publicKeyHash?: SortOrderInput | SortOrder
    deviceFingerprint?: SortOrderInput | SortOrder
    ringSignature?: SortOrderInput | SortOrder
    ringPublicKeys?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    status?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    lastOwnerProof?: SortOrderInput | SortOrder
  }

  export type AnonymousAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnonymousAuditLogWhereInput | AnonymousAuditLogWhereInput[]
    OR?: AnonymousAuditLogWhereInput[]
    NOT?: AnonymousAuditLogWhereInput | AnonymousAuditLogWhereInput[]
    eventType?: StringFilter<"AnonymousAuditLog"> | string
    fileId?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    publicKeyHash?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    deviceFingerprint?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    ringSignature?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    ringPublicKeys?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    metadata?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    timestamp?: DateTimeFilter<"AnonymousAuditLog"> | Date | string
    status?: StringNullableFilter<"AnonymousAuditLog"> | string | null
    revokedAt?: DateTimeNullableFilter<"AnonymousAuditLog"> | Date | string | null
    lastOwnerProof?: StringNullableFilter<"AnonymousAuditLog"> | string | null
  }, "id">

  export type AnonymousAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    eventType?: SortOrder
    fileId?: SortOrderInput | SortOrder
    publicKeyHash?: SortOrderInput | SortOrder
    deviceFingerprint?: SortOrderInput | SortOrder
    ringSignature?: SortOrderInput | SortOrder
    ringPublicKeys?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    status?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    lastOwnerProof?: SortOrderInput | SortOrder
    _count?: AnonymousAuditLogCountOrderByAggregateInput
    _max?: AnonymousAuditLogMaxOrderByAggregateInput
    _min?: AnonymousAuditLogMinOrderByAggregateInput
  }

  export type AnonymousAuditLogScalarWhereWithAggregatesInput = {
    AND?: AnonymousAuditLogScalarWhereWithAggregatesInput | AnonymousAuditLogScalarWhereWithAggregatesInput[]
    OR?: AnonymousAuditLogScalarWhereWithAggregatesInput[]
    NOT?: AnonymousAuditLogScalarWhereWithAggregatesInput | AnonymousAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnonymousAuditLog"> | string
    eventType?: StringWithAggregatesFilter<"AnonymousAuditLog"> | string
    fileId?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    publicKeyHash?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    deviceFingerprint?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    ringSignature?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    ringPublicKeys?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"AnonymousAuditLog"> | Date | string
    status?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
    revokedAt?: DateTimeNullableWithAggregatesFilter<"AnonymousAuditLog"> | Date | string | null
    lastOwnerProof?: StringNullableWithAggregatesFilter<"AnonymousAuditLog"> | string | null
  }

  export type AnonymousSharingRequestWhereInput = {
    AND?: AnonymousSharingRequestWhereInput | AnonymousSharingRequestWhereInput[]
    OR?: AnonymousSharingRequestWhereInput[]
    NOT?: AnonymousSharingRequestWhereInput | AnonymousSharingRequestWhereInput[]
    id?: StringFilter<"AnonymousSharingRequest"> | string
    fileId?: StringFilter<"AnonymousSharingRequest"> | string
    sharerPublicKeyHash?: StringFilter<"AnonymousSharingRequest"> | string
    recipientPublicKeyHash?: StringFilter<"AnonymousSharingRequest"> | string
    ownershipProof?: StringFilter<"AnonymousSharingRequest"> | string
    ringSignature?: StringFilter<"AnonymousSharingRequest"> | string
    keyPackageFingerprint?: StringNullableFilter<"AnonymousSharingRequest"> | string | null
    status?: StringFilter<"AnonymousSharingRequest"> | string
    requestedAt?: DateTimeFilter<"AnonymousSharingRequest"> | Date | string
    respondedAt?: DateTimeNullableFilter<"AnonymousSharingRequest"> | Date | string | null
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type AnonymousSharingRequestOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    sharerPublicKeyHash?: SortOrder
    recipientPublicKeyHash?: SortOrder
    ownershipProof?: SortOrder
    ringSignature?: SortOrder
    keyPackageFingerprint?: SortOrderInput | SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrderInput | SortOrder
    file?: FileOrderByWithRelationInput
  }

  export type AnonymousSharingRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnonymousSharingRequestWhereInput | AnonymousSharingRequestWhereInput[]
    OR?: AnonymousSharingRequestWhereInput[]
    NOT?: AnonymousSharingRequestWhereInput | AnonymousSharingRequestWhereInput[]
    fileId?: StringFilter<"AnonymousSharingRequest"> | string
    sharerPublicKeyHash?: StringFilter<"AnonymousSharingRequest"> | string
    recipientPublicKeyHash?: StringFilter<"AnonymousSharingRequest"> | string
    ownershipProof?: StringFilter<"AnonymousSharingRequest"> | string
    ringSignature?: StringFilter<"AnonymousSharingRequest"> | string
    keyPackageFingerprint?: StringNullableFilter<"AnonymousSharingRequest"> | string | null
    status?: StringFilter<"AnonymousSharingRequest"> | string
    requestedAt?: DateTimeFilter<"AnonymousSharingRequest"> | Date | string
    respondedAt?: DateTimeNullableFilter<"AnonymousSharingRequest"> | Date | string | null
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id">

  export type AnonymousSharingRequestOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    sharerPublicKeyHash?: SortOrder
    recipientPublicKeyHash?: SortOrder
    ownershipProof?: SortOrder
    ringSignature?: SortOrder
    keyPackageFingerprint?: SortOrderInput | SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrderInput | SortOrder
    _count?: AnonymousSharingRequestCountOrderByAggregateInput
    _max?: AnonymousSharingRequestMaxOrderByAggregateInput
    _min?: AnonymousSharingRequestMinOrderByAggregateInput
  }

  export type AnonymousSharingRequestScalarWhereWithAggregatesInput = {
    AND?: AnonymousSharingRequestScalarWhereWithAggregatesInput | AnonymousSharingRequestScalarWhereWithAggregatesInput[]
    OR?: AnonymousSharingRequestScalarWhereWithAggregatesInput[]
    NOT?: AnonymousSharingRequestScalarWhereWithAggregatesInput | AnonymousSharingRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    fileId?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    sharerPublicKeyHash?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    recipientPublicKeyHash?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    ownershipProof?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    ringSignature?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    keyPackageFingerprint?: StringNullableWithAggregatesFilter<"AnonymousSharingRequest"> | string | null
    status?: StringWithAggregatesFilter<"AnonymousSharingRequest"> | string
    requestedAt?: DateTimeWithAggregatesFilter<"AnonymousSharingRequest"> | Date | string
    respondedAt?: DateTimeNullableWithAggregatesFilter<"AnonymousSharingRequest"> | Date | string | null
  }

  export type SignatureWhereInput = {
    AND?: SignatureWhereInput | SignatureWhereInput[]
    OR?: SignatureWhereInput[]
    NOT?: SignatureWhereInput | SignatureWhereInput[]
    id?: StringFilter<"Signature"> | string
    fileId?: StringFilter<"Signature"> | string
    signerId?: StringFilter<"Signature"> | string
    ringUserIds?: StringFilter<"Signature"> | string
    signature?: StringFilter<"Signature"> | string
    isOpened?: BoolFilter<"Signature"> | boolean
    openingProof?: StringNullableFilter<"Signature"> | string | null
    createdAt?: DateTimeFilter<"Signature"> | Date | string
    updatedAt?: DateTimeFilter<"Signature"> | Date | string
    signer?: XOR<UserRelationFilter, UserWhereInput>
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type SignatureOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    signerId?: SortOrder
    ringUserIds?: SortOrder
    signature?: SortOrder
    isOpened?: SortOrder
    openingProof?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    signer?: UserOrderByWithRelationInput
    file?: FileOrderByWithRelationInput
  }

  export type SignatureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SignatureWhereInput | SignatureWhereInput[]
    OR?: SignatureWhereInput[]
    NOT?: SignatureWhereInput | SignatureWhereInput[]
    fileId?: StringFilter<"Signature"> | string
    signerId?: StringFilter<"Signature"> | string
    ringUserIds?: StringFilter<"Signature"> | string
    signature?: StringFilter<"Signature"> | string
    isOpened?: BoolFilter<"Signature"> | boolean
    openingProof?: StringNullableFilter<"Signature"> | string | null
    createdAt?: DateTimeFilter<"Signature"> | Date | string
    updatedAt?: DateTimeFilter<"Signature"> | Date | string
    signer?: XOR<UserRelationFilter, UserWhereInput>
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id">

  export type SignatureOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    signerId?: SortOrder
    ringUserIds?: SortOrder
    signature?: SortOrder
    isOpened?: SortOrder
    openingProof?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SignatureCountOrderByAggregateInput
    _max?: SignatureMaxOrderByAggregateInput
    _min?: SignatureMinOrderByAggregateInput
  }

  export type SignatureScalarWhereWithAggregatesInput = {
    AND?: SignatureScalarWhereWithAggregatesInput | SignatureScalarWhereWithAggregatesInput[]
    OR?: SignatureScalarWhereWithAggregatesInput[]
    NOT?: SignatureScalarWhereWithAggregatesInput | SignatureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Signature"> | string
    fileId?: StringWithAggregatesFilter<"Signature"> | string
    signerId?: StringWithAggregatesFilter<"Signature"> | string
    ringUserIds?: StringWithAggregatesFilter<"Signature"> | string
    signature?: StringWithAggregatesFilter<"Signature"> | string
    isOpened?: BoolWithAggregatesFilter<"Signature"> | boolean
    openingProof?: StringNullableWithAggregatesFilter<"Signature"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Signature"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Signature"> | Date | string
  }

  export type ValidationTokenWhereInput = {
    AND?: ValidationTokenWhereInput | ValidationTokenWhereInput[]
    OR?: ValidationTokenWhereInput[]
    NOT?: ValidationTokenWhereInput | ValidationTokenWhereInput[]
    id?: StringFilter<"ValidationToken"> | string
    tokenId?: StringFilter<"ValidationToken"> | string
    fileId?: StringFilter<"ValidationToken"> | string
    fileMetadataHash?: StringFilter<"ValidationToken"> | string
    userPublicKeyHash?: StringFilter<"ValidationToken"> | string
    issuedAt?: DateTimeFilter<"ValidationToken"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationToken"> | Date | string
    signature?: StringFilter<"ValidationToken"> | string
    adjudicatorPublicKey?: StringFilter<"ValidationToken"> | string
    createdAt?: DateTimeFilter<"ValidationToken"> | Date | string
    file?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type ValidationTokenOrderByWithRelationInput = {
    id?: SortOrder
    tokenId?: SortOrder
    fileId?: SortOrder
    fileMetadataHash?: SortOrder
    userPublicKeyHash?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    adjudicatorPublicKey?: SortOrder
    createdAt?: SortOrder
    file?: FileOrderByWithRelationInput
  }

  export type ValidationTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenId?: string
    fileId?: string
    signature?: string
    AND?: ValidationTokenWhereInput | ValidationTokenWhereInput[]
    OR?: ValidationTokenWhereInput[]
    NOT?: ValidationTokenWhereInput | ValidationTokenWhereInput[]
    fileMetadataHash?: StringFilter<"ValidationToken"> | string
    userPublicKeyHash?: StringFilter<"ValidationToken"> | string
    issuedAt?: DateTimeFilter<"ValidationToken"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationToken"> | Date | string
    adjudicatorPublicKey?: StringFilter<"ValidationToken"> | string
    createdAt?: DateTimeFilter<"ValidationToken"> | Date | string
    file?: XOR<FileRelationFilter, FileWhereInput>
  }, "id" | "tokenId" | "fileId" | "signature">

  export type ValidationTokenOrderByWithAggregationInput = {
    id?: SortOrder
    tokenId?: SortOrder
    fileId?: SortOrder
    fileMetadataHash?: SortOrder
    userPublicKeyHash?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    adjudicatorPublicKey?: SortOrder
    createdAt?: SortOrder
    _count?: ValidationTokenCountOrderByAggregateInput
    _max?: ValidationTokenMaxOrderByAggregateInput
    _min?: ValidationTokenMinOrderByAggregateInput
  }

  export type ValidationTokenScalarWhereWithAggregatesInput = {
    AND?: ValidationTokenScalarWhereWithAggregatesInput | ValidationTokenScalarWhereWithAggregatesInput[]
    OR?: ValidationTokenScalarWhereWithAggregatesInput[]
    NOT?: ValidationTokenScalarWhereWithAggregatesInput | ValidationTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ValidationToken"> | string
    tokenId?: StringWithAggregatesFilter<"ValidationToken"> | string
    fileId?: StringWithAggregatesFilter<"ValidationToken"> | string
    fileMetadataHash?: StringWithAggregatesFilter<"ValidationToken"> | string
    userPublicKeyHash?: StringWithAggregatesFilter<"ValidationToken"> | string
    issuedAt?: DateTimeWithAggregatesFilter<"ValidationToken"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"ValidationToken"> | Date | string
    signature?: StringWithAggregatesFilter<"ValidationToken"> | string
    adjudicatorPublicKey?: StringWithAggregatesFilter<"ValidationToken"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ValidationToken"> | Date | string
  }

  export type InvestigationAuditWhereInput = {
    AND?: InvestigationAuditWhereInput | InvestigationAuditWhereInput[]
    OR?: InvestigationAuditWhereInput[]
    NOT?: InvestigationAuditWhereInput | InvestigationAuditWhereInput[]
    id?: StringFilter<"InvestigationAudit"> | string
    investigationId?: StringFilter<"InvestigationAudit"> | string
    fileId?: StringFilter<"InvestigationAudit"> | string
    reason?: StringFilter<"InvestigationAudit"> | string
    adminApproval?: StringFilter<"InvestigationAudit"> | string
    legalAuthorization?: StringFilter<"InvestigationAudit"> | string
    decryptedPublicKey?: StringNullableFilter<"InvestigationAudit"> | string | null
    createdAt?: DateTimeFilter<"InvestigationAudit"> | Date | string
  }

  export type InvestigationAuditOrderByWithRelationInput = {
    id?: SortOrder
    investigationId?: SortOrder
    fileId?: SortOrder
    reason?: SortOrder
    adminApproval?: SortOrder
    legalAuthorization?: SortOrder
    decryptedPublicKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type InvestigationAuditWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    investigationId?: string
    AND?: InvestigationAuditWhereInput | InvestigationAuditWhereInput[]
    OR?: InvestigationAuditWhereInput[]
    NOT?: InvestigationAuditWhereInput | InvestigationAuditWhereInput[]
    fileId?: StringFilter<"InvestigationAudit"> | string
    reason?: StringFilter<"InvestigationAudit"> | string
    adminApproval?: StringFilter<"InvestigationAudit"> | string
    legalAuthorization?: StringFilter<"InvestigationAudit"> | string
    decryptedPublicKey?: StringNullableFilter<"InvestigationAudit"> | string | null
    createdAt?: DateTimeFilter<"InvestigationAudit"> | Date | string
  }, "id" | "investigationId">

  export type InvestigationAuditOrderByWithAggregationInput = {
    id?: SortOrder
    investigationId?: SortOrder
    fileId?: SortOrder
    reason?: SortOrder
    adminApproval?: SortOrder
    legalAuthorization?: SortOrder
    decryptedPublicKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InvestigationAuditCountOrderByAggregateInput
    _max?: InvestigationAuditMaxOrderByAggregateInput
    _min?: InvestigationAuditMinOrderByAggregateInput
  }

  export type InvestigationAuditScalarWhereWithAggregatesInput = {
    AND?: InvestigationAuditScalarWhereWithAggregatesInput | InvestigationAuditScalarWhereWithAggregatesInput[]
    OR?: InvestigationAuditScalarWhereWithAggregatesInput[]
    NOT?: InvestigationAuditScalarWhereWithAggregatesInput | InvestigationAuditScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvestigationAudit"> | string
    investigationId?: StringWithAggregatesFilter<"InvestigationAudit"> | string
    fileId?: StringWithAggregatesFilter<"InvestigationAudit"> | string
    reason?: StringWithAggregatesFilter<"InvestigationAudit"> | string
    adminApproval?: StringWithAggregatesFilter<"InvestigationAudit"> | string
    legalAuthorization?: StringWithAggregatesFilter<"InvestigationAudit"> | string
    decryptedPublicKey?: StringNullableWithAggregatesFilter<"InvestigationAudit"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InvestigationAudit"> | Date | string
  }

  export type ValidationNonceWhereInput = {
    AND?: ValidationNonceWhereInput | ValidationNonceWhereInput[]
    OR?: ValidationNonceWhereInput[]
    NOT?: ValidationNonceWhereInput | ValidationNonceWhereInput[]
    id?: StringFilter<"ValidationNonce"> | string
    nonce?: StringFilter<"ValidationNonce"> | string
    createdAt?: DateTimeFilter<"ValidationNonce"> | Date | string
  }

  export type ValidationNonceOrderByWithRelationInput = {
    id?: SortOrder
    nonce?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationNonceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nonce?: string
    AND?: ValidationNonceWhereInput | ValidationNonceWhereInput[]
    OR?: ValidationNonceWhereInput[]
    NOT?: ValidationNonceWhereInput | ValidationNonceWhereInput[]
    createdAt?: DateTimeFilter<"ValidationNonce"> | Date | string
  }, "id" | "nonce">

  export type ValidationNonceOrderByWithAggregationInput = {
    id?: SortOrder
    nonce?: SortOrder
    createdAt?: SortOrder
    _count?: ValidationNonceCountOrderByAggregateInput
    _max?: ValidationNonceMaxOrderByAggregateInput
    _min?: ValidationNonceMinOrderByAggregateInput
  }

  export type ValidationNonceScalarWhereWithAggregatesInput = {
    AND?: ValidationNonceScalarWhereWithAggregatesInput | ValidationNonceScalarWhereWithAggregatesInput[]
    OR?: ValidationNonceScalarWhereWithAggregatesInput[]
    NOT?: ValidationNonceScalarWhereWithAggregatesInput | ValidationNonceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ValidationNonce"> | string
    nonce?: StringWithAggregatesFilter<"ValidationNonce"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ValidationNonce"> | Date | string
  }

  export type ValidationTokenAuditWhereInput = {
    AND?: ValidationTokenAuditWhereInput | ValidationTokenAuditWhereInput[]
    OR?: ValidationTokenAuditWhereInput[]
    NOT?: ValidationTokenAuditWhereInput | ValidationTokenAuditWhereInput[]
    id?: StringFilter<"ValidationTokenAudit"> | string
    tokenId?: StringFilter<"ValidationTokenAudit"> | string
    userPublicKey?: StringFilter<"ValidationTokenAudit"> | string
    userPublicKeyHash?: StringFilter<"ValidationTokenAudit"> | string
    fileMetadataHash?: StringFilter<"ValidationTokenAudit"> | string
    requestNonce?: StringFilter<"ValidationTokenAudit"> | string
    issuedAt?: DateTimeFilter<"ValidationTokenAudit"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationTokenAudit"> | Date | string
    signature?: StringFilter<"ValidationTokenAudit"> | string
    createdAt?: DateTimeFilter<"ValidationTokenAudit"> | Date | string
  }

  export type ValidationTokenAuditOrderByWithRelationInput = {
    id?: SortOrder
    tokenId?: SortOrder
    userPublicKey?: SortOrder
    userPublicKeyHash?: SortOrder
    fileMetadataHash?: SortOrder
    requestNonce?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationTokenAuditWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenId?: string
    AND?: ValidationTokenAuditWhereInput | ValidationTokenAuditWhereInput[]
    OR?: ValidationTokenAuditWhereInput[]
    NOT?: ValidationTokenAuditWhereInput | ValidationTokenAuditWhereInput[]
    userPublicKey?: StringFilter<"ValidationTokenAudit"> | string
    userPublicKeyHash?: StringFilter<"ValidationTokenAudit"> | string
    fileMetadataHash?: StringFilter<"ValidationTokenAudit"> | string
    requestNonce?: StringFilter<"ValidationTokenAudit"> | string
    issuedAt?: DateTimeFilter<"ValidationTokenAudit"> | Date | string
    expiresAt?: DateTimeFilter<"ValidationTokenAudit"> | Date | string
    signature?: StringFilter<"ValidationTokenAudit"> | string
    createdAt?: DateTimeFilter<"ValidationTokenAudit"> | Date | string
  }, "id" | "tokenId">

  export type ValidationTokenAuditOrderByWithAggregationInput = {
    id?: SortOrder
    tokenId?: SortOrder
    userPublicKey?: SortOrder
    userPublicKeyHash?: SortOrder
    fileMetadataHash?: SortOrder
    requestNonce?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    _count?: ValidationTokenAuditCountOrderByAggregateInput
    _max?: ValidationTokenAuditMaxOrderByAggregateInput
    _min?: ValidationTokenAuditMinOrderByAggregateInput
  }

  export type ValidationTokenAuditScalarWhereWithAggregatesInput = {
    AND?: ValidationTokenAuditScalarWhereWithAggregatesInput | ValidationTokenAuditScalarWhereWithAggregatesInput[]
    OR?: ValidationTokenAuditScalarWhereWithAggregatesInput[]
    NOT?: ValidationTokenAuditScalarWhereWithAggregatesInput | ValidationTokenAuditScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    tokenId?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    userPublicKey?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    userPublicKeyHash?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    fileMetadataHash?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    requestNonce?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    issuedAt?: DateTimeWithAggregatesFilter<"ValidationTokenAudit"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"ValidationTokenAudit"> | Date | string
    signature?: StringWithAggregatesFilter<"ValidationTokenAudit"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ValidationTokenAudit"> | Date | string
  }

  export type BannedUserWhereInput = {
    AND?: BannedUserWhereInput | BannedUserWhereInput[]
    OR?: BannedUserWhereInput[]
    NOT?: BannedUserWhereInput | BannedUserWhereInput[]
    id?: StringFilter<"BannedUser"> | string
    publicKey?: StringFilter<"BannedUser"> | string
    reason?: StringFilter<"BannedUser"> | string
    bannedByAdmin?: StringFilter<"BannedUser"> | string
    bannedAt?: DateTimeFilter<"BannedUser"> | Date | string
  }

  export type BannedUserOrderByWithRelationInput = {
    id?: SortOrder
    publicKey?: SortOrder
    reason?: SortOrder
    bannedByAdmin?: SortOrder
    bannedAt?: SortOrder
  }

  export type BannedUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    publicKey?: string
    AND?: BannedUserWhereInput | BannedUserWhereInput[]
    OR?: BannedUserWhereInput[]
    NOT?: BannedUserWhereInput | BannedUserWhereInput[]
    reason?: StringFilter<"BannedUser"> | string
    bannedByAdmin?: StringFilter<"BannedUser"> | string
    bannedAt?: DateTimeFilter<"BannedUser"> | Date | string
  }, "id" | "publicKey">

  export type BannedUserOrderByWithAggregationInput = {
    id?: SortOrder
    publicKey?: SortOrder
    reason?: SortOrder
    bannedByAdmin?: SortOrder
    bannedAt?: SortOrder
    _count?: BannedUserCountOrderByAggregateInput
    _max?: BannedUserMaxOrderByAggregateInput
    _min?: BannedUserMinOrderByAggregateInput
  }

  export type BannedUserScalarWhereWithAggregatesInput = {
    AND?: BannedUserScalarWhereWithAggregatesInput | BannedUserScalarWhereWithAggregatesInput[]
    OR?: BannedUserScalarWhereWithAggregatesInput[]
    NOT?: BannedUserScalarWhereWithAggregatesInput | BannedUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BannedUser"> | string
    publicKey?: StringWithAggregatesFilter<"BannedUser"> | string
    reason?: StringWithAggregatesFilter<"BannedUser"> | string
    bannedByAdmin?: StringWithAggregatesFilter<"BannedUser"> | string
    bannedAt?: DateTimeWithAggregatesFilter<"BannedUser"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    uploadedFiles?: FileCreateNestedManyWithoutUploaderInput
    signatures?: SignatureCreateNestedManyWithoutSignerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    uploadedFiles?: FileUncheckedCreateNestedManyWithoutUploaderInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutSignerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploadedFiles?: FileUpdateManyWithoutUploaderNestedInput
    signatures?: SignatureUpdateManyWithoutSignerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploadedFiles?: FileUncheckedUpdateManyWithoutUploaderNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutSignerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileCreateManyInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
  }

  export type FileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FileChunkCreateInput = {
    id?: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt?: Date | string
    createdAt?: Date | string
    file: FileCreateNestedOneWithoutChunksInput
  }

  export type FileChunkUncheckedCreateInput = {
    id?: string
    fileId: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt?: Date | string
    createdAt?: Date | string
  }

  export type FileChunkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: FileUpdateOneRequiredWithoutChunksNestedInput
  }

  export type FileChunkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileChunkCreateManyInput = {
    id?: string
    fileId: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt?: Date | string
    createdAt?: Date | string
  }

  export type FileChunkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileChunkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnonymousRevocationCreateInput = {
    id?: string
    revokedPublicKeyHash?: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date | string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    chunksReencrypted: string
    revocationStrategy?: string | null
    createdAt?: Date | string
    executedBySystem?: boolean
    file: FileCreateNestedOneWithoutRevocationsInput
  }

  export type AnonymousRevocationUncheckedCreateInput = {
    id?: string
    fileId: string
    revokedPublicKeyHash?: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date | string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    chunksReencrypted: string
    revocationStrategy?: string | null
    createdAt?: Date | string
    executedBySystem?: boolean
  }

  export type AnonymousRevocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
    file?: FileUpdateOneRequiredWithoutRevocationsNestedInput
  }

  export type AnonymousRevocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnonymousRevocationCreateManyInput = {
    id?: string
    fileId: string
    revokedPublicKeyHash?: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date | string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    chunksReencrypted: string
    revocationStrategy?: string | null
    createdAt?: Date | string
    executedBySystem?: boolean
  }

  export type AnonymousRevocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnonymousRevocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IntegrityAlertCreateInput = {
    id?: string
    chunkIndex: number
    expectedHash: string
    actualHash?: string | null
    reportedByPublicKeyHash: string
    reportedAt?: Date | string
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolution?: string | null
    file: FileCreateNestedOneWithoutIntegrityAlertsInput
  }

  export type IntegrityAlertUncheckedCreateInput = {
    id?: string
    fileId: string
    chunkIndex: number
    expectedHash: string
    actualHash?: string | null
    reportedByPublicKeyHash: string
    reportedAt?: Date | string
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolution?: string | null
  }

  export type IntegrityAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    file?: FileUpdateOneRequiredWithoutIntegrityAlertsNestedInput
  }

  export type IntegrityAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrityAlertCreateManyInput = {
    id?: string
    fileId: string
    chunkIndex: number
    expectedHash: string
    actualHash?: string | null
    reportedByPublicKeyHash: string
    reportedAt?: Date | string
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolution?: string | null
  }

  export type IntegrityAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrityAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousFileAccessCreateInput = {
    id?: string
    accessorPublicKeyHash: string
    grantedAt?: Date | string
    expiresAt?: Date | string | null
    lastAccessProof?: string | null
    lastAccessAt?: Date | string | null
    accessCount?: number
    keyStatus?: string
    keyPackageFingerprint?: string | null
    status?: string
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
    file: FileCreateNestedOneWithoutAnonymousAccessInput
  }

  export type AnonymousFileAccessUncheckedCreateInput = {
    id?: string
    accessorPublicKeyHash: string
    fileId: string
    grantedAt?: Date | string
    expiresAt?: Date | string | null
    lastAccessProof?: string | null
    lastAccessAt?: Date | string | null
    accessCount?: number
    keyStatus?: string
    keyPackageFingerprint?: string | null
    status?: string
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousFileAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
    file?: FileUpdateOneRequiredWithoutAnonymousAccessNestedInput
  }

  export type AnonymousFileAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousFileAccessCreateManyInput = {
    id?: string
    accessorPublicKeyHash: string
    fileId: string
    grantedAt?: Date | string
    expiresAt?: Date | string | null
    lastAccessProof?: string | null
    lastAccessAt?: Date | string | null
    accessCount?: number
    keyStatus?: string
    keyPackageFingerprint?: string | null
    status?: string
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousFileAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousFileAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousAuditLogCreateInput = {
    id?: string
    eventType: string
    fileId?: string | null
    publicKeyHash?: string | null
    deviceFingerprint?: string | null
    ringSignature?: string | null
    ringPublicKeys?: string | null
    metadata?: string | null
    timestamp?: Date | string
    status?: string | null
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousAuditLogUncheckedCreateInput = {
    id?: string
    eventType: string
    fileId?: string | null
    publicKeyHash?: string | null
    deviceFingerprint?: string | null
    ringSignature?: string | null
    ringPublicKeys?: string | null
    metadata?: string | null
    timestamp?: Date | string
    status?: string | null
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    deviceFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    deviceFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousAuditLogCreateManyInput = {
    id?: string
    eventType: string
    fileId?: string | null
    publicKeyHash?: string | null
    deviceFingerprint?: string | null
    ringSignature?: string | null
    ringPublicKeys?: string | null
    metadata?: string | null
    timestamp?: Date | string
    status?: string | null
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    deviceFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    deviceFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousSharingRequestCreateInput = {
    id?: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint?: string | null
    status?: string
    requestedAt?: Date | string
    respondedAt?: Date | string | null
    file: FileCreateNestedOneWithoutSharingRequestsInput
  }

  export type AnonymousSharingRequestUncheckedCreateInput = {
    id?: string
    fileId: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint?: string | null
    status?: string
    requestedAt?: Date | string
    respondedAt?: Date | string | null
  }

  export type AnonymousSharingRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    file?: FileUpdateOneRequiredWithoutSharingRequestsNestedInput
  }

  export type AnonymousSharingRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnonymousSharingRequestCreateManyInput = {
    id?: string
    fileId: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint?: string | null
    status?: string
    requestedAt?: Date | string
    respondedAt?: Date | string | null
  }

  export type AnonymousSharingRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnonymousSharingRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SignatureCreateInput = {
    id?: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    signer: UserCreateNestedOneWithoutSignaturesInput
    file: FileCreateNestedOneWithoutSignaturesInput
  }

  export type SignatureUncheckedCreateInput = {
    id?: string
    fileId: string
    signerId: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignatureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signer?: UserUpdateOneRequiredWithoutSignaturesNestedInput
    file?: FileUpdateOneRequiredWithoutSignaturesNestedInput
  }

  export type SignatureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    signerId?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignatureCreateManyInput = {
    id?: string
    fileId: string
    signerId: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignatureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignatureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    signerId?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenCreateInput = {
    id?: string
    tokenId: string
    fileMetadataHash: string
    userPublicKeyHash: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    adjudicatorPublicKey: string
    createdAt?: Date | string
    file: FileCreateNestedOneWithoutValidationTokenInput
  }

  export type ValidationTokenUncheckedCreateInput = {
    id?: string
    tokenId: string
    fileId: string
    fileMetadataHash: string
    userPublicKeyHash: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    adjudicatorPublicKey: string
    createdAt?: Date | string
  }

  export type ValidationTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    adjudicatorPublicKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: FileUpdateOneRequiredWithoutValidationTokenNestedInput
  }

  export type ValidationTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    adjudicatorPublicKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenCreateManyInput = {
    id?: string
    tokenId: string
    fileId: string
    fileMetadataHash: string
    userPublicKeyHash: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    adjudicatorPublicKey: string
    createdAt?: Date | string
  }

  export type ValidationTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    adjudicatorPublicKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    adjudicatorPublicKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigationAuditCreateInput = {
    id?: string
    investigationId: string
    fileId: string
    reason: string
    adminApproval: string
    legalAuthorization: string
    decryptedPublicKey?: string | null
    createdAt?: Date | string
  }

  export type InvestigationAuditUncheckedCreateInput = {
    id?: string
    investigationId: string
    fileId: string
    reason: string
    adminApproval: string
    legalAuthorization: string
    decryptedPublicKey?: string | null
    createdAt?: Date | string
  }

  export type InvestigationAuditUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    investigationId?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    adminApproval?: StringFieldUpdateOperationsInput | string
    legalAuthorization?: StringFieldUpdateOperationsInput | string
    decryptedPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigationAuditUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    investigationId?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    adminApproval?: StringFieldUpdateOperationsInput | string
    legalAuthorization?: StringFieldUpdateOperationsInput | string
    decryptedPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigationAuditCreateManyInput = {
    id?: string
    investigationId: string
    fileId: string
    reason: string
    adminApproval: string
    legalAuthorization: string
    decryptedPublicKey?: string | null
    createdAt?: Date | string
  }

  export type InvestigationAuditUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    investigationId?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    adminApproval?: StringFieldUpdateOperationsInput | string
    legalAuthorization?: StringFieldUpdateOperationsInput | string
    decryptedPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigationAuditUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    investigationId?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    adminApproval?: StringFieldUpdateOperationsInput | string
    legalAuthorization?: StringFieldUpdateOperationsInput | string
    decryptedPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationNonceCreateInput = {
    id?: string
    nonce: string
    createdAt?: Date | string
  }

  export type ValidationNonceUncheckedCreateInput = {
    id?: string
    nonce: string
    createdAt?: Date | string
  }

  export type ValidationNonceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nonce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationNonceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nonce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationNonceCreateManyInput = {
    id?: string
    nonce: string
    createdAt?: Date | string
  }

  export type ValidationNonceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nonce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationNonceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nonce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenAuditCreateInput = {
    id?: string
    tokenId: string
    userPublicKey: string
    userPublicKeyHash: string
    fileMetadataHash: string
    requestNonce: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    createdAt?: Date | string
  }

  export type ValidationTokenAuditUncheckedCreateInput = {
    id?: string
    tokenId: string
    userPublicKey: string
    userPublicKeyHash: string
    fileMetadataHash: string
    requestNonce: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    createdAt?: Date | string
  }

  export type ValidationTokenAuditUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    userPublicKey?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    requestNonce?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenAuditUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    userPublicKey?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    requestNonce?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenAuditCreateManyInput = {
    id?: string
    tokenId: string
    userPublicKey: string
    userPublicKeyHash: string
    fileMetadataHash: string
    requestNonce: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    createdAt?: Date | string
  }

  export type ValidationTokenAuditUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    userPublicKey?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    requestNonce?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenAuditUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    userPublicKey?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    requestNonce?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannedUserCreateInput = {
    id?: string
    publicKey: string
    reason: string
    bannedByAdmin: string
    bannedAt?: Date | string
  }

  export type BannedUserUncheckedCreateInput = {
    id?: string
    publicKey: string
    reason: string
    bannedByAdmin: string
    bannedAt?: Date | string
  }

  export type BannedUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    bannedByAdmin?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannedUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    bannedByAdmin?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannedUserCreateManyInput = {
    id?: string
    publicKey: string
    reason: string
    bannedByAdmin: string
    bannedAt?: Date | string
  }

  export type BannedUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    bannedByAdmin?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BannedUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    bannedByAdmin?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FileListRelationFilter = {
    every?: FileWhereInput
    some?: FileWhereInput
    none?: FileWhereInput
  }

  export type SignatureListRelationFilter = {
    every?: SignatureWhereInput
    some?: SignatureWhereInput
    none?: SignatureWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SignatureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    displayLabel?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    displayLabel?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    displayLabel?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AnonymousFileAccessListRelationFilter = {
    every?: AnonymousFileAccessWhereInput
    some?: AnonymousFileAccessWhereInput
    none?: AnonymousFileAccessWhereInput
  }

  export type AnonymousRevocationListRelationFilter = {
    every?: AnonymousRevocationWhereInput
    some?: AnonymousRevocationWhereInput
    none?: AnonymousRevocationWhereInput
  }

  export type AnonymousSharingRequestListRelationFilter = {
    every?: AnonymousSharingRequestWhereInput
    some?: AnonymousSharingRequestWhereInput
    none?: AnonymousSharingRequestWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type FileChunkListRelationFilter = {
    every?: FileChunkWhereInput
    some?: FileChunkWhereInput
    none?: FileChunkWhereInput
  }

  export type IntegrityAlertListRelationFilter = {
    every?: IntegrityAlertWhereInput
    some?: IntegrityAlertWhereInput
    none?: IntegrityAlertWhereInput
  }

  export type ValidationTokenNullableRelationFilter = {
    is?: ValidationTokenWhereInput | null
    isNot?: ValidationTokenWhereInput | null
  }

  export type AnonymousFileAccessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnonymousRevocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnonymousSharingRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileChunkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IntegrityAlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    totalSize?: SortOrder
    mimeType?: SortOrder
    chunkCount?: SortOrder
    metadata?: SortOrder
    metadataHash?: SortOrder
    encryptedChunkKeys?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    escrowedIdentity?: SortOrder
    ownershipPublicKey?: SortOrder
    ownershipCreatedAt?: SortOrder
    uploaderId?: SortOrder
    uploaderPublicKeyHash?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastRevocationId?: SortOrder
    lastRevocationAt?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    totalSize?: SortOrder
    chunkCount?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    totalSize?: SortOrder
    mimeType?: SortOrder
    chunkCount?: SortOrder
    metadata?: SortOrder
    metadataHash?: SortOrder
    encryptedChunkKeys?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    escrowedIdentity?: SortOrder
    ownershipPublicKey?: SortOrder
    ownershipCreatedAt?: SortOrder
    uploaderId?: SortOrder
    uploaderPublicKeyHash?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastRevocationId?: SortOrder
    lastRevocationAt?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    totalSize?: SortOrder
    mimeType?: SortOrder
    chunkCount?: SortOrder
    metadata?: SortOrder
    metadataHash?: SortOrder
    encryptedChunkKeys?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    escrowedIdentity?: SortOrder
    ownershipPublicKey?: SortOrder
    ownershipCreatedAt?: SortOrder
    uploaderId?: SortOrder
    uploaderPublicKeyHash?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastRevocationId?: SortOrder
    lastRevocationAt?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    totalSize?: SortOrder
    chunkCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FileRelationFilter = {
    is?: FileWhereInput
    isNot?: FileWhereInput
  }

  export type FileChunkFileIdChunkIndexCompoundUniqueInput = {
    fileId: string
    chunkIndex: number
  }

  export type FileChunkCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    chunkHash?: SortOrder
    ipfsCid?: SortOrder
    size?: SortOrder
    encryptedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type FileChunkAvgOrderByAggregateInput = {
    chunkIndex?: SortOrder
    size?: SortOrder
  }

  export type FileChunkMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    chunkHash?: SortOrder
    ipfsCid?: SortOrder
    size?: SortOrder
    encryptedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type FileChunkMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    chunkHash?: SortOrder
    ipfsCid?: SortOrder
    size?: SortOrder
    encryptedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type FileChunkSumOrderByAggregateInput = {
    chunkIndex?: SortOrder
    size?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AnonymousRevocationCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    revokedPublicKeyHash?: SortOrder
    proofR?: SortOrder
    proofS?: SortOrder
    proofMessage?: SortOrder
    proofTimestamp?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    chunksReencrypted?: SortOrder
    revocationStrategy?: SortOrder
    createdAt?: SortOrder
    executedBySystem?: SortOrder
  }

  export type AnonymousRevocationMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    revokedPublicKeyHash?: SortOrder
    proofR?: SortOrder
    proofS?: SortOrder
    proofMessage?: SortOrder
    proofTimestamp?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    chunksReencrypted?: SortOrder
    revocationStrategy?: SortOrder
    createdAt?: SortOrder
    executedBySystem?: SortOrder
  }

  export type AnonymousRevocationMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    revokedPublicKeyHash?: SortOrder
    proofR?: SortOrder
    proofS?: SortOrder
    proofMessage?: SortOrder
    proofTimestamp?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    chunksReencrypted?: SortOrder
    revocationStrategy?: SortOrder
    createdAt?: SortOrder
    executedBySystem?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntegrityAlertCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    expectedHash?: SortOrder
    actualHash?: SortOrder
    reportedByPublicKeyHash?: SortOrder
    reportedAt?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrder
    resolution?: SortOrder
  }

  export type IntegrityAlertAvgOrderByAggregateInput = {
    chunkIndex?: SortOrder
  }

  export type IntegrityAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    expectedHash?: SortOrder
    actualHash?: SortOrder
    reportedByPublicKeyHash?: SortOrder
    reportedAt?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrder
    resolution?: SortOrder
  }

  export type IntegrityAlertMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    chunkIndex?: SortOrder
    expectedHash?: SortOrder
    actualHash?: SortOrder
    reportedByPublicKeyHash?: SortOrder
    reportedAt?: SortOrder
    resolved?: SortOrder
    resolvedAt?: SortOrder
    resolution?: SortOrder
  }

  export type IntegrityAlertSumOrderByAggregateInput = {
    chunkIndex?: SortOrder
  }

  export type AnonymousFileAccessAccessorPublicKeyHashFileIdCompoundUniqueInput = {
    accessorPublicKeyHash: string
    fileId: string
  }

  export type AnonymousFileAccessCountOrderByAggregateInput = {
    id?: SortOrder
    accessorPublicKeyHash?: SortOrder
    fileId?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    lastAccessProof?: SortOrder
    lastAccessAt?: SortOrder
    accessCount?: SortOrder
    keyStatus?: SortOrder
    keyPackageFingerprint?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    lastOwnerProof?: SortOrder
  }

  export type AnonymousFileAccessAvgOrderByAggregateInput = {
    accessCount?: SortOrder
  }

  export type AnonymousFileAccessMaxOrderByAggregateInput = {
    id?: SortOrder
    accessorPublicKeyHash?: SortOrder
    fileId?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    lastAccessProof?: SortOrder
    lastAccessAt?: SortOrder
    accessCount?: SortOrder
    keyStatus?: SortOrder
    keyPackageFingerprint?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    lastOwnerProof?: SortOrder
  }

  export type AnonymousFileAccessMinOrderByAggregateInput = {
    id?: SortOrder
    accessorPublicKeyHash?: SortOrder
    fileId?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    lastAccessProof?: SortOrder
    lastAccessAt?: SortOrder
    accessCount?: SortOrder
    keyStatus?: SortOrder
    keyPackageFingerprint?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    lastOwnerProof?: SortOrder
  }

  export type AnonymousFileAccessSumOrderByAggregateInput = {
    accessCount?: SortOrder
  }

  export type AnonymousAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    fileId?: SortOrder
    publicKeyHash?: SortOrder
    deviceFingerprint?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    metadata?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    lastOwnerProof?: SortOrder
  }

  export type AnonymousAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    fileId?: SortOrder
    publicKeyHash?: SortOrder
    deviceFingerprint?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    metadata?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    lastOwnerProof?: SortOrder
  }

  export type AnonymousAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    fileId?: SortOrder
    publicKeyHash?: SortOrder
    deviceFingerprint?: SortOrder
    ringSignature?: SortOrder
    ringPublicKeys?: SortOrder
    metadata?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    lastOwnerProof?: SortOrder
  }

  export type AnonymousSharingRequestCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    sharerPublicKeyHash?: SortOrder
    recipientPublicKeyHash?: SortOrder
    ownershipProof?: SortOrder
    ringSignature?: SortOrder
    keyPackageFingerprint?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
  }

  export type AnonymousSharingRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    sharerPublicKeyHash?: SortOrder
    recipientPublicKeyHash?: SortOrder
    ownershipProof?: SortOrder
    ringSignature?: SortOrder
    keyPackageFingerprint?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
  }

  export type AnonymousSharingRequestMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    sharerPublicKeyHash?: SortOrder
    recipientPublicKeyHash?: SortOrder
    ownershipProof?: SortOrder
    ringSignature?: SortOrder
    keyPackageFingerprint?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SignatureCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    signerId?: SortOrder
    ringUserIds?: SortOrder
    signature?: SortOrder
    isOpened?: SortOrder
    openingProof?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignatureMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    signerId?: SortOrder
    ringUserIds?: SortOrder
    signature?: SortOrder
    isOpened?: SortOrder
    openingProof?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignatureMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    signerId?: SortOrder
    ringUserIds?: SortOrder
    signature?: SortOrder
    isOpened?: SortOrder
    openingProof?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ValidationTokenCountOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    fileId?: SortOrder
    fileMetadataHash?: SortOrder
    userPublicKeyHash?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    adjudicatorPublicKey?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    fileId?: SortOrder
    fileMetadataHash?: SortOrder
    userPublicKeyHash?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    adjudicatorPublicKey?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationTokenMinOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    fileId?: SortOrder
    fileMetadataHash?: SortOrder
    userPublicKeyHash?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    adjudicatorPublicKey?: SortOrder
    createdAt?: SortOrder
  }

  export type InvestigationAuditCountOrderByAggregateInput = {
    id?: SortOrder
    investigationId?: SortOrder
    fileId?: SortOrder
    reason?: SortOrder
    adminApproval?: SortOrder
    legalAuthorization?: SortOrder
    decryptedPublicKey?: SortOrder
    createdAt?: SortOrder
  }

  export type InvestigationAuditMaxOrderByAggregateInput = {
    id?: SortOrder
    investigationId?: SortOrder
    fileId?: SortOrder
    reason?: SortOrder
    adminApproval?: SortOrder
    legalAuthorization?: SortOrder
    decryptedPublicKey?: SortOrder
    createdAt?: SortOrder
  }

  export type InvestigationAuditMinOrderByAggregateInput = {
    id?: SortOrder
    investigationId?: SortOrder
    fileId?: SortOrder
    reason?: SortOrder
    adminApproval?: SortOrder
    legalAuthorization?: SortOrder
    decryptedPublicKey?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationNonceCountOrderByAggregateInput = {
    id?: SortOrder
    nonce?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationNonceMaxOrderByAggregateInput = {
    id?: SortOrder
    nonce?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationNonceMinOrderByAggregateInput = {
    id?: SortOrder
    nonce?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationTokenAuditCountOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    userPublicKey?: SortOrder
    userPublicKeyHash?: SortOrder
    fileMetadataHash?: SortOrder
    requestNonce?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationTokenAuditMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    userPublicKey?: SortOrder
    userPublicKeyHash?: SortOrder
    fileMetadataHash?: SortOrder
    requestNonce?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidationTokenAuditMinOrderByAggregateInput = {
    id?: SortOrder
    tokenId?: SortOrder
    userPublicKey?: SortOrder
    userPublicKeyHash?: SortOrder
    fileMetadataHash?: SortOrder
    requestNonce?: SortOrder
    issuedAt?: SortOrder
    expiresAt?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
  }

  export type BannedUserCountOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    reason?: SortOrder
    bannedByAdmin?: SortOrder
    bannedAt?: SortOrder
  }

  export type BannedUserMaxOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    reason?: SortOrder
    bannedByAdmin?: SortOrder
    bannedAt?: SortOrder
  }

  export type BannedUserMinOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    reason?: SortOrder
    bannedByAdmin?: SortOrder
    bannedAt?: SortOrder
  }

  export type FileCreateNestedManyWithoutUploaderInput = {
    create?: XOR<FileCreateWithoutUploaderInput, FileUncheckedCreateWithoutUploaderInput> | FileCreateWithoutUploaderInput[] | FileUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUploaderInput | FileCreateOrConnectWithoutUploaderInput[]
    createMany?: FileCreateManyUploaderInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type SignatureCreateNestedManyWithoutSignerInput = {
    create?: XOR<SignatureCreateWithoutSignerInput, SignatureUncheckedCreateWithoutSignerInput> | SignatureCreateWithoutSignerInput[] | SignatureUncheckedCreateWithoutSignerInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutSignerInput | SignatureCreateOrConnectWithoutSignerInput[]
    createMany?: SignatureCreateManySignerInputEnvelope
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: XOR<FileCreateWithoutUploaderInput, FileUncheckedCreateWithoutUploaderInput> | FileCreateWithoutUploaderInput[] | FileUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUploaderInput | FileCreateOrConnectWithoutUploaderInput[]
    createMany?: FileCreateManyUploaderInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type SignatureUncheckedCreateNestedManyWithoutSignerInput = {
    create?: XOR<SignatureCreateWithoutSignerInput, SignatureUncheckedCreateWithoutSignerInput> | SignatureCreateWithoutSignerInput[] | SignatureUncheckedCreateWithoutSignerInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutSignerInput | SignatureCreateOrConnectWithoutSignerInput[]
    createMany?: SignatureCreateManySignerInputEnvelope
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FileUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<FileCreateWithoutUploaderInput, FileUncheckedCreateWithoutUploaderInput> | FileCreateWithoutUploaderInput[] | FileUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUploaderInput | FileCreateOrConnectWithoutUploaderInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutUploaderInput | FileUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: FileCreateManyUploaderInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutUploaderInput | FileUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: FileUpdateManyWithWhereWithoutUploaderInput | FileUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type SignatureUpdateManyWithoutSignerNestedInput = {
    create?: XOR<SignatureCreateWithoutSignerInput, SignatureUncheckedCreateWithoutSignerInput> | SignatureCreateWithoutSignerInput[] | SignatureUncheckedCreateWithoutSignerInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutSignerInput | SignatureCreateOrConnectWithoutSignerInput[]
    upsert?: SignatureUpsertWithWhereUniqueWithoutSignerInput | SignatureUpsertWithWhereUniqueWithoutSignerInput[]
    createMany?: SignatureCreateManySignerInputEnvelope
    set?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    disconnect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    delete?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    update?: SignatureUpdateWithWhereUniqueWithoutSignerInput | SignatureUpdateWithWhereUniqueWithoutSignerInput[]
    updateMany?: SignatureUpdateManyWithWhereWithoutSignerInput | SignatureUpdateManyWithWhereWithoutSignerInput[]
    deleteMany?: SignatureScalarWhereInput | SignatureScalarWhereInput[]
  }

  export type FileUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<FileCreateWithoutUploaderInput, FileUncheckedCreateWithoutUploaderInput> | FileCreateWithoutUploaderInput[] | FileUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUploaderInput | FileCreateOrConnectWithoutUploaderInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutUploaderInput | FileUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: FileCreateManyUploaderInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutUploaderInput | FileUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: FileUpdateManyWithWhereWithoutUploaderInput | FileUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type SignatureUncheckedUpdateManyWithoutSignerNestedInput = {
    create?: XOR<SignatureCreateWithoutSignerInput, SignatureUncheckedCreateWithoutSignerInput> | SignatureCreateWithoutSignerInput[] | SignatureUncheckedCreateWithoutSignerInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutSignerInput | SignatureCreateOrConnectWithoutSignerInput[]
    upsert?: SignatureUpsertWithWhereUniqueWithoutSignerInput | SignatureUpsertWithWhereUniqueWithoutSignerInput[]
    createMany?: SignatureCreateManySignerInputEnvelope
    set?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    disconnect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    delete?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    update?: SignatureUpdateWithWhereUniqueWithoutSignerInput | SignatureUpdateWithWhereUniqueWithoutSignerInput[]
    updateMany?: SignatureUpdateManyWithWhereWithoutSignerInput | SignatureUpdateManyWithWhereWithoutSignerInput[]
    deleteMany?: SignatureScalarWhereInput | SignatureScalarWhereInput[]
  }

  export type AnonymousFileAccessCreateNestedManyWithoutFileInput = {
    create?: XOR<AnonymousFileAccessCreateWithoutFileInput, AnonymousFileAccessUncheckedCreateWithoutFileInput> | AnonymousFileAccessCreateWithoutFileInput[] | AnonymousFileAccessUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousFileAccessCreateOrConnectWithoutFileInput | AnonymousFileAccessCreateOrConnectWithoutFileInput[]
    createMany?: AnonymousFileAccessCreateManyFileInputEnvelope
    connect?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
  }

  export type AnonymousRevocationCreateNestedManyWithoutFileInput = {
    create?: XOR<AnonymousRevocationCreateWithoutFileInput, AnonymousRevocationUncheckedCreateWithoutFileInput> | AnonymousRevocationCreateWithoutFileInput[] | AnonymousRevocationUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousRevocationCreateOrConnectWithoutFileInput | AnonymousRevocationCreateOrConnectWithoutFileInput[]
    createMany?: AnonymousRevocationCreateManyFileInputEnvelope
    connect?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
  }

  export type AnonymousSharingRequestCreateNestedManyWithoutFileInput = {
    create?: XOR<AnonymousSharingRequestCreateWithoutFileInput, AnonymousSharingRequestUncheckedCreateWithoutFileInput> | AnonymousSharingRequestCreateWithoutFileInput[] | AnonymousSharingRequestUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousSharingRequestCreateOrConnectWithoutFileInput | AnonymousSharingRequestCreateOrConnectWithoutFileInput[]
    createMany?: AnonymousSharingRequestCreateManyFileInputEnvelope
    connect?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutUploadedFilesInput = {
    create?: XOR<UserCreateWithoutUploadedFilesInput, UserUncheckedCreateWithoutUploadedFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUploadedFilesInput
    connect?: UserWhereUniqueInput
  }

  export type FileChunkCreateNestedManyWithoutFileInput = {
    create?: XOR<FileChunkCreateWithoutFileInput, FileChunkUncheckedCreateWithoutFileInput> | FileChunkCreateWithoutFileInput[] | FileChunkUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileChunkCreateOrConnectWithoutFileInput | FileChunkCreateOrConnectWithoutFileInput[]
    createMany?: FileChunkCreateManyFileInputEnvelope
    connect?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
  }

  export type IntegrityAlertCreateNestedManyWithoutFileInput = {
    create?: XOR<IntegrityAlertCreateWithoutFileInput, IntegrityAlertUncheckedCreateWithoutFileInput> | IntegrityAlertCreateWithoutFileInput[] | IntegrityAlertUncheckedCreateWithoutFileInput[]
    connectOrCreate?: IntegrityAlertCreateOrConnectWithoutFileInput | IntegrityAlertCreateOrConnectWithoutFileInput[]
    createMany?: IntegrityAlertCreateManyFileInputEnvelope
    connect?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
  }

  export type SignatureCreateNestedManyWithoutFileInput = {
    create?: XOR<SignatureCreateWithoutFileInput, SignatureUncheckedCreateWithoutFileInput> | SignatureCreateWithoutFileInput[] | SignatureUncheckedCreateWithoutFileInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutFileInput | SignatureCreateOrConnectWithoutFileInput[]
    createMany?: SignatureCreateManyFileInputEnvelope
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
  }

  export type ValidationTokenCreateNestedOneWithoutFileInput = {
    create?: XOR<ValidationTokenCreateWithoutFileInput, ValidationTokenUncheckedCreateWithoutFileInput>
    connectOrCreate?: ValidationTokenCreateOrConnectWithoutFileInput
    connect?: ValidationTokenWhereUniqueInput
  }

  export type AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<AnonymousFileAccessCreateWithoutFileInput, AnonymousFileAccessUncheckedCreateWithoutFileInput> | AnonymousFileAccessCreateWithoutFileInput[] | AnonymousFileAccessUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousFileAccessCreateOrConnectWithoutFileInput | AnonymousFileAccessCreateOrConnectWithoutFileInput[]
    createMany?: AnonymousFileAccessCreateManyFileInputEnvelope
    connect?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
  }

  export type AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<AnonymousRevocationCreateWithoutFileInput, AnonymousRevocationUncheckedCreateWithoutFileInput> | AnonymousRevocationCreateWithoutFileInput[] | AnonymousRevocationUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousRevocationCreateOrConnectWithoutFileInput | AnonymousRevocationCreateOrConnectWithoutFileInput[]
    createMany?: AnonymousRevocationCreateManyFileInputEnvelope
    connect?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
  }

  export type AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<AnonymousSharingRequestCreateWithoutFileInput, AnonymousSharingRequestUncheckedCreateWithoutFileInput> | AnonymousSharingRequestCreateWithoutFileInput[] | AnonymousSharingRequestUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousSharingRequestCreateOrConnectWithoutFileInput | AnonymousSharingRequestCreateOrConnectWithoutFileInput[]
    createMany?: AnonymousSharingRequestCreateManyFileInputEnvelope
    connect?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
  }

  export type FileChunkUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<FileChunkCreateWithoutFileInput, FileChunkUncheckedCreateWithoutFileInput> | FileChunkCreateWithoutFileInput[] | FileChunkUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileChunkCreateOrConnectWithoutFileInput | FileChunkCreateOrConnectWithoutFileInput[]
    createMany?: FileChunkCreateManyFileInputEnvelope
    connect?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
  }

  export type IntegrityAlertUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<IntegrityAlertCreateWithoutFileInput, IntegrityAlertUncheckedCreateWithoutFileInput> | IntegrityAlertCreateWithoutFileInput[] | IntegrityAlertUncheckedCreateWithoutFileInput[]
    connectOrCreate?: IntegrityAlertCreateOrConnectWithoutFileInput | IntegrityAlertCreateOrConnectWithoutFileInput[]
    createMany?: IntegrityAlertCreateManyFileInputEnvelope
    connect?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
  }

  export type SignatureUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<SignatureCreateWithoutFileInput, SignatureUncheckedCreateWithoutFileInput> | SignatureCreateWithoutFileInput[] | SignatureUncheckedCreateWithoutFileInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutFileInput | SignatureCreateOrConnectWithoutFileInput[]
    createMany?: SignatureCreateManyFileInputEnvelope
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
  }

  export type ValidationTokenUncheckedCreateNestedOneWithoutFileInput = {
    create?: XOR<ValidationTokenCreateWithoutFileInput, ValidationTokenUncheckedCreateWithoutFileInput>
    connectOrCreate?: ValidationTokenCreateOrConnectWithoutFileInput
    connect?: ValidationTokenWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AnonymousFileAccessUpdateManyWithoutFileNestedInput = {
    create?: XOR<AnonymousFileAccessCreateWithoutFileInput, AnonymousFileAccessUncheckedCreateWithoutFileInput> | AnonymousFileAccessCreateWithoutFileInput[] | AnonymousFileAccessUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousFileAccessCreateOrConnectWithoutFileInput | AnonymousFileAccessCreateOrConnectWithoutFileInput[]
    upsert?: AnonymousFileAccessUpsertWithWhereUniqueWithoutFileInput | AnonymousFileAccessUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: AnonymousFileAccessCreateManyFileInputEnvelope
    set?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    disconnect?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    delete?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    connect?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    update?: AnonymousFileAccessUpdateWithWhereUniqueWithoutFileInput | AnonymousFileAccessUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: AnonymousFileAccessUpdateManyWithWhereWithoutFileInput | AnonymousFileAccessUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: AnonymousFileAccessScalarWhereInput | AnonymousFileAccessScalarWhereInput[]
  }

  export type AnonymousRevocationUpdateManyWithoutFileNestedInput = {
    create?: XOR<AnonymousRevocationCreateWithoutFileInput, AnonymousRevocationUncheckedCreateWithoutFileInput> | AnonymousRevocationCreateWithoutFileInput[] | AnonymousRevocationUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousRevocationCreateOrConnectWithoutFileInput | AnonymousRevocationCreateOrConnectWithoutFileInput[]
    upsert?: AnonymousRevocationUpsertWithWhereUniqueWithoutFileInput | AnonymousRevocationUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: AnonymousRevocationCreateManyFileInputEnvelope
    set?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    disconnect?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    delete?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    connect?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    update?: AnonymousRevocationUpdateWithWhereUniqueWithoutFileInput | AnonymousRevocationUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: AnonymousRevocationUpdateManyWithWhereWithoutFileInput | AnonymousRevocationUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: AnonymousRevocationScalarWhereInput | AnonymousRevocationScalarWhereInput[]
  }

  export type AnonymousSharingRequestUpdateManyWithoutFileNestedInput = {
    create?: XOR<AnonymousSharingRequestCreateWithoutFileInput, AnonymousSharingRequestUncheckedCreateWithoutFileInput> | AnonymousSharingRequestCreateWithoutFileInput[] | AnonymousSharingRequestUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousSharingRequestCreateOrConnectWithoutFileInput | AnonymousSharingRequestCreateOrConnectWithoutFileInput[]
    upsert?: AnonymousSharingRequestUpsertWithWhereUniqueWithoutFileInput | AnonymousSharingRequestUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: AnonymousSharingRequestCreateManyFileInputEnvelope
    set?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    disconnect?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    delete?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    connect?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    update?: AnonymousSharingRequestUpdateWithWhereUniqueWithoutFileInput | AnonymousSharingRequestUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: AnonymousSharingRequestUpdateManyWithWhereWithoutFileInput | AnonymousSharingRequestUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: AnonymousSharingRequestScalarWhereInput | AnonymousSharingRequestScalarWhereInput[]
  }

  export type UserUpdateOneWithoutUploadedFilesNestedInput = {
    create?: XOR<UserCreateWithoutUploadedFilesInput, UserUncheckedCreateWithoutUploadedFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUploadedFilesInput
    upsert?: UserUpsertWithoutUploadedFilesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUploadedFilesInput, UserUpdateWithoutUploadedFilesInput>, UserUncheckedUpdateWithoutUploadedFilesInput>
  }

  export type FileChunkUpdateManyWithoutFileNestedInput = {
    create?: XOR<FileChunkCreateWithoutFileInput, FileChunkUncheckedCreateWithoutFileInput> | FileChunkCreateWithoutFileInput[] | FileChunkUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileChunkCreateOrConnectWithoutFileInput | FileChunkCreateOrConnectWithoutFileInput[]
    upsert?: FileChunkUpsertWithWhereUniqueWithoutFileInput | FileChunkUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: FileChunkCreateManyFileInputEnvelope
    set?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    disconnect?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    delete?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    connect?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    update?: FileChunkUpdateWithWhereUniqueWithoutFileInput | FileChunkUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: FileChunkUpdateManyWithWhereWithoutFileInput | FileChunkUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: FileChunkScalarWhereInput | FileChunkScalarWhereInput[]
  }

  export type IntegrityAlertUpdateManyWithoutFileNestedInput = {
    create?: XOR<IntegrityAlertCreateWithoutFileInput, IntegrityAlertUncheckedCreateWithoutFileInput> | IntegrityAlertCreateWithoutFileInput[] | IntegrityAlertUncheckedCreateWithoutFileInput[]
    connectOrCreate?: IntegrityAlertCreateOrConnectWithoutFileInput | IntegrityAlertCreateOrConnectWithoutFileInput[]
    upsert?: IntegrityAlertUpsertWithWhereUniqueWithoutFileInput | IntegrityAlertUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: IntegrityAlertCreateManyFileInputEnvelope
    set?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    disconnect?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    delete?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    connect?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    update?: IntegrityAlertUpdateWithWhereUniqueWithoutFileInput | IntegrityAlertUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: IntegrityAlertUpdateManyWithWhereWithoutFileInput | IntegrityAlertUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: IntegrityAlertScalarWhereInput | IntegrityAlertScalarWhereInput[]
  }

  export type SignatureUpdateManyWithoutFileNestedInput = {
    create?: XOR<SignatureCreateWithoutFileInput, SignatureUncheckedCreateWithoutFileInput> | SignatureCreateWithoutFileInput[] | SignatureUncheckedCreateWithoutFileInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutFileInput | SignatureCreateOrConnectWithoutFileInput[]
    upsert?: SignatureUpsertWithWhereUniqueWithoutFileInput | SignatureUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: SignatureCreateManyFileInputEnvelope
    set?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    disconnect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    delete?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    update?: SignatureUpdateWithWhereUniqueWithoutFileInput | SignatureUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: SignatureUpdateManyWithWhereWithoutFileInput | SignatureUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: SignatureScalarWhereInput | SignatureScalarWhereInput[]
  }

  export type ValidationTokenUpdateOneWithoutFileNestedInput = {
    create?: XOR<ValidationTokenCreateWithoutFileInput, ValidationTokenUncheckedCreateWithoutFileInput>
    connectOrCreate?: ValidationTokenCreateOrConnectWithoutFileInput
    upsert?: ValidationTokenUpsertWithoutFileInput
    disconnect?: ValidationTokenWhereInput | boolean
    delete?: ValidationTokenWhereInput | boolean
    connect?: ValidationTokenWhereUniqueInput
    update?: XOR<XOR<ValidationTokenUpdateToOneWithWhereWithoutFileInput, ValidationTokenUpdateWithoutFileInput>, ValidationTokenUncheckedUpdateWithoutFileInput>
  }

  export type AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<AnonymousFileAccessCreateWithoutFileInput, AnonymousFileAccessUncheckedCreateWithoutFileInput> | AnonymousFileAccessCreateWithoutFileInput[] | AnonymousFileAccessUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousFileAccessCreateOrConnectWithoutFileInput | AnonymousFileAccessCreateOrConnectWithoutFileInput[]
    upsert?: AnonymousFileAccessUpsertWithWhereUniqueWithoutFileInput | AnonymousFileAccessUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: AnonymousFileAccessCreateManyFileInputEnvelope
    set?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    disconnect?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    delete?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    connect?: AnonymousFileAccessWhereUniqueInput | AnonymousFileAccessWhereUniqueInput[]
    update?: AnonymousFileAccessUpdateWithWhereUniqueWithoutFileInput | AnonymousFileAccessUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: AnonymousFileAccessUpdateManyWithWhereWithoutFileInput | AnonymousFileAccessUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: AnonymousFileAccessScalarWhereInput | AnonymousFileAccessScalarWhereInput[]
  }

  export type AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<AnonymousRevocationCreateWithoutFileInput, AnonymousRevocationUncheckedCreateWithoutFileInput> | AnonymousRevocationCreateWithoutFileInput[] | AnonymousRevocationUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousRevocationCreateOrConnectWithoutFileInput | AnonymousRevocationCreateOrConnectWithoutFileInput[]
    upsert?: AnonymousRevocationUpsertWithWhereUniqueWithoutFileInput | AnonymousRevocationUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: AnonymousRevocationCreateManyFileInputEnvelope
    set?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    disconnect?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    delete?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    connect?: AnonymousRevocationWhereUniqueInput | AnonymousRevocationWhereUniqueInput[]
    update?: AnonymousRevocationUpdateWithWhereUniqueWithoutFileInput | AnonymousRevocationUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: AnonymousRevocationUpdateManyWithWhereWithoutFileInput | AnonymousRevocationUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: AnonymousRevocationScalarWhereInput | AnonymousRevocationScalarWhereInput[]
  }

  export type AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<AnonymousSharingRequestCreateWithoutFileInput, AnonymousSharingRequestUncheckedCreateWithoutFileInput> | AnonymousSharingRequestCreateWithoutFileInput[] | AnonymousSharingRequestUncheckedCreateWithoutFileInput[]
    connectOrCreate?: AnonymousSharingRequestCreateOrConnectWithoutFileInput | AnonymousSharingRequestCreateOrConnectWithoutFileInput[]
    upsert?: AnonymousSharingRequestUpsertWithWhereUniqueWithoutFileInput | AnonymousSharingRequestUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: AnonymousSharingRequestCreateManyFileInputEnvelope
    set?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    disconnect?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    delete?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    connect?: AnonymousSharingRequestWhereUniqueInput | AnonymousSharingRequestWhereUniqueInput[]
    update?: AnonymousSharingRequestUpdateWithWhereUniqueWithoutFileInput | AnonymousSharingRequestUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: AnonymousSharingRequestUpdateManyWithWhereWithoutFileInput | AnonymousSharingRequestUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: AnonymousSharingRequestScalarWhereInput | AnonymousSharingRequestScalarWhereInput[]
  }

  export type FileChunkUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<FileChunkCreateWithoutFileInput, FileChunkUncheckedCreateWithoutFileInput> | FileChunkCreateWithoutFileInput[] | FileChunkUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileChunkCreateOrConnectWithoutFileInput | FileChunkCreateOrConnectWithoutFileInput[]
    upsert?: FileChunkUpsertWithWhereUniqueWithoutFileInput | FileChunkUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: FileChunkCreateManyFileInputEnvelope
    set?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    disconnect?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    delete?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    connect?: FileChunkWhereUniqueInput | FileChunkWhereUniqueInput[]
    update?: FileChunkUpdateWithWhereUniqueWithoutFileInput | FileChunkUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: FileChunkUpdateManyWithWhereWithoutFileInput | FileChunkUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: FileChunkScalarWhereInput | FileChunkScalarWhereInput[]
  }

  export type IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<IntegrityAlertCreateWithoutFileInput, IntegrityAlertUncheckedCreateWithoutFileInput> | IntegrityAlertCreateWithoutFileInput[] | IntegrityAlertUncheckedCreateWithoutFileInput[]
    connectOrCreate?: IntegrityAlertCreateOrConnectWithoutFileInput | IntegrityAlertCreateOrConnectWithoutFileInput[]
    upsert?: IntegrityAlertUpsertWithWhereUniqueWithoutFileInput | IntegrityAlertUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: IntegrityAlertCreateManyFileInputEnvelope
    set?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    disconnect?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    delete?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    connect?: IntegrityAlertWhereUniqueInput | IntegrityAlertWhereUniqueInput[]
    update?: IntegrityAlertUpdateWithWhereUniqueWithoutFileInput | IntegrityAlertUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: IntegrityAlertUpdateManyWithWhereWithoutFileInput | IntegrityAlertUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: IntegrityAlertScalarWhereInput | IntegrityAlertScalarWhereInput[]
  }

  export type SignatureUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<SignatureCreateWithoutFileInput, SignatureUncheckedCreateWithoutFileInput> | SignatureCreateWithoutFileInput[] | SignatureUncheckedCreateWithoutFileInput[]
    connectOrCreate?: SignatureCreateOrConnectWithoutFileInput | SignatureCreateOrConnectWithoutFileInput[]
    upsert?: SignatureUpsertWithWhereUniqueWithoutFileInput | SignatureUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: SignatureCreateManyFileInputEnvelope
    set?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    disconnect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    delete?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    connect?: SignatureWhereUniqueInput | SignatureWhereUniqueInput[]
    update?: SignatureUpdateWithWhereUniqueWithoutFileInput | SignatureUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: SignatureUpdateManyWithWhereWithoutFileInput | SignatureUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: SignatureScalarWhereInput | SignatureScalarWhereInput[]
  }

  export type ValidationTokenUncheckedUpdateOneWithoutFileNestedInput = {
    create?: XOR<ValidationTokenCreateWithoutFileInput, ValidationTokenUncheckedCreateWithoutFileInput>
    connectOrCreate?: ValidationTokenCreateOrConnectWithoutFileInput
    upsert?: ValidationTokenUpsertWithoutFileInput
    disconnect?: ValidationTokenWhereInput | boolean
    delete?: ValidationTokenWhereInput | boolean
    connect?: ValidationTokenWhereUniqueInput
    update?: XOR<XOR<ValidationTokenUpdateToOneWithWhereWithoutFileInput, ValidationTokenUpdateWithoutFileInput>, ValidationTokenUncheckedUpdateWithoutFileInput>
  }

  export type FileCreateNestedOneWithoutChunksInput = {
    create?: XOR<FileCreateWithoutChunksInput, FileUncheckedCreateWithoutChunksInput>
    connectOrCreate?: FileCreateOrConnectWithoutChunksInput
    connect?: FileWhereUniqueInput
  }

  export type FileUpdateOneRequiredWithoutChunksNestedInput = {
    create?: XOR<FileCreateWithoutChunksInput, FileUncheckedCreateWithoutChunksInput>
    connectOrCreate?: FileCreateOrConnectWithoutChunksInput
    upsert?: FileUpsertWithoutChunksInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutChunksInput, FileUpdateWithoutChunksInput>, FileUncheckedUpdateWithoutChunksInput>
  }

  export type FileCreateNestedOneWithoutRevocationsInput = {
    create?: XOR<FileCreateWithoutRevocationsInput, FileUncheckedCreateWithoutRevocationsInput>
    connectOrCreate?: FileCreateOrConnectWithoutRevocationsInput
    connect?: FileWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type FileUpdateOneRequiredWithoutRevocationsNestedInput = {
    create?: XOR<FileCreateWithoutRevocationsInput, FileUncheckedCreateWithoutRevocationsInput>
    connectOrCreate?: FileCreateOrConnectWithoutRevocationsInput
    upsert?: FileUpsertWithoutRevocationsInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutRevocationsInput, FileUpdateWithoutRevocationsInput>, FileUncheckedUpdateWithoutRevocationsInput>
  }

  export type FileCreateNestedOneWithoutIntegrityAlertsInput = {
    create?: XOR<FileCreateWithoutIntegrityAlertsInput, FileUncheckedCreateWithoutIntegrityAlertsInput>
    connectOrCreate?: FileCreateOrConnectWithoutIntegrityAlertsInput
    connect?: FileWhereUniqueInput
  }

  export type FileUpdateOneRequiredWithoutIntegrityAlertsNestedInput = {
    create?: XOR<FileCreateWithoutIntegrityAlertsInput, FileUncheckedCreateWithoutIntegrityAlertsInput>
    connectOrCreate?: FileCreateOrConnectWithoutIntegrityAlertsInput
    upsert?: FileUpsertWithoutIntegrityAlertsInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutIntegrityAlertsInput, FileUpdateWithoutIntegrityAlertsInput>, FileUncheckedUpdateWithoutIntegrityAlertsInput>
  }

  export type FileCreateNestedOneWithoutAnonymousAccessInput = {
    create?: XOR<FileCreateWithoutAnonymousAccessInput, FileUncheckedCreateWithoutAnonymousAccessInput>
    connectOrCreate?: FileCreateOrConnectWithoutAnonymousAccessInput
    connect?: FileWhereUniqueInput
  }

  export type FileUpdateOneRequiredWithoutAnonymousAccessNestedInput = {
    create?: XOR<FileCreateWithoutAnonymousAccessInput, FileUncheckedCreateWithoutAnonymousAccessInput>
    connectOrCreate?: FileCreateOrConnectWithoutAnonymousAccessInput
    upsert?: FileUpsertWithoutAnonymousAccessInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutAnonymousAccessInput, FileUpdateWithoutAnonymousAccessInput>, FileUncheckedUpdateWithoutAnonymousAccessInput>
  }

  export type FileCreateNestedOneWithoutSharingRequestsInput = {
    create?: XOR<FileCreateWithoutSharingRequestsInput, FileUncheckedCreateWithoutSharingRequestsInput>
    connectOrCreate?: FileCreateOrConnectWithoutSharingRequestsInput
    connect?: FileWhereUniqueInput
  }

  export type FileUpdateOneRequiredWithoutSharingRequestsNestedInput = {
    create?: XOR<FileCreateWithoutSharingRequestsInput, FileUncheckedCreateWithoutSharingRequestsInput>
    connectOrCreate?: FileCreateOrConnectWithoutSharingRequestsInput
    upsert?: FileUpsertWithoutSharingRequestsInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutSharingRequestsInput, FileUpdateWithoutSharingRequestsInput>, FileUncheckedUpdateWithoutSharingRequestsInput>
  }

  export type UserCreateNestedOneWithoutSignaturesInput = {
    create?: XOR<UserCreateWithoutSignaturesInput, UserUncheckedCreateWithoutSignaturesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSignaturesInput
    connect?: UserWhereUniqueInput
  }

  export type FileCreateNestedOneWithoutSignaturesInput = {
    create?: XOR<FileCreateWithoutSignaturesInput, FileUncheckedCreateWithoutSignaturesInput>
    connectOrCreate?: FileCreateOrConnectWithoutSignaturesInput
    connect?: FileWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSignaturesNestedInput = {
    create?: XOR<UserCreateWithoutSignaturesInput, UserUncheckedCreateWithoutSignaturesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSignaturesInput
    upsert?: UserUpsertWithoutSignaturesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSignaturesInput, UserUpdateWithoutSignaturesInput>, UserUncheckedUpdateWithoutSignaturesInput>
  }

  export type FileUpdateOneRequiredWithoutSignaturesNestedInput = {
    create?: XOR<FileCreateWithoutSignaturesInput, FileUncheckedCreateWithoutSignaturesInput>
    connectOrCreate?: FileCreateOrConnectWithoutSignaturesInput
    upsert?: FileUpsertWithoutSignaturesInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutSignaturesInput, FileUpdateWithoutSignaturesInput>, FileUncheckedUpdateWithoutSignaturesInput>
  }

  export type FileCreateNestedOneWithoutValidationTokenInput = {
    create?: XOR<FileCreateWithoutValidationTokenInput, FileUncheckedCreateWithoutValidationTokenInput>
    connectOrCreate?: FileCreateOrConnectWithoutValidationTokenInput
    connect?: FileWhereUniqueInput
  }

  export type FileUpdateOneRequiredWithoutValidationTokenNestedInput = {
    create?: XOR<FileCreateWithoutValidationTokenInput, FileUncheckedCreateWithoutValidationTokenInput>
    connectOrCreate?: FileCreateOrConnectWithoutValidationTokenInput
    upsert?: FileUpsertWithoutValidationTokenInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutValidationTokenInput, FileUpdateWithoutValidationTokenInput>, FileUncheckedUpdateWithoutValidationTokenInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FileCreateWithoutUploaderInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutUploaderInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutUploaderInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutUploaderInput, FileUncheckedCreateWithoutUploaderInput>
  }

  export type FileCreateManyUploaderInputEnvelope = {
    data: FileCreateManyUploaderInput | FileCreateManyUploaderInput[]
  }

  export type SignatureCreateWithoutSignerInput = {
    id?: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    file: FileCreateNestedOneWithoutSignaturesInput
  }

  export type SignatureUncheckedCreateWithoutSignerInput = {
    id?: string
    fileId: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignatureCreateOrConnectWithoutSignerInput = {
    where: SignatureWhereUniqueInput
    create: XOR<SignatureCreateWithoutSignerInput, SignatureUncheckedCreateWithoutSignerInput>
  }

  export type SignatureCreateManySignerInputEnvelope = {
    data: SignatureCreateManySignerInput | SignatureCreateManySignerInput[]
  }

  export type FileUpsertWithWhereUniqueWithoutUploaderInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutUploaderInput, FileUncheckedUpdateWithoutUploaderInput>
    create: XOR<FileCreateWithoutUploaderInput, FileUncheckedCreateWithoutUploaderInput>
  }

  export type FileUpdateWithWhereUniqueWithoutUploaderInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutUploaderInput, FileUncheckedUpdateWithoutUploaderInput>
  }

  export type FileUpdateManyWithWhereWithoutUploaderInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutUploaderInput>
  }

  export type FileScalarWhereInput = {
    AND?: FileScalarWhereInput | FileScalarWhereInput[]
    OR?: FileScalarWhereInput[]
    NOT?: FileScalarWhereInput | FileScalarWhereInput[]
    id?: StringFilter<"File"> | string
    fileName?: StringFilter<"File"> | string
    totalSize?: IntFilter<"File"> | number
    mimeType?: StringNullableFilter<"File"> | string | null
    chunkCount?: IntFilter<"File"> | number
    metadata?: StringNullableFilter<"File"> | string | null
    metadataHash?: StringFilter<"File"> | string
    encryptedChunkKeys?: StringFilter<"File"> | string
    ringSignature?: StringNullableFilter<"File"> | string | null
    ringPublicKeys?: StringNullableFilter<"File"> | string | null
    escrowedIdentity?: StringNullableFilter<"File"> | string | null
    ownershipPublicKey?: StringFilter<"File"> | string
    ownershipCreatedAt?: DateTimeFilter<"File"> | Date | string
    uploaderId?: StringNullableFilter<"File"> | string | null
    uploaderPublicKeyHash?: StringNullableFilter<"File"> | string | null
    status?: StringFilter<"File"> | string
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    lastRevocationId?: StringNullableFilter<"File"> | string | null
    lastRevocationAt?: DateTimeNullableFilter<"File"> | Date | string | null
  }

  export type SignatureUpsertWithWhereUniqueWithoutSignerInput = {
    where: SignatureWhereUniqueInput
    update: XOR<SignatureUpdateWithoutSignerInput, SignatureUncheckedUpdateWithoutSignerInput>
    create: XOR<SignatureCreateWithoutSignerInput, SignatureUncheckedCreateWithoutSignerInput>
  }

  export type SignatureUpdateWithWhereUniqueWithoutSignerInput = {
    where: SignatureWhereUniqueInput
    data: XOR<SignatureUpdateWithoutSignerInput, SignatureUncheckedUpdateWithoutSignerInput>
  }

  export type SignatureUpdateManyWithWhereWithoutSignerInput = {
    where: SignatureScalarWhereInput
    data: XOR<SignatureUpdateManyMutationInput, SignatureUncheckedUpdateManyWithoutSignerInput>
  }

  export type SignatureScalarWhereInput = {
    AND?: SignatureScalarWhereInput | SignatureScalarWhereInput[]
    OR?: SignatureScalarWhereInput[]
    NOT?: SignatureScalarWhereInput | SignatureScalarWhereInput[]
    id?: StringFilter<"Signature"> | string
    fileId?: StringFilter<"Signature"> | string
    signerId?: StringFilter<"Signature"> | string
    ringUserIds?: StringFilter<"Signature"> | string
    signature?: StringFilter<"Signature"> | string
    isOpened?: BoolFilter<"Signature"> | boolean
    openingProof?: StringNullableFilter<"Signature"> | string | null
    createdAt?: DateTimeFilter<"Signature"> | Date | string
    updatedAt?: DateTimeFilter<"Signature"> | Date | string
  }

  export type AnonymousFileAccessCreateWithoutFileInput = {
    id?: string
    accessorPublicKeyHash: string
    grantedAt?: Date | string
    expiresAt?: Date | string | null
    lastAccessProof?: string | null
    lastAccessAt?: Date | string | null
    accessCount?: number
    keyStatus?: string
    keyPackageFingerprint?: string | null
    status?: string
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousFileAccessUncheckedCreateWithoutFileInput = {
    id?: string
    accessorPublicKeyHash: string
    grantedAt?: Date | string
    expiresAt?: Date | string | null
    lastAccessProof?: string | null
    lastAccessAt?: Date | string | null
    accessCount?: number
    keyStatus?: string
    keyPackageFingerprint?: string | null
    status?: string
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousFileAccessCreateOrConnectWithoutFileInput = {
    where: AnonymousFileAccessWhereUniqueInput
    create: XOR<AnonymousFileAccessCreateWithoutFileInput, AnonymousFileAccessUncheckedCreateWithoutFileInput>
  }

  export type AnonymousFileAccessCreateManyFileInputEnvelope = {
    data: AnonymousFileAccessCreateManyFileInput | AnonymousFileAccessCreateManyFileInput[]
  }

  export type AnonymousRevocationCreateWithoutFileInput = {
    id?: string
    revokedPublicKeyHash?: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date | string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    chunksReencrypted: string
    revocationStrategy?: string | null
    createdAt?: Date | string
    executedBySystem?: boolean
  }

  export type AnonymousRevocationUncheckedCreateWithoutFileInput = {
    id?: string
    revokedPublicKeyHash?: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date | string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    chunksReencrypted: string
    revocationStrategy?: string | null
    createdAt?: Date | string
    executedBySystem?: boolean
  }

  export type AnonymousRevocationCreateOrConnectWithoutFileInput = {
    where: AnonymousRevocationWhereUniqueInput
    create: XOR<AnonymousRevocationCreateWithoutFileInput, AnonymousRevocationUncheckedCreateWithoutFileInput>
  }

  export type AnonymousRevocationCreateManyFileInputEnvelope = {
    data: AnonymousRevocationCreateManyFileInput | AnonymousRevocationCreateManyFileInput[]
  }

  export type AnonymousSharingRequestCreateWithoutFileInput = {
    id?: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint?: string | null
    status?: string
    requestedAt?: Date | string
    respondedAt?: Date | string | null
  }

  export type AnonymousSharingRequestUncheckedCreateWithoutFileInput = {
    id?: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint?: string | null
    status?: string
    requestedAt?: Date | string
    respondedAt?: Date | string | null
  }

  export type AnonymousSharingRequestCreateOrConnectWithoutFileInput = {
    where: AnonymousSharingRequestWhereUniqueInput
    create: XOR<AnonymousSharingRequestCreateWithoutFileInput, AnonymousSharingRequestUncheckedCreateWithoutFileInput>
  }

  export type AnonymousSharingRequestCreateManyFileInputEnvelope = {
    data: AnonymousSharingRequestCreateManyFileInput | AnonymousSharingRequestCreateManyFileInput[]
  }

  export type UserCreateWithoutUploadedFilesInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    signatures?: SignatureCreateNestedManyWithoutSignerInput
  }

  export type UserUncheckedCreateWithoutUploadedFilesInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    signatures?: SignatureUncheckedCreateNestedManyWithoutSignerInput
  }

  export type UserCreateOrConnectWithoutUploadedFilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUploadedFilesInput, UserUncheckedCreateWithoutUploadedFilesInput>
  }

  export type FileChunkCreateWithoutFileInput = {
    id?: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt?: Date | string
    createdAt?: Date | string
  }

  export type FileChunkUncheckedCreateWithoutFileInput = {
    id?: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt?: Date | string
    createdAt?: Date | string
  }

  export type FileChunkCreateOrConnectWithoutFileInput = {
    where: FileChunkWhereUniqueInput
    create: XOR<FileChunkCreateWithoutFileInput, FileChunkUncheckedCreateWithoutFileInput>
  }

  export type FileChunkCreateManyFileInputEnvelope = {
    data: FileChunkCreateManyFileInput | FileChunkCreateManyFileInput[]
  }

  export type IntegrityAlertCreateWithoutFileInput = {
    id?: string
    chunkIndex: number
    expectedHash: string
    actualHash?: string | null
    reportedByPublicKeyHash: string
    reportedAt?: Date | string
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolution?: string | null
  }

  export type IntegrityAlertUncheckedCreateWithoutFileInput = {
    id?: string
    chunkIndex: number
    expectedHash: string
    actualHash?: string | null
    reportedByPublicKeyHash: string
    reportedAt?: Date | string
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolution?: string | null
  }

  export type IntegrityAlertCreateOrConnectWithoutFileInput = {
    where: IntegrityAlertWhereUniqueInput
    create: XOR<IntegrityAlertCreateWithoutFileInput, IntegrityAlertUncheckedCreateWithoutFileInput>
  }

  export type IntegrityAlertCreateManyFileInputEnvelope = {
    data: IntegrityAlertCreateManyFileInput | IntegrityAlertCreateManyFileInput[]
  }

  export type SignatureCreateWithoutFileInput = {
    id?: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    signer: UserCreateNestedOneWithoutSignaturesInput
  }

  export type SignatureUncheckedCreateWithoutFileInput = {
    id?: string
    signerId: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignatureCreateOrConnectWithoutFileInput = {
    where: SignatureWhereUniqueInput
    create: XOR<SignatureCreateWithoutFileInput, SignatureUncheckedCreateWithoutFileInput>
  }

  export type SignatureCreateManyFileInputEnvelope = {
    data: SignatureCreateManyFileInput | SignatureCreateManyFileInput[]
  }

  export type ValidationTokenCreateWithoutFileInput = {
    id?: string
    tokenId: string
    fileMetadataHash: string
    userPublicKeyHash: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    adjudicatorPublicKey: string
    createdAt?: Date | string
  }

  export type ValidationTokenUncheckedCreateWithoutFileInput = {
    id?: string
    tokenId: string
    fileMetadataHash: string
    userPublicKeyHash: string
    issuedAt: Date | string
    expiresAt: Date | string
    signature: string
    adjudicatorPublicKey: string
    createdAt?: Date | string
  }

  export type ValidationTokenCreateOrConnectWithoutFileInput = {
    where: ValidationTokenWhereUniqueInput
    create: XOR<ValidationTokenCreateWithoutFileInput, ValidationTokenUncheckedCreateWithoutFileInput>
  }

  export type AnonymousFileAccessUpsertWithWhereUniqueWithoutFileInput = {
    where: AnonymousFileAccessWhereUniqueInput
    update: XOR<AnonymousFileAccessUpdateWithoutFileInput, AnonymousFileAccessUncheckedUpdateWithoutFileInput>
    create: XOR<AnonymousFileAccessCreateWithoutFileInput, AnonymousFileAccessUncheckedCreateWithoutFileInput>
  }

  export type AnonymousFileAccessUpdateWithWhereUniqueWithoutFileInput = {
    where: AnonymousFileAccessWhereUniqueInput
    data: XOR<AnonymousFileAccessUpdateWithoutFileInput, AnonymousFileAccessUncheckedUpdateWithoutFileInput>
  }

  export type AnonymousFileAccessUpdateManyWithWhereWithoutFileInput = {
    where: AnonymousFileAccessScalarWhereInput
    data: XOR<AnonymousFileAccessUpdateManyMutationInput, AnonymousFileAccessUncheckedUpdateManyWithoutFileInput>
  }

  export type AnonymousFileAccessScalarWhereInput = {
    AND?: AnonymousFileAccessScalarWhereInput | AnonymousFileAccessScalarWhereInput[]
    OR?: AnonymousFileAccessScalarWhereInput[]
    NOT?: AnonymousFileAccessScalarWhereInput | AnonymousFileAccessScalarWhereInput[]
    id?: StringFilter<"AnonymousFileAccess"> | string
    accessorPublicKeyHash?: StringFilter<"AnonymousFileAccess"> | string
    fileId?: StringFilter<"AnonymousFileAccess"> | string
    grantedAt?: DateTimeFilter<"AnonymousFileAccess"> | Date | string
    expiresAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    lastAccessProof?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    lastAccessAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    accessCount?: IntFilter<"AnonymousFileAccess"> | number
    keyStatus?: StringFilter<"AnonymousFileAccess"> | string
    keyPackageFingerprint?: StringNullableFilter<"AnonymousFileAccess"> | string | null
    status?: StringFilter<"AnonymousFileAccess"> | string
    revokedAt?: DateTimeNullableFilter<"AnonymousFileAccess"> | Date | string | null
    lastOwnerProof?: StringNullableFilter<"AnonymousFileAccess"> | string | null
  }

  export type AnonymousRevocationUpsertWithWhereUniqueWithoutFileInput = {
    where: AnonymousRevocationWhereUniqueInput
    update: XOR<AnonymousRevocationUpdateWithoutFileInput, AnonymousRevocationUncheckedUpdateWithoutFileInput>
    create: XOR<AnonymousRevocationCreateWithoutFileInput, AnonymousRevocationUncheckedCreateWithoutFileInput>
  }

  export type AnonymousRevocationUpdateWithWhereUniqueWithoutFileInput = {
    where: AnonymousRevocationWhereUniqueInput
    data: XOR<AnonymousRevocationUpdateWithoutFileInput, AnonymousRevocationUncheckedUpdateWithoutFileInput>
  }

  export type AnonymousRevocationUpdateManyWithWhereWithoutFileInput = {
    where: AnonymousRevocationScalarWhereInput
    data: XOR<AnonymousRevocationUpdateManyMutationInput, AnonymousRevocationUncheckedUpdateManyWithoutFileInput>
  }

  export type AnonymousRevocationScalarWhereInput = {
    AND?: AnonymousRevocationScalarWhereInput | AnonymousRevocationScalarWhereInput[]
    OR?: AnonymousRevocationScalarWhereInput[]
    NOT?: AnonymousRevocationScalarWhereInput | AnonymousRevocationScalarWhereInput[]
    id?: StringFilter<"AnonymousRevocation"> | string
    fileId?: StringFilter<"AnonymousRevocation"> | string
    revokedPublicKeyHash?: StringNullableFilter<"AnonymousRevocation"> | string | null
    proofR?: StringFilter<"AnonymousRevocation"> | string
    proofS?: StringFilter<"AnonymousRevocation"> | string
    proofMessage?: StringFilter<"AnonymousRevocation"> | string
    proofTimestamp?: DateTimeFilter<"AnonymousRevocation"> | Date | string
    ringSignature?: StringNullableFilter<"AnonymousRevocation"> | string | null
    ringPublicKeys?: StringNullableFilter<"AnonymousRevocation"> | string | null
    chunksReencrypted?: StringFilter<"AnonymousRevocation"> | string
    revocationStrategy?: StringNullableFilter<"AnonymousRevocation"> | string | null
    createdAt?: DateTimeFilter<"AnonymousRevocation"> | Date | string
    executedBySystem?: BoolFilter<"AnonymousRevocation"> | boolean
  }

  export type AnonymousSharingRequestUpsertWithWhereUniqueWithoutFileInput = {
    where: AnonymousSharingRequestWhereUniqueInput
    update: XOR<AnonymousSharingRequestUpdateWithoutFileInput, AnonymousSharingRequestUncheckedUpdateWithoutFileInput>
    create: XOR<AnonymousSharingRequestCreateWithoutFileInput, AnonymousSharingRequestUncheckedCreateWithoutFileInput>
  }

  export type AnonymousSharingRequestUpdateWithWhereUniqueWithoutFileInput = {
    where: AnonymousSharingRequestWhereUniqueInput
    data: XOR<AnonymousSharingRequestUpdateWithoutFileInput, AnonymousSharingRequestUncheckedUpdateWithoutFileInput>
  }

  export type AnonymousSharingRequestUpdateManyWithWhereWithoutFileInput = {
    where: AnonymousSharingRequestScalarWhereInput
    data: XOR<AnonymousSharingRequestUpdateManyMutationInput, AnonymousSharingRequestUncheckedUpdateManyWithoutFileInput>
  }

  export type AnonymousSharingRequestScalarWhereInput = {
    AND?: AnonymousSharingRequestScalarWhereInput | AnonymousSharingRequestScalarWhereInput[]
    OR?: AnonymousSharingRequestScalarWhereInput[]
    NOT?: AnonymousSharingRequestScalarWhereInput | AnonymousSharingRequestScalarWhereInput[]
    id?: StringFilter<"AnonymousSharingRequest"> | string
    fileId?: StringFilter<"AnonymousSharingRequest"> | string
    sharerPublicKeyHash?: StringFilter<"AnonymousSharingRequest"> | string
    recipientPublicKeyHash?: StringFilter<"AnonymousSharingRequest"> | string
    ownershipProof?: StringFilter<"AnonymousSharingRequest"> | string
    ringSignature?: StringFilter<"AnonymousSharingRequest"> | string
    keyPackageFingerprint?: StringNullableFilter<"AnonymousSharingRequest"> | string | null
    status?: StringFilter<"AnonymousSharingRequest"> | string
    requestedAt?: DateTimeFilter<"AnonymousSharingRequest"> | Date | string
    respondedAt?: DateTimeNullableFilter<"AnonymousSharingRequest"> | Date | string | null
  }

  export type UserUpsertWithoutUploadedFilesInput = {
    update: XOR<UserUpdateWithoutUploadedFilesInput, UserUncheckedUpdateWithoutUploadedFilesInput>
    create: XOR<UserCreateWithoutUploadedFilesInput, UserUncheckedCreateWithoutUploadedFilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUploadedFilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUploadedFilesInput, UserUncheckedUpdateWithoutUploadedFilesInput>
  }

  export type UserUpdateWithoutUploadedFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signatures?: SignatureUpdateManyWithoutSignerNestedInput
  }

  export type UserUncheckedUpdateWithoutUploadedFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signatures?: SignatureUncheckedUpdateManyWithoutSignerNestedInput
  }

  export type FileChunkUpsertWithWhereUniqueWithoutFileInput = {
    where: FileChunkWhereUniqueInput
    update: XOR<FileChunkUpdateWithoutFileInput, FileChunkUncheckedUpdateWithoutFileInput>
    create: XOR<FileChunkCreateWithoutFileInput, FileChunkUncheckedCreateWithoutFileInput>
  }

  export type FileChunkUpdateWithWhereUniqueWithoutFileInput = {
    where: FileChunkWhereUniqueInput
    data: XOR<FileChunkUpdateWithoutFileInput, FileChunkUncheckedUpdateWithoutFileInput>
  }

  export type FileChunkUpdateManyWithWhereWithoutFileInput = {
    where: FileChunkScalarWhereInput
    data: XOR<FileChunkUpdateManyMutationInput, FileChunkUncheckedUpdateManyWithoutFileInput>
  }

  export type FileChunkScalarWhereInput = {
    AND?: FileChunkScalarWhereInput | FileChunkScalarWhereInput[]
    OR?: FileChunkScalarWhereInput[]
    NOT?: FileChunkScalarWhereInput | FileChunkScalarWhereInput[]
    id?: StringFilter<"FileChunk"> | string
    fileId?: StringFilter<"FileChunk"> | string
    chunkIndex?: IntFilter<"FileChunk"> | number
    chunkHash?: StringFilter<"FileChunk"> | string
    ipfsCid?: StringFilter<"FileChunk"> | string
    size?: IntFilter<"FileChunk"> | number
    encryptedAt?: DateTimeFilter<"FileChunk"> | Date | string
    createdAt?: DateTimeFilter<"FileChunk"> | Date | string
  }

  export type IntegrityAlertUpsertWithWhereUniqueWithoutFileInput = {
    where: IntegrityAlertWhereUniqueInput
    update: XOR<IntegrityAlertUpdateWithoutFileInput, IntegrityAlertUncheckedUpdateWithoutFileInput>
    create: XOR<IntegrityAlertCreateWithoutFileInput, IntegrityAlertUncheckedCreateWithoutFileInput>
  }

  export type IntegrityAlertUpdateWithWhereUniqueWithoutFileInput = {
    where: IntegrityAlertWhereUniqueInput
    data: XOR<IntegrityAlertUpdateWithoutFileInput, IntegrityAlertUncheckedUpdateWithoutFileInput>
  }

  export type IntegrityAlertUpdateManyWithWhereWithoutFileInput = {
    where: IntegrityAlertScalarWhereInput
    data: XOR<IntegrityAlertUpdateManyMutationInput, IntegrityAlertUncheckedUpdateManyWithoutFileInput>
  }

  export type IntegrityAlertScalarWhereInput = {
    AND?: IntegrityAlertScalarWhereInput | IntegrityAlertScalarWhereInput[]
    OR?: IntegrityAlertScalarWhereInput[]
    NOT?: IntegrityAlertScalarWhereInput | IntegrityAlertScalarWhereInput[]
    id?: StringFilter<"IntegrityAlert"> | string
    fileId?: StringFilter<"IntegrityAlert"> | string
    chunkIndex?: IntFilter<"IntegrityAlert"> | number
    expectedHash?: StringFilter<"IntegrityAlert"> | string
    actualHash?: StringNullableFilter<"IntegrityAlert"> | string | null
    reportedByPublicKeyHash?: StringFilter<"IntegrityAlert"> | string
    reportedAt?: DateTimeFilter<"IntegrityAlert"> | Date | string
    resolved?: BoolFilter<"IntegrityAlert"> | boolean
    resolvedAt?: DateTimeNullableFilter<"IntegrityAlert"> | Date | string | null
    resolution?: StringNullableFilter<"IntegrityAlert"> | string | null
  }

  export type SignatureUpsertWithWhereUniqueWithoutFileInput = {
    where: SignatureWhereUniqueInput
    update: XOR<SignatureUpdateWithoutFileInput, SignatureUncheckedUpdateWithoutFileInput>
    create: XOR<SignatureCreateWithoutFileInput, SignatureUncheckedCreateWithoutFileInput>
  }

  export type SignatureUpdateWithWhereUniqueWithoutFileInput = {
    where: SignatureWhereUniqueInput
    data: XOR<SignatureUpdateWithoutFileInput, SignatureUncheckedUpdateWithoutFileInput>
  }

  export type SignatureUpdateManyWithWhereWithoutFileInput = {
    where: SignatureScalarWhereInput
    data: XOR<SignatureUpdateManyMutationInput, SignatureUncheckedUpdateManyWithoutFileInput>
  }

  export type ValidationTokenUpsertWithoutFileInput = {
    update: XOR<ValidationTokenUpdateWithoutFileInput, ValidationTokenUncheckedUpdateWithoutFileInput>
    create: XOR<ValidationTokenCreateWithoutFileInput, ValidationTokenUncheckedCreateWithoutFileInput>
    where?: ValidationTokenWhereInput
  }

  export type ValidationTokenUpdateToOneWithWhereWithoutFileInput = {
    where?: ValidationTokenWhereInput
    data: XOR<ValidationTokenUpdateWithoutFileInput, ValidationTokenUncheckedUpdateWithoutFileInput>
  }

  export type ValidationTokenUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    adjudicatorPublicKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidationTokenUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    fileMetadataHash?: StringFieldUpdateOperationsInput | string
    userPublicKeyHash?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    adjudicatorPublicKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateWithoutChunksInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutChunksInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutChunksInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutChunksInput, FileUncheckedCreateWithoutChunksInput>
  }

  export type FileUpsertWithoutChunksInput = {
    update: XOR<FileUpdateWithoutChunksInput, FileUncheckedUpdateWithoutChunksInput>
    create: XOR<FileCreateWithoutChunksInput, FileUncheckedCreateWithoutChunksInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutChunksInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutChunksInput, FileUncheckedUpdateWithoutChunksInput>
  }

  export type FileUpdateWithoutChunksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutChunksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileCreateWithoutRevocationsInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutRevocationsInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutRevocationsInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutRevocationsInput, FileUncheckedCreateWithoutRevocationsInput>
  }

  export type FileUpsertWithoutRevocationsInput = {
    update: XOR<FileUpdateWithoutRevocationsInput, FileUncheckedUpdateWithoutRevocationsInput>
    create: XOR<FileCreateWithoutRevocationsInput, FileUncheckedCreateWithoutRevocationsInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutRevocationsInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutRevocationsInput, FileUncheckedUpdateWithoutRevocationsInput>
  }

  export type FileUpdateWithoutRevocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutRevocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileCreateWithoutIntegrityAlertsInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutIntegrityAlertsInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutIntegrityAlertsInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutIntegrityAlertsInput, FileUncheckedCreateWithoutIntegrityAlertsInput>
  }

  export type FileUpsertWithoutIntegrityAlertsInput = {
    update: XOR<FileUpdateWithoutIntegrityAlertsInput, FileUncheckedUpdateWithoutIntegrityAlertsInput>
    create: XOR<FileCreateWithoutIntegrityAlertsInput, FileUncheckedCreateWithoutIntegrityAlertsInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutIntegrityAlertsInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutIntegrityAlertsInput, FileUncheckedUpdateWithoutIntegrityAlertsInput>
  }

  export type FileUpdateWithoutIntegrityAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutIntegrityAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileCreateWithoutAnonymousAccessInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutAnonymousAccessInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutAnonymousAccessInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutAnonymousAccessInput, FileUncheckedCreateWithoutAnonymousAccessInput>
  }

  export type FileUpsertWithoutAnonymousAccessInput = {
    update: XOR<FileUpdateWithoutAnonymousAccessInput, FileUncheckedUpdateWithoutAnonymousAccessInput>
    create: XOR<FileCreateWithoutAnonymousAccessInput, FileUncheckedCreateWithoutAnonymousAccessInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutAnonymousAccessInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutAnonymousAccessInput, FileUncheckedUpdateWithoutAnonymousAccessInput>
  }

  export type FileUpdateWithoutAnonymousAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutAnonymousAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileCreateWithoutSharingRequestsInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutSharingRequestsInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutSharingRequestsInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutSharingRequestsInput, FileUncheckedCreateWithoutSharingRequestsInput>
  }

  export type FileUpsertWithoutSharingRequestsInput = {
    update: XOR<FileUpdateWithoutSharingRequestsInput, FileUncheckedUpdateWithoutSharingRequestsInput>
    create: XOR<FileCreateWithoutSharingRequestsInput, FileUncheckedCreateWithoutSharingRequestsInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutSharingRequestsInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutSharingRequestsInput, FileUncheckedUpdateWithoutSharingRequestsInput>
  }

  export type FileUpdateWithoutSharingRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutSharingRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type UserCreateWithoutSignaturesInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    uploadedFiles?: FileCreateNestedManyWithoutUploaderInput
  }

  export type UserUncheckedCreateWithoutSignaturesInput = {
    id?: string
    publicKey: string
    displayLabel?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    uploadedFiles?: FileUncheckedCreateNestedManyWithoutUploaderInput
  }

  export type UserCreateOrConnectWithoutSignaturesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSignaturesInput, UserUncheckedCreateWithoutSignaturesInput>
  }

  export type FileCreateWithoutSignaturesInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenCreateNestedOneWithoutFileInput
  }

  export type FileUncheckedCreateWithoutSignaturesInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    validationToken?: ValidationTokenUncheckedCreateNestedOneWithoutFileInput
  }

  export type FileCreateOrConnectWithoutSignaturesInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutSignaturesInput, FileUncheckedCreateWithoutSignaturesInput>
  }

  export type UserUpsertWithoutSignaturesInput = {
    update: XOR<UserUpdateWithoutSignaturesInput, UserUncheckedUpdateWithoutSignaturesInput>
    create: XOR<UserCreateWithoutSignaturesInput, UserUncheckedCreateWithoutSignaturesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSignaturesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSignaturesInput, UserUncheckedUpdateWithoutSignaturesInput>
  }

  export type UserUpdateWithoutSignaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploadedFiles?: FileUpdateManyWithoutUploaderNestedInput
  }

  export type UserUncheckedUpdateWithoutSignaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    displayLabel?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploadedFiles?: FileUncheckedUpdateManyWithoutUploaderNestedInput
  }

  export type FileUpsertWithoutSignaturesInput = {
    update: XOR<FileUpdateWithoutSignaturesInput, FileUncheckedUpdateWithoutSignaturesInput>
    create: XOR<FileCreateWithoutSignaturesInput, FileUncheckedCreateWithoutSignaturesInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutSignaturesInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutSignaturesInput, FileUncheckedUpdateWithoutSignaturesInput>
  }

  export type FileUpdateWithoutSignaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutSignaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileCreateWithoutValidationTokenInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestCreateNestedManyWithoutFileInput
    uploader?: UserCreateNestedOneWithoutUploadedFilesInput
    chunks?: FileChunkCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertCreateNestedManyWithoutFileInput
    signatures?: SignatureCreateNestedManyWithoutFileInput
  }

  export type FileUncheckedCreateWithoutValidationTokenInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderId?: string | null
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedCreateNestedManyWithoutFileInput
    revocations?: AnonymousRevocationUncheckedCreateNestedManyWithoutFileInput
    sharingRequests?: AnonymousSharingRequestUncheckedCreateNestedManyWithoutFileInput
    chunks?: FileChunkUncheckedCreateNestedManyWithoutFileInput
    integrityAlerts?: IntegrityAlertUncheckedCreateNestedManyWithoutFileInput
    signatures?: SignatureUncheckedCreateNestedManyWithoutFileInput
  }

  export type FileCreateOrConnectWithoutValidationTokenInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutValidationTokenInput, FileUncheckedCreateWithoutValidationTokenInput>
  }

  export type FileUpsertWithoutValidationTokenInput = {
    update: XOR<FileUpdateWithoutValidationTokenInput, FileUncheckedUpdateWithoutValidationTokenInput>
    create: XOR<FileCreateWithoutValidationTokenInput, FileUncheckedCreateWithoutValidationTokenInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutValidationTokenInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutValidationTokenInput, FileUncheckedUpdateWithoutValidationTokenInput>
  }

  export type FileUpdateWithoutValidationTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    uploader?: UserUpdateOneWithoutUploadedFilesNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutValidationTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderId?: NullableStringFieldUpdateOperationsInput | string | null
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
  }

  export type FileCreateManyUploaderInput = {
    id?: string
    fileName: string
    totalSize: number
    mimeType?: string | null
    chunkCount?: number
    metadata?: string | null
    metadataHash: string
    encryptedChunkKeys: string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    escrowedIdentity?: string | null
    ownershipPublicKey: string
    ownershipCreatedAt?: Date | string
    uploaderPublicKeyHash?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastRevocationId?: string | null
    lastRevocationAt?: Date | string | null
  }

  export type SignatureCreateManySignerInput = {
    id?: string
    fileId: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUpdateManyWithoutFileNestedInput
    signatures?: SignatureUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    anonymousAccess?: AnonymousFileAccessUncheckedUpdateManyWithoutFileNestedInput
    revocations?: AnonymousRevocationUncheckedUpdateManyWithoutFileNestedInput
    sharingRequests?: AnonymousSharingRequestUncheckedUpdateManyWithoutFileNestedInput
    chunks?: FileChunkUncheckedUpdateManyWithoutFileNestedInput
    integrityAlerts?: IntegrityAlertUncheckedUpdateManyWithoutFileNestedInput
    signatures?: SignatureUncheckedUpdateManyWithoutFileNestedInput
    validationToken?: ValidationTokenUncheckedUpdateOneWithoutFileNestedInput
  }

  export type FileUncheckedUpdateManyWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    totalSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    metadataHash?: StringFieldUpdateOperationsInput | string
    encryptedChunkKeys?: StringFieldUpdateOperationsInput | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    escrowedIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    ownershipPublicKey?: StringFieldUpdateOperationsInput | string
    ownershipCreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRevocationId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRevocationAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SignatureUpdateWithoutSignerInput = {
    id?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: FileUpdateOneRequiredWithoutSignaturesNestedInput
  }

  export type SignatureUncheckedUpdateWithoutSignerInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignatureUncheckedUpdateManyWithoutSignerInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnonymousFileAccessCreateManyFileInput = {
    id?: string
    accessorPublicKeyHash: string
    grantedAt?: Date | string
    expiresAt?: Date | string | null
    lastAccessProof?: string | null
    lastAccessAt?: Date | string | null
    accessCount?: number
    keyStatus?: string
    keyPackageFingerprint?: string | null
    status?: string
    revokedAt?: Date | string | null
    lastOwnerProof?: string | null
  }

  export type AnonymousRevocationCreateManyFileInput = {
    id?: string
    revokedPublicKeyHash?: string | null
    proofR: string
    proofS: string
    proofMessage: string
    proofTimestamp: Date | string
    ringSignature?: string | null
    ringPublicKeys?: string | null
    chunksReencrypted: string
    revocationStrategy?: string | null
    createdAt?: Date | string
    executedBySystem?: boolean
  }

  export type AnonymousSharingRequestCreateManyFileInput = {
    id?: string
    sharerPublicKeyHash: string
    recipientPublicKeyHash: string
    ownershipProof: string
    ringSignature: string
    keyPackageFingerprint?: string | null
    status?: string
    requestedAt?: Date | string
    respondedAt?: Date | string | null
  }

  export type FileChunkCreateManyFileInput = {
    id?: string
    chunkIndex: number
    chunkHash: string
    ipfsCid: string
    size: number
    encryptedAt?: Date | string
    createdAt?: Date | string
  }

  export type IntegrityAlertCreateManyFileInput = {
    id?: string
    chunkIndex: number
    expectedHash: string
    actualHash?: string | null
    reportedByPublicKeyHash: string
    reportedAt?: Date | string
    resolved?: boolean
    resolvedAt?: Date | string | null
    resolution?: string | null
  }

  export type SignatureCreateManyFileInput = {
    id?: string
    signerId: string
    ringUserIds: string
    signature: string
    isOpened?: boolean
    openingProof?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnonymousFileAccessUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousFileAccessUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousFileAccessUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessorPublicKeyHash?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAccessProof?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessCount?: IntFieldUpdateOperationsInput | number
    keyStatus?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastOwnerProof?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnonymousRevocationUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnonymousRevocationUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnonymousRevocationUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    revokedPublicKeyHash?: NullableStringFieldUpdateOperationsInput | string | null
    proofR?: StringFieldUpdateOperationsInput | string
    proofS?: StringFieldUpdateOperationsInput | string
    proofMessage?: StringFieldUpdateOperationsInput | string
    proofTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ringSignature?: NullableStringFieldUpdateOperationsInput | string | null
    ringPublicKeys?: NullableStringFieldUpdateOperationsInput | string | null
    chunksReencrypted?: StringFieldUpdateOperationsInput | string
    revocationStrategy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedBySystem?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnonymousSharingRequestUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnonymousSharingRequestUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnonymousSharingRequestUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharerPublicKeyHash?: StringFieldUpdateOperationsInput | string
    recipientPublicKeyHash?: StringFieldUpdateOperationsInput | string
    ownershipProof?: StringFieldUpdateOperationsInput | string
    ringSignature?: StringFieldUpdateOperationsInput | string
    keyPackageFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FileChunkUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileChunkUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileChunkUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    chunkHash?: StringFieldUpdateOperationsInput | string
    ipfsCid?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    encryptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrityAlertUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrityAlertUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrityAlertUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    expectedHash?: StringFieldUpdateOperationsInput | string
    actualHash?: NullableStringFieldUpdateOperationsInput | string | null
    reportedByPublicKeyHash?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SignatureUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signer?: UserUpdateOneRequiredWithoutSignaturesNestedInput
  }

  export type SignatureUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    signerId?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignatureUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    signerId?: StringFieldUpdateOperationsInput | string
    ringUserIds?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    isOpened?: BoolFieldUpdateOperationsInput | boolean
    openingProof?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileCountOutputTypeDefaultArgs instead
     */
    export type FileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileDefaultArgs instead
     */
    export type FileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileChunkDefaultArgs instead
     */
    export type FileChunkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileChunkDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnonymousRevocationDefaultArgs instead
     */
    export type AnonymousRevocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnonymousRevocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IntegrityAlertDefaultArgs instead
     */
    export type IntegrityAlertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IntegrityAlertDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnonymousFileAccessDefaultArgs instead
     */
    export type AnonymousFileAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnonymousFileAccessDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnonymousAuditLogDefaultArgs instead
     */
    export type AnonymousAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnonymousAuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnonymousSharingRequestDefaultArgs instead
     */
    export type AnonymousSharingRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnonymousSharingRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SignatureDefaultArgs instead
     */
    export type SignatureArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SignatureDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ValidationTokenDefaultArgs instead
     */
    export type ValidationTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ValidationTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvestigationAuditDefaultArgs instead
     */
    export type InvestigationAuditArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvestigationAuditDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ValidationNonceDefaultArgs instead
     */
    export type ValidationNonceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ValidationNonceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ValidationTokenAuditDefaultArgs instead
     */
    export type ValidationTokenAuditArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ValidationTokenAuditDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BannedUserDefaultArgs instead
     */
    export type BannedUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BannedUserDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}