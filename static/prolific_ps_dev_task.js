// Adapted for COVID ONLINE study by VS DevCompyPsy March 2020 


//IN THIS VERSION, THE KEYBOARD RESPONSE IS CODED WITH KEYDROWN.JS
//IE RESPONSE IS NOT DEPENDENT ON KEY DELAY REPEAT RATE



/**********************
 * Domain general code *
 **********************/

// Helper functions

// Assert functions stolen from
// http://aymanh.com/9-javascript-tips-you-may-not-know#assertion


function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};

function assert(exp, message) {
	if (!exp) {
        throw new AssertException(message);
	}
}


function numberRange (start, end) {
  return new Array(end - start).fill().map((d, i) => i + start);
}


function insert_hidden_into_form(findex, name, value ) {
  var form        = document.forms[findex];
  var hiddenField = document.createElement('input');
  hiddenField.setAttribute('type', 'hidden');
  hiddenField.setAttribute('name', name);
  hiddenField.setAttribute('value', value );
  form.appendChild( hiddenField );
}

function shuffle(o){
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

//function to calculate normal distribution
// Standard Normal variate using Box-Muller transform.
function randn() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }


//summing numbers in arrays together
Array.prototype.SumArray = function (arr) {
  var sum = this.map(function (num, idx) {
    return num + arr[idx];
  });

  return sum;
};

//modulus after division functions
function mod(x,y){
  var mod = x - Math.floor(x/y)*y;
  return mod;
}

// linspace function
function linspace(a,b,n) {
  if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
  if(n<2) { return n===1?[a]:[]; }
  var i,ret = Array(n);
  n--;
  for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
  return ret;
}

//function to calculate coordinates on the circle. the position is basically the angle.
function circleCoor(steps, centerX, centerY, radius) {

  var xValues1=[];
  var yValues1=[];

  for (i = 0; i < steps; i++) {

    var xValues = (centerX + radius * Math.cos(Math.PI * i / steps*2-Math.PI/2));
    var yValues = (centerY + radius * Math.sin(Math.PI * i / steps*2-Math.PI/2));
    var xValues1=xValues1.concat(xValues);
    var yValues1=yValues1.concat(yValues);
  }

  return { x:xValues1,
    y:yValues1
  };
}

function add(a, b) {
    return a + b;
}

function range (low, high, step) {
    var matrix = [];
    var inival, endval, plus;
    var walker = step || 1;
    var chars = false;

    if (!isNaN(low) && !isNaN(high)) {
        inival = low;
        endval = high;
    } else if (isNaN(low) && isNaN(high)) {
        chars = true;
        inival = low.charCodeAt(0);
        endval = high.charCodeAt(0);
    } else {
        inival = (isNaN(low) ? 0 : low);
        endval = (isNaN(high) ? 0 : high);
    }
    plus = ((inival > endval) ? false : true);
    if (plus) {
        while (inival <= endval) {
            matrix.push(((chars) ? String.fromCharCode(inival) : inival));
            inival += walker;
        }
    } else {
        while (inival >= endval) {
            matrix.push(((chars) ? String.fromCharCode(inival) : inival));
            inival -= walker;
        }
    }
    return matrix;
}


