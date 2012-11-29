Baza = new Meteor.Collection('baza');
var selected=[];
var nsort=1;
var ssort=-1;
var asort=1;
var fsort=-1;
var rsort=1;
var usort=1;
var isort=1;
var editclick=false;
var resultpage; //number of the result page
var nooft; //all number of rows
var defno=5; //default number of table rows
var maxnoofp; //maximum number of 
var editp;
function isInt(n) {
   return typeof !isNaN(n) && n > 0 && n < (maxnoofp+1) && n%1===0;
} 

if (Meteor.isClient) {
Meteor.subscribe("baza");
	Meteor.startup(function() {
		Session.set("sort", {name:1});
		Session.set("query",{});
		editp=$('.pageno');
	});
	Template.lista_ljudi.osoba = function(){
	//	nooft=Baza.find(Session.get("query"),{sort: Session.get("sort")}).count();
		var items = Baza.find(Session.get("query"),{sort: Session.get("sort")}).fetch();
		return items.slice((Session.get("resultpage")-1)*defno,Session.get("resultpage")*defno );

	}
	Template.tabela.result = function(){
		return resultpage;
	}	
	Template.tabela.noofpages  = function(){
		nooft=Baza.find(Session.get("query"),{sort: Session.get("sort")}).count()
		resultpage=1;
		Session.set("resultpage", resultpage);
		if(! nooft % defno === 0){
				maxnoofp = (nooft-(nooft % defno))/defno +1;
			}else{
				maxnoofp = (nooft-(nooft % defno))/defno;
			}
		return nooft;
	}
	Template.tabela.events = {
		'keyup input.search': function(event){
			var content = event.currentTarget;
			var $content=$(content);
			var l = $content.val();
			if(! l==="")//problematican deo
				Session.set("query", {authorship: new RegExp(l)});
			},
		'click th.idc': function(){
			Session.set("sort", {id: isort});
			isort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click th.namec': function(){
			Session.set("sort", {name: nsort});
			nsort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click th.authorshipc': function(){
			Session.set("sort", {authorship: asort});
			asort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click th.reviewc': function(){
			Session.set("sort", {review: rsort});
			rsort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click th.urlc': function(){
			Session.set("sort", {url: usort});
			usort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click th.statusc': function(){
			Session.set("sort", {status: ssort});
			ssort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click th.featuredc': function(){
			Session.set("sort", {featured: fsort});
			fsort*=-1;
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click input.first': function(event){
			var input = event.currentTarget;
			var $input=$(input);
			editp= $input.parent().find("input.pageno");
			resultpage = 1;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click input.last': function(event){
			var input = event.currentTarget;
			var $input=$(input);
			editp = $input.parent().find("input.pageno");
			resultpage = maxnoofp;
			editp.val(resultpage);
			Session.set("resultpage", resultpage);
		},
		'click input.prev': function(event){
			var input = event.currentTarget;
			var $input=$(input);
			editp = $input.parent().find("input.pageno");
			if(resultpage >1)
				resultpage--;
			Session.set("resultpage", resultpage);
			editp.val(resultpage);
		},
		'click input.next': function(event){
			var input = event.currentTarget;
			var $input=$(input);
			editp = $input.parent().find("input.pageno");
			if(resultpage < maxnoofp){
				resultpage++;
			}
			Session.set("resultpage", resultpage);
			editp.val(resultpage);
		},
		'blur input.pageno': function(event){
			var input = event.currentTarget;
			editp=$(input);
			if(isInt(editp.val())){
				resultpage=editp.val()
			}else{
				editp.val(resultpage);
			}
			Session.set("resultpage", resultpage);

		}
	};

	Template.edit.events = {
		'click input.edit': function(){
			editclick=true;
			$(function(){
				$("#dialog-modal").dialog({
					height:140,
					modal:true
				});
			});
			Session.set("showeditdialog", true);
		}
	}
	Template.tabela.showeditdialog = function () {
		return Session.get("showeditdialog");
	};
	Template.info.events = {
		'blur input.name' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			//var old = this.name;
			//if(selected.length ===1 && editclick && selected.indexOf(this._id)>-1){
			//$(document).keyup(function(e) {
			//	if (! e.keyCode == 27) { 
					Baza.update(this._id,{$set : { name: $input.val()}}) 
			//	}else {
			//		$input.val(this.name);
			//	}
			//});
			//}else if(selected.length >1 && editclick)
			},
		'blur input.authorship' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			Baza.update(this._id,{$set : { authorship: $input.val()}});
			},
		'blur input.review' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			Baza.update(this._id,{$set : { review: $input.val()}});
			},
		'blur input.url' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			Baza.update(this._id,{$set : { url: $input.val()}});
			},
		'change input.checks' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			Baza.update(this._id,{$set : { status: $input.is(':checked')}});
		},
		'change input.checkf' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			Baza.update(this._id,{$set : { featured: $input.is(':checked')}});
		},
		'change input.checkcheck' : function (event){
			var input = event.currentTarget;
			var $input=$(input);
			var row = $(input).parent().parent();
			var boja='';
			if(input.checked){
				selected.push(this._id);
				boja='pink';
			}
			if(! input.checked){	
				selected.splice(selected.indexOf(this._id),1);
				boja='whiteSmoke';
			}
			row.css('background-color', boja);
		}
	}

	Template.info.status_check = function(){
		return this.status ? 'checked="checked"' : '';
	}
	Template.info.featured_check = function(){
		return this.featured ? 'checked="checked"' : '';
	}
	Template.info.selection = function(){
		return selected.indexOf(this._id)>-1;
	}
	Template.info.check_check = function(){
		if(selected.indexOf(this._id)>-1){
			return 'checked="checked"'
		}else{
			return '';
		}
	}
}
if (Meteor.isServer){
	Meteor.publish("baza", function (){
		return Baza.find();
	});
}
