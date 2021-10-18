import { html, css, LitElement } from 'lit';
import { LiveSocket } from 'phoenix_live_view';
import { Socket } from 'phoenix';

export class LiveElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--live-element-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    //
    // view.setHref(this.liveSocket.getHref())
    // view.join()
    this.liveSocket.socket.connect();
    this.view = this.liveSocket.newRootView(this);
    this.view.setHref(this.liveSocket.getHref())
    this.view.join();
  }

  constructor() {
    super();
    this.liveSocket = new LiveSocket("ws://localhost:4000/live", Socket, {})
    this.liveSocket.enableDebug();
    this.addEventListener("click", (event) => {
      const {target} = event;
      let phxEvent = target && target.getAttribute("phx-click")
      if (!phxEvent) { return }
      this.view.pushEvent("click", this, this, phxEvent, {});
    }, true);
  }

  __increment() {
    this.counter += 1;
  }

  createRenderRoot() {return this;}
}
