> New blog post! read about Cherry Pie on Medium: [Crafting the perfect Pull Request](https://medium.com/p/crafting-the-perfect-pull-request-699ab321727f?source=email-5fe064c14ada--writer.postDistributed&sk=69de54d5f585a889d96a8b0a886969a2) by Shlomo Kraus


<div align="center">
  <h1>
<img width="200" src="https://raw.githubusercontent.com/shlomokraus/cherrypie/next/assets/logo.svg?sanitize=true" />
      <br />
  
  <br />
CHERRY PIE

</h1>

   <sup>
  <h3>A CHROME EXTENSION FOR CRAFTING THE PERFECT PULL REQUEST</h3>
   <br />
   <br />

</sup>  
    <pre><a href="https://chrome.google.com/webstore/detail/cherry-pie/fiaignmlhapejpdfbephokpkjnmnaapo" target="_blank"><img src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png" /></a></pre>
<br />
<br />

</div>

<h1 align="center"><sub>TL;DR</sub></h1>

This extension adds a button to Github's Pull Request page that extracts files from one branch and stage them into a new one.
That way you can submit PRs with minimum relevant changes, even if you didn't plan ahead.

### But why?

Honestly, you’ve worked hard on that feature, but when you opened the pull request you can clearly see it would've made more sense to split it into multiple smaller updates, each with its own PR.

Since your commit history is unreadable, you can't use `git cherry-pick` and wish you could go back in time and turn it into something that plays nicely in `git log`.

Now you can.


<h1 align="center"><sub>INSTALL & USAGE</sub></h1>

<div align="center">
  <h1>
    <img width="650" src="https://raw.githubusercontent.com/shlomokraus/cherrypie/next/docs/cherry-workflow.gif" />
    <br />
  </h1>
</div>

1. Install the extension from [Chrome store](https://chrome.google.com/webstore/detail/cherry-pie/fiaignmlhapejpdfbephokpkjnmnaapo). 
2. You will see a `Slice` button appears in every pull request files tab. 
3. After selecting files you will notice a purple button appears at the toolbar, clicking it will open Cherry Pie interface as a modal. 
4. You will need to add your credentials, either password or token.
5. Review changes, enter pull request title and click Slice!

<h1 align="center"><sub>BACKGROUND</sub></h1>

_Cherry picking_ is a perfect git command which, in a perfect world, allows a perfect programmer to carefully pick her commits and stage them into a new branch, where they can be pulled into master in perfectly organized pieces.

_But we are not perfect, we are developers_

Though our code is clean, our feature branch’s commits are “WIP” or “fix” or “here’s another try” and essentially - just a whole big mess waiting to be _squashed_.

### If you can't pick, then slice!

_Cherry Pie_ let’s you work your way backwards: Pick any number of _files_ from a branch (instead of _commits_) and move them into a whole new branch.

That way you can split a long pull request into numerous atomic and clean ones, with descriptive titles. Bugs will be easier to spot, reverts become a breeze and the guy over there doing your CR would be so thankful he’ll bake you a pie. A real one for sure.

### Is this needed?

Pull requests should be small, surgical, keeping only the minimum required updates. But it is easier said than done. [In our team](https://iqoqo.co) we constantly trying to keep PRs small but it can't be done without over-complicating the workflow.

Since cherry-pick is not always possible (as explained before), you need to manually go, create a branch, checkout the requested files and...just skip the whole process goes who got time.

This extension rose from endless hours of reviewing pull requests where the thought "I wish could just click and split this PR" constantly troubled my restful mind.

### What's with the name?

You use `cherry-pick` for commits, but when commit history is squashed, it turns into a cherry pie. So - if you `pick` a cherry, you need to `slice` a cherry pie.

<h1 align="center"><sub>DEVELOPMENT & CONTRIBUTION</sub></h1>

Feel free to request and add features through pull requests. If you got this far you know the rules. 

### Running locally
#### Build

```
yarn run build
```
Will compile and build a local version inside `dist` folder. Install the extension by going to chrome extension page and clicking `Load Unpacked` then directing to this folder.

```
yarn run watch
```
Will build the package and also reload it whenever you make a change.  
#### Develop
```
yarn run storybook
```
Storybook is setup for easier development of the views. 

### Testing

This extension uses integration and e2e tests. 

##### E2E

Tests are ran using puppeteer. They load the extension in chroium, checks that it is loaded and injected correctly and tests some basic UX paths. The tests are located in `test/puppeteer`.

##### Integration 

Those tests run against the repo `cherrypie-test`. Configuration is managed with `node-config` and files located in the `config` directory. You should learn how `node-config` works, but essentialy, we have default config which should be override. The file `default.json` contains the non sensitive data needed for tests. 

The sensitive data which is `github.username` and `github.password` must never be commited to the repo. You can either set them using environment variables when running the tests (that's how it is done on circleci), or you can add a `config/local-test.json` file which is merged to default.json when running the tests. This file is ignored by git and used only for local development. 

<p align="center"><br /><i>If you can't pick cherries, slice a cherry pie</i><br /><br /><br /></p>

