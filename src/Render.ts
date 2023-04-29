/*

The root of the tree is always the document. There are three document classes,
Document, HTMLDocument and SVGDocument.

The base class of all render tree nodes is RenderObject.

RenderObject.h

The RenderObject for a DOM node can be obtained using the renderer() method on
Node.

*/

export class RenderObject {
  // https://github.com/WebKit/WebKit/blob/69d4593edf21fe717d6f5355a5279bb1669bbf30/Source/WebCore/rendering/RenderObject.cpp#L215
  isBlockContainer(): boolean {
    return (
      [
        'block',
        'inline-block',
        'flow-root',
        'list-item',
        'table-cell',
        'table-caption',
      ].includes(this.style.display) && !this.isRenderReplaced()
    );
  }

  isRenderReplaced(): boolean {
    // Let's not think about this for now. Explained here, though:
    // https://webkit.org/blog/115/webcore-rendering-ii-blocks-and-inlines/
    return false;
  }

  // Default style:
  // https://github.com/WebKit/WebKit/blob/69d4593edf21fe717d6f5355a5279bb1669bbf30/Source/WebCore/rendering/style/RenderStyle.cpp#L156
  style = new CSSStyleDeclaration();
}
export class RenderBox extends RenderObject {}
export class RenderFlow extends RenderBox {}
export class RenderBlock extends RenderFlow {
  readonly inlines: RenderInline[] = [];
}
export class RenderInline extends RenderFlow {}

export class RenderRoot extends RenderObject {
  readonly blocks: RenderBlock[] = [];

  insertBefore<T extends RenderObject>(
    newNode: T,
    referenceNode: RenderObject | null
  ): T {
    if (!referenceNode) {
      // Effectively appendChild().
      if (newNode instanceof RenderBlock) {
        this.blocks.push(newNode);
        return newNode;
      }

      if (newNode instanceof RenderInline) {
        let lastBlock = this.blocks[this.blocks.length - 1];
        if (!lastBlock) {
          lastBlock = new RenderBlock();
          this.blocks.push(lastBlock);
        }

        lastBlock.inlines.push(newNode);

        return newNode;
      }

      throw new Error('Unsupported display mode');
    }

    return newNode;
  }

  removeChild<T extends RenderObject>(child: T): T {
    if (child instanceof RenderBlock) {
      const index = this.blocks.indexOf(child);
      if (index === -1) {
        throw new Error('Child not found');
      }

      this.blocks.splice(index, 1);
      return child;
    }

    if (child instanceof RenderInline) {
      // May be in an anonymous block.
      for (const block of this.blocks) {
        const index = block.inlines.indexOf(child);
        if (index !== -1) {
          block.inlines.splice(index, 1);
          return child;
        }
      }

      throw new Error('Child not found');
    }

    throw new Error('Unsupported display mode');
  }
}

// Formerly:
// RenderBlock > RenderFlow > RenderBox > RenderObject
// RenderInline > RenderFlow > RenderBox > RenderObject
//
// Now:
// RenderBlock > RenderBox
// RenderInline > RenderBoxModelObject > RenderLayerModelObject
