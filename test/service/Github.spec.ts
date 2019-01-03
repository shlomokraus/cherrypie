import { GithubService } from "../../src/service/Github";
import config from "config";
import shortid from "shortid";

describe("Github Service - Integration Tests", () => {

    const { owner, repo, username, password, number, refPrefix } = config.get("github")
    describe.skip("init()", ()=>{

        it.skip("Should reject on not authorized", async () => {
            const github = new GithubService({owner, repo, number});
            expect(github.init()).rejects.toEqual(Error("Not authorized"))
        });

        it("Should load PR after authentication", async () => {
            const github = new GithubService({owner, repo, number});
            await github.init({username, password});

            const pr = github.getPr();
            expect(pr.number===number);
        },10000);

        it.skip("Should load PR for public repo", async () => {
            const github = new GithubService({owner: "probot", repo: "probot.github.io", number:272});
            await github.init();

            const pr = github.getPr();
            expect(pr.number===number);
        });


    });

    describe.skip("After initialized", () => {

        let github; 

        beforeEach(async ()=>{
            github = new GithubService({owner, repo, number, refPrefix });
            await github.init({username, password});
        })

        it("createBranch()", async () => {
            const branchName = shortid.generate();
            const sha = github.getPr().base.sha;
            const result = await github.createBranch(branchName, sha);
            expect(result.ref).toContain(branchName);

            await github.deleteBranch(branchName);
        },10000)
      
        it("getTree()", async () => {
            const sha = github.getPr().base.sha;
            const result = await github.getTree(sha);
            expect(result.sha).toEqual(sha);
        },10000)

        it("getFilesFromTree()", async () => {
            const path = "sample.txt";
            const ref = github.getPr().head.sha;

            const result = await github.getFilesFromTree([path], ref);
            expect(result).toHaveLength(1);
            expect(result[0].path).toEqual("sample.txt");
        })

        it("createBlob()", async () => {
            const content = "Hello World";
            const result = await github.createBlob(content);
           
            expect(result).toHaveProperty("sha");

            const blob = await github.getBlob(result.sha);
            const parsed = new Buffer(blob.content, 'base64');
            expect(parsed.toString("ascii")).toEqual(content);
        },10000)
        
        it("prepareTree() - fetch one and create one", async () => {
            const content = "Hello World";
            const path1 = "sample.txt";
            const path2 = shortid.generate()+".txt";
            const ref = github.getPr().head.ref;

            const result = await github.prepareTree([{path: path1}, {path: path2, content}], ref);
            expect(result).toHaveLength(2);
            expect(result[0].path).toEqual(path1);
            expect(result[1].path).toEqual(path2);
         
        },10000)

        it("createTree()", async () => {
            // Prepare

            // create blob
            const content = "Hello World";
            const path = "new-file.txt";

            const baseSha = github.getPr().head.sha;

            const tree = await github.prepareTree([{path: path, content}], baseSha);

            // Action
            const created = await github.createTree(baseSha, tree);

            // Assert
            expect(created).toHaveProperty("sha");

            const base = await github.getTree(github.getPr().base.sha);
            // Tree is created from base, so it should have same number of files plus our new file
            expect(created.tree.length).toEqual(base.tree.length+1);
         
        },10000)

        it("pushToBranch()", async () => {
            // Prepare
            const content = "Hello World!";
            const path = ".gitignore";
            const branchName = shortid.generate();

            const tree = await github.prepareTree([{path, content}], github.getPr().base.ref);
            // create a new branch to be the base of push
            const sha = github.getPr().base.sha;
            const newBranch = await github.createBranch(branchName, sha);
            const baseSha = newBranch.object.sha;

            // Create commit
            const created = await github.createTree(baseSha, tree);
            const commit = await github.prepareCommit("This is a test commit", created.sha, baseSha)
            
            expect(commit.tree.sha).toEqual(created.sha);
            expect(commit.parents[0].sha).toEqual(baseSha);
            
            // Execute (push)
            const pushed = await github.pushToBranch(commit.sha, branchName);
            
            expect(pushed.object).toHaveProperty("sha");
         
            // Cleanup
            await github.deleteBranch(branchName);
        },10000)
      
        it("createPr()", async () => {
          
            const content = "Hello World!";
            const path = ".gitignore";
            const branchName = shortid.generate();

            const tree = await github.prepareTree([{path, content}], github.getPr().base.ref);
            // create a new branch to be the base of push
            const sha = github.getPr().base.sha;
            const newBranch = await github.createBranch(branchName, sha);
            const baseSha = newBranch.object.sha;

            // Create commit
            const created = await github.createTree(baseSha, tree);
            const commit = await github.prepareCommit("This is a test commit", created.sha, baseSha)
            const pushed = await github.pushToBranch(commit.sha, branchName);

            const pr = await github.createPr({title: "This is a test pr", headBranch: branchName, baseBranch: github.getPr().base.ref});

        },10000)

    })
})