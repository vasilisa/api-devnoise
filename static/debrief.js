/**********************
 * Domain general code *
 **********************/

// Helper functions

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

/********************
* TASK-GENERAL CODE *
********************/

// Globals defined initially.
var keydownfun = function() {};
var datastring = "";
var questCode  = randomIntFromInterval(100000,999999); // generate subject code to store the personal data not based on the prolific id 
console.log("questCode is " +questCode);
var subjCode = "";
/*************
main code
*************/

//information sheet
var debriefPg     = function() {
	var timestamp = new Date().getTime();
	showpage('debriefing');
	$("#continue").click(function () {
                         finish();
                         saveDets();
                         });

};

//this one is for the information page. mod it to direct to consent, nothing needs to be saved
var saveDets =  function(){
    var timestamp        = new Date().toISOString().substr(0, 19);
		        subjCode = subjCode.concat(study_id);
				subjCode = subjCode.concat("\t", longit_id);
				subjCode = subjCode.concat("\t", questCode);

  $('select').each( function(i, val) {
                     datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                     });

  $('textarea').each( function(i, val) {
                     datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                     });
  	$.ajax( "subjSave", {
  			    type: 'POST',
  					async: false,
  	 		   data: {study_id: study_id,longit_id:longit_id, datastring: datastring, when: timestamp, subjCode:subjCode}
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
	"debriefing"
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
