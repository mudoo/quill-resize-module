# Quill Resize Module

A module for Quill rich text editor to allow images/iframe/video and custom elements(convert to placeholder) to be resized.

This module is original forked from <https://github.com/whatcould/quill-image-resize-module>.

## Features
 - Image resize.
 - Embed placeholder resize (Default to convert iframe/video tag).
 - Custom any elements resize.

 - Limit minWidth/maxWidth/minHeight/maxHeight.
 - Limit Width/Height ratio.
 - Selected placeholder style.
 - Direction key support.

## Demo

<https://run.plnkr.co/plunks/9YXbATSKGHY0JvPv/>
![demo](./demo/demo.png)

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

**use placeholder for iframe/video**

```javascript
import Quill from 'quill';
import QuillResize, { PlaceholderRegister } from 'quill-resize-module';

Quill.register('modules/resize', QuillResize);
// default to iframe/video tag
// if you went to replace default video blot, see 'demo/script.js'
PlaceholderRegister();

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

**use placeholder for custom element**

```javascript
import Quill from 'quill';
import QuillResize, { PlaceholderRegister, EmbedPlaceholder } from 'quill-resize-module';

Quill.register('modules/resize', QuillResize);

class TagPlaceholder extends EmbedPlaceholder { }
// default to ['iframe', 'video']
TagPlaceholder.tagName = ['iframe', 'video', 'embed']
// Important!!! must be null or don't set it
// TagPlaceholder.className = null

// if you went to replace default video blot, see 'demo/script.js'

class ClassPlaceholder extends EmbedPlaceholder { }
ClassPlaceholder.className = '.ql-embed'

PlaceholderRegister([TagPlaceholder, ClassPlaceholder])

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
**use placeholder for iframe/video**

```javascript
// if you went to replace default video blot, see 'demo/script.js'
QuillResize.PlaceholderRegister()
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

Each module is described below.

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
            },
            styles: {
                handle: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: white
                    // other camelCase styles for size display
                }
            }
        }
    }
});
```

#### `DisplaySize` - Display pixel size

Shows the size of the image in pixels near the bottom right of the image.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            // ...
            styles: {
                display: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: white
                    // other camelCase styles for size display
                }
            }
        }
    }
});
```

#### `Toolbar` - Image alignment tools

Displays a toolbar below the image, where the user can select an alignment for the image.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            styles: {
                // ...
                toolbar: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: white
                    // other camelCase styles for size display
                },
                toolbarButton: {
                    // ...
                },
                toolbarButtonSvg: {
                    // ...
                },
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
import { Resize, BaseModule } from 'quill-resize-module';

class MyModule extends BaseModule {
    // See src/modules/BaseModule.js for documentation on the various lifecycle callbacks
}

var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        resize: {
            modules: [ MyModule, Resize ],
            // ...
        }
    }
});
```