function confConvert(canvas_xCenter,conf_barWidth,newConf)
{
	var conf_pos = (canvas_xCenter-conf_barWidth/2)+5*newConf;
	return conf_pos;
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

/********************
 * TASK-GENERAL CODE *
 ********************/
// Globals defined initially.
var keydownfun = function() {};

// Mutable global variables
var datastring         = "";
var feedbackDatastring = "";
var payment            = "";
var bonusPayFin        = 0;
var set_cond           = [2]; // shuffle([1,2]); // set conditions for the task
var is_training        = true;  // orig true hasn't started practice trials yet
var is_quiz            = false;  //default false is going to do the instruction quiz
var q                  = -1;     //UNUSED TO BE REMOVED this the counter for the questionnaires
var last_block         = false;
var data_expReset      = 1;     //this is the counter for how many times they reset the exp bc they failed the confidence
var data_pracReset     = 1;     //this is the counter for how many times they reset the prac bc they failed the instructions
/*************
 * Finishing  up related stuff  *
 *************/

//this is the first page,
 var demoquestionnaire = function(){
//  var timestamp = new Date().getTime();
 	showpage('ps_instruct_demoq');
 	$("#continue").click(function () {
                        finish();
                        startInstruc();
                          });
 };

 var startInstruc = function(){
	 instructobject = new Instructions(['ps_instruct_1','ps_instruct_2','ps_instruct_3','ps_instruct_4','ps_instruct_5','ps_instruct_6']);
	 finish();
	 startTask();
 };


//this function starts the quitter code - ie will post incomplete data and warn about leaving th experiment
 var startTask = function () {
 	window.onbeforeunload = function(){
 	console.log("Premature quitting!");
	var endTime = new Date().toISOString().substr(0, 19);
     	$.ajax("quitter", {
                type: "POST",
                async: false,
                data: {prolific_id: prolific_id, datastring: datastring,when:endTime}
                });
    alert( "By leaving this page, you opt out of the experiment.  You are forfeiting your payment. Please confirm that this is what you meant to do." );
 		return "By leaving this page, you opt out of the experiment. You are forfeiting your payment. Please confirm that this is what you meant to do. Are you sure you want to leave the experiment?";
 	};
 };

 var instruction_quiz = function(){
 	showpage('ps_instruct_quiz');
 	$("#continue").click(function () {
                          finish();
                          CheckAnswers();
                          });
 };

 var CheckAnswers = function() {

     $('select').each( function(i, val) {
//correct answers are 4, 3, 3, 2, 4
                      if(this.id =="coinAimCheck"){
                      correct = (this.value == 3)? 1 : 0; // this is modified for kids 
                         if(correct === 0){
                         instructobject = new Instructions(['ps_instruct_0','ps_instruct_1','ps_instruct_2', 'ps_instruct_3','ps_instruct_4','ps_instruct_5','ps_instruct_6']);
												 	data_pracReset++;
                      is_quiz     = true;
											is_training = true;
                      startTask();
                      return false;
                         }
                      }

                      else if(this.id =="coinFlyCheck"){
                      correct = (this.value == 3)? 1 : 0;
                         if(correct === 0){
                         instructobject = new Instructions(['ps_instruct_0','ps_instruct_1','ps_instruct_2','ps_instruct_3','ps_instruct_4','ps_instruct_5','ps_instruct_6']);
												 data_pracReset++;
                      is_quiz = true;
											is_training = true;
                      startTask();
                      return false;
                         }
                      }

                      else if(this.id == "confRateCheck"){
                      correct = (this.value == 2)? 1 : 0;
                         if(correct === 0){
                         instructobject = new Instructions(['ps_instruct_0','ps_instruct_1','ps_instruct_2', 'ps_instruct_3','ps_instruct_4','ps_instruct_5','ps_instruct_6']);
												 	data_pracReset++;
                      is_quiz = true;
											is_training = true;
                      startTask();
                      return false;
                         }
                      }

											else if(this.id =="HighConfCheck"){
											correct = (this.value == 2)? 1 : 0;
												 if(correct === 0){
												 instructobject = new Instructions(['ps_instruct_0','ps_instruct_1','ps_instruct_2','ps_instruct_3','ps_instruct_4','ps_instruct_5','ps_instruct_6']);
												 	data_pracReset++;
											is_quiz = true;
											is_training = true;
											startTask();
											return false;
												 }
											}

											else if(this.id == "LowConfCheck"){
											correct = (this.value == 3)? 1 : 0;
												 if(correct === 0){
												 instructobject = new Instructions(['ps_instruct_0','ps_instruct_1','ps_instruct_2', 'ps_instruct_3','ps_instruct_4','ps_instruct_5','ps_instruct_6']);
											data_pracReset++;
											is_quiz = true;
											is_training = true;
											startTask();
											return false;
												 }
											}


                      });
     if(correct ==1){ //if all correct, head on to start page for actual experiment
     instructobject = new Instructions(['ps_instruct_7']);
     is_quiz     = false; //finished instruction quiz
     is_training = false;//just going to start practice round
     startTask();
     }

 };

var finish = function () {
	window.onbeforeunload = function(){ };
};


//this is needed because if keys are on, then cannot type for the medlist questSection
//hence this is to remove the eventlisteners
var removeListener = function (){
		$(window).off('keydown');
    $(window).off('keyup');
  	$(window).off('blur');

};


var endExp = function(){

    kd.stop(); //to stop the kd run that was ran earlier (no keyboard response from now on!)
    removeListener(); //this is so that you can type in the medlist
    var endTime = new Date().toISOString().substr(0, 19);

    showpage('q_exp');
    $("#continue").click(function () {
                          confirm();
                          finish();
                           });

    console.log('Saving Task and Bonus data');
    
    $.ajax("done", {
      type: "POST",
      async: false,
      data: {prolific_id:prolific_id,datastring: datastring, when:endTime},
    });

    return false;
  };



var confirm = function(){
  showpage('debriefing')
  return false;
  };


/********************
 * HTML snippets
 ********************/
var pages = {};

var showpage = function(pagename) {
	$('body').html( pages[pagename] );
};

var pagenames = [
                 "ps_instruct_quiz",
                 "test",
                 "q_exp",
                 "debriefing",
                ];

/************************
 * CODE FOR INSTRUCTIONS *
 ************************/


var Instructions = function( screens ) {

    var that = this,
    currentscreen = "",
    endTime;

	for( i=0; i<screens.length; i++) {
		pagename = screens[i];
	    if(pagename.indexOf('instruct') !== -1){ //(pagename.slice(0,8)==='instruct'){
            $.ajax({
                   url: pagename + ".html",
                   success: function(pagename){ return function(page){ pages[pagename] = page; }; }(pagename),
                   async: false
                   });
	    }
	}


	this.nextForm = function () {
	var next = screens.shift();
        if(next === 'is_quiz'){
		    instruction_quiz();
        return false;
        }
        else if(next === 'demo'){
		    demoquestionnaire();
		    return false;
        }

	currentscreen = next;
	showpage( next );
//	timestamp = new Date().getTime();
        if ( screens.length === 0 ){
		    $('.continue').click(function() {
            // that.recordtrial();
            that.startTask();
            });
        }
        else{
        $('.continue').click( function() {
            // that.recordtrial();
            that.nextForm();
            });
        }
	};

	this.startTask = function() {
	    $.ajax({
               url: "test.html",
               success: function(pagename){ return function(page){ pages[pagename] = page; }; }(pagename),
               async: false
               });
	    testobject = new ExptPhase();
	};
	this.nextForm();
};

/********************
 * FOR KEYDROWN (needs to be run ONLY ONCE, HENCE OUT OF THE EXPTPHASE)   *
 ********************/
kd.run(function () {
					kd.tick();
 });


/********************
 * CODE FOR TEST     *
 ********************/

var ExptPhase = function() {
    var i;
    // var window_focus = true;
    var that = this; // make 'this' accessble by privileged methods

		// for keyboard functions
    //var leftKey = 37;
    //var rightKey = 39;
    //var spaceKey = 32;

    //colour details
    var col_white           = '#FFFFFF';// aka rgb 255 255 255
    var col_black           = '#000000';// aka rgb 000 000 000
    var col_white           = '#FFFFFF'
    var col_background      = '#3F3979';// aka rgb 128 128 128
    var col_confBar         = '#E5E5E5';// aka rbg 229 229 229
    var col_green           = '#00FF00';// aka rgb 0 255 0
    var col_red             = '#FF0000'; //aka rgb 255 0 0
    var col_bucket          = '#FF8000'; //aka 255 128 0
    var col_money           = '#FFE500'; //aka rgb 255 299 0
    var col_iconFront 		 	= '#FCE300' ;// 252 227 0
    var col_iconBack  			= '#FAA500'; //250 165 0

    // Open window and window data
    var canvas_width   = 800;
    var canvas_height  = 600;
    var canvas_xCenter = canvas_width/2;
    var canvas_yCenter = canvas_height/2;

    //Time variables
    //var time_deadLine       = 2500;                       // deadline for response
    var time_ISI            = 800;                          // time between confirm and dot shoot
    var time_RSI            = 500;                          // time between two key presses
    var time_ITI            = 800;                          // intertrialinterval
   // var time_EBI            = 1000;                       // end block interval
    var time_dotSpeed       = 500;      // how many frames to reach other side? (seconds -> frames)

    // Stimulus variables
    var stim_std            = 12;
    var stim_staHazRate     = 0.025; //4 changes in 150 trials (or 3, because the first one signals change)
	//	var stim_midHazRate     = 0.08; //eight changes in 100 trials
    var stim_volHazRate     = 0.125; //19 changes in 150 trials (or 18, because the first one signals change)
		var stim_pracHazRate	  = 0.025; // orig 0.01 
    var stim_cirDia         = 500; // diameter of big circle (every degree = 4 px)
    var stim_cirThickness   = 15;
    var stim_cirNPos        = 360; // number of possible end points on circle
    var stim_innerCirDia    = stim_cirDia-stim_cirThickness; //to draw inner circle to get a ring
    var stim_dotDia         = 8; // radius (or dia?) of money dots (in px?)
    var stim_bucketDepth    = 50;
    var stim_bucketDia      = stim_cirDia + stim_bucketDepth;
    var stim_bucketSize     = stim_std*3; //bucket is 3 sd of distribution //this is in degrees
    var stim_bucketSpeed    = 2.0;//1.5 was
    var stim_fixDia         = 9; //dia of the fixation circle
    var stim_moneyDia       = 20;
    var stim_moneyAmt       = 10; //how much win or lose per trial
    var stim_coord = circleCoor(stim_cirNPos, canvas_xCenter, canvas_yCenter, (stim_cirDia-stim_dotDia)/2);

    //confidence bar variables
    var  conf_barHeight       = 20; //20
    var  conf_barWidth        = 500;
		var  conf_barSpeed        = 1; //was 2
		var  conf_indRand         = [25,75];
    var  conf_indHeight       = conf_barHeight+10; //for the indicatior
    var  conf_indWidth        = conf_barWidth/100;
    var  conf_range           = [1,100]; // min and max value of conf?
		var  conf_check           = []; //this is for the array to check if they moved their confidence or not
		var  conf_checkTrial      = 20; //how many trials before checking how many they kept choosing the same
		var  conf_checkTrial2     = 50;

    // THIS IS TO CALCULATE CPP AND PRESET PARTICLE LOCATION (IN DEGREES) FOR STABLE AND VOLATILE BLOCKS
 		var nCond          = set_cond.length; // just one condition with High Hazard rate 
    var nTrialsPerCond = 150; // 150; 
		var nTrialsPrac    = 10;   // DEBUG ORIG = 10
		var nTrialsTotal   = nTrialsPerCond*nCond; // 1 condition 
		var nBlocks        = 3;   //  3 blocks of 50 trials each DEBUG ORIG = 5 
		var nTrialsPerBlock= Math.floor(nTrialsTotal/nBlocks); //this has to be divisible by nBlocks


		////////////////////////
		//data variables that will change with every trial
		var data_expStart       = -1; // start of experiment
		var data_expEnd         = -1; // end of experiment
		var data_expDur         = -1; // duration of experiment
		var data_trialStart     = -1; // start of trial
		var data_trialEnd       = -1; // end of trial
		var data_trialDur       = -1; // duration of trial
		var data_nTrial         = 0; //index for overall trial number
		var data_nTrialPrac     = 0; //index for practice trial number
		var data_nBlock 			  = 1; //index for block number
		var data_nTrialInBlock  = 0; //index for trial number per resting block (resets)
		var data_nTrialInCond   = 0; //index for trial number in one condition block
		var data_nCond          = -1; //index for condition block number
		var data_condition      = -1; //index for stable or volatile block
	//	var data_refLoc         = -1; //index where particle actually shoots to
		var data_changePoint    = -1; // index if particle is at a change point trial
		var data_buckPos        = Math.floor(Math.random()*stim_cirNPos); //where bucket position was chosen //it is random on trial 1
		var data_buckPosRT      = -1; //how long to choose bucket postion
		var data_conf           = -1; //confidence rating
		var data_confRTStart    = -1; //conf start time
  	var data_confRTEnd      = -1; //conf end time
		var data_confRT         = -1; //how long to set confidence
		var data_hitMiss        = -1; //basically accuracy
		var data_trialReward    = -1; //gain or lose per trial
		// var data_blockReward    = -1; //total gain or lose for particular block
		var data_totalReward    = 0; //running total of how many coins (start with 0?)


		//this is to append to datastring?
		var data = {
		nTrial         : -1, //index for  overall trial number
		trialStart     : -1, // start of trial
		trialEnd       : -1, // end of trial
		trialDur       : -1, // duration of trial
		nCond          : -1, //index for condition block number
		condition      : -1, //index for stable or volatile block
		nTrialInCond   : -1, //index for trial number in one condition block
		nBlock         : -1, //index for block number
		nTrialinBlock  : -1, //index for trial number per resting block (resets)
		hazRate        : -1, //index for hazRate set...
		refLocMean     : -1, //index where particle mean
		refLoc         : -1, //index where particle actually shoots to
		changePoint    : -1, //whether it is a change point trial or not
		buckPos        : -1, //where bucket position was chosen
		buckPosRT      : -1, //how long to choose bucket postion
		conf           : -1, //confidence rating
		confRTStart    : -1, //conf start time
		confRT         : -1, //how long to set confidence
		hitMiss        : -1, //basically accuracy
		trialReward    : -1, //gain or lose per trial
		// blockReward    : -1, //total gain or lose for particular block
		totalReward    : 0, //running total of how many coins (start with 0?)
		confOri        : -1, //this is the default conf 25/75
		reset          : -1, //this is to see how many times they had to reset the expt because of confidence

		to_array: function() {
				var arr = [];
				var _this = this;
				Object.keys(this).forEach(function (key) {
						if(key != 'to_array'){
								arr.push(_this[key]);
						}
				});
				return arr;
		}
	};


		//confidence variables - these need to be global because of drawing the indicator in global space
		var newConf  = shuffle(conf_indRand)[0];//calculating new x pos for confidence bar position, this returns it to 50 on every trial
		var prevConf = newConf;
		var conf_pos = confConvert(canvas_xCenter,conf_barWidth,newConf);

    showpage('test'); //this is the empty html

/// functions to draw the task stimuli

//functions like drawing circle...
//this one will draw the ring and the fixation dot all in white
function draw_defaultCircle(canvas_xCenter, canvas_yCenter, stim_cirDia, stim_innerCirDia, stim_dotDia, col_white, col_background) {

	var outerCircle = paper.circle(canvas_xCenter, canvas_yCenter, stim_cirDia / 2).attr({
		stroke: col_white,
		fill: col_white
	});
	var innercircle = paper.circle(canvas_xCenter, canvas_yCenter, stim_innerCirDia / 2).attr({
		stroke: col_white,
		fill: col_background
	});
	var fixDot = paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
		stroke: col_white,
		fill: col_white
	});

	return fixDot;
}

