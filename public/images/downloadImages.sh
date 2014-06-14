#!/bin/bash
for i in `seq 1 81`
do
	convert "$i.gif" -rotate 90 "$i.gif" 
done