import { GithubService } from "../../src/service/Github";
import config from "config";
import shortid from "shortid";

describe("Github Service - Integration Tests", () => {

    const { owner, repo, username, password, refPrefix, number } = config.get("github")
    describe("init()", ()=>{
        
        // This test is flaky as it sometimes throw "Bad credentials" and other time "Verification Error"
        it.skip("Should reject on not authorized", async () => {
            const github = new GithubService({owner, repo});
            expect(github.init({ username: "test", password: "test"})).rejects.toEqual(Error("Bad credentials"))
        });

        it("Should verify on correct credentials", async () => {
            const github = new GithubService({owner, repo});
            await github.init({username, password});
        });
    });
    
    describe("After initialized", () => {

        let github; 
        let pr;

        beforeEach(async ()=>{
            github = new GithubService({owner, repo, refPrefix });
            await github.init({username, password});
            pr = await github.loadPr(number)
        })

        it("createBranch()", async () => {
            const branchName = shortid.generate();
            const sha = pr.base.sha;
            const result = await github.createBranch(branchName, sha);
            expect(result.ref).toContain(branchName);

            await github.deleteBranch(branchName);
        },10000)
      
        it("getTree()", async () => {
            const sha = pr.base.sha;
            const result = await github.getTree(sha);
            expect(result.sha).toEqual(sha);
        },10000)

        it("getFilesFromTree()", async () => {
            const paths = config.get("test.slice.paths");
            const ref = pr.head.sha;

            const result = await github.getFilesFromTree(paths, ref);
            expect(result).toHaveLength(1);
            expect(result[0].path).toEqual(paths[0]);
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
            const paths = config.get("test.slice.paths");

            const path1 = paths[0];
            const path2 = shortid.generate()+".txt";
            const ref = pr.head.ref;

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

            const baseSha = pr.head.sha;

            const tree = await github.prepareTree([{path: path, content}], baseSha);

            // Action
            const created = await github.createTree(baseSha, tree);

            // Assert
            expect(created).toHaveProperty("sha");

            const base = await github.getTree(pr.base.sha);
            // Tree is created from base, so it should have same number of files plus our new file
            expect(created.tree.length).toEqual(base.tree.length+1);
         
        },10000)

        it("pushToBranch()", async () => {
            // Prepare
            const content = "Hello World!";
            const path = config.get("test.slice.paths")[0];
            const branchName = shortid.generate();

            const tree = await github.prepareTree([{path, content}], pr.base.ref);
            // create a new branch to be the base of push
            const sha = pr.base.sha;
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
            const path = config.get("test.slice.paths")[0];
            const branchName = shortid.generate();

            const tree = await github.prepareTree([{path, content}], pr.base.ref);
            // create a new branch to be the base of push
            const sha = pr.base.sha;
            const newBranch = await github.createBranch(branchName, sha);
            const baseSha = newBranch.object.sha;

            // Create commit
            const created = await github.createTree(baseSha, tree);
            const commit = await github.prepareCommit("This is a test commit", created.sha, baseSha)
            const pushed = await github.pushToBranch(commit.sha, branchName);

            const createdPr = await github.createPr({title: "This is a test pr", headBranch: branchName, baseBranch: pr.base.ref});

            // TODO: verify commits and delete branch
        },10000)

        it.skip("removeFilesFromSourcePr()", async () => {
            const content = "Hello World!";
            const path = ".gitignore";
            await github.removeFilesFromSourcePr([{path, content}], pr.base.ref);
        }, 10000)

    })
})