//this will draw the bucket both the orange ring and grey out the white ring for that part as well
//bucket pos is the degree where the bucket position starts from... 0 to 359
function draw_bucket(canvas_xCenter, canvas_yCenter, stim_cirDia, stim_innerCirDia, stim_bucketDia, stim_bucketSize, col_bucket, col_background, bucket_pos) {
	//the inputs are in degrees
	//this is for the orange part
	var bucket1 = paper.path().attr({
		stroke: col_bucket,
		fill: col_bucket,
		"stroke-width": 1,
		arc: [canvas_xCenter, canvas_yCenter, bucket_pos, bucket_pos + stim_bucketSize, stim_cirDia / 2, stim_bucketDia / 2]
	});
	//this is for the grey part
	var bucket2 = paper.path().attr({
		stroke: col_background,
		fill: col_background,
		"stroke-width": 2,
		arc: [canvas_xCenter, canvas_yCenter, bucket_pos, bucket_pos + stim_bucketSize, stim_innerCirDia / 2, stim_cirDia / 2]
	});

	return {
		bucket1:bucket1,
		bucket2: bucket2
	};

}

//this will draw the confidence box
function draw_confBar(canvas_xCenter, canvas_height, conf_barWidth, conf_barHeight,col_confBar, col_white) {
	//confidence box
	var confBar = paper.rect(canvas_xCenter - (conf_barWidth / 2), canvas_height + 10, conf_barWidth, conf_barHeight).attr({
		stroke: col_white,
		"stroke-width": 3,
		fill: col_confBar
	});

	//confidence text
	var confBegin = paper.text(canvas_xCenter - (conf_barWidth / 2), canvas_height - 5, "very uncertain").attr({
		stroke: col_white,
		"font-size": 25,
		fill: col_white
	});
	var confEnd = paper.text(canvas_xCenter + (conf_barWidth / 2), canvas_height - 5, "very certain").attr({
		stroke: col_white,
		"font-size": 25,
		fill: col_white
	});

	return {confBar:confBar,
	confBegin:confBegin,
	confEnd:confEnd
	};
}

