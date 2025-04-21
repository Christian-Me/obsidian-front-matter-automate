# Front Matter Automate
*Titelei Automat*

**This Plugin is an Alpha Version! Best to test on a copy of your vault!**

## What does it do

Applying a set of rules every time a document is opened, closed, moved or renamed

## Features

### Path tags
A core feature is to create a tag to represent the current location (path) of the file. And update it when a file changes location.

### Rules
A set of rule can be defined to create and update front matter properties.
There are a number of pre-build functions available

* Full path and filename
* Full path
* Folder
* Root Folder
* Filename
* Filename with Extension
* add an Alias form full path
* Date (and Time) created
* Date (and Time) modified
* File Size in Bytes
* File Size as Text

## Events

The following events will trigger autogenerate of the path tag and the execution of the rules

- `create` then a file is created
- `rename` a file is renamed or moved
- `active leaf change` when you create or open another file. Folder tags will not be updated!

## JavaScript

You can add your own JavaScript function to be executed each time the event is triggered

***WARNING*** by using scripts you have access to the complete app object = obsidian 

## Changelog

* 0.0.7 Fix double / multiple and empty folder tags, Date and Time functions to use local time instead GMT
* 0.0.2 Fix double / multiple and empty folder tags