# Cherry Pie

[![Greenkeeper badge](https://badges.greenkeeper.io/shlomokraus/cherrypie.svg)](https://greenkeeper.io/) [![CircleCI](https://circleci.com/gh/shlomokraus/cherrypie.svg?style=svg)](https://circleci.com/gh/shlomokraus/cherrypie)

<p align="center">
<i>If you can't pick cherries, slice a cherry pie</i>
</p>

>A Chrome extension for easily moving changes from one pull request to another

## TL;DR

This extension adds a button to Github's Pull Request page that allows you to extract files from one branch and stage them into another one. It even opens a new pull request for that branch, free of charge.

## Introduction 

Honestly, you’ve worked hard on that feature, but when you opened the pull request you can clearly see it would have make more sense to split it into multiple smaller updates, each with its own PR.

Since your commit history is unreadable, you can't use `git cherry-pick` and wish you could go back in time and turn it into something that plays nicely in `git log`.

Now you can. 

## Background
_Cherry picking_ is a perfect git command which, in a perfect world, allows a perfect programmer to carefully pick her commits and stage them into a new branch, where they can be pulled into master in perfectly organized pieces.

*But we are not perfect, we are developers* 

Though our code is clean, our feature branch’s commits are “WIP” or “fix” or “here’s another try” and essentially - just a whole big mess waiting to be _squashed_.

#### If you can't pick, then slice!
_Cherry Pie_ let’s you work your way backwards: Pick any number of _files_ from a branch (instead of _commits_) and move them into a whole new branch. 


That way you can split a long pull request into numerous atomic and clean ones, with descriptive titles. Bugs will be easier to spot, reverts become a breeze and the guy over there doing your CR would be so thankful he’ll bake you a pie. A real one for sure.

## Is this needed?

Pull requests should be small, surgical, keeping only the minimum required updates. But it is easier said than done. [In our team](https://iqoqo.co) we constantly trying to keep PRs small but it can't be done without over-complicating the workflow.

Since cherry-pick is not always possible (as explained before), you need to manually go, create a branch, checkout the requested files and...just skip the whole process goes who got time. 

This extension rose from endless hours of reviewing pull requests where the thought "I wish could just click and split this PR" constantly troubled my restful mind. 

## What's in the name?

> If commits may be picked, files are `sliced`.

You use `cherry-pick` for commits (which are cherries). But when commit history is squashed, it turns into a cherry pie. So if you pick a cherry, you need to `slice` a cherry pie. 

_Cherry Pie - a perfect tool for a less than perfect world._