//this will draw the confIndicator (this is the thing that will need to redraw....)
//confidence indicator..conf_pos is where the indicator is placed, in dot coord. middle is canvas_xCenter
function draw_confInd(canvas_height, conf_indWidth, conf_indHeight, col_bucket, conf_pos) {
	var confInd = paper.rect(conf_pos-(conf_indWidth/2), canvas_height + 10, conf_indWidth, conf_indHeight).attr({
		stroke: col_bucket,
		"stroke-width": 2,
		fill: col_bucket
	});
	return confInd;
}

//moneyAmt should be a string saying how much points they have currently
function draw_confText(canvas_height, canvas_width,col_white) {

	var confText = paper.text(canvas_width/2, canvas_height-10, "Rate your confidence").attr({
		stroke: col_white,
		"font-size": 18,
		"font-family":" Verdana, Helvetica, sans-serif",
		fill: col_white
	});
	return confText;
}


//this will draw the money indicator
//money indicator (score beside coin icon)
function draw_moneyCoin(canvas_width, stim_moneyDia, col_iconFront, col_iconBack) {
	var money1 = paper.circle(canvas_width - 110, 50, stim_moneyDia / 2).attr({
		stroke: col_iconBack,
		"stroke-width": 2,
		fill: col_iconFront
	});
	var money2 = paper.circle(canvas_width - 100, 38, stim_moneyDia / 2).attr({
		stroke: col_iconBack,
		"stroke-width": 2,
		fill: col_iconFront
	});
}


//moneyAmt should be a string saying how much points they have currently
function draw_moneyText(canvas_width, col_white, money_Amt) {

	var moneyInd = paper.text(canvas_width - 52, 44, money_Amt).attr({
		stroke: col_white,
		"font-size": 30,
		fill: col_white
	});
	return moneyInd;
}

//function to animate time_dotSpeed
//dot_pos is the degree where the dot will be shot
function draw_dotShoot(canvas_xCenter, canvas_yCenter, stim_coord, stim_cirDia, stim_dotDia, col_money, time_dotSpeed, dot_pos) {
	//particles shooting out
	var particle = paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
		stroke: col_money,
		fill: col_money
	});
	//cx and cy are where the dot lands in the end, inputs is pix position, not degrees from circle..
	//ill need something to convert degrees into pix position, depending on area of circle?
	//  particle.animate( {cx:stim_coord.x[dot_pos], cy: stim_coord.y[dot_pos] }, time_dotSpeed, "linear", function() {particle.animate({opacity: 0 }, 10);  }); //this makes sure the particle goes to zero opacity in 10 seconds
	particle.animate({
		cx: stim_coord.x[dot_pos],
		cy: stim_coord.y[dot_pos]
	}, time_dotSpeed, "linear", function() {
		particle.remove();
	}); //this makes the particle disappear (remove element...)

}

function draw_pracConfirmText(canvas_height, canvas_width,col_white) {

	var pracConfirmText = paper.text(canvas_width/2, canvas_height/2+80, "Press the SPACEBAR to confirm its position.").attr({
		stroke: col_white,
		"font-size": 20,
		"font-family":" Verdana, Helvetica, sans-serif",
		fill: col_white
	});

	return pracConfirmText;
}



