/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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

/**
 * @fileoverview English strings.
 * @author ascii@media.mit.edu (Andrew Sliwinski)
 *
 * After modifying this file, run `npm run translate` from the root directory
 * to regenerate `./msg/json/en.json`.
 * IMPORTANT:
 * All message strings must use single quotes for the scripts to work properly
 */
'use strict';

goog.provide('Blockly.Msg.en');

goog.require('Blockly.Msg');

// Control blocks
Blockly.Msg.CONTROL_FOREVER = 'forever';
Blockly.Msg.CONTROL_REPEAT = 'repeat %1';
Blockly.Msg.CONTROL_IF = 'if %1 then';
Blockly.Msg.CONTROL_ELSE = 'else';
Blockly.Msg.CONTROL_STOP = 'stop';
Blockly.Msg.CONTROL_STOP_ALL = 'all';
Blockly.Msg.CONTROL_STOP_THIS = 'this script';
Blockly.Msg.CONTROL_STOP_OTHER = 'other scripts in sprite';
Blockly.Msg.CONTROL_STOP_EXIT = 'and exit';
Blockly.Msg.CONTROL_WAIT = 'wait %1 seconds';
Blockly.Msg.CONTROL_WAITUNTIL = 'wait until %1';
Blockly.Msg.CONTROL_REPEATUNTIL = 'repeat until %1';
Blockly.Msg.CONTROL_WHILE = 'while %1';
Blockly.Msg.CONTROL_FOREACH = 'for each %1 in %2';
Blockly.Msg.CONTROL_STARTASCLONE = 'when I start as a clone';
Blockly.Msg.CONTROL_CREATECLONEOF = 'create clone of %1';
Blockly.Msg.CONTROL_CREATECLONEOF_MYSELF = 'myself';
Blockly.Msg.CONTROL_DELETETHISCLONE = 'delete this clone';
Blockly.Msg.CONTROL_COUNTER = 'counter';
Blockly.Msg.CONTROL_INCRCOUNTER = 'increment counter';
Blockly.Msg.CONTROL_CLEARCOUNTER = 'clear counter';
Blockly.Msg.CONTROL_ALLATONCE = 'all at once';

