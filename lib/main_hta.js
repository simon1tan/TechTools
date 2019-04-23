// polyfills
String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      	start = 0;
    }

    if (start + search.length > this.length) {
      	return false;
    } else {
      	return this.indexOf(search, start) !== -1;
    }
  };
/////////////////////
var jstree = null
var bDebug = false
var last_clicked = null //used remove bolder
var node_type = null
var fso = new ActiveXObject("Scripting.FileSystemObject")

// clear everything on load
$("#search").val("")
$("#preview").val("")
$("#out").val("")

if(bDebug === false){
	$("#eval").css("display", "none")
}

$("#eval").on("click", function(){
	eval( $("#preview").val() )
})

function readFile(filename){
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;
	var fso = new ActiveXObject("Scripting.FileSystemObject")
	if (fso.fileExists(filename)) {
		s = ''
		try{
			f = fso.GetFile(filename);
			var stream = f.OpenAsTextStream(ForReading, TristateUseDefault)
			while ( !stream.AtEndOfStream  ) {
				s = s + stream.readline() + "\n"
			}
		}catch(e){
			$("#out").val("!! Error reading file, " + filename + '!!')
			return('')
		}finally{
			stream.close()
		}
		return(s)
	} else {
		return(false)
	}
}

function writeFile(filename, text){
	// check if file aready exists

	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;
	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject")
		f = fso.OpenTextFile(filename, ForWriting, true)
		f.Write(text)
	}catch(e){
		$("#out").val("!! Error reading file, " + filename + '!!')
		return('')
	}finally{
		f.Close()
	}
}

function really_go(host, action, remote, cmdline){
	// replace host
	while(action.includes("@")){
		action = action.replace("@", host)
	}

	if(remote){
		if(host === ""){
			log("Remote host must be filled in.")
			blink_element($("#host"))
			return(false)
		}else{
			action = config.remote + " \\\\" + host + " " + action
		}
	}
	debug(action)
	oShell = new ActiveXObject("WScript.shell");
	$('body').addClass('busy')
	try{
		if(cmdline){ // has #, capture commandline output
			oExec = oShell.Exec(action)
			output = ""
			while(!oExec.StdOut.AtEndOfStream){
				output += oExec.StdOut.ReadLine() + "\n"
			}
			while(!oExec.StdErr.AtEndOfStream){
				output += oExec.StdErr.ReadLine() + "\n"
			}
			log("Executing program#: " + action + "\n" +  output)
		}else{
			log("Executing program: " + action)
			bWaitOnReturn = false
			intWindowStyle = 1
			oShell.run(action, intWindowStyle, bWaitOnReturn )
		}

		save_to_history(action)
	}catch(e){
		log("Unable to perform action: " + action + ". Check that the path is correct.")
	}finally{
		$('body').removeClass('busy')
	}
}

function go(hosts, action, remote){
	// if require host but none specified
	hosts = trim_char(hosts.trim(),",") //remove any trailing commas
	if (action.includes("@") && hosts.trim() == ""){
		log("Please enter a host")
		blink_element($("#host"))
		return(false)
	}

	// check to see if command line executable
	cmdline = false
	if (action[0]==="#"){
		action = action.substring(2.-1)
		cmdline = true
	}

	// process single or multiple hosts
	if(action.includes("@")){
		if( hosts.includes(",") ){
			hosts = hosts.split(",")
			$.each(hosts, function(i, host){
				really_go(host.trim(), action, remote, cmdline)
			})
			return(true)
		}
	}

	really_go(hosts.trim(), action, remote, cmdline)
}

function debug(text) {
	if(bDebug){
		log(text)
	}
}

function log(text){ // log to Output
	d = new Date
	$('#out').val(d.toUTCString() + ": " + text + "\n" + $('#out').val() )
}