function draw_pracConfText(canvas_height, canvas_width,col_white) {

	var pracConfText1 = paper.text(canvas_width/2, canvas_height/2+40, "Press the RIGHT arrow key if you feel \nMORE certain.").attr({
		stroke: col_white,
		"font-size": 20,
		"font-family":" Verdana, Helvetica, sans-serif",
		fill: col_white
	});

	var pracConfText2 = paper.text(canvas_width/2, canvas_height/2-40, "Press the LEFT arrow key if you feel \nLESS certain.").attr({
		stroke: col_white,
		"font-size": 20,
		"font-family":" Verdana, Helvetica, sans-serif",
		fill: col_white
	});


	return {pracConfText1:pracConfText1,
	pracConfText2:pracConfText2
};
}

function draw_pracText(canvas_height, canvas_width,col_white) {
  
	var pracText1 = paper.text(canvas_width/2, canvas_height/2+40, "Press LEFT or RIGHT arrow keys to \nmove the bucket on the ring.").attr({
		stroke: col_white,
		"font-size": 20,
		"font-family":" Verdana, Helvetica, sans-serif",
		fill: col_white,
  });

	var pracText2 = paper.text(canvas_width/2, canvas_height/2-40,"").attr({
		stroke: col_white,
		"font-size": 20,
		"font-family":" Verdana, Helvetica, sans-serif",
		fill: col_white,
  });


	return {pracText1:pracText1,
	pracText2:pracText2
};
}

// function to caluclate experiment condition
		function stim_locVariables(nTrialsPerCond,stim_HazRate){

		// where the dots will land is precaluclated beore experiment starts and positions are all stored in the vars below
		var stim_refLocMean=[]; //where the current mean is
		var stim_locDiff =[]; //the deviation from mean of 0

		var nChangePoint = Math.round(nTrialsPerCond*stim_HazRate);

//this is if with very little trials and low H rate, the code will break bc array cannot be made
		if (nChangePoint<1){
		var nChangePointFin = 1; //ensures there is at least one changepoint (the starting one)
		}else{
		var nChangePointFin = nChangePoint;
		}
		var Ntrial = Array(nTrialsPerCond-nChangePoint).fill(0);
		var CPtrial =Array(nChangePointFin-1).fill(1);
		var stim_changePointTemp = shuffle(CPtrial.concat(Ntrial));
		var stim_changePoint = [1].concat(stim_changePointTemp);

		      for (t = 0; t < nTrialsPerCond; t++){

			        stim_locDiff = stim_locDiff.concat(Math.round(Math.randomGaussian(0,stim_std))); //this is with the math.gaus library

		              if (stim_changePoint[t] == 1) {
		                var currLoc = Math.round((stim_cirNPos-1)*Math.random()); //its ok to be zero? since its 0 to 359 here
		                stim_refLocMean = stim_refLocMean.concat(currLoc);
		              }else{
		                currLoc = Math.round(stim_refLocMean[t-1]);
		                stim_refLocMean=stim_refLocMean.concat(currLoc);
		                }
		              }

		      // Put samples around reference location
		      var stim_refLoc     = stim_refLocMean.SumArray(stim_locDiff); // adding the 12 sd random pick to mean
		      //this is to ensure if loc goes negative, it still spits out the correct location
		      var stim_refLocFin = [];

		      for (w=0; w<stim_refLoc.length; w++)
		      {
		        var LocTemp = mod(stim_refLoc[w],stim_cirNPos);
		        stim_refLocFin= stim_refLocFin.concat(LocTemp);
		      }
		      return {
            stim_refLocMean: stim_refLocMean,
		        stim_refLocFin: stim_refLocFin,
		        stim_changePoint: stim_changePoint
		      };

		}


//KEYBOARD RESPONSES (THIS IS CODED WITH KEYDROWN JS TO REMOVE THE KEYBOARD DELAY REPEAT ISSUE)
//IF PRESS LEFT ARROW KEY
kd.LEFT.down(function () {
if (buckListening){ //THIS IS FOR BUCKET RESPONSE
  buck_move    = -stim_bucketSpeed; //if bucketSpeed is 2, then it moves 2deg each time the key is pressed
  data_buckPos = Math.round(data_buckPos + buck_move);

  if (data_buckPos > 360 || data_buckPos <= 0) { //making sure the bucket stayed between 0 and 359
    data_buckPos = mod(data_buckPos,stim_cirNPos);
  }else {
    data_buckPos = data_buckPos;
  }

  bucket.bucket1.remove();
  bucket.bucket2.remove();
  bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_bucket,col_background,data_buckPos);

} else if (confListening){ //THIS IS FOR CONFIDENCE RESPONSE

  conf_move = -conf_barSpeed;
  newConf = prevConf + conf_move;

  if (newConf < 1 || newConf > 100) { //making sure the conf doesnt go out of bounds
    newConf = prevConf;
  } else {
    prevConf = newConf;
  }

  var data_conf = newConf;
  conf_pos = confConvert(canvas_xCenter,conf_barWidth,data_conf);
  //conf_pos is the dot coordinate
  //need to convert conf into dot coordinate
  confInd.remove();
  confInd = draw_confInd(canvas_height, conf_indWidth, conf_indHeight, col_bucket, conf_pos); //draw final conf rating

  data.conf = data_conf;

} else {
  // console.log("ERROR AT PRESSING LEFT");
  return false;
}

});

//IF PRESS right ARROW KEY
kd.RIGHT.down(function () {
if (buckListening){
  buck_move    = stim_bucketSpeed; //if bucketSpeed is 2, then it moves 2deg each time the key is pressed
  data_buckPos = Math.round(data_buckPos + buck_move);

  if (data_buckPos > 360 || data_buckPos <= 0) {
    data_buckPos = mod(data_buckPos,stim_cirNPos);
  }else {
    data_buckPos = data_buckPos;
  }

  bucket.bucket1.remove();
  bucket.bucket2.remove();
  bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_bucket,col_background,data_buckPos);

} else if (confListening){
  conf_move = conf_barSpeed;
  newConf = prevConf + conf_move;

  if (newConf < 1 || newConf > 100) { //making sure the conf doesnt go out of bounds
    newConf = prevConf;
  } else {
    prevConf = newConf;
  }

  var data_conf = newConf;
  conf_pos = confConvert(canvas_xCenter,conf_barWidth,data_conf);
  //conf_pos is the dot coordinate
  //need to convert conf into dot coordinate
  confInd.remove();
  confInd = draw_confInd(canvas_height, conf_indWidth, conf_indHeight, col_bucket, conf_pos); //draw final conf rating

  data.conf = data_conf;

}else{
  // console.log("ERROR AT PRESSING RIGHT");
  return false;

}
});

