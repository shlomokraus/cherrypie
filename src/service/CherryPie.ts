import { GithubService } from "./Github";
import { MessagesService } from "./Messages";

export class CherryPieService {
  public isInit = false;
  constructor(
    private readonly github: GithubService,
    private readonly messages: MessagesService
  ) {}

  static parsePrUrl(url): {owner: string, repo: string, number: number} | undefined {
    let parsed = url.split("/");
    if (parsed[2] !== "github.com") {
      return undefined;
    }
    if (parsed[5] !== "pull") {
      return undefined;
    }
    
    return { owner: parsed[3], repo: parsed[4], number: Number(parsed[6])  };
  };

  async init({
    username,
    password,
    token
  }: {
    username?: string;
    password?: string;
    token?: string;
  }) {
    await this.github.init({ username, password, token });
    this.isInit = true;
  }

  client() {
    return this.github;
  }

  async slice({
    paths,
    sourceBranch,
    targetBranch,
    baseBranch,
    message,
    createPr,
    prTitle,
    prBody,
    removeFilesFromSourcePr
  }: {
    paths: string[];
    sourceBranch: string;
    targetBranch: string;
    baseBranch: string;
    removeFilesFromSourcePr: boolean;
    message?: string;
    createPr?: boolean;
    prTitle?: string;
    prBody?: string;
  }) {
    const baseSha = await this.getBaseSha(
      sourceBranch,
      baseBranch
    );

    const files = paths.map(path => ({ path }));
    // Remove sliced files from current pr
    this.removeFilesFromPr(files, baseSha, removeFilesFromSourcePr, sourceBranch);

    this.messages.print({title: `Verifying branch`, text: `creating ${targetBranch} based on ${baseBranch}`});
    await this.verifyTarget(targetBranch, baseSha);

    // Prepare the blobs
    this.messages.print({title: `Preparing tree`, text: `with ${paths.length} updates from ${sourceBranch} `});
    const blobs = await this.github.prepareTree(files, sourceBranch);

    // Create the tree from all the blobs
    this.messages.print({title: `Creating tree`,text: `based on ${baseSha}`});
    const tree = await this.github.createTree(baseSha, blobs);

    // Prepare the message
    if (!message) {
      message = this.prepareCommitMessage(sourceBranch, paths.length);
    }

    // Create a commit with the tree
    this.messages.print({title: `Preparing commit`, text: `for tree ${tree.sha} from ref ${baseSha}`});
    const commit = await this.github.prepareCommit(message, tree.sha, baseSha);

    // Push the commit to the head ref
    this.messages.print({title: `Updating ref`, text: `${commit.sha} into ${targetBranch} (force: true)`});
    const pushed = await this.github.pushToBranch(commit.sha, targetBranch);

    let pr;
    if(createPr && prTitle){
        this.messages.print({title: `Creating pull request`, text: `from ${targetBranch} into ${baseBranch}`});
        pr = await this.github.createPr({title: prTitle, body: prBody, headBranch: targetBranch, baseBranch });

    } 
    let text =  `into ${pushed.ref}`;
    if(pr){
        text = text + ` and created ${pr.url}`
    }
    this.messages.print(
      {title: `Finished pushing changes`, text}
    );


    return pushed;
  }

  private async verifyTarget(targetBranch, baseSha) {
    let targetSha;

    try {
      const getTarget = await this.github.getBranch(targetBranch);
      targetSha = getTarget.commit.sha;
    } catch (ex) {
      if (ex.message === "Branch not found") {
        const target = await this.github.createBranch(targetBranch, baseSha);
        targetSha = target.object.sha;
      } else {
        throw ex;
      }
    }

    return targetSha;
  }

  private async getBaseSha(sourceBranch, baseBranch) {
    let base;
    let baseSha;

    try {
      base = await this.github.getBranch(baseBranch);
      baseSha = base.commit.sha;
    } catch (ex) {
      if (ex.message === "Branch not found") {
        throw Error(`base branch ${baseBranch} doesn't exists`);
      }
    }

    return baseSha;
  }

  private prepareCommitMessage(sourceBranch, fileCount) {
    return `Adding ${fileCount} files that were sliced from ${sourceBranch}`;
  }

  private async removeFilesFromPr(files, baseSha, removeFilesFromSourcePr, sourceBranch) {
    if (!removeFilesFromSourcePr) {
      return;
    }

    this.messages.print({ title: `removeFilesFromSourcePr `, text: `${removeFilesFromSourcePr}` });
    this.messages.print({ title: `files, sourceBranch, baseSha `, text: `${files} : ${sourceBranch} : ${baseSha}` });

    await this.github.removeFilesFromPR(files, sourceBranch, baseSha);
    this.messages.print({ title: `Removing sliced files from `, text: `${sourceBranch}` });
  }
}
