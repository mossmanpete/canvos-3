all: push
	echo "finished all"

push:
	git add .
	git commit -m "Makefile commit $(shell date)"
	git push origin master