//this is space bar PRESS (ie key has to be released before response is made)
kd.SPACE.press(function () {
if (buckListening){

  buckListening = false;
  data_buckPosRT= new Date().getTime() - data_trialStart - data_expStart;
  data.buckPos = data_buckPos;
  data.buckPosRT = data_buckPosRT;
	// console.log("Bucketposition is " +data.buckPos);

  setTimeout(function() {
    draw_conf();
  }, time_RSI); }
  else if (confListening){
    confListening = false;
    data_confRTEnd = new Date().getTime() - data_expStart;
    data_confRT = data_confRTEnd - data_confRTStart;
    data.confRT = data_confRT;
		// console.log("Confposition is " +data.conf);

    setTimeout(function() {
      draw_dot();

    }, time_ISI);

  }
  else if (progListening){ //this is for the breaks

progPage.remove();
progPageText.remove();
progListening = false;

// THIS CHANGED: the user is redirected to the end of experiment instead of questionnaires 

if (last_block){
 endExp();
	}else{
	start_expt();
}
  }

  else{
    // console.log("ERROR AT PRESSING SPACE");
    return false;

  }
});


var draw_conf = function(){

if (is_training){
    pracText.pracText1.remove();
    pracText.pracText2.remove();
		pracConfText = draw_pracConfText(canvas_height,canvas_width,col_white);}

    //start of confidence rating
    data_confRTStart = new Date().getTime() - data_expStart;
    data.confRTStart = data_confRTStart;
		data.confOri     = shuffle(conf_indRand)[0]; //here is to code for the conf that is randomly presented
  	prevConf         = data.confOri;	//this is to reset confidence indicator to either 25 or 75 after every trial
		conf_pos         = confConvert(canvas_xCenter,conf_barWidth,prevConf);
		confInd          = draw_confInd(canvas_height, conf_indWidth, conf_indHeight, col_bucket, conf_pos); //if i dont decalre var, this is a global variable, hence i can remove or hide it in the other functions
		confText         = draw_confText(canvas_height,canvas_width,col_white);

    confBar.confBar.show();
		confBar.confBegin.show();
		confBar.confEnd.show();
		data.conf     = prevConf;//this is needed bc of the randomisation of the conf, so its 25 if 75 if dont move
    confListening = true;
};



