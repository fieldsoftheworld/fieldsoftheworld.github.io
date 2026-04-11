.PHONY: install dev build clean

install:
	gem install jekyll bundler

dev:
	jekyll serve

build:
	jekyll build

clean:
	rm -rf _site
