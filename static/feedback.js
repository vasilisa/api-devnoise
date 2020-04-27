/**********************
 * Domain general code *
 **********************/

// Helper functions

// function randomIntFromInterval(min,max)
// {
//     return Math.floor(Math.random()*(max-min+1)+min);
// }

/********************
* TASK-GENERAL CODE *
********************/

// Globals defined initially.
var keydownfun   = function() {};
var datafeedback = "";
// var questCode    = randomIntFromInterval(100000,999999);
// console.log("questCode is " +questCode);
// var subjCode = "";
/*************
main code
*************/

//information sheet
var feedbackPg = function() {
	var timestamp = new Date().getTime();
	showpage('feedbacking');
	$("#continue").click(function () {
                         finish();
                         saveFeedback();
                         });

};

//this one is for the information page. mod it to direct to consent, nothing needs to be saved
var saveFeedback =  function(){
    var timestamp = new Date().toISOString().substr(0, 19);
		        subjCode = subjCode.concat(prolific_id);
				subjCode = subjCode.concat("\t", study_id);
				subjCode = subjCode.concat("\t", participant_id);
				subjCode = subjCode.concat("\t", longit_id);
				
$('textarea').each( function(i, val) {
                     datafeedback = datafeedback.concat( "\n", [this.id, this.name, this.value]);
                     });

$.ajax( "feedbackSave", {
  			    type: 'POST',
  					async: false,
  	 		   data: {prolific_id: prolific,study_id:study_id, participant_id:participant_id, longit_id:longit_id, datafeedback: datafeedback, when: timestamp}
         });

   };

 var startTask = function () {

	// window.onbeforeunload = function(){
	// console.log("quitter sub");
  // var endTime = new Date().toISOString().substr(0, 19);
  //   	$.ajax("quitter", {
  //   			type: "POST",
  //   			async: false,
  //   			 data: {workerId: workerId,assignmentId:assignmentId, hitId:hitId, datastring: datastring, when:endTime}
  //   	               });
	// 	alert( "By leaving this page, you opt out of the experiment.  You are forfitting your payment. Please confirm that this is what you meant to do." );
	// 	return "Are you sure you want to leave the experiment?";

 };


var finish = function () {
	window.onbeforeunload = function(){ };

};
/********************
* HTML snippets
********************/
var pages = {};

var showpage = function(pagename) {
	$('body').html( pages[pagename] );
};

var pagenames = [
	"feedbacking"
];


/************************
* CODE FOR INSTRUCTIONS *
************************/

//i need this section or code will break
var Instructions = function( screens ) {
	var that = this,
		currentscreen = "";

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

        if(next === 'debrief'){
		    debriefPg();
		    return false;
        }

		currentscreen = next;
		showpage( next );

		if ( screens.length === 0 ){
		    $('.continue').click(function() {
			that.startTask();
		    });
		} else{
		    $('.continue').click( function() {
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
