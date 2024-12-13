# Quill Resize Module

A module for Quill rich text editor to allow images/iframe/video and custom elements to be resized.

This module is original forked from <https://github.com/whatcould/quill-image-resize-module>.

## Changed V2
1. Support Quill2
2. Removed formats/image formats/placeholder
3. Removed `options.styles`
4. Add `embedTags` option for custom embed element
4. Add `tools` option for custom toolbar

## Features
 - Image resize
 - Embed resize (Default to iframe/video tag)
 - Custom any elements resize

 - Limit minWidth/maxWidth/minHeight/maxHeight
 - Limit Width/Height ratio
 - Selected embed element style
 - Direction key support

## Demo

<https://codesandbox.io/p/sandbox/9m9vl8>
![demo](./demo/demo.jpg)

## Usage

### Webpack/ES6

```javascript
import Quill from 'quill';
import QuillResize from 'quill-resize-module';
Quill.register('modules/resize', QuillResize);

const quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            // See optional "config" below
        }
    }
});
```

### Script Tag

Copy resize.js into your web root or include from node_modules

```html
<script src="/node_modules/quill-resize-module/dist/resize.js"></script>
```

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            // See optional "config" below
        }
    }
});
```

### Config

For the default experience, pass an empty object, like so:
```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {}
    }
});
```

Functionality is broken down into modules, which can be mixed and matched as you like. For example,
the default is to include all modules:

```javascript
const quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
        }
    }
});
```

Customize the toolbar buttons with "tools" option.

For example, add handler for image alt attribute:

```javascript
const quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            tools: [
              'left', 'right',
              {
                text: 'Alt',
                verify (activeEle) {
                    return (activeEle && activeEle.tagName === 'IMG')
                },
                handler (evt, button, activeEle) {
                    let alt = activeEle.alt || ''
                    alt = window.prompt('Alt for image', alt)
                    if (alt == null) return
                    activeEle.setAttribute('alt', alt)
                }
              }
            ]
        }
    }
});
```

#### `Resize` - Resize the element

Adds handles to the element's corners which can be dragged with the mouse to resize the element.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            // ...
            // set parchment key to enable resize module
            parchment: {
                image: {
                    attribute: ['width'],  // ['width', 'height']
                    limit: {
                        minWidth: 200,
                        maxWidth: 600,
                        minHeight: 200,
                        maxHeight: 450,
                        ratio: .5625  // keep width/height ratio. (ratio=height/width)
                    }
                }
            }
        }
    }
});
```

#### `BaseModule` - Include your own custom module

You can write your own module by extending the `BaseModule` class, and then including it in
the module setup.

For example,

```javascript
import QuillResize from 'quill-resize-module';
Quill.register('modules/resize', QuillResize);

class MyModule extends QuillResize.Modules.Base {
    // See src/modules/BaseModule.js for documentation on the various lifecycle callbacks
}

var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            modules: [ MyModule, QuillResize.Modules.Resize ],
            // ...
        }
    }
});
```