// Data blocks
Blockly.Msg.DATA_SETVARIABLETO = 'set %1 to %2';
Blockly.Msg.DATA_CHANGEVARIABLEBY = 'change %1 by %2';
Blockly.Msg.DATA_SHOWVARIABLE = 'show variable %1';
Blockly.Msg.DATA_HIDEVARIABLE = 'hide variable %1';
Blockly.Msg.DATA_ADDTOLIST = '%1 join %2';
Blockly.Msg.DATA_DELETEOFLIST = 'delete %1 of %2';
Blockly.Msg.DATA_DELETEALLOFLIST = 'delete all of %1';
Blockly.Msg.DATA_INSERTATLIST = 'insert %1 at %2 of %3';
Blockly.Msg.DATA_REPLACEITEMOFLIST = 'replace item %1 of %2 with %3';
Blockly.Msg.DATA_ITEMOFLIST = 'item %1 of %2';
Blockly.Msg.DATA_ITEMNUMOFLIST = 'item # of %1 in %2';
Blockly.Msg.DATA_LENGTHOFLIST = 'length of %1';
Blockly.Msg.DATA_LISTCONTAINSITEM = '%1 contains %2?';
Blockly.Msg.DATA_SHOWLIST = 'show list %1';
Blockly.Msg.DATA_HIDELIST = 'hide list %1';
Blockly.Msg.DATA_INDEX_ALL = 'all';
Blockly.Msg.DATA_INDEX_LAST = 'last';
Blockly.Msg.DATA_INDEX_RANDOM = 'random';
Blockly.Msg.DATA_DEFINEVAR = 'Define a variable %1';
Blockly.Msg.DATA_DEFINELIST = 'Define a list %1';
// Event blocks
Blockly.Msg.EVENT_WHENFLAGCLICKED = 'when %1 clicked';
Blockly.Msg.EVENT_WHENTHISSPRITECLICKED = 'when this sprite clicked';
Blockly.Msg.EVENT_WHENSTAGECLICKED = 'when stage clicked';
Blockly.Msg.EVENT_WHENTOUCHINGOBJECT = 'when this sprite touches %1';
Blockly.Msg.EVENT_WHENBROADCASTRECEIVED = 'when I receive %1';
Blockly.Msg.EVENT_WHENBACKDROPSWITCHESTO = 'when backdrop switches to %1';
Blockly.Msg.EVENT_WHENGREATERTHAN = 'when %1 > %2';
Blockly.Msg.EVENT_WHENGREATERTHAN_TIMER = 'timer';
Blockly.Msg.EVENT_WHENGREATERTHAN_LOUDNESS = 'loudness';
Blockly.Msg.EVENT_BROADCAST = 'broadcast %1';
Blockly.Msg.EVENT_BROADCASTANDWAIT = 'broadcast %1 and wait';
Blockly.Msg.EVENT_WHENKEYPRESSED = 'when %1 key pressed';
Blockly.Msg.EVENT_WHENKEYPRESSED_SPACE = 'space';
Blockly.Msg.EVENT_WHENKEYPRESSED_LEFT = 'left arrow';
Blockly.Msg.EVENT_WHENKEYPRESSED_RIGHT = 'right arrow';
Blockly.Msg.EVENT_WHENKEYPRESSED_DOWN = 'down arrow';
Blockly.Msg.EVENT_WHENKEYPRESSED_UP = 'up arrow';
Blockly.Msg.EVENT_WHENKEYPRESSED_ANY = 'any';
Blockly.Msg.EVENT_CHECKCOLOR = '%1 color is %2';
Blockly.Msg.EVENT_KEYJUDEMENT = 'when %1 %2';
Blockly.Msg.EVENT_TILTS = 'When the intelligent hub tilts %1';
Blockly.Msg.EVENT_KEYPRESS = 'When the %1 button is %2';
Blockly.Msg.EVENT_WHEN = 'When the %1';
// Looks blocks
Blockly.Msg.LOOKS_SAYFORSECS = 'say %1 for %2 seconds';
Blockly.Msg.LOOKS_SAY = 'say %1';
Blockly.Msg.LOOKS_HELLO = 'Hello!';
Blockly.Msg.LOOKS_THINKFORSECS = 'think %1 for %2 seconds';
Blockly.Msg.LOOKS_THINK = 'think %1';
Blockly.Msg.LOOKS_HMM = 'Hmm...';
Blockly.Msg.LOOKS_SHOW = 'show';
Blockly.Msg.LOOKS_HIDE = 'hide';
Blockly.Msg.LOOKS_HIDEALLSPRITES = 'hide all sprites';
Blockly.Msg.LOOKS_EFFECT_COLOR = 'color';
Blockly.Msg.LOOKS_EFFECT_FISHEYE = 'fisheye';
Blockly.Msg.LOOKS_EFFECT_WHIRL = 'whirl';
Blockly.Msg.LOOKS_EFFECT_PIXELATE = 'pixelate';
Blockly.Msg.LOOKS_EFFECT_MOSAIC = 'mosaic';
Blockly.Msg.LOOKS_EFFECT_BRIGHTNESS = 'brightness';
Blockly.Msg.LOOKS_EFFECT_GHOST = 'ghost';
Blockly.Msg.LOOKS_CHANGEEFFECTBY = 'change %1 effect by %2';
Blockly.Msg.LOOKS_SETEFFECTTO = 'set %1 effect to %2';
Blockly.Msg.LOOKS_CLEARGRAPHICEFFECTS = 'clear graphic effects';
Blockly.Msg.LOOKS_CHANGESIZEBY = 'change size by %1';
Blockly.Msg.LOOKS_SETSIZETO = 'set size to %1 %';
Blockly.Msg.LOOKS_SIZE = 'size';
Blockly.Msg.LOOKS_CHANGESTRETCHBY = 'change stretch by %1';
Blockly.Msg.LOOKS_SETSTRETCHTO = 'set stretch to %1 %';
Blockly.Msg.LOOKS_SWITCHCOSTUMETO = 'switch costume to %1';
Blockly.Msg.LOOKS_NEXTCOSTUME = 'next costume';
Blockly.Msg.LOOKS_SWITCHBACKDROPTO = 'switch backdrop to %1';
Blockly.Msg.LOOKS_GOTOFRONTBACK = 'go to %1 layer';
Blockly.Msg.LOOKS_GOTOFRONTBACK_FRONT = 'front';
Blockly.Msg.LOOKS_GOTOFRONTBACK_BACK = 'back';
Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS = 'go %1 %2 layers';
Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD = 'forward';
Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD = 'backward';
Blockly.Msg.LOOKS_BACKDROPNUMBERNAME = 'backdrop %1';
Blockly.Msg.LOOKS_COSTUMENUMBERNAME = 'costume %1';
Blockly.Msg.LOOKS_NUMBERNAME_NUMBER = 'number';
Blockly.Msg.LOOKS_NUMBERNAME_NAME = 'name';
Blockly.Msg.LOOKS_SWITCHBACKDROPTOANDWAIT = 'switch backdrop to %1 and wait';
Blockly.Msg.LOOKS_NEXTBACKDROP_BLOCK = 'next backdrop';
Blockly.Msg.LOOKS_NEXTBACKDROP = 'next backdrop';
Blockly.Msg.LOOKS_PREVIOUSBACKDROP = 'previous backdrop';
Blockly.Msg.LOOKS_RANDOMBACKDROP = 'random backdrop';
// combined motor blocks
Blockly.Msg.STARTING_COMBINED_MOTOR = "%1 set the running motor to %2 %3";
Blockly.Msg.DIRECTION_MOTOR = "%1 start moving %2";
Blockly.Msg.COMBINED_MOTOR_LINE = "%1 %2 moving %3 %4";
Blockly.Msg.COMBINED_MOTOR_SPEED = "%1 Combined speed of engine is set to %2 %%";
Blockly.Msg.COMBINED_MOTOR_TURN = "%1 combined motor %2 %3 %4 %5 moving %6 %7";
Blockly.Msg.COMBINED_MOTOR_STOP = "%1 stop motion";
Blockly.Msg.COMBINED_MOTOR_MOVESTEP = "%1 at a speed of %2 and %3 %% to move";
Blockly.Msg.COMBINED_MOTOR_STOPPING = "%1 When setting the running motor to stop %2";
Blockly.Msg.COMBINED_MOTOR_ANGLE = "%1 starts move %2";
Blockly.Msg.TURN_COMBINED_MOTOR = "%1 %2 %3 move %4 %5";
Blockly.Msg.LINE_COMBINED_MOTOR = "%1 %2 move %3 %4";
Blockly.Msg.STOP_COMBINED_MOTOR = "%1 stop motion";
Blockly.Msg.MOVE_COMBINED_MOTOR = "%1 at a speed of %2 and %3 %% to move %4 %5";
Blockly.Msg.MOVESTEP_COMBINED_MOTOR = "%1 at a speed of %2 and %3 %% to move";
Blockly.Msg.MOVEPOWER_COMBINED_MOTOR = "Starting at 2% %% power for% 3% 4 movement";
Blockly.Msg.STOPPING_COMBINED_MOTOR = "%1 When setting the running motor to stop %2";
Blockly.Msg.COMBINED_MOTOR_STARTWITHPOWER = "%1 at a speed of %2 and %3 %% to move";
Blockly.Msg.COMBINED_MOTOR_STARTWITHPOWEROBJ = "%1 Combination motor executed at %2 %3 %4 %5";
Blockly.Msg.COMBINED_MOTOR_MOVEBYYAWANGLE = "%1 combination motor based on yaw angle straight line %2 %3 %4 KP %5";
Blockly.Msg.COMBINED_MOTOR_SPINBYYAWANGLE = "%1 combination motor rotates %2 degrees according to yaw angle";
Blockly.Msg.COMBINED_MOTOR_PWM = "%1 Set the combined motor PWM to %2 %3";
// Motor blocks
Blockly.Msg.BACK = 'back';
Blockly.Msg.ADVANCE = 'advance';
Blockly.Msg.LEFT = 'turnleft';
Blockly.Msg.RIGHT = 'turnright';
Blockly.Msg.TURNLEFT = "turnleft";
Blockly.Msg.TURNRIGHT = "turnright";
Blockly.Msg.CENTIMETRE = 'centimetre';
Blockly.Msg.INCH = 'inch';
Blockly.Msg.CIRCLE = 'circle';
Blockly.Msg.SECONDS = 'seconds';
Blockly.Msg.ANGLE = 'angle';
Blockly.Msg.PATH = 'path';
Blockly.Msg.CLOCKWISE = 'clockwise';
Blockly.Msg.ANTICLOCKWISE = 'anticlockwise';
Blockly.Msg.RETARDATION = 'retardation';
Blockly.Msg.STILL = 'still';
Blockly.Msg.FLOAT = 'float';
Blockly.Msg.RATE_MOTOR = "%1 %2 speed";
Blockly.Msg.ANGLE_MOTOR = '%1 %2 angle';
Blockly.Msg.MOTOR_POSITION = '%1 %2 position';
Blockly.Msg.SPECIFIEDANGLE_MOTOR = "%1 %2 with %3 go to %4";
Blockly.Msg.SPECIFIEDUNIT_MOTOR = "%1 %2 %3 run %4 %5";
Blockly.Msg.SPEED_MOTOR = "%1 %2 set speed to %3 %%";
Blockly.Msg.STOP_MOTOR = '%1 %2 stop motor';
Blockly.Msg.STARTING_MOTOR = '%1 %2 %3 starting motor';
Blockly.Msg.RELATIVE_POSITION = "%1 %2 Set the relative position of the motor %3";
Blockly.Msg.SPECIFIED_MANNER = "%1 %2 When setting the motor to stop %3";
Blockly.Msg.MOTOR_STARTWITHPOWER = "%1 The Motor %2 starts at %3 power";
Blockly.Msg.MOTOR_ACCELERATION = "%1 Set the motor's acceleration of %2 to P %3, I %4, D %5";
Blockly.Msg.MOTOR_SETSTILL = "%1 Set the retention coefficient of %2 to P %3, I %4, D %5";
Blockly.Msg.MOTOR_RESET_OPERATING_DEGREE = "%1 Reset the %2 motor's running degree";
Blockly.Msg.MOTOR_SINGLE_PWM = "%1 Set the %2 motor's PWM to %3";
Blockly.Msg.BIG_MOTOR = "Big motor";
Blockly.Msg.SMALL_MOTOR = "Middle motor";
Blockly.Msg.DEFAULT = "default";
Blockly.Msg.FAST = "fast";
Blockly.Msg.BALANCE = "balance";
Blockly.Msg.SMOOTH = "smooth";
Blockly.Msg.SLOW = "slow";
Blockly.Msg.SLOWER = "slower";
// Motion blocks
Blockly.Msg.MOTION_MOVESTEPS = 'move %1 steps';
Blockly.Msg.MOTION_MOVE9STEPS = 'move 9 steps';
Blockly.Msg.MOTION_TURNLEFT = 'turn %1 %2 degrees';
Blockly.Msg.MOTION_TURNRIGHT = 'turn %1 %2 degrees';
Blockly.Msg.MOTION_POINTINDIRECTION = 'point in direction %1';
Blockly.Msg.MOTION_POINTTOWARDS = 'point towards %1';
Blockly.Msg.MOTION_POINTTOWARDS_POINTER = 'mouse-pointer';
Blockly.Msg.MOTION_POINTTOWARDS_RANDOM = 'random direction';
Blockly.Msg.MOTION_GOTO = 'go to %1';
Blockly.Msg.MOTION_GOTO_POINTER = 'mouse-pointer';
Blockly.Msg.MOTION_GOTO_RANDOM = 'random position';
Blockly.Msg.MOTION_GOTOXY = 'go to x: %1 y: %2';
Blockly.Msg.MOTION_GLIDESECSTOXY = 'glide %1 secs to x: %2 y: %3';
Blockly.Msg.MOTION_GLIDETO = 'glide %1 secs to %2';
Blockly.Msg.MOTION_GLIDETO_POINTER = 'mouse-pointer';
Blockly.Msg.MOTION_GLIDETO_RANDOM = 'random position';
Blockly.Msg.MOTION_CHANGEXBY = 'change x by %1';
Blockly.Msg.MOTION_SETX = 'set x to %1';
Blockly.Msg.MOTION_CHANGEYBY = 'change y by %1';
Blockly.Msg.MOTION_SETY = 'set y to %1';
Blockly.Msg.MOTION_IFONEDGEBOUNCE = 'if on edge, bounce';
Blockly.Msg.MOTION_SETROTATIONSTYLE = 'set rotation style %1';
Blockly.Msg.MOTION_SETROTATIONSTYLE_LEFTRIGHT = 'left-right';
Blockly.Msg.MOTION_SETROTATIONSTYLE_DONTROTATE = 'don\'t rotate';
Blockly.Msg.MOTION_SETROTATIONSTYLE_ALLAROUND = 'all around';
Blockly.Msg.MOTION_XPOSITION = 'x position';
Blockly.Msg.MOTION_YPOSITION = 'y position';
Blockly.Msg.MOTION_DIRECTION = 'direction';
Blockly.Msg.MOTION_SCROLLRIGHT = 'scroll right %1';
Blockly.Msg.MOTION_SCROLLUP = 'scroll up %1';
Blockly.Msg.MOTION_ALIGNSCENE = 'align scene %1';
Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMLEFT = 'bottom-left';
Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMRIGHT = 'bottom-right';
Blockly.Msg.MOTION_ALIGNSCENE_MIDDLE = 'middle';
Blockly.Msg.MOTION_ALIGNSCENE_TOPLEFT = 'top-left';
Blockly.Msg.MOTION_ALIGNSCENE_TOPRIGHT = 'top-right';
Blockly.Msg.MOTION_XSCROLL = 'x scroll';
Blockly.Msg.MOTION_YSCROLL = 'y scroll';
Blockly.Msg.MOTION_STAGE_SELECTED = 'Stage selected: no motion blocks';

