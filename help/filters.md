# Filters
### Introduction

In order to apply certain rules only on some files or folders it is possible to include or exclude certain folders and files.

In most cases it is advised to apply filters on folders as this makes the filter still effective when adding new files or sub folders. So by default "Show Files" in the Directory select modal is disabled

## Transparent, Exclude and Include state
### Default "Transparent" State
By default every Folder or File will not be effected by a filter represented by a empty circle. So the rule will be executed.

### Exclude Folders and Files
If you like to exclude certain files from rules you should exclude either the file or better the folder where the file is stored or a folder higher in the directory tree.

### Include Folders and Files
Because all rules are NOT filtered by default including makes only sense if a folders higher in the tree is excluded. For Example to apply a rule only to a certain Folder or File you have to exclude your complete Vault and the include the Folder or File you like to be active.

## Filter Hierarchy
Filters can be applied to the complete Vault, rule Folder(s) or a Rule itself. In the filter dialog inherited settings from other Folders or the Vault are displayed as uncolored icons and a more transparent red or green indication background.

### Global Filter
All rules in a Vault can be filtered by the filter settings on top of the settings.
### Rule folders
rules can be organized in Folders. Every Folder can have a own set of filters. It is possible and could make sense to double inherited filters in order to make filters still work when a rule folder is moved later. For maximum flexibility it might be useful to plan the folders and filters hieratically.
### Individual rule
To control a single rule it might be useful to use the rule filters.

## Filter execution
When a rule should be executed all filters are analyses from the file location up to the root folder of the vault. The first include filter flags the rule to be executed. The first exclude filter will hinder the execution.

## Limitations and known Issues

A main problem could arise if a folders which is marked as a include or exclude filter is renamed. Currently the rename or delete process is not supervised! So the filter will no longer work. The filter still exists but will not be effective until the file or folder ist renamed back to the original!