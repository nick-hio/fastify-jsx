import fp from "fastify-plugin";
import { isValidElement } from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";

/**
 * Options for the `fastify-jsx` plugin.
 */
export type FastifyJsxOptions = {
    /**
     * Chooses the JSX rendering method.
     * - `"static"`: Uses the `renderToStaticMarkup` function from `react-dom/server`. Outputs static HTML without React data attributes.
     * - `"string"`: Uses the `renderToString` function from `react-dom/server`. Outputs HTML with React data attributes for client-side hydration.
     *
     * Defaults to `"static"`.
     */
    render?: 'static' | 'string',
};

/**
 * Fastify plugin for sending JSX as HTML responses.
 */
export const fastifyJsx = fp<FastifyJsxOptions>((fastify, opts, done) => {
    if (!['string', 'static'].includes(opts.render ?? '')) {
        fastify.log.warn(`[fastify-jsx] Invalid Render Option: '${opts.render}'. Using the default 'static' option.`);
    }
    const renderFunction = opts.render === 'string' ? renderToString : renderToStaticMarkup;

    fastify.addHook('preSerialization', async (_req, res, payload) => {
        try {
            if (payload && typeof payload === 'object' && isValidElement(payload)) {
                res.type('text/html; charset=utf-8');
                return renderFunction(payload);
            }
            return payload;
        } catch (e) {
            fastify.log.error(`[fastify-jsx] preSerialization Error: ${JSON.stringify(e, null, 2)}`);
            return payload;
        }
    });

    fastify.addHook('onSend', async (_req, _res, payload) => {
        if (typeof payload === 'string' && payload.length >= 4 && payload.startsWith('"<') && payload.endsWith('>"')) {
            return payload.slice(1, -1).replaceAll('\\"', '"'); // Unescaping quotes from Fastify's serialization
        }
        return payload;
    });

    done();
});

export default fastifyJsx;