var draw_dot = function(){
              //this gives the list of degrees on the circle that the bucket will catch the particle.
    var data_buckRangeTemp = numberRange(data_buckPos,data_buckPos+stim_bucketSize);
    var data_buckRange = data_buckRangeTemp.map(function(element) {
      return mod(element,360);
    });
    var dot_pos =-1;
		var dot_Mpos =-1;

    //this is calculate if the dot will hit the bucket
    //this calculates if the particle will land in the bucket
 if (!is_training) {
    if (data_condition==1) { //for stable condition
    dot_pos = locVarSta.stim_refLocFin[data_nTrialInCond-1];
		dot_Mpos = locVarSta.stim_refLocMean[data_nTrialInCond-1];
		data_changePoint = locVarSta.stim_changePoint[data_nTrialInCond-1];
		data.hazRate = stim_staHazRate;

	// }else if (data_condition==2) { //for mid condition
  //   dot_pos = locVarMid.stim_refLocFin[data_nTrialInCond-1];
	// 	dot_Mpos = locVarMid.stim_refLocMean[data_nTrialInCond-1];
	// 	data_changePoint = locVarMid.stim_changePoint[data_nTrialInCond-1];
	// 	data.hazRate = stim_midHazRate;
     }
		else if (data_condition==2) { //for volatile condition
			dot_pos = locVarVol.stim_refLocFin[data_nTrialInCond-1];
			dot_Mpos = locVarVol.stim_refLocMean[data_nTrialInCond-1];
			data_changePoint = locVarVol.stim_changePoint[data_nTrialInCond-1];
			data.hazRate = stim_volHazRate;
			}
		else{
    console.log('ERRRROOORRRRRR');
    dot_pos = -1;
		data_changePoint=-1;
		dot_Mpos=-1;
		data.hazRate =-1;
    }

	}else{ //for when its practice, it is the most stable lol
    dot_pos = locVarPrac.stim_refLocFin[data_nTrialPrac-1];
		dot_Mpos = locVarPrac.stim_refLocMean[data_nTrialPrac-1];
		data_changePoint = locVarPrac.stim_changePoint[data_nTrialPrac-1];
		data.hazRate = stim_pracHazRate;

pracConfText.pracConfText2.remove();
pracConfText.pracConfText1.remove();
pracConfirmText.remove();
	}

    data.refLoc = dot_pos;
		data.changePoint = data_changePoint;
		data.refLocMean =dot_Mpos;
		// console.log('DotshootMean ' +dot_Mpos);
		// console.log('DotshootActual ' +dot_pos);
	  // console.log('BucketrangebeforeModis ' +data_buckRangeTemp);
		// console.log('Bucketrangeis ' +data_buckRange);
    var data_hit = data_buckRange.includes(dot_pos);

		// console.log('Hit is' +data_hit);

    draw_dotShoot(canvas_xCenter, canvas_yCenter, stim_coord, stim_cirDia, stim_dotDia, col_money, time_dotSpeed, dot_pos);

      setTimeout(function() {

        if (data_hit===true) {
      paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
        stroke: col_green,
        fill: col_green
      });

			bucket.bucket1.remove();
			bucket.bucket2.remove();
			bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_green,col_background,data_buckPos);

      data_trialReward = stim_moneyAmt;
      data_totalReward = data_totalReward + data_trialReward;

      data.hitMiss= 1;

    }
    else {
      paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
        stroke: col_red,
        fill: col_red  });

				bucket.bucket1.remove();
				bucket.bucket2.remove();
				bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_red,col_background,data_buckPos);

        data_trialReward = -stim_moneyAmt;
        data_totalReward = data_totalReward +data_trialReward;

       data.hitMiss= 0;

      }

      data.trialReward= data_trialReward;
      data.totalReward = data_totalReward;

      //end of trial, replace money feedback
      moneyText.remove();
      moneyText = draw_moneyText(canvas_width, col_white, data_totalReward.toString()); //draw amount of money text
    }, time_dotSpeed);

    data_trialEnd = new Date().getTime() - data_expStart;
		data_trialDur = data_trialEnd - data_trialStart;
    data.trialDur = data_trialDur;
    data.trialEnd = data_trialEnd;

     setTimeout(reset_trial, time_dotSpeed + time_ITI);

	 };


	 var reset_expt = function(){

		 resetPage = paper.rect(0, 0, canvas_width, canvas_height+100).attr({
		 	stroke: col_background,
		 	fill: col_background
		 });

		 resetPageText = paper.text(canvas_xCenter, canvas_yCenter, "Unfortunately, you haven't been using the confidence scale properly! \nYou will be brought back to the instruction quiz in 10 seconds. \nPlease hold on.").attr({
				stroke: col_white,
				fill: col_white,
			"font-family":" Verdana, Helvetica, sans-serif",
			"font-size":16
			});

		 set_cond = [2]; // shuffle([1,2]); // reset conditions for the task
		 is_quiz = true; //is going to do the instruction quiz
		 data_expReset++;

	var backToBegin = function(){
	 	instructobject = new Instructions(['is_quiz']);
	};

		setTimeout(backToBegin, 10000); //reset in 10 seconds
		return false;
	 };

	 var reset_trial = function(){

		 //maybe here i can do the confidence check.....
		 if  (data.conf=== data.confOri){ //if participant used the default conf
			 conf_check  =conf_check.concat(1); //index as one
		 } else{
			 conf_check =conf_check.concat(0);  //otherwise index as zero
		 };
		  // console.log("Conf check: " +conf_check);


		 if  (data.nTrial === conf_checkTrial){ //if it is the 20th trial
			 var conf_sum = conf_check.reduce(add, 0); //add the checks together
			 // console.log("Conf1 fails: " +conf_sum);
			  // console.log("Conf check Sum: " +conf_sum);
        // console.log("On Trial: " +conf_checkTrial);

			 if (conf_sum/ conf_checkTrial> 0.7){ //check one at trial 20, if 0% if trials are stay, reset experiment
				 //reset everything
				 reset_expt();
			 }
				 else{
					 // console.log("Conf1 Clear!");

					 // console.log("Resetting trial.");
					 paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
						 stroke: col_white,
						 fill: col_white  });

						 confInd.remove();
						 confText.remove();
						 confBar.confBar.hide();
						 confBar.confBegin.hide();
						 confBar.confEnd.hide();
						 bucket.bucket1.remove();
						 bucket.bucket2.remove();
						 bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_bucket,col_background,data_buckPos);

						 datastring = datastring.concat(data.to_array(), "\n");

					 if (data_nBlock<nBlocks){

						 if (data_nTrialInBlock>nTrialsPerBlock-1){
							 progBreak();
						 }else{
							 start_expt(); //start from the begining?
						 }

					 }else{
						 start_expt();
					 }


				 }

			 }else if (data.nTrial === conf_checkTrial2){ //check two at trial 50
				 var conf_sum = conf_check.reduce(add, 0);
				 // console.log("Conf1 fails2: " +conf_sum);

				 if (conf_sum/ conf_checkTrial2> 0.7){ //check one at trial 50, if 70% if trials are stay, reset experiment
					 reset_expt();
				 }else{
					 // console.log("Conf2 Clear!");

					 // console.log("Resetting trial.");
					 paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
						 stroke: col_white,
						 fill: col_white  });

						 confInd.remove();
						 confText.remove();
						 confBar.confBar.hide();
						 confBar.confBegin.hide();
						 confBar.confEnd.hide();
						 bucket.bucket1.remove();
						 bucket.bucket2.remove();
						 bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_bucket,col_background,data_buckPos);

						 datastring = datastring.concat(data.to_array(), "\n");

					 if (data_nBlock<nBlocks){

						 if (data_nTrialInBlock>nTrialsPerBlock-1){
							 progBreak();
						 }else{
							 start_expt(); //start from the begining?
						 }

					 }else{
						 start_expt();
					 }



				 }

			 } else{

			// console.log("Resetting trial.");
			paper.circle(canvas_xCenter, canvas_yCenter, stim_dotDia / 2).attr({
				stroke: col_white,
				fill: col_white  });

				confInd.remove();
				confText.remove();
				confBar.confBar.hide();
				confBar.confBegin.hide();
				confBar.confEnd.hide();
				bucket.bucket1.remove();
		    bucket.bucket2.remove();
		    bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_bucket,col_background,data_buckPos);

				datastring = datastring.concat(data.to_array(), "\n");

     if (data_nBlock<nBlocks){

				if (data_nTrialInBlock>nTrialsPerBlock-1){
					progBreak();
				}else{
					start_expt(); //start from the begining?
				}

			}else{
				start_expt();
			}

		}

		};



var progBreak = function(){

progPage = paper.rect(0, 0, canvas_width, canvas_height+100).attr({
	stroke: col_background,
	fill: col_background
});

progPageText = paper.text(canvas_xCenter, canvas_yCenter, "Well done so far! \n \nYou have " +data_totalReward+ " points so far.\n \nYou may take a short break.\nPlease press SPACEBAR when you are ready to continue.").attr({
	stroke: col_white,
	fill: col_white,
"font-family":" Verdana, Helvetica, sans-serif",
"font-size":25
});


progListening = true;
data_nTrialInBlock=0; //reset block trial number
data_nBlock ++;

};



var draw_trial = function() {
  // console.log("Drawing trial - practice: " +data_nTrialPrac+ " or actual: " +data_nTrial);
	// buck_done = 0;
	buckListening = true;
	confListening = false;
	data_trialStart = new Date().getTime() - data_expStart;

	if(is_training){
	data.nTrial = data_nTrialPrac;
	pracText = draw_pracText(canvas_height, canvas_width,col_white);
	pracConfirmText = draw_pracConfirmText(canvas_height, canvas_width,col_white);
  data.reset = data_pracReset;
}
	else{
  data.nTrial = data_nTrial;
	data.reset = data_expReset;
}

  data.nTrialInCond  = data_nTrialInCond;
  data.nTrialinBlock = data_nTrialInBlock;
	data.nCond         = data_nCond;
	data.nBlock        = data_nBlock;
	data.trialStart    = data_trialStart;
	data.condition     = data_condition;


  };


