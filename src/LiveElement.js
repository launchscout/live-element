import { html, css, LitElement } from 'lit';
import { LiveSocket } from 'phoenix_live_view';
import { Socket } from 'phoenix';
import ElementView from './ElementView';

let serializeForm = (form, meta = {}) => {
  let formData = new FormData(form)
  let toRemove = []

  formData.forEach((val, key, _index) => {
    if (val instanceof File) { toRemove.push(key) }
  })

  // Cleanup after building fileData
  toRemove.forEach(key => formData.delete(key))

  let params = new URLSearchParams()
  for (let [key, val] of formData.entries()) { params.append(key, val) }
  for (let metaKey in meta) { params.append(metaKey, meta[metaKey]) }

  return params.toString()
}

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
      module: { type: String},
      url: {type: String}
    };
  }

  connectedCallback() {
    super.connectedCallback();
    //
    // view.setHref(this.liveSocket.getHref())
    // view.join()
    this.liveSocket = new LiveSocket(this.url, Socket, {})
    this.liveSocket.enableDebug();
    this.liveSocket.socket.connect();
    this.view = new ElementView(this, this.liveSocket, null, null);
    this.liveSocket.roots[this.view.id] = this.view;
    this.view.channel = this.liveSocket.channel(`lve:${this.id}`, () => {
      return {
        params: {module: this.module},
        session: {}
      }
    })
    this.view.setHref(this.liveSocket.getHref())
    this.view.join();
  }

  constructor() {
    super();

    // this.addEventListener('submit', (event) => {
    //   console.log(event);
    //   event.preventDefault();
    //   let phxEvent = event.target.getAttribute("phx-submit")
    //   if (!phxEvent) { return }
    //   event.preventDefault()
    //   event.target.disabled = true;
    //   this.view.submitForm(event.target, this, phxEvent);
    // }, true);
  }

  firstUpdated() {
    this.renderRoot.addEventListener("click", (event) => {
      console.log(event);
      const { target } = event;
      let phxEvent = target && target.getAttribute("phx-click")
      if (!phxEvent) { return }
      this.view.pushEvent("click", this, this, phxEvent, {});
    }, true);
    this.renderRoot.addEventListener("submit", (event) => {
      console.log(event);
      const { target } = event;
      event.preventDefault();
      let phxEvent = event.target.getAttribute("phx-submit")
      if (!phxEvent) { return }
      // event.target.disabled = true;
      this.view.submitForm(event.target, this.renderRoot, phxEvent);
    }, true);
  }
  viewUpdated() {
    console.log('view updated');
    // Array.from(this.renderRoot.querySelectorAll("form")).forEach((form) => form.addEventListener('submit', (event) => {
    //   console.log(event);
    //   event.preventDefault();
    //   let phxEvent = event.target.getAttribute("phx-submit")
    //   if (!phxEvent) { return }
    //   // event.target.disabled = true;
    //   this.view.submitForm(form, this.renderRoot, phxEvent);
    // }));
  }
  __increment() {
    this.counter += 1;
  }

  // createRenderRoot() {return this;}
}