// Operators blocks
Blockly.Msg.OPERATORS_ADD = '%1 + %2';
Blockly.Msg.OPERATORS_SUBTRACT = '%1 - %2';
Blockly.Msg.OPERATORS_MULTIPLY = '%1 * %2';
Blockly.Msg.OPERATORS_DIVIDE = '%1 / %2';
Blockly.Msg.OPERATORS_RANDOM = 'pick random %1 to %2';
Blockly.Msg.OPERATORS_GT = '%1 > %2';
Blockly.Msg.OPERATORS_LT = '%1 < %2';
Blockly.Msg.OPERATORS_EQUALS = '%1 = %2';
Blockly.Msg.OPERATORS_AND = '%1 and %2';
Blockly.Msg.OPERATORS_OR = '%1 or %2';
Blockly.Msg.OPERATORS_NOT = 'not %1';
Blockly.Msg.OPERATORS_JOIN = 'join %1 %2';
Blockly.Msg.OPERATORS_JOIN_APPLE = 'apple';
Blockly.Msg.OPERATORS_JOIN_BANANA = 'banana';
Blockly.Msg.OPERATORS_LETTEROF = 'letter %1 of %2';
Blockly.Msg.OPERATORS_LETTEROF_APPLE = 'a';
Blockly.Msg.OPERATORS_LENGTH = 'length of %1';
Blockly.Msg.OPERATORS_CONTAINS = '%1 contains %2?';
Blockly.Msg.OPERATORS_MOD = '%1 mod %2';
Blockly.Msg.OPERATORS_ROUND = 'round %1';
Blockly.Msg.OPERATORS_MATHOP = '%1 of %2';
Blockly.Msg.OPERATORS_MATHOP_ABS = 'abs';
Blockly.Msg.OPERATORS_MATHOP_FLOOR = 'floor';
Blockly.Msg.OPERATORS_MATHOP_CEILING = 'ceiling';
Blockly.Msg.OPERATORS_MATHOP_SQRT = 'sqrt';
Blockly.Msg.OPERATORS_MATHOP_SIN = 'sin';
Blockly.Msg.OPERATORS_MATHOP_COS = 'cos';
Blockly.Msg.OPERATORS_MATHOP_TAN = 'tan';
Blockly.Msg.OPERATORS_MATHOP_ASIN = 'asin';
Blockly.Msg.OPERATORS_MATHOP_ACOS = 'acos';
Blockly.Msg.OPERATORS_MATHOP_ATAN = 'atan';
Blockly.Msg.OPERATORS_MATHOP_LN = 'ln';
Blockly.Msg.OPERATORS_MATHOP_LOG = 'log';
Blockly.Msg.OPERATORS_MATHOP_EEXP = 'e ^';
Blockly.Msg.OPERATORS_MATHOP_10EXP = '10 ^';

