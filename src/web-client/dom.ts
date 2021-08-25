import sanitize from "sanitize-html";

class DomManipulations {
  static appendTo = (target: HTMLElement, element: HTMLElement) => {
    target.appendChild(element);
  }

  static innerHtml = (target: HTMLElement, element?: HTMLElement | HTMLElement[]) => {
    while (target.firstChild) {
      target.removeChild(target.lastChild);
    }

    if (Array.isArray(element)) {
      element.forEach((e) => DomManipulations.appendTo(target, e));
    } else if (element) {
      DomManipulations.appendTo(target, element);
    }
  }

  static parseFromString = (text: string) => Array.from(new DOMParser().parseFromString(text, 'text/html').body.children)
}

export class ChannelsList extends DomManipulations {
  private _active = '';

  private _channels: string[] = [];

  private _channelsNodes: { [name: string]: HTMLElement } = {};

  private dom: HTMLElement;

  constructor(target: HTMLElement) {
    super();
    this.dom = target;
  }

  get active() {
    return this._active;
  }

  set active(value: string) {
    this._active = value;
    this.updateActiveItem();
  }

  updateActiveItem = () => {
    Object.values(this._channelsNodes).forEach(chNode => {
      chNode.dataset.active = ''
    });

    this._channelsNodes[this._active].dataset.active = 'true';
  }

  get channels() {
    return this._channels;
  }

  set channels(value: string[]) {
    this._channels = value;

    if (value.length > 0) {
      this.setList();
    } else {
      this.clearList();
    }
  }

  getListDom = () => {
    return this.channels.map(ch => {
      const node = ChannelsList.parseFromString(ChannelsList.getListItemTemplate(ch))
      console.log(node);

      this._channelsNodes[ch] = <HTMLScriptElement>node[0];

      return <HTMLScriptElement>node[0];
    });
  }

  setList = () => ChannelsList.innerHtml(this.dom, this.getListDom())

  clearList = () => {
    this._active = '';
    this._channelsNodes = {};
    ChannelsList.innerHtml(this.dom);
  }

  static getListItemTemplate = (name: string) => `<li class="channels-list-item">${name}</li>`;
}
