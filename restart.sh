#!/bin/sh

ps auxw | grep npm | grep -v grep > /dev/null

if [ $? != 0 ]
then
	node ~/YATTO/bin/www > /dev/null
fi