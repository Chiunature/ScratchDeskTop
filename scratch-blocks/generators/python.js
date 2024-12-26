/**
 * Visual Blocks Language
 *
 * Copyright 2021 openblock.cc.
 * https://github.com/openblockcc/openblock-blocks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

goog.provide('Blockly.Python');

goog.require('Blockly.Generator');


/**
 * Python code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Python = new Blockly.Generator('Python');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Python.addReservedWords(
  // import keyword
  // print ','.join(keyword.kwlist)
  // http://docs.python.org/reference/lexical_analysis.html#keywords
  'and,as,assert,break,class,continue,def,del,elif,else,except,exec,' +
  'finally,for,from,global,if,import,in,is,lambda,not,or,pass,print,raise,' +
  'return,try,while,with,yield,' +
  //http://docs.python.org/library/constants.html
  'True,False,None,NotImplemented,Ellipsis,__debug__,quit,exit,copyright,' +
  'license,credits,' +
  // http://docs.python.org/library/functions.html
  'abs,divmod,input,open,staticmethod,all,enumerate,int,ord,str,any,eval,' +
  'isinstance,pow,sum,basestring,execfile,issubclass,print,super,bin,file,' +
  'iter,property,tuple,bool,filter,len,range,type,bytearray,float,list,' +
  'raw_input,unichr,callable,format,locals,reduce,unicode,chr,frozenset,' +
  'long,reload,vars,classmethod,getattr,map,repr,xrange,cmp,globals,max,' +
  'reversed,zip,compile,hasattr,memoryview,round,__import__,complex,hash,' +
  'min,set,apply,delattr,help,next,setattr,buffer,dict,hex,object,slice,' +
  'coerce,dir,id,oct,sorted,intern,' +
  // Used by code generator
  'count'
);

/**
 * Order of operation ENUMs.
 */
Blockly.Python.ORDER_ATOMIC = 0;            // 0 "" ...
Blockly.Python.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
Blockly.Python.ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly.Python.ORDER_MEMBER = 2.1;          // . []
Blockly.Python.ORDER_FUNCTION_CALL = 2.2;   // ()
Blockly.Python.ORDER_EXPONENTIATION = 3;    // **
Blockly.Python.ORDER_UNARY_SIGN = 4;        // + -
Blockly.Python.ORDER_BITWISE_NOT = 4;       // ~
Blockly.Python.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.Python.ORDER_ADDITIVE = 6;          // + -
Blockly.Python.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.Python.ORDER_BITWISE_AND = 8;       // &
Blockly.Python.ORDER_BITWISE_XOR = 9;       // ^
Blockly.Python.ORDER_BITWISE_OR = 10;       // |
Blockly.Python.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
//     <, <=, >, >=, <>, !=, ==
Blockly.Python.ORDER_LOGICAL_NOT = 12;      // not
Blockly.Python.ORDER_LOGICAL_AND = 13;      // and
Blockly.Python.ORDER_LOGICAL_OR = 14;       // or
Blockly.Python.ORDER_CONDITIONAL = 15;      // if else
Blockly.Python.ORDER_LAMBDA = 16;           // lambda
Blockly.Python.ORDER_NONE = 99;             // (...)

/**
 * define indent
 */
Blockly.Python.INDENT = '  ';
Blockly.Python.MEM_TYPE = 'MEM';
Blockly.Python.COLOR_TYPE = 'COLOR';
Blockly.Python.MATRIX_TYPE = 'matrix';
Blockly.Python.SOUND_TYPE = 'sound';
Blockly.Python.MOTOR_TYPE = 'motor';
Blockly.Python.ULTRASIONIC_TYPE = 'ultrasionic';
Blockly.Python.TOUCH_TYPE = 'touch';
Blockly.Python.KEY_TYPE = 'key';
Blockly.Python.GRAY_TYPE = 'gray';
Blockly.Python.LIST_TYPE = 'userlist';