// Procedures blocks
Blockly.Msg.PROCEDURES_DEFINITION = 'define %1';
Blockly.Msg.RED = 'red';
Blockly.Msg.GREEN = 'green';
Blockly.Msg.BLUE = 'blue';
Blockly.Msg.BLACK = 'black';
Blockly.Msg.WHITE = 'white';
Blockly.Msg.PURPLE = 'purple';
Blockly.Msg.PRESS = 'press';
Blockly.Msg.UNPRESS = 'unpress';
Blockly.Msg.PLEFT = 'left';
Blockly.Msg.PRIGHT = 'right';
Blockly.Msg.UP = 'up';
Blockly.Msg.DOWN = 'down';
// Sensing blocks
Blockly.Msg.SENSING_RESET_TIMER = 'Reset Timer';
Blockly.Msg.SENSING_TIMER = 'Timer';
Blockly.Msg.SENSING_READ_ANALOG = 'Pin %1 analog value';
Blockly.Msg.SENSING_WRITE_ANALOG = 'Pin %1 analog value %2';
Blockly.Msg.SENSING_WRITE_PIN = 'Pin %1 value %2';
Blockly.Msg.SENSING_READ_PIN = 'Read pin %1 value';
Blockly.Msg.SENSING_COMPASS = 'Compass pointing';
Blockly.Msg.SENSING_MAGNETISM = 'Magnetism %1';
Blockly.Msg.SENSING_MAGNETIC_CALIBRATION = 'Magnetic field calibration';
Blockly.Msg.SENSING_GYROSCOPE_ATTITUDE = 'attitude %1';
Blockly.Msg.SENSING_GYROSCOPE_ACCELERATION = 'acceleration %1 G';
Blockly.Msg.SENSING_KEY_PRESS = '%1 key is %2';
Blockly.Msg.SENSING_KEY_JUDGMENT = 'Is the %1 touch button pressed';
Blockly.Msg.SENSING_SOUND_INTENSITY = 'Obtain sound intensity';
Blockly.Msg.SENSING_ULTRASONIC_DETECTION = 'Ultrasonic %1 obtain distance value';
Blockly.Msg.SENSING_ULTRASONIC_JUDGMENT = '%1 Ultrasonic judgment %2 %3 %%?';
Blockly.Msg.SENSING_LINE_INSPECTION_JUDGMENT = 'line %1 looks %2';
Blockly.Msg.SENSING_REFLECTED_LIGHT_DETECTION = '%1 Reflected light';
Blockly.Msg.SENSING_REFLECTED_LIGHT_JUDGMENT = '%1 Reflected light judgment %2 %3 %%?';
Blockly.Msg.SENSING_COLOR_DETECTIONRGB = '%1 color is %2';
Blockly.Msg.SENSING_COLOR_DETECTION = '%1 color';
Blockly.Msg.SENSING_COLOR_JUDGMENT = '%1 color is %2';
Blockly.Msg.SENSING_TOUCHINGOBJECT = 'touching %1?';
Blockly.Msg.SENSING_TOUCHINGOBJECT_POINTER = 'mouse-pointer';
Blockly.Msg.SENSING_TOUCHINGOBJECT_EDGE = 'edge';
Blockly.Msg.SENSING_TOUCHINGCOLOR = 'touching color %1?';
Blockly.Msg.SENSING_COLORISTOUCHINGCOLOR = 'color %1 is touching %2?';
Blockly.Msg.SENSING_DISTANCETO = 'distance to %1';
Blockly.Msg.SENSING_DISTANCETO_POINTER = 'mouse-pointer';
Blockly.Msg.SENSING_ASKANDWAIT = 'ask %1 and wait';
Blockly.Msg.SENSING_ASK_TEXT = 'What\'s your name?';
Blockly.Msg.SENSING_ANSWER = 'answer';
Blockly.Msg.SENSING_KEYPRESSED = 'key %1 pressed?';
Blockly.Msg.SENSING_MOUSEDOWN = 'mouse down?';
Blockly.Msg.SENSING_MOUSEX = 'mouse x';
Blockly.Msg.SENSING_MOUSEY = 'mouse y';
Blockly.Msg.SENSING_SETDRAGMODE = 'set drag mode %1';
Blockly.Msg.SENSING_SETDRAGMODE_DRAGGABLE = 'draggable';
Blockly.Msg.SENSING_SETDRAGMODE_NOTDRAGGABLE = 'not draggable';
Blockly.Msg.SENSING_LOUDNESS = 'loudness';
Blockly.Msg.SENSING_LOUD = 'loud?';
Blockly.Msg.SENSING_TIMER = 'timer';
Blockly.Msg.SENSING_RESETTIMER = 'reset timer';
Blockly.Msg.SENSING_OF = '%1 of %2';
Blockly.Msg.SENSING_OF_XPOSITION = 'x position';
Blockly.Msg.SENSING_OF_YPOSITION = 'y position';
Blockly.Msg.SENSING_OF_DIRECTION = 'direction';
Blockly.Msg.SENSING_OF_COSTUMENUMBER = 'costume #';
Blockly.Msg.SENSING_OF_COSTUMENAME = 'costume name';
Blockly.Msg.SENSING_OF_SIZE = 'size';
Blockly.Msg.SENSING_OF_VOLUME = 'volume';
Blockly.Msg.SENSING_OF_BACKDROPNUMBER = 'backdrop #';
Blockly.Msg.SENSING_OF_BACKDROPNAME = 'backdrop name';
Blockly.Msg.SENSING_OF_STAGE = 'Stage';
Blockly.Msg.SENSING_CURRENT = 'current %1';
Blockly.Msg.SENSING_CURRENT_YEAR = 'year';
Blockly.Msg.SENSING_CURRENT_MONTH = 'month';
Blockly.Msg.SENSING_CURRENT_DATE = 'date';
Blockly.Msg.SENSING_CURRENT_DAYOFWEEK = 'day of week';
Blockly.Msg.SENSING_CURRENT_HOUR = 'hour';
Blockly.Msg.SENSING_CURRENT_MINUTE = 'minute';
Blockly.Msg.SENSING_CURRENT_SECOND = 'second';
Blockly.Msg.SENSING_DAYSSINCE2000 = 'days since 2000';
Blockly.Msg.SENSING_USERNAME = 'username';
Blockly.Msg.SENSING_USERID = 'user id';
Blockly.Msg.SENSING_GYROSCOPE_ANGLE = '%1\'s angle';
Blockly.Msg.SENSING_SET_YAW_ANGLE = 'Set yaw angle to 0';
Blockly.Msg.SENSING_ISHANDLING = 'Is the %1 button of the handle %2?';
Blockly.Msg.SENSING_HANDLING = 'Controller %1 rocker %2 axis';
Blockly.Msg.SENSING_MAINISPRESS = 'Is the %1 button of the host %2';
Blockly.Msg.SENSING_COLOR_RANGE = 'Is the color range of port %1 within R %2 ~ %3 G %4 ~ %5 B %6 ~ %7';
Blockly.Msg.SENSING_HSVCOLOR = 'Is the %2 range of port %1 within %3 ~ %4';
Blockly.Msg.SENSING_REFLECTED_LIGHT_BLACKLINE = '%1 The threshold for detecting black lines is around %2';
Blockly.Msg.SENSING_GET_GRAY_LINE = '%1 Obtain grayscale sensor values %2';
Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK = '%1 search for color blocks R %2 G %3 B %4 tolerance %5';
Blockly.Msg.SENSING_CAMERA_FIND_COLOR_STATE = 'Get the current search status of the color block';
Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK_X = 'Obtain the x-coordinate system of the current color block';
Blockly.Msg.SENSING_CAMERA_FIND_COLOR_BLOCK_Y = 'Obtain the y-coordinate system of the current color block';
Blockly.Msg.SENSING_CAMERA_FIND_COLOR_PIXEL = 'Get the pixel value of the current color block';
Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND = '%1 Central area color recognition radius %2 R %3 G %4 B %5';
Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_RED = 'Obtain the red value component of the central area';
Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_GREEN = 'Obtain the green value component of the central area';
Blockly.Msg.SENSING_CAMERA_MIDDLE_FIND_BLUE = 'Obtain the blue value component of the central area';
Blockly.Msg.SENSING_CAMERA_EXTERN_COLOR = '%1 Global color recognition';
Blockly.Msg.SENSING_CAMERA_EXTERN_RED = 'Obtain the red component of the global color';
Blockly.Msg.SENSING_CAMERA_EXTERN_GREEN = 'Obtain the green component of the global color';
Blockly.Msg.SENSING_CAMERA_EXTERN_BLUE = 'Obtain the blue component of the global color';
Blockly.Msg.SENSING_CAMERA_FIND_LINE = '%1 line patrol';
Blockly.Msg.SENSING_CAMERA_FIND_LINE_STATE = 'Obtain the status of the patrol line';
Blockly.Msg.SENSING_CAMERA_FIND_LINE_SHOWSEX = 'Obtain the significance of the patrol line';
Blockly.Msg.SENSING_CAMERA_FIND_LINE_RHO = 'Obtain the vertical distance value of the patrol line';
Blockly.Msg.SENSING_CAMERA_FIND_LINE_THETA = 'Obtain the angle value of the patrol line';
Blockly.Msg.SENSING_CAMERA_NUMBER_CHECK = '%1 Identification Data';
Blockly.Msg.SENSING_CAMERA_NUMBER_STATE = 'Get the status of finding numbers';
Blockly.Msg.SENSING_CAMERA_GET_NUMBER = 'Obtain recognized digital content';
Blockly.Msg.SENSING_CAMERA_FACE_CHECK = '%1 Face detection';
Blockly.Msg.SENSING_CAMERA_FACE_STATE = 'Get the status of finding the face';
Blockly.Msg.SENSING_CAMERA_FACE_X = 'Obtain the X-coordinate value of the face';
Blockly.Msg.SENSING_CAMERA_FACE_Y = 'Obtain the Y-coordinate value of the face';
Blockly.Msg.SENSING_CAMERA_FACE_TRACE = '%1 face tracking';
Blockly.Msg.SENSING_CAMERA_FACE_TRACE_STATE = 'Get facial tracking status';
Blockly.Msg.SENSING_CAMERA_FACE_TRACE_X = 'Obtain the X-coordinate value of face tracking';
Blockly.Msg.SENSING_CAMERA_FACE_TRACE_Y = 'Obtain the Y-coordinate value of face tracking';
Blockly.Msg.SENSING_CAMERA_QR_CHECK = '%1 QR code recognition';
Blockly.Msg.SENSING_CAMERA_QR_STATE = 'Obtain QR code recognition status';
Blockly.Msg.SENSING_CAMERA_APRILTAG = '%1 AprilTag Tag Tracking';
Blockly.Msg.SENSING_CAMERA_APRILTAG_STATE = 'Get AprilTag tag recognition status';
Blockly.Msg.SENSING_CAMERA_APRILTAG_ID = 'Get the ID value of the AprilTag tag';
Blockly.Msg.SENSING_CAMERA_APRILTAG_X = 'Get the X coordinate value of the AprilTag tag';
Blockly.Msg.SENSING_CAMERA_APRILTAG_Y = 'Get the Y coordinate value of the AprilTag tag';
Blockly.Msg.SENSING_CAMERA_APRILTAG_ROLL = 'Get the angle value of AprilTag tag';
Blockly.Msg.SENSING_CAMERA_APRILTAG_DISTANCE = 'Get the distance value of AprilTag tag';
Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC = '%1 Feature point detection';
Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_STATE = 'Obtain the state value of feature detection';
Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_MATCHINE = 'Obtain the matching degree of feature detection';
Blockly.Msg.SENSING_CAMERA_CHARACTERISTIC_ROLL = 'Obtain the rotation angle for feature detection';
// Sound blocks
Blockly.Msg.SOUND_PLAY = 'start sound %1';
Blockly.Msg.SOUND_PLAYUNTILDONE = 'play sound %1 until done';
Blockly.Msg.SOUND_STOPALLSOUNDS = 'stop all sounds';
Blockly.Msg.SOUND_SETEFFECTO = 'set %1 effect to %2';
Blockly.Msg.SOUND_CHANGEEFFECTBY = 'change %1 effect by %2';
Blockly.Msg.SOUND_CLEAREFFECTS = 'clear sound effects';
Blockly.Msg.SOUND_EFFECTS_PITCH = 'pitch';
Blockly.Msg.SOUND_EFFECTS_PAN = 'pan left/right';
Blockly.Msg.SOUND_CHANGEVOLUMEBY = 'change volume by %1';
Blockly.Msg.SOUND_SETVOLUMETO = 'set volume to %1%';
Blockly.Msg.SOUND_VOLUME = 'volume';
Blockly.Msg.SOUND_RECORD = 'record...';
Blockly.Msg.SOUND_SETPLAYSPEED = 'Set performance speed to %1';
Blockly.Msg.SOUND_PLAYMUSIC = 'Play note %1 for %2 beats';
//Matrix blocks
Blockly.Msg.MATRIX_LAMP = '%1 light %2 the color is %3';
Blockly.Msg.STOP_MATRIX_LAMP = "%1 turn off pixel lights";
Blockly.Msg.SET_MATRIX_LAMP = "%1 set the brightness of the pixel light to %2 %%";
Blockly.Msg.SINGLE_MATRIX_LAMP = "%1 turn on Pixels x %2 y %3";
Blockly.Msg.TEXT_MATRIX_LAMP = "%1 text display %2 %3";
Blockly.Msg.SETRGB_MATRIX_LAMP = "%1 light serial number %2 color %3";
Blockly.Msg.USERGB_MATRIX_LAMP = "%1 %2 light";
Blockly.Msg.MATRIX_COLOR = "%1 set the light's color is %2";
Blockly.Msg.SET_MATRIX_SATURATION = "%1 set the saturation of the pixel light to %2 %%";
Blockly.Msg.SET_COLOR_RGB_MATRIX_LAMP = "%1 set the light's color is R %2 G %3 B %4";
Blockly.Msg.OPEN = "turn on";
Blockly.Msg.CLOSE = "turn off";
// Category labels
Blockly.Msg.CATEGORY_MATRIX = 'Matrix Lamp';
Blockly.Msg.CATEGORY_MOTION = 'Motion';
Blockly.Msg.CATEGORY_COMBINED_MOTOR = 'Combination Motor';
Blockly.Msg.CATEGORY_MOTOR = 'Motor';
Blockly.Msg.CATEGORY_LOOKS = 'Looks';
Blockly.Msg.CATEGORY_SOUND = 'Sound';
Blockly.Msg.CATEGORY_EVENTS = 'Events';
Blockly.Msg.CATEGORY_CONTROL = 'Control';
Blockly.Msg.CATEGORY_SENSING = 'Sensing';
Blockly.Msg.CATEGORY_OPERATORS = 'Operators';
Blockly.Msg.CATEGORY_VARIABLES = 'Variables';
Blockly.Msg.CATEGORY_MYBLOCKS = 'My Blocks';
Blockly.Msg.CATEGORY_SENSING_CAMERA = 'Camera';
// Context menus
Blockly.Msg.COPY = 'Copy';
Blockly.Msg.PASTE = 'Paste';
Blockly.Msg.DUPLICATE = 'Duplicate';
Blockly.Msg.DELETE = 'Delete';
Blockly.Msg.ADD_COMMENT = 'Add Comment';
Blockly.Msg.REMOVE_COMMENT = 'Remove Comment';
Blockly.Msg.DELETE_BLOCK = 'Delete Block';
Blockly.Msg.DELETE_X_BLOCKS = 'Delete %1 Blocks';
Blockly.Msg.DELETE_ALL_BLOCKS = 'Delete all %1 blocks?';
Blockly.Msg.CLEAN_UP = 'Clean up Blocks';
Blockly.Msg.HELP = 'Help';
Blockly.Msg.UNDO = 'Undo';
Blockly.Msg.REDO = 'Redo';
Blockly.Msg.EDIT_PROCEDURE = 'Edit';
Blockly.Msg.SHOW_PROCEDURE_DEFINITION = 'Go to definition';
Blockly.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT = 'Say something...';

