/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCComponent} from '@material/base/component';
import {applyPassive} from '@material/dom/events';
import {matches} from '@material/dom/ponyfill';

import {MDCRippleAdapter} from './adapter';
import {MDCRippleFoundation} from './foundation';
import {MDCRippleAttachOpts, MDCRippleCapableSurface} from './types';
import * as util from './util';

/** MDC Ripple Factory */
export type MDCRippleFactory =
    (el: HTMLElement, foundation?: MDCRippleFoundation) => MDCRipple;

/** MDC Ripple */
export class MDCRipple extends MDCComponent<MDCRippleFoundation> implements
    MDCRippleCapableSurface {
  // TODO(b/157231863): remove these overloads when no clients are using them.
  static override attachTo(root: HTMLElement, opts?: MDCRippleAttachOpts):
      MDCRipple;
  /** @deprecated use attachTo(root: HTMLElement) */
  static override attachTo(root: Element, opts?: MDCRippleAttachOpts):
      MDCRipple;
  static override attachTo(
      root: HTMLElement|Element,
      opts: MDCRippleAttachOpts = {isUnbounded: undefined}): MDCRipple {
    const ripple = new MDCRipple(root as HTMLElement);
    // Only override unbounded behavior if option is explicitly specified
    if (opts.isUnbounded !== undefined) {
      ripple.unbounded = opts.isUnbounded;
    }
    return ripple;
  }

  static createAdapter(instance: MDCRippleCapableSurface): MDCRippleAdapter {
    return {
      addClass: (className) => {
        instance.root.classList.add(className);
      },
      browserSupportsCssVars: () => util.supportsCssVariables(window),
      computeBoundingRect: () => instance.root.getBoundingClientRect(),
      containsEventTarget: (target) => instance.root.contains(target as Node),
      deregisterDocumentInteractionHandler: (evtType, handler) => {
        document.documentElement.removeEventListener(
            evtType, handler, applyPassive());
      },
      deregisterInteractionHandler: (evtType, handler) => {
        instance.root.removeEventListener(evtType, handler, applyPassive());
      },
      deregisterResizeHandler: (handler) => {
        window.removeEventListener('resize', handler);
      },
      getWindowPageOffset: () =>
          ({x: window.pageXOffset, y: window.pageYOffset}),
      isSurfaceActive: () => matches(instance.root, ':active'),
      isSurfaceDisabled: () => Boolean(instance.disabled),
      isUnbounded: () => Boolean(instance.unbounded),
      registerDocumentInteractionHandler: (evtType, handler) => {
        document.documentElement.addEventListener(
            evtType, handler, applyPassive());
      },
      registerInteractionHandler: (evtType, handler) => {
        instance.root.addEventListener(evtType, handler, applyPassive());
      },
      registerResizeHandler: (handler) => {
        window.addEventListener('resize', handler);
      },
      removeClass: (className) => {
        instance.root.classList.remove(className);
      },
      updateCssVariable: (varName, value) => {
        instance.root.style.setProperty(varName, value);
      },
    };
  }

  disabled = false;

  private isUnbounded?: boolean;

  get unbounded(): boolean {
    return Boolean(this.isUnbounded);
  }

  set unbounded(unbounded: boolean) {
    this.isUnbounded = Boolean(unbounded);
    this.setUnbounded();
  }

  activate() {
    this.foundation.activate();
  }

  deactivate() {
    this.foundation.deactivate();
  }

  layout() {
    this.foundation.layout();
  }

  override getDefaultFoundation() {
    return new MDCRippleFoundation(MDCRipple.createAdapter(this));
  }

  override initialSyncWithDOM() {
    const root = this.root;
    this.isUnbounded = 'mdcRippleIsUnbounded' in root.dataset;
  }

  /**
   * Closure Compiler throws an access control error when directly accessing a
   * protected or private property inside a getter/setter, like unbounded above.
   * By accessing the protected property inside a method, we solve that problem.
   * That's why this function exists.
   */
  private setUnbounded() {
    this.foundation.setUnbounded(Boolean(this.isUnbounded));
  }
}