Blockly.Python.firstLoop = true;
Blockly.Python.soundslist = [];
/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Python.init = function (workspace) {
  // Create a dictionary of imports to be printed at head.
  Blockly.Python.imports_ = Object.create(null);
  // Create a dictionary of custom founction definitions to be printed after imports.
  Blockly.Python.customFunctions_ = Object.create(null);
  // Create a dictionary of custom args safe name. Avoid generating multiple
  // security names with different suffixes due to multiple uses of getName.
  Blockly.Python.customFunctionsArgName_ = Object.create(null);
  // Create a dictionary of libraries to be printed after custom functions.
  Blockly.Python.libraries_ = Object.create(null);
  // Create a dictionary of variables to be printed after libraries.
  Blockly.Python.variables_ = Object.create(null);
  // Create a dictionary of setups to be printed before code.
  Blockly.Python.setups_ = Object.create(null);
  // Create a dictionary of loops to be printed after code.
  Blockly.Python.loops_ = Object.create(null);

  Blockly.Python.tasks_ = Object.create(null);

  if (!Blockly.Python.variableDB_) {
    Blockly.Python.variableDB_ =
      new Blockly.Names(Blockly.Python.RESERVED_WORDS_);
  } else {
    Blockly.Python.variableDB_.reset();
  }
  Blockly.Python.variableDB_.setVariableMap(workspace.getVariableMap());

  var variables = Blockly.Variables.allVariables(workspace);
  for (var x = 0; x < variables.length; x++) {
    if (variables[x].type === Blockly.LIST_VARIABLE_TYPE) {
      Blockly.Python.variables_[x] =
        Blockly.Python.variableDB_.getName(variables[x].name, Blockly.Variables.NAME_TYPE) + ' = []';
    } else {
      Blockly.Python.variables_[x] =
        Blockly.Python.variableDB_.getName(variables[x].name, Blockly.Variables.NAME_TYPE) + ' = 0';
    }
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Python.finish = function (code) {
  // Convert the imports dictionary into a list.
  var imports = [];
  for (var name in Blockly.Python.imports_) {
    imports.push(Blockly.Python.imports_[name]);
  }
  // Convert the custom function definitions dictionary into a list.
  var customFunctions = [];
  for (var name in Blockly.Python.customFunctions_) {
    customFunctions.push(Blockly.Python.customFunctions_[name]);
  }
  // Convert the libraries dictionary into a list.
  var libraries = [];
  for (var name in Blockly.Python.libraries_) {
    libraries.push(Blockly.Python.libraries_[name]);
  }
  // Convert the variables dictionary into a list.
  var variables = [];
  for (var name in Blockly.Python.variables_) {
    variables.push(Blockly.Python.variables_[name]);
  }
  // Convert the setups dictionary into a list.
  var setups = [];
  for (var name in Blockly.Python.setups_) {
    setups.push(Blockly.Python.setups_[name]);
  }
  // Convert the loops dictionary into a list.
  var loops = [];
  for (var name in Blockly.Python.loops_) {
    loops.push(Blockly.Python.loops_[name]);
  }

  var tasks = [];
  for (var name in Blockly.Python.tasks_) {
    tasks.push(Blockly.Python.tasks_[name]);
  }

  var ret = "# generated by NEW-AI\n";
  // imports
  if (imports.length !== 0) {
    ret += imports.join('\n') + "\n\n";
  }
  // custom function definitions
  if (customFunctions.length !== 0) {
    ret += customFunctions.join('\n') + "\n";
  }
  // libraries
  if (libraries.length !== 0) {
    ret += libraries.join('\n') + "\n\n";
  }
  // def repeat
  if (loops.length !== 0) {
    ret += "def repeat():\n" + Blockly.Python.INDENT;
    ret += loops.join('\n' + Blockly.Python.INDENT) + "\n\n";
  }
  // variables
  if (variables.length !== 0) {
    ret += variables.join('\n') + "\n\n";
  }

  // tasks
  if (tasks.length !== 0) {
    ret += tasks.join('\n') + "\n\n";
  }

  // setups
  if (setups.length !== 0) {
    ret += setups.join('\n') + "\n\n";
  }

  

  let str = '', threadStr = '', arr = Object.keys(Blockly.Python.tasks_);

  if (arr.length > 0) {
    arr.forEach((key, index) => {
      const t = `${key}_finished`;
      threadStr += `_thread.start_new_thread(${key}, ())\n`
      if (index === arr.length - 1) {
        str += 'not ' + t;
      } else {
        str += 'not ' + t + ' or ';
      }
    })

    let whileEnd =
      `while ${str}:
        time.sleep ms(0.1)`;

    ret += this.splitCodeByTask(code) + "\n" + threadStr + '\n' + whileEnd;
  } else {
    ret += code;
  }
  // repeat
  if (loops.length !== 0) {
    // if there is no loop add a empty loop function.
    if (Blockly.Python.firstLoop) {
      ret += "while True:\n" + Blockly.Python.INDENT + "repeat()\n\n";
      // replace the useless pass.
      ret = ret.replace(/\npass\n/g, '');
    }
  } else {
    // if no repeat delet all repeat() call in code.
    var repeatFunctions = ret.match(/:\n *repeat\(\)\n/g);

    for (var func in repeatFunctions) {
      var spaceLength = repeatFunctions[func].match(/\s+/g)[0].length;
      ret = ret.replace(/:\n *repeat\(\)\n/, ':\n' + ' '.repeat(spaceLength) + 'pass\n');
    }

    ret = ret.replace(/ *repeat\(\)\n/g, '');
  }

  // Clean up temporary data.
  delete Blockly.Python.imports_;
  delete Blockly.Python.libraries_;
  delete Blockly.Python.variables_;
  delete Blockly.Python.setups_;
  delete Blockly.Python.loops_;
  delete Blockly.Python.customFunctions_;
  delete Blockly.Python.customFunctionsArgName_;
  delete Blockly.Python.tasks_;
  Blockly.Python.variableDB_.reset();
  Blockly.Python.firstLoop = true;

  return ret;
};

Blockly.Python.splitCodeByTask = function (code) {
  let result = '\n';
  const regexForThread = /\s{1}\/\* Start \*\/\s*[\s\S]*?\s*\/\* End \*\/\s{1}/g;
  const task = Object.keys(Blockly.Python.tasks_);
  const arr = code.match(regexForThread);

  if (!arr) {
    return code;
  }

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].replace(/\/\* Start \*\//, '').replace(/\/\* End \*\//, '');
    result = result + '\n' +
      `def ${task[i]}():
    global ${task[i]}_finished
    ${item}
    ${task[i]}_finished = True\n`;
  }
  
  return result;
}

/**
 * Common tasks for generating Python from blocks.
 * Get comments for the specified block and any connected value blocks.
 * Remove the block's code which is unconnect to hat block.
 * Add indent at the beginning of each line in custom function.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Python code created for this block.
 * @return {string} Python code with comments and subsequent blocks added.
 * @private
 */
Blockly.Python.scrub_ = function (block, code) {
  if ((code === null) || (!Blockly.Python.check_(block))) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Python.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Python.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Python.prefixLines(comment, '# ');
          }
        }
      }
    }
  }

  var codeWithIndent = code;
  // At this step if block is not surround by a parent and it is not empty,
  // and it is a hat block, and it is not 'event_whenmicrobitbegin' block.
  // mean's it is in a function or it is custom function, add indent
  // at start of every line.
  if (block.getSurroundParent() === null && code !== "" && block.previousConnection !== null
    && block.getTopStackBlock().type !== 'event_whenmicrobitbegin') {
    // Add indent at start except custom function
    if (block.type !== 'procedures_definition'
      && block.type !== 'procedures_prototype') {
      codeWithIndent = Blockly.Python.INDENT + codeWithIndent;
      if (commentCode !== '') {
        commentCode = Blockly.Python.INDENT + commentCode;
      }
    }
    codeWithIndent = codeWithIndent.replace(/\n/g, "\n" + Blockly.Python.INDENT);
    // Delet final indent
    codeWithIndent = codeWithIndent.slice(0, codeWithIndent.length - 2);
  }

  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Python.blockToCode(nextBlock);
  return commentCode + codeWithIndent + nextCode;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Python.scrubNakedValue = function (line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Python string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly.Python.quote_ = function (string) {
  // Can't use goog.string.quote since % must also be escaped.
  string = string.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\\n')
    .replace(/%/g, '\\%')
    .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating code from blocks.
 * Check whether this block has a valid connection.
 * @param {!Blockly.Block} block The current block.
 * @return {bool} Wether the block has effective connection.
 * @private
 */
Blockly.Python.check_ = function (block) {
  // If a block has no previousConnection means it is a hat block
  // or a string/nubmer block or a bool block.

  // If this block is not surround by a parent. And if this block
  // is not connected to a hat block's tree or it's output shap is
  // round or sharp mean's it is not a program tree block. Skip it.
  if (block.getSurroundParent() === null) {
    if ((block.previousConnection !== null && block.getTopStackBlock().previousConnection !== null)
      || block.getOutputShape() === 2 || block.getOutputShape() === 1
    ) {
      return false;
    }
  }
  return true;
};

Blockly.Python.stringToHex = function (matrix) {
  // 将字符串按照每9个字符分割成数组
  const matrixArr = matrix.match(/.{1,7}/g);
  // 定义存储16进制数的数组
  const hexArr = [];
  // 遍历矩阵数组，将每个元素转换为16进制数并存入hexArr数组
  matrixArr.map(element => {
    const decimalNum = parseInt(element, 2) << 1; // 将二进制数转换为十进制数
    const hexNum = '0x' + decimalNum.toString(16).padStart(2, '0'); // 将十进制数转换为16进制数
    hexArr.push(hexNum);
  });

  return hexArr;
}

// 将hex格式颜色转换为rgb格式
Blockly.Python.hexToRgb = function (hex) {
  if (!hex) {
    return;
  }
  // 去除 # 号
  hex = hex.replace(/#/, "").replace(/'/g, '');

  // 将hex字符串拆分为R、G、B分量
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return;
  }
  // 返回rgb格式
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

// 将grb格式颜色转换为hex格式
Blockly.Python.grbToHex = function (grb) {
  if (!grb) {
    return;
  }
  // 提取R、G、B分量
  const values = grb.match(/\d+/g);

  const g = parseInt(values[0]);
  const r = parseInt(values[1]);
  const b = parseInt(values[2]);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return;
  }
  // 将每个分量转换为2位十六进制数
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  // 返回hex格式
  return "0x" + hexR + hexG + hexB;
}

Blockly.Python.toStr = function (val) {
  if (!val) return;
  const arr = ['up_abs', 'down_abs', '_abs_', 'sqrt_abs', 'sin_abs', 'cos_abs', 'tan_abs', 'asin_abs', 'acos_abs', 'atan_abs', 'ln_abs', 'e_abs', '10_abs'];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (typeof val === 'string' && val === item) {
      return false;
    }
  }
  const regex = /[()\[\]_]/g;
  const matches = val.match(regex);
  return matches && matches.length > 0;
}

Blockly.Python.handleResult = function (code, type) {
  let result = code;
  switch (type) {
    case Blockly.Python.MATRIX_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyLed = APIMatrix.showLed()';
      }
      result = '\tMyLed.' + result;
      break;
    case Blockly.Python.SOUND_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyMusic = APIMusic.playMusic()';
      }
      result = '\tMyMusic.' + result;
      break;
    case Blockly.Python.MEM_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyMem = APIMem.mem()';
      }
      result = '\tMyMem.' + result;
      break;
    case Blockly.Python.COLOR_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyColor = APIColor.color()';
      }
      result = '\tMyColor.' + result;
      break;
    case Blockly.Python.MOTOR_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyMotor = APIMotor.motor()';
      }
      result = '\tMyMotor.' + result;
      break;
    case Blockly.Python.ULTRASIONIC_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyUltrasion = APIUltrasion.ultrasionic()';
      }
      result = '\tMyUltrasion.' + result;
      break;
    case Blockly.Python.TOUCH_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyTouch = APITouch.touch()';
      }
      result = '\tMyTouch.' + result;
      break;
    case Blockly.Python.KEY_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyRemodet = APIKey.key()';
      }
      result = '\tMyRemodet.' + result;
      break;
    case Blockly.Python.GRAY_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyGray = APIGray.gray()';
      }
      result = '\tMyGray.' + result;
      break;
    case Blockly.Python.LIST_TYPE:
      if (!Blockly.Python.setups_[type]) {
        Blockly.Python.setups_[type] = 'MyList= APIList.userlist()';
      }
      result = '\tMyList.' + result;
      break;
    default:
      break;
  }
  return result
}