# do all when i need more
all: push
	echo "finished all"

# push to github
push:
	git add .
	git commit -m "Makefile commit $(shell date)"
	echo "Makefile commit $(shell date)"
	git push origin master