// Color
Blockly.Msg.COLOUR_HUE_LABEL = 'Color';
Blockly.Msg.COLOUR_SATURATION_LABEL = 'Saturation';
Blockly.Msg.COLOUR_BRIGHTNESS_LABEL = 'Brightness';
Blockly.Msg.SILDER = 'Rate/Speed';
// Variables
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.CHANGE_VALUE_TITLE = 'Change value:';
Blockly.Msg.RENAME_VARIABLE = 'Rename variable';
Blockly.Msg.RENAME_VARIABLE_TITLE = 'Rename all "%1" variables to:';
Blockly.Msg.RENAME_VARIABLE_MODAL_TITLE = 'Rename Variable';
Blockly.Msg.NEW_VARIABLE = 'Make a Variable';
Blockly.Msg.NEW_VARIABLE_TITLE = 'New variable name:';
Blockly.Msg.VARIABLE_MODAL_TITLE = 'New Variable';
Blockly.Msg.VARIABLE_ALREADY_EXISTS = 'A variable named "%1" already exists.';
Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE = 'A variable named "%1" already exists for another variable of type "%2".';
Blockly.Msg.DELETE_VARIABLE_CONFIRMATION = 'Delete %1 uses of the "%2" variable?';
Blockly.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE = 'Can\'t delete the variable "%1" because it\'s part of the definition of the function "%2"';
Blockly.Msg.DELETE_VARIABLE = 'Delete the "%1" variable';

