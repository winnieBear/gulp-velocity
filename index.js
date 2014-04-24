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
    datafilePath = opt.dataPath +  tplRelativePath + path.sep + tplFileName + '.json',
    datafileAbsPath = path.resolve(datafilePath);

  if(!fs.existsSync(datafileAbsPath)){
    throw new Error(PLUGIN_NAME + ": the corresponding data file [" + datafileAbsPath + "] is not exists!");
  }
  var dataContent = fs.readFileSync(datafileAbsPath,{"encoding":"utf-8"});

  var data = {};
  try{
    data =  JSON.parse(dataContent);
  }catch(err){
    throw new Error(PLUGIN_NAME + ": the data file [" + datafileAbsPath + "] is not JSON format file!");
  }

  return data;
}

module.exports = function(opt){

  function renderTpl(file){
    console.log("[gulp-velocity] render tpl ",colors.magenta(file.path));

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


