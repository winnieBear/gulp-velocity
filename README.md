gulp-velocity
=============

A gulp plugin for rendering velocity template, based on the node module velocity.

[node velocity](https://github.com/fool2fish/velocity)

[Bug and suggestion](https://github.com/winnieBear/gulp-velocity/issues/new)

---

## 0. introduce

This plugin is written based on the node module [velocity](https://github.com/fool2fish/velocity), it's core function is done by the "velocity" module, this plugin is just a wrapper of it. 


## 1. Installment

```
$ npm install gulp-velocity
or
$ git clone https://github.com/winnieBear/gulp-velocity.git 

```

## 2. Quick Start

An example is ready for you:

```
$ git clone https://github.com/winnieBear/gulp-velocity.git 
$ cd gulp-velocity/example/
$ npm install
$ gulp tpl

```

### the introduce of dir

```
src
|-- tpl  
|   |-- direc
|   |   |-- define.vm
|   |   `-- ... 
|   |
|   `-- index.vm 
|-- data
|   |-- direc
|   |   |-- define.js
|   |    `-- ... 
|   |   
|   `-- index.js 
`-- tmp
		|
 		`-- index.html

```
- tpl directory to store the template file

- data directory to store the simulating data, one data file is corresponding to a template file, the data file format look like literal object in javascript.

- tmp directory to store the rendered result file, which is rendered based on the template file and the corresponding simulating data file.

## 3. Config
```
var velocity = require('gulp-velocity');

var config ={
		"root":"./src/tpl/",// tpl root path 
		"encoding":"utf-8", // tpl encoding format
		"macro":"./src/tpl/global-macro/macro.vm", //global macro defined file, more macro file can saved in array, e.g. ["macro_file_1","macro_file_2",...]
		"globalMacroPath":"./src/tpl/global-macro", //global macro defined root path
		"dataPath":"./src/data/" // simulating data root path
	}
```
you can use it as below:
```
...
	.pipe(
		velocity(config)
		.on('error', gutil.log)
	)
...


```


## 4. Special instructions

### why use gulp-plumber
The plugin of gulp-plumber is used in my example for the usage scenario in which your template file has a syntax error and gulp-velocity will throw an error, which will break the gulp event stream, some discussions is [here](https://github.com/gulpjs/gulp/issues/75). To continue the stream when error happens, you can use the plugin of [gulp-plumber](https://www.npmjs.org/package/gulp-plumber).

### why the dependency package of "velocity" is a url, not a version number
because the node velocity is keep updating all the times, the latest verison is 0.3.0, which has bug in it, the fixed version is still not update to npm install package, but the code of dependency url in package.json has fixed the bug.