// Custom Procedures
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.NEW_PROCEDURE = 'Make a Block';
Blockly.Msg.PROCEDURE_ALREADY_EXISTS = 'A procedure named "%1" already exists.';
Blockly.Msg.PROCEDURE_DEFAULT_NAME = 'block name';
Blockly.Msg.PROCEDURE_USED = 'To delete a block definition, first remove all uses of the block';

// Lists
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.NEW_LIST = 'Make a List';
Blockly.Msg.NEW_LIST_TITLE = 'New list name:';
Blockly.Msg.LIST_MODAL_TITLE = 'New List';
Blockly.Msg.LIST_ALREADY_EXISTS = 'A list named "%1" already exists.';
Blockly.Msg.RENAME_LIST_TITLE = 'Rename all "%1" lists to:';
Blockly.Msg.RENAME_LIST_MODAL_TITLE = 'Rename List';
Blockly.Msg.DEFAULT_LIST_ITEM = 'thing';
Blockly.Msg.DELETE_LIST = 'Delete the "%1" list';
Blockly.Msg.RENAME_LIST = 'Rename list';

// Broadcast Messages
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.NEW_BROADCAST_MESSAGE = 'New message';
Blockly.Msg.NEW_BROADCAST_MESSAGE_TITLE = 'New message name:';
Blockly.Msg.BROADCAST_MODAL_TITLE = 'New Message';
Blockly.Msg.DEFAULT_BROADCAST_MESSAGE_NAME = 'message1';
