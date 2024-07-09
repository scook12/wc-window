import { Component, Host, Prop, State, h } from '@stencil/core';
import testData from './test/testdata.json'
import { ChildType } from '@stencil/core/internal';

export interface IRenderItemProps {
  index: number;
  style: {
    position: string;
    top: string;
    width: string;
  }
}
// Monologue: This is a decent example of the kind of renderFunc we want to
// be receiving, but I think that means it may be too narrow. How does
// someone do this in VanillaJS easily? The signature may also be difficult
// for consumers to match up with in TS (VNode as the return type, specifically).
// Or maybe this is just a domain issue with creating broadly usable virtual
// list components? providing a renderFunc outside of a pre-compiled component
// module seems difficult even to test in e2e/spec tests, much less in a prod
// situation. 
const DemoRenderFunc = (props: IRenderItemProps) => {
  const { index, style } = props;
  const { name, gender, email, age } = testData[index]
  return (
    <div style={style}>
      <p>POI: {name}, {gender} - aged {age}. Contact: {email}</p>
    </div>
  )
}

@Component({
  tag: 'wc-fixed-length-list',
  styleUrl: 'wc-fixed-length-list.css',
  shadow: true,
})
export class WcFixedLengthList {
  @Prop() numItems: number
  @Prop() itemHeight: number
  @Prop() windowHeight: number
  @Prop() renderItem: (props: IRenderItemProps) => ChildType = DemoRenderFunc

  @State() scrollTop: number = 0

  private container?: HTMLDivElement

  private get innerHeight() {
    return this.numItems * this.itemHeight
  }

  private get startIndex() {
    return Math.floor(this.scrollTop / this.itemHeight)
  }

  private get endIndex() {
    return Math.min(
      this.numItems - 1, // don't render past the end of the list
      Math.floor((this.scrollTop + this.windowHeight) / this.itemHeight)
    );
  }

  private get itemsToRender() {
    const items: ChildType[] = []
    const { itemHeight, startIndex, endIndex, renderItem } = this
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(
        renderItem({ 
          index: i,
          style: { 
            position: 'absolute',
            top: `${i * itemHeight}px`,
            width: '100%',
          } 
        })
      )
    }
    return items
  }


  private onScroll(e: any, isWheelEvent: boolean = false) {
    this.scrollTop = e.currentTarget.scrollTop
    if (isWheelEvent) {
      e.preventDefault()
      this.container.scrollBy({
        top: e.deltaY,
        behavior: 'smooth',
      })
    }
  }

  render() {
    return (
      <Host>
        <div 
            id='container' 
            ref={el => this.container = el} 
            style={{ overflowY: 'scroll', height: `${this.windowHeight}px` }} 
            onScroll={(e) => this.onScroll(e)}
            onWheel={(e) => this.onScroll(e, true)}
          >
            <div 
              id='scroller' 
              style={{ position: 'relative', height: `${this.innerHeight}px`}}
            >
              {this.itemsToRender}
            </div>
        </div>
      </Host>
    );
  }
}
