# Screenshot
![screenshot](docs/capture.png)

# Introduction:
TechTools allows computer support technicians to organize, locate, and document the tools they use. IT professionals use many tools and it becomes difficult to keep track of of them all or remember how to use them properly. Most command-line tools take parameters that technicians have to memorize or look up. This tool allows the technican to store the command with proper parameters for future use or have documentation in the description that assists the user in using the tool properly.

# Getting Started:
1. Download zip file form github and extract to desired location
2. Doubleclick on techtools.hta to start. This runs [Microsoft's HTA](https://en.wikipedia.org/wiki/HTML_Application).

# Example on creating a tool
2. Create a "tools" folder to store your executables.
3. Create a "net" folder under "tools".
4. Download [Microsoft's TCPView](https://docs.microsoft.com/en-us/sysinternals/downloads/tcpview) and extract into the "net" folder. Make sure tcpview.exe is in this folder.
5. Right-click on Techtools and click Create Category, name it "Net"
6. Right-click on Net and click Create Tool
7. In the form, fill in the fields: name=TCPView, command=tools/net/tcpview.exe. All other fields are optional.
8. Click Save.
9. Click Run.

# Must Haves
* Download psexec(https://docs.microsoft.com/en-us/sysinternals/downloads/psexec) and extact to a folder that is in the PATH

See Usage Guide for full documentation docs/UserGuide.txt.

# New Features:
New ideas and features are welcome. This is an evolving product and I hope to continue to make it even better. At some point, this tool will most likely be changed to use different technology. HTA worked well since it was able to execute Windows commands easily. It had the ability to call vbscript functions but that has been removed during the rewrite. Use wscript.exe to execute your vbscript or jscript files.

# Reporting Bugs:
Please create bug detailed reports(OS version, IE version, mshta.exe version, detailed description with screenshots) and I will try to solve as time allows. Keep in mind that this runs under Microsoft's old and deprecated HTA technology which has many limitations.

# Pricing:
This tool is free for personal use. For commerical usage, the first year is free so that you can try it out. Any usage beyond the first year is $10 per year per seat. Please note that this is my full time job and $10 is just 2 good burgers. I hope you find this tool useful.

A special thanks goes out to all the project's below:
* [jquery](http://jquery.com), MIT
* [jquery-ui](https://jqueryui.com), MIT
* [jstree](https://www.jstree.com/), MIT
* [jsonQ](https://github.com/s-yadav/jsonQ), MIT
* [json-stringify-pretty-compact](https://github.com/lydell/json-stringify-pretty-compact), MIT
* [bootstrap](https://getbootstrap.com/), MIT
* [popper.js](https://github.com/FezVrasta/popper.js/), MIT
* [gremlins.js](https://github.com/marmelab/gremlins.js), MIT
* [materialize](https://materializecss.com/), MIT
* [save icon](https://thenounproject.com/term/save/9016/), Creative Commons
* [copy icon](https://octicons.github.com), MIT
