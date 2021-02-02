# Holo_st 
Checks all ongoing & upcoming [Hololive](https://en.hololive.tv/) streams!

## Using the CLI
### Setup
First, install all dependencies
```bash
$ npm i
```
Then, run the start script.
```bash
$ npm start
```
To install globally, do
```bash
$ npm i -g # You might need administrator/superuser permissions to do this.
```
Then, run
```bash
$ holo_st
```
### Parameters
`-o` - Checks for **ongoing** streams.  
`-u` - Checks for **upcoming** streams.  
`--id` - Checks a specific channel id (Must be from hololive. May be changed later).

#### Example
```bash
$ npm start Shishiro Botan -o
```
This will check all ongoing streams from [Shishiro Botan](https://www.youtube.com/channel/UCUKD-uaobj9jiqB-VXt71mA)'s channel.

## WARNING
* Checking for channels _may_ take a very long time depending on your system, please be
patient while using the module/CLI application.

## Developer Notes
The module and the CLI application has not been heavily optimized and tested.  

There will still be a lot of things that can go wrong when using the CLI application.  
Use with caution.

A lot of features are still being planned.