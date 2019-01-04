import Octokit from "@octokit/rest";
import { VERIFY_FAILED_EX, MISSING_CREDENTIALS } from "../constants";

export class GithubService {
  readonly octokit: Octokit;
  private readonly owner;
  private readonly repo;
  private readonly refPrefix?;
  private isInit = false;

  constructor(params: {
    owner: string;
    repo: string;
    refPrefix?: string;
  }) {
    this.owner = params.owner;
    this.repo = params.repo;
    this.refPrefix = params.refPrefix;
    this.octokit = new Octokit();
  }

  getIsInit() {
    return this.isInit;
  }

  async init({
    username,
    password, 
    token
  }: { username?: string; password?: string, token?: string} = {}) {
    // Authenticate
    if(token){
        await this.octokit.authenticate({
            type: "token",
            token: token
          });
    } else if (username && password) {
      await this.octokit.authenticate({
        type: "basic",
        username,
        password
      });
    } else {
        throw Error(MISSING_CREDENTIALS);
    }

    // Verify we have access
    const result = await this.verifyAccess();
    if (!result) {
      throw Error(VERIFY_FAILED_EX);
    }

    // Done
    this.isInit = true;
  }

  async verifyAccess() {
    try {
      await this.listBranches();
      return true;
    } catch (ex) {
      if (ex.status === 403) {
        return false;
      }
      throw ex;
    }
  }
  async createBranch(name, sha) {
    const ref = "refs/" + this.getRefFromBranch(name);
    const branch = await this.octokit.git.createRef(this.payload({ ref, sha }));
    return branch.data;
  }

  async deleteBranch(name) {
    const ref = this.getRefFromBranch(name);
    const branch = await this.octokit.git.deleteRef(this.payload({ ref }));
    return branch.data;
  }

  async getBranch(branch) {
    const result = await this.octokit.repos.getBranch(this.payload({ branch }));
    return result.data;
  }

  async listBranches() {
    const branches = await this.octokit.repos.listBranches(this.payload());
    return branches.data;
  }

  async getTree(sha) {
    const tree = await this.octokit.git.getTree(
      this.payload({ tree_sha: sha, recursive: 1 })
    );
    return tree.data;
  }

  async createBlob(content: string) {
    const blob = await this.octokit.git.createBlob(
      this.payload({
        content,
        encoding: "utf-8"
      })
    );
    return blob.data;
  }

  async getBlob(sha: string) {
    const blob = await this.octokit.git.getBlob(
      this.payload({ file_sha: sha })
    );
    return blob.data;
  }

  /**
   * Create a new tree starting from baseSha and added the files in "tree"
   */
  async createTree(
    baseSha,
    blobs: { path: string; mode: string; type: string; sha: string }[]
  ) {
    const created = await this.octokit.git.createTree(
      this.payload({
        base_tree: baseSha,
        tree: blobs as any
      })
    );
    return created.data;
  }

  async getFilesFromTree(paths, ref) {
    const result = await this.getTree(ref);

    if(result.truncated) {
        // TODO: Handle this in a better way
        console.warn("warning: tree exceeded the limit, some files might be created instead of copying");
    }

    const updated = result.tree.filter(file=>{
        return paths.indexOf(file.path)>=0;
    })
    return updated;
  }


  /**
   * Prepare files for a tree by uploading blobs
   */
  async prepareTree(
    files: { path: string; content?: string; }[],
    baseRef: string
  ) {

    // First take existing blobs from tree
    const paths = files.filter(file=>!file.content).map(file=>file.path);
    let blobs = await this.getFilesFromTree(paths, baseRef);
    blobs = blobs.map(({path, mode, type, sha}) => ({path, mode, type, sha}));

     // And add any missing if needed (because they weren't fetched from tree)
     const fetched = blobs.map(blob=>blob.path);
     const missing = paths.filter(path => fetched.indexOf(path)<0);
     for(let i=0; i<missing.length; i++){
        const path = missing[i];
        console.log("Getting file", path);
        try{
            const blob = await this.getFile(path, baseRef);
            blobs.push({path: path, mode: "100644", type: "blob", sha: blob.sha })
        } catch(ex){
            // If file not found then delete it from tree
            console.log(ex.status);
            if(ex.status===404){
                /**
                 * TODO: handle deleted files
                 */
                throw ex;
            } else {
                throw ex;
            }
        }
       
    }

    // Now create new ones if needed
    const create = files.filter(file=>file.content);
    for(let i=0; i<create.length; i++){
        const file = create[i];
        const blob = await this.createBlob(file.content!);
        blobs.push({path: file.path, mode: "100644", type: "blob", sha: blob.sha })
    }

    return blobs;
  }

  /**
   * message - the commit message
   * treeSha - sha to the tree to commit
   * parentsSha - parent of the tree from which it was created
   */
  async prepareCommit(message, treeSha, parentsSha) {
    const commit = await this.octokit.git.createCommit(
      this.payload({
        message: message,
        tree: treeSha,
        parents: [parentsSha]
      })
    );
    return commit.data;
  }

  async createPr({title, headBranch, baseBranch}) {
     const payload = this.payload({head:headBranch, base: baseBranch, title, maintainer_can_modify: true});
    const result = await this.octokit.pulls.create(payload);
    return result.data;
  }

  async pushToBranch(commitSha, branch) {
    const ref = this.getRefFromBranch(branch);
    const payload = this.payload({ sha: commitSha, ref, force: false });
    const push = await this.octokit.git.updateRef(payload);
    return push.data;
  }

  async getFileContent(path: string, ref: string) {
    const result = await this.getFile(path, ref);
    const content = Buffer.from(result.content, "base64").toString();
    return content;
  }

  async getFile(path: string, ref: string) {
    const result = await this.octokit.repos.getContents(
      this.payload({ path, ref })
    );
    return result.data;
  }

  private getRefFromBranch(name) {
    const ref = (this.refPrefix ? this.refPrefix + "/" : "") + name;
    return ref;
  }

  private async loadPr(number) {
    console.log("Loading pr", number);
    const pr = await this.octokit.pulls.get(this.payload({number}));
    console.log("Loading pr result", pr);

    return pr.data;
  }

  private payload(values = {}) {
    const params: any = {
      owner: this.owner,
      repo: this.repo
    };
    return Object.assign(params, values);
  }
}