function show_desc(){
	node = $("#tree").jstree(true).get_selected(true)
	node = node[0]
	s = ""
	if (node.text){
		s += node.text  + "<br>"
	}

	if (node.data.cmd){
		s += "Command: " + node.data.cmd + "<br>"
	}

	if (node.data.param){
		s += "Paramenters: " + node.data.param + "<br>"
	}
	if (node.data.desc){
		s += "Description: " +  node.data.desc + "<br>"
	}

	if (node.data.www){
		s += "Web: <a href=\""+ node.data.www +"\" class=external target=_blank>" + node.data.www + "</a><br>"
	}
	if (node.data.url){
		s += "File: <a href=\""+ node.data.url +"\" class=external target=_blank>" + node.data.url + "</a><br>"
	}
	if (node.data.license){
		s += "License: " + node.data.license + "<br>"
	}

	if(s == ""){
		$("#desc").html("No details to show")
	}else{
		$("#desc").html(s)
	}

}

function show_edit(id, text, parent, cmd, param, desc, www, license, url){
	// clean undefined
	license = (license) ? encode(license) : ''
	url = (url) ? encode(url) : ''
	param = (param) ? encode(param) : ''
	www = (www) ?  encode(www) : ''
	cmd = (cmd) ?  encode(cmd) : ''
	desc = (desc) ?  encode(desc) : ''

	$("#desc").html("<form id=form_tool><input type=hidden id=parent value='" + parent + "'><label>Name:</label><input id=text value='" + text +"'><label>Description:</label><input id=desc1 value='"+ desc +"'><label>Command:</label><input id=cmd value='"+ cmd +"'><label>Parameters:</label><input id=param1 value='"+ param +"'><label>WWW:</label><input id=www value='"+ www +"'><label>License:</label><input id=license value='"+ license +"'><label>URL:</label><input id=url value='"+ url +"'><div><input id=btnCancel type=\"button\" value=Cancel onclick=\"show_desc()\" style=\"width:30%;margin-left:60px\"><input type=button id=btnSave onclick=\"save_edit(this.form)\" value=Save></div></form>")

	$("#text").focus()
	$("#text").select()

	$('#form_tool').dirrty({
		preventLeaving: false
	}).on("dirty", function() {
		$("#btnSave").prop('disabled', false);
	}).on("clean", function() {
		$("#btnSave").prop('disabled', true);
	});
}

function save_edit(f){
	// make sure data is not empty
	if (!$("#form_tool").dirrty("isDirty")) {
		log("No changes to save")
		return(false)
	}

	if( (f.cmd.value === "") || (f.text.value === "")){
		log("Name and Command must be filled in")
		return(false)
	}

	obj = {}
	obj.id = f.parent.value.trim() + "-" + f.text.value.trim()
	obj.text = f.text.value.trim()
	obj.data = {}
	obj.data.cmd = f.cmd.value.trim()
	obj.data.param = f.param1.value.trim()
	obj.data.desc = f.desc1.value.trim()
	obj.data.www = f.www.value.trim()
	obj.data.url = f.url.value.trim()
	obj.data.license = f.license.value.trim()

	// check if text already exists,
	// will always exist if changing other fields and trying to save.
	selected_node = jstree.jstree(true).get_selected(true)
	if(selected_node[0].text !== obj.text ){ // name changed, check to see if any duplicates

		json = jstree.jstree(true).get_json(f.parent.value, {flat:true})
		texts = jsonQ(json).find("text").value()

		if( $.inArray(obj.text, texts ) > -1 ){
			log("Name conflicts with existing node. Must be unique.")
			blink_element($("#text"))
			return(false)
		}
	}

	log("Saved " + obj.text)

	// replace old object
	// node = jstree.jstree(true).get_selected(true);
	selected_node[0].data = obj.data
	jstree.jstree(true).set_text(selected_node[0], obj.text)
	set_id(selected_node[0], obj.id)

	show_desc()
	show_preview(selected_node[0])

	// write to file
	write_category(selected_node[0].parent)
}

