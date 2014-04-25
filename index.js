var es = require('event-stream');
var vEngine = require('velocity').Engine;
var colors = require('chalk');
var Buffer = require('buffer').Buffer;
var path = require('path');
var fs = require('fs');
var util = require('util');

// Consts
const PLUGIN_NAME = 'gulp-velocity';


function getContext(opt){
  var filePath = opt.filePath,
    tplRoot = util.isArray(opt.root) ? opt.root[0] : opt.root, 
    tplDirName = path.dirname(filePath),
    tplFileName = path.basename(filePath,'.vm'),
    tplRootAbsPath = path.resolve(tplRoot),
    tplRelativePath = tplDirName.replace(tplRootAbsPath,''),
    datafilePath = opt.dataPath +  tplRelativePath + path.sep + tplFileName + '.js',
    datafileAbsPath = path.resolve(datafilePath);

  if(!fs.existsSync(datafileAbsPath)){
    throw new Error(PLUGIN_NAME + ": the corresponding data file [" + datafileAbsPath + "] is not exists!");
  }
  
  return datafileAbsPath;
}

//backup opt
var backOption = null;
var globalMacroPath = '';

module.exports = function(opt){
  if(backOption === null){
    backOption = opt;
    globalMacroPath = path.resolve(opt.globalMacroPath);
  }
  function renderTpl(file){
    console.log("[gulp-velocity] render tpl ",colors.magenta(file.path));
    
    //clone opt,because velocity may modify opt
    var opt = {};
    for(var p in backOption){
      if(backOption.hasOwnProperty(p)){
        opt[p] = backOption[p];
      }
    }
    
    //if file in global macro dir, jump it
    if(file.path.indexOf(globalMacroPath) === 0 ){
      console.log("[gulp-velocity] info: ",colors.yellow(file.path + ' is a global macro,jump it!!'));
      return this.emit('end');
    }

    if(file.isNull()){
      return this.emit('data', file); // pass along
    }
    if(file.isStream()){
      return this.emit('error',new Error(PLUGIN_NAME + ": Streaming not supported"));
    }

    if (file.isBuffer()) {
      opt.filePath = file.path;
      opt.template = String(file.contents);
      try{
        var context = getContext(opt);
      }catch(err){
        return this.emit('error',err)
      }
     
      try{
        var renderResult = new vEngine(opt).render(context);
      }catch(err){
        console.log("[gulp-velocity]",colors.red('Error:'),colors.yellow(err.stack));
        return this.emit('error',err)
      }
      file.contents = new Buffer(renderResult);
      this.emit('data', file);
    }
  }

  return es.through(renderTpl);
}


