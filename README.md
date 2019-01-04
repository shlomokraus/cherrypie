

<p align="center">
  <br />
   <br />
<img width="150" src="https://raw.githubusercontent.com/shlomokraus/cherrypie/next/docs/logo.svg?sanitize=true" />
  <h1>CHERRY PIE</h1>
  <br />
   <br />
   <sup>
   <br />
   <br />
  <h3>A CHROME EXTENSION FOR CRAFTING THE PERFECT PULL REQUEST</h3>
   <br />
    <br />
  </sup>
   
</p>


# CHERRY PIE 

### A CHROME EXTENSION FOR CRAFTING THE PERFECT PULL REQUEST

<p align="left">
<a href="https://chrome.google.com/webstore/detail/cherry-pie/fiaignmlhapejpdfbephokpkjnmnaapo" target="_blank"><img src="https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png" /></a>
</P>

## TL;DR

This extension adds a button to Github's Pull Request page that extracts files from one branch and stage them into a new one. 
That way you can submit PRs with minimum relevant changes, even if you didn't plan ahead. 

### But why? 

Honestly, you’ve worked hard on that feature, but when you opened the pull request you can clearly see it would've made more sense to split it into multiple smaller updates, each with its own PR.

Since your commit history is unreadable, you can't use `git cherry-pick` and wish you could go back in time and turn it into something that plays nicely in `git log`.

Now you can. 

## Background
_Cherry picking_ is a perfect git command which, in a perfect world, allows a perfect programmer to carefully pick her commits and stage them into a new branch, where they can be pulled into master in perfectly organized pieces.

*But we are not perfect, we are developers* 

Though our code is clean, our feature branch’s commits are “WIP” or “fix” or “here’s another try” and essentially - just a whole big mess waiting to be _squashed_.

### If you can't pick, then slice!
_Cherry Pie_ let’s you work your way backwards: Pick any number of _files_ from a branch (instead of _commits_) and move them into a whole new branch. 


That way you can split a long pull request into numerous atomic and clean ones, with descriptive titles. Bugs will be easier to spot, reverts become a breeze and the guy over there doing your CR would be so thankful he’ll bake you a pie. A real one for sure.

### Is this needed?

Pull requests should be small, surgical, keeping only the minimum required updates. But it is easier said than done. [In our team](https://iqoqo.co) we constantly trying to keep PRs small but it can't be done without over-complicating the workflow.

Since cherry-pick is not always possible (as explained before), you need to manually go, create a branch, checkout the requested files and...just skip the whole process goes who got time. 

This extension rose from endless hours of reviewing pull requests where the thought "I wish could just click and split this PR" constantly troubled my restful mind. 

## What's in the name?

You use `cherry-pick` for commits, but when commit history is squashed, it turns into a cherry pie. So - if you `pick` a cherry, you need to `slice` a cherry pie. 

<p align="center"><br /><i>If you can't pick cherries, slice a cherry pie</i><br /><br /><br /></p>



[![Chrome](https://img.shields.io/chrome-web-store/v/fiaignmlhapejpdfbephokpkjnmnaapo.svg)](https://chrome.google.com/webstore/detail/cherry-pie/fiaignmlhapejpdfbephokpkjnmnaapo)
[![License](https://img.shields.io/github/license/shlomokraus/cherrypie.svg)]()
[![CircleCI2](https://img.shields.io/circleci/project/github/shlomokraus/cherrypie/next.svg)]()
[![Greenkeeper badge](https://badges.greenkeeper.io/shlomokraus/cherrypie.svg)](https://greenkeeper.io/) 
