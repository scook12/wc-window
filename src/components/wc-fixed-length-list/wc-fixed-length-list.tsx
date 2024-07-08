import { Component, Host, Prop, State, VNode, h } from '@stencil/core';
import testData from './test/testdata.json'

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
// list components?
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
  @Prop() itemHeight: number // = 50
  @Prop() windowHeight: number // = 400
  @Prop() renderItem: (props: IRenderItemProps) => VNode = DemoRenderFunc

  @State() scrollTop: number = 0

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
    const items = []
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


  private onScroll(e: any) {
    this.scrollTop = e.currentTarget.scrollTop
  }

  render() {
    return (
      <Host>
        <div id='container' style={{ overflowY: 'scroll', height: `${this.windowHeight}px` }} onScroll={(e) => this.onScroll(e)}>
          <div id='scroller' style={{ position: 'relative', height: `${this.innerHeight}px`}}>
            {this.itemsToRender}
          </div>
        </div>
      </Host>
    );
  }
}
