import { describe, expect, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

const Heading = ({ text }: { text: string }) => <h1>{text}</h1>;

const Layout = ({ children }: { children: React.ReactNode }) => (
    <html>
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

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<h1>Welcome</h1>');
    });

    it('should render component with children', async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <Layout>
                <div>Page Content</div>
            </Layout>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('<body><div>Page Content</div></body>');
    });

    it('should render component with array mapping', async () => {
        const fastify = buildServer();
        const items = ['Apple', 'Banana', 'Cherry'];

        fastify.get('/', () => <List items={items} />);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>');
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

        expect(visibleRes.body).toBe('<div><span>Visible</span></div>');
        expect(hiddenRes.body).toBe('<div></div>');
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

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('<h1>Home</h1>');
        expect(res.body).toContain('<ul><li>One</li><li>Two</li></ul>');
    });
});