function encode(str){
	str = str.replace(/'/igm,"&apos;")
	return (str)
}

function check_duplicate_text(node, match){
	var check = false
	$.each(node.children, function (index, text) {
		n = $("#tree").jstree(true).get_node(text)
		if (n.text === match){
			check = true
			return ( check )
		}
	});
	return(check)
}

function write_category(node_id){
	json = jstree.jstree(true).get_json( node_id, {flat:true} )
	json.shift() // get rid of 1st one which is the parent

	container = []
	$.each(json, function(i, obj){
		new_obj = {}
		new_obj.text = obj.text
		new_obj.cmd = obj.data.cmd
		new_obj.desc = obj.data.desc
		new_obj.www = obj.data.www
		new_obj.license = obj.data.license
		new_obj.url = obj.data.url
		new_obj.param = obj.data.param
		container.push(new_obj)
	})

	filename = "json\\" + node_id.replace(/(.*?)-/,"") + ".json"
	writeFile(filename, JSON.stringify( container ))
	debug("Write tool 1: " + filename)
}

function update_children_ids(new_id){
	// change all children ids to match
	json = jstree.jstree(true).get_json( new_id, {flat:true} )
	if( (json == false) || (json.length < 2)){
		debug("update_children_ids, no children: "+new_id)
		return(false)
	}

	debug("update_children_ids: " + new_id)
	json.shift()
	$.each(json, function(i, node){
		node = jstree.jstree(true).get_node( node.id )
		set_id(node, node.parent +"-"+ node.text )
	})
}

function set_id(node, new_id){
	anchor = new_id + "_anchor"

	$("#" + fix_jquery_selector(node.id) + "_anchor").attr("id", anchor)
	$("#" + fix_jquery_selector(node.id)).attr("aria-labelledby", anchor)
	node.a_attr.id = anchor
	jstree.jstree(true).set_id(node, new_id )
}

function delete_node(node){
	switch(node.type){
		case "0":
			log("Not allowed to delete root")
			break
		case "1":
			answer = confirm('Really delete category?')
			if(answer){
				// remove from settings.json
				index = $.inArray(node.text, config.categories)
				config.categories.splice(index, 1)
				writeFile("settings.json", JSON.stringify( config ) )
				debug("Write File 1: " + "settings.json")

				// delete file
				if(fso.fileExists("json\\" + node.text + ".json")){ // check if file actually exists
					fso.DeleteFile("json\\" + node.text + ".json")
					debug("DeleteFile " + "json\\" + node.text + ".json")
				}

				jstree.jstree('delete_node', node);

				$("#desc").html('')
			}
			break
		case "2":
			answer = confirm('Really delete tool?')
			if(answer){
				jstree.jstree('delete_node', node);

				write_category(node.parent)

				$("#desc").html('')
			}
			break
	}
}

function save_to_history(cmd){
	// save run commands to history so for reuse
	// limit how many commands to save.
	// can't use description because it could be a form. use jstree to get text and cmd
	// skip adding if duplicate of last?? Same text but could be different cmd params

	json = JSON.parse( readFile('json\\history.json') )
	nodes = jstree.jstree("get_selected", true)

	if (json[json.length-1].cmd === nodes[0].data.cmd){
		return(-1)
	}

	//add to lst
	$(".dd_history").append("<a class='dropdown-item ddi-h' href='#'>" + nodes[0].text + "</a>").data()
	$.data(document.body, nodes[0].text, nodes[0].data.cmd)

	obj = { "cmd":nodes[0].data.cmd, "text":nodes[0].text}
	json.push(obj)

	// remove of over max limit
	if (json.length > config.history_max){
		// remove from dropdown
		l = json.length - config.history_max
		for(var i=0; i<l; i++){
			$($('.ddi-h')[0]).remove()
		}

		// remove from file
		json = json.splice(-1 * config.history_max, config.history_max)


	}
	writeFile( "json\\history.json", JSON.stringify(json) )
}

$(document).ready(function(){

	var errors = false
	// size window
	window.moveTo(0,0)
	window.resizeTo(screen.width, screen.height)

	$('#desc').html('') // clear this in case refresh does not clear it

	// Populate quickTools
	if( fso.fileExists("json\\quickTools.json")){
		try{
			json = JSON.parse( readFile('json\\quickTools.json') )
		}catch(e){
			debug("!! Error reading json\\quickTools.json!!")
		}
		$.each(json, function(i, val){
			$(".dd_qt").append("<a class='dropdown-item ddi-qt' href='#'>" + val.text + "</a>").data()
			$.data(document.body, val.text, val.cmd)
			if(val.default){
				$("#quickTools").text( val.text );
				$("#quickTools").val( val.text );
				$.data(document.body, "quickTools", val.cmd)
			}
		})
	}else{
		debug("!! Error reading json\\quickTools.json. Make sure file exists!!")
		errors = true
	}

	// Populate History
	if( fso.fileExists("json\\history.json")){
		try{
			json = JSON.parse( readFile('json\\history.json') )
		}catch(e){
			debug("!! Error reading json\\history.json!!")
		}
		$.each(json, function(i, val){
			$(".dd_history").append("<a class='dropdown-item ddi-h' href='#'>" + val.text + "</a>").data()
			$.data(document.body, val.text, val.cmd)
		})

	}else{
		debug("!! Error reading json\\history.json. Make sure file exists!!")
		errors = true
	}

	// Read settings file
	debug('Reading settings.json')
	if( fso.fileExists( 'settings.json' )){
		try{
			config = JSON.parse( readFile("settings.json") )
		}catch(e){
			$("#out").val("!! Error reading settings.json. Please validate the JSON data!!")
			return(false)
		}
	}else{
		$("#out").val("!! Error reading settings.json. Make sure file exists!!")
		errors = true
	}

	// sort categories
	if (config.sort_categories){
		debug('Sorting categories')
		config.categories = config.categories.quickSort()
	}

	// add categories
	debug('Populating jstree')
	root_id = "0"
	cats = []
	$.each(config.categories, function(i,cat){
		cats.push({
			"id": root_id + "-" + cat,
			"text":cat,
			"type":"1",
			"data":{ "previous_text":cat }, //used to keep track of old name for renaming files
		})

		debug("\t" + 'Reading json\\' + cat + '.json')
		try{
			tools = JSON.parse( readFile('json\\' + cat + '.json') )
		}catch(e){
			log("!! Error reading json\\" + cat + ".json. Please validate the JSON data!!")
			errors = true
			// return(-1)
		}

		// add id and text to tool list
		$.each(tools, function(j, tool){
			if ( tool.cmd ){ //skip. really shouldn't have any
				tools[j].id = root_id + "-" +cat + "-" + tool.text
				tools[j].text = tool.text
				tools[j].type = "2"
				tools[j].data = {"desc": tool.desc, "www": tool.www, "license":tool.license, "url":tool.url, "param":tool.param, "cmd":tool.cmd , "previous_text":tool.text}
			}
		})

		// add tools as child nodes
		cats[i].children = tools
	})

	// debug( JSON.stringify(cats) )


	if(errors){
		log("Loading complete with errors")
	}else{

		$("#out").val('Loading Complete')
	}

	// Sort Tools
	if(config.sort_tools){
		// jQ = jsonQ(cats)
		// cats = jQ.sort('name').jsonQ_root
		jsonQ.settings.sort.caseIgnore=true; //causes toLowerCase error even though toLowerCase exists
		cats = jsonQ(cats).sort('text').jsonQ_root
	}

	jsondata = [{
			"id": root_id,
			"text": "TechTools",
			"type": "0",
			"state":{"opened":true},
			"children":cats,
			"data":{ "disable_close":true }
	}]

	// init jstree
	jstree = $('#tree').jstree({
		'core' : {
			'check_callback' : function (operation, node, node_parent, node_position, more) {
				// log(node.type  + ":" + node_parent.type + ":" + node_position)
				switch(operation){
					case 'rename_node':
						if(node.type === "0"){
							return(false) // don't allow rename root
						}
						return(true) // allow renaming of category & tool
						break
					case 'move_node': // allow dropping only onto categories
						return(node.type === "2" && node_parent.type==='1')
						break
					default: // everything else
						return(true)
				}
		 	}
			, "scroll": true
			// , "initially_open" : [config.default]
			, "dblclick_toggle" : false
			, "multiple" : false
			, "animation" : 0
			// ,'force_text' : true
			// , "themes" : { "stripes" : true }
			, 'data' : jsondata
		}
		, "plugins" : [ "unique", "search", "contextmenu", "types", "dnd" ] //wholerow changes border border, looks really bad
		, 'contextmenu' : {
			"items": function(node) {
				right_click = true
				debug("contextmenu")
				if(node.type==="0"){
					return{
						"Create": { // Create Category
							"separator_before": false,
							"separator_after": false,
							"label": "Create",
							"action": function (obj) {
								node_type = "1"
								duplicate = true
								i = 0
								while(duplicate){
									text = "New Category"
									if (i>0){
										text += " " + i
									}
									if (check_duplicate_text(node, text) == true){
										i++
									}else{
										duplicate = false

										new_obj = {"id":node.id+"-"+text, "text": text, "type":"1", "parent":"0", "children":[], data:{ "previous_text":text } }
										jstree.jstree("create_node", node.id, new_obj, "first"); // create node under "1"

										// add to config
										config.categories.unshift(text)
										writeFile("settings.json", JSON.stringify( config ) )
										debug("Write File 1: " + "settings.json")
										// debug( stringify(config, { maxLength:500 } ) )

										// create empty file
										debug("Create Empty File: " + new_obj.id + ".json")
										writeFile("json\\" + new_obj.id.replace(/(.*?)-/,"") + ".json", "[]")

										jstree.jstree('edit', new_obj.id, false);
									}
								}
							}
						}
					}
				}else if(node.type==="1"){
					return {
						"Create": { // Create Tool
							"separator_before": false,
							"separator_after": false,
							"label": "Create",
							"action": function (obj) {
								node_type = "2"

								// check that text is not duplicated. search all children
								duplicate = true
								i = 0
								while(duplicate){
									text = "New Tool"
									if (i>0){
										text += " " + i
									}
									if (check_duplicate_text(node, text) == true){
										i++
									}else{
										duplicate = false

										new_obj = {"id":node.id +"-" + text, "text": text, "type":"2", "parent":node.parent, data:{"cmd":text,"desc":"","www":"","license":"","url":"","param":"", "previous_text":text} }
										debug("node.parent " + node.parent)
										jstree.jstree("create_node", node.id, new_obj, "first"); // create node under "1"

										debug("create tool " + node.text)
										write_category(node.id)
										debug("Write File: " + node.id + ".json")
										// jstree.jstree('edit', text, false);
									}
								}
							}
						},
						"Rename": { // Rename category
							"separator_before": false,
							"separator_after": false,
							"label": "Rename",
							"action": function (obj) {
								jstree.jstree('edit', node);

								// see triggered event
							}
						},
						"Delete": { // Delete category
							"separator_before": false,
							"separator_after": false,
							"label": "Delete",
							"action": function (obj) {
								delete_node(node)
							}
						}
					};
				}else{ // 2
					return {
						"Edit": { // Edit Tool
							"separator_before": false,
							"separator_after": false,
							"label": "Edit",
							"action": function (obj) {
								show_edit(node.id, node.text, node.parent, node.data.cmd, node.data.desc, node.data.www, node.data.license, node.data.url)
							}
						},
						"Delete": { // Delete Tool
							"separator_before": false,
							"separator_after": false,
							"label": "Delete",
							"action": function (obj) {
								delete_node(node)
							}
						}
					};
				}
			}
		}
		, 'dnd':{
			'is-draggable': true
			, 'check-while-dragging': true
			, 'drag_selection': false // drag single instead of all selected
		}
		, "types" : {
			"0" : {
				"max_children" : 1
				// , "max_depth" : 0
				// , "valid_children" : ["1"] // prevents creation
				// , "delete_node" : false
			},
			"1" :{
				// "max_children" : 1
				// , "max_depth" : 2
				// , "valid_children" : ["2"]
			},
			"2":{
				// "max_children" : 0
				// , "max_depth" : 0
				// , "create_node" : false
			}
		}
	})

	// click on node
	// jstree.on("select_node.jstree", function (e, data) {
	// });

	jstree.on("create_node.jstree", function(e, data){
		// $(".jstree-clicked").removeClass("jstree-clicked") //remove all other highlighted after creating node!
		debug("create_node.jstree")

		if(data.node.type=="2"){
			show_edit( data.node.id, data.node.text, data.node.parent, data.node.data.cmd, data.node.data.param, data.node.data.desc, data.node.data.www, data.node.data.license, data.node.data.url )
		}

		// select this
		jstree.jstree(true).select_node(data.node.id)
		jstree.jstree(true).deselect_node(data.node.parent)
	})

	jstree.on('keydown.jstree', '.jstree-anchor', function (e) {
		// modified jstree.js to highlight and select node, then show description
		if(e.keyCode>= 37 && e.keyCode <= 40){
			debug("keydown")
			node = jstree.jstree(true).get_selected(true)
			if(node[0].type==="2"){
				show_desc()
				show_preview(node) //node is changed by show_desc. node global.
			}
		}
	})

	jstree.on("rename_node.jstree", function(e, data){
		debug("rename_node.jstree")

		var node = data.node //$.extend(true, {}, data.node);
		node.text = node.text.trim()

		if(node.text === node.data.previous_text){ // nothing changed
			log("Nothing changed")
			return(false)
		}

		node.text = node.text.trim()
		if(node.type==="0"){
			log("Renaming root is not allowed")
			// jwerty.fire('escape','#tree','body')
			return(false)
		}

		if( node.type ==="1"){  // category
			// update config file and save
			cat_index = $.inArray(node.data.previous_text, config.categories)
			config.categories[cat_index] = node.text
			writeFile("settings.json", JSON.stringify( config ) )
			debug("Update settings.json")
			// debug( stringify( config ) )

			// rename file
			if ( fso.fileExists("json\\" + node.data.previous_text + ".json") ){
				try{
					fso.MoveFile("json\\" + node.data.previous_text + ".json", "json\\" + node.text + ".json")
					debug("Move File:" + "json\\" + node.data.previous_text + ".json, " + "json\\" + node.text + ".json")
				}catch(e){
					log("Failed to rename file: json\\" + node.data.previous_text + ".json")
				}
			}

			set_id(node, node.parent + "-" + node.text )
			node.data.previous_text = node.text

			// change all children ids to match
			update_children_ids(node.text )
		}else if( node.type==="2"){ // tool
			set_id(node, node.parent+'-'+node.text )

			write_category(node.parent)

			show_desc()
			// $('#form').isDirty = true
		}
		jstree.jstree(true).set_text(node, node.text)


		right_click = false

	})

	jstree.on("select_node.jstree", function (e, data) {
		debug("node.id: " + data.node.id)
	})

	// On click, toggle node
	jstree.on('click', '.jstree-anchor', function (e, data) {
		// clear search
		$('#search').val('')

		$('#tree').jstree(true).toggle_node(e.target);
		// jstree.jstree("open_node", e.target)
		var e =  window.event || event;
		var button = e.which || e.button;
		if (button == 3){ // right click
		}else{
			$("#desc").html('')

			// can't use get_node!
			node = $("#tree").jstree(true).get_node($(".jstree-clicked").attr("id"))
			if (node.type === '2' ){ // tool
				show_desc()
				show_preview(node)
				// $("#preview").val( node.data.cmd + " " + $("#param").val())
			}
		}
	})

	jstree.on('dblclick', '.jstree-anchor', function (e) { // a vs td when select_node is clicked
		nodes = jstree.jstree("get_selected", true)
		if(nodes.length > 0 ){
			if(nodes[0].type=="2"){
				show_edit( nodes[0].id, nodes[0].text, nodes[0].parent, nodes[0].data.cmd, nodes[0].data.param, nodes[0].data.desc, nodes[0].data.www, nodes[0].data.license, nodes[0].data.url )
			}
		}
	})

	// Close all other nodes
	jstree.on('open_node.jstree', function (e, data) {
		var nodesToKeepOpen = ['0'];

		// add current node to keep open
		nodesToKeepOpen.push( data.node.id );

		// close all other nodes
		$('.jstree-node').each( function() {
			if( nodesToKeepOpen.indexOf(this.id) === -1 ) {
				$("#tree").jstree().close_node(this.id);
			}
		})
	})

	$(document).on('dnd_stop.vakata', function (e, data) {
		var node = jstree.jstree(true).get_node(data.data.nodes[0]);
		var targetNode = jstree.jstree(true).get_node($(data.event.target));

		// moved to new, update name
		n = node.id.split("-")
		s = ""
		previous_node_text = ""

		for(var i=0; i<2; i++ ){
			s += n[i] + "-"
			if(i==1){
				previous_node_text = n[i]
			}
		}
		jstree.jstree(true).set_id(data.data.nodes[0], node.id.replace(s, node.parent + "-") )
		debug("New ID: "+ node.id)

		// WRITE FILE for previous category and new category
		write_category(targetNode.id)
		write_category( trim_char(s,"-") )

		// debug("Write File:" + targetNode.text + ".json")
		// debug("Write File:" + previous_node_text + ".json")
	})

	$("#run").on("click", function(e, remote){
		remote = (remote || false)

		if($("#preview").val().trim() ===""){
			log("Nothing to run")
			return(false)
		}

		// node = jstree.jstree(true).get_selected(true)[0]
		// if(!node || node.type==="0" || node.type==="1"){
		// 	log("Select a tool first")
		// 	return(false)
		// }

		// check param for #
		param = $("#param").val().trim()
		if(param.includes("#")){
			log("Param should not have #")
			blink_element($("#param"))
			return(false)
		}

		// check host for @
		if($("#host").val().includes("@")){
			log("Host should not have @")
			blink_element($("#host"))
			return(false)
		}

		// params_entered = $("#param").val().split(",")
		params_entered = (param === "") ? [] : param.split(",").map(function(item) {
  			return item.trim();
		}); // this returns 1 if param is empty!

		 // this returns 1 if param is empty!
		params_entered = params_entered.filter(Boolean) // remove empty strings from array

		node = jstree.jstree(true).get_selected(true)[0]
		if(node){
			action = node.data.cmd
			// check for command line output
			action = (action[0]==="#") ? action = action.substring(2.-1) : action
			needed_count = (action.match(/#/g) || []).length // or use param field and split(",")

			if( needed_count > params_entered.length){
				log("Not enough parameters")
				blink_element($("#param"))
				return (false)

			}
		}
		go($('#host').val(), $("#preview").val(), remote)
	})

	$("#remote").on("click", function(e){
		$("#run").trigger("click", true)
	})

	$("#param").on("keyup", function () {
		node = jstree.jstree("get_selected", true)
		show_preview(node[0])
	})

	$("#optimize").on("click", function(e){
		really_go('', config.optimize, '', false)
	})

	// choose quickTools
	$(".ddi-qt").on('click', function(e){
		$("#quickTools").text($(this).text());
		$("#quickTools").val($(this).text());
		$.data(document.body, "quickTools", $.data(document.body, $(this).text()) )

		//execute
		$("#quickTools").trigger("click")
	})

	// run quickTools
	$("#quickTools").on("click", function(){
		go( $("#host").val(), $.data(document.body, "quickTools"), false)
	})

	// choose history
	$(".ddi-h").on('click', function(e){
		//~ $.data(document.body, "history", $.data(document.body, $(this).text()) )
		$.data(document.body, "history", $.data(document.body, e.target.text) )
		//~ console.log(e.target.text)
		$("#preview").val( $.data(document.body, "history") )

	})

	$("#copy").on("click", function(){
		if($("#out").val()!=""){
			copyToClipboard(  document.getElementById("out") )
		}
	})

	// save output
	$("#save_output").on("click", function(){
		if($("#out").val() != ""){
			d = new Date().toLocaleString().replace(/(\/|\:)/g,"_")
			date_string = d.replace(",","")
			filename = window.prompt("Enter filename", "c:\\techtools_" + date_string + ".txt")
			if(filename) {
				filename = filename.trim()
				if (filename.length > 0){
					writeFile(filename, $("#out").val() )
				}
			}
		}
	})

	$("#clear").on("click", function(){
		$("#out").val('')
	})

	// search
	var to = false;
	$('#search').keyup(function () {
		if(to) { clearTimeout(to); }
		to = setTimeout(function () {
			var v = $('#search').val();
			$('#tree').jstree(true).search(v);
		}, 250);
	});


	// loading complete, can clear. If loading failed, this would not run
	// $('#footer').html('')

	$(document).on('click', 'a[href]', function(e) {
		e.preventDefault()

		if( e.target.className === "external" ){
			// debug("openURL")
			openURL(e.target.href)
		}
	})

	// *************** Hotkeys
	jwerty.key('alt+d', function (e){ // delete
		nodes = jstree.jstree(true).get_selected(true)
		delete_node(node[0])
		// return(false)
	})

	jwerty.key('alt+e', function (e){ //edit
		nodes = jstree.jstree(true).get_selected(true)
		if(nodes[0].type==="1"){
			// var inst = $.jstree.reference(data.reference),
			jstree.jstree(true).edit(nodes[0]);
		}else if(nodes[0].type==="2"){
			show_edit( nodes[0].id, nodes[0].text, nodes[0].parent, nodes[0].data.cmd, nodes[0].data.param, nodes[0].data.desc, nodes[0].data.www, nodes[0].data.license, nodes[0].data.url )
		}else{
			log("Edit function not available at this time. Select a tool first.")
		}
		return(false)
	})

	jwerty.key('alt+r', function (e){ //run
		$("#run").trigger("click")
		// return(false)
	})

	jwerty.key('alt+m', function (e){ //run
		$("#remote").trigger("click")
		return(false)
	})

	jwerty.key('alt+o', function (e){ //optimize
		$("#optimize").trigger("click")
		return(false)
	})

	jwerty.key('alt+q', function (e){ //run
		$("#quicktools").trigger("click")
		return(false)
	})

	jwerty.key('alt+s', function (e){ //optimize
		if($("#form_tool").length > 0){
			$("#btnSave").trigger("click")
		}else{
			log("Save function not available at this time. Select a tool first.")
		}	return(false)
	})

	jwerty.key('alt+c', function (e){
		$("#out").val("")
	})

	jwerty.key('esc', function (e){ // escape saving in add and edit tools
		if($("#btnCancel").length > 0){
			$("#btnCancel").trigger("click")
		}
	})

	$(".clearable").each(function() {
		var $inp = $(this).find("input:text"), $cle = $(this).find(".clearable__clear");

		$inp.on("input", function(){
			$cle.toggle(!!this.value);
		});

		$cle.on("touchstart click", function(e) {
			e.preventDefault();
			$inp.val("").trigger("input");
			node = jstree.jstree(true).get_selected(true)
			show_preview(node[0])
		});
	});

})

function show_preview(node){
	debug("show preview")

	if(node){
		if(node.data.cmd == undefined){  // shouldn't happen
			return(false)
		}

		hosts = $("#host").val().trim()
		action = node.data.cmd
		if (action.includes("@") && hosts != ""){
			action.replace(/@/, hosts)
		}

		// replace the front #(capture console output)
		cmdline = false
		if(action[0]==="#"){
			action = action.substring(2.-1)
			cmdline = true
		}

		param = $("#param").val().trim()
		params = (param == "") ? [] : param.split(",")

		for(var i=0; i<params.length; i++){
			if(params[i].trim()){
				action = action.replace("#", params[i])
			}
		}

		// action = action.replace(/\?/g,"#")

		if(cmdline){
			$("#preview").val("#" + action )
		}else{
			$("#preview").val( action )
		}
	}
}
