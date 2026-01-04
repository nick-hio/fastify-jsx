import { describe, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';
import type { ReactNode } from "react";

const Heading = ({ text }: { text: string }) => <h1>{text}</h1>;

const Layout = ({ children }: { children: ReactNode }) => (
    <html lang="en">
        <head>
            <title>Test</title>
        </head>
        <body>{children}</body>
    </html>
);

const List = ({ items }: { items: string[] }) => (
    <ul>
        {items.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
    </ul>
);

describe('[fastifyJsx] Components', () => {
    it('should render component', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <Heading text="Welcome" />);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<h1>Welcome</h1>');
    });

    it('should render component with children', async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <Layout>
                <div>Page Content</div>
            </Layout>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<html lang="en"><head><title>Test</title></head><body><div>Page Content</div></body></html>');
    });

    it('should render component with array mapping', async () => {
        const fastify = buildServer();
        const items = ['Apple', 'Banana', 'Cherry'];

        fastify.get('/', () => <List items={items} />);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>');
    });

    it('should render component conditionally', async () => {
        const fastify = buildServer();

        const Conditional = ({ show }: { show: boolean }) => (
            <div>{show ? <span>Visible</span> : null}</div>
        );

        fastify.get('/visible', () => <Conditional show={true} />);
        fastify.get('/hidden', () => <Conditional show={false} />);

        const visibleRes = await fastify.inject({ method: 'GET', url: '/visible' });
        const hiddenRes = await fastify.inject({ method: 'GET', url: '/hidden' });

        expectResponse(visibleRes, '<div><span>Visible</span></div>');
        expectResponse(hiddenRes, '<div></div>');
    });

    it('should render nested components', async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <Layout>
                <Heading text="Home" />
                <List items={['One', 'Two']} />
            </Layout>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<html lang="en"><head><title>Test</title></head><body><h1>Home</h1><ul><li>One</li><li>Two</li></ul></body></html>');
    });
});
