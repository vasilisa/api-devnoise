
/**********************
* Domain general code *
**********************/

// Helper functions


function insert_hidden_into_form(findex, name, value ) {
    var form = document.forms[findex];
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value );
    form.appendChild( hiddenField );
}


/********************
* TASK-GENERAL CODE *
********************/

// Globals defined initially.
var keydownfun = function() {};

/*************
main code
*************/


//information sheet
var infoSheet = function() {
	var timestamp = new Date().getTime();
	showpage('c_infosheet');
	$("#continue").click(function () {
                         finish();
                         infoProceed();
                         });

};

//this one is for the information page. mod it to direct to consent, nothing needs to be saved
var infoProceed =  function(){
    giveConsent();
     return false;
   };


//consent form
var giveConsent = function() {
	showpage('c_consentsheet');

//this can be specified in the html itself? the route to exp
	$("#goback").click(function () {
                         finish();
                         infoSheet();
                         });

	$("#noconsent").click(function () {
												 finish();
												 consentNot();
												 });

};


//direct to not given consent page
var consentNot =  function(){
	noThanks();
		return false;
  };


//decide not to give consent
var noThanks = function() {
	var timestamp = new Date().getTime();
	showpage('c_nothanks');
};
//this is where they close the window and return the hit

var startTask = function () {

	window.onbeforeunload = function(){
	console.log("quitter sub");
    	$.ajax("quitter", {
    			type: "POST",
    			async: false,
    			data: {subjectid: subjectid, datastring: datastring}
    	               });
		alert( "By leaving this page, you opt out of the experiment.  You are forfitting your payment. Please confirm that this is what you meant to do." );
		return "Are you sure you want to leave the experiment?";
	};


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
	"c_infosheet",
	"c_consentsheet",
	"c_nothanks"
];


/************************
* CODE FOR INSTRUCTIONS *
************************/

//i need this section or code will break
var Instructions = function( screens ) {
	var that = this,
		currentscreen = "",
		timestamp;

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

        if(next === 'consent'){
		    infoSheet();
		    return false;
        }


		currentscreen = next;
		showpage( next );
		timestamp = new Date().getTime();

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
