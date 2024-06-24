/**
 * @license
 * Copyright 2020 Google Inc.
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

/**
 * No-op tagged template literal. Used for syntax highlighting.
 */
export const html =
    (strings: TemplateStringsArray, ...keys: unknown[]): string => {
      let result = '';
      for (let index = 0; index < strings.length - 1; index++) {
        result += strings[index] + `${keys[index]}`;
      }
      result += strings[strings.length - 1];
      return result;
    };

/**
 * @return HTMLElement for given HTML content in string format.
 */
export function createFixture<T extends HTMLElement = HTMLElement>(
    content: string): T {
  const wrapper = document.createElement('div');
  // TODO(b/263899951): do not assign innerHTML
  wrapper.innerHTML = content;
  const el = wrapper.firstElementChild as T;
  wrapper.removeChild(el);
  return el;
}
