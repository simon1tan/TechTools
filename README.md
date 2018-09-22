# TechTools
Computer Technician's toolset

Introduction
TechTools allows computer support technicians to organize, find, and use the tools they need to solve a problem. There exists many tools out there and it becomes difficult to keep track of of them. This tool allows technician to manage and organize tools and document how to use the tools. Most command-line tools have switches and take parameters that technicians have to memorize or look up. This tool allows the technican to store the command with proper parameters for future use or have documentation in the description that helps the user use the tool properly. Tools can be added or removed with ease.

TechTools also allows the user to execute the command quickly. Just fill in any parameters that are needed and click the "Run" button. Any tool can configured to take parameters by placing "#" the places where a parameter is required. The "#" are replaced with the parameter. The preview command section shows what the finaly command would like prior to clicking "Run". Clicking on run "Run" executes the command and any output is captured in the Output section. If the you want to change the command and the command template is too rigid, the user can highlight the make changes to the command in the output, highlight the command, and click "Run Highlighted".

While the "Run" button executes commands on the local computer, the "Remote" button allows the user to execute a command on a remote computer. Configure the command field with a "@". The host will fill in that location. You will need psexec(https://docs.microsoft.com/en-us/sysinternals/downloads/psexec) as well as administrative rights to perform this. Be sure to configure the psexec tool's location in settings.json or even replace it with another tool. I store the tool in the Windows folder so that it is global.

The "Optimize" button runs a script of your choice. I have not included a script due to liability reasons and because every envionment is different. The script basically cleans temp files, defrags(back in the days of WinXP), remove old profiles, disables services, etc.

QuickTools shows a list of tools(configurable by editing json/quicktools.json) that can be quickly accessed without having to find them in the tree. These tools might include putty, remote desktop, or vnc. Put your commonly used tools here.

The host field takes hostname or ip address of the destination device. This field can also take a comma-seperated list of. For example, for a list like this hostA, hostB, hostC, the action would .

The parameter field allows the user to enter the needed parameters based on the command template.

The output section logs any output the tool might produce. The user can copy the output or save to file.

Included is a script (json_insert_attribute.rb) to download multiple software quickly. Technicans can store the download url or to share with other users.

A Tool is any executable that you can think up. You can use it to copy files to specific locations. It could also be run a command promopt and keeping the prompt available for further use by using cmd.exe's various options. Be creative.
NOTE:
	By putting "#" in the front of a command, that signifies that the command is DOS command and any output will be shown in the output field. If you need to keep the command open, use somethink like this: cmd.exe /K executable.exe (don't need # in front).

Shortcuts keys are hard coded into the application but can still be changed with ease.:
	- ALT + e, Edit category or tool.
	- ALT + d, Delete a category or tool. Deletions are is permanent.
	- ALT + s, Save edit.
	- ALT + r, Run a tool locally
	- ALT + m, Run a tool remotely
	- ALT + o, Optimize. Run optimize routine
	- ALT + q, Run the selected quick tool
	- ALT + c, Clear output

Software Requirements
	Deveopled and tested on Windows 7. Should work on Windows XP and other versions of Windows that have mshta.exe but not tested.
	Administrative rights needed to execute on remote computers
	A common network share that is accessible

New Features:
	New ideas and features are welcome. This is an evolving product and I hope to continue to make it better. Please create an detailed issue. At some point, this tool will most likely be changed to use different technology. HTA worked well since I was calling functions from vbscript files but that has been removed during the rewrite(may put that back in the future). Right now, you can execute vbscript as individual files.

Adding categories:
	To add new categories, right-click on TechTools, choose create, and give it a name. A new file will be created to store the tools in this category. You can rename and delete the category. Be warned that deletion is permanent.

Adding tools:
	To add a tool, right-click on the category and choose create. An edit form will appear. Use this form to fill in the details of the tool. The name and command are mandatory. The command field is the command that will executed when the "Run" button is clicked. The name must also be unique within same category. Remember to click Save to save the data. Clicking on the tool again will show the description of the tool. Double-clicking on the tool will edit the tool.


Notes:
	The tools that are currently present are just for example. They are real tools but it's better if you add tools that you are more familiar with.
	The config section is a special section where "Run" does not run an executable but pushes configuration files/registry settings/folders to remote computers. If the file ends with .reg. If the setting ends with "\", then this is assumed to be a folder that is to be copied. Otherwise, you can specify a list of files.

Downloading tools:
	The json files may contain direct links to the tools as well as links to websites. You can manually download the tools from the website or use the download tool (download_json.rb) to quickly download multiple tools at once. Also, run a virus scan on the tools to make sure they are safe.

Special JSON characters (	):
	Double quote needs to be replaced with \"
	Backslash needs to be replaced with \\

Psexec:
	Psexec is a tool to run a command on remote computers (see https://docs.microsoft.com/en-us/sysinternals/downloads/psexec).

Reporting Bugs:
	Please create bug detailed reports(OS version, IE version, mshta.exe version, detailed description with screenshots) and I will try to solve. Do note that this runs under Microsoft's HTA technology which has many manu limitations, many of which I may not be able to work around. See Known Bugs.


License:
	This tool is free for personal use. You are welcome to modify the code to fit your needs. Commerical usage costs $5 per year. Please note that this is my full time job.

A special thanks goes out to all the project's below:
	jquery, http://jquery.com, MIT
	jquery-ui, https://jqueryui.com, MIT
	jstree, https://www.jstree.com/, MIT
	jsonQ, https://github.com/s-yadav/jsonQ, MIT
	json-stringify-pretty-compact, https://github.com/lydell/json-stringify-pretty-compact, MIT
	bootstrap, https://getbootstrap.com/docs/4.1/about/license/, MIT
	popper, https://github.com/FezVrasta/popper.js/blob/master/LICENSE.md, MIT
		materialize, https://materializecss.com/, MIT
		font-awesome, https://fontawesome.com, Free version
	save icon, https://thenounproject.com/term/save/9016/, Creative Commons
	copy icon, https://octicons.github.com, MIT
Polyfills
	flexibility, https://github.com/jonathantneal/flexibility, MIT. polyfill to provide flexbox to IE10. must replace display: with -js-display: in CSS. newer than flexie
	flexie, https://github.com/doctyper/flexie, polyfill to provide flexbox to IE
	html5shiv, https://github.com/aFarkas/html5shiv, MIT/GPL2. provides nav, section, and styling for IE6-9
	es5-shim, https://github.com/kriskowal/es5-shim/, provide javascript features
	es6-shim, https://github.com/paulmillr/es6-shim
	Picnic CSS, https://picnicss.com/, MIT, bootstrap alternative