var start_expt = function() {

		if(is_training){
			data_nTrialPrac ++;
			data_condition = 0;
			data_nCond=0;
			data_nBlock = 0;

			if(data_nTrialPrac > nTrialsPrac){ //when finish practice trials

				console.log("Practice Done!!! Uppi");
				is_quiz= true;
				instructobject = new Instructions(['is_quiz']);
				return false;
			}
			else { //when practical trials are still on going
				draw_trial();

			}
		}

//when it is not the practice
		else if (!is_training){
			data_nTrial ++;
			data_nTrialInCond ++;
			data_nTrialInBlock ++;
			data_condition = set_cond[condNum];
			data_nCond = condNum+1;

			if (condNum<set_cond.length-1) {

				if(data_nTrialInCond > nTrialsPerCond){ //when finish block 1 trials
					condNum =  condNum+1;
					data_nCond = condNum+1;
					data_condition = set_cond[condNum];
				  data_nTrialInCond = 1; //renew trial number
					draw_trial(); //just continue??? first trial for block 2
					return false;
				} else {
					draw_trial();
				}
			} else if (condNum==set_cond.length-1){

				if(data_nTrialInCond > nTrialsPerCond){ //when finish practice trials
					console.log("Game is over!");

					progPage = paper.rect(0, 0, canvas_width, canvas_height+100).attr({
						stroke: col_background,
						fill: col_background
					});

					var bonusPay =  1*(2*data_totalReward/(((1-stim_volHazRate)*stim_moneyAmt*nTrialsPerCond)+((1-stim_staHazRate)*stim_moneyAmt*nTrialsPerCond)));

					if (bonusPay<0) {
					 bonusPayFin = 0;
				 } else if(bonusPay>1)
					{
						bonusPayFin = 1;
					}
						else
				  { bonusPayFin = bonusPay.toFixed(2);
					}

					progPageText = paper.text(canvas_xCenter, canvas_yCenter, "Awesome! Game is over!\n \nYou finished with " +data_totalReward+ " points in total! You did better than most of your peers!\n \nPlease press SPACEBAR to finish\n").attr({
						stroke: col_white,
						fill: col_white,
					"font-family":" Verdana, Helvetica, sans-serif",
					"font-size":20
					});

          last_block    = true;
					progListening = true;
					return false;
				} else {
					draw_trial();
				}
			}

		}

	};


//////////////////////////////////////////////////// DRAWING TASK CANVAS
//// what to initailise at the start of the ExptPhase
// var paper =  Raphael("stim", canvas_width, canvas_height+100); //initialise canvas
//this code is to make sure that resizing when changing the width of the window works
//this works in tandem with the task.css code
var paper =  Raphael("stim");
paper.setViewBox(0,0,canvas_width,canvas_height+100,true);
paper.setSize('100%', '100%');

paper.canvas.style.backgroundColor = col_background; //initialise canvas to be grey

paper.customAttributes.arc = function (centerX, centerY, startAngle, endAngle, innerR, outerR) {
  var radians = Math.PI / 180,
  largeArc = +(endAngle - startAngle > 180),
  // calculate the start and end points for both inner and outer edges of the arc segment
  // the -90s are about starting the angle measurement from the top get rid of these if this doesn't suit your needs
  outerX1 = centerX + outerR * Math.cos((startAngle-90) * radians),
  outerY1 = centerY + outerR * Math.sin((startAngle-90) * radians),
  outerX2 = centerX + outerR * Math.cos((endAngle-90) * radians),
  outerY2 = centerY + outerR * Math.sin((endAngle-90) * radians),
  innerX1 = centerX + innerR * Math.cos((endAngle-90) * radians),
  innerY1 = centerY + innerR * Math.sin((endAngle-90) * radians),
  innerX2 = centerX + innerR * Math.cos((startAngle-90) * radians),
  innerY2 = centerY + innerR * Math.sin((startAngle-90) * radians);

  // build the path array
  var path = [
    ["M", outerX1, outerY1], //move to the start point
    ["A", outerR, outerR, 0, largeArc, 1, outerX2, outerY2], //draw the outer edge of the arc
    ["L", innerX1, innerY1], //draw a line inwards to the start of the inner edge of the arc
    ["A", innerR, innerR, 0, largeArc, 0, innerX2, innerY2], //draw the inner arc
    ["z"] //close the path
  ];
  return {path: path};
};

//TASK CONDITION VARIBALES
var locVarPrac = stim_locVariables(nTrialsPrac,stim_pracHazRate);
var locVarSta  = stim_locVariables(nTrialsPerCond,stim_staHazRate);
// var locVarMid = stim_locVariables(nTrialsPerCond,stim_midHazRate);
var locVarVol = stim_locVariables(nTrialsPerCond,stim_volHazRate); //this will make all particle locations and ccp points for the trial

//DRAWING THE STIMULI
var defaultCircle = draw_defaultCircle(canvas_xCenter, canvas_yCenter, stim_cirDia,stim_innerCirDia,stim_dotDia,col_white,col_background); //draw circle and fixation
var moneyCoin =  draw_moneyCoin(canvas_width,stim_moneyDia,col_iconFront,col_iconBack); //draw money icon
var moneyText = draw_moneyText(canvas_width,col_white,data_totalReward.toString()); //draw amount of money text
var bucket = draw_bucket (canvas_xCenter,canvas_yCenter, stim_cirDia, stim_innerCirDia,stim_bucketDia,stim_bucketSize,col_bucket,col_background,data_buckPos);
//draw bucket, start position is random?

//need to draw confindicator in global space so as to remove object during response
//var confInd = draw_confInd(canvas_height, conf_indWidth, conf_indHeight, col_black, conf_pos);
var confBar = draw_confBar(canvas_xCenter, canvas_height, conf_barWidth, conf_barHeight,col_confBar, col_white);

//hide the conf stim until its time for conf rating to appear
confBar.confBar.hide();
confBar.confBegin.hide();
confBar.confEnd.hide();

//shuffle conditions - stable or volatile block first
var condNum = 0;
var buckListening = true;
var confListening = false;
var progListening = false;

data_expStart = new Date().getTime();

start_expt();

return this;
};
