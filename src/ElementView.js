import { View } from "phoenix_live_view";

class ElementView extends View {
  update(diff, events) {
    console.log(diff);
    super.update(diff, events);
    this.el.viewUpdated();
  }

  applyJoinPatch(live_patch, html, events) {
    super.applyJoinPatch(live_patch, html, events);
    this.el.viewUpdated();
  }
}

export default ElementView;
