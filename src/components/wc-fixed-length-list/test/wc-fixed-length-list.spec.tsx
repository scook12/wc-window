import { newSpecPage } from '@stencil/core/testing';
import { WcFixedLengthList } from '../wc-fixed-length-list';

describe('wc-fixed-length-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [WcFixedLengthList],
      html: `<wc-fixed-length-list></wc-fixed-length-list>`,
    });
    expect(page.root).toEqualHtml(`
      <wc-fixed-length-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </wc-fixed-length-list>
    `);
  });
});
