/**
 * Transformer input, one of:
 *
 * - T (primitive type)
 * - Iterable<T>
 *
 * @template T
 * Primitive type.
 */
type TransformerInput<T extends string | number | bigint | boolean = number | bigint> =
    T | Iterable<T>;

/**
 * Transformer output, based on transformer input:
 *
 * - If type T is primitive type, result is type U.
 * - If type T is Iterable type, result is type IterableIterator<U>.
 *
 * @template T
 * Transformer input type.
 *
 * @template U
 * Output base type.
 */
type TransformerOutput<T extends TransformerInput<string | number | bigint | boolean>, U> =
    T extends (T extends TransformerInput<infer V> ? V : never) ? U : IterableIterator<U>;

function doMagic<T extends TransformerInput<number>>(input: T): TransformerOutput<T, string> {
    // Here, T is unknown, which means that the result type is unknown.
    // Should be resolved when https://github.com/microsoft/TypeScript/pull/56941 is released.
    let result: TransformerOutput<T, string>;

    if (typeof input === "number") {
        // Here, T is known to be of type number, which means that the result type is string.
        // TS2322: Type 'string' is not assignable to type 'TransformerOutput<T, string>'.
        result = String(input);
    } else {
        // Here, T is known to be of type Iterable<number>, which means that the result type is IterableIterator<string>.
        // TS2322: Type 'IteratorObject<string, undefined, unknown>' is not assignable to type 'TransformerOutput<T, string>'.
        result = Iterator.from(input).map(n => String(n));
    }

    return result;
}

const numberResult = doMagic(0);

// Output is:
// string {} 0
console.log(typeof numberResult, Object.getPrototypeOf(numberResult), numberResult);

const iterableResult = doMagic([1, 2, 3, 4, 5]);

// Output is:
// object Object [Iterator Helper] {} [ '1', '2', '3', '4', '5' ]
console.log(typeof iterableResult, Object.getPrototypeOf(iterableResult), Array.from(iterableResult));